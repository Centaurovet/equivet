-- ============================================================================
-- EQUIVET IA — Patch de Schema
-- Módulo: Limite de consultas de IA (free 3/48h · premium ilimitado)
-- Versão: 1.0 — Julho 2026
-- Instruções: Cole no SQL Editor do Supabase e RUN.
-- ============================================================================

-- ── 1. Flag de plano no perfil ──────────────────────────────────────────────
-- premium = TRUE → consultas de IA ilimitadas. FALSE (padrão) → limite free.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.premium IS 'TRUE = plano Premium (IA ilimitada); FALSE = free (limite por janela).';

-- ── 2. Registro de consumo de IA ────────────────────────────────────────────
-- Uma linha por chamada de IA BEM-SUCEDIDA (Literatura, Análise de sangue, PDF).
-- O backend conta as linhas da janela de 48h para aplicar o limite do plano free.
CREATE TABLE IF NOT EXISTS public.consumo_ia (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint   TEXT NOT NULL,            -- 'literatura' | 'analisar-sangue' | 'importar-pdf-lab'
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.consumo_ia IS 'Log de consultas de IA por usuário — base do limite free (3 a cada 48h).';

CREATE INDEX IF NOT EXISTS idx_consumo_user_time ON public.consumo_ia(user_id, criado_em DESC);

-- RLS: o backend usa a service key (ignora RLS) para inserir/contar.
-- Usuários logados só podem LER o próprio consumo; ninguém insere/edita via API pública.
ALTER TABLE public.consumo_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consumo_proprio_ver" ON public.consumo_ia
  FOR SELECT USING (auth.uid() = user_id);

-- ── 3. Premium para o Ricardo ───────────────────────────────────────────────
-- Ajuste o e-mail se necessário (é o e-mail de login no app, visto no badge).
UPDATE public.profiles
SET premium = TRUE
WHERE id IN (SELECT id FROM auth.users WHERE lower(email) = lower('ricardomidao@gmail.com'));

-- ============================================================================
-- FIM
-- ============================================================================
