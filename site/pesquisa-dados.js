/* Jalecon · base da pesquisa e placar das hipóteses.
 * Método: hipótese e corte fixados ANTES da coleta; o placar é calculado aqui, a partir das respostas,
 * para qualquer pessoa conferir a conta. Fonte: planilha "02 · Entrevistas v1 · placar das hipóteses".
 * Só campos fechados e anonimizados: sem nome, telefone, data exata ou texto livre.
 */
(function (g) {
  "use strict";

  var COLETA = "03/11/2026";

  /* Médicos de consultório (Fichas 1 e 2): aba "Entrevistas", 8 respostas. */
  var MEDICOS = [
    { esp: "Cardiologia", prox: "S", querTem: "S", pagou: "N", gasto: null, meses: null, aindaUsa: null, cfm: "N", ia: "Sim", opcao: "Plataforma", bom: null, c697: "Sim", c1790: "", piloto: "N", horario: "Talvez" },
    { esp: "Psiquiatria", prox: "S", querTem: "S", pagou: "N", gasto: null, meses: null, aindaUsa: null, cfm: "N", ia: "Sim", opcao: "Equipe", bom: null, c697: "", c1790: "Talvez", piloto: "N", horario: "Sim" },
    { esp: "Cirurgia geral", prox: "S", querTem: "S", pagou: "S", gasto: 1000, meses: 12, aindaUsa: "S", cfm: "N", ia: "Depende", opcao: "Plataforma", bom: 400, c697: "Talvez", c1790: "", piloto: "S", horario: "Sim" },
    { esp: "Psiquiatria", prox: "S", querTem: "N", pagou: "S", gasto: 1500, meses: 4, aindaUsa: "N", cfm: "N", ia: "Depende", opcao: "Equipe", bom: 800, c697: "", c1790: "Não", piloto: "N", horario: "Não" },
    { esp: "Coloproctologia", prox: "N", querTem: "S", pagou: "S", gasto: 4000, meses: 6, aindaUsa: "S", cfm: "N", ia: "Sim", opcao: "Equipe", bom: null, c697: "", c1790: "Talvez", piloto: "S", horario: "Sim" },
    { esp: "Dor", prox: "N", querTem: "S", pagou: "S", gasto: 45000, meses: 12, aindaUsa: "S", cfm: "N", ia: "Sim", opcao: "Equipe", bom: null, c697: "", c1790: "Talvez", piloto: "N", horario: "Sim" },
    { esp: "Ortopedia", prox: "S", querTem: "S", pagou: "N", gasto: null, meses: null, aindaUsa: null, cfm: "N", ia: "Sim", opcao: "Plataforma", bom: null, c697: "Sim", c1790: "", piloto: "N", horario: "Talvez" },
    { esp: "Clínica geral", prox: "S", querTem: "S", pagou: "N", gasto: null, meses: null, aindaUsa: null, cfm: "N", ia: "Sim", opcao: "Equipe", bom: 300, c697: "", c1790: "Não", piloto: "N", horario: "Sim" }
  ];

  /* Gestores de clínica (Ficha 3): aba "Respostas · clínicas (v2)", 2 respostas até a coleta. */
  var CLINICAS = [
    { esp: "Dermatologia", medicos: 8, prox: "N", pagaInsatisfeita: "S", querTem: "S", contatos: 20, respondeNoite: "N", resposta: 60, decisores: 2, dias: 60, cfm: "N", crmPesa: "S", dtRevisa: "N", caro: 3000, piloto: "Talvez", mede: "N", gasto: 1750 },
    { esp: "Dor", medicos: 5, prox: "N", pagaInsatisfeita: "S", querTem: "S", contatos: 5, respondeNoite: "S", resposta: 15, decisores: 3, dias: 30, cfm: "N", crmPesa: "N", dtRevisa: "S", caro: null, piloto: "Talvez", mede: "S", gasto: 7500 }
  ];

  /* Pacientes (o outro lado do mercado): aba "Respostas · pacientes", 27 respostas. */
  var PACIENTES = [{"idade":"18 a 24","uf":"SP","plano":"Sem reembolso","esp":"Clínico geral","conheceu":"Lista do plano","checou":["Instagram do médico"],"marcou":"Site ou aplicativo","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"nao","porque":[],"prefere":"Site ou aplicativo","d2":"Tanto faz","assistente":"nao","pesa":["Indicação de confiança","Formação"],"desconfia":["Promessa de resultado","Conteúdo pouco sério","Preço em destaque","Seguidores sem formação"],"segue":"Sigo e já agendei"},
    {"idade":"25 a 34","uf":"RJ","plano":"Sem reembolso","esp":"Dermatologista","conheceu":"Lista do plano","checou":["Avaliações no Google","Avaliações na Doctoralia ou similar"],"marcou":"Site ou aplicativo","momento":"Dia útil, horário comercial","tempo":"Até 1 hora","confirmada":"sim","desistiu":"Uma vez","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Aviso automático","assistente":"Sim, com opção de falar com pessoa","pesa":["Formação","Horário mais cedo"],"desconfia":["Preço em destaque","Promessa de resultado"],"segue":"Sigo e já agendei"},
    {"idade":"25 a 34","uf":"RJ","plano":"Com reembolso","esp":"Dermatologista","conheceu":"Indicação de amigo ou familiar","checou":["Avaliações no Google","Avaliações na Doctoralia ou similar","Perguntei a conhecidos"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Até 1 hora","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Assistente responde na hora","assistente":"Sim, com opção de falar com pessoa","pesa":["Indicação de confiança","Avaliações de pacientes"],"desconfia":["Promessa de resultado","Conteúdo pouco sério","Preço em destaque"],"segue":"Sigo, nunca agendei"},
    {"idade":"25 a 34","uf":"SP","plano":"Com reembolso","esp":"Ginecologista","conheceu":"Indicação de amigo ou familiar","checou":["Perguntei a conhecidos"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Até 1 hora","confirmada":"sim","desistiu":"nao","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Tanto faz","assistente":"sim","pesa":["Indicação de confiança","Localização"],"desconfia":["Nada disso"],"segue":"Sigo, nunca agendei"},
    {"idade":"25 a 34","uf":"SP","plano":"Sem reembolso","esp":"Dermatologista","conheceu":"Lista do plano","checou":["Não busquei informações"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"nao","faltou":"nao","porque":[],"prefere":"Tanto faz","d2":"Assistente responde na hora","assistente":"sim","pesa":["Formação","Indicação de confiança"],"desconfia":["Promessa de resultado","Seguidores sem formação","Preço em destaque"],"segue":"Sigo, nunca agendei"},
    {"idade":"18 a 24","uf":"SP","plano":"Sem reembolso","esp":"Ginecologista","conheceu":"Lista do plano","checou":["Não busquei informações"],"marcou":"WhatsApp","momento":"Dia útil, à noite","tempo":"Dia seguinte ou mais","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"sim","porque":["Imprevisto e difícil desmarcar","Esqueci"],"prefere":"Site ou aplicativo","d2":"Assistente responde na hora","assistente":"Sim, com opção de falar com pessoa","pesa":["Formação","Localização"],"desconfia":["Conteúdo pouco sério","Seguidores sem formação"],"segue":"Sigo, nunca agendei"},
    {"idade":"18 a 24","uf":"SP","plano":"Com reembolso","esp":"Dermatologista","conheceu":"Google","checou":["Avaliações no Google","Instagram do médico","Site do médico ou da clínica"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"nao","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Aviso automático","assistente":"sim","pesa":["Avaliações de pacientes","Indicação de confiança"],"desconfia":["Promessa de resultado","Antes e depois"],"segue":"Sigo, nunca agendei"},
    {"idade":"35 a 44","uf":"RJ","plano":"Sem reembolso","esp":"Dermatologista","conheceu":"Lista do plano","checou":["Avaliações no Google","Avaliações na Doctoralia ou similar"],"marcou":"Ligação","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"sim","porque":["Imprevisto e difícil desmarcar","Melhorei"],"prefere":"WhatsApp","d2":"Assistente responde na hora","assistente":"Sim, com opção de falar com pessoa","pesa":["Indicação de confiança","Avaliações de pacientes"],"desconfia":["Promessa de resultado","Conteúdo pouco sério"],"segue":"Não sigo"},
    {"idade":"25 a 34","uf":"RJ","plano":"Sem reembolso","esp":"Ginecologista","conheceu":"Lista do plano","checou":["Não busquei informações"],"marcou":"Ligação","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"sim","porque":["Imprevisto e difícil desmarcar"],"prefere":"WhatsApp","d2":"Assistente responde na hora","assistente":"Sim, com opção de falar com pessoa","pesa":["Facilidade para agendar","Localização"],"desconfia":["Antes e depois"],"segue":"Sigo, nunca agendei"},
    {"idade":"18 a 24","uf":"SP","plano":"Com reembolso","esp":"Ginecologista","conheceu":"Indicação de amigo ou familiar","checou":["Não busquei informações"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Uma vez","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Tanto faz","assistente":"nao","pesa":["Indicação de confiança","Localização"],"desconfia":["Promessa de resultado","Antes e depois","Seguidores sem formação","Conteúdo pouco sério","Preço em destaque"],"segue":"Não sigo"},
    {"idade":"25 a 34","uf":"SP","plano":"Com reembolso","esp":"Ginecologista","conheceu":"Já era meu médico","checou":["Instagram do médico","CRM ou RQE","Perguntei a conhecidos"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Assistente responde na hora","assistente":"Sim, com opção de falar com pessoa","pesa":["Formação","Indicação de confiança"],"desconfia":["Promessa de resultado","Conteúdo pouco sério","Preço em destaque"],"segue":"Sigo e já agendei"},
    {"idade":"25 a 34","uf":"RJ","plano":"Com reembolso","esp":"Dermatologista","conheceu":"Já era meu médico","checou":["Perguntei a conhecidos"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"1 a 4 horas","confirmada":"sim","desistiu":"nao","faltou":"nao","porque":[],"prefere":"Site ou aplicativo","d2":"Assistente responde na hora","assistente":"sim","pesa":["Indicação de confiança","Avaliações de pacientes"],"desconfia":["Conteúdo pouco sério","Preço em destaque","Promessa de resultado"],"segue":"Sigo, nunca agendei"},
    {"idade":"25 a 34","uf":"SP","plano":"Com reembolso","esp":"Dermatologista","conheceu":"Indicação de amigo ou familiar","checou":["Instagram do médico","Perguntei a conhecidos"],"marcou":"WhatsApp","momento":"Dia útil, à noite","tempo":"Dia seguinte ou mais","confirmada":"sim","desistiu":"nao","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Tanto faz","assistente":"sim","pesa":["Indicação de confiança","Preço"],"desconfia":["Promessa de resultado","Seguidores sem formação","Conteúdo pouco sério"],"segue":"Sigo, nunca agendei"},
    {"idade":"25 a 34","uf":"SP","plano":"Com reembolso","esp":"Ginecologista","conheceu":"Indicação de outro médico","checou":["Avaliações no Google","Instagram do médico"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Até 1 hora","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"sim","porque":["Esqueci"],"prefere":"WhatsApp","d2":"Assistente responde na hora","assistente":"Sim, com opção de falar com pessoa","pesa":["Indicação de confiança","Formação"],"desconfia":["Nada disso"],"segue":"Sigo e já agendei"},
    {"idade":"25 a 34","uf":"SP","plano":"Com reembolso","esp":"Psiquiatra","conheceu":"Google","checou":["Não busquei informações"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"1 a 4 horas","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Assistente responde na hora","assistente":"sim","pesa":["Indicação de confiança","Preço"],"desconfia":["Promessa de resultado","Conteúdo pouco sério"],"segue":"Sigo, nunca agendei"},
    {"idade":"18 a 24","uf":"SP","plano":"Com reembolso","esp":"Psiquiatra","conheceu":"Indicação de outro médico","checou":["Não busquei informações"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Assistente responde na hora","assistente":"Sim, com opção de falar com pessoa","pesa":["Formação","Preço"],"desconfia":["Nada disso"],"segue":"Sigo, nunca agendei"},
    {"idade":"18 a 24","uf":"SP","plano":"Com reembolso","esp":"Cardiologista","conheceu":"Doctoralia ou outro site","checou":["Avaliações no Google","Avaliações na Doctoralia ou similar"],"marcou":"Ligação","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"nao","desistiu":"Mais de uma vez","faltou":"sim","porque":["Esqueci","Imprevisto e difícil desmarcar","Achei outro horário ou médico"],"prefere":"Site ou aplicativo","d2":"Assistente responde na hora","assistente":"Sim, com opção de falar com pessoa","pesa":["Avaliações de pacientes","Preço"],"desconfia":["Antes e depois","Promessa de resultado"],"segue":"Sigo e já agendei"},
    {"idade":"60 ou mais","uf":"RJ","plano":"Não tem","esp":"Cardiologista","conheceu":"Indicação de amigo ou familiar","checou":["Perguntei a conhecidos"],"marcou":"Ligação","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"nao","faltou":"nao","porque":[],"prefere":"Site ou aplicativo","d2":"Tanto faz","assistente":"nao","pesa":["Indicação de confiança","Preço"],"desconfia":["Preço em destaque","Promessa de resultado"],"segue":"Sigo, nunca agendei"},
    {"idade":"25 a 34","uf":"SP","plano":"Com reembolso","esp":"Clínico geral","conheceu":"Lista do plano","checou":["Não busquei informações"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"nao","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Assistente responde na hora","assistente":"sim","pesa":["Indicação de confiança","Preço"],"desconfia":["Promessa de resultado","Seguidores sem formação"],"segue":"Sigo, nunca agendei"},
    {"idade":"25 a 34","uf":"RJ","plano":"Com reembolso","esp":"Ginecologista","conheceu":"Instagram ou outra rede","checou":["Instagram do médico"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"sim","porque":["Imprevisto e difícil desmarcar"],"prefere":"Site ou aplicativo","d2":"Tanto faz","assistente":"Sim, com opção de falar com pessoa","pesa":["Indicação de confiança","Formação"],"desconfia":["Seguidores sem formação","Conteúdo pouco sério"],"segue":"Sigo e já agendei"},
    {"idade":"25 a 34","uf":"RJ","plano":"Com reembolso","esp":"Outra","conheceu":"Indicação de amigo ou familiar","checou":["Instagram do médico","Site do médico ou da clínica"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Até 1 hora","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Tanto faz","assistente":"Sim, com opção de falar com pessoa","pesa":["Localização","Formação"],"desconfia":["Promessa de resultado","Preço em destaque","Conteúdo pouco sério"],"segue":"Sigo e já agendei"},
    {"idade":"25 a 34","uf":"RJ","plano":"Com reembolso","esp":"Ginecologista","conheceu":"Indicação de amigo ou familiar","checou":["Instagram do médico"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Até 1 hora","confirmada":"sim","desistiu":"nao","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Aviso automático","assistente":"nao","pesa":["Preço","Indicação de confiança"],"desconfia":["Conteúdo pouco sério","Preço em destaque"],"segue":"Sigo, nunca agendei"},
    {"idade":"35 a 44","uf":"SP","plano":"Com reembolso","esp":"Dermatologista","conheceu":"Lista do plano","checou":["Avaliações no Google"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Até 1 hora","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Assistente responde na hora","assistente":"sim","pesa":["Localização","Horário mais cedo"],"desconfia":["Nada disso"],"segue":"Não sigo"},
    {"idade":"25 a 34","uf":"RJ","plano":"Não tem","esp":"Ginecologista","conheceu":"Outro","checou":["Instagram do médico","Site do médico ou da clínica"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Uma vez","faltou":"sim","porque":["Imprevisto e difícil desmarcar","Outro"],"prefere":"Site ou aplicativo","d2":"Aviso automático","assistente":"Sim, com opção de falar com pessoa","pesa":["Preço","Horário mais cedo"],"desconfia":["Promessa de resultado"],"segue":"Sigo e já agendei"},
    {"idade":"25 a 34","uf":"RJ","plano":"Com reembolso","esp":"Ginecologista","conheceu":"Indicação de amigo ou familiar","checou":["Avaliações no Google","Instagram do médico","Avaliações na Doctoralia ou similar","CRM ou RQE"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"nao","porque":[],"prefere":"WhatsApp","d2":"Aviso automático","assistente":"sim","pesa":["Indicação de confiança","Avaliações de pacientes"],"desconfia":["Promessa de resultado","Seguidores sem formação","Conteúdo pouco sério"],"segue":"Sigo, nunca agendei"},
    {"idade":"18 a 24","uf":"SP","plano":"Com reembolso","esp":"Cardiologista","conheceu":"Já era meu médico","checou":["Avaliações no Google","Instagram do médico","Perguntei a conhecidos"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"Menos de 15 min","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"sim","porque":["Esqueci"],"prefere":"WhatsApp","d2":"Aviso automático","assistente":"sim","pesa":["Indicação de confiança","Localização"],"desconfia":["Conteúdo pouco sério"],"segue":"Sigo e já agendei"},
    {"idade":"25 a 34","uf":"SP","plano":"Sem reembolso","esp":"Outra","conheceu":"Lista do plano","checou":["Avaliações no Google"],"marcou":"WhatsApp","momento":"Dia útil, horário comercial","tempo":"1 a 4 horas","confirmada":"sim","desistiu":"Mais de uma vez","faltou":"nao","porque":[],"prefere":"Site ou aplicativo","d2":"Assistente responde na hora","assistente":"sim","pesa":["Avaliações de pacientes","Localização"],"desconfia":["Seguidores sem formação","Conteúdo pouco sério"],"segue":"Sigo, nunca agendei"}];

  /* ---------- contas ---------- */
  function conta(l, f) { return l.filter(f).length; }
  function mediana(v) { v = v.filter(function (x) { return x != null && !isNaN(x); }).sort(function (a, b) { return a - b; }); if (!v.length) return null; var m = Math.floor(v.length / 2); return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2; }
  function tem(lista, s) { return (lista || []).some(function (x) { return x.indexOf(s) >= 0; }); }
  function freq(l, f) { var o = {}; l.forEach(function (x) { var k = f(x); if (Array.isArray(k)) k.forEach(function (kk) { o[kk] = (o[kk] || 0) + 1; }); else o[k] = (o[k] || 0) + 1; }); return Object.keys(o).map(function (k) { return [k, o[k]]; }).sort(function (a, b) { return b[1] - a[1]; }); }
  function pct(x) { return Math.round(x * 100) + "%"; }
  function brl(v) { return v == null ? "sem dado" : "R$ " + Math.round(v).toLocaleString("pt-BR"); }

  /* Cada hipótese: o que diz, o corte fixado antes, o valor obtido e a decisão.
   * situacao: "passa" | "nao_passa" | "indicativo" (amostra abaixo do mínimo) | "inconclusivo" */
  function placarMedicos() {
    var L = MEDICOS, n = L.length;
    var querTem = conta(L, function (x) { return x.querTem === "S"; }) / n;
    var pagou = conta(L, function (x) { return x.pagou === "S"; }) / n;
    var equipe = conta(L, function (x) { return x.opcao === "Equipe"; }), plataforma = conta(L, function (x) { return x.opcao === "Plataforma"; });
    var bomP = mediana(L.filter(function (x) { return x.opcao === "Plataforma"; }).map(function (x) { return x.bom; }));
    var bomE = mediana(L.filter(function (x) { return x.opcao === "Equipe"; }).map(function (x) { return x.bom; }));
    var cfm = conta(L, function (x) { return x.cfm === "S"; }) / n;
    var ia = conta(L, function (x) { return x.ia === "Sim"; }) / n;
    var perm = mediana(L.filter(function (x) { return x.aindaUsa === "N"; }).map(function (x) { return x.meses; }));
    return {
      titulo: "Médicos de consultório", ficha: "Fichas 1 e 2", n: n, minimo: 5,
      linhas: [
        { id: "H1", hip: "Dor: o médico quer mais pacientes particulares e paga por marketing", indicador: "Querem mais particulares e têm horário / pagaram marketing em 12 meses", corte: "≥ 60% / ≥ 40%", valor: pct(querTem) + " / " + pct(pagou), situacao: querTem >= 0.6 && pagou >= 0.4 ? "passa" : "nao_passa" },
        { id: "H2", hip: "Disposição a pagar pelo modelo mais escolhido", indicador: "Preço “bom negócio” mediano · Plataforma / Equipe (" + pct(equipe / n) + " preferem a Equipe)", corte: "≥ R$ 500 / ≥ R$ 1.300", valor: brl(bomP) + " / " + brl(bomE), situacao: (equipe >= plataforma ? (bomE || 0) >= 1300 : (bomP || 0) >= 500) ? "passa" : "nao_passa" },
        { id: "H3", hip: "Conformidade com o CFM é gatilho de compra", indicador: "Citaram o CFM sem que a gente perguntasse", corte: "≥ 50%", valor: pct(cfm), situacao: cfm >= 0.5 ? "passa" : "nao_passa" },
        { id: "H8", hip: "O médico aceita conteúdo feito com IA e revisado", indicador: "Aceitam (Sim)", corte: "Referência", valor: pct(ia), situacao: "referencia" },
        { id: "H6", hip: "Permanência com o fornecedor", indicador: "Meses com o fornecedor que abandonou (mediana) → churn mensal", corte: "Modelo previa 3% ao mês", valor: (perm || 0) + " meses → " + (perm ? pct(1 / perm) : "-"), situacao: perm && 1 / perm > 0.03 ? "nao_passa" : "passa" }
      ],
      decisao: "Dor existe, mas o preço não fecha e o CFM não vende para o médico sozinho. Por isso, a Ficha 3 passa a vender para clínicas."
    };
  }

  function placarClinicas() {
    var L = CLINICAS, n = L.length, min = 5;
    var dor = conta(L, function (x) { return x.pagaInsatisfeita === "S"; }) / n;
    var pro = L.filter(function (x) { return x.medicos >= 5 && x.medicos <= 10; });
    var caro = mediana(pro.map(function (x) { return x.caro; }));
    var pil = conta(L, function (x) { return x.piloto === "Sim"; }) / n;
    var cfm = conta(L, function (x) { return x.cfm === "S"; }) / n;
    var pesa = conta(L, function (x) { return x.crmPesa === "S" || x.dtRevisa === "S"; });
    var wa = conta(L, function (x) { return x.contatos > 10 && (x.respondeNoite === "N" || x.resposta > 60); }) / n;
    var compra = conta(L, function (x) { return x.decisores <= 2 && x.dias <= 60; }) / n;
    function sit(ok, falha) { return n < min ? "indicativo" : ok ? "passa" : falha ? "nao_passa" : "inconclusivo"; }
    return {
      titulo: "Gestores de clínica", ficha: "Ficha 3", n: n, minimo: min,
      linhas: [
        { id: "H1c", hip: "Dor: a clínica paga marketing e está insatisfeita", indicador: "Pagam agência, freelancer ou anúncios e trocaram, pensaram em trocar ou deram nota até 3", corte: "≥ 60%", valor: pct(dor), situacao: sit(dor >= 0.6, dor < 0.6), tendencia: dor >= 0.6 ? "passa" : "nao_passa" },
        { id: "H2c", hip: "Preço: R$ 2.900 a R$ 8.900, fora mídia", indicador: "Mediana do “caro, mas consideraria” (5 a 10 médicos) e piloto pago (só “Sim”)", corte: "≥ R$ 3.500 e ≥ 40%", valor: brl(caro) + " e " + pct(pil), situacao: sit((caro || 0) >= 3500 && pil >= 0.4, (caro != null && caro < 2500) || pil === 0), tendencia: (caro || 0) >= 3500 && pil >= 0.4 ? "passa" : "nao_passa" },
        { id: "H3c", hip: "Conformidade pesa para a clínica", indicador: "Citam CFM, CRM ou diretor técnico sozinhos", corte: "≥ 40%", valor: pct(cfm) + " (" + pesa + " de " + n + " escolhem o CRM ou têm o diretor técnico revisando)", situacao: sit(cfm >= 0.4, cfm === 0 && pesa === 0), tendencia: cfm >= 0.4 ? "passa" : pesa ? "inconclusivo" : "nao_passa" },
        { id: "H9c", hip: "WhatsApp: a clínica perde pacientes no atendimento", indicador: "Mais de 10 contatos por semana e não respondem à noite ou demoram mais de 1 hora", corte: "≥ 60%", valor: pct(wa), situacao: sit(wa >= 0.6, wa < 0.2), tendencia: wa >= 0.6 ? "passa" : "nao_passa" },
        { id: "H10c", hip: "Compra rápida: poucos decisores", indicador: "1 ou 2 decisores e até 60 dias na última contratação", corte: "≥ 60%", valor: pct(compra), situacao: sit(compra >= 0.6, compra < 0.5), tendencia: compra >= 0.6 ? "passa" : "nao_passa" }
      ],
      decisao: n < min ? "Faltam " + (min - n) + " respostas de gestores para o placar valer (mínimo de " + min + "). Até lá, o resultado é indicativo. Se dor ou preço falharem, o pivô para clínicas sai da mesa." : "Placar fechado."
    };
  }

  function placarPacientes() {
    var L = PACIENTES, n = L.length;
    var insta = conta(L, function (x) { return x.conheceu.indexOf("Instagram") >= 0 || tem(x.checou, "Instagram"); }) / n;
    var desistiu = conta(L, function (x) { return x.desistiu !== "nao"; }) / n;
    var fora = conta(L, function (x) { return x.momento !== "Dia útil, horário comercial"; }) / n;
    var aceita = conta(L, function (x) { return x.assistente !== "nao"; }) / n;
    var faltaram = L.filter(function (x) { return x.faltou === "sim"; });
    var evitavel = faltaram.length ? conta(faltaram, function (x) { return tem(x.porque, "Esqueci") || tem(x.porque, "Imprevisto"); }) / faltaram.length : 0;
    var desconf = conta(L, function (x) { return tem(x.desconfia, "Promessa") || tem(x.desconfia, "Antes e depois"); }) / n;
    function s(ok) { return ok ? "passa" : "nao_passa"; }
    return {
      titulo: "Pacientes", ficha: "Pesquisa nova (mercado de dois lados)", n: n, minimo: 80,
      linhas: [
        { id: "P1", hip: "O Instagram participa da escolha do médico", indicador: "Descobriram ou checaram o último médico pelo Instagram", corte: "≥ 30%", valor: pct(insta), situacao: s(insta >= 0.3), passaSe: "Conteúdo dos médicos fica na oferta", falhaSe: "Conteúdo vira secundário" },
        { id: "P2", hip: "Demora na resposta faz a clínica perder o paciente", indicador: "Desistiram de um médico por demora (12 meses)", corte: "≥ 30%", valor: pct(desistiu), situacao: s(desistiu >= 0.3), passaSe: "WhatsApp que responde na hora é o centro do valor", falhaSe: "WhatsApp é conveniência" },
        { id: "P3", hip: "O paciente procura fora do horário comercial", indicador: "Primeiro contato à noite ou no fim de semana", corte: "≥ 25%", valor: pct(fora), situacao: s(fora >= 0.25), passaSe: "Atendimento 24 horas", falhaSe: "O atendimento noturno sai do plano de entrada" },
        { id: "P4", hip: "O paciente aceita assistente virtual para agendar", indicador: "Aceitam (sem ressalva ou podendo falar com uma pessoa)", corte: "≥ 50%", valor: pct(aceita), situacao: s(aceita >= 0.5), passaSe: "Agente de IA com passagem para humano", falhaSe: "O agente só faz triagem" },
        { id: "P5", hip: "Faltas são evitáveis com lembrete", indicador: "Entre quem faltou (" + faltaram.length + "), citam esquecimento ou dificuldade de desmarcar", corte: "≥ 50%", valor: pct(evitavel), situacao: s(evitavel >= 0.5), passaSe: "Confirmação e lista de espera", falhaSe: "Sai do discurso de venda" },
        { id: "P6", hip: "Promessa e exagero geram desconfiança", indicador: "Marcam “promessa de resultado” ou “antes e depois”", corte: "≥ 50%", valor: pct(desconf), situacao: s(desconf >= 0.5), passaSe: "O Guardião protege também a imagem da clínica", falhaSe: "Guardião é só proteção regulatória" }
      ],
      decisao: "Passam P1, P2, P4, P5 e P6. P3 não passa: só " + pct(fora) + " procuram fora do horário. O valor do WhatsApp está em responder na hora, a qualquer hora, e não só à noite. A amostra (" + n + ") ainda está abaixo da meta de 80 e concentrada em 25 a 34 anos."
    };
  }

  /* O que se diz × o que se faz (pacientes) */
  function ditoFeito() {
    var L = PACIENTES, n = L.length;
    return {
      n: n,
      marcar: { feito: freq(L, function (x) { return x.marcou; }), dito: freq(L, function (x) { return x.prefere; }) },
      instagram: {
        descobriu: conta(L, function (x) { return x.conheceu.indexOf("Instagram") >= 0; }),
        checou: conta(L, function (x) { return tem(x.checou, "Instagram"); }),
        agendouPeloConteudo: conta(L, function (x) { return x.segue === "Sigo e já agendei"; }),
        pesaConteudo: conta(L, function (x) { return tem(x.pesa, "Conteúdo"); })
      },
      descoberta: freq(L, function (x) { return x.conheceu; }),
      pesa: freq(L, function (x) { return x.pesa; }),
      desconfia: freq(L, function (x) { return x.desconfia; }),
      noite: freq(L, function (x) { return x.d2; }),
      tempo: freq(L, function (x) { return x.tempo; }),
      idade: freq(L, function (x) { return x.idade; })
    };
  }

  /* Como o pitch (slide de validação) resume: uma linha por hipótese, com o corte fixado antes. */
  function resumoPitch() {
    var c = placarClinicas(), p = placarPacientes(), m = placarMedicos();
    function L(pl, id) { return pl.linhas.filter(function (x) { return x.id === id; })[0]; }
    return [
      { hip: "Dor: insatisfeita com o marketing", teste: "Paga agência ou anúncios e está insatisfeita", corte: "60% dos gestores", linha: L(c, "H1c"), n: c.n + " gestores" },
      { hip: "Preço: R$ 2.900 a 8.900, fora mídia", teste: "Faixa de preço e piloto pago", corte: "Mediana de R$ 3.500 e 40% topam o piloto", linha: L(c, "H2c"), n: c.n + " gestores" },
      { hip: "Pacientes: demora na resposta faz perder a consulta", teste: "Já desistiram por demora?", corte: "30% dos pacientes", linha: L(p, "P2"), n: p.n + " pacientes" },
      { hip: "WhatsApp: a clínica perde pacientes", teste: "Volume de contatos e tempo de resposta", corte: "60% dos gestores", linha: L(c, "H9c"), n: c.n + " gestores" },
      { hip: "Médico sozinho: dor e preço (Fichas 1 e 2)", teste: "Entrevistas com médicos", corte: "Dor ≥ 60%; preço ≥ R$ 500", linha: L(m, "H2"), extra: L(m, "H1"), n: m.n + " médicos" }
    ];
  }

  var api = { COLETA: COLETA, MEDICOS: MEDICOS, CLINICAS: CLINICAS, PACIENTES: PACIENTES, placarMedicos: placarMedicos, placarClinicas: placarClinicas, placarPacientes: placarPacientes, ditoFeito: ditoFeito, resumoPitch: resumoPitch, mediana: mediana };
  g.Pesquisa = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
