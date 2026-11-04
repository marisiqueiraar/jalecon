/* Jalecon · Revisão conversacional: entende pedidos simples em português e muda o texto de verdade.
 * Sem IA: intenções reconhecidas por padrões, transformações determinísticas.
 * Depende de Guardiao (guardiao.js) para normalizar, limpar e aplicar sugestões.
 */
(function (g) {
  "use strict";
  var G = g.Guardiao || (typeof require === "function" ? require("./guardiao.js") : null);

  function norm(s) { return G.normalizar(s); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function tirarAspas(s) { return String(s || "").trim().replace(/^["“”'‘’«]+|["“”'‘’».!?]+$/g, "").trim(); }

  var LETRA = /[a-z0-9]/;
  function ocorrencias(texto, alvo) {
    var n = norm(texto), a = norm(alvo).trim(), out = [];
    if (!a) return out;
    var i = 0;
    while ((i = n.indexOf(a, i)) >= 0) {
      var antes = i > 0 ? n.charAt(i - 1) : " ", depois = n.charAt(i + a.length) || " ";
      var palavra = LETRA.test(a.charAt(0)) && LETRA.test(a.charAt(a.length - 1));
      if (!palavra || (!LETRA.test(antes) && !LETRA.test(depois))) out.push([i, i + a.length]);
      i += a.length;
    }
    return out;
  }

  function substituir(texto, alvo, novo) {
    var occ = ocorrencias(texto, alvo);
    for (var k = occ.length - 1; k >= 0; k--) {
      var o = occ[k], orig = texto.slice(o[0], o[1]);
      var rep = novo;
      if (rep && /^[A-ZÀ-Ý]/.test(orig) && !/^[A-ZÀ-Ý]/.test(rep)) rep = cap(rep);
      texto = texto.slice(0, o[0]) + rep + texto.slice(o[1]);
    }
    return { texto: occ.length ? G.limpar(texto) : texto, n: occ.length };
  }

  /* ---------- estrutura do texto ---------- */
  function partes(texto) {
    var paras = texto.split(/\n\s*\n/);
    var titulo = paras.shift() || "";
    var assinatura = null, cta = null;
    if (paras.length && /\bcrm\b/i.test(paras[paras.length - 1])) assinatura = paras.pop();
    if (paras.length && /(agend|link da bio|whats)/i.test(paras[paras.length - 1]) && paras[paras.length - 1].length < 220 && !/^\d+\./.test(paras[paras.length - 1])) cta = paras.pop();
    return { titulo: titulo, corpo: paras, cta: cta, assinatura: assinatura };
  }
  function montar(p) {
    return [p.titulo].concat(p.corpo, p.cta ? [p.cta] : [], p.assinatura ? [p.assinatura] : []).filter(function (x) { return x && x.trim(); }).join("\n\n");
  }
  function ehLista(par) { return /^(\d+\.|parte \d|abertura|fechamento)/im.test(par.trim()); }
  function primeiraFrase(par) { var m = par.match(/^[\s\S]*?[.!?](\s|$)/); return m ? m[0].trim() : par; }

  var CTAS = {
    acolhedora: "Se quiser conversar sobre o seu caso, o agendamento está no link da bio.",
    tecnica: "Avaliação mediante consulta. Agendamento pelo link da bio.",
    proxima: "Ficou com alguma dúvida? Me chama no WhatsApp pelo link da bio.",
    sobria: "Agendamentos pelo link da bio."
  };
  var ABERTURAS = [
    "Cada pessoa tem um tempo e uma história. A consulta é o espaço para entender a sua.",
    "Ter dúvidas sobre isso é comum, e dá para conversar com calma.",
    "Cuidar da saúde fica mais leve quando a gente entende o que está acontecendo."
  ];
  var FRASE_TECNICA = "A conduta depende da história clínica, do exame físico e, quando indicado, de exames complementares.";

  /* ---------- transformações ---------- */
  var FECHOS = /^(esses sinais|cada caso|na consulta, conversamos)/i;
  function encurtar(texto) {
    var p = partes(texto), antes = texto.length;
    var corpo = p.corpo.slice();
    var temConteudo = corpo.filter(function (x) { return ehLista(x) || /^(mito|verdade|o que levar)/i.test(x.trim()); }).length;
    if (corpo.length >= 2 && !ehLista(corpo[0]) && !/^(mito|verdade|roteiro|o que levar)/i.test(corpo[0].trim())) corpo.shift();
    if (temConteudo) corpo = corpo.filter(function (x) { return !FECHOS.test(x.trim()); });
    corpo = corpo.map(function (par) {
      if (ehLista(par)) {
        var linhas = par.split("\n"), cab = [], itens = [];
        linhas.forEach(function (l) { if (/^(\d+\.|parte \d|abertura|fechamento)/i.test(l.trim())) itens.push(l); else if (!itens.length) cab.push(l); });
        return cab.concat(itens.slice(0, 2)).join("\n");
      }
      return /^roteiro/i.test(par.trim()) ? par : primeiraFrase(par);
    });
    if (corpo.length > 2) corpo = corpo.slice(0, 2);
    var itensRestantes = corpo.join("\n").split("\n").filter(function (l) { return /^\d+\./.test(l.trim()); }).length;
    if (/^\d+ /.test(p.titulo) && itensRestantes && itensRestantes < parseInt(p.titulo, 10)) p.titulo = p.titulo.replace(/^\d+/, String(itensRestantes));
    p.corpo = corpo;
    var novo = montar(p);
    if (novo.length >= antes * 0.93) return { texto: texto, msg: "O texto já está enxuto. Se quiser, diga o que tirar, por exemplo: “tire a palavra consulta”.", mudou: false };
    return { texto: novo, msg: "Encurtei de " + antes + " para " + novo.length + " caracteres. Mantive o título, o essencial, a chamada e a identificação.", mudou: true };
  }

  function acolher(texto, ctx) {
    var p = partes(texto);
    var atual = -1;
    p.corpo.forEach(function (par, i) { ABERTURAS.forEach(function (a, k) { if (par.indexOf(a) >= 0) atual = k; }); });
    p.corpo = p.corpo.filter(function (par) { return ABERTURAS.indexOf(par.trim()) < 0 && par.trim() !== FRASE_TECNICA; });
    var prox = ABERTURAS[(atual + 1 + ((ctx && ctx.seed) || 0)) % ABERTURAS.length];
    p.corpo.unshift(prox);
    if (p.cta) {
      p.cta = p.cta.replace("Avaliação mediante consulta. Agendamento pelo link da bio.", CTAS.acolhedora)
        .replace(/^Agendamentos pelo link da bio\.$/, "Quando quiser, o agendamento está no link da bio.");
    }
    p.corpo = p.corpo.map(function (par) { return par.replace(/(^|[.!?]\s+)Procure /g, "$1Vale procurar ").replace(/(^|[.!?]\s+)Agende /g, "$1Se fizer sentido para você, agende "); });
    return { texto: montar(p), msg: atual >= 0 ? "Troquei a abertura por outra mais acolhedora: “" + prox + "”" : "Deixei mais acolhedor: abri com “" + prox + "” e suavizei a chamada.", mudou: true };
  }

  function tecnico(texto, ctx) {
    var p = partes(texto), mudancas = [];
    p.corpo = p.corpo.filter(function (par) { var w = ABERTURAS.indexOf(par.trim()) >= 0; if (w) mudancas.push("tirei a abertura informal"); return !w; });
    var t = montar(p);
    var gl = (ctx && ctx.glossario) || [];
    gl.forEach(function (par) {
      if (!par[1] || norm(t).indexOf(norm(par[1])) >= 0) return;
      var occ = ocorrencias(t, par[0]);
      if (!occ.length) return;
      var o = occ[0];
      t = t.slice(0, o[1]) + " (" + par[1] + ")" + t.slice(o[1]);
      mudancas.push("“" + par[0] + "” ganhou o termo técnico “" + par[1] + "”");
    });
    [["remédios", "medicamentos"], ["remédio", "medicamento"], ["barriga", "abdome"]].forEach(function (par) {
      var r = substituir(t, par[0], par[1]); if (r.n) { t = r.texto; mudancas.push("“" + par[0] + "” → “" + par[1] + "”"); }
    });
    if (t.indexOf(FRASE_TECNICA) < 0) {
      var q = partes(t); q.corpo.push(FRASE_TECNICA); t = montar(q); mudancas.push("incluí uma frase sobre a conduta clínica");
    }
    if (!mudancas.length) return { texto: texto, msg: "O texto já está no registro técnico.", mudou: false };
    return { texto: t, msg: "Deixei mais técnico: " + mudancas.join("; ") + ".", mudou: true };
  }

  function chamada(texto, ctx) {
    var p = partes(texto);
    if (p.cta && /agend/i.test(p.cta)) return { texto: texto, msg: "A peça já termina com chamada para agendar: “" + p.cta + "”", mudou: false };
    p.cta = (p.cta ? p.cta + " " : "") + CTAS[(ctx && ctx.tom) || "sobria"];
    if (!/agend/i.test(p.cta)) p.cta += " Agendamento pelo link da bio.";
    return { texto: montar(p), msg: "Incluí a chamada: “" + p.cta + "”", mudou: true };
  }

  function titulo(texto, novo) {
    var p = partes(texto); p.titulo = cap(tirarAspas(novo));
    return { texto: montar(p), msg: "Título trocado para “" + p.titulo + "”.", mudou: true };
  }

  /* ---------- intenções ---------- */
  var VERBO_TROCA = "(?:troque|troca|trocar|substitua|substitui|substituir|mude|muda|mudar|altere|altera|alterar)";
  var VERBO_TIRA = "(?:tire|tira|tirar|remova|remove|remover|retire|retira|retirar|apague|apaga|apagar|exclua|exclui|excluir|elimine|elimina)";

  function entender(msg) {
    var orig = String(msg || "").trim().replace(/\s+/g, " ");
    var n = norm(orig).replace(/^(por favor|pf|claude|jalecon)[, ]+/, "").replace(/[ ,]*(por favor|pf|obrigad[oa])[.!]*$/, "").trim();
    var o = orig.replace(/^(por favor|pf)[, ]+/i, "");
    var m;
    if (!n) return { tipo: "vazio" };
    if (/\b(desfaz\w*|desfac\w*|undo)\b|volt\w* (como estava|atras|a versao anterior|para a versao anterior)|^volta$/.test(n)) return { tipo: "desfazer" };
    if (/sugest\w* do guardi|guardi\w*.*(sugest|corrig|aplic|ajust|resolv)|(aplic|aceit|segu|us)\w* (a |as )?sugest|^corrig|^consert|corrij/.test(n)) return { tipo: "guardiao" };
    if ((m = o.match(new RegExp("^" + VERBO_TROCA + "\\s+o\\s+t[ií]tulo\\s+(?:para|por)\\s*:?\\s*(.+)$", "i"))) || (m = o.match(/^t[ií]tulo\s*:\s*(.+)$/i))) return { tipo: "titulo", valor: tirarAspas(m[1]) };
    if ((m = o.match(new RegExp("^" + VERBO_TROCA + "\\s+(?:a palavra |o termo |a express[aã]o |a frase )?(.+?)\\s+(?:por|pela palavra|pelo termo)\\s+(.+)$", "i")))) return { tipo: "trocar", de: tirarAspas(m[1]), para: tirarAspas(m[2]) };
    if ((m = o.match(new RegExp("^" + VERBO_TIRA + "\\s+(?:a palavra |o termo |a express[aã]o |a frase |o trecho |as palavras )?(.+)$", "i")))) return { tipo: "remover", valor: tirarAspas(m[1]) };
    if (/mais curt|encurt|resum|enxug|menos texto|diminu|reduz|mais objetiv|menor/.test(n)) return { tipo: "curto" };
    if (/(chamada|cta|convite|botao)\b.*(agend|consult|whats|marcar)|(adicion|coloc|inclu|acrescent|ponh|bot)\w* .*(agend|link|whats|marcar)|chamada para agendar/.test(n)) return { tipo: "cta" };
    if (/tecnic|cientific|formal|termos medicos|mais seri/.test(n)) return { tipo: "tom", valor: "tecnico" };
    if (/acolhed|human|carinh|gentil|afetu|calor|empat|mais leve|mais proxim|suave|delicad/.test(n)) return { tipo: "tom", valor: "acolhedor" };
    if (/^(aprov|pode aprovar|ok,? aprov|esta otimo|ficou otimo)/.test(n)) return { tipo: "aprovar" };
    return { tipo: "desconhecido" };
  }

  var EXEMPLOS = "“mais curto”, “mais acolhedor”, “mais técnico”, “troque joelho por quadril”, “tire a palavra dor”, “adicione chamada para agendar”, “aplicar sugestão do Guardião” ou “desfazer”";

  /* Executa uma intenção sobre o texto. ctx: {perfil, tom, glossario, seed, opcoesGuardiao}
   * Retorna {texto, msg, mudou, pref?} ou {erro} */
  function executar(intencao, texto, ctx) {
    ctx = ctx || {};
    var r;
    switch (intencao.tipo) {
      case "curto":
        r = encurtar(texto); if (r.mudou) r.pref = { t: "curto", rot: "Prefere textos mais curtos" }; return r;
      case "tom":
        r = intencao.valor === "tecnico" ? tecnico(texto, ctx) : acolher(texto, ctx);
        r.pref = { t: "tom", v: intencao.valor, rot: intencao.valor === "tecnico" ? "Tom mais técnico" : "Tom mais acolhedor" };
        return r;
      case "cta":
        r = chamada(texto, ctx); r.pref = { t: "cta", rot: "Sempre terminar com chamada para agendar" }; return r;
      case "trocar":
        if (!intencao.de) return { erro: "Diga o que trocar, por exemplo: “troque joelho por quadril”." };
        r = substituir(texto, intencao.de, intencao.para);
        if (!r.n) return { erro: "Não encontrei “" + intencao.de + "” no texto. Confira a grafia ou peça de outro jeito." };
        return { texto: r.texto, mudou: true, msg: "Troquei “" + intencao.de + "” por “" + intencao.para + "” (" + r.n + (r.n > 1 ? " vezes" : " vez") + ").", pref: { t: "trocar", de: intencao.de, para: intencao.para, rot: "Usar “" + intencao.para + "” em vez de “" + intencao.de + "”" } };
      case "remover":
        if (!intencao.valor) return { erro: "Diga a palavra, por exemplo: “tire a palavra dor”." };
        r = substituir(texto, intencao.valor, "");
        if (!r.n) return { erro: "Não encontrei “" + intencao.valor + "” no texto." };
        return { texto: r.texto, mudou: true, msg: "Tirei “" + intencao.valor + "” (" + r.n + (r.n > 1 ? " ocorrências" : " ocorrência") + ").", pref: { t: "remover", v: intencao.valor, rot: "Evitar “" + intencao.valor + "”" } };
      case "titulo":
        if (!intencao.valor) return { erro: "Diga o novo título, por exemplo: “título: Dor no joelho ao correr”." };
        return titulo(texto, intencao.valor);
      case "guardiao":
        var a = G.aplicarSugestoes(texto, ctx.opcoesGuardiao || {});
        if (!a.aplicadas.length) {
          return { texto: texto, mudou: false, msg: a.manuais.length ? "Não há troca automática para: " + a.manuais.map(function (x) { return x.rotulo; }).join(", ") + ". Esse ponto precisa de ajuste seu." : "O Guardião não tem sugestões pendentes nesta peça." };
        }
        return { texto: a.texto, mudou: true, msg: "Apliquei as sugestões do Guardião: " + a.aplicadas.join("; ") + "." + (a.manuais.length ? " Ainda precisa de ajuste manual: " + a.manuais.map(function (x) { return x.rotulo; }).join(", ") + "." : ""), pref: { t: "guardiao", rot: "Aceita as correções do Guardião" } };
      case "vazio":
        return { erro: "Escreva um pedido, por exemplo: " + EXEMPLOS + "." };
      default:
        return { erro: "Não entendi. Você pode pedir, por exemplo: " + EXEMPLOS + "." };
    }
  }

  /* Usado pelo Redator ao gerar o mês: aplica o que o médico ensinou. */
  function aplicarPreferencias(texto, prefs, ctx) {
    var usadas = [];
    (prefs || []).forEach(function (p) {
      var r = null;
      if (p.t === "remover") { r = substituir(texto, p.v, ""); if (r.n) { texto = r.texto; usadas.push(p.rot); } }
      else if (p.t === "trocar") { r = substituir(texto, p.de, p.para); if (r.n) { texto = r.texto; usadas.push(p.rot); } }
    });
    (prefs || []).forEach(function (p) {
      var r = null;
      if (p.t === "tom") r = p.v === "tecnico" ? tecnico(texto, ctx) : acolher(texto, ctx);
      if (r && r.mudou) { texto = r.texto; usadas.push(p.rot); }
    });
    (prefs || []).forEach(function (p) {
      var r = null;
      if (p.t === "curto") r = encurtar(texto);
      else if (p.t === "cta") r = chamada(texto, ctx);
      if (r && r.mudou) { texto = r.texto; usadas.push(p.rot); }
    });
    return { texto: texto, usadas: usadas };
  }

  var api = { entender: entender, executar: executar, aplicarPreferencias: aplicarPreferencias, partes: partes, substituir: substituir, CTAS: CTAS, EXEMPLOS: EXEMPLOS };
  g.Revisao = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
