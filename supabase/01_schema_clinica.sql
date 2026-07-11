-- ============================================================================
-- EQUIVET IA — Schema do Banco de Dados
-- Módulo: EquiVet Clínica
-- Versão: 1.0 — Maio 2026
-- Instruções: Cole este SQL no editor do Supabase (SQL Editor → New query)
--             e clique em RUN. Execute uma seção por vez se preferir.
-- ============================================================================


-- ============================================================================
-- SEÇÃO 1: PERFIS DE USUÁRIO
-- O Supabase já cuida do login (email/senha) na tabela auth.users.
-- Esta tabela "profiles" guarda os dados extras do veterinário.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- ^ mesmo ID do login — as duas tabelas ficam sempre sincronizadas

  nome        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'veterinario'
              CHECK (role IN ('veterinario','proprietario','ferrador','treinador')),
  -- ^ só aceita esses 4 valores, qualquer outro o banco rejeita

  crmv        TEXT,           -- ex: "ES-12345" (só veterinários preenchem)
  telefone    TEXT,
  pix_key     TEXT,           -- chave PIX para cobrança

  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Comentário explicativo para o dashboard do Supabase
COMMENT ON TABLE public.profiles IS 'Dados complementares dos usuários — estende o auth.users do Supabase';

-- Trigger: atualiza "atualizado_em" automaticamente ao editar o registro
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger: cria um perfil vazio automaticamente quando alguém se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'veterinario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- SEÇÃO 2: ANIMAIS
-- Entidade central do sistema — tudo orbita em torno do animal.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.animais (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            TEXT NOT NULL,
  especie         TEXT NOT NULL DEFAULT 'equino',
  raca            TEXT,
  pelagem         TEXT,
  sexo            TEXT CHECK (sexo IN ('macho','femea','castrado')),
  data_nascimento DATE,
  foto_url        TEXT,           -- URL da foto no Supabase Storage

  proprietario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- ^ se o proprietário for deletado, o animal fica mas sem dono (SET NULL)

  criado_por      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  criado_em       TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.animais IS 'Entidade central — cada cavalo é um registro único com histórico completo';

CREATE OR REPLACE TRIGGER trg_animais_updated
  BEFORE UPDATE ON public.animais
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Índice para buscar animais pelo nome (busca rápida no campo de pesquisa)
CREATE INDEX IF NOT EXISTS idx_animais_nome ON public.animais USING gin(to_tsvector('portuguese', nome));


-- ============================================================================
-- SEÇÃO 3: ATENDIMENTOS
-- Migração direta do localStorage ev_atend_v1.
-- Cada consulta salva vira um registro aqui.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.atendimentos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dados principais do atendimento
  data_atendimento DATE NOT NULL DEFAULT CURRENT_DATE,
  paciente_nome   TEXT NOT NULL,    -- nome do animal (campo livre por enquanto)
  proprietario_nome TEXT,           -- nome do proprietário (campo livre por enquanto)
  animal_id       UUID REFERENCES public.animais(id) ON DELETE SET NULL,
  -- ^ quando você cadastrar o animal no sistema, pode linkar aqui

  -- Queixa e modo de exame
  queixa          TEXT NOT NULL,    -- ex: "colica", "claudic", "respir"...
  modo_exame      TEXT DEFAULT 'focado' CHECK (modo_exame IN ('focado','completo')),

  -- Dados clínicos (guardados como JSON flexível — mesma estrutura do app)
  anamnese        JSONB,
  -- ex: {"inicio":"2h","evolucao":"progressiva","alimentacao":"feno","obs":""}

  exame_geral     JSONB,
  -- ex: {"fc":36,"fr":12,"temp":37.8,"mucosa":"Rosea umida",...}
  -- só preenchido quando modo_exame = 'completo'

  modulos         JSONB,
  -- dados específicos do módulo (cólica, claudicação, etc.)

  prontuario_texto TEXT,
  -- texto completo gerado pelo buildProntuario() — pronto para copiar/imprimir

  diagnostico_ia  TEXT,
  -- resposta do Claude quando você integrar o botão "Consultar IA" (futuro)

  -- Rastreabilidade
  veterinario_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  criado_em       TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.atendimentos IS 'Histórico clínico — migração do localStorage ev_atend_v1. JSONB preserva estrutura original do app.';

CREATE OR REPLACE TRIGGER trg_atendimentos_updated
  BEFORE UPDATE ON public.atendimentos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Índices para as buscas mais comuns
CREATE INDEX IF NOT EXISTS idx_atend_animal_id    ON public.atendimentos(animal_id);
CREATE INDEX IF NOT EXISTS idx_atend_veterinario  ON public.atendimentos(veterinario_id);
CREATE INDEX IF NOT EXISTS idx_atend_data         ON public.atendimentos(data_atendimento DESC);
CREATE INDEX IF NOT EXISTS idx_atend_paciente_nome ON public.atendimentos(paciente_nome);


-- ============================================================================
-- SEÇÃO 4: PRESCRIÇÕES BASE
-- Migração de ev_custom_v5 (customizadas) e ev_extra_v5 (extras criadas pelo usuário).
-- As 6 prescrições BASE do sistema ficam com "sistema = true".
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.prescricoes_base (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT NOT NULL,
  categoria   TEXT,             -- ex: "Ortopedia", "Gastroenterologia"
  icon        TEXT,             -- emoji do ícone
  queixas     TEXT[],           -- ex: {"claudic","colica"} — array de strings
  template    TEXT NOT NULL,    -- texto completo da prescrição com [CAMPOS]

  -- Origem
  sistema     BOOLEAN DEFAULT FALSE,
  -- ^ TRUE = prescrição padrão do EquiVet (as 6 bases)
  -- ^ FALSE = criada pelo veterinário

  publica     BOOLEAN DEFAULT FALSE,
  -- ^ TRUE = visível para todos os veterinários do sistema (futuro marketplace)

  criado_por  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.prescricoes_base IS 'Catálogo de prescrições — migração de ev_custom_v5 e ev_extra_v5. sistema=true para as 6 bases originais.';

CREATE OR REPLACE TRIGGER trg_prescricoes_updated
  BEFORE UPDATE ON public.prescricoes_base
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================================
-- SEÇÃO 5: DADOS INICIAIS
-- As 6 prescrições base do EquiVet Clínica, inseridas como sistema=true.
-- ============================================================================

INSERT INTO public.prescricoes_base (titulo, categoria, icon, queixas, sistema, template) VALUES
(
  'Laminite Aguda', 'Ortopedia', '🦵', ARRAY['claudic'], TRUE,
  'PRESCRICAO VETERINARIA

Paciente: [NOME DO ANIMAL]
Proprietario: [NOME DO PROPRIETARIO]
Data: [DATA]

DIAGNOSTICO: Laminite Aguda

MEDICAMENTOS:
1. Fenilbutazona 1g/comprimido
   Dose: 4,4 mg/kg VO, 2x/dia por 5 dias

2. Omeprazol equino 2,28 g
   Dose: 1 sache VO, 1x/dia por 7 dias
   (protecao gastrica durante AINE)

3. DMSO gel
   Aplicar nas muralhas dos cascos 2x/dia por 7 dias

SUPORTE:
- Baia com cama funda de areia
- Gelo nas muralhas 20 min, 3x/dia por 3 dias
- Casqueamento corretivo em 48-72h
- Radiografia de navicular indicada

Dr. Ricardo | CRMV-[UF] [No]'
),
(
  'Colica Espamodica', 'Gastroenterologia', '🫁', ARRAY['colica'], TRUE,
  'PRESCRICAO VETERINARIA

Paciente: [NOME DO ANIMAL]
Proprietario: [NOME DO PROPRIETARIO]
Data: [DATA]

DIAGNOSTICO: Colica Espamodica

TRATAMENTO EM CAMPO:
- Dipirona sodica 50% - 30 mL IV lento
- Buscopan - 20 mL IV lento
- Flunixina meglumina 50 mg/mL - 1,1 mg/kg IV

POS-ATENDIMENTO:
1. Dipirona oral 500 mg/mL - 20 mL VO a cada 8h, ate 3 dias
2. Probiotico equino - 1 sache/dia VO por 7 dias

OBSERVACOES:
- Jejum por 2h apos melhora
- Ligar imediatamente se dor nao cede em 1h

Dr. Ricardo | CRMV-[UF] [No]'
),
(
  'Hernia Umbilical', 'Cirurgia', '🐴', ARRAY[]::TEXT[], TRUE,
  'PRESCRICAO VETERINARIA

Paciente: [NOME DO ANIMAL]
Proprietario: [NOME DO PROPRIETARIO]
Data: [DATA]

DIAGNOSTICO: Hernia Umbilical nao complicada

PRE-PROCEDIMENTO:
1. Xilazina 10% - 0,5-1 mg/kg IM
2. Lidocaina 2% - infiltracao local

POS-PROCEDIMENTO:
1. Penicilina G Benzatina 300.000 UI/mL - 22.000 UI/kg IM, dose unica
2. Flunixina meglumina 50 mg/mL - 1,1 mg/kg IM, 1x/dia por 3 dias

CUIDADOS:
- Inspecionar anel diariamente
- Queda espontanea em 7-15 dias
- Alerta: febre, dor intensa, odor fetido

Dr. Ricardo | CRMV-[UF] [No]'
),
(
  'Leptospirose Equina', 'Infectologia', '🔬', ARRAY[]::TEXT[], TRUE,
  'PRESCRICAO VETERINARIA

Paciente: [NOME DO ANIMAL]
Proprietario: [NOME DO PROPRIETARIO]
Data: [DATA]

DIAGNOSTICO: Leptospirose Equina (sorovar [ICTEROHAEMORRHAGIAE / outro])

TRATAMENTO:
1. Penicilina G Procaina 300.000 UI/mL - 22.000 UI/kg IM, 2x/dia por 7 dias
OU
1. Oxitetraciclina 200 mg/mL - 6,6 mg/kg IV lento em SF 0,9%, 1x/dia por 5 dias

SUPORTE:
2. Ringer com Lactato - 10-20 L IV/dia por 3 dias
3. Flunixina meglumina - 1,1 mg/kg IV 1x/dia por 3 dias
4. Vitamina B12 - 1 mL/100kg IM, 3x/semana por 2 semanas

MANEJO DO PLANTEL:
- Vacinar com Lexington 8 (D0, D28, reforco anual)
- Controle de roedores e fontes dagua

Dr. Ricardo | CRMV-[UF] [No]'
),
(
  'Ferida / Laceracao', 'Cirurgia', '🩹', ARRAY['dermato'], TRUE,
  'PRESCRICAO VETERINARIA

Paciente: [NOME DO ANIMAL]
Proprietario: [NOME DO PROPRIETARIO]
Data: [DATA]

DIAGNOSTICO: Laceracao - [LOCALIZACAO]

TRATAMENTO EM CAMPO:
- Limpeza com SF 0,9%
- Desbridamento
- Sutura: [sim/nao] - [tipo]

MEDICAMENTOS:
1. Penicilina G Benzatina - 22.000 UI/kg IM a cada 48h por 3 aplicacoes
2. Flunixina meglumina - 1,1 mg/kg IM 1x/dia por 5 dias
3. Spray cicatrizante - 2x/dia apos limpeza

CURATIVO: Clorexidina 0,2% 1x/dia, oclusivo trocado diariamente
SORO ANTITETANICO: [APLICADO / APLICAR - 5.000 UI IM]

Dr. Ricardo | CRMV-[UF] [No]'
),
(
  'Conjuntivite / Uveite', 'Oftalmologia', '👁️', ARRAY['oftalmo'], TRUE,
  'PRESCRICAO VETERINARIA

Paciente: [NOME DO ANIMAL]
Proprietario: [NOME DO PROPRIETARIO]
Data: [DATA]

DIAGNOSTICO: [Conjuntivite Bacteriana / Uveite Equina Recorrente]

MEDICAMENTOS OCULARES:
1. Colirio Neomicina + Polimixina B + Dexametasona
   2 gotas, 3x/dia por 7 dias (somente se ulcera descartada)
2. Atropina 1% colirio - 1 gota, 2x/dia por 5 dias (somente em uveite)

SISTEMICO:
3. Flunixina meglumina - 1,1 mg/kg IM 1x/dia por 5 dias

CUIDADOS:
- Manter em local sombreado
- Nao usar corticoide sem descartar ulcera

Dr. Ricardo | CRMV-[UF] [No]'
)
ON CONFLICT DO NOTHING;


-- ============================================================================
-- SEÇÃO 6: SEGURANÇA (Row Level Security)
-- RLS garante que cada veterinário veja APENAS os seus dados.
-- Essencial antes de colocar em produção.
-- ============================================================================

-- Ativa RLS em todas as tabelas
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animais          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendimentos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescricoes_base ENABLE ROW LEVEL SECURITY;

-- PROFILES: cada usuário vê e edita apenas o próprio perfil
CREATE POLICY "perfil_proprio" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- ANIMAIS: veterinário vê animais que criou ou que atendeu
CREATE POLICY "animais_do_vet" ON public.animais
  FOR ALL USING (auth.uid() = criado_por);

-- ATENDIMENTOS: veterinário vê apenas seus atendimentos
CREATE POLICY "atendimentos_do_vet" ON public.atendimentos
  FOR ALL USING (auth.uid() = veterinario_id);

-- PRESCRIÇÕES: vê as próprias + as do sistema (sistema=true)
CREATE POLICY "prescricoes_proprias_e_sistema" ON public.prescricoes_base
  FOR SELECT USING (auth.uid() = criado_por OR sistema = TRUE);

CREATE POLICY "prescricoes_inserir" ON public.prescricoes_base
  FOR INSERT WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "prescricoes_editar" ON public.prescricoes_base
  FOR UPDATE USING (auth.uid() = criado_por AND sistema = FALSE);

CREATE POLICY "prescricoes_deletar" ON public.prescricoes_base
  FOR DELETE USING (auth.uid() = criado_por AND sistema = FALSE);


-- ============================================================================
-- FIM DO SCRIPT
-- Próximo passo: rodar o script de migração do localStorage (02_migracao.js)
-- ============================================================================
