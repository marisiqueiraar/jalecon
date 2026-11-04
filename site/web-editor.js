/* Jalecon · editor de artes (um "Canva" dentro do Estúdio, com o CFM embutido).
 * Modelos de layout, foto do médico (enviar, arrastar, zoom), cores e fontes da identidade,
 * formatos (post, carrossel, stories), textos com o Guardião ao vivo, assinatura obrigatória travada,
 * origem da foto checada (paciente identificável bloqueia), PNG para baixar e envio à diretora técnica.
 * Tudo em canvas, no navegador. A foto não sai do computador.
 */
(function (J) {
  "use strict";
  var G = window.Guardiao, C = window.Clinica, CT = window.Conteudo;
  var V = J.VIEWS, A = J.ACOES, I = J.INPUTS, D = J.DEPOIS, esc = J.esc, ICON = J.ICON;

  var FORMATOS = { Post: [1080, 1080, "Post 1:1"], Carrossel: [1080, 1350, "Carrossel 4:5"], Stories: [1080, 1920, "Stories 9:16"] };
  var LAYOUTS = [["foto", "Foto inteira"], ["faixa", "Foto e faixa"], ["moldura", "Moldura"], ["texto", "Só texto"], ["dica", "Dica numerada"]];
  var COM_FOTO = { foto: 1, faixa: 1, moldura: 1 };
  var ORIGENS = [
    ["medico", "Foto do médico", null],
    ["consultorio", "Consultório ou equipamento", null],
    ["equipe", "Equipe da clínica (com autorização)", null],
    ["banco", "Banco de imagens licenciado", null],
    ["ia", "Imagem gerada ou editada por IA", "IA2454-SINT-01"],
    ["paciente", "Paciente (mesmo com autorização)", "CFM2336-IMG-02"],
    ["antesdepois", "Antes e depois de paciente", "CFM2336-AD-01"]
  ];
  var FONTES = [["id", "Da identidade"], ["Lora", "Lora"], ["Source Serif 4", "Source Serif"], ["DM Serif Display", "DM Serif"], ["Libre Baskerville", "Baskerville"], ["DM Sans", "DM Sans"], ["Work Sans", "Work Sans"]];
  var IMG = { src: null, el: null };

  function ed() {
    var S = J.S;
    if (!S.diagFeito) { S.diag = C.diagExemplo(); S.diagFeito = true; J.preparar(); }
    if (!S.editor) S.editor = {};
    return S.editor;
  }
  function novo(m, p) {
    var tit = "Quando procurar " + (m.sexo === "f" ? "uma " : "um ") + CT.prof(J.dm(m)) + "?", apoio = "Sinais de alerta, cuidados do dia a dia e o que levar na consulta.", tag = "Quando procurar", fmt = "Post";
    if (p) {
      var partes = p.texto.split("\n\n");
      tit = partes[0];
      apoio = (partes.slice(1).filter(function (x) { return !/\bcrm\b/i.test(x) && !/^roteiro/i.test(x) && x.length < 220; })[0] || "").split("\n")[0];
      tag = CT.PILARES[p.pilar] ? CT.PILARES[p.pilar].nome : p.formato;
      fmt = p.formato === "Carrossel" ? "Carrossel" : (p.formato === "Stories" || p.formato === "Reels") ? "Stories" : "Post";
    }
    return { medico: m.id, ref: p ? p.key : null, fmt: fmt, layout: "texto", titulo: tit, apoio: apoio, cta: "Agende pelo WhatsApp da clínica", tag: tag, fundo: 0, fonte: "id", alinhar: "esq", escurecer: 0.45, foto: null, fotoNome: "", origem: "medico", zoom: 1, fx: 0.5, fy: 0.5, mono: true, enviado: null };
  }
  function atual(arg) {
    var e = ed(), partes = (arg || "").split("/"), m = J.medico(partes[0]) || J.medico(e.medico) || J.eq()[0];
    var key = partes.slice(1).join("/"), p = key ? J.acharPeca(key) : null;
    if (!e.medico || e.medico !== m.id || (p && e.ref !== p.key)) { var x = novo(m, p); x.foto = e.medico === m.id ? e.foto : null; x.origem = e.medico === m.id ? e.origem || "medico" : "medico"; J.S.editor = x; e = x; if (x.foto && !COM_FOTO[x.layout]) x.layout = "foto"; }
    return { e: e, m: m };
  }

  /* ---------- desenho ---------- */
  function lum(hex) { var n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255; var f = function (c) { return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }
  function sobre(bg, id) { return lum(bg) > 0.4 ? id.cores[0] : "#FFFFFF"; }
  function linhas(ctx, txt, max) {
    var out = [];
    String(txt || "").split("\n").forEach(function (par) {
      var ws = par.split(/\s+/), l = "";
      ws.forEach(function (w) { var t = l ? l + " " + w : w; if (ctx.measureText(t).width > max && l) { out.push(l); l = w; } else l = t; });
      if (l) out.push(l);
    });
    return out;
  }
  function texto(ctx, txt, x, y, max, size, font, peso, cor, alinhar, alt, limite) {
    ctx.font = peso + " " + size + "px " + font; ctx.fillStyle = cor; ctx.textBaseline = "top";
    var ls = linhas(ctx, txt, max); if (limite && ls.length > limite) { ls = ls.slice(0, limite); ls[limite - 1] = ls[limite - 1].replace(/\s*\S*$/, "…"); }
    ctx.textAlign = alinhar === "centro" ? "center" : "left";
    var xx = alinhar === "centro" ? x + max / 2 : x;
    ls.forEach(function (l, i) { ctx.fillText(l, xx, y + i * size * (alt || 1.15)); });
    return ls.length * size * (alt || 1.15);
  }
  function altura(ctx, txt, max, size, font, peso, alt, limite) { ctx.font = peso + " " + size + "px " + font; var n = linhas(ctx, txt, max).length; return Math.min(n, limite || n) * size * (alt || 1.15); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function foto(ctx, e, x, y, w, h) {
    if (!IMG.el || !IMG.el.complete || !IMG.el.naturalWidth) { ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.font = "600 34px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("Envie uma foto", x + w / 2, y + h / 2); return; }
    var iw = IMG.el.naturalWidth, ih = IMG.el.naturalHeight, s = Math.max(w / iw, h / ih) * e.zoom, dw = iw * s, dh = ih * s;
    var dx = x + (w - dw) * e.fx, dy = y + (h - dh) * e.fy;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(IMG.el, dx, dy, dw, dh); ctx.restore();
  }
  function desenhar(cv, e, m) {
    if (!cv) return;
    var id = J.idt(m), F = FORMATOS[e.fmt], W = F[0], H = F[1];
    cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d"), bg = id.cores[e.fundo] || id.cores[0], cor = sobre(bg, id), acc = id.cores[e.fundo === 1 ? 0 : 1];
    var ft = "'" + (e.fonte === "id" ? id.fontes.titulo : e.fonte) + "', Georgia, serif", fb = "'" + id.fontes.texto + "', 'Segoe UI', sans-serif";
    var P = 80, max = W - P * 2, sigH = 120, al = e.alinhar;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    var tituloSize = e.fmt === "Stories" ? 92 : 78, corTit = cor, area = { y0: P + 40, y1: H - sigH - P / 2 };
    if (e.layout === "foto") {
      foto(ctx, e, 0, 0, W, H);
      var gr = ctx.createLinearGradient(0, H * 0.35, 0, H); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0," + Math.min(0.9, e.escurecer + 0.35) + ")");
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "rgba(0,0,0," + e.escurecer * 0.35 + ")"; ctx.fillRect(0, 0, W, H);
      corTit = "#FFFFFF"; area.y0 = H * 0.45;
    } else if (e.layout === "faixa") {
      var hf = Math.round(H * 0.56); foto(ctx, e, 0, 0, W, hf); ctx.fillStyle = bg; ctx.fillRect(0, hf, W, H - hf); ctx.fillStyle = acc; ctx.fillRect(P, hf - 8, 120, 16); area.y0 = hf + 50;
    } else if (e.layout === "moldura") {
      var hm = Math.round(H * 0.46); ctx.save(); rr(ctx, P, P + 60, max, hm, 36); ctx.clip(); foto(ctx, e, P, P + 60, max, hm); ctx.restore(); area.y0 = P + 60 + hm + 50;
    } else if (e.layout === "dica") {
      ctx.fillStyle = acc; ctx.font = "600 300px " + ft; ctx.textBaseline = "top"; ctx.textAlign = al === "centro" ? "center" : "left"; var num = (String(e.titulo).match(/^\d+/) || ["3"])[0]; ctx.fillText(num, al === "centro" ? W / 2 : P - 10, P + 30); area.y0 = P + 360;
    } else {
      ctx.fillStyle = acc; ctx.fillRect(al === "centro" ? W / 2 - 60 : P, P + 90, 120, 16); area.y0 = P + 150;
    }
    // etiqueta e monograma
    if (e.tag) { ctx.font = "700 30px " + fb; ctx.fillStyle = e.layout === "foto" ? "#FFFFFF" : cor; ctx.textBaseline = "top"; ctx.textAlign = "left"; var tg = String(e.tag).toUpperCase(); ctx.save(); ctx.globalAlpha = 0.92; if (e.layout === "faixa" || e.layout === "moldura" || e.layout === "foto") { var tw = ctx.measureText(tg).width; ctx.fillStyle = "rgba(0,0,0,.35)"; rr(ctx, P - 14, P - 10, tw + 28, 52, 26); ctx.fill(); ctx.fillStyle = "#FFFFFF"; } ctx.fillText(tg, P, P); ctx.restore(); }
    if (e.mono) { var r = 46, cx = W - P - r + 10, cy = P + 16; ctx.fillStyle = id.cores[0]; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = id.cores[3]; ctx.font = "600 38px " + ft; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(id.iniciais, cx, cy + 2); }
    // título, apoio, chamada: empilhados a partir do topo da área, ou de baixo no layout de foto inteira
    var hT = altura(ctx, e.titulo, max, tituloSize, ft, "600", 1.1, 5), hA = e.apoio ? altura(ctx, e.apoio, max, 38, fb, "400", 1.35, 4) : 0, hC = e.cta ? 76 : 0;
    var bloco = hT + (hA ? hA + 28 : 0) + (hC ? hC + 34 : 0);
    var y = e.layout === "foto" ? area.y1 - bloco : e.layout === "texto" ? Math.max(area.y0, (H - sigH - bloco) / 2) : area.y0;
    if (e.layout === "texto" && y > area.y0) { ctx.fillStyle = acc; ctx.fillRect(al === "centro" ? W / 2 - 60 : P, y - 60, 120, 16); ctx.fillStyle = bg; ctx.fillRect(0, P + 88, W, 20); }
    y += texto(ctx, e.titulo, P, y, max, tituloSize, ft, "600", corTit, al, 1.1, 5) + 28;
    if (e.apoio) y += texto(ctx, e.apoio, P, y, max, 38, fb, "400", e.layout === "foto" ? "rgba(255,255,255,.92)" : cor, al, 1.35, 4) + 34;
    if (e.cta) { ctx.font = "700 32px " + fb; var cw = ctx.measureText(e.cta).width + 64, cx2 = al === "centro" ? (W - cw) / 2 : P; ctx.fillStyle = e.layout === "foto" ? "#FFFFFF" : acc; rr(ctx, cx2, y, cw, 70, 35); ctx.fill(); ctx.fillStyle = e.layout === "foto" ? "#111827" : sobre(acc, id); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(e.cta, cx2 + 32, y + 36); }
    // assinatura obrigatória (travada)
    var sig = G.assinatura(C.perfil(m)), clin = J.S.diag.nome;
    ctx.fillStyle = e.layout === "foto" ? "rgba(0,0,0,.55)" : "rgba(0,0,0,.18)"; ctx.fillRect(0, H - sigH, W, sigH);
    ctx.fillStyle = "#FFFFFF"; if (e.layout !== "foto" && lum(bg) > 0.4) ctx.fillStyle = id.cores[0];
    ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = "700 27px " + fb; ctx.fillText(sig, P, H - sigH / 2 - 16, max); ctx.font = "400 24px " + fb; ctx.fillText(rodapeClinica(), P, H - sigH / 2 + 22, max);
  }

  /* ---------- Guardião da arte ---------- */
  function rodapeClinica() { var d = J.S.diag; return d.nome + " · CRM-" + d.uf + " PJ " + (d.crmPJ || "") + " · " + (d.diretorSexo === "m" ? "Diretor técnico: Dr. " : "Diretora técnica: Dra. ") + d.diretor + " · CRM-" + d.uf + " " + d.diretorCrm; }
  function textoArte(e, m) { return [e.tag, e.titulo, e.apoio, e.cta, G.assinatura(C.perfil(m)), C.assinaturaClinica(J.S.diag)].filter(Boolean).join("\n\n"); }
  function checar(e, m) {
    var res = G.analisar(textoArte(e, m), CT.opcoesGuardiao(J.dm(m), "peca")), extra = [];
    if (e.foto && COM_FOTO[e.layout]) {
      var o = ORIGENS.filter(function (x) { return x[0] === e.origem; })[0];
      if (o && o[2]) { var rg = G.regra(o[2]); if (rg) extra.push({ regra: rg, gravidade: e.origem === "ia" ? "alerta" : "bloqueia", trechos: [], faltando: null, foto: o[1] }); }
    }
    var bloq = res.contagem.bloqueia + extra.filter(function (x) { return x.gravidade === "bloqueia"; }).length;
    return { res: res, extra: extra, liberado: bloq === 0, bloq: bloq };
  }
  function painelG(e, m) {
    var c = checar(e, m), hits = c.res.hits.concat(c.extra);
    var resumo = c.liberado ? '<span class="pill ok">liberada</span>' : '<span class="pill block">' + c.bloq + " bloqueio" + (c.bloq > 1 ? "s" : "") + "</span>";
    var lista = hits.length ? '<div class="hits compact">' + hits.map(function (h) {
      var cit = G.citacao(h.regra), q = h.foto ? "Foto: " + h.foto : h.faltando ? "Falta: " + h.faltando.join(", ") : h.trechos.map(function (s) { return "“" + s.texto + "”"; }).join(", ");
      return '<div class="hit ' + h.gravidade + '"><div class="row between"><b style="font-size:13px">' + esc(J.cap(h.regra.rotulo)) + '</b><span class="pill ' + (h.gravidade === "bloqueia" ? "block" : h.gravidade === "alerta" ? "warn" : "info") + '">' + h.gravidade + '</span></div><span class="small">' + esc(q) + " · " + esc(h.regra.explicacao) + '</span><span class="cit">' + esc(cit.texto) + "</span></div>";
    }).join("") + "</div>" : '<p class="ok-line">' + ICON.ok + "<b>Nenhuma regra violada na arte.</b></p>";
    return '<div class="row between"><h3 class="t">Guardião na arte</h3>' + resumo + "</div>" + lista +
      (c.res.hits.some(function (h) { return h.trechos && h.trechos.length; }) ? '<button class="btn ghost sm" type="button" data-act="ed-sugestoes">Aplicar as sugestões nos textos</button>' : "");
  }
  function atualizarG() { var e = J.S.editor, m = J.medico(e.medico), el = document.getElementById("ed-g"), bt = document.getElementById("ed-enviar"); if (el) el.innerHTML = painelG(e, m); if (bt) bt.disabled = !checar(e, m).liberado; }
  function redesenhar() { var e = J.S.editor, m = J.medico(e.medico); desenhar(document.getElementById("ed-cv"), e, m); atualizarG(); }
  function carregarImg(src, cb) {
    if (!src) { IMG.src = null; IMG.el = null; if (cb) cb(); return; }
    if (IMG.src === src && IMG.el) { if (cb) cb(); return; }
    var im = new Image(); im.onload = function () { IMG.src = src; IMG.el = im; if (cb) cb(); }; im.src = src;
  }

  /* ---------- tela ---------- */
  V.editor = function (arg) {
    var x = atual(arg), e = x.e, m = x.m, id = J.idt(m), ms = J.eq();
    var temFoto = !!COM_FOTO[e.layout];
    var seg = function (act, lista, val) { return '<div class="seg wrap-seg">' + lista.map(function (o) { return '<button type="button" data-act="' + act + '" data-v="' + o[0] + '" class="' + (String(val) === String(o[0]) ? "on" : "") + '" aria-pressed="' + (String(val) === String(o[0])) + '">' + esc(o[1]) + "</button>"; }).join("") + "</div>"; };
    var p = e.ref ? J.acharPeca(e.ref) : null;
    return '<button class="link" type="button" data-go="estudio/' + m.id + '">← Estúdio de ' + esc(C.titulo(m)) + "</button>" +
      J.cab("Estúdio · editor de artes", "Monte a arte do jeito do médico, com o CFM embutido", "Escolha o modelo, envie a foto, ajuste cores, fontes e textos. O Guardião checa enquanto você edita, e a assinatura com nome, CRM e RQE não sai da peça.") +
      '<div class="chips" role="group" aria-label="Médico">' + ms.map(function (x2) { var i2 = J.idt(x2); return '<button type="button" class="chip-btn' + (x2.id === m.id ? " on" : "") + '" data-go="editor/' + x2.id + '"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:' + i2.cores[1] + ';margin-right:6px"></span>' + esc(C.titulo(x2)) + "</button>"; }).join("") + "</div>" +
      '<div class="editor"><div class="ed-palco"><div class="ed-canvas ' + e.fmt + (temFoto && e.foto ? " arrasta" : "") + '"><canvas id="ed-cv" aria-label="Prévia da arte" role="img"></canvas>' + (temFoto && e.foto ? '<span class="ed-dica">Arraste a foto na prévia para enquadrar</span>' : "") + "</div>" +
      '<div class="row wrap"><button class="btn" type="button" id="ed-enviar" data-act="ed-enviar"' + (checar(e, m).liberado ? "" : " disabled") + ">Enviar para a diretora técnica</button><button class=\"btn ghost\" type=\"button\" data-act=\"ed-baixar\">Baixar PNG</button>" + (p ? '<span class="small">Arte do post do dia ' + p.dia + "</span>" : "") + "</div>" +
      '<div class="card" id="ed-png" hidden><div class="row between"><b>Arte pronta</b><button class="link" type="button" data-act="ed-png-fechar">Fechar</button></div><img alt="Arte final em PNG" style="max-width:240px;border-radius:8px;border:1px solid var(--line)"><p class="small">Se o download não começou, clique com o botão direito na imagem e escolha “Salvar imagem como”.</p></div>' +
      (e.enviado ? '<div class="aviso">' + ICON.ok.replace("<svg", '<svg width="18" height="18"') + '<span class="grow">Arte enviada para a fila da diretora técnica.</span><button class="btn sm" type="button" data-go="peca/' + e.enviado + '">Ver na aprovação</button></div>' : "") +
      '<div class="card" id="ed-g">' + painelG(e, m) + "</div></div>" +

      '<div class="ed-ctrl"><div class="card"><h3 class="t">Modelo</h3>' + seg("ed-fmt", Object.keys(FORMATOS).map(function (k) { return [k, FORMATOS[k][2]]; }), e.fmt) + '<div class="ed-layouts">' + LAYOUTS.map(function (l) { return '<button type="button" class="ed-lay lay-' + l[0] + (e.layout === l[0] ? " on" : "") + '" data-act="ed-layout" data-v="' + l[0] + '" aria-pressed="' + (e.layout === l[0]) + '"><i></i><span>' + esc(l[1]) + "</span></button>"; }).join("") + "</div></div>" +

      (temFoto ? '<div class="card"><h3 class="t">Foto</h3><label class="ed-drop" id="ed-drop" for="ed-arquivo"><input type="file" id="ed-arquivo" accept="image/*" data-in-change="ed-arquivo" class="sr"><b>' + (e.foto ? "Trocar a foto" : "Enviar uma foto") + '</b><span class="small">' + (e.fotoNome ? esc(e.fotoNome) : "Clique ou arraste a imagem para cá. Ela fica só no seu navegador.") + "</span></label>" +
        '<button class="link" type="button" data-act="ed-exemplo">Usar uma imagem de exemplo</button>' +
        (e.foto ? '<div class="slider"><div class="row between"><label for="ed-zoom" class="lbl" style="font-weight:600">Zoom</label><b id="ed-zv">' + Math.round(e.zoom * 100) + '%</b></div><input type="range" id="ed-zoom" min="1" max="3" step="0.05" value="' + e.zoom + '" data-in="ed" data-id="zoom"></div>' +
          (e.layout === "foto" ? '<div class="slider"><div class="row between"><label for="ed-esc" class="lbl" style="font-weight:600">Escurecer a foto</label></div><input type="range" id="ed-esc" min="0" max="0.8" step="0.05" value="' + e.escurecer + '" data-in="ed" data-id="escurecer"></div>' : "") +
          '<div class="field"><label for="ed-origem">De onde é a foto?</label><select id="ed-origem" data-in-change="ed-origem">' + ORIGENS.map(function (o) { return '<option value="' + o[0] + '"' + (e.origem === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + '</select><span class="help">O CFM proíbe imagem de paciente identificável e antes e depois sem finalidade educativa.</span></div><button class="link" type="button" data-act="ed-tirar-foto">Tirar a foto</button>' : "") + "</div>" : "") +

      '<div class="card"><h3 class="t">Textos</h3>' +
      '<div class="field"><label for="ed-tag">Etiqueta</label><input id="ed-tag" data-in="ed" data-id="tag" value="' + esc(e.tag) + '"></div>' +
      '<div class="field"><label for="ed-tit">Título</label><textarea id="ed-tit" class="ta" style="min-height:72px" data-in="ed" data-id="titulo">' + esc(e.titulo) + "</textarea></div>" +
      '<div class="field"><label for="ed-apoio">Texto de apoio</label><textarea id="ed-apoio" class="ta" style="min-height:72px" data-in="ed" data-id="apoio">' + esc(e.apoio) + "</textarea></div>" +
      '<div class="field"><label for="ed-cta">Chamada</label><input id="ed-cta" data-in="ed" data-id="cta" value="' + esc(e.cta) + '"></div>' +
      '<div class="field"><span class="lbl">Assinatura</span><div class="ed-sig">' + ICON.shield + "<span>" + esc(G.assinatura(C.perfil(m))) + "<br>" + esc(rodapeClinica()) + '<br><span class="small">Obrigatórias (Res. CFM 2.336/2023, arts. 4º e 5º): não dá para tirar.</span></span></div></div></div>' +

      '<div class="card"><h3 class="t">Estilo</h3><fieldset><legend>Cor de fundo · identidade ' + esc(id.familia) + '</legend><div class="ed-cores">' + id.cores.map(function (c, i) { return '<button type="button" class="ed-cor' + (e.fundo === i ? " on" : "") + '" style="background:' + c + '" data-act="ed-fundo" data-v="' + i + '" aria-label="Fundo ' + c + '" aria-pressed="' + (e.fundo === i) + '"></button>'; }).join("") + "</div></fieldset>" +
      '<fieldset><legend>Fonte do título</legend>' + seg("ed-fonte", FONTES, e.fonte) + "</fieldset>" +
      '<fieldset><legend>Alinhamento</legend>' + seg("ed-alinhar", [["esq", "À esquerda"], ["centro", "Centralizado"]], e.alinhar) + "</fieldset>" +
      '<label class="row" style="font-size:13.5px;cursor:pointer"><input type="checkbox" data-in-change="ed-mono"' + (e.mono ? " checked" : "") + "> Monograma do médico</label></div></div></div>";
  };
  D.editor = function () {
    var e = J.S.editor; if (!e) return;
    var m = J.medico(e.medico), id = J.idt(m), cv = document.getElementById("ed-cv");
    carregarImg(e.foto, function () { desenhar(cv, e, m); });
    desenhar(cv, e, m);
    if (document.fonts && document.fonts.load) Promise.all([id.fontes.titulo, id.fontes.texto, e.fonte === "id" ? id.fontes.titulo : e.fonte].map(function (f) { return document.fonts.load("600 40px '" + f + "'"); })).then(function () { desenhar(document.getElementById("ed-cv"), J.S.editor, m); }).catch(function () { /* ok */ });
    // arrastar a foto
    if (cv && e.foto && COM_FOTO[e.layout]) {
      var arr = null;
      cv.addEventListener("pointerdown", function (ev) { arr = { x: ev.clientX, y: ev.clientY, fx: J.S.editor.fx, fy: J.S.editor.fy, w: cv.getBoundingClientRect().width }; cv.setPointerCapture(ev.pointerId); });
      cv.addEventListener("pointermove", function (ev) {
        if (!arr) return; var E = J.S.editor, k = 1.6 / arr.w;
        E.fx = Math.max(0, Math.min(1, arr.fx - (ev.clientX - arr.x) * k)); E.fy = Math.max(0, Math.min(1, arr.fy - (ev.clientY - arr.y) * k));
        desenhar(cv, E, m);
      });
      cv.addEventListener("pointerup", function () { arr = null; J.salvar(); });
    }
    // arrastar arquivo para a área de foto
    var dz = document.getElementById("ed-drop");
    if (dz) {
      ["dragenter", "dragover"].forEach(function (t) { dz.addEventListener(t, function (ev) { ev.preventDefault(); dz.classList.add("on"); }); });
      dz.addEventListener("dragleave", function () { dz.classList.remove("on"); });
      dz.addEventListener("drop", function (ev) { ev.preventDefault(); dz.classList.remove("on"); var f = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0]; if (f) lerArquivo(f); });
    }
  };

  /* ---------- ações ---------- */
  function lerArquivo(f) {
    if (!/^image\//.test(f.type)) { J.toast("Escolha um arquivo de imagem (JPG ou PNG)."); return; }
    var rd = new FileReader();
    rd.onload = function () {
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, 1400 / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        var E = J.S.editor; E.foto = c.toDataURL("image/jpeg", 0.85); E.fotoNome = f.name; E.zoom = 1; E.fx = 0.5; E.fy = 0.5; E.origem = E.origem || "medico";
        IMG.src = null; J.render(); J.toast("Foto carregada. Arraste na prévia para enquadrar.");
      };
      im.src = rd.result;
    };
    rd.readAsDataURL(f);
  }
  function exemplo(m) {
    var id = J.idt(m), c = document.createElement("canvas"); c.width = 1200; c.height = 1200; var x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 1200, 1200); g.addColorStop(0, id.cores[2]); g.addColorStop(1, id.cores[0]); x.fillStyle = g; x.fillRect(0, 0, 1200, 1200);
    x.fillStyle = "rgba(255,255,255,.14)"; x.fillRect(120, 140, 420, 560); x.fillRect(580, 140, 420, 560);
    x.strokeStyle = "rgba(255,255,255,.35)"; x.lineWidth = 10; x.strokeRect(120, 140, 880, 560); x.beginPath(); x.moveTo(560, 140); x.lineTo(560, 700); x.stroke();
    x.fillStyle = "rgba(0,0,0,.22)"; x.fillRect(0, 860, 1200, 340); x.fillStyle = id.cores[1]; x.fillRect(260, 760, 680, 120);
    x.fillStyle = "rgba(255,255,255,.6)"; x.beginPath(); x.arc(900, 520, 90, 0, Math.PI * 2); x.fill();
    x.fillStyle = "rgba(255,255,255,.85)"; x.font = "600 44px sans-serif"; x.fillText("imagem de exemplo · consultório", 60, 1150);
    return c.toDataURL("image/jpeg", 0.85);
  }
  I.ed = function (t) {
    var E = J.S.editor, k = t.dataset.id;
    E[k] = (k === "zoom" || k === "escurecer") ? +t.value : t.value;
    if (k === "zoom") { var z = document.getElementById("ed-zv"); if (z) z.textContent = Math.round(E.zoom * 100) + "%"; }
    redesenhar();
    return false;
  };
  function setar(k, v) { return function (b) { var E = J.S.editor; E[k] = v === "num" ? +b.dataset.v : b.dataset.v; J.render(); }; }
  A["ed-fmt"] = setar("fmt");
  A["ed-layout"] = function (b) { var E = J.S.editor; E.layout = b.dataset.v; if (COM_FOTO[E.layout] && !E.foto) { E.foto = exemplo(J.medico(E.medico)); E.fotoNome = "imagem de exemplo"; E.origem = "consultorio"; IMG.src = null; } J.render(); };
  A["ed-fundo"] = setar("fundo", "num");
  A["ed-fonte"] = setar("fonte");
  A["ed-alinhar"] = setar("alinhar");
  A["ed-exemplo"] = function () { var E = J.S.editor; E.foto = exemplo(J.medico(E.medico)); E.fotoNome = "imagem de exemplo"; E.origem = "consultorio"; E.zoom = 1; E.fx = 0.5; E.fy = 0.5; IMG.src = null; J.render(); };
  A["ed-tirar-foto"] = function () { var E = J.S.editor; E.foto = null; E.fotoNome = ""; IMG.src = null; IMG.el = null; if (COM_FOTO[E.layout]) E.layout = "texto"; J.render(); };
  I["ed-arquivo"] = function (t) { var f = t.files && t.files[0]; if (f) lerArquivo(f); return false; };
  I["ed-origem"] = function (t) { J.S.editor.origem = t.value; redesenhar(); var o = ORIGENS.filter(function (x) { return x[0] === t.value; })[0]; if (o && o[2] && t.value !== "ia") J.toast("O Guardião bloqueou: " + G.regra(o[2]).rotulo + "."); return false; };
  I["ed-mono"] = function (t) { J.S.editor.mono = t.checked; redesenhar(); return false; };
  A["ed-sugestoes"] = function () {
    var E = J.S.editor;
    ["tag", "titulo", "apoio", "cta"].forEach(function (k) { if (E[k]) E[k] = G.aplicarSugestoes(E[k], { identificacao: false }).texto.trim(); });
    J.render(); J.toast("Sugestões do Guardião aplicadas nos textos.");
  };
  A["ed-baixar"] = function () {
    var cv = document.getElementById("ed-cv"), E = J.S.editor, m = J.medico(E.medico);
    if (!cv) return;
    try {
      cv.toBlob(function (b) {
        if (!b) { J.toast("Não foi possível gerar a imagem."); return; }
        J.T.edPng = cv.toDataURL("image/png"); var box = document.getElementById("ed-png"); if (box) { box.hidden = false; box.querySelector("img").src = J.T.edPng; }
        var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "jalecon-" + m.nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-") + "-" + E.fmt.toLowerCase() + ".png";
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
        J.toast("Arte baixada em PNG (" + FORMATOS[E.fmt][0] + " × " + FORMATOS[E.fmt][1] + ").");
      }, "image/png");
    } catch (er) { J.toast("Este navegador não permitiu baixar a imagem."); }
  };
  A["ed-png-fechar"] = function () { var box = document.getElementById("ed-png"); if (box) box.hidden = true; };
  A["ed-enviar"] = function () {
    var S = J.S, E = S.editor, m = J.medico(E.medico), ck = checar(E, m);
    if (!ck.liberado) return;
    var cv = document.getElementById("ed-cv"), mini = null;
    try { var c = document.createElement("canvas"), w = 480; c.width = w; c.height = Math.round(w * cv.height / cv.width); c.getContext("2d").drawImage(cv, 0, 0, c.width, c.height); mini = c.toDataURL("image/jpeg", 0.8); } catch (er) { /* ok */ }
    var f = { id: "a" + S.fila.length, ref: E.ref, autor: m.id, formato: E.fmt, dia: E.ref && J.acharPeca(E.ref) ? J.acharPeca(E.ref).dia : "", titulo: E.titulo.split("\n")[0].slice(0, 80), origem: "Editor de artes", texto: textoArte(E, m), status: "pendente", log: [], arte: mini, fotoOrigem: E.foto && COM_FOTO[E.layout] ? (ORIGENS.filter(function (x) { return x[0] === E.origem; })[0] || [])[1] : "" };
    f.original = f.texto;
    S.fila.push(f); E.enviado = f.id;
    J.registrar("Arte “" + f.titulo + "” de " + C.titulo(m) + " enviada para aprovação" + (f.fotoOrigem ? " (foto: " + f.fotoOrigem.toLowerCase() + ")" : "") + ".", "", f);
    J.evento("arte", "Arte de " + C.titulo(m) + " enviada para aprovação");
    J.render(); J.toast("Arte enviada para a diretora técnica.");
  };
})(window.JW);
