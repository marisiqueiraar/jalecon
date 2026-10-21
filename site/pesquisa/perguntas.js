/* Jalecon · perguntas da pesquisa sem agenda (documento 13, versão 2 de 21/10).
 * Cada seção é uma página. A proposta só aparece depois da pergunta aberta sobre
 * o que trava ou preocupa, para medir se CFM, CRM ou diretor técnico aparecem sozinhos.
 * Tipos: radio, checks, select, number, text, textarea. "se" mostra a pergunta (ou a página inteira) só quando a condição vale.
 * "obrig" e "rot" podem depender das respostas (função). "voltar" numa página mostra o botão de voltar.
 * "encerra" (radio) e "encerraSe" (número) terminam a pesquisa sem enviar: a pessoa está fora do público.
 * "nota" é só um texto entre as perguntas. A resposta "ns" (não sei) é enviada vazia: não entra nas medianas nem conta como "sim".
 * Faixas (gasto, contatos, tempo de resposta) são enviadas como número: ponto médio ou limite da faixa.
 */
(function (g) {
  "use strict";
  var SIM_NAO = [["sim", "Sim"], ["nao", "Não"]];
  var ESPECIALIDADES = ["Cardiologia", "Cirurgia geral", "Cirurgia plástica", "Clínica médica", "Dermatologia", "Endocrinologia", "Gastroenterologia",
    "Ginecologia e obstetrícia", "Neurologia", "Oftalmologia", "Ortopedia e traumatologia", "Otorrinolaringologia", "Pediatria", "Psiquiatria", "Urologia"].map(function (e) { return [e, e]; });
  function comPreco(r) { return !(Array.isArray(r.p_ns) && r.p_ns.length); }
  var PRECO = [
    { id: "p_ns", tipo: "checks", rot: "Se não tiver ideia de valores, marque aqui e siga em frente.", ops: [["ns", "Não sei dizer valores"]] },
    { id: "p_barato", tipo: "number", rot: "A partir de quanto seria tão barato que você desconfiaria da qualidade?", pre: "R$", obrig: true, se: comPreco },
    { id: "p_bom", tipo: "number", rot: "Quanto seria um bom negócio?", pre: "R$", obrig: true, se: comPreco },
    { id: "p_caro", tipo: "number", rot: "A partir de quanto ficaria caro, mas você ainda consideraria?", pre: "R$", obrig: true, se: comPreco },
    { id: "p_caro_demais", tipo: "number", rot: "A partir de quanto seria caro demais?", pre: "R$", obrig: true, se: comPreco }
  ];
  /* Pedido de compromisso: se a pessoa quer ser chamada, o contato vira obrigatório. */
  function chamar(rot, se) { return { id: "chamar", tipo: "radio", rot: rot, ops: SIM_NAO, obrig: true, se: se }; }
  function contato(rotLivre) {
    return { id: "contato", tipo: "text", obrig: function (r) { return r.chamar === "sim"; },
      rot: function (r) { return r.chamar === "sim" ? "Deixe um WhatsApp ou e-mail para a gente te chamar." : rotLivre; } };
  }

  var MEDICOS = {
    titulo: "Como médicos divulgam o próprio trabalho",
    intro: "Pesquisa acadêmica do Insper. São 5 páginas curtas, cerca de 6 minutos. As respostas são anônimas e usadas só neste projeto.",
    secoes: [
      { titulo: "Você", perguntas: [
        { id: "filtro", tipo: "radio", rot: "Você atende em consultório particular (próprio, compartilhado ou em clínica) pelo menos um período por semana?", ops: SIM_NAO, obrig: true, encerra: "nao" },
        { id: "especialidade", tipo: "select", rot: "Qual é a sua especialidade?", ops: ESPECIALIDADES.concat([["Outra", "Outra"]]), obrig: true },
        { id: "esp_outra", tipo: "text", rot: "Qual?", obrig: true, se: function (r) { return r.especialidade === "Outra"; } },
        { id: "onde", tipo: "radio", rot: "Onde você atende particular, na maior parte do tempo?", ops: [["Consultório próprio", "Consultório próprio, sozinho"], ["Consultório compartilhado", "Consultório compartilhado ou sublocado"], ["Clínica de outra pessoa", "Em clínica de outra pessoa"], ["Sócio de clínica", "Em clínica da qual sou sócio"]], obrig: true },
        { id: "anos", tipo: "radio", rot: "Há quanto tempo você atende em consultório?", ops: [["ate3", "Até 3 anos"], ["4a10", "4 a 10 anos"], ["mais10", "Mais de 10 anos"]], obrig: true },
        { id: "particular", tipo: "radio", rot: "Mais ou menos que parte dos seus pacientes de consultório é particular?", ops: [["10", "Até 20%"], ["35", "20% a 50%"], ["65", "50% a 80%"], ["90", "Mais de 80%"], ["ns", "Não sei"]], obrig: true },
        { id: "fonte", tipo: "radio", rot: "De onde vem a maior parte dos seus pacientes novos?", ops: [["Indicação de pacientes", "Indicação de pacientes"], ["Indicação de colegas", "Indicação de colegas"], ["Convênio", "Convênio"], ["Google", "Google"], ["Instagram", "Instagram"], ["Doctoralia ou outra agenda on-line", "Doctoralia ou outra agenda on-line"], ["Outro", "Outro"], ["Não sei", "Não sei"]], obrig: true },
        { id: "proximo", tipo: "radio", rot: "Você conhece pessoalmente alguém do grupo que te enviou esta pesquisa?", ops: SIM_NAO, obrig: true }
      ] },
      { titulo: "Hoje", voltar: true, perguntas: [
        { id: "quer_mais", tipo: "radio", rot: "Você gostaria de atender mais pacientes particulares do que atende hoje?", ops: SIM_NAO, obrig: true },
        { id: "vagas", tipo: "radio", rot: "Se esses pacientes chegassem na semana que vem, você teria horário para atendê-los?", ops: [["sim", "Sim, tenho horário livre"], ["talvez", "Teria que reorganizar a agenda"], ["nao", "Não, minha agenda está cheia"]], obrig: true, se: function (r) { return r.quer_mais === "sim"; } },
        { id: "pagou", tipo: "checks", rot: "Nos últimos 12 meses, você pagou por alguma destas opções para divulgar seu trabalho? Marque todas que valem.", ops: [["Agência", "Agência"], ["Freelancer", "Freelancer"], ["Doctoralia paga", "Doctoralia ou outra agenda paga"], ["Anúncio ou impulsionamento", "Anúncio ou impulsionamento"], ["Ferramenta paga", "Ferramenta paga"], ["nada", "Não paguei por nada disso"]], obrig: true, exclusivo: "nada" },
        { id: "gasto", tipo: "number", rot: "Quanto, no total, por mês?", pre: "R$", se: pagou },
        { id: "meses", tipo: "number", rot: "Há quantos meses você usa (ou usou) o último que pagou?", suf: "meses", se: pagou },
        { id: "ainda", tipo: "radio", rot: "Ainda usa?", ops: SIM_NAO, obrig: true, se: pagou },
        { id: "parou_motivo", tipo: "checks", rot: "Por que parou? Marque todas que valem.", ops: [["Caro para o resultado", "Caro para o resultado"], ["Não trouxe pacientes", "Não trouxe pacientes"], ["Dava muito trabalho para mim", "Dava muito trabalho para mim"], ["O fornecedor sumiu ou demorava", "O fornecedor sumiu ou demorava"], ["Medo de problema com o CRM", "Medo de problema com o CRM"], ["Outro", "Outro"]], obrig: true, se: function (r) { return pagou(r) && r.ainda === "nao"; } },
        { id: "trava", tipo: "textarea", rot: "O que mais te trava quando você pensa em divulgar seu trabalho?", obrig: true }
      ] },
      { titulo: "Duas ideias", texto: [
        "Estamos testando duas ideias:",
        "(a) Uma plataforma que cria sua marca, seu site e seus posts com IA. Você ajusta conversando, e cada peça é checada nas regras do CFM antes de publicar.",
        "(b) Uma equipe de agentes de IA, supervisionada por um especialista, que faz tudo por você: marca, site, perfil no Google, posts, anúncios e atendimento no WhatsApp. Você só aprova."
      ], perguntas: [
        { id: "atrai", tipo: "textarea", rot: "O que te atrai e o que te deixa desconfiado?" },
        { id: "ia", tipo: "radio", rot: "Você publicaria um conteúdo criado com IA se pudesse revisar antes e se ele fosse checado nas regras do CFM?", ops: [["Sim", "Sim"], ["Depende", "Depende"], ["Não", "Não"]], obrig: true },
        { id: "preferida", tipo: "radio", rot: "Se tivesse que escolher uma, qual seria?", ops: [["Plataforma", "(a) A plataforma"], ["Equipe", "(b) A equipe"], ["Nenhuma", "Nenhuma das duas"]], obrig: true }
      ] },
      { titulo: "Preço", se: escolheu, textoFn: function (r) {
        return [r.preferida === "Equipe"
          ? "Pensando na opção (b), a equipe que faz marca, site, perfil no Google, posts, anúncios e atendimento no WhatsApp. Valores em reais por mês, sem contar a verba dos anúncios."
          : "Pensando na opção (a), a plataforma com marca, site, perfil no Google e 24 posts por mês. Valores em reais por mês."];
      }, perguntas: PRECO },
      { titulo: "Para fechar", textoFn: function (r) {
        return escolheu(r) ? ["Os preços que estamos testando: (a) a plataforma, R$ 697 por mês; (b) a equipe, R$ 1.790 por mês mais a verba dos anúncios."] : [];
      }, perguntas: [
        { id: "contrataria", tipo: "radio", rot: "Por esse preço, você contrataria a opção que escolheu?", ops: [["Sim", "Sim"], ["Talvez", "Talvez"], ["Não", "Não"]], obrig: true, se: escolheu },
        { id: "condicao", tipo: "textarea", rot: "O que precisaria ser verdade para você dizer sim?" },
        chamar("Quer que a gente te chame em novembro para testar num piloto pago?", escolheu),
        contato("Se quiser receber o resultado ou indicar um colega, deixe um WhatsApp ou e-mail.")
      ] }
    ],
    fimExtra: function (r) {
      if (r.onde !== "Sócio de clínica") return null;
      return { texto: "Como você é sócio de uma clínica, sua visão de gestor também ajuda muito. Se tiver mais 7 minutos:", link: "../clinicas/", rotulo: "Responder a pesquisa de clínicas" };
    }
  };

  var CLINICAS = {
    titulo: "Como clínicas lidam com marketing e atendimento",
    intro: "Pesquisa acadêmica do Insper. São 5 páginas curtas, cerca de 7 minutos. As respostas são anônimas e usadas só neste projeto.",
    secoes: [
      { titulo: "A clínica", perguntas: [
        { id: "cargo", tipo: "radio", rot: "Qual é o seu papel na clínica?", ops: [["Sócio médico ou dentista", "Sócio(a), médico(a) ou dentista"], ["Sócio ou administrador não médico", "Sócio(a) ou administrador(a), não médico(a)"], ["Diretor técnico", "Diretor(a) técnico(a)"], ["Gerente ou coordenador", "Gerente ou coordenador(a)"], ["Outro", "Outro"]], obrig: true },
        { id: "participa", tipo: "radio", rot: "Você participa da decisão de contratar marketing ou atendimento para a clínica?", ops: SIM_NAO, obrig: true, encerra: "nao" },
        { id: "medicos", tipo: "number", rot: "Quantos médicos (ou dentistas) atendem na clínica?", obrig: true, min: 1, max: 500, encerraSe: function (v) { return v < 2 || v > 15; } },
        { id: "unidades", tipo: "number", rot: "Quantas unidades?", min: 1, max: 100 },
        { id: "esp_lista", tipo: "checks", rot: "Quais são as especialidades principais? Marque todas que valem.", ops: ESPECIALIDADES.concat([["Odontologia", "Odontologia"], ["Outra", "Outra"]]), obrig: true },
        { id: "esp_outra", tipo: "text", rot: "Qual outra?", obrig: true, se: function (r) { return Array.isArray(r.esp_lista) && r.esp_lista.indexOf("Outra") >= 0; } },
        { id: "particular", tipo: "radio", rot: "Que parte da receita vem de pacientes particulares?", ops: [["30", "Menos da metade"], ["65", "Mais da metade"], ["90", "Quase tudo"], ["ns", "Não sei"]], obrig: true, encerra: "30" },
        { id: "proximo", tipo: "radio", rot: "Você conhece pessoalmente alguém do grupo que te enviou esta pesquisa?", ops: SIM_NAO, obrig: true }
      ] },
      { titulo: "Marketing hoje", voltar: true, perguntas: [
        { id: "quer_mais", tipo: "radio", rot: "A clínica quer atender mais pacientes particulares do que atende hoje?", ops: SIM_NAO, obrig: true },
        { id: "vagas", tipo: "radio", rot: "Os médicos têm horário livre para atender mais pacientes?", ops: [["sim", "Sim, sobra horário"], ["alguns", "Alguns médicos sim, outros não"], ["nao", "Não, as agendas estão cheias"]], obrig: true, se: function (r) { return r.quer_mais === "sim"; } },
        { id: "investe", tipo: "radio", rot: "A clínica investe em marketing hoje, ou investiu nos últimos 12 meses?", ops: SIM_NAO, obrig: true },
        { id: "tipos", tipo: "checks", rot: "Em quais destes? Marque todos que valem.", ops: [["Agência de marketing", "Agência de marketing"], ["Freelancer ou social media", "Freelancer ou social media"], ["Anúncios pagos", "Anúncios pagos (Google, Instagram, Facebook)"], ["Site, SEO ou perfil no Google", "Site, SEO ou perfil no Google"], ["Doctoralia ou agenda on-line paga", "Doctoralia ou outra agenda on-line paga"], ["Atendimento de WhatsApp terceirizado", "Secretária virtual, robô ou atendimento de WhatsApp terceirizado"], ["Funcionário dedicado ao marketing", "Funcionário dedicado ao marketing"], ["Ferramenta de marketing", "Ferramenta ou software de marketing"], ["Outro", "Outro"]], obrig: true, se: investe },
        { id: "gasto", tipo: "radio", rot: "Quanto a clínica paga por mês por esses serviços, sem contar a verba dos anúncios?", ops: [["500", "Até R$ 1.000"], ["1750", "R$ 1.000 a 2.500"], ["3750", "R$ 2.500 a 5.000"], ["7500", "R$ 5.000 a 10.000"], ["12500", "Mais de R$ 10.000"], ["ns", "Não sei"]], obrig: true, se: investe },
        { id: "midia", tipo: "radio", rot: "E quanto vai por mês para anúncios?", ops: [["0", "Não anunciamos"], ["500", "Até R$ 1.000"], ["1750", "R$ 1.000 a 2.500"], ["3750", "R$ 2.500 a 5.000"], ["7500", "Mais de R$ 5.000"], ["ns", "Não sei"]], obrig: true, se: investe },
        { id: "satisf", tipo: "radio", rot: "De 1 a 5, quanto vocês estão satisfeitos com o resultado do marketing?", ops: [["1", "1 · nada satisfeitos"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5 · muito satisfeitos"]], obrig: true, se: investe },
        { id: "trocou", tipo: "radio", rot: "Nos últimos 12 meses, vocês trocaram de fornecedor de marketing ou pensaram seriamente em trocar?", ops: [["trocou", "Trocamos"], ["pensou", "Pensamos em trocar"], ["nao", "Não"]], obrig: true, se: investe },
        { id: "resultado", tipo: "checks", rot: "O que incomoda no resultado de hoje? Marque todas que valem.", ops: [["Não sabemos se traz pacientes", "Não sabemos se traz pacientes"], ["Traz pacientes fora do perfil", "Traz pacientes fora do perfil"], ["O fornecedor demora ou some", "O fornecedor demora ou some"], ["Custa caro para o que entrega", "Custa caro para o que entrega"], ["Outro problema", "Outro problema"], ["nada", "Nada, estamos satisfeitos"]], obrig: true, exclusivo: "nada", se: investe },
        { id: "decisores", tipo: "radio", rot: "Na última vez que contrataram marketing, quantas pessoas decidiram?", ops: [["1", "1"], ["2", "2"], ["3", "3 ou mais"], ["ns", "Não sei"]], obrig: true, se: investe },
        { id: "aprova", tipo: "checks", rot: "Quem precisou aprovar? Marque todos.", ops: [["Sócio médico", "Sócio(a) médico(a) ou dentista"], ["Sócio ou administrador não médico", "Sócio(a) ou administrador(a), não médico(a)"], ["Diretor técnico", "Diretor(a) técnico(a)"], ["Gerente", "Gerente ou coordenador(a)"], ["Outro", "Outro"]], obrig: true, se: investe },
        { id: "dias", tipo: "radio", rot: "Quanto tempo levou da primeira conversa até fechar?", ops: [["30", "Até 30 dias"], ["60", "31 a 60 dias"], ["90", "61 a 90 dias"], ["120", "Mais de 90 dias"], ["ns", "Não lembro"]], obrig: true, se: investe },
        { id: "revisa", tipo: "radio", rot: "Hoje, quem revisa os posts e anúncios antes de publicar?", ops: [["Diretor técnico", "O(a) diretor(a) técnico(a)"], ["Sócio ou médico", "Um sócio ou um médico"], ["Agência ou freelancer", "A agência ou o freelancer"], ["Ninguém", "Ninguém revisa"], ["Não publicamos", "Não publicamos posts nem anúncios"], ["ns", "Não sei"]], obrig: true }
      ] },
      { titulo: "Atendimento", voltar: true, perguntas: [
        { id: "contatos", tipo: "radio", rot: "Mais ou menos quantos contatos novos de pacientes chegam por semana no WhatsApp?", ops: [["5", "Até 10"], ["20", "11 a 30"], ["65", "31 a 100"], ["150", "Mais de 100"], ["ns", "Não sei"]], obrig: true },
        { id: "tempo", tipo: "radio", rot: "Em horário comercial, quanto tempo um paciente novo espera pela primeira resposta?", ops: [["15", "Menos de 15 minutos"], ["60", "15 minutos a 1 hora"], ["240", "1 a 4 horas"], ["480", "Mais de 4 horas"], ["ns", "Não sei"]], obrig: true },
        { id: "fora", tipo: "radio", rot: "Alguém responde os pacientes novos no WhatsApp à noite e no fim de semana?", ops: SIM_NAO.concat([["ns", "Não sei"]]), obrig: true },
        { id: "mede", tipo: "radio", rot: "Vocês sabem, com número, quantos contatos do WhatsApp viram consulta?", ops: SIM_NAO, obrig: true },
        { id: "preocupa", tipo: "textarea", rot: "O que mais te incomoda ou preocupa quando você pensa no marketing da clínica?", obrig: true }
      ] },
      { titulo: "Uma ideia", texto: [
        "Estamos testando esta ideia: uma equipe de marketing e atendimento operada por agentes de IA e supervisionada por um especialista.",
        "Ela cuida da marca, do site e do perfil no Google de cada médico, dos posts e dos anúncios, e responde os pacientes no WhatsApp 24 horas, agendando direto na agenda da clínica.",
        "Nada vai ao ar sem passar nas regras do CFM, com registro para o diretor técnico, e um painel mostra quantos contatos viraram consulta, por canal e por médico."
      ], perguntas: [
        { id: "atrai", tipo: "textarea", rot: "O que te atrai e o que te deixa desconfiado?" },
        { id: "peso", tipo: "radio", rot: "Na hora de escolher um fornecedor como esse, o que pesa mais para vocês? Escolha só um.", ops: [["Trazer pacientes", "Trazer mais pacientes"], ["Responder rápido", "Responder rápido os pacientes"], ["Preço", "Preço"], ["Não ter problema com o CRM", "Não ter problema com o CRM"], ["Saber o que funciona", "Saber, com número, o que funciona"]], obrig: true },
        { id: "nota_preco", tipo: "nota", rot: "Agora, preço. Para uma clínica do tamanho da sua, sem contar a verba de anúncio, em reais por mês:" }
      ].concat(PRECO) },
      { titulo: "Piloto", textoFn: function (r) {
        var n = +r.medicos || 0, v = n >= 11 ? "8.900" : n >= 5 ? "4.900" : "2.900";
        return ["Para uma clínica do porte da sua, o plano seria de R$ " + v + " por mês, mais uma mensalidade de implantação, sem contar a verba de anúncios."];
      }, perguntas: [
        { id: "piloto", tipo: "radio", rot: "Vocês topariam um piloto pago de 3 meses, sem fidelidade depois?", ops: [["Sim", "Sim"], ["Talvez", "Talvez"], ["Não", "Não"]], obrig: true },
        { id: "substitui", tipo: "radio", rot: "Isso substituiria o que vocês têm hoje ou viria junto?", ops: [["Substituiria", "Substituiria"], ["Viria junto", "Viria junto"], ["Não sei", "Não sei"]], obrig: true },
        { id: "condicao", tipo: "textarea", rot: "O que precisaria ser verdade para dizer sim?" },
        chamar("Quer que a gente te chame em novembro para conversar sobre o piloto?"),
        contato("Se quiser receber o resultado ou indicar outro gestor, deixe um WhatsApp ou e-mail.")
      ] }
    ]
  };

  /* Campos derivados para a planilha. Os nomes antigos (agenda, escolha, piloto, parou, paga, quem, pesa) continuam
   * indo junto, para o Apps Script anterior gravar algo coerente até a versão 2 ser implantada. */
  var EXTERNOS = ["Agência de marketing", "Freelancer ou social media", "Anúncios pagos"];
  MEDICOS.derivar = function (r) {
    if (r.especialidade === "Outra") r.especialidade = r.esp_outra || "Outra";
    r.agenda = r.quer_mais === "sim" && r.vagas !== "nao" ? "nao" : "sim";
    r.escolha = r.preferida;
    r.piloto = r.contrataria || "";
    r.parou = (r.parou_motivo || []).join(", ");
  };
  CLINICAS.derivar = function (r) {
    r.especialidades = (r.esp_lista || []).map(function (e) { return e === "Outra" ? (r.esp_outra || "Outra") : e; }).join(", ");
    r.externo = investe(r) && (r.tipos || []).some(function (t) { return EXTERNOS.indexOf(t) >= 0; }) ? "sim" : "nao";
    r.paga = r.externo;
    r.quem = investe(r) ? (r.tipos || []).join(", ") : "Não investe em marketing";
    r.pesa = r.peso === "Não ter problema com o CRM" || r.revisa === "Diretor técnico" ? "Muito" : "Nada";
  };

  function investe(r) { return r.investe === "sim"; }
  function pagou(r) { return Array.isArray(r.pagou) && r.pagou.length > 0 && r.pagou.indexOf("nada") < 0; }
  function escolheu(r) { return !!r.preferida && r.preferida !== "Nenhuma"; }

  g.PESQUISA = { medicos: MEDICOS, clinicas: CLINICAS };
})(window);
