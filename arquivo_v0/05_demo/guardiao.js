/* Jalecon · Guardião: motor de regras de conformidade (sem IA, sem servidor).
 * Lê as regras de window.JALECON_REGRAS (guardiao-regras.js).
 * O texto é normalizado caractere a caractere (minúsculas, sem acento), então as
 * posições encontradas no texto normalizado valem para o texto original.
 * Checagem automática: não substitui parecer jurídico.
 */
(function (g) {
  "use strict";
  var REGRAS = g.JALECON_REGRAS;
  if (!REGRAS && typeof require === "function") { REGRAS = require("./guardiao-regras.js"); }
  REGRAS = REGRAS || [];

  var ORDEM = { bloqueia: 0, alerta: 1, orienta: 2 };
  var COMB = /[̀-ͯ]/g;

  function semAcento(s) { return String(s).normalize("NFD").replace(COMB, ""); }

  /* Normaliza mantendo o mesmo comprimento do texto (NFC) de entrada. */
  function normalizar(texto) {
    var t = String(texto == null ? "" : texto).normalize("NFC");
    var out = "";
    for (var i = 0; i < t.length; i++) {
      var c = t.charAt(i);
      var n = semAcento(c).toLowerCase();
      if (n.length !== 1) { var l = c.toLowerCase(); n = l.length === 1 ? l : " "; }
      out += n;
    }
    return out;
  }

  var cache = {};
  function re(p, flags) {
    var k = flags + "|" + p;
    if (cache[k] !== undefined) return cache[k];
    var r = null;
    try { r = new RegExp(semAcento(p).toLowerCase(), flags); } catch (e) { r = null; }
    cache[k] = r;
    return r;
  }
  function algum(lista, n) {
    for (var i = 0; i < (lista || []).length; i++) { var r = re(lista[i], ""); if (r && r.test(n)) return true; }
    return false;
  }
  function regra(id) { for (var i = 0; i < REGRAS.length; i++) if (REGRAS[i].id === id) return REGRAS[i]; return null; }

  var BORDA = /[a-z0-9%$#@º°]/;
  function aparar(n, ini, fim) {
    while (ini < fim && !BORDA.test(n.charAt(ini))) ini++;
    while (fim > ini && !BORDA.test(n.charAt(fim - 1))) fim--;
    return [ini, fim];
  }

  function juntar(trechos) {
    trechos.sort(function (a, b) { return a.ini - b.ini || (b.fim - b.ini) - (a.fim - a.ini); });
    var out = [];
    trechos.forEach(function (s) {
      var u = out[out.length - 1];
      if (u && s.ini < u.fim) { if (s.fim - s.ini > u.fim - u.ini) out[out.length - 1] = s; }
      else out.push(s);
    });
    return out;
  }

  function sobrenome(nome) {
    var partes = normalizar(nome || "").replace(/\b(dra?|dr)\.?\s+/g, "").split(/\s+/).filter(function (p) { return p.length >= 3; });
    return partes.length ? partes[partes.length - 1] : "";
  }

  /* opts: { identificacao: bool, exigirNome: bool, perfil: {nome, crm, uf, rqe, sexo} } */
  function analisar(texto, opts) {
    opts = opts || {};
    var t = String(texto == null ? "" : texto).normalize("NFC");
    var n = normalizar(t);
    var hits = [];
    REGRAS.forEach(function (r) {
      if (r.aplica_se && r.aplica_se.length && !algum(r.aplica_se, n)) return;
      if (r.tipo === "ausencia_obrigatoria") {
        if (!opts.identificacao) return;
        var faltando = [];
        if (r.elementos) {
          r.elementos.forEach(function (e) { if (!algum(e.padroes, n)) faltando.push(e.nome); });
          if (opts.exigirNome && opts.perfil && opts.perfil.nome) {
            var sn = sobrenome(opts.perfil.nome);
            if (sn && n.indexOf(sn) < 0) faltando.push("seu nome");
          }
        } else if (!algum(r.padroes, n)) faltando.push("elemento obrigatório");
        if (faltando.length) hits.push({ regra: r, gravidade: r.gravidade, trechos: [], faltando: faltando });
        return;
      }
      if (algum(r.exceto_se, n)) return;
      var trechos = [];
      r.padroes.forEach(function (p) {
        var rx = re(p, "g");
        if (!rx) return;
        rx.lastIndex = 0;
        var m, guarda = 0;
        while ((m = rx.exec(n)) && guarda++ < 200) {
          if (!m[0].length) { rx.lastIndex++; continue; }
          var ab = aparar(n, m.index, m.index + m[0].length);
          if (ab[1] <= ab[0]) continue;
          var janela = n.slice(Math.max(0, ab[0] - 40), Math.min(n.length, ab[1] + 40));
          if (algum(r.ignorar_contexto, janela)) continue;
          trechos.push({ ini: ab[0], fim: ab[1] });
        }
      });
      if (!trechos.length) return;
      trechos = juntar(trechos).map(function (s) { s.texto = t.slice(s.ini, s.fim); return s; });
      hits.push({ regra: r, gravidade: r.gravidade, trechos: trechos });
    });
    hits.sort(function (a, b) {
      return ORDEM[a.gravidade] - ORDEM[b.gravidade] || ((a.trechos[0] || { ini: 1e9 }).ini - (b.trechos[0] || { ini: 1e9 }).ini);
    });
    var cont = { bloqueia: 0, alerta: 0, orienta: 0 };
    hits.forEach(function (h) { cont[h.gravidade]++; });
    return { texto: t, hits: hits, contagem: cont, liberado: cont.bloqueia === 0 };
  }

  /* ---------- sugestões e correção automática ---------- */
  function capitalizar(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function limitesFrase(t, ini, fim) {
    var a = ini;
    while (a > 0 && !/[.!?\n]/.test(t.charAt(a - 1))) a--;
    while (a < ini && /[ \t]/.test(t.charAt(a))) a++;
    var b = fim;
    while (b < t.length && !/[.!?\n]/.test(t.charAt(b))) b++;
    while (b < t.length && /[.!?]/.test(t.charAt(b))) b++;
    while (b < t.length && /[ \t]/.test(t.charAt(b))) b++;
    return [a, b];
  }

  function trocaPara(r, orig, norm) {
    var lista = r.trocas || [];
    for (var i = 0; i < lista.length; i++) {
      var rx = re(lista[i][0], "d");
      if (!rx) continue;
      var m = rx.exec(norm);
      if (!m) continue;
      var repl = lista[i][1];
      if (repl.indexOf("=FRASE=") === 0) return { frase: repl.slice(7) };
      var novo = repl.replace(/\$(\d)/g, function (_, k) {
        var ix = m.indices && m.indices[+k];
        return ix ? orig.slice(ix[0], ix[1]) : "";
      });
      var res = orig.slice(0, m.index) + novo + orig.slice(m.index + m[0].length);
      if (/^[A-ZÀ-Ý]/.test(orig) && !/^[A-ZÀ-Ý]/.test(res)) res = capitalizar(res);
      return { texto: res };
    }
    return null;
  }

  function assinatura(p) {
    if (!p) return "";
    var f = p.sexo === "f";
    var partes = [p.nome, f ? "MÉDICA" : "MÉDICO", "CRM-" + (p.uf || "").toUpperCase() + " " + (p.crm || "")];
    if (p.rqe) { if (p.especialidade) partes.push(p.especialidade); partes.push("RQE " + p.rqe); }
    return partes.filter(Boolean).join(" · ");
  }

  function limpar(t) {
    return t.split("\n").map(function (l) {
      return l.replace(/[ \t]{2,}/g, " ")
        .replace(/ +([,.!?;:])/g, "$1")
        .replace(/([·|•])\s*(?:[·|•]\s*)+/g, "$1 ")
        .replace(/^\s*[·|•,;]\s*/, "")
        .replace(/\s*[·|•,;]\s*$/, "")
        .replace(/^\s+|\s+$/g, "")
        .replace(/^([a-zà-ý])/, function (c) { return c.toUpperCase(); });
    }).join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\n+|\n+$/g, "");
  }

  /* Aplica as sugestões do Guardião ao texto. Retorna {texto, aplicadas, manuais, resultado}. */
  function aplicarSugestoes(texto, opts) {
    opts = opts || {};
    var p = opts.perfil || null;
    var t = String(texto || "").normalize("NFC");
    var aplicadas = [], manuais = {};
    for (var volta = 0; volta < 6; volta++) {
      var res = analisar(t, opts);
      var n = normalizar(t);
      var edits = [];
      var precisaAss = false, precisaRqe = false;
      res.hits.forEach(function (h) {
        var r = h.regra;
        if (h.gravidade === "orienta") return;
        if (r.tipo === "ausencia_obrigatoria") {
          if (r.correcao === "assinatura" && p && p.nome && p.crm) precisaAss = true; else manuais[r.id] = r;
          return;
        }
        if (r.correcao === "rqe") {
          if (p && p.rqe) { precisaRqe = true; return; }
          h.trechos.forEach(function (s) {
            var ns = n.slice(s.ini, s.fim), novo;
            if (/especializad[oa] em|especialista em/.test(ns)) novo = "com atuação em";
            else if (/especialista/.test(ns)) novo = p && p.sexo === "f" ? "médica" : "médico";
            else if (/especialidade/.test(ns)) novo = "área de atuação";
            else if (/^sou\b/.test(ns)) novo = "sou " + (p && p.sexo === "f" ? "médica" : "médico");
            else if (/^m[e]dic[oa] /.test(ns)) novo = s.texto.split(/\s+/)[0];
            else novo = "";
            edits.push({ ini: s.ini, fim: s.fim, novo: novo, desc: "“" + s.texto + "” " + (novo ? "→ “" + novo + "”" : "removido") + " (sem RQE)" });
          });
          if (!h.trechos.length) manuais[r.id] = r;
          return;
        }
        h.trechos.forEach(function (s) {
          var tr = trocaPara(r, s.texto, n.slice(s.ini, s.fim));
          if (tr && tr.frase != null) {
            var fb = limitesFrase(t, s.ini, s.fim);
            edits.push({ ini: fb[0], fim: fb[1], novo: tr.frase + " ", desc: "frase com “" + s.texto + "” reescrita" });
          } else if (tr) {
            edits.push({ ini: s.ini, fim: s.fim, novo: tr.texto, desc: "“" + s.texto + "” → “" + tr.texto + "”" });
          } else if (r.correcao === "frase") {
            var f2 = limitesFrase(t, s.ini, s.fim);
            edits.push({ ini: f2[0], fim: f2[1], novo: "", desc: "frase removida: “" + t.slice(f2[0], f2[1]).trim() + "”" });
          } else manuais[r.id] = r;
        });
      });
      if (!edits.length && !precisaAss && !precisaRqe) break;
      edits.sort(function (a, b) { return b.ini - a.ini || (b.fim - b.ini) - (a.fim - a.ini); });
      var limite = Infinity;
      edits.forEach(function (e) {
        if (e.fim > limite) return;
        t = t.slice(0, e.ini) + e.novo + t.slice(e.fim);
        limite = e.ini;
        aplicadas.push(e.desc);
      });
      t = limpar(t);
      if (precisaAss) {
        t = t + "\n\n" + assinatura(p);
        aplicadas.push("identificação incluída: " + assinatura(p));
      } else if (precisaRqe) {
        var linhas = t.split("\n"), feito = false;
        for (var i = linhas.length - 1; i >= 0; i--) {
          if (/crm/i.test(linhas[i])) { linhas[i] = linhas[i] + " · RQE " + p.rqe; feito = true; break; }
        }
        t = feito ? linhas.join("\n") : t + "\n\nRQE " + p.rqe;
        aplicadas.push("RQE " + p.rqe + " incluído");
      }
    }
    var final = analisar(t, opts);
    var restantes = {};
    final.hits.forEach(function (h) { if (h.gravidade !== "orienta") restantes[h.regra.id] = h.regra; });
    return { texto: t, aplicadas: aplicadas, manuais: Object.keys(restantes).map(function (k) { return restantes[k]; }), resultado: final };
  }

  /* ---------- apresentação ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; }); }

  function destacar(res) {
    var t = res.texto, marcas = [];
    res.hits.forEach(function (h) {
      h.trechos.forEach(function (s) { marcas.push({ ini: s.ini, fim: s.fim, g: h.gravidade, id: h.regra.id, rot: h.regra.rotulo }); });
    });
    marcas.sort(function (a, b) { return a.ini - b.ini || ORDEM[a.g] - ORDEM[b.g]; });
    var out = "", pos = 0;
    marcas.forEach(function (m) {
      if (m.ini < pos) return;
      out += esc(t.slice(pos, m.ini));
      out += '<mark class="g-mark g-' + m.g + '" data-rule="' + esc(m.id) + '" title="' + esc(m.rot) + '">' + esc(t.slice(m.ini, m.fim)) + "</mark>";
      pos = m.fim;
    });
    return out + esc(t.slice(pos));
  }

  function citacao(r) {
    if (r.confirmado) return { texto: r.artigo, validacao: false };
    return { texto: r.norma, validacao: true };
  }

  var api = {
    regras: REGRAS, regra: regra, normalizar: normalizar, analisar: analisar,
    aplicarSugestoes: aplicarSugestoes, destacar: destacar, citacao: citacao, assinatura: assinatura, limpar: limpar,
    rotulo: function (g) { return { bloqueia: "bloqueia", alerta: "alerta", orienta: "orienta" }[g]; }
  };
  g.Guardiao = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
