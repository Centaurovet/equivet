-- ============================================================================
-- EQUIVET IA — Patch de Schema
-- Módulo: EquiVet Clínica — Controle de Recebimento (Faturas)
-- Versão: 1.0 — Julho 2026
-- Instruções: Cole este SQL no editor do Supabase (SQL Editor → New query)
--             e clique em RUN.
-- ============================================================================

-- ============================================================================
-- SEÇÃO 1: TABELA FATURAS
-- Cada cobrança gerada na aba Cobrança vira uma fatura com status 'aberta'.
-- O veterinário marca como 'paga' quando receber.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.faturas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  local_id        TEXT,             -- id gerado no app (dedup/sync offline, mesmo padrão dos atendimentos)

  data_emissao    DATE NOT NULL DEFAULT CURRENT_DATE,
  paciente_nome   TEXT NOT NULL,
  proprietario_nome TEXT,

  itens           JSONB,            -- ex: [{"nome":"Visita clinica","valor":300},...]
  mensagem        TEXT,             -- texto completo enviado ao cliente
  valor_total     NUMERIC(10,2) NOT NULL CHECK (valor_total >= 0),

  status          TEXT NOT NULL DEFAULT 'aberta'
                  CHECK (status IN ('aberta','paga')),
  pago_em         TIMESTAMPTZ,      -- preenchido ao marcar como paga

  veterinario_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  criado_em       TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.faturas IS 'Controle de recebimento — fatura fica aberta até o veterinário marcar como paga.';

CREATE OR REPLACE TRIGGER trg_faturas_updated
  BEFORE UPDATE ON public.faturas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_faturas_veterinario ON public.faturas(veterinario_id);
CREATE INDEX IF NOT EXISTS idx_faturas_status      ON public.faturas(veterinario_id, status);
CREATE INDEX IF NOT EXISTS idx_faturas_data        ON public.faturas(data_emissao DESC);

-- ============================================================================
-- SEÇÃO 2: SEGURANÇA (Row Level Security)
-- Cada veterinário vê e altera APENAS as próprias faturas.
-- WITH CHECK impede inserir/mover fatura para outro veterinário.
-- ============================================================================

ALTER TABLE public.faturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faturas_ver" ON public.faturas
  FOR SELECT USING (auth.uid() = veterinario_id);

CREATE POLICY "faturas_inserir" ON public.faturas
  FOR INSERT WITH CHECK (auth.uid() = veterinario_id);

CREATE POLICY "faturas_editar" ON public.faturas
  FOR UPDATE USING (auth.uid() = veterinario_id)
  WITH CHECK (auth.uid() = veterinario_id);

CREATE POLICY "faturas_deletar" ON public.faturas
  FOR DELETE USING (auth.uid() = veterinario_id);

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
