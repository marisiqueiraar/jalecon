/* Jalecon · proposta comercial para a clínica (para quem vai comprar).
 * Gerada ao vivo a partir da anamnese: quanto a clínica perde hoje, quanto ganha, em quanto tempo a
 * mensalidade se paga, o que cada pessoa da clínica recebe, como começa, segurança, investimento e piloto.
 * Números: Fichas 3 e 4, pitch e pesquisa. Estimativas aparecem como estimativas.
 */
(function (J) {
  "use strict";
  var C = window.Clinica, G = window.Guardiao, N = window.Negocio, P = window.Pesquisa;
  var V = J.VIEWS, A = J.ACOES, I = J.INPUTS, esc = J.esc, fmt = J.fmt, ICON = J.ICON;
  function brl(v) { return "R$ " + Math.round(v).toLocaleString("pt-BR"); }

  function estado() {
    var S = J.S;
    if (!S.diagFeito) { S.diag = C.diagExemplo(); S.diagFeito = true; J.preparar(); }
    if (!S.prop) S.prop = { fator: 0.5, substitui: true, persona: "gestor", enviado: false };
    return S.prop;
  }
  function conta() {
    var S = J.S, d = S.diag, pr = estado(), r = C.raioX(d, S.prem), plano = C.PLANOS[r.plano];
    var cons = Math.round(r.consultasAMais * pr.fator), ticket = +d.ticket || 450;
    var receita = cons * ticket, evitado = pr.substitui ? r.gastoAtual : 0, ganho = receita + evitado;
    var hoje = r.contatos ? r.hoje.compareceram / r.contatos : 0, jal = r.contatos ? r.jalecon.compareceram / r.contatos : 0;
    return {
      d: d, r: r, plano: plano, preco: plano.preco, cons: cons, ticket: ticket, receita: receita, evitado: evitado, ganho: ganho,
      liquido: ganho - plano.preco, retorno: ganho / plano.preco, payDias: ganho > 0 ? Math.ceil(plano.preco / (ganho / 30)) : null,
      pagam: Math.ceil(plano.preco / ticket), medicos: +d.medicos || 6,
      hoje100: Math.round(hoje * 100), jal100: Math.round((hoje + (jal - hoje) * pr.fator) * 100)
    };
  }

  /* ---------- gráfico: de cada 100 contatos, quantos viram paciente ---------- */
  function waffle(n, rot, destaque) {
    var cel = "";
    for (var i = 0; i < 100; i++) cel += '<i class="' + (i < n ? "on" : "") + '"></i>';
    return '<figure class="waffle' + (destaque ? " dest" : "") + '"><figcaption><b class="num">' + n + "</b> de 100 viram paciente<span>" + esc(rot) + '</span></figcaption><div class="wf" role="img" aria-label="' + n + ' de cada 100 contatos viram paciente, ' + esc(rot) + '">' + cel + "</div></figure>";
  }
  function blocoWaffle(k) {
    return waffle(k.hoje100, "hoje") + waffle(k.jal100, "com a Jalecon" + (estado().fator < 1 ? " (metade da estimativa)" : " (estimativa)"), true);
  }

  /* ---------- blocos que mudam ao vivo ---------- */
  function heroNum(k) {
    return '<span class="eyebrow">Para a ' + esc(k.d.nome) + "</span>" +
      '<b class="hero-n num">+' + brl(k.receita) + '</b><span class="hero-s">por mês em consultas particulares a mais</span>' +
      '<div class="hero-m"><span><b class="num">' + k.cons + "</b>consultas a mais por mês</span><span><b class=\"num\">" + (k.payDias != null ? k.payDias + " dias" : "—") + "</b>para a mensalidade se pagar</span></div>" +
      '<p class="small" style="color:inherit;opacity:.8">' + (estado().fator < 1 ? "Cenário conservador: metade do que o raio-x estima." : "Estimativa do raio-x.") + " O piloto mede o número real.</p>";
  }
  function calcRes(k) {
    var linhas = [
      ["Consultas a mais por mês", k.cons + " × " + brl(k.ticket), "+" + brl(k.receita), ""],
      ["Agência e atendimento que deixam de ser pagos", estado().substitui ? "fornecedores atuais" : "a clínica mantém os atuais", (k.evitado ? "+" : "") + brl(k.evitado), ""],
      ["Mensalidade " + k.plano.nome, k.plano.porte, "−" + brl(k.preco), "neg"]
    ];
    return '<table class="tb conta"><tbody>' + linhas.map(function (l) { return "<tr><th>" + esc(l[0]) + '<br><span class="small">' + esc(l[1]) + '</span></th><td class="n ' + l[3] + '">' + l[2] + "</td></tr>"; }).join("") +
      '<tr class="total"><th>Resultado da clínica por mês</th><td class="n">' + (k.liquido >= 0 ? "+" : "−") + brl(Math.abs(k.liquido)) + "</td></tr></tbody></table>" +
      '<div class="g3 kp3">' + J.kpi("Retorno sobre a mensalidade", String(Math.round(k.retorno * 10) / 10).replace(".", ",") + "×", "para cada R$ 1 investido") + J.kpi("A mensalidade se paga em", k.payDias != null ? k.payDias + " dias" : "—", "com o ganho do mês") + J.kpi("Consultas que pagam o plano", k.pagam, "menos de " + Math.ceil(k.pagam / k.medicos + 0.0001) + " por médico ao mês") + "</div>";
  }
  function atualizar() {
    var k = conta(), a = document.getElementById("p-hero"), b = document.getElementById("p-calc"), c = document.getElementById("p-waffle");
    if (a) a.innerHTML = heroNum(k); if (b) b.innerHTML = calcRes(k); if (c) c.innerHTML = blocoWaffle(k);
  }

  /* ---------- conteúdo fixo ---------- */
  var ENTREGAS = [
    ["Marca, site e Google de cada médico", "Identidade própria, site com nome, CRM e RQE e perfil no Google com botão de agendar.", "estudio"],
    ["Conteúdo e anúncios", "Os agentes escrevem o mês de cada médico; o médico ajusta conversando. Verba de mídia à parte.", "medico"],
    ["Guardião e aprovação da diretora técnica", "Cada peça checada em 39 regras e aprovada por quem responde no CRM, com registro.", "guardiao"],
    ["WhatsApp que responde e agenda", "Resposta em segundos, a qualquer hora, direto na agenda do médico. Passa para uma pessoa quando precisa.", "whatsapp"],
    ["Confirmação e lista de espera", "Lembrete na véspera e oferta automática do horário vago para quem está esperando.", "vespera"],
    ["Painel por canal e por médico", "Do primeiro contato até a consulta, e o resumo da semana no WhatsApp do gestor.", "pulso"]
  ];
  var PESSOAS = {
    gestor: { rot: "Gestor", t: "Um fornecedor só, com custo fixo e resultado medido", b: ["Troca agência, atendente e robô por uma mensalidade, sem cobrança por consulta.", "Vê contatos e consultas por canal e por médico, e sabe o que funciona.", "Recebe o resumo da semana no WhatsApp."], cena: "pulso" },
    diretor: { rot: "Diretora técnica", t: "Nada vai ao ar sem a sua aprovação", b: ["O Guardião checa cada peça no CFM 2.336/2023, no Código de Ética Médica, na LGPD, no CDC e na Anvisa, e explica cada bloqueio.", "Aprovação em um clique, com trilha de auditoria: data, hora, peça e regras checadas.", "A responsabilidade ética continua dela e dos médicos; a Jalecon dá a checagem e o registro."], cena: "guardiao" },
    medico: { rot: "Médicos", t: "Cada médico com a própria marca, sem gastar tempo", b: ["Identidade, site e Google próprios, com nome, CRM e RQE. A Jalecon não assina por ele.", "Revisa o mês conversando pelo celular, em cerca de 2 minutos.", "A IA aprende o jeito de cada um: o que ele pede hoje já vem pronto no mês seguinte."], cena: "medico" },
    recepcao: { rot: "Recepção", t: "Menos WhatsApp, mais atenção a quem está na clínica", b: ["O agente responde e agenda; a recepção recebe o resumo de cada conversa.", "Confirmações e lista de espera rodam sozinhas.", "Cerca de 40 horas de recepção por mês liberadas (estimativa do pitch)."], cena: "whatsapp" },
    paciente: { rot: "Pacientes", t: "Resposta na hora e uma clínica em que dá para confiar", b: ["Na pesquisa, 70% já desistiram de um médico por demora na resposta.", "85% aceitam marcar com um assistente, a maioria desde que possa falar com uma pessoa, e pode.", "67% desconfiam de promessa de resultado e antes e depois, que o Guardião barra."], cena: "problema" }
  };
  var FAQ = [
    ["E se o Guardião errar?", "Ele não decide sozinho: quem aprova é a diretora técnica. As regras citam a norma e o artigo, e as que ainda estão em validação jurídica aparecem marcadas. A Jalecon não substitui parecer jurídico."],
    ["A IA fala com o paciente sem ninguém olhando?", "Um especialista em marketing médico supervisiona as clínicas. O agente não dá diagnóstico, não indica remédio, orienta urgência para o 192 e passa a conversa para uma pessoa sempre que pedem."],
    ["O conteúdo não vai ficar genérico?", "Cada médico tem identidade e tom próprios, e revisa antes de publicar. Os revisores de clareza e de ciência cortam exagero e jargão antes de o texto chegar a ele."],
    ["Preciso trocar o sistema de agenda?", "Não. A Jalecon se liga à agenda que a clínica já usa. No piloto, essa ligação é feita com a nossa equipe; a integração automática completa é a próxima etapa."],
    ["Em quanto tempo vejo resultado?", "A primeira medição sai em 30 dias, no painel. A meta do piloto é medida no terceiro mês: 11 consultas a mais por mês, o que paga a mensalidade."],
    ["E o médico que atende sozinho, em consultório?", "Hoje a Jalecon é vendida para clínicas, onde a conta fecha para os dois lados. O médico de consultório usa a Jalecon pela clínica onde atende, com a própria marca. Um plano individual fica para depois do piloto."]
  ];
  var PASSOS = [
    ["Semana 1", "Anamnese com o gestor, acesso ao WhatsApp da clínica e à agenda, cadastro dos médicos e do diretor técnico."],
    ["Semana 2", "Marca, site e perfil no Google de cada médico; primeiro mês de conteúdo revisado pela IA."],
    ["Semana 3", "Médicos revisam, Guardião checa, diretora técnica aprova. WhatsApp começa a responder e agendar."],
    ["Semana 4", "Painel no ar e primeira medição de contatos e consultas, comparada com o mês anterior."],
    ["Mês 3", "Revisão das metas com a clínica: 11 consultas a mais por mês e nenhum cancelamento."]
  ];

  /* ---------- página ---------- */
  V.proposta = function () {
    var pr = estado(), k = conta(), d = k.d, conc = N.CONCORRENCIA, pp = P.placarPacientes();
    var pessoa = PESSOAS[pr.persona] || PESSOAS.gestor;
    var idxCena = function (id) { var l = J.CENAS || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return i; return 0; };
    var inp = function (id, rot, val, ajuda, extra) { return '<div class="field"><label for="pp-' + id + '">' + esc(rot) + '</label><input id="pp-' + id + '" inputmode="numeric" data-in="prop" data-id="' + id + '" value="' + esc(val) + '"' + (extra || "") + ">" + (ajuda ? '<span class="help">' + esc(ajuda) + "</span>" : "") + "</div>"; };
    var sel = function (id, rot, lista, val) { return '<div class="field"><label for="pp-' + id + '">' + esc(rot) + '</label><select id="pp-' + id + '" data-in="prop" data-id="' + id + '">' + lista.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(val) ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></div>"; };

    return '<article class="prop">' +
      /* hero */
      '<section class="prop-hero"><div class="ph-txt"><span class="eyebrow">Proposta comercial · ' + esc(d.nome) + " · " + esc(k.plano.nome) + '</span><h1 tabindex="-1">Do post à consulta, num lugar só.</h1>' +
      '<p class="lead">Hoje a clínica paga uma agência que não fala com a recepção, um atendimento que não sabe o que o post prometeu e uma agenda que ninguém liga ao anúncio. A Jalecon junta tudo: a marca e o conteúdo de cada médico, o WhatsApp que responde e agenda, a confirmação contra faltas e o painel que mostra qual post virou consulta. Cada peça é checada pelo Guardião e aprovada pela diretora técnica.</p><p class="sub-lead">Mais pacientes certos na agenda, sem arriscar o CRM.</p>' +
      '<div class="row wrap"><button class="btn" type="button" data-go="demo/0">Ver funcionando (5 min)</button><button class="btn ghost" type="button" data-act="prop-ir-piloto">Quero o piloto</button></div></div>' +
      '<div class="prop-num" id="p-hero">' + heroNum(k) + "</div></section>" +

      /* problema */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">Onde a clínica perde pacientes hoje</span><h2>De cada 100 pessoas que procuram a ' + esc(d.nome) + ", " + k.hoje100 + " viram paciente.</h2><p>" + fmt(k.r.contatos) + " contatos novos por mês. " + fmt(k.r.perdidos) + " se perdem antes da consulta: ninguém responde a tempo, ninguém confirma, ninguém mede.</p></div>" +
      '<div class="g-side"><div class="card"><div class="wfs" id="p-waffle">' + blocoWaffle(k) + '</div><p class="small">Cada quadrado é 1 em cada 100 contatos de pacientes novos. Estimativa do raio-x com as respostas da anamnese.</p></div>' +
      '<div class="card"><h3 class="t">O que o raio-x encontrou</h3><ul class="list">' + k.r.lacunas.map(function (l) { return '<li><span style="color:var(--clay)">' + ICON.warn + "</span>" + esc(l) + "</li>"; }).join("") + "</ul></div></div></section>" +

      /* conta */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">A conta da clínica</span><h2>A mensalidade se paga com ' + k.pagam + " consultas a mais por mês.</h2><p>Mude os números da clínica e veja a conta refeita na hora.</p></div>" +
      '<div class="g-side"><div class="card" id="p-calc">' + calcRes(k) + "</div>" +
      '<div class="card plano"><div class="g2">' + inp("medicos", "Médicos", d.medicos) + inp("contatos", "Contatos novos por semana", d.contatos) + inp("ticket", "Consulta particular (R$)", d.ticket) + inp("gasto", "Agência e atendimento hoje (R$/mês)", (+d.gastoAgencia || 0) + (+d.gastoOutros || 0)) + sel("resposta", "Primeira resposta hoje", C.RESPOSTA, d.resposta) + sel("faltas", "Faltas hoje", C.FALTAS, d.faltas) + "</div>" +
      '<fieldset><legend>Cenário</legend><div class="seg"><button type="button" data-act="prop-fator" data-f="0.5" class="' + (pr.fator < 1 ? "on" : "") + '">Conservador (metade)</button><button type="button" data-act="prop-fator" data-f="1" class="' + (pr.fator === 1 ? "on" : "") + '">Estimativa do raio-x</button></div></fieldset>' +
      '<label class="row" style="font-size:13.5px;cursor:pointer"><input type="checkbox" data-act-change="prop-subst"' + (pr.substitui ? " checked" : "") + "> A Jalecon substitui a agência e o atendimento atuais</label></div></div></section>" +

      /* entregas */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">O que a clínica recebe</span><h2>Captação e atendimento num fornecedor só.</h2></div><div class="g3">' +
      ENTREGAS.map(function (e, i) { return '<div class="card entrega"><span class="en">' + (i + 1) + "</span><h3 class=\"t\">" + esc(e[0]) + "</h3><p class=\"small\">" + esc(e[1]) + '</p><button class="link" type="button" data-go="demo/' + idxCena(e[2]) + '">Ver funcionando</button></div>'; }).join("") + "</div></section>" +

      /* integração */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">O que só a integração mostra</span><h2>Qual post, de qual médico, virou consulta, e quanto rendeu.</h2><p>Quando cada parte está num fornecedor, ninguém liga o conteúdo à agenda. Na Jalecon, é uma linha só.</p></div>' +
      '<div class="g2"><div class="card"><h3 class="t">Hoje, cada solução enxerga uma parte</h3><div class="forn">' + [["Agência", "acompanha alcance e curtidas"], ["Anúncios", "acompanham cliques"], ["Atendimento", "acompanha as mensagens"], ["Agenda", "acompanha as consultas"]].map(function (x) { return "<div><b>" + esc(x[0]) + "</b><small>" + esc(x[1]) + "</small></div>"; }).join("") + '</div><p class="sub-lead" style="font-size:18px;margin:6px 0 0!important">Cada parte funciona, mas a clínica ainda não consegue ver o caminho inteiro, do post à consulta.</p><p class="small">Hoje a ' + esc(d.nome) + " gasta " + brl((+d.gastoAgencia || 0) + (+d.gastoOutros || 0) + (+d.gastoAnuncios || 0)) + " por mês com agência, atendimento e anúncios, sem medir quantas consultas isso gera.</p></div>" +
      '<div class="card live"><h3 class="t">Com a Jalecon, a jornada inteira</h3><ol class="jornada">' + [["Post publicado", "“Dor no joelho: quando procurar”, do Dr. Rafael, aprovado pela diretora técnica"], ["Paciente vê e pesquisa", "Acha o perfil no Google e toca em agendar"], ["WhatsApp", "Resposta em segundos e consulta marcada"], ["Véspera", "Confirmou pelo lembrete"], ["Consulta", brl(k.ticket) + " atribuídos ao post e ao médico"]].map(function (x) { return '<li class="ok"><b>' + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></li>"; }).join("") + '</ol><p class="small">Exemplo da demonstração. O Estrategista usa isso no mês seguinte: mais temas que viram consulta, menos temas que só dão curtida.</p></div></div></section>' +

      /* pessoas */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">Para cada pessoa da clínica</span><h2>Todo mundo ganha, e ninguém trabalha a mais.</h2></div>' +
      '<div class="tabs" role="tablist">' + Object.keys(PESSOAS).map(function (k2) { return '<button type="button" role="tab" aria-selected="' + (pr.persona === k2) + '" class="' + (pr.persona === k2 ? "on" : "") + '" data-act="prop-pessoa" data-p="' + k2 + '">' + esc(PESSOAS[k2].rot) + "</button>"; }).join("") + "</div>" +
      '<div class="card pessoa"><h3 class="t">' + esc(pessoa.t) + '</h3><ul class="list">' + pessoa.b.map(function (t) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + esc(t) + "</li>"; }).join("") + '</ul><button class="link" type="button" data-go="demo/' + idxCena(pessoa.cena) + '">Ver na demonstração</button></div>' +
      "</section>" +

      /* hoje × jalecon */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">Hoje × com a Jalecon</span><h2>A clínica troca três ou quatro fornecedores por um.</h2></div><div class="card"><div class="tb-wrap"><table class="tb"><thead><tr><th></th>' + conc.colunas.map(function (x) { return "<th>" + esc(x) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      conc.linhas.map(function (l) { return "<tr" + (l[0] === "Jalecon" ? ' class="destaque"' : "") + "><th>" + esc(l[0]) + "</th>" + l.slice(1).map(function (x, i) { return "<td>" + esc(l[0] === "Jalecon" && i === 4 ? brl(k.preco) + " (" + k.plano.nome + ")" : x) + "</td>"; }).join("") + "</tr>"; }).join("") +
      '</tbody></table></div><p class="small">Preços públicos dos sites (out/2026); agências, faixa de mercado. Hoje a ' + esc(d.nome) + " gasta " + brl((+d.gastoAgencia || 0) + (+d.gastoOutros || 0)) + " por mês com agência e atendimento, fora " + brl(+d.gastoAnuncios || 0) + " de anúncios.</p></div></section>" +

      /* como começa */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">Como começa</span><h2>Em 30 dias, a clínica está no ar e medindo.</h2></div><ol class="passos">' + PASSOS.map(function (p) { return "<li><b>" + esc(p[0]) + "</b><span>" + esc(p[1]) + "</span></li>"; }).join("") + "</ol></section>" +

      /* segurança */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">Segurança e conformidade</span><h2>Feito para quem responde no CRM.</h2></div><div class="g4">' +
      [["39 regras", "CFM 2.336/2023, Código de Ética Médica, CFM 2.454/2026, LGPD, CDC, Anvisa e políticas da Meta e do Google."], ["Aprovação registrada", "Só a diretora técnica aprova. Cada decisão fica com data, hora e as regras checadas."], ["LGPD no atendimento", "O agente não pede exames nem detalhes de saúde além do motivo da consulta."], ["Validação jurídica", "12 regras estão em validação com advogado de direito médico e aparecem marcadas."]].map(function (x) { return '<div class="card"><b>' + esc(x[0]) + '</b><p class="small">' + esc(x[1]) + "</p></div>"; }).join("") + "</div></section>" +

      /* evidências */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">Por que acreditar</span><h2>O que ouvimos de pacientes, médicos e o mercado.</h2></div><div class="g4">' +
      [[pp.linhas[1].valor, "dos pacientes já desistiram de um médico por demora na resposta", "Pesquisa Jalecon, " + pp.n + " pacientes"], [pp.linhas[3].valor, "aceitam marcar com assistente virtual, a maioria podendo falar com uma pessoa", "Pesquisa Jalecon, " + pp.n + " pacientes"], ["24%", "das clínicas convertem contatos com processo, embora 75% invistam em anúncios", "Panorama Doctoralia e Feegow"], ["10 a 25%", "dos pacientes faltam à consulta; nas férias, mais de 30%", "Panorama Doctoralia e Feegow"]].map(function (x) { return '<div class="card evid"><b class="num">' + esc(x[0]) + "</b><p>" + esc(x[1]) + '</p><span class="small">' + esc(x[2]) + "</span></div>"; }).join("") + "</div></section>" +

      /* investimento */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">Investimento</span><h2>Uma mensalidade pelo porte da clínica.</h2><p>Implantação de uma mensalidade. Verba de anúncios à parte. Sem cobrança por consulta. Contrato anual com desconto.</p></div><div class="g3">' +
      ["essencial", "pro", "rede"].map(function (id) { var pl = C.PLANOS[id], on = id === k.r.plano; return '<div class="card' + (on ? " accent" : "") + '"><div class="row between"><b>' + esc(pl.nome) + "</b>" + (on ? '<span class="pill ok">indicado para a ' + esc(d.nome) + "</span>" : "") + '</div><span class="preco num">' + brl(pl.preco) + '<small>/mês</small></span><span class="small">' + esc(pl.porte) + "</span></div>"; }).join("") +
      '</div><div class="card"><ul class="list cols2">' + C.INCLUI.map(function (x) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + esc(x) + "</li>"; }).join("") + "</ul></div></section>" +

      /* piloto */
      '<section class="prop-sec prop-piloto" id="piloto"><div class="sec-h"><span class="eyebrow">Comece pelo piloto</span><h2>3 meses no plano Pro, com meta combinada.</h2><p>Estamos chamando 3 a 5 clínicas de 5 a 10 médicos. A clínica paga a mensalidade normal e combina duas metas com a gente: 11 consultas a mais por mês e conseguir deixar de pagar pelo menos um fornecedor atual. Se não bater, revemos preço e escopo juntos.</p></div>' +
      '<div class="g-side"><div class="g3 kp3">' + J.kpi("Prazo", "3 meses", "com dados reais") + J.kpi("Meta", "+11", "consultas por mês") + J.kpi("Mensalidade", brl(4900), "plano Pro") + "</div>" +
      (pr.enviado ? '<div class="card live"><p class="ok-line">' + ICON.ok + "<b>Pedido pronto.</b></p><p>Abrimos o seu e-mail com a mensagem preenchida. Se não abriu, escreva para <b>falejalecon@gmail.com</b>.</p></div>" :
        '<form class="card" data-sub="prop-piloto"><div class="g2"><div class="field"><label for="pp-nome">Seu nome</label><input id="pp-nome" name="nome" autocomplete="name" required></div><div class="field"><label for="pp-cargo">Cargo</label><input id="pp-cargo" name="cargo" placeholder="Sócio, gestor, diretor técnico"></div></div><div class="field"><label for="pp-contato">WhatsApp ou e-mail</label><input id="pp-contato" name="contato" required></div><button class="btn" type="submit">Quero a ' + esc(d.nome) + ' no piloto</button><p class="small">Ou escreva para <b>falejalecon@gmail.com</b>.</p></form>') + "</div></section>" +

      /* faq */
      '<section class="prop-sec"><div class="sec-h"><span class="eyebrow">Perguntas que todo gestor faz</span></div><div class="faq">' + FAQ.map(function (f, i) { return "<details" + (i === 5 ? " open" : "") + "><summary>" + esc(f[0]) + "</summary><p>" + esc(f[1]) + "</p></details>"; }).join("") + "</div></section>" +

      '<footer class="prop-pe"><span>Jalecon · Grupo 1 · Digital Innovation Strategy · Insper · 2026</span><span>Clínica e números da clínica fictícios; dados da pesquisa reais. Estimativas não são resultado prometido.</span></footer></article>';
  };

  I.prop = function (t) {
    var d = J.S.diag, id = t.dataset.id, v = J.num(t.value);
    if (id === "gasto") { d.gastoAgencia = v; d.gastoOutros = 0; }
    else if (id === "medicos") d.medicos = Math.max(2, Math.min(60, v || 2));
    else d[id] = v;
    atualizar();
    return false;
  };
  A["prop-fator"] = function (b) { estado().fator = +b.dataset.f; J.render(); };
  A["change:prop-subst"] = function (t) { estado().substitui = t.checked; atualizar(); J.salvar(); };
  A["prop-pessoa"] = function (b) { estado().persona = b.dataset.p; J.render(); };
  A["prop-ir-piloto"] = function () { var el = document.getElementById("piloto"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  A["submit:prop-piloto"] = function (f) {
    var d = J.S.diag, k = conta();
    var corpo = "Olá, Jalecon!\n\nQuero conversar sobre o piloto para a " + d.nome + " (" + d.medicos + " médicos, " + d.cidade + ").\n\nNome: " + f.nome.value + "\nCargo: " + f.cargo.value + "\nContato: " + f.contato.value + "\n\nEstimativa da proposta: " + k.cons + " consultas a mais por mês.";
    estado().enviado = true;
    J.render();
    try { location.href = "mailto:falejalecon@gmail.com?subject=" + encodeURIComponent("Piloto Jalecon · " + d.nome) + "&body=" + encodeURIComponent(corpo); } catch (e) { /* ok */ }
  };
})(window.JW);
