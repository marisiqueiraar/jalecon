/**
 * Jalecon · recebe as respostas da pesquisa sem agenda (jalecon.vercel.app/pesquisa/...)
 * e grava na planilha "02 · Entrevistas v1 · placar".
 *
 * Onde cada resposta vai:
 *  1. Aba "Respostas · médicos" ou "Respostas · clínicas": a resposta completa, com os textos abertos.
 *  2. Aba "Entrevistas" (médicos) ou "Clínicas" (gestores): uma linha já codificada, que alimenta o placar.
 *     Respostas fora do filtro não chegam aqui (o formulário encerra antes de enviar).
 *
 * Codificação automática, registrada em 21/10/2026 antes das respostas (documento 13):
 *  - "Citou CFM espontaneamente" = S se a pergunta aberta (o que trava / o que preocupa), respondida antes de
 *    a proposta aparecer, menciona CFM, CRM, conselho, código de ética, ética médica, diretor técnico,
 *    resolução, norma, regra, proibição, processo ético ou fiscalização. O grupo confere e pode corrigir à mão.
 *  - "Problema concreto com o resultado" (clínicas) = S se marcou qualquer problema da lista.
 *  - Faixas viram números: % particular pelo ponto médio; dias da contratação pelo limite superior.
 *
 * Como publicar (uma vez, pelo dono da planilha):
 *  Extensões › Apps Script › colar este arquivo › Implantar › Nova implantação › tipo "App da Web" ›
 *  Executar como: eu · Quem pode acessar: Qualquer pessoa › Implantar › autorizar › copiar o URL que termina em /exec.
 */

var ABA_MEDICOS = "Entrevistas";
var ABA_CLINICAS = "Clínicas";
var LINHAS_MEDICOS = [2, 31];   // faixa lida pelo Placar
var LINHAS_CLINICAS = [2, 21];  // faixa lida pelo placar da aba Clínicas

var CFM_MEDICOS = /(^|[^a-zà-ú])(cfm|crm|conselho|c[oó]digo de [eé]tica|[eé]tica m[eé]dica|diretor[a]? t[eé]cnic[a-zà-ú]*|resolu[cç][aã]o|normas?|regras?|proibid[a-zà-ú]*|process[oa]s? [eé]tic[a-zà-ú]*|fiscaliza[a-zà-ú]*)(?![a-zà-ú])/i;
var CFM_CLINICAS = /(^|[^a-zà-ú])(cfm|crm|conselho|c[oó]digo de [eé]tica|[eé]tica m[eé]dica|diretor[a]? t[eé]cnic[a-zà-ú]*|resolu[cç][aã]o|publicidade m[eé]dica|process[oa]s? [eé]tic[a-zà-ú]*|fiscaliza[a-zà-ú]*)(?![a-zà-ú])/i;

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.hp) return resposta_("ignorado");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var agora = new Date();
    if (d.publico === "medicos") gravar_(ss, "Respostas · médicos", CAMPOS_MEDICOS, ABA_MEDICOS, LINHAS_MEDICOS, linhaMedico(d.r, agora), d.r, agora, [24]);
    else if (d.publico === "clinicas") gravar_(ss, "Respostas · clínicas", CAMPOS_CLINICAS, ABA_CLINICAS, LINHAS_CLINICAS, linhaClinica(d.r, agora), d.r, agora, []);
    else return resposta_("publico invalido");
    return resposta_("ok");
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return resposta_("Pesquisa Jalecon: recebendo respostas."); }
function resposta_(t) { return ContentService.createTextOutput(t); }

/* Grava a resposta completa e a linha do placar. pular: colunas (1 = A) com fórmula, que não podem ser sobrescritas. */
function gravar_(ss, abaBruta, campos, abaPlacar, faixa, linha, r, agora, pular) {
  var bruta = ss.getSheetByName(abaBruta) || ss.insertSheet(abaBruta);
  if (bruta.getLastRow() === 0) {
    bruta.appendRow(["Recebido em", "Lançada no placar"].concat(campos.map(function (c) { return c[1]; })));
    bruta.setFrozenRows(1);
  }
  var aba = ss.getSheetByName(abaPlacar);
  var col = aba.getRange(faixa[0], 1, faixa[1] - faixa[0] + 1, 1).getValues();
  var livre = -1;
  for (var i = 0; i < col.length; i++) if (col[i][0] === "" || col[i][0] === null) { livre = faixa[0] + i; break; }
  if (livre > 0) {
    var ini = 0;
    while (ini < linha.length) {
      if (pular.indexOf(ini + 1) >= 0) { ini++; continue; }
      var fim = ini;
      while (fim < linha.length && pular.indexOf(fim + 1) < 0) fim++;
      aba.getRange(livre, ini + 1, 1, fim - ini).setValues([linha.slice(ini, fim).map(seguro_)]);
      ini = fim;
    }
  }
  bruta.appendRow([agora, livre > 0 ? "Linha " + livre : "Placar cheio: lançar à mão"].concat(campos.map(function (c) { return seguro_(texto_(r[c[0]])); })));
}

/* Evita que um texto vire fórmula na planilha. */
function seguro_(v) { return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v; }
function texto_(v) { return Array.isArray(v) ? v.join(", ") : v == null ? "" : v; }
function sn_(cond) { return cond ? "S" : "N"; }
function n_(v) { return v === null || v === undefined || v === "" ? "" : Number(v); }

var CAMPOS_MEDICOS = [
  ["especialidade", "Especialidade"], ["anos", "Tempo de consultório"], ["particular", "% particular (ponto médio)"], ["fonte", "Fonte de pacientes novos"],
  ["proximo", "Conhece alguém do grupo"], ["agenda", "Agenda como gostaria"], ["ultima", "Última ação de divulgação"], ["pagou", "Pagou nos últimos 12 meses"],
  ["gasto", "Gasto por mês (R$)"], ["meses", "Meses com o último"], ["ainda", "Ainda usa"], ["parou", "Por que parou"], ["trouxe", "Trouxe pacientes?"],
  ["trava", "O que mais trava (aberta)"], ["atrai", "O que atrai e o que deixa desconfiado"], ["ia", "Publicaria conteúdo com IA revisado"],
  ["duvida", "Já teve dúvida ou viu problema com o CRM"], ["p_barato", "Barato demais (R$)"], ["p_bom", "Bom negócio (R$)"], ["p_caro", "Caro, mas consideraria (R$)"],
  ["p_caro_demais", "Caro demais (R$)"], ["escolha", "Escolha (plataforma, equipe, nenhuma)"], ["piloto", "Testaria por 3 meses"], ["condicao", "O que precisaria ser verdade"],
  ["contato", "Contato (opcional)"]
];

var CAMPOS_CLINICAS = [
  ["medicos", "Nº de médicos"], ["unidades", "Unidades"], ["especialidades", "Especialidades"], ["particular", "% particular (ponto médio)"], ["proximo", "Conhece alguém do grupo"],
  ["quem", "Quem cuida do marketing"], ["paga", "Pagou marketing em 12 meses"], ["gasto", "Gasto sem mídia (R$)"], ["midia", "Mídia (R$)"], ["meses", "Meses com o fornecedor"],
  ["resultado", "O que incomoda no resultado"], ["decisores", "Nº de decisores"], ["dias", "Dias até fechar (limite da faixa)"], ["fora", "Responde à noite e no fim de semana"],
  ["mede", "Mede conversão do WhatsApp"], ["faltas", "Faltas"], ["preocupa", "O que mais preocupa (aberta)"], ["atrai", "O que atrai e o que deixa desconfiado"],
  ["pesa", "Conformidade pesa (perguntado)"], ["p_barato", "Barato demais (R$)"], ["p_bom", "Bom negócio (R$)"], ["p_caro", "Caro, mas consideraria (R$)"],
  ["p_caro_demais", "Caro demais (R$)"], ["piloto", "Piloto pago"], ["substitui", "Substitui ou soma"], ["condicao", "O que precisaria ser verdade"], ["contato", "Contato (opcional)"]
];

/* Linha da aba "Entrevistas", colunas A a AA (X tem fórmula e é pulada na gravação). */
function linhaMedico(r, agora) {
  var pagos = (r.pagou || []).filter(function (x) { return x !== "nada"; });
  var anos = { ate3: 2, "4a10": 7, mais10: 15 }[r.anos];
  var esc = r.escolha || "";
  return [
    agora, "Formulário", r.especialidade || "", sn_(r.proximo === "sim"), anos == null ? "" : anos,
    n_(r.particular), r.fonte || "", sn_(r.agenda === "nao"), sn_(pagos.length > 0), n_(r.gasto),
    pagos.join(", "), "", n_(r.meses), r.ainda ? sn_(r.ainda === "sim") : "", r.parou || "",
    sn_(CFM_MEDICOS.test(r.trava || "")), "", n_(r.p_barato), n_(r.p_bom), n_(r.p_caro),
    n_(r.p_caro_demais), esc === "Plataforma" ? (r.piloto || "") : esc === "Nenhuma" ? "Não" : "", r.ia || "", "",
    (r.trava || "").slice(0, 300), esc, esc === "Equipe" ? (r.piloto || "") : esc === "Nenhuma" ? "Não" : ""
  ];
}

/* Linha da aba "Clínicas", colunas A a Y. */
function linhaClinica(r, agora) {
  var probs = (r.resultado || []).filter(function (x) { return x !== "nada"; });
  var obs = ["Via formulário.", r.quem ? "Marketing: " + r.quem + "." : "", probs.length ? "Incomoda: " + probs.join(", ") + "." : "",
    r.preocupa ? "Preocupa: " + r.preocupa : "", r.atrai ? " | Atrai/desconfia: " + r.atrai : "", r.condicao ? " | Precisa ser verdade: " + r.condicao : ""].join(" ").replace(/\s+/g, " ").trim();
  return [
    agora, "Formulário", sn_(r.proximo === "sim"), r.especialidades || "", n_(r.medicos),
    n_(r.unidades), n_(r.particular), sn_(r.paga === "sim"), n_(r.gasto), n_(r.midia),
    n_(r.meses), sn_(probs.length > 0), n_(r.decisores), n_(r.dias), sn_(r.mede === "sim"),
    sn_(r.fora === "nao"), sn_(CFM_CLINICAS.test(r.preocupa || "")), r.pesa ? sn_(r.pesa !== "Nada") : "", n_(r.p_barato), n_(r.p_bom),
    n_(r.p_caro), n_(r.p_caro_demais), r.piloto || "", r.substitui || "", obs.slice(0, 1500)
  ];
}

/* Para testes fora do Google (node). */
if (typeof module !== "undefined") module.exports = { linhaMedico: linhaMedico, linhaClinica: linhaClinica, CFM_MEDICOS: CFM_MEDICOS, CFM_CLINICAS: CFM_CLINICAS, gravar_: gravar_, CAMPOS_MEDICOS: CAMPOS_MEDICOS, CAMPOS_CLINICAS: CAMPOS_CLINICAS };
