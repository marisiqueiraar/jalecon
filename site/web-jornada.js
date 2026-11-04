/* Jalecon · demonstração guiada: o produto funcionando, de fora para dentro.
 * Oito cenas de uma história só. À direita, o celular mostra o que o paciente (ou o gestor) vê;
 * à esquerda, o que acontece na clínica. Tudo roda de verdade: Estúdio, Guardião, WhatsApp, agenda e painel.
 * É a porta de entrada da versão web e o roteiro da banca (?banca=1).
 */
(function (J) {
  "use strict";
  var G = window.Guardiao, C = window.Clinica, CT = window.Conteudo, AT = window.Atendimento;
  var V = J.VIEWS, A = J.ACOES, I = J.INPUTS, D = J.DEPOIS, esc = J.esc, fmt = J.fmt, ICON = J.ICON;
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var anim = { tok: 0 };

  var CENAS = [
    { id: "problema", curto: "O problema", tempo: "0:00", titulo: "Hoje, cada parte da captação está num fornecedor diferente", fala: "A agência faz os posts, a recepção cuida do WhatsApp e a agenda é outro sistema. Ninguém conversa com ninguém, e a Ana, que escreveu na hora do almoço, fica sem resposta." },
    { id: "estudio", curto: "Estúdio", tempo: "0:30", titulo: "A Jalecon cria o mês de cada médico", fala: "Os agentes montam a marca e os posts do Dr. Rafael, no tom dele. Nada vai ao ar ainda." },
    { id: "medico", curto: "Médico revisa", tempo: "0:50", titulo: "O médico ajusta em dois minutos, conversando", fala: "O Dr. Rafael recebe o mês no celular e pede o que quer mudar, do jeito dele. Cada pedido vira preferência: no mês seguinte, o texto já sai assim." },
    { id: "guardiao", curto: "Guardião", tempo: "1:10", titulo: "O Guardião barra o que fere o CFM", fala: "Um post promete curar a dor de vez. O Guardião bloqueia, explica a regra e sugere a troca. Só a diretora técnica aprova." },
    { id: "teste", curto: "Sua vez", tempo: "2:00", titulo: "Teste o Guardião com qualquer frase", fala: "Peça uma frase de anúncio a alguém da banca e digite. O resultado aparece enquanto você escreve." },
    { id: "google", curto: "Google", tempo: "2:40", titulo: "Ana vê o post e procura o médico no Google", fala: "Ana viu o post do Dr. Rafael sobre dor no joelho. Pesquisa o nome dele, acha o perfil com nome, CRM e RQE e toca em agendar." },
    { id: "whatsapp", curto: "WhatsApp", tempo: "3:00", titulo: "O agente responde em segundos e agenda", fala: "Ana escreve como escreveria para qualquer clínica. O agente não dá diagnóstico, informa o valor e marca na agenda do médico." },
    { id: "vespera", curto: "Véspera", tempo: "3:50", titulo: "Na véspera, a confirmação evita a falta", fala: "Cada paciente recebe o lembrete. Quem não pode ir libera o horário, e a lista de espera ocupa a vaga." },
    { id: "pulso", curto: "Do post à consulta", tempo: "4:30", titulo: "Do post à consulta, num lugar só", fala: "Como a Jalecon cuida de tudo, o gestor vê qual post, de qual médico, virou paciente e quanto rendeu. Nenhuma agência enxerga a agenda, e nenhum robô sabe qual post trouxe o paciente." }
  ];
  J.CENAS = CENAS;
  function idx(id) { for (var i = 0; i < CENAS.length; i++) if (CENAS[i].id === id) return i; return 0; }

  /* ---------- estado da demonstração ---------- */
  function dm() {
    var S = J.S;
    if (!S.diagFeito) { S.diag = C.diagExemplo(); S.diagFeito = true; J.preparar(); }
    if (!S.demo) S.demo = { visto: {}, aplicado: false, aprovado: false, chat: null, lembrete: null, vaga: null, espera: null, teste: null };
    var d = S.demo;
    if (!d.chat) d.chat = AT.novo("almoco");
    var m = J.eq()[0], e = J.est(m.id);
    if (!e.mes) J.gerar(m, e.prefs);
    return d;
  }
  function rafa() { return J.eq()[0]; }
  function pecasMes() { var e = J.est(rafa().id); return e.mes ? e.mes.pecas : []; }
  function p1() { return (J.S.fila || []).filter(function (x) { return x.id === "p1"; })[0]; }
  function bloqueadas() {
    var n = 0, f = p1(); if (f && !G.analisar(f.texto, J.opcoesPeca(f)).liberado) n++;
    pecasMes().forEach(function (p) { if (!G.analisar(p.texto, CT.opcoesGuardiao(J.dm(rafa()), "peca")).liberado) n++; });
    return n;
  }
  function ctxAt() { return { diag: J.S.diag, eq: J.eq(), agenda: J.S.agenda }; }

  /* ---------- celular ---------- */
  function phone(hora, app, corpo, cls) {
    return '<div class="phone' + (cls ? " " + cls : "") + '" aria-label="Tela do celular"><div class="tela"><div class="status"><b>' + esc(hora) + '</b><span>' + (app ? esc(app) : "") + '</span><span class="sinais" aria-hidden="true">▂▄▆ ▮</span></div>' + corpo + "</div></div>";
  }
  function wa(nome, sub, msgs, rodape, cor) {
    return '<div class="ph-wa"><div class="ph-wa-top" style="' + (cor ? "background:" + cor : "") + '"><span class="ph-av">' + esc(nome.charAt(0)) + "</span><div><b>" + esc(nome) + "</b><small>" + esc(sub) + '</small></div></div><div class="ph-chat" id="ph-chat">' + msgs + "</div>" + (rodape || "") + "</div>";
  }
  function bolha(de, txt, hora, extra) {
    return '<div class="ph-msg ' + de + (extra || "") + '"><span>' + esc(txt) + "</span><small>" + esc(hora || "") + (de === "eu" ? " ✓✓" : "") + "</small></div>";
  }
  function digitando(oculto) { return '<div class="ph-msg ele digitando' + (oculto ? " oculto" : "") + '" id="ph-digitando" aria-label="digitando"><span><i></i><i></i><i></i></span></div>'; }

  /* ---------- cenas: celular (direita) ---------- */
  function telaProblema(vis) {
    var o = vis ? "" : " oculto";
    var msgs = '<div class="ph-dia">Hoje</div>' +
      bolha("eu", "Oi! Vocês atendem dor no joelho? Queria marcar com o ortopedista.", "12:40", o + " seq") +
      '<div class="ph-dia seq' + o + '">3 horas depois</div>' +
      bolha("eu", "Oi? Alguém?", "15:52", o + " seq") +
      '<div class="ph-dia seq' + o + '">No dia seguinte</div>' +
      bolha("eu", "Já consegui com outra clínica, obrigada.", "09:15", o + " seq");
    return phone("09:15", "", wa(J.S.diag.nome, "visto por último ontem às 11:58", msgs, '<div class="ph-input"><span>Mensagem</span></div>'));
  }
  function tile(p, id, i, vis, estado) {
    var tit = p.texto.split("\n")[0];
    return '<div class="ph-tile seq' + (vis ? "" : " oculto") + (estado ? " " + estado : "") + '" style="--pc:' + id.cores[i % 2 === 0 ? 0 : 1] + ";--pt:" + (i % 2 === 0 ? id.cores[3] : "#fff") + '"><span style="font-family:\'' + esc(id.fontes.titulo) + "',Georgia,serif\">" + esc(tit.length > 48 ? tit.slice(0, 46) + "…" : tit) + "</span>" + (estado === "bloq" ? '<em>bloqueado</em>' : "") + "</div>";
  }
  function telaInstagram(vis, publicado) {
    var m = rafa(), id = J.idt(m), d = dm(), pe = CT.perfil(J.dm(m));
    var lista = [p1()].concat(pecasMes()).filter(Boolean).slice(0, 9);
    var og = CT.opcoesGuardiao(J.dm(m), "peca");
    var tiles = lista.map(function (p, i) {
      var lib = G.analisar(p.texto, p.id === "p1" ? J.opcoesPeca(p) : og).liberado;
      return tile(p, id, i, vis, publicado ? "" : (lib ? "" : "bloq"));
    }).join("");
    var handle = "dr." + m.nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "") + ".orto";
    var corpo = '<div class="ph-ig">' + (publicado ? "" : '<div class="ph-faixa">Prévia no app da Jalecon · ainda não publicado</div>') +
      '<div class="ph-ig-top"><b>' + esc(handle) + '</b></div><div class="ph-ig-head"><span class="ph-mono" style="background:' + id.cores[0] + ";color:" + id.cores[3] + ";font-family:'" + esc(id.fontes.titulo) + "',serif\">" + esc(id.iniciais) + '</span><div class="ph-ig-n"><span><b>' + (publicado ? 57 : 48) + '</b>posts</span><span><b>1.204</b>seguidores</span><span><b>312</b>seguindo</span></div></div>' +
      '<div class="ph-ig-bio"><b>' + esc(C.titulo(m)) + "</b><br>" + esc(G.assinatura(pe)) + "<br>Joelho, ombro e coluna · " + esc(J.S.diag.nome) + '<br><a>Agende pelo WhatsApp da clínica</a></div>' +
      '<div class="ph-ig-bts"><span>Seguir</span><span>Mensagem</span><span>Agendar</span></div><div class="ph-grid">' + tiles + "</div></div>";
    return phone("10:02", "", corpo);
  }
  function telaGuardiao() {
    var d = dm(), f = p1(), m = rafa(), id = J.idt(m), res = G.analisar(f.texto, J.opcoesPeca(f));
    if (d.aprovado) return telaInstagram(true, true);
    var arte = '<div class="ph-post-arte" style="background:' + id.cores[0] + ";color:" + id.cores[3] + '"><span style="font-family:\'' + esc(id.fontes.titulo) + "',serif\">" + esc(f.texto.split(/[.!\n]/)[0]) + "</span></div>";
    var corpo = '<div class="ph-ig"><div class="ph-faixa">Prévia no app da Jalecon · aguardando a diretora técnica</div><div class="ph-post"><div class="ph-post-h"><span class="ph-mono pq" style="background:' + id.cores[0] + ";color:" + id.cores[3] + '">' + esc(id.iniciais) + "</span><b>" + esc(C.titulo(m)) + "</b></div>" +
      '<div class="ph-post-img' + (res.liberado ? "" : " barrado") + '">' + arte + (res.liberado ? "" : '<div class="ph-barra"><b>Bloqueado pelo Guardião</b><span>' + res.contagem.bloqueia + " regra" + (res.contagem.bloqueia > 1 ? "s" : "") + " do CFM</span></div>") + "</div>" +
      '<div class="ph-legenda">' + G.destacar(res).replace(/\n/g, "<br>") + "</div></div></div>";
    return phone("10:05", "", corpo);
  }
  function telaTeste() {
    var d = dm(), txt = d.teste == null ? "Sou a melhor dermatologista de São Paulo, resultado garantido e sem dor." : d.teste;
    var res = G.analisar(txt, { identificacao: true });
    var corpo = '<div class="ph-ig"><div class="ph-faixa">Nova publicação · checagem ao vivo</div><div class="ph-post"><div class="ph-legenda grande" id="ph-teste">' + (G.destacar(res).replace(/\n/g, "<br>") || '<span style="opacity:.5">Digite a frase…</span>') + '</div><div class="ph-veredito ' + (res.liberado ? "ok" : "bloq") + '" id="ph-veredito">' + veredito(res) + "</div></div></div>";
    return phone("10:07", "", corpo);
  }
  function veredito(res) { return res.liberado ? "Liberado: pode ir para a diretora técnica" : "Bloqueado: " + res.hits.filter(function (h) { return h.gravidade === "bloqueia"; }).map(function (h) { return h.regra.rotulo; }).join(", "); }
  function telaGoogle(vis) {
    var m = rafa(), d = J.dm(m), cp = CT.campanha(d, "clinica"), q = "dr rafael lima ortopedista";
    var corpo = '<div class="ph-g"><div class="ph-g-busca"><span id="ph-q" data-q="' + esc(q) + '">' + (vis ? esc(q) : "") + '</span><i class="cursor"></i></div><div class="ph-g-res seq' + (vis ? "" : " oculto") + '">' +
      '<div class="ph-ad"><small>Patrocinado</small><b>' + esc(cp.titulo) + "</b><span>" + esc(cp.descricao) + "</span></div>" +
      '<div class="ph-gmb"><b>' + esc(C.titulo(m)) + " · Ortopedista</b><span class=\"ph-est\">4,8 ★★★★★ (12)</span><span>Ortopedista em " + esc(J.S.diag.cidade) + " · " + esc(J.S.diag.nome) + '</span><span class="ph-aberto">Aberto · fecha às 19h</span>' +
      '<div class="ph-gbts"><button type="button" class="ph-gbt prim" data-act="demo-ir" data-n="' + idx("whatsapp") + '">Agendar pelo WhatsApp</button><span class="ph-gbt">Ligar</span><span class="ph-gbt">Rotas</span><span class="ph-gbt">Site</span></div>' +
      '<small class="ph-crm">' + esc(G.assinatura(CT.perfil(d))) + "</small></div></div></div>";
    return phone("12:38", "", corpo);
  }
  function telaWhatsapp() {
    var d = dm(), ch = d.chat, pend = J.T.demoPend || 0;
    var msgs = '<div class="ph-dia">Hoje</div>' + ch.msgs.map(function (x, i) {
      var oculto = x.de === "a" && i >= ch.msgs.length - pend ? " oculto seq" : "";
      return bolha(x.de === "p" ? "eu" : "ele", x.txt, "12:4" + Math.min(9, i), oculto) + (x.guarda ? '<div class="ph-guard' + (oculto ? " oculto seq" : "") + '">' + ICON.shield + "<span>" + esc(x.guarda) + "</span></div>" : "");
    }).join("") + digitando(!pend);
    var chips = "";
    if (!ch.agendado || ch.estado !== "agendado") {
      if (ch.estado === "slots" && ch.slots.length) chips = ch.slots.map(function (s, i) { return '<button type="button" class="ph-chip" data-act="demo-slot" data-i="' + i + '">' + esc(AT.fmtSlot(s)) + "</button>"; }).join("") + '<button type="button" class="ph-chip" data-act="demo-diz" data-txt="Será que é menisco? Quanto custa?">Será que é menisco? Quanto custa?</button>';
      else if (ch.estado === "nome") chips = '<button type="button" class="ph-chip" data-act="demo-diz" data-txt="Ana Souza">Ana Souza</button>';
      else if (!ch.msgs.length) chips = '<button type="button" class="ph-chip" data-act="demo-diz" data-txt="Oi! Vi o Dr. Rafael Lima no Google. Vocês atendem dor no joelho?">Oi! Vi o Dr. Rafael Lima no Google. Vocês atendem dor no joelho?</button>';
      else chips = ['É para dor no joelho', 'Quero marcar uma consulta'].map(function (t) { return '<button type="button" class="ph-chip" data-act="demo-diz" data-txt="' + esc(t) + '">' + esc(t) + "</button>"; }).join("");
    } else chips = '<span class="ph-ok">Consulta marcada. Siga para a véspera →</span>';
    var rod = '<div class="ph-chips">' + chips + '</div><form class="ph-input" data-sub="demo-wa"><label class="sr" for="f-demo-wa">Mensagem da paciente</label><input id="f-demo-wa" name="msg" placeholder="Escreva como paciente…" autocomplete="off"' + (ch.estado === "agendado" ? " disabled" : "") + '><button type="submit" aria-label="Enviar">➤</button></form>';
    return phone("12:41", "", wa(J.S.diag.nome, pend ? "digitando…" : "online · atendimento automático", msgs, rod));
  }
  function telaVespera() {
    var d = dm(), ag = agendamentoAna(), m = J.medico(ag.medico), msgs, rod = "", nome = "Ana Souza", sub = "online";
    if (d.espera === "oferecido" || d.espera === "aceitou") {
      var v = d.vaga, mv = J.medico(v.medico);
      nome = J.S.diag.nome; sub = "para Marcos D., da lista de espera";
      msgs = '<div class="ph-dia">Segunda, 18:02</div>' + bolha("ele", "Oi, Marcos! Abriu um horário amanhã, terça, às " + v.hora + ", com " + C.titulo(mv) + ". Quer ficar com ele? Responda 1 para sim ou 2 para não.", "18:02") +
        (d.espera === "aceitou" ? bolha("eu", "1", "18:03") + bolha("ele", "Pronto, Marcos! Consulta confirmada amanhã às " + v.hora + ". Até lá.", "18:03") : "");
      if (d.espera === "oferecido") rod = '<div class="ph-chips"><button type="button" class="ph-chip" data-act="demo-espera-sim">1 · Quero o horário</button></div>';
      return phone("18:03", "", wa(nome, sub, msgs, rod, "#3D5A80"));
    }
    msgs = '<div class="ph-dia">Segunda, 18:00</div>' + bolha("ele", "Oi, Ana! Lembrete: sua consulta com " + C.titulo(m) + " é amanhã, terça, às " + ag.hora + ", na " + J.S.diag.nome + ". Responda 1 para confirmar ou 2 se não puder ir.", "18:00");
    if (d.lembrete === "confirmou") msgs += bolha("eu", "1", "18:04") + bolha("ele", "Confirmado! Até amanhã, Ana.", "18:04");
    if (d.lembrete === "cancelou") msgs += bolha("eu", "2", "18:04") + bolha("ele", "Sem problema, Ana. Liberei o seu horário. Quando quiser remarcar, é só chamar aqui.", "18:04");
    if (!d.lembrete) rod = '<div class="ph-chips"><button type="button" class="ph-chip" data-act="demo-lembrete" data-r="confirmou">1 · Confirmo</button><button type="button" class="ph-chip" data-act="demo-lembrete" data-r="cancelou">2 · Não vou conseguir</button></div>';
    return phone("18:04", "", '<div class="ph-notif' + (d.lembrete ? " lida" : "") + '"><b>' + esc(J.S.diag.nome) + '</b><span>Lembrete: sua consulta é amanhã às ' + esc(ag.hora) + "</span></div>" + wa(J.S.diag.nome, "online", msgs, rod));
  }
  function telaPulso() {
    var P = C.painel(J.S.diag, J.eq(), J.S.prem), s4 = P.semanas[3], top = P.canais.slice().sort(function (a, b) { return b.agendados - a.agendados; }).slice(0, 3);
    var faltaPct = Math.round(P.r.jalecon.faltaPct * 100);
    var txt = "Resumo da semana da " + J.S.diag.nome + ":\n" + s4.contatos + " contatos novos, " + s4.consultas + " consultas.\nCanais que mais agendaram: " + top.map(function (c) { return c.nome + " (" + c.agendados + " no mês)"; }).join(", ") + ".\nFaltas: " + faltaPct + "% (eram " + J.S.diag.faltas + "%).\n" + aprovadasN() + " peças aprovadas pela diretora técnica, todas checadas pelo Guardião." + (J.S.demo && J.S.demo.chat && J.S.demo.chat.agendado ? "\nDestaque: a consulta da Ana veio do post do dia 12 do Dr. Rafael, passou pelo Google e foi marcada no WhatsApp em segundos." : "");
    var msgs = '<div class="ph-dia">Sexta, 18:00</div>' + '<div class="ph-msg ele"><span style="white-space:pre-line">' + esc(txt) + '</span><small>18:00</small></div>' + bolha("eu", "Ótimo! Quais posts mais trouxeram paciente?", "18:06") + bolha("ele", "Está no painel da Jalecon, na aba Pulso: consultas por post, por canal e por médico.", "18:06");
    return phone("18:06", "", wa("Jalecon · resumo da clínica", "para o gestor da " + J.S.diag.nome, msgs, "", "#2A3058"));
  }
  function aprovadasN() { return (J.S.registro || []).filter(function (x) { return x.tipo === "ok"; }).reduce(function (s, x) { return s + (x.n || 1); }, 0); }

  /* ---------- cenas: clínica (esquerda) ---------- */
  function painelProblema() {
    var d = J.S.diag, r = C.raioX(d, J.S.prem);
    return '<div class="card"><span class="eyebrow">Raio-x da ' + esc(d.nome) + " · anamnese com o gestor</span>" +
      '<p class="big-n"><b>' + fmt(r.perdidos) + "</b> contatos por mês se perdem antes da consulta</p>" +
      '<div class="mini-k"><span><b>' + fmt(r.contatos) + "</b>contatos novos por mês</span><span><b>" + esc(C.rotulo(C.RESPOSTA, d.resposta)) + "</b>para a primeira resposta</span><span><b>" + d.faltas + "%</b>de faltas</span></div>" +
      '<p class="small">Na nossa pesquisa com pacientes, 70% já desistiram de um médico porque demoraram a responder.</p>' +
      '<button class="link" type="button" data-go="raiox">Ver o raio-x completo</button></div>' + fornecedores();
  }
  function fornecedores() {
    var d = J.S.diag;
    var l = [["Agência", C.brl(+d.gastoAgencia || 0) + "/mês", "Faz os posts. Não vê o WhatsApp nem a agenda."], ["Anúncios", C.brl(+d.gastoAnuncios || 0) + "/mês", "Trazem cliques. Ninguém sabe quais viram consulta."], ["Atendimento", C.brl(+d.gastoOutros || 0) + "/mês", "Responde quando dá. Não sabe o que o post prometeu."], ["Agenda", "outro sistema", "Marca a consulta. Não sabe de onde veio o paciente."]];
    return '<div class="card"><span class="eyebrow">Hoje: quatro fornecedores que não conversam</span><div class="forn">' + l.map(function (x) { return '<div><b>' + esc(x[0]) + '</b><span class="num">' + esc(x[1]) + '</span><small>' + esc(x[2]) + "</small></div>"; }).join("") + '</div><p class="small">Com a Jalecon, os quatro viram um só, e a clínica passa a saber qual post virou consulta.</p></div>';
  }
  function painelEstudio(vis) {
    var m = rafa(), id = J.idt(m), o = vis ? "" : " oculto";
    var ags = [["Estrategista", "escolheu os temas pela especialidade: joelho, coluna, ombro"], ["Redator", "escreveu 8 posts no tom próximo e leve do Dr. Rafael"], ["Designer", "aplicou a identidade " + id.familia + ": paleta e tipografia próprias"], ["Clareza", "e Ciência, os revisores, leram tudo antes do médico"], ["Guardião", "checou as " + G.regras.length + " regras e marcou o que não pode ir ao ar"]];
    return '<div class="card"><div class="row">' + '<span class="mono" style="background:' + id.cores[0] + ";color:" + id.cores[3] + ";font-family:'" + esc(id.fontes.titulo) + "',serif\">" + esc(id.iniciais) + "</span><div><b>" + esc(C.titulo(m)) + '</b><br><span class="small">Ortopedia · identidade ' + esc(id.familia) + '</span></div><div class="swatches" style="margin-left:auto;width:140px">' + id.cores.map(function (c) { return '<div style="background:' + c + '"></div>'; }).join("") + "</div></div>" +
      '<ol class="agentes">' + ags.map(function (a) { return '<li class="seq' + o + '"><span class="ag ag-' + a[0] + '">' + a[0].charAt(0) + "</span><span><b>" + a[0] + "</b> " + esc(a[1]) + "</span></li>"; }).join("") + "</ol>" +
      '<p class="small">Cada médico da clínica recebe a própria marca. <button class="link" type="button" data-go="medicos">Ver as 6 identidades</button> · <button class="link" type="button" data-go="editor/' + m.id + '">Abrir o editor de artes</button></p></div>';
  }
  function painelGuardiao() {
    var d = dm(), f = p1(), res = G.analisar(f.texto, J.opcoesPeca(f)), nb = bloqueadas(), total = pecasMes().length + 1;
    if (d.aprovado) return '<div class="card live"><p class="ok-line">' + ICON.ok + "<b>Mês aprovado e publicado.</b></p><p>" + esc(J.diretor()) + " aprovou " + total + " peças. Cada decisão ficou registrada com data, hora e as regras checadas: é a proteção dela no CRM.</p>" +
      '<ol class="timeline">' + (J.S.registro || []).slice(-3).reverse().map(function (x) { return '<li class="' + (x.tipo || "") + '"><span><b>' + esc(x.quando) + "</b> " + esc(x.txt) + "</span></li>"; }).join("") + '</ol><button class="link" type="button" data-go="registro">Ver a trilha de auditoria</button></div>';
    return '<div class="card"><div class="row between"><b>Post do dia 12 · ' + esc(C.titulo(rafa())) + "</b>" + J.resumoG(res) + '</div><div class="texto">' + G.destacar(res) + "</div>" +
      (res.hits.length ? '<div class="hits compact">' + res.hits.slice(0, 3).map(function (h) { var c = G.citacao(h.regra); return '<div class="hit ' + h.gravidade + '"><b style="font-size:13px">' + esc(J.cap(h.regra.rotulo)) + '</b><span class="small">' + esc(h.regra.explicacao) + " · " + esc(c.texto) + "</span></div>"; }).join("") + "</div>" : "") +
      '<div class="row wrap">' + (nb ? '<button class="btn" type="button" data-act="demo-aplicar">Aplicar as sugestões do Guardião' + (nb > 1 ? " (" + nb + " peças)" : "") + "</button>" : "") +
      '<button class="btn ok" type="button" data-act="demo-aprovar"' + (nb ? " disabled" : "") + ">Aprovar o mês como diretora técnica</button></div>" +
      '<p class="small">' + (nb ? "Enquanto houver bloqueio, a aprovação fica travada." : "Tudo liberado. " + esc(J.diretor()) + " pode aprovar.") + "</p></div>";
  }
  function painelTeste() {
    var d = dm(), txt = d.teste == null ? "Sou a melhor dermatologista de São Paulo, resultado garantido e sem dor." : d.teste;
    var res = G.analisar(txt, { identificacao: true });
    var ex = ["Sou a melhor dermatologista de São Paulo, resultado garantido e sem dor.", "Veja o antes e depois da nossa paciente!", "Consulta com 30% de desconto só esta semana.", "Dra. Ana Souza · MÉDICA · CRM-SP 123456 · Dermatologia · RQE 7890. Agende pelo link da bio."];
    return '<div class="card"><label class="lbl" for="f-demo-teste">Frase da banca</label><textarea class="ta" id="f-demo-teste" data-in="demo-teste" style="min-height:96px">' + esc(txt) + "</textarea>" +
      '<div class="chips">' + ex.map(function (t, i) { return '<button type="button" class="chip-btn" data-act="demo-teste-ex" data-i="' + i + '">Exemplo ' + (i + 1) + "</button>"; }).join("") + '<button type="button" class="chip-btn" data-act="demo-teste-limpar">Limpar</button></div>' +
      '<div id="demo-teste-hits">' + hitsCurtos(res) + "</div></div>";
  }
  function hitsCurtos(res) {
    if (!res.hits.length) return '<p class="ok-line">' + ICON.ok + "<b>Nenhuma regra violada.</b></p>";
    return '<div class="hits compact">' + res.hits.map(function (h) { return '<div class="hit ' + h.gravidade + '"><div class="row between"><b style="font-size:13px">' + esc(J.cap(h.regra.rotulo)) + '</b><span class="pill ' + (h.gravidade === "bloqueia" ? "block" : h.gravidade === "alerta" ? "warn" : "info") + '">' + h.gravidade + '</span></div><span class="small">' + esc(h.regra.sugestao || h.regra.explicacao) + "</span></div>"; }).join("") + "</div>";
  }
  function painelGoogle() {
    return '<div class="card"><span class="eyebrow">O que a clínica fez para isso acontecer</span><ul class="list">' +
      ["Perfil no Google de cada médico, com endereço, horário e botão de agendar ligado ao WhatsApp da clínica", "Site do médico gerado no Estúdio, com nome, CRM e RQE no rodapé", "Anúncio de pesquisa segmentado por palavra e região, nunca por condição de saúde"].map(function (t) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + esc(t) + "</li>"; }).join("") +
      '</ul><p class="small">Na pesquisa, 41% dos pacientes checaram o médico no Instagram e muitos olharam as avaliações no Google antes de marcar.</p><button class="btn" type="button" data-act="demo-ir" data-n="' + idx("whatsapp") + '">Tocar em “Agendar pelo WhatsApp” →</button></div>';
  }
  function agendamentoAna() {
    var S = J.S, d = dm(), ch = d.chat;
    var c = S.agenda.filter(function (x) { return x.demo === "ana"; })[0];
    if (c) return c;
    var m = rafa(), l = C.livres(S.agenda, m.id, 1)[0] || { dia: "ter", hora: "09:30" };
    c = { id: "demo-ana", demo: "ana", medico: m.id, dia: ch.agendado ? ch.agendado.dia : l.dia, hora: ch.agendado ? ch.agendado.hora : l.hora, paciente: "Ana Souza", status: "whatsapp", canal: "WhatsApp" };
    S.agenda.push(c);
    return c;
  }
  function faixaAgenda(medicoId, dia, destaque) {
    var horas = ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00", "17:00"], ag = J.S.agenda;
    return '<div class="faixa">' + horas.map(function (h) {
      var c = ag.filter(function (x) { return x.medico === medicoId && x.dia === dia && x.hora === h; }).slice(-1)[0];
      var on = destaque && c && destaque(c);
      return '<span class="slot ' + (c ? c.status : "") + (on ? " pulsa" : "") + '"><b>' + h + "</b>" + (c ? esc(c.paciente) : "livre") + "</span>";
    }).join("") + "</div>";
  }
  function painelWhatsapp() {
    var d = dm(), ch = d.chat, m = rafa();
    var res = AT.resumo(ch, ctxAt());
    return '<div class="card"><div class="row between wrap"><b>Agenda de ' + esc(C.titulo(m)) + ' · terça</b><span class="pill ok">respondeu em ~4 s</span></div>' + faixaAgenda(m.id, "ter", function (c) { return c.demo === "ana" || c.status === "whatsapp"; }) +
      '<h3 class="t" style="margin-top:6px">Resumo para a recepção</h3><table class="tb"><tbody>' + res.filter(function (x) { return x[0] !== "Canal"; }).map(function (x) { return '<tr><th style="width:42%">' + esc(x[0]) + "</th><td>" + esc(x[1]) + "</td></tr>"; }).join("") + "</tbody></table>" +
      '<p class="small">Escreva no celular o que quiser: preço, convênio, “qual remédio posso tomar?”, “quero falar com uma pessoa”, “dor no peito”.</p></div>';
  }
  function painelVespera() {
    var d = dm(), ag = agendamentoAna();
    var conf = J.S.agenda.filter(function (c) { return c.dia === "ter" && (c.status === "confirmada" || c.status === "encaixe"); }).length;
    var total = J.S.agenda.filter(function (c) { return c.dia === "ter"; }).length;
    var html = '<div class="card"><div class="row between wrap"><b>Confirmações de terça</b><span class="pill ' + (d.lembrete ? "ok" : "warn") + '">' + (d.lembrete ? conf + " de " + total + " confirmadas" : "lembretes enviados às 18h") + "</span></div>";
    if (!d.lembrete) html += '<p class="muted">Responda no celular como a Ana: confirmar ou desmarcar.</p>';
    if (d.vaga) {
      var mv = J.medico(d.vaga.medico);
      html += '<div class="vaga ' + (d.espera === "aceitou" ? "ok" : "") + '"><b>' + (d.espera === "aceitou" ? "Horário ocupado pela lista de espera" : "Horário vago: " + esc(d.vaga.dono) + " não vai") + "</b><span>Terça, " + esc(d.vaga.hora) + " · " + esc(C.titulo(mv)) + "</span></div>" + faixaAgenda(d.vaga.medico, "ter", function (c) { return c.hora === d.vaga.hora; });
      if (!d.espera) html += '<div class="row between wrap"><span>Lista de espera: <b>Marcos D.</b> · qualquer horário amanhã</span><button class="btn sm" type="button" data-act="demo-oferecer">Oferecer o horário</button></div>';
      if (d.espera === "oferecido") html += '<p class="small">Oferta enviada ao Marcos pelo WhatsApp. Responda no celular.</p>';
      if (d.espera === "aceitou") html += '<p class="ok-line">' + ICON.ok + "<b>Falta evitada.</b></p>";
    }
    return html + '<p class="small">Na pesquisa, todos os pacientes que faltaram (8 de 8) disseram que esqueceram ou que era difícil desmarcar.</p></div>';
  }
  function jornadaAna() {
    var S = J.S, d = S.demo || {}, f = p1(), ag = S.agenda.filter(function (c) { return c.demo === "ana"; })[0], ch = d.chat || {};
    var titulo = f ? f.texto.split(/[.!\n]/)[0] : "Dor no joelho";
    var marcou = !!(ag || ch.agendado), slot = ag || ch.agendado;
    var ticket = +S.diag.ticket || 450;
    var passos = [
      [d.aprovado, "12/11 · Post publicado", "“" + titulo + "”, do Dr. Rafael, aprovado pela diretora técnica com registro"],
      [d.aprovado, "Ana vê o post", "No Instagram do Dr. Rafael. Ela conta ao agente como conheceu o médico, e a resposta fica ligada ao post."],
      [marcou, "Pesquisa no Google", "Acha o perfil do Dr. Rafael e toca em Agendar pelo WhatsApp"],
      [marcou, "WhatsApp, 12:41", "Resposta em cerca de 4 segundos. Consulta marcada" + (slot ? " para " + AT.fmtSlot(slot) : "")],
      [!!d.lembrete, "Véspera", d.lembrete === "cancelou" ? "Ana desmarcou e o horário foi para a lista de espera" : "Ana confirmou pelo lembrete"],
      [marcou && d.lembrete !== "cancelou", "Consulta", C.brl(ticket) + " atribuídos ao post do dia 12 e ao Dr. Rafael"]
    ];
    return '<div class="card live"><span class="eyebrow">A jornada da Ana, no painel</span><ol class="jornada">' + passos.map(function (p) { return '<li class="' + (p[0] ? "ok" : "pend") + '"><b>' + esc(p[1]) + "</b><span>" + esc(p[2]) + "</span></li>"; }).join("") + "</ol>" +
      '<p class="small">' + (marcou ? "Uma agência não vê a agenda, e um robô de WhatsApp não sabe qual post trouxe a paciente. Juntos na Jalecon, viram uma linha só." : "Faça as cenas anteriores (Guardião e WhatsApp) para a jornada se completar.") + "</p></div>";
  }
  function postsQueRendem() {
    var m = rafa(), id = J.idt(m), f = p1(), ticket = +J.S.diag.ticket || 450;
    var lista = [f].concat(pecasMes()).filter(Boolean).slice(0, 6).map(function (p, i) {
      var n = [9, 6, 4, 3, 2, 1][i] + (i === 0 && J.S.demo && J.S.demo.chat && J.S.demo.chat.agendado ? 1 : 0);
      return { tit: p.texto.split(/[.!\n]/)[0], n: n };
    }).sort(function (a, b) { return b.n - a.n; });
    var max = lista[0] ? lista[0].n : 1;
    return '<div class="card"><span class="eyebrow">Posts do Dr. Rafael que mais viraram consulta · mês 3 do piloto (simulado)</span><div class="stack">' + lista.map(function (x) { return '<div><div class="row between small"><span>' + esc(x.tit.length > 58 ? x.tit.slice(0, 56) + "…" : x.tit) + '</span><b class="num">' + x.n + " · " + C.brl(x.n * ticket) + '</b></div><div class="bar ap"><span style="width:' + (x.n / max * 100) + '%"></span></div></div>'; }).join("") + "</div>" +
      '<p class="small">O Estrategista usa isso no mês seguinte: mais temas que viram consulta, menos temas que só dão curtida.</p>' +
      '<div class="row wrap"><button class="btn" type="button" data-go="proposta">Ver a proposta para a clínica →</button><button class="btn ghost" type="button" data-go="pulso">Abrir o painel completo</button></div></div>';
  }
  function painelPulso() { return jornadaAna() + postsQueRendem(); }

  /* ---------- cena do médico ---------- */
  function pecaMed() { return pecasMes()[0]; }
  function ctxRev(p) { var m = rafa(), e = J.est(m.id); return { perfil: CT.perfil(J.dm(m)), tom: e.tom, glossario: e.mes.glossario, seed: p.chat.length, opcoesGuardiao: CT.opcoesGuardiao(J.dm(m), "peca") }; }
  function telaMedico() {
    var p = pecaMed(), m = rafa(), id = J.idt(m), pend = J.T.demoPend || 0;
    var tit = p.texto.split("\n")[0];
    var cartao = '<div class="ph-msg ele"><span>Dr. Rafael, o seu mês de novembro está pronto: 8 posts, já revisados pela IA e checados pelo Guardião. Este é o do dia ' + p.dia + ':</span><div class="ph-mini" style="background:' + id.cores[0] + ";color:" + id.cores[3] + ";font-family:'" + esc(id.fontes.titulo) + "',serif\">" + esc(tit) + '</div><span style="white-space:pre-line;font-size:12px">' + esc(p.texto.split("\n\n").slice(1, 3).join("\n\n")) + "</span><small>08:10</small></div>";
    var msgs = '<div class="ph-dia">Hoje</div>' + cartao + p.chat.map(function (x, i) {
      var oculto = x.de !== "eu" && i >= p.chat.length - pend ? " oculto seq" : "";
      return bolha(x.de === "eu" ? "eu" : "ele", x.txt, "08:1" + Math.min(9, i + 1), oculto);
    }).join("") + digitando(!pend);
    var chips = ["mais curto", "mais acolhedor", "mais técnico", "adicione chamada para agendar"].map(function (t) { return '<button type="button" class="ph-chip" data-act="demo-med" data-txt="' + esc(t) + '">' + esc(t) + "</button>"; }).join("");
    var rod = '<div class="ph-chips">' + chips + '</div><form class="ph-input" data-sub="demo-med"><label class="sr" for="f-demo-med">Pedido do médico</label><input id="f-demo-med" name="msg" placeholder="Peça do seu jeito…" autocomplete="off"><button type="submit" aria-label="Enviar">➤</button></form>';
    return phone("08:12", "", wa("Jalecon · seu conteúdo", pend ? "digitando…" : "Redator da Jalecon", msgs, rod, "#24423A"));
  }
  function painelMedico() {
    var p = pecaMed(), m = rafa(), e = J.est(m.id), res = G.analisar(p.texto, CT.opcoesGuardiao(J.dm(m), "peca"));
    var mudou = p.texto !== p.original;
    return '<div class="card"><div class="row between wrap"><b>Post do dia ' + p.dia + " · " + esc(p.formato) + "</b>" + J.resumoG(res) + "</div>" +
      (mudou ? '<div class="g2"><div><span class="small">Antes</span><div class="texto antes">' + esc(p.original) + '</div></div><div><span class="small">Depois</span><div class="texto">' + esc(p.texto) + "</div></div></div>" : '<div class="texto">' + esc(p.texto) + "</div>") +
      '<h3 class="t">O que a IA aprendeu com o Dr. Rafael</h3>' + (e.prefs.length ? '<div class="prefs">' + e.prefs.map(function (x) { return "<span>" + esc(x.rot) + "</span>"; }).join("") + "</div>" : '<p class="small">Nada ainda. Peça um ajuste no celular.</p>') +
      '<p class="small">O médico não escreve, não posta e não fala com agência: lê, pede ajustes em português e aprova. Toda peça sai com o nome, o CRM e o RQE dele.</p></div>';
  }
  function pedirMed(txt) {
    var p = pecaMed(), m = rafa(), e = J.est(m.id), antes = p.chat.length;
    p.chat.push({ de: "eu", txt: txt });
    var it = window.Revisao.entender(txt), r = window.Revisao.executar(it, p.texto, ctxRev(p));
    if (r.erro) p.chat.push({ de: "ia", txt: r.erro });
    else {
      if (r.mudou) { p.hist.push(p.texto); p.texto = r.texto; p.timeline.push({ ag: "Médico", txt: "pediu: “" + txt + "”" }); }
      p.chat.push({ de: "ia", txt: r.msg + (r.pref ? " Vou lembrar disso nos próximos meses." : "") });
      if (r.pref && !e.prefs.some(function (x) { return x.rot === r.pref.rot; })) e.prefs.push(r.pref);
    }
    J.T.demoPend = p.chat.length - antes - 1;
    J.render();
  }
  A["demo-med"] = function (b) { pedirMed(b.dataset.txt); };
  A["submit:demo-med"] = function (f) { var v = f.msg.value.trim(); if (v) pedirMed(v); };

  /* ---------- tela da cena ---------- */
  V.demo = function (arg) {
    var d = dm(), n = Math.max(0, Math.min(CENAS.length - 1, parseInt(arg, 10) || 0)), c = CENAS[n], vis = !!d.visto[c.id];
    var ESQ = { problema: painelProblema, estudio: function () { return painelEstudio(vis); }, medico: painelMedico, guardiao: painelGuardiao, teste: painelTeste, google: painelGoogle, whatsapp: painelWhatsapp, vespera: painelVespera, pulso: painelPulso };
    var DIR = { problema: function () { return telaProblema(vis); }, estudio: function () { return telaInstagram(vis, false); }, medico: telaMedico, guardiao: telaGuardiao, teste: telaTeste, google: function () { return telaGoogle(vis); }, whatsapp: telaWhatsapp, vespera: telaVespera, pulso: telaPulso };
    var LEG = { problema: "No celular da Ana, a paciente", estudio: "No Instagram do Dr. Rafael", medico: "No celular do Dr. Rafael", guardiao: "No Instagram do Dr. Rafael", teste: "No Instagram do Dr. Rafael", google: "No celular da Ana, a paciente", whatsapp: "No celular da Ana, a paciente", vespera: (d.espera === "oferecido" || d.espera === "aceitou") ? "No celular do Marcos, da lista de espera" : "No celular da Ana, a paciente", pulso: "No celular do gestor" };
    var esq = ESQ[c.id](), dir = DIR[c.id]();
    var prox = n < CENAS.length - 1 ? '<button class="btn" type="button" data-act="demo-ir" data-n="' + (n + 1) + '">' + esc(CENAS[n + 1].curto) + " →</button>" : '<button class="btn" type="button" data-go="proposta">Ver a proposta para a clínica →</button>';
    return '<div class="demo"><div class="demo-esq"><span class="eyebrow">Cena ' + (n + 1) + " de " + CENAS.length + " · " + esc(c.curto) + "</span><h1 tabindex=\"-1\">" + esc(c.titulo) + '</h1><p class="lead">' + esc(c.fala) + "</p>" + esq +
      '<div class="row wrap demo-nav">' + (n ? '<button class="btn ghost" type="button" data-act="demo-ir" data-n="' + (n - 1) + '">← Voltar</button>' : "") + prox + "</div></div>" +
      '<div class="demo-dir"><span class="ph-legenda-ext">' + LEG[c.id] + "</span>" + dir + "</div></div>";
  };

  /* ---------- animações (só na primeira vez em cada cena) ---------- */
  function revelar(seletor, intervalo, fim) {
    var t = ++anim.tok, els = Array.prototype.slice.call(document.querySelectorAll(seletor));
    if (RM) { els.forEach(function (e) { e.classList.remove("oculto"); }); if (fim) fim(); return; }
    var i = 0;
    (function prox() {
      if (t !== anim.tok) return;
      if (i >= els.length) { if (fim) fim(); return; }
      els[i++].classList.remove("oculto");
      var c = document.getElementById("ph-chat"); if (c) c.scrollTop = c.scrollHeight;
      setTimeout(prox, intervalo);
    })();
  }
  function digitarBusca(fim) {
    var el = document.getElementById("ph-q"); if (!el) return;
    var q = el.dataset.q, t = ++anim.tok, i = 0;
    if (RM) { el.textContent = q; fim(); return; }
    (function prox() { if (t !== anim.tok) return; el.textContent = q.slice(0, ++i); if (i < q.length) setTimeout(prox, 55); else setTimeout(fim, 350); })();
  }
  D.demo = function (arg) {
    var d = J.S.demo, n = parseInt(arg, 10) || 0, c = CENAS[n] || CENAS[0];
    document.body.classList.add("modo-demo");
    var chat = document.getElementById("ph-chat"); if (chat) chat.scrollTop = chat.scrollHeight;
    if (!d) return;
    var marca = function () { d.visto[c.id] = true; J.salvar(); };
    if (c.id === "problema" && !d.visto.problema) revelar(".phone .seq.oculto", 1100, marca);
    else if (c.id === "estudio" && !d.visto.estudio) { revelar(".agentes .seq.oculto", 450, function () { revelar(".ph-tile.oculto", 140, marca); }); }
    else if (c.id === "google" && !d.visto.google) digitarBusca(function () { revelar(".ph-g-res.oculto", 0, marca); });
    else if ((c.id === "whatsapp" || c.id === "medico") && J.T.demoPend) {
      var tk = ++anim.tok, dig = document.getElementById("ph-digitando"), ocultos = Array.prototype.slice.call(document.querySelectorAll("#ph-chat .seq.oculto"));
      var passo = function () {
        if (tk !== anim.tok) return;
        if (!ocultos.length) { J.T.demoPend = 0; if (dig) dig.classList.add("oculto"); var s = document.querySelector(".ph-wa-top small"); if (s) s.textContent = c.id === "medico" ? "Redator da Jalecon" : "online · atendimento automático"; return; }
        if (dig) dig.classList.remove("oculto");
        if (chat) chat.scrollTop = chat.scrollHeight;
        setTimeout(function () {
          if (tk !== anim.tok) return;
          var el = ocultos.shift(); el.classList.remove("oculto");
          if (ocultos[0] && ocultos[0].classList.contains("ph-guard")) ocultos.shift().classList.remove("oculto");
          if (chat) chat.scrollTop = chat.scrollHeight;
          passo();
        }, RM ? 0 : 900);
      };
      passo();
    } else anim.tok++;
  };

  /* ---------- ações ---------- */
  A["demo-ir"] = function (b) { J.T.demoPend = 0; J.ir("demo/" + b.dataset.n); };
  A["demo-aplicar"] = function () {
    var f = p1(), o = J.opcoesPeca(f), a = G.aplicarSugestoes(f.texto, o), t = a.texto, m = rafa();
    if (G.analisar(t, o).hits.some(function (h) { return h.regra.id === "CFM2336-ID-01"; })) t += "\n\n" + G.assinatura(C.perfil(m));
    f.texto = t;
    var og = CT.opcoesGuardiao(J.dm(m), "peca"), n = 1;
    pecasMes().forEach(function (p) {
      var r = G.analisar(p.texto, og); if (r.liberado) return;
      p.hist.push(p.texto); p.texto = G.aplicarSugestoes(p.texto, og).texto; n++;
      if (!G.analisar(p.texto, og).liberado) { p.texto = p.texto.split("\n\n").filter(function (par) { return G.analisar(par, { identificacao: false }).liberado || /\bcrm\b/i.test(par); }).join("\n\n"); }
      p.status = CT.statusDe(G.analisar(p.texto, og));
    });
    J.render(); J.toast("O Guardião corrigiu " + n + " peça" + (n > 1 ? "s" : "") + ". Agora a diretora técnica pode aprovar.");
  };
  A["demo-aprovar"] = function () {
    var S = J.S, d = dm(), m = rafa(), f = p1();
    if (bloqueadas()) return;
    S.papel = "diretor";
    f.status = "aprovado";
    var total = pecasMes().length + 1;
    pecasMes().forEach(function (p) { p.etapa = "aprovada"; p.status = "agendado"; });
    J.registrar("Mês de novembro de " + C.titulo(m) + " (" + total + " peças) aprovado por " + J.diretor() + ". " + G.regras.length + " regras checadas em cada peça.", "ok", f, { n: total });
    J.evento("aprovado", "Mês de " + C.titulo(m) + " aprovado");
    d.aprovado = true;
    J.render(); J.toast("Aprovado e publicado. A decisão ficou registrada.");
  };
  I["demo-teste"] = function (t) {
    var d = dm(); d.teste = t.value;
    var res = G.analisar(t.value, { identificacao: true });
    var a = document.getElementById("ph-teste"), v = document.getElementById("ph-veredito"), h = document.getElementById("demo-teste-hits");
    if (a) a.innerHTML = G.destacar(res).replace(/\n/g, "<br>") || '<span style="opacity:.5">Digite a frase…</span>';
    if (v) { v.textContent = veredito(res); v.className = "ph-veredito " + (res.liberado ? "ok" : "bloq"); }
    if (h) h.innerHTML = hitsCurtos(res);
    return false;
  };
  var EX = ["Sou a melhor dermatologista de São Paulo, resultado garantido e sem dor.", "Veja o antes e depois da nossa paciente!", "Consulta com 30% de desconto só esta semana.", "Dra. Ana Souza · MÉDICA · CRM-SP 123456 · Dermatologia · RQE 7890. Agende pelo link da bio."];
  A["demo-teste-ex"] = function (b) { dm().teste = EX[+b.dataset.i]; J.render(); };
  A["demo-teste-limpar"] = function () { dm().teste = ""; J.render(); var t = document.getElementById("f-demo-teste"); if (t) t.focus(); };
  function falar(txt) {
    var d = dm(), ch = d.chat, antes = ch.msgs.length;
    var out = AT.responder(ch, txt, ctxAt());
    J.T.demoPend = ch.msgs.filter(function (x, i) { return i >= antes && x.de === "a"; }).length;
    if (out.agendou && ch.agendado) {
      J.S.agenda = J.S.agenda.filter(function (c) { return c.demo !== "ana"; });
      J.S.agenda.push({ id: "demo-ana", demo: "ana", medico: ch.agendado.medico, dia: ch.agendado.dia, hora: ch.agendado.hora, paciente: ch.agendado.paciente, status: "whatsapp", canal: "WhatsApp" });
      J.evento("whatsapp", ch.agendado.paciente + " agendada pelo WhatsApp");
    }
    if (out.cancelou) J.S.agenda = J.S.agenda.filter(function (c) { return c.demo !== "ana"; });
    J.render();
    var i = document.getElementById("f-demo-wa"); if (i && !i.disabled && window.innerWidth > 960) i.focus({ preventScroll: true });
  }
  A["demo-diz"] = function (b) { falar(b.dataset.txt); };
  A["submit:demo-wa"] = function (f) { var v = f.msg.value.trim(); if (v) falar(v); };
  A["demo-slot"] = function (b) {
    var d = dm(), ch = d.chat, antes = ch.msgs.length;
    AT.escolherSlot(ch, +b.dataset.i, ctxAt());
    J.T.demoPend = ch.msgs.filter(function (x, i) { return i >= antes && x.de === "a"; }).length;
    J.render();
  };
  A["demo-lembrete"] = function (b) {
    var S = J.S, d = dm(), ag = agendamentoAna();
    d.lembrete = b.dataset.r;
    var outras = S.agenda.filter(function (c) { return c.dia === "ter" && c.status === "aguardando"; });
    if (d.lembrete === "cancelou") {
      ag.status = "cancelou"; d.vaga = { medico: ag.medico, hora: ag.hora, dono: "Ana" };
      outras.forEach(function (c) { c.status = "confirmada"; });
    } else {
      ag.status = "confirmada";
      outras.forEach(function (c, i) { c.status = i === 0 ? "cancelou" : "confirmada"; });
      if (outras[0]) d.vaga = { medico: outras[0].medico, hora: outras[0].hora, dono: outras[0].paciente };
    }
    J.evento("confirmacao", "Lembretes de terça respondidos");
    J.render(); J.toast(d.vaga ? "Um horário de terça ficou vago. A lista de espera entra em ação." : "Confirmações registradas.");
  };
  A["demo-oferecer"] = function () { dm().espera = "oferecido"; J.render(); };
  A["demo-espera-sim"] = function () {
    var S = J.S, d = dm(), v = d.vaga;
    var c = S.agenda.filter(function (x) { return x.dia === "ter" && x.medico === v.medico && x.hora === v.hora && x.status === "cancelou"; })[0];
    if (c) { c.paciente = "Marcos D."; c.status = "encaixe"; }
    var e = (S.espera || [])[0]; if (e) e.usado = true;
    d.espera = "aceitou"; J.evento("encaixe", "Marcos D. ocupou o horário vago");
    J.render(); J.toast("Marcos ficou com o horário. Falta evitada.");
  };
  A["demo-recomecar"] = function () {
    var ent = J.S.entrevista;
    J.S = J.estadoInicial(); J.S.entrevista = ent; J.S.diag = C.diagExemplo(); J.S.diagFeito = true; J.preparar();
    J.T.demoPend = 0; J.T.t0 = null; J.T.acumulado = 0;
    J.ir("demo/0"); J.toast("Demonstração pronta, do zero.");
  };
  document.addEventListener("keydown", function (ev) {
    if (J.rotaAtual().nome !== "demo" || /input|textarea|select/i.test((ev.target.tagName || ""))) return;
    var n = parseInt(J.rotaAtual().arg, 10) || 0;
    if (ev.key === "ArrowRight" && n < CENAS.length - 1) J.ir("demo/" + (n + 1));
    if (ev.key === "ArrowLeft" && n > 0) J.ir("demo/" + (n - 1));
  });
})(window.JW);
