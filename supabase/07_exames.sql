-- ============================================================================
-- EQUIVET IA — Patch de Schema
-- Módulo: EquiVet Lab — Exames (vinculáveis a atendimento ou avulsos)
-- Versão: 1.0 — Julho 2026
-- Instruções: Cole no SQL Editor do Supabase e RUN.
-- ============================================================================

-- Cada exame (hemograma/bioquímico) gerado no EquiVet Lab. Pode estar VINCULADO
-- a um atendimento do Clínica (atendimento_local_id) ou ser AVULSO (NULL).
-- Persistir aqui permite: anexar o resultado dias depois, reabrir no Lab, e
-- exibir o exame dentro do atendimento no Clínica.
CREATE TABLE IF NOT EXISTS public.exames (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id             TEXT,            -- id gerado no Lab (dedup/sync offline)
  atendimento_local_id TEXT,            -- FK lógica → atendimentos.local_id; NULL = avulso
  veterinario_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  paciente_nome        TEXT,
  proprietario_nome    TEXT,
  tipo                 TEXT NOT NULL DEFAULT 'sangue',   -- hemograma/bioquímico
  data_coleta          DATE,

  valores              JSONB,           -- { "hem": 8.5, "glic": 90, ... }
  alteracoes           JSONB,           -- [ {nome, valor, unidade, ref, estado}, ... ]
  laudo_ia             TEXT,            -- laudo gerado por IA (NULL até analisar)
  observacoes          TEXT,

  criado_em            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.exames IS 'Exames do EquiVet Lab — vinculados a um atendimento (atendimento_local_id) ou avulsos (NULL).';

CREATE OR REPLACE TRIGGER trg_exames_updated
  BEFORE UPDATE ON public.exames
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_exames_vet        ON public.exames(veterinario_id);
CREATE INDEX IF NOT EXISTS idx_exames_atend      ON public.exames(atendimento_local_id);
CREATE INDEX IF NOT EXISTS idx_exames_data       ON public.exames(criado_em DESC);
-- Unicidade por vet+local_id → permite upsert idempotente do Lab
CREATE UNIQUE INDEX IF NOT EXISTS uq_exames_vet_local ON public.exames(veterinario_id, local_id);

-- RLS: cada veterinário vê e altera apenas os próprios exames.
ALTER TABLE public.exames ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exames_ver"      ON public.exames;
DROP POLICY IF EXISTS "exames_inserir"  ON public.exames;
DROP POLICY IF EXISTS "exames_editar"   ON public.exames;
DROP POLICY IF EXISTS "exames_deletar"  ON public.exames;

CREATE POLICY "exames_ver" ON public.exames
  FOR SELECT USING (auth.uid() = veterinario_id);
CREATE POLICY "exames_inserir" ON public.exames
  FOR INSERT WITH CHECK (auth.uid() = veterinario_id);
CREATE POLICY "exames_editar" ON public.exames
  FOR UPDATE USING (auth.uid() = veterinario_id) WITH CHECK (auth.uid() = veterinario_id);
CREATE POLICY "exames_deletar" ON public.exames
  FOR DELETE USING (auth.uid() = veterinario_id);

-- ============================================================================
-- FIM
-- ============================================================================
