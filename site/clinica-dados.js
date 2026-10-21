/* Jalecon · dados e contas da demo para clínicas (sem servidor, sem IA paga).
 * Tudo aqui é fictício. As contas do raio-x e do painel são estimativas da demo,
 * com premissas visíveis na tela; o piloto é que vai medir os números reais.
 */
(function (g) {
  "use strict";

  var ESP = {
    ortopedia: { nome: "Ortopedia", tema: "joelho, ombro e coluna" },
    dermatologia: { nome: "Dermatologia", tema: "pele, cabelo e unhas" },
    oftalmologia: { nome: "Oftalmologia", tema: "visão e saúde dos olhos" },
    cardiologia: { nome: "Cardiologia", tema: "coração e pressão" },
    ginecologia: { nome: "Ginecologia", tema: "saúde da mulher" },
    pediatria: { nome: "Pediatria", tema: "saúde da criança" },
    gastro: { nome: "Gastroenterologia", tema: "digestão e intestino" },
    psiquiatria: { nome: "Psiquiatria", tema: "saúde mental" }
  };
  var ESP_ORDEM = ["ortopedia", "dermatologia", "oftalmologia", "cardiologia", "ginecologia", "pediatria", "gastro", "psiquiatria"];

  var QUEM = [["recepcao", "A recepção, no horário comercial"], ["secretaria_ia", "Uma secretária virtual ou robô"], ["agencia", "A agência de marketing"], ["cada_medico", "Cada médico responde o seu"]];
  var FALTAS = [[8, "Até 10%"], [15, "De 10% a 20%"], [25, "De 20% a 30%"], [35, "Mais de 30%"]];

  var PLANOS = {
    essencial: { id: "essencial", nome: "Clínica Essencial", porte: "2 a 4 médicos", preco: 2900 },
    pro: { id: "pro", nome: "Clínica Pro", porte: "5 a 10 médicos", preco: 4900 },
    rede: { id: "rede", nome: "Rede", porte: "11 ou mais médicos", preco: 8900 }
  };
  var INCLUI = [
    "Marca, site e perfil no Google de cada médico",
    "Conteúdo e anúncios (a verba de mídia é à parte)",
    "WhatsApp 24 horas, com agenda integrada",
    "Confirmação de consultas e lista de espera contra faltas",
    "Guardião com aprovação do diretor técnico e registro",
    "Painel de consultas por canal e por médico"
  ];
  function planoPara(medicos) { return medicos >= 11 ? "rede" : medicos >= 5 ? "pro" : "essencial"; }

  /* premissas da simulação (mostradas na tela) */
  var PREMISSA = {
    semanasMes: 4.3,
    foraHorario: 0.35,        // parte dos contatos que chega à noite e no fim de semana
    perdaSemResposta: 0.6,    // desses, quantos desistem quando ninguém responde
    respostaHorario: { recepcao: 0.85, secretaria_ia: 0.9, agencia: 0.7, cada_medico: 0.6 },
    agendaHoje: 0.25,         // contatos respondidos que viram agendamento hoje
    agendaJalecon: 0.30,      // com resposta em minutos e roteiro de agendamento
    respostaJalecon: 0.97,
    reducaoFaltas: 0.4        // confirmação e lista de espera
  };

  function diagPadrao() {
    return {
      nome: "", cidade: "São Paulo", uf: "SP", medicos: 6, especialidades: [], particular: 60,
      contatos: 80, quem: "recepcao", foraHorario: "nao", mede: "nao", faltas: 15, ticket: 400,
      gastoAgencia: 0, gastoAnuncios: 0, gastoOutros: 0,
      diretor: "", diretorSexo: "f", diretorCrm: "", crmPJ: ""
    };
  }
  function diagExemplo() {
    return Object.assign(diagPadrao(), {
      nome: "Clínica Movimento", cidade: "São Paulo", uf: "SP", medicos: 6,
      especialidades: ["ortopedia", "dermatologia", "cardiologia"], particular: 65,
      contatos: 120, quem: "recepcao", foraHorario: "nao", mede: "nao", faltas: 15, ticket: 450,
      gastoAgencia: 4500, gastoAnuncios: 3000, gastoOutros: 1200,
      diretor: "Helena Prado", diretorSexo: "f", diretorCrm: "123456", crmPJ: "9876"
    });
  }

  function rotulo(lista, v) { for (var i = 0; i < lista.length; i++) if (String(lista[i][0]) === String(v)) return lista[i][1]; return ""; }

  /* raio-x: hoje x com a Jalecon, por mês */
  function raioX(d) {
    var P = PREMISSA;
    var contatos = Math.round(d.contatos * P.semanasMes);
    var fora = contatos * P.foraHorario, dentro = contatos - fora;
    var taxa = P.respostaHorario[d.quem] || 0.8;
    var respHoje = dentro * taxa + (d.foraHorario === "sim" ? fora * taxa : fora * (1 - P.perdaSemResposta));
    var agHoje = respHoje * P.agendaHoje;
    var faltaHoje = d.faltas / 100;
    var vemHoje = agHoje * (1 - faltaHoje);

    var respJ = contatos * P.respostaJalecon;
    var agJ = respJ * P.agendaJalecon;
    var faltaJ = faltaHoje * (1 - P.reducaoFaltas);
    var vemJ = agJ * (1 - faltaJ);

    var perdidosResposta = Math.max(0, Math.round(contatos - respHoje));
    var gasto = (+d.gastoAgencia || 0) + (+d.gastoOutros || 0);
    return {
      contatos: contatos,
      hoje: { respondidos: Math.round(respHoje), agendados: Math.round(agHoje), compareceram: Math.round(vemHoje), faltas: Math.round(agHoje - vemHoje) },
      jalecon: { respondidos: Math.round(respJ), agendados: Math.round(agJ), compareceram: Math.round(vemJ), faltas: Math.round(agJ - vemJ), faltaPct: faltaJ },
      perdidosResposta: perdidosResposta,
      consultasAMais: Math.max(0, Math.round(vemJ - vemHoje)),
      receitaAMais: Math.max(0, Math.round(vemJ - vemHoje)) * (+d.ticket || 0),
      gastoAtual: gasto,
      gastoMidia: +d.gastoAnuncios || 0,
      plano: planoPara(+d.medicos || 0),
      lacunas: lacunas(d)
    };
  }
  function lacunas(d) {
    var out = [];
    if (d.foraHorario !== "sim") out.push("Ninguém responde à noite e no fim de semana, quando chega cerca de um terço dos contatos.");
    if (d.mede !== "sim") out.push("A clínica não sabe quantos contatos viram consulta, nem qual canal traz paciente.");
    if (d.faltas >= 15) out.push("As faltas passam de 10% e não há lista de espera para ocupar o horário.");
    if (!d.diretor || !d.diretorCrm) out.push("O diretor técnico não revisa a publicidade antes de ir ao ar, e responde por ela no CRM.");
    if ((+d.gastoAgencia || 0) + (+d.gastoOutros || 0) > 0) out.push("Agência, atendimento e agenda estão em fornecedores diferentes, que não conversam.");
    return out;
  }

  /* ---------- equipe fictícia ---------- */
  var NOMES = [
    ["Rafael Lima", "m"], ["Camila Torres", "f"], ["Paulo Mendes", "m"], ["Beatriz Santos", "f"], ["Lucas Ferreira", "m"],
    ["Marina Costa", "f"], ["André Nogueira", "m"], ["Júlia Ramos", "f"], ["Thiago Alves", "m"], ["Larissa Duarte", "f"],
    ["Felipe Rocha", "m"], ["Renata Lopes", "f"]
  ];
  var CORES = ["#3F6B57", "#9C5A36", "#4A4F6E", "#5B6FA8", "#7A5812", "#2E6E7A", "#8A4A6B", "#5E6B2E", "#3D5A80", "#7A3E3E", "#4F6D5B", "#6B4E8A"];

  function equipe(d) {
    var esp = d.especialidades && d.especialidades.length ? d.especialidades : ["ortopedia", "dermatologia", "cardiologia"];
    var n = Math.max(2, Math.min(12, +d.medicos || 6));
    var out = [];
    for (var i = 0; i < n; i++) {
      var k = esp[i % esp.length], nm = NOMES[i];
      out.push({
        id: "m" + i, nome: nm[0], sexo: nm[1], esp: k, especialidade: ESP[k].nome,
        crm: String(128734 + i * 7919).slice(0, 6), uf: d.uf || "SP",
        rqe: i === 1 ? "" : String(45120 + i * 311), cor: CORES[i % CORES.length],
        consultas: 0, agenda: 0
      });
    }
    return out;
  }
  function titulo(m) { return (m.sexo === "f" ? "Dra. " : "Dr. ") + m.nome; }
  function perfil(m) { return { nome: m.nome, crm: m.crm, uf: m.uf, rqe: m.rqe, sexo: m.sexo, especialidade: m.rqe ? m.especialidade : "" }; }
  function iniciais(nome) { return nome.split(/\s+/).map(function (p) { return p.charAt(0); }).slice(0, 2).join("").toUpperCase(); }

  function assinaturaClinica(d) {
    var dir = (d.diretorSexo === "m" ? "Diretor técnico: Dr. " : "Diretora técnica: Dra. ") + (d.diretor || "[nome]");
    return [d.nome || "Clínica", "CRM-" + (d.uf || "SP") + " PJ " + (d.crmPJ || "[registro]"), dir, d.diretorSexo === "m" ? "MÉDICO" : "MÉDICA", "CRM-" + (d.uf || "SP") + " " + (d.diretorCrm || "[CRM]")].join(" · ");
  }

  /* ---------- fila de aprovação do diretor técnico ---------- */
  function fila(d, eq) {
    function m(i) { return eq[Math.min(i, eq.length - 1)]; }
    var orto = eq.filter(function (x) { return x.esp === "ortopedia"; })[0] || m(0);
    var derm = eq.filter(function (x) { return !x.rqe; })[0] || m(1);
    var card = eq.filter(function (x) { return x.esp === "cardiologia" && x.rqe; })[0] || m(2);
    var outro = m(3);
    var Gs = g.Guardiao;
    return [
      { id: "p1", autor: orto.id, formato: "Post", titulo: "Dor no joelho", texto: "Elimine a dor no joelho de vez! Resultados garantidos em 30 dias com o nosso tratamento." },
      { id: "p2", autor: "clinica", formato: "Anúncio", titulo: "Sábados", texto: "Nossa clínica agora atende aos sábados! Agende pelo WhatsApp." },
      { id: "p3", autor: derm.id, formato: "Carrossel", titulo: "Antes e depois", texto: "Especialista em " + derm.especialidade.toLowerCase() + ". Veja o antes e depois da nossa paciente." },
      { id: "p4", autor: outro.id, formato: "Stories", titulo: "Promoção", texto: "Consulta com 30% de desconto só esta semana! Vagas limitadas." },
      { id: "p5", autor: card.id, formato: "Post", titulo: "Pressão alta", texto: "Pressão alta nem sempre dá sintomas. Meça a pressão pelo menos uma vez por ano e converse com seu médico.\n\n" + Gs.assinatura(perfil(card)) },
      { id: "p6", autor: "clinica", formato: "Post", titulo: "Primeira consulta", texto: "Na nossa clínica, a primeira conversa é sobre você: sua rotina, seus objetivos e suas dúvidas. Depois, o médico explica as opções e decide com você o próximo passo.\n\n" + assinaturaClinica(d) }
    ].map(function (p) { p.original = p.texto; p.status = "pendente"; p.log = []; return p; });
  }

  /* ---------- painel do mês (simulado a partir do raio-x) ---------- */
  function rnd(seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
  var CANAIS = [["google", "Google e site", 0.34], ["instagram", "Instagram dos médicos", 0.22], ["anuncios", "Anúncios", 0.2], ["indicacao", "Indicação", 0.14], ["agendas", "Doctoralia e outras agendas", 0.1]];
  function painel(d, eq) {
    var r = raioX(d), J = r.jalecon;
    var canais = CANAIS.map(function (c, i) {
      var cont = Math.round(r.contatos * c[2]);
      var ag = Math.round(cont * (0.24 + rnd(i + 3) * 0.2));
      return { id: c[0], nome: c[1], contatos: cont, agendados: ag };
    });
    var somaAg = canais.reduce(function (s, c) { return s + c.agendados; }, 0);
    canais.forEach(function (c) { c.agendados = Math.round(c.agendados * J.agendados / somaAg); });
    var pesos = eq.map(function (m, i) { return 0.6 + rnd(i + 11); });
    var tot = pesos.reduce(function (s, x) { return s + x; }, 0);
    var porMedico = eq.map(function (m, i) { return { id: m.id, consultas: Math.round(J.compareceram * pesos[i] / tot) }; });
    return {
      r: r, canais: canais, porMedico: porMedico,
      tempoResposta: "1 min", foraHorario: Math.round(r.contatos * PREMISSA.foraHorario),
      faltasEvitadas: Math.max(0, Math.round(J.agendados * (d.faltas / 100) - J.faltas)),
      vagasPreenchidas: Math.round(J.faltas * 0.5)
    };
  }

  /* ---------- WhatsApp: roteiro da conversa ---------- */
  function conversa(d, eq) {
    var orto = eq.filter(function (x) { return x.esp === "ortopedia"; })[0] || eq[0];
    var t = titulo(orto);
    return {
      medico: orto.id,
      passos: [
        { paciente: [["Oi! Vocês atendem dor no joelho?", "joelho"]],
          agente: "Boa noite! Aqui é o atendimento da " + (d.nome || "clínica") + ". Atendemos, sim: " + t + " é ortopedista e atende joelho, ombro e coluna. Você prefere consulta particular ou por convênio?" },
        { paciente: [["Particular. Será que é menisco? Dá para resolver sem cirurgia?", "diag"], ["Particular. Quanto custa?", "preco"]],
          agente: { diag: "Entendo a preocupação. Por aqui eu não consigo avaliar o que está acontecendo: quem examina e explica as opções é " + t + " na consulta. Posso ver um horário para você?",
                    preco: "A consulta particular com " + t + " custa R$ " + (d.ticket || 400) + ". Posso ver um horário para você?" },
          guarda: { diag: "O agente não dá diagnóstico nem promete resultado pelo WhatsApp. Leva para a consulta." } },
        { paciente: [["Pode ser. Tem horário esta semana?", "horario"]], agente: "SLOTS" },
        { paciente: [], agente: "CONFIRMA" }
      ]
    };
  }
  function slots(eq, medicoId) {
    var dias = ["qui", "sex", "sáb"];
    return [["qui", "14:00"], ["sex", "09:30"], ["sex", "16:40"], ["sáb", "10:00"]].map(function (s, i) { return { id: "s" + i, dia: s[0], hora: s[1], medico: medicoId, livre: true }; });
  }

  /* ---------- agenda da semana ---------- */
  var PACIENTES = ["Ana M.", "Bruno T.", "Carla F.", "Diego S.", "Elisa R.", "Fábio L.", "Gabriela P.", "Heitor N.", "Isabela C.", "João V.", "Karina O.", "Leandro B."];
  function agenda(eq) {
    var horas = ["08:30", "09:30", "10:30", "14:00", "15:00", "16:00"];
    var out = [], k = 0;
    eq.slice(0, 4).forEach(function (m, i) {
      horas.slice(0, 4 + (i % 2)).forEach(function (h, j) {
        var r = rnd(i * 10 + j + 5);
        out.push({ id: "c" + k, medico: m.id, hora: h, paciente: PACIENTES[k % PACIENTES.length], status: r < 0.6 ? "confirmada" : r < 0.88 ? "aguardando" : "nova" });
        k++;
      });
    });
    return out;
  }
  var ESPERA = [["Marcos D.", "qualquer horário à tarde"], ["Patrícia G.", "manhã, com o mesmo médico"], ["Rogério A.", "o quanto antes"]];

  var api = {
    ESP: ESP, ESP_ORDEM: ESP_ORDEM, QUEM: QUEM, FALTAS: FALTAS, PLANOS: PLANOS, INCLUI: INCLUI, PREMISSA: PREMISSA, ESPERA: ESPERA,
    planoPara: planoPara, diagPadrao: diagPadrao, diagExemplo: diagExemplo, rotulo: rotulo, raioX: raioX,
    equipe: equipe, titulo: titulo, perfil: perfil, iniciais: iniciais, assinaturaClinica: assinaturaClinica,
    fila: fila, painel: painel, conversa: conversa, slots: slots, agenda: agenda,
    brl: function (v) { return "R$ " + Math.round(v).toLocaleString("pt-BR"); }
  };
  g.Clinica = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
