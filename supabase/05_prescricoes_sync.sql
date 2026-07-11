-- ============================================================================
-- EQUIVET IA — Patch de Schema
-- Módulo: EquiVet Clínica — Sync de protocolos "MEU" (prescricoes_base)
-- Versão: 1.0 — Julho 2026
-- Instruções: Cole no SQL Editor do Supabase e RUN.
-- ============================================================================

-- local_id: id gerado no app (ex.: "cx_1720..." para protocolos MEU,
-- "ovr_3" para edições de templates base). Mesmo padrão de sync dos
-- atendimentos e faturas — permite dedup e restauração em aparelho novo.
ALTER TABLE public.prescricoes_base ADD COLUMN IF NOT EXISTS local_id TEXT;

-- Unicidade por usuário (NULLs não conflitam — linhas do sistema seguem livres).
-- Necessário para o upsert onConflict='criado_por,local_id' do frontend.
CREATE UNIQUE INDEX IF NOT EXISTS uq_prescricoes_criador_local
  ON public.prescricoes_base(criado_por, local_id);

COMMENT ON COLUMN public.prescricoes_base.local_id IS 'ID local do app (cx_* = protocolo MEU; ovr_<n> = edição de template base do sistema)';
