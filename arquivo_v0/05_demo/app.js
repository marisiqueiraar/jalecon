/* Jalecon · demo do app do médico. JavaScript puro, sem servidor, sem IA paga.
 * Estado salvo no navegador (localStorage, se disponível). Dados fictícios.
 */
(function () {
  "use strict";
  var G = window.Guardiao, R = window.Revisao, C = window.Conteudo;
  var CHAVE = "jalecon-demo-v3";

  /* ---------- ícones ---------- */
  var ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.6-3.4 2.8-5.5 5.5-5.5s4.9 2.1 5.5 5.5M14 15.2c.9-.5 1.9-.7 3-.7 2.4 0 4 1.8 4.5 5"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke-linecap="round"/></svg>',
    site: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    logo: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="24" fill="#1F2440"/><polygon points="24,36 37,36 50,64 44,76" fill="#F7F8FA"/><polygon points="44,76 50,64 67,24 80,24" fill="#E8A27C"/></svg>'
  };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(n) { return Math.round(n).toLocaleString("pt-BR"); }
  function pct(x) { return (Math.round(x * 1000) / 10).toLocaleString("pt-BR") + "%"; }

  var TOM = { acolhedora: "acolhedor", tecnica: "técnico", proxima: "próximo e leve", sobria: "sóbrio" };
  var PLURAL = { Carrossel: "carrosséis", Post: "posts", Stories: "stories", Reels: "reels" };
  var UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
  var STATUS = [["rascunho", "Rascunho"], ["em_revisao", "Em revisão"], ["bloqueado", "Bloqueado"], ["aprovado", "Aprovado"], ["agendado", "Agendado"]];
  function rotStatus(s) { for (var i = 0; i < STATUS.length; i++) if (STATUS[i][0] === s) return STATUS[i][1]; return s; }

  var BIO_EXEMPLO = "Ortopedista em São Paulo. Joelho, ombro e coluna. Agende pelo link 👇";
  var EXEMPLOS_GUARDIAO = {
    ruim: "Sou o melhor ortopedista de SP. Cirurgia de joelho sem dor, resultado garantido! Primeira consulta grátis. Olha o que minha paciente disse: mudou minha vida!",
    bom: "Dor no joelho ao subir escadas? Alguns sinais indicam que vale uma avaliação: inchaço depois de esforço e sensação de que o joelho falseia. Agendamento pelo link da bio.\n\nDr. Rafael Moura · MÉDICO · CRM-SP 123456 · Ortopedia e Traumatologia · RQE 45678"
  };
  function diagExemplo() {
    return Object.assign(C.diagPadrao(), {
      nome: "Dr. Rafael Moura", especialidade: "ortopedia", cidade: "São Paulo", uf: "SP", crm: "123456", rqe: "45678",
      particular: 65, objetivos: ["pacientes", "procedimento"], canais: { instagram: true, site: false, gbp: true, doctoralia: false, agencia: false },
      freq: "1", avaliacoes: 12, tempo: "30", orcamento: 1500, personalidade: "acolhedora", bio: BIO_EXEMPLO
    });
  }

  /* ---------- estado ---------- */
  function estadoInicial() {
    return { v: 3, tela: "boas-vindas", passo: 0, diag: C.diagPadrao(), diagFeito: false, planoEscolhido: null, variacao: 0, mes: null, prefs: [], pecaAberta: null, voltarPara: "calendario", campanhaAtiva: false, guardiaoTexto: "", guardiaoIdent: true, siteTexto: null, filtro: "todas", bioSugestao: null };
  }
  var S = estadoInicial();
  var T = { erros: {}, modal: null, toast: "", toastTimer: null, focoTela: false };

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) { /* sem armazenamento: a demo segue funcionando nesta aba */ }
  }
  function carregar() {
    var raw = null;
    try { raw = localStorage.getItem(CHAVE); } catch (e) { raw = null; }
    if (!raw) return;
    try {
      var o = JSON.parse(raw);
      if (!o || o.v !== 3 || !o.diag) return;
      var base = estadoInicial();
      for (var k in base) if (Object.prototype.hasOwnProperty.call(o, k)) base[k] = o[k];
      base.diag = Object.assign(C.diagPadrao(), o.diag);
      base.diag.canais = Object.assign(C.diagPadrao().canais, o.diag.canais || {});
      S = base;
    } catch (e) { /* estado corrompido: começa do zero */ }
  }
  function limparArmazenamento() { try { localStorage.removeItem(CHAVE); } catch (e) { /* ok */ } }

  /* ---------- derivados ---------- */
  function diagOk() { return S.diagFeito && C.ESP[S.diag.especialidade]; }
  function planoAtual() { return S.mes ? S.mes.plano : (S.planoEscolhido || C.diagnostico(S.diag).plano); }
  function idt() { return C.identidade(S.diag, S.variacao); }
  function contagem() { return C.contarStatus(S.mes ? S.mes.pecas : []); }
  function pendentes() { var c = contagem(); return c.rascunho + c.em_revisao + c.bloqueado; }
  function nomeMes() { return S.mes ? C.MESES[S.mes.ref.mes] + " de " + S.mes.ref.ano : ""; }
  function peca(id) { if (!S.mes) return null; for (var i = 0; i < S.mes.pecas.length; i++) if (S.mes.pecas[i].id === id) return S.mes.pecas[i]; return null; }
  function ogPeca() { return C.opcoesGuardiao(S.diag, "peca"); }
  function ctxRevisao(p) { return { tom: S.diag.personalidade, glossario: S.mes ? S.mes.glossario : [], seed: p ? parseInt(p.id.slice(1), 10) : 0, opcoesGuardiao: ogPeca(), perfil: C.perfil(S.diag) }; }
  function tituloPeca(p) { return R.partes(p.texto).titulo; }

  /* ---------- componentes ---------- */
  function sim(txt) { return '<p class="sim">' + esc(txt || "Simulação: na versão real, os textos são gerados por IA.") + "</p>"; }
  function topo() {
    var dir = "";
    if (diagOk()) {
      var I = idt();
      dir = '<span class="tag-ex">dados fictícios</span><button class="avatar" type="button" data-go="perfil" style="background:' + I.cores[0] + '" aria-label="Abrir perfil e preferências">' + esc(I.iniciais) + "</button>";
    } else dir = '<span class="tag-ex">dados fictícios</span>';
    return '<header class="top"><button class="brand" type="button" data-go="' + (S.mes ? "pulso" : "boas-vindas") + '" aria-label="Jalecon, ir para o início">' + ICON.logo + "jalecon</button><div class=\"who\">" + dir + "</div></header>";
  }
  function nav(cur) {
    if (!S.mes) return "";
    var pend = pendentes();
    var itens = [["pulso", "Pulso", ICON.home], ["estudio", "Estúdio", ICON.team], ["calendario", "Calendário", ICON.cal], ["guardiao", "Guardião", ICON.shield], ["site", "Site", ICON.site]];
    return '<nav class="nav" aria-label="Navegação do app">' + itens.map(function (i) {
      var on = cur === i[0] || (cur === "revisao" && i[0] === "calendario");
      var badge = i[0] === "calendario" && pend ? '<span class="badge" data-badge="pendentes" aria-label="' + pend + ' peças pedem sua revisão">' + pend + "</span>" : "";
      return '<button type="button" data-go="' + i[0] + '" class="' + (on ? "on" : "") + '"' + (on ? ' aria-current="page"' : "") + ">" + i[2] + "<span>" + i[1] + "</span>" + badge + "</button>";
    }).join("") + "</nav>";
  }
  function ring(v) {
    var r = 38, c = 2 * Math.PI * r, off = c * (1 - v / 100);
    return '<svg class="ring" viewBox="0 0 92 92" role="img" aria-label="Nota ' + v + ' de 100"><circle cx="46" cy="46" r="' + r + '" fill="none" stroke="var(--surface-2)" stroke-width="10"/><circle cx="46" cy="46" r="' + r + '" fill="none" stroke="var(--apricot)" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 46 46)"/><text x="46" y="53" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="25" font-weight="600" fill="var(--fg)">' + v + "</text></svg>";
  }
  function radios(nome, opcoes, atual, legenda) {
    return "<fieldset><legend>" + esc(legenda) + '</legend><div class="chips">' + opcoes.map(function (o, i) {
      var id = nome + "-" + i, on = String(atual) === String(o[0]);
      return '<label class="chip" for="' + id + '"><input type="radio" id="' + id + '" name="' + nome + '" value="' + esc(o[0]) + '" data-k="' + nome + '"' + (on ? " checked" : "") + "><span>" + esc(o[1]) + "</span></label>";
    }).join("") + "</div></fieldset>";
  }
  function checks(nome, opcoes, marcado, legenda, ajuda) {
    return "<fieldset><legend>" + esc(legenda) + "</legend>" + (ajuda ? '<p class="small">' + esc(ajuda) + "</p>" : "") + '<div class="chips">' + opcoes.map(function (o, i) {
      var id = nome + "-" + i;
      return '<label class="chip" for="' + id + '"><input type="checkbox" id="' + id + '" value="' + esc(o[0]) + '" data-multi="' + nome + '"' + (marcado(o[0]) ? " checked" : "") + "><span>" + esc(o[1]) + "</span></label>";
    }).join("") + "</div></fieldset>";
  }
  function campo(id, rotulo, html, ajuda) {
    var err = T.erros[id];
    return '<div class="field"><label for="f-' + id + '">' + esc(rotulo) + "</label>" + html + (ajuda ? '<span class="help" id="h-' + id + '">' + esc(ajuda) + "</span>" : "") + (err ? '<span class="err" id="e-' + id + '">' + esc(err) + "</span>" : "") + "</div>";
  }
  function input(id, valor, extra) {
    var err = T.erros[id];
    return '<input id="f-' + id + '" data-k="' + id + '" value="' + esc(valor) + '"' + (err ? ' aria-invalid="true" aria-describedby="e-' + id + '"' : "") + " " + (extra || "") + ">";
  }
  function contadores(clicavel) {
    var c = contagem();
    return '<div class="counts" role="group" aria-label="Peças por status">' + STATUS.map(function (s) {
      var inner = "<b>" + c[s[0]] + "</b>" + s[1];
      if (clicavel) return '<button type="button" class="count' + (S.filtro === s[0] ? " on" : "") + '" data-filtro="' + s[0] + '" data-count="' + s[0] + '" aria-pressed="' + (S.filtro === s[0]) + '" aria-label="' + s[1] + ": " + c[s[0]] + '">' + inner + "</button>";
      return '<div class="count" data-count="' + s[0] + '">' + inner + "</div>";
    }).join("") + "</div>";
  }
  function pillStatus(s) { return '<span class="pill st-' + s + '" data-status="' + s + '">' + rotStatus(s) + "</span>"; }

  function hitCard(h) {
    var r = h.regra, cit = G.citacao(r);
    var q = h.faltando ? "Falta: " + h.faltando.join(", ") : h.trechos.map(function (s) { return "“" + s.texto + "”"; }).join(", ");
    var gcls = h.gravidade === "bloqueia" ? "block" : h.gravidade === "alerta" ? "warn" : "info";
    return '<div class="hit ' + h.gravidade + '" data-rule="' + esc(r.id) + '" data-gravidade="' + h.gravidade + '">' +
      '<div class="row between" style="align-items:flex-start"><b style="font-size:14px">' + esc(r.titulo) + '</b><span class="pill ' + gcls + '">' + h.gravidade + "</span></div>" +
      '<p class="q">' + esc(q) + "</p><p style=\"font-size:13.5px\">" + esc(r.explicacao || r.descricao) + "</p>" +
      '<p class="cit">' + esc(cit.texto) + (cit.validacao ? ' <span class="val">regra em validação jurídica</span>' : "") + (r.ajuste_jalecon ? ' <span class="val" title="' + esc(r.ajuste_jalecon) + '">gravidade ajustada</span>' : "") + "</p>" +
      '<p class="sug"><b>Sugestão:</b> ' + esc(r.sugestao) + "</p></div>";
  }
  function resumoGuardiao(res) {
    var c = res.contagem;
    if (!res.hits.length) return '<div class="resumo" data-guardiao="liberado"><span class="pill ok">' + ICON.ok.replace("<svg", '<svg width="14" height="14"') + "Liberado: nenhum ponto de atenção</span></div>";
    return '<div class="resumo" data-guardiao="' + (res.liberado ? "liberado" : "bloqueado") + '">' + (c.bloqueia ? '<span class="pill block">' + c.bloqueia + " bloqueia</span>" : "") + (c.alerta ? '<span class="pill warn">' + c.alerta + (c.alerta > 1 ? " alertas" : " alerta") + "</span>" : "") + (c.orienta ? '<span class="pill info">' + c.orienta + " orienta</span>" : "") + (res.liberado ? '<span class="pill ok">pode aprovar</span>' : "") + "</div>";
  }
  function disclaimer() {
    return '<p class="disclaimer">Checagem automática com base na Resolução CFM 2.336/2023, no Código de Ética Médica e em normas correlatas. Não substitui parecer jurídico; a responsabilidade ética pela publicação é do médico.</p>';
  }
  function painelGuardiao(res, opts) {
    opts = opts || {};
    var fix = G.aplicarSugestoes(res.texto, opts.og || {});
    var corrigivel = fix.aplicadas.length > 0;
    return resumoGuardiao(res) +
      (opts.semTexto ? "" : '<div class="texto" data-testid="texto-destacado">' + G.destacar(res) + "</div>") +
      (res.hits.length ? '<div class="hits">' + res.hits.map(hitCard).join("") + "</div>" : "") +
      (corrigivel && opts.acao ? '<button class="btn ghost" type="button" data-act="' + opts.acao + '">Aplicar sugestões do Guardião (' + fix.aplicadas.length + ")</button>" : "") +
      disclaimer();
  }
  function estiloPeca(I) { return "--pc:" + I.cores[0] + ";--pa:" + I.cores[1] + ";--pb:" + I.cores[2] + ";--pf:" + I.cores[3]; }
  function fonteTitulo(I) { return "font-family:'" + I.fontes.titulo + "', Georgia, serif"; }
  function fonteTexto(I) { return "font-family:'" + I.fontes.texto + "', Arial, sans-serif"; }
  function garantirFontesMedico() {
    if (document.getElementById("fontes-medico")) return;
    var l = document.createElement("link");
    l.id = "fontes-medico"; l.rel = "stylesheet"; l.href = C.FONTES_URL;
    document.head.appendChild(l);
  }

  /* ---------- telas ---------- */
  function vBoasVindas() {
    return topo() + '<div class="scroll">' +
      '<div class="eyebrow">Bem-vindo à Jalecon</div>' +
      '<h2 class="t" tabindex="-1">Marketing médico feito por uma equipe, conferido pelo Guardião, aprovado por você.</h2>' +
      '<p class="muted">Comece pelo diagnóstico gratuito. Ele calcula a nota da sua presença digital, faz um check-up de conformidade da sua bio e indica o plano que faz sentido.</p>' +
      '<div class="card"><ul class="list">' +
      ["Diagnóstico em cerca de 3 minutos, com a conta aberta", "A equipe de agentes monta o seu mês de conteúdo", "O Guardião confere cada texto com as regras do CFM", "Você ajusta conversando e só aprova o que estiver liberado"].map(function (t) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + t + "</li>"; }).join("") +
      "</ul></div>" +
      '<button class="btn" type="button" data-act="comecar">Fazer meu diagnóstico</button>' +
      '<button class="btn ghost" type="button" data-act="exemplo">Preencher com um médico de exemplo</button>' +
      '<button class="btn ghost" type="button" data-go="guardiao">Testar o Guardião com qualquer texto</button>' +
      '<p class="small">Nenhum dado de paciente é pedido. Tudo fica no seu navegador; nada é enviado.</p>' +
      "</div>" + nav("boas-vindas");
  }

  var PASSOS = ["Quem é você", "Seu consultório", "Onde você está hoje", "Tempo, verba e jeito", "Check-up de conformidade"];
  function vAnamnese() {
    var d = S.diag, p = S.passo, corpo = "";
    if (p === 0) {
      corpo = campo("nome", "Nome como aparece nas peças", input("nome", d.nome, 'autocomplete="name" placeholder="Ex.: Dra. Ana Lima"'), "Comece com Dr. ou Dra. Usamos isso para escrever MÉDICO ou MÉDICA.") +
        campo("especialidade", "Especialidade", '<select id="f-especialidade" data-k="especialidade"' + (T.erros.especialidade ? ' aria-invalid="true" aria-describedby="e-especialidade"' : "") + '><option value="">Escolha</option>' + C.ESP_ORDEM.map(function (k) { return '<option value="' + k + '"' + (d.especialidade === k ? " selected" : "") + ">" + esc(C.ESP[k].nome) + "</option>"; }).join("") + "</select>") +
        '<div class="grid-uf">' + campo("cidade", "Cidade onde atende", input("cidade", d.cidade, 'autocomplete="address-level2" placeholder="Ex.: Campinas"')) +
        campo("uf", "UF", '<select id="f-uf" data-k="uf">' + UFS.map(function (u) { return "<option" + (d.uf === u ? " selected" : "") + ">" + u + "</option>"; }).join("") + "</select>") + "</div>" +
        '<div class="grid2">' + campo("crm", "CRM (número)", input("crm", d.crm, 'inputmode="numeric" placeholder="Ex.: 123456"'), "UF do CRM: a mesma acima.") +
        campo("rqe", "RQE (opcional)", input("rqe", d.rqe, 'inputmode="numeric" placeholder="Se tiver"'), "Sem RQE, não anunciamos especialidade.") + "</div>";
    } else if (p === 1) {
      corpo = radios("particular", C.OPC.particular, d.particular, "Quanto da sua agenda é particular?") +
        checks("objetivos", C.OPC.objetivos, function (v) { return (d.objetivos || []).indexOf(v) >= 0; }, "O que você quer agora?", "Marque até 3.");
    } else if (p === 2) {
      corpo = checks("canais", [["instagram", "Instagram profissional"], ["site", "Site próprio"], ["gbp", "Perfil no Google (Google Business Profile)"], ["doctoralia", "Doctoralia ou outra agenda on-line"], ["agencia", "Agência de marketing"]], function (v) { return !!d.canais[v]; }, "O que você já tem?") +
        (d.canais.instagram ? radios("freq", C.OPC.freq, d.freq, "Quantos posts você publica no Instagram?") : "") +
        campo("avaliacoes", "Quantas avaliações você tem no Google?", input("avaliacoes", d.avaliacoes, 'type="number" min="0" max="5000" inputmode="numeric"'), "Se não sabe, um número aproximado serve.");
    } else if (p === 3) {
      corpo = radios("tempo", C.OPC.tempo, d.tempo, "Quanto tempo por semana você tem para isso?") +
        radios("orcamento", C.OPC.orcamento, d.orcamento, "Quanto pode investir por mês em marketing?") +
        radios("personalidade", C.OPC.personalidade, d.personalidade, "Como você quer soar?");
    } else {
      corpo = '<div class="field"><label for="f-bio">Cole sua bio do Instagram ou uma legenda recente</label><textarea id="f-bio" data-k="bio" placeholder="Ex.: Ortopedista em Campinas. Agende sua consulta pelo link.">' + esc(d.bio) + '</textarea><span class="help">Opcional, mas vale 25 pontos da nota. O Guardião checa na hora.</span></div>' +
        '<div class="row wrap"><button class="btn ghost small" type="button" data-act="bio-exemplo">Usar uma bio de exemplo</button>' + (d.bio ? '<button class="btn ghost small" type="button" data-act="bio-limpar">Limpar</button>' : "") + "</div>" +
        '<div id="bio-resultado" aria-live="polite">' + bioResultado() + "</div>";
    }
    var pc = Math.round((p + 1) / PASSOS.length * 100);
    return topo() + '<div class="scroll">' +
      '<div class="row between"><span class="eyebrow">Diagnóstico · ' + (p + 1) + " de " + PASSOS.length + '</span><span class="small num">' + pc + "%</span></div>" +
      '<div class="progress" aria-hidden="true"><span style="width:' + pc + '%"></span></div>' +
      '<h2 class="t" tabindex="-1">' + esc(PASSOS[p]) + "</h2>" +
      '<form class="card" data-form="passo" novalidate>' + corpo +
      '<div class="row" style="margin-top:6px">' + (p > 0 ? '<button class="btn ghost" type="button" data-act="voltar" style="flex:1">Voltar</button>' : "") +
      '<button class="btn" type="submit" style="flex:2" data-testid="avancar">' + (p === PASSOS.length - 1 ? "Ver meu diagnóstico" : "Continuar") + "</button></div></form>" +
      "</div>" + nav("anamnese");
  }
  function bioResultado() {
    var txt = (S.diag.bio || "").trim();
    if (!txt) return '<p class="small">Sem texto colado, a parte de conformidade fica como "não avaliada" (12 de 25 pontos).</p>';
    var res = G.analisar(txt, C.opcoesGuardiao(S.diag, "bio"));
    return '<div class="card" style="padding:12px">' + '<h3 class="t" style="font-size:16px">Guardião na sua bio</h3>' + painelGuardiao(res, { og: C.opcoesGuardiao(S.diag, "bio") }) + "</div>";
  }

  function vDiagnostico() {
    var d = S.diag, D = C.diagnostico(d), e = C.ESP[d.especialidade];
    var escolhido = S.planoEscolhido || D.plano;
    var ck = D.checkup;
    var tabela = '<table class="pesos"><thead><tr><th scope="col">Item (peso)</th><th scope="col" class="n">Pontos</th></tr></thead><tbody>' + D.componentes.map(function (c) {
      return "<tr><td>" + esc(c.nome) + ' <span class="small">(' + c.peso + ')</span><div class="bar" aria-hidden="true"><span style="width:' + Math.round(c.pontos / c.peso * 100) + '%"></span></div><div class="small">' + esc(c.regra) + '</div></td><td class="n">' + c.pontos + " / " + c.peso + "</td></tr>";
    }).join("") + '</tbody><tfoot><tr><td><b>Total</b></td><td class="n"><b data-testid="nota-total">' + D.nota + "</b> / 100</td></tr></tfoot></table>";
    var og = C.opcoesGuardiao(d, "bio");
    var check = ck ? painelGuardiao(ck, { og: og, acao: "bio-corrigir" }) + (S.bioSugestao ? '<div class="card" style="padding:12px;background:var(--ok-bg);border-color:transparent"><b style="font-size:13.5px">Bio sugerida pelo Guardião</b><div class="texto" data-testid="bio-sugerida">' + esc(S.bioSugestao) + '</div><button class="btn ghost small" type="button" data-act="copiar-bio">Copiar texto</button></div>' : "")
      : '<p class="muted">Você não colou um texto. <button class="link" type="button" data-act="ir-passo" data-passo="4">Colar minha bio agora</button></p>';
    var planos = C.PLANO_ORDEM.map(function (k) {
      var P = C.PLANOS[k], rec = k === D.plano, on = k === escolhido;
      return '<label class="card' + (on ? " accent" : "") + '" for="plano-' + k + '" style="cursor:pointer" data-plano="' + k + '"><div class="row between"><span class="row"><input type="radio" name="plano" id="plano-' + k + '" value="' + k + '" data-k="plano"' + (on ? " checked" : "") + '><b style="font-family:var(--display);font-size:17px">' + P.nome + "</b></span><span class=\"num\" style=\"font-weight:700\">" + C.brl(P.preco) + "/mês</span></div>" + (rec ? '<span class="pill ok" style="justify-self:start" data-testid="plano-recomendado">Recomendado para você</span>' : "") + '<p class="small" style="color:var(--fg-2)">' + esc(P.inclui) + "</p></label>";
    }).join("");
    var confirmar = T.modal === "regerar" ? confirmBox("Gerar o mês de novo substitui as " + S.mes.pecas.length + " peças atuais, inclusive as aprovadas (" + (contagem().aprovado + contagem().agendado) + "). Suas preferências aprendidas são mantidas.", "gerar-confirmado", "Gerar de novo") : "";
    return topo() + '<div class="scroll">' +
      '<div class="eyebrow">Seu diagnóstico</div><h2 class="t" tabindex="-1">' + esc(d.nome) + ", " + esc(e.nome.toLowerCase()) + " em " + esc(d.cidade) + "</h2>" +
      '<div class="card"><div class="score">' + ring(D.nota) + '<div><b>Nota de presença digital</b><p class="small">Soma dos itens abaixo. Cada item tem peso fixo e regra à mostra.</p></div></div>' + tabela + "</div>" +
      '<div class="card"><h3 class="t">O que está faltando</h3><ul class="list">' + D.lacunas.map(function (l) { return '<li><span style="color:var(--clay)">' + ICON.warn + "</span>" + esc(l) + "</li>"; }).join("") + (D.lacunas.length ? "" : "<li>Nada importante. Sua base está boa.</li>") + "</ul></div>" +
      '<div class="card" id="checkup"><h3 class="t">Check-up de conformidade</h3>' + check + "</div>" +
      '<div class="card accent"><span class="eyebrow">Plano recomendado</span><h3 class="t" data-testid="plano-nome">' + C.PLANOS[D.plano].nome + " · " + C.brl(C.PLANOS[D.plano].preco) + "/mês</h3><p class=\"muted\" data-testid=\"plano-motivo\">" + esc(D.motivo) + "</p></div>" +
      '<fieldset><legend>Escolha o plano para montar o mês</legend><div style="display:grid;gap:10px">' + planos + "</div></fieldset>" +
      confirmar +
      '<button class="btn" type="button" data-act="gerar">' + (S.mes ? "Gerar o mês de novo com este plano" : "Montar meu mês com a equipe") + "</button>" +
      '<button class="btn ghost" type="button" data-act="editar-diag">Editar respostas</button>' +
      "</div>" + nav("diagnostico");
  }
  function confirmBox(txt, acao, rotuloSim) {
    return '<div class="confirm" role="alertdialog" aria-labelledby="cf-t"><p id="cf-t">' + esc(txt) + '</p><div class="row"><button class="btn small" type="button" data-act="' + acao + '">' + esc(rotuloSim) + '</button><button class="btn ghost small" type="button" data-act="fechar-modal">Cancelar</button></div></div>';
  }

  function vEstudio() {
    var d = S.diag, I = idt(), P = C.PLANOS[S.mes.plano], c = contagem(), pecas = S.mes.pecas;
    var pil = {}; pecas.forEach(function (p) { pil[p.pilar] = (pil[p.pilar] || 0) + 1; });
    var formatos = {}; pecas.forEach(function (p) { formatos[p.formato] = (formatos[p.formato] || 0) + 1; });
    var pegas = pecas.filter(function (p) { return p.timeline.some(function (t) { return t.ag === "Guardião" && t.tipo && t.tipo !== "ok"; }); }).length;
    var cp = C.campanha(d, S.mes.plano);
    var ativa = S.campanhaAtiva && cp.disponivel;
    function ag(nome, cls, papel, corpo) {
      return '<div class="card"><div class="agent"><span class="ag-ic ag-' + cls + '" aria-hidden="true">' + nome.slice(0, 2) + '</span><div style="display:grid;gap:6px;min-width:0"><div><b>' + nome + '</b> <span class="small">· ' + papel + "</span></div>" + corpo + "</div></div></div>";
    }
    var prefsUsadas = pecas.filter(function (p) { return p.timeline.some(function (t) { return /aplicou o que você ensinou/.test(t.txt); }); }).length;
    return topo() + '<div class="scroll">' +
      '<div class="eyebrow">Estúdio · ' + esc(nomeMes()) + '</div><h2 class="t" tabindex="-1">Sua equipe montou o mês</h2>' + sim() +
      ag("Estrategista", "Estrategista", "plano do mês", "<p>" + pecas.length + " peças para " + esc(nomeMes()) + " (plano " + P.nome + "), a partir do seu diagnóstico e dos seus objetivos.</p>" + '<div class="prefs">' + Object.keys(pil).map(function (k) { return "<span>" + esc(C.PILARES[k].nome) + ": " + pil[k] + "</span>"; }).join("") + "</div>") +
      ag("Redator", "Redator", "textos", "<p>Escreveu " + pecas.length + " peças no tom " + TOM[d.personalidade] + ": " + Object.keys(formatos).map(function (k) { return formatos[k] + " " + (formatos[k] > 1 ? PLURAL[k] : k.toLowerCase()); }).join(", ") + ".</p>" + (S.prefs.length ? '<p class="small">Usou ' + S.prefs.length + " preferência(s) que você ensinou" + (prefsUsadas ? ", aplicadas em " + prefsUsadas + " peça(s)" : "; elas entram na próxima geração") + ".</p>" : '<p class="small">Cada pedido seu na revisão vira preferência para as próximas peças.</p>')) +
      ag("Designer", "Designer", "identidade visual", '<div class="row"><div class="mono" style="background:' + I.cores[0] + ";color:" + I.cores[3] + ";" + fonteTitulo(I) + '">' + esc(I.iniciais) + '</div><div class="grow"><b style="' + fonteTitulo(I) + ';font-size:17px">' + esc(d.nome) + '</b><div class="small" style="' + fonteTexto(I) + '">' + esc(I.fontes.titulo) + " + " + esc(I.fontes.texto) + "</div></div></div>" +
        '<div class="swatches">' + I.cores.map(function (cor, i) { return '<div style="background:' + cor + ";color:" + (i === 0 ? "#fff" : "#1F2440") + '">' + cor + "</div>"; }).join("") + "</div>" +
        '<p class="small">Família “' + esc(I.familia) + "” (" + esc(I.porqueFamilia) + "). Paleta “" + esc(I.paletaNome) + "”. Tipografia: " + esc(I.fontes.porque) + ", combinando com a personalidade " + esc(C.rotulo(C.OPC.personalidade, d.personalidade).toLowerCase()) + '.</p><button class="btn ghost small" type="button" data-act="outra-paleta">Gerar outra combinação</button>') +
      ag("Guardião", "Guardião", "conformidade", "<p>Checou as " + pecas.length + " peças contra " + G.regras.length + " regras. Na geração, barrou " + pegas + (pegas === 1 ? " peça escrita" : " peças escritas") + " com problemas pelo Redator.</p>" + '<p class="small">Agora: ' + c.bloqueado + " bloqueada(s), " + c.em_revisao + " em revisão, " + (c.aprovado + c.agendado) + " aprovada(s) ou agendada(s).</p>" + (c.bloqueado ? '<button class="btn ghost small" type="button" data-act="abrir-bloqueada">Abrir uma peça bloqueada</button>' : "")) +
      ag("Gestor de tráfego", "Gestor", "campanha", "<p>Sugere 1 campanha no " + esc(cp.canal) + ", com verba à parte de " + C.brl(cp.verba) + "/mês.</p>" +
        "<details><summary>Ver a campanha</summary><div style=\"display:grid;gap:8px;margin-top:8px\">" +
        '<div class="texto"><b>' + esc(cp.titulo) + "</b>\n" + esc(cp.descricao) + "</div>" + resumoGuardiao(cp.guardiao) +
        '<p class="small"><b>Palavras-chave:</b> ' + cp.palavras.map(esc).join(" · ") + "</p>" +
        '<ul class="list" style="font-size:13px">' + cp.politicas.map(function (x) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<p class="small">Estimativa simulada: ' + fmt(cp.cliques) + " cliques (custo por clique de R$ " + cp.cpc.toFixed(2).replace(".", ",") + "), " + cp.contatos + " contatos, " + cp.consultas + " consultas.</p></div></details>" +
        (cp.disponivel ? '<button class="btn ghost small" type="button" data-act="campanha">' + (ativa ? "Pausar campanha" : "Ativar campanha") + "</button>" + (ativa ? ' <span class="pill ok">ativa no Pulso</span>' : "") : '<p class="small">Campanhas fazem parte do plano Autoridade. <button class="link" type="button" data-go="diagnostico">Ver planos</button></p>')) +
      ag("Analista", "Analista", "Pulso", "<p>Projeta alcance, contatos e consultas a partir das peças agendadas. Hoje: " + c.agendado + " agendada(s).</p>" + '<button class="btn ghost small" type="button" data-go="pulso">Abrir o Pulso</button>') +
      '<button class="btn" type="button" data-go="calendario">Revisar o calendário</button>' +
      "</div>" + nav("estudio");
  }

  function vCalendario() {
    var ref = S.mes.ref, pecas = S.mes.pecas;
    var primeiro = new Date(ref.ano, ref.mes, 1).getDay(), n = new Date(ref.ano, ref.mes + 1, 0).getDate();
    var porDia = {};
    pecas.forEach(function (p) { (porDia[p.dia] = porDia[p.dia] || []).push(p); });
    var cel = ["D", "S", "T", "Q", "Q", "S", "S"].map(function (x) { return '<div class="h" aria-hidden="true">' + x + "</div>"; }).join("");
    for (var i = 0; i < primeiro; i++) cel += '<div aria-hidden="true"></div>';
    for (var d = 1; d <= n; d++) {
      var ps = porDia[d];
      if (ps) {
        var p0 = ps[0];
        cel += '<button type="button" class="d" data-open="' + p0.id + '" aria-label="Dia ' + d + ": " + esc(tituloPeca(p0)) + ", " + rotStatus(p0.status) + '">' + d + '<span class="dot dot-' + p0.status + '"></span></button>';
      } else cel += '<div class="d">' + d + "</div>";
    }
    var lista = pecas.filter(function (p) { return S.filtro === "todas" || p.status === S.filtro; });
    var c = contagem();
    return topo() + '<div class="scroll">' +
      '<div class="row between"><div><div class="eyebrow">Calendário · plano ' + C.PLANOS[S.mes.plano].nome + '</div><h2 class="t" tabindex="-1">' + esc(C.cap(nomeMes())) + '</h2></div><span class="pill info">' + pecas.length + " peças</span></div>" +
      contadores(true) +
      '<div class="card"><div class="cal" role="group" aria-label="Dias com peças">' + cel + "</div>" +
      '<div class="legend">' + STATUS.map(function (s) { return '<span><i class="dot-' + s[0] + '"></i>' + s[1] + "</span>"; }).join("") + "</div></div>" +
      (c.aprovado ? '<button class="btn" type="button" data-act="agendar-todas">Agendar as ' + c.aprovado + " aprovadas</button>" : "") +
      '<div class="row between"><h3 class="t">' + (S.filtro === "todas" ? "Todas as peças" : rotStatus(S.filtro)) + " (" + lista.length + ")</h3>" + (S.filtro !== "todas" ? '<button class="link" type="button" data-filtro="todas">Ver todas</button>' : "") + "</div>" +
      lista.map(function (p) {
        return '<button type="button" class="post-item" data-open="' + p.id + '" data-peca="' + p.id + '"><div class="date"><b>' + String(p.dia).padStart(2, "0") + "</b>" + esc(C.MESES[ref.mes].slice(0, 3)) + '</div><div class="grow"><div class="small">' + esc(p.formato) + " · " + esc(p.semana) + ", " + p.hora + '</div><div class="tt">' + esc(tituloPeca(p)) + "</div></div>" + pillStatus(p.status) + "</button>";
      }).join("") +
      (lista.length ? "" : '<p class="muted">Nenhuma peça com esse status.</p>') +
      sim() + "</div>" + nav("calendario");
  }

  function vRevisao() {
    var p = peca(S.pecaAberta);
    if (!p) { S.tela = "calendario"; return vCalendario(); }
    var I = idt(), d = S.diag, og = ogPeca();
    var res = G.analisar(p.texto, og);
    var partes = R.partes(p.texto);
    var e = C.ESP[d.especialidade];
    var tag = (d.rqe ? e.titulo : (C.sexo(d) === "f" ? "Médica" : "Médico")) + " · " + p.formato;
    var bloqueia = res.hits.filter(function (h) { return h.gravidade === "bloqueia"; });
    var podeAprovar = res.liberado && (p.status === "rascunho" || p.status === "em_revisao");
    var fix = G.aplicarSugestoes(p.texto, og);
    var chips = [];
    if (fix.aplicadas.length && p.status !== "agendado") chips.push(["aplicar sugestão do Guardião", "Aplicar sugestão do Guardião"]);
    chips.push(["mais curto", "Mais curto"], ["mais acolhedor", "Mais acolhedor"], ["mais técnico", "Mais técnico"], ["adicione chamada para agendar", "Chamada para agendar"]);
    if (p.historico.length) chips.push(["desfazer", "Desfazer"]);
    var acoes;
    if (p.status === "agendado") acoes = '<p class="muted" data-testid="agendada">Agendada para ' + p.dia + "/" + String(S.mes.ref.mes + 1).padStart(2, "0") + " às " + p.hora + '.</p><button class="btn ghost" type="button" data-act="desagendar">Tirar da agenda</button>';
    else if (p.status === "aprovado") acoes = '<button class="btn" type="button" id="btn-agendar" data-act="agendar">Agendar para ' + p.dia + "/" + String(S.mes.ref.mes + 1).padStart(2, "0") + " às " + p.hora + "</button>";
    else acoes = '<button class="btn" type="button" id="btn-aprovar" data-act="aprovar"' + (podeAprovar ? "" : ' disabled aria-describedby="motivo-bloqueio"') + ">" + (res.contagem.alerta && res.liberado ? "Aprovar com " + res.contagem.alerta + (res.contagem.alerta > 1 ? " alertas" : " alerta") : "Aprovar") + "</button>" +
      (podeAprovar ? "" : '<p class="small" id="motivo-bloqueio">O Guardião bloqueia esta peça: ' + esc(bloqueia.map(function (h) { return h.regra.rotulo; }).join(", ")) + ". Ajuste o texto para aprovar.</p>");
    var corpoPrev = p.formato === "Reels" ? '<span class="play">' + ICON.play + "</span>" : '<span class="bar-a" aria-hidden="true"></span>';
    return topo() + '<div class="scroll">' +
      '<button class="link" type="button" data-go="' + esc(S.voltarPara || "calendario") + '" style="justify-self:start;align-self:flex-start">← Voltar</button>' +
      '<div class="row between" style="align-items:flex-start"><div class="grow"><div class="eyebrow">' + esc(p.formato) + " · " + p.dia + "/" + String(S.mes.ref.mes + 1).padStart(2, "0") + " · " + esc(C.PILARES[p.pilar].nome) + '</div><h2 class="t" tabindex="-1" style="font-size:20px">Revisão conversando</h2></div><span data-testid="status-peca">' + pillStatus(p.status) + "</span></div>" +
      '<div class="peca ' + p.formato + '" style="' + estiloPeca(I) + '" aria-label="Prévia da arte"><span class="tag" style="' + fonteTexto(I) + '">' + esc(tag) + "</span>" + corpoPrev + '<h4 style="' + fonteTitulo(I) + '">' + esc(partes.titulo) + '</h4><span class="sig" style="' + fonteTexto(I) + '">' + esc(G.assinatura(C.perfil(d))) + "</span></div>" +
      '<div class="card"><div class="row between"><h3 class="t">Guardião</h3><span class="small">' + G.regras.length + " regras</span></div>" + painelGuardiao(res, { og: og }) + "</div>" +
      '<div class="card"><h3 class="t">Quem fez o quê</h3><ol class="timeline" data-testid="timeline">' + p.timeline.map(function (t) { return '<li class="' + (t.tipo || "") + '"><span><b>' + esc(t.ag) + "</b> " + esc(t.txt) + "</span></li>"; }).join("") + "</ol>" + sim() + "</div>" +
      '<div class="card"><h3 class="t">Peça pronta para ajustar</h3><p class="small">Peça em português, do seu jeito. O texto muda de verdade e o Guardião confere de novo a cada mudança.</p>' +
      '<div class="chat" aria-live="polite" data-testid="chat">' + (p.chat.length ? p.chat.map(function (m) { return '<div class="msg ' + (m.de === "Você" ? "me" : "ai") + '">' + (m.de !== "Você" ? '<div class="de">' + esc(m.de) + "</div>" : "") + esc(m.txt) + "</div>"; }).join("") : '<div class="msg ai"><div class="de">Redator</div>Preparei esta peça a partir do plano do Estrategista. O que quer mudar?</div>') + "</div>" +
      (p.status === "agendado" ? "" : '<div class="chips">' + chips.map(function (c) { return '<button type="button" class="chip-btn" data-say="' + esc(c[0]) + '">' + esc(c[1]) + "</button>"; }).join("") + "</div>" +
        '<form class="composer" data-form="chat"><label for="chat-input" class="sr">Pedido de ajuste</label><input id="chat-input" autocomplete="off" placeholder="Ex.: troque joelho por quadril"><button type="submit">Enviar</button></form>') +
      (S.prefs.length ? '<div style="display:grid;gap:6px"><span class="small">A Jalecon aprendeu com você</span><div class="prefs">' + S.prefs.map(function (x) { return "<span>" + esc(x.rot) + "</span>"; }).join("") + "</div></div>" : "") +
      "</div>" + acoes + "</div>" + nav("revisao");
  }

  function vGuardiao() {
    var og = { identificacao: S.guardiaoIdent, exigirNome: false, perfil: diagOk() ? C.perfil(S.diag) : { nome: "", crm: "", uf: "", rqe: "" } };
    var regras = G.regras;
    var nb = regras.filter(function (r) { return r.gravidade === "bloqueia"; }).length, na = regras.filter(function (r) { return r.gravidade === "alerta"; }).length, nv = regras.filter(function (r) { return !r.confirmado; }).length;
    return topo() + '<div class="scroll">' +
      '<div class="eyebrow">Guardião</div><h2 class="t" tabindex="-1">Cole qualquer texto e veja o que o Guardião encontra</h2>' +
      '<div class="card"><div class="field"><label for="g-texto">Texto para checar</label><textarea id="g-texto" class="ta" data-k="guardiaoTexto" placeholder="Post, legenda, bio, texto do site, resposta a avaliação...">' + esc(S.guardiaoTexto) + "</textarea></div>" +
      '<label class="row small" for="g-ident" style="color:var(--fg-2)"><input type="checkbox" id="g-ident" data-k="guardiaoIdent"' + (S.guardiaoIdent ? " checked" : "") + "> É uma peça de divulgação (bio, post, site): checar CRM com UF e a palavra MÉDICO</label>" +
      '<div class="row wrap"><button class="btn ghost small" type="button" data-act="g-exemplo" data-ex="ruim">Exemplo com problemas</button><button class="btn ghost small" type="button" data-act="g-exemplo" data-ex="bom">Exemplo correto</button>' + (S.guardiaoTexto ? '<button class="btn ghost small" type="button" data-act="g-limpar">Limpar</button>' : "") + "</div></div>" +
      '<div class="card" id="g-resultado" aria-live="polite">' + guardiaoResultado(og) + "</div>" +
      '<details class="card"><summary>Base de regras: ' + regras.length + " regras (" + nb + " bloqueiam, " + na + " alertam), " + nv + ' em validação jurídica</summary><div class="hits" style="margin-top:10px">' + regras.map(function (r) { var cit = G.citacao(r); return '<div class="hit ' + r.gravidade + '"><div class="row between" style="align-items:flex-start"><b style="font-size:13.5px">' + esc(r.titulo) + '</b><span class="pill ' + (r.gravidade === "bloqueia" ? "block" : r.gravidade === "alerta" ? "warn" : "info") + '">' + r.gravidade + '</span></div><p class="cit">' + esc(cit.texto) + (cit.validacao ? ' <span class="val">regra em validação jurídica</span>' : "") + "</p></div>"; }).join("") + "</div></details>" +
      "</div>" + nav("guardiao");
  }
  function guardiaoResultado(og) {
    var txt = (S.guardiaoTexto || "").trim();
    if (!txt) return '<p class="muted">Os pontos encontrados aparecem aqui enquanto você digita.</p>' + disclaimer();
    var res = G.analisar(txt, og);
    return '<h3 class="t">Resultado</h3>' + painelGuardiao(res, { og: og, acao: "g-aplicar" });
  }

  function textoSite() {
    var d = S.diag, e = C.ESP[d.especialidade], per = C.perfil(d), cidade = d.cidade;
    var apres = S.siteTexto != null ? S.siteTexto : {
      acolhedora: "Atendimento com hora marcada e tempo para ouvir você. Na consulta, conversamos sobre a sua história e definimos juntos os próximos passos.",
      tecnica: "Consultas com avaliação clínica detalhada e conduta baseada em evidências. Exames complementares quando indicados.",
      proxima: "Consulta sem pressa, com explicação clara e orientações por escrito. Dúvidas? Fale pelo WhatsApp.",
      sobria: "Atendimento com hora marcada. Avaliação, acompanhamento e orientações por escrito."
    }[d.personalidade];
    return { apres: apres, rotulo: d.rqe ? e.titulo : (per.sexo === "f" ? "Médica" : "Médico"), atende: e.conds.map(function (c) { return c.n; }), levar: e.levar, cidade: cidade + " · " + d.uf, rodape: G.assinatura(per) };
  }
  function vSite() {
    var d = S.diag, I = idt(), P = C.PLANOS[S.mes.plano], t = textoSite(), og = C.opcoesGuardiao(d, "site");
    var completo = [d.nome, t.rotulo + " em " + t.cidade, t.apres, "Atendimento: " + t.atende.join(", ") + ".", "Para a consulta, leve: " + t.levar.join("; ") + ".", t.rodape].join("\n\n");
    var res = G.analisar(completo, og);
    return topo() + '<div class="scroll">' +
      '<div class="eyebrow">' + (P.site === "site" ? "Site com SEO local" : "Página única (plano Essencial)") + '</div><h2 class="t" tabindex="-1">Seu site, gerado com seus dados</h2>' +
      '<div class="site" style="' + fonteTexto(I) + '"><div class="sn"><b style="' + fonteTitulo(I) + ";color:" + I.cores[0] + '">' + esc(d.nome) + "</b><span>Agendar</span></div>" +
      '<div class="hero" style="background:' + I.cores[3] + '"><span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:' + I.cores[0] + '">' + esc(t.rotulo + " · " + t.cidade) + '</span><h4 style="' + fonteTitulo(I) + ";color:" + I.cores[0] + '">' + esc(d.nome) + '</h4><p style="font-size:13.5px;color:#4A4F6E" data-testid="site-apresentacao">' + esc(t.apres) + '</p><span class="cta" style="background:' + I.cores[0] + '">Agendar pelo WhatsApp</span></div>' +
      "<section><b>Atendimento</b><span>" + esc(C.cap(t.atende.join(", "))) + ".</span></section>" +
      "<section><b>Para a consulta, leve</b><span>" + esc(C.cap(t.levar.join("; "))) + ".</span></section>" +
      "<section><b>Onde</b><span>" + esc(t.cidade) + ' (endereço fictício)</span></section><div class="foot" data-testid="site-rodape">' + esc(t.rodape) + "</div></div>" +
      '<div class="card"><div class="field"><label for="f-site">Editar o texto de apresentação</label><textarea id="f-site" class="ta" data-k="siteTexto" style="min-height:90px">' + esc(t.apres) + '</textarea><span class="help">O Guardião confere o site inteiro, inclusive o rodapé com a sua identificação.</span></div>' + (S.siteTexto != null ? '<button class="btn ghost small" type="button" data-act="site-restaurar">Voltar ao texto gerado</button>' : "") + "</div>" +
      '<div class="card" id="site-guardiao" aria-live="polite"><h3 class="t">Guardião no site</h3>' + painelGuardiao(res, { og: og, semTexto: true }) + "</div>" +
      '<div class="card"><div class="row between"><h3 class="t">Perfil no Google</h3>' + (d.canais.gbp ? '<span class="pill ok">ativo</span>' : P.google ? '<span class="pill info">a criar no plano</span>' : '<span class="pill warn">fora do plano</span>') + '</div><p class="muted">' + (+d.avaliacoes || 0) + " avaliações (informado no diagnóstico). " + (P.google ? "O plano mantém horários, endereço e link de agendamento atualizados, e as respostas às avaliações passam pelo Guardião." : "O perfil no Google entra a partir do plano Consultório.") + "</p></div>" +
      "</div>" + nav("site");
  }

  function vPulso() {
    var d = S.diag, M = C.pulso(d, S.mes, S.campanhaAtiva && C.PLANOS[S.mes.plano].campanha), f = M.funil, c = M.status;
    function linha(rot, v, base, tx, key) {
      return '<div class="fr" data-funil="' + key + '"><span>' + rot + '</span><b class="num">' + fmt(v) + '</b><span class="fb" aria-hidden="true"><span style="width:' + Math.max(1, Math.round(base * 100)) + '%"></span></span>' + (tx ? '<span class="tx">' + tx + "</span>" : "") + "</div>";
    }
    var rec;
    if (c.bloqueado) rec = c.bloqueado + (c.bloqueado > 1 ? " peças estão bloqueadas" : " peça está bloqueada") + " pelo Guardião. Ajuste na revisão para não perder essas datas.";
    else if (c.rascunho + c.em_revisao) rec = (c.rascunho + c.em_revisao) + " peças esperam sua revisão. Revisar leva poucos minutos pelo celular.";
    else if (c.aprovado) rec = c.aprovado + " peças aprovadas ainda não estão agendadas. Agende para elas entrarem na projeção.";
    else rec = "Mês completo: todas as peças estão agendadas.";
    return topo() + '<div class="scroll">' +
      '<div class="eyebrow">Pulso · ' + esc(nomeMes()) + '</div><h2 class="t" tabindex="-1">Olá, ' + esc(d.nome.split(" ").slice(0, 2).join(" ")) + '</h2><p class="sim" data-testid="dados-simulados">Dados simulados, calculados a partir das peças do seu calendário</p>' +
      '<div class="kpis"><div class="kpi hero"><span class="small">Consultas agendadas previstas com as peças já agendadas</span><b data-testid="consultas">' + fmt(f.consultas + (M.campanha ? M.campanha.consultas : 0)) + '</b><span class="small">Se todas as ' + M.potencial.pecas + " peças forem agendadas: " + fmt(M.potencial.consultas + (M.campanha ? M.campanha.consultas : 0)) + "</span></div>" +
      '<div class="kpi"><span class="small">Nota de presença</span><b>' + M.nota + '</b><span class="small">prevista: ' + M.notaPrevista + " com o plano</span></div>" +
      '<div class="kpi"><span class="small">Guardião</span><b data-testid="pegas">' + M.pegas + '</b><span class="small">' + (M.pegas === 1 ? "peça barrada" : "peças barradas") + " na geração · " + c.bloqueado + " bloqueada(s) agora</span></div></div>" +
      '<div class="card"><h3 class="t">Peças do mês</h3>' + contadores(false) + "</div>" +
      '<div class="card"><h3 class="t">Do conteúdo à consulta</h3><div class="funnel">' +
      linha("Peças agendadas", f.pecas, f.pecas / Math.max(1, M.potencial.pecas), "de " + M.potencial.pecas + " no mês", "pecas") +
      linha("Alcance", f.alcance, f.alcance / Math.max(1, M.potencial.alcance), "estimado por formato, especialidade e tamanho do seu perfil", "alcance") +
      linha("Visitas ao perfil e ao site", f.visitas, f.visitas / Math.max(1, M.potencial.visitas), pct(f.taxas.visita) + " do alcance", "visitas") +
      linha("Contatos no WhatsApp", f.contatos, f.contatos / Math.max(1, M.potencial.contatos), pct(f.taxas.contato) + " das visitas", "contatos") +
      linha("Consultas agendadas", f.consultas, f.consultas / Math.max(1, M.potencial.consultas), pct(f.taxas.consulta) + " dos contatos (depende da sua parcela particular)", "consultas") +
      "</div>" + '<p class="small">Cada barra mostra quanto do potencial do mês (todas as peças agendadas) já está garantido.</p>' + (M.campanha ? '<p class="small">Campanha ativa: ' + C.brl(M.campanha.verba) + " de verba, " + fmt(M.campanha.cliques) + " cliques, " + M.campanha.contatos + " contatos, " + M.campanha.consultas + " consultas a mais.</p>" : "") + "</div>" +
      '<div class="card"><div class="row between"><h3 class="t">Recomendação do Analista</h3><span class="pill info">simulação</span></div><p class="muted" data-testid="recomendacao">' + esc(rec) + '</p><button class="btn ghost" type="button" data-go="calendario">Ir para o calendário</button></div>' +
      "</div>" + nav("pulso");
  }

  function vPerfil() {
    var d = S.diag, e = C.ESP[d.especialidade];
    var linhas = [["Nome", d.nome], ["Especialidade", e ? e.nome : ""], ["Cidade", d.cidade + " · " + d.uf], ["CRM", "CRM-" + d.uf + " " + d.crm], ["RQE", d.rqe || "não informado"], ["Parcela particular", C.rotulo(C.OPC.particular, d.particular)], ["Objetivos", (d.objetivos || []).map(function (o) { return C.rotulo(C.OPC.objetivos, o); }).join(", ") || "nenhum"], ["Tempo por semana", C.rotulo(C.OPC.tempo, d.tempo)], ["Orçamento", C.rotulo(C.OPC.orcamento, d.orcamento)], ["Personalidade", C.rotulo(C.OPC.personalidade, d.personalidade)], ["Plano", S.mes ? C.PLANOS[S.mes.plano].nome : "a escolher"]];
    return topo() + '<div class="scroll">' +
      '<div class="eyebrow">Perfil</div><h2 class="t" tabindex="-1">' + esc(d.nome) + "</h2>" +
      (T.modal === "recomecar" ? confirmBox("Apagar o diagnóstico, as peças e as preferências e voltar ao início?", "recomecar", "Sim, recomeçar") : "") +
      '<div class="card"><table class="pesos"><tbody>' + linhas.map(function (l) { return "<tr><td class=\"small\">" + esc(l[0]) + "</td><td>" + esc(l[1]) + "</td></tr>"; }).join("") + "</tbody></table>" +
      '<button class="btn ghost" type="button" data-act="editar-diag">Editar diagnóstico</button><button class="btn ghost" type="button" data-go="diagnostico">Ver diagnóstico e plano</button></div>' +
      '<div class="card"><h3 class="t">O que a Jalecon aprendeu com você</h3>' + (S.prefs.length ? '<ul class="list" data-testid="prefs">' + S.prefs.map(function (p, i) { return '<li style="justify-content:space-between"><span>' + esc(p.rot) + '</span><button class="link" type="button" data-act="esquecer" data-i="' + i + '">esquecer</button></li>'; }).join("") + '</ul><p class="small">O Redator aplica isso quando gera o mês de novo.</p><button class="btn ghost" type="button" data-act="gerar-pedir">Gerar o mês de novo com as preferências</button>' : '<p class="muted">Ainda nada. Cada pedido na revisão (mais curto, troque X por Y...) vira uma preferência.</p>') + "</div>" +
      (T.modal === "regerar" ? confirmBox("Gerar o mês de novo substitui as " + S.mes.pecas.length + " peças atuais, inclusive as aprovadas. As preferências são mantidas.", "gerar-confirmado", "Gerar de novo") : "") +
      '<button class="btn ghost" type="button" data-act="recomecar-pedir">Recomeçar demo</button>' +
      '<p class="small">Demonstração com dados fictícios. Estado salvo só neste navegador.</p>' +
      "</div>" + nav("perfil");
  }

  /* ---------- roteiro lateral ---------- */
  var ROTEIRO = [["boas-vindas", "Boas-vindas"], ["anamnese", "Diagnóstico (anamnese)"], ["diagnostico", "Nota e plano"], ["estudio", "Estúdio: equipe de agentes"], ["calendario", "Calendário do mês"], ["revisao", "Revisão conversando"], ["guardiao", "Guardião"], ["site", "Site"], ["pulso", "Pulso"], ["perfil", "Perfil e preferências"]];
  function disponivel(tela) {
    if (tela === "diagnostico") return diagOk();
    if (tela === "perfil") return diagOk();
    if (["estudio", "calendario", "revisao", "site", "pulso"].indexOf(tela) >= 0) return !!S.mes;
    return true;
  }
  function renderRoteiro() {
    var el = document.getElementById("tour");
    if (!el) return;
    el.innerHTML = ROTEIRO.map(function (t, i) {
      var ok = disponivel(t[0]);
      return '<button type="button" data-go="' + t[0] + '" class="' + (S.tela === t[0] ? "on" : "") + '"' + (ok ? "" : ' aria-disabled="true" title="Faça o diagnóstico e monte o mês primeiro"') + (S.tela === t[0] ? ' aria-current="step"' : "") + "><b>" + (i + 1) + "</b>" + t[1] + "</button>";
    }).join("");
  }

  /* ---------- render ---------- */
  var app = document.getElementById("app");
  var VIEWS = { "boas-vindas": vBoasVindas, anamnese: vAnamnese, diagnostico: vDiagnostico, estudio: vEstudio, calendario: vCalendario, revisao: vRevisao, guardiao: vGuardiao, site: vSite, pulso: vPulso, perfil: vPerfil };
  function render(opts) {
    opts = opts || {};
    if (!disponivel(S.tela)) S.tela = diagOk() ? "diagnostico" : "boas-vindas";
    var ativo = document.activeElement, focoId = ativo && ativo.id, sel = null;
    try { if (ativo && typeof ativo.selectionStart === "number") sel = [ativo.selectionStart, ativo.selectionEnd]; } catch (e) { sel = null; }
    var sc = app.querySelector(".scroll"), top = sc ? sc.scrollTop : 0;
    if (["estudio", "revisao", "site"].indexOf(S.tela) >= 0) garantirFontesMedico();
    app.innerHTML = VIEWS[S.tela]() + '<div class="toast" role="status" ' + (T.toast ? "" : "hidden") + ">" + esc(T.toast) + "</div>";
    renderRoteiro();
    var sc2 = app.querySelector(".scroll");
    if (sc2) sc2.scrollTop = opts.topo ? 0 : top;
    if (opts.focoTela) { var h = app.querySelector("h2.t"); if (h) h.focus({ preventScroll: true }); }
    else if (focoId) {
      var el = document.getElementById(focoId);
      if (el && el !== document.activeElement) { el.focus({ preventScroll: true }); try { if (sel && el.setSelectionRange) el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* ok */ } }
    }
    salvar();
  }
  function ir(tela) {
    if (!disponivel(tela)) { toast(diagOk() ? "Monte o mês no diagnóstico para abrir esta etapa." : "Faça o diagnóstico primeiro."); return; }
    if (tela === "revisao" && !peca(S.pecaAberta)) { var b = primeiraPor(["bloqueado", "em_revisao", "rascunho"]); if (!b) b = S.mes.pecas[0]; abrirPeca(b.id, S.tela === "revisao" ? "calendario" : S.tela); return; }
    T.modal = null;
    S.tela = tela;
    render({ topo: true, focoTela: true });
  }
  function toast(msg) {
    T.toast = msg;
    var el = app.querySelector(".toast");
    if (el) { el.textContent = msg; el.hidden = false; }
    anunciar(msg);
    clearTimeout(T.toastTimer);
    T.toastTimer = setTimeout(function () { T.toast = ""; var t = app.querySelector(".toast"); if (t) t.hidden = true; }, 3200);
  }
  function anunciar(msg) { var a = document.getElementById("anuncio"); if (a) { a.textContent = ""; setTimeout(function () { a.textContent = msg; }, 30); } }

  /* ---------- ações ---------- */
  function primeiraPor(lista) {
    if (!S.mes) return null;
    for (var i = 0; i < lista.length; i++) for (var j = 0; j < S.mes.pecas.length; j++) if (S.mes.pecas[j].status === lista[i]) return S.mes.pecas[j];
    return null;
  }
  function abrirPeca(id, de) {
    var p = peca(id); if (!p) return;
    S.pecaAberta = id; S.voltarPara = de && de !== "revisao" ? de : "calendario";
    if (p.status === "rascunho") { p.status = "em_revisao"; p.timeline.push({ ag: "Você", txt: "abriu para revisar" }); }
    S.tela = "revisao"; T.modal = null;
    render({ topo: true, focoTela: true });
  }
  function reavaliar(p) {
    var res = G.analisar(p.texto, ogPeca());
    p.status = res.liberado ? "em_revisao" : "bloqueado";
    p.achados = Math.max(p.achados || 0, 0);
    var reg = C.registroGuardiao(res);
    reg.txt = "rechecou e " + (reg.tipo === "ok" ? "liberou" : reg.txt);
    p.timeline.push(reg);
    var b = res.hits.filter(function (h) { return h.gravidade === "bloqueia"; }), a = res.hits.filter(function (h) { return h.gravidade === "alerta"; });
    return b.length ? "Rechequei: ainda bloqueia por " + b.map(function (h) { return h.regra.rotulo; }).join(", ") + "." : a.length ? "Rechequei: liberado para aprovar, com " + a.length + (a.length > 1 ? " alertas" : " alerta") + " (" + a.map(function (h) { return h.regra.rotulo; }).join(", ") + ")." : "Rechequei: liberado, sem pontos de atenção.";
  }
  function addPref(pref) {
    if (!pref) return;
    S.prefs = S.prefs.filter(function (x) {
      if (pref.t === "tom" && x.t === "tom") return false;
      if (x.t === pref.t && (x.v || "") === (pref.v || "") && (x.de || "") === (pref.de || "")) return false;
      return true;
    });
    S.prefs.push(pref);
  }
  function conversar(msg) {
    var p = peca(S.pecaAberta); if (!p || !msg.trim()) return;
    if (p.status === "agendado") { toast("Tire da agenda para editar."); return; }
    p.chat.push({ de: "Você", txt: msg });
    var it = R.entender(msg);
    if (it.tipo === "desfazer") {
      if (!p.historico.length) { p.chat.push({ de: "Redator", txt: "Não há mudança para desfazer." }); }
      else {
        p.texto = p.historico.pop();
        p.timeline.push({ ag: "Você", txt: "desfez a última mudança" });
        p.chat.push({ de: "Redator", txt: "Voltei para a versão anterior." });
        p.chat.push({ de: "Guardião", txt: reavaliar(p) });
      }
    } else if (it.tipo === "aprovar") {
      aprovar(true);
    } else {
      var r = R.executar(it, p.texto, ctxRevisao(p));
      var autor = it.tipo === "guardiao" ? "Guardião" : "Redator";
      if (r.erro) p.chat.push({ de: "Jalecon", txt: r.erro });
      else if (!r.mudou) p.chat.push({ de: autor, txt: r.msg });
      else {
        p.historico.push(p.texto);
        if (p.historico.length > 25) p.historico.shift();
        p.texto = r.texto;
        p.timeline.push({ ag: "Você", txt: "pediu: " + msg });
        p.timeline.push({ ag: autor, txt: it.tipo === "guardiao" ? "aplicou as correções" : "reescreveu o texto" });
        p.chat.push({ de: autor, txt: r.msg });
        p.chat.push({ de: "Guardião", txt: reavaliar(p) });
        if (r.pref) addPref(r.pref);
      }
    }
    if (p.chat.length > 60) p.chat = p.chat.slice(-60);
    render();
    var chat = app.querySelector("[data-testid=chat]");
    if (chat) { var u = chat.lastElementChild; if (u && u.scrollIntoView) u.scrollIntoView({ block: "nearest" }); }
  }
  function aprovar(viaChat) {
    var p = peca(S.pecaAberta); if (!p) return;
    var res = G.analisar(p.texto, ogPeca());
    if (!res.liberado) { p.chat.push({ de: "Guardião", txt: "Ainda não dá para aprovar: " + res.hits.filter(function (h) { return h.gravidade === "bloqueia"; }).map(function (h) { return h.regra.rotulo; }).join(", ") + "." }); if (!viaChat) render(); return; }
    p.status = "aprovado";
    p.timeline.push({ ag: "Você", txt: "aprovou" + (res.contagem.alerta ? " com " + res.contagem.alerta + " alerta(s) ciente(s)" : ""), tipo: "ok" });
    if (!viaChat) { render(); toast("Peça aprovada. Agora é só agendar."); }
    else p.chat.push({ de: "Jalecon", txt: "Peça aprovada. Agora é só agendar." });
  }
  function agendar(p) {
    p.status = "agendado";
    p.timeline.push({ ag: "Jalecon", txt: "agendou para " + p.dia + "/" + String(S.mes.ref.mes + 1).padStart(2, "0") + " às " + p.hora, tipo: "ok" });
  }
  function gerar() {
    var D = C.diagnostico(S.diag);
    var plano = S.planoEscolhido || D.plano;
    var ref = S.mes ? S.mes.ref : C.proximoMes(new Date());
    S.mes = C.gerarMes(S.diag, plano, S.prefs, ref);
    S.pecaAberta = null; S.filtro = "todas"; T.modal = null;
    S.tela = "estudio";
    render({ topo: true, focoTela: true });
    var c = contagem();
    toast("Mês montado: " + S.mes.pecas.length + " peças, " + c.bloqueado + " bloqueada(s) pelo Guardião.");
  }
  function validarPasso() {
    var d = S.diag, e = {};
    if (S.passo === 0) {
      if (!d.nome.trim() || d.nome.trim().split(/\s+/).length < 2) e.nome = "Informe nome e sobrenome (ex.: Dra. Ana Lima).";
      if (!d.especialidade) e.especialidade = "Escolha a especialidade.";
      if (!d.cidade.trim()) e.cidade = "Informe a cidade.";
      if (!/^\d{4,7}$/.test((d.crm || "").replace(/\D/g, "")) ) e.crm = "O CRM tem de 4 a 7 números.";
      if (d.rqe && !/^\d{2,7}$/.test(d.rqe.replace(/\D/g, ""))) e.rqe = "O RQE tem só números.";
    }
    if (S.passo === 1 && (d.objetivos || []).length > 3) e.objetivos = "Marque no máximo 3.";
    return e;
  }

  /* ---------- eventos ---------- */
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("button, [data-go]");
    if (!el || el.disabled) return;
    if (el.dataset.go) { ev.preventDefault(); ir(el.dataset.go); return; }
    if (el.dataset.open) { abrirPeca(el.dataset.open, S.tela); return; }
    if (el.dataset.filtro) { S.filtro = S.filtro === el.dataset.filtro ? "todas" : el.dataset.filtro; render(); return; }
    if (el.dataset.say) { conversar(el.dataset.say); return; }
    var a = el.dataset.act;
    if (!a) return;
    var p;
    switch (a) {
      case "comecar": S.passo = 0; T.erros = {}; S.tela = "anamnese"; render({ topo: true, focoTela: true }); break;
      case "exemplo": S.diag = diagExemplo(); S.passo = 0; T.erros = {}; S.tela = "anamnese"; render({ topo: true, focoTela: true }); toast("Médico fictício preenchido. Avance pelas etapas ou mude o que quiser."); break;
      case "voltar": if (S.passo > 0) { S.passo--; T.erros = {}; render({ topo: true, focoTela: true }); } break;
      case "ir-passo": S.passo = +el.dataset.passo; S.tela = "anamnese"; render({ topo: true, focoTela: true }); break;
      case "bio-exemplo": S.diag.bio = BIO_EXEMPLO; render(); break;
      case "bio-limpar": S.diag.bio = ""; S.bioSugestao = null; render(); break;
      case "bio-corrigir":
        var fx = G.aplicarSugestoes(S.diag.bio, C.opcoesGuardiao(S.diag, "bio"));
        S.bioSugestao = fx.texto; S.diag.bioCorrigida = true; render();
        toast("O Guardião sugeriu uma bio corrigida. Ela entra na nota prevista do Pulso.");
        break;
      case "copiar-bio":
        try { navigator.clipboard.writeText(S.bioSugestao || "").then(function () { toast("Bio copiada."); }, function () { toast("Não consegui copiar; selecione o texto."); }); } catch (e) { toast("Não consegui copiar; selecione o texto."); }
        break;
      case "editar-diag": S.passo = 0; T.erros = {}; S.tela = "anamnese"; render({ topo: true, focoTela: true }); break;
      case "gerar":
        if (S.mes && S.mes.pecas.some(function (x) { return x.status === "aprovado" || x.status === "agendado" || x.historico.length; })) { T.modal = "regerar"; render(); var b = app.querySelector(".confirm button"); if (b) b.focus(); }
        else gerar();
        break;
      case "gerar-pedir": T.modal = "regerar"; render(); var b2 = app.querySelector(".confirm button"); if (b2) b2.focus(); break;
      case "gerar-confirmado": gerar(); break;
      case "fechar-modal": T.modal = null; render(); break;
      case "outra-paleta": S.variacao = (S.variacao + 1) % 3; render(); toast("Designer: nova combinação com a paleta “" + idt().paletaNome + "”."); break;
      case "abrir-bloqueada": p = primeiraPor(["bloqueado"]); if (p) abrirPeca(p.id, "estudio"); break;
      case "campanha": S.campanhaAtiva = !S.campanhaAtiva; render(); toast(S.campanhaAtiva ? "Campanha ativada na projeção do Pulso." : "Campanha pausada."); break;
      case "aprovar": aprovar(false); break;
      case "agendar": p = peca(S.pecaAberta); if (p && p.status === "aprovado") { agendar(p); render(); toast("Agendada para " + p.dia + "/" + String(S.mes.ref.mes + 1).padStart(2, "0") + " às " + p.hora + "."); } break;
      case "desagendar": p = peca(S.pecaAberta); if (p) { p.status = "aprovado"; p.timeline.push({ ag: "Você", txt: "tirou da agenda" }); render(); } break;
      case "agendar-todas": var n = 0; S.mes.pecas.forEach(function (x) { if (x.status === "aprovado") { agendar(x); n++; } }); render(); toast(n + " peça(s) agendada(s)."); break;
      case "g-exemplo": S.guardiaoTexto = EXEMPLOS_GUARDIAO[el.dataset.ex]; render(); break;
      case "g-limpar": S.guardiaoTexto = ""; render(); var ta = document.getElementById("g-texto"); if (ta) ta.focus(); break;
      case "g-aplicar":
        var og = { identificacao: S.guardiaoIdent, exigirNome: false, perfil: diagOk() ? C.perfil(S.diag) : null };
        var r = G.aplicarSugestoes(S.guardiaoTexto, og);
        S.guardiaoTexto = r.texto; render();
        toast(r.aplicadas.length + " correção(ões) aplicada(s)." + (r.manuais.length ? " Ajuste manual: " + r.manuais.map(function (x) { return x.rotulo; }).join(", ") + "." : ""));
        break;
      case "site-restaurar": S.siteTexto = null; render(); break;
      case "esquecer": S.prefs.splice(+el.dataset.i, 1); render(); break;
      case "recomecar-pedir":
        if (S.tela !== "perfil" && diagOk()) { S.tela = "perfil"; }
        if (!diagOk()) { recomecar(); break; }
        T.modal = "recomecar"; render({ topo: true }); var b3 = app.querySelector(".confirm button"); if (b3) b3.focus();
        break;
      case "recomecar": recomecar(); break;
    }
  });
  function recomecar() {
    limparArmazenamento();
    S = estadoInicial(); T.modal = null; T.erros = {};
    render({ topo: true, focoTela: true });
    toast("Demo recomeçada.");
  }

  var deb = null;
  document.addEventListener("input", function (ev) {
    var t = ev.target, k = t.dataset && t.dataset.k;
    if (!k || t.type === "radio" || t.type === "checkbox" || t.tagName === "SELECT") return;
    if (k === "guardiaoTexto") {
      S.guardiaoTexto = t.value; clearTimeout(deb);
      deb = setTimeout(function () { var box = document.getElementById("g-resultado"); if (box) box.innerHTML = guardiaoResultado({ identificacao: S.guardiaoIdent, exigirNome: false, perfil: diagOk() ? C.perfil(S.diag) : { nome: "", crm: "", uf: "", rqe: "" } }); salvar(); }, 180);
      return;
    }
    if (k === "siteTexto") {
      S.siteTexto = t.value; clearTimeout(deb);
      deb = setTimeout(function () { var sv = vSite(); var tmp = document.createElement("div"); tmp.innerHTML = sv; var nv = tmp.querySelector("#site-guardiao"), at = document.getElementById("site-guardiao"); if (nv && at) at.innerHTML = nv.innerHTML; var ap = tmp.querySelector("[data-testid=site-apresentacao]"), ap2 = app.querySelector("[data-testid=site-apresentacao]"); if (ap && ap2) ap2.textContent = ap.textContent; salvar(); }, 180);
      return;
    }
    if (k === "avaliacoes") S.diag.avaliacoes = Math.max(0, Math.min(5000, parseInt(t.value, 10) || 0));
    else if (k in S.diag) S.diag[k] = t.value;
    if (T.erros[k]) { delete T.erros[k]; }
    if (k === "bio") {
      S.bioSugestao = null; S.diag.bioCorrigida = false; clearTimeout(deb);
      deb = setTimeout(function () { var box = document.getElementById("bio-resultado"); if (box) box.innerHTML = bioResultado(); salvar(); }, 180);
      return;
    }
    salvar();
  });
  document.addEventListener("change", function (ev) {
    var t = ev.target, k = t.dataset && t.dataset.k, m = t.dataset && t.dataset.multi;
    if (m) {
      if (m === "canais") S.diag.canais[t.value] = t.checked;
      else if (m === "objetivos") {
        var o = S.diag.objetivos.filter(function (x) { return x !== t.value; });
        if (t.checked) o.push(t.value);
        S.diag.objetivos = o;
        if (o.length > 3) T.erros.objetivos = "Marque no máximo 3."; else delete T.erros.objetivos;
      }
      render(); return;
    }
    if (!k) return;
    if (k === "guardiaoIdent") { S.guardiaoIdent = t.checked; render(); return; }
    if (k === "plano") { S.planoEscolhido = t.value; render(); return; }
    if (t.type === "radio") {
      var v = t.value;
      if (k === "particular" || k === "orcamento") v = +v;
      S.diag[k] = v; render(); return;
    }
    if (t.tagName === "SELECT") { S.diag[k] = t.value; if (T.erros[k]) delete T.erros[k]; if (k === "especialidade") { S.variacao = 0; } render(); }
  });
  document.addEventListener("submit", function (ev) {
    var f = ev.target;
    if (f.dataset.form === "chat") {
      ev.preventDefault();
      var inp = f.querySelector("input"), v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      inp.value = "";
      conversar(v);
      var ni = document.getElementById("chat-input"); if (ni) ni.focus({ preventScroll: true });
    } else if (f.dataset.form === "passo") {
      ev.preventDefault();
      var e = validarPasso();
      T.erros = e;
      if (Object.keys(e).length) {
        render();
        var first = app.querySelector("[aria-invalid=true]") || app.querySelector(".err");
        if (first && first.focus) first.focus();
        anunciar("Confira os campos destacados.");
        return;
      }
      S.diag.crm = (S.diag.crm || "").replace(/\D/g, "");
      S.diag.rqe = (S.diag.rqe || "").replace(/\D/g, "");
      if (S.passo < PASSOS.length - 1) { S.passo++; render({ topo: true, focoTela: true }); }
      else { S.diagFeito = true; S.planoEscolhido = null; S.tela = "diagnostico"; render({ topo: true, focoTela: true }); }
    }
  });

  carregar();
  render({ topo: true });
})();
