-- ============================================================================
-- EQUIVET IA — Patch de Segurança
-- Versão: 1.0 — Julho 2026
-- Instruções: Cole no SQL Editor do Supabase e clique em RUN.
-- Corrige 2 vulnerabilidades encontradas na auditoria de segurança:
--   1. Tabela "literatura" sem RLS — qualquer pessoa com a publishable key
--      (que está no HTML público) podia baixar os 3.185 chunks dos livros
--      via REST (/rest/v1/literatura). Direitos autorais + base RAG exposta.
--   2. INSERT em "prescricoes_base" permitia sistema=TRUE — um usuário
--      malicioso podia injetar prescrição falsa visível para TODOS os vets.
-- ============================================================================


-- ============================================================================
-- FIX 1: Trancar a tabela "literatura" para acesso anônimo/autenticado.
-- O backend Railway usa a SERVICE KEY, que ignora RLS — o RAG continua
-- funcionando normalmente. Ativar RLS SEM criar policies = ninguém com a
-- publishable key consegue ler nada.
-- ============================================================================

ALTER TABLE public.literatura ENABLE ROW LEVEL SECURITY;

-- Cinto e suspensório: revoga privilégios diretos dos roles públicos
REVOKE ALL ON public.literatura FROM anon, authenticated;

-- A função match_documents roda como o role de quem chama (LANGUAGE sql,
-- sem SECURITY DEFINER) — com RLS ativo, anon/authenticated recebem 0 rows.
-- Ainda assim, revogamos o EXECUTE para bloquear na porta:
REVOKE EXECUTE ON FUNCTION public.match_documents(vector, int) FROM anon, authenticated;


-- ============================================================================
-- FIX 2: Impedir INSERT com sistema=TRUE ou publica=TRUE em prescricoes_base.
-- A policy antiga só checava criado_por. A nova exige que prescrições criadas
-- por usuários nasçam como sistema=FALSE e publica=FALSE.
-- ============================================================================

DROP POLICY IF EXISTS "prescricoes_inserir" ON public.prescricoes_base;

CREATE POLICY "prescricoes_inserir" ON public.prescricoes_base
  FOR INSERT WITH CHECK (
    auth.uid() = criado_por
    AND sistema = FALSE
    AND publica = FALSE
  );

-- Endurece também o UPDATE: além de só editar as próprias (não-sistema),
-- garante que a linha EDITADA não possa virar sistema=TRUE nem publica=TRUE.
DROP POLICY IF EXISTS "prescricoes_editar" ON public.prescricoes_base;

CREATE POLICY "prescricoes_editar" ON public.prescricoes_base
  FOR UPDATE
  USING (auth.uid() = criado_por AND sistema = FALSE)
  WITH CHECK (
    auth.uid() = criado_por
    AND sistema = FALSE
    AND publica = FALSE
  );


-- ============================================================================
-- VERIFICAÇÃO (rode após o patch)
-- ============================================================================

-- Deve mostrar rowsecurity = true para literatura:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Deve listar as policies novas de prescricoes_base:
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'prescricoes_base';

-- ============================================================================
-- TESTE FINAL (no console do navegador em equivet-clinica.html, SEM login):
--   fetch('https://lbtmdrhbhwvrytttevyw.supabase.co/rest/v1/literatura?select=chunk_id&limit=1',
--     {headers:{apikey:'sb_publishable_w2ePaCDxExkCk4hKiszgyA_oQ6_rZt6'}})
--     .then(r=>r.json()).then(console.log)
-- Resultado esperado: [] (array vazio) — antes do patch retornava um chunk.
-- ============================================================================
