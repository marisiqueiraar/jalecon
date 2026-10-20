/* Jalecon · Conteúdo e equipe de agentes (simulação com modelos e variáveis, sem IA).
 * Estrategista, Redator, Designer, Guardião, Gestor de tráfego e Analista.
 * Aleatoriedade com semente: o mesmo médico, no mesmo mês e plano, recebe o mesmo calendário.
 * Todos os dados são fictícios.
 */
(function (g) {
  "use strict";
  var G = g.Guardiao || (typeof require === "function" ? require("./guardiao.js") : null);
  var R = g.Revisao || (typeof require === "function" ? require("./revisao.js") : null);

  /* ---------- aleatoriedade com semente ---------- */
  function hash(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function rng(seed) {
    var a = (typeof seed === "number" ? seed : hash(String(seed))) >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function shuffle(r, arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ---------- especialidades ---------- */
  function C(n, a, tecnico, sinais, cuidados, pergunta, mito, verdade, extra) {
    var o = { n: n, a: a, tecnico: tecnico, sinais: sinais, cuidados: cuidados, pergunta: pergunta, mito: mito, verdade: verdade };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  var ESP = {
    ortopedia: { nome: "Ortopedia", titulo: "Ortopedia e Traumatologia", prof: "ortopedista", familia: "Movimento",
      conds: [
        C("dor no joelho", "a", "gonalgia", ["dor que piora ao subir ou descer escadas", "inchaço depois de esforço", "sensação de que o joelho falseia ou trava"], ["fortalecer a musculatura da coxa com orientação", "aumentar a carga do treino aos poucos", "usar calçado adequado para a atividade"], "Quem tem dor no joelho deve parar de se exercitar?", "Quem tem dor no joelho deve parar toda atividade física.", "Na maioria dos casos, o movimento orientado ajuda. O tipo de exercício e a carga dependem da causa da dor."),
        C("dor lombar", "a", "lombalgia", ["dor que irradia para a perna", "formigamento ou perda de força", "dor que não melhora depois de algumas semanas"], ["fazer pausas para se movimentar a cada hora sentado", "ajustar a altura da tela e da cadeira", "manter atividade física regular"], "Repouso absoluto ajuda na dor lombar?", "Ficar de repouso absoluto resolve a dor nas costas.", "Na maior parte dos casos, manter-se ativo dentro do limite da dor ajuda na recuperação. Repouso prolongado pode atrasar a melhora."),
        C("tendinite no ombro", "a", "tendinopatia do manguito rotador", ["dor ao levantar o braço acima da cabeça", "dor que acorda à noite", "perda de força para tarefas simples"], ["evitar movimentos repetitivos sem pausa", "aquecer antes dos treinos", "ajustar a postura no trabalho"], "Tendinite sempre precisa de cirurgia?", "Toda tendinite termina em cirurgia.", "A maioria dos casos é tratada sem cirurgia, com fisioterapia, ajuste de carga e, quando indicado, medicação."),
        C("entorse de tornozelo", "a", "lesão ligamentar do tornozelo", ["inchaço importante logo após a torção", "dificuldade para apoiar o pé", "dor que continua depois de alguns dias"], ["fazer exercícios de equilíbrio", "usar calçado firme em terrenos irregulares", "voltar ao esporte aos poucos depois de uma torção"], "Depois de torcer o pé, é preciso imobilizar?", "Torção no tornozelo sempre melhora sozinha, sem avaliação.", "Muitas melhoram com cuidados simples, mas algumas envolvem lesão de ligamento ou fratura e precisam de avaliação."),
        C("artrose de quadril", "a", "coxartrose", ["dor na virilha ao caminhar", "rigidez ao levantar de manhã", "dificuldade para calçar sapatos"], ["manter o peso adequado", "preferir exercícios de baixo impacto, como bicicleta e hidroginástica", "fortalecer a musculatura do quadril"], "Artrose é coisa só de idoso?", "Artrose só aparece em pessoas idosas.", "É mais comum com a idade, mas pode surgir antes por sobrecarga, lesões antigas ou alterações do quadril.")
      ],
      levar: ["exames de imagem anteriores, mesmo antigos", "a lista de remédios que você usa", "anotações sobre quando a dor começou e o que piora"],
      procs: ["infiltração guiada", "artroscopia de joelho", "tratamento de fraturas"], cpc: 3.2, alcance: 1.1 },
    pediatria: { nome: "Pediatria", titulo: "Pediatria", prof: "pediatra", familia: "Algodão",
      conds: [
        C("febre na criança", "a", "síndrome febril", ["febre em bebê com menos de 3 meses", "febre que dura mais de 3 dias", "criança muito abatida mesmo quando a febre baixa"], ["oferecer líquidos com frequência", "vestir a criança com roupas leves", "anotar a temperatura e o horário dos antitérmicos"], "Febre alta faz mal ao cérebro?", "Toda febre alta é perigosa por si só.", "A febre é uma resposta do corpo. O que mais importa é o estado geral e a idade da criança; em bebês pequenos, a avaliação é sempre necessária."),
        C("cólica do bebê", "a", "cólica do lactente", ["choro intenso com recusa de mamar", "vômitos frequentes", "pouco ganho de peso"], ["manter o bebê no colo em posição confortável", "fazer massagem leve na barriga", "conferir a pega na amamentação"], "Cólica do bebê dura muito tempo?", "Cólica é sinal de que o leite materno é fraco.", "Leite materno não é fraco. A cólica é comum nos primeiros meses e costuma diminuir com o tempo; sinais de alerta pedem avaliação."),
        C("tosse persistente", "a", "tosse crônica", ["tosse que dura mais de três semanas", "chiado no peito ou respiração rápida", "tosse que atrapalha o sono todas as noites"], ["manter o ambiente arejado e sem fumaça", "lavar o nariz com soro fisiológico conforme orientação", "manter a vacinação em dia"], "Xarope para tosse é sempre necessário?", "Toda tosse precisa de xarope.", "A tosse protege as vias aéreas. O tratamento depende da causa, e muitos xaropes não são indicados para crianças pequenas."),
        C("dificuldade para comer", "a", "seletividade alimentar", ["perda de peso ou parada no crescimento", "aceita muito poucos alimentos", "engasgos frequentes"], ["oferecer o mesmo alimento várias vezes, sem pressão", "fazer as refeições em família, sem telas", "variar a forma de preparo"], "Criança que recusa verdura vai recusar para sempre?", "Se a criança recusou um alimento, ela não vai gostar dele.", "Pode levar muitas tentativas até a criança aceitar um alimento novo. Paciência e repetição ajudam."),
        C("sono agitado", "o", "distúrbio do sono infantil", ["ronco frequente com pausas na respiração", "sonolência durante o dia", "acordar várias vezes por noite depois dos 2 anos"], ["manter horários regulares para dormir", "desligar as telas uma hora antes", "criar uma rotina tranquila antes de deitar"], "Ronco em criança é normal?", "Criança que ronca está só dormindo profundamente.", "Ronco frequente pode indicar aumento de amígdalas ou adenoide e merece avaliação.")
      ],
      levar: ["a caderneta de vacinação", "as medidas de peso e altura mais recentes, se tiver", "suas dúvidas anotadas, por menores que pareçam"],
      procs: ["consulta de puericultura", "acompanhamento do desenvolvimento", "orientação sobre vacinas"], cpc: 2.4, alcance: 1.3 },
    psiquiatria: { nome: "Psiquiatria", titulo: "Psiquiatria", prof: "psiquiatra", familia: "Quietude",
      conds: [
        C("ansiedade", "a", "transtorno de ansiedade generalizada", ["preocupação que ocupa boa parte do dia", "dificuldade para dormir por causa dos pensamentos", "aperto no peito ou falta de ar sem outra causa"], ["manter horários regulares de sono", "reduzir cafeína e álcool", "fazer atividade física com regularidade"], "Ansiedade é frescura?", "Ansiedade é falta de força de vontade.", "Ansiedade é uma condição de saúde com causas biológicas e psicológicas, e há tratamentos com boa evidência."),
        C("insônia", "a", "insônia crônica", ["dificuldade para dormir três ou mais noites por semana", "cansaço que atrapalha o trabalho", "uso frequente de remédio para dormir por conta própria"], ["deitar e levantar no mesmo horário", "evitar telas na cama", "usar a cama só para dormir"], "Remédio para dormir resolve a insônia?", "Remédio para dormir é a saída para toda insônia.", "Mudanças de hábito e terapia cognitivo-comportamental são a primeira linha em muitos casos; o remédio, quando indicado, tem prazo e acompanhamento."),
        C("depressão", "a", "episódio depressivo", ["tristeza ou desânimo na maior parte dos dias por duas semanas ou mais", "perda de interesse pelo que antes dava prazer", "alterações de sono e de apetite"], ["conversar com alguém de confiança", "manter uma rotina mínima de sono e alimentação", "buscar avaliação profissional"], "Antidepressivo vicia?", "Antidepressivo vicia e muda a personalidade.", "Antidepressivos não causam dependência como outras substâncias e não mudam quem você é. A retirada deve ser feita com orientação."),
        C("burnout", "o", "síndrome de burnout", ["exaustão que não melhora com descanso", "distanciamento ou irritação com o trabalho", "queda no rendimento"], ["estabelecer limites de horário", "fazer pausas reais durante o dia", "conversar sobre a carga de trabalho"], "Burnout é só cansaço?", "Burnout se resolve com uma semana de férias.", "Férias ajudam, mas o burnout costuma pedir mudanças no trabalho e, muitas vezes, acompanhamento profissional."),
        C("TDAH em adultos", "o", "transtorno de déficit de atenção e hiperatividade", ["dificuldade antiga de manter a atenção", "esquecimentos e atrasos frequentes", "sensação constante de inquietação"], ["usar agendas e lembretes", "dividir tarefas grandes em etapas", "manter o sono regular"], "TDAH só existe na infância?", "TDAH desaparece na vida adulta.", "Em parte das pessoas, os sintomas continuam na vida adulta e podem ser avaliados e tratados.")
      ],
      levar: ["a lista de remédios que você usa ou já usou", "anotações sobre como tem sido o seu sono", "uma pessoa de confiança, se quiser companhia"],
      procs: ["avaliação psiquiátrica", "acompanhamento de tratamento", "teleconsulta"], cpc: 3.8, alcance: 1.0 },
    cardiologia: { nome: "Cardiologia", titulo: "Cardiologia", prof: "cardiologista", familia: "Ritmo",
      conds: [
        C("pressão alta", "a", "hipertensão arterial", ["medidas acima de 14 por 9 em casa", "dor de cabeça na nuca com a pressão alta", "histórico de pressão alta na família"], ["reduzir o sal", "medir a pressão com aparelho validado", "manter atividade física regular"], "Pressão alta sempre dá sintoma?", "Se não sinto nada, minha pressão está boa.", "A pressão alta costuma não dar sintomas. O jeito de saber é medir."),
        C("colesterol alto", "o", "dislipidemia", ["histórico familiar de infarto precoce", "exame com LDL acima do recomendado para o seu risco", "diabetes ou pressão alta associados"], ["preferir alimentos in natura", "reduzir frituras e ultraprocessados", "fazer exames de rotina conforme orientação"], "Magro não tem colesterol alto?", "Só quem está acima do peso tem colesterol alto.", "O colesterol também depende de genética. Pessoas magras podem ter colesterol alto."),
        C("palpitação", "a", "arritmia cardíaca", ["coração disparado sem esforço", "palpitação com tontura ou desmaio", "palpitação acompanhada de dor no peito"], ["reduzir cafeína e energéticos", "dormir bem", "anotar quando a palpitação acontece"], "Palpitação é sempre problema no coração?", "Toda palpitação é sinal de doença grave.", "Muitas palpitações são benignas, mas algumas indicam arritmia. A avaliação ajuda a diferenciar."),
        C("falta de ar aos esforços", "a", "dispneia aos esforços", ["cansaço desproporcional ao subir escadas", "falta de ar ao deitar", "inchaço nas pernas no fim do dia"], ["observar se o cansaço mudou nos últimos meses", "manter atividade física orientada", "controlar pressão e diabetes"], "Cansaço ao subir escadas é só falta de condicionamento?", "Falta de ar ao subir escadas é sempre sedentarismo.", "Pode ser, mas também pode indicar problema no coração ou no pulmão. Se mudou recentemente, vale investigar."),
        C("risco cardiovascular", "o", "estratificação de risco cardiovascular", ["mais de 40 anos sem avaliação recente", "tabagismo", "diabetes, pressão alta ou colesterol alto"], ["parar de fumar", "fazer 150 minutos de atividade física por semana", "manter o acompanhamento dos exames"], "Avaliação do coração é só para quem sente algo?", "Só precisa ver o coração quem sente dor no peito.", "A avaliação preventiva identifica fatores de risco antes de qualquer sintoma.", { prev: true, ts: "3 sinais de que está na hora de avaliar o coração" })
      ],
      levar: ["exames de sangue recentes e eletrocardiogramas antigos", "a lista de remédios que você usa", "suas medidas de pressão anotadas, se tiver"],
      procs: ["check-up cardiológico", "teste ergométrico", "acompanhamento da hipertensão"], cpc: 3.0, alcance: 0.9 },
    gastro: { nome: "Gastroenterologia", titulo: "Gastroenterologia", prof: "gastroenterologista", familia: "Equilíbrio",
      conds: [
        C("refluxo", "o", "doença do refluxo gastroesofágico", ["azia mais de duas vezes por semana", "dificuldade ou dor para engolir", "perda de peso sem explicação"], ["evitar deitar logo depois de comer", "fazer refeições menores", "elevar a cabeceira da cama"], "Leite ajuda na azia?", "Tomar leite resolve a azia.", "O alívio é passageiro, e o leite pode estimular mais ácido depois. Azia frequente merece avaliação."),
        C("intestino preso", "o", "constipação intestinal", ["mudança recente no hábito intestinal", "sangue nas fezes", "dor abdominal frequente"], ["beber água ao longo do dia", "incluir fibras aos poucos", "não adiar a ida ao banheiro"], "Laxante todo dia faz mal?", "Usar laxante todos os dias é inofensivo.", "O uso contínuo sem orientação pode mascarar problemas e piorar o funcionamento do intestino."),
        C("gastrite", "a", "gastrite", ["dor ou queimação na parte alta da barriga", "náusea frequente", "uso frequente de anti-inflamatórios"], ["evitar anti-inflamatórios por conta própria", "reduzir o álcool", "comer em horários regulares"], "Gastrite é causada por nervoso?", "Gastrite é sempre causada por estresse.", "O estresse pode piorar os sintomas, mas causas comuns incluem a bactéria H. pylori e o uso de anti-inflamatórios."),
        C("síndrome do intestino irritável", "a", "distúrbio da interação intestino-cérebro", ["dor abdominal que melhora depois de evacuar", "alternância entre diarreia e intestino preso", "sintomas que pioram em fases de estresse"], ["observar quais alimentos pioram os sintomas", "manter atividade física", "cuidar do sono"], "Intestino irritável é tudo psicológico?", "Intestino irritável é coisa da cabeça.", "É uma condição real, ligada à comunicação entre intestino e cérebro, e tem tratamento."),
        C("gordura no fígado", "a", "esteatose hepática", ["exame de imagem com esteatose", "alteração das enzimas do fígado", "sobrepeso com diabetes ou colesterol alto"], ["reduzir açúcar e álcool", "perder peso de forma gradual, com orientação", "fazer atividade física regular"], "Gordura no fígado só acontece em quem bebe?", "Só quem bebe álcool tem gordura no fígado.", "A forma mais comum hoje está ligada a peso, diabetes e colesterol, mesmo sem álcool.")
      ],
      levar: ["exames de sangue e de imagem anteriores", "a lista de remédios e suplementos em uso", "um registro dos sintomas da última semana"],
      procs: ["endoscopia digestiva", "colonoscopia", "acompanhamento de doenças do fígado"], cpc: 3.1, alcance: 0.95 },
    cirurgia: { nome: "Cirurgia geral", titulo: "Cirurgia Geral", prof: "cirurgião geral", profF: "cirurgiã geral", familia: "Precisão",
      conds: [
        C("hérnia inguinal", "a", "hérnia inguinal", ["volume na virilha que aumenta ao fazer força", "dor ou sensação de peso na região", "volume que não volta ao deitar"], ["evitar carregar peso sem orientação", "tratar tosse crônica e intestino preso", "procurar avaliação se o volume crescer"], "Toda hérnia precisa de cirurgia?", "Cinta resolve a hérnia.", "A cinta não fecha a hérnia. A indicação de cirurgia depende do tamanho, dos sintomas e do risco de complicação."),
        C("pedra na vesícula", "a", "colelitíase", ["dor do lado direito da barriga depois de comer gordura", "náusea e vômitos junto com a dor", "pele ou olhos amarelados"], ["anotar quando as crises acontecem", "evitar refeições muito gordurosas", "manter as consultas de acompanhamento"], "Pedra na vesícula sai com chá?", "Chá ou dieta dissolvem a pedra na vesícula.", "Não há chá que dissolva os cálculos. Quando há sintomas, a cirurgia por vídeo costuma ser o tratamento indicado."),
        C("hérnia umbilical", "a", "hérnia umbilical", ["volume no umbigo que aumenta ao tossir", "dor no local", "volume endurecido que não volta"], ["controlar o peso", "evitar esforço sem orientação", "procurar avaliação se o volume mudar"], "Hérnia no umbigo é só estética?", "Hérnia umbilical é só questão de estética.", "Ela pode prender parte do intestino. A avaliação ajuda a decidir o momento certo de operar."),
        C("apendicite", "a", "apendicite aguda", ["dor que começa perto do umbigo e vai para o lado direito", "febre e falta de apetite", "dor que piora ao andar ou tossir"], ["procurar o pronto-socorro se a dor for forte e persistente", "evitar analgésicos fortes antes da avaliação", "não usar laxantes com dor abdominal intensa"], "Dor do lado direito da barriga é sempre apendicite?", "Toda dor do lado direito da barriga é apendicite.", "Há várias causas possíveis. A avaliação médica e, às vezes, exames de imagem ajudam a confirmar."),
        C("lipoma", "o", "lipoma subcutâneo", ["caroço macio que cresce", "dor no local", "mudança rápida de tamanho"], ["observar o tamanho com fotos ao longo do tempo", "não tentar espremer ou furar", "procurar avaliação se mudar"], "Todo caroço é lipoma?", "Todo caroço macio debaixo da pele é lipoma.", "A maioria é benigna, mas só a avaliação diferencia o lipoma de outras lesões.")
      ],
      levar: ["exames de imagem e de sangue anteriores", "a lista de remédios, inclusive anticoagulantes", "informações sobre cirurgias anteriores"],
      procs: ["cirurgia de hérnia por vídeo", "retirada da vesícula por vídeo", "pequenas cirurgias"], cpc: 4.2, alcance: 0.8 },
    dermatologia: { nome: "Dermatologia", titulo: "Dermatologia", prof: "dermatologista", familia: "Bruma",
      conds: [
        C("acne", "a", "acne vulgar", ["espinhas que deixam cicatriz", "acne que aparece depois dos 25 anos", "lesões doloridas e profundas"], ["lavar o rosto duas vezes ao dia com produto suave", "não espremer as lesões", "usar protetor solar oil free"], "Acne é falta de higiene?", "Acne é sinal de pele suja.", "A acne envolve hormônios, oleosidade e inflamação. Lavar demais pode até piorar a irritação."),
        C("melasma", "o", "melasma", ["manchas escuras simétricas no rosto", "manchas que pioram com o sol", "manchas que surgiram na gravidez ou com anticoncepcional"], ["usar protetor solar todos os dias e reaplicar", "usar chapéu e evitar o sol do meio-dia", "não usar ácidos por conta própria"], "Melasma some sozinho?", "Melasma desaparece com um procedimento só.", "O melasma é crônico e tende a voltar. O tratamento busca controle, com proteção solar diária."),
        C("queda de cabelo", "a", "eflúvio telógeno ou alopecia", ["queda intensa por mais de três meses", "falhas visíveis no couro cabeludo", "coceira ou descamação junto com a queda"], ["evitar penteados que puxam os fios", "manter alimentação equilibrada", "não usar remédios para queda sem orientação"], "Lavar o cabelo todo dia aumenta a queda?", "Lavar o cabelo todo dia faz cair mais.", "Os fios que saem no banho já iriam cair. A frequência de lavagem depende do couro cabeludo."),
        C("câncer de pele", "o", "neoplasia cutânea", ["pinta que muda de cor, tamanho ou formato", "ferida que não cicatriza em quatro semanas", "pinta com bordas irregulares"], ["usar protetor solar diariamente", "examinar a pele uma vez por mês", "evitar bronzeamento artificial"], "Quem tem pele escura precisa de protetor?", "Pele morena ou negra não precisa de protetor solar.", "Todos os tons de pele sofrem com o sol. O risco muda, mas a proteção é para todos.", { prev: true, ts: "3 sinais na pele que merecem avaliação" }),
        C("dermatite atópica", "a", "dermatite atópica", ["coceira que atrapalha o sono", "pele muito seca com placas vermelhas", "lesões que infeccionam"], ["hidratar a pele logo após o banho", "tomar banhos mornos e rápidos", "preferir roupas de algodão"], "Dermatite atópica pega?", "Dermatite atópica é contagiosa.", "Não é contagiosa. É uma condição inflamatória com componente genético, que tem controle.")
      ],
      levar: ["fotos das lesões nos dias em que estavam piores", "a lista de cremes e remédios já usados", "informações sobre casos na família"],
      procs: ["mapeamento de pintas", "tratamento da acne", "biópsia de pele"], cpc: 3.6, alcance: 1.35 },
    ginecologia: { nome: "Ginecologia", titulo: "Ginecologia e Obstetrícia", prof: "ginecologista", familia: "Ciclo",
      conds: [
        C("cólica menstrual", "a", "dismenorreia", ["cólica que impede atividades do dia a dia", "dor que piora a cada ciclo", "dor na relação sexual ou ao evacuar no período"], ["aplicar calor local", "manter atividade física regular", "anotar os sintomas em um calendário menstrual"], "Cólica forte é normal?", "Cólica forte faz parte de ser mulher.", "Cólica que atrapalha a rotina não deve ser normalizada. Pode ter causas como a endometriose."),
        C("menopausa", "a", "climatério", ["ondas de calor que atrapalham o sono", "alterações de humor", "secura vaginal"], ["fazer atividade física com fortalecimento", "cuidar do sono", "manter os exames de rotina"], "Reposição hormonal é para todas?", "Toda mulher na menopausa deve fazer reposição hormonal.", "A reposição tem indicações e contraindicações. A decisão é individual, feita na consulta."),
        C("endometriose", "a", "endometriose", ["cólica intensa que piora com os anos", "dor na relação sexual", "dificuldade para engravidar"], ["registrar a intensidade da dor", "não se automedicar por longos períodos", "buscar avaliação se a dor mudar"], "Endometriose impede a gravidez?", "Quem tem endometriose não engravida.", "Muitas mulheres com endometriose engravidam. O acompanhamento ajuda a planejar."),
        C("exame preventivo", "o", "colpocitologia oncótica", ["mais de três anos sem o preventivo", "sangramento fora do período", "corrimento com odor forte"], ["manter o preventivo em dia conforme a idade", "vacinar contra o HPV quando indicado", "usar preservativo"], "Quem tomou a vacina de HPV precisa do preventivo?", "Quem tomou a vacina contra HPV dispensa o preventivo.", "A vacina reduz o risco, mas o rastreamento continua indicado conforme a idade.", { prev: true, ts: "3 sinais de que está na hora do preventivo" }),
        C("menstruação irregular", "a", "sangramento uterino anormal", ["ciclos com intervalo menor que 21 ou maior que 35 dias", "sangramento muito intenso", "ausência de menstruação por três meses"], ["anotar as datas dos ciclos", "observar mudanças de peso e de sono", "não interromper o anticoncepcional sem orientação"], "Menstruação irregular é sempre hormonal?", "Ciclo irregular é sempre problema hormonal.", "Pode ser hormonal, mas também pode estar ligado a estresse, peso, tireoide e outras causas.")
      ],
      levar: ["as datas das últimas menstruações", "exames anteriores, como preventivo e ultrassom", "a lista de remédios e anticoncepcionais em uso"],
      procs: ["consulta ginecológica", "acompanhamento do climatério", "inserção de DIU"], cpc: 2.9, alcance: 1.15 }
  };
  var ESP_ORDEM = ["ortopedia", "pediatria", "psiquiatria", "cardiologia", "gastro", "cirurgia", "dermatologia", "ginecologia"];

  /* ---------- planos ---------- */
  var PLANOS = {
    essencial: { id: "essencial", nome: "Essencial", preco: 297, pecas: 12, inclui: "Diagnóstico, identidade básica, página única, 12 conteúdos por mês, Guardião e revisão conversacional", site: "pagina", google: false, agenda: false, campanha: false },
    consultorio: { id: "consultorio", nome: "Consultório", preco: 697, pecas: 24, inclui: "Tudo do Essencial, mais identidade completa, site com SEO local, perfil no Google, 24 conteúdos por mês, roteiros de vídeo e relatório mensal", site: "site", google: true, agenda: false, campanha: false },
    autoridade: { id: "autoridade", nome: "Autoridade", preco: 1497, pecas: 24, inclui: "Tudo do Consultório, mais gestor de conta, campanhas pagas (verba à parte), integração com agenda e WhatsApp e painel de conversão", site: "site", google: true, agenda: true, campanha: true }
  };
  var PLANO_ORDEM = ["essencial", "consultorio", "autoridade"];
  function brl(v) { return "R$ " + Math.round(v).toLocaleString("pt-BR"); }

  /* ---------- opções do questionário ---------- */
  var OPC = {
    particular: [[10, "Quase tudo convênio (até 20%)"], [35, "Misto (20% a 50%)"], [65, "Maioria particular (50% a 80%)"], [90, "Quase tudo particular (mais de 80%)"]],
    objetivos: [["pacientes", "Mais pacientes particulares"], ["autoridade", "Ser conhecido(a) na área"], ["procedimento", "Divulgar um procedimento"], ["avaliacoes", "Mais avaliações no Google"], ["convenio", "Depender menos de convênio"], ["tempo", "Gastar menos tempo com redes sociais"]],
    freq: [["0", "Não publico"], ["1", "1 a 4 por mês"], ["5", "5 a 12 por mês"], ["13", "Mais de 12 por mês"]],
    tempo: [["30", "Menos de 1 hora"], ["120", "1 a 3 horas"], ["240", "Mais de 3 horas"]],
    orcamento: [[300, "Até R$ 300"], [700, "R$ 300 a 700"], [1500, "R$ 700 a 1.500"], [3000, "R$ 1.500 a 3.000"], [5000, "Mais de R$ 3.000"]],
    personalidade: [["acolhedora", "Acolhedora"], ["tecnica", "Técnica"], ["proxima", "Próxima e leve"], ["sobria", "Sóbria"]]
  };
  function rotulo(lista, v) { for (var i = 0; i < lista.length; i++) if (String(lista[i][0]) === String(v)) return lista[i][1]; return ""; }

  function diagPadrao() {
    return { nome: "", especialidade: "", cidade: "", uf: "SP", crm: "", rqe: "", particular: 65, objetivos: [], canais: { instagram: false, site: false, gbp: false, doctoralia: false, agencia: false }, freq: "0", avaliacoes: 0, tempo: "120", orcamento: 1500, personalidade: "acolhedora", bio: "" };
  }
  function sexo(d) { return /^\s*dra\b/i.test(d.nome || "") ? "f" : "m"; }
  function perfil(d) {
    var e = ESP[d.especialidade] || {};
    return { nome: (d.nome || "").trim(), crm: (d.crm || "").trim(), uf: (d.uf || "").trim().toUpperCase(), rqe: (d.rqe || "").trim(), especialidade: e.titulo || "", sexo: sexo(d) };
  }
  function prof(d) { var e = ESP[d.especialidade]; if (!e) return "médico"; return sexo(d) === "f" && e.profF ? e.profF : e.prof; }
  function opcoesGuardiao(d, tipo) {
    return { identificacao: tipo !== "livre", exigirNome: tipo === "peca" || tipo === "site", perfil: perfil(d) };
  }

  /* ---------- diagnóstico (nota transparente) ---------- */
  var PESOS = [
    { id: "instagram", nome: "Instagram profissional", peso: 20, regra: "6 pontos por ter perfil profissional + até 14 pela frequência (1 a 4 posts/mês: 5; 5 a 12: 10; mais de 12: 14)" },
    { id: "site", nome: "Site próprio", peso: 15, regra: "15 pontos se você tem site próprio" },
    { id: "gbp", nome: "Perfil no Google", peso: 15, regra: "15 pontos se o seu perfil de empresa no Google está ativo" },
    { id: "avaliacoes", nome: "Avaliações no Google", peso: 15, regra: "nenhuma: 0; 1 a 9: 5; 10 a 29: 9; 30 a 99: 12; 100 ou mais: 15" },
    { id: "agenda", nome: "Agenda online", peso: 10, regra: "10 pontos se o paciente consegue marcar on-line (Doctoralia ou similar)" },
    { id: "conformidade", nome: "Conformidade da bio ou legenda", peso: 25, regra: "25 menos 8 por regra que bloqueia e 3 por alerta (mínimo 0); sem texto colado: 12 (não avaliado)" }
  ];
  function ptsFreq(f) { return { "0": 0, "1": 5, "5": 10, "13": 14 }[String(f)] || 0; }
  function ptsAval(n) { n = +n || 0; return n >= 100 ? 15 : n >= 30 ? 12 : n >= 10 ? 9 : n >= 1 ? 5 : 0; }

  function checkup(d) {
    var txt = (d.bio || "").trim();
    if (!txt) return null;
    return G.analisar(txt, opcoesGuardiao(d, "bio"));
  }

  function componentes(d, ck, sim) {
    sim = sim || {};
    var c = d.canais || {};
    var insta = (c.instagram || sim.instagram) ? 6 + ptsFreq(sim.freq != null ? sim.freq : (c.instagram ? d.freq : "0")) : 0;
    var conf = ck ? Math.max(0, 25 - 8 * ck.contagem.bloqueia - 3 * ck.contagem.alerta) : 12;
    if (sim.conformidade != null) conf = sim.conformidade;
    var v = {
      instagram: insta,
      site: (c.site || sim.site) ? 15 : (sim.pagina ? 8 : 0),
      gbp: (c.gbp || sim.gbp) ? 15 : 0,
      avaliacoes: ptsAval(d.avaliacoes),
      agenda: (c.doctoralia || sim.agenda) ? 10 : 0,
      conformidade: conf
    };
    return PESOS.map(function (p) { return { id: p.id, nome: p.nome, peso: p.peso, regra: p.regra, pontos: v[p.id] }; });
  }

  function diagnostico(d) {
    var ck = checkup(d);
    var comp = componentes(d, ck);
    var nota = comp.reduce(function (s, x) { return s + x.pontos; }, 0);
    var c = d.canais || {}, lac = [];
    if (!c.instagram) lac.push("Sem Instagram profissional: o paciente que procura seu nome não encontra conteúdo seu.");
    else if (ptsFreq(d.freq) < 10) lac.push("Instagram com poucas publicações: perfis parados passam a impressão de consultório fechado.");
    if (!c.site) lac.push("Sem site próprio: quem pesquisa no Google não encontra uma página sua com endereço, horários e identificação.");
    if (!c.gbp) lac.push("Sem perfil no Google: é por ele que muita gente encontra médicos perto de casa.");
    if (ptsAval(d.avaliacoes) < 12) lac.push("Poucas avaliações no Google (" + (+d.avaliacoes || 0) + "): avaliações recentes ajudam o paciente a decidir.");
    if (!c.doctoralia) lac.push("Sem agenda on-line: o paciente precisa ligar em horário comercial para marcar.");
    if (!ck) lac.push("Conformidade não avaliada: cole sua bio ou uma legenda recente para o Guardião checar.");
    else if (ck.contagem.bloqueia || ck.contagem.alerta) lac.push("Sua bio ou legenda tem " + ck.contagem.bloqueia + " ponto(s) que bloqueiam e " + ck.contagem.alerta + " alerta(s) do Guardião.");
    var rec = recomendar(d, ck);
    return { nota: nota, componentes: comp, lacunas: lac, checkup: ck, plano: rec.plano, ideal: rec.ideal, motivo: rec.motivo };
  }

  function recomendar(d, ck) {
    var c = d.canais || {}, obj = d.objetivos || [], orc = +d.orcamento || 0, tempo = +d.tempo;
    var ideal = "essencial", razoes = [];
    if (!c.site) razoes.push("você ainda não tem site");
    if (!c.gbp) razoes.push("seu perfil no Google não está ativo");
    if ((+d.avaliacoes || 0) < 30) razoes.push("você tem " + (+d.avaliacoes || 0) + " avaliações no Google");
    if (obj.indexOf("pacientes") >= 0 || obj.indexOf("avaliacoes") >= 0 || obj.indexOf("convenio") >= 0) razoes.push("seu objetivo é atrair mais pacientes particulares");
    if (razoes.length) ideal = "consultorio";
    var rAut = [];
    if (obj.indexOf("procedimento") >= 0) rAut.push("quer divulgar um procedimento, o que pede campanha paga");
    if (tempo <= 30) rAut.push("tem menos de 1 hora por semana, e o gestor de conta revisa com você");
    if (c.agencia) rAut.push("já paga agência, e o Autoridade cobre o mesmo escopo com conformidade checada");
    if (rAut.length && (ideal === "consultorio" || obj.indexOf("procedimento") >= 0)) ideal = "autoridade";
    var teto = orc <= 300 ? "essencial" : orc <= 700 ? "consultorio" : "autoridade";
    var plano = PLANO_ORDEM.indexOf(ideal) <= PLANO_ORDEM.indexOf(teto) ? ideal : teto;
    var P = PLANOS[plano], faixa = rotulo(OPC.orcamento, orc);
    var motivo;
    if (plano === "essencial") motivo = "Recomendamos o Essencial porque " + (razoes.length ? razoes.slice(0, 2).join(" e ") + ", mas o orçamento informado (" + faixa + ") pede começar pela base" : "sua presença já tem o básico e o que falta é constância com segurança") + ": 12 conteúdos por mês checados pelo Guardião e uma página com seus dados de identificação.";
    else if (plano === "consultorio") motivo = "Recomendamos o Consultório porque " + razoes.slice(0, 3).join(", ") + ". O plano inclui site com SEO local, perfil no Google e 24 conteúdos por mês, e cabe no orçamento informado (" + faixa + ").";
    else motivo = "Recomendamos o Autoridade porque você " + rAut.join(" e ") + ". Ele inclui tudo do Consultório e um gestor de conta; a verba de anúncios é paga à parte.";
    if (plano !== ideal) motivo += " Pelo que você quer, o " + PLANOS[ideal].nome + " seria o ideal, mas passa do orçamento: dá para subir de plano depois.";
    if (tempo <= 30 && plano !== "autoridade") motivo += " Com menos de 1 hora por semana, conte com a revisão rápida pelo celular: cada peça chega pronta e checada.";
    if ((+d.particular || 0) <= 20) motivo += " Como a maior parte dos seus pacientes vem de convênio, o foco inicial é Google e conteúdo; anúncio pago tende a render menos.";
    return { plano: plano, ideal: ideal, motivo: motivo };
  }

  /* ---------- Designer: identidade visual ---------- */
  var FAMILIAS = {
    "Movimento": { porque: "cores de ação e estabilidade, para quem fala de movimento e recuperação", paletas: [["Azul-marinho e laranja", ["#1F2A44", "#E07A3F", "#7FA7C9", "#F3F1EC"]], ["Grafite e cobalto", ["#263040", "#3A6FB0", "#E98A4B", "#EEF1F5"]], ["Pinho e areia", ["#24423A", "#C98B4E", "#9FB8AD", "#F2EFE8"]]] },
    "Algodão": { porque: "tons claros e macios, que acalmam pais e mães", paletas: [["Azul-sereno e pêssego", ["#34466B", "#F2A98F", "#A9C8E8", "#FBF5EE"]], ["Menta e coral", ["#2F5A57", "#EE8C7A", "#A8D5C2", "#F7F4EC"]], ["Lavanda e amarelo", ["#4A4470", "#F2C14E", "#C3B8E3", "#FAF7F0"]]] },
    "Quietude": { porque: "cores de pouca saturação, que transmitem calma e discrição", paletas: [["Musgo e linho", ["#34514F", "#9DB4A5", "#D9CBB6", "#F1EEE8"]], ["Ardósia e névoa", ["#33415C", "#8FA3BF", "#D8D4CC", "#F3F2EF"]], ["Terracota suave", ["#4B3B35", "#C08A6E", "#C9B8A6", "#F4EFE9"]]] },
    "Ritmo": { porque: "base sóbria com um acento quente, sem o vermelho de alarme", paletas: [["Marinho e rosa-antigo", ["#22304A", "#C9787A", "#9DB3C8", "#F6F1EE"]], ["Petróleo e coral", ["#1E3D4C", "#E0826A", "#9CC1C7", "#F3F2EE"]], ["Vinho e cinza", ["#4A2330", "#B9565E", "#B8BDC6", "#F5F3F2"]]] },
    "Equilíbrio": { porque: "tons naturais e terrosos, ligados a alimentação e bem-estar", paletas: [["Sálvia e argila", ["#2E4A3E", "#B9714F", "#A8BFA6", "#F2EFE8"]], ["Oliva e caramelo", ["#2F3B2E", "#B98552", "#A9B28A", "#F3EEE3"]], ["Azul e mostarda", ["#2A3B55", "#D4A43A", "#A7B8CC", "#F5F2EA"]]] },
    "Precisão": { porque: "contraste limpo e frio, que comunica técnica e segurança", paletas: [["Marinho e cobre", ["#1F2B3E", "#B5703E", "#AEB9C8", "#F4F2EF"]], ["Aço e azul", ["#2E3B48", "#4F7FB0", "#B8C4CF", "#F4F6F8"]], ["Grafite e verde-água", ["#2C3336", "#3F9C94", "#B5C7C4", "#F2F4F3"]]] },
    "Bruma": { porque: "tons de pele e neutros quentes, sem apelo de transformação", paletas: [["Ameixa e nude", ["#4A3340", "#D29C8C", "#E8CFC2", "#FAF5F2"]], ["Azul-noite e areia", ["#28324A", "#C9A27E", "#C7CCD8", "#F6F3EE"]], ["Oliva e rosa", ["#3B4636", "#D49A94", "#C8CDB9", "#F7F3EF"]]] },
    "Ciclo": { porque: "cores acolhedoras e maduras, longe do rosa infantil", paletas: [["Eucalipto e rosa", ["#2F4F4A", "#E3A3A0", "#B9D1C8", "#F6F4F0"]], ["Ameixa e coral", ["#4B2E45", "#E08A78", "#D8B7C9", "#FAF4F3"]], ["Berinjela e dourado", ["#3D2B4F", "#D2A54A", "#C6BBD8", "#F7F4EF"]]] }
  };
  var FONTES = {
    acolhedora: { titulo: "Lora", texto: "Nunito Sans", porque: "serifa de curvas suaves com uma sans arredondada" },
    tecnica: { titulo: "Source Serif 4", texto: "Source Sans 3", porque: "par clássico e muito legível, de tom editorial" },
    proxima: { titulo: "DM Serif Display", texto: "DM Sans", porque: "título expressivo com texto simples e direto" },
    sobria: { titulo: "Libre Baskerville", texto: "Work Sans", porque: "serifa tradicional com sans neutra" }
  };
  var FONTES_URL = "https://fonts.googleapis.com/css2?family=Lora:wght@500;600&family=Source+Serif+4:opsz,wght@8..60,600&family=Source+Sans+3:wght@400;600&family=DM+Serif+Display&family=DM+Sans:wght@400;600&family=Libre+Baskerville:wght@700&family=Work+Sans:wght@400;600&display=swap";
  var BASE_PALETA = { acolhedora: 0, tecnica: 1, proxima: 2, sobria: 1 };

  function identidade(d, variacao) {
    var e = ESP[d.especialidade] || ESP.ortopedia, fam = FAMILIAS[e.familia];
    var i = ((BASE_PALETA[d.personalidade] || 0) + (variacao || 0)) % fam.paletas.length;
    var f = FONTES[d.personalidade] || FONTES.acolhedora;
    var nome = (d.nome || "").replace(/^\s*(dra?\.?)\s*/i, "");
    var ini = nome.split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase(); });
    return { familia: e.familia, porqueFamilia: fam.porque, paletaNome: fam.paletas[i][0], cores: fam.paletas[i][1], fontes: f, iniciais: (ini[0] || "") + (ini.length > 1 ? ini[ini.length - 1] : ""), variacao: variacao || 0 };
  }

  /* ---------- Estrategista + Redator ---------- */
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var DIAS_SEM = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  function proximoMes(hoje) {
    hoje = hoje || new Date();
    var a = hoje.getFullYear(), m = hoje.getMonth() + 1;
    if (m > 11) { m = 0; a++; }
    return { ano: a, mes: m };
  }

  var PILARES = {
    sinais: { nome: "Quando procurar", formatos: ["Carrossel", "Carrossel", "Reels"] },
    cuidados: { nome: "Prevenção e cuidados", formatos: ["Carrossel", "Post"] },
    mito: { nome: "Mito ou verdade", formatos: ["Post", "Reels"] },
    consulta: { nome: "Como é a consulta", formatos: ["Post", "Carrossel"] },
    pergunta: { nome: "Pergunta da semana", formatos: ["Stories"] },
    bastidor: { nome: "Bastidores", formatos: ["Stories", "Reels"] }
  };
  var PESO_PILAR = { sinais: 5, cuidados: 4, mito: 4, consulta: 2, pergunta: 3, bastidor: 2 };
  var BASTIDORES = [
    ["como organizo a primeira consulta", "Reservo mais tempo para a primeira consulta. É quando conheço a sua história, revejo exames antigos e combinamos os próximos passos."],
    ["por que peço exames antigos", "Exames antigos mostram como as coisas evoluíram. Muitas vezes, eles evitam repetir exames sem necessidade."],
    ["as orientações por escrito", "Depois da consulta, você sai com as orientações por escrito. Assim fica mais fácil lembrar do que combinamos."],
    ["para que serve o retorno", "O retorno serve para ver como você respondeu ao que combinamos e ajustar o plano, se for preciso."]
  ];
  var GANCHOS = {
    acolhedora: ["Falar de {cond} com calma ajuda a tomar boas decisões. Vamos por partes.", "Muita gente tem dúvidas sobre {cond} e não sabe a quem perguntar. Este conteúdo é para você."],
    tecnica: ["{Cond}: o que a avaliação clínica considera.", "Alguns critérios ajudam a decidir quando investigar {art} {cond}."],
    proxima: ["Vamos falar de {cond}? Essa dúvida aparece toda semana no consultório.", "A pergunta que eu mais ouço sobre {cond}: quando procurar ajuda?"],
    sobria: ["{Cond}: informação clara para decidir quando procurar avaliação.", "Pontos objetivos sobre {cond}."]
  };
  var TITULOS = {
    sinais: ["3 sinais de que {art} {cond} merece avaliação", "{Cond}: quando procurar um médico", "Quando {art} {cond} pede consulta"],
    cuidados: ["3 cuidados com {art} {cond} no dia a dia", "{Cond}: o que ajuda no dia a dia", "Hábitos que ajudam com {art} {cond}"],
    mito: ["Mito ou verdade sobre {art} {cond}", "{Cond}: um mito comum", "O que é mito sobre {art} {cond}"],
    consulta: ["O que levar na consulta sobre {cond}", "Como é a consulta quando o assunto é {cond}", "Primeira consulta sobre {cond}: como se preparar"]
  };
  function preencher(s, c) {
    return s.replace(/\{Cond\}/g, cap(c.n)).replace(/\{cond\}/g, c.n).replace(/\{art\}/g, c.a).replace(/^([a-zà-ý])/, function (x) { return x.toUpperCase(); });
  }
  function lista(itens) { return itens.map(function (x, i) { return (i + 1) + ". " + cap(x) + "."; }).join("\n"); }

  /* Vícios que o Redator às vezes comete (o Guardião precisa pegar). */
  var VICIOS_BLOQ = ["cura_titulo", "sem_dor_risco", "melhor", "definitivo"];
  var VICIOS_ALERTA = ["gratis", "vagas", "depoimento"];
  function aplicarVicio(v, texto, ctx) {
    var p = R.partes(texto), c = ctx.cond;
    if (v === "cura_titulo") p.titulo = "A cura para " + c.a + " " + c.n;
    else if (v === "sem_dor_risco") p.corpo.splice(Math.min(1, p.corpo.length), 0, "Tratamento sem dor e sem riscos.");
    else if (v === "melhor") p.corpo.splice(Math.min(1, p.corpo.length), 0, "Sou " + (ctx.sexo === "f" ? "a" : "o") + " melhor " + ctx.prof + " de " + ctx.cidade + ".");
    else if (v === "definitivo") p.corpo.splice(Math.min(1, p.corpo.length), 0, cap(c.n) + ": tratamento com resultado definitivo.");
    else if (v === "gratis") p.corpo.push("Primeira consulta grátis para novos pacientes.");
    else if (v === "vagas") p.corpo.push("Últimas vagas deste mês, não perca!");
    else if (v === "depoimento") p.corpo.push("Olha o que um paciente disse: mudou minha vida!");
    return [p.titulo].concat(p.corpo, p.cta ? [p.cta] : [], p.assinatura ? [p.assinatura] : []).join("\n\n");
  }

  function redigir(pilar, formato, c, ctx, r) {
    var tom = ctx.tom, cta = R.CTAS[tom] || R.CTAS.sobria;
    var gancho = preencher(pick(r, GANCHOS[tom] || GANCHOS.sobria), c);
    var titulo, corpo = [];
    if (pilar === "pergunta") {
      titulo = "Pergunta da semana: " + c.pergunta.charAt(0).toLowerCase() + c.pergunta.slice(1);
      corpo = [c.verdade, "Mande sua dúvida na caixinha de perguntas. Casos individuais eu converso só em consulta."];
      return [titulo].concat(corpo, [ctx.assinatura]).join("\n\n");
    }
    if (pilar === "bastidor") {
      var b = BASTIDORES[ctx.bastidor % BASTIDORES.length];
      titulo = "Bastidores: " + b[0];
      corpo = [b[1]];
    } else if (pilar === "sinais") {
      titulo = c.ts && r() < 0.7 ? c.ts : preencher(c.ts ? "{Cond}: quando procurar um médico" : pick(r, TITULOS.sinais), c);
      corpo = [gancho, (tom === "tecnica" ? "Sinais que justificam avaliação:" : "Fique atento se houver:") + "\n" + lista(c.sinais), "Esses sinais não fecham um diagnóstico, mas indicam que vale conversar com um médico."];
    } else if (pilar === "cuidados") {
      titulo = preencher(pick(r, TITULOS.cuidados), c);
      corpo = [gancho, lista(c.cuidados), "Cada caso é diferente. Na consulta, as orientações são ajustadas para você."];
    } else if (pilar === "mito") {
      titulo = preencher(pick(r, TITULOS.mito), c);
      corpo = [gancho, "Mito: " + c.mito, "Verdade: " + c.verdade];
    } else {
      titulo = preencher(pick(r, TITULOS.consulta), c);
      corpo = ["A consulta rende mais quando você chega com algumas informações em mãos.", "O que levar:\n" + lista(ctx.levar), "Na consulta, conversamos sobre a sua história, fazemos o exame físico e, se for preciso, pedimos exames."];
    }
    if (formato === "Reels") {
      var itens = (pilar === "sinais" ? c.sinais : pilar === "cuidados" ? c.cuidados : pilar === "mito" ? ["Mito: " + c.mito, "Verdade: " + c.verdade] : [corpo[0]]);
      corpo = ["Roteiro de Reels, até 45 segundos", ["Abertura (0 a 5 s): " + gancho].concat(itens.map(function (x, i) { return "Parte " + (i + 1) + ": " + cap(x) + (/[.!?]$/.test(x) ? "" : "."); })).join("\n")];
    }
    return [titulo].concat(corpo, [cta, ctx.assinatura]).join("\n\n");
  }

  function diasDoMes(ano, mes) {
    var out = [], n = new Date(ano, mes + 1, 0).getDate();
    for (var d = 1; d <= n; d++) { var w = new Date(ano, mes, d).getDay(); if (w !== 0) out.push(d); }
    return out;
  }

  function statusDe(res) { return res.contagem.bloqueia ? "bloqueado" : res.contagem.alerta ? "em_revisao" : "rascunho"; }

  function gerarMes(d, planoId, prefs, ref) {
    var e = ESP[d.especialidade] || ESP.ortopedia, P = PLANOS[planoId] || PLANOS.consultorio;
    ref = ref || proximoMes();
    var semente = [d.nome, d.especialidade, d.crm, d.cidade, d.personalidade, planoId, ref.ano, ref.mes].join("|");
    var r = rng(semente);
    var per = perfil(d), ass = G.assinatura(per), og = opcoesGuardiao(d, "peca");
    var glossario = e.conds.map(function (c) { return [c.n, c.tecnico === c.n ? "" : c.tecnico]; });
    var n = P.pecas;
    // Estrategista: pilares ponderados pelos objetivos
    var pesos = JSON.parse(JSON.stringify(PESO_PILAR)), obj = d.objetivos || [];
    if (obj.indexOf("autoridade") >= 0) { pesos.mito += 2; pesos.sinais += 1; }
    if (obj.indexOf("pacientes") >= 0 || obj.indexOf("convenio") >= 0) { pesos.consulta += 2; }
    if (obj.indexOf("avaliacoes") >= 0) { pesos.bastidor += 2; }
    var saco = [];
    Object.keys(pesos).forEach(function (k) { for (var i = 0; i < pesos[k]; i++) saco.push(k); });
    var pilares = [];
    while (pilares.length < n) pilares = pilares.concat(shuffle(r, saco));
    pilares = pilares.slice(0, n);
    var dias = diasDoMes(ref.ano, ref.mes), escolhidos = [];
    for (var i = 0; i < n; i++) escolhidos.push(dias[Math.min(dias.length - 1, Math.floor(i * dias.length / n))]);
    var conds = shuffle(r, e.conds), ci = 0, bi = Math.floor(r() * 4);
    var qtdVicios = 1 + Math.floor(r() * 3);
    var candidatos = [];
    pilares.forEach(function (p, i) { if (p !== "pergunta" && p !== "bastidor") candidatos.push(i); });
    var comVicio = shuffle(r, candidatos).slice(0, qtdVicios);
    var usados = {}, viciosUsados = {};
    var pecas = pilares.map(function (pilar, i) {
      var c = conds[ci % conds.length]; ci++;
      var formato = pick(r, PILARES[pilar].formatos);
      if (P.id === "essencial" && formato === "Reels") formato = "Post";
      var ctx = { tom: d.personalidade, assinatura: ass, bastidor: bi++, levar: e.levar };
      var texto = redigir(pilar, formato, c, ctx, r);
      // sem títulos repetidos no mês: tenta outro tema e, se preciso, outro pilar
      var tentativas = 0, alternativos = ["cuidados", "sinais", "mito", "consulta"];
      while (usados[R.partes(texto).titulo] && tentativas < 24) {
        tentativas++;
        if (tentativas > conds.length) { pilar = alternativos[tentativas % alternativos.length]; formato = PILARES[pilar].formatos[0]; }
        c = conds[(ci + tentativas) % conds.length];
        texto = redigir(pilar, formato, c, ctx, r);
      }
      usados[R.partes(texto).titulo] = 1;
      var tl = [
        { ag: "Estrategista", txt: "definiu o tema: " + PILARES[pilar].nome.toLowerCase() + (pilar === "bastidor" ? "" : " sobre " + c.n) },
        { ag: "Redator", txt: "escreveu o " + formato.toLowerCase() + " no tom " + ({ acolhedora: "acolhedor", tecnica: "técnico", proxima: "próximo e leve", sobria: "sóbrio" }[d.personalidade] || "sóbrio") }
      ];
      var k = comVicio.indexOf(i);
      if (k >= 0) {
        var vctx = { cond: c, prof: prof(d), cidade: d.cidade || "sua cidade", sexo: sexo(d), proc: pick(r, e.procs) };
        var pool = VICIOS_BLOQ.filter(function (v) { return !(v === "cura_titulo" && c.prev) && !viciosUsados[v]; });
        var vb = pool.length && (k === 0 || r() < 0.6) ? pick(r, pool) : null;
        if (vb) { texto = aplicarVicio(vb, texto, vctx); viciosUsados[vb] = 1; }
        if (k === 0 ? r() < 0.5 : true) texto = aplicarVicio(pick(r, VICIOS_ALERTA), texto, vctx);
      }
      if (prefs && prefs.length) {
        var ap = R.aplicarPreferencias(texto, prefs, { tom: d.personalidade, glossario: glossario, seed: i });
        if (ap.usadas.length) { texto = ap.texto; tl.push({ ag: "Redator", txt: "aplicou o que você ensinou: " + ap.usadas.join("; ").toLowerCase() }); }
      }
      tl.push({ ag: "Designer", txt: "montou a arte com a sua paleta e tipografia" });
      var res = G.analisar(texto, og);
      tl.push(registroGuardiao(res));
      var dia = escolhidos[i];
      var wd = new Date(ref.ano, ref.mes, dia).getDay();
      return {
        id: "p" + (i + 1), dia: dia, semana: DIAS_SEM[wd], hora: formato === "Stories" ? "12h" : "19h",
        pilar: pilar, formato: formato, tema: c.n, texto: texto, status: statusDe(res),
        achados: res.hits.filter(function (h) { return h.gravidade !== "orienta"; }).length,
        timeline: tl, historico: [], chat: []
      };
    });
    return { ref: ref, plano: P.id, pecas: pecas, glossario: glossario };
  }

  function registroGuardiao(res) {
    var b = res.hits.filter(function (h) { return h.gravidade === "bloqueia"; });
    var a = res.hits.filter(function (h) { return h.gravidade === "alerta"; });
    if (b.length) return { ag: "Guardião", txt: "bloqueou: " + b.map(function (h) { return h.regra.rotulo; }).join(", ") + (a.length ? "; alertou: " + a.map(function (h) { return h.regra.rotulo; }).join(", ") : ""), tipo: "bloqueia" };
    if (a.length) return { ag: "Guardião", txt: "alertou: " + a.map(function (h) { return h.regra.rotulo; }).join(", "), tipo: "alerta" };
    return { ag: "Guardião", txt: "checou " + G.regras.length + " regras: liberado", tipo: "ok" };
  }

  /* ---------- Gestor de tráfego ---------- */
  function campanha(d, planoId) {
    var e = ESP[d.especialidade] || ESP.ortopedia, P = PLANOS[planoId] || PLANOS.consultorio, per = perfil(d);
    var cidade = d.cidade || "sua cidade", pr = prof(d);
    var procOuProf = (d.objetivos || []).indexOf("procedimento") >= 0 ? e.procs[0] : "consulta com " + pr;
    var verba = Math.max(300, Math.min(3000, Math.round(((+d.orcamento || 0) - P.preco) / 100) * 100));
    var titulo = cap(pr) + " em " + cidade + " | " + per.nome;
    var desc = "Consulta com hora marcada em " + cidade + ". " + G.assinatura(per) + ". Agende pelo site.";
    var res = G.analisar(titulo + "\n" + desc, opcoesGuardiao(d, "peca"));
    var cliques = Math.round(verba / e.cpc), contatos = Math.round(cliques * 0.08), consultas = Math.round(contatos * 0.4);
    return {
      canal: "Google Ads, rede de pesquisa", disponivel: P.campanha,
      palavras: [pr + " em " + cidade, procOuProf + " " + cidade, pr + " perto de mim"],
      titulo: titulo, descricao: desc, verba: verba, cpc: e.cpc, cliques: cliques, contatos: contatos, consultas: consultas,
      guardiao: res,
      politicas: [
        "Segmentação por palavra-chave e região, nunca por condição de saúde ou dado sensível (política de anúncios de saúde do Google e da Meta).",
        "O texto fala do serviço, sem afirmar nada sobre a saúde de quem lê.",
        "Sem antes e depois, sem preço de procedimento e sem promessa de resultado.",
        "A página de destino é o seu site, com nome, CRM e RQE no rodapé."
      ]
    };
  }

  /* ---------- Analista (Pulso) ---------- */
  var ALCANCE_FORMATO = { Carrossel: 950, Reels: 1500, Post: 600, Stories: 280 };
  var AUD = { "0": 0.7, "1": 0.85, "5": 1.0, "13": 1.15 };
  function contarStatus(pecas) {
    var c = { rascunho: 0, em_revisao: 0, bloqueado: 0, aprovado: 0, agendado: 0 };
    (pecas || []).forEach(function (p) { c[p.status]++; });
    return c;
  }
  function alcancePeca(p, d, semente) {
    var e = ESP[d.especialidade] || ESP.ortopedia;
    var aud = (d.canais && d.canais.instagram) ? (AUD[String(d.freq)] || 0.85) : 0.6;
    var j = 0.85 + rng(semente + "|" + p.id)() * 0.3;
    return Math.round((ALCANCE_FORMATO[p.formato] || 600) * e.alcance * aud * j);
  }
  function funil(pecas, d, planoId, semente) {
    var P = PLANOS[planoId] || PLANOS.consultorio;
    var alcance = pecas.reduce(function (s, p) { return s + alcancePeca(p, d, semente); }, 0);
    var taxaVisita = 0.045 * ((d.canais && d.canais.site) || P.site === "site" ? 1.15 : 1);
    var taxaContato = 0.07;
    var taxaConsulta = 0.30 + 0.15 * ((+d.particular || 0) / 100);
    var visitas = Math.round(alcance * taxaVisita);
    var contatos = Math.round(visitas * taxaContato);
    var consultas = Math.round(contatos * taxaConsulta);
    return { pecas: pecas.length, alcance: alcance, visitas: visitas, contatos: contatos, consultas: consultas, taxas: { visita: taxaVisita, contato: taxaContato, consulta: taxaConsulta } };
  }
  function pulso(d, mes, campanhaAtiva) {
    var pecas = (mes && mes.pecas) || [];
    var sem = [d.nome, d.especialidade, mes && mes.ref && mes.ref.mes].join("|");
    var ag = pecas.filter(function (p) { return p.status === "agendado"; });
    var f = funil(ag, d, mes.plano, sem);
    var todas = funil(pecas, d, mes.plano, sem);
    var camp = null;
    if (campanhaAtiva) { var cp = campanha(d, mes.plano); camp = { verba: cp.verba, cliques: cp.cliques, contatos: cp.contatos, consultas: cp.consultas }; }
    var P = PLANOS[mes.plano];
    var semBloq = pecas.length && pecas.every(function (p) { return p.status !== "bloqueado"; });
    var freqSim = ag.length >= 13 ? "13" : ag.length >= 5 ? "5" : ag.length >= 1 ? "1" : null;
    var diag = diagnostico(d);
    var prevista = componentes(d, diag.checkup, {
      instagram: ag.length > 0, freq: freqSim != null ? (ptsFreq(freqSim) > ptsFreq(d.canais && d.canais.instagram ? d.freq : "0") ? freqSim : (d.canais.instagram ? d.freq : "0")) : null,
      site: P.site === "site", pagina: P.site === "pagina", gbp: P.google, agenda: P.agenda,
      conformidade: d.bioCorrigida ? 25 : null
    });
    var notaPrev = prevista.reduce(function (s, x) { return s + x.pontos; }, 0);
    var achados = pecas.reduce(function (s, p) { return s + (p.achados || 0); }, 0);
    var pegas = pecas.filter(function (p) { return p.timeline.some(function (t) { return t.ag === "Guardião" && t.tipo === "bloqueia"; }); }).length;
    return { status: contarStatus(pecas), funil: f, potencial: todas, campanha: camp, nota: diag.nota, notaPrevista: Math.max(diag.nota, notaPrev), achados: achados, pegas: pegas, semBloqueio: semBloq };
  }

  var api = {
    ESP: ESP, ESP_ORDEM: ESP_ORDEM, PLANOS: PLANOS, PLANO_ORDEM: PLANO_ORDEM, OPC: OPC, PESOS: PESOS, MESES: MESES, DIAS_SEM: DIAS_SEM, PILARES: PILARES,
    FONTES_URL: FONTES_URL, rng: rng, hash: hash, brl: brl, rotulo: rotulo, cap: cap,
    diagPadrao: diagPadrao, perfil: perfil, prof: prof, sexo: sexo, opcoesGuardiao: opcoesGuardiao,
    diagnostico: diagnostico, componentes: componentes, identidade: identidade, proximoMes: proximoMes,
    gerarMes: gerarMes, registroGuardiao: registroGuardiao, statusDe: statusDe, campanha: campanha, contarStatus: contarStatus, pulso: pulso, funil: funil
  };
  g.Conteudo = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
