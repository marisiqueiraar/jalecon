/* Jalecon · versão web para clínicas: núcleo (estado, menu, rotas, papéis, modo banca e modo entrevista).
 * JavaScript puro, sem servidor e sem build. Estado salvo no navegador (localStorage, se houver).
 * As telas ficam em web-ciclo.js, web-operacao.js e web-banca.js e se registram em JW.views.
 */
(function (g) {
  "use strict";
  var G = g.Guardiao, C = g.Clinica, CT = g.Conteudo, R = g.Revisao, K = g.Critica, N = g.Negocio, P = g.Pesquisa, A = g.Atendimento;
  var CHAVE = "jalecon-web-v1";

  var ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.6-3.4 2.8-5.5 5.5-5.5s4.9 2.1 5.5 5.5M14 15.2c.9-.5 1.9-.7 3-.7 2.3 0 4.1 1.8 4.5 4.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke-linecap="round"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-5a3 3 0 0 0-1 .2"/><path d="M20 4v14h-6"/></svg>',
    test: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.8 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4h11l-2 4 2 4H5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    logo: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="24" fill="#2A3058"/><polygon points="24,36 37,36 50,64 44,76" fill="#F7F8FA"/><polygon points="44,76 50,64 67,24 80,24" fill="#E8A27C"/></svg>'
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(n) { return Math.round(n).toLocaleString("pt-BR"); }
  function pct(x) { return Math.round(x * 100) + "%"; }
  function agora() { var d = new Date(); return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); }
  function sim(txt) { return '<p class="sim">' + esc(txt || "Simulação com dados fictícios. No piloto, estes números são medidos.") + "</p>"; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ---------- estado ---------- */
  function estadoInicial() {
    return {
      diag: C.diagPadrao(), diagFeito: false, passo: 0, prem: C.premissasPadrao(), entrevista: false,
      papel: "gestor", medicoPapel: "m0",
      estudio: {}, fila: null, registro: [], pecaAberta: null,
      chat: null, chatLog: [], agenda: null, espera: null, eventos: [],
      teste: null, criticaTexto: null, bibFiltro: { q: "", grav: "", status: "" },
      negocio: {}, piloto: {}, aba: {}
    };
  }
  var S = estadoInicial();
  var T = { erros: {}, toastTimer: null, t0: null, acumulado: 0, confirmar: false, foco: false };
  var BANCA = false, MENU_BANCA = true;

  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) { /* sem armazenamento: segue sem lembrar */ } }
  function carregar() {
    try {
      var raw = localStorage.getItem(CHAVE);
      if (raw) { var o = JSON.parse(raw); if (o && o.diag) S = Object.assign(estadoInicial(), o); }
    } catch (e) { /* ok */ }
    try {
      var q = new URLSearchParams(location.search);
      if (q.get("entrevista") === "1") S.entrevista = true;
      if (q.get("entrevista") === "0") S.entrevista = false;
      if (q.get("banca") === "1") BANCA = true;
    } catch (e) { /* ok */ }
  }

  /* ---------- derivados ---------- */
  function eq() { return C.equipe(S.diag); }
  function medico(id) { var l = eq(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function autorNome(p) { if (p.autor === "clinica") return S.diag.nome || "Clínica"; var m = medico(p.autor); return m ? C.titulo(m) : ""; }
  function opcoesPeca(p) {
    if (p.autor === "clinica") return { identificacao: true, exigirNome: false, perfil: null };
    var m = medico(p.autor);
    return { identificacao: true, exigirNome: true, perfil: m ? C.perfil(m) : null };
  }
  function pendentes() { return (S.fila || []).filter(function (p) { return p.status === "pendente"; }).length; }
  function diretor() { return (S.diag.diretorSexo === "m" ? "Dr. " : "Dra. ") + (S.diag.diretor || "") + " · CRM-" + S.diag.uf + " " + (S.diag.diretorCrm || ""); }
  function preparar() {
    S.fila = C.fila(S.diag, eq());
    S.agenda = C.agenda(eq());
    S.espera = C.ESPERA.map(function (e, i) { return { id: "e" + i, nome: e[0], pref: e[1], usado: false }; });
    S.chat = A.novo(BANCA ? "noite" : "noite");
    S.registro = []; S.eventos = []; S.estudio = {}; S.chatLog = [];
    if (!medico(S.medicoPapel)) S.medicoPapel = "m0";
  }
  function evento(tipo, txt) { S.eventos.push({ tipo: tipo, txt: txt, quando: agora() }); }
  function preco(v) { return S.entrevista ? "" : C.brl(v); }

  /* ---------- pedaços de interface ---------- */
  function campo(id, rotulo, html, ajuda) {
    var err = T.erros[id];
    return '<div class="field"><label for="f-' + id + '">' + esc(rotulo) + "</label>" + html + (ajuda ? '<span class="help">' + esc(ajuda) + "</span>" : "") + (err ? '<span class="err" id="e-' + id + '">' + esc(err) + "</span>" : "") + "</div>";
  }
  function input(id, valor, extra) {
    return '<input id="f-' + id + '" data-k="' + id + '" value="' + esc(valor) + '"' + (T.erros[id] ? ' aria-invalid="true" aria-describedby="e-' + id + '"' : "") + (extra || "") + ">";
  }
  function radios(nome, opcoes, atual, legenda) {
    return "<fieldset><legend>" + esc(legenda) + '</legend><div class="chips">' + opcoes.map(function (o, i) {
      return '<label class="chip"><input type="radio" name="' + nome + '" id="r-' + nome + i + '" value="' + esc(o[0]) + '" data-k="' + nome + '"' + (String(atual) === String(o[0]) ? " checked" : "") + "><span>" + esc(o[1]) + "</span></label>";
    }).join("") + "</div></fieldset>";
  }
  function avatar(m, tam) {
    tam = tam || 36;
    return '<span class="avatar" style="width:' + tam + "px;height:" + tam + "px;background:" + m.cor + '" aria-hidden="true">' + esc(C.iniciais(m.nome)) + "</span>";
  }
  function cab(eyebrow, titulo, lead, extra) {
    return '<div class="cab">' + (eyebrow ? '<span class="eyebrow">' + esc(eyebrow) + "</span>" : "") + "<h1 tabindex=\"-1\">" + esc(titulo) + "</h1>" + (lead ? '<p class="lead">' + lead + "</p>" : "") + (extra || "") + "</div>";
  }
  function kpi(rot, val, sub, hero) { return '<div class="kpi' + (hero ? " hero" : "") + '"><span class="small">' + esc(rot) + "</span><b>" + val + "</b>" + (sub ? '<span class="small">' + sub + "</span>" : "") + "</div>"; }
  function resumoG(res) {
    var c = res.contagem;
    if (!res.hits.length) return '<span class="pill ok">liberado</span>';
    return [c.bloqueia ? '<span class="pill block">' + c.bloqueia + " bloqueia</span>" : "", c.alerta ? '<span class="pill warn">' + c.alerta + " alerta</span>" : "", c.orienta ? '<span class="pill info">' + c.orienta + " orienta</span>" : ""].join(" ");
  }
  function painelHits(res) {
    if (!res.hits.length) return '<p class="ok-line">' + ICON.ok + "<b>Liberado: nenhuma regra violada.</b></p>";
    return '<div class="hits">' + res.hits.map(function (h) {
      var cit = G.citacao(h.regra);
      var q = h.faltando ? "Falta: " + h.faltando.join(", ") : h.trechos.map(function (s) { return "“" + s.texto + "”"; }).join(", ");
      return '<div class="hit ' + h.gravidade + '"><div class="row between" style="align-items:flex-start"><b style="font-size:13.5px">' + esc(cap(h.regra.rotulo)) + '</b><span class="pill ' + (h.gravidade === "bloqueia" ? "block" : h.gravidade === "alerta" ? "warn" : "info") + '">' + h.gravidade + '</span></div><p class="q">' + esc(q) + '</p><p class="small">' + esc(h.regra.explicacao) + "</p>" + (h.regra.sugestao ? '<p class="small"><b>Sugestão:</b> ' + esc(h.regra.sugestao) + "</p>" : "") + '<p class="cit">' + esc(cit.texto) + (cit.validacao ? ' <span class="val">regra em validação jurídica</span>' : "") + "</p></div>";
    }).join("") + "</div>";
  }
  function semClinica() {
    return cab("Comece por aqui", "Primeiro, a anamnese da clínica", "As telas da plataforma usam as respostas do gestor: número de médicos, especialidades, quem responde o WhatsApp, faltas e gastos. Leva cerca de 3 minutos.") +
      '<div class="row wrap"><button class="btn" type="button" data-go="anamnese">Fazer a anamnese</button><button class="btn ghost" type="button" data-act="exemplo">Usar a clínica de exemplo</button></div>';
  }
  function exigePapel(papel, rotulo) {
    if (S.papel === papel) return "";
    return '<div class="aviso">' + ICON.warn.replace("<svg", '<svg width="18" height="18"') + "<span class=\"grow\">" + esc(rotulo) + '</span><button class="btn sm" type="button" data-act="papel" data-papel="' + papel + '">Entrar como ' + (papel === "diretor" ? "diretor técnico" : papel === "medico" ? "médico" : "gestor") + "</button></div>";
  }

  /* ---------- menu ---------- */
  var MENU = [
    { grupo: "", itens: [["inicio", "Visão geral", ICON.home]] },
    { grupo: "Ciclo Jalecon", itens: [["anamnese", "Anamnese e raio-x", 1], ["estudio", "Estúdio", 2], ["revisao-ia", "IA revisa IA", 3], ["revisao", "Médico revisa", 4], ["aprovacao", "Guardião e aprovação", 5], ["pulso", "Pulso: painel", 6]] },
    { grupo: "Atendimento", itens: [["whatsapp", "WhatsApp que agenda", ICON.chat], ["agenda", "Agenda e faltas", ICON.cal]] },
    { grupo: "Guardião", itens: [["guardiao-teste", "Testar o Guardião", ICON.test], ["biblioteca", "Biblioteca normativa", ICON.book], ["registro", "Trilha de auditoria", ICON.list]] },
    { grupo: "Clínica", itens: [["medicos", "Médicos e identidades", ICON.team], ["planos", "Planos", ICON.tag]] },
    { grupo: "Bastidores · banca", itens: [["validacao", "Validação e pesquisa", ICON.chart], ["viabilidade", "Viabilidade", ICON.coin], ["piloto", "Piloto e pedido", ICON.flag]] }
  ];
  var ALIAS = { raiox: "anamnese", peca: "aprovacao" };

  var PASSOS_BANCA = [
    { rota: "raiox", rot: "Raio-x da clínica", tempo: "0:00", fala: "Onde a clínica perde pacientes, calculado com as respostas do gestor.", papel: "gestor" },
    { rota: "peca/p1", rot: "Guardião e aprovação", tempo: "0:45", fala: "O post fere regras do CFM. Aplique as sugestões e aprove como diretor técnico.", papel: "diretor" },
    { rota: "guardiao-teste", rot: "A banca testa o Guardião", tempo: "2:00", fala: "Peça a alguém da banca uma frase de anúncio e digite.", papel: "diretor", reset: "teste" },
    { rota: "whatsapp", rot: "WhatsApp que agenda", tempo: "3:00", fala: "O paciente escreve; o agente responde em segundos e marca na agenda.", papel: "gestor" },
    { rota: "pulso", rot: "Painel: o que aconteceu", tempo: "4:00", fala: "Consultas por canal e por médico, e o que acabamos de fazer.", papel: "gestor" }
  ];

  function rotaAtual() { var h = (location.hash || "").replace(/^#\/?/, ""); try { h = decodeURIComponent(h); } catch (e) { /* ok */ } var p = h.split("/"); return { nome: p[0] || "inicio", arg: p.slice(1).join("/") }; }

  function renderSide() {
    var el = document.getElementById("side"), r = rotaAtual(), cur = ALIAS[r.nome] || r.nome;
    var topo = '<button class="brand" type="button" data-go="inicio">' + ICON.logo + "<span>jalecon<small>para clínicas · versão web</small></span></button>";
    if (BANCA && MENU_BANCA) {
      el.innerHTML = topo + '<div class="grupo"><h2>Demo da banca · 5 minutos</h2>' +
        '<div class="crono-box"><span id="crono" class="crono">0:00</span><span class="small" style="color:#9DA2BC">de 5:00</span></div>' +
        '<div class="row wrap" style="padding:0 6px"><button class="btn-side" type="button" data-act="crono" id="crono-bt">Iniciar</button><button class="btn-side ghost" type="button" data-act="crono-zerar">Zerar</button></div></div>' +
        '<button class="btn-side" type="button" data-act="preparar-banca">Preparar a demo (começa do zero)</button>' +
        '<div class="grupo" style="gap:6px">' + PASSOS_BANCA.map(function (p, i) {
          var rr = rotaAtual(), on = ((rr.nome + (rr.arg ? "/" + rr.arg : "")) === p.rota);
          return '<button type="button" class="passo-b' + (on ? " on" : "") + '" data-banca="' + i + '"' + (on ? ' aria-current="step"' : "") + "><b>" + (i + 1) + '</b><span><span>' + esc(p.rot) + '</span><span class="fala">' + esc(p.fala) + '</span></span><span class="tm">' + p.tempo + "</span></button>";
        }).join("") + "</div>" +
        '<div class="rodape"><button type="button" data-act="menu-completo">Ver o menu completo</button><span>Dados fictícios. Guardião, raio-x, aprovação, WhatsApp e agenda rodam no navegador.</span></div>';
      atualizarCrono();
      return;
    }
    var pend = S.fila ? pendentes() : 0;
    el.innerHTML = topo + MENU.map(function (gr) {
      return '<nav class="grupo" aria-label="' + esc(gr.grupo || "Início") + '">' + (gr.grupo ? "<h2>" + esc(gr.grupo) + "</h2>" : "") + gr.itens.map(function (it) {
        var on = cur === it[0];
        var ic = typeof it[2] === "number" ? '<span class="n">' + it[2] + "</span>" : it[2];
        var badge = it[0] === "aprovacao" && pend ? '<span class="badge" aria-label="' + pend + ' peças esperam aprovação">' + pend + "</span>" : "";
        return '<button type="button" class="item' + (on ? " on" : "") + '" data-go="' + it[0] + '"' + (on ? ' aria-current="page"' : "") + ">" + ic + "<span>" + esc(it[1]) + "</span>" + badge + "</button>";
      }).join("") + "</nav>";
    }).join("") +
      '<div class="rodape"><label class="switch"><input type="checkbox" data-act-change="entrevista"' + (S.entrevista ? " checked" : "") + '><span><b>Modo entrevista</b><br>Esconde preços e planos, para não ancorar a pergunta de preço.</span></label>' +
      (BANCA ? '<button type="button" data-act="menu-banca">Voltar ao roteiro da banca</button>' : "") +
      '<button type="button" data-act="recomecar" id="bt-recomecar">Recomeçar a demo do zero</button><span>Projeto acadêmico · Grupo 1 · Digital Innovation Strategy · Insper · 2026</span></div>';
  }

  function renderTopo() {
    var el = document.getElementById("topbar"), ms = S.diagFeito ? eq() : [];
    var clin = S.diagFeito ? "<b>" + esc(S.diag.nome) + "</b><span>" + esc(C.PLANOS[C.planoPara(+S.diag.medicos)].nome) + " · " + ms.length + " médicos · " + esc(S.diag.cidade) + "</span>" : "<b>Nenhuma clínica carregada</b><span>Faça a anamnese ou use a clínica de exemplo</span>";
    var papeis = S.diagFeito ? '<div class="papel"><span class="rot">Ver como</span><div class="seg" role="group" aria-label="Ver a plataforma como">' +
      [["gestor", "Gestor"], ["diretor", "Diretor técnico"], ["medico", "Médico"]].map(function (p) { return '<button type="button" data-act="papel" data-papel="' + p[0] + '" class="' + (S.papel === p[0] ? "on" : "") + '" aria-pressed="' + (S.papel === p[0]) + '">' + p[1] + "</button>"; }).join("") +
      (S.papel === "medico" ? '<select aria-label="Qual médico" data-act-change="medico-papel">' + ms.map(function (m) { return '<option value="' + m.id + '"' + (S.medicoPapel === m.id ? " selected" : "") + ">" + esc(C.titulo(m)) + "</option>"; }).join("") + "</select>" : "") +
      "</div></div>" : "";
    el.innerHTML = '<button class="menu-bt" type="button" data-act="menu" aria-label="Abrir o menu">' + ICON.menu + '</button><div class="clin">' + clin + '</div><span class="esp"></span>' + papeis + '<span class="tag-ex">dados fictícios</span>' + (S.entrevista ? '<span class="pill info">modo entrevista</span>' : "");
  }

  var VIEWS = {}, ACOES = {}, INPUTS = {}, DEPOIS = {};
  var LIVRES = ["inicio", "anamnese", "guardiao-teste", "biblioteca", "validacao", "viabilidade", "piloto", "planos", "revisao-ia"];

  function render(opts) {
    opts = opts || {};
    var r = rotaAtual(), v = VIEWS[r.nome] || VIEWS.inicio;
    var main = document.getElementById("conteudo");
    var html;
    if (!S.diagFeito && LIVRES.indexOf(r.nome) < 0) html = semClinica();
    else html = v(r.arg);
    var y = window.scrollY;
    main.innerHTML = html;
    renderSide(); renderTopo();
    if (opts.topo) window.scrollTo(0, 0); else window.scrollTo(0, y);
    if (opts.topo || T.foco) { var h = main.querySelector("h1"); if (h) h.focus({ preventScroll: true }); T.foco = false; }
    if (DEPOIS[r.nome]) DEPOIS[r.nome](r.arg);
    salvar();
  }
  function ir(rota) {
    document.body.classList.remove("menu-aberto");
    T.erros = {}; T.foco = true;
    var alvo = "#/" + rota;
    if (location.hash === alvo) render({ topo: true }); else location.hash = alvo;
  }
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.hidden = false;
    document.getElementById("anuncio").textContent = msg;
    clearTimeout(T.toastTimer);
    T.toastTimer = setTimeout(function () { t.hidden = true; }, 3400);
  }

  /* ---------- cronômetro da banca ---------- */
  function decorrido() { return T.acumulado + (T.t0 ? Date.now() - T.t0 : 0); }
  function mmss(ms) { var s = Math.floor(ms / 1000); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function atualizarCrono() {
    var el = document.getElementById("crono");
    if (!el) return;
    var ms = decorrido();
    el.textContent = mmss(ms);
    el.className = "crono" + (ms >= 5 * 60000 ? " over" : ms >= 4.5 * 60000 ? " quase" : "");
    var bt = document.getElementById("crono-bt");
    if (bt) bt.textContent = T.t0 ? "Pausar" : (T.acumulado ? "Continuar" : "Iniciar");
  }

  /* ---------- registro (trilha de auditoria) ---------- */
  function registrar(txt, tipo, p, extra) {
    var x = Object.assign({ quando: agora(), txt: txt, tipo: tipo, quem: S.papel === "diretor" ? diretor() : S.papel === "medico" ? (medico(S.medicoPapel) ? C.titulo(medico(S.medicoPapel)) : "Médico") : "Gestor" }, extra || {});
    S.registro.push(x);
    if (p) { p.log = p.log || []; p.log.push(x); }
  }

  /* ---------- eventos ---------- */
  function num(v) { var n = parseInt(String(v).replace(/\D/g, ""), 10); return isNaN(n) ? 0 : n; }

  ACOES.exemplo = function () { S.diag = C.diagExemplo(); S.diagFeito = true; preparar(); ir("raiox"); toast("Clínica de exemplo carregada: 6 médicos, um por identidade."); };
  ACOES.papel = function (b) {
    S.papel = b.dataset.papel;
    toast(S.papel === "diretor" ? "Você está como diretora técnica: " + diretor() + "." : S.papel === "medico" ? "Você está como " + C.titulo(medico(S.medicoPapel) || eq()[0]) + "." : "Você está como gestor da clínica.");
    render();
  };
  ACOES.menu = function () { document.body.classList.toggle("menu-aberto"); };
  ACOES["menu-completo"] = function () { MENU_BANCA = false; renderSide(); };
  ACOES["menu-banca"] = function () { MENU_BANCA = true; renderSide(); };
  ACOES.crono = function () { if (T.t0) { T.acumulado += Date.now() - T.t0; T.t0 = null; } else T.t0 = Date.now(); atualizarCrono(); };
  ACOES["crono-zerar"] = function () { T.t0 = null; T.acumulado = 0; atualizarCrono(); };
  ACOES["preparar-banca"] = function () {
    var ent = S.entrevista;
    S = estadoInicial(); S.entrevista = ent; S.diag = C.diagExemplo(); S.diagFeito = true; preparar(); S.chat = A.novo("noite");
    T.t0 = null; T.acumulado = 0;
    ir("raiox"); toast("Demo pronta: clínica de exemplo, sem nenhuma ação anterior.");
  };
  ACOES.recomecar = function (b) {
    if (!T.confirmar) { T.confirmar = true; b.textContent = "Clique de novo para apagar tudo"; setTimeout(function () { T.confirmar = false; var x = document.getElementById("bt-recomecar"); if (x) x.textContent = "Recomeçar a demo do zero"; }, 3000); return; }
    T.confirmar = false;
    var ent = S.entrevista; S = estadoInicial(); S.entrevista = ent;
    try { localStorage.removeItem(CHAVE); } catch (e) { /* ok */ }
    ir("inicio"); toast("Demo apagada. Tudo começa do zero.");
  };

  document.addEventListener("click", function (ev) {
    if (document.body.classList.contains("menu-aberto") && !ev.target.closest(".side") && !ev.target.closest(".menu-bt")) { document.body.classList.remove("menu-aberto"); return; }
    var b = ev.target.closest("[data-go],[data-act],[data-banca]");
    if (!b || b.disabled || b.getAttribute("aria-disabled") === "true") return;
    if (b.tagName === "A" && b.dataset.go) ev.preventDefault();
    if (b.dataset.banca) {
      var pb = PASSOS_BANCA[+b.dataset.banca];
      if (!S.diagFeito) ACOES["preparar-banca"]();
      S.papel = pb.papel;
      if (pb.reset === "teste") S.teste = null;
      ir(pb.rota); return;
    }
    if (b.dataset.go) { ir(b.dataset.go); return; }
    var a = b.dataset.act;
    if (a && ACOES[a]) ACOES[a](b, ev);
  });
  document.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.dataset && t.dataset.in && INPUTS[t.dataset.in]) { if (INPUTS[t.dataset.in](t, ev)) render(); else salvar(); }
    else if (t.dataset && t.dataset.k && t.type !== "checkbox" && t.type !== "radio" && INPUTS.diag) INPUTS.diag(t);
  });
  document.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t.dataset && t.dataset.actChange) {
      var a = t.dataset.actChange;
      if (a === "entrevista") { S.entrevista = t.checked; render(); toast(S.entrevista ? "Modo entrevista: preços escondidos." : "Preços visíveis de novo."); }
      if (a === "medico-papel") { S.medicoPapel = t.value; render(); }
      if (ACOES["change:" + a]) ACOES["change:" + a](t);
      return;
    }
    if (t.dataset && t.dataset.k && (t.type === "checkbox" || t.type === "radio") && INPUTS.diag) { INPUTS.diag(t); salvar(); }
    if (t.dataset && t.dataset.inChange && INPUTS[t.dataset.inChange]) { if (INPUTS[t.dataset.inChange](t, ev)) render(); else salvar(); }
  });
  document.addEventListener("submit", function (ev) {
    var f = ev.target;
    if (f.dataset && f.dataset.sub && ACOES["submit:" + f.dataset.sub]) { ev.preventDefault(); ACOES["submit:" + f.dataset.sub](f, ev); }
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") document.body.classList.remove("menu-aberto"); });
  window.addEventListener("hashchange", function () { render({ topo: true }); });

  function iniciar() {
    carregar();
    if (S.diagFeito && !S.fila) preparar();
    if (S.diagFeito && !S.chat) S.chat = A.novo("noite");
    if (BANCA) { document.body.classList.add("banca"); setInterval(atualizarCrono, 1000); if (!location.hash) location.replace("#/raiox"); }
    render({ topo: true });
  }

  g.JW = {
    get S() { return S; }, set S(v) { S = v; }, T: T, ICON: ICON, VIEWS: VIEWS, ACOES: ACOES, INPUTS: INPUTS, DEPOIS: DEPOIS, PASSOS_BANCA: PASSOS_BANCA,
    get BANCA() { return BANCA; },
    esc: esc, fmt: fmt, pct: pct, agora: agora, sim: sim, cap: cap, num: num,
    eq: eq, medico: medico, autorNome: autorNome, opcoesPeca: opcoesPeca, pendentes: pendentes, diretor: diretor, preparar: preparar, evento: evento, preco: preco,
    campo: campo, input: input, radios: radios, avatar: avatar, cab: cab, kpi: kpi, resumoG: resumoG, painelHits: painelHits, semClinica: semClinica, exigePapel: exigePapel,
    render: render, ir: ir, toast: toast, registrar: registrar, salvar: salvar, rotaAtual: rotaAtual, iniciar: iniciar, estadoInicial: estadoInicial
  };
})(window);
