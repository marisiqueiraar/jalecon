/* Jalecon · telas do ciclo: 1 Anamnese e raio-x · 2 Estúdio · 3 IA revisa IA · 4 Médico revisa · 5 Guardião e aprovação.
 * (6 Pulso fica em web-operacao.js.)
 */
(function (J) {
  "use strict";
  var G = window.Guardiao, C = window.Clinica, CT = window.Conteudo, R = window.Revisao, K = window.Critica;
  var V = J.VIEWS, A = J.ACOES, I = J.INPUTS, D = J.DEPOIS, esc = J.esc, fmt = J.fmt, ICON = J.ICON;
  var REF = { ano: 2026, mes: 10 }; // novembro de 2026
  var TONS = [["acolhedora", "Acolhedor"], ["tecnica", "Técnico"], ["proxima", "Próximo e leve"], ["sobria", "Sóbrio"]];
  var COR_ST = { rascunho: "info", em_revisao: "warn", bloqueado: "block", aprovado: "ok", agendado: "solid" };
  var ROT_ETAPA = { rascunho: "rascunho", ia: "revisada", medico: "com o DT", aprovada: "aprovada", devolvida: "devolvida" };

  /* =========================================================== 1 · ANAMNESE */
  var PASSOS = ["A clínica", "Atendimento hoje", "Gasto e responsável"];
  V.anamnese = function () {
    var S = J.S;
    if (S.diagFeito && J.rotaAtual().nome === "anamnese" && !S.editando) return V.raiox();
    var d = S.diag, p = S.passo, corpo = "", c = J.campo, inp = J.input;
    if (p === 0) {
      corpo = c("nome", "Nome da clínica", inp("nome", d.nome, ' autocomplete="organization"')) +
        '<div class="grid-uf">' + c("cidade", "Cidade", inp("cidade", d.cidade)) + c("uf", "UF", inp("uf", d.uf, ' maxlength="2"')) + "</div>" +
        c("medicos", "Quantos médicos atendem na clínica?", inp("medicos", d.medicos, ' inputmode="numeric"'), "Entre 2 e 60. O plano é indicado pelo porte.") +
        "<fieldset><legend>Especialidades principais</legend><div class=\"chips\">" + C.ESP_ORDEM.map(function (k, i) {
          var on = (d.especialidades || []).indexOf(k) >= 0;
          return '<label class="chip"><input type="checkbox" id="c-esp' + i + '" value="' + k + '" data-k="especialidades"' + (on ? " checked" : "") + "><span>" + esc(C.ESP[k].nome) + "</span></label>";
        }).join("") + "</div></fieldset>" +
        J.radios("particular", [[30, "Menos da metade"], [60, "Mais da metade"], [85, "Quase tudo"]], d.particular, "Quanto da receita vem de pacientes particulares?");
    } else if (p === 1) {
      corpo = c("contatos", "Contatos de pacientes novos por semana (WhatsApp, telefone, site)", inp("contatos", d.contatos, ' inputmode="numeric"'), "Uma estimativa basta.") +
        J.radios("quem", C.QUEM, d.quem, "Quem responde hoje?") +
        J.radios("resposta", C.RESPOSTA, d.resposta, "Em horário comercial, quanto demora a primeira resposta?") +
        J.radios("foraHorario", [["sim", "Sim"], ["nao", "Não"]], d.foraHorario, "Alguém responde à noite e no fim de semana?") +
        J.radios("mede", [["sim", "Sim"], ["nao", "Não"]], d.mede, "Vocês sabem quantos contatos viram consulta?") +
        J.radios("faltas", C.FALTAS, d.faltas, "Quantos pacientes faltam às consultas?");
    } else {
      corpo = '<div class="g2">' + c("gastoAgencia", "Agência ou freelancer (R$/mês)", inp("gastoAgencia", d.gastoAgencia, ' inputmode="numeric"')) + c("gastoAnuncios", "Verba de anúncios (R$/mês)", inp("gastoAnuncios", d.gastoAnuncios, ' inputmode="numeric"')) + "</div>" +
        c("gastoOutros", "Secretária virtual, atendente ou robô (R$/mês)", inp("gastoOutros", d.gastoOutros, ' inputmode="numeric"')) +
        c("ticket", "Valor médio de uma consulta particular (R$)", inp("ticket", d.ticket, ' inputmode="numeric"')) +
        c("diretor", "Nome do diretor técnico", inp("diretor", d.diretor), "Quem responde pela publicidade da clínica no CRM.") +
        J.radios("diretorSexo", [["f", "Diretora"], ["m", "Diretor"]], d.diretorSexo, "Como aparece na assinatura") +
        '<div class="g2">' + c("diretorCrm", "CRM do diretor técnico", inp("diretorCrm", d.diretorCrm, ' inputmode="numeric"')) + c("crmPJ", "Registro da clínica no CRM", inp("crmPJ", d.crmPJ, ' inputmode="numeric"')) + "</div>";
    }
    return J.cab("Passo 1 do ciclo · Anamnese · " + (p + 1) + " de 3", PASSOS[p], "Diagnóstico de 10 minutos com o gestor. As respostas definem o plano e alimentam o raio-x, o Estúdio e o painel.") +
      '<div class="g-side"><div class="card"><div class="progress" aria-hidden="true"><span style="width:' + ((p + 1) / 3 * 100) + '%"></span></div>' +
      '<form data-sub="diag" novalidate style="display:grid;gap:16px">' + corpo +
      '<div class="row">' + (p > 0 ? '<button class="btn ghost" type="button" data-act="voltar-diag">Voltar</button>' : "") + '<button class="btn" type="submit">' + (p < 2 ? "Continuar" : "Ver o raio-x da clínica") + "</button></div></form>" +
      J.sim("Os dados ficam só no seu navegador.") + "</div>" +
      '<div class="card plano"><h2 class="t">O que a anamnese mede</h2><ul class="list">' + ["Porte e especialidades: definem o plano e a identidade de cada médico", "Atendimento: onde a clínica perde pacientes (demora, noite, faltas)", "Gasto atual: o que a Jalecon substitui (agência, atendente, robô)", "Diretor técnico: quem aprova cada peça e responde no CRM"].map(function (t) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + t + "</li>"; }).join("") + '</ul><button class="btn ghost sm" type="button" data-act="exemplo">Preencher com a clínica de exemplo</button></div></div>';
  };
  function validar() {
    var S = J.S, d = S.diag, e = {};
    if (S.passo === 0) {
      if (!String(d.nome).trim()) e.nome = "Informe o nome da clínica.";
      if (d.medicos < 2 || d.medicos > 60) e.medicos = "Informe entre 2 e 60 médicos.";
      if (!/^[A-Za-z]{2}$/.test(d.uf)) e.uf = "Use a sigla, por exemplo SP.";
    } else if (S.passo === 1) {
      if (d.contatos < 1) e.contatos = "Informe uma estimativa de contatos por semana.";
    } else {
      if (!String(d.diretor).trim()) e.diretor = "Informe o nome do diretor técnico.";
      if (!/^\d{4,7}$/.test(String(d.diretorCrm))) e.diretorCrm = "CRM com 4 a 7 dígitos.";
    }
    J.T.erros = e;
    return !Object.keys(e).length;
  }
  I.diag = function (t) {
    var d = J.S.diag, k = t.dataset.k;
    if (k === "especialidades") { var l = (d.especialidades || []).filter(function (x) { return x !== t.value; }); if (t.checked) l.push(t.value); d.especialidades = l; return false; }
    if (["medicos", "contatos", "gastoAgencia", "gastoAnuncios", "gastoOutros", "ticket", "particular", "faltas", "resposta"].indexOf(k) >= 0) d[k] = J.num(t.value);
    else if (k === "uf") d.uf = t.value.toUpperCase();
    else if (k in d) d[k] = t.value;
    J.salvar();
    return false;
  };
  A["submit:diag"] = function () {
    var S = J.S;
    if (!validar()) { J.render(); var f = document.querySelector('[aria-invalid="true"]'); if (f) f.focus(); return; }
    if (S.passo < 2) { S.passo++; J.render({ topo: true }); return; }
    S.diagFeito = true; S.editando = false; J.preparar(); J.ir("raiox");
  };
  A["voltar-diag"] = function () { J.S.passo = Math.max(0, J.S.passo - 1); J.T.erros = {}; J.render({ topo: true }); };
  A["editar-diag"] = function () { J.S.passo = 0; J.S.editando = true; J.ir("anamnese"); };

  /* ---------- raio-x ---------- */
  function linhaFunil(rot, hoje, jal, base) {
    return '<div class="fr"><span>' + esc(rot) + '</span><span class="num"><b>' + fmt(hoje) + "</b> → <b>" + fmt(jal) + '</b></span><div class="fb h"><span style="width:' + Math.max(2, hoje / base * 100) + '%"></span></div><div class="fb"><span style="width:' + Math.max(2, jal / base * 100) + '%"></span></div></div>';
  }
  function raioRes() {
    var S = J.S, d = S.diag, r = C.raioX(d, S.prem);
    return '<div class="card"><div class="row between wrap"><h2 class="t">Hoje → com a Jalecon, por mês</h2><div class="legend"><span><i style="background:var(--fg-3)"></i>Hoje</span><span><i style="background:var(--apricot)"></i>Com a Jalecon (estimativa)</span></div></div>' +
      '<div class="funnel">' + linhaFunil("Contatos que seguem a conversa", r.hoje.respondidos, r.jalecon.respondidos, r.contatos) + linhaFunil("Consultas agendadas", r.hoje.agendados, r.jalecon.agendados, r.contatos) + linhaFunil("Pacientes que vieram", r.hoje.compareceram, r.jalecon.compareceram, r.contatos) + "</div>" +
      '<div class="g4">' + J.kpi("Consultas a mais por mês", "+" + fmt(r.consultasAMais), d.ticket ? "cerca de " + C.brl(r.receitaAMais) : "", true) +
      J.kpi("Perdidos por demora", fmt(r.perdidosDemora), "primeira resposta acima de 1 hora") + J.kpi("Perdidos fora do horário", fmt(r.perdidosFora), "noite e fim de semana") + J.kpi("Faltas", J.pct(r.jalecon.faltaPct), "eram " + d.faltas + "%") + "</div>" +
      (r.consultasAMais >= 11 ? '<p class="small">A mensalidade do Pro se paga com 11 consultas a mais por mês (R$ 4.900 ÷ R$ 450). Esta estimativa passa disso.</p>' : '<p class="small">Abaixo de 11 consultas a mais por mês, a mensalidade do Pro não se paga só com consultas. Confira as premissas.</p>') + "</div>";
  }
  function premissasCard() {
    var S = J.S;
    return '<div class="card"><div class="row between wrap"><h2 class="t">Premissas da conta</h2><span class="row wrap"><button class="btn ghost sm" type="button" data-act="prem-pesquisa">Usar a pesquisa</button><button class="btn ghost sm" type="button" data-act="prem-ficha">Usar a hipótese do pitch</button></span></div>' +
      '<p class="small">Cada número diz de onde vem. Em verde, medido na pesquisa; os demais são hipóteses que o piloto vai medir. Mexa e veja o raio-x mudar.</p>' +
      C.PREMISSAS.map(function (p) {
        var v = S.prem[p.id];
        return '<div class="slider"><div class="row between"><label for="pr-' + p.id + '" class="lbl" style="font-weight:600">' + esc(p.rot) + '</label><b id="pv-' + p.id + '">' + J.pct(v) + "</b></div>" +
          '<input type="range" id="pr-' + p.id + '" min="' + p.min + '" max="' + p.max + '" step="' + p.passo + '" value="' + v + '" data-in="prem" data-id="' + p.id + '">' +
          '<span class="src' + (p.fonte === "pesquisa" ? " pesq" : "") + '">' + (p.fonte === "pesquisa" ? "Pesquisa · " : "Hipótese · ") + esc(p.origem) + (p.alt ? " Alternativa: " + J.pct(p.alt.valor) + " (" + esc(p.alt.origem) + ")." : "") + "</span></div>";
      }).join("") + "</div>";
  }
  V.raiox = function () {
    var S = J.S, d = S.diag, r = C.raioX(d, S.prem), P = C.PLANOS[r.plano];
    var plano = S.entrevista ? "" :
      '<div class="card accent"><span class="eyebrow">Plano indicado pelo porte</span><h2 class="t" data-testid="plano-indicado">' + esc(P.nome) + " · " + C.brl(P.preco) + '/mês</h2><p class="muted">' + esc(P.porte) + ". Implantação de uma mensalidade; verba de anúncios à parte; sem cobrança por consulta.</p>" +
      (r.gastoAtual ? '<p class="small">Hoje a clínica gasta ' + C.brl(r.gastoAtual) + " por mês com agência e atendimento, fora " + C.brl(r.gastoMidia) + " de anúncios.</p>" : "") +
      '<button class="link" type="button" data-go="planos">Ver os planos</button></div>';
    return J.cab("Passo 1 · Raio-x · " + d.nome, "Cerca de " + fmt(r.perdidos) + " contatos por mês se perdem antes da consulta", "De " + fmt(r.contatos) + " contatos de pacientes novos por mês, " + fmt(r.hoje.respondidos) + " seguem a conversa e " + fmt(r.hoje.agendados) + " viram consulta. O raio-x refaz a conta a cada resposta do gestor.") +
      '<div class="g-side"><div class="stack" id="raiox-res">' + raioRes() + "</div><div class=\"stack\">" +
      '<div class="card"><h2 class="t">Onde a clínica perde pacientes</h2><ul class="list">' + r.lacunas.map(function (l) { return '<li><span style="color:var(--clay)">' + ICON.warn + "</span>" + esc(l) + "</li>"; }).join("") + (r.lacunas.length ? "" : "<li>A base está boa. O ganho vem de medir e escalar.</li>") + "</ul></div>" + plano +
      '<div class="row wrap"><button class="btn" type="button" data-go="estudio">Seguir para o Estúdio</button><button class="btn ghost" type="button" data-go="pulso">Abrir o painel</button><button class="btn ghost" type="button" data-act="editar-diag">Ajustar a anamnese</button></div></div></div>' +
      premissasCard();
  };
  I.prem = function (t) {
    var S = J.S; S.prem[t.dataset.id] = +t.value;
    var l = document.getElementById("pv-" + t.dataset.id); if (l) l.textContent = J.pct(+t.value);
    var box = document.getElementById("raiox-res"); if (box) box.innerHTML = raioRes();
    return false;
  };
  A["prem-pesquisa"] = function () { J.S.prem = C.premissasPadrao(); J.render(); J.toast("Premissas da pesquisa: 7% dos contatos fora do horário (P3, n = 27)."); };
  A["prem-ficha"] = function () { var p = C.premissasPadrao(); C.PREMISSAS.forEach(function (x) { if (x.alt) p[x.id] = x.alt.valor; }); J.S.prem = p; J.render(); J.toast("Hipótese do pitch: 35% dos contatos fora do horário."); };

  /* =========================================================== 2 · ESTÚDIO */
  function est(mid) {
    var S = J.S, m = J.medico(mid);
    if (!S.estudio[mid]) S.estudio[mid] = { variacao: 0, tom: m ? m.tom : "sobria", prefs: [], mes: null, sel: null, aba: "identidade", meses: 0 };
    return S.estudio[mid];
  }
  function dm(m) { var e = est(m.id); return C.diagMedico(m, J.S.diag, e.tom); }
  function idt(m) { return CT.identidade(dm(m), est(m.id).variacao); }
  J.est = est; J.dm = dm; J.idt = idt;
  function gerar(m, prefs, ref) {
    var e = est(m.id), d = dm(m);
    var mes = CT.gerarMes(d, "clinica", prefs || [], ref || REF);
    mes.pecas.forEach(function (p) { p.key = m.id + ":" + (e.meses || 0) + ":" + p.id; p.medico = m.id; p.original = p.texto; p.etapa = "rascunho"; p.hist = []; p.chat = []; });
    e.mes = mes; e.sel = mes.pecas[0].key; e.meses = (e.meses || 0) + 1;
    J.evento("estudio", "Mês de " + CT.MESES[mes.ref.mes] + " gerado para " + C.titulo(m) + ": " + mes.pecas.length + " peças");
    return mes;
  }
  J.gerar = gerar;
  function todasPecas() {
    var out = [];
    J.eq().forEach(function (m) { var e = J.S.estudio[m.id]; if (e && e.mes) out = out.concat(e.mes.pecas); });
    return out;
  }
  J.todasPecas = todasPecas;
  function acharPeca(key) { var l = todasPecas(); for (var i = 0; i < l.length; i++) if (l[i].key === key) return l[i]; return null; }
  J.acharPeca = acharPeca;
  function ogPeca(p) { var m = J.medico(p.medico); return CT.opcoesGuardiao(dm(m), "peca"); }

  function arte(p, m, id) {
    var linhas = p.texto.split("\n"), tit = linhas[0];
    var sig = linhas.filter(function (l) { return /\bcrm\b/i.test(l); })[0] || "";
    return '<div class="peca ' + esc(p.formato) + '" style="--pc:' + id.cores[0] + ";--pa:" + id.cores[1] + '"><span class="tag">' + esc(p.formato) + " · " + esc(CT.PILARES[p.pilar] ? CT.PILARES[p.pilar].nome : "") + '</span><div><div class="bar-a"></div><h4 style="font-family:\'' + esc(id.fontes.titulo) + "',Georgia,serif;margin-top:10px\">" + esc(tit) + '</h4></div><span class="sig">' + esc(sig) + "</span></div>";
  }
  J.arte = arte;
  function pillSt(p) { return '<span class="pill ' + (COR_ST[p.status] || "info") + '">' + esc(p.etapa === "aprovada" ? "aprovada" : p.status === "bloqueado" ? "bloqueada" : p.status === "em_revisao" ? "alerta" : ROT_ETAPA[p.etapa] || p.status) + "</span>"; }
  J.pillSt = pillSt;

  function abaIdentidade(m, e) {
    var id = idt(m), dd = dm(m);
    return '<div class="g2"><div class="card"><div class="idcard"><span class="mono" style="background:' + id.cores[0] + ";color:" + id.cores[3] + ";font-family:'" + esc(id.fontes.titulo) + "',serif\">" + esc(id.iniciais) + '</span><div><span class="eyebrow">Família</span><h2 class="t">' + esc(id.familia) + '</h2><p class="small">' + esc(cap(id.porqueFamilia)) + "</p></div></div>" +
      '<div class="swatches">' + id.cores.map(function (c, i) { return '<div style="background:' + c + ";color:" + (i < 2 ? "#fff" : "#1F2440") + '">' + c + "</div>"; }).join("") + "</div>" +
      '<p class="small">Paleta “' + esc(id.paletaNome) + '”. Títulos em ' + esc(id.fontes.titulo) + ", texto em " + esc(id.fontes.texto) + ": " + esc(id.fontes.porque) + ".</p>" +
      '<fieldset><legend>Tom de voz do Redator</legend><div class="chips">' + TONS.map(function (t) { return '<button type="button" class="chip-btn' + (e.tom === t[0] ? " on" : "") + '" data-act="tom" data-tom="' + t[0] + '" aria-pressed="' + (e.tom === t[0]) + '">' + t[1] + "</button>"; }).join("") + "</div></fieldset>" +
      '<div class="row wrap"><button class="btn ghost sm" type="button" data-act="variacao">Gerar outra variação da paleta</button></div></div>' +
      '<div class="card"><h2 class="t">Prévia de uma peça</h2>' + arte({ texto: "Quando procurar " + (m.sexo === "f" ? "uma " : "um ") + CT.prof(dd) + "?\n\n" + G.assinatura(CT.perfil(dd)), formato: "Post", pilar: "sinais" }, m, id) +
      '<p class="small">Toda peça leva nome, CRM, MÉDICO e RQE; a Jalecon não assina o conteúdo do médico.</p></div></div>';
  }
  function calendario(e) {
    var mes = e.mes, ano = mes.ref.ano, mm = mes.ref.mes, n = new Date(ano, mm + 1, 0).getDate();
    var porDia = {}; mes.pecas.forEach(function (p) { (porDia[p.dia] = porDia[p.dia] || []).push(p); });
    var cel = ["seg", "ter", "qua", "qui", "sex", "sáb"].map(function (d) { return '<div class="small" style="text-align:center;font-weight:700">' + d + "</div>"; }).join("");
    var w0 = (new Date(ano, mm, 1).getDay() + 6) % 7; // seg = 0
    var col = 0;
    for (var i = 0; i < (w0 === 6 ? 0 : w0); i++) { cel += '<div class="d" aria-hidden="true"></div>'; col++; }
    for (var dd = 1; dd <= n; dd++) {
      var w = new Date(ano, mm, dd).getDay(); if (w === 0) continue;
      var ps = porDia[dd] || [];
      cel += ps.length ? '<button type="button" class="d" data-act="sel-peca" data-key="' + ps[0].key + '" aria-label="Dia ' + dd + ": " + esc(ps[0].formato) + '"><span>' + dd + "</span>" + ps.map(function (p) { return '<span class="p pill ' + (COR_ST[p.status] || "info") + '">' + esc(p.formato) + "</span>"; }).join("") + "</button>" : '<div class="d"><span>' + dd + "</span></div>";
    }
    return '<div class="cal">' + cel + "</div>";
  }
  function abaCalendario(m, e) {
    if (!e.mes) return '<div class="card"><h2 class="t">Calendário de ' + CT.MESES[REF.mes] + '</h2><p class="muted">O Estrategista escolhe os temas pela especialidade, o Redator escreve no tom de ' + esc(C.titulo(m)) + ', o Designer aplica a identidade e o Guardião checa cada peça.</p><button class="btn" type="button" data-act="gerar" data-m="' + m.id + '">Gerar o mês de ' + esc(CT.MESES[REF.mes]) + "</button></div>";
    var p = acharPeca(e.sel) || e.mes.pecas[0], id = idt(m), res = G.analisar(p.texto, ogPeca(p));
    var cont = CT.contarStatus(e.mes.pecas);
    return '<div class="g-side"><div class="card"><div class="row between wrap"><h2 class="t">' + cap(CT.MESES[e.mes.ref.mes]) + " · " + e.mes.pecas.length + ' peças</h2><span class="row wrap">' + (cont.bloqueado ? '<span class="pill block">' + cont.bloqueado + " bloqueadas</span>" : "") + (cont.em_revisao ? '<span class="pill warn">' + cont.em_revisao + " com alerta</span>" : "") + '<span class="pill info">' + (cont.rascunho + cont.aprovado + cont.agendado) + " liberadas</span></span></div>" + calendario(e) +
      '<div class="stack">' + e.mes.pecas.map(function (x) { return '<button type="button" class="item-l' + (x.key === p.key ? " on" : "") + '" data-act="sel-peca" data-key="' + x.key + '"><span class="date"><b>' + x.dia + "</b>" + esc(x.semana) + '</span><span><span class="tt">' + esc(x.texto.split("\n")[0]) + '</span><br><span class="small">' + esc(x.formato) + " · " + esc(x.hora) + "</span></span>" + pillSt(x) + "</button>"; }).join("") + "</div>" +
      '<div class="row wrap"><button class="btn ghost sm" type="button" data-act="gerar" data-m="' + m.id + '">Gerar de novo</button></div></div>' +
      '<div class="stack"><div class="card">' + arte(p, m, id) + '<div class="row between"><b>Texto</b>' + J.resumoG(res) + '</div><div class="texto">' + G.destacar(res) + "</div>" +
      '<h3 class="t">Quem fez o quê</h3><ol class="timeline">' + p.timeline.map(function (t) { return '<li class="' + (t.tipo || "") + '"><span><span class="ag ag-' + esc(t.ag) + '" style="width:22px;height:22px;font-size:10px;border-radius:6px;display:inline-grid;margin-right:6px">' + esc(t.ag.charAt(0)) + "</span><b>" + esc(t.ag) + "</b> " + esc(t.txt) + "</span></li>"; }).join("") + "</ol>" +
      '<div class="row wrap"><button class="btn sm" type="button" data-go="revisao-ia/' + esc(p.key) + '">IA revisa IA</button><button class="btn ghost sm" type="button" data-go="revisao/' + esc(p.key) + '">Médico revisa</button></div></div></div></div>';
  }
  function siteTexto(m, d) {
    var e = CT.ESP[m.esp], per = CT.perfil(d);
    return [C.titulo(m) + (m.rqe ? ", " + CT.prof(d) : ""), "Consultas na " + J.S.diag.nome + ", em " + J.S.diag.cidade + ". Atendimento particular com hora marcada.", "Atende: " + e.conds.slice(0, 4).map(function (c) { return c.n; }).join(", ") + ".", "Na primeira consulta, conversamos sobre a sua história, fazemos o exame e combinamos os próximos passos.", G.assinatura(per)].join("\n\n");
  }
  function abaSite(m) {
    var id = idt(m), d = dm(m), txt = siteTexto(m, d), res = G.analisar(txt + "\n\n" + C.assinaturaClinica(J.S.diag), CT.opcoesGuardiao(d, "site")), e = CT.ESP[m.esp];
    var bloco = txt.split("\n\n");
    return '<div class="g-side"><div class="site" style="font-family:\'' + esc(id.fontes.texto) + "',sans-serif\"><div class=\"sn\" style=\"background:" + id.cores[3] + '"><b style="font-family:\'' + esc(id.fontes.titulo) + "',serif\">" + esc(C.titulo(m)) + "</b><span>Sobre · Atendimento · Agendar</span></div>" +
      '<div class="hero" style="background:' + id.cores[3] + '"><h4 style="font-family:\'' + esc(id.fontes.titulo) + "',serif;color:" + id.cores[0] + '">' + esc(bloco[0]) + "</h4><p>" + esc(bloco[1]) + '</p><span class="cta" style="background:' + id.cores[1] + '">Agendar pelo WhatsApp da clínica</span></div>' +
      "<section><b>O que atende</b><span>" + esc(bloco[2]) + "</span></section><section><b>Como é a consulta</b><span>" + esc(bloco[3]) + "</span></section>" +
      "<section><b>Onde</b><span>" + esc(J.S.diag.nome) + " · " + esc(J.S.diag.cidade) + " · seg a sex, 8h às 19h</span></section>" +
      '<div class="foot">' + esc(bloco[4]) + "<br>" + esc(C.assinaturaClinica(J.S.diag)) + "</div></div>" +
      '<div class="card"><div class="row between"><h2 class="t">Guardião no site</h2>' + J.resumoG(res) + "</div>" + J.painelHits(res) +
      '<p class="small">O site leva o nome, o CRM, a palavra MÉDICO e, se houver especialidade, o RQE. ' + (m.rqe ? "" : "Este médico não tem RQE cadastrado: o site não anuncia especialidade.") + "</p>" + J.sim("Prévia. Na versão real, o site é publicado no domínio do médico.") + "</div></div>";
  }
  function abaGoogle(m) {
    var d = dm(m), id = idt(m);
    return '<div class="g-side"><div class="gmb"><div class="hd"><b>' + esc(C.titulo(m)) + (m.rqe ? " · " + esc(cap(CT.prof(d))) : "") + '</b><span class="stars">4,8 ★★★★★ <span style="color:#70757A">(12 avaliações no Google)</span></span><span style="color:#70757A;font-size:13px">' + (m.rqe ? esc(cap(CT.prof(d))) + " em " : "Médico em ") + esc(J.S.diag.cidade) + '</span></div><div class="acts"><span>Agendar</span><span>Ligar</span><span>Rotas</span><span>Site</span></div>' +
      '<div class="linha"><b>Endereço:</b> ' + esc(J.S.diag.nome) + ", Rua das Acácias, 120 · " + esc(J.S.diag.cidade) + '</div><div class="linha"><b>Horário:</b> aberto · fecha às 19h</div><div class="linha"><b>Agendamento:</b> WhatsApp da clínica (atendimento 24 horas)</div><div class="linha" style="font-size:11.5px;color:#70757A">' + esc(G.assinatura(CT.perfil(d))) + "</div></div>" +
      '<div class="card"><h2 class="t">Perfil no Google</h2><ul class="list">' + ["Categoria e nome iguais ao CRM, sem “melhor” ou “especialista” sem RQE", "Endereço, horário e botão de agendar ligados ao WhatsApp da clínica", "Respostas às avaliações escritas pelo Redator e checadas pelo Guardião (sem dado de saúde do paciente, LGPD)", "Fotos do consultório, nunca de paciente"].map(function (t) { return '<li><span style="color:var(--ok)">' + ICON.ok + "</span>" + t + "</li>"; }).join("") + "</ul>" + J.sim("Prévia. Na versão real, o perfil é gerenciado pela API do Google.") + '<span class="small" style="display:inline-block;width:14px;height:14px;border-radius:4px;background:' + id.cores[1] + '"></span></div></div>';
  }
  function abaCampanha(m) {
    var d = dm(m), cp = CT.campanha(d, "clinica");
    return '<div class="g-side"><div class="card"><h2 class="t">Anúncio de pesquisa no Google</h2><div class="ad"><span class="u">Patrocinado · jalecon.site/' + esc(m.nome.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[̀-ͯ]/g, "")) + '</span><span class="t">' + esc(cp.titulo) + '</span><span class="d">' + esc(cp.descricao) + "</span></div>" +
      '<div class="row between"><b>Guardião</b>' + J.resumoG(cp.guardiao) + "</div>" + J.painelHits(cp.guardiao) +
      '<h3 class="t">Palavras-chave</h3><div class="chips">' + cp.palavras.map(function (p) { return '<span class="pill info">' + esc(p) + "</span>"; }).join("") + "</div></div>" +
      '<div class="stack"><div class="g2">' + J.kpi("Verba sugerida", J.preco(cp.verba) || "—", "por mês, paga pela clínica") + J.kpi("Cliques", fmt(cp.cliques), "CPC de R$ " + String(cp.cpc).replace(".", ",")) + J.kpi("Contatos", fmt(cp.contatos), "8% dos cliques") + J.kpi("Consultas", fmt(cp.consultas), "40% dos contatos") + "</div>" +
      '<div class="card"><h3 class="t">Políticas de saúde do Google e da Meta</h3><ul class="list">' + cp.politicas.map(function (t) { return '<li><span style="color:var(--ok)">' + ICON.shield + "</span>" + esc(t) + "</li>"; }).join("") + "</ul>" + J.sim("Estimativa da demo. O piloto deixa os anúncios para depois (escopo cortado).") + "</div></div></div>";
  }
  V.estudio = function (arg) {
    var S = J.S, ms = J.eq(), m = J.medico(arg) || (S.papel === "medico" ? J.medico(S.medicoPapel) : null) || ms[0], e = est(m.id);
    var abas = [["identidade", "Marca"], ["calendario", "Conteúdo do mês"], ["site", "Site"], ["google", "Google"], ["campanha", "Campanha"]];
    var corpo = { identidade: abaIdentidade, calendario: abaCalendario, site: abaSite, google: abaGoogle, campanha: abaCampanha }[e.aba] || abaIdentidade;
    return J.cab("Passo 2 do ciclo · Estúdio", "Agentes criam marca, site e conteúdo de cada médico", "Estrategista, Redator e Designer trabalham com a especialidade e o tom de cada médico. O Guardião checa tudo antes de seguir para a revisão.") +
      '<div class="chips" role="group" aria-label="Médico">' + ms.map(function (x) { var id = idt(x); return '<button type="button" class="chip-btn' + (x.id === m.id ? " on" : "") + '" data-go="estudio/' + x.id + '" aria-pressed="' + (x.id === m.id) + '"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:' + id.cores[1] + ';margin-right:6px"></span>' + esc(C.titulo(x)) + " · " + esc(id.familia) + "</button>"; }).join("") + "</div>" +
      '<div class="row wrap between"><div class="row">' + J.avatar(m, 44) + "<div><b>" + esc(C.titulo(m)) + '</b><br><span class="small">' + esc(m.especialidade) + " · CRM-" + m.uf + " " + m.crm + (m.rqe ? " · RQE " + m.rqe : " · sem RQE cadastrado") + '</span></div></div><button class="btn ghost sm" type="button" data-act="gerar-todos">Gerar o mês de todos os médicos</button></div>' +
      '<div class="tabs" role="tablist">' + abas.map(function (a) { return '<button type="button" role="tab" aria-selected="' + (e.aba === a[0]) + '" class="' + (e.aba === a[0] ? "on" : "") + '" data-act="aba-estudio" data-m="' + m.id + '" data-aba="' + a[0] + '">' + a[1] + "</button>"; }).join("") + "</div>" + corpo(m, e);
  };
  function cap(s) { return J.cap(s); }
  A["aba-estudio"] = function (b) { est(b.dataset.m).aba = b.dataset.aba; J.render(); };
  A.tom = function (b) { var r = J.rotaAtual(), m = J.medico(r.arg) || J.eq()[0]; est(m.id).tom = b.dataset.tom; J.render(); J.toast("Tom ajustado. O próximo mês sai nesse tom."); };
  A.variacao = function () { var r = J.rotaAtual(), m = J.medico(r.arg) || J.eq()[0], e = est(m.id); e.variacao = (e.variacao + 1) % 3; J.render(); };
  A.gerar = function (b) { var m = J.medico(b.dataset.m); var e = est(m.id); gerar(m, e.prefs); e.aba = "calendario"; J.render(); J.toast("Mês gerado: " + e.mes.pecas.length + " peças, todas checadas pelo Guardião."); };
  A["gerar-todos"] = function () { var n = 0; J.eq().forEach(function (m) { var e = est(m.id); if (!e.mes) { gerar(m, e.prefs); n++; } }); J.render(); J.toast(n ? "Conteúdo de novembro gerado para " + n + " médicos." : "Todos os médicos já têm o mês gerado."); };
  A["sel-peca"] = function (b) { var p = acharPeca(b.dataset.key); if (!p) return; est(p.medico).sel = p.key; J.render(); };

  /* =========================================================== 3 · IA REVISA IA */
  function cardAchados(rev) {
    if (!rev.achados.length) return '<p class="ok-line">' + ICON.ok + "<b>Os dois revisores aprovaram: texto claro e sem afirmação absoluta.</b></p>";
    return '<div class="stack">' + rev.achados.map(function (a) { return '<div class="achado"><span class="ag ag-' + esc(a.agente) + '">' + esc(a.agente.charAt(0)) + '</span><div><div class="row between"><b style="font-size:13.5px">' + esc(cap(a.tipo)) + '</b><span class="pill ' + (a.agente === "Ciência" ? "warn" : "info") + '">' + esc(a.agente) + "</span></div><p class=\"q\">“" + esc(a.trecho) + "”</p><p class=\"small\">" + esc(a.motivo) + " " + esc(a.sugestao) + (a.auto ? " <b>Correção automática.</b>" : " <b>Ajuste manual.</b>") + "</p></div></div>"; }).join("") + "</div>";
  }
  V["revisao-ia"] = function (arg) {
    var S = J.S, pecas = S.diagFeito ? todasPecas() : [];
    var livre = !arg || arg === "livre" || !acharPeca(arg);
    var p = livre ? null : acharPeca(arg);
    var txt = p ? p.texto : (S.criticaTexto == null ? K.EXEMPLO : S.criticaTexto);
    var rev = K.revisar(txt);
    var lista = '<div class="card"><h2 class="t">Peças para revisar</h2>' + (pecas.length ? '<div class="stack">' + pecas.slice(0, 48).map(function (x) {
      var r = K.revisar(x.texto), m = J.medico(x.medico);
      return '<button type="button" class="item-l' + (p && p.key === x.key ? " on" : "") + '" data-go="revisao-ia/' + esc(x.key) + '"><span class="date"><b>' + x.dia + "</b>" + esc(x.formato) + '</span><span><span class="tt">' + esc(x.texto.split("\n")[0]) + '</span><br><span class="small">' + esc(m ? C.titulo(m) : "") + "</span></span>" + (x.iaFeita ? '<span class="pill ok">revisada</span>' : r.achados.length ? '<span class="pill warn">' + r.achados.length + "</span>" : '<span class="pill ok">ok</span>') + "</button>";
    }).join("") + "</div>" : '<p class="muted">Ainda não há peças do Estúdio.</p>' + (S.diagFeito ? '<button class="btn sm" type="button" data-act="gerar-todos">Gerar o mês de todos os médicos</button>' : "")) +
      '<button type="button" class="item-l' + (livre ? " on" : "") + '" data-go="revisao-ia/livre"><span class="date"><b>✎</b>livre</span><span class="tt">Testar os revisores com qualquer texto</span><span></span></button></div>';
    var direita;
    if (p) {
      var m = J.medico(p.medico), fix = K.corrigir(p.texto);
      direita = '<div class="card"><div class="row between wrap"><div><span class="eyebrow">' + esc(m ? C.titulo(m) : "") + " · " + esc(p.formato) + '</span><h2 class="t">' + esc(p.texto.split("\n")[0]) + '</h2></div><span class="row"><span class="pill info">clareza ' + rev.clareza + '/100</span><span class="pill ' + (rev.ciencia ? "ok" : "warn") + '">' + (rev.ciencia ? "ciência ok" : "ciência: revisar") + "</span></span></div>" +
        '<div class="texto">' + esc(p.texto) + "</div>" + cardAchados(rev) +
        (fix.feitos.length ? '<details open><summary>Como fica com as correções automáticas</summary><div class="texto" style="margin-top:8px">' + esc(fix.texto) + "</div></details>" : "") +
        '<div class="row wrap">' + (fix.feitos.length ? '<button class="btn" type="button" data-act="ia-aplicar" data-key="' + esc(p.key) + '">Aplicar as correções dos revisores</button>' : "") +
        '<button class="btn ' + (fix.feitos.length ? "ghost" : "") + '" type="button" data-act="ia-seguir" data-key="' + esc(p.key) + '">Seguir para o médico revisar</button></div></div>';
    } else {
      var f2 = K.corrigir(txt);
      direita = '<div class="card"><h2 class="t">Teste os revisores</h2><label class="lbl" for="f-critica">Texto</label><textarea class="ta" id="f-critica" data-in="critica">' + esc(txt) + '</textarea><div id="critica-res">' + resCritica(rev, f2) + "</div></div>";
    }
    return J.cab("Passo 3 do ciclo · IA revisa IA", "Agentes críticos checam clareza e ciência antes do médico", "O Redator escreve; dois revisores leem como um paciente leigo e como um médico exigente. Só depois a peça chega ao médico, que perde menos tempo corrigindo.") +
      '<div class="g2"><div class="card plano"><div class="row"><span class="ag ag-Clareza">C</span><b>Revisor de clareza</b></div><p class="small">Frases acima de 28 palavras, jargão sem explicação, exclamações em série, caixa alta e títulos que não cabem no feed.</p></div><div class="card plano"><div class="row"><span class="ag ag-Ciência">C</span><b>Revisor científico</b></div><p class="small">“Sempre”, “nunca”, “100%”, “estudos comprovam” sem fonte, “sem efeito colateral” e percentuais sobre pacientes sem origem.</p></div></div>' +
      '<div class="g-lista">' + lista + direita + "</div>";
  };
  function resCritica(rev, fix) {
    return '<div class="row wrap" style="margin:10px 0"><span class="pill info">clareza ' + rev.clareza + '/100</span><span class="pill info">' + rev.mediaPalavras + ' palavras por frase</span><span class="pill ' + (rev.ciencia ? "ok" : "warn") + '">' + (rev.ciencia ? "ciência ok" : "ciência: revisar") + "</span></div>" + cardAchados(rev) +
      (fix.feitos.length ? '<details open><summary>Com as correções automáticas</summary><div class="texto" style="margin-top:8px">' + esc(fix.texto) + '</div><p class="small">' + esc(fix.feitos.join("; ")) + ".</p></details>" : "");
  }
  I.critica = function (t) { J.S.criticaTexto = t.value; var box = document.getElementById("critica-res"); if (box) box.innerHTML = resCritica(K.revisar(t.value), K.corrigir(t.value)); return false; };
  A["ia-aplicar"] = function (b) {
    var p = acharPeca(b.dataset.key); if (!p) return;
    var fix = K.corrigir(p.texto);
    p.hist.push(p.texto); p.texto = fix.texto; p.iaFeita = true; p.etapa = "ia";
    p.timeline.push({ ag: "Clareza", txt: "e Ciência revisaram: " + fix.feitos.join("; "), tipo: "ok" });
    p.status = CT.statusDe(G.analisar(p.texto, ogPeca(p)));
    J.evento("ia", "IA revisou “" + p.texto.split("\n")[0] + "”: " + fix.feitos.length + " correções");
    J.render(); J.toast("Correções aplicadas. A peça segue para o médico.");
  };
  A["ia-seguir"] = function (b) {
    var p = acharPeca(b.dataset.key); if (!p) return;
    if (!p.iaFeita) { p.iaFeita = true; p.etapa = "ia"; p.timeline.push({ ag: "Clareza", txt: "e Ciência revisaram: sem ajustes automáticos", tipo: "ok" }); }
    J.ir("revisao/" + p.key);
  };

  /* =========================================================== 4 · MÉDICO REVISA */
  V.revisao = function (arg) {
    var S = J.S, p = acharPeca(arg);
    var mid = p ? p.medico : (S.papel === "medico" ? S.medicoPapel : null);
    var m = J.medico(mid) || J.eq().filter(function (x) { return S.estudio[x.id] && S.estudio[x.id].mes; })[0] || J.eq()[0];
    var e = est(m.id);
    if (!e.mes) return J.cab("Passo 4 do ciclo · Médico revisa", "O médico ajusta conversando com a IA", "Pedidos simples em português mudam o texto de verdade, e cada ajuste vira preferência para os próximos meses.") +
      J.exigePapel("medico", "A revisão é do médico autor da peça.") +
      '<div class="card"><p class="muted">' + esc(C.titulo(m)) + " ainda não tem conteúdo do mês.</p><div class=\"row wrap\"><button class=\"btn\" type=\"button\" data-act=\"gerar\" data-m=\"" + m.id + '">Gerar o mês de ' + esc(C.titulo(m)) + '</button><button class="btn ghost" type="button" data-go="estudio/' + m.id + '">Abrir o Estúdio</button></div></div>';
    if (!p) p = acharPeca(e.sel) || e.mes.pecas[0];
    var id = idt(m), res = G.analisar(p.texto, ogPeca(p)), noFila = (S.fila || []).filter(function (f) { return f.ref === p.key; })[0];
    var euSou = S.papel === "medico" && S.medicoPapel === m.id;
    var chat = (p.chat.length ? p.chat : [{ de: "ia", txt: "Oi! Sou o Redator. Diga o que quer mudar nesta peça, do seu jeito. Por exemplo: " + R.EXEMPLOS + "." }]).map(function (x) { return '<div class="msg ' + (x.de === "eu" ? "me" : "ai") + '">' + (x.de === "eu" ? "" : '<div class="de">Redator</div>') + esc(x.txt) + "</div>"; }).join("");
    return J.cab("Passo 4 do ciclo · Médico revisa", "O médico ajusta conversando com a IA", "Ajustes em conversa viram preferências: no mês seguinte, o Redator já escreve do jeito que o médico aprovou.") +
      (euSou ? "" : '<div class="aviso">' + ICON.warn.replace("<svg", '<svg width="18" height="18"') + '<span class="grow">A revisão é de ' + esc(C.titulo(m)) + ', autor da peça.</span><button class="btn sm" type="button" data-act="ser-medico" data-m="' + m.id + '">Entrar como ' + esc(C.titulo(m)) + "</button></div>") +
      '<div class="g-lista"><div class="card"><div class="row">' + J.avatar(m, 36) + "<b>" + esc(C.titulo(m)) + '</b></div><div class="stack">' + e.mes.pecas.map(function (x) { return '<button type="button" class="item-l' + (x.key === p.key ? " on" : "") + '" data-go="revisao/' + esc(x.key) + '"><span class="date"><b>' + x.dia + "</b>" + esc(x.formato) + '</span><span class="tt">' + esc(x.texto.split("\n")[0]) + "</span>" + pillSt(x) + "</button>"; }).join("") + "</div>" +
      '<h3 class="t">O que a IA aprendeu</h3>' + (e.prefs.length ? '<div class="prefs">' + e.prefs.map(function (x) { return "<span>" + esc(x.rot) + "</span>"; }).join("") + "</div>" : '<p class="small">Nada ainda. Cada pedido vira uma preferência.</p>') +
      '<button class="btn ghost sm" type="button" data-act="proximo-mes" data-m="' + m.id + '"' + (e.prefs.length ? "" : " disabled") + ">Gerar dezembro com o que aprendi</button></div>" +
      '<div class="stack"><div class="g2"><div class="card">' + arte(p, m, id) + '<div class="row between"><b>Texto</b>' + J.resumoG(res) + '</div><div class="texto" id="rev-texto">' + G.destacar(res) + "</div></div>" +
      '<div class="card"><h2 class="t">Conversa com o Redator</h2><div class="chat" id="rev-chat" style="max-height:340px;overflow-y:auto">' + chat + "</div>" +
      '<form class="composer" data-sub="revisao" data-key="' + esc(p.key) + '"><label class="sr" for="f-rev">Pedido</label><input id="f-rev" name="msg" placeholder="Ex.: mais curto" autocomplete="off"' + (euSou && !noFila ? "" : " disabled") + '><button type="submit"' + (euSou && !noFila ? "" : " disabled") + ">Enviar</button></form>" +
      '<div class="chips">' + ["mais curto", "mais acolhedor", "mais técnico", "adicione chamada para agendar", "aplicar sugestão do Guardião", "desfazer"].map(function (t) { return '<button type="button" class="chip-btn" data-act="rev-rapido" data-key="' + esc(p.key) + '" data-txt="' + esc(t) + '"' + (euSou && !noFila ? "" : " disabled") + ">" + esc(t) + "</button>"; }).join("") + "</div></div></div>" +
      '<div class="card">' + (noFila ? '<p class="ok-line">' + ICON.ok + "<b>Enviada ao diretor técnico" + (noFila.status !== "pendente" ? ": " + noFila.status : "") + ".</b></p><button class=\"btn ghost sm\" type=\"button\" data-go=\"peca/" + noFila.id + '">Ver na aprovação</button>' :
        '<div class="row wrap"><button class="btn" type="button" data-act="enviar-dt" data-key="' + esc(p.key) + '"' + (euSou && res.liberado ? "" : " disabled") + ">Aprovar e enviar ao diretor técnico</button>" + (res.liberado ? "" : '<span class="small">Resolva os bloqueios do Guardião antes (peça “aplicar sugestão do Guardião”).</span>') + "</div>") +
      J.painelHits(res) + "</div></div></div>";
  };
  D.revisao = function () { var c = document.getElementById("rev-chat"); if (c) c.scrollTop = c.scrollHeight; };
  A["ser-medico"] = function (b) { J.S.papel = "medico"; J.S.medicoPapel = b.dataset.m; J.render(); J.toast("Você está como " + C.titulo(J.medico(b.dataset.m)) + "."); };
  function pedir(p, msg) {
    var m = J.medico(p.medico), e = est(m.id);
    p.chat.push({ de: "eu", txt: msg });
    var it = R.entender(msg);
    if (it.tipo === "desfazer") {
      if (p.hist.length) { p.texto = p.hist.pop(); p.chat.push({ de: "ia", txt: "Voltei para a versão anterior." }); } else p.chat.push({ de: "ia", txt: "Não há o que desfazer." });
    } else if (it.tipo === "aprovar") {
      p.chat.push({ de: "ia", txt: "Para aprovar, use o botão “Aprovar e enviar ao diretor técnico”." });
    } else {
      var r = R.executar(it, p.texto, { perfil: CT.perfil(dm(m)), tom: e.tom, glossario: e.mes.glossario, seed: p.chat.length, opcoesGuardiao: ogPeca(p) });
      if (r.erro) p.chat.push({ de: "ia", txt: r.erro });
      else {
        if (r.mudou) { p.hist.push(p.texto); p.texto = r.texto; p.timeline.push({ ag: "Médico", txt: "pediu: “" + msg + "”" }); }
        p.chat.push({ de: "ia", txt: r.msg });
        if (r.pref && !e.prefs.some(function (x) { return x.rot === r.pref.rot; })) e.prefs.push(r.pref);
      }
    }
    p.status = CT.statusDe(G.analisar(p.texto, ogPeca(p)));
  }
  A["submit:revisao"] = function (f) { var p = acharPeca(f.dataset.key), v = f.msg.value.trim(); if (!p || !v) return; pedir(p, v); J.render(); var i = document.getElementById("f-rev"); if (i) i.focus(); };
  A["rev-rapido"] = function (b) { var p = acharPeca(b.dataset.key); if (!p) return; pedir(p, b.dataset.txt); J.render(); };
  A["enviar-dt"] = function (b) {
    var S = J.S, p = acharPeca(b.dataset.key); if (!p) return;
    var res = G.analisar(p.texto, ogPeca(p)); if (!res.liberado) return;
    var m = J.medico(p.medico);
    var f = { id: "e" + S.fila.length + "-" + p.id, ref: p.key, autor: m.id, formato: p.formato, dia: p.dia, titulo: p.texto.split("\n")[0], origem: "Estúdio", texto: p.texto, original: p.texto, status: "pendente", log: [] };
    S.fila.push(f); p.etapa = "medico";
    J.registrar("“" + f.titulo + "” aprovada por " + C.titulo(m) + " e enviada ao diretor técnico.", "", f);
    J.evento("medico", C.titulo(m) + " aprovou e enviou “" + f.titulo + "”");
    J.render(); J.toast("Enviada ao diretor técnico. Ela aparece na fila de aprovação.");
  };
  A["proximo-mes"] = function (b) {
    var m = J.medico(b.dataset.m), e = est(m.id);
    var mes = gerar(m, e.prefs, { ano: 2026, mes: 11 });
    var usadas = mes.pecas.filter(function (p) { return p.timeline.some(function (t) { return /aplicou o que você ensinou/.test(t.txt); }); }).length;
    J.render(); J.toast("Dezembro gerado: " + usadas + " de " + mes.pecas.length + " peças já saíram com as suas preferências.");
  };

  /* =========================================================== 5 · GUARDIÃO E APROVAÇÃO */
  function itemFila(p) {
    var res = G.analisar(p.texto, J.opcoesPeca(p));
    var marca = p.status !== "pendente" ? { aprovado: '<span class="pill ok">aprovada</span>', devolvido: '<span class="pill block">devolvida</span>' }[p.status] : res.liberado ? '<span class="pill ok">liberada</span>' : '<span class="pill block">' + res.contagem.bloqueia + " bloqueio" + (res.contagem.bloqueia > 1 ? "s" : "") + "</span>";
    return '<button type="button" class="item-l" data-go="peca/' + p.id + '" data-testid="peca-' + p.id + '"><span class="date"><b>' + (p.dia || "") + '</b>nov</span><span><span class="tt">' + esc(p.titulo) + '</span><br><span class="small">' + esc(p.formato) + " · " + esc(J.autorNome(p)) + " · " + esc(p.origem || "") + "</span></span>" + marca + "</button>";
  }
  V.aprovacao = function () {
    var S = J.S, fila = S.fila || [];
    var pend = fila.filter(function (p) { return p.status === "pendente"; }), feitas = fila.filter(function (p) { return p.status !== "pendente"; });
    return J.cab("Passo 5 do ciclo · Guardião e aprovação · " + J.diretor(), pend.length ? pend.length + " peça" + (pend.length > 1 ? "s esperam" : " espera") + " o diretor técnico" : "Nada pendente", "O Guardião checa cada peça em " + G.regras.length + " regras (CFM 2.336/2023, Código de Ética Médica, CFM 2.454/2026, LGPD, CDC, ANVISA, Meta e Google). Bloqueia, explica a regra e sugere a correção. Só o diretor técnico aprova, e cada decisão fica registrada.") +
      J.exigePapel("diretor", "Você pode ver a fila, mas só o diretor técnico aprova ou devolve.") +
      '<div class="g-side"><div class="card"><h2 class="t">Fila do diretor técnico</h2>' + (pend.length ? '<div class="stack">' + pend.map(itemFila).join("") + "</div>" : '<p class="muted">Nada esperando. Peças novas chegam do Estúdio depois da revisão do médico.</p>') +
      (feitas.length ? '<h3 class="t">Já decididas</h3><div class="stack">' + feitas.map(itemFila).join("") + "</div>" : "") + "</div>" +
      '<div class="stack"><div class="card"><h3 class="t">Últimas decisões</h3>' + (S.registro.length ? '<ol class="timeline" data-testid="registro">' + S.registro.slice(-6).reverse().map(function (x) { return '<li class="' + (x.tipo || "") + '"><span><b>' + esc(x.quando) + "</b> " + esc(x.txt) + "</span></li>"; }).join("") + '</ol><button class="link" type="button" data-go="registro">Ver a trilha de auditoria completa</button>' : '<p class="muted">Ainda vazio. Cada aprovação ou devolução entra aqui, com data, hora e as regras checadas.</p>') + "</div>" +
      '<div class="card plano"><p class="small">A responsabilidade ética continua do médico e do diretor técnico: a Jalecon oferece checagem, explicação e trilha de auditoria.</p><div class="row wrap"><button class="btn ghost sm" type="button" data-go="guardiao-teste">Testar o Guardião</button><button class="btn ghost sm" type="button" data-go="biblioteca">Biblioteca normativa</button></div></div></div></div>';
  };
  V.peca = function (arg) {
    var S = J.S, p = (S.fila || []).filter(function (x) { return x.id === arg; })[0];
    if (!p) return V.aprovacao();
    var res = G.analisar(p.texto, J.opcoesPeca(p)), aberto = p.status === "pendente", dt = S.papel === "diretor";
    return '<button class="link" type="button" data-go="aprovacao">← Fila de aprovação</button>' +
      J.cab(p.formato + " · " + J.autorNome(p) + " · " + (p.origem || ""), p.titulo, "") +
      J.exigePapel("diretor", "Só o diretor técnico aprova ou devolve esta peça.") +
      '<div class="g-side"><div class="card"><div class="row between"><h2 class="t">Texto</h2><span id="resumo-g">' + J.resumoG(res) + "</span></div>" +
      '<div class="texto" id="texto-marcado" aria-label="Texto com os trechos marcados pelo Guardião">' + G.destacar(res) + "</div>" +
      (aberto ? '<label class="lbl" for="f-texto">Editar o texto</label><textarea class="ta" id="f-texto" data-in="peca-texto" data-id="' + p.id + '">' + esc(p.texto) + "</textarea>" : "") +
      '<p class="disclaimer">Checagem automática. Não substitui parecer jurídico; a responsabilidade ética continua com o médico e com o diretor técnico.</p>' +
      (aberto ? '<div class="row wrap"><button class="btn ghost" type="button" data-act="sugestoes" data-id="' + p.id + '"' + (res.hits.length ? "" : " disabled") + '>Aplicar as sugestões do Guardião</button>' +
        '<button class="btn ok" type="button" data-act="aprovar" data-id="' + p.id + '" id="btn-aprovar"' + (res.liberado && dt ? "" : " disabled") + ">Aprovar como diretor técnico</button>" +
        '<button class="btn ghost" type="button" data-act="devolver" data-id="' + p.id + '"' + (dt ? "" : " disabled") + ">Devolver ao autor</button>" +
        (p.texto !== p.original ? '<button class="link" type="button" data-act="restaurar" data-id="' + p.id + '">Voltar ao texto original</button>' : "") + "</div>" + (res.liberado ? "" : '<p class="small" id="motivo">Para aprovar, resolva os bloqueios.</p>')
        : '<h3 class="t">Decisão</h3><ol class="timeline">' + (p.log || []).map(function (x) { return '<li class="' + (x.tipo || "") + '"><span><b>' + esc(x.quando) + "</b> " + esc(x.txt) + "</span></li>"; }).join("") + "</ol>") + "</div>" +
      '<div class="card"><h2 class="t">O que o Guardião encontrou</h2><div id="hits-g">' + J.painelHits(res) + "</div></div></div>";
  };
  I["peca-texto"] = function (t) {
    var p = (J.S.fila || []).filter(function (x) { return x.id === t.dataset.id; })[0]; if (!p) return false;
    p.texto = t.value;
    var res = G.analisar(p.texto, J.opcoesPeca(p));
    var m = document.getElementById("texto-marcado"), h = document.getElementById("hits-g"), r = document.getElementById("resumo-g"), bt = document.getElementById("btn-aprovar");
    if (m) m.innerHTML = G.destacar(res); if (h) h.innerHTML = J.painelHits(res); if (r) r.innerHTML = J.resumoG(res); if (bt) bt.disabled = !(res.liberado && J.S.papel === "diretor");
    return false;
  };
  function filaP(id) { return (J.S.fila || []).filter(function (x) { return x.id === id; })[0]; }
  A.sugestoes = function (b) {
    var p = filaP(b.dataset.id); if (!p) return;
    var o = J.opcoesPeca(p), a = G.aplicarSugestoes(p.texto, o), t = a.texto, feitas = a.aplicadas.slice();
    if (p.autor === "clinica") {
      var r = G.analisar(t, o);
      if (r.hits.some(function (h) { return h.regra.id === "CFM2336-PJ-01" || h.regra.id === "CFM2336-ID-01"; })) { var ass = C.assinaturaClinica(J.S.diag); t = t + "\n\n" + ass; feitas.push("assinatura da clínica incluída"); }
    } else {
      var r2 = G.analisar(t, o), m = J.medico(p.autor);
      if (m && r2.hits.some(function (h) { return h.regra.id === "CFM2336-ID-01"; })) { t = t + "\n\n" + G.assinatura(C.perfil(m)); feitas.push("assinatura do médico incluída"); }
    }
    p.texto = t;
    var fim = G.analisar(t, o);
    J.render();
    J.toast(feitas.length ? "Guardião aplicou " + feitas.length + " ajuste" + (feitas.length > 1 ? "s" : "") + (fim.liberado ? ". Peça liberada." : ". Ainda há ajuste manual.") : "Não há troca automática para estes pontos. Edite o texto.");
  };
  A.aprovar = function (b) {
    var p = filaP(b.dataset.id); if (!p || J.S.papel !== "diretor") return;
    var res = G.analisar(p.texto, J.opcoesPeca(p)); if (!res.liberado) return;
    p.status = "aprovado";
    var alertas = res.hits.filter(function (h) { return h.gravidade === "alerta"; }).length;
    J.registrar("“" + p.titulo + "” (" + J.autorNome(p) + ") aprovada por " + J.diretor() + ". " + G.regras.length + " regras checadas" + (alertas ? ", " + alertas + " alerta(s) aceito(s)" : ", nenhum alerta") + ".", "ok", p, { peca: p.titulo, regras: G.regras.length, alertas: alertas });
    if (p.ref) { var ep = acharPeca(p.ref); if (ep) { ep.etapa = "aprovada"; ep.status = "agendado"; ep.timeline.push({ ag: "Guardião", txt: "aprovada pelo diretor técnico e agendada", tipo: "ok" }); } }
    J.evento("aprovado", "“" + p.titulo + "” aprovada pelo diretor técnico");
    J.ir("aprovacao"); J.toast("Aprovada e agendada. A decisão ficou no registro.");
  };
  A.devolver = function (b) {
    var p = filaP(b.dataset.id); if (!p || J.S.papel !== "diretor") return;
    var res = G.analisar(p.texto, J.opcoesPeca(p));
    p.status = "devolvido";
    J.registrar("“" + p.titulo + "” devolvida a " + J.autorNome(p) + " por " + J.diretor() + (res.hits.length ? ": " + res.hits.map(function (h) { return h.regra.rotulo; }).join(", ") : "") + ".", "bloqueia", p, { peca: p.titulo });
    if (p.ref) { var ep = acharPeca(p.ref); if (ep) { ep.etapa = "devolvida"; ep.timeline.push({ ag: "Guardião", txt: "devolvida pelo diretor técnico", tipo: "bloqueia" }); } }
    J.evento("devolvido", "“" + p.titulo + "” devolvida ao autor");
    J.ir("aprovacao"); J.toast("Devolvida ao autor com os pontos do Guardião.");
  };
  A.restaurar = function (b) { var p = filaP(b.dataset.id); if (p) { p.texto = p.original; J.render(); } };

  /* ---------- testar o Guardião ---------- */
  var EXEMPLOS_G = [
    "Sou a melhor dermatologista de São Paulo, resultado garantido e sem dor.",
    "Elimine a dor no joelho de vez! Primeira consulta grátis.",
    "Veja o antes e depois da nossa paciente: mudou a vida dela!",
    "Consulta com 30% de desconto só esta semana. Vagas limitadas!",
    "Dra. Ana Souza · MÉDICA · CRM-SP 123456 · Dermatologia · RQE 7890. Agende sua avaliação pelo link da bio."
  ];
  V["guardiao-teste"] = function () {
    var S = J.S, txt = S.teste == null ? "Sou o melhor ortopedista de SP. Cirurgia de joelho sem dor, resultado garantido! Primeira consulta grátis." : S.teste;
    var o = { identificacao: S.testeId !== false };
    var res = G.analisar(txt, o);
    return J.cab("Guardião · teste ao vivo", "Teste o Guardião com qualquer frase", "Cole ou digite um post, anúncio, bio ou mensagem. O resultado muda enquanto você digita. Para mostrar que não é um texto pronto, peça uma frase a alguém da banca.") +
      '<div class="g-side"><div class="card"><label class="lbl" for="f-teste">Texto</label><textarea class="ta" id="f-teste" data-in="teste" style="min-height:150px">' + esc(txt) + "</textarea>" +
      '<label class="row" style="font-size:13.5px;cursor:pointer"><input type="checkbox" data-in-change="teste-id"' + (o.identificacao ? " checked" : "") + "> É peça de divulgação (exige nome, CRM e a palavra MÉDICO)</label>" +
      '<div class="chips">' + EXEMPLOS_G.map(function (t, i) { return '<button type="button" class="chip-btn" data-act="teste-ex" data-i="' + i + '">Exemplo ' + (i + 1) + "</button>"; }).join("") + '<button type="button" class="chip-btn" data-act="teste-limpar">Limpar</button></div>' +
      '<div class="row between"><h2 class="t">Resultado</h2><span id="resumo-g">' + J.resumoG(res) + '</span></div><div class="texto" id="texto-marcado">' + G.destacar(res) + "</div></div>" +
      '<div class="card"><h2 class="t">Regras acionadas</h2><div id="hits-g">' + J.painelHits(res) + '</div><p class="disclaimer">' + G.regras.length + " regras ativas; " + G.regras.filter(function (r) { return !r.confirmado; }).length + " aguardam validação de advogado de direito médico.</p></div></div>";
  };
  I.teste = function (t) {
    J.S.teste = t.value;
    var res = G.analisar(t.value, { identificacao: J.S.testeId !== false });
    var m = document.getElementById("texto-marcado"), h = document.getElementById("hits-g"), r = document.getElementById("resumo-g");
    if (m) m.innerHTML = G.destacar(res); if (h) h.innerHTML = J.painelHits(res); if (r) r.innerHTML = J.resumoG(res);
    return false;
  };
  I["teste-id"] = function (t) { J.S.testeId = t.checked; return true; };
  A["teste-ex"] = function (b) { J.S.teste = EXEMPLOS_G[+b.dataset.i]; J.render(); };
  A["teste-limpar"] = function () { J.S.teste = ""; J.render(); var t = document.getElementById("f-teste"); if (t) t.focus(); };

  /* ---------- biblioteca normativa ---------- */
  function normaCurta(r) { var n = r.norma.split(/[;(]/)[0].trim(); return n.replace("Resolução CFM nº", "CFM").replace("Código de Ética Médica", "CEM"); }
  V.biblioteca = function () {
    var S = J.S, f = S.bibFiltro || { q: "", grav: "", status: "" }, Rg = G.regras;
    var lista = Rg.filter(function (r) {
      if (f.grav && r.gravidade !== f.grav) return false;
      if (f.status === "conf" && !r.confirmado) return false;
      if (f.status === "val" && r.confirmado) return false;
      if (f.q) { var q = G.normalizar(f.q); if (G.normalizar([r.titulo, r.rotulo, r.norma, r.explicacao, r.id].join(" ")).indexOf(q) < 0) return false; }
      return true;
    });
    var porNorma = {}; Rg.forEach(function (r) { var k = normaCurta(r); porNorma[k] = (porNorma[k] || 0) + 1; });
    return J.cab("Guardião · biblioteca normativa", "A biblioteca viva por trás de cada checagem", "Regras versionadas, com a norma, o artigo, a explicação para o médico e a sugestão de correção. Cresce a cada conselho profissional e a cada caso rotulado.") +
      '<div class="g4">' + J.kpi("Regras ativas", Rg.length, "na demo") + J.kpi("Confirmadas", Rg.filter(function (r) { return r.confirmado; }).length, "com artigo conferido") + J.kpi("Em validação", Rg.filter(function (r) { return !r.confirmado; }).length, "aguardam advogado de direito médico") + J.kpi("Bloqueiam", Rg.filter(function (r) { return r.gravidade === "bloqueia"; }).length, "as demais alertam ou orientam") + "</div>" +
      '<div class="card"><div class="g3"><div class="field"><label for="f-bq">Buscar</label><input id="f-bq" data-in="bib-q" value="' + esc(f.q) + '" placeholder="Ex.: antes e depois, preço, RQE"></div>' +
      '<div class="field"><label for="f-bg">Gravidade</label><select id="f-bg" data-in-change="bib-grav"><option value="">Todas</option><option value="bloqueia"' + (f.grav === "bloqueia" ? " selected" : "") + '>Bloqueia</option><option value="alerta"' + (f.grav === "alerta" ? " selected" : "") + '>Alerta</option><option value="orienta"' + (f.grav === "orienta" ? " selected" : "") + ">Orienta</option></select></div>" +
      '<div class="field"><label for="f-bs">Situação</label><select id="f-bs" data-in-change="bib-status"><option value="">Todas</option><option value="conf"' + (f.status === "conf" ? " selected" : "") + '>Confirmadas</option><option value="val"' + (f.status === "val" ? " selected" : "") + ">Em validação jurídica</option></select></div></div>" +
      '<p class="small">Por norma: ' + Object.keys(porNorma).map(function (k) { return esc(k) + " (" + porNorma[k] + ")"; }).join(" · ") + '</p></div><div class="stack" id="bib-lista">' + listaRegras(lista) + "</div>";
  };
  function listaRegras(lista) {
    if (!lista.length) return '<p class="muted">Nenhuma regra com esse filtro.</p>';
    return '<p class="small">' + lista.length + " regra" + (lista.length > 1 ? "s" : "") + "</p>" + lista.map(function (r) {
      var cit = G.citacao(r);
      return '<details class="regra"><summary><span class="row between wrap" style="display:inline-flex;width:calc(100% - 20px)"><span>' + esc(cap(r.rotulo)) + ' <code>' + esc(r.id) + '</code></span><span class="row"><span class="pill ' + (r.gravidade === "bloqueia" ? "block" : r.gravidade === "alerta" ? "warn" : "info") + '">' + r.gravidade + "</span>" + (r.confirmado ? "" : '<span class="val">em validação</span>') + "</span></span></summary>" +
        '<p class="small" style="margin-top:6px"><b>' + esc(r.titulo) + "</b></p><p>" + esc(r.explicacao) + "</p>" + (r.sugestao ? '<p class="small"><b>Como corrigir:</b> ' + esc(r.sugestao) + "</p>" : "") +
        ((r.exemplos_violacao || []).length ? '<p class="small"><b>Exemplos que disparam:</b> ' + r.exemplos_violacao.slice(0, 3).map(function (x) { return "“" + esc(x) + "”"; }).join(" · ") + "</p>" : "") +
        '<p class="cit small">' + esc(cit.texto) + " · " + esc(r.norma) + "</p></details>";
    }).join("");
  }
  I["bib-q"] = function (t) { J.S.bibFiltro.q = t.value; var el = document.getElementById("bib-lista"); if (el) { var S = J.S, f = S.bibFiltro; el.innerHTML = listaRegras(G.regras.filter(function (r) { if (f.grav && r.gravidade !== f.grav) return false; if (f.status === "conf" && !r.confirmado) return false; if (f.status === "val" && r.confirmado) return false; var q = G.normalizar(f.q); return !q || G.normalizar([r.titulo, r.rotulo, r.norma, r.explicacao, r.id].join(" ")).indexOf(q) >= 0; })); } return false; };
  I["bib-grav"] = function (t) { J.S.bibFiltro.grav = t.value; return true; };
  I["bib-status"] = function (t) { J.S.bibFiltro.status = t.value; return true; };

  /* ---------- trilha de auditoria ---------- */
  V.registro = function () {
    var S = J.S, L = S.registro || [];
    return J.cab("Guardião · trilha de auditoria", "Cada decisão, com data, hora, quem e as regras checadas", "É a proteção do diretor técnico no CRM: mostra que a peça foi checada e aprovada antes de ir ao ar. Exporta para planilha.") +
      '<div class="card"><div class="row between wrap"><h2 class="t">' + L.length + " registro" + (L.length === 1 ? "" : "s") + '</h2><button class="btn ghost sm" type="button" data-act="exportar"' + (L.length ? "" : " disabled") + ">Baixar como planilha (CSV)</button></div>" +
      (L.length ? '<div class="tb-wrap"><table class="tb"><thead><tr><th>Quando</th><th>Quem</th><th>O que aconteceu</th></tr></thead><tbody>' + L.slice().reverse().map(function (x) { return '<tr><td class="num" style="white-space:nowrap">' + esc(x.quando) + "</td><td>" + esc(x.quem || "") + "</td><td>" + esc(x.txt) + "</td></tr>"; }).join("") + "</tbody></table></div>" : '<p class="muted">Vazio. Aprove ou devolva uma peça na fila do diretor técnico.</p><button class="btn sm" type="button" data-go="aprovacao">Ir para a fila</button>') + "</div>";
  };
  A.exportar = function () {
    var L = J.S.registro || [];
    var csv = "quando;quem;registro\n" + L.map(function (x) { return [x.quando, x.quem || "", x.txt].map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(";"); }).join("\n");
    try {
      var blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "jalecon-trilha-de-auditoria.csv"; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      J.toast("Planilha baixada.");
    } catch (e) { J.toast("Este navegador não permitiu o download."); }
  };
})(window.JW);
