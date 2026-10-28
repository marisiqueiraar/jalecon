/* Jalecon · demo para clínicas. JavaScript puro, sem servidor, sem IA paga.
 * Estado salvo no navegador (localStorage, se disponível). Dados fictícios.
 * Modo entrevista (?entrevista=1 ou chave na tela): esconde preços para não ancorar o teste de preço.
 */
(function () {
  "use strict";
  var G = window.Guardiao, C = window.Clinica;
  var CHAVE = "jalecon-clinica-v1";

  var ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.6-3.4 2.8-5.5 5.5-5.5s4.9 2.1 5.5 5.5M14 15.2c.9-.5 1.9-.7 3-.7 2.3 0 4.1 1.8 4.5 4.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke-linecap="round"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/></svg>',
    logo: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="24" fill="#1F2440"/><polygon points="24,36 37,36 50,64 44,76" fill="#F7F8FA"/><polygon points="44,76 50,64 67,24 80,24" fill="#E8A27C"/></svg>'
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(n) { return Math.round(n).toLocaleString("pt-BR"); }
  function pct(x) { return Math.round(x * 100) + "%"; }
  function agora() { var d = new Date(); return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); }
  function sim(txt) { return '<p class="sim">' + esc(txt || "Simulação com dados fictícios. No piloto, estes números são medidos.") + "</p>"; }

  /* ---------- estado ---------- */
  function estadoInicial() {
    return { tela: "inicio", passo: 0, diag: C.diagPadrao(), diagFeito: false, entrevista: false, fila: null, pecaAberta: null, medicoAberto: null, chat: null, agenda: null, espera: null, registro: [] };
  }
  var S = estadoInicial();
  var T = { erros: {}, toast: "", toastTimer: null, focoTela: false, confirmar: false, t0: null, acumulado: 0 };
  /* Modo banca (?banca=1): a lateral vira o roteiro dos 5 minutos ao vivo, com cronômetro. */
  var BANCA = false;

  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) { /* sem armazenamento: a demo segue sem lembrar */ } }
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
  function opcoes(p) {
    if (p.autor === "clinica") return { identificacao: true, exigirNome: false, perfil: null };
    var m = medico(p.autor);
    return { identificacao: true, exigirNome: true, perfil: m ? C.perfil(m) : null };
  }
  function pendentes() { return (S.fila || []).filter(function (p) { return p.status === "pendente"; }).length; }
  function diretor() { return (S.diag.diretorSexo === "m" ? "Dr. " : "Dra. ") + (S.diag.diretor || "") + " · CRM-" + S.diag.uf + " " + (S.diag.diretorCrm || ""); }
  function preparar() {
    S.fila = C.fila(S.diag, eq());
    S.chat = { passo: 0, msgs: [], fim: false, slot: null };
    S.agenda = C.agenda(eq());
    S.espera = C.ESPERA.map(function (e, i) { return { id: "e" + i, nome: e[0], pref: e[1], usado: false }; });
    S.registro = [];
  }

  /* ---------- pedaços de interface ---------- */
  function topo() {
    var dir = '<span class="tag-ex">dados fictícios</span>' + (S.entrevista ? '<span class="pill info" data-testid="modo-entrevista">modo entrevista</span>' : "");
    return '<header class="top"><button class="brand" type="button" data-go="' + (S.diagFeito ? "painel" : "inicio") + '" aria-label="Jalecon, ir para o início">' + ICON.logo + "jalecon</button><div class=\"who\">" + dir + "</div></header>";
  }
  function nav(cur) {
    if (!S.diagFeito) return "";
    var pend = pendentes();
    var itens = [["painel", "Painel", ICON.home], ["medicos", "Médicos", ICON.team], ["aprovacao", "Aprovação", ICON.shield], ["whatsapp", "WhatsApp", ICON.chat], ["agenda", "Agenda", ICON.cal]];
    return '<nav class="nav" aria-label="Navegação do app">' + itens.map(function (i) {
      var on = cur === i[0] || (cur === "peca" && i[0] === "aprovacao") || (cur === "medico" && i[0] === "medicos");
      var badge = i[0] === "aprovacao" && pend ? '<span class="badge" aria-label="' + pend + ' peças esperam aprovação">' + pend + "</span>" : "";
      return '<button type="button" data-go="' + i[0] + '" class="' + (on ? "on" : "") + '"' + (on ? ' aria-current="page"' : "") + ">" + i[2] + "<span>" + i[1] + "</span>" + badge + "</button>";
    }).join("") + "</nav>";
  }
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
  function preco(v) { return S.entrevista ? "" : C.brl(v); }

  /* ---------- telas ---------- */
  function vInicio() {
    return topo() + '<div class="scroll" id="scroll">' +
      '<span class="eyebrow">Para clínicas de 2 a 15 médicos</span>' +
      '<h2 class="t" tabindex="-1">A equipe de captação e atendimento da sua clínica</h2>' +
      '<p class="muted">Agentes de IA cuidam da marca de cada médico, dos anúncios e do WhatsApp 24 horas, com agendamento. Um especialista supervisiona, e o diretor técnico aprova o que vai ao ar, com cada peça checada nas regras do CFM.</p>' +
      '<ul class="list">' + ["Raio-x: onde a clínica perde pacientes hoje", "Painel de consultas por canal e por médico", "Aprovação do diretor técnico com o Guardião", "WhatsApp que responde à noite e agenda", "Confirmação e lista de espera contra faltas"].map(function (t) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + t + "</li>"; }).join("") + "</ul>" +
      '<button class="btn" type="button" data-act="comecar">Fazer o diagnóstico da clínica (3 min)</button>' +
      '<button class="btn ghost" type="button" data-act="exemplo">Ver com uma clínica de exemplo</button>' +
      '<div class="card"><label class="row between" for="f-entrevista" style="cursor:pointer"><span><b>Modo entrevista</b><br><span class="small">Esconde preços e planos, para mostrar a gestores sem influenciar a pergunta de preço.</span></span><input type="checkbox" id="f-entrevista" data-k="entrevista"' + (S.entrevista ? " checked" : "") + ' style="width:22px;height:22px"></label></div>' +
      sim("Protótipo acadêmico. Todos os dados são fictícios.") +
      "</div>";
  }

  var PASSOS = ["A clínica", "Atendimento hoje", "Gasto e responsável"];
  function vDiagnostico() {
    var d = S.diag, p = S.passo, corpo = "";
    if (p === 0) {
      corpo = campo("nome", "Nome da clínica", input("nome", d.nome, ' autocomplete="organization"')) +
        '<div class="grid-uf">' + campo("cidade", "Cidade", input("cidade", d.cidade)) + campo("uf", "UF", input("uf", d.uf, ' maxlength="2"')) + "</div>" +
        campo("medicos", "Quantos médicos atendem na clínica?", input("medicos", d.medicos, ' inputmode="numeric"'), "Entre 2 e 60.") +
        "<fieldset><legend>Especialidades principais</legend><div class=\"chips\">" + C.ESP_ORDEM.map(function (k, i) {
          var on = (d.especialidades || []).indexOf(k) >= 0;
          return '<label class="chip"><input type="checkbox" id="c-esp' + i + '" value="' + k + '" data-k="especialidades"' + (on ? " checked" : "") + "><span>" + esc(C.ESP[k].nome) + "</span></label>";
        }).join("") + "</div></fieldset>" +
        radios("particular", [[30, "Menos da metade"], [60, "Mais da metade"], [85, "Quase tudo"]], d.particular, "Quanto da receita vem de pacientes particulares?");
    } else if (p === 1) {
      corpo = campo("contatos", "Contatos de pacientes novos por semana (WhatsApp, telefone, site)", input("contatos", d.contatos, ' inputmode="numeric"'), "Uma estimativa basta.") +
        radios("quem", C.QUEM, d.quem, "Quem responde hoje?") +
        radios("foraHorario", [["sim", "Sim"], ["nao", "Não"]], d.foraHorario, "Alguém responde à noite e no fim de semana?") +
        radios("mede", [["sim", "Sim"], ["nao", "Não"]], d.mede, "Vocês sabem quantos contatos viram consulta?") +
        radios("faltas", C.FALTAS, d.faltas, "Quantos pacientes faltam às consultas?");
    } else {
      corpo = '<div class="grid2">' + campo("gastoAgencia", "Agência ou freelancer (R$/mês)", input("gastoAgencia", d.gastoAgencia, ' inputmode="numeric"')) + campo("gastoAnuncios", "Verba de anúncios (R$/mês)", input("gastoAnuncios", d.gastoAnuncios, ' inputmode="numeric"')) + "</div>" +
        campo("gastoOutros", "Secretária virtual, atendente ou robô (R$/mês)", input("gastoOutros", d.gastoOutros, ' inputmode="numeric"')) +
        campo("ticket", "Valor médio de uma consulta particular (R$)", input("ticket", d.ticket, ' inputmode="numeric"')) +
        campo("diretor", "Nome do diretor técnico", input("diretor", d.diretor), "Quem responde pela publicidade da clínica no CRM.") +
        radios("diretorSexo", [["f", "Diretora"], ["m", "Diretor"]], d.diretorSexo, "Como aparece na assinatura") +
        '<div class="grid2">' + campo("diretorCrm", "CRM do diretor técnico", input("diretorCrm", d.diretorCrm, ' inputmode="numeric"')) + campo("crmPJ", "Registro da clínica no CRM", input("crmPJ", d.crmPJ, ' inputmode="numeric"')) + "</div>";
    }
    return topo() + '<div class="scroll" id="scroll"><span class="eyebrow">Diagnóstico · ' + (p + 1) + " de 3</span>" +
      '<h2 class="t" tabindex="-1">' + esc(PASSOS[p]) + "</h2>" +
      '<div class="progress" aria-hidden="true"><span style="width:' + ((p + 1) / 3 * 100) + '%"></span></div>' +
      '<form id="form-diag" novalidate style="display:grid;gap:14px">' + corpo +
      '<div class="row">' + (p > 0 ? '<button class="btn ghost" type="button" data-act="voltar">Voltar</button>' : "") + '<button class="btn" type="submit">' + (p < 2 ? "Continuar" : "Ver o raio-x da clínica") + "</button></div></form>" +
      sim("Os dados ficam só no seu navegador.") + "</div>";
  }

  function linhaFunil(rot, hoje, jal, base) {
    return '<div class="fr"><span>' + esc(rot) + '</span><span class="num"><b>' + fmt(hoje) + "</b> → <b>" + fmt(jal) + '</b></span><div class="fb duo"><span class="h" style="width:' + Math.max(2, hoje / base * 100) + '%"></span></div><div class="fb duo"><span style="width:' + Math.max(2, jal / base * 100) + '%"></span></div></div>';
  }
  function vRaioX() {
    var d = S.diag, r = C.raioX(d), P = C.PLANOS[r.plano];
    var plano = S.entrevista ? "" :
      '<div class="card accent"><span class="eyebrow">Plano indicado pelo porte</span><h3 class="t" data-testid="plano-indicado">' + esc(P.nome) + " · " + C.brl(P.preco) + '/mês</h3><p class="muted">' + esc(P.porte) + ". Implantação de uma mensalidade; verba de anúncios à parte; sem cobrança por consulta.</p>" +
      (r.gastoAtual ? '<p class="small">Hoje a clínica gasta ' + C.brl(r.gastoAtual) + " por mês com agência e atendimento, fora " + C.brl(r.gastoMidia) + " de anúncios.</p>" : "") +
      '<button class="link" type="button" data-go="planos">Ver os planos</button></div>';
    return topo() + '<div class="scroll" id="scroll">' +
      '<span class="eyebrow">Raio-x · ' + esc(d.nome) + "</span>" +
      '<h2 class="t" tabindex="-1">Cerca de ' + fmt(r.perdidosResposta) + " contatos por mês ficam sem resposta</h2>" +
      '<p class="muted">De ' + fmt(r.contatos) + " contatos de pacientes novos por mês, a clínica responde " + fmt(r.hoje.respondidos) + " e agenda " + fmt(r.hoje.agendados) + ".</p>" +
      '<div class="card"><h3 class="t">Hoje → com a Jalecon</h3><div class="legend"><span><i style="background:var(--fg-3)"></i>Hoje</span><span><i style="background:var(--apricot)"></i>Com a Jalecon (estimativa)</span></div>' +
      '<div class="funnel">' + linhaFunil("Contatos respondidos", r.hoje.respondidos, r.jalecon.respondidos, r.contatos) + linhaFunil("Consultas agendadas", r.hoje.agendados, r.jalecon.agendados, r.contatos) + linhaFunil("Pacientes que vieram", r.hoje.compareceram, r.jalecon.compareceram, r.contatos) + "</div>" +
      '<div class="kpis"><div class="kpi hero"><span class="small">Consultas a mais por mês (estimativa)</span><b data-testid="consultas-a-mais">+' + fmt(r.consultasAMais) + "</b>" + (d.ticket ? '<span class="small">cerca de ' + C.brl(r.receitaAMais) + " em consultas particulares</span>" : "") + "</div></div>" +
      "<details><summary>Premissas desta conta</summary><ul class=\"list small\" style=\"margin-top:8px\">" +
      "<li>35% dos contatos chegam à noite e no fim de semana; sem resposta, 60% desistem.</li>" +
      "<li>Hoje, 25% dos contatos respondidos viram agendamento; com resposta em minutos e roteiro de agendamento, 30%.</li>" +
      "<li>Confirmação e lista de espera reduzem as faltas em 40%.</li>" +
      "<li>São hipóteses da demo, não resultado prometido. O piloto mede os números reais.</li></ul></details></div>" +
      '<div class="card"><h3 class="t">Onde a clínica perde pacientes</h3><ul class="list">' + r.lacunas.map(function (l) { return '<li><span style="color:var(--clay)">' + ICON.warn + "</span>" + esc(l) + "</li>"; }).join("") + (r.lacunas.length ? "" : "<li>A base está boa. O ganho vem de medir e escalar.</li>") + "</ul></div>" +
      plano +
      '<button class="btn" type="button" data-go="painel">Abrir o painel da clínica</button>' +
      '<button class="btn ghost" type="button" data-act="editar-diag">Ajustar o diagnóstico</button>' +
      "</div>";
  }

  /* O que aconteceu nesta sessão da demo: vem das ações reais, não da simulação do mês. */
  function aoVivo() {
    var aprovadas = (S.registro || []).filter(function (x) { return x.tipo === "ok"; }).length;
    var devolvidas = (S.registro || []).filter(function (x) { return x.tipo === "bloqueia"; }).length;
    var wa = (S.agenda || []).filter(function (c) { return c.status === "whatsapp"; })[0];
    var encaixes = (S.agenda || []).filter(function (c) { return c.status === "encaixe"; }).length;
    var itens = [];
    if (aprovadas) itens.push(aprovadas + " peça" + (aprovadas > 1 ? "s aprovadas" : " aprovada") + " pelo diretor técnico, com registro");
    if (devolvidas) itens.push(devolvidas + " peça" + (devolvidas > 1 ? "s devolvidas" : " devolvida") + " ao autor");
    if (wa) itens.push("1 paciente novo atendido às 22h47, fora do horário, e agendado pelo WhatsApp" + (S.chat && S.chat.slot ? " para " + S.chat.slot : ""));
    if (encaixes) itens.push(encaixes + " falta evitada pela lista de espera");
    if (!itens.length) return "";
    var ult = S.registro.length ? S.registro[S.registro.length - 1] : null;
    return '<div class="card live" data-testid="ao-vivo"><span class="eyebrow">Hoje, nesta demonstração</span><ul class="list">' + itens.map(function (t) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + esc(t) + "</li>"; }).join("") + "</ul>" +
      (ult ? '<p class="small">Último registro: ' + esc(ult.quando) + " · " + esc(ult.txt) + "</p>" : "") + "</div>";
  }

  function vPainel() {
    var P = C.painel(S.diag, eq()), r = P.r, J = r.jalecon, ms = eq();
    var maxC = Math.max.apply(null, P.canais.map(function (c) { return c.contatos; }));
    var pend = pendentes();
    return topo() + '<div class="scroll" id="scroll">' +
      '<span class="eyebrow">Painel · mês 3 do piloto (simulado)</span>' +
      '<h2 class="t" tabindex="-1">' + fmt(J.compareceram) + " consultas de pacientes novos</h2>" + aoVivo() +
      '<div class="kpis">' +
      '<div class="kpi hero"><span class="small">Consultas a mais que no mês anterior à Jalecon</span><b>+' + fmt(r.consultasAMais) + "</b></div>" +
      '<div class="kpi"><span class="small">Contatos respondidos</span><b>' + pct(J.respondidos / r.contatos) + '</b><span class="small">em ' + P.tempoResposta + " (mediana)</span></div>" +
      '<div class="kpi"><span class="small">Atendidos fora do horário</span><b>' + fmt(P.foraHorario) + '</b><span class="small">noites e fins de semana</span></div>' +
      '<div class="kpi"><span class="small">Faltas</span><b>' + pct(J.faltaPct) + '</b><span class="small">eram ' + S.diag.faltas + "%</span></div>" +
      '<div class="kpi"><span class="small">Horários vagos preenchidos</span><b>' + fmt(P.vagasPreenchidas) + '</b><span class="small">pela lista de espera</span></div>' +
      "</div>" +
      (pend ? '<button class="card" type="button" data-go="aprovacao" style="text-align:left;border-color:var(--clay)"><span class="row between"><b>' + pend + " peça" + (pend > 1 ? "s esperam" : " espera") + ' o diretor técnico</b><span class="pill block">aprovar</span></span><span class="small">O Guardião já checou e marcou o que precisa mudar.</span></button>' : "") +
      '<div class="card"><h3 class="t">Por canal</h3><table class="pesos"><thead><tr><th scope="col">Canal</th><th scope="col" class="n">Contatos</th><th scope="col" class="n">Agendados</th></tr></thead><tbody>' +
      P.canais.map(function (c) { return "<tr><td>" + esc(c.nome) + '<div class="bar"><span style="width:' + (c.contatos / maxC * 100) + '%"></span></div></td><td class="n">' + fmt(c.contatos) + '</td><td class="n">' + fmt(c.agendados) + "</td></tr>"; }).join("") +
      "</tbody></table></div>" +
      '<div class="card"><h3 class="t">Por médico</h3><div class="hits">' + ms.map(function (m, i) {
        return '<button type="button" class="post-item" data-medico="' + m.id + '" style="grid-template-columns:36px 1fr auto">' + avatar(m) + '<span><span class="tt">' + esc(C.titulo(m)) + '</span><br><span class="small">' + esc(m.especialidade) + '</span></span><span class="num"><b>' + fmt(P.porMedico[i].consultas) + '</b> <span class="small">consultas</span></span></button>';
      }).join("") + "</div></div>" +
      sim() + "</div>";
  }

  function vMedicos() {
    var ms = eq();
    return topo() + '<div class="scroll" id="scroll"><span class="eyebrow">Equipe · ' + ms.length + " médicos</span>" +
      '<h2 class="t" tabindex="-1">Cada médico com a própria marca</h2>' +
      '<p class="muted">A Jalecon cuida da marca, do site e do Google de cada médico, dentro da identidade da clínica.</p>' +
      ms.map(function (m) {
        var pend = (S.fila || []).filter(function (p) { return p.autor === m.id && p.status === "pendente"; }).length;
        return '<button type="button" class="card" data-medico="' + m.id + '" style="text-align:left"><span class="row">' + avatar(m, 44) + '<span class="grow"><b>' + esc(C.titulo(m)) + '</b><br><span class="small">' + esc(m.especialidade) + " · CRM-" + m.uf + " " + m.crm + (m.rqe ? " · RQE " + m.rqe : "") + "</span></span></span>" +
          '<span class="resumo">' + (m.rqe ? '<span class="pill ok">site e Google no ar</span>' : '<span class="pill warn">sem RQE: não anuncia especialidade</span>') + (pend ? '<span class="pill block">' + pend + " para aprovar</span>" : '<span class="pill info">conteúdo do mês aprovado</span>') + "</span></button>";
      }).join("") + "</div>";
  }

  function vMedico() {
    var m = medico(S.medicoAberto) || eq()[0];
    var assin = G.assinatura(C.perfil(m));
    var pecas = (S.fila || []).filter(function (p) { return p.autor === m.id; });
    return topo() + '<div class="scroll" id="scroll"><button class="link" type="button" data-go="medicos">← Médicos</button>' +
      '<div class="row">' + avatar(m, 56) + '<div><h2 class="t" tabindex="-1">' + esc(C.titulo(m)) + '</h2><p class="small">' + esc(m.especialidade) + "</p></div></div>" +
      '<div class="peca Post" style="--pc:' + m.cor + ';--pa:#E8A27C"><span class="tag">' + esc(C.ESP[m.esp].tema) + '</span><div><div class="bar-a"></div><h4 style="font-family:Fraunces,Georgia,serif;margin-top:10px">' + (m.rqe ? "Quando vale procurar " + (m.sexo === "f" ? "uma médica" : "um médico") + " de " + esc(m.especialidade.toLowerCase()) + "?" : "Três sinais de que vale marcar uma consulta") + '</h4></div><span class="sig">' + esc(assin) + "</span></div>" +
      '<div class="card"><h3 class="t">Presença</h3><ul class="list">' +
      '<li><span style="color:var(--ok)">' + ICON.ok + "</span>Site com agendamento pelo WhatsApp da clínica</li>" +
      '<li><span style="color:var(--ok)">' + ICON.ok + "</span>Perfil no Google com horários e endereço da clínica</li>" +
      (m.rqe ? '<li><span style="color:var(--ok)">' + ICON.ok + "</span>Especialidade anunciada com RQE " + m.rqe + "</li>" : '<li><span style="color:var(--clay)">' + ICON.warn + "</span>Sem RQE cadastrado: o Guardião bloqueia \"especialista\" e o nome da especialidade nas peças</li>") +
      "</ul></div>" +
      '<div class="card"><h3 class="t">Peças deste médico</h3>' + (pecas.length ? pecas.map(itemPeca).join("") : '<p class="muted">Todas as peças do mês já foram aprovadas.</p>') + "</div>" +
      sim("Simulação: na versão real, os textos e a identidade são gerados pelos agentes.") + "</div>";
  }

  function pillStatus(s) {
    return { pendente: '<span class="pill warn">pendente</span>', aprovado: '<span class="pill ok">aprovado</span>', devolvido: '<span class="pill block">devolvido</span>' }[s];
  }
  function itemPeca(p) {
    var res = G.analisar(p.texto, opcoes(p));
    var marca = p.status !== "pendente" ? pillStatus(p.status) : res.liberado ? '<span class="pill ok">liberado</span>' : '<span class="pill block">' + res.contagem.bloqueia + " bloqueio" + (res.contagem.bloqueia > 1 ? "s" : "") + "</span>";
    return '<button type="button" class="post-item" data-peca="' + p.id + '" data-testid="peca-' + p.id + '"><span class="date"><b>' + esc(p.formato.charAt(0)) + "</b>" + esc(p.formato) + '</span><span><span class="tt">' + esc(p.titulo) + '</span><br><span class="small">' + esc(autorNome(p)) + "</span></span>" + marca + "</button>";
  }

  function vAprovacao() {
    var fila = S.fila || [];
    var pend = fila.filter(function (p) { return p.status === "pendente"; }), feitas = fila.filter(function (p) { return p.status !== "pendente"; });
    return topo() + '<div class="scroll" id="scroll"><span class="eyebrow">Diretor técnico · ' + esc(diretor()) + "</span>" +
      '<h2 class="t" tabindex="-1">' + (pend.length ? pend.length + " peça" + (pend.length > 1 ? "s esperam" : " espera") + " a sua aprovação" : "Nada pendente") + "</h2>" +
      '<p class="muted">O Guardião checa cada peça em ' + G.regras.length + " regras (CFM, Código de Ética, LGPD, CDC, ANVISA, Meta e Google). Nada vai ao ar sem a sua aprovação, e cada decisão fica registrada.</p>" +
      (pend.length ? '<div class="hits">' + pend.map(itemPeca).join("") + "</div>" : "") +
      (feitas.length ? '<div class="card"><h3 class="t">Já decididas</h3><div class="hits">' + feitas.map(itemPeca).join("") + "</div></div>" : "") +
      '<div class="card"><h3 class="t">Registro do diretor técnico</h3>' + (S.registro.length ? '<ol class="timeline" data-testid="registro">' + S.registro.slice().reverse().map(function (x) { return '<li class="' + (x.tipo || "") + '"><span><b>' + esc(x.quando) + "</b> " + esc(x.txt) + "</span></li>"; }).join("") + "</ol>" : '<p class="muted">Ainda vazio. Cada aprovação ou devolução entra aqui, com data, hora e as regras checadas.</p>') + "</div>" +
      '<button class="btn ghost" type="button" data-act="testar">Testar o Guardião com outro texto</button>' +
      "</div>";
  }

  function painelHits(res) {
    if (!res.hits.length) return '<p class="row ok-line">' + ICON.ok + "<b>Liberado: nenhuma regra violada.</b></p>";
    return '<div class="hits">' + res.hits.map(function (h) {
      var cit = G.citacao(h.regra);
      var q = h.faltando ? "Falta: " + h.faltando.join(", ") : h.trechos.map(function (s) { return "“" + s.texto + "”"; }).join(", ");
      return '<div class="hit ' + h.gravidade + '"><div class="row between" style="align-items:flex-start"><b style="font-size:13.5px">' + esc(h.regra.rotulo.charAt(0).toUpperCase() + h.regra.rotulo.slice(1)) + '</b><span class="pill ' + (h.gravidade === "bloqueia" ? "block" : h.gravidade === "alerta" ? "warn" : "info") + '">' + h.gravidade + '</span></div><p class="q">' + esc(q) + '</p><p class="small">' + esc(h.regra.explicacao) + '</p><p class="cit">' + esc(cit.texto) + (cit.validacao ? ' <span class="val">regra em validação jurídica</span>' : "") + "</p></div>";
    }).join("") + "</div>";
  }
  function vPeca() {
    var p = (S.fila || []).filter(function (x) { return x.id === S.pecaAberta; })[0];
    if (!p) { S.tela = "aprovacao"; return vAprovacao(); }
    var res = G.analisar(p.texto, opcoes(p));
    var aberto = p.status === "pendente";
    return topo() + '<div class="scroll" id="scroll"><button class="link" type="button" data-go="aprovacao">← Aprovação</button>' +
      '<span class="eyebrow">' + esc(p.formato) + " · " + esc(autorNome(p)) + "</span>" +
      '<h2 class="t" tabindex="-1">' + esc(p.titulo) + "</h2>" +
      '<div class="card"><div class="row between"><h3 class="t">Texto</h3><span id="resumo-g">' + resumo(res) + "</span></div>" +
      '<div class="texto" id="texto-marcado" aria-label="Texto com os trechos marcados pelo Guardião">' + G.destacar(res) + "</div>" +
      (aberto ? '<label class="lbl" for="f-texto">Editar o texto</label><textarea class="ta" id="f-texto" data-k="texto">' + esc(p.texto) + "</textarea>" : "") +
      '<div id="hits-g">' + painelHits(res) + "</div>" +
      '<p class="disclaimer">Checagem automática. Não substitui parecer jurídico; a responsabilidade ética continua com o médico e com o diretor técnico.</p></div>' +
      (aberto ? '<div style="display:grid;gap:8px">' +
        '<button class="btn ghost" type="button" data-act="sugestoes"' + (res.hits.length ? "" : " disabled") + ">Aplicar as sugestões do Guardião</button>" +
        '<button class="btn" type="button" data-act="aprovar" id="btn-aprovar"' + (res.liberado ? "" : ' disabled aria-describedby="motivo"') + ">Aprovar como diretor técnico</button>" +
        (res.liberado ? "" : '<p class="small" id="motivo">Para aprovar, resolva os bloqueios acima.</p>') +
        '<button class="btn ghost" type="button" data-act="devolver">Devolver ao autor com comentário</button>' +
        (p.texto !== p.original ? '<button class="link" type="button" data-act="restaurar">Voltar ao texto original</button>' : "") + "</div>"
        : '<div class="card"><h3 class="t">Decisão</h3><ol class="timeline">' + p.log.map(function (x) { return '<li class="' + (x.tipo || "") + '"><span><b>' + esc(x.quando) + "</b> " + esc(x.txt) + "</span></li>"; }).join("") + "</ol></div>") +
      "</div>";
  }
  function resumo(res) {
    var c = res.contagem;
    if (!res.hits.length) return '<span class="pill ok">liberado</span>';
    return [c.bloqueia ? '<span class="pill block">' + c.bloqueia + " bloqueia</span>" : "", c.alerta ? '<span class="pill warn">' + c.alerta + " alerta</span>" : "", c.orienta ? '<span class="pill info">' + c.orienta + " orienta</span>" : ""].join(" ");
  }

  function vWhatsapp() {
    var ch = S.chat, conv = C.conversa(S.diag, eq()), m = medico(conv.medico);
    var passo = conv.passos[ch.passo] || null;
    var opcoesPaciente = "";
    if (!ch.fim && passo) {
      if (ch.mostrarSlots) {
        opcoesPaciente = '<div class="chips" role="group" aria-label="Horários livres de ' + esc(C.titulo(m)) + '">' + C.slots(eq(), m.id).map(function (s) { return '<button type="button" class="chip-btn" data-slot="' + s.id + '">' + esc(s.dia) + " " + esc(s.hora) + "</button>"; }).join("") + "</div>";
      } else if (passo.paciente.length) {
        opcoesPaciente = '<div class="chips" role="group" aria-label="Escolha a mensagem do paciente">' + passo.paciente.map(function (o) { return '<button type="button" class="chip-btn" data-diz="' + o[1] + '">' + esc(o[0]) + "</button>"; }).join("") + "</div>";
      }
    }
    return topo() + '<div class="scroll" id="scroll"><span class="eyebrow">WhatsApp da clínica · 22:47, fora do horário</span>' +
      '<h2 class="t" tabindex="-1">O agente responde e agenda</h2>' +
      '<p class="muted">Você faz o papel do paciente: escolha as mensagens. O agente segue as regras do CFM e passa para a recepção o que precisar de gente.</p>' +
      '<div class="wa"><div class="wa-top"><b>' + esc(S.diag.nome || "Clínica") + '</b><span class="small">atendimento automático · supervisionado</span></div><div class="chat" aria-live="polite" data-testid="chat">' +
      (ch.msgs.length ? ch.msgs.map(function (x) {
        return '<div class="msg ' + (x.de === "p" ? "me" : "ai") + '">' + (x.de === "a" ? '<div class="de">Agente da clínica</div>' : "") + esc(x.txt) + "</div>" + (x.guarda ? '<div class="guard"><span>' + ICON.shield + "</span>" + esc(x.guarda) + "</div>" : "");
      }).join("") : '<div class="msg ai"><div class="de">Agente da clínica</div>Olá! Sou o atendimento da ' + esc(S.diag.nome || "clínica") + ". Como posso ajudar?</div>") +
      "</div></div>" + opcoesPaciente +
      (ch.fim ? '<div class="card"><h3 class="t">Resumo para a recepção</h3><p>Paciente novo, particular, queixa no joelho. Agendado com ' + esc(C.titulo(m)) + " " + esc(ch.slot) + '. Confirmação automática 24 horas antes.</p><p class="small">O agente não pede exames nem detalhes de saúde além do motivo da consulta (LGPD).</p><div class="row"><button class="btn small" type="button" data-go="agenda">Ver na agenda</button><button class="btn ghost small" type="button" data-act="reiniciar-chat">Recomeçar conversa</button></div></div>' : "") +
      sim("Simulação: na versão real, o agente usa IA com as regras da clínica e do CFM, e uma pessoa supervisiona.") + "</div>";
  }

  function vAgenda() {
    var ms = eq().slice(0, 4), ag = S.agenda || [];
    var conf = ag.filter(function (c) { return c.status === "confirmada" || c.status === "encaixe"; }).length;
    var aguard = ag.filter(function (c) { return c.status === "aguardando"; }).length;
    var vagas = ag.filter(function (c) { return c.status === "cancelou"; });
    var ROT = { confirmada: ["ok", "confirmada"], aguardando: ["warn", "aguardando confirmação"], nova: ["info", "nova"], whatsapp: ["ok", "nova · pelo WhatsApp"], cancelou: ["block", "cancelou"], encaixe: ["ok", "encaixe da lista de espera"] };
    return topo() + '<div class="scroll" id="scroll"><span class="eyebrow">Agenda de amanhã</span>' +
      '<h2 class="t" tabindex="-1">' + conf + " de " + ag.length + " consultas confirmadas</h2>" +
      '<div class="row wrap"><button class="btn small" type="button" data-act="confirmar"' + (aguard ? "" : " disabled") + ">Enviar confirmações (" + aguard + ")</button>" + (vagas.length ? '<span class="pill block">' + vagas.length + " horário vago</span>" : "") + "</div>" +
      (vagas.length ? '<div class="card" style="border-color:var(--clay)"><h3 class="t">Lista de espera</h3><p class="muted">' + esc(vagas[0].paciente) + " cancelou o horário das " + vagas[0].hora + " com " + esc(C.titulo(medico(vagas[0].medico))) + ". Quem está na lista de espera recebe a oferta primeiro.</p>" +
        S.espera.filter(function (e) { return !e.usado; }).map(function (e) { return '<div class="row between"><span><b>' + esc(e.nome) + '</b><br><span class="small">' + esc(e.pref) + '</span></span><button class="btn small" type="button" data-espera="' + e.id + '">Oferecer</button></div>'; }).join("") + "</div>" : "") +
      ms.map(function (m) {
        var lista = ag.filter(function (c) { return c.medico === m.id; });
        return '<div class="card"><div class="row">' + avatar(m) + "<b>" + esc(C.titulo(m)) + '</b></div><div class="hits">' + lista.map(function (c) {
          var r = ROT[c.status] || ["info", c.status];
          return '<div class="row between slot"><span class="num"><b>' + c.hora + "</b> " + esc(c.paciente) + '</span><span class="pill ' + r[0] + '">' + r[1] + "</span></div>";
        }).join("") + "</div></div>";
      }).join("") + sim() + "</div>";
  }

  function vPlanos() {
    if (S.entrevista) { S.tela = "painel"; return vPainel(); }
    var r = C.raioX(S.diag);
    return topo() + '<div class="scroll" id="scroll"><span class="eyebrow">Planos</span>' +
      '<h2 class="t" tabindex="-1">Uma mensalidade, um fornecedor</h2>' +
      ["essencial", "pro", "rede"].map(function (k) {
        var P = C.PLANOS[k], rec = k === r.plano;
        return '<div class="card' + (rec ? " accent" : "") + '"' + (rec ? ' data-testid="plano-recomendado"' : "") + '><div class="row between"><b>' + esc(P.nome) + "</b>" + (rec ? '<span class="pill ok">indicado para ' + esc(S.diag.nome || "a clínica") + "</span>" : "") + '</div><span class="num" style="font-family:var(--display);font-size:26px;font-weight:600">' + C.brl(P.preco) + '<span class="small">/mês</span></span><span class="small">' + esc(P.porte) + "</span></div>";
      }).join("") +
      '<div class="card"><h3 class="t">O que entra em todos</h3><ul class="list">' + C.INCLUI.map(function (x) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + esc(x) + "</li>"; }).join("") + "</ul>" +
      '<p class="small">Implantação de uma mensalidade. Verba de anúncios à parte. Sem cobrança por consulta agendada até termos parecer jurídico. Agências para clínicas cobram de R$ 5 mil a R$ 15 mil por mês.</p></div>' +
      '<div class="card accent"><h3 class="t">Piloto</h3><p>3 a 6 meses com 3 a 5 clínicas de 5 a 10 médicos, pagantes, medindo consultas, faltas e horas de atendimento por clínica.</p><button class="btn" type="button" data-act="piloto">Quero participar do piloto</button></div>' +
      "</div>";
  }

  function vTestar() {
    var txt = S.teste == null ? "Sou o melhor ortopedista de SP. Cirurgia de joelho sem dor, resultado garantido! Primeira consulta grátis." : S.teste;
    var res = G.analisar(txt, { identificacao: true });
    return topo() + '<div class="scroll" id="scroll"><button class="link" type="button" data-go="aprovacao">← Aprovação</button>' +
      '<h2 class="t" tabindex="-1">Teste o Guardião</h2><p class="muted">Cole qualquer texto de post, anúncio ou bio.</p>' +
      '<label class="lbl" for="f-teste">Texto</label><textarea class="ta" id="f-teste" data-k="teste">' + esc(txt) + "</textarea>" +
      '<div class="card"><div class="row between"><h3 class="t">Resultado</h3><span id="resumo-g">' + resumo(res) + '</span></div><div class="texto" id="texto-marcado">' + G.destacar(res) + '</div><div id="hits-g">' + painelHits(res) + "</div></div></div>";
  }

  /* ---------- roteiro lateral ---------- */
  var ROTEIRO = [["inicio", "Boas-vindas"], ["diagnostico", "Diagnóstico da clínica"], ["raiox", "Raio-x"], ["painel", "Painel de consultas"], ["medicos", "Médicos"], ["aprovacao", "Aprovação do diretor técnico"], ["whatsapp", "WhatsApp que agenda"], ["agenda", "Agenda e faltas"], ["planos", "Planos e piloto"]];
  var PASSOS_BANCA = [
    { tela: "raiox", rot: "Raio-x da clínica", tempo: "0:00", fala: "Onde a clínica perde pacientes hoje, calculado com as respostas do gestor." },
    { tela: "peca", peca: "p1", rot: "Guardião e aprovação", tempo: "0:45", fala: "O post fere regras do CFM. Aplique as sugestões e aprove como diretor técnico." },
    { tela: "testar", rot: "A banca testa o Guardião", tempo: "2:00", fala: "Peça a alguém da banca uma frase de anúncio e digite aqui." },
    { tela: "whatsapp", rot: "WhatsApp que agenda", tempo: "3:00", fala: "22h47, fora do horário: o agente responde e marca na agenda do médico." },
    { tela: "painel", rot: "Painel: o que aconteceu", tempo: "4:00", fala: "Consultas por canal e por médico, e o que acabamos de fazer." }
  ];
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
  function renderBanca(el) {
    var on = function (p) { return S.tela === p.tela && (!p.peca || S.pecaAberta === p.peca); };
    el.innerHTML = '<div class="crono-box"><span id="crono" class="crono">0:00</span><span class="small">de 5:00</span>' +
      '<button class="btn ghost small" type="button" data-act="crono" id="crono-bt">Iniciar</button><button class="link" type="button" data-act="crono-zerar">Zerar</button></div>' +
      '<button class="btn small" type="button" data-act="preparar-banca">Preparar a demo (começa do zero)</button>' +
      PASSOS_BANCA.map(function (p, i) {
        var cur = on(p);
        return '<button type="button" data-banca="' + i + '" class="' + (cur ? "on" : "") + '"' + (S.diagFeito ? "" : ' aria-disabled="true" title="Prepare a demo primeiro"') + (cur ? ' aria-current="step"' : "") +
          "><b>" + (i + 1) + '</b><span class="grow"><span class="r">' + esc(p.rot) + '</span><span class="fala">' + esc(p.fala) + '</span></span><span class="tm">' + p.tempo + "</span></button>";
      }).join("");
    atualizarCrono();
  }
  function renderRoteiro() {
    var el = document.getElementById("tour");
    if (!el) return;
    if (BANCA) { renderBanca(el); return; }
    el.innerHTML = ROTEIRO.filter(function (t) { return !(S.entrevista && t[0] === "planos"); }).map(function (t, i) {
      var ok = S.diagFeito || ["inicio", "diagnostico"].indexOf(t[0]) >= 0;
      var cur = S.tela === t[0] || (S.tela === "peca" && t[0] === "aprovacao") || (S.tela === "medico" && t[0] === "medicos");
      return '<button type="button" data-go="' + t[0] + '" class="' + (cur ? "on" : "") + '"' + (ok ? "" : ' aria-disabled="true" title="Faça o diagnóstico primeiro"') + (cur ? ' aria-current="step"' : "") + "><b>" + (i + 1) + "</b>" + t[1] + "</button>";
    }).join("");
    var cb = document.getElementById("side-entrevista");
    if (cb) cb.checked = !!S.entrevista;
  }

  /* ---------- render ---------- */
  var app = document.getElementById("app");
  var VIEWS = { inicio: vInicio, diagnostico: vDiagnostico, raiox: vRaioX, painel: vPainel, medicos: vMedicos, medico: vMedico, aprovacao: vAprovacao, peca: vPeca, whatsapp: vWhatsapp, agenda: vAgenda, planos: vPlanos, testar: vTestar };
  function render(opts) {
    opts = opts || {};
    var v = VIEWS[S.tela] || vInicio;
    if (!S.diagFeito && ["inicio", "diagnostico"].indexOf(S.tela) < 0) { S.tela = "inicio"; v = vInicio; }
    var sc = app.querySelector("#scroll"), y = sc ? sc.scrollTop : 0;
    app.innerHTML = v() + nav(S.tela) + '<div class="toast" role="status" ' + (T.toast ? "" : "hidden") + ">" + esc(T.toast) + "</div>";
    var sc2 = app.querySelector("#scroll");
    if (sc2) sc2.scrollTop = opts.topo ? 0 : y;
    if (opts.topo || T.focoTela) { var h = app.querySelector("h2.t"); if (h) h.focus({ preventScroll: true }); T.focoTela = false; }
    renderRoteiro();
    salvar();
  }
  function ir(tela) {
    if (tela === "planos" && S.entrevista) tela = "painel";
    if (!S.diagFeito && ["inicio", "diagnostico"].indexOf(tela) < 0) { toast("Faça o diagnóstico da clínica primeiro."); return; }
    if (tela === "raiox" && !S.diagFeito) return;
    S.tela = tela; T.erros = {}; T.focoTela = true;
    render({ topo: true });
  }
  function toast(msg) {
    T.toast = msg;
    var t = app.querySelector(".toast");
    if (t) { t.textContent = msg; t.hidden = false; }
    clearTimeout(T.toastTimer);
    T.toastTimer = setTimeout(function () { T.toast = ""; var t2 = app.querySelector(".toast"); if (t2) t2.hidden = true; }, 3200);
  }

  /* ---------- validação do diagnóstico ---------- */
  function num(v) { var n = parseInt(String(v).replace(/\D/g, ""), 10); return isNaN(n) ? 0 : n; }
  function validar() {
    var d = S.diag, e = {};
    if (S.passo === 0) {
      if (!d.nome.trim()) e.nome = "Informe o nome da clínica.";
      if (d.medicos < 2 || d.medicos > 60) e.medicos = "Informe entre 2 e 60 médicos.";
      if (!/^[A-Za-z]{2}$/.test(d.uf)) e.uf = "Use a sigla, por exemplo SP.";
    } else if (S.passo === 1) {
      if (d.contatos < 1) e.contatos = "Informe uma estimativa de contatos por semana.";
    } else {
      if (!d.diretor.trim()) e.diretor = "Informe o nome do diretor técnico.";
      if (!/^\d{4,7}$/.test(String(d.diretorCrm))) e.diretorCrm = "CRM com 4 a 7 dígitos.";
    }
    T.erros = e;
    return !Object.keys(e).length;
  }

  /* ---------- ações ---------- */
  function peca() { return (S.fila || []).filter(function (x) { return x.id === S.pecaAberta; })[0]; }
  function aplicarSugestoes(p) {
    var o = opcoes(p);
    var a = G.aplicarSugestoes(p.texto, o);
    var t = a.texto, feitas = a.aplicadas.slice();
    if (p.autor === "clinica") {
      var r = G.analisar(t, o);
      var falta = r.hits.some(function (h) { return h.regra.id === "CFM2336-PJ-01" || h.regra.id === "CFM2336-ID-01"; });
      if (falta) { var ass = C.assinaturaClinica(S.diag); t = t + "\n\n" + ass; feitas.push("assinatura da clínica incluída: " + ass); }
    }
    p.texto = t;
    var fim = G.analisar(t, o);
    toast(feitas.length ? "Guardião aplicou " + feitas.length + " ajuste" + (feitas.length > 1 ? "s" : "") + (fim.liberado ? ". Peça liberada." : ". Ainda há ajuste manual.") : "Não há troca automática para estes pontos. Edite o texto.");
  }
  function registrar(txt, tipo, p) {
    var x = { quando: agora(), txt: txt, tipo: tipo };
    S.registro.push(x);
    if (p) p.log.push(x);
  }
  function aprovar(p) {
    var res = G.analisar(p.texto, opcoes(p));
    if (!res.liberado) return;
    p.status = "aprovado";
    var alertas = res.hits.filter(function (h) { return h.gravidade === "alerta"; }).length;
    registrar("“" + p.titulo + "” (" + autorNome(p) + ") aprovada por " + diretor() + ". " + G.regras.length + " regras checadas" + (alertas ? ", " + alertas + " alerta(s) aceito(s)" : ", nenhum alerta") + ".", "ok", p);
    toast("Aprovada e agendada. A decisão ficou no registro.");
  }
  function devolver(p) {
    var res = G.analisar(p.texto, opcoes(p));
    p.status = "devolvido";
    registrar("“" + p.titulo + "” devolvida a " + autorNome(p) + " por " + diretor() + (res.hits.length ? ": " + res.hits.map(function (h) { return h.regra.rotulo; }).join(", ") : "") + ".", "bloqueia", p);
    toast("Devolvida ao autor com os pontos do Guardião.");
  }

  function falar(chave) {
    var ch = S.chat, conv = C.conversa(S.diag, eq()), passo = conv.passos[ch.passo];
    if (!passo) return;
    var op = passo.paciente.filter(function (o) { return o[1] === chave; })[0];
    if (!op) return;
    ch.msgs.push({ de: "p", txt: op[0] });
    var resp = passo.agente;
    if (resp === "SLOTS") {
      ch.msgs.push({ de: "a", txt: "Tenho estes horários com " + C.titulo(medico(conv.medico)) + ". Qual fica melhor?" });
      ch.mostrarSlots = true;
    } else {
      var txt = typeof resp === "string" ? resp : resp[chave];
      ch.msgs.push({ de: "a", txt: txt, guarda: passo.guarda && passo.guarda[chave] });
    }
    ch.passo++;
  }
  function escolherSlot(id) {
    var ch = S.chat, conv = C.conversa(S.diag, eq()), m = medico(conv.medico);
    var s = C.slots(eq(), m.id).filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    ch.msgs.push({ de: "p", txt: s.dia + " " + s.hora });
    ch.slot = s.dia + " às " + s.hora;
    ch.msgs.push({ de: "a", txt: "Pronto! Consulta com " + C.titulo(m) + " na " + s.dia + " às " + s.hora + ", na " + (S.diag.nome || "clínica") + ". Mando uma confirmação 24 horas antes. Para remarcar, é só responder aqui." });
    ch.mostrarSlots = false; ch.fim = true;
    S.agenda.push({ id: "c-wa", medico: m.id, hora: s.hora + " (" + s.dia + ")", paciente: "Paciente novo", status: "whatsapp" });
    toast("Consulta agendada na agenda de " + C.titulo(m) + ".");
  }
  function confirmar() {
    var ag = S.agenda, cancelou = false;
    ag.forEach(function (c) {
      if (c.status !== "aguardando") return;
      if (!cancelou) { c.status = "cancelou"; cancelou = true; } else c.status = "confirmada";
    });
    toast(cancelou ? "Confirmações enviadas. Um paciente cancelou: o horário foi para a lista de espera." : "Confirmações enviadas.");
  }
  function oferecer(id) {
    var e = S.espera.filter(function (x) { return x.id === id; })[0];
    var vaga = S.agenda.filter(function (c) { return c.status === "cancelou"; })[0];
    if (!e || !vaga) return;
    e.usado = true; vaga.paciente = e.nome; vaga.status = "encaixe";
    toast(e.nome + " aceitou o horário das " + vaga.hora + ". Falta evitada.");
  }

  /* ---------- eventos ---------- */
  app.addEventListener("click", function (ev) {
    var b = ev.target.closest("button, [data-go]");
    if (!b || b.disabled) return;
    if (b.dataset.go) { ir(b.dataset.go); return; }
    if (b.dataset.medico) { S.medicoAberto = b.dataset.medico; ir("medico"); return; }
    if (b.dataset.peca) { S.pecaAberta = b.dataset.peca; ir("peca"); return; }
    if (b.dataset.diz) { falar(b.dataset.diz); render(); return; }
    if (b.dataset.slot) { escolherSlot(b.dataset.slot); render(); return; }
    if (b.dataset.espera) { oferecer(b.dataset.espera); render(); return; }
    var a = b.dataset.act;
    if (!a) return;
    if (a === "comecar") { S.diag = C.diagPadrao(); S.passo = 0; S.diagFeito = false; ir("diagnostico"); }
    else if (a === "exemplo") { S.diag = C.diagExemplo(); S.diagFeito = true; preparar(); ir("raiox"); }
    else if (a === "voltar") { S.passo = Math.max(0, S.passo - 1); T.erros = {}; render({ topo: true }); }
    else if (a === "editar-diag") { S.passo = 0; ir("diagnostico"); }
    else if (a === "sugestoes") { var p = peca(); if (p) { aplicarSugestoes(p); render(); } }
    else if (a === "aprovar") { var p2 = peca(); if (p2) { aprovar(p2); ir("aprovacao"); } }
    else if (a === "devolver") { var p3 = peca(); if (p3) { devolver(p3); ir("aprovacao"); } }
    else if (a === "restaurar") { var p4 = peca(); if (p4) { p4.texto = p4.original; render(); } }
    else if (a === "testar") { S.teste = null; ir("testar"); }
    else if (a === "reiniciar-chat") { S.chat = { passo: 0, msgs: [], fim: false, slot: null }; S.agenda = S.agenda.filter(function (c) { return c.id !== "c-wa"; }); render(); }
    else if (a === "confirmar") { confirmar(); render(); }
    else if (a === "piloto") { toast("Simulação: na versão real, abre uma conversa com o time da Jalecon."); }
  });

  function lerCampo(t) {
    var k = t.dataset.k, d = S.diag;
    if (k === "entrevista") { S.entrevista = t.checked; render(); return true; }
    if (k === "especialidades") {
      var l = (d.especialidades || []).filter(function (x) { return x !== t.value; });
      if (t.checked) l.push(t.value);
      d.especialidades = l; return false;
    }
    if (k === "texto") {
      var p = peca(); if (!p) return false;
      p.texto = t.value; atualizarGuardiao(p.texto, opcoes(p)); return false;
    }
    if (k === "teste") { S.teste = t.value; atualizarGuardiao(t.value, { identificacao: true }); return false; }
    if (["medicos", "contatos", "gastoAgencia", "gastoAnuncios", "gastoOutros", "ticket", "particular", "faltas"].indexOf(k) >= 0) d[k] = num(t.value);
    else if (k === "uf") d.uf = t.value.toUpperCase();
    else if (k in d) d[k] = t.value;
    return false;
  }
  function atualizarGuardiao(texto, o) {
    var res = G.analisar(texto, o);
    var m = app.querySelector("#texto-marcado"), h = app.querySelector("#hits-g"), r = app.querySelector("#resumo-g"), bt = app.querySelector("#btn-aprovar");
    if (m) m.innerHTML = G.destacar(res);
    if (h) h.innerHTML = painelHits(res);
    if (r) r.innerHTML = resumo(res);
    if (bt) bt.disabled = !res.liberado;
    salvar();
  }
  app.addEventListener("input", function (ev) { var t = ev.target; if (t.dataset && t.dataset.k && t.type !== "checkbox" && t.type !== "radio") lerCampo(t); });
  app.addEventListener("change", function (ev) { var t = ev.target; if (t.dataset && t.dataset.k && (t.type === "checkbox" || t.type === "radio")) { lerCampo(t); salvar(); } });
  app.addEventListener("submit", function (ev) {
    if (ev.target.id !== "form-diag") return;
    ev.preventDefault();
    if (!validar()) { render(); var f = app.querySelector('[aria-invalid="true"]'); if (f) f.focus(); return; }
    if (S.passo < 2) { S.passo++; render({ topo: true }); return; }
    S.diagFeito = true; preparar(); ir("raiox");
  });

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest(".side [data-go], .side [data-act], .side [data-banca]");
    if (!b || b.getAttribute("aria-disabled") === "true") return;
    if (b.dataset.go) { ir(b.dataset.go); return; }
    if (b.dataset.banca) {
      var pb = PASSOS_BANCA[+b.dataset.banca];
      if (pb.tela === "testar") S.teste = null;
      if (pb.peca) S.pecaAberta = pb.peca;
      ir(pb.tela); return;
    }
    if (b.dataset.act === "preparar-banca") {
      S = estadoInicial(); S.diag = C.diagExemplo(); S.diagFeito = true; preparar();
      T.t0 = null; T.acumulado = 0;
      ir("raiox"); toast("Demo pronta: clínica de exemplo, sem nenhuma ação anterior."); return;
    }
    if (b.dataset.act === "crono") {
      if (T.t0) { T.acumulado += Date.now() - T.t0; T.t0 = null; } else T.t0 = Date.now();
      atualizarCrono(); return;
    }
    if (b.dataset.act === "crono-zerar") { T.t0 = null; T.acumulado = 0; atualizarCrono(); return; }
    if (b.dataset.act === "recomecar") {
      if (!T.confirmar) { T.confirmar = true; b.textContent = "Clique de novo para apagar tudo"; setTimeout(function () { T.confirmar = false; b.textContent = "Recomeçar demo"; }, 3000); return; }
      T.confirmar = false; b.textContent = "Recomeçar demo";
      var ent = S.entrevista; S = estadoInicial(); S.entrevista = ent; try { localStorage.removeItem(CHAVE); } catch (e) { /* ok */ }
      render({ topo: true });
    }
  });
  var sideEnt = document.getElementById("side-entrevista");
  if (sideEnt) sideEnt.addEventListener("change", function () { S.entrevista = sideEnt.checked; if (S.tela === "planos") S.tela = "painel"; render(); });

  carregar();
  if (S.diagFeito && !S.fila) preparar();
  if (BANCA) {
    document.body.classList.add("banca");
    var h1 = document.querySelector(".side h1"); if (h1) h1.textContent = "Demo da banca · 5 minutos";
    var ps = document.querySelector(".side > p"); if (ps) ps.textContent = "Clique em cada passo na ordem. O Guardião, o raio-x, a aprovação, o WhatsApp e a agenda rodam de verdade no navegador; os números do mês são simulados.";
    setInterval(atualizarCrono, 1000);
  }
  render({ topo: true });
})();
