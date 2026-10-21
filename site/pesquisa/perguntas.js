/* Jalecon · perguntas da pesquisa sem agenda (documento 13).
 * Cada seção é uma página. A proposta só aparece depois da pergunta aberta sobre
 * o que trava ou preocupa, para medir se CFM, CRM ou diretor técnico aparecem sozinhos.
 * Tipos: radio, checks, number, text, textarea. "se" mostra a pergunta só quando a condição vale.
 * "encerra" (radio) e "encerraSe" (número) terminam a pesquisa sem enviar: a pessoa está fora do público.
 * "nota" é só um texto entre as perguntas.
 */
(function (g) {
  "use strict";
  var SIM_NAO = [["sim", "Sim"], ["nao", "Não"]];
  var PRECO = [
    { id: "p_barato", tipo: "number", rot: "A partir de quanto seria tão barato que você desconfiaria da qualidade?", pre: "R$", obrig: true },
    { id: "p_bom", tipo: "number", rot: "Quanto seria um bom negócio?", pre: "R$", obrig: true },
    { id: "p_caro", tipo: "number", rot: "A partir de quanto ficaria caro, mas você ainda consideraria?", pre: "R$", obrig: true },
    { id: "p_caro_demais", tipo: "number", rot: "A partir de quanto seria caro demais?", pre: "R$", obrig: true }
  ];

  var MEDICOS = {
    titulo: "Como médicos divulgam o próprio trabalho",
    intro: "Pesquisa acadêmica do Insper. São 4 páginas curtas, cerca de 5 minutos. As respostas são anônimas e usadas só neste projeto.",
    secoes: [
      { titulo: "Você", perguntas: [
        { id: "filtro", tipo: "radio", rot: "Você atende em consultório particular (próprio, compartilhado ou em clínica) pelo menos um período por semana?", ops: SIM_NAO, obrig: true, encerra: "nao" },
        { id: "especialidade", tipo: "text", rot: "Qual é a sua especialidade?", obrig: true },
        { id: "anos", tipo: "radio", rot: "Há quanto tempo você atende em consultório?", ops: [["ate3", "Até 3 anos"], ["4a10", "4 a 10 anos"], ["mais10", "Mais de 10 anos"]], obrig: true },
        { id: "particular", tipo: "radio", rot: "Mais ou menos que parte dos seus pacientes de consultório é particular?", ops: [["10", "Até 20%"], ["35", "20% a 50%"], ["65", "50% a 80%"], ["90", "Mais de 80%"]], obrig: true },
        { id: "fonte", tipo: "radio", rot: "De onde vem a maior parte dos seus pacientes novos?", ops: [["Indicação de pacientes", "Indicação de pacientes"], ["Indicação de colegas", "Indicação de colegas"], ["Convênio", "Convênio"], ["Google", "Google"], ["Instagram", "Instagram"], ["Doctoralia ou outra agenda on-line", "Doctoralia ou outra agenda on-line"], ["Outro", "Outro"]], obrig: true },
        { id: "proximo", tipo: "radio", rot: "Você conhece pessoalmente alguém do grupo que te enviou esta pesquisa?", ops: SIM_NAO, obrig: true }
      ] },
      { titulo: "Hoje", perguntas: [
        { id: "agenda", tipo: "radio", rot: "Sua agenda particular hoje está como você gostaria?", ops: [["sim", "Sim, está como eu gostaria"], ["nao", "Não, gostaria de mais pacientes particulares"]], obrig: true },
        { id: "ultima", tipo: "textarea", rot: "Qual foi a última coisa que você fez para divulgar seu trabalho ou atrair pacientes? Quando foi?", obrig: true },
        { id: "pagou", tipo: "checks", rot: "Nos últimos 12 meses, você pagou por alguma destas opções? Marque todas que valem.", ops: [["Agência", "Agência"], ["Freelancer", "Freelancer"], ["Doctoralia paga", "Doctoralia ou outra agenda paga"], ["Anúncio ou impulsionamento", "Anúncio ou impulsionamento"], ["Ferramenta paga", "Ferramenta paga"], ["nada", "Não paguei por nada disso"]], obrig: true, exclusivo: "nada" },
        { id: "gasto", tipo: "number", rot: "Quanto, no total, por mês?", pre: "R$", se: function (r) { return pagou(r); } },
        { id: "meses", tipo: "number", rot: "Há quantos meses você usa (ou usou) o último que pagou?", suf: "meses", se: function (r) { return pagou(r); } },
        { id: "ainda", tipo: "radio", rot: "Ainda usa?", ops: SIM_NAO, se: function (r) { return pagou(r); } },
        { id: "parou", tipo: "text", rot: "Por que parou?", se: function (r) { return pagou(r) && r.ainda === "nao"; } },
        { id: "trouxe", tipo: "textarea", rot: "Trouxe pacientes? Como você sabe?", se: function (r) { return pagou(r); } },
        { id: "trava", tipo: "textarea", rot: "O que mais te trava quando você pensa em divulgar seu trabalho?", obrig: true }
      ] },
      { titulo: "Duas ideias", texto: [
        "Estamos testando duas ideias:",
        "(a) Uma plataforma que cria sua marca, seu site e seus posts com IA. Você ajusta conversando, e cada peça é checada nas regras do CFM antes de publicar.",
        "(b) Uma equipe de agentes de IA, supervisionada por um especialista, que faz tudo por você: marca, site, perfil no Google, posts, anúncios e atendimento no WhatsApp. Você só aprova."
      ], perguntas: [
        { id: "atrai", tipo: "textarea", rot: "O que te atrai e o que te deixa desconfiado?", obrig: true },
        { id: "ia", tipo: "radio", rot: "Você publicaria um conteúdo criado com IA se pudesse revisar antes e se ele fosse checado nas regras do CFM?", ops: [["Sim", "Sim"], ["Depende", "Depende"], ["Não", "Não"]], obrig: true },
        { id: "duvida", tipo: "radio", rot: "Você já teve dúvida se um post podia ser publicado, ou viu algum colega ter problema com o CRM por publicidade?", ops: SIM_NAO, obrig: true }
      ] },
      { titulo: "Preço", texto: ["Pensando na opção (a), com marca, site, perfil no Google e 24 posts por mês. Valores em reais por mês."], perguntas: PRECO.concat([
        { id: "escolha", tipo: "radio", rot: "Se (a) custasse R$ 697 por mês e (b) R$ 1.790 por mês mais a verba de anúncios, qual você escolheria?", ops: [["Plataforma", "(a) A plataforma"], ["Equipe", "(b) A equipe"], ["Nenhuma", "Nenhuma das duas"]], obrig: true },
        { id: "piloto", tipo: "radio", rot: "Você toparia testar a opção escolhida por 3 meses?", ops: [["Sim", "Sim"], ["Talvez", "Talvez"], ["Não", "Não"]], obrig: true, se: function (r) { return r.escolha && r.escolha !== "Nenhuma"; } },
        { id: "condicao", tipo: "textarea", rot: "O que precisaria ser verdade para você dizer sim?" },
        { id: "contato", tipo: "text", rot: "Se quiser receber o resultado ou indicar um colega, deixe um WhatsApp ou e-mail." }
      ]) }
    ]
  };

  var CLINICAS = {
    titulo: "Como clínicas lidam com marketing e atendimento",
    intro: "Pesquisa acadêmica do Insper. São 4 páginas curtas, cerca de 5 minutos. As respostas são anônimas e usadas só neste projeto.",
    secoes: [
      { titulo: "A clínica", perguntas: [
        { id: "filtro", tipo: "radio", rot: "Você participa da decisão de contratar marketing na clínica?", ops: SIM_NAO, obrig: true, encerra: "nao" },
        { id: "medicos", tipo: "number", rot: "Quantos médicos (ou dentistas) atendem na clínica?", obrig: true, min: 1, max: 500, encerraSe: function (v) { return v < 2 || v > 15; } },
        { id: "unidades", tipo: "number", rot: "Quantas unidades?", obrig: true, min: 1, max: 100 },
        { id: "especialidades", tipo: "text", rot: "Quais são as especialidades principais?", obrig: true },
        { id: "particular", tipo: "radio", rot: "Que parte da receita vem de pacientes particulares?", ops: [["30", "Menos da metade"], ["65", "Mais da metade"], ["90", "Quase tudo"]], obrig: true, encerra: "30" },
        { id: "proximo", tipo: "radio", rot: "Você conhece pessoalmente alguém do grupo que te enviou esta pesquisa?", ops: SIM_NAO, obrig: true }
      ] },
      { titulo: "Hoje", perguntas: [
        { id: "quem", tipo: "text", rot: "Quem cuida hoje do marketing da clínica?", obrig: true },
        { id: "paga", tipo: "radio", rot: "Nos últimos 12 meses, a clínica pagou agência, freelancer, anúncios ou ferramenta de marketing?", ops: SIM_NAO, obrig: true },
        { id: "gasto", tipo: "number", rot: "Quanto a clínica paga por mês por isso, sem contar a verba de anúncio?", pre: "R$", se: function (r) { return r.paga === "sim"; } },
        { id: "midia", tipo: "number", rot: "E quanto vai por mês para anúncios?", pre: "R$", se: function (r) { return r.paga === "sim"; } },
        { id: "meses", tipo: "number", rot: "Há quantos meses estão com o fornecedor atual?", suf: "meses", se: function (r) { return r.paga === "sim"; } },
        { id: "resultado", tipo: "checks", rot: "O que incomoda no resultado do marketing de hoje? Marque todas que valem.", ops: [["Não sabemos se traz pacientes", "Não sabemos se traz pacientes"], ["Traz pacientes fora do perfil", "Traz pacientes fora do perfil"], ["O fornecedor demora ou some", "O fornecedor demora ou some"], ["Custa caro para o que entrega", "Custa caro para o que entrega"], ["Outro problema", "Outro problema"], ["nada", "Nada, estamos satisfeitos"]], obrig: true, exclusivo: "nada" },
        { id: "decisores", tipo: "radio", rot: "Na última vez que contrataram marketing, quantas pessoas decidiram?", ops: [["1", "1"], ["2", "2"], ["3", "3 ou mais"]], obrig: true },
        { id: "dias", tipo: "radio", rot: "Quanto tempo levou da primeira conversa até fechar?", ops: [["30", "Até 30 dias"], ["60", "31 a 60 dias"], ["90", "61 a 90 dias"], ["120", "Mais de 90 dias"]], obrig: true },
        { id: "fora", tipo: "radio", rot: "Alguém responde os pacientes novos no WhatsApp à noite e no fim de semana?", ops: SIM_NAO, obrig: true },
        { id: "mede", tipo: "radio", rot: "Vocês sabem, com número, quantos contatos do WhatsApp viram consulta?", ops: SIM_NAO, obrig: true },
        { id: "faltas", tipo: "radio", rot: "Mais ou menos quantos pacientes faltam às consultas?", ops: [["Até 10%", "Até 10%"], ["10% a 20%", "10% a 20%"], ["20% a 30%", "20% a 30%"], ["Mais de 30%", "Mais de 30%"], ["Não sei", "Não sei"]], obrig: true },
        { id: "preocupa", tipo: "textarea", rot: "O que mais te incomoda ou preocupa no marketing da clínica hoje?", obrig: true }
      ] },
      { titulo: "Uma ideia", texto: [
        "Estamos testando esta ideia: uma equipe de marketing e atendimento operada por agentes de IA e supervisionada por um especialista.",
        "Ela cuida da marca, do site e do perfil no Google de cada médico, dos posts e dos anúncios, e responde os pacientes no WhatsApp 24 horas, agendando direto na agenda da clínica.",
        "Nada vai ao ar sem passar nas regras do CFM, com registro para o diretor técnico, e um painel mostra quantos contatos viraram consulta, por canal e por médico."
      ], perguntas: [
        { id: "atrai", tipo: "textarea", rot: "O que te atrai e o que te deixa desconfiado?", obrig: true },
        { id: "pesa", tipo: "radio", rot: "A conformidade com o CFM e a proteção do diretor técnico mudam alguma coisa para vocês?", ops: [["Muito", "Muito"], ["Um pouco", "Um pouco"], ["Nada", "Nada"]], obrig: true },
        { id: "nota_preco", tipo: "nota", rot: "Agora, preço. Para uma clínica do tamanho da sua, sem contar a verba de anúncio, em reais por mês:" }
      ].concat(PRECO) },
      { titulo: "Piloto", textoFn: function (r) {
        var n = +r.medicos || 0, v = n >= 11 ? "8.900" : n >= 5 ? "4.900" : "2.900";
        return ["Para uma clínica do porte da sua, o plano seria de R$ " + v + " por mês, mais uma mensalidade de implantação, sem contar a verba de anúncios."];
      }, perguntas: [
        { id: "piloto", tipo: "radio", rot: "Vocês topariam conversar sobre um piloto pago de 3 meses, sem fidelidade depois?", ops: [["Sim", "Sim"], ["Talvez", "Talvez"], ["Não", "Não"]], obrig: true },
        { id: "substitui", tipo: "radio", rot: "Isso substituiria o que vocês têm hoje ou viria junto?", ops: [["Substituiria", "Substituiria"], ["Viria junto", "Viria junto"], ["Não sei", "Não sei"]], obrig: true },
        { id: "condicao", tipo: "textarea", rot: "O que precisaria ser verdade para dizer sim?" },
        { id: "contato", tipo: "text", rot: "Se quiser receber o resultado ou indicar outro gestor, deixe um WhatsApp ou e-mail." }
      ] }
    ]
  };

  function pagou(r) { return Array.isArray(r.pagou) && r.pagou.length && r.pagou.indexOf("nada") < 0; }

  g.PESQUISA = { medicos: MEDICOS, clinicas: CLINICAS };
})(window);
