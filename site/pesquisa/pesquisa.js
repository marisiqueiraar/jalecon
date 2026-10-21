/* Jalecon · formulário da pesquisa sem agenda. Sem links para o resto do site.
 * Envia as respostas para o Apps Script da planilha "02 · Entrevistas v1 · placar"
 * (endereço em config.js). Rascunho salvo no navegador, se disponível.
 */
(function () {
  "use strict";
  var PUB = document.body.getAttribute("data-publico");
  var P = window.PESQUISA[PUB];
  var ENDPOINT = window.PESQUISA_ENDPOINT || "";
  var CHAVE = "jalecon-pesquisa-" + PUB;
  var app = document.getElementById("app");

  var S = { secao: 0, r: {}, fim: null };
  var erros = {};

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; }); }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) { /* sem armazenamento */ } }
  function carregar() { try { var o = JSON.parse(localStorage.getItem(CHAVE) || "null"); if (o && o.r) S = o; } catch (e) { /* ok */ } }

  function visiveis(sec) { return sec.perguntas.filter(function (q) { return !q.se || q.se(S.r); }); }
  function textos(sec) { return sec.textoFn ? sec.textoFn(S.r) : (sec.texto || []); }

  function campo(q) {
    var v = S.r[q.id], err = erros[q.id];
    var aria = err ? ' aria-invalid="true" aria-describedby="e-' + q.id + '"' : "";
    var msg = err ? '<span class="err" id="e-' + q.id + '">' + esc(err) + "</span>" : "";
    var obrig = q.obrig ? "" : ' <span class="opc">(opcional)</span>';
    if (q.tipo === "nota") return '<p class="nota">' + esc(q.rot) + "</p>";
    if (q.tipo === "radio" || q.tipo === "checks") {
      var tipo = q.tipo === "radio" ? "radio" : "checkbox";
      return '<fieldset class="q"' + (err ? ' aria-describedby="e-' + q.id + '"' : "") + "><legend>" + esc(q.rot) + obrig + "</legend>" +
        '<div class="ops">' + q.ops.map(function (o, i) {
          var on = tipo === "radio" ? v === o[0] : Array.isArray(v) && v.indexOf(o[0]) >= 0;
          return '<label class="op"><input type="' + tipo + '" name="' + q.id + '" value="' + esc(o[0]) + '" data-q="' + q.id + '"' + (on ? " checked" : "") + "><span>" + esc(o[1]) + "</span></label>";
        }).join("") + "</div>" + msg + "</fieldset>";
    }
    var id = "f-" + q.id, inp;
    if (q.tipo === "select") inp = '<select id="' + id + '" data-q="' + q.id + '"' + aria + '><option value="">Escolha</option>' + q.ops.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (v === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select>";
    else if (q.tipo === "textarea") inp = '<textarea id="' + id + '" data-q="' + q.id + '" maxlength="1500" rows="3"' + aria + ">" + esc(v || "") + "</textarea>";
    else if (q.tipo === "number") inp = '<div class="num">' + (q.pre ? '<span aria-hidden="true">' + q.pre + "</span>" : "") + '<input id="' + id + '" data-q="' + q.id + '" inputmode="numeric" autocomplete="off" value="' + esc(v == null ? "" : v) + '"' + aria + ">" + (q.suf ? '<span aria-hidden="true">' + q.suf + "</span>" : "") + "</div>";
    else inp = '<input id="' + id + '" data-q="' + q.id + '" maxlength="300" autocomplete="off" value="' + esc(v || "") + '"' + aria + ">";
    return '<div class="q"><label for="' + id + '">' + esc(q.rot) + obrig + "</label>" + inp + msg + "</div>";
  }

  function vSecao() {
    var sec = P.secoes[S.secao], n = P.secoes.length, ultima = S.secao === n - 1;
    return '<p class="passo">Página ' + (S.secao + 1) + " de " + n + '</p><div class="barra" aria-hidden="true"><span style="width:' + ((S.secao + 1) / n * 100) + '%"></span></div>' +
      '<h2 tabindex="-1">' + esc(sec.titulo) + "</h2>" +
      (S.secao === 0 ? '<p class="muted">' + esc(P.intro) + "</p>" : "") +
      textos(sec).map(function (t) { return '<p class="ctx">' + esc(t) + "</p>"; }).join("") +
      '<form id="form" novalidate>' + visiveis(sec).map(campo).join("") +
      '<div class="hp" aria-hidden="true"><label>Não preencha<input name="site" tabindex="-1" autocomplete="off"></label></div>' +
      (Object.keys(erros).length ? '<p class="err" role="alert">Falta responder ou corrigir algumas perguntas acima.</p>' : "") +
      '<div class="acoes">' + (S.secao === 1 ? '<button type="button" class="btn ghost" data-act="voltar">Voltar</button>' : "") +
      '<button type="submit" class="btn">' + (ultima ? "Enviar respostas" : "Continuar") + "</button></div></form>" +
      (S.secao === 1 ? '<p class="small">Depois desta página não dá para voltar e mudar as respostas.</p>' : "");
  }
  function vFim() {
    var t = { enviado: ["Obrigado!", "Suas respostas foram enviadas. Elas vão ajudar muito o nosso projeto."],
              fora: ["Obrigado!", "Esta pesquisa é para outro perfil, então não precisa continuar. Agradecemos o seu tempo."],
              erro: ["Não conseguimos enviar", "Verifique a internet e tente de novo. Suas respostas continuam aqui."],
              off: ["Pesquisa ainda fechada", "A pesquisa ainda não está recebendo respostas. Tente de novo mais tarde."] }[S.fim];
    return '<h2 tabindex="-1">' + esc(t[0]) + '</h2><p class="muted">' + esc(t[1]) + "</p>" +
      (S.fim === "erro" ? '<div class="acoes"><button type="button" class="btn" data-act="reenviar">Tentar de novo</button></div>' : "");
  }

  function render() {
    app.innerHTML = '<header class="topo"><svg viewBox="0 0 100 100" width="28" height="28" aria-hidden="true"><rect width="100" height="100" rx="24" fill="#1F2440"/><polygon points="24,36 37,36 50,64 44,76" fill="#F7F8FA"/><polygon points="44,76 50,64 67,24 80,24" fill="#E8A27C"/></svg><span>Pesquisa acadêmica · Insper</span></header>' +
      '<main><h1>' + esc(P.titulo) + "</h1>" + (S.fim && S.fim !== "erro" ? vFim() : S.fim === "erro" ? vFim() : vSecao()) + "</main>";
    var h = app.querySelector("h2"); if (h) h.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    salvar();
  }

  function num(v) { var d = String(v == null ? "" : v).replace(/[^\d]/g, ""); return d ? parseInt(d, 10) : null; }
  function validar() {
    erros = {};
    visiveis(P.secoes[S.secao]).forEach(function (q) {
      var v = S.r[q.id];
      if (q.tipo === "nota") return;
      var vazio = v == null || v === "" || (Array.isArray(v) && !v.length);
      if (q.obrig && vazio) { erros[q.id] = "Responda esta pergunta."; return; }
      if (q.tipo === "number" && !vazio) {
        if (num(v) == null) erros[q.id] = "Use só números.";
        else if (q.min != null && num(v) < q.min) erros[q.id] = "O mínimo é " + q.min + ".";
        else if (q.max != null && num(v) > q.max) erros[q.id] = "O máximo é " + q.max + ".";
      }
    });
    return !Object.keys(erros).length;
  }
  function foraDoPublico() {
    return visiveis(P.secoes[S.secao]).some(function (q) {
      if (q.encerra != null && S.r[q.id] === q.encerra) return true;
      if (q.encerraSe && num(S.r[q.id]) != null && q.encerraSe(num(S.r[q.id]))) return true;
      return false;
    });
  }
  function limparOcultas() {
    P.secoes.forEach(function (sec) { sec.perguntas.forEach(function (q) { if (q.se && !q.se(S.r)) delete S.r[q.id]; }); });
  }
  function payload() {
    var r = {};
    Object.keys(S.r).forEach(function (k) {
      var v = S.r[k];
      r[k] = Array.isArray(v) ? v.slice(0, 10) : typeof v === "string" ? v.slice(0, 1500) : v;
    });
    P.secoes.forEach(function (sec) { sec.perguntas.forEach(function (q) { if (q.tipo === "number" && r[q.id] != null) r[q.id] = num(r[q.id]); }); });
    Object.keys(r).forEach(function (k) { if (r[k] === "ns") r[k] = ""; });
    if (Array.isArray(r.p_ns) && r.p_ns.length) { ["p_barato", "p_bom", "p_caro", "p_caro_demais"].forEach(function (k) { r[k] = ""; }); }
    if (P.derivar) P.derivar(r);
    return JSON.stringify({ publico: PUB, versao: 1, r: r, hp: (app.querySelector('[name="site"]') || {}).value || "" });
  }
  function enviar() {
    if (!ENDPOINT) { S.fim = "off"; render(); return; }
    var btn = app.querySelector('button[type="submit"], [data-act="reenviar"]');
    if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }
    fetch(ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: payload() })
      .then(function () { S.fim = "enviado"; S.r = {}; render(); })
      .catch(function () { S.fim = "erro"; render(); });
  }

  app.addEventListener("input", function (ev) {
    var t = ev.target, q = t.getAttribute("data-q");
    if (!q || t.type === "radio" || t.type === "checkbox") return;
    S.r[q] = t.value; salvar();
  });
  app.addEventListener("change", function (ev) {
    var t = ev.target, q = t.getAttribute("data-q");
    if (!q) return;
    if (t.type === "radio" || t.tagName === "SELECT") S.r[q] = t.value;
    else if (t.type === "checkbox") {
      var def = null;
      P.secoes.forEach(function (sec) { sec.perguntas.forEach(function (x) { if (x.id === q) def = x; }); });
      var l = (S.r[q] || []).filter(function (x) { return x !== t.value; });
      if (t.checked) { if (def && def.exclusivo === t.value) l = [t.value]; else { l = l.filter(function (x) { return !def || x !== def.exclusivo; }); l.push(t.value); } }
      S.r[q] = l;
    } else return;
    if (erros[q]) delete erros[q];
    limparOcultas();
    var y = window.scrollY; render(); window.scrollTo(0, y);
    var el = t.tagName === "SELECT" ? app.querySelector('select[data-q="' + q + '"]') : app.querySelector('[data-q="' + q + '"][value="' + CSS.escape(t.value) + '"]'); if (el) el.focus();
  });
  app.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!validar()) { render(); var f = app.querySelector('[aria-invalid="true"], fieldset[aria-describedby] input'); if (f) f.focus(); return; }
    if (foraDoPublico()) { S.fim = "fora"; S.r = {}; render(); return; }
    if (S.secao < P.secoes.length - 1) { S.secao++; render(); return; }
    enviar();
  });
  app.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-act]"); if (!b) return;
    if (b.dataset.act === "voltar") { S.secao = Math.max(0, S.secao - 1); erros = {}; render(); }
    if (b.dataset.act === "reenviar") enviar();
  });

  carregar();
  if (S.fim === "erro") S.fim = null;
  render();
})();
