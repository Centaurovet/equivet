-- ============================================================
-- 09 — VÍNCULO FATURA ↔ ATENDIMENTO
-- Fatura gerada com um atendimento ativo guarda o local_id dele.
-- Rodar no SQL Editor do Supabase.
-- ============================================================

ALTER TABLE faturas ADD COLUMN IF NOT EXISTS atendimento_local_id TEXT;

CREATE INDEX IF NOT EXISTS idx_faturas_atend
  ON faturas (veterinario_id, atendimento_local_id);
