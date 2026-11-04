/* Jalecon · viabilidade (conta de padeiro), piloto e pedido, com os números das Fichas 3 e 4 e do pitch.
 * Tudo editável na tela; os valores-base são os entregues aos professores.
 */
(function (g) {
  "use strict";
  var BASE = {
    preco: 4900,            // Clínica Pro
    ticket: 450,            // consulta particular
    medicos: 6,
    custoEvitadoMin: 6500, custoEvitadoMax: 12800, // agência + secretária com IA + atendente de WhatsApp
    horasRecepcao: 40,
    salarioEspecialista: 11000, // R$ 10 a 12 mil
    clinicasPorEspecialista: 16, // o número que ainda é chute
    outrosCusto: 782.5,     // IA, WhatsApp, agenda, ferramentas e impostos: completa o teto de R$ 1.470 no cenário base
    teto: 1470,
    custoFixo: 32000,
    meses: 24,              // vida da clínica no LTV
    cac: 20000,
    horasMes: 160
  };
  function conta(p) {
    p = Object.assign({}, BASE, p || {});
    var especialista = p.salarioEspecialista / p.clinicasPorEspecialista;
    var custo = especialista + p.outrosCusto;
    var margem = p.preco - custo;
    var margemPct = margem / p.preco;
    var ltv = margem * p.meses;
    return {
      p: p, especialista: especialista, custo: custo, margem: margem, margemPct: margemPct,
      dentroTeto: custo <= p.teto + 0.5,
      equilibrio: Math.ceil(p.custoFixo / Math.max(1, margem)),
      ltv: ltv, ltvCac: ltv / p.cac, paybackCac: p.cac / Math.max(1, margem),
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
      { id: "cancelamentos", rot: "Clínicas que cancelaram", meta: 0, tipo: "max", unid: "" }
    ],
    suposicao: "A clínica ganha 11 consultas a mais por mês? Se sim, renova e escalamos. Se não, revemos preço e escopo (Ficha 3)."
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
    objetivo: "10 clínicas pagantes: o ponto em que a margem de R$ 3.430 por clínica paga o custo fixo de R$ 32 mil por mês."
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
