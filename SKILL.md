---
name: equivet-ia
description: Referência técnica completa do projeto EquiVet IA — suíte SaaS de medicina equina (radiografia, Clínica, Lab, Fármacos) do Dr. Ricardo Midão. Use sempre que Ricardo mencionar EquiVet, EquivetIA, app.py, chat_backend, Railway, Supabase, RAG, literatura, Cohere, pgvector, match_documents, /literatura, /analisar-sangue, /importar-pdf-lab, chat.html, centaurovet.com.br, faturas, prescrições, protocolos MEU, EquiVet Lab, hemograma, bioquímico, DICOM, Campo de Treinos, CBIR, limite de IA, premium, ou qualquer componente do sistema de IA veterinária. Carregue antes de qualquer tarefa de código, debugging ou extensão do projeto.
---

# EquiVet IA — Referência Técnica do Projeto

**Autor:** Dr. Ricardo Midão
**Produto:** Suíte SaaS de medicina equina com Claude API (radiografia, clínica, laboratório, farmacologia)
**Base:** `/Volumes/Centauro/EquivetIAOpus4/` + `/Volumes/Centauro/equivet/` + `/Volumes/Centauro/Equivet Lab/`

---

## Arquitetura Geral

| Camada | Tecnologia | Repo / Local | Produção |
|--------|-----------|--------------|----------|
| App radiografia (SaaS) | Streamlit + Claude | `Centaurovet/equivet-radiografia` · `EquivetIAOpus4/app.py` | local/desktop |
| Campo de Treinos | Streamlit privado | `EquivetIAOpus4/campo_treinos/` | local |
| Chat web + backend | FastAPI (Railway) + HTML/JS | `Centaurovet/equivet-chat-backend` + `chat.html` | `centaurovet.com.br/chat.html` |
| EquiVet Clínica | React (CDN) + Supabase | `Centaurovet/equivet` | `centaurovet.com.br/equivet/` |
| EquiVet Lab | HTML + Supabase | `Centaurovet/equivet-lab` | `centaurovet.com.br/equivet-lab/` |
| EquiVet Fármacos | HTML/PWA | `Centaurovet/equivet-farmacos` | `centaurovet.com.br/equivet-farmacos/` |

**Um backend Railway serve todos os apps de IA** (`web-production-2f5bf.up.railway.app`): `/chat`, `/literatura`, `/analisar-sangue`, `/importar-pdf-lab`.

### ⚠️ Mapa de URLs (GitHub Pages) — cada app é repo/Pages separado

| URL | Repo | Conteúdo |
|-----|------|----------|
| `centaurovet.com.br/` | `centaurovet.github.io` | Landing + `chat.html` |
| `centaurovet.com.br/equivet/` | `equivet` | EquiVet Clínica, UTI |
| `centaurovet.com.br/equivet-lab/` | `equivet-lab` | EquiVet Lab (hemograma/bioquímico) |
| `centaurovet.com.br/equivet-farmacos/` | `equivet-farmacos` | EquiVet Fármacos |

HTTPS ativo em todos (A records → 185.199.108–111.153, "Enforce HTTPS" ligado).

---

## Chat Backend (Railway + FastAPI)

**Repo:** `github.com/Centaurovet/equivet-chat-backend` · **URL:** `https://web-production-2f5bf.up.railway.app`
**Deploy:** automático via push no `main`. **Plano Railway:** Hobby (US$ 5/mês — o trial expirou em jul/2026 e foi assinado; sem plano ativo o serviço fica offline e retorna 503).

### Variáveis de Ambiente (Railway)

| Variável | Uso |
|----------|-----|
| `ANTHROPIC_API_KEY` | Claude API |
| `API_SECRET` | Token do frontend para `/chat` |
| `SUPABASE_URL` / `SUPABASE_KEY` | `lbtmdrhbhwvrytttevyw` · service key |
| `COHERE_API_KEY` | Embeddings RAG (embed-multilingual-v3.0) |
| `ALLOWED_ORIGINS` | CORS (ver nota abaixo — origens também estão hardcoded no código) |
| `LIMITE_IA_FREE` / `JANELA_IA_HORAS` | Limite do plano free (default 3 / 48) |
| `RATE_LIMIT` / `RATE_WINDOW_SEC` | Rate limit por IP |
| `WEB_SEARCH` | Liga/desliga web_search no `/chat` |

### Endpoints

| Endpoint | Auth | Modelo | web_search | Uso |
|----------|------|--------|-----------|-----|
| `POST /chat` | `X-API-Key` (API_SECRET) + `profile` | Sonnet/Haiku | sim (max_uses=1) | chat público |
| `POST /literatura` | JWT Supabase | Sonnet | **não** | aba Literatura do Clínica |
| `POST /analisar-sangue` | JWT Supabase | Sonnet | **não** | Lab: interpreta hemograma/bioquímico |
| `POST /importar-pdf-lab` | JWT Supabase | Sonnet | **não** | Lab: extrai valores do PDF do laboratório |

`/literatura`, `/analisar-sangue` e `/importar-pdf-lab` usam o **JWT de sessão do próprio usuário** (`validar_usuario_supabase` → `sb.auth.get_user(token)`), não o `API_SECRET`. Sem `web_search`: focam na literatura indexada (Smith/Adams) para reduzir latência e evitar "palpites genéricos".

### CORS (correção jul/2026)

O preflight `OPTIONS` retornava **404** para `https://centaurovet.com.br` porque o `ALLOWED_ORIGINS` no Railway não cobria o domínio — isso quebrava `/literatura` (Clínica) e os endpoints do Lab **no navegador** (erro "Failed to fetch"). Correção: as origens da família EquiVet são **combinadas no código** (defensivo, funciona mesmo se a env var faltar) + `OPTIONS` em `allow_methods`:
```python
_ORIGENS_PADRAO = ["https://centaurovet.com.br","https://www.centaurovet.com.br","https://centaurovet.github.io"]
# unidas ao ALLOWED_ORIGINS; allow_methods=["POST","GET","OPTIONS"]
```
**Diagnóstico:** `OPTIONS → 404` = origem não permitida; `503` em tudo = Railway sem plano/deploy.

### Auth (nota)
`.strip()` obrigatório em TODOS os env vars — evita whitespace acidental no Railway.

---

## Limite de Consultas de IA (free 3/48h · premium ilimitado) — jul/2026

Controle de custo por usuário. Aplicado aos 3 endpoints com JWT (`/literatura`, `/analisar-sangue`, `/importar-pdf-lab`) — **pool compartilhado**, não 3 de cada. O `/chat` público (anônimo) fica de fora (tem rate limit por IP).

**Backend (`main.py`):**
- `verificar_limite_ia(user)` — roda ANTES do Claude. Premium → libera. Free → conta linhas em `consumo_ia` na janela de `JANELA_IA_HORAS`; se ≥ `LIMITE_IA_FREE` levanta **429**. Fail-open (erro de infra não bloqueia).
- `registrar_consumo_ia(user, endpoint)` — insere UMA linha só APÓS resposta bem-sucedida (falha, ex.: sem crédito Anthropic, NÃO gasta a cota).

**Schema (`supabase/06_limite_ia.sql`):**
- `profiles.premium BOOLEAN DEFAULT FALSE` — TRUE = ilimitado.
- Tabela `consumo_ia(id, user_id→auth.users, endpoint, criado_em)` + índice `(user_id, criado_em DESC)`; RLS: usuário só lê o próprio consumo (backend usa service key para inserir/contar).
- Ricardo (`ricardomidao@gmail.com`) marcado `premium=TRUE`. Base atual: 4 usuários / 4 perfis / 1 premium.

**Frontends:** Lab (`analisarIA`, `chamarClaudeComPDF`) e Clínica (`consultarLiteratura`) tratam `429` mostrando a mensagem "assine o Premium".

**Ajustes:** trocar o número = env var `LIMITE_IA_FREE` no Railway (sem código); promover alguém = `UPDATE profiles SET premium=TRUE WHERE id=(SELECT id FROM auth.users WHERE email='...')`.

---

## Pipeline RAG — Literatura Veterinária

```
Pergunta (PT) → Cohere embed (search_query) → pgvector match_documents → chunks → Claude cita [Livro, p.X]
```

- **Base:** Supabase tabela `literatura`, 3.185 chunks, `embedding vector(1024)` (Cohere embed-multilingual-v3.0). Livros: Smith Large Animal Surgery, Adams Claudicación.
- **`match_documents(query_embedding, match_count)`** — cosine similarity, sequential scan (ivfflat omitido: free tier 32MB < 42MB necessário).
- **`buscar_literatura()`**: Modo A = Cohere embed + pgvector (primário, threshold `RAG_SIM_MIN=0.45`); Modo B = fallback keyword AND+OR com tradução PT→EN/ES (se Cohere ausente/estourado). **Ficar sem Cohere degrada, não derruba.**
- **Cohere:** custo irrisório (US$ 0,10/1M tokens; cada consulta = frações de milésimo de centavo). ⚠️ Chave **Trial** = grátis mas 1.000 chamadas/mês e proibida para uso comercial; migrar para **Production key** ao virar produto.
- **RLS na `literatura`** ativado (direitos autorais — download anônimo retorna permission denied; backend usa service key).

### Re-indexação — `upload_voyage.py`
**Nome legado:** ainda se chama `upload_voyage.py` mas por dentro usa **Cohere** (Voyage foi abandonado — free tier 3 RPM, inviável). Local: `/Volumes/Centauro/equivet/literatura/`. `batch_size=40`, `sleep=15s` (respeita 100K TPM). Resume: pula chunks já com embedding.

---

## EquiVet Clínica — App web (prontuário + prescrições + faturas + literatura)

**Repo:** `Centaurovet/equivet` · **URL:** `centaurovet.com.br/equivet/equivet-clinica.html`
**Stack:** React 18 UMD + Babel standalone + `@supabase/supabase-js@2`, sem bundler.
**Fonte:** `equivet-clinica.src.jsx` → transpilar (`@babel/preset-react`, runtime clássico) → `equivet-clinica.js`. **SW:** `sw.js` CACHE `equivet-v19` (bump a cada release).
**Tema:** dark + gold (`#0f1117`/`#d4a96a`), Georgia serif.

### Chaves no frontend (`equivet-clinica.html`)
`SUPABASE_URL = 'https://lbtmdrhbhwvrytttevyw.supabase.co'` · `SUPABASE_KEY = 'sb_publishable_w2ePaCDxExkCk4hKiszgyA_oQ6_rZt6'` (publishable — OK no frontend). `window.supabase = window.supabase.createClient(...)`.

### As 4 abas
| ID | Função |
|----|--------|
| `atendimento` | Anamnese, exame (focado/completo), módulos por queixa → `buildProntuario()`; seção **Exames laboratoriais** (integração Lab, ver abaixo) |
| `prescricoes` | Catálogo (6 bases sistema + "MEU") com templates `[CAMPOS]` |
| `cobranca` | Geração de cobrança (PIX do perfil) + **faturas** (ver abaixo) |
| `literatura` | Consulta RAG (`/literatura`, JWT) com citações `[Livro, p.X]` |

### Faturas — controle de recebimento (jul/2026)
- `supabase/04_faturas.sql`: tabela `faturas(local_id, data_emissao, paciente_nome, itens JSONB, valor_total, status 'aberta'|'paga', pago_em, veterinario_id)` + RLS por vet.
- Aba Cobrança: botão **"Gerar fatura"** (nasce `aberta`), lista com badge EM ABERTO/PAGA, botão **"Marcar paga"**, total em aberto.
- Sync offline-first (localStorage `ev_faturas_v1` + Supabase); na reconciliação o status **"paga" prevalece**.

### Exames laboratoriais — integração com o EquiVet Lab (jul/2026)
Na aba Atendimento, seção "Exames laboratoriais":
- Botão **🩸 Abrir no EquiVet Lab** → `abrirLabExames()`: salva o atendimento (se preciso) para garantir `local_id` na nuvem, e abre `/equivet-lab/?atend=<local_id>&pac=<paciente>` em nova aba.
- Estado `atendVinculoId` (setado por `salvarAtendimento` e `carregarHist`) define o atendimento "atual"; `carregarExames(atendVinculoId)` busca em `exames` os vinculados (recarrega ao focar a janela — o vet volta do Lab).
- Lista de exames com data, nº de alterações, "com/sem laudo IA"; expande para mostrar as alterações + o `laudo_ia` (whitespace-pre-wrap). Reaparece dias depois ao reabrir o atendimento no Histórico.
- Schema: `supabase/07_exames.sql` (tabela `exames`, ver seção do Lab).

### Protocolos "MEU" — sync com a nuvem (jul/2026)
- `supabase/05_prescricoes_sync.sql`: coluna `prescricoes_base.local_id` + índice único `(criado_por, local_id)`.
- Criar/editar/restaurar/excluir protocolo "MEU" (`ev_extra_v5`) e edições de templates base (`ev_custom_v5`/tags) agora **gravam no Supabase** (`upsertPrescNuvem`/`delPrescNuvem`); sync no login restaura em aparelho novo e reenvia o que ficou offline. `local_id`: `cx_*` = protocolo MEU; `ovr_<n>` = edição de template base.

### Backend `/literatura` (contraste com `/chat`)
`/chat` = `X-API-Key` (API_SECRET) + `profile` (vet/owner/trainer/farrier). `/literatura` = JWT do usuário, sempre persona `vet`, sem web_search.

### Supabase `01_schema_clinica.sql`
Tabelas: `profiles` (estende auth.users; role, crmv, pix_key, **premium**), `animais`, `atendimentos` (JSONB anamnese/exame_geral/modulos + prontuario_texto), `prescricoes_base` (6 sistema + customizadas). RLS em todas: cada vet vê só os próprios dados. Trigger `handle_new_user` cria perfil no cadastro.

---

## EquiVet Lab — hemograma & bioquímico equino

**Repo:** `Centaurovet/equivet-lab` · **URL:** `centaurovet.com.br/equivet-lab/`
**Arquivo publicado:** `index.html` (o `equivet_lab.html` local é cópia de trabalho, gitignored). HTML standalone, ~1.400 linhas, sem build. **Tema:** dark (#0E0E0E) + gold, DM Sans/Mono/Cormorant.

### Funciona OFFLINE (sem login, sem IA)
- Identificação do paciente + hemograma completo + bioquímico.
- Validação automática por faixas de referência (adulto): 🟦 diminuído / 🟢 normal / 🟥 elevado / 🟣 crítico.
- Resumo offline, export JSON, impressão. Persistência `localStorage` (`equivet_clinica_sangue_v1`).

### Recursos de IA (exigem login + backend)
- **⚡ Analisar por IA** → `POST /analisar-sangue` (laudo estruturado ancorado em Smith/Adams).
- **📄 Importar PDF** → `POST /importar-pdf-lab` (Claude lê o PDF nativo/OCR, extrai valores + paciente, preenche o formulário; interpretação fundamentada vem depois no "Analisar").

### Integração (jul/2026 — "aposentar a chave")
- **Chave `sk-ant-...` aposentada.** Antes chamava `api.anthropic.com` direto do navegador (`anthropic-dangerous-direct-browser-access`) com a chave no localStorage — inviável comercialmente. Agora tudo passa pelo backend; a chave Anthropic fica no servidor.
- **Sessão Supabase compartilhada:** o Lab carrega `supabase-js` com o MESMO projeto/publishable key do Clínica → login feito no Clínica é reconhecido automaticamente (mesma origem `centaurovet.com.br`). Painel **⚙ Conta** faz login/logout; `onAuthStateChange` atualiza o badge. Token via `getSessionToken()`; IA/PDF gated por `exigirLogin()`.
- **Model string:** decidido no backend (Sonnet). Removido o seletor Opus 4.6 (string inexistente — corrigido).
- **Limite:** IA/PDF sujeitos ao 3/48h (free) · ilimitado (premium); `429` mostra "assine o Premium".
- Cap de PDF: 7 MB (alinha com o backend).

> **getSession() pode travar** (lock do supabase-js quando há refresh pendente / promises abandonadas). Para ler o token de forma robusta, extrair de `localStorage['sb-lbtmdrhbhwvrytttevyw-auth-token']`.

### Integração com o atendimento (exames vinculados) — jul/2026
O Lab é **dono da tabela `exames`** (Supabase). Um exame pode estar vinculado a um atendimento do Clínica ou ser avulso.
- **Entrada com contexto:** o Clínica abre `centaurovet.com.br/equivet-lab/?atend=<local_id>&pac=<nome>`. No load, `carregarVinculoAtendimento(atend)` busca a linha em `atendimentos` (por `local_id`), monta `ATEND_LINK={local_id,paciente,contexto}` (contexto = queixa + prontuario_texto), pré-preenche o paciente e mostra um banner de vínculo.
- **IA com contexto:** `analisarIA()` prefixa o `quadro` com "CONTEXTO DO ATENDIMENTO..." + `ATEND_LINK.contexto` → o laudo considera a queixa/prontuário (validado: laudo citou "exercício/prova/claudicação" vindos só do atendimento).
- **Persistência:** `salvarExame(laudo?)` faz upsert em `exames` (onConflict `veterinario_id,local_id`), com `atendimento_local_id` (ou NULL se avulso). Chamado após IA, após import de PDF, e pelo botão **💾 Salvar exame**. `EXAME_LOCAL_ID` = id estável por sessão.
- **Token robusto:** `getSessaoLS()` lê `{token,userId}` de `localStorage['sb-...-auth-token']` sem chamar `getSession()` (evita o lock que trava).
- **Avulso:** abrir o Lab sem `?atend` → exame com `atendimento_local_id=NULL`.
- ⚠️ `ATEND_LINK` é `let` de topo → **não** é `window.ATEND_LINK` (referencie direto). Para consultas ad-hoc que travam via supabase-js, usar REST direto (`/rest/v1/<tabela>` com `apikey` publishable + `Authorization: Bearer <token>`).

### Latência
`/analisar-sangue`: ~15–20s normal, até ~40–48s em cold start do Railway (container acorda). UX mostra spinner "Consultando…". Mitigações possíveis: manter o container quente (ping periódico), reduzir chunks/tamanho do laudo.

---

## App Radiografia — `app.py`

**Repo:** `Centaurovet/equivet-radiografia`. **Modelo:** `claude-opus-4-5`. Key: `.streamlit/secrets.toml`.
`montar_prompt()` 6 seções: cabeçalho, qualidade, achados, impressão, relevância PPE (AAEP/Butler), recomendações.
Scripts: `EXECUTAR_PORTATIL.bat` (8501), `CAMPO_TREINOS.bat` (8502), `TREINAR.bat`, `INSTALAR_ML*.bat`.

### Modelo ML (EfficientNet-B0) · Campo de Treinos
`treinar_modelo.py` v2: fase1 10 épocas (backbone congelado, LR 1e-3) + fase2 40 (fine-tuning features[5..8], LR 5e-5), batch 16, paciência 12. Acurácia v1 62,2% → v2 esperada 78–88%. Dataset ~3.041 `.dcm` (`StudyDescription`): Casco ~44%, Metacarpofalangeana ~15%, Boleto ~12%… Correção crítica: "margem solar"/"pedal" → Casco.
Campo de Treinos (`app_treinos.py`): 4 abas (Avaliação/Ensino/Similaridade CBIR/Histórico); `_carregar_extrator()` → fallback ImageNet se modelo custom ausente / PyTorch ausente.

---

## EquiVet Fármacos ✅ DEPLOY ATIVO

**Repo:** `Centaurovet/equivet-farmacos` · **URL:** `centaurovet.com.br/equivet-farmacos/`. HTML (`index.html`), 45 fármacos / 9 categorias. PWA (manifest + sw + icon). Bug `calcDose()` corrigido — flag `isPerKg` impede multiplicar dose de unidades fixas (`mg/articulação`, `L/animal`) pelo peso (antes triancinolona dava 300–900 mL p/ 500 kg → risco de laminite; agora 0,6–1,8 mL).

---

## Histórico de Correções

1–15. (ver versões anteriores: organizar_dicom, treinar_modelo, app_treinos, INSTALAR_ML_PORTATIL, `.strip()` env vars, RAG Voyage→Cohere, batch_size 90→40, ivfflat omitido, Fármacos calcDose/deploy, segurança backend #14 remoção de `/debug-*`, RLS Supabase #15).
16. **Faturas** — `04_faturas.sql` + aba Cobrança (gerar/marcar paga), sync offline-first, "paga" prevalece.
17. **Protocolos MEU sync** — `05_prescricoes_sync.sql` (local_id + índice único); grava em `prescricoes_base` em criar/editar/restaurar/excluir; sync no login.
18. **EquiVet Lab integrado** — chave aposentada, sessão Supabase compartilhada, endpoints `/analisar-sangue` e `/importar-pdf-lab` (JWT + RAG, sem web_search), model strings corrigidos, publicado em `equivet-lab`.
19. **CORS backend** — origens da família EquiVet hardcoded + OPTIONS (preflight dava 404, quebrava Literatura e Lab no navegador).
20. **Limite de IA** — `06_limite_ia.sql` (premium + consumo_ia), `verificar_limite_ia`/`registrar_consumo_ia` nos 3 endpoints JWT, 429 nos frontends, Ricardo premium.
21. **Integração Lab ↔ Clínica (exames)** — `07_exames.sql` (tabela `exames` vinculável/avulsa + RLS); portal card do Lab reativado; Clínica com botão "Abrir no EquiVet Lab" + seção de exames vinculados; Lab lê `?atend`, busca contexto, alimenta a IA e persiste o exame. **Validado E2E:** laudo citou o contexto do atendimento (exercício/claudicação) e o exame gravou vinculado.

---

## Estado Atual (Jul/2026)

### Chat Backend + RAG ✅
- [x] FastAPI Railway (**plano Hobby ativo**), `/chat` + `/literatura` + `/analisar-sangue` + `/importar-pdf-lab`.
- [x] CORS corrigido (origens hardcoded + OPTIONS). RAG Cohere+pgvector, 3.185 chunks.
- [x] Limite de IA 3/48h (free) · ilimitado (premium). Ricardo premium.
- [x] **E2E validado:** `/analisar-sangue` retornou laudo 200 com `tem_literatura=true` citando Adams.

### EquiVet Clínica ✅
- [x] Atendimentos/prescrições/protocolos MEU (sync nuvem) / faturas (controle de recebimento) / literatura.
- [ ] Pendente: confirmar citações `[Smith/Adams]` de forma consistente; registrar prescrições EMITIDAS (não só catálogo); vincular fatura ao atendimento de origem.

### EquiVet Lab ✅ PUBLICADO
- [x] `centaurovet.com.br/equivet-lab/`, sessão compartilhada, IA/PDF via backend, offline funcional.
- [x] **Integração com o Clínica:** exames persistidos na tabela `exames` (vinculados a atendimento ou avulsos), contexto do atendimento na IA, retorno ao prontuário, anexar dias depois. Validado E2E.
- [ ] Pendente: empacotar como PWA (manifest + SW) para paridade com Clínica/Fármacos; estratificar faixas de referência por idade/estado fisiológico; histórico de exames por paciente (gráficos de evolução); reabrir um exame específico no Lab (`?exame=<id>` carregando valores+laudo).

### Pendências transversais
- [ ] **SEGURANÇA:** revogar o token GitHub embutido nos remotes dos 3 repos (`equivet`, `equivet-lab`, `equivet-chat-backend`) e reapontar os remotes.
- [ ] Cohere: confirmar/migrar Trial → Production key antes de escala comercial.
- [ ] Latência do backend: avaliar container quente vs cold start.
- [ ] Custo (estimativa): dominado pela Anthropic (~US$ 0,65–1,65/usuário ativo/mês). Alavancas: prompt caching (system + chunks −90% em cache), Haiku para perfis não-vet, cap por assinatura.

---

## Acesso a Arquivos — Pastas do Ricardo (Mac)

| Pasta | Caminho |
|-------|---------|
| Projeto EquiVet IA (radiografia) | `/Volumes/Centauro/EquivetIAOpus4` |
| Backend do chat | `/Volumes/Centauro/EquivetIAOpus4/chat_backend` |
| Clínica / literatura / chunks | `/Volumes/Centauro/equivet` |
| EquiVet Lab | `/Volumes/Centauro/Equivet Lab` |
| DICOMs | `/Volumes/Centauro/Dicom` |

Solicitar acesso no início da sessão com `mcp__cowork__request_cowork_directory`.
