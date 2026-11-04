/* Jalecon · IA revisa IA: dois agentes críticos leem cada peça antes do médico.
 * Revisor de clareza: frases longas, jargão, excesso de exclamação e caixa alta.
 * Revisor científico: afirmações absolutas, números sem fonte e promessas disfarçadas.
 * Sem IA paga: regras transparentes. Linhas que começam com "Mito:" são ignoradas (o mito é falso de propósito).
 */
(function (g) {
  "use strict";
  var G = g.Guardiao || (typeof require === "function" ? require("./guardiao.js") : null);
  function norm(s) { return G.normalizar(s); }

  var JARGAO = [
    ["etiologia", "causa"], ["patologia", "doença"], ["sintomatologia", "sintomas"], ["prognostico", "evolução esperada"],
    ["comorbidade", "outra doença ao mesmo tempo"], ["idiopatic", "sem causa conhecida"], ["assintomatic", "sem sintomas"],
    ["profilaxia", "prevenção"], ["posologia", "dose e horário do remédio"], ["iatrogen", "efeito do tratamento"],
    ["exacerbac", "piora"], ["deambula", "caminhar"], ["algia", "dor"]
  ];
  var ABSOLUTOS = [
    { p: /\bsempre\b/g, troca: "na maioria das vezes", motivo: "“Sempre” raramente é verdade em medicina." },
    { p: /\bnunca\b/g, troca: "raramente", motivo: "“Nunca” é absoluto demais; a resposta depende do caso." },
    { p: /\b100 ?%/g, troca: "", motivo: "Nenhum tratamento funciona em 100% dos casos." },
    { p: /\bcomprovad[oa]s? cientificamente\b/g, troca: "com evidência científica", motivo: "“Comprovado cientificamente” pede a fonte; prefira descrever a evidência." },
    { p: /\b(estudos|pesquisas|a ciencia) (mostram|comprovam|provam)\b/g, troca: "", motivo: "Cite o estudo (autor, ano) ou tire a afirmação.", manual: true },
    { p: /\b(sem (nenhum )?efeito colateral|sem efeitos colaterais)\b/g, troca: "com poucos efeitos colaterais", motivo: "Todo tratamento pode ter efeito colateral." },
    { p: /\b(natural,? (logo|entao|portanto) (seguro|sem risco))\b/g, troca: "", motivo: "Natural não quer dizer seguro.", manual: true },
    { p: /\b(resultados?|tratamento) (com resultado )?definitiv[oa]s?\b/g, troca: "resultados que variam de pessoa para pessoa", motivo: "Em medicina, resultado não é definitivo: varia de pessoa para pessoa." },
    { p: /\ba cura (para|da|do)\b/g, troca: "tratamento para", motivo: "“Cura” promete o que a ciência não garante para todos." },
    { p: /\bsem dor e sem riscos?\b/g, troca: "com riscos que o médico explica na consulta", motivo: "Todo procedimento tem algum risco." },
    { p: /\btodos os pacientes\b/g, troca: "muitos pacientes", motivo: "Generalização: nem todos os pacientes respondem igual." }
  ];
  var NUMERO_SEM_FONTE = /\b\d{1,3} ?% (dos|das) (pacientes|pessoas|casos|mulheres|homens|criancas|brasileiros)/g;

  function frases(t) { return t.split(/(?<=[.!?])\s+|\n+/).map(function (s) { return s.trim(); }).filter(Boolean); }
  function palavras(s) { return s.split(/\s+/).filter(function (w) { return /[a-zà-ý0-9]/i.test(w); }).length; }
  function semMito(texto) { return texto.split("\n").filter(function (l) { return !/^\s*mito\s*:/i.test(l); }).join("\n"); }
  function semAssinatura(texto) { return texto.split("\n").filter(function (l) { return !/\bcrm\b/i.test(l); }).join("\n"); }

  function revisar(texto) {
    var base = semAssinatura(semMito(texto)), n = norm(base), achados = [];
    // ---- clareza
    var fs = frases(base), longas = fs.filter(function (s) { return palavras(s) > 28 && !/^\d+\./.test(s); });
    longas.forEach(function (s) { achados.push({ agente: "Clareza", tipo: "frase longa", trecho: s.slice(0, 90) + (s.length > 90 ? "…" : ""), motivo: palavras(s) + " palavras numa frase só. Acima de 28, metade das pessoas perde o fio.", sugestao: "Divida em duas frases.", auto: false }); });
    JARGAO.forEach(function (j) {
      var rx = new RegExp("\\b" + j[0] + "\\w*", "g"), m = n.match(rx);
      if (m && n.indexOf(norm(j[1])) < 0) achados.push({ agente: "Clareza", tipo: "jargão", trecho: m[0], motivo: "Termo técnico sem explicação para o paciente.", sugestao: "Explique entre parênteses: “" + j[1] + "”.", auto: false });
    });
    var excl = (base.match(/!/g) || []).length;
    if (excl >= 2) achados.push({ agente: "Clareza", tipo: "tom", trecho: excl + " pontos de exclamação", motivo: "Exclamações seguidas soam como anúncio de varejo.", sugestao: "Troque por ponto final.", auto: true, fix: "exclamacao" });
    var caps = base.match(/\b[A-ZÀ-Ý]{5,}\b/g) || [];
    caps = caps.filter(function (w) { return ["MÉDICO", "MÉDICA", "CRM", "RQE"].indexOf(w) < 0; });
    if (caps.length) achados.push({ agente: "Clareza", tipo: "caixa alta", trecho: caps.slice(0, 3).join(", "), motivo: "Palavras em caixa alta parecem grito.", sugestao: "Use letras normais.", auto: true, fix: "caps" });
    var tit = (texto.split(/\n/)[0] || "");
    if (tit.length > 80) achados.push({ agente: "Clareza", tipo: "título longo", trecho: tit.slice(0, 60) + "…", motivo: "Título com " + tit.length + " caracteres; no feed, só cerca de 60 aparecem.", sugestao: "Encurte o título.", auto: false });
    // ---- ciência
    ABSOLUTOS.forEach(function (a) {
      a.p.lastIndex = 0;
      var m = n.match(a.p);
      if (m) achados.push({ agente: "Ciência", tipo: "afirmação absoluta", trecho: m[0], motivo: a.motivo, sugestao: a.troca ? "Troque por “" + a.troca + "”." : "Tire a afirmação ou cite a fonte.", auto: !a.manual, fix: "absoluto", re: a.p.source, troca: a.troca });
    });
    NUMERO_SEM_FONTE.lastIndex = 0;
    var nm = n.match(NUMERO_SEM_FONTE);
    if (nm && !/\b(fonte|segundo|de acordo com|estudo de|\(\d{4}\))/.test(n)) achados.push({ agente: "Ciência", tipo: "número sem fonte", trecho: nm[0], motivo: "Percentual sobre pacientes sem dizer de onde vem.", sugestao: "Inclua a fonte (por exemplo, “segundo a Sociedade Brasileira de …”) ou tire o número.", auto: false });

    var nPal = palavras(base), nFr = fs.length || 1, media = nPal / nFr;
    var clareza = Math.max(0, Math.min(100, Math.round(110 - media * 2.6 - achados.filter(function (a) { return a.agente === "Clareza"; }).length * 8)));
    return { achados: achados, clareza: clareza, mediaPalavras: Math.round(media), ciencia: achados.filter(function (a) { return a.agente === "Ciência"; }).length === 0 };
  }

  function substituirAcento(texto, reSrc, troca) {
    // aplica o padrão (escrito sem acento) sobre o texto original, preservando o resto
    var t = texto, n = norm(t), rx = new RegExp(reSrc, "g"), m, partes = [], last = 0;
    while ((m = rx.exec(n))) { partes.push([m.index, m.index + m[0].length]); if (!m[0].length) rx.lastIndex++; }
    if (!partes.length) return t;
    var out = "";
    partes.forEach(function (p) { out += t.slice(last, p[0]) + troca; last = p[1]; });
    return out + t.slice(last);
  }

  function corrigir(texto) {
    var r = revisar(texto), t = texto, feitos = [];
    var linhas = t.split("\n");
    r.achados.forEach(function (a) {
      if (!a.auto) return;
      if (a.fix === "exclamacao") { linhas = linhas.map(function (l) { return /\bcrm\b/i.test(l) ? l : l.replace(/!+/g, "."); }); feitos.push("exclamações viraram ponto final"); }
      if (a.fix === "caps") { linhas = linhas.map(function (l) { return /\bcrm\b/i.test(l) ? l : l.replace(/\b[A-ZÀ-Ý]{5,}\b/g, function (w) { return ["MÉDICO", "MÉDICA"].indexOf(w) >= 0 ? w : w.charAt(0) + w.slice(1).toLowerCase(); }); }); feitos.push("caixa alta normalizada"); }
      if (a.fix === "absoluto") { linhas = linhas.map(function (l) { return /^\s*mito\s*:/i.test(l) || /\bcrm\b/i.test(l) ? l : substituirAcento(l, a.re, a.troca); }); feitos.push("“" + a.trecho + "” → " + (a.troca ? "“" + a.troca + "”" : "removido")); }
    });
    t = G.limpar(linhas.join("\n"));
    return { texto: t, feitos: feitos, depois: revisar(t) };
  }

  /* Exemplo para a tela: uma peça com problemas de clareza e de ciência. */
  var EXEMPLO = "Dor lombar: o que a ciência diz!\n\nEstudos comprovam que a dor lombar SEMPRE melhora com repouso e que a etiologia é postural em 80% dos pacientes, o que significa que, se você corrigir a sua postura no trabalho e em casa, vai ter alívio rápido e sem nenhum efeito colateral, como acontece com todos os pacientes que acompanhamos!";

  var api = { revisar: revisar, corrigir: corrigir, EXEMPLO: EXEMPLO };
  g.Critica = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
