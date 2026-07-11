

// ============================================================================
// QUEIXAS PRINCIPAIS
// ============================================================================
const QUEIXAS = [
  { id:"colica",   label:"Colica / Abdome agudo",     curto:"Colica",   icon:"🔴", cor:"#c0654a" },
  { id:"claudic",  label:"Claudicacao / Locomotor",   curto:"Locomotor",icon:"🟠", cor:"#d49a5a" },
  { id:"respir",   label:"Respiratorio",              curto:"Respir",   icon:"🫁", cor:"#5a9ab0" },
  { id:"neuro",    label:"Neurologico",               curto:"Neuro",    icon:"🧠", cor:"#9a7ac0" },
  { id:"dermato",  label:"Dermatologia / Feridas",    curto:"Dermato",  icon:"🩹", cor:"#6aa080" },
  { id:"oftalmo",  label:"Oftalmologia",              curto:"Oftalmo",  icon:"👁️", cor:"#5a8ac0" },
  { id:"outro",    label:"Outro / Exame geral",       curto:"Outro",    icon:"📋", cor:"#8a8a8a" },
];

// ============================================================================
// TEMPLATES BASE - agora com tags de queixa
// ============================================================================
const NOVO_TPL = (t) => "PRESCRICAO VETERINARIA\n\nPaciente: [NOME DO ANIMAL]\nProprietario: [NOME DO PROPRIETARIO]\nData: [DATA]\n\nDIAGNOSTICO: " + t + "\n\nMEDICAMENTOS:\n1. [MEDICAMENTO]\n   Dose: [DOSE]\n   Via: [VO / IM / IV]\n   Duracao: [X dias]\n\nMEDIDAS DE SUPORTE:\n- [OBSERVACAO]\n\nDr. Ricardo | CRMV-[UF] [No]";

const BASE = [
  { id:1, titulo:"Laminite Aguda",       categoria:"Ortopedia",         icon:"__hoof__", queixas:["claudic"], template:NOVO_TPL("Laminite Aguda") },
  { id:2, titulo:"Colica Espamodica",    categoria:"Gastroenterologia", icon:"🫁", queixas:["colica"],  template:NOVO_TPL("Colica Espamodica") },
  { id:3, titulo:"Hernia Umbilical",     categoria:"Cirurgia",          icon:"🐴", queixas:[],          template:NOVO_TPL("Hernia Umbilical") },
  { id:4, titulo:"Leptospirose Equina",  categoria:"Infectologia",      icon:"🔬", queixas:[],          template:NOVO_TPL("Leptospirose Equina") },
  { id:5, titulo:"Ferida / Laceracao",   categoria:"Cirurgia",          icon:"🩹", queixas:["dermato"], template:NOVO_TPL("Laceracao - [LOCALIZACAO]") },
  { id:6, titulo:"Conjuntivite / Uveite",categoria:"Oftalmologia",      icon:"👁️", queixas:["oftalmo"], template:NOVO_TPL("[Conjuntivite / Uveite]") },
];


const ICONS = ["🐎","🦵","🫁","🐴","🔬","🩹","👁️","💉","🦷","🫀","🧬","🩻","🌡️","💊","🧪","🏥"];

const HOOF_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#d4a96a" fill-rule="evenodd" d="M12 2.5c5.2 0 8.7 4.3 8.7 9.5S17.2 21.5 12 21.5 3.3 17.2 3.3 12 6.8 2.5 12 2.5Zm0 3C8.5 5.5 6.3 8.6 6.3 12S8.7 18.5 12 18.5 17.7 15.4 17.7 12 15.5 5.5 12 5.5Z"/><path fill="#d4a96a" d="M12 7.6l2.5 6.5c.2.6-.2 1.1-.8 1.1h-3.4c-.6 0-1-.5-.8-1.1L12 7.6Z"/></svg>';
// Renderiza SVG quando o icone e um marcador especial; senao mostra o emoji normal.
const renderIcon = (ic) => ic==="__hoof__"
  ? <span style={{display:"inline-block",verticalAlign:"-0.15em",lineHeight:0}} dangerouslySetInnerHTML={{__html:HOOF_SVG}}/>
  : ic;

const CATS  = ["Clinica Geral","Ortopedia","Gastroenterologia","Cirurgia","Infectologia","Oftalmologia","Reproducao","Neurologia"];
const LS1 = "ev_custom_v5";
const LS2 = "ev_extra_v5";
const LS3 = "ev_atend_v1";
const LS_TAGS = "ev_base_tags_v1";
const LS_CRMV = "ev_crmv_v1";
const LS_PIX  = "ev_pix_v1";
const LS_PRECOS = "ev_precos_v1";
const LS_FAT = "ev_faturas_v1";

// Backend Railway (mesmo do chat). /literatura autentica via JWT do usuario (Supabase).
const BACKEND_URL = "https://web-production-2f5bf.up.railway.app";

// ============================================================================
// FAIXAS DE REFERENCIA E OPCOES DE EXAME
// ============================================================================
const REF = {
  fc:   {min:28,   max:44,   unit:"bpm", label:"FC"},
  fr:   {min:8,    max:16,   unit:"mpm", label:"FR"},
  temp: {min:37.0, max:38.5, unit:"°C",  label:"Temp"},
  tpc:  {min:1,    max:2,    unit:"s",   label:"TPC"},
};

const MUCOSAS = ["Rosea umida (normal)","Palida","Congesta","Cianotica","Icterica","Toxemica"];
const HIDRAT = ["Normal","Leve (4-6%)","Moderada (6-8%)","Grave (>8%)"];
const LINFON = ["Nao reativos","Submandibulares aumentados","Pre-escapulares aumentados","Reativos generalizados"];
const MOTI = ["Normoativa (++)","Hipoativa (+)","Ausente (0)","Hiperativa (+++)"];
const QUADS = ["SD","SE","ID","IE"];

// Modulos
const COL_DOR = [
  {v:0,l:"0 - Sem dor"},
  {v:1,l:"1 - Inquietacao leve"},
  {v:2,l:"2 - Patear, deitar/levantar"},
  {v:3,l:"3 - Rolar, dor moderada"},
  {v:4,l:"4 - Dor intensa"},
  {v:5,l:"5 - Incontrolavel"},
];
const COL_REFL = ["Nao houve","Esverdeado (alimentar)","Marrom-escuro","Hemorragico","Fetido"];
const COL_PALP = ["Sem alteracoes","Distensao de delgado","Distensao de colon (gas)","Impactacao de colon maior","Impactacao de colon menor","Deslocamento de colon","Encarceramento nefroesplenico","Massa palpavel","Nao realizada"];

const CLA_GRADE = [
  {v:0,l:"0 - Nao observada"},
  {v:1,l:"1 - Inconsistente"},
  {v:2,l:"2 - Obvia em circulo/piso duro"},
  {v:3,l:"3 - Consistente"},
  {v:4,l:"4 - Obvia ao passo"},
  {v:5,l:"5 - Nao apoia / decubito"},
];
const CLA_MEMBRO = ["MAD","MAE","MPD","MPE","Multiplos"];
const CLA_REGIAO = ["Casco","Quartela/boleto","Metacarpo/metatarso","Carpo/jarrete","Antebraco/perna","Cotovelo/joelho","Ombro/quadril","Coluna/garupa","A definir"];
const CLA_FLEX = ["Negativa","Positiva leve","Positiva moderada","Positiva intensa","Nao realizada"];
const CLA_PINCA = ["Negativo","Positivo focal","Positivo difuso","Nao realizado"];
const CLA_APOIO = ["Apoio total","Aliviando o membro","Em ponta de casco","Nao apoia"];
const CLA_BLOQ_RESP = ["Melhora completa (>90%)","Melhora parcial (50-90%)","Melhora discreta (<50%)","Sem melhora"];

const RES_DESC = ["Ausente","Serosa unilateral","Serosa bilateral","Mucopurulenta","Hemorragica"];
const RES_TOSSE = ["Ausente","Seca esporadica","Seca frequente","Produtiva","Paroxistica"];
const RES_AUSC = ["Murmurio normal","Sibilos","Estertores crepitantes","Estertores bolhosos","Hipofonese","Ruidos de atrito"];
const RES_ESF = ["Eupneia","Taquipneia","Dispneia inspiratoria","Dispneia expiratoria","Dispneia mista"];

const NEU_EST = ["Alerta","Apatico","Estuporoso","Comatoso","Excitado/agressivo"];
const NEU_AT = [
  {v:0,l:"0 - Sem deficits"},
  {v:1,l:"1 - Sutis em manobras"},
  {v:2,l:"2 - Aparentes ao passo"},
  {v:3,l:"3 - Tropeca"},
  {v:4,l:"4 - Quase cai"},
  {v:5,l:"5 - Decubito"},
];
const NEU_NC = ["Todos integros","Alteracao facial (VII)","Alteracao trigemeo (V)","Alteracao vestibular (VIII)","Alteracao visual (II)","Disfagia (IX/X)","Multiplos comprometidos"];
const NEU_POS = ["Normal","Cabeca pendida","Inclinacao de cabeca","Andar em circulos","Pressao de cabeca contra parede","Decubito"];

const DER_PRIM = ["Macula","Papula","Pustula","Vesicula","Nodulo","Placa","Tumor"];
const DER_SEC = ["Crosta","Escama","Erosao","Ulcera","Cicatriz","Liquenificacao","Alopecia"];
const DER_DIST = ["Localizada","Multifocal","Generalizada","Simetrica","Cabeca/pescoco","Tronco","Membros","Perineo"];
const DER_PRU = ["Ausente","Leve","Moderado","Intenso (autotraumatismo)"];

const OFT_OLHO = ["OD","OE","AO (ambos)"];
const OFT_BLEF = ["Normal","Blefarospasmo leve","Blefarospasmo intenso","Edema palpebral","Lacrimejamento"];
const OFT_COR = ["Transparente","Edema focal","Edema difuso","Ulcera superficial","Ulcera profunda","Vascularizacao","Cicatriz"];
const OFT_CAM = ["Limpa","Hipopio","Hifema","Flare aquoso","Nao avaliavel"];
const OFT_FLU = ["Negativa","Positiva","Nao realizada"];

// ============================================================================
// REGRAS DE SUGESTAO DIAGNOSTICA
// ============================================================================
const REGRAS = [
  // Colica
  { id:"col_obstr", queixa:"colica",
    rotulo:"Refluxo + dor intensa sugerem obstrucao de delgado",
    cond:e=>{const m=e.colica||{};const d=parseFloat(m.dor);const r=parseFloat(m.refluxoVol);return d>=3&&r>=2;},
    sug:["Obstrucao de intestino delgado","Enterite proximal"] },
  { id:"col_imp", queixa:"colica",
    rotulo:"Dor leve sem refluxo + impactacao na palpacao",
    cond:e=>{const m=e.colica||{};const d=parseFloat(m.dor);const sr=!m.refluxoVol||parseFloat(m.refluxoVol)<1;const i=(m.palpacao||[]).some(p=>p.toLowerCase().includes("impactacao"));return d<=2&&sr&&i;},
    sug:["Impactacao de colon maior","Impactacao de colon menor"] },
  { id:"col_ch", queixa:"colica",
    rotulo:"Sinais de choque/endotoxemia (Hto/lactato elevados)",
    cond:e=>{const m=e.colica||{};const h=parseFloat(m.hto);const l=parseFloat(m.lactato);return h>=50||l>=4;},
    sug:["Abdome agudo cirurgico","Endotoxemia"] },
  // Claudicacao
  { id:"cla_pinca", queixa:"claudic",
    rotulo:"Pinca de casco positiva sugere problema podal",
    cond:e=>(e.claudic||{}).pincaCasco?.startsWith("Positivo"),
    sug:["Abscesso de casco","Laminite Aguda","Pododermatite"] },
  { id:"cla_grau", queixa:"claudic",
    rotulo:"Grau >=4 com nao-apoio",
    cond:e=>{const m=e.claudic||{};return parseInt(m.grade)>=4&&(m.apoio==="Nao apoia"||m.apoio==="Em ponta de casco");},
    sug:["Fratura","Abscesso de casco","Laminite Aguda"] },
  { id:"cla_flex", queixa:"claudic",
    rotulo:"Flexao distal positiva",
    cond:e=>(e.claudic||{}).flexaoDistal?.startsWith("Positiva"),
    sug:["Sinovite de boleto","Osteoartrite distal"] },
  // Respir
  { id:"res_disp", queixa:"respir",
    rotulo:"Dispneia expiratoria + sibilos",
    cond:e=>{const m=e.respir||{};return m.esforco==="Dispneia expiratoria"&&(m.ausculta||[]).includes("Sibilos");},
    sug:["Asma equina (RAO/IAD)"] },
  { id:"res_pur", queixa:"respir",
    rotulo:"Descarga mucopurulenta + tosse",
    cond:e=>{const m=e.respir||{};return m.descarga==="Mucopurulenta"&&m.tosse&&m.tosse!=="Ausente";},
    sug:["Pneumonia bacteriana","Bronquite infecciosa"] },
  // Neuro
  { id:"neu_at", queixa:"neuro",
    rotulo:"Ataxia >=2 com nervos cranianos integros",
    cond:e=>{const m=e.neuro||{};return parseInt(m.ataxia)>=2&&(m.nervos||[]).includes("Todos integros");},
    sug:["Mielopatia cervical compressiva","EPM (mieloencefalite protozoaria)"] },
  { id:"neu_vest", queixa:"neuro",
    rotulo:"Cabeca inclinada + alteracao vestibular",
    cond:e=>{const m=e.neuro||{};return m.postura==="Inclinacao de cabeca"&&(m.nervos||[]).includes("Alteracao vestibular (VIII)");},
    sug:["Sindrome vestibular periferica","Otite media/interna"] },
  // Oftalmo
  { id:"oft_ulc", queixa:"oftalmo",
    rotulo:"Fluoresceina positiva",
    cond:e=>(e.oftalmo||{}).fluoresceina==="Positiva",
    sug:["Ulcera de cornea","Conjuntivite / Uveite"] },
  { id:"oft_uv", queixa:"oftalmo",
    rotulo:"Hipopio/flare + blefarospasmo",
    cond:e=>{const m=e.oftalmo||{};return (m.camara==="Hipopio"||m.camara==="Flare aquoso")&&(m.blefaro||"").includes("Blefarospasmo");},
    sug:["Uveite anterior","Conjuntivite / Uveite"] },
  // Dermato
  { id:"der_pru", queixa:"dermato",
    rotulo:"Prurido intenso com lesoes de autotraumatismo",
    cond:e=>(e.dermato||{}).prurido?.includes("Intenso"),
    sug:["Hipersensibilidade a Culicoides","Dermatite alergica"] },
];

// ============================================================================
// HELPERS
// ============================================================================
function lsGet(k,fb){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fb; }catch{ return fb; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} }
function copyToClipboard(text){
  try{
    if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(text); }
    else{ const el=document.createElement("textarea"); el.value=text; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.focus(); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
  }catch(e){}
}

function todayISO(){
  const d=new Date(); const off=d.getTimezoneOffset();
  return new Date(d.getTime()-off*60000).toISOString().slice(0,10);
}
function newId(){ return "at_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7); }

function evalRange(v,r){
  if(v===""||v===null||v===undefined) return "empty";
  const x=parseFloat(String(v).replace(",","."));
  if(isNaN(x)) return "empty";
  if(x<r.min) return "low";
  if(x>r.max) return "high";
  return "ok";
}

// Estado inicial dos modulos
const EX_GERAL_INIT = {fc:"",fr:"",temp:"",tpc:"",mucosa:"",hidratacao:"",linfonodos:"",motilidade:{SD:"",SE:"",ID:"",IE:""},obs:""};
const MOD_INIT = {
  colica:{dor:"",freqDor:"",refluxoVol:"",refluxoCor:"",palpacao:[],hto:"",pt:"",lactato:"",obs:""},
  claudic:{grade:"",membro:"",regiao:"",apoio:"",cabeceio:"",anca:"",flexaoDistal:"",flexaoProximal:"",flexaoEspavin:"",pincaCasco:"",bloqueio:"",bloqueioResp:"",obs:""},
  respir:{descarga:"",tosse:"",ausculta:[],esforco:"",reinalacao:"",obs:""},
  neuro:{estado:"",ataxia:"",nervos:[],postura:"",obs:""},
  dermato:{lesaoPrim:[],lesaoSec:[],distribuicao:[],prurido:"",duracao:"",tratPrev:"",obs:""},
  oftalmo:{olho:"",blefaro:"",cornea:"",camara:"",fluoresceina:"",pio:"",visao:"",obs:""},
};

// Geradores de texto
function buildAnamnese(an,queixaId){
  const q=QUEIXAS.find(x=>x.id===queixaId);
  const out=["ANAMNESE:"];
  if(q) out.push("- Queixa principal: "+q.label);
  if(an.inicio)        out.push("- Inicio: "+an.inicio);
  if(an.evolucao)      out.push("- Evolucao: "+an.evolucao);
  if(an.manejoRecente) out.push("- Manejo recente: "+an.manejoRecente);
  if(an.alimentacao)   out.push("- Alimentacao: "+an.alimentacao);
  if(an.vermifugacao)  out.push("- Vermifugacao: "+an.vermifugacao);
  if(an.vacinacao)     out.push("- Vacinacao: "+an.vacinacao);
  if(an.obs?.trim())   out.push("- Observacoes: "+an.obs.trim());
  return out.length>1?out.join("\n"):"";
}

function buildExGeral(ex){
  const out=["EXAME GERAL:"];
  if(ex.fc)   out.push("- FC: "+ex.fc+" bpm");
  if(ex.fr)   out.push("- FR: "+ex.fr+" mpm");
  if(ex.temp) out.push("- Temperatura: "+ex.temp+" °C");
  if(ex.tpc)  out.push("- TPC: "+ex.tpc+" s");
  if(ex.mucosa)     out.push("- Mucosas: "+ex.mucosa);
  if(ex.hidratacao) out.push("- Hidratacao: "+ex.hidratacao);
  if(ex.linfonodos) out.push("- Linfonodos: "+ex.linfonodos);
  const mot=QUADS.filter(q=>ex.motilidade?.[q]).map(q=>q+": "+ex.motilidade[q]);
  if(mot.length) out.push("- Motilidade: "+mot.join(" | "));
  if(ex.obs?.trim()) out.push("- Observacoes: "+ex.obs.trim());
  return out.length>1?out.join("\n"):"";
}

function buildModulo(qid,mods){
  const m=mods[qid]; if(!m) return "";
  switch(qid){
    case "colica":{
      const o=["EXAME ESPECIFICO - COLICA:"];
      if(m.dor!=="") o.push("- Grau de dor: "+m.dor+"/5"+(m.freqDor?" ("+m.freqDor+")":""));
      if(m.refluxoVol) o.push("- Refluxo: "+m.refluxoVol+"L"+(m.refluxoCor?" - "+m.refluxoCor:""));
      if(m.palpacao?.length) o.push("- Palpacao retal: "+m.palpacao.join("; "));
      const lab=[m.hto&&"Hto "+m.hto+"%",m.pt&&"PT "+m.pt+"g/dL",m.lactato&&"Lactato "+m.lactato+"mmol/L"].filter(Boolean);
      if(lab.length) o.push("- Laboratorial: "+lab.join(" | "));
      if(m.obs?.trim()) o.push("- Observacoes: "+m.obs.trim());
      return o.length>1?o.join("\n"):"";
    }
    case "claudic":{
      const o=["EXAME ESPECIFICO - CLAUDICACAO:"];
      if(m.grade!=="") o.push("- Grau AAEP: "+m.grade+"/5");
      if(m.membro) o.push("- Membro: "+m.membro);
      if(m.regiao) o.push("- Regiao: "+m.regiao);
      const din=[m.apoio&&"apoio: "+m.apoio,m.cabeceio&&"cabeceio: "+m.cabeceio,m.anca&&"anca: "+m.anca].filter(Boolean);
      if(din.length) o.push("- Dinamica - "+din.join(" | "));
      const flex=[m.flexaoDistal&&"distal: "+m.flexaoDistal,m.flexaoProximal&&"proximal: "+m.flexaoProximal,m.flexaoEspavin&&"espavin: "+m.flexaoEspavin].filter(Boolean);
      if(flex.length) o.push("- Flexoes - "+flex.join(" | "));
      if(m.pincaCasco) o.push("- Pinca de casco: "+m.pincaCasco);
      if(m.bloqueio) o.push("- Bloqueio ("+m.bloqueio+"): "+(m.bloqueioResp||"pendente"));
      if(m.obs?.trim()) o.push("- Observacoes: "+m.obs.trim());
      return o.length>1?o.join("\n"):"";
    }
    case "respir":{
      const o=["EXAME ESPECIFICO - RESPIRATORIO:"];
      if(m.descarga) o.push("- Descarga nasal: "+m.descarga);
      if(m.tosse) o.push("- Tosse: "+m.tosse);
      if(m.esforco) o.push("- Padrao: "+m.esforco);
      if(m.ausculta?.length) o.push("- Ausculta: "+m.ausculta.join("; "));
      if(m.reinalacao) o.push("- Reinalacao: "+m.reinalacao);
      if(m.obs?.trim()) o.push("- Observacoes: "+m.obs.trim());
      return o.length>1?o.join("\n"):"";
    }
    case "neuro":{
      const o=["EXAME ESPECIFICO - NEUROLOGICO:"];
      if(m.estado) o.push("- Estado mental: "+m.estado);
      if(m.postura) o.push("- Postura: "+m.postura);
      if(m.ataxia!=="") o.push("- Ataxia (Mayhew): "+m.ataxia+"/5");
      if(m.nervos?.length) o.push("- Nervos cranianos: "+m.nervos.join("; "));
      if(m.obs?.trim()) o.push("- Observacoes: "+m.obs.trim());
      return o.length>1?o.join("\n"):"";
    }
    case "dermato":{
      const o=["EXAME ESPECIFICO - DERMATOLOGICO:"];
      if(m.duracao) o.push("- Duracao: "+m.duracao);
      if(m.prurido) o.push("- Prurido: "+m.prurido);
      if(m.lesaoPrim?.length) o.push("- Lesoes primarias: "+m.lesaoPrim.join(", "));
      if(m.lesaoSec?.length)  o.push("- Lesoes secundarias: "+m.lesaoSec.join(", "));
      if(m.distribuicao?.length) o.push("- Distribuicao: "+m.distribuicao.join(", "));
      if(m.tratPrev?.trim()) o.push("- Tratamentos previos: "+m.tratPrev.trim());
      if(m.obs?.trim()) o.push("- Observacoes: "+m.obs.trim());
      return o.length>1?o.join("\n"):"";
    }
    case "oftalmo":{
      const o=["EXAME ESPECIFICO - OFTALMOLOGICO:"];
      if(m.olho) o.push("- Olho: "+m.olho);
      if(m.blefaro) o.push("- Palpebra: "+m.blefaro);
      if(m.cornea) o.push("- Cornea: "+m.cornea);
      if(m.camara) o.push("- Camara anterior: "+m.camara);
      if(m.fluoresceina) o.push("- Fluoresceina: "+m.fluoresceina);
      if(m.pio) o.push("- PIO: "+m.pio+" mmHg");
      if(m.visao) o.push("- Visao/reflexos: "+m.visao);
      if(m.obs?.trim()) o.push("- Observacoes: "+m.obs.trim());
      return o.length>1?o.join("\n"):"";
    }
  }
  return "";
}

function buildProntuario(estado){
  const blocos=[];
  const an=buildAnamnese(estado.anamnese,estado.queixa); if(an) blocos.push(an);
  if(estado.modoExame==="completo"){ const ex=buildExGeral(estado.exGeral); if(ex) blocos.push(ex); }
  const mod=buildModulo(estado.queixa,estado.mods); if(mod) blocos.push(mod);
  return blocos.join("\n\n");
}

// ============================================================================
// PALETA / ESTILOS COMPARTILHADOS
// ============================================================================
const C = {bg:"#0f1117",card:"#1a1f2e",bord:"#2a3040",gold:"#d4a96a",green:"#6abf69",muted:"#7a8a9a",text:"#e8e0d0",dim:"#5a6a7a",amber:"#d49a5a",amberBg:"#2e2418"};
const IS = {background:C.card,border:"1px solid "+C.bord,borderRadius:8,color:C.text,padding:"8px 12px",fontSize:14,outline:"none",boxSizing:"border-box",width:"100%"};

function LinhaCobranca({label,valor,ativa}){
  if(!ativa) return null;
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.card,border:"1px solid "+C.bord,borderRadius:8,padding:"8px 12px",marginBottom:6}}>
    <span style={{fontSize:13,color:"#c8c0b0"}}>{label}</span>
    <span style={{fontSize:13,color:C.gold,fontWeight:600}}>R$ {valor.toFixed(2).replace(".",",")}</span>
  </div>;
}

const {useState,useEffect,useMemo} = React;

// Componente reutilizavel: card com cor lateral
function ModCard({queixaId,titulo,children}){
  const q=QUEIXAS.find(x=>x.id===queixaId);
  return <div style={{background:C.card,border:"1px solid "+C.bord,borderLeft:"3px solid "+(q?.cor||C.bord),borderRadius:10,padding:14,marginBottom:12}}>
    <div style={{fontSize:13,fontWeight:700,color:q?.cor||C.gold,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>{q?.icon} {titulo}</div>
    {children}
  </div>;
}

function Field({label,children,hint}){
  return <div style={{marginBottom:10}}>
    <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{label}{hint&&<span style={{textTransform:"none",letterSpacing:0,color:C.dim,marginLeft:6,fontStyle:"italic"}}>{hint}</span>}</div>
    {children}
  </div>;
}

function Vital({campo,valor,onChange}){
  const r=REF[campo];
  const st=evalRange(valor,r);
  const cores={ok:"#3a6a3a",high:"#7a3a3a",low:"#7a3a3a",empty:C.bord};
  const bgs ={ok:"#1a2e1a",high:"#2e1a1a",low:"#2e1a1a",empty:C.card};
  const labelSt={ok:C.green,high:"#c07050",low:"#c07050",empty:C.muted};
  return <div>
    <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{r.label} <span style={{color:C.dim,textTransform:"none",letterSpacing:0}}>({r.min}-{r.max} {r.unit})</span></div>
    <input type="number" step={campo==="temp"?"0.1":"1"} value={valor} onChange={e=>onChange(e.target.value)} placeholder={r.unit}
      style={{...IS,background:bgs[st],border:"1px solid "+cores[st]}}/>
    {st!=="empty"&&<div style={{fontSize:10,color:labelSt[st],marginTop:3}}>
      {st==="ok"&&"dentro da faixa"}
      {st==="high"&&"^ acima da faixa"}
      {st==="low"&&"v abaixo da faixa"}
    </div>}
  </div>;
}

// ============================================================================
// APP PRINCIPAL
// ============================================================================
// ============================================================================
// TELA DE LOGIN
// ============================================================================
function traduzErroAuth(m){
  if(!m) return 'Erro desconhecido. Tente novamente.';
  if(/already registered|already exists/i.test(m)) return 'Este email já tem conta. Use a aba "Entrar".';
  if(/at least 6|password.*short|weak password/i.test(m)) return 'A senha precisa de pelo menos 6 caracteres.';
  if(/rate limit|too many|security purposes/i.test(m)) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if(/invalid email|unable to validate email/i.test(m)) return 'Email inválido. Confira a digitação.';
  if(/email not confirmed/i.test(m)) return 'Email ainda não confirmado. Verifique sua caixa de entrada.';
  if(/failed to fetch|network/i.test(m)) return 'Sem conexão. Verifique a internet e tente de novo.';
  return m;
}

function LoginScreen({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [senha,    setSenha]    = useState('');
  const [modo,     setModo]     = useState('login'); // 'login' | 'cadastro'
  const [crmvCad,  setCrmvCad]  = useState('');
  const [erro,     setErro]     = useState('');
  const [loading,  setLoading]  = useState(false);

  const entrar = async () => {
    setLoading(true); setErro('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setErro(/failed to fetch|network/i.test(error.message||'') ? 'Sem conexão. Verifique a internet.' : 'Email ou senha incorretos.');
    else onLogin(data.user);
    setLoading(false);
  };

  const cadastrar = async () => {
    setLoading(true); setErro('');
    const { data, error } = await supabase.auth.signUp({ email, password: senha,
      options: { data: { crmv: crmvCad.trim().toUpperCase() } } });
    if (error) setErro(traduzErroAuth(error.message));
    else if (data.user && data.session) onLogin(data.user);
    else setErro('Conta criada! Verifique seu email para confirmar antes de entrar.');
    setLoading(false);
  };

  const [resetMsg, setResetMsg] = useState('');
  const redefinir = async () => {
    if (!email.includes('@')) { setErro('Digite seu email no campo acima para redefinir a senha.'); return; }
    setLoading(true); setErro(''); setResetMsg('');
    const redirect = window.location.origin + window.location.pathname;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirect });
    if (error) setErro(traduzErroAuth(error.message));
    else setResetMsg('Enviamos um link de redefinicao para ' + email + '. Verifique seu email (e a caixa de spam).');
    setLoading(false);
  };

  const S = {
    wrap:   { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1117', padding:20 },
    card:   { background:'#15192a', border:'1px solid #2a3040', borderRadius:16, padding:32, width:'100%', maxWidth:360 },
    logo:   { textAlign:'center', marginBottom:28 },
    tabs:   { display:'flex', gap:8, marginBottom:20 },
    tab:    (a) => ({ flex:1, padding:'8px', borderRadius:8, border:'1px solid', cursor:'pointer', fontFamily:'Georgia,serif', fontSize:13,
                borderColor: modo===a ? '#d4a96a' : '#2a3040',
                background:  modo===a ? '#d4a96a22' : 'transparent',
                color:       modo===a ? '#d4a96a' : '#6a7090' }),
    input:  { background:'#0f1320', border:'1px solid #2a3040', borderRadius:8, padding:'10px 12px',
              color:'#e8e0d0', fontSize:14, width:'100%', fontFamily:'Georgia,serif' },
    btn:    (ok) => ({ background: ok ? '#d4a96a' : '#2a3040', color: ok ? '#1a1510' : '#4a5060',
                border:'none', borderRadius:8, padding:'12px', fontSize:15, fontWeight:700,
                cursor: ok ? 'pointer' : 'default', fontFamily:'Georgia,serif', width:'100%', marginTop:4 }),
    erro:   { background:'#3a1a1a', border:'1px solid #6a3030', borderRadius:8, padding:'8px 12px', color:'#e08070', fontSize:12, marginTop:4 },
  };

  const crmvOk = /^[A-Za-z]{2}[\s-]?\d{2,6}$/.test(crmvCad.trim());
  const ok = !loading && email.includes('@') && senha.length >= 6 && (modo==='login' || crmvOk);

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.logo}>
          <div style={{fontSize:40, marginBottom:8}}>🐎</div>
          <div style={{fontSize:20, fontWeight:700, color:'#d4a96a', letterSpacing:'0.05em'}}>EquiVet Clínica</div>
          <div style={{fontSize:11, color:'#6a7090', marginTop:4, textTransform:'uppercase', letterSpacing:'0.08em'}}>Centaurovet</div>
        </div>

        <div style={S.tabs}>
          {[['login','Entrar'],['cadastro','Criar conta']].map(([m,l])=>(
            <button key={m} style={S.tab(m)} onClick={()=>{setModo(m);setErro('');}}>{l}</button>
          ))}
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          <input type="email" placeholder="Email" value={email}
            onChange={e=>setEmail(e.target.value)} style={S.input} />
          <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={senha}
            onChange={e=>setSenha(e.target.value)}
            onKeyDown={e=>e.key==='Enter' && ok && (modo==='login' ? entrar() : cadastrar())}
            style={S.input} />
          {modo==='cadastro' && <>
            <input placeholder="CRMV (UF + número, ex: ES 1234)" value={crmvCad}
              onChange={e=>setCrmvCad(e.target.value)} style={S.input} />
            {crmvCad && !crmvOk && <div style={{fontSize:11, color:'#b0905a'}}>Formato: sigla do estado + número (ex: ES 1234)</div>}
          </>}
          {erro && <div style={S.erro}>{erro}</div>}
          {resetMsg && <div style={{background:'#1a2e1a', border:'1px solid #3a6a3a', borderRadius:8, padding:'8px 12px', color:'#8ac888', fontSize:12, marginTop:4}}>{resetMsg}</div>}
          <button onClick={modo==='login' ? entrar : cadastrar} disabled={!ok} style={S.btn(ok)}>
            {loading ? 'Aguarde...' : modo==='login' ? 'Entrar' : 'Criar conta'}
          </button>
          {modo==='login' && (
            <button onClick={redefinir} disabled={loading}
              style={{background:'none', border:'none', color:'#6a7090', fontSize:12, fontFamily:'Georgia,serif', cursor:loading?'default':'pointer', textDecoration:'underline', marginTop:8, padding:0}}>
              Esqueci minha senha
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// WRAPPER DE AUTENTICAÇÃO — verifica sessão e decide o que mostrar
// ============================================================================
function AuthWrapper() {
  const [user,     setUser]     = useState(null);
  const [checando, setChecando] = useState(true);
  const [recuperar,setRecuperar]= useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecando(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecuperar(true);
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checando) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1117'}}>
      <div style={{color:'#d4a96a', fontSize:15}}>🐎 Carregando...</div>
    </div>
  );

  if (recuperar) return <NovaSenhaScreen onDone={()=>setRecuperar(false)} />;

  if (!user) return <LoginScreen onLogin={setUser} />;

  return <App user={user} onLogout={()=>supabase.auth.signOut()} />;
}

// ============================================================================
// TELA DE NOVA SENHA — apos clicar no link de redefinicao recebido por email
// ============================================================================
function NovaSenhaScreen({ onDone }) {
  const [senha,   setSenha]   = useState('');
  const [senha2,  setSenha2]  = useState('');
  const [erro,    setErro]    = useState('');
  const [ok,      setOk]      = useState(false);
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    if (senha.length < 6) { setErro('A senha deve ter no minimo 6 caracteres.'); return; }
    if (senha !== senha2) { setErro('As senhas nao coincidem.'); return; }
    setLoading(true); setErro('');
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) { setErro(traduzErroAuth(error.message)); setLoading(false); return; }
    setOk(true); setLoading(false);
    setTimeout(() => { supabase.auth.signOut().then(()=>onDone()); }, 2200);
  };

  const S = {
    wrap:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1117', padding:20 },
    card:  { background:'#15192a', border:'1px solid #2a3040', borderRadius:16, padding:32, width:'100%', maxWidth:360 },
    input: { background:'#0f1320', border:'1px solid #2a3040', borderRadius:8, padding:'10px 12px', color:'#e8e0d0', fontSize:14, width:'100%', fontFamily:'Georgia,serif' },
    btn:   (a)=>({ background:a?'#d4a96a':'#2a3040', color:a?'#1a1510':'#4a5060', border:'none', borderRadius:8, padding:'12px', fontSize:15, fontWeight:700, cursor:a?'pointer':'default', fontFamily:'Georgia,serif', width:'100%', marginTop:4 }),
    erro:  { background:'#3a1a1a', border:'1px solid #6a3030', borderRadius:8, padding:'8px 12px', color:'#e08070', fontSize:12, marginTop:4 },
    good:  { background:'#1a2e1a', border:'1px solid #3a6a3a', borderRadius:8, padding:'8px 12px', color:'#8ac888', fontSize:12, marginTop:4 },
  };
  const valido = !loading && senha.length >= 6 && senha === senha2;

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={{textAlign:'center', marginBottom:24}}>
          <div style={{fontSize:40, marginBottom:8}}>🔑</div>
          <div style={{fontSize:18, fontWeight:700, color:'#d4a96a'}}>Definir nova senha</div>
        </div>
        {ok ? (
          <div style={S.good}>Senha redefinida com sucesso! Faca login com a nova senha.</div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            <input type="password" placeholder="Nova senha (minimo 6 caracteres)" value={senha}
              onChange={e=>setSenha(e.target.value)} style={S.input} />
            <input type="password" placeholder="Confirmar nova senha" value={senha2}
              onChange={e=>setSenha2(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && valido && salvar()} style={S.input} />
            {erro && <div style={S.erro}>{erro}</div>}
            <button onClick={salvar} disabled={!valido} style={S.btn(valido)}>
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// APP PRINCIPAL
// ============================================================================
function App({ user, onLogout }){
  const [aba,setAba]         = useState("prescricoes");
  const [paciente,setPac]    = useState("");
  const [prop,setProp]       = useState("");
  const [custom,setCustom]   = useState({});
  const [extra,setExtra]     = useState([]);
  const [baseTags,setBaseTags] = useState({});
  const [filtro,setFiltro]   = useState("Todas");
  const [tela,setTela]       = useState("lista");
  const [aberta,setAberta]   = useState(null);
  const [texto,setTexto]     = useState("");
  const [salvo,setSalvo]     = useState(false);
  const [confReset,setCR]    = useState(false);
  const [confDel,setCD]      = useState(false);
  const [novoTit,setNT]      = useState("");
  const [novoCat,setNC]      = useState("Clinica Geral");
  const [novoCatC,setNCC]    = useState("");
  const [novoIcon,setNI]     = useState("🐎");
  const [novoQ,setNovoQ]     = useState([]);
  const [editTags,setEditTags] = useState([]);
  const [visita,setVisita]   = useState(true);
  const [vlVisita,setVlVisita] = useState(()=>{const p=lsGet(LS_PRECOS,{}); return p.visita!==undefined?p.visita:lsGet("ev_vlvisita_v1","");});
  const [vlKm,setVlKm]       = useState(()=>lsGet(LS_PRECOS,{}).km||"");
  const [vlRx,setVlRx]       = useState(()=>lsGet(LS_PRECOS,{}).rx||"");
  const [km,setKm]           = useState("");
  const [rx,setRx]           = useState("");
  const [cirug,setCirug]     = useState(false);
  const [vlCirug,setVlC]     = useState(()=>lsGet(LS_PRECOS,{}).cirug||"");
  const [descC,setDescC]     = useState("Procedimento cirurgico");
  const [itens,setItens]     = useState([]);
  const [avulso,setAvulso]   = useState({nome:"",valor:""});
  const [copiado,setCopiado] = useState(false);
  const [crmv,setCrmv]       = useState(()=>(user&&user.user_metadata&&user.user_metadata.crmv)||lsGet(LS_CRMV,""));
  const [pix,setPix]         = useState(()=>lsGet(LS_PIX,""));
  const [showConfig,setShowConfig] = useState(false);

  // ---- ATENDIMENTO ----
  const [data,setData]            = useState(todayISO());
  const [queixa,setQueixa]        = useState("");
  const [modoExame,setModoExame]  = useState("focado");
  const [anamnese,setAnamnese]    = useState({inicio:"",evolucao:"",manejoRecente:"",vermifugacao:"",vacinacao:"",alimentacao:"",obs:""});
  const [exGeral,setExGeral]      = useState({...EX_GERAL_INIT,motilidade:{...EX_GERAL_INIT.motilidade}});
  const [mods,setMods]            = useState(JSON.parse(JSON.stringify(MOD_INIT)));
  const [sugAceitas,setSugAceitas]= useState([]);
  const [atendimentos,setAtend]   = useState([]);
  const [showHist,setShowHist]    = useState(false);
  const [filtroPac,setFiltroPac]  = useState("");
  const [filtroDe,setFiltroDe]    = useState("");
  const [filtroAte,setFiltroAte]  = useState("");
  const [verTodosDiag,setVTD]     = useState(false);
  const [atendSalvo,setAS]        = useState(false);
  const [aviso,setAviso]          = useState("");
  const [confirma,setConfirma]    = useState(null); // {msg, acao}
  const avisar = m => { setAviso(m); setTimeout(()=>setAviso(""),3500); };
  const [salvoNuvem,setSN]        = useState(false); // true = gravado no Supabase

  // ---- FATURAS (controle de recebimento) ----
  const [faturas,setFaturas]      = useState([]);
  const [fatGerada,setFatGerada]  = useState(false);

  // ---- EXAMES (integração EquiVet Lab) ----
  const [atendVinculoId,setAtendVinculoId] = useState(null); // local_id do atendimento atual
  const [exames,setExames]        = useState([]);            // exames vinculados a esse atendimento
  const [exameAberto,setExameAberto] = useState(null);       // exame expandido (ver laudo)

  // ---- LITERATURA (consulta RAG ao backend) ----
  const [litPergunta,setLitP]     = useState("");
  const [litResposta,setLitR]     = useState("");
  const [litTemLit,setLitTL]      = useState(false);
  const [litLoading,setLitL]      = useState(false);
  const [litErro,setLitE]         = useState("");
  const [litUsarCtx,setLitCtx]    = useState(true);

  async function consultarLiteratura(){
    const pergunta = litPergunta.trim();
    if(!pergunta){ setLitE("Digite uma pergunta."); return; }
    setLitL(true); setLitE(""); setLitR(""); setLitTL(false);
    try{
      const { data: { session } } = await supabase.auth.getSession();
      const token = session && session.access_token;
      if(!token){ setLitE("Sessao expirada. Faca login novamente."); setLitL(false); return; }
      let contexto = "";
      if(litUsarCtx){
        const partes = [];
        if(paciente) partes.push("Paciente: "+paciente);
        const q = QUEIXAS.find(x=>x.id===queixa);
        if(q) partes.push("Queixa principal: "+q.label);
        const pront = buildProntuario({queixa,modoExame,anamnese,exGeral,mods});
        if(pront) partes.push(pront);
        contexto = partes.join("\n");
      }
      const res = await fetch(BACKEND_URL+"/literatura",{
        method:"POST",
        headers:{ "Content-Type":"application/json", "Authorization":"Bearer "+token },
        body: JSON.stringify({ pergunta, contexto: contexto||null })
      });
      if(res.status===429){
        const j = await res.json().catch(()=>({}));
        setLitE(j.detail || "Voce atingiu o limite de consultas de IA do plano gratuito. Assine o Premium para consultas ilimitadas.");
        setLitL(false); return;
      }
      if(!res.ok){
        const t = await res.text().catch(()=>"");
        setLitE("Erro "+res.status+(t?": "+t.slice(0,160):"")); setLitL(false); return;
      }
      const json = await res.json();
      setLitR(json.resposta||"(sem resposta)");
      setLitTL(!!json.tem_literatura);
    }catch(e){ setLitE("Falha de conexao com o servidor."); }
    setLitL(false);
  }

  useEffect(()=>{
    setCustom(lsGet(LS1,{}));
    setExtra(lsGet(LS2,[]));
    setAtend(lsGet(LS3,[]));
    setBaseTags(lsGet(LS_TAGS,{}));
    setFaturas(lsGet(LS_FAT,[]));
  },[]);

  useEffect(()=>{ lsSet(LS3,atendimentos); },[atendimentos]);
  useEffect(()=>{ lsSet(LS_FAT,faturas); },[faturas]);

  // ---- SYNC COM A NUVEM (Supabase) ----
  const sbParaLocal = r => ({
    id: r.local_id || "sb_"+r.id,
    data: r.data_atendimento, paciente: r.paciente_nome||"", prop: r.proprietario_nome||"",
    queixa: r.queixa, modoExame: r.modo_exame||"focado",
    anamnese: r.anamnese||{}, exGeral: r.exame_geral||null, mods: r.modulos||null,
    prontuarioTexto: r.prontuario_texto||"", criadoEm: r.criado_em||new Date().toISOString(),
  });
  const chave = a => (a.paciente||a.paciente_nome||"")+"|"+(a.data||a.data_atendimento||"")+"|"+((a.prontuarioTexto||a.prontuario_texto||"").length);

  useEffect(()=>{
    if(!user) return;
    (async()=>{
      try{
        const { data: rows, error } = await supabase.from('atendimentos')
          .select('*').eq('veterinario_id', user.id)
          .order('criado_em',{ascending:false}).limit(500);
        if(error||!rows){ if(error) console.warn('Sync: leitura falhou:', error.message); return; }
        const locais = lsGet(LS3,[]);
        const idsLocais   = new Set(locais.map(a=>a.id));
        const chavesLocais= new Set(locais.map(chave));
        const idsNuvem    = new Set(rows.map(r=>r.local_id).filter(Boolean));
        const chavesNuvem = new Set(rows.map(chave));
        // nuvem → local (restaura histórico em aparelho novo)
        const novos = rows.filter(r=>!idsLocais.has(r.local_id||("sb_"+r.id)) && !chavesLocais.has(chave(r))).map(sbParaLocal);
        if(novos.length){
          const merged=[...locais,...novos].sort((a,b)=>(b.criadoEm||"").localeCompare(a.criadoEm||"")).slice(0,500);
          setAtend(merged);
        }
        // local → nuvem (reenvia o que ficou offline)
        const pendentes = locais.filter(a=>!idsNuvem.has(a.id) && !chavesNuvem.has(chave(a)));
        for(const a of pendentes){
          await supabase.from('atendimentos').insert({
            local_id:a.id, data_atendimento:a.data, paciente_nome:a.paciente,
            proprietario_nome:a.prop||null, queixa:a.queixa, modo_exame:a.modoExame,
            anamnese:a.anamnese, exame_geral:a.exGeral, modulos:a.mods,
            prontuario_texto:a.prontuarioTexto, veterinario_id:user.id });
        }
        if(pendentes.length) console.log('Sync: '+pendentes.length+' atendimento(s) reenviado(s) à nuvem.');
      }catch(e){ console.warn('Sync nuvem indisponível:', e.message); }
    })();
  },[user]);
  // ---- SYNC DE FATURAS COM A NUVEM (Supabase) ----
  const sbFatParaLocal = r => ({
    id: r.local_id || "sb_"+r.id,
    dataEmissao: r.data_emissao, paciente: r.paciente_nome||"", prop: r.proprietario_nome||"",
    itens: r.itens||[], mensagem: r.mensagem||"", valorTotal: parseFloat(r.valor_total)||0,
    status: r.status||"aberta", pagoEm: r.pago_em||null, criadoEm: r.criado_em||new Date().toISOString(),
  });

  useEffect(()=>{
    if(!user) return;
    (async()=>{
      try{
        const { data: rows, error } = await supabase.from('faturas')
          .select('*').eq('veterinario_id', user.id)
          .order('criado_em',{ascending:false}).limit(500);
        if(error||!rows){ if(error) console.warn('Sync faturas: leitura falhou:', error.message); return; }
        const locais = lsGet(LS_FAT,[]);
        const porId  = new Map(locais.map(f=>[f.id,f]));
        const idsNuvem = new Set(rows.map(r=>r.local_id).filter(Boolean));
        let mudou = false;
        // nuvem → local: restaura faturas + reconcilia status ('paga' prevalece)
        for(const r of rows){
          const lid = r.local_id || "sb_"+r.id;
          const loc = porId.get(lid);
          if(!loc){ porId.set(lid, sbFatParaLocal(r)); mudou = true; }
          else if(loc.status!==r.status){
            if(loc.status==="paga"){
              // pagou offline → empurra para a nuvem
              supabase.from('faturas').update({status:"paga",pago_em:loc.pagoEm||new Date().toISOString()})
                .eq('id', r.id).then(()=>{},()=>{});
            } else {
              porId.set(lid, {...loc, status:"paga", pagoEm:r.pago_em||null}); mudou = true;
            }
          }
        }
        if(mudou){
          const merged=[...porId.values()].sort((a,b)=>(b.criadoEm||"").localeCompare(a.criadoEm||"")).slice(0,500);
          setFaturas(merged);
        }
        // local → nuvem: reenvia o que ficou offline
        const pendentes = locais.filter(f=>!String(f.id).startsWith("sb_") && !idsNuvem.has(f.id));
        for(const f of pendentes){
          await supabase.from('faturas').insert({
            local_id:f.id, data_emissao:f.dataEmissao, paciente_nome:f.paciente||"-",
            proprietario_nome:f.prop||null, itens:f.itens||[], mensagem:f.mensagem||"",
            valor_total:f.valorTotal, status:f.status||"aberta", pago_em:f.pagoEm||null,
            veterinario_id:user.id });
        }
        if(pendentes.length) console.log('Sync: '+pendentes.length+' fatura(s) reenviada(s) à nuvem.');
      }catch(e){ console.warn('Sync faturas indisponível:', e.message); }
    })();
  },[user]);

  useEffect(()=>{ lsSet(LS_TAGS,baseTags); },[baseTags]);
  useEffect(()=>{
    lsSet(LS_CRMV,crmv);
    const t=setTimeout(()=>{
      if(crmv && user && (!user.user_metadata||user.user_metadata.crmv!==crmv))
        supabase.auth.updateUser({ data:{ crmv } }).then(()=>{},()=>{});
    },1500);
    return ()=>clearTimeout(t);
  },[crmv]);
  useEffect(()=>{ lsSet(LS_PIX,pix); },[pix]);

  // Reset de aceitas ao trocar queixa
  useEffect(()=>{ setSugAceitas([]); setVTD(false); },[queixa]);

  // Tags efetivas (BASE pode ter tag override em LS_TAGS)
  const getTags = p => {
    if(p.id in baseTags) return baseTags[p.id];
    return p.queixas||[];
  };

  const todas = [...BASE,...extra];
  const cats  = ["Todas",...new Set(todas.map(p=>p.categoria))];
  const lista = filtro==="Todas"?todas:todas.filter(p=>p.categoria===filtro);
  const getTpl  = p => custom[p.id]!==undefined?custom[p.id]:p.template;
  const isPers  = p => custom[p.id]!==undefined;
  const isExtra = p => extra.some(e=>e.id===p.id);

  const inject = txt => {
    const hoje = new Date().toLocaleDateString("pt-BR");
    return txt.replace(/\[DATA\]/g,hoje)
      .replace(/\[NOME DO ANIMAL[^\]]*\]/g,paciente||"[NOME DO ANIMAL]")
      .replace(/\[NOME DO PROPRIETARIO\]/g,prop||"[NOME DO PROPRIETARIO]")
      .replace(/CRMV-\[UF\] \[No\]/g, crmv ? "CRMV-"+crmv : "CRMV-[UF] [No]");
  };

  const abrirEditor = p => {
    setTexto(inject(getTpl(p)));
    setAberta(p);
    setEditTags(getTags(p));
    setSalvo(false); setCR(false); setCD(false); setTela("editor");
  };

  const salvar = () => {
    if(!aberta) return;
    const hoje = new Date().toLocaleDateString("pt-BR");
    let tpl = texto;
    if(paciente) tpl=tpl.replace(new RegExp(paciente.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"),"[NOME DO ANIMAL]");
    if(prop)     tpl=tpl.replace(new RegExp(prop.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"),"[NOME DO PROPRIETARIO]");
    tpl=tpl.replace(hoje,"[DATA]");
    const u={...custom,[aberta.id]:tpl}; lsSet(LS1,u); setCustom(u);
    // Salvar tags
    if(isExtra(aberta)){
      const ue=extra.map(e=>e.id===aberta.id?{...e,queixas:editTags}:e);
      lsSet(LS2,ue); setExtra(ue);
      upsertPrescNuvem({local_id:String(aberta.id),titulo:aberta.titulo,categoria:aberta.categoria,icon:aberta.icon,queixas:editTags,template:tpl});
    } else {
      setBaseTags({...baseTags,[aberta.id]:editTags});
      upsertPrescNuvem({local_id:"ovr_"+aberta.id,titulo:aberta.titulo,categoria:aberta.categoria,icon:aberta.icon,queixas:editTags,template:tpl});
    }
    setSalvo(true); setTimeout(()=>setSalvo(false),3000);
  };

  const restaurar = () => {
    if(!aberta) return;
    const u={...custom}; delete u[aberta.id]; lsSet(LS1,u); setCustom(u);
    const bt={...baseTags}; delete bt[aberta.id]; setBaseTags(bt);
    setTexto(inject(aberta.template));
    setEditTags(aberta.queixas||[]);
    setCR(false);
    if(isExtra(aberta)) upsertPrescNuvem(extraParaNuvem({...aberta,queixas:aberta.queixas||[]}, {}));
    else delPrescNuvem("ovr_"+aberta.id);
  };

  const excluir = () => {
    if(!aberta||!isExtra(aberta)) return;
    const ue=extra.filter(e=>e.id!==aberta.id);
    const uc={...custom}; delete uc[aberta.id];
    lsSet(LS2,ue); lsSet(LS1,uc); setExtra(ue); setCustom(uc); setAberta(null); setTela("lista");
    delPrescNuvem(aberta.id);
  };

  const criar = () => {
    if(!novoTit.trim()) return;
    const cat = novoCatC.trim()||novoCat;
    const nova = {id:"cx_"+Date.now(),titulo:novoTit.trim(),categoria:cat,icon:novoIcon,template:NOVO_TPL(novoTit.trim()),queixas:novoQ};
    const ue=[...extra,nova]; lsSet(LS2,ue); setExtra(ue);
    upsertPrescNuvem(extraParaNuvem(nova, null));
    setNT(""); setNC("Clinica Geral"); setNCC(""); setNI("🐎"); setNovoQ([]);
    abrirEditor(nova);
  };

  const copiar = () => { copyToClipboard(texto); setCopiado(true); setTimeout(()=>setCopiado(false),2000); };

  // === SYNC DE PROTOCOLOS "MEU" COM A NUVEM (prescricoes_base) ===
  const upsertPrescNuvem = async reg => {
    if(!user) return;
    try{
      const { error } = await supabase.from('prescricoes_base').upsert({
        local_id: reg.local_id, titulo: reg.titulo, categoria: reg.categoria||null,
        icon: reg.icon||null, queixas: reg.queixas||[], template: reg.template,
        sistema:false, publica:false, criado_por:user.id,
      },{ onConflict:'criado_por,local_id' });
      if(error) console.warn('Protocolo: salvar na nuvem falhou:', error.message);
    }catch(e){ console.warn('Protocolo salvo só localmente:', e.message); }
  };

  const delPrescNuvem = localId => {
    if(!user) return;
    try{
      supabase.from('prescricoes_base').delete()
        .eq('criado_por', user.id).eq('local_id', String(localId))
        .then(({error})=>{ if(error) console.warn('Excluir protocolo na nuvem falhou:', error.message); });
    }catch(e){ console.warn('Excluir protocolo na nuvem indisponível:', e.message); }
  };

  const extraParaNuvem = (e, customMap) => ({
    local_id:String(e.id), titulo:e.titulo, categoria:e.categoria, icon:e.icon,
    queixas:e.queixas||[], template:(customMap&&customMap[e.id]!==undefined)?customMap[e.id]:e.template,
  });

  useEffect(()=>{
    if(!user) return;
    (async()=>{
      try{
        const { data: rows, error } = await supabase.from('prescricoes_base')
          .select('*').eq('criado_por', user.id).eq('sistema', false)
          .not('local_id','is',null).limit(500);
        if(error||!rows){ if(error) console.warn('Sync protocolos: leitura falhou:', error.message); return; }
        const locaisExtra  = lsGet(LS2,[]);
        const locaisCustom = lsGet(LS1,{});
        const locaisTags   = lsGet(LS_TAGS,{});
        const nuvemExtras = rows.filter(r=>!String(r.local_id).startsWith("ovr_"));
        const nuvemOvr    = rows.filter(r=>String(r.local_id).startsWith("ovr_"));
        // nuvem → local: restaura protocolos MEU ausentes (aparelho novo)
        const idsLocais = new Set(locaisExtra.map(e=>String(e.id)));
        const novos = nuvemExtras.filter(r=>!idsLocais.has(String(r.local_id)))
          .map(r=>({id:r.local_id,titulo:r.titulo,categoria:r.categoria||"Clinica Geral",icon:r.icon||"🐎",template:r.template,queixas:r.queixas||[]}));
        if(novos.length){ const ue=[...locaisExtra,...novos]; lsSet(LS2,ue); setExtra(ue); }
        // nuvem → local: edições de templates base (custom) e tags
        const c={...locaisCustom}, t={...locaisTags}; let mc=false, mt=false;
        for(const r of nuvemOvr){
          const bid=String(r.local_id).slice(4);
          if(!(bid in c) && r.template){ c[bid]=r.template; mc=true; }
          if(!(bid in t) && r.queixas && r.queixas.length){ t[bid]=r.queixas; mt=true; }
        }
        if(mc){ lsSet(LS1,c); setCustom(c); }
        if(mt){ lsSet(LS_TAGS,t); setBaseTags(t); }
        // local → nuvem: envia o que ficou offline
        const idsNuvem = new Set(nuvemExtras.map(r=>String(r.local_id)));
        for(const e of locaisExtra){
          if(!idsNuvem.has(String(e.id))) await upsertPrescNuvem(extraParaNuvem(e, locaisCustom));
        }
        const idsOvrNuvem = new Set(nuvemOvr.map(r=>String(r.local_id)));
        for(const bid of Object.keys(locaisCustom)){
          const b = BASE.find(x=>String(x.id)===String(bid));
          if(b && !idsOvrNuvem.has("ovr_"+bid)){
            await upsertPrescNuvem({local_id:"ovr_"+bid,titulo:b.titulo,categoria:b.categoria,icon:b.icon,
              queixas:locaisTags[bid]||b.queixas||[],template:locaisCustom[bid]});
          }
        }
      }catch(e){ console.warn('Sync protocolos indisponível:', e.message); }
    })();
  },[user]);

  // === COBRANCA ===
  const vV = visita?parseFloat(vlVisita)||0:0;
  const txKm = parseFloat(vlKm)||0;
  const txRx = parseFloat(vlRx)||0;
  const vK = km&&parseFloat(km)>0?parseFloat(km)*txKm:0;
  const nR = rx&&parseInt(rx)>0?parseInt(rx):0;
  const vR = nR*txRx;
  const vC = cirug&&vlCirug?parseFloat(vlCirug):0;
  const total = vV+vK+vR+vC+itens.reduce((a,i)=>a+i.valor*i.qty,0);

  const addAv = () => {
    if(!avulso.nome||!avulso.valor) return;
    setItens([...itens,{uid:Date.now(),nome:avulso.nome,valor:parseFloat(avulso.valor),qty:1}]);
    setAvulso({nome:"",valor:""});
  };

  const msg = () => {
    const hoje=new Date().toLocaleDateString("pt-BR");
    const ls=[];
    if(visita) ls.push("  - Visita clinica: R$ "+(parseFloat(vlVisita)||0).toFixed(2).replace(".",","));
    if(vK>0)   ls.push("  - Deslocamento ("+parseFloat(km).toFixed(0)+" km x R$ "+txKm.toFixed(2).replace(".",",")+"): R$ "+vK.toFixed(2).replace(".",","));
    if(vR>0)   ls.push("  - Radiografia"+(nR>1?"s":"")+" ("+nR+" posicao"+(nR>1?"oes":"")+" x R$ "+txRx.toFixed(2).replace(".",",")+"): R$ "+vR.toFixed(2).replace(".",","));
    if(vC>0)   ls.push("  - "+descC+": R$ "+vC.toFixed(2).replace(".",","));
    itens.forEach(i=>ls.push("  - "+i.nome+(i.qty>1?" (x"+i.qty+")":"")+": R$ "+(i.valor*i.qty).toFixed(2).replace(".",",")));
    return "Ola! Segue o atendimento:\n\nPaciente: "+(paciente||"-")+"\nProprietario: "+(prop||"-")+"\nData: "+hoje+"\n\n"+ls.join("\n")+"\n\nTOTAL: R$ "+total.toFixed(2).replace(".",",")+"\n\nChave PIX: "+(pix||"[SEU PIX]")+"\nDr. Ricardo | CRMV-"+(crmv||"[UF] [No]");
  };

  // === FATURAS (controle de recebimento) ===
  const itensFatura = () => {
    const ls=[];
    if(visita)      ls.push({nome:"Visita clinica",valor:vV});
    if(vK>0)        ls.push({nome:"Deslocamento ("+(parseFloat(km)||0)+" km)",valor:vK});
    if(vR>0)        ls.push({nome:"Radiografia"+(nR>1?"s":"")+" ("+nR+" posic"+(nR>1?"oes":"ao")+")",valor:vR});
    if(cirug&&vC>0) ls.push({nome:descC||"Cirurgia",valor:vC});
    itens.forEach(i=>ls.push({nome:i.nome+(i.qty>1?" (x"+i.qty+")":""),valor:i.valor*i.qty}));
    return ls;
  };

  const gerarFatura = async () => {
    if(total<=0){ avisar("Adicione ao menos um servico para gerar a fatura."); return; }
    const f = {
      id:"ft_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7),
      dataEmissao: todayISO(), paciente: paciente.trim()||"-", prop: prop.trim(),
      itens: itensFatura(), mensagem: msg(), valorTotal: total,
      status:"aberta", pagoEm:null, criadoEm:new Date().toISOString(),
    };
    setFaturas([f,...faturas].slice(0,500));
    setFatGerada(true); setTimeout(()=>setFatGerada(false),3000);
    lsSet(LS_PRECOS,{visita:vlVisita,km:vlKm,rx:vlRx,cirug:vlCirug});
    try{
      const { error } = await supabase.from('faturas').insert({
        local_id:f.id, data_emissao:f.dataEmissao, paciente_nome:f.paciente,
        proprietario_nome:f.prop||null, itens:f.itens, mensagem:f.mensagem,
        valor_total:f.valorTotal, status:"aberta", veterinario_id:user.id });
      if(error) console.warn('Fatura: salvar na nuvem falhou:', error.message);
    }catch(e){ console.warn('Fatura salva só localmente:', e.message); }
  };

  const marcarFaturaPaga = f => {
    const pagoEm = new Date().toISOString();
    setFaturas(faturas.map(x=>x.id===f.id?{...x,status:"paga",pagoEm}:x));
    try{
      const q = String(f.id).startsWith("sb_")
        ? supabase.from('faturas').update({status:"paga",pago_em:pagoEm}).eq('id', String(f.id).slice(3))
        : supabase.from('faturas').update({status:"paga",pago_em:pagoEm}).eq('local_id', f.id);
      q.then(({error})=>{ if(error) console.warn('Fatura: atualizar na nuvem falhou:', error.message); });
    }catch(e){ console.warn('Fatura atualizada só localmente:', e.message); }
  };

  const excluirFatura = f => setConfirma({
    msg:"Excluir esta fatura? (sera removida tambem da nuvem)",
    acao:()=>{
      setFaturas(faturas.filter(x=>x.id!==f.id));
      try{
        const q = String(f.id).startsWith("sb_")
          ? supabase.from('faturas').delete().eq('id', String(f.id).slice(3))
          : supabase.from('faturas').delete().eq('local_id', f.id);
        q.then(({error})=>{ if(error) console.warn('Excluir fatura na nuvem falhou:', error.message); });
      }catch(e){ console.warn('Excluir fatura na nuvem indisponível:', e.message); }
    }});

  // === SUGESTOES ===
  const regrasAtivas = useMemo(()=>{
    if(!queixa) return [];
    const e={queixa,...mods};
    return REGRAS.filter(r=>r.queixa===queixa&&r.cond(e));
  },[queixa,mods]);

  const sugeridosNomes = useMemo(()=>new Set(regrasAtivas.flatMap(r=>r.sug)),[regrasAtivas]);
  const sugeridosIds = useMemo(()=>todas.filter(d=>sugeridosNomes.has(d.titulo)).map(d=>d.id),[sugeridosNomes,extra]);

  // Diagnosticos relevantes para a queixa
  const diagsRelevantes = useMemo(()=>{
    if(!queixa) return todas;
    return todas.filter(t=>{const tg=getTags(t);return !tg.length||tg.includes(queixa);});
  },[queixa,extra,custom,baseTags]);

  const diagsOutros = useMemo(()=>{
    if(!queixa) return [];
    return todas.filter(t=>{const tg=getTags(t);return tg.length&&!tg.includes(queixa);});
  },[queixa,extra,custom,baseTags]);

  const ordenar = lst => [...lst].sort((a,b)=>{
    const aS=sugeridosIds.includes(a.id)?0:1;
    const bS=sugeridosIds.includes(b.id)?0:1;
    if(aS!==bS) return aS-bS;
    return a.titulo.localeCompare(b.titulo,"pt-BR");
  });

  // === SALVAR ATENDIMENTO ===
  const salvarAtendimento = async () => {
    if(!paciente.trim()){ avisar("Informe o nome do animal no cabecalho."); return; }
    if(!queixa){ avisar("Selecione uma queixa principal."); return; }

    const prontuarioTexto = buildProntuario({queixa,modoExame,anamnese,exGeral,mods});
    const exGeralFinal = modoExame==="completo"?{...exGeral,motilidade:{...exGeral.motilidade}}:null;
    const modsFinal = JSON.parse(JSON.stringify(mods));

    // 1. Salva no localStorage (sempre — funciona offline)
    const reg = {
      id:newId(),
      data,
      paciente:paciente.trim(),
      prop:prop.trim(),
      queixa,
      modoExame,
      anamnese:{...anamnese},
      exGeral:exGeralFinal,
      mods:modsFinal,
      prontuarioTexto,
      criadoEm:new Date().toISOString(),
    };
    setAtend([reg,...atendimentos].slice(0,500));
    setAtendVinculoId(reg.id);   // passa a ser o atendimento "atual" para vincular exames
    setAS(true); setTimeout(()=>setAS(false),4000);

    // 2. Salva no Supabase (em paralelo — não bloqueia se falhar)
    setSN(false);
    try {
      const { error } = await supabase.from('atendimentos').insert({
        local_id:          reg.id,
        data_atendimento:  data,
        paciente_nome:     paciente.trim(),
        proprietario_nome: prop.trim() || null,
        queixa,
        modo_exame:        modoExame,
        anamnese:          {...anamnese},
        exame_geral:       exGeralFinal,
        modulos:           modsFinal,
        prontuario_texto:  prontuarioTexto,
        veterinario_id:    user.id,
      });
      if(!error){ setSN(true); setTimeout(()=>setSN(false),4000); }
      else { console.warn('Supabase save error:', error.message); }
    } catch(e) {
      console.warn('Supabase offline, dado salvo só localmente:', e.message);
    }
    return reg.id;   // usado por abrirLabExames
  };

  // ---- EXAMES: integração com o EquiVet Lab ----
  const carregarExames = async (atendId) => {
    if(!atendId || !user){ setExames([]); return; }
    try{
      const { data, error } = await supabase.from('exames')
        .select('*').eq('atendimento_local_id', atendId)
        .order('criado_em',{ascending:false});
      if(!error && data) setExames(data);
    }catch(e){ console.warn('Exames: leitura falhou:', e.message); }
  };

  // Abre o EquiVet Lab vinculado ao atendimento atual (salva antes se preciso).
  const abrirLabExames = async () => {
    let id = atendVinculoId;
    if(!id){
      if(!paciente.trim() || !queixa){ avisar("Preencha e salve o atendimento antes de anexar exames."); return; }
      id = await salvarAtendimento();
      if(!id) return;
    }
    const url = "https://centaurovet.com.br/equivet-lab/?atend=" + encodeURIComponent(id)
              + "&pac=" + encodeURIComponent(paciente.trim());
    window.open(url, "_blank", "noopener");
  };

  // Recarrega exames ao trocar de atendimento vinculado e ao voltar o foco à janela
  // (o vet fez o exame na aba do Lab e voltou ao Clínica).
  useEffect(()=>{ carregarExames(atendVinculoId); },[atendVinculoId, user]);
  useEffect(()=>{
    const onFocus = ()=>{ if(atendVinculoId) carregarExames(atendVinculoId); };
    window.addEventListener('focus', onFocus);
    return ()=>window.removeEventListener('focus', onFocus);
  },[atendVinculoId]);

  const limparAtendimento = () => setConfirma({
    msg:"Limpar o formulario de atendimento atual? (paciente e proprietario do cabecalho serao mantidos)",
    acao:()=>{
    setQueixa(""); setModoExame("focado");
    setAnamnese({inicio:"",evolucao:"",manejoRecente:"",vermifugacao:"",vacinacao:"",alimentacao:"",obs:""});
    setExGeral({...EX_GERAL_INIT,motilidade:{...EX_GERAL_INIT.motilidade}});
    setMods(JSON.parse(JSON.stringify(MOD_INIT)));
    setSugAceitas([]);
    setAtendVinculoId(null); setExames([]);
  }});

  const carregarHist = a => {
    setData(a.data); setPac(a.paciente); setProp(a.prop||"");
    setQueixa(a.queixa); setModoExame(a.modoExame);
    setAnamnese({...a.anamnese});
    if(a.exGeral) setExGeral({...a.exGeral,motilidade:{...a.exGeral.motilidade}});
    else setExGeral({...EX_GERAL_INIT,motilidade:{...EX_GERAL_INIT.motilidade}});
    if(a.mods) setMods(JSON.parse(JSON.stringify(a.mods)));
    setAtendVinculoId(a.id);   // exames vinculados a este atendimento reaparecem
    setShowHist(false);
  };

  const excluirHist = id => setConfirma({
    msg:"Excluir este atendimento do historico? (sera removido tambem da nuvem)",
    acao:()=>{
    setAtend(atendimentos.filter(a=>a.id!==id));
    try{
      const q = String(id).startsWith("sb_")
        ? supabase.from('atendimentos').delete().eq('id', String(id).slice(3))
        : supabase.from('atendimentos').delete().eq('local_id', id);
      q.then(({error})=>{ if(error) console.warn('Excluir na nuvem falhou:', error.message); });
    }catch(e){ console.warn('Excluir na nuvem indisponível:', e.message); }
  }});

  const histFiltrado = atendimentos.filter(a=>{
    if(filtroPac && !a.paciente.toLowerCase().includes(filtroPac.toLowerCase())) return false;
    if(filtroDe  && a.data<filtroDe)  return false;
    if(filtroAte && a.data>filtroAte) return false;
    return true;
  });

  // Aplicar diagnostico do atendimento -> abrir editor de prescricao
  const aplicarDiag = tpl => {
    const prontuario = buildProntuario({queixa,modoExame,anamnese,exGeral,mods});
    let textoFinal = inject(getTpl(tpl));
    if(prontuario){
      // Inserir o exame antes do bloco de medicamentos
      const idx = textoFinal.indexOf("MEDICAMENTOS:");
      if(idx>0){
        textoFinal = textoFinal.slice(0,idx)+prontuario+"\n\n"+textoFinal.slice(idx);
      } else {
        textoFinal = textoFinal+"\n\n"+prontuario;
      }
    }
    setTexto(textoFinal); setAberta(tpl);
    setEditTags(getTags(tpl));
    setSalvo(false); setCR(false); setCD(false);
    setAba("prescricoes"); setTela("editor");
  };

  // === HELPERS DE UI ===
  const BtnV = ({onClick,children,style}) => <button onClick={onClick} style={{background:"#2a4a2a",color:C.green,border:"1px solid #3a6a3a",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:13,fontWeight:700,...style}}>{children}</button>;
  const BtnS = ({onClick,children,style}) => <button onClick={onClick} style={{background:"transparent",color:C.muted,border:"1px solid "+C.bord,borderRadius:8,padding:"6px 13px",cursor:"pointer",fontSize:13,...style}}>{children}</button>;
  const BtnP = ({onClick,children,style,disabled}) => <button onClick={onClick} disabled={disabled} style={{background:disabled?"#3a3a3a":C.gold,color:disabled?C.muted:"#0f1117",border:"none",borderRadius:8,padding:"8px 15px",cursor:disabled?"default":"pointer",fontSize:13,fontWeight:700,...style}}>{children}</button>;
  const Sec  = ({children}) => <div style={{fontSize:10,color:C.gold,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,marginTop:16}}>{children}</div>;

  const TagsEditor = ({val,onChange}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {QUEIXAS.filter(q=>q.id!=="outro").map(q=>{
        const on=val.includes(q.id);
        return <button key={q.id} onClick={()=>onChange(on?val.filter(x=>x!==q.id):[...val,q.id])}
          style={{background:on?q.cor+"22":"transparent",color:on?q.cor:C.muted,border:"1px solid "+(on?q.cor:C.bord),padding:"4px 10px",borderRadius:14,cursor:"pointer",fontSize:11,fontWeight:600}}>
          {q.icon} {q.curto}
        </button>;
      })}
    </div>
  );

  const TagPill = ({qid,size}) => {
    const q=QUEIXAS.find(x=>x.id===qid); if(!q) return null;
    return <span style={{background:q.cor+"22",color:q.cor,fontSize:size||9,padding:"1px 6px",borderRadius:6,fontWeight:600,marginRight:3}}>{q.curto}</span>;
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div style={{fontFamily:"Georgia,serif",background:C.bg,minHeight:"100vh",color:C.text}}>

      {/* HEADER */}
      <div style={{background:"linear-gradient(135deg,#1a1f2e,#0f1117)",borderBottom:"1px solid "+C.bord,padding:"16px 16px 0",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:26}}>🐎</span>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:700,color:C.gold}}>EquiVet Clinica</div>
            <div style={{fontSize:10,color:C.dim,letterSpacing:"0.08em",textTransform:"uppercase"}}>Atendimento &middot; Prescricoes &middot; Cobranca</div>
          </div>
          <button onClick={()=>{
              const base="https://centaurovet.com.br/equivet-lab/";
              const qs = atendVinculoId
                ? ("?atend="+encodeURIComponent(atendVinculoId)+"&pac="+encodeURIComponent(paciente.trim()))
                : (paciente.trim() ? ("?pac="+encodeURIComponent(paciente.trim())) : "");
              window.open(base+qs, "_blank", "noopener");
            }} title="Abrir EquiVet Lab (hemograma/bioquimico)"
            style={{background:"transparent",border:"1px solid #5a3030",borderRadius:8,padding:"5px 10px",
              color:"#d06a6a",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
            🩸 Lab
          </button>
          <button onClick={()=>setShowConfig(true)} title="Configuracoes do veterinario"
            style={{background:"transparent",border:"1px solid #2a3040",borderRadius:8,padding:"5px 10px",
              color:crmv?C.gold:C.dim,fontSize:13,cursor:"pointer"}}>
            ⚙️
          </button>
          {onLogout && (
            <button onClick={onLogout} title={"Sair: "+user?.email}
              style={{background:"transparent",border:"1px solid #2a3040",borderRadius:8,padding:"5px 10px",
                color:C.dim,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>
              Sair
            </button>
          )}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
          <input placeholder="Nome do animal" value={paciente} onChange={e=>setPac(e.target.value)} style={{...IS,width:"auto",flex:1,minWidth:140,fontSize:13}}/>
          <input placeholder="Proprietario" value={prop} onChange={e=>setProp(e.target.value)} style={{...IS,width:"auto",flex:1,minWidth:140,fontSize:13}}/>
        </div>
        <div style={{display:"flex",overflowX:"auto"}}>
          {[["atendimento","Atendimento"],["prescricoes","Prescricoes"],["cobranca","Cobranca"],["literatura","Literatura"]].map(([a,l])=>(
            <button key={a} onClick={()=>{setAba(a);if(a!=="prescricoes")setTela("lista");}} style={{background:aba===a?C.gold:"transparent",color:aba===a?"#0f1117":C.muted,border:"none",padding:"8px 16px",cursor:"pointer",fontSize:12,fontWeight:700,textTransform:"uppercase",borderRadius:"6px 6px 0 0",whiteSpace:"nowrap"}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"16px",paddingBottom:80}}>

        {/* ====================== ABA ATENDIMENTO ====================== */}
        {aba==="atendimento"&&<div>

          {/* Cabecalho atendimento */}
          <div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:10,padding:14,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.gold,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>📋 Cabecalho do atendimento</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
              <Field label="Data"><input type="date" value={data} onChange={e=>setData(e.target.value)} style={{...IS,width:160}}/></Field>
              <div style={{flex:1,minWidth:200,fontSize:11,color:C.dim,paddingBottom:14}}>
                Paciente e proprietario sao preenchidos no topo da tela. Atual: <strong style={{color:C.text}}>{paciente||"-"}</strong> / <strong style={{color:C.text}}>{prop||"-"}</strong>
              </div>
              <BtnS onClick={()=>setShowHist(true)} style={{paddingBottom:14}}>📚 Historico ({atendimentos.length})</BtnS>
            </div>
          </div>

          {/* Anamnese */}
          <div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:10,padding:14,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.gold,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>📝 Anamnese</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
              <Field label="Inicio / tempo de evolucao"><input value={anamnese.inicio} onChange={e=>setAnamnese({...anamnese,inicio:e.target.value})} placeholder="Ha 6 horas, ha 3 dias..." style={IS}/></Field>
              <Field label="Evolucao">
                <select value={anamnese.evolucao} onChange={e=>setAnamnese({...anamnese,evolucao:e.target.value})} style={IS}>
                  <option value="">—</option><option>Aguda</option><option>Progressiva</option><option>Intermitente</option><option>Cronica</option>
                </select>
              </Field>
              <Field label="Manejo recente"><input value={anamnese.manejoRecente} onChange={e=>setAnamnese({...anamnese,manejoRecente:e.target.value})} placeholder="Mudanca alim., transporte..." style={IS}/></Field>
              <Field label="Alimentacao"><input value={anamnese.alimentacao} onChange={e=>setAnamnese({...anamnese,alimentacao:e.target.value})} placeholder="Pasto, racao, feno..." style={IS}/></Field>
              <Field label="Vermifugacao"><input value={anamnese.vermifugacao} onChange={e=>setAnamnese({...anamnese,vermifugacao:e.target.value})} placeholder="Ultima dose / produto" style={IS}/></Field>
              <Field label="Vacinacao"><input value={anamnese.vacinacao} onChange={e=>setAnamnese({...anamnese,vacinacao:e.target.value})} placeholder="Em dia / atrasada / quais" style={IS}/></Field>
            </div>
            <Field label="Historico relevante / observacoes do proprietario">
              <textarea rows={2} value={anamnese.obs} onChange={e=>setAnamnese({...anamnese,obs:e.target.value})} style={{...IS,resize:"vertical"}}/>
            </Field>
          </div>

          {/* Queixa */}
          <div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:10,padding:14,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.gold,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>🎯 Queixa principal <span style={{textTransform:"none",letterSpacing:0,color:C.dim,marginLeft:8,fontWeight:400,fontStyle:"italic",fontSize:11}}>define o modulo de exame</span></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8,marginBottom:queixa?12:0}}>
              {QUEIXAS.map(q=>{
                const on=queixa===q.id;
                return <button key={q.id} onClick={()=>setQueixa(q.id)}
                  style={{background:on?q.cor+"22":C.card,color:on?q.cor:C.text,border:"2px solid "+(on?q.cor:C.bord),borderRadius:10,padding:"10px 12px",cursor:"pointer",fontSize:13,fontWeight:on?700:500,textAlign:"left",transition:"all .15s"}}>
                  <div style={{fontSize:18,marginBottom:2}}>{q.icon}</div>
                  {q.label}
                </button>;
              })}
            </div>
            {queixa&&<div style={{display:"flex",gap:14,alignItems:"center",padding:"10px 12px",background:"#0f1320",borderRadius:8,flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:C.muted,fontWeight:700}}>Modo de exame:</span>
              {[["focado","Focado (so o modulo)"],["completo","Completo (geral + modulo)"]].map(([v,l])=>(
                <label key={v} style={{display:"flex",gap:5,alignItems:"center",cursor:"pointer",fontSize:13,color:modoExame===v?C.gold:C.muted}}>
                  <input type="radio" name="modo" value={v} checked={modoExame===v} onChange={()=>setModoExame(v)} style={{accentColor:C.gold}}/>
                  {l}
                </label>
              ))}
            </div>}
          </div>

          {/* Exame geral - so se queixa selecionada e modo completo (ou queixa "outro") */}
          {queixa&&(modoExame==="completo"||queixa==="outro")&&<ModCard queixaId="outro" titulo="Exame fisico geral">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:12}}>
              <Vital campo="fc"   valor={exGeral.fc}   onChange={v=>setExGeral({...exGeral,fc:v})}/>
              <Vital campo="fr"   valor={exGeral.fr}   onChange={v=>setExGeral({...exGeral,fr:v})}/>
              <Vital campo="temp" valor={exGeral.temp} onChange={v=>setExGeral({...exGeral,temp:v})}/>
              <Vital campo="tpc"  valor={exGeral.tpc}  onChange={v=>setExGeral({...exGeral,tpc:v})}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
              <Field label="Mucosas"><select value={exGeral.mucosa} onChange={e=>setExGeral({...exGeral,mucosa:e.target.value})} style={IS}><option value="">—</option>{MUCOSAS.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Hidratacao"><select value={exGeral.hidratacao} onChange={e=>setExGeral({...exGeral,hidratacao:e.target.value})} style={IS}><option value="">—</option>{HIDRAT.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Linfonodos"><select value={exGeral.linfonodos} onChange={e=>setExGeral({...exGeral,linfonodos:e.target.value})} style={IS}><option value="">—</option>{LINFON.map(o=><option key={o}>{o}</option>)}</select></Field>
            </div>
            <div style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Motilidade intestinal (4 quadrantes)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8}}>
                {QUADS.map(q=>(
                  <Field key={q} label={"Q. "+q}>
                    <select value={exGeral.motilidade[q]} onChange={e=>setExGeral({...exGeral,motilidade:{...exGeral.motilidade,[q]:e.target.value}})} style={{...IS,fontSize:12}}>
                      <option value="">—</option>{MOTI.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </Field>
                ))}
              </div>
            </div>
            <Field label="Observacoes do exame geral">
              <textarea rows={2} value={exGeral.obs} onChange={e=>setExGeral({...exGeral,obs:e.target.value})} style={{...IS,resize:"vertical"}}/>
            </Field>
          </ModCard>}

          {/* MODULO COLICA */}
          {queixa==="colica"&&<ModCard queixaId="colica" titulo="Modulo Colica / Abdome agudo">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
              <Field label="Grau de dor (0-5)">
                <select value={mods.colica.dor} onChange={e=>setMods({...mods,colica:{...mods.colica,dor:e.target.value}})} style={IS}>
                  <option value="">—</option>{COL_DOR.map(d=><option key={d.v} value={d.v}>{d.l}</option>)}
                </select>
              </Field>
              <Field label="Frequencia da dor">
                <select value={mods.colica.freqDor} onChange={e=>setMods({...mods,colica:{...mods.colica,freqDor:e.target.value}})} style={IS}>
                  <option value="">—</option><option>Continua</option><option>Intermitente curta</option><option>Intermitente longa</option><option>Cessou apos analgesia</option>
                </select>
              </Field>
            </div>
            <div style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Sondagem nasogastrica</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
                <Field label="Volume refluxo (L)"><input type="number" step="0.5" value={mods.colica.refluxoVol} onChange={e=>setMods({...mods,colica:{...mods.colica,refluxoVol:e.target.value}})} placeholder="0 = sem refluxo" style={IS}/></Field>
                <Field label="Aspecto"><select value={mods.colica.refluxoCor} onChange={e=>setMods({...mods,colica:{...mods.colica,refluxoCor:e.target.value}})} style={IS}><option value="">—</option>{COL_REFL.map(c=><option key={c}>{c}</option>)}</select></Field>
              </div>
            </div>
            <div style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Palpacao retal (selecione achados)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:6}}>
                {COL_PALP.map(p=>{
                  const on=mods.colica.palpacao.includes(p);
                  return <label key={p} style={{display:"flex",gap:6,alignItems:"center",cursor:"pointer",fontSize:12,color:on?C.gold:C.text,padding:"4px 6px",background:on?C.gold+"11":"transparent",borderRadius:4}}>
                    <input type="checkbox" checked={on} onChange={e=>{const nx=e.target.checked?[...mods.colica.palpacao,p]:mods.colica.palpacao.filter(x=>x!==p); setMods({...mods,colica:{...mods.colica,palpacao:nx}});}} style={{accentColor:C.gold}}/>
                    {p}
                  </label>;
                })}
              </div>
            </div>
            <div style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Laboratorial a beira do leito</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10}}>
                <Field label="Hto (%)" hint="ref 32-46"><input type="number" value={mods.colica.hto} onChange={e=>setMods({...mods,colica:{...mods.colica,hto:e.target.value}})} style={IS}/></Field>
                <Field label="PT (g/dL)" hint="ref 6-7,5"><input type="number" step="0.1" value={mods.colica.pt} onChange={e=>setMods({...mods,colica:{...mods.colica,pt:e.target.value}})} style={IS}/></Field>
                <Field label="Lactato" hint="ref <2"><input type="number" step="0.1" value={mods.colica.lactato} onChange={e=>setMods({...mods,colica:{...mods.colica,lactato:e.target.value}})} style={IS}/></Field>
              </div>
            </div>
            <Field label="Observacoes"><textarea rows={2} value={mods.colica.obs} onChange={e=>setMods({...mods,colica:{...mods.colica,obs:e.target.value}})} style={{...IS,resize:"vertical"}}/></Field>
          </ModCard>}

          {/* MODULO CLAUDICACAO */}
          {queixa==="claudic"&&<ModCard queixaId="claudic" titulo="Modulo Claudicacao / Locomotor">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
              <Field label="Grau AAEP (0-5)"><select value={mods.claudic.grade} onChange={e=>setMods({...mods,claudic:{...mods.claudic,grade:e.target.value}})} style={IS}><option value="">—</option>{CLA_GRADE.map(g=><option key={g.v} value={g.v}>{g.l}</option>)}</select></Field>
              <Field label="Membro"><select value={mods.claudic.membro} onChange={e=>setMods({...mods,claudic:{...mods.claudic,membro:e.target.value}})} style={IS}><option value="">—</option>{CLA_MEMBRO.map(m=><option key={m}>{m}</option>)}</select></Field>
              <Field label="Regiao suspeita"><select value={mods.claudic.regiao} onChange={e=>setMods({...mods,claudic:{...mods.claudic,regiao:e.target.value}})} style={IS}><option value="">—</option>{CLA_REGIAO.map(r=><option key={r}>{r}</option>)}</select></Field>
            </div>
            <div style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Observacao dinamica</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
                <Field label="Apoio em estacao"><select value={mods.claudic.apoio} onChange={e=>setMods({...mods,claudic:{...mods.claudic,apoio:e.target.value}})} style={IS}><option value="">—</option>{CLA_APOIO.map(o=><option key={o}>{o}</option>)}</select></Field>
                <Field label="Cabeceio (ant.)"><select value={mods.claudic.cabeceio} onChange={e=>setMods({...mods,claudic:{...mods.claudic,cabeceio:e.target.value}})} style={IS}><option value="">—</option><option>Ausente</option><option>Discreto</option><option>Marcado</option></select></Field>
                <Field label="Hike de anca (post.)"><select value={mods.claudic.anca} onChange={e=>setMods({...mods,claudic:{...mods.claudic,anca:e.target.value}})} style={IS}><option value="">—</option><option>Ausente</option><option>Discreto</option><option>Marcado</option></select></Field>
              </div>
            </div>
            <div style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Testes de flexao</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
                <Field label="Distal"><select value={mods.claudic.flexaoDistal} onChange={e=>setMods({...mods,claudic:{...mods.claudic,flexaoDistal:e.target.value}})} style={IS}><option value="">—</option>{CLA_FLEX.map(f=><option key={f}>{f}</option>)}</select></Field>
                <Field label="Proximal"><select value={mods.claudic.flexaoProximal} onChange={e=>setMods({...mods,claudic:{...mods.claudic,flexaoProximal:e.target.value}})} style={IS}><option value="">—</option>{CLA_FLEX.map(f=><option key={f}>{f}</option>)}</select></Field>
                <Field label="Espavin"><select value={mods.claudic.flexaoEspavin} onChange={e=>setMods({...mods,claudic:{...mods.claudic,flexaoEspavin:e.target.value}})} style={IS}><option value="">—</option>{CLA_FLEX.map(f=><option key={f}>{f}</option>)}</select></Field>
              </div>
            </div>
            <div style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Casco e bloqueios</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
                <Field label="Pinca de casco"><select value={mods.claudic.pincaCasco} onChange={e=>setMods({...mods,claudic:{...mods.claudic,pincaCasco:e.target.value}})} style={IS}><option value="">—</option>{CLA_PINCA.map(p=><option key={p}>{p}</option>)}</select></Field>
                <Field label="Bloqueio realizado"><input value={mods.claudic.bloqueio} onChange={e=>setMods({...mods,claudic:{...mods.claudic,bloqueio:e.target.value}})} placeholder="PD/PA, abaxial, alto palmar..." style={IS}/></Field>
              </div>
              {mods.claudic.bloqueio&&<Field label="Resposta ao bloqueio"><select value={mods.claudic.bloqueioResp} onChange={e=>setMods({...mods,claudic:{...mods.claudic,bloqueioResp:e.target.value}})} style={IS}><option value="">—</option>{CLA_BLOQ_RESP.map(r=><option key={r}>{r}</option>)}</select></Field>}
            </div>
            <Field label="Observacoes"><textarea rows={2} value={mods.claudic.obs} onChange={e=>setMods({...mods,claudic:{...mods.claudic,obs:e.target.value}})} style={{...IS,resize:"vertical"}}/></Field>
          </ModCard>}

          {/* MODULO RESPIR */}
          {queixa==="respir"&&<ModCard queixaId="respir" titulo="Modulo Respiratorio">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
              <Field label="Descarga nasal"><select value={mods.respir.descarga} onChange={e=>setMods({...mods,respir:{...mods.respir,descarga:e.target.value}})} style={IS}><option value="">—</option>{RES_DESC.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Tosse"><select value={mods.respir.tosse} onChange={e=>setMods({...mods,respir:{...mods.respir,tosse:e.target.value}})} style={IS}><option value="">—</option>{RES_TOSSE.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Padrao respiratorio"><select value={mods.respir.esforco} onChange={e=>setMods({...mods,respir:{...mods.respir,esforco:e.target.value}})} style={IS}><option value="">—</option>{RES_ESF.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Reinalacao"><select value={mods.respir.reinalacao} onChange={e=>setMods({...mods,respir:{...mods.respir,reinalacao:e.target.value}})} style={IS}><option value="">—</option><option>Nao realizada</option><option>Tolerada bem</option><option>Tosse provocada</option><option>Esforco aumentado</option></select></Field>
            </div>
            <div style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Ausculta toracica (selecione alteracoes)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:6}}>
                {RES_AUSC.map(o=>{
                  const on=mods.respir.ausculta.includes(o);
                  return <label key={o} style={{display:"flex",gap:6,alignItems:"center",cursor:"pointer",fontSize:12,color:on?C.gold:C.text,padding:"4px 6px",background:on?C.gold+"11":"transparent",borderRadius:4}}>
                    <input type="checkbox" checked={on} onChange={e=>{const nx=e.target.checked?[...mods.respir.ausculta,o]:mods.respir.ausculta.filter(x=>x!==o); setMods({...mods,respir:{...mods.respir,ausculta:nx}});}} style={{accentColor:C.gold}}/>
                    {o}
                  </label>;
                })}
              </div>
            </div>
            <Field label="Observacoes"><textarea rows={2} value={mods.respir.obs} onChange={e=>setMods({...mods,respir:{...mods.respir,obs:e.target.value}})} style={{...IS,resize:"vertical"}}/></Field>
          </ModCard>}

          {/* MODULO NEURO */}
          {queixa==="neuro"&&<ModCard queixaId="neuro" titulo="Modulo Neurologico">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
              <Field label="Estado mental"><select value={mods.neuro.estado} onChange={e=>setMods({...mods,neuro:{...mods.neuro,estado:e.target.value}})} style={IS}><option value="">—</option>{NEU_EST.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Postura"><select value={mods.neuro.postura} onChange={e=>setMods({...mods,neuro:{...mods.neuro,postura:e.target.value}})} style={IS}><option value="">—</option>{NEU_POS.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Ataxia (Mayhew 0-5)"><select value={mods.neuro.ataxia} onChange={e=>setMods({...mods,neuro:{...mods.neuro,ataxia:e.target.value}})} style={IS}><option value="">—</option>{NEU_AT.map(g=><option key={g.v} value={g.v}>{g.l}</option>)}</select></Field>
            </div>
            <div style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Nervos cranianos</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:6}}>
                {NEU_NC.map(o=>{
                  const on=mods.neuro.nervos.includes(o);
                  return <label key={o} style={{display:"flex",gap:6,alignItems:"center",cursor:"pointer",fontSize:12,color:on?C.gold:C.text,padding:"4px 6px",background:on?C.gold+"11":"transparent",borderRadius:4}}>
                    <input type="checkbox" checked={on} onChange={e=>{const nx=e.target.checked?[...mods.neuro.nervos,o]:mods.neuro.nervos.filter(x=>x!==o); setMods({...mods,neuro:{...mods.neuro,nervos:nx}});}} style={{accentColor:C.gold}}/>
                    {o}
                  </label>;
                })}
              </div>
            </div>
            <Field label="Observacoes"><textarea rows={2} value={mods.neuro.obs} onChange={e=>setMods({...mods,neuro:{...mods.neuro,obs:e.target.value}})} style={{...IS,resize:"vertical"}}/></Field>
          </ModCard>}

          {/* MODULO DERMATO */}
          {queixa==="dermato"&&<ModCard queixaId="dermato" titulo="Modulo Dermatologia">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
              <Field label="Duracao"><input value={mods.dermato.duracao} onChange={e=>setMods({...mods,dermato:{...mods.dermato,duracao:e.target.value}})} placeholder="2 semanas, 1 mes..." style={IS}/></Field>
              <Field label="Prurido"><select value={mods.dermato.prurido} onChange={e=>setMods({...mods,dermato:{...mods.dermato,prurido:e.target.value}})} style={IS}><option value="">—</option>{DER_PRU.map(o=><option key={o}>{o}</option>)}</select></Field>
            </div>
            {[["lesaoPrim","Lesoes primarias",DER_PRIM],["lesaoSec","Lesoes secundarias",DER_SEC],["distribuicao","Distribuicao",DER_DIST]].map(([k,t,arr])=>(
              <div key={k} style={{marginTop:10,padding:"10px 12px",background:"#0f1320",borderRadius:8}}>
                <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{t}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:6}}>
                  {arr.map(o=>{
                    const on=mods.dermato[k].includes(o);
                    return <label key={o} style={{display:"flex",gap:6,alignItems:"center",cursor:"pointer",fontSize:12,color:on?C.gold:C.text,padding:"4px 6px",background:on?C.gold+"11":"transparent",borderRadius:4}}>
                      <input type="checkbox" checked={on} onChange={e=>{const nx=e.target.checked?[...mods.dermato[k],o]:mods.dermato[k].filter(x=>x!==o); setMods({...mods,dermato:{...mods.dermato,[k]:nx}});}} style={{accentColor:C.gold}}/>
                      {o}
                    </label>;
                  })}
                </div>
              </div>
            ))}
            <Field label="Tratamentos previos"><textarea rows={2} value={mods.dermato.tratPrev} onChange={e=>setMods({...mods,dermato:{...mods.dermato,tratPrev:e.target.value}})} style={{...IS,resize:"vertical"}}/></Field>
            <Field label="Observacoes"><textarea rows={2} value={mods.dermato.obs} onChange={e=>setMods({...mods,dermato:{...mods.dermato,obs:e.target.value}})} style={{...IS,resize:"vertical"}}/></Field>
          </ModCard>}

          {/* MODULO OFTALMO */}
          {queixa==="oftalmo"&&<ModCard queixaId="oftalmo" titulo="Modulo Oftalmologia">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
              <Field label="Olho afetado"><select value={mods.oftalmo.olho} onChange={e=>setMods({...mods,oftalmo:{...mods.oftalmo,olho:e.target.value}})} style={IS}><option value="">—</option>{OFT_OLHO.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Palpebra/blefaro"><select value={mods.oftalmo.blefaro} onChange={e=>setMods({...mods,oftalmo:{...mods.oftalmo,blefaro:e.target.value}})} style={IS}><option value="">—</option>{OFT_BLEF.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Cornea"><select value={mods.oftalmo.cornea} onChange={e=>setMods({...mods,oftalmo:{...mods.oftalmo,cornea:e.target.value}})} style={IS}><option value="">—</option>{OFT_COR.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Camara anterior"><select value={mods.oftalmo.camara} onChange={e=>setMods({...mods,oftalmo:{...mods.oftalmo,camara:e.target.value}})} style={IS}><option value="">—</option>{OFT_CAM.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="Fluoresceina"><select value={mods.oftalmo.fluoresceina} onChange={e=>setMods({...mods,oftalmo:{...mods.oftalmo,fluoresceina:e.target.value}})} style={IS}><option value="">—</option>{OFT_FLU.map(o=><option key={o}>{o}</option>)}</select></Field>
              <Field label="PIO (mmHg)" hint="ref 17-28"><input type="number" value={mods.oftalmo.pio} onChange={e=>setMods({...mods,oftalmo:{...mods.oftalmo,pio:e.target.value}})} style={IS}/></Field>
            </div>
            <Field label="Visao / reflexos"><input value={mods.oftalmo.visao} onChange={e=>setMods({...mods,oftalmo:{...mods.oftalmo,visao:e.target.value}})} placeholder="Ameaca, PLR, deslumbramento" style={IS}/></Field>
            <Field label="Observacoes"><textarea rows={2} value={mods.oftalmo.obs} onChange={e=>setMods({...mods,oftalmo:{...mods.oftalmo,obs:e.target.value}})} style={{...IS,resize:"vertical"}}/></Field>
          </ModCard>}

          {/* SUGESTOES */}
          {queixa&&regrasAtivas.length>0&&<div style={{background:"linear-gradient(135deg,#2e2418,#1f1a14)",border:"1px solid "+C.amber,borderLeft:"4px solid "+C.amber,borderRadius:10,padding:14,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.amber,marginBottom:4}}>✦ Sugestoes com base nos achados</div>
            <div style={{fontSize:11,color:"#a08060",marginBottom:10,fontStyle:"italic"}}>Apenas pistas. Confirme antes de aplicar.</div>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:6}}>
              {regrasAtivas.map(r=>{
                const on=sugAceitas.includes(r.id);
                return <li key={r.id}>
                  <label style={{display:"flex",gap:8,alignItems:"flex-start",cursor:"pointer",fontSize:13,color:C.text}}>
                    <input type="checkbox" checked={on} onChange={e=>setSugAceitas(e.target.checked?[...sugAceitas,r.id]:sugAceitas.filter(x=>x!==r.id))} style={{accentColor:C.amber,marginTop:3}}/>
                    <span><strong style={{color:C.amber}}>{r.rotulo}</strong><br/><em style={{color:C.dim,fontSize:11}}>→ {r.sug.join(", ")}</em></span>
                  </label>
                </li>;
              })}
            </ul>
          </div>}

          {/* DIAGNOSTICOS */}
          {queixa&&<div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:10,padding:14,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:C.gold,textTransform:"uppercase",letterSpacing:"0.05em"}}>💊 Diagnostico &amp; prescricao</div>
              {diagsOutros.length>0&&<BtnS onClick={()=>setVTD(!verTodosDiag)} style={{fontSize:11,padding:"4px 10px"}}>{verTodosDiag?"So relevantes":"Ver todos (+"+diagsOutros.length+")"}</BtnS>}
            </div>

            <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Relevantes para <strong style={{color:QUEIXAS.find(q=>q.id===queixa)?.cor}}>{QUEIXAS.find(q=>q.id===queixa)?.label}</strong>:</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,marginBottom:verTodosDiag?12:0}}>
              {ordenar(diagsRelevantes).map(t=>{
                const sug=sugeridosIds.includes(t.id);
                const tags=getTags(t);
                return <button key={t.id} onClick={()=>aplicarDiag(t)}
                  style={{position:"relative",background:sug?C.amberBg:C.card,border:"1px solid "+(sug?C.amber:C.bord),borderRadius:10,padding:"12px 10px",cursor:"pointer",textAlign:"left",color:C.text,fontFamily:"Georgia,serif"}}>
                  {sug&&<div style={{position:"absolute",top:-7,right:8,background:C.amber,color:"#0f1117",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:4,letterSpacing:"0.05em"}}>SUGERIDO</div>}
                  <div style={{fontSize:20,marginBottom:4}}>{renderIcon(t.icon)}</div>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:3,lineHeight:1.2}}>{t.titulo}</div>
                  {tags.length>0&&<div style={{marginTop:4}}>{tags.map(qid=><TagPill key={qid} qid={qid}/>)}</div>}
                </button>;
              })}
            </div>

            {verTodosDiag&&diagsOutros.length>0&&<>
              <div style={{fontSize:11,color:C.dim,marginTop:14,marginBottom:8,paddingTop:10,borderTop:"1px solid "+C.bord}}>Outros diagnosticos:</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                {ordenar(diagsOutros).map(t=>{
                  const tags=getTags(t);
                  return <button key={t.id} onClick={()=>aplicarDiag(t)}
                    style={{background:"#15192a",border:"1px solid "+C.bord,borderRadius:10,padding:"10px",cursor:"pointer",textAlign:"left",color:C.muted,fontFamily:"Georgia,serif",opacity:0.8}}>
                    <div style={{fontSize:18,marginBottom:3}}>{renderIcon(t.icon)}</div>
                    <div style={{fontSize:11,fontWeight:600,marginBottom:3,lineHeight:1.2}}>{t.titulo}</div>
                    {tags.length>0&&<div style={{marginTop:3}}>{tags.map(qid=><TagPill key={qid} qid={qid}/>)}</div>}
                  </button>;
                })}
              </div>
            </>}
          </div>}

          {/* AÇÕES FINAIS */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:16}}>
            <BtnP onClick={salvarAtendimento} disabled={!queixa} style={{flex:1,minWidth:200,padding:"12px"}}>{atendSalvo?"✓ Atendimento salvo":"💾 Salvar atendimento no historico"}</BtnP>
            <BtnS onClick={limparAtendimento}>Limpar formulario</BtnS>
          </div>
          {atendSalvo&&<div style={{background:"#1a2e1a",border:"1px solid #3a6a3a",borderRadius:8,padding:"8px 12px",marginTop:8,fontSize:13,color:C.green}}>
            ✓ Atendimento salvo {salvoNuvem ? "💾 local + ☁️ nuvem" : "💾 local"} — Total: {atendimentos.length+1}
          </div>}

          {/* EXAMES LABORATORIAIS — integração EquiVet Lab */}
          <Sec>Exames laboratoriais</Sec>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
            <BtnS onClick={abrirLabExames} style={{color:"#d06a6a",borderColor:"#5a3030"}}>🩸 Abrir no EquiVet Lab{atendVinculoId?"":" (salva o atendimento)"}</BtnS>
            {atendVinculoId&&<BtnS onClick={()=>carregarExames(atendVinculoId)}>↻ Atualizar</BtnS>}
          </div>
          <div style={{fontSize:11,color:C.dim,marginBottom:8,lineHeight:1.5}}>
            Abre o Lab com este paciente. O resultado (hemograma/bioquímico + laudo) fica vinculado e reaparece aqui — inclusive dias depois, quando o exame chegar.
          </div>
          {atendVinculoId&&exames.length===0&&<div style={{color:C.dim,fontSize:12,padding:"6px 0"}}>Nenhum exame vinculado ainda.</div>}
          {exames.map(ex=>{
            const nAlt=(ex.alteracoes||[]).length;
            const aberto=exameAberto===ex.id;
            return <div key={ex.id} style={{background:C.card,border:"1px solid "+C.bord,borderRadius:8,padding:"9px 12px",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setExameAberto(aberto?null:ex.id)}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>🩸 {ex.tipo==="sangue"?"Hemograma / Bioquímico":ex.tipo} {ex.laudo_ia?<span style={{color:C.gold,fontSize:11}}>· com laudo IA</span>:<span style={{color:C.dim,fontSize:11}}>· sem laudo</span>}</div>
                  <div style={{fontSize:11,color:C.dim}}>{(ex.criado_em||"").slice(0,10).split("-").reverse().join("/")} · {nAlt} alteraç{nAlt===1?"ão":"ões"}</div>
                </div>
                <span style={{color:C.muted,fontSize:13}}>{aberto?"▲":"▼"}</span>
              </div>
              {aberto&&<div style={{marginTop:8,borderTop:"1px solid "+C.bord,paddingTop:8}}>
                {nAlt>0&&<div style={{marginBottom:8}}>{(ex.alteracoes||[]).map((a,i)=>(
                  <div key={i} style={{fontSize:12,color:"#c8c0b0"}}><span style={{color:a.estado==="CRÍTICO"?"#c05050":a.estado==="ELEVADO"?"#d09050":"#5a9ab0",fontWeight:700}}>{a.estado}</span> {a.nome}: {a.valor} {a.unidade} <span style={{color:C.dim}}>(ref {a.ref})</span></div>
                ))}</div>}
                {ex.laudo_ia
                  ? <div style={{fontSize:12.5,color:C.text,whiteSpace:"pre-wrap",lineHeight:1.55,fontFamily:"Georgia,serif"}}>{ex.laudo_ia}</div>
                  : <div style={{fontSize:12,color:C.dim}}>Exame salvo sem laudo. Abra no Lab e use "Analisar por IA" para gerar.</div>}
              </div>}
            </div>;
          })}
        </div>}

        {/* ====================== ABA PRESCRICOES (LISTA) ====================== */}
        {aba==="prescricoes"&&tela==="lista"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {cats.map(c=><button key={c} onClick={()=>setFiltro(c)} style={{background:filtro===c?"#d4a96a22":"transparent",color:filtro===c?C.gold:C.muted,border:"1px solid "+(filtro===c?C.gold:C.bord),padding:"4px 10px",borderRadius:16,cursor:"pointer",fontSize:11}}>{c}</button>)}
            </div>
            <BtnV onClick={()=>setTela("novo")}>+ Novo</BtnV>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>
            {lista.map(p=>{
              const pers=isPers(p),ex=isExtra(p),bc=ex?"#3a5a8a":pers?"#3a6a3a":C.bord;
              const tags=getTags(p);
              return <div key={p.id} onClick={()=>abrirEditor(p)}
                style={{background:C.card,border:"1px solid "+bc,borderRadius:12,padding:"14px",cursor:"pointer",position:"relative",touchAction:"manipulation"}}
                onTouchStart={e=>e.currentTarget.style.background="#1e2438"}
                onTouchEnd={e=>e.currentTarget.style.background=C.card}>
                {ex&&<div style={{position:"absolute",top:8,right:8,fontSize:9,color:"#6a9abf",background:"#1a2a3e",border:"1px solid #3a5a8a",borderRadius:6,padding:"1px 5px"}}>MEU</div>}
                {!ex&&pers&&<div style={{position:"absolute",top:8,right:8,fontSize:9,color:C.green,background:"#1a2e1a",border:"1px solid #3a6a3a",borderRadius:6,padding:"1px 5px"}}>EDIT</div>}
                <div style={{fontSize:24,marginBottom:5}}>{renderIcon(p.icon)}</div>
                <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2,lineHeight:1.2}}>{p.titulo}</div>
                <div style={{fontSize:10,color:C.gold,textTransform:"uppercase",marginBottom:tags.length?4:0}}>{p.categoria}</div>
                {tags.length>0&&<div>{tags.map(qid=><TagPill key={qid} qid={qid}/>)}</div>}
              </div>;
            })}
          </div>
        </>}

        {/* ====================== NOVO ====================== */}
        {aba==="prescricoes"&&tela==="novo"&&<div>
          <BtnS onClick={()=>setTela("lista")} style={{marginBottom:16}}>Voltar</BtnS>
          <div style={{fontSize:17,fontWeight:700,color:C.gold,marginBottom:16}}>Novo diagnostico</div>

          <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Nome</div>
          <input value={novoTit} onChange={e=>setNT(e.target.value)} placeholder="Ex: Adenite Equina, Babesiose..." style={{...IS,marginBottom:16,fontSize:14}}/>

          <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Categoria</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
            {CATS.map(c=><button key={c} onClick={()=>{setNC(c);setNCC("");}} style={{background:(novoCat===c&&!novoCatC)?"#d4a96a22":"transparent",color:(novoCat===c&&!novoCatC)?C.gold:C.muted,border:"1px solid "+((novoCat===c&&!novoCatC)?C.gold:C.bord),padding:"5px 12px",borderRadius:18,cursor:"pointer",fontSize:12}}>{c}</button>)}
          </div>
          <input value={novoCatC} onChange={e=>setNCC(e.target.value)} placeholder="Ou digite categoria nova..." style={{...IS,marginBottom:16,fontSize:13}}/>

          <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Icone</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {ICONS.map(ic=><button key={ic} onClick={()=>setNI(ic)} style={{background:novoIcon===ic?"#d4a96a22":"transparent",border:"1px solid "+(novoIcon===ic?C.gold:C.bord),borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:22,lineHeight:1}}>{ic}</button>)}
          </div>

          <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Aplicavel a quais queixas? <span style={{textTransform:"none",letterSpacing:0,color:C.dim,fontStyle:"italic"}}>(sem nenhuma = aparece em todas)</span></div>
          <div style={{marginBottom:20}}><TagsEditor val={novoQ} onChange={setNovoQ}/></div>

          {novoTit.trim()&&<div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:10,padding:"12px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>{novoIcon}</span>
            <div>
              <div style={{fontWeight:700,color:C.text}}>{novoTit}</div>
              <div style={{fontSize:11,color:C.gold,textTransform:"uppercase"}}>{novoCatC||novoCat}</div>
              {novoQ.length>0&&<div style={{marginTop:4}}>{novoQ.map(qid=><TagPill key={qid} qid={qid}/>)}</div>}
            </div>
          </div>}

          <button onClick={criar} disabled={!novoTit.trim()} style={{background:novoTit.trim()?C.gold:"#3a3a3a",color:novoTit.trim()?"#0f1117":C.muted,border:"none",borderRadius:10,padding:"13px",cursor:novoTit.trim()?"pointer":"default",fontSize:15,fontWeight:700,width:"100%"}}>
            {novoTit.trim()?"Criar e editar protocolo":"Preencha o nome acima"}
          </button>
        </div>}

        {/* ====================== EDITOR ====================== */}
        {aba==="prescricoes"&&tela==="editor"&&aberta&&<div>
          <BtnS onClick={()=>setTela("lista")} style={{marginBottom:12}}>Voltar</BtnS>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:2}}>{renderIcon(aberta.icon)} {aberta.titulo}</div>
            <div style={{fontSize:11,color:C.dim}}>Edite livremente - salve para gravar</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
            <BtnV onClick={salvar} style={{background:salvo?"#1a3a1a":"#2a4a2a"}}>{salvo?"Salvo!":"Salvar modelo"}</BtnV>
            {!isExtra(aberta)&&isPers(aberta)&&!confReset&&<BtnS onClick={()=>setCR(true)}>Restaurar</BtnS>}
            {confReset&&<>
              <span style={{fontSize:12,color:"#c07050",alignSelf:"center"}}>Confirmar?</span>
              <BtnS onClick={restaurar} style={{color:"#c07050",borderColor:"#c07050"}}>Sim</BtnS>
              <BtnS onClick={()=>setCR(false)}>Nao</BtnS>
            </>}
            {isExtra(aberta)&&!confDel&&<BtnS onClick={()=>setCD(true)} style={{color:"#c07050",borderColor:"#5a3030"}}>Excluir</BtnS>}
            {confDel&&<>
              <span style={{fontSize:12,color:"#c07050",alignSelf:"center"}}>Excluir?</span>
              <BtnS onClick={excluir} style={{color:"#c07050",borderColor:"#c07050"}}>Sim</BtnS>
              <BtnS onClick={()=>setCD(false)}>Nao</BtnS>
            </>}
            <BtnP onClick={copiar}>{copiado?"Copiado!":"Copiar"}</BtnP>
          </div>
          {salvo&&<div style={{background:"#1a2e1a",border:"1px solid #3a6a3a",borderRadius:8,padding:"8px 12px",marginBottom:8,fontSize:13,color:C.green}}>Modelo salvo com sucesso!</div>}

          {/* Editor de tags */}
          <div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:8,padding:"10px 12px",marginBottom:8}}>
            <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Aplicavel a quais queixas? <span style={{textTransform:"none",letterSpacing:0,color:C.dim,fontStyle:"italic"}}>(sem marcas = todas)</span></div>
            <TagsEditor val={editTags} onChange={setEditTags}/>
          </div>

          <textarea value={texto} onChange={e=>setTexto(e.target.value)} style={{width:"100%",minHeight:420,background:C.card,border:"1px solid "+C.bord,borderRadius:10,color:C.text,fontFamily:"'Courier New',monospace",fontSize:13,lineHeight:1.75,padding:14,resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
          <div style={{fontSize:11,color:C.dim,marginTop:6}}>Preencha os [colchetes] e clique em Salvar modelo.</div>
        </div>}

        {/* ====================== COBRANCA ====================== */}
        {aba==="cobranca"&&<div>
          <Sec>Visita clinica</Sec>
          <div style={{background:visita?"#1e2e1e":C.card,border:"1px solid "+(visita?"#3a6a3a":C.bord),borderRadius:10,padding:"12px 14px",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:visita?10:0,cursor:"pointer",touchAction:"manipulation"}} onClick={()=>setVisita(!visita)}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:visita?C.green:C.muted}}>{visita?"Incluida":"Nao incluida"}</div>
                <div style={{fontSize:11,color:C.dim}}>Toque para alternar</div>
              </div>
              <div style={{fontSize:17,fontWeight:700,color:visita?C.gold:"#3a4a5a"}}>
                {vlVisita ? "R$ "+parseFloat(vlVisita).toFixed(2).replace(".",",") : "—"}
              </div>
            </div>
            {visita&&<div style={{display:"flex",alignItems:"center",gap:8}} onClick={e=>e.stopPropagation()}>
              <div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>R$</div>
              <input
                type="number" inputMode="decimal"
                value={vlVisita}
                onChange={e=>setVlVisita(e.target.value)}
                placeholder="Valor da visita"
                style={{...IS,flex:1,fontSize:14}}
              />
            </div>}
          </div>

          <Sec>Deslocamento</Sec>
          <div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:10,padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Quilometros</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <input type="number" min="0" placeholder="0" value={km} onChange={e=>setKm(e.target.value)} style={{...IS,width:70,fontSize:18,fontWeight:700,textAlign:"center"}}/>
                  <span style={{fontSize:12,color:C.dim}}>km x R$</span>
                  <input type="number" inputMode="decimal" min="0" placeholder="0,00" value={vlKm} onChange={e=>setVlKm(e.target.value)} style={{...IS,width:70,textAlign:"center"}}/>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:C.dim}}>Total</div>
                <div style={{fontSize:16,fontWeight:700,color:vK>0?C.gold:"#3a4a5a"}}>R$ {vK.toFixed(2).replace(".",",")}</div>
              </div>
            </div>
          </div>

          <Sec>Radiografias</Sec>
          <div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:10,padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Posicoes</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button onClick={()=>setRx(v=>Math.max(0,(parseInt(v)||0)-1).toString())} style={{background:"#2a3040",color:C.text,border:"none",borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
                  <input type="number" min="0" placeholder="0" value={rx} onChange={e=>setRx(e.target.value)} style={{...IS,width:60,fontSize:18,fontWeight:700,textAlign:"center"}}/>
                  <button onClick={()=>setRx(v=>((parseInt(v)||0)+1).toString())} style={{background:"#2a3040",color:C.text,border:"none",borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  <span style={{fontSize:12,color:C.dim}}>x R$</span>
                  <input type="number" inputMode="decimal" min="0" placeholder="0,00" value={vlRx} onChange={e=>setVlRx(e.target.value)} style={{...IS,width:70,textAlign:"center"}}/>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:C.dim}}>Total</div>
                <div style={{fontSize:16,fontWeight:700,color:vR>0?C.gold:"#3a4a5a"}}>R$ {vR.toFixed(2).replace(".",",")}</div>
              </div>
            </div>
          </div>

          <Sec>Cirurgia</Sec>
          <div style={{background:cirug?"#1e1a2e":C.card,border:"1px solid "+(cirug?"#5a3a8a":C.bord),borderRadius:10,padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:cirug?12:0}}>
              <div onClick={()=>setCirug(!cirug)} style={{width:36,height:20,borderRadius:10,cursor:"pointer",background:cirug?"#8a6abf":"#2a3040",position:"relative",flexShrink:0,touchAction:"manipulation"}}>
                <div style={{position:"absolute",top:3,left:cirug?18:3,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
              </div>
              <span style={{fontSize:14,color:cirug?"#b090e0":C.muted,fontWeight:600}}>Incluir cirurgia</span>
            </div>
            {cirug&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
              <input placeholder="Descricao" value={descC} onChange={e=>setDescC(e.target.value)} style={IS}/>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[2000,2500,3000].map(v=><button key={v} onClick={()=>setVlC(v.toString())} style={{background:vlCirug===v.toString()?"#5a3a8a":"#2a2040",color:vlCirug===v.toString()?"#e0d0ff":"#7a6a9a",border:"1px solid "+(vlCirug===v.toString()?"#8a6abf":"#3a3050"),borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:13,fontWeight:600}}>R$ {v.toLocaleString("pt-BR")}</button>)}
                <input type="number" placeholder="Outro" value={vlCirug} onChange={e=>setVlC(e.target.value)} style={{...IS,width:100}}/>
              </div>
            </div>}
          </div>

          <Sec>Item avulso</Sec>
          <input placeholder="Descricao" value={avulso.nome} onChange={e=>setAvulso({...avulso,nome:e.target.value})} style={{...IS,marginBottom:8}}/>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            <input placeholder="Valor R$" type="number" value={avulso.valor} onChange={e=>setAvulso({...avulso,valor:e.target.value})} style={{...IS,flex:1}}/>
            <BtnP onClick={addAv}>+ Add</BtnP>
          </div>

          <Sec>Resumo</Sec>
          {total===0&&<div style={{color:C.dim,fontSize:13,padding:"8px 0"}}>Nenhum servico selecionado.</div>}
          <LinhaCobranca label="Visita clinica" valor={vV} ativa={visita}/>
          <LinhaCobranca label={"Deslocamento ("+(parseFloat(km)||0)+" km)"} valor={vK} ativa={vK>0}/>
          <LinhaCobranca label={"Radiografia"+(nR!==1?"s":"")+" ("+nR+" posicao"+(nR!==1?"oes":"")+")"} valor={vR} ativa={vR>0}/>
          <LinhaCobranca label={descC||"Cirurgia"} valor={vC} ativa={cirug&&vC>0}/>
          {itens.map(i=><div key={i.uid} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,border:"1px solid "+C.bord,borderRadius:8,padding:"7px 10px",marginBottom:5,gap:6}}>
            <div style={{flex:1,fontSize:12,color:"#c8c0b0"}}>{i.nome}</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <button onClick={()=>setItens(itens.map(x=>x.uid===i.uid?{...x,qty:Math.max(1,x.qty-1)}:x))} style={{background:"#2a3040",color:C.text,border:"none",borderRadius:5,width:26,height:26,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
              <span style={{fontSize:12,minWidth:16,textAlign:"center"}}>{i.qty}</span>
              <button onClick={()=>setItens(itens.map(x=>x.uid===i.uid?{...x,qty:x.qty+1}:x))} style={{background:"#2a3040",color:C.text,border:"none",borderRadius:5,width:26,height:26,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
            <div style={{fontSize:12,color:C.gold,minWidth:60,textAlign:"right"}}>R$ {(i.valor*i.qty).toFixed(2).replace(".",",")}</div>
            <button onClick={()=>setItens(itens.filter(x=>x.uid!==i.uid))} style={{background:"none",border:"none",color:"#7a3a3a",cursor:"pointer",fontSize:16,padding:"0 2px"}}>x</button>
          </div>)}

          {total>0&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"2px solid #d4a96a44",paddingTop:12,marginTop:8,marginBottom:16}}>
              <span style={{fontWeight:700,fontSize:15}}>TOTAL</span>
              <span style={{fontWeight:700,fontSize:22,color:C.gold}}>R$ {total.toFixed(2).replace(".",",")}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <Sec style={{margin:0}}>Seus dados</Sec>
              <button onClick={()=>setShowConfig(true)} style={{background:"transparent",border:"none",color:C.gold,fontSize:11,cursor:"pointer",textDecoration:"underline",fontFamily:"Georgia,serif"}}>editar ⚙️</button>
            </div>
            <div style={{background:"#1a1f2e",border:"1px solid "+C.bord,borderRadius:8,padding:"10px 14px",marginBottom:10,fontSize:13}}>
              <div style={{display:"flex",gap:16}}>
                <div><span style={{color:C.muted,fontSize:11}}>CRMV: </span><span style={{color:crmv?C.text:C.dim}}>{crmv||"—  (configure em ⚙️)"}</span></div>
                <div><span style={{color:C.muted,fontSize:11}}>PIX: </span><span style={{color:pix?C.text:C.dim}}>{pix||"—"}</span></div>
              </div>
            </div>
            <Sec>Mensagem para o cliente</Sec>
            <textarea readOnly value={msg()} style={{...IS,minHeight:210,fontFamily:"'Courier New',monospace",fontSize:12,lineHeight:1.6,marginBottom:8,resize:"vertical"}}/>
            <BtnP onClick={()=>{copyToClipboard(msg());lsSet(LS_PRECOS,{visita:vlVisita,km:vlKm,rx:vlRx,cirug:vlCirug});setCopiado(true);setTimeout(()=>setCopiado(false),2000);}} style={{width:"100%",padding:"12px"}}>
              {copiado?"Copiado!":"Copiar mensagem"}
            </BtnP>
            <button onClick={gerarFatura}
              style={{width:"100%",padding:"12px",marginTop:8,background:fatGerada?"#2a4a2a":"transparent",color:fatGerada?C.green:C.gold,border:"1px solid "+(fatGerada?"#3a6a3a":C.gold),borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"Georgia,serif"}}>
              {fatGerada?"✓ Fatura gerada — em aberto":"Gerar fatura (fica em aberto ate marcar como paga)"}
            </button>
          </>}

          {faturas.length>0&&<>
            <Sec>Faturas ({faturas.filter(f=>f.status==="aberta").length} em aberto)</Sec>
            {faturas.map(f=>(
              <div key={f.id} style={{background:C.card,border:"1px solid "+(f.status==="aberta"?"#8a6a3a":C.bord),borderRadius:8,padding:"9px 12px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{f.paciente||"-"}</div>
                  <div style={{fontSize:11,color:C.dim}}>{(f.dataEmissao||"").split("-").reverse().join("/")}{f.prop?" · "+f.prop:""}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.gold}}>R$ {(f.valorTotal||0).toFixed(2).replace(".",",")}</div>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.05em",color:f.status==="paga"?C.green:"#e0a040"}}>{f.status==="paga"?"PAGA":"EM ABERTO"}</div>
                </div>
                {f.status==="aberta"
                  ? <button onClick={()=>marcarFaturaPaga(f)} style={{background:"#2a4a2a",color:C.green,border:"1px solid #3a6a3a",borderRadius:7,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>Marcar paga</button>
                  : <span style={{fontSize:15,color:C.green}}>✓</span>}
                <button onClick={()=>excluirFatura(f)} style={{background:"none",border:"none",color:"#7a3a3a",cursor:"pointer",fontSize:15,padding:"0 2px"}}>x</button>
              </div>
            ))}
            {faturas.some(f=>f.status==="aberta")&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,padding:"4px 2px"}}>
              <span>Total em aberto</span>
              <span style={{color:"#e0a040",fontWeight:700}}>R$ {faturas.filter(f=>f.status==="aberta").reduce((a,f)=>a+(f.valorTotal||0),0).toFixed(2).replace(".",",")}</span>
            </div>}
          </>}
        </div>}

        {/* ====================== LITERATURA ====================== */}
        {aba==="literatura"&&<div>
          <div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:10,padding:14,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.gold,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>📖 Consulta a literatura</div>
            <div style={{fontSize:12,color:C.dim,lineHeight:1.6,marginBottom:12}}>
              Busca nas referencias indexadas (Smith — Large Animal Surgery e Adams — Claudicacion) e responde com citacoes [Livro, p.X].
            </div>
            <textarea value={litPergunta} onChange={e=>setLitP(e.target.value)}
              placeholder="Ex: Qual o protocolo de tratamento para laminite aguda? Diferenciais de claudicacao de membro anterior?"
              style={{width:"100%",minHeight:90,background:"#121620",border:"1px solid "+C.bord,borderRadius:8,color:C.text,fontFamily:"Georgia,serif",fontSize:14,lineHeight:1.6,padding:12,resize:"vertical",boxSizing:"border-box",outline:"none",marginBottom:10}}/>
            <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.muted,marginBottom:12,cursor:"pointer"}}>
              <input type="checkbox" checked={litUsarCtx} onChange={e=>setLitCtx(e.target.checked)} style={{accentColor:C.gold,width:16,height:16}}/>
              Enviar dados do atendimento atual como contexto (paciente, queixa, anamnese, exame)
            </label>
            <BtnP onClick={consultarLiteratura} disabled={litLoading} style={{width:"100%",padding:"12px",opacity:litLoading?0.6:1}}>
              {litLoading ? "Consultando…" : "Consultar literatura"}
            </BtnP>
            {litErro&&<div style={{marginTop:10,background:"#2e1a1a",border:"1px solid #6a3a3a",borderRadius:8,padding:"10px 12px",fontSize:13,color:"#e0a0a0"}}>{litErro}</div>}
          </div>
          {litResposta&&<div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:10,padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:litTemLit?C.green:C.amber,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                {litTemLit ? "✓ Com base na literatura indexada" : "⚠ Sem trecho relevante na literatura — resposta geral"}
              </div>
              <button onClick={()=>{copyToClipboard(litResposta);setCopiado(true);setTimeout(()=>setCopiado(false),2000);}}
                style={{background:"transparent",border:"1px solid "+C.bord,borderRadius:6,padding:"4px 10px",color:C.gold,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>
                {copiado?"Copiado!":"Copiar"}
              </button>
            </div>
            <div style={{whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.7,color:C.text}}>{litResposta}</div>
          </div>}
          <div style={{fontSize:11,color:C.dim,lineHeight:1.6,padding:"0 4px"}}>
            Ferramenta de apoio a decisao. Sempre valide contra o exame clinico presencial.
          </div>
        </div>}

      </div>

      {/* Aviso (substitui alert) */}
      {aviso && <div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:"#3a2a1a",border:"1px solid #d4a96a",color:"#e8d0a0",padding:"10px 18px",borderRadius:10,fontSize:13,zIndex:300,maxWidth:"90%",textAlign:"center",boxShadow:"0 4px 16px #000a"}}>{aviso}</div>}

      {/* Confirmação (substitui confirm) */}
      {confirma && <div style={{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:310,padding:20}} onClick={()=>setConfirma(null)}>
        <div style={{background:"#15192a",border:"1px solid #2a3040",borderRadius:14,padding:22,maxWidth:340,width:"100%"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:14,lineHeight:1.5,color:C.text,marginBottom:18}}>{confirma.msg}</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setConfirma(null)} style={{flex:1,background:"#2a3040",color:C.muted,border:"none",borderRadius:8,padding:"10px",fontSize:14,cursor:"pointer",fontFamily:"Georgia,serif"}}>Cancelar</button>
            <button onClick={()=>{const a=confirma.acao;setConfirma(null);a();}} style={{flex:1,background:"#c0654a",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}}>Confirmar</button>
          </div>
        </div>
      </div>}

      {/* ============== MODAL CONFIGURACOES ============== */}
      {showConfig&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
        <div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:14,width:"100%",maxWidth:420,padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontSize:16,fontWeight:700,color:C.gold}}>⚙️ Seus dados</div>
            <button onClick={()=>setShowConfig(false)} style={{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>
          </div>
          <div style={{fontSize:12,color:C.dim,marginBottom:16,lineHeight:1.6}}>
            Preenchidos uma vez e salvos automaticamente. Aparecem em todas as cobranças.
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>CRMV (UF + número)</div>
            <input value={crmv} onChange={e=>setCrmv(e.target.value)}
              placeholder="Ex: ES 12345 ou SP 67890"
              style={{...IS,width:"100%",fontSize:15}}/>
            <div style={{fontSize:10,color:C.dim,marginTop:4}}>Aparece na mensagem: Dr. Ricardo | CRMV-{crmv||"[UF NÚMERO]"}</div>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Chave PIX</div>
            <input value={pix} onChange={e=>setPix(e.target.value)}
              placeholder="CPF, e-mail ou telefone"
              style={{...IS,width:"100%",fontSize:15}}/>
          </div>
          <BtnP onClick={()=>setShowConfig(false)} style={{width:"100%",padding:"12px"}}>
            {crmv||pix ? "✓ Salvo automaticamente" : "Fechar"}
          </BtnP>
        </div>
      </div>}

      {/* ============== MODAL HISTORICO ============== */}
      {showHist&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:100,padding:16,overflowY:"auto"}}>
        <div style={{background:C.card,border:"1px solid "+C.bord,borderRadius:14,width:"100%",maxWidth:900,padding:18,marginTop:20,marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:16,fontWeight:700,color:C.gold}}>📚 Historico de atendimentos ({histFiltrado.length}/{atendimentos.length})</div>
            <button onClick={()=>setShowHist(false)} style={{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:14,alignItems:"end"}}>
            <Field label="Buscar paciente"><input value={filtroPac} onChange={e=>setFiltroPac(e.target.value)} placeholder="Nome do animal" style={IS}/></Field>
            <Field label="De"><input type="date" value={filtroDe} onChange={e=>setFiltroDe(e.target.value)} style={IS}/></Field>
            <Field label="Ate"><input type="date" value={filtroAte} onChange={e=>setFiltroAte(e.target.value)} style={IS}/></Field>
            {(filtroPac||filtroDe||filtroAte)&&<BtnS onClick={()=>{setFiltroPac("");setFiltroDe("");setFiltroAte("");}} style={{paddingBottom:14}}>Limpar</BtnS>}
          </div>
          {histFiltrado.length===0&&<div style={{textAlign:"center",color:C.dim,padding:30,fontSize:13}}>{atendimentos.length===0?"Nenhum atendimento salvo ainda.":"Nenhum resultado para os filtros."}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {histFiltrado.map(a=>{
              const q=QUEIXAS.find(x=>x.id===a.queixa);
              return <div key={a.id} style={{border:"1px solid "+C.bord,borderLeft:"3px solid "+(q?.cor||C.bord),borderRadius:10,padding:12,background:"#15192a"}}>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
                  <strong style={{color:C.text}}>{a.paciente}</strong>
                  <span style={{background:C.gold+"22",color:C.gold,padding:"2px 8px",borderRadius:10,fontSize:11}}>{a.data}</span>
                  {a.prop&&<span style={{background:C.bord,color:C.muted,padding:"2px 8px",borderRadius:10,fontSize:11}}>{a.prop}</span>}
                  {q&&<span style={{background:q.cor+"22",color:q.cor,padding:"2px 8px",borderRadius:10,fontSize:11}}>{q.icon} {q.curto}</span>}
                  <span style={{fontSize:10,color:C.dim}}>{a.modoExame==="completo"?"completo":"focado"}</span>
                </div>
                <details style={{marginTop:6}}>
                  <summary style={{color:C.gold,fontSize:12,padding:"4px 0"}}>Ver prontuario completo</summary>
                  <pre style={{background:"#0f1320",padding:10,borderRadius:6,whiteSpace:"pre-wrap",fontSize:11,color:C.text,fontFamily:"'Courier New',monospace",lineHeight:1.5,marginTop:6}}>{a.prontuarioTexto||"(vazio)"}</pre>
                </details>
                <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                  <BtnS onClick={()=>carregarHist(a)} style={{fontSize:11,padding:"4px 10px"}}>Carregar no formulario</BtnS>
                  <BtnS onClick={()=>{navigator.clipboard.writeText(a.prontuarioTexto||"");}} style={{fontSize:11,padding:"4px 10px"}}>Copiar</BtnS>
                  <BtnS onClick={()=>excluirHist(a.id)} style={{fontSize:11,padding:"4px 10px",color:"#c07050",borderColor:"#5a3030"}}>Excluir</BtnS>
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(AuthWrapper));
