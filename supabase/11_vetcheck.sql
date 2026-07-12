-- ============================================================================
-- EQUIVET IA — Patch de Schema
-- Módulo: VetCheck — Exame de compra (laudo + radiografias anexadas)
-- Versão: 1.0 — Julho 2026
-- Instruções: Cole no SQL Editor do Supabase e RUN.
-- ============================================================================

-- Laudo de exame de compra. Fluxo: rascunho capturado no celular (formulário),
-- finalizado no computador (anexo das radiografias em JPG do HD + conclusão +
-- emissão). Pode estar VINCULADO a um atendimento (atendimento_local_id) ou
-- ser AVULSO (NULL). As imagens vivem no bucket 'radiografias' (Storage);
-- aqui fica só a metadata (path + projeção).
CREATE TABLE IF NOT EXISTS public.vetcheck_laudos (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id             TEXT,            -- id gerado no app (dedup/sync offline)
  atendimento_local_id TEXT,            -- FK lógica → atendimentos.local_id; NULL = avulso
  veterinario_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  paciente             JSONB,           -- {nome, idade, sexo, pelagem, registro}
  partes               JSONB,           -- {comprador, vendedor, finalidade, local}
  exame                JSONB,           -- {e1..e5} etapas AAEP (texto por etapa)
  radiografias         JSONB,           -- [ {path, projecao}, ... ] paths no bucket
  conclusao            TEXT,            -- parecer de risco (sem "aprovado/reprovado")
  texto_laudo          TEXT,            -- documento congelado na emissão

  status               TEXT NOT NULL DEFAULT 'rascunho',  -- 'rascunho' | 'emitido'
  emitido_em           TIMESTAMPTZ,
  criado_em            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.vetcheck_laudos IS 'VetCheck — laudos de exame de compra, vinculados a atendimento ou avulsos. Imagens no bucket radiografias.';

CREATE OR REPLACE TRIGGER trg_vetcheck_updated
  BEFORE UPDATE ON public.vetcheck_laudos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_vetcheck_vet   ON public.vetcheck_laudos(veterinario_id);
CREATE INDEX IF NOT EXISTS idx_vetcheck_atend ON public.vetcheck_laudos(atendimento_local_id);
CREATE INDEX IF NOT EXISTS idx_vetcheck_data  ON public.vetcheck_laudos(criado_em DESC);
-- Unicidade por vet+local_id → permite upsert idempotente (celular → computador)
CREATE UNIQUE INDEX IF NOT EXISTS uq_vetcheck_vet_local ON public.vetcheck_laudos(veterinario_id, local_id);

-- RLS: cada veterinário vê e altera apenas os próprios laudos.
ALTER TABLE public.vetcheck_laudos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vetcheck_ver"     ON public.vetcheck_laudos;
DROP POLICY IF EXISTS "vetcheck_inserir" ON public.vetcheck_laudos;
DROP POLICY IF EXISTS "vetcheck_editar"  ON public.vetcheck_laudos;
DROP POLICY IF EXISTS "vetcheck_deletar" ON public.vetcheck_laudos;

CREATE POLICY "vetcheck_ver" ON public.vetcheck_laudos
  FOR SELECT USING (auth.uid() = veterinario_id);
CREATE POLICY "vetcheck_inserir" ON public.vetcheck_laudos
  FOR INSERT WITH CHECK (auth.uid() = veterinario_id);
CREATE POLICY "vetcheck_editar" ON public.vetcheck_laudos
  FOR UPDATE USING (auth.uid() = veterinario_id) WITH CHECK (auth.uid() = veterinario_id);
CREATE POLICY "vetcheck_deletar" ON public.vetcheck_laudos
  FOR DELETE USING (auth.uid() = veterinario_id);

-- ============================================================================
-- STORAGE — bucket privado 'radiografias'
-- Convenção de path: <user_id>/<laudo_local_id>/<arquivo>.jpg
-- A primeira pasta do path É o uid do dono → policies simples por foldername.
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('radiografias', 'radiografias', false, 8388608, ARRAY['image/jpeg','image/png'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "rad_ver"     ON storage.objects;
DROP POLICY IF EXISTS "rad_inserir" ON storage.objects;
DROP POLICY IF EXISTS "rad_editar"  ON storage.objects;
DROP POLICY IF EXISTS "rad_deletar" ON storage.objects;

CREATE POLICY "rad_ver" ON storage.objects
  FOR SELECT USING (bucket_id = 'radiografias' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "rad_inserir" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'radiografias' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "rad_editar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'radiografias' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "rad_deletar" ON storage.objects
  FOR DELETE USING (bucket_id = 'radiografias' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================================
-- FIM
-- ============================================================================
