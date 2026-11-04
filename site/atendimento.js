/* Jalecon · agente de WhatsApp da clínica (roteiro com reconhecimento de intenção, sem IA paga).
 * O paciente escreve o que quiser. O agente: identifica o motivo e o médico, informa valor e convênio,
 * oferece horários livres da agenda, pede o nome e agenda. Nunca dá diagnóstico nem indica remédio,
 * orienta urgência para o 192 e passa para uma pessoa quando pedem. Cada resposta passa pelo Guardião.
 */
(function (g) {
  "use strict";
  var G = g.Guardiao, C = g.Clinica;
  function n(s) { return G.normalizar(s || ""); }

  var RX = {
    urgencia: /dor no peito|aperto no peito|falta de ar|nao consigo respirar|desmai|sangramento (forte|intenso|muito)|convuls|\bavc\b|infarto|paralis|overdose/,
    crise: /suicid|me matar|tirar a minha vida|tirar minha vida|nao quero mais viver|acabar com tudo/,
    humano: /atendente|falar com (uma |alguma )?(pessoa|alguem|humano|gente)|\bhumano\b|recepcao|secretaria|pessoa de verdade/,
    diag: /sera que|e grave|o que eu tenho|o que pode ser|diagnost|qual remedio|que remedio|posso tomar|devo tomar|\bdose\b|resultado do (meu )?exame|meu exame|laudo|precisa operar|da para resolver|tem cura|resolve sem cirurgia/,
    preco: /quanto custa|qual o valor|qual valor|\bvalor\b|\bpreco\b|quanto e a consulta|quanto fica/,
    convenio: /convenio|plano de saude|\bplano\b|unimed|amil|bradesco|sulamerica|sul america|hapvida|reembolso|porto seguro/,
    agendar: /horario|agendar|agenda|marcar|consulta|\bvaga\b|disponivel|tem hora|encaixe|atende/,
    endereco: /endereco|onde fica|onde voces ficam|localiza|como chego|estacionamento/,
    cancelar: /cancel|desmarc|nao vou poder|nao posso ir/,
    remarcar: /remarc|mudar o horario|trocar o horario|outro horario|outro dia/,
    saudacao: /^(oi|ola|bom dia|boa tarde|boa noite|e ai|opa)\b/,
    sim: /^(sim|pode ser|pode|quero|claro|ok|beleza|isso|perfeito|fechado)\b/,
    obrigado: /obrigad|valeu|agradec/
  };

  var HORAS = {
    almoco: { rot: "Segunda, 12:40", periodo: "boa tarde", fora: false },
    comercial: { rot: "Segunda, 14:10", periodo: "boa tarde", fora: false },
    noite: { rot: "Segunda, 22:47", periodo: "boa noite", fora: true },
    sabado: { rot: "Sábado, 10:05", periodo: "bom dia", fora: true }
  };

  function novo(hora) {
    return { hora: hora || "noite", msgs: [], estado: "inicio", medico: null, motivo: "", slots: [], slot: null, nome: "", agendado: null, handoff: false, tipo: "", resumo: [] };
  }

  function pal(t, p) { return new RegExp("(^|[^a-z])" + p).test(t); }
  function motivo(e, t) { var ps = e.palavras.filter(function (p) { return pal(t, p); }); var f = ps.filter(function (p) { return p.length > 6 || ps.length === 1; }); return (ps.length > 1 ? ps[1] : ps[0]) || e.nome.toLowerCase(); }
  function achaMedico(txt, eq) {
    var t = n(txt);
    for (var i = 0; i < C.ESP_ORDEM.length; i++) {
      var k = C.ESP_ORDEM[i], e = C.ESP[k];
      var hit = e.palavras.some(function (p) { return pal(t, p); });
      if (!hit) continue;
      var m = eq.filter(function (x) { return x.esp === k; })[0];
      return { esp: k, medico: m || null, palavra: motivo(e, t) };
    }
    // nome do médico
    var pm = eq.filter(function (x) { return t.indexOf(n(x.nome.split(" ")[0])) >= 0 || t.indexOf(n(x.nome.split(" ").slice(-1)[0])) >= 0; })[0];
    if (pm) return { esp: pm.esp, medico: pm, palavra: pm.especialidade.toLowerCase() };
    return null;
  }

  function fmtSlot(s) { return { seg: "segunda", ter: "terça", qua: "quarta", qui: "quinta", sex: "sexta", "sáb": "sábado" }[s.dia] + " às " + s.hora; }

  /* ctx: { diag, eq, agenda } → devolve a lista de respostas (o estado muda no lugar) */
  function responder(st, texto, ctx) {
    var t = n(texto), d = ctx.diag, eq = ctx.eq, H = HORAS[st.hora] || HORAS.noite, out = [];
    var clinica = d.nome || "clínica";
    function diz(txt, guarda) { out.push({ de: "a", txt: txt, guarda: guarda || "" }); }
    st.msgs.push({ de: "p", txt: texto });

    if (RX.crise.test(t)) {
      st.handoff = true; st.tipo = "crise";
      diz("Sinto muito que você esteja passando por isso. Você não está sozinho. Agora, ligue para o CVV no 188 (24 horas, gratuito) ou, se estiver em perigo, para o SAMU no 192. Já avisei a nossa equipe para falar com você.", "Situação de risco: o agente orienta o CVV (188) e o SAMU (192) e chama uma pessoa da equipe na hora.");
      return fim();
    }
    if (RX.urgencia.test(t)) {
      st.handoff = true; st.tipo = "urgencia";
      diz("Isso pode ser uma urgência. Ligue agora para o SAMU no 192 ou vá ao pronto-socorro mais próximo. Não espere a consulta. Já avisei a nossa equipe.", "Sinal de urgência: o agente não agenda, orienta o 192 e passa para uma pessoa.");
      return fim();
    }
    if (st.estado === "nome" && t && !RX.cancelar.test(t)) {
      st.nome = texto.trim().replace(/^(meu nome e|me chamo|sou (o|a))\s+/i, "").slice(0, 40);
      var m = eq.filter(function (x) { return x.id === st.medico; })[0];
      st.agendado = { medico: st.medico, dia: st.slot.dia, hora: st.slot.hora, paciente: st.nome };
      st.estado = "agendado";
      diz("Pronto, " + st.nome.split(" ")[0] + "! Consulta com " + C.titulo(m) + " na " + fmtSlot(st.slot) + ", na " + clinica + ". Mando uma confirmação um dia antes. Para remarcar ou cancelar, é só responder aqui.");
      out.agendou = true;
      return fim();
    }
    if (RX.humano.test(t)) {
      st.handoff = true; st.tipo = st.tipo || "humano";
      diz(H.fora ? "Claro! Passei a sua conversa para a recepção. Ela volta a atender " + (st.hora === "sabado" ? "na segunda, a partir das 8h" : "amanhã, a partir das 8h") + ". Se quiser, já posso reservar um horário enquanto isso." : "Claro! Passei a sua conversa para a recepção, que responde em alguns minutos.", "Passagem para humano: na pesquisa, 85% aceitam o assistente, a maioria desde que possa falar com uma pessoa (P4).");
      return fim();
    }
    if (st.estado === "agendado" && RX.cancelar.test(t)) {
      out.cancelou = st.agendado; st.agendado = null; st.estado = "inicio";
      diz("Cancelei a sua consulta. Obrigado por avisar: o horário vai para quem está na lista de espera. Quando quiser remarcar, é só chamar.");
      return fim();
    }
    if (st.estado === "agendado" && RX.remarcar.test(t)) {
      out.cancelou = st.agendado; st.agendado = null;
      st.slots = C.livres(ctx.agenda, st.medico, 4); st.estado = "slots";
      diz("Sem problema. Estes são os próximos horários livres. Qual fica melhor?");
      return fim();
    }

    if (st.estado === "slots" && st.slots.length) {
      var hm = t.match(/(\d{1,2})[:h](\d{2})?/);
      if (hm) {
        var hh = ("0" + hm[1]).slice(-2) + ":" + (hm[2] || "00");
        var idx = -1; st.slots.forEach(function (s, i) { if (idx < 0 && s.hora === hh) idx = i; });
        if (idx >= 0) { st.msgs.pop(); return escolherSlot(st, idx, ctx); }
      }
      if (RX.sim.test(t)) { diz("Combinado! Escolha um dos horários abaixo, ou me diga um dia e hora."); return fim(); }
    }
    var achou = achaMedico(texto, eq);
    if (achou && achou.medico) { st.medico = achou.medico.id; st.motivo = st.motivo || achou.palavra; }
    var med = st.medico ? eq.filter(function (x) { return x.id === st.medico; })[0] : null;
    var respondeu = false;

    if (RX.saudacao.test(t) && !st.msgs.slice(0, -1).some(function (x) { return x.de === "a"; })) {
      diz(cap(H.periodo) + "! Aqui é o atendimento da " + clinica + ". " + (H.fora ? "Mesmo fora do horário, eu consigo marcar a sua consulta. " : "") + "Como posso ajudar?");
      respondeu = true;
    }
    if (RX.diag.test(t)) {
      diz("Entendo a preocupação. Por aqui eu não consigo avaliar o que está acontecendo nem indicar remédio: quem examina e explica as opções é " + (med ? C.titulo(med) : "o médico") + ", na consulta.", "O agente não dá diagnóstico, não indica remédio e não promete resultado (Código de Ética Médica, art. 37; Res. CFM 2.336/2023).");
      respondeu = true;
    }
    if (achou && !achou.medico) {
      var esps = eq.map(function (x) { return x.especialidade; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      diz("No momento a " + clinica + " não tem " + C.ESP[achou.esp].nome.toLowerCase() + ". Atendemos " + esps.join(", ") + ".");
      respondeu = true;
    } else if (achou && achou.medico && !RX.diag.test(t)) {
      diz("Atendemos, sim. " + C.titulo(med) + (med.rqe ? " é da " + med.especialidade.toLowerCase() + " e" : "") + " atende " + C.ESP[med.esp].tema + ".");
      respondeu = true;
    }
    if (RX.convenio.test(t)) {
      diz("A consulta é particular. Emitimos recibo para você pedir reembolso ao seu plano, se ele tiver essa opção.");
      respondeu = true; st.tipo = "particular";
    }
    if (RX.preco.test(t)) {
      diz("A consulta particular" + (med ? " com " + C.titulo(med) : "") + " custa " + C.brl(+d.ticket || 450) + ", com retorno em até 30 dias incluído.");
      respondeu = true;
    }
    if (RX.endereco.test(t)) {
      diz("Ficamos na Rua das Acácias, 120, em " + (d.cidade || "São Paulo") + " (endereço fictício da demo), com estacionamento conveniado.");
      respondeu = true;
    }
    var querAgendar = RX.agendar.test(t) || (st.estado === "oferta" && RX.sim.test(t));
    if (querAgendar || (respondeu && med && st.estado !== "slots")) {
      if (!med) { diz("Para eu ver o médico certo: qual é o motivo da consulta? Por exemplo, joelho, criança, pressão, ansiedade, estômago."); st.estado = "motivo"; }
      else { st.slots = C.livres(ctx.agenda, med.id, 4); st.estado = "slots"; diz("Tenho estes horários com " + C.titulo(med) + ". Qual fica melhor para você?"); }
      respondeu = true;
    }
    if (RX.obrigado.test(t) && !respondeu) { diz("Eu que agradeço! Se precisar, é só chamar."); respondeu = true; }
    if (!respondeu) {
      diz(st.estado === "motivo" ? "Não consegui identificar a especialidade. Pode me dizer o motivo com outras palavras? Por exemplo: dor no joelho, consulta para o meu filho, pressão alta." : "Posso marcar consultas, informar valores, convênio e endereço. Qual o motivo da consulta?");
      if (st.estado !== "motivo") st.estado = "motivo";
    }
    return fim();

    function fim() {
      out.forEach(function (x) {
        var res = G.analisar(x.txt, { identificacao: false });
        x.checado = res.liberado ? "ok" : "bloqueado";
        st.msgs.push(x);
      });
      return out;
    }
  }

  function escolherSlot(st, i, ctx) {
    var s = st.slots[i];
    if (!s) return [];
    st.slot = s; st.estado = "nome";
    st.msgs.push({ de: "p", txt: fmtSlot(s).replace(" às ", " ") });
    var x = { de: "a", txt: "Ótimo, reservei " + fmtSlot(s) + ". Para confirmar, qual é o seu nome completo?", checado: "ok" };
    st.msgs.push(x);
    return [x];
  }

  function resumo(st, ctx) {
    var eq = ctx.eq, m = st.medico ? eq.filter(function (x) { return x.id === st.medico; })[0] : null;
    var r = [];
    r.push(["Paciente", st.nome || "não informado"]);
    r.push(["Motivo", st.motivo ? st.motivo : "não informado"]);
    if (m) r.push(["Médico", C.titulo(m)]);
    if (st.agendado) r.push(["Agendado", fmtSlot(st.agendado)]);
    r.push(["Tipo", st.tipo === "urgencia" ? "urgência: orientado a ligar 192" : st.tipo === "crise" ? "risco: orientado CVV 188 e SAMU 192" : "particular"]);
    r.push(["Precisa de pessoa", st.handoff ? "sim" : "não"]);
    r.push(["Canal", "WhatsApp, " + (HORAS[st.hora] || HORAS.noite).rot]);
    return r;
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  var SUGESTOES = {
    inicio: ["Boa noite! Vocês atendem dor no joelho?", "Quanto custa a consulta?", "Vocês aceitam convênio?", "Meu filho está com febre, tem pediatra?"],
    motivo: ["É dor no joelho", "Consulta para o meu filho", "Pressão alta", "Quero falar com uma pessoa"],
    slots: [],
    nome: ["Ana Souza"],
    agendado: ["Obrigado!", "Preciso remarcar", "Quero cancelar"],
    teste: ["Será que é menisco? Qual remédio posso tomar?", "Estou com dor no peito e falta de ar", "Quero falar com uma pessoa"]
  };

  var api = { HORAS: HORAS, novo: novo, responder: responder, escolherSlot: escolherSlot, resumo: resumo, fmtSlot: fmtSlot, SUGESTOES: SUGESTOES };
  g.Atendimento = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
