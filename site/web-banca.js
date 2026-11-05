/* Jalecon · bastidores para a banca: validação (placar calculado da pesquisa), viabilidade (conta de padeiro) e piloto. */
(function (J) {
  "use strict";
  var P = window.Pesquisa, N = window.Negocio, C = window.Clinica;
  var V = J.VIEWS, A = J.ACOES, I = J.INPUTS, esc = J.esc, fmt = J.fmt, ICON = J.ICON;
  var ROT_SIT = { passa: "passa", nao_passa: "não passa", indicativo: "indicativo", inconclusivo: "inconclusivo", referencia: "referência" };
  function sit(s, tend) { return '<span class="sit ' + s + '">' + ROT_SIT[s] + "</span>" + (tend && s === "indicativo" ? ' <span class="small">tende a: ' + ROT_SIT[tend] + "</span>" : ""); }
  function brl(v) { return "R$ " + Math.round(v).toLocaleString("pt-BR"); }

  /* =========================================================== VALIDAÇÃO */
  function tabela(pl) {
    return '<div class="card"><div class="row between wrap"><div><span class="eyebrow">' + esc(pl.ficha) + '</span><h2 class="t">' + esc(pl.titulo) + '</h2></div><span class="pill ' + (pl.n >= pl.minimo ? "ok" : "warn") + '">' + pl.n + " respostas · mínimo " + pl.minimo + "</span></div>" +
      '<div class="tb-wrap"><table class="tb"><thead><tr><th>#</th><th>Hipótese</th><th>Como testamos</th><th>Corte (fixado antes)</th><th>Resultado</th><th>Situação</th></tr></thead><tbody>' +
      pl.linhas.map(function (l) { return "<tr><td><b>" + esc(l.id) + "</b></td><td>" + esc(l.hip) + (l.passaSe ? '<br><span class="small">Se passa: ' + esc(l.passaSe) + ". Se falha: " + esc(l.falhaSe) + ".</span>" : "") + '</td><td class="small">' + esc(l.indicador) + "</td><td>" + esc(l.corte) + '</td><td class="num"><b>' + esc(l.valor) + "</b></td><td>" + sit(l.situacao, l.tendencia) + "</td></tr>"; }).join("") +
      '</tbody></table></div><p class="small"><b>Decisão:</b> ' + esc(pl.decisao) + "</p></div>";
  }
  function barras(lista, n, cor) {
    var max = Math.max.apply(null, lista.map(function (x) { return x[1]; }).concat([1]));
    return '<div class="stack">' + lista.map(function (x) { return '<div><div class="row between small"><span>' + esc(x[0]) + '</span><b class="num">' + x[1] + " (" + Math.round(x[1] / n * 100) + '%)</b></div><div class="bar' + (cor ? " ap" : "") + '"><span style="width:' + (x[1] / max * 100) + '%"></span></div></div>'; }).join("") + "</div>";
  }
  V.validacao = function () {
    var pm = P.placarMedicos(), pc = P.placarClinicas(), pp = P.placarPacientes(), df = P.ditoFeito(), rs = P.resumoPitch();
    var aba = J.S.aba.val || "placar";
    var abas = [["placar", "Placar das hipóteses"], ["dito", "Dito × feito (pacientes)"], ["pitch", "Resumo para o slide"], ["produto", "O que muda no produto"]];
    var corpo;
    if (aba === "placar") corpo = tabela(pp) + tabela(pc) + tabela(pm);
    else if (aba === "dito") corpo = '<div class="g2"><div class="card"><h2 class="t">Como marcou a última consulta</h2>' + barras(df.marcar.feito, df.n, true) + '</div><div class="card"><h2 class="t">Como prefere marcar</h2>' + barras(df.marcar.dito, df.n) + "</div></div>" +
      '<div class="g2"><div class="card"><h2 class="t">Instagram: o que se faz</h2><table class="tb"><tbody><tr><th>Descobriram o médico pelo Instagram</th><td class="n">' + df.instagram.descobriu + " de " + df.n + '</td></tr><tr><th>Checaram o médico no Instagram antes de marcar</th><td class="n">' + df.instagram.checou + " de " + df.n + '</td></tr><tr><th>Seguem médicos e já marcaram pelo conteúdo</th><td class="n">' + df.instagram.agendouPeloConteudo + " de " + df.n + '</td></tr><tr><th>Dizem que o conteúdo pesa na escolha</th><td class="n">' + df.instagram.pesaConteudo + " de " + df.n + '</td></tr></tbody></table><p class="small">O conteúdo quase nunca é a porta de entrada, mas é onde o paciente confere o médico antes de marcar. Ninguém diz que pesa; 1 em 3 já marcou por ele.</p></div>' +
      '<div class="card"><h2 class="t">Como descobriu o médico</h2>' + barras(df.descoberta, df.n, true) + "</div></div>" +
      '<div class="g2"><div class="card"><h2 class="t">O que gera desconfiança nas redes</h2>' + barras(df.desconfia, df.n, true) + '</div><div class="card"><h2 class="t">Mensagem às 22h: o que prefere</h2>' + barras(df.noite, df.n) + '<h3 class="t">Tempo até a primeira resposta</h3>' + barras(df.tempo, df.n) + "</div></div>";
    else if (aba === "pitch") corpo = '<div class="card"><h2 class="t">Validação e aprendizado: o que testamos, com cortes fixados antes</h2><div class="tb-wrap"><table class="tb"><thead><tr><th>Hipótese</th><th>Como testamos</th><th>Passa se (fixado antes)</th><th>Resultado</th><th>Situação</th></tr></thead><tbody>' +
      rs.map(function (x) { return "<tr><td>" + esc(x.hip) + '</td><td class="small">' + esc(x.teste) + "</td><td>" + esc(x.corte) + '</td><td class="num"><b>' + esc(x.linha.valor) + "</b>" + (x.extra ? '<br><span class="small">Dor: ' + esc(x.extra.valor) + "</span>" : "") + '<br><span class="small">' + esc(x.n) + "</span></td><td>" + sit(x.linha.situacao, x.linha.tendencia) + "</td></tr>"; }).join("") +
      '</tbody></table></div><p class="small">Fichas 1 e 2: médico de consultório. Ficha 3: clínicas, que pagam e perdem paciente no WhatsApp. Se dor ou preço falharem com os gestores, voltamos ao médico individual.</p>' +
      '<div class="aviso">' + ICON.warn.replace("<svg", '<svg width="18" height="18"') + '<span>No deck atual, o slide “Resultados dos testes de hipóteses” mistura linhas: a linha “Pacientes: demora na resposta” mostra o churn dos médicos (25%) e a linha “WhatsApp” mostra a citação do CFM (0%). Use esta tabela para corrigir.</span></div></div>';
    else corpo = '<div class="g2">' + [
      ["P2 passa (70%)", "Responder na hora é o centro do valor do WhatsApp, em qualquer horário.", "ok"],
      ["P3 não passa (7%)", "Pelo método, o atendimento noturno sai do plano de entrada. O raio-x usa 7% como padrão; a hipótese de 35% do pitch fica como alternativa. Decisão do grupo: manter ou não a cena das 22h47 na banca.", "block"],
      ["P4 passa (85%)", "Agente de IA no WhatsApp, sempre com passagem para uma pessoa.", "ok"],
      ["P5 passa (8 de 8)", "Confirmação e lista de espera ficam no plano Pro e no piloto.", "ok"],
      ["P6 passa (67%)", "O Guardião protege também a imagem da clínica, não só o CRM: argumento de venda para o gestor.", "ok"],
      ["P1 passa (41%)", "Conteúdo fica na oferta, como lugar de checagem do médico, não como porta de entrada.", "ok"],
      ["H2 e H3 dos médicos não passam", "O médico sozinho não paga e não compra por conformidade: por isso o cliente é a clínica (Ficha 3).", "block"],
      ["Gestores: 2 de 5 respostas", "Placar dos gestores ainda é indicativo. Faltam 3 respostas para a banca.", "warn"],
      ["Substitui ou soma: 1 não sabe, 1 soma", "É a grande questão do negócio: a clínica troca os fornecedores atuais pela Jalecon? As próximas entrevistas com gestores precisam aprofundar o porquê, e o piloto passa a medir os fornecedores trocados.", "warn"]
    ].map(function (x) { return '<div class="card"><span class="pill ' + x[2] + '">' + esc(x[0]) + "</span><p>" + esc(x[1]) + "</p></div>"; }).join("") + "</div>";
    return J.cab("Bastidores · validação e aprendizado", "Hipóteses e cortes fixados antes; o placar sai das respostas", "A mesma base metodológica nas três pesquisas: escrevemos a hipótese, o indicador e o corte antes de coletar, perguntamos por fatos passados (não pelo que fariam) e decidimos pivotar ou seguir pelo placar. Esta tela recalcula tudo a partir das respostas anonimizadas da planilha.") +
      '<div class="metodo">' + [["1 · Hipótese", "O que precisa ser verdade para o negócio funcionar."], ["2 · Corte fixado antes", "O número que faz passar ou não, escrito antes da coleta."], ["3 · Fato, não opinião", "Perguntas sobre a última consulta, o último fornecedor, o último gasto."], ["4 · Decisão", "Passa: reforça a oferta. Falha: muda o produto ou o cliente."]].map(function (x) { return "<div><b>" + x[0] + '</b><span class="small">' + x[1] + "</span></div>"; }).join("") + "</div>" +
      '<div class="g4">' + J.kpi("Pacientes", pp.n, "meta de 80 a 150") + J.kpi("Gestores de clínica", pc.n, "mínimo de 5") + J.kpi("Médicos", pm.n, "meta de 5 a 10") + J.kpi("Hipóteses testadas", pp.linhas.length + pc.linhas.length + pm.linhas.length, "coleta até " + P.COLETA) + "</div>" +
      '<div class="tabs" role="tablist">' + abas.map(function (a) { return '<button type="button" role="tab" aria-selected="' + (aba === a[0]) + '" class="' + (aba === a[0] ? "on" : "") + '" data-act="aba-val" data-aba="' + a[0] + '">' + a[1] + "</button>"; }).join("") + "</div>" + corpo +
      '<div class="card plano"><p class="small"><b>Vieses declarados:</b> amostra de pacientes concentrada em 25 a 34 anos e em SP e RJ (rede dos alunos); 6 de 8 médicos são próximos do grupo (entre os não próximos, o resultado de dor se mantém). Dados de ' + esc(P.COLETA) + ', sem nome, telefone ou texto livre. Pesquisa aberta em <a href="/pesquisa">/pesquisa</a>.</p></div>';
  };
  A["aba-val"] = function (b) { J.S.aba.val = b.dataset.aba; J.render(); };

  /* =========================================================== VIABILIDADE */
  var CAMPOS = [
    ["preco", "Mensalidade do plano (R$)", 2900, 8900, 100],
    ["ticket", "Valor da consulta particular (R$)", 200, 1200, 10],
    ["clinicasPorEspecialista", "Clínicas por especialista (o número que ainda é chute)", 6, 30, 1],
    ["salarioEspecialista", "Custo do especialista (R$/mês)", 8000, 16000, 500],
    ["custoDireto", "IA, WhatsApp, site, design e agenda por clínica (R$/mês)", 200, 1500, 10],
    ["churnPct", "Clínicas que cancelam por mês (churn)", 0.5, 6, 0.1],
    ["cac", "CAC: custo total para conquistar uma clínica (R$)", 5000, 40000, 50]
  ];
  function dec(v, n) { return String(Math.round(v * Math.pow(10, n)) / Math.pow(10, n)).replace(".", ","); }
  function fmtCampo(id, v) { return id === "clinicasPorEspecialista" ? String(v) : id === "churnPct" ? dec(v, 1) + "%" : brl(v); }
  function mil(v) { return "R$ " + dec(v / 1000, 1) + " mil"; }
  V.viabilidade = function () {
    var o = J.S.negocio, c = N.conta(o), p = c.p;
    var campos = CAMPOS.map(function (f) {
      var v = p[f[0]];
      return '<div class="slider"><div class="row between"><label for="ng-' + f[0] + '" class="lbl" style="font-weight:600">' + esc(f[1]) + '</label><b id="nv-' + f[0] + '" style="white-space:nowrap">' + fmtCampo(f[0], v) + "</b></div>" +
        '<input type="range" id="ng-' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '" value="' + v + '" data-in="neg" data-id="' + f[0] + '"></div>';
    }).join("");
    return J.cab("Bastidores · viabilidade", "Conta de padeiro: a clínica se paga com 11 consultas a mais por mês", "Viabilidade começa pela clínica (custo evitado, horas, risco e payback) e depois mostra a Jalecon (margem, LTV e CAC). Os números da Jalecon seguem o Modelo C no cenário base, os mesmos do slide Economia por plano; mexa e veja o que precisa ser verdade.") +
      '<div class="g-side"><div class="stack" id="viab-res">' + resViab(c) + "</div>" +
      '<div class="card"><div class="row between"><h2 class="t">Premissas</h2><button class="btn ghost sm" type="button" data-act="neg-reset">Voltar ao cenário base</button></div>' + campos +
      '<p class="small">Fixos do modelo: impostos de ' + dec(p.impostos * 100, 1) + "% e meios de pagamento de " + dec(p.meiosPg * 100, 0) + "% sobre a receita, implantação de " + brl(p.implantacao) + " por clínica nova (a clínica paga uma mensalidade de taxa) e " + p.horasMes + " horas produtivas do especialista por mês.</p></div></div>" +
      '<div class="card"><h2 class="t">Por que a Jalecon: quem a clínica contrata hoje</h2><div class="tb-wrap"><table class="tb"><thead><tr><th></th>' + N.CONCORRENCIA.colunas.map(function (x) { return "<th>" + esc(x) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      N.CONCORRENCIA.linhas.map(function (l) { return '<tr' + (l[0] === "Jalecon" ? ' class="destaque"' : "") + "><th>" + esc(l[0]) + "</th>" + l.slice(1).map(function (x) { return "<td>" + esc(x) + "</td>"; }).join("") + "</tr>"; }).join("") +
      '</tbody></table></div><p class="small">Preços públicos dos sites (out/2026); agências, faixa de mercado. A clínica não troca um fornecedor pela Jalecon, troca três ou quatro. O app é copiável; os dados de conversão, as preferências dos médicos e a biblioteca normativa curada, não.</p></div>';
  };
  function resViab(c) {
    var p = c.p;
    var passaLtv = c.ltvCac >= p.corteLtvCac, passaPb = c.paybackCac <= p.cortePayback;
    return '<div class="g2"><div class="card"><span class="eyebrow">Clínica · custo × retorno</span><p>Paga ' + brl(p.preco) + ". Evita " + brl(p.custoEvitadoMin) + " a " + brl(p.custoEvitadoMax) + " de agência e atendimento e ganha cerca de " + p.horasRecepcao + ' horas de recepção por mês.</p></div>' +
      '<div class="card"><span class="eyebrow">Clínica · payback</span><p><b class="num" style="font-family:var(--display);font-size:28px">' + c.consultasPagam + "</b> consultas a mais por mês (" + brl(p.ticket) + " cada) pagam a mensalidade: " + dec(c.porMedico, 1) + " por médico numa clínica de " + p.medicos + ".</p></div>" +
      '<div class="card' + (c.dentroTeto && c.passaMargem ? "" : " alerta") + '"><span class="eyebrow">Jalecon · margem</span><p>Entregar custa <b>' + brl(c.custo) + "</b> por clínica (especialista " + brl(c.especialista) + " + IA e ferramentas " + brl(p.custoDireto) + "), " + (c.dentroTeto ? "dentro do teto de " + brl(p.teto) + " da Ficha 3." : "acima do teto de " + brl(p.teto) + ": reduzir o escopo para marca, site e conteúdo (Ficha 3).") +
        " Depois de impostos e meios de pagamento, sobram <b>" + brl(c.margem) + "</b> por mês: margem bruta de <b>" + J.pct(c.margemPct) + "</b>" + (c.passaMargem ? ", acima do corte de 70%." : ", abaixo do corte de 70%: precisa de mais clínicas por especialista ou preço maior.") + "</p>" +
        '<p class="small">Cerca de ' + dec(c.horasPorClinica, 1) + " horas do especialista por clínica por mês. " + c.equilibrio + " clínicas pagam o custo fixo de " + brl(p.custoFixo) + " por mês.</p></div>" +
      '<div class="card' + (passaLtv && passaPb ? "" : " alerta") + '"><span class="eyebrow">Jalecon · LTV e CAC</span><p>A clínica fica em média <b>' + dec(c.vida, 0) + " meses</b> (churn de " + dec(p.churnPct, 1) + "% ao mês). LTV de <b>" + mil(c.ltv) + "</b> e CAC de " + brl(p.cac) + ": <b>LTV/CAC " + dec(c.ltvCac, 1) + "</b> (corte: " + p.corteLtvCac + ") e payback do CAC de <b>" + dec(c.paybackCac, 1) + " meses</b> (corte: " + p.cortePayback + ").</p>" +
        '<p class="small">LTV = contribuição ÷ churn + taxa de implantação − custo de implantação, sem receita de expansão. CAC total do ano 5: mídia, vendas, marketing e comissões. Mesma conta do Modelo C.</p></div></div>';
  }
  I.neg = function (t) {
    var id = t.dataset.id, v = +t.value; J.S.negocio[id] = v;
    var l = document.getElementById("nv-" + id); if (l) l.textContent = fmtCampo(id, v);
    var box = document.getElementById("viab-res"); if (box) box.innerHTML = resViab(N.conta(J.S.negocio));
    return false;
  };
  A["neg-reset"] = function () { J.S.negocio = {}; J.render(); J.toast("Cenário base do Modelo C: R$ 4.900, 16 clínicas por especialista, churn de 2,5% e CAC de R$ 20.550."); };

  /* =========================================================== PILOTO */
  V.piloto = function () {
    var S = J.S, PI = N.PILOTO, av = N.avaliarPiloto(S.piloto), todas = av.every(function (x) { return x.ok === true; }), alguma = av.some(function (x) { return x.ok === false; });
    var PE = N.PEDIDO, max = PE.uso[0][1];
    return J.cab("Bastidores · piloto e pedido", "O menor teste da suposição fatal: prazo e custo fixos, escopo cortado", "Triângulo de ferro: " + PI.prazo + ", " + brl(PI.custo) + " de custo e só o que testa a suposição. As mensalidades somam " + brl(PI.mensalidades) + ": o piloto se paga. Medimos as horas do especialista por clínica e os cancelamentos antes de pedir investimento.") +
      '<div class="g4">' + J.kpi("Prazo", PI.prazo, PI.clinicas + " clínicas Pro de 5 a 10 médicos", true) + J.kpi("Custo", brl(PI.custo), "especialista em meio período, IA, ferramentas e impostos") + J.kpi("Mensalidades", brl(PI.mensalidades), "3 clínicas × 3 meses × R$ 4.900") + J.kpi("Tempo do grupo", "≈ 10 h", "por semana") + "</div>" +
      '<div class="g2"><div class="card"><h2 class="t">Escopo: só o que testa</h2><ul class="list">' + PI.escopo.map(function (x) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + esc(x) + "</li>"; }).join("") + "</ul><p class=\"small\">Ficam para depois: " + esc(PI.fora.join(", ")) + '. Nesta versão web, dá para testar tudo, inclusive o que fica fora do piloto.</p><p><b>Suposição fatal:</b> ' + esc(PI.suposicao) + '</p><p class="small"><b>A grande questão do negócio:</b> ' + esc(PI.grandeQuestao) + " O piloto mede as duas coisas: consultas a mais e fornecedores trocados.</p></div>" +
      '<div class="card' + (todas ? " live" : alguma ? " alerta" : "") + '"><h2 class="t">Metas do piloto: lance o que foi medido</h2>' + av.map(function (m) {
        return '<div class="row between wrap"><label for="pl-' + m.id + '" style="flex:1;min-width:200px">' + esc(m.rot) + ' <span class="small">(meta: ' + (m.tipo === "min" ? "pelo menos " : "até ") + (m.id === "custo" ? brl(m.meta) : m.meta) + ')</span></label><input class="inp" style="width:120px" id="pl-' + m.id + '" inputmode="numeric" data-in-change="piloto" data-id="' + m.id + '" value="' + (m.valor == null ? "" : m.valor) + '">' + (m.ok == null ? '<span class="pill info">a medir</span>' : m.ok ? '<span class="sit passa">bateu</span>' : '<span class="sit nao_passa">não bateu</span>') + "</div>";
      }).join("") +
      '<p><b>Decisão:</b> ' + decisao(av) + '</p><button class="link" type="button" data-act="piloto-exemplo">Preencher com um cenário de exemplo</button></div></div>' +
      '<div class="g2"><div class="card accent"><span class="eyebrow">O pedido de hoje</span><h2 class="t">3 a 5 clínicas para um piloto pago</h2><p>' + esc(PE.hoje) + '</p><ol class="timeline"><li class="ok"><span><b>Agora</b> · pesquisa com médicos, gestores e pacientes, com cortes fixados antes</span></li><li><span><b>Novembro</b> · piloto pago com 3 a 5 clínicas, dados reais e supervisão humana</span></li><li><span><b>Meta</b> · 11 consultas a mais por clínica por mês, custo até R$ 1.470 e nenhum cancelamento</span></li><li><span><b>Se bater a meta</b> · cerca de R$ 250 mil de investimento anjo</span></li></ol></div>' +
      '<div class="card"><span class="eyebrow">Se o piloto bater as metas</span><h2 class="t">' + brl(PE.depois) + " de investimento anjo para 6 meses</h2>" + PE.uso.map(function (u) { return '<div><div class="row between small"><span>' + esc(u[0]) + '</span><b class="num">' + brl(u[1]) + '</b></div><div class="bar ap"><span style="width:' + (u[1] / max * 100) + '%"></span></div></div>'; }).join("") + '<p class="small">' + esc(PE.objetivo) + "</p></div></div>";
  };
  function decisao(av) {
    var v = {}; av.forEach(function (m) { v[m.id] = m.ok; });
    if (av.every(function (m) { return m.ok === true; })) return "as clínicas ganharam consultas e trocaram fornecedores pela Jalecon: renova e escalamos, e pedimos o investimento anjo.";
    if (v.consultas === false) return "a clínica não ganhou as consultas: revemos preço e escopo (Ficha 3).";
    if (v.consultas === true && v.fornecedores === false) return "a clínica ganha consultas, mas soma a Jalecon aos fornecedores em vez de trocá-los. A tese de fornecedor único não se confirmou: seguimos com a parte de atendimento e medição e revemos o preço, que precisa se pagar só com consultas.";
    if (v.custo === false) return "o custo de entrega passou do teto: reduzimos o escopo para marca, site e conteúdo (Ficha 3).";
    if (v.cancelamentos === false) return "houve cancelamento: entender o motivo antes de escalar.";
    return "aguardando as medições.";
  }
  I.piloto = function (t) { J.S.piloto[t.dataset.id] = t.value === "" ? "" : J.num(t.value); return true; };
  A["piloto-exemplo"] = function () { J.S.piloto = { consultas: 14, custo: 1380, cancelamentos: 0, fornecedores: 1 }; J.render(); };
})(window.JW);
