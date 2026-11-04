/* Jalecon · telas de operação: visão geral, 6 Pulso (painel), WhatsApp, agenda, médicos e planos. */
(function (J) {
  "use strict";
  var G = window.Guardiao, C = window.Clinica, CT = window.Conteudo, AT = window.Atendimento;
  var V = J.VIEWS, A = J.ACOES, I = J.INPUTS, D = J.DEPOIS, esc = J.esc, fmt = J.fmt, ICON = J.ICON;

  /* O que aconteceu nesta sessão: vem das ações reais, não da simulação do mês. */
  function aoVivo() {
    var S = J.S;
    var aprovadas = (S.registro || []).filter(function (x) { return x.tipo === "ok"; }).length;
    var devolvidas = (S.registro || []).filter(function (x) { return x.tipo === "bloqueia"; }).length;
    var wa = (S.agenda || []).filter(function (c) { return c.status === "whatsapp"; });
    var encaixes = (S.agenda || []).filter(function (c) { return c.status === "encaixe"; }).length;
    var conf = (S.eventos || []).filter(function (e) { return e.tipo === "confirmacao"; }).length;
    var geradas = J.todasPecas ? J.todasPecas().length : 0;
    var handoff = (S.chatLog || []).filter(function (c) { return c.handoff; }).length;
    var itens = [];
    if (geradas) itens.push(geradas + " peças criadas pelos agentes no Estúdio");
    if (aprovadas) itens.push(aprovadas + " peça" + (aprovadas > 1 ? "s aprovadas" : " aprovada") + " pelo diretor técnico, com registro");
    if (devolvidas) itens.push(devolvidas + " peça" + (devolvidas > 1 ? "s devolvidas" : " devolvida") + " ao autor");
    if (wa.length) itens.push(wa.length + " paciente" + (wa.length > 1 ? "s novos agendados" : " novo agendado") + " pelo WhatsApp, em segundos");
    if (handoff) itens.push(handoff + " conversa" + (handoff > 1 ? "s passadas" : " passada") + " para uma pessoa da equipe");
    if (conf) itens.push("Confirmações enviadas para a agenda de terça");
    if (encaixes) itens.push(encaixes + " falta" + (encaixes > 1 ? "s evitadas" : " evitada") + " pela lista de espera");
    if (!itens.length) return "";
    var ult = S.registro.length ? S.registro[S.registro.length - 1] : null;
    return '<div class="card live" data-testid="ao-vivo"><span class="eyebrow">Hoje, nesta demonstração</span><ul class="list">' + itens.map(function (t) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + esc(t) + "</li>"; }).join("") + "</ul>" +
      (ult ? '<p class="small">Último registro: ' + esc(ult.quando) + " · " + esc(ult.txt) + "</p>" : "") + "</div>";
  }
  J.aoVivo = aoVivo;

  /* =========================================================== VISÃO GERAL */
  var CICLO = [
    ["anamnese", "Anamnese", "Diagnóstico de 10 min define o plano"],
    ["estudio", "Estúdio", "Agentes criam marca, site e conteúdo"],
    ["revisao-ia", "IA revisa IA", "Agentes críticos checam clareza e ciência"],
    ["revisao", "Médico revisa", "Ajustes em conversa viram preferências"],
    ["aprovacao", "Guardião", "Checagem nas regras do CFM e LGPD"],
    ["pulso", "Pulso", "Publica e mede sucesso"]
  ];
  V.inicio = function () {
    var S = J.S;
    if (!S.diagFeito) {
      return J.cab("Jalecon para clínicas · versão web", "Mais pacientes certos na agenda, sem arriscar o CRM", "Conteúdo de cada médico, WhatsApp que responde e agenda, e painel de consultas por canal, com cada peça checada pelo Guardião e aprovada pelo diretor técnico. Para clínicas de 5 a 10 médicos.") +
        '<div class="row wrap"><button class="btn" type="button" data-act="exemplo">Abrir com a clínica de exemplo</button><button class="btn ghost" type="button" data-go="anamnese">Fazer a anamnese de uma clínica</button></div>' +
        cicloHtml() +
        '<div class="g3">' + [["Problema", "75% das clínicas investem em anúncios; só 24% convertem contatos com processo. De 10% a 25% dos pacientes faltam."], ["Cliente", "O gestor da clínica de 5 a 10 médicos: encher a agenda com particulares, saber o que funciona e não expor o diretor técnico no CRM."], ["Oferta", "Um fornecedor só, de R$ 2.900 a R$ 8.900 por mês, no lugar de R$ 6,5 a 12,8 mil com agência, secretária com IA e atendente."]].map(function (c) { return '<div class="card"><span class="eyebrow">' + c[0] + '</span><p>' + c[1] + "</p></div>"; }).join("") + "</div>" +
        '<div class="card plano"><h2 class="t">O que dá para testar aqui</h2><div class="g3">' + [["Ciclo completo", "Anamnese, Estúdio, IA revisa IA, revisão do médico, Guardião e Pulso."], ["Atendimento", "WhatsApp em que você escreve como paciente; agenda com confirmação e lista de espera."], ["Bastidores", "Placar da pesquisa com os cortes fixados antes, conta de padeiro e piloto."]].map(function (c) { return "<div><b>" + c[0] + '</b><p class="small">' + c[1] + "</p></div>"; }).join("") + "</div>" + J.sim("Protótipo acadêmico. Clínicas, médicos e pacientes são fictícios; as regras do Guardião e os dados da pesquisa são reais.") + "</div>";
    }
    var r = C.raioX(S.diag, S.prem), pend = J.pendentes(), ms = J.eq();
    var semMes = ms.filter(function (m) { return !(S.estudio[m.id] && S.estudio[m.id].mes); }).length;
    var tarefas = [];
    if (semMes) tarefas.push(["estudio", semMes + " médico" + (semMes > 1 ? "s" : "") + " sem o conteúdo de novembro", "Gerar no Estúdio"]);
    if (pend) tarefas.push(["aprovacao", pend + " peça" + (pend > 1 ? "s esperam" : " espera") + " o diretor técnico", "Aprovar"]);
    var aguard = (S.agenda || []).filter(function (c) { return c.dia === "ter" && c.status === "aguardando"; }).length;
    if (aguard) tarefas.push(["agenda", aguard + " consultas de terça sem confirmação", "Confirmar"]);
    if (!S.chatLog.length && S.chat && !S.chat.msgs.length) tarefas.push(["whatsapp", "Teste o WhatsApp como paciente", "Abrir"]);
    return J.cab("Visão geral · " + S.diag.nome, "O ciclo da sua clínica, do contato à consulta", "Do diagnóstico ao paciente na cadeira: cada aprovação, ajuste e consulta agendada volta como dado e melhora o ciclo.") +
      cicloHtml() +
      '<div class="g4">' + J.kpi("Consultas a mais por mês (estimativa)", "+" + fmt(r.consultasAMais), "raio-x com as premissas atuais", true) + J.kpi("Contatos por mês", fmt(r.contatos), fmt(r.perdidos) + " se perdem hoje") + J.kpi("Peças esperando", pend, "fila do diretor técnico") + J.kpi("Médicos", ms.length, C.PLANOS[r.plano].nome) + "</div>" +
      '<div class="g-side"><div class="stack">' + (aoVivo() || '<div class="card"><span class="eyebrow">Hoje, nesta demonstração</span><p class="muted">Nada ainda. O que você fizer nas telas aparece aqui e no painel.</p></div>') +
      '<div class="card"><h2 class="t">Para fazer agora</h2>' + (tarefas.length ? '<div class="stack">' + tarefas.map(function (t) { return '<div class="row between wrap"><span>' + esc(t[1]) + '</span><button class="btn sm" type="button" data-go="' + t[0] + '">' + esc(t[2]) + "</button></div>"; }).join("") + "</div>" : '<p class="muted">Tudo em dia.</p>') + "</div></div>" +
      '<div class="stack"><div class="card"><h2 class="t">Equipe</h2><div class="stack">' + ms.map(function (m) { var id = J.idt(m); return '<button type="button" class="item-l" style="grid-template-columns:36px 1fr auto" data-go="estudio/' + m.id + '">' + J.avatar(m) + '<span><span class="tt">' + esc(C.titulo(m)) + '</span><br><span class="small">' + esc(m.especialidade) + "</span></span><span class=\"pill info\">" + esc(id.familia) + "</span></button>"; }).join("") + "</div></div>" +
      '<div class="card plano"><h3 class="t">Bastidores para a banca</h3><div class="row wrap"><button class="btn ghost sm" type="button" data-go="validacao">Placar da pesquisa</button><button class="btn ghost sm" type="button" data-go="viabilidade">Conta de padeiro</button><button class="btn ghost sm" type="button" data-go="piloto">Piloto</button></div></div></div></div>';
  };
  function cicloHtml() {
    var S = J.S;
    var feito = {
      anamnese: S.diagFeito,
      estudio: J.todasPecas && S.diagFeito && J.todasPecas().length > 0,
      "revisao-ia": S.diagFeito && J.todasPecas().some(function (p) { return p.iaFeita; }),
      revisao: S.diagFeito && J.eq().some(function (m) { return S.estudio[m.id] && S.estudio[m.id].prefs.length; }),
      aprovacao: (S.registro || []).some(function (x) { return x.tipo === "ok"; }),
      pulso: (S.agenda || []).some(function (c) { return c.status === "whatsapp"; })
    };
    return '<div class="ciclo">' + CICLO.map(function (c, i) { return '<button type="button" class="passo' + (feito[c[0]] ? " feito" : "") + '" data-go="' + c[0] + '"><span class="nn">' + (feito[c[0]] ? "✓" : i + 1) + "</span><b>" + c[1] + "</b><span>" + c[2] + "</span></button>"; }).join("") + "</div>";
  }

  /* =========================================================== 6 · PULSO */
  V.pulso = function () {
    var S = J.S, P = C.painel(S.diag, J.eq(), S.prem), r = P.r, J2 = r.jalecon, ms = J.eq();
    var maxC = Math.max.apply(null, P.canais.map(function (c) { return c.contatos; }));
    var maxS = Math.max.apply(null, P.semanas.map(function (s) { return s.contatos; }));
    var wa = (S.agenda || []).filter(function (c) { return c.status === "whatsapp"; }).length;
    var aprov = J.todasPecas().filter(function (p) { return p.etapa === "aprovada"; }).length + (S.fila || []).filter(function (p) { return p.status === "aprovado" && !p.ref; }).length;
    return J.cab("Passo 6 do ciclo · Pulso · mês 3 do piloto (simulado)", fmt(J2.compareceram) + " consultas de pacientes novos no mês", "Resultado medido do primeiro contato até a consulta agendada, por canal e por médico. É a métrica-chave do piloto (Ficha 3): contatos pelos canais da Jalecon por clínica por mês, comparados com o que a clínica fazia antes.") +
      aoVivo() +
      '<div class="g4">' + J.kpi("Consultas a mais que antes da Jalecon", "+" + fmt(r.consultasAMais), "meta do piloto: 11 por mês", true) + J.kpi("Contatos que seguem a conversa", J.pct(J2.respondidos / r.contatos), "resposta em " + P.tempoResposta + " (mediana)") + J.kpi("Faltas", J.pct(J2.faltaPct), "eram " + S.diag.faltas + "%") + J.kpi("Horários vagos preenchidos", fmt(P.vagasPreenchidas), "pela lista de espera") + "</div>" +
      '<div class="g2"><div class="card"><h2 class="t">Funil do mês</h2><div class="funnel">' +
      [["Contatos novos", r.contatos], ["Seguem a conversa", J2.respondidos], ["Consultas agendadas", J2.agendados], ["Pacientes que vieram", J2.compareceram]].map(function (x) { return '<div class="fr"><span>' + x[0] + '</span><b class="num">' + fmt(x[1]) + '</b><div class="fb"><span style="width:' + Math.max(2, x[1] / r.contatos * 100) + '%"></span></div></div>'; }).join("") + "</div>" +
      '<h3 class="t">Contatos por semana</h3><div class="cols" aria-label="Contatos por semana">' + P.semanas.map(function (s) { return '<div class="c"><b class="num" style="color:var(--fg)">' + s.contatos + '</b><span style="height:' + Math.round(s.contatos / maxS * 100) + '%"></span>' + esc(s.sem) + "</div>"; }).join("") + "</div></div>" +
      '<div class="card"><h2 class="t">Por canal</h2><div class="tb-wrap"><table class="tb"><thead><tr><th>Canal</th><th class="n">Contatos</th><th class="n">Agendados</th><th class="n">Conversão</th></tr></thead><tbody>' +
      P.canais.map(function (c) { return "<tr><td>" + esc(c.nome) + '<div class="bar ap"><span style="width:' + (c.contatos / maxC * 100) + '%"></span></div></td><td class="n">' + fmt(c.contatos) + '</td><td class="n">' + fmt(c.agendados) + '</td><td class="n">' + J.pct(c.taxa) + "</td></tr>"; }).join("") +
      (wa ? '<tr class="destaque"><td>WhatsApp, nesta demo</td><td class="n">' + (S.chatLog.length || wa) + '</td><td class="n">' + wa + '</td><td class="n">ao vivo</td></tr>' : "") +
      '</tbody></table></div><p class="small">Na pesquisa com pacientes, 21 de 27 marcaram a última consulta pelo WhatsApp e 18 preferem marcar por ele.</p></div></div>' +
      '<div class="card"><h2 class="t">Por médico</h2><div class="tb-wrap"><table class="tb"><thead><tr><th>Médico</th><th>Identidade</th><th class="n">Contatos</th><th class="n">Consultas</th><th>Canal que mais traz</th><th class="n">Peças aprovadas</th></tr></thead><tbody>' +
      ms.map(function (m, i) { var pm = P.porMedico[i], id = J.idt(m), ap = J.todasPecas().filter(function (p) { return p.medico === m.id && p.etapa === "aprovada"; }).length; return '<tr><td><span class="row">' + J.avatar(m, 28) + "<span>" + esc(C.titulo(m)) + '<br><span class="small">' + esc(m.especialidade) + '</span></span></span></td><td><span class="pill info">' + esc(id.familia) + '</span></td><td class="n">' + fmt(pm.contatos) + '</td><td class="n"><b>' + fmt(pm.consultas) + "</b></td><td>" + esc(pm.canalTop) + '</td><td class="n">' + ap + "</td></tr>"; }).join("") +
      "</tbody></table></div>" + (aprov ? "" : '<p class="small">Nenhuma peça aprovada ainda nesta demo. Aprove na fila do diretor técnico e volte aqui.</p>') + J.sim() + "</div>";
  };

  /* =========================================================== WHATSAPP */
  function ctxAt() { return { diag: J.S.diag, eq: J.eq(), agenda: J.S.agenda }; }
  V.whatsapp = function () {
    var S = J.S, ch = S.chat || (S.chat = AT.novo("noite")), H = AT.HORAS[ch.hora];
    var msgs = ch.msgs.length ? ch.msgs.map(function (x) {
      return '<div class="msg ' + (x.de === "p" ? "me" : "ai") + '">' + (x.de === "a" ? '<div class="de">Agente da clínica <span class="chk">' + (x.checado === "ok" ? "✓ Guardião" : "") + "</span></div>" : "") + esc(x.txt) + "</div>" + (x.guarda ? '<div class="guard">' + ICON.shield + "<span>" + esc(x.guarda) + "</span></div>" : "");
    }).join("") : '<div class="msg ai"><div class="de">Agente da clínica</div>Olá! Aqui é o atendimento da ' + esc(S.diag.nome) + ". Como posso ajudar?</div>";
    var chips = "";
    if (ch.estado === "slots" && ch.slots.length) chips = ch.slots.map(function (s, i) { return '<button type="button" class="chip-btn" data-act="wa-slot" data-i="' + i + '">' + esc(AT.fmtSlot(s)) + "</button>"; }).join("");
    else (AT.SUGESTOES[ch.estado] || AT.SUGESTOES.inicio).forEach(function (t) { chips += '<button type="button" class="chip-btn" data-act="wa-diz" data-txt="' + esc(t) + '">' + esc(t) + "</button>"; });
    var fechado = ch.handoff && (ch.tipo === "urgencia" || ch.tipo === "crise");
    var resumo = AT.resumo(ch, ctxAt());
    return J.cab("Atendimento · WhatsApp da clínica", "O agente responde em segundos e agenda", "Você é o paciente: escreva o que quiser ou use as sugestões. O agente identifica o médico, informa valor e convênio, oferece horários livres da agenda real da demo e agenda. Não dá diagnóstico, orienta urgência e passa para uma pessoa quando pedem.") +
      '<div class="row wrap"><span class="small">Quando o paciente escreve:</span><div class="seg" role="group" aria-label="Horário da conversa">' + Object.keys(AT.HORAS).map(function (k) { return '<button type="button" class="' + (ch.hora === k ? "on" : "") + '" data-act="wa-hora" data-hora="' + k + '" aria-pressed="' + (ch.hora === k) + '">' + esc(AT.HORAS[k].rot) + "</button>"; }).join("") + '</div><button class="btn ghost sm" type="button" data-act="wa-nova">Nova conversa</button></div>' +
      '<div class="g-side"><div class="wa"><div class="wa-top"><div><b>' + esc(S.diag.nome) + '</b><br><span class="small">atendimento automático · supervisionado · ' + esc(H.rot) + '</span></div><span class="pill ok">responde em ~4 s</span></div>' +
      '<div class="chat" id="wa-chat" aria-live="polite" data-testid="chat">' + msgs + "</div>" +
      '<div class="baixo">' + (fechado ? '<p class="small">Conversa encaminhada para a equipe. Comece uma nova conversa para testar outro caso.</p>' : '<div class="chips">' + chips + '</div><form class="composer" data-sub="wa"><label class="sr" for="f-wa">Mensagem do paciente</label><input id="f-wa" name="msg" placeholder="Escreva como paciente…" autocomplete="off"><button type="submit">Enviar</button></form>') + "</div></div>" +
      '<div class="stack"><div class="card"><h2 class="t">Resumo para a recepção</h2><table class="tb"><tbody>' + resumo.map(function (x) { return "<tr><th style=\"width:40%\">" + esc(x[0]) + "</th><td>" + esc(x[1]) + "</td></tr>"; }).join("") + "</tbody></table>" +
      (ch.agendado ? '<button class="btn sm" type="button" data-go="agenda">Ver na agenda</button>' : "") + '<p class="small">O agente não pede exames nem detalhes de saúde além do motivo da consulta (LGPD).</p></div>' +
      '<div class="card plano"><h3 class="t">Teste os limites</h3><div class="chips">' + AT.SUGESTOES.teste.map(function (t) { return '<button type="button" class="chip-btn" data-act="wa-diz" data-txt="' + esc(t) + '"' + (fechado ? " disabled" : "") + ">" + esc(t) + "</button>"; }).join("") + '</div><p class="small">Na pesquisa com pacientes: 70% já desistiram de um médico por demora (P2); 85% aceitam assistente virtual, a maioria desde que possa falar com uma pessoa (P4); só 7% procuraram fora do horário comercial (P3).</p></div>' +
      J.sim("Simulação: na versão real, o agente usa IA com as regras da clínica e do CFM, ligado ao WhatsApp Business, e uma pessoa supervisiona.") + "</div></div>";
  };
  D.whatsapp = function () { var c = document.getElementById("wa-chat"); if (c) c.scrollTop = c.scrollHeight; };
  function aposResposta(out) {
    var S = J.S, ch = S.chat;
    if (out.cancelou) { S.agenda = S.agenda.filter(function (c) { return !(c.status === "whatsapp" && c.medico === out.cancelou.medico && c.dia === out.cancelou.dia && c.hora === out.cancelou.hora); }); }
    if (out.agendou && ch.agendado) {
      S.agenda.push({ id: "wa" + Date.now(), medico: ch.agendado.medico, dia: ch.agendado.dia, hora: ch.agendado.hora, paciente: ch.agendado.paciente, status: "whatsapp", canal: "WhatsApp" });
      J.evento("whatsapp", ch.agendado.paciente + " agendado pelo WhatsApp");
      J.toast("Consulta gravada na agenda de " + C.titulo(J.medico(ch.agendado.medico)) + ".");
    }
    if (ch.handoff && !ch._logado) { ch._logado = true; J.evento("handoff", "Conversa passada para a equipe"); }
  }
  A["submit:wa"] = function (f) { var v = f.msg.value.trim(); if (!v) return; var out = AT.responder(J.S.chat, v, ctxAt()); aposResposta(out); J.render(); var i = document.getElementById("f-wa"); if (i) i.focus(); };
  A["wa-diz"] = function (b) { var out = AT.responder(J.S.chat, b.dataset.txt, ctxAt()); aposResposta(out); J.render(); };
  A["wa-slot"] = function (b) { AT.escolherSlot(J.S.chat, +b.dataset.i, ctxAt()); J.render(); var i = document.getElementById("f-wa"); if (i) i.focus(); };
  A["wa-hora"] = function (b) { var S = J.S; logar(); S.chat = AT.novo(b.dataset.hora); J.render(); };
  A["wa-nova"] = function () { logar(); J.S.chat = AT.novo(J.S.chat ? J.S.chat.hora : "noite"); J.render(); };
  function logar() { var ch = J.S.chat; if (ch && ch.msgs.length) J.S.chatLog.push({ hora: ch.hora, agendado: !!ch.agendado, handoff: ch.handoff, tipo: ch.tipo, n: ch.msgs.length }); }

  /* =========================================================== AGENDA */
  var ROT = { confirmada: "confirmada", aguardando: "aguardando confirmação", nova: "nova", whatsapp: "nova · pelo WhatsApp", cancelou: "cancelou", encaixe: "encaixe da lista de espera", faltou: "faltou" };
  V.agenda = function (arg) {
    var S = J.S, ms = J.eq(), ag = S.agenda || [], dia = arg || S.aba.dia || "ter";
    var doDia = ag.filter(function (c) { return c.dia === dia; });
    var conf = doDia.filter(function (c) { return c.status === "confirmada" || c.status === "encaixe"; }).length;
    var aguard = doDia.filter(function (c) { return c.status === "aguardando"; }).length;
    var vagas = doDia.filter(function (c) { return c.status === "cancelou"; });
    var horas = dia === "sáb" ? ["08:30", "09:30", "10:30", "11:30"] : ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00", "17:00"];
    var semana = C.DIAS.map(function (d) { var l = ag.filter(function (c) { return c.dia === d[0]; }); return { d: d, n: l.length, wa: l.filter(function (c) { return c.status === "whatsapp"; }).length }; });
    return J.cab("Atendimento · agenda", conf + " de " + doDia.length + " consultas de " + nomeDia(dia) + " confirmadas", "Confirmação automática um dia antes e lista de espera para ocupar o horário de quem cancela. Na pesquisa, todos os pacientes que faltaram (8 de 8) citaram esquecimento ou dificuldade de desmarcar (P5).") +
      '<div class="tabs" role="tablist">' + semana.map(function (s) { return '<button type="button" role="tab" aria-selected="' + (s.d[0] === dia) + '" class="' + (s.d[0] === dia ? "on" : "") + '" data-go="agenda/' + s.d[0] + '">' + esc(J.cap(s.d[1])) + (s.d[0] === "seg" ? " (hoje)" : s.d[0] === "ter" ? " (amanhã)" : "") + ' <span class="small">' + s.n + (s.wa ? " · " + s.wa + " WhatsApp" : "") + "</span></button>"; }).join("") + "</div>" +
      '<div class="row wrap"><button class="btn sm" type="button" data-act="confirmar" data-dia="' + dia + '"' + (aguard && dia !== "seg" ? "" : " disabled") + ">Enviar confirmações (" + aguard + ")</button>" + (dia === "seg" ? '<button class="btn ghost sm" type="button" data-act="falta">Registrar uma falta de hoje</button>' : "") + (vagas.length ? '<span class="pill block">' + vagas.length + " horário vago</span>" : "") +
      '<div class="legend" style="margin-left:auto">' + [["confirmada", "var(--ok-bg)"], ["aguardando", "var(--warn-bg)"], ["WhatsApp", "var(--ok)"], ["cancelou", "var(--clay-bg)"], ["encaixe", "var(--sage)"]].map(function (l) { return '<span><i style="background:' + l[1] + '"></i>' + l[0] + "</span>"; }).join("") + "</div></div>" +
      (vagas.length ? '<div class="card alerta"><h2 class="t">Lista de espera</h2><p class="muted">' + esc(vagas[0].paciente) + " cancelou o horário das " + vagas[0].hora + " com " + esc(C.titulo(J.medico(vagas[0].medico))) + ". Quem está na lista recebe a oferta primeiro, pelo WhatsApp.</p><div class=\"stack\">" +
        S.espera.filter(function (e) { return !e.usado; }).map(function (e) { return '<div class="row between"><span><b>' + esc(e.nome) + '</b> <span class="small">· ' + esc(e.pref) + '</span></span><button class="btn sm" type="button" data-act="oferecer" data-id="' + e.id + '">Oferecer o horário</button></div>'; }).join("") + "</div></div>" : "") +
      '<div class="card"><div class="ag-wrap"><div class="ag-grid"><div class="ag-linha"><span></span>' + horas.map(function (h) { return '<span class="h">' + h + "</span>"; }).join("") + "</div>" +
      ms.map(function (m) {
        return '<div class="ag-linha"><span class="m">' + J.avatar(m, 26) + "<span>" + esc(C.titulo(m)) + "</span></span>" + horas.map(function (h) {
          var c = doDia.filter(function (x) { return x.medico === m.id && x.hora === h; }).slice(-1)[0];
          return c ? '<span class="slot ' + c.status + '" title="' + esc(c.paciente + " · " + (ROT[c.status] || c.status) + " · " + (c.canal || "")) + '">' + esc(c.paciente) + "<br>" + esc(ROT[c.status] || c.status) + "</span>" : '<span class="slot">livre</span>';
        }).join("") + "</div>";
      }).join("") + "</div></div>" + J.sim("Agenda fictícia. No piloto, a integração é com o sistema de agenda da clínica (Feegow, iClinic e similares).") + "</div>";
  };
  function nomeDia(d) { var x = C.DIAS.filter(function (y) { return y[0] === d; })[0]; return x ? x[1] : d; }
  A.confirmar = function (b) {
    var S = J.S, dia = b.dataset.dia, cancelou = false, n = 0;
    S.agenda.forEach(function (c) { if (c.dia !== dia || c.status !== "aguardando") return; n++; if (!cancelou) { c.status = "cancelou"; cancelou = true; } else c.status = "confirmada"; });
    S.aba.dia = dia;
    J.evento("confirmacao", n + " confirmações enviadas para " + nomeDia(dia));
    J.render(); J.toast(cancelou ? n + " confirmações enviadas. Um paciente cancelou: o horário foi para a lista de espera." : "Confirmações enviadas.");
  };
  A.oferecer = function (b) {
    var S = J.S, e = S.espera.filter(function (x) { return x.id === b.dataset.id; })[0];
    var dia = J.rotaAtual().arg || S.aba.dia || "ter";
    var vaga = S.agenda.filter(function (c) { return c.status === "cancelou" && c.dia === dia; })[0];
    if (!e || !vaga) return;
    e.usado = true; vaga.paciente = e.nome; vaga.status = "encaixe";
    J.evento("encaixe", e.nome + " ocupou um horário vago");
    J.render(); J.toast(e.nome + " aceitou o horário das " + vaga.hora + ". Falta evitada.");
  };
  A.falta = function () {
    var S = J.S, c = S.agenda.filter(function (x) { return x.dia === "seg" && (x.status === "confirmada" || x.status === "aguardando"); })[0];
    if (!c) return;
    c.status = "faltou"; J.evento("falta", c.paciente + " faltou");
    J.render(); J.toast(c.paciente + " faltou. No painel, a falta entra na taxa do mês; a confirmação de amanhã tenta evitar a próxima.");
  };

  /* =========================================================== MÉDICOS */
  V.medicos = function () {
    var ms = J.eq();
    return J.cab("Clínica · médicos e identidades", "Cada médico recebe a própria marca, não um modelo pronto", "A identidade sai da especialidade e do tom de cada médico. Toda peça leva nome, CRM, MÉDICO e RQE; a Jalecon não assina o conteúdo do médico.") +
      '<div class="g3">' + ms.map(function (m) {
        var id = J.idt(m), e = J.est(m.id);
        return '<div class="card"><div class="idcard"><span class="mono" style="background:' + id.cores[0] + ";color:" + id.cores[3] + ";font-family:'" + esc(id.fontes.titulo) + "',serif\">" + esc(id.iniciais) + "</span><div><b>" + esc(C.titulo(m)) + '</b><br><span class="small">' + esc(m.especialidade) + " · CRM-" + m.uf + " " + m.crm + (m.rqe ? " · RQE " + m.rqe : "") + "</span></div></div>" +
          '<div class="swatches">' + id.cores.map(function (c) { return '<div style="background:' + c + '"></div>'; }).join("") + "</div>" +
          '<p><b style="font-family:\'' + esc(id.fontes.titulo) + "',serif;font-size:18px\">" + esc(id.familia) + '</b> <span class="small">· ' + esc(id.porqueFamilia) + "</span></p>" +
          '<div class="row wrap">' + (m.rqe ? '<span class="pill ok">especialidade com RQE</span>' : '<span class="pill warn">sem RQE: não anuncia especialidade</span>') + (e.mes ? '<span class="pill info">' + e.mes.pecas.length + " peças no mês</span>" : "") + (e.prefs.length ? '<span class="pill ok">' + e.prefs.length + " preferências</span>" : "") + "</div>" +
          '<div class="row wrap"><button class="btn sm" type="button" data-go="estudio/' + m.id + '">Abrir o Estúdio</button><button class="btn ghost sm" type="button" data-act="ser-medico" data-m="' + m.id + '">Entrar como este médico</button></div></div>';
      }).join("") + "</div>";
  };

  /* =========================================================== PLANOS */
  V.planos = function () {
    var S = J.S;
    if (S.entrevista) return J.cab("Planos", "Preços escondidos no modo entrevista", "Desligue o modo entrevista no menu para ver os planos.");
    var rec = S.diagFeito ? C.planoPara(+S.diag.medicos) : "pro", r = S.diagFeito ? C.raioX(S.diag, S.prem) : null;
    return J.cab("Clínica · planos", "Captação e atendimento da clínica por R$ 2.900 a R$ 8.900 por mês", "Começamos pelo plano Pro (5 a 10 médicos). Implantação de uma mensalidade; mídia paga fica fora; sem cobrança por consulta até parecer jurídico. Preços em validação com gestores (preço-teste de R$ 3.500).") +
      '<div class="g3">' + ["essencial", "pro", "rede"].map(function (k) {
        var P = C.PLANOS[k], on = k === rec;
        return '<div class="card' + (on ? " accent" : "") + '"' + (on ? ' data-testid="plano-recomendado"' : "") + '><div class="row between"><b>' + esc(P.nome) + "</b>" + (on ? '<span class="pill ok">' + (S.diagFeito ? "indicado para " + esc(S.diag.nome) : "começamos por aqui") + "</span>" : "") + '</div><span class="num" style="font-family:var(--display);font-size:32px;font-weight:600">' + C.brl(P.preco) + '<span class="small">/mês</span></span><span class="small">' + esc(P.porte) + "</span></div>";
      }).join("") + "</div>" +
      '<div class="g2"><div class="card"><h2 class="t">O que entra em todos</h2><ul class="list">' + C.INCLUI.map(function (x) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card"><h2 class="t">Hoje × com a Jalecon</h2>' + (r ? '<table class="tb"><tbody><tr><th>Agência, atendente e robô hoje</th><td class="n">' + C.brl(r.gastoAtual) + '</td></tr><tr><th>Plano ' + esc(C.PLANOS[rec].nome) + '</th><td class="n">' + C.brl(C.PLANOS[rec].preco) + '</td></tr><tr><th>Consultas a mais por mês (raio-x)</th><td class="n">+' + fmt(r.consultasAMais) + '</td></tr><tr><th>Consultas que pagam o plano</th><td class="n">' + Math.ceil(C.PLANOS[rec].preco / (+S.diag.ticket || 450)) + "</td></tr></tbody></table>" : '<p class="muted">Faça a anamnese para comparar com o gasto da clínica.</p>') +
      '<p class="small">Agências para clínicas cobram de R$ 5 mil a R$ 15 mil por mês. Contrato anual com desconto ajuda a manter a recorrência.</p></div></div>' +
      '<div class="card accent"><h2 class="t">Piloto pago</h2><p>3 a 6 meses com 3 a 5 clínicas de 5 a 10 médicos, no plano Pro, com dados reais e supervisão humana.</p><div class="row wrap"><button class="btn" type="button" data-go="piloto">Ver o piloto</button><button class="btn ghost" type="button" data-act="quero-piloto">Quero participar do piloto</button></div></div>';
  };
  A["quero-piloto"] = function () { J.toast("Obrigado! Fale com o grupo em falejalecon@gmail.com. (Na demo, nada é enviado.)"); };
})(window.JW);
