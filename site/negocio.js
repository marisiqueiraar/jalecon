/* Jalecon · viabilidade (conta de padeiro), piloto e pedido, com os números das Fichas 3 e 4 e do pitch.
 * Tudo editável na tela; os valores-base são os entregues aos professores.
 */
(function (g) {
  "use strict";
  /* Jalecon: mesma conta do Modelo C (arquivo_v0/v1_analises/financeiro/build_model_clinicas.py, aba "Unidade"),
   * plano Clínica Pro, cenário base. É o que aparece no slide "Economia por plano" do deck:
   *   contribuição = mensalidade × (1 − impostos − meios de pagamento) − custo direto − especialista ÷ clínicas
   *   LTV = contribuição ÷ churn + taxa de implantação − custo de implantação (sem receita de expansão)
   *   LTV/CAC e recuperação do CAC usam o CAC total do ano 5 (mídia, vendas, marketing e comissões). */
  var BASE = {
    preco: 4900,            // Clínica Pro
    ticket: 450,            // consulta particular
    medicos: 6,
    custoEvitadoMin: 6500, custoEvitadoMax: 12800, // agência + secretária com IA + atendente de WhatsApp
    horasRecepcao: 40,
    salarioEspecialista: 12000, // gerente de conta sênior (Modelo C)
    clinicasPorEspecialista: 16, // o número que ainda é chute
    custoDireto: 550,       // IA, API do WhatsApp, site, design e agenda por clínica
    impostos: 0.163,        // lucro presumido sobre a receita
    meiosPg: 0.03,          // meios de pagamento
    churnPct: 2.5,          // clínicas que cancelam por mês (%)
    implantacao: 1800,      // custo de implantar uma clínica nova
    cac: 20550,             // CAC total do ano 5
    teto: 1470,             // teto de custo de entrega da Ficha 3
    corteMargem: 0.70, corteLtvCac: 3, cortePayback: 12, // critérios fixados antes (plano v1)
    custoFixo: 32000,
    horasMes: 120           // horas produtivas do especialista
  };
  function conta(p) {
    p = Object.assign({}, BASE, p || {});
    var especialista = p.salarioEspecialista / p.clinicasPorEspecialista;
    var custo = especialista + p.custoDireto;              // custo de entrega por clínica
    var liquida = p.preco * (1 - p.impostos - p.meiosPg);   // receita depois de impostos e meios de pagamento
    var margem = liquida - custo;                           // contribuição mensal
    var margemPct = margem / liquida;                       // margem bruta do plano
    var churn = p.churnPct / 100;
    var vida = 1 / churn;
    var ltv = margem / churn + p.preco - p.implantacao;     // taxa de implantação = uma mensalidade
    var folga = liquida * (1 - p.corteMargem) - p.custoDireto; // quanto o especialista pode custar por clínica para dar 70%
    return {
      p: p, especialista: especialista, custo: custo, liquida: liquida, margem: margem, margemPct: margemPct,
      passaMargem: margemPct >= p.corteMargem,
      clinicasPara70: folga > 0 ? Math.ceil(p.salarioEspecialista / folga) : null,
      dentroTeto: custo <= p.teto + 0.5,
      equilibrio: Math.ceil(p.custoFixo / Math.max(1, margem)),
      vida: vida, ltv: ltv, ltvCac: ltv / p.cac, paybackCac: p.cac / Math.max(1, margem),
      consultasPagam: Math.ceil(p.preco / p.ticket), porMedico: Math.ceil(p.preco / p.ticket) / p.medicos,
      horasPorClinica: p.horasMes / p.clinicasPorEspecialista
    };
  }

  var PILOTO = {
    prazo: "3 meses", clinicas: 3, custo: 25000, mensalidades: 3 * 3 * 4900,
    escopo: ["WhatsApp que agenda", "Confirmação de consultas", "Conteúdo com o Guardião", "Painel por canal e por médico"],
    fora: ["Site", "Identidade visual", "Anúncios"],
    metas: [
      { id: "consultas", rot: "Consultas a mais por clínica por mês", meta: 11, tipo: "min", unid: "" },
      { id: "custo", rot: "Custo de entrega por clínica (R$/mês)", meta: 1470, tipo: "max", unid: "R$" },
      { id: "cancelamentos", rot: "Clínicas que cancelaram a Jalecon", meta: 0, tipo: "max", unid: "" },
      { id: "fornecedores", rot: "Clínicas que cancelaram ou reduziram outro fornecedor (de 3)", meta: 2, tipo: "min", unid: "" }
    ],
    suposicao: "A clínica ganha 11 consultas a mais por mês e troca os fornecedores atuais pela Jalecon? Se as duas coisas acontecem, renova e escalamos.",
    grandeQuestao: "A clínica troca três ou quatro fornecedores por um só? Toda a conta de custo evitado e a vantagem dos dados dependem disso."
  };
  function avaliarPiloto(obs) {
    return PILOTO.metas.map(function (m) {
      var v = obs && obs[m.id] != null && obs[m.id] !== "" ? +obs[m.id] : null;
      var ok = v == null ? null : m.tipo === "min" ? v >= m.meta : v <= m.meta;
      return { id: m.id, rot: m.rot, meta: m.meta, tipo: m.tipo, valor: v, ok: ok };
    });
  }

  var PEDIDO = {
    hoje: "3 a 5 clínicas de 5 a 10 médicos para o piloto pago de 3 a 6 meses (plano Pro, R$ 4.900 por mês), e apresentações a gestores e diretores técnicos.",
    depois: 250000,
    uso: [["Integrações de WhatsApp e agenda", 90000], ["Especialista em tempo integral", 72000], ["Conquista de clínicas", 30000], ["Reserva", 31000], ["Validação jurídica das regras", 15000], ["IA e ferramentas", 12000]],
    objetivo: "13 clínicas pagantes: o ponto em que a contribuição de cerca de R$ 2.650 por clínica, já sem impostos, paga o custo fixo de R$ 32 mil por mês."
  };

  /* Slide 5 do pitch ("Por que a Jalecon"): preços públicos dos sites (out/2026); fontes em referencias/concorrencia.md */
  var CONCORRENCIA = {
    colunas: ["Conteúdo dos médicos", "WhatsApp que agenda", "CFM e aprovação do DT", "Mede até a consulta", "Preço por mês"],
    linhas: [
      ["Agência de marketing médico", "Sim", "Não", "Por conta da clínica", "Não", "R$ 5 a 15 mil"],
      ["MedLeads (tráfego e chatbot)", "Não", "Sim", "Não encontrado", "Só leads", "R$ 4 a 6,5 mil + mídia"],
      ["Secretária IA (Cloudia, Healo)", "Não", "Sim", "Não", "Não encontrado", "R$ 400 a 550"],
      ["Doctoralia (perfil e agenda)", "Só o perfil", "Agenda on-line", "Não", "Não", "R$ 429 a 679 por médico"],
      ["IA de posts (InstaMed, Pulmo)", "O médico faz", "Não", "Aviso automático", "Não", "R$ 50 a 230 por médico"],
      ["Jalecon", "Sim", "Sim", "Guardião + aprovação", "Por canal e médico", "R$ 4.900 (Pro)"]
    ]
  };

  var api = { BASE: BASE, conta: conta, PILOTO: PILOTO, avaliarPiloto: avaliarPiloto, PEDIDO: PEDIDO, CONCORRENCIA: CONCORRENCIA };
  g.Negocio = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
