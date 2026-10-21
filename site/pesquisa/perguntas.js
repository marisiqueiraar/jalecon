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
    { id: "p_ns", tipo: "checks", rot: "Caso não tenha referência de valores, assinale esta opção e prossiga.", ops: [["ns", "Não tenho referência de valores"]] },
    { id: "p_barato", tipo: "number", rot: "A partir de qual valor mensal o serviço seria tão barato que você duvidaria da qualidade?", pre: "R$", obrig: true, se: comPreco },
    { id: "p_bom", tipo: "number", rot: "Qual valor mensal você consideraria uma boa relação custo-benefício?", pre: "R$", obrig: true, se: comPreco },
    { id: "p_caro", tipo: "number", rot: "A partir de qual valor mensal o serviço seria caro, mas ainda passível de contratação?", pre: "R$", obrig: true, se: comPreco },
    { id: "p_caro_demais", tipo: "number", rot: "A partir de qual valor mensal o serviço seria caro demais para ser considerado?", pre: "R$", obrig: true, se: comPreco }
  ];
  /* Pedido de compromisso: se a pessoa quer ser chamada, o contato vira obrigatório. */
  function chamar(rot, se) { return { id: "chamar", tipo: "radio", rot: rot, ops: SIM_NAO, obrig: true, se: se }; }
  function contato(rotLivre) {
    return { id: "contato", tipo: "text", obrig: function (r) { return r.chamar === "sim"; },
      rot: function (r) { return r.chamar === "sim" ? "Informe um WhatsApp ou e-mail para contato." : rotLivre; } };
  }

  var MEDICOS = {
    titulo: "Pesquisa sobre divulgação e captação de pacientes em consultórios",
    intro: "Pesquisa acadêmica do Insper. São 5 páginas, com duração aproximada de 6 minutos. As respostas são confidenciais e analisadas apenas de forma agregada, para fins acadêmicos.",
    secoes: [
      { titulo: "Perfil profissional", perguntas: [
        { id: "filtro", tipo: "radio", rot: "Você atende pacientes particulares em consultório (próprio, compartilhado ou em clínica) ao menos um período por semana?", ops: SIM_NAO, obrig: true, encerra: "nao", se: function (r) { return !r.perfil; } },
        { id: "especialidade", tipo: "select", rot: "Qual é a sua especialidade?", ops: ESPECIALIDADES.concat([["Outra", "Outra"]]), obrig: true },
        { id: "esp_outra", tipo: "text", rot: "Qual especialidade?", obrig: true, se: function (r) { return r.especialidade === "Outra"; } },
        { id: "onde", tipo: "radio", rot: "Em que modalidade você realiza a maior parte dos atendimentos particulares?", ops: [["Consultório próprio", "Consultório próprio, individual"], ["Consultório compartilhado", "Consultório compartilhado ou sublocado"], ["Clínica de outra pessoa", "Clínica de terceiros"], ["Sócio de clínica", "Clínica da qual sou sócio(a)"]], obrig: true },
        { id: "anos", tipo: "radio", rot: "Há quanto tempo você atende em consultório?", ops: [["ate3", "Até 3 anos"], ["4a10", "4 a 10 anos"], ["mais10", "Mais de 10 anos"]], obrig: true },
        { id: "particular", tipo: "radio", rot: "Aproximadamente, qual a proporção de pacientes particulares no seu consultório?", ops: [["10", "Até 20%"], ["35", "20% a 50%"], ["65", "50% a 80%"], ["90", "Mais de 80%"], ["ns", "Não sei"]], obrig: true },
        { id: "fonte", tipo: "radio", rot: "Qual é a principal origem dos seus pacientes novos?", ops: [["Indicação de pacientes", "Indicação de pacientes"], ["Indicação de colegas", "Indicação de colegas"], ["Convênio", "Convênios"], ["Google", "Busca no Google"], ["Instagram", "Instagram"], ["Doctoralia ou outra agenda on-line", "Doctoralia ou outra plataforma de agendamento"], ["Outro", "Outra origem"], ["Não sei", "Não sei"]], obrig: true },
        { id: "proximo", tipo: "radio", rot: "Você conhece pessoalmente algum integrante do grupo que lhe enviou esta pesquisa?", ops: SIM_NAO, obrig: true }
      ] },
      { titulo: "Situação atual", voltar: true, perguntas: [
        { id: "quer_mais", tipo: "radio", rot: "Você gostaria de atender mais pacientes particulares do que atende atualmente?", ops: SIM_NAO, obrig: true },
        { id: "vagas", tipo: "radio", rot: "Caso esses pacientes procurassem o consultório na próxima semana, haveria disponibilidade na sua agenda?", ops: [["sim", "Sim, há horários disponíveis"], ["talvez", "Seria necessário reorganizar a agenda"], ["nao", "Não, a agenda está completa"]], obrig: true, se: function (r) { return r.quer_mais === "sim"; } },
        { id: "pagou", tipo: "checks", rot: "Nos últimos 12 meses, você contratou algum destes serviços para divulgar seu trabalho? Assinale todos que se aplicam.", ops: [["Agência", "Agência de marketing"], ["Freelancer", "Profissional autônomo (freelancer)"], ["Doctoralia paga", "Doctoralia ou outra plataforma de agendamento paga"], ["Anúncio ou impulsionamento", "Anúncios ou impulsionamento de publicações"], ["Ferramenta paga", "Ferramenta ou software pago"], ["nada", "Não contratei nenhum destes serviços"]], obrig: true, exclusivo: "nada" },
        { id: "gasto", tipo: "number", rot: "Qual o investimento mensal total nesses serviços?", pre: "R$", se: pagou },
        { id: "meses", tipo: "number", rot: "Há quantos meses você utiliza (ou utilizou) o serviço mais recente?", suf: "meses", se: pagou },
        { id: "ainda", tipo: "radio", rot: "Você ainda utiliza esse serviço?", ops: SIM_NAO, obrig: true, se: pagou },
        { id: "parou_motivo", tipo: "checks", rot: "Por que deixou de utilizá-lo? Assinale todos os motivos que se aplicam.", ops: [["Caro para o resultado", "Custo alto em relação ao resultado"], ["Não trouxe pacientes", "Não gerou novos pacientes"], ["Dava muito trabalho para mim", "Exigia muito do meu tempo"], ["O fornecedor sumiu ou demorava", "O fornecedor era pouco responsivo ou deixou de atender"], ["Medo de problema com o CRM", "Receio de infringir as normas do CRM"], ["Outro", "Outro motivo"]], obrig: true, se: function (r) { return pagou(r) && r.ainda === "nao"; } },
        { id: "trava", tipo: "textarea", rot: "O que mais dificulta a divulgação do seu trabalho hoje?", obrig: true }
      ] },
      { titulo: "Propostas em estudo", texto: [
        "Estamos avaliando duas propostas:",
        "(a) Uma plataforma que cria, com inteligência artificial, a identidade visual, o site e as publicações do médico. Os ajustes são feitos por conversa, e cada peça é verificada segundo as normas de publicidade médica do CFM antes da publicação.",
        "(b) Uma equipe de agentes de inteligência artificial, supervisionada por um especialista, que executa todo o trabalho: identidade visual, site, perfil no Google, publicações, anúncios e atendimento de pacientes pelo WhatsApp. O médico apenas aprova."
      ], perguntas: [
        { id: "atrai", tipo: "textarea", rot: "Quais aspectos lhe parecem atrativos e quais geram desconfiança?" },
        { id: "ia", tipo: "radio", rot: "Você publicaria um conteúdo produzido com inteligência artificial, desde que pudesse revisá-lo previamente e que ele fosse verificado segundo as normas do CFM?", ops: [["Sim", "Sim"], ["Depende", "Depende"], ["Não", "Não"]], obrig: true },
        { id: "preferida", tipo: "radio", rot: "Se tivesse de escolher uma das propostas, qual seria?", ops: [["Plataforma", "(a) A plataforma"], ["Equipe", "(b) A equipe"], ["Nenhuma", "Nenhuma das duas"]], obrig: true }
      ] },
      { titulo: "Percepção de preço", se: escolheu, textoFn: function (r) {
        return [r.preferida === "Equipe"
          ? "Considere a proposta (b): equipe responsável por identidade visual, site, perfil no Google, publicações, anúncios e atendimento pelo WhatsApp. Valores em reais por mês, sem incluir a verba de anúncios."
          : "Considere a proposta (a): plataforma com identidade visual, site, perfil no Google e 24 publicações por mês. Valores em reais por mês."];
      }, perguntas: PRECO },
      { titulo: "Considerações finais", textoFn: function (r) {
        return escolheu(r) ? ["Os valores em estudo são: (a) plataforma, R$ 697 por mês; (b) equipe, R$ 1.790 por mês, além da verba de anúncios."] : [];
      }, perguntas: [
        { id: "contrataria", tipo: "radio", rot: "Com esse valor, você contrataria a proposta escolhida?", ops: [["Sim", "Sim"], ["Talvez", "Talvez"], ["Não", "Não"]], obrig: true, se: escolheu },
        { id: "condicao", tipo: "textarea", rot: "Quais condições seriam necessárias para que você a contratasse?" },
        chamar("Gostaria de ser contatado(a) em novembro para participar de um piloto pago?", escolheu),
        contato("Caso deseje receber os resultados ou indicar um colega, informe um WhatsApp ou e-mail.")
      ] }
    ],
    fimExtra: function (r) {
      if (r.onde !== "Sócio de clínica") return null;
      return { texto: "Como sócio(a) de uma clínica, sua perspectiva de gestão também é muito relevante para o estudo. Se dispuser de mais 7 minutos:", link: "/pesquisa/clinicas/", rotulo: "Responder à pesquisa com clínicas" };
    }
  };

  var CLINICAS = {
    titulo: "Pesquisa sobre marketing e atendimento em clínicas",
    intro: "Pesquisa acadêmica do Insper. São 5 páginas, com duração aproximada de 7 minutos. As respostas são confidenciais e analisadas apenas de forma agregada, para fins acadêmicos.",
    secoes: [
      { titulo: "Perfil da clínica", perguntas: [
        { id: "cargo", tipo: "checks", rot: "Qual é a sua função na clínica? Assinale todas que se aplicam.", ops: [["Sócio que atende", "Sócio(a), com atendimento a pacientes"], ["Sócio que não atende", "Sócio(a), sem atendimento a pacientes"], ["Diretor técnico", "Diretor(a) técnico(a)"], ["Atende, não é sócio", "Médico(a) ou dentista do corpo clínico, sem participação societária"], ["Gestão", "Gestão: gerência, coordenação ou administração"], ["Marketing ou atendimento", "Responsável pelo marketing ou pelo atendimento"], ["Outro", "Outra função"]], obrig: true },
        { id: "participa", tipo: "radio", rot: "Você participa das decisões de contratação de serviços de marketing ou de atendimento da clínica?", ops: SIM_NAO, obrig: true, encerra: "nao" },
        { id: "medicos", tipo: "number", rot: "Quantos médicos (ou dentistas) compõem o corpo clínico?", obrig: true, min: 1, max: 500, encerraSe: function (v) { return v < 2 || v > 15; } },
        { id: "unidades", tipo: "number", rot: "Quantas unidades a clínica possui?", min: 1, max: 100 },
        { id: "esp_lista", tipo: "checks", rot: "Quais são as principais especialidades atendidas? Assinale todas que se aplicam.", ops: ESPECIALIDADES.concat([["Odontologia", "Odontologia"], ["Outra", "Outra"]]), obrig: true },
        { id: "esp_outra", tipo: "text", rot: "Qual outra especialidade?", obrig: true, se: function (r) { return Array.isArray(r.esp_lista) && r.esp_lista.indexOf("Outra") >= 0; } },
        { id: "particular", tipo: "radio", rot: "Qual a participação dos pacientes particulares no faturamento da clínica?", ops: [["30", "Menos da metade"], ["65", "Mais da metade"], ["90", "Quase a totalidade"], ["ns", "Não sei"]], obrig: true, encerra: "30" },
        { id: "proximo", tipo: "radio", rot: "Você conhece pessoalmente algum integrante do grupo que lhe enviou esta pesquisa?", ops: SIM_NAO, obrig: true }
      ] },
      { titulo: "Marketing atual", voltar: true, perguntas: [
        { id: "quer_mais", tipo: "radio", rot: "A clínica tem interesse em atender mais pacientes particulares do que atende atualmente?", ops: SIM_NAO, obrig: true },
        { id: "vagas", tipo: "radio", rot: "Há disponibilidade na agenda dos profissionais para absorver novos pacientes?", ops: [["sim", "Sim, há horários disponíveis"], ["alguns", "Em parte: apenas alguns profissionais têm disponibilidade"], ["nao", "Não, as agendas estão completas"]], obrig: true, se: function (r) { return r.quer_mais === "sim"; } },
        { id: "investe", tipo: "radio", rot: "A clínica investe em marketing atualmente, ou investiu nos últimos 12 meses?", ops: SIM_NAO, obrig: true },
        { id: "tipos", tipo: "checks", rot: "Em quais destes serviços? Assinale todos que se aplicam.", ops: [["Agência de marketing", "Agência de marketing"], ["Freelancer ou social media", "Profissional autônomo ou social media"], ["Anúncios pagos", "Anúncios pagos (Google, Instagram, Facebook)"], ["Site, SEO ou perfil no Google", "Site, SEO ou perfil no Google"], ["Doctoralia ou agenda on-line paga", "Doctoralia ou outra plataforma de agendamento paga"], ["Atendimento de WhatsApp terceirizado", "Secretária virtual, chatbot ou atendimento de WhatsApp terceirizado"], ["Funcionário dedicado ao marketing", "Profissional interno dedicado ao marketing"], ["Ferramenta de marketing", "Ferramenta ou software de marketing"], ["Outro", "Outro"]], obrig: true, se: investe },
        { id: "gasto", tipo: "radio", rot: "Qual o investimento mensal nesses serviços, sem incluir a verba de anúncios?", ops: [["500", "Até R$ 1.000"], ["1750", "R$ 1.000 a 2.500"], ["3750", "R$ 2.500 a 5.000"], ["7500", "R$ 5.000 a 10.000"], ["12500", "Mais de R$ 10.000"], ["ns", "Não sei"]], obrig: true, se: investe },
        { id: "midia", tipo: "radio", rot: "E qual o investimento mensal em anúncios?", ops: [["0", "Não investimos em anúncios"], ["500", "Até R$ 1.000"], ["1750", "R$ 1.000 a 2.500"], ["3750", "R$ 2.500 a 5.000"], ["7500", "Mais de R$ 5.000"], ["ns", "Não sei"]], obrig: true, se: investe },
        { id: "satisf", tipo: "radio", rot: "Em uma escala de 1 a 5, qual o grau de satisfação com os resultados do marketing?", ops: [["1", "1 · Nada satisfeitos"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5 · Muito satisfeitos"]], obrig: true, se: investe },
        { id: "trocou", tipo: "radio", rot: "Nos últimos 12 meses, a clínica trocou de fornecedor de marketing ou considerou fazê-lo?", ops: [["trocou", "Sim, trocamos"], ["pensou", "Consideramos trocar"], ["nao", "Não"]], obrig: true, se: investe },
        { id: "achou", tipo: "radio", rot: "Como a clínica encontrou o fornecedor de marketing atual (ou o mais recente)?", ops: [["Indicação", "Indicação de outra clínica ou de colegas"], ["Google", "Busca no Google"], ["Instagram ou outra rede", "Instagram ou outra rede social"], ["Evento ou congresso", "Evento ou congresso"], ["O fornecedor procurou", "O fornecedor procurou a clínica"], ["Já conhecíamos", "Relação pessoal prévia (amigo, parente, ex-funcionário)"], ["Outro", "Outro"], ["ns", "Não sei"]], obrig: true, se: investe },
        { id: "resultado", tipo: "checks", rot: "Quais aspectos do resultado atual geram insatisfação? Assinale todos que se aplicam.", ops: [["Não sabemos se traz pacientes", "Não sabemos se gera novos pacientes"], ["Traz pacientes fora do perfil", "Atrai pacientes fora do perfil da clínica"], ["O fornecedor demora ou some", "O fornecedor é pouco responsivo"], ["Custa caro para o que entrega", "Custo alto em relação ao resultado"], ["Outro problema", "Outro problema"], ["nada", "Nenhum, estamos satisfeitos"]], obrig: true, exclusivo: "nada", se: investe },
        { id: "decisores", tipo: "radio", rot: "Na contratação mais recente de marketing, quantas pessoas participaram da decisão?", ops: [["1", "1"], ["2", "2"], ["3", "3 ou mais"], ["ns", "Não sei"]], obrig: true, se: investe },
        { id: "aprova", tipo: "checks", rot: "Quem precisou aprovar a contratação? Assinale todos que se aplicam.", ops: [["Sócio médico", "Sócio(a) médico(a) ou dentista"], ["Sócio ou administrador não médico", "Sócio(a) ou administrador(a) não médico(a)"], ["Diretor técnico", "Diretor(a) técnico(a)"], ["Gerente", "Gerência ou coordenação"], ["Outro", "Outro"]], obrig: true, se: investe },
        { id: "dias", tipo: "radio", rot: "Quanto tempo decorreu entre o primeiro contato com o fornecedor e a contratação?", ops: [["30", "Até 30 dias"], ["60", "31 a 60 dias"], ["90", "61 a 90 dias"], ["120", "Mais de 90 dias"], ["ns", "Não lembro"]], obrig: true, se: investe },
        { id: "revisa", tipo: "radio", rot: "Atualmente, quem revisa as publicações e os anúncios antes da veiculação?", ops: [["Diretor técnico", "O(a) diretor(a) técnico(a)"], ["Sócio ou médico", "Um(a) sócio(a) ou médico(a) da clínica"], ["Agência ou freelancer", "A agência ou o profissional contratado"], ["Ninguém", "Não há revisão"], ["Não publicamos", "A clínica não faz publicações nem anúncios"], ["ns", "Não sei"]], obrig: true }
      ] },
      { titulo: "Atendimento a pacientes", voltar: true, perguntas: [
        { id: "contatos", tipo: "radio", rot: "Aproximadamente, quantos contatos de novos pacientes a clínica recebe por semana pelo WhatsApp?", ops: [["5", "Até 10"], ["20", "11 a 30"], ["65", "31 a 100"], ["150", "Mais de 100"], ["ns", "Não sei"]], obrig: true },
        { id: "tempo", tipo: "radio", rot: "Em horário comercial, quanto tempo um novo paciente aguarda pela primeira resposta?", ops: [["15", "Menos de 15 minutos"], ["60", "15 minutos a 1 hora"], ["240", "1 a 4 horas"], ["480", "Mais de 4 horas"], ["ns", "Não sei"]], obrig: true },
        { id: "fora", tipo: "radio", rot: "Há atendimento aos novos pacientes pelo WhatsApp à noite e aos fins de semana?", ops: SIM_NAO.concat([["ns", "Não sei"]]), obrig: true },
        { id: "mede", tipo: "radio", rot: "A clínica mede quantos contatos recebidos pelo WhatsApp se convertem em consultas?", ops: SIM_NAO, obrig: true },
        { id: "agenda_sis", tipo: "radio", rot: "Qual sistema a clínica utiliza para a gestão da agenda?", ops: [["Feegow", "Feegow"], ["iClinic", "iClinic"], ["ProDoctor", "ProDoctor"], ["Doctoralia", "Doctoralia"], ["Clinicorp", "Clinicorp"], ["Amplimed", "Amplimed"], ["Outro sistema", "Outro sistema"], ["Planilha, papel ou Google Agenda", "Planilha, agenda em papel ou Google Agenda"], ["ns", "Não sei"]], obrig: true },
        { id: "agenda_outro", tipo: "text", rot: "Qual sistema?", se: function (r) { return r.agenda_sis === "Outro sistema"; } },
        { id: "preocupa", tipo: "textarea", rot: "Quais são as principais dificuldades ou preocupações em relação ao marketing da clínica?", obrig: true }
      ] },
      { titulo: "Proposta em estudo", texto: [
        "Estamos avaliando a seguinte proposta: uma equipe de marketing e atendimento operada por agentes de inteligência artificial e supervisionada por um especialista.",
        "O serviço inclui identidade visual, site e perfil no Google de cada médico, publicações e anúncios, além do atendimento de pacientes pelo WhatsApp 24 horas por dia, com agendamento direto na agenda da clínica.",
        "Nenhum conteúdo é publicado sem verificação segundo as normas de publicidade médica do CFM, com registro disponível ao diretor técnico, e um painel apresenta quantos contatos se converteram em consultas, por canal e por médico."
      ], perguntas: [
        { id: "atrai", tipo: "textarea", rot: "Quais aspectos lhe parecem atrativos e quais geram desconfiança?" },
        { id: "peso", tipo: "radio", rot: "Na escolha de um fornecedor como esse, qual critério é mais importante para a clínica? Assinale apenas um.", ops: [["Trazer pacientes", "Geração de novos pacientes"], ["Responder rápido", "Agilidade no atendimento aos pacientes"], ["Preço", "Preço"], ["Não ter problema com o CRM", "Segurança em relação às normas do CFM e do CRM"], ["Saber o que funciona", "Mensuração clara dos resultados"]], obrig: true },
        { id: "nota_preco", tipo: "nota", rot: "Percepção de preço. Para uma clínica do porte da sua, sem incluir a verba de anúncios, em reais por mês:" }
      ].concat(PRECO) },
      { titulo: "Considerações finais", textoFn: function (r) {
        var n = +r.medicos || 0, v = n >= 11 ? "8.900" : n >= 5 ? "4.900" : "2.900";
        return ["Para uma clínica do porte da sua, o valor previsto é de R$ " + v + " por mês, acrescido de uma taxa de implantação, sem incluir a verba de anúncios."];
      }, perguntas: [
        { id: "piloto", tipo: "radio", rot: "A clínica teria interesse em participar de um piloto pago de 3 meses, sem fidelidade após o período?", ops: [["Sim", "Sim"], ["Talvez", "Talvez"], ["Não", "Não"]], obrig: true },
        { id: "substitui", tipo: "radio", rot: "Esse serviço substituiria o fornecedor atual ou seria complementar?", ops: [["Substituiria", "Substituiria"], ["Viria junto", "Seria complementar"], ["Não sei", "Não sei"]], obrig: true },
        { id: "condicao", tipo: "textarea", rot: "Quais condições seriam necessárias para a contratação?" },
        chamar("Gostaria de ser contatado(a) em novembro para conversar sobre o piloto?"),
        contato("Caso deseje receber os resultados ou indicar outro gestor, informe um WhatsApp ou e-mail.")
      ] }
    ],
    fimExtra: function (r) {
      if (r.perfil !== "ambos") return null;
      return { texto: "Como você também atende pacientes, sua perspectiva de consultório também é muito relevante para o estudo. Se dispuser de mais 6 minutos:", link: "/pesquisa/medicos/", rotulo: "Responder à pesquisa com médicos" };
    }
  };

  /* Link único (/pesquisa/): uma pergunta de triagem abre a pesquisa certa. Quem é as duas coisas começa pela de
   * clínicas, que tem menos gente para responder, e recebe no fim o convite para a de médicos. */
  var UNICA = {
    titulo: "Pesquisa sobre marketing médico em consultórios e clínicas",
    intro: "Pesquisa acadêmica do Insper, com duração aproximada de 6 a 7 minutos. As respostas são confidenciais e analisadas apenas de forma agregada, para fins acadêmicos.",
    triagem: true,
    secoes: [{ titulo: "Perfil do respondente", perguntas: [
      { id: "perfil", tipo: "radio", rot: "Qual das opções abaixo descreve sua atuação?", ops: [["medicos", "Sou médico(a) e atendo pacientes particulares em consultório ao menos um período por semana"], ["clinicas", "Sou sócio(a), gestor(a) ou diretor(a) técnico(a) de uma clínica"], ["ambos", "Ambas as situações"], ["fora", "Nenhuma das situações acima"]], obrig: true, encerra: "fora" }
    ] }],
    segue: function (r) { return r.perfil === "medicos" ? "medicos" : "clinicas"; }
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
    r.cargo = (r.cargo || []).join(", ");
    if (r.agenda_sis === "Outro sistema" && r.agenda_outro) r.agenda_sis = r.agenda_outro;
    r.especialidades = (r.esp_lista || []).map(function (e) { return e === "Outra" ? (r.esp_outra || "Outra") : e; }).join(", ");
    r.externo = investe(r) && (r.tipos || []).some(function (t) { return EXTERNOS.indexOf(t) >= 0; }) ? "sim" : "nao";
    r.paga = r.externo;
    r.quem = investe(r) ? (r.tipos || []).join(", ") : "Não investe em marketing";
    r.pesa = r.peso === "Não ter problema com o CRM" || r.revisa === "Diretor técnico" ? "Muito" : "Nada";
  };

  function investe(r) { return r.investe === "sim"; }
  function pagou(r) { return Array.isArray(r.pagou) && r.pagou.length > 0 && r.pagou.indexOf("nada") < 0; }
  function escolheu(r) { return !!r.preferida && r.preferida !== "Nenhuma"; }

  g.PESQUISA = { medicos: MEDICOS, clinicas: CLINICAS, unica: UNICA };
})(window);
