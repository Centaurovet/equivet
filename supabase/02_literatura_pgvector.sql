-- ============================================================================
-- EQUIVET IA — Literatura + pgvector
-- Execute no Supabase: SQL Editor → New query → RUN
-- ============================================================================

-- Habilita a extensão pgvector (gratuita no Supabase)
CREATE EXTENSION IF NOT EXISTS vector;


-- ============================================================================
-- TABELA: literatura
-- Armazena os chunks dos livros com embeddings para busca semântica
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.literatura (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_id    TEXT UNIQUE NOT NULL,   -- ex: "smith_00001", "adams_00042"
  book        TEXT NOT NULL,          -- nome do livro
  author      TEXT,
  edition     TEXT,
  language    TEXT,                   -- "en", "es"
  chapter     TEXT,                   -- nome/número do capítulo
  page_start  INT,
  page_end    INT,
  word_count  INT,
  text        TEXT NOT NULL,          -- conteúdo do chunk
  embedding   vector(1024),           -- Voyage AI voyage-3 (1024 dimensões)
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.literatura IS
  'Base de conhecimento do EquiVet IA — chunks dos livros clínicos com embeddings para RAG';


-- ============================================================================
-- ÍNDICE de similaridade (cosseno) para busca vetorial rápida
-- Crie DEPOIS de fazer o upload dos embeddings para ser mais eficiente
-- ============================================================================

-- CREATE INDEX IF NOT EXISTS idx_literatura_embedding
--   ON public.literatura
--   USING ivfflat (embedding vector_cosine_ops)
--   WITH (lists = 100);
-- ^ Descomente e execute após o upload completo dos embeddings


-- ============================================================================
-- FUNÇÃO: buscar_literatura
-- Recebe um embedding de consulta e retorna os chunks mais relevantes
-- Usada pelo botão "Consultar IA" no EquiVet Clínica
-- ============================================================================

CREATE OR REPLACE FUNCTION public.buscar_literatura(
  query_embedding vector(1024),
  match_count     INT DEFAULT 5,
  filter_book     TEXT DEFAULT NULL    -- filtra por livro específico (opcional)
)
RETURNS TABLE (
  chunk_id    TEXT,
  book        TEXT,
  chapter     TEXT,
  page_start  INT,
  page_end    INT,
  text        TEXT,
  similarity  FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    chunk_id,
    book,
    chapter,
    page_start,
    page_end,
    text,
    1 - (embedding <=> query_embedding) AS similarity
  FROM public.literatura
  WHERE
    embedding IS NOT NULL
    AND (filter_book IS NULL OR book ILIKE '%' || filter_book || '%')
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

COMMENT ON FUNCTION public.buscar_literatura IS
  'Busca semântica na literatura clínica. Retorna os chunks mais similares ao embedding da consulta.';


-- ============================================================================
-- SEGURANÇA: literatura é leitura pública para usuários autenticados
-- (os livros são internos — não expostos sem auth)
-- ============================================================================

ALTER TABLE public.literatura ENABLE ROW LEVEL SECURITY;

CREATE POLICY "literatura_leitura_autenticada" ON public.literatura
  FOR SELECT USING (auth.role() = 'authenticated');

-- Apenas o service_role (backend) pode inserir/atualizar
-- O upload é feito via script com a service key, não pelo frontend


-- ============================================================================
-- FIM
-- Próximo passo: rodar o script upload_literatura.py
-- ============================================================================
