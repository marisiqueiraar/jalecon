/* Jalecon · agente de WhatsApp da clínica (reconhecimento de intenção por regras, sem IA paga).
 * Ritmo de uma boa recepção: UMA mensagem do agente por vez. Cumprimenta e confirma o médico, pergunta se é
 * particular ou convênio, responde à dúvida (sem diagnóstico, sem remédio, sem promessa), e só então oferece os
 * horários livres da agenda. O nome vem do perfil do WhatsApp; não pergunta. Entende dia e hora digitados,
 * desmarca e remarca, orienta urgência (192) e crise (188), e passa para uma pessoa quando pedem.
 * Usado pela demonstração guiada e pela tela de WhatsApp da plataforma.
 */
(function (g) {
  "use strict";
  var G = g.Guardiao, C = g.Clinica;
  function n(s) { return G.normalizar(s || ""); }

  var RX = {
    urgencia: /dor no peito|aperto no peito|falta de ar|nao consigo respirar|desmai|sangramento (forte|intenso|muito)|convuls|\bavc\b|infarto|paralis|overdose/,
    crise: /suicid|me matar|tirar a minha vida|tirar minha vida|nao quero mais viver|acabar com tudo/,
    humano: /atendente|falar com (uma |alguma )?(pessoa|alguem|humano|gente)|\bhumano\b|recepcao|secretaria|pessoa de verdade/,
    diag: /sera que|e grave|o que eu tenho|o que pode ser|diagnost|remedio|posso tomar|devo tomar|\bdose\b|resultado do (meu )?exame|meu exame|laudo|precisa operar|resolver sem cirurgia|tem cura|menisco/,
    preco: /quanto custa|qual o valor|qual valor|\bvalor\b|\bpreco\b|quanto e a consulta|quanto fica|quanto e/,
    convenio: /convenio|plano de saude|\bplano\b|unimed|amil|bradesco|sulamerica|sul america|hapvida|reembolso|porto seguro/,
    particular: /particular/,
    agendar: /horario|agendar|agenda|marcar|consulta|\bvaga\b|disponivel|tem hora|encaixe|essa semana|esta semana/,
    sim: /^(sim|pode|quero|claro|ok|beleza|isso|perfeito|fechado|bora|vamos|por favor)\b/,
    nao: /^(nao|agora nao|depois)\b/,
    nenhum: /nenhum|outro dia|outro horario|nao posso|nao da|nao consigo/,
    endereco: /endereco|onde fica|onde voces ficam|localiza|como chego|estacionamento/,
    cancelar: /cancel|desmarc|nao vou poder|nao posso ir/,
    remarcar: /remarc|mudar o horario|trocar o horario/,
    saudacao: /^(oi|ola|bom dia|boa tarde|boa noite|e ai|opa)\b/,
    obrigado: /obrigad|valeu|agradec/
  };

  var HORAS = {
    almoco: { rot: "Segunda, 12:40", hh: 12, mm: 40, periodo: "boa tarde", fora: false },
    comercial: { rot: "Segunda, 14:10", hh: 14, mm: 10, periodo: "boa tarde", fora: false },
    noite: { rot: "Segunda, 22:47", hh: 22, mm: 47, periodo: "boa noite", fora: true },
    sabado: { rot: "Sábado, 10:05", hh: 10, mm: 5, periodo: "bom dia", fora: true }
  };
  var NOME_DIA = { seg: "segunda", ter: "terça", qua: "quarta", qui: "quinta", sex: "sexta", "sáb": "sábado" };
  /* Dúvida típica de cada especialidade, para as sugestões de mensagem do paciente. */
  var DUVIDA = {
    ortopedia: "Será que é menisco? Dá para resolver sem cirurgia?", pediatria: "Ele está com febre há dois dias, é grave?",
    psiquiatria: "Será que é ansiedade? Vou precisar de remédio?", gastro: "Será que é gastrite? Qual remédio posso tomar?",
    cardiologia: "Minha pressão anda alta, é grave?", cirurgia: "Será que precisa operar?",
    dermatologia: "Será que essa mancha é grave?", ginecologia: "Essa cólica forte é normal?"
  };
  var PRIMEIRA = { ortopedia: "Oi! Vocês atendem dor no joelho?", pediatria: "Oi! Tem pediatra? Meu filho está com febre.", psiquiatria: "Oi, vocês têm psiquiatra?", gastro: "Oi! Vocês atendem gastrite?", cardiologia: "Oi, tem cardiologista? Queria ver minha pressão.", cirurgia: "Oi! Vocês atendem hérnia?" };
  var PERFIS = [["Bruna Alves", "f"], ["Carlos Mendonça", "m"], ["Fernanda Lopes", "f"], ["Rodrigo Prado", "m"], ["Juliana Reis", "f"], ["Marcelo Dias", "m"]];

  /* opts: { paciente, sexo, origem, primeira } — na plataforma, o nome sai de um perfil fictício do WhatsApp. */
  function novo(hora, opts) {
    opts = opts || {};
    var p = opts.paciente ? [opts.paciente, opts.sexo || "f"] : PERFIS[Math.floor(Math.random() * PERFIS.length)];
    return { v: 3, hora: hora || "comercial", msgs: [], estado: "inicio", saudou: false, medico: null, motivo: "", tipo: "", pergPreco: false, slots: [], pagina: 0, agendado: null, handoff: false, urgencia: false, crise: false, agradeceu: false, paciente: p[0], sexo: p[1], origem: opts.origem || "", primeira: opts.primeira || "" };
  }
  function pal(t, p) { return new RegExp("(^|[^a-z])" + p).test(t); }
  function achaMedico(t, eq) {
    for (var i = 0; i < C.ESP_ORDEM.length; i++) {
      var k = C.ESP_ORDEM[i], e = C.ESP[k], ps = e.palavras.filter(function (p) { return pal(t, p); });
      if (!ps.length) continue;
      var m = eq.filter(function (x) { return x.esp === k; })[0];
      var mot = ps.filter(function (p) { return p.length > 4 && !/^(ortoped|pediatr|psiquiatr|gastroent|cardiolog|cirurgi|dermatolog|obstetr|ginecolog)$/.test(p); })[0] || e.nome.toLowerCase();
      if (/^(filh|bebe|crianca)/.test(mot)) mot = "consulta para a criança";
      return { esp: k, medico: m || null, motivo: mot };
    }
    var pm = eq.filter(function (x) { var p = x.nome.split(" "); return pal(t, n(p[0])) || pal(t, n(p[p.length - 1])); })[0];
    return pm ? { esp: pm.esp, medico: pm, motivo: pm.especialidade.toLowerCase() } : null;
  }
  function fmtSlot(s) { return NOME_DIA[s.dia] + " às " + s.hora; }
  function primeiroNome(st) { return st.paciente.split(" ")[0]; }
  function tratamento(m) { return (m.sexo === "f" ? "a Dra. " : "o Dr. ") + m.nome; }
  function profissao(m) { var e = g.Conteudo && g.Conteudo.ESP[m.esp]; if (!e) return "especialista em " + m.especialidade.toLowerCase(); return m.sexo === "f" && e.profF ? e.profF : e.prof; }
  function pedidoHorario(t) {
    var dia = /segunda/.test(t) ? "seg" : /terca/.test(t) ? "ter" : /quarta/.test(t) ? "qua" : /quinta/.test(t) ? "qui" : /sexta/.test(t) ? "sex" : /sabado/.test(t) ? "sáb" : "";
    var hm = t.match(/\b(\d{1,2})\s*(?:h|:)\s*(\d{2})?\b|\b(\d{1,2}):(\d{2})\b/), hora = "";
    if (hm) { var h = +(hm[1] || hm[3]), mi = hm[2] || hm[4] || "00"; if (h >= 7 && h <= 19) hora = ("0" + h).slice(-2) + ":" + mi; }
    return { dia: dia, hora: hora };
  }
  function horaMsg(st) {
    var H = HORAS[st.hora] || HORAS.comercial, min = H.hh * 60 + H.mm + Math.floor(st.msgs.length / 2);
    return ("0" + Math.floor(min / 60) % 24).slice(-2) + ":" + ("0" + (min % 60)).slice(-2);
  }

  /* ctx: { diag, eq, agenda } → devolve { msgs: [nova resposta], agendou, cancelou } (o estado muda no lugar) */
  function responder(st, texto, ctx) {
    var t = n(texto), d = ctx.diag, eq = ctx.eq, H = HORAS[st.hora] || HORAS.comercial, out = { msgs: [] };
    var clin = d.nome || "clínica", ticket = C.brl(+d.ticket || 450);
    var med = st.medico ? eq.filter(function (x) { return x.id === st.medico; })[0] : null;
    var horario = " Posso ver um horário para você?";
    st.msgs.push({ de: "p", txt: texto, hora: horaMsg(st) });
    function diz(txt, guarda) { var x = { de: "a", txt: txt, guarda: guarda || "", hora: horaMsg(st) }; x.checado = G.analisar(txt, { identificacao: false }).liberado ? "ok" : "bloqueado"; st.msgs.push(x); out.msgs.push(x); return out; }
    function ola() { if (st.saudou) return ""; st.saudou = true; return cap(H.periodo) + "! Aqui é o atendimento da " + clin + ". "; }
    function apresenta(m) { return "Atendemos, sim: " + tratamento(m) + (m.rqe ? " é " + profissao(m) + " e" : "") + " atende " + C.ESP[m.esp].tema + ". Você prefere consulta particular ou pelo convênio?"; }
    function livresMed() { return C.livres(ctx.agenda, st.medico, 40).filter(function (x) { return x.dia !== "sáb"; }); }
    function oferecer(mais) {
      var todos = livresMed();
      st.pagina = mais ? st.pagina + 1 : 0;
      st.slots = todos.slice(st.pagina * 4, st.pagina * 4 + 4);
      if (!st.slots.length) { st.pagina = 0; st.slots = todos.slice(0, 4); }
      st.estado = "slots";
      return mais ? "Sem problema. Tenho também estes horários com " + tratamento(med) + ". Algum fica bom?" : "Tenho estes horários com " + tratamento(med) + " esta semana. Qual fica melhor para você?";
    }
    function agendar(sl) {
      st.agendado = { medico: st.medico, dia: sl.dia, hora: sl.hora, paciente: st.paciente };
      st.estado = "agendado"; out.agendou = st.agendado;
      return "Pronto, " + primeiroNome(st) + "! Consulta com " + tratamento(med) + " na " + fmtSlot(sl) + ", na " + clin + ". Mando uma confirmação um dia antes. Para remarcar, é só responder aqui.";
    }

    // 1. o que vale em qualquer momento
    if (RX.crise.test(t)) { st.crise = true; st.handoff = true; st.estado = "encerrado"; return diz("Sinto muito que você esteja passando por isso. Você não está sozinho. Ligue agora para o CVV no 188 (24 horas, gratuito) ou, se estiver em perigo, para o SAMU no 192. Já avisei a nossa equipe para falar com você.", "Situação de risco: o agente orienta o CVV (188) e o SAMU (192) e chama uma pessoa da equipe na hora."); }
    if (RX.urgencia.test(t)) { st.urgencia = true; st.handoff = true; st.estado = "encerrado"; return diz("Isso pode ser uma urgência. Ligue agora para o SAMU no 192 ou vá ao pronto-socorro mais próximo; não espere a consulta. Já avisei a nossa equipe.", "Sinal de urgência: o agente não agenda, orienta o 192 e chama uma pessoa da equipe na hora."); }
    if (RX.humano.test(t)) {
      st.handoff = true;
      return diz(ola() + (H.fora ? "Claro! A recepção volta a atender " + (st.hora === "sabado" ? "na segunda" : "amanhã") + " a partir das 8h, e já deixei a sua conversa com ela. Se quiser, enquanto isso eu reservo um horário." : "Claro! Já chamei a recepção, que te responde aqui em alguns minutos. Se quiser, enquanto isso eu já deixo um horário reservado."), "Passagem para pessoa: na pesquisa, 85% aceitam o assistente, a maioria desde que possa falar com alguém.");
    }
    if (RX.endereco.test(t)) return diz(ola() + "Ficamos na Rua das Acácias, 120, em " + (d.cidade || "São Paulo") + " (endereço fictício da demonstração), com estacionamento conveniado.");

    // 2. consulta já marcada
    if (st.estado === "agendado") {
      if (RX.cancelar.test(t)) { out.cancelou = st.agendado; st.agendado = null; st.estado = "oferta"; return diz("Cancelei a sua consulta. Obrigado por avisar: o horário vai para quem está na lista de espera. Quando quiser remarcar, é só chamar."); }
      if (RX.remarcar.test(t) || RX.nenhum.test(t)) { out.cancelou = st.agendado; st.agendado = null; return diz(oferecer(false).replace("Tenho estes", "Sem problema. Tenho estes")); }
      if (RX.obrigado.test(t)) { st.agradeceu = true; return diz("Eu que agradeço, " + primeiroNome(st) + ". Até lá!"); }
      return diz("Sua consulta está marcada para " + fmtSlot(st.agendado) + ". Se precisar remarcar, é só me avisar.");
    }

    // 3. médico e motivo
    var achou = achaMedico(t, eq);
    if (achou && !achou.medico) {
      var esps = eq.map(function (x) { return x.especialidade; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      return diz(ola() + "No momento a " + clin + " não tem " + C.ESP[achou.esp].nome.toLowerCase() + ". Atendemos " + esps.slice(0, -1).join(", ").toLowerCase() + " e " + esps[esps.length - 1].toLowerCase() + ". Posso ajudar com alguma delas?");
    }
    if (achou && achou.medico && (!st.medico || st.estado === "inicio" || st.estado === "motivo")) {
      st.medico = achou.medico.id; st.motivo = achou.motivo; med = achou.medico;
      if (RX.particular.test(t)) st.tipo = "particular";
      if (RX.convenio.test(t)) st.tipo = st.tipo || "convenio";
      if (RX.diag.test(t)) { st.estado = "oferta"; return diz(ola() + "Atendemos, sim, com " + tratamento(med) + ". Por aqui eu não consigo avaliar o que está acontecendo: quem examina e explica as opções é " + tratamento(med) + ", na consulta." + (st.tipo ? horario : " A consulta seria particular ou pelo convênio?"), "O agente não dá diagnóstico nem promete resultado pelo WhatsApp. Leva para a consulta."); }
      if (st.tipo === "particular") { st.estado = "oferta"; return diz(ola() + "Atendemos, sim: " + tratamento(med) + " atende " + C.ESP[med.esp].tema + "." + horario); }
      st.estado = "qualifica"; return diz(ola() + apresenta(med));
    }

    // 4. sem médico definido
    if (!st.medico) {
      if (RX.preco.test(t)) { st.estado = "motivo"; return diz(ola() + "A consulta particular custa " + ticket + ", com retorno em até 30 dias. Qual é o motivo da consulta, para eu ver o médico certo?"); }
      if (RX.convenio.test(t)) { st.tipo = "convenio"; st.estado = "motivo"; return diz(ola() + "A " + clin + " atende particular e emite recibo para você pedir reembolso ao plano. Qual é o motivo da consulta, para eu ver o médico certo?"); }
      if (RX.diag.test(t)) { st.estado = "motivo"; return diz(ola() + "Entendo a preocupação. Por aqui eu não consigo avaliar o que está acontecendo, mas posso marcar com o médico certo. Qual é o motivo da consulta?", "O agente não dá diagnóstico nem indica remédio pelo WhatsApp (Código de Ética Médica, art. 37)."); }
      if (RX.agendar.test(t) || st.estado === "motivo") { st.estado = "motivo"; return diz(ola() + (st.saudou && !RX.agendar.test(t) ? "Não consegui identificar a especialidade. Pode me dizer com outras palavras? Por exemplo: dor no joelho, consulta para o meu filho, pressão alta." : "Claro! Qual é o motivo da consulta? Assim eu vejo o médico certo.")); }
      return diz(ola() + (RX.saudacao.test(t) || RX.obrigado.test(t) ? "Como posso te ajudar?" : "Posso marcar consultas, informar valores, convênio e endereço. Qual é o motivo da consulta?"));
    }

    // 5. médico definido: qualifica → oferta → horários
    if (RX.particular.test(t)) st.tipo = "particular";
    if (RX.convenio.test(t)) st.tipo = st.tipo || "convenio";
    var avanca = st.estado === "qualifica" || st.estado === "inicio" || st.estado === "motivo";
    if (RX.diag.test(t)) { if (avanca) st.estado = "oferta"; return diz("Entendo a preocupação. Por aqui eu não consigo avaliar o que está acontecendo: quem examina e explica as opções é " + tratamento(med) + ", na consulta." + (st.estado === "oferta" ? horario : ""), "O agente não dá diagnóstico nem promete resultado pelo WhatsApp. Leva para a consulta."); }
    if (RX.preco.test(t)) { st.pergPreco = true; if (avanca) st.estado = "oferta"; return diz("A consulta particular com " + tratamento(med) + " custa " + ticket + ", com retorno em até 30 dias." + (st.estado === "oferta" ? horario : "")); }
    if (st.tipo === "convenio" && avanca) { st.estado = "oferta"; st.pergPreco = true; return diz("A " + clin + " atende particular e emite recibo para você pedir reembolso ao plano. A consulta custa " + ticket + "." + horario); }
    if (st.tipo === "particular" && avanca) { st.estado = "oferta"; return diz("Perfeito." + horario); }
    var ped = pedidoHorario(t);
    if (st.estado === "oferta" && (ped.dia || ped.hora)) { oferecer(false); }
    if (st.estado === "slots") {
      if (RX.nenhum.test(t)) return diz(oferecer(true));
      if (ped.hora || ped.dia) {
        var livres = livresMed(), hit = livres.filter(function (x) { return (!ped.hora || x.hora === ped.hora) && (!ped.dia || x.dia === ped.dia); });
        if (ped.hora && hit.length) return diz(agendar(hit[0]));
        if (ped.dia && hit.length) { st.slots = hit.slice(0, 4); return diz("Na " + NOME_DIA[ped.dia] + " tenho estes horários com " + tratamento(med) + ". Qual fica melhor?"); }
        var doDia = ped.dia ? livres.filter(function (x) { return x.dia === ped.dia; }) : [];
        if (doDia.length) { st.slots = doDia.slice(0, 4); return diz("Às " + ped.hora.replace(":00", "h") + " de " + NOME_DIA[ped.dia] + " " + tratamento(med) + " já está com a agenda cheia. Nesse dia tenho estes horários. Algum serve?"); }
        return diz((ped.hora ? "Às " + ped.hora.replace(":00", "h") + " " + tratamento(med) + " já está com a agenda cheia" : "Nesse dia " + tratamento(med) + " não tem horário livre") + " esta semana. Algum destes serve?");
      }
      return diz("Escolha um dos horários abaixo ou me diga o dia e a hora que ficam melhor.");
    }
    if (st.estado === "oferta" && (RX.sim.test(t) || RX.agendar.test(t))) return diz(oferecer(false));
    if (st.estado === "oferta" && RX.nao.test(t)) return diz("Tudo bem. Quando quiser marcar, é só me chamar aqui.");
    if (st.estado === "qualifica") return diz("Só para eu te orientar certo: a consulta seria particular ou pelo convênio?");
    if (RX.obrigado.test(t)) return diz("Eu que agradeço! Se precisar, é só chamar.");
    return diz("Posso ver um horário com " + tratamento(med) + ", te passar o valor ou tirar dúvidas sobre convênio. O que prefere?");
  }

  function escolherSlot(st, i, ctx) {
    var sl = st.slots[i]; if (!sl) return { msgs: [] };
    st.msgs.push({ de: "p", txt: fmtSlot(sl).replace(" às ", " "), hora: horaMsg(st) });
    var med = ctx.eq.filter(function (x) { return x.id === st.medico; })[0];
    st.agendado = { medico: st.medico, dia: sl.dia, hora: sl.hora, paciente: st.paciente };
    st.estado = "agendado";
    var x = { de: "a", txt: "Pronto, " + primeiroNome(st) + "! Consulta com " + tratamento(med) + " na " + fmtSlot(sl) + ", na " + (ctx.diag.nome || "clínica") + ". Mando uma confirmação um dia antes. Para remarcar, é só responder aqui.", hora: horaMsg(st), checado: "ok" };
    st.msgs.push(x);
    return { msgs: [x], agendou: st.agendado };
  }

  /* Sugestões de mensagem do paciente para o estado atual (chips). */
  function opcoes(st, ctx) {
    var med = st.medico ? ctx.eq.filter(function (x) { return x.id === st.medico; })[0] : null, esp = med ? med.esp : "ortopedia";
    if (st.estado === "encerrado") return [];
    if (st.estado === "inicio") return [{ txt: st.primeira || PRIMEIRA.ortopedia }, { txt: "Quanto custa a consulta?" }, { txt: "Vocês aceitam convênio?" }];
    if (st.estado === "motivo") return [{ txt: "É dor no joelho" }, { txt: "Consulta para o meu filho" }, { txt: "Pressão alta" }];
    if (st.estado === "qualifica") return [{ txt: "Particular. " + (DUVIDA[esp] || "Será que é grave?") }, { txt: "Particular. Quanto custa?" }, { txt: "Pelo convênio." }];
    if (st.estado === "oferta") return [{ txt: "Pode ser. Tem horário esta semana?" }].concat(st.pergPreco ? [] : [{ txt: "Antes, quanto custa?" }]).concat([{ txt: "Quero falar com uma pessoa" }]);
    if (st.estado === "slots") return st.slots.map(function (sl, i) { return { slot: i, rot: fmtSlot(sl) }; }).concat([{ txt: "Nenhum desses dá para mim" }]);
    if (st.estado === "agendado") return st.agradeceu ? [{ txt: "Preciso remarcar" }, { txt: "Quero cancelar" }] : [{ txt: st.sexo === "m" ? "Obrigado!" : "Obrigada!" }, { txt: "Preciso remarcar" }];
    return [];
  }

  /* Resumo para a recepção, em uma frase. */
  function resumo(st, ctx) {
    if (!st.msgs.length) return "A conversa aparece aqui, resumida em uma frase para a recepção.";
    var nova = st.sexo === "m" ? "novo" : "nova", ag = st.sexo === "m" ? "Agendado" : "Agendada";
    if (st.crise) return st.paciente + " relatou risco. Orientação dada: CVV 188 e SAMU 192. A equipe foi avisada e precisa falar com a pessoa agora.";
    if (st.urgencia) return st.paciente + " relatou sinal de urgência. Orientação dada: ligar para o 192. A equipe foi avisada.";
    var med = st.medico ? ctx.eq.filter(function (x) { return x.id === st.medico; })[0] : null;
    var tipo = st.tipo === "particular" ? "particular" : st.tipo === "convenio" ? "pelo convênio, com recibo para reembolso" : "tipo de consulta ainda não informado";
    var r = st.paciente + ", paciente " + nova + ", " + tipo + (st.motivo ? ", motivo: " + st.motivo : "") + ". ";
    if (st.origem) r += st.origem + " ";
    r += st.agendado ? ag + " com " + C.titulo(med) + " " + fmtSlot(st.agendado) + ". Confirmação automática um dia antes." : med ? "Quer marcar com " + C.titulo(med) + "; ainda sem horário." : "Ainda sem médico nem horário.";
    if (st.handoff) r += " Pediu para falar com uma pessoa.";
    return r;
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  var TESTE = ["Será que é menisco? Qual remédio posso tomar?", "Estou com dor no peito e falta de ar", "Quero falar com uma pessoa", "Tem dermatologista?", "Quarta às 15h"];

  var api = { HORAS: HORAS, NOME_DIA: NOME_DIA, novo: novo, responder: responder, escolherSlot: escolherSlot, opcoes: opcoes, resumo: resumo, fmtSlot: fmtSlot, pedidoHorario: pedidoHorario, TESTE: TESTE };
  g.Atendimento = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
