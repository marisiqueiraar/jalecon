/**
 * Jalecon · recebe as respostas da pesquisa sem agenda (jalecon.vercel.app/pesquisa/...)
 * e grava na planilha "02 · Entrevistas v1 · placar".
 *
 * Onde cada resposta vai:
 *  1. Aba "Respostas · médicos (v2)", "Respostas · clínicas (v2)" ou "Respostas · pacientes": a resposta completa.
 *     Pacientes só têm esta aba (não há placar automático).
 *  2. Aba "Entrevistas" (médicos) ou "Clínicas" (gestores): uma linha já codificada, que alimenta o placar.
 *     Respostas fora do filtro não chegam aqui (o formulário encerra antes de enviar).
 *
 * Codificação automática, registrada em 21/10/2026 antes das respostas (documento 13, versão 2):
 *  - "Citou CFM espontaneamente" = S se a pergunta aberta (o que trava / o que preocupa), respondida antes de
 *    a proposta aparecer, menciona CFM, CRM, conselho, código de ética, ética médica, diretor técnico,
 *    resolução, norma, regra, proibição, processo ético ou fiscalização. O grupo confere e pode corrigir à mão.
 *  - Médicos, "dificuldade" (coluna H) = S se quer mais pacientes particulares e tem horário (ou reorganizaria a agenda).
 *  - Médicos, preços (R a U): valem para a opção que a pessoa preferiu (coluna Z).
 *  - Clínicas, "paga" (H) = S só para agência, freelancer ou anúncios pagos.
 *  - Clínicas, "insatisfeita" (L) = S se trocou ou pensou em trocar de fornecedor, ou deu nota 3 ou menos.
 *  - Clínicas, "conformidade pesa" (R) = S se escolheu "não ter problema com o CRM" como o que mais pesa, ou se o diretor técnico revisa os posts.
 *  - Faixas viram números: % particular, gasto e contatos pelo ponto médio; dias e tempo de resposta pelo limite superior.
 *
 * Como publicar (uma vez, pelo dono da planilha):
 *  Extensões › Apps Script › colar este arquivo › Implantar › Nova implantação › tipo "App da Web" ›
 *  Executar como: eu · Quem pode acessar: Qualquer pessoa › Implantar › autorizar › copiar o URL que termina em /exec.
 * Para atualizar sem mudar o URL: colar a versão nova › Implantar › Gerenciar implantações › lápis › Versão: Nova versão › Implantar.
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
    if (d.publico === "medicos") gravar_(ss, "Respostas · médicos (v2)", CAMPOS_MEDICOS, ABA_MEDICOS, LINHAS_MEDICOS, linhaMedico(d.r, agora), d.r, agora, [24]);
    else if (d.publico === "clinicas") gravar_(ss, "Respostas · clínicas (v2)", CAMPOS_CLINICAS, ABA_CLINICAS, LINHAS_CLINICAS, linhaClinica(d.r, agora), d.r, agora, []);
    else if (d.publico === "pacientes") bruta_(ss, "Respostas · pacientes", ["Recebido em"], CAMPOS_PACIENTES, [agora], d.r);
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
  bruta_(ss, abaBruta, ["Recebido em", "Lançada no placar"], campos, [agora, livre > 0 ? "Linha " + livre : "Placar cheio: lançar à mão"], r);
}

/* Aba com a resposta completa. Cria a aba e o cabeçalho na primeira resposta; campos novos entram no fim e ganham cabeçalho. */
function bruta_(ss, nome, inicio, campos, valores, r) {
  var bruta = ss.getSheetByName(nome) || ss.insertSheet(nome);
  var cab = inicio.concat(campos.map(function (c) { return c[1]; }));
  if (bruta.getLastRow() === 0) {
    bruta.appendRow(cab);
    bruta.setFrozenRows(1);
  } else if (bruta.getLastColumn() < cab.length) {
    bruta.getRange(1, 1, 1, cab.length).setValues([cab]);
  }
  bruta.appendRow(valores.concat(campos.map(function (c) { return seguro_(texto_(r[c[0]])); })));
}

/* Evita que um texto vire fórmula na planilha. */
function seguro_(v) { return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v; }
function texto_(v) { return Array.isArray(v) ? v.join(", ") : v == null ? "" : v; }
function sn_(cond) { return cond ? "S" : "N"; }
function n_(v) { return v === null || v === undefined || v === "" ? "" : Number(v); }

var CAMPOS_MEDICOS = [
  ["especialidade", "Especialidade"], ["onde", "Onde atende"], ["anos", "Tempo de consultório"], ["particular", "% particular (ponto médio)"],
  ["fonte", "Fonte de pacientes novos"], ["proximo", "Conhece alguém do grupo"], ["quer_mais", "Quer mais pacientes particulares"],
  ["vagas", "Tem horário para mais pacientes"], ["pagou", "Pagou nos últimos 12 meses"], ["gasto", "Gasto por mês (R$)"],
  ["meses", "Meses com o último"], ["ainda", "Ainda usa"], ["parou_motivo", "Por que parou"], ["trava", "O que mais trava (aberta)"],
  ["atrai", "O que atrai e o que deixa desconfiado"], ["ia", "Publicaria conteúdo com IA revisado"], ["preferida", "Opção preferida"],
  ["p_barato", "Barato demais (R$)"], ["p_bom", "Bom negócio (R$)"], ["p_caro", "Caro, mas consideraria (R$)"], ["p_caro_demais", "Caro demais (R$)"],
  ["contrataria", "Contrataria pelo preço"], ["condicao", "O que precisaria ser verdade"], ["chamar", "Quer ser chamado para piloto pago"],
  ["contato", "Contato"], ["redes_pct", "% de pacientes novos pelas redes (ponto médio)"], ["posta", "Frequência de publicação"]
];

var CAMPOS_CLINICAS = [
  ["cargo", "Cargo de quem respondeu"], ["medicos", "Nº de médicos"], ["unidades", "Unidades"], ["especialidades", "Especialidades"],
  ["particular", "% particular (ponto médio)"], ["proximo", "Conhece alguém do grupo"], ["quer_mais", "Quer mais pacientes particulares"],
  ["vagas", "Médicos têm horário livre"], ["investe", "Investe em marketing"], ["tipos", "Em quê"], ["gasto", "Gasto sem mídia (R$, ponto médio)"],
  ["midia", "Mídia (R$, ponto médio)"], ["satisf", "Satisfação (1 a 5)"], ["trocou", "Trocou ou pensou em trocar"], ["resultado", "O que incomoda no resultado"],
  ["decisores", "Nº de decisores"], ["aprova", "Quem aprovou"], ["dias", "Dias até fechar (limite da faixa)"], ["revisa", "Quem revisa os posts"],
  ["contatos", "Contatos novos por semana (ponto médio)"], ["tempo", "Primeira resposta (min, limite da faixa)"], ["fora", "Responde à noite e no fim de semana"],
  ["mede", "Mede conversão do WhatsApp"], ["preocupa", "O que mais preocupa (aberta)"], ["atrai", "O que atrai e o que deixa desconfiado"],
  ["peso", "O que mais pesa ao escolher"], ["p_barato", "Barato demais (R$)"], ["p_bom", "Bom negócio (R$)"], ["p_caro", "Caro, mas consideraria (R$)"],
  ["p_caro_demais", "Caro demais (R$)"], ["piloto", "Piloto pago"], ["substitui", "Substitui ou soma"], ["condicao", "O que precisaria ser verdade"],
  ["chamar", "Quer ser chamado em novembro"], ["contato", "Contato"], ["achou", "Como achou o fornecedor"], ["agenda_sis", "Sistema de agenda"],
  ["fonte", "Origem principal dos pacientes novos"], ["redes_pct", "% de pacientes novos pelas redes (ponto médio)"]
];

var CAMPOS_PACIENTES = [
  ["idade", "Idade"], ["uf", "Estado"], ["plano", "Plano de saúde"], ["tipo_medico", "Especialidade da última consulta"],
  ["descobriu", "Como conheceu o médico"], ["checou", "Onde buscou informações antes de agendar"], ["marcou", "Como agendou"],
  ["momento", "Momento do primeiro contato"], ["resposta", "Tempo até a primeira resposta"], ["confirmou", "Consulta confirmada antes"],
  ["desistiu", "Desistiu por demora na resposta (12 meses)"], ["faltou", "Faltou sem desmarcar (12 meses)"], ["falta_motivo", "Por que faltou"],
  ["prefere", "Como prefere agendar"], ["noite", "Mensagem às 22h: o que prefere"], ["assistente", "Aceita assistente virtual"],
  ["pesa", "O que mais pesa na escolha (até 2)"], ["desconfia", "O que gera desconfiança nas redes"], ["segue_med", "Segue médicos e agendou pelo conteúdo"]
];

/* Linha da aba "Entrevistas", colunas A a AD (X tem fórmula e é pulada na gravação). */
function linhaMedico(r, agora) {
  var pagos = (r.pagou || []).filter(function (x) { return x !== "nada"; });
  var anos = { ate3: 2, "4a10": 7, mais10: 15 }[r.anos];
  var pref = r.preferida || "";
  var contrata = pref === "Nenhuma" ? "Não" : (r.contrataria || "");
  var vagas = { sim: "Sim", talvez: "Talvez", nao: "Não" }[r.vagas] || "";
  return [
    agora, "Formulário", r.especialidade || "", sn_(r.proximo === "sim"), anos == null ? "" : anos,
    n_(r.particular), r.fonte || "", sn_(r.quer_mais === "sim" && r.vagas !== "nao"), sn_(pagos.length > 0), n_(r.gasto),
    pagos.join(", "), "", n_(r.meses), r.ainda ? sn_(r.ainda === "sim") : "", texto_(r.parou_motivo),
    sn_(CFM_MEDICOS.test(r.trava || "")), "", n_(r.p_barato), n_(r.p_bom), n_(r.p_caro),
    n_(r.p_caro_demais), pref === "Plataforma" || pref === "Nenhuma" ? contrata : "", r.ia || "", "",
    (r.trava || "").slice(0, 300), pref, pref === "Equipe" || pref === "Nenhuma" ? contrata : "",
    sn_(r.chamar === "sim"), r.onde || "", vagas
  ];
}

/* Linha da aba "Clínicas", colunas A a AI. */
function linhaClinica(r, agora) {
  var investe = r.investe === "sim";
  var tipos = r.tipos || [];
  var externo = investe && tipos.some(function (t) { return EXTERNOS.indexOf(t) >= 0; });
  var satisf = n_(r.satisf);
  var insatisfeita = investe && (r.trocou === "trocou" || r.trocou === "pensou" || (satisf !== "" && satisf <= 3));
  var probs = (r.resultado || []).filter(function (x) { return x !== "nada"; });
  var obs = ["Via formulário.", investe ? "Marketing: " + tipos.join(", ") + "." : "Não investe em marketing.",
    probs.length ? "Incomoda: " + probs.join(", ") + "." : "", r.aprova && r.aprova.length ? "Aprovou: " + r.aprova.join(", ") + "." : "",
    r.preocupa ? "Preocupa: " + r.preocupa : "", r.atrai ? " | Atrai/desconfia: " + r.atrai : "", r.condicao ? " | Precisa ser verdade: " + r.condicao : ""].join(" ").replace(/\s+/g, " ").trim();
  return [
    agora, "Formulário", sn_(r.proximo === "sim"), r.especialidades || "", n_(r.medicos),
    n_(r.unidades), n_(r.particular), sn_(externo), investe ? n_(r.gasto) : "", investe ? n_(r.midia) : "",
    "", sn_(insatisfeita), n_(r.decisores), n_(r.dias), sn_(r.mede === "sim"),
    sn_(r.fora === "nao"), sn_(CFM_CLINICAS.test(r.preocupa || "")), sn_(r.peso === "Não ter problema com o CRM" || r.revisa === "Diretor técnico"),
    n_(r.p_barato), n_(r.p_bom), n_(r.p_caro), n_(r.p_caro_demais), r.piloto || "", r.substitui || "", obs.slice(0, 1500),
    r.cargo || "", sn_(r.quer_mais === "sim" && r.vagas !== "nao"), n_(r.contatos), n_(r.tempo), r.revisa || "", r.peso || "",
    sn_(r.chamar === "sim"), sn_(investe), investe ? (r.achou || "") : "", r.agenda_sis || ""
  ];
}
var EXTERNOS = ["Agência de marketing", "Freelancer ou social media", "Anúncios pagos"];

/* Para testes fora do Google (node). */
if (typeof module !== "undefined") module.exports = { linhaMedico: linhaMedico, linhaClinica: linhaClinica, CFM_MEDICOS: CFM_MEDICOS, CFM_CLINICAS: CFM_CLINICAS, gravar_: gravar_, CAMPOS_MEDICOS: CAMPOS_MEDICOS, CAMPOS_CLINICAS: CAMPOS_CLINICAS, CAMPOS_PACIENTES: CAMPOS_PACIENTES, bruta_: bruta_ };
