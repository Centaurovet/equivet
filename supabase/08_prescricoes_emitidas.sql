-- ============================================================
-- 08 — PRESCRIÇÕES EMITIDAS
-- Registro do que foi efetivamente prescrito (documento final),
-- vinculado a um atendimento (atendimento_local_id) ou avulso.
-- Padrão offline-first: local_id vem do app; sync no login.
-- Rodar no SQL Editor do Supabase (projeto lbtmdrhbhwvrytttevyw).
-- ============================================================

CREATE TABLE IF NOT EXISTS prescricoes_emitidas (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veterinario_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_id              TEXT NOT NULL,
  atendimento_local_id  TEXT,              -- NULL = emissão avulsa
  paciente_nome         TEXT NOT NULL DEFAULT '-',
  proprietario_nome     TEXT,
  diagnostico_titulo    TEXT,              -- título do protocolo usado (ex.: "Cólica")
  texto                 TEXT NOT NULL,     -- documento final, como emitido
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_presc_emit_vet_local
  ON prescricoes_emitidas (veterinario_id, local_id);

CREATE INDEX IF NOT EXISTS idx_presc_emit_atend
  ON prescricoes_emitidas (veterinario_id, atendimento_local_id);

-- RLS: cada veterinário só enxerga as próprias emissões
ALTER TABLE prescricoes_emitidas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS presc_emit_select ON prescricoes_emitidas;
CREATE POLICY presc_emit_select ON prescricoes_emitidas
  FOR SELECT USING (auth.uid() = veterinario_id);

DROP POLICY IF EXISTS presc_emit_insert ON prescricoes_emitidas;
CREATE POLICY presc_emit_insert ON prescricoes_emitidas
  FOR INSERT WITH CHECK (auth.uid() = veterinario_id);

DROP POLICY IF EXISTS presc_emit_update ON prescricoes_emitidas;
CREATE POLICY presc_emit_update ON prescricoes_emitidas
  FOR UPDATE USING (auth.uid() = veterinario_id);

DROP POLICY IF EXISTS presc_emit_delete ON prescricoes_emitidas;
CREATE POLICY presc_emit_delete ON prescricoes_emitidas
  FOR DELETE USING (auth.uid() = veterinario_id);
