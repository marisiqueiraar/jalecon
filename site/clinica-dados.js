/* Jalecon · dados e contas da clínica (sem servidor, sem IA paga).
 * Clínica, médicos e pacientes são fictícios. As contas do raio-x usam premissas visíveis e editáveis;
 * cada premissa diz de onde vem: da pesquisa (com n) ou hipótese a medir no piloto.
 */
(function (g) {
  "use strict";
  var CT = g.Conteudo || (typeof require === "function" ? require("./conteudo.js") : null);

  /* Especialidades: as mesmas chaves do Estúdio (conteudo.js), para cada médico ter a própria identidade. */
  var ESP = {
    ortopedia: { nome: "Ortopedia", tema: "joelho, ombro e coluna", palavras: ["ortoped", "joelho", "ombro", "coluna", "lombar", "costas", "tornozelo", "quadril", "tendinite", "menisco", "fratura", "osso"] },
    pediatria: { nome: "Pediatria", tema: "saúde da criança", palavras: ["pediatr", "filho", "filha", "bebe", "crianca", "pediatra", "colica do bebe", "vacina"] },
    psiquiatria: { nome: "Psiquiatria", tema: "saúde mental", palavras: ["psiquiatr", "ansiedade", "depressao", "insonia", "panico", "psiquiatra", "tristeza"] },
    gastro: { nome: "Gastroenterologia", tema: "digestão e intestino", palavras: ["gastroent", "estomago", "intestino", "gastrite", "refluxo", "azia", "digestao", "barriga"] },
    cardiologia: { nome: "Cardiologia", tema: "coração e pressão", palavras: ["cardiolog", "coracao", "pressao", "colesterol", "palpitacao", "arritmia"] },
    cirurgia: { nome: "Cirurgia geral", tema: "procedimentos e hérnias", palavras: ["cirurgi", "hernia", "vesicula", "cirurgia", "cisto", "lipoma"] },
    dermatologia: { nome: "Dermatologia", tema: "pele, cabelo e unhas", palavras: ["dermatolog", "pele", "acne", "espinha", "mancha", "cabelo", "pinta", "melasma"] },
    ginecologia: { nome: "Ginecologia", tema: "saúde da mulher", palavras: ["obstetr", "ginecolog", "menstrua", "colica menstrual", "menopausa", "preventivo", "endometriose"] }
  };
  var ESP_ORDEM = ["ortopedia", "pediatria", "psiquiatria", "gastro", "cardiologia", "cirurgia", "dermatologia", "ginecologia"];
  /* tom de voz padrão do Redator por especialidade (o médico muda na revisão) */
  var TOM = { ortopedia: "proxima", pediatria: "acolhedora", psiquiatria: "sobria", gastro: "acolhedora", cardiologia: "sobria", cirurgia: "tecnica", dermatologia: "tecnica", ginecologia: "acolhedora" };

  var QUEM = [["recepcao", "A recepção, no horário comercial"], ["secretaria_ia", "Uma secretária virtual ou robô"], ["agencia", "A agência de marketing"], ["cada_medico", "Cada médico responde o seu"]];
  var FALTAS = [[8, "Até 10%"], [15, "De 10% a 20%"], [25, "De 20% a 30%"], [35, "Mais de 30%"]];
  var RESPOSTA = [[15, "Em até 15 minutos"], [60, "Em até 1 hora"], [240, "De 1 a 4 horas"], [1440, "No dia seguinte"]];

  var PLANOS = {
    essencial: { id: "essencial", nome: "Clínica Essencial", porte: "2 a 4 médicos", preco: 2900 },
    pro: { id: "pro", nome: "Clínica Pro", porte: "5 a 10 médicos", preco: 4900 },
    rede: { id: "rede", nome: "Rede", porte: "11 ou mais médicos", preco: 8900 }
  };
  var INCLUI = [
    "Marca, site e Google de cada médico",
    "Conteúdo e anúncios (a verba de mídia é à parte)",
    "WhatsApp 24 horas, com agenda integrada",
    "Confirmação e lista de espera contra faltas",
    "Guardião com aprovação do diretor técnico",
    "Painel de consultas por canal e por médico"
  ];
  function planoPara(n) { return n >= 11 ? "rede" : n >= 5 ? "pro" : "essencial"; }

  /* ---------- premissas do raio-x (editáveis na tela) ----------
   * fonte "pesquisa": número medido na pesquisa (com n); "hipotese": a medir no piloto.
   * alt: o outro valor que o grupo já usou, para comparar com um clique. */
  var PREMISSAS = [
    { id: "foraHorario", rot: "Contatos que chegam à noite e no fim de semana", valor: 0.07, min: 0, max: 0.6, passo: 0.01, fonte: "pesquisa",
      origem: "Pesquisa com pacientes (P3): 2 de 27 fizeram o primeiro contato fora do horário comercial.", alt: { valor: 0.35, origem: "Hipótese usada no pitch e na Ficha 2" } },
    { id: "perdaSemResposta", rot: "Desistem quando ninguém responde fora do horário", valor: 0.6, min: 0, max: 1, passo: 0.05, fonte: "hipotese",
      origem: "Hipótese a medir no piloto. Na pesquisa (P2), 19 de 27 pacientes (70%) já desistiram de um médico por demora na resposta." },
    { id: "perdaDemora", rot: "Desistem quando a primeira resposta passa de 1 hora", valor: 0.2, min: 0, max: 0.8, passo: 0.05, fonte: "hipotese",
      origem: "Hipótese a medir no piloto, apoiada em P2 (70% já desistiram por demora)." },
    { id: "agendaHoje", rot: "Contatos respondidos que viram consulta hoje", valor: 0.25, min: 0.05, max: 0.6, passo: 0.01, fonte: "hipotese",
      origem: "Hipótese. Referência de mercado: só 24% das clínicas têm processo para converter contatos (Panorama Doctoralia e Feegow)." },
    { id: "agendaJalecon", rot: "Contatos que viram consulta com resposta em minutos", valor: 0.30, min: 0.05, max: 0.7, passo: 0.01, fonte: "hipotese",
      origem: "Hipótese a medir no piloto (métrica-chave da Ficha 3)." },
    { id: "reducaoFaltas", rot: "Redução das faltas com confirmação e lista de espera", valor: 0.4, min: 0, max: 0.8, passo: 0.05, fonte: "hipotese",
      origem: "Hipótese. Na pesquisa (P5), 8 de 8 pacientes que faltaram citaram esquecimento ou dificuldade de desmarcar." }
  ];
  var FIXAS = { semanasMes: 4.3, respostaJalecon: 0.97, respostaHorario: { recepcao: 0.85, secretaria_ia: 0.9, agencia: 0.7, cada_medico: 0.6 } };
  function premissasPadrao() { var o = {}; PREMISSAS.forEach(function (p) { o[p.id] = p.valor; }); return o; }

  function diagPadrao() {
    return {
      nome: "", cidade: "São Paulo", uf: "SP", medicos: 6, especialidades: [], particular: 60,
      contatos: 80, quem: "recepcao", resposta: 60, foraHorario: "nao", mede: "nao", faltas: 15, ticket: 450,
      gastoAgencia: 0, gastoAnuncios: 0, gastoOutros: 0,
      diretor: "", diretorSexo: "f", diretorCrm: "", crmPJ: ""
    };
  }
  /* Clínica de exemplo: 6 médicos, um por identidade do pitch (Movimento, Algodão, Quietude, Equilíbrio, Ritmo, Precisão). */
  function diagExemplo() {
    return Object.assign(diagPadrao(), {
      nome: "Clínica Movimento", cidade: "São Paulo", uf: "SP", medicos: 6,
      especialidades: ["ortopedia", "pediatria", "psiquiatria", "gastro", "cardiologia", "cirurgia"], particular: 65,
      contatos: 120, quem: "recepcao", resposta: 240, foraHorario: "nao", mede: "nao", faltas: 15, ticket: 450,
      gastoAgencia: 4500, gastoAnuncios: 3000, gastoOutros: 1200,
      diretor: "Helena Prado", diretorSexo: "f", diretorCrm: "123456", crmPJ: "9876"
    });
  }

  function rotulo(lista, v) { for (var i = 0; i < lista.length; i++) if (String(lista[i][0]) === String(v)) return lista[i][1]; return ""; }

  /* ---------- raio-x: hoje × com a Jalecon, por mês ---------- */
  function raioX(d, pr) {
    var P = Object.assign(premissasPadrao(), pr || {}), F = FIXAS;
    var contatos = Math.round((+d.contatos || 0) * F.semanasMes);
    var fora = contatos * P.foraHorario, dentro = contatos - fora;
    var taxa = F.respostaHorario[d.quem] || 0.8;
    var demora = (+d.resposta || 0) > 60 ? P.perdaDemora : 0;
    var respHoje = dentro * taxa * (1 - demora) + (d.foraHorario === "sim" ? fora * taxa * (1 - demora) : fora * (1 - P.perdaSemResposta));
    var agHoje = respHoje * P.agendaHoje;
    var faltaHoje = (+d.faltas || 0) / 100;
    var vemHoje = agHoje * (1 - faltaHoje);

    var respJ = contatos * F.respostaJalecon;
    var agJ = respJ * P.agendaJalecon;
    var faltaJ = faltaHoje * (1 - P.reducaoFaltas);
    var vemJ = agJ * (1 - faltaJ);

    var gasto = (+d.gastoAgencia || 0) + (+d.gastoOutros || 0);
    var aMais = Math.max(0, Math.round(vemJ - vemHoje));
    return {
      contatos: contatos, premissas: P,
      hoje: { respondidos: Math.round(respHoje), agendados: Math.round(agHoje), compareceram: Math.round(vemHoje), faltas: Math.round(agHoje - vemHoje) },
      jalecon: { respondidos: Math.round(respJ), agendados: Math.round(agJ), compareceram: Math.round(vemJ), faltas: Math.round(agJ - vemJ), faltaPct: faltaJ },
      perdidos: Math.max(0, Math.round(contatos - respHoje)),
      perdidosFora: Math.round(d.foraHorario === "sim" ? fora * (1 - taxa * (1 - demora)) : fora * P.perdaSemResposta),
      perdidosDemora: Math.round(dentro * taxa * demora),
      consultasAMais: aMais,
      receitaAMais: aMais * (+d.ticket || 0),
      gastoAtual: gasto,
      gastoMidia: +d.gastoAnuncios || 0,
      plano: planoPara(+d.medicos || 0),
      lacunas: lacunas(d)
    };
  }
  function lacunas(d) {
    var out = [];
    if ((+d.resposta || 0) > 60) out.push("A primeira resposta leva mais de 1 hora. Na pesquisa, 70% dos pacientes já desistiram de um médico por demora.");
    if (d.foraHorario !== "sim") out.push("Ninguém responde à noite e no fim de semana.");
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
    var esp = d.especialidades && d.especialidades.length ? d.especialidades : ["ortopedia", "pediatria", "cardiologia"];
    var n = Math.max(2, Math.min(12, +d.medicos || 6));
    var out = [];
    for (var i = 0; i < n; i++) {
      var k = esp[i % esp.length], nm = NOMES[i];
      out.push({
        id: "m" + i, nome: nm[0], sexo: nm[1], esp: k, especialidade: ESP[k].nome,
        crm: String(128734 + i * 7919).slice(0, 6), uf: d.uf || "SP",
        rqe: i === 1 ? "" : String(45120 + i * 311), cor: CORES[i % CORES.length], tom: TOM[k] || "sobria"
      });
    }
    return out;
  }
  function titulo(m) { return (m.sexo === "f" ? "Dra. " : "Dr. ") + m.nome; }
  function perfil(m) { return { nome: m.nome, crm: m.crm, uf: m.uf, rqe: m.rqe, sexo: m.sexo, especialidade: m.rqe ? (CT && CT.ESP[m.esp] ? CT.ESP[m.esp].titulo : m.especialidade) : "" }; }
  function iniciais(nome) { return nome.split(/\s+/).map(function (p) { return p.charAt(0); }).slice(0, 2).join("").toUpperCase(); }
  /* perfil no formato do Estúdio (conteudo.js) */
  function diagMedico(m, d, tom) {
    return {
      nome: titulo(m), especialidade: m.esp, cidade: d.cidade || "São Paulo", uf: m.uf, crm: m.crm, rqe: m.rqe,
      particular: d.particular || 65, objetivos: ["pacientes"], canais: { instagram: true, site: false, gbp: false, doctoralia: false, agencia: true },
      freq: "1", avaliacoes: 12, tempo: "30", orcamento: 1500, personalidade: tom || m.tom, bio: ""
    };
  }

  function assinaturaClinica(d) {
    var dir = (d.diretorSexo === "m" ? "Diretor técnico: Dr. " : "Diretora técnica: Dra. ") + (d.diretor || "[nome]");
    return [d.nome || "Clínica", "CRM-" + (d.uf || "SP") + " PJ " + (d.crmPJ || "[registro]"), dir, d.diretorSexo === "m" ? "MÉDICO" : "MÉDICA", "CRM-" + (d.uf || "SP") + " " + (d.diretorCrm || "[CRM]")].join(" · ");
  }

  /* ---------- fila de aprovação do diretor técnico (peças que chegam de fora do Estúdio) ---------- */
  function fila(d, eq) {
    function m(i) { return eq[Math.min(i, eq.length - 1)]; }
    var orto = eq.filter(function (x) { return x.esp === "ortopedia"; })[0] || m(0);
    var semRqe = eq.filter(function (x) { return !x.rqe; })[0] || m(1);
    var card = eq.filter(function (x) { return x.esp === "cardiologia" && x.rqe; })[0] || m(2);
    var outro = m(3);
    var Gs = g.Guardiao;
    return [
      { id: "p1", autor: orto.id, formato: "Post", dia: 12, titulo: "Dor no joelho", origem: "Pedido do médico", texto: "Elimine a dor no joelho de vez! Resultados garantidos em 30 dias com o nosso tratamento." },
      { id: "p2", autor: "clinica", formato: "Anúncio", dia: 13, titulo: "Sábados", origem: "Pedido do gestor", texto: "Nossa clínica agora atende aos sábados! Agende pelo WhatsApp." },
      { id: "p3", autor: semRqe.id, formato: "Carrossel", dia: 14, titulo: "Antes e depois", origem: "Pedido do médico", texto: "Especialista em " + semRqe.especialidade.toLowerCase() + ". Veja o antes e depois da nossa paciente." },
      { id: "p4", autor: outro.id, formato: "Stories", dia: 16, titulo: "Promoção", origem: "Pedido do gestor", texto: "Consulta com 30% de desconto só esta semana! Vagas limitadas." },
      { id: "p5", autor: card.id, formato: "Post", dia: 18, titulo: "Pressão alta", origem: "Estúdio", texto: "Pressão alta nem sempre dá sintomas. Meça a pressão pelo menos uma vez por ano e converse com seu médico.\n\n" + Gs.assinatura(perfil(card)) },
      { id: "p6", autor: "clinica", formato: "Post", dia: 20, titulo: "Primeira consulta", origem: "Estúdio", texto: "Na nossa clínica, a primeira conversa é sobre você: sua rotina, seus objetivos e suas dúvidas. Depois, o médico explica as opções e decide com você o próximo passo.\n\n" + assinaturaClinica(d) }
    ].map(function (p) { p.original = p.texto; p.status = "pendente"; p.log = []; return p; });
  }

  /* ---------- painel do mês (simulado a partir do raio-x) ---------- */
  function rnd(seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
  var CANAIS = [["google", "Google e site", 0.34], ["instagram", "Instagram dos médicos", 0.22], ["anuncios", "Anúncios", 0.2], ["indicacao", "Indicação", 0.14], ["agendas", "Doctoralia e outras agendas", 0.1]];
  function painel(d, eq, pr) {
    var r = raioX(d, pr), J = r.jalecon;
    var canais = CANAIS.map(function (c, i) {
      var cont = Math.round(r.contatos * c[2]);
      var ag = Math.round(cont * (0.24 + rnd(i + 3) * 0.2));
      return { id: c[0], nome: c[1], contatos: cont, agendados: ag };
    });
    var somaAg = canais.reduce(function (s, c) { return s + c.agendados; }, 0) || 1;
    canais.forEach(function (c) { c.agendados = Math.round(c.agendados * J.agendados / somaAg); c.taxa = c.contatos ? c.agendados / c.contatos : 0; });
    var pesos = eq.map(function (m, i) { return 0.6 + rnd(i + 11); });
    var tot = pesos.reduce(function (s, x) { return s + x; }, 0);
    var porMedico = eq.map(function (m, i) {
      var cons = Math.round(J.compareceram * pesos[i] / tot);
      return { id: m.id, consultas: cons, contatos: Math.round(r.contatos * pesos[i] / tot), canalTop: CANAIS[Math.floor(rnd(i + 21) * 3)][1] };
    });
    var semanas = [0.21, 0.24, 0.26, 0.29].map(function (f, i) { return { sem: "Semana " + (i + 1), contatos: Math.round(r.contatos * f * (0.94 + rnd(i + 31) * 0.1)), consultas: Math.round(J.compareceram * f) }; });
    return {
      r: r, canais: canais, porMedico: porMedico, semanas: semanas,
      tempoResposta: "1 min", foraHorario: Math.round(r.contatos * r.premissas.foraHorario),
      faltasEvitadas: Math.max(0, Math.round(J.agendados * ((+d.faltas || 0) / 100) - J.faltas)),
      vagasPreenchidas: Math.round(J.faltas * 0.5)
    };
  }

  /* ---------- agenda da semana ---------- */
  var PACIENTES = ["Ana M.", "Bruno T.", "Carla F.", "Diego S.", "Elisa R.", "Fábio L.", "Gabriela P.", "Heitor N.", "Isabela C.", "João V.", "Karina O.", "Leandro B.", "Mônica A.", "Nelson F.", "Olívia K.", "Pedro H."];
  var DIAS = [["seg", "segunda"], ["ter", "terça"], ["qua", "quarta"], ["qui", "quinta"], ["sex", "sexta"], ["sáb", "sábado"]];
  var HORAS = ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00", "17:00"];
  function agenda(eq) {
    var out = [], k = 0;
    eq.forEach(function (m, i) {
      DIAS.forEach(function (dia, j) {
        if (j === 5 && i % 2) return; // metade da equipe atende aos sábados
        var horas = j === 5 ? HORAS.slice(0, 4) : HORAS;
        horas.forEach(function (h, z) {
          var r = rnd(i * 97 + j * 13 + z + 5);
          if (r < 0.35) return; // horário livre
          var st = j === 0 ? (r < 0.75 ? "confirmada" : r < 0.93 ? "aguardando" : "nova") : (r < 0.55 ? "aguardando" : "confirmada");
          out.push({ id: "c" + k, medico: m.id, dia: dia[0], hora: h, paciente: PACIENTES[k % PACIENTES.length], status: st, canal: CANAIS[Math.floor(rnd(k + 7) * CANAIS.length)][1] });
          k++;
        });
      });
    });
    return out;
  }
  function livres(ag, medicoId, max) {
    var out = [];
    DIAS.forEach(function (dia, j) {
      if (j === 0) return; // não oferece o dia de hoje
      var horas = j === 5 ? HORAS.slice(0, 4) : HORAS;
      horas.forEach(function (h) {
        var ocupado = ag.some(function (c) { return c.medico === medicoId && c.dia === dia[0] && c.hora === h && c.status !== "cancelou"; });
        if (!ocupado && out.length < (max || 4)) out.push({ dia: dia[0], hora: h });
      });
    });
    return out;
  }
  var ESPERA = [["Marcos D.", "qualquer horário à tarde"], ["Patrícia G.", "manhã, com o mesmo médico"], ["Rogério A.", "o quanto antes"], ["Sílvia P.", "segunda ou terça"]];

  var api = {
    ESP: ESP, ESP_ORDEM: ESP_ORDEM, QUEM: QUEM, FALTAS: FALTAS, RESPOSTA: RESPOSTA, PLANOS: PLANOS, INCLUI: INCLUI,
    PREMISSAS: PREMISSAS, FIXAS: FIXAS, premissasPadrao: premissasPadrao, ESPERA: ESPERA, DIAS: DIAS, CANAIS: CANAIS,
    planoPara: planoPara, diagPadrao: diagPadrao, diagExemplo: diagExemplo, rotulo: rotulo, raioX: raioX,
    equipe: equipe, titulo: titulo, perfil: perfil, iniciais: iniciais, diagMedico: diagMedico, assinaturaClinica: assinaturaClinica,
    fila: fila, painel: painel, agenda: agenda, livres: livres,
    brl: function (v) { return "R$ " + Math.round(v).toLocaleString("pt-BR"); }
  };
  g.Clinica = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
