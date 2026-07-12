-- ============================================================================
-- INSALL & SCOTT — Surgery of the Knee, 6ª ed. (2017)
-- Base de consulta pessoal (Dr. Gabriel — ortopedia). SEPARADA da literatura
-- veterinária para não misturar resultados no RAG do EquiVet.
-- Execute no Supabase: SQL Editor → New query → RUN
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- TABELA: insall
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.insall (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_id    TEXT UNIQUE NOT NULL,   -- ex: "insall_00001"
  livro       TEXT NOT NULL,
  capitulo    TEXT,                   -- ex: "Cap. 14 — Tumors In The Knee"
  secao       TEXT,
  pagina      INT,                    -- página impressa do livro (quando detectada)
  pdf_page    INT,                    -- página do PDF (fallback)
  texto       TEXT NOT NULL,
  embedding   vector(1024),           -- Cohere embed-multilingual-v3.0
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.insall IS
  'Insall & Scott 6ª ed. — chunks para RAG. Consulta pessoal, uso restrito.';

-- ============================================================================
-- FUNÇÃO: match_insall — busca semântica por cosseno
-- ============================================================================
CREATE OR REPLACE FUNCTION public.match_insall(
  query_embedding vector(1024),
  match_count     INT DEFAULT 6
)
RETURNS TABLE (
  chunk_id    TEXT,
  livro       TEXT,
  capitulo    TEXT,
  secao       TEXT,
  pagina      INT,
  pdf_page    INT,
  texto       TEXT,
  similarity  FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    chunk_id, livro, capitulo, secao, pagina, pdf_page, texto,
    1 - (embedding <=> query_embedding) AS similarity
  FROM public.insall
  WHERE embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

COMMENT ON FUNCTION public.match_insall IS
  'Busca semântica no Insall & Scott. Retorna os chunks mais similares ao embedding da consulta.';

-- ============================================================================
-- ÍNDICE vetorial — criar SÓ DEPOIS do upload completo dos embeddings.
-- Descomente e rode após o upload_insall.py terminar.
-- (No free tier o ivfflat pode faltar memória; se der erro, deixe comentado —
--  o sequential scan em ~7 mil linhas ainda é rápido.)
-- ============================================================================
-- CREATE INDEX IF NOT EXISTS idx_insall_embedding
--   ON public.insall
--   USING ivfflat (embedding vector_cosine_ops)
--   WITH (lists = 100);

-- ============================================================================
-- SEGURANÇA (RLS): leitura só para usuários autenticados; escrita só service key.
-- Direitos autorais — nada de download anônimo.
-- ============================================================================
ALTER TABLE public.insall ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insall_leitura_autenticada" ON public.insall;
CREATE POLICY "insall_leitura_autenticada" ON public.insall
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- FIM — próximo passo: rodar literatura/upload_insall.py
-- ============================================================================
