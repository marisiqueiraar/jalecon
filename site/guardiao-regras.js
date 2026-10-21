/* Jalecon · base de regras do Guardião (dados, sem lógica).
 * Gerado em 2026-10-20 a partir de research/regras_guardiao.json (pesquisa de 19-20/10/2026),
 * com complementos da demo: explicação simples, rótulo curto, trocas sugeridas,
 * exceções de contexto contra falsos positivos e duas gravidades ajustadas (ver ajuste_jalecon).
 * Para trocar a base, substitua este arquivo mantendo o formato: window.JALECON_REGRAS = [...].
 * Regras com "confirmado": false aparecem na interface como "regra em validação jurídica".
 * Padrões: expressões regulares aplicadas ao texto em minúsculas e sem acentos.
 */
(function (g) {
  var REGRAS = [
 {
  "id": "CFM2336-ID-01",
  "titulo": "Identificação obrigatória ausente (nome, CRM/UF, palavra MÉDICO, RQE se anunciar especialidade)",
  "rotulo": "identificação incompleta",
  "tipo": "ausencia_obrigatoria",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023; Código de Ética Médica (Res. CFM 2.217/2018), art. 117",
  "artigo": "Res. 2.336/2023, art. 4º; CEM art. 117",
  "confirmado": true,
  "explicacao": "Peças de divulgação, a bio e o site precisam trazer seu nome, o CRM com a UF e a palavra MÉDICO (ou MÉDICA). Sem isso, a peça não pode ir ao ar.",
  "descricao": "Toda peça de publicidade médica deve trazer o nome do médico, o(s) número(s) de inscrição no CRM acompanhado(s) da palavra MÉDICO e, se anunciar especialidade/área de atuação, o RQE. O CEM art. 117 exige nome, número no CRM com a UF e RQE quando anunciar especialidade. Regra de AUSÊNCIA: dispara quando nenhum padrão de CRM for encontrado na peça ou no perfil (art. 6º: dados visíveis na página principal do perfil — fonte secundária: manual CFM).",
  "sugestao": "Inclua no rodapé/legenda: \"Dra. Ana Souza – MÉDICA – CRM-SP 123456 – Dermatologia – RQE 7890\". Em perfis, deixe esses dados na bio.",
  "padroes": [
   "\\bcrm[\\s/-]*[a-z]{2}[\\s:nº°.-]*\\d{3,7}",
   "\\bcrm[\\s:nº°.-]*\\d{3,7}[\\s/-]*[a-z]{2}\\b",
   "\\bm[eé]dic[oa]\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "assinatura",
  "exemplos_violacao": [
   "Dra. Ana Souza – Dermatologia. Agende sua avaliação!",
   "Clínica Vida: cuidando da sua pele (post sem CRM nem a palavra médico)"
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://portal.cfm.org.br/images/PDF/cem2019.pdf",
  "elementos": [
   {
    "nome": "CRM com a UF",
    "padroes": [
     "\\bcrm[\\s/-]*[a-z]{2}[\\s:nº°.-]*\\d{3,7}",
     "\\bcrm[\\s:nº°.-]*\\d{3,7}[\\s/-]*[a-z]{2}\\b",
     "\\bcrm[\\s:nº°./-]*\\d{3,7}"
    ]
   },
   {
    "nome": "palavra MÉDICO ou MÉDICA",
    "padroes": [
     "\\bm[eé]dic[oa]\\b"
    ]
   }
  ]
 },
 {
  "id": "CFM2336-RQE-01",
  "titulo": "Uso de \"especialista\" ou nome de especialidade sem RQE",
  "rotulo": "especialidade sem RQE",
  "tipo": "condicional",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023; CEM (Res. 2.217/2018) arts. 114 e 117",
  "artigo": "Res. 2.336/2023, art. 4º; CEM arts. 114 e 117",
  "confirmado": true,
  "explicacao": "Só pode se apresentar como especialista, ou usar o nome da especialidade como título, quem tem RQE. Quando cita, o número do RQE precisa aparecer junto.",
  "descricao": "Só pode se anunciar especialista quem tem RQE registrado no CRM; ao anunciar especialidade deve constar o RQE. CEM art. 114 veda anunciar especialidade/área de atuação para a qual não esteja qualificado e registrado no CRM. Dispara se o texto usa 'especialista'/'especialidade' e não há RQE.",
  "sugestao": "Se houver RQE: \"Dermatologista – RQE 1234\". Se não houver: retire 'especialista' e descreva a formação como currículo, seguida de NÃO ESPECIALISTA (ver regra CFM2336-POS-01).",
  "padroes": [
   "\\bespecialista\\b",
   "\\bespecialidade\\b",
   "\\bespecializad[oa] em\\b",
   "\\bsou (?:\\w+ ){0,3}(?:ortopedista|pediatra|psiquiatra|cardiologista|gastroenterologista|gastro|cirurgi[aã]o geral|cirurgi[aã] geral|dermatologista|ginecologista|obstetra|endocrinologista|neurologista|urologista|oftalmologista|otorrino|reumatologista|geriatra|mastologista|nutr[oó]log[oa]|cirurgi[aã]o pl[aá]stic[oa])\\b",
   "\\bm[eé]dic[oa] (?:ortopedista|pediatra|psiquiatra|cardiologista|gastroenterologista|gastro|cirurgi[aã]o geral|cirurgi[aã] geral|dermatologista|ginecologista|obstetra|endocrinologista|neurologista|urologista|oftalmologista|otorrino|reumatologista|geriatra|mastologista|nutr[oó]log[oa]|cirurgi[aã]o pl[aá]stic[oa])\\b",
   "(?:^|[\\n|·•\\-–—,;:/])\\s*(?:ortopedista|pediatra|psiquiatra|cardiologista|gastroenterologista|gastro|cirurgi[aã]o geral|cirurgi[aã] geral|dermatologista|ginecologista|obstetra|endocrinologista|neurologista|urologista|oftalmologista|otorrino|reumatologista|geriatra|mastologista|nutr[oó]log[oa]|cirurgi[aã]o pl[aá]stic[oa])(?=\\s*(?:$|[\\n|·•\\-–—,;:/]|\\.))",
   "(?:^|\\n)\\s*(?:ortopedista|pediatra|psiquiatra|cardiologista|gastroenterologista|gastro|cirurgi[aã]o geral|cirurgi[aã] geral|dermatologista|ginecologista|obstetra|endocrinologista|neurologista|urologista|oftalmologista|otorrino|reumatologista|geriatra|mastologista|nutr[oó]log[oa]|cirurgi[aã]o pl[aá]stic[oa])\\b",
   "(?:^|[\\n|·•\\-–—,;:/])\\s*(?:ortopedia(?: e traumatologia)?|pediatria|psiquiatria|cardiologia|gastroenterologia|cirurgia geral|dermatologia|ginecologia(?: e obstetr[ií]cia)?|endocrinologia|neurologia|urologia|oftalmologia|reumatologia)(?=\\s*(?:$|[\\n|·•\\-–—,;:/]|\\.))"
  ],
  "exceto_se": [
   "\\brqe[\\s:nº°.-]*\\d+",
   "n[aã]o especialista"
  ],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "rqe",
  "exemplos_violacao": [
   "Sou especialista em emagrecimento e hormônios.",
   "Dr. Paulo, especialista em dor crônica – agende já.",
   "Médica especializada em rejuvenescimento facial."
  ],
  "fonte": "https://www.in.gov.br/materia/-/asset_publisher/Kujrw0TZC2Mb/content/id/48226289/do1-2018-11-01-resolucao-n-2-217-de-27-de-setembro-de-2018-48226042 ; https://publicidademedica.cfm.org.br/resolucao/o-que-muda"
 },
 {
  "id": "CFM2336-POS-01",
  "titulo": "Pós-graduação anunciada sem a expressão NÃO ESPECIALISTA",
  "rotulo": "pós-graduação sem NÃO ESPECIALISTA",
  "tipo": "condicional",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "artigo não confirmado (regra de pós-graduação lato sensu divulgada pelo CFM)",
  "confirmado": false,
  "explicacao": "Pós-graduação não é especialidade. Quem cita pós-graduação sem ter RQE precisa escrever NÃO ESPECIALISTA logo depois.",
  "descricao": "O médico com pós-graduação lato sensu (cadastrada no CRM, segundo comentaristas) pode anunciá-la em forma de currículo, seguida da expressão NÃO ESPECIALISTA em caixa alta. Previsão nova da Res. 2.336/2023 segundo o próprio CFM; número do artigo não confirmado nesta pesquisa.",
  "sugestao": "\"Dr. João Lima – MÉDICO – CRM-MG 12345 – Pós-graduação em Nutrologia – NÃO ESPECIALISTA\".",
  "padroes": [
   "p[oó]s[- ]?gradua[cç][aã]o em",
   "p[oó]s[- ]?graduad[oa] em",
   "\\bp[oó]s em\\b",
   "\\bfellow(ship)?\\b"
  ],
  "exceto_se": [
   "n[aã]o especialista",
   "\\brqe[\\s:nº°.-]*\\d+"
  ],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "manual",
  "exemplos_violacao": [
   "Pós-graduada em Dermatologia Estética.",
   "Médico pós-graduado em Nutrologia – agende sua consulta."
  ],
  "fonte": "https://www.ibes.med.br/resolucao-cfm-no-2-336-2023-atualiza-regras-sobre-publicidade-medica/ ; https://fiscalizacao.cremesp.org.br/faq/"
 },
 {
  "id": "CFM2336-NAOESP-01",
  "titulo": "Não especialista anunciando que trata órgão, sistema ou doença específica",
  "rotulo": "sugere especialidade sem RQE",
  "tipo": "condicional",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, I",
  "confirmado": true,
  "explicacao": "Sem RQE na área, dizer que trata um órgão ou uma doença específica sugere uma especialidade que não está registrada.",
  "descricao": "É vedado ao médico não especialista divulgar que trata de sistemas orgânicos, órgãos ou doenças específicas, por induzir confusão com especialidade. Detecção heurística: dispara quando há anúncio de tratamento focado e nenhum RQE.",
  "sugestao": "Sem RQE, descreva a atuação como clínica geral/área de interesse sem sugerir especialidade, ou inclua o RQE correspondente se existir.",
  "padroes": [
   "\\btrat(o|amos) (de )?(doen[cç]as|problemas|dist[uú]rbios) d[aoe]s? ",
   "\\bcuid(o|amos) (do seu|da sua|dos seus|das suas) (cora[cç][aã]o|tire[oó]ide|pele|coluna|joelho|f[ií]gado|intestino|horm[oô]nios)",
   "\\btratamento (de|para) (diabetes|tireoide|hipotireoidismo|enxaqueca|fibromialgia|menopausa|obesidade|calv[ií]cie|acne|varizes)"
  ],
  "exceto_se": [
   "\\brqe[\\s:nº°.-]*\\d+"
  ],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "rqe",
  "exemplos_violacao": [
   "Trato doenças da tireoide e menopausa (médico sem RQE em endocrinologia).",
   "Cuidamos do seu coração – agende sua consulta."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-TIT-01",
  "titulo": "Título ou especialidade inexistente/não reconhecida",
  "rotulo": "título não reconhecido",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "CEM (Res. CFM 2.217/2018); Resolução CFM nº 2.336/2023",
  "artigo": "CEM art. 114; Res. 2.336/2023 (artigo específico não confirmado)",
  "confirmado": false,
  "explicacao": "Esse título não corresponde a uma especialidade reconhecida e pode confundir o paciente.",
  "descricao": "CEM art. 114 veda anunciar títulos científicos que não possa comprovar e especialidade/área de atuação para a qual não esteja qualificado e registrado no CRM. Comentaristas da Res. 2.336 apontam que títulos inexistentes ou não reconhecidos não podem ser usados. A lista de termos abaixo é heurística (não é especialidade médica reconhecida segundo o conhecimento corrente — conferir a resolução CFM vigente de especialidades).",
  "sugestao": "Use apenas especialidades/áreas de atuação reconhecidas e registradas (com RQE) ou descreva o procedimento que realiza sem atribuir título: \"Realizo procedimentos de toxina botulínica\".",
  "padroes": [
   "especialista em (medicina )?est[eé]tica",
   "\\bm[eé]dic[oa] est[eé]tic[oa]\\b",
   "especialista em (emagrecimento|harmoniza[cç][aã]o|rejuvenescimento|longevidade|antienvelhecimento|anti-?aging|implante hormonal|soroterapia|ozonioterapia)",
   "\\bcirurgi[aã]o est[eé]tico\\b",
   "\\bmedicina ortomolecular\\b",
   "\\bmedicina anti-?aging\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Dra. Carla, especialista em medicina estética.",
   "Especialista em emagrecimento e longevidade."
  ],
  "fonte": "https://www.in.gov.br/materia/-/asset_publisher/Kujrw0TZC2Mb/content/id/48226289/do1-2018-11-01-resolucao-n-2-217-de-27-de-setembro-de-2018-48226042 ; https://www.ricardostival.com.br/single-post/publicidade-m%C3%A9dica-e-a-nova-resolu%C3%A7%C3%A3o-cfm-n%C2%BA-2-336-23"
 },
 {
  "id": "CFM2336-GAR-01",
  "titulo": "Garantir ou prometer resultado",
  "rotulo": "promessa de resultado",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, XII",
  "confirmado": true,
  "explicacao": "Prometer ou garantir resultado é proibido: cada paciente responde de um jeito ao tratamento.",
  "descricao": "É vedado garantir, prometer ou insinuar bons resultados do tratamento. A medicina é atividade de meio. Também é propaganda enganosa (art. 11, VI) e pode configurar publicidade enganosa (CDC art. 37, §1º).",
  "sugestao": "Troque a promessa por informação: \"Os resultados variam conforme cada paciente; na consulta avaliamos indicações, limitações e riscos.\"",
  "padroes": [
   "\\bgarant(o|imos|ia|ido|ida|idos|idas|e)\\b",
   "resultado garantido",
   "satisfa[cç][aã]o garantida",
   "100\\s?% (eficaz|garantido|seguro|natural|efetivo|de sucesso|de satisfa[cç][aã]o)",
   "\\brisco zero\\b",
   "\\bsem (nenhum )?riscos?\\b",
   "resultados? (definitivos?|permanentes?|imediatos?|certos?)",
   "\\bnunca mais\\b",
   "\\bvoc[eê] vai (ficar|sair|ter|conseguir|emagrecer|rejuvenescer)\\b",
   "\\bsucesso (garantido|absoluto|total)\\b",
   "dinheiro de volta",
   "\\b100\\s?% (?:dos casos|de cura|de resultado|resolvid[oa])"
  ],
  "exceto_se": [],
  "ignorar_contexto": [
   "\\bn[aã]o (?:\\w+ ){0,3}(?:garant|promet)",
   "\\bningu[eé]m (?:pode )?garant",
   "\\bnenhum (?:\\w+ ){0,3}(?:é |e )?sem riscos?",
   "garant\\w* (?:o |a |seu |sua )?(?:sigilo|privacidade|confidencialidade|acesso)"
  ],
  "aplica_se": [],
  "trocas": [
   [
    "resultados? garantid[oa]s?",
    "resultado que varia de pessoa para pessoa"
   ],
   [
    "satisfa[cç][aã]o garantida",
    "atendimento cuidadoso"
   ],
   [
    "^100\\s?% (?:eficaz|garantido|seguro|natural|efetivo|de sucesso|de satisfa[cç][aã]o)$",
    "com segurança avaliada caso a caso"
   ],
   [
    "^risco zero$",
    "riscos explicados na consulta"
   ],
   [
    "^sem (?:nenhum )?riscos?$",
    "com riscos explicados na consulta"
   ],
   [
    "^resultados? (?:definitivos?|permanentes?|imediatos?|certos?)$",
    "resultados que variam de pessoa para pessoa"
   ],
   [
    "^nunca mais$",
    "menos"
   ],
   [
    "^sucesso (?:garantido|absoluto|total)$",
    "acompanhamento próximo"
   ],
   [
    "^garanto$",
    "busco"
   ],
   [
    "^garantimos$",
    "buscamos"
   ]
  ],
  "correcao": "frase",
  "exemplos_violacao": [
   "Resultado garantido já na primeira sessão!",
   "Procedimento 100% seguro e sem riscos.",
   "Você vai sair daqui 10 anos mais jovem."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://publicidademedica.cfm.org.br/manual/aplicacao-pratica/capitulo-10"
 },
 {
  "id": "CFM2336-GAR-02",
  "titulo": "Insinuar bons resultados / ausência de desconforto ou risco",
  "rotulo": "insinua ausência de dor ou risco",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, XII; Art. 11, § 2º, alínea f",
  "confirmado": true,
  "explicacao": "Dizer que algo é sem dor, sem cicatriz ou sem efeito colateral insinua um resultado que ninguém pode assegurar.",
  "descricao": "O art. 11, XII também veda INSINUAR bons resultados; a alínea f do § 2º (sensacionalismo) inclui usar de forma abusiva, enganosa ou sedutora representações visuais e informações que induzam à percepção de garantia de resultados. Expressões que negam dor, cicatriz, efeito adverso ou tempo de recuperação são o padrão mais comum.",
  "sugestao": "\"O procedimento é feito com anestesia local; o desconforto e o tempo de recuperação variam. Possíveis efeitos adversos são explicados na consulta.\"",
  "padroes": [
   "\\bsem dor\\b",
   "\\bindolor\\b",
   "\\bsem cicatriz(es)?\\b",
   "\\bsem cortes?\\b",
   "sem efeitos? colaterais",
   "sem contraindica[cç][oõ]es",
   "recupera[cç][aã]o (imediata|instant[aâ]nea)",
   "\\bvolte (ao trabalho|à rotina) no mesmo dia\\b",
   "efeito (imediato|natural garantido)",
   "\\bseguro para todos\\b",
   "resultado natural garantido"
  ],
  "exceto_se": [],
  "ignorar_contexto": [
   "sem dor de cabe[cç]a[^.!?\\n]{0,40}(?:agend|marc|pag|estacion|fila|burocra|reembols|conv[eê]nio|online|whats)",
   "(?:agend|marc|pag|estacion|fila|burocra|reembols|conv[eê]nio|online|whats)[^.!?\\n]{0,40}sem dor de cabe[cç]a"
  ],
  "aplica_se": [],
  "trocas": [
   [
    "^sem dor$",
    "com controle da dor"
   ],
   [
    "^indolor$",
    "com controle da dor"
   ],
   [
    "^sem cicatriz(?:es)?$",
    "com cicatrizes que variam em cada caso"
   ],
   [
    "^sem cortes?$",
    "minimamente invasivo, quando indicado"
   ],
   [
    "^sem efeitos? colaterais$",
    "com efeitos colaterais explicados na consulta"
   ],
   [
    "^sem contraindica[cç][oõ]es$",
    "com contraindicações avaliadas na consulta"
   ],
   [
    "^recupera[cç][aã]o (?:imediata|instant[aâ]nea)$",
    "recuperação que varia de pessoa para pessoa"
   ],
   [
    "^efeito (?:imediato|natural garantido)$",
    "efeito que varia de pessoa para pessoa"
   ],
   [
    "^seguro para todos$",
    "indicado após avaliação"
   ]
  ],
  "correcao": "frase",
  "exemplos_violacao": [
   "Lipo sem dor e sem cicatrizes!",
   "Tratamento sem efeitos colaterais, recuperação imediata."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://www.cremesp.org.br/?siteAcao=PesquisaLegislacao&dif=a&ficha=1&id=20730"
 },
 {
  "id": "CFM2336-GAR-03",
  "titulo": "Promessa numérica de resultado (kg, anos, centímetros, prazo)",
  "rotulo": "promessa numérica de resultado",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023; CDC (Lei 8.078/1990)",
  "artigo": "Res. 2.336, Art. 11, XII; CDC art. 37, § 1º",
  "confirmado": true,
  "explicacao": "Números de resultado (quilos, anos a menos, prazos) funcionam como promessa e são vedados.",
  "descricao": "Quantificar o resultado esperado (perder X kg em Y dias, rejuvenescer X anos) equivale a prometer resultado e é a forma mais clara de violação do art. 11, XII.",
  "sugestao": "Remova números de resultado; explique o objetivo do tratamento e que a resposta é individual.",
  "padroes": [
   "perca (at[eé] )?\\d+\\s?(kg|quilos)",
   "elimine (at[eé] )?\\d+\\s?(kg|quilos|cm|cent[ií]metros)",
   "emagre[cç]a \\d+\\s?(kg|quilos)",
   "\\d+\\s?(kg|quilos) em \\d+\\s?(dias|semanas)",
   "(rejuvene[cç]a|pare[cç]a) (at[eé] )?\\d+ anos (mais jovem|a menos)?",
   "\\d+ anos mais jovem",
   "em (apenas )?\\d+ (dias|sess[oõ]es) voc[eê]"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Perca até 10 kg em 30 dias com nosso protocolo!",
   "Pareça 10 anos mais jovem em uma sessão."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "DL4113-CURA-01",
  "titulo": "Anúncio de cura",
  "rotulo": "anúncio de cura",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Decreto-Lei nº 4.113/1942; Resolução CFM nº 2.336/2023; CEM",
  "artigo": "DL 4.113/1942, art. 1º, I; Res. 2.336, art. 11, XII; CEM art. 112",
  "confirmado": true,
  "explicacao": "Anunciar cura é vedado por lei (Decreto-Lei 4.113/1942) e pelo CFM. Fale em tratar, controlar ou aliviar, quando for verdade.",
  "descricao": "O DL 4.113/1942 (considerado em vigor pela doutrina e citado pelo CFM) veda anunciar a cura de determinadas doenças para as quais não haja tratamento próprio. Anunciar 'cura' no marketing também insinua resultado (Res. 2.336, art. 11, XII). Conteúdo educativo genérico ('a hepatite C tem cura com tratamento') pode ser legítimo — por isso é alerta.",
  "sugestao": "\"Existem tratamentos que podem controlar/melhorar a enxaqueca; o plano é definido após avaliação.\"",
  "padroes": [
   "\\bcura(r|mos|do|da|dos|das)?\\b",
   "\\bcure (sua|seu|de vez)\\b",
   "\\belimin(e|a) (de vez|definitivamente)\\b",
   "\\belimin(e|a) (a|o|as|os|sua|seu|suas|seus) [^.!?\\n]{1,40}? de vez\\b",
   "\\bacabe (de vez )?com (a|o|sua|seu)\\b",
   "\\bsolu[cç][aã]o definitiva\\b",
   "\\btratamento definitivo\\b",
   "\\b(?:a|uma) cura\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [
   "\\b(?:n[aã]o|sem|nem) (?:tem |h[aá] |existe |possui |\\w+ )?cura\\b",
   "\\bn[aã]o (?:\\w+ ){0,2}promet\\w* cura",
   "\\bn[aã]o (?:\\w+ ){0,2}curad"
  ],
  "aplica_se": [],
  "trocas": [
   [
    "^a cura$",
    "o tratamento"
   ],
   [
    "^uma cura$",
    "um tratamento"
   ],
   [
    "^cura$",
    "tratamento"
   ],
   [
    "^curar$",
    "tratar"
   ],
   [
    "^curamos$",
    "tratamos"
   ],
   [
    "^curado$",
    "tratado"
   ],
   [
    "^curada$",
    "tratada"
   ],
   [
    "^curados$",
    "tratados"
   ],
   [
    "^curadas$",
    "tratadas"
   ],
   [
    "^cure de vez$",
    "trate"
   ],
   [
    "^cure (sua|seu)$",
    "trate $1"
   ],
   [
    "^elimin(?:e|a) (?:de vez|definitivamente)$",
    "alivie"
   ],
   [
    "^elimin(?:e|a) ((?:a|o|as|os|sua|seu|suas|seus) .+?) de vez$",
    "alivie $1"
   ],
   [
    "^acabe (?:de vez )?com (a|o|sua|seu)$",
    "alivie $1"
   ],
   [
    "^solu[cç][aã]o definitiva$",
    "tratamento adequado"
   ],
   [
    "^tratamento definitivo$",
    "tratamento adequado"
   ]
  ],
  "correcao": "frase",
  "exemplos_violacao": [
   "Curamos sua enxaqueca de vez!",
   "Solução definitiva para a calvície.",
   "Acabe com a celulite em poucas sessões."
  ],
  "fonte": "https://portal.cfm.org.br/leis/lei-4113-1942-obs-decreto-lei-4-113-regula-a-propaganda-de-medicos-cirurgioes-dentistas-parteiras-massagistas-enfermeiros-de-casas-de-saude-e-de-estabelecimentos-congeneres-e-a-de-preparados/",
  "gravidade_original": "alerta",
  "ajuste_jalecon": "Gravidade elevada de 'alerta' para 'bloqueia': anunciar cura é vedado pelo DL 4.113/1942 (orientação da coordenação jurídica do projeto)."
 },
 {
  "id": "CFM2336-AUTO-01",
  "titulo": "Superlativos e autopromoção (\"o melhor\", \"número 1\", \"referência\")",
  "rotulo": "autopromoção",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023; CEM art. 112",
  "artigo": "Res. 2.336, art. 11, XVI e § 2º, alínea a; CEM art. 112",
  "confirmado": true,
  "explicacao": "Superlativos como 'o melhor' ou 'número 1' são autopromoção e não podem ser comprovados.",
  "descricao": "Veda-se portar-se de forma sensacionalista ou autopromocional, praticar concorrência desleal ou divulgar conteúdo inverídico (art. 11, XVI). Sensacionalismo inclui divulgar procedimento com o objetivo de enaltecer e priorizar a atuação do médico ou do local onde atua (§ 2º, a). CEM art. 112 veda divulgar assunto médico de forma sensacionalista, promocional ou inverídica.",
  "sugestao": "Descreva fatos verificáveis e sóbrios: formação, RQE, procedimentos que realiza. Ex.: \"Cirurgião plástico – RQE 1234. Atendo em São Paulo.\"",
  "padroes": [
   "\\b(o|a) melhor (m[eé]dic[oa]|cirurgi[aã]|dermatologista|cl[ií]nica|resultado|tratamento|profissional|da cidade|do brasil|de sp|do rio)",
   "\\bmelhores (m[eé]dicos|resultados|cirurgi[oõ]es)\\b",
   "\\bn[uú]mero (1|um)\\b",
   "\\bn[ºo°]\\.?\\s?1\\b",
   "\\btop 1\\b",
   "\\brefer[eê]ncia (nacional|internacional|em|no|na)\\b",
   "\\bl[ií]der (em|no|na)\\b",
   "\\bo mais (procurado|experiente|completo|renomado|premiado|requisitado)\\b",
   "\\bmais de \\d[\\d.]* (pacientes|cirurgias|procedimentos) (realizad|atendid)",
   "\\bincompar[aá]vel\\b",
   "\\bimbat[ií]vel\\b",
   "\\b(?:o|a) melhor \\w+(?:ista|iatra|ologo|ologa|geon|[aã]o)\\b",
   "\\bsou (?:uma |a )?refer[eê]ncia (?:em|no|na)\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [
   "(?:rua|av\\.?|avenida|alameda|travessa|pra[cç]a|andar|sala)[^.\\n]{0,40}n[º°o]\\.?\\s?1",
   "n[º°o]\\.?\\s?1\\s?[º°]?\\s?(?:andar|piso)",
   "n[º°o]\\.?\\s?1\\b[^.\\n]{0,25}(?:rua|av\\.?|avenida|alameda|andar|sala|bloco|piso)"
  ],
  "aplica_se": [],
  "trocas": [
   [
    "^(?:o|a) melhor (\\w+) de$",
    "$1 em"
   ],
   [
    "^(?:o|a) melhor (\\w+)$",
    "$1"
   ],
   [
    "^sou (?:uma |a )?refer[eê]ncia (em|no|na)$",
    "atuo $1"
   ],
   [
    "^refer[eê]ncia (em|no|na)$",
    "com atuação $1"
   ],
   [
    "^melhores resultados$",
    "resultados possíveis"
   ]
  ],
  "correcao": "frase",
  "exemplos_violacao": [
   "O melhor cirurgião plástico de São Paulo.",
   "Clínica nº 1 em harmonização facial.",
   "Mais de 5.000 cirurgias realizadas – referência nacional!"
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://portal.cfm.org.br/images/PDF/cem2019.pdf"
 },
 {
  "id": "CFM2336-EXCL-01",
  "titulo": "Exclusividade de método ou de profissional",
  "rotulo": "exclusividade",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, XVI (concorrência desleal/autopromoção); § 2º, a",
  "confirmado": true,
  "explicacao": "Dizer que o método ou o profissional é único ou exclusivo sugere vantagem sobre colegas, o que conta como concorrência desleal.",
  "descricao": "Reivindicar exclusividade (único, exclusivo, inédito) é autopromoção e concorrência desleal. Em entrevistas, a resolução também pede que o médico evite reivindicar exclusividade de métodos diagnósticos e terapêuticos (artigo dessa regra não confirmado).",
  "sugestao": "\"Realizo a técnica X, indicada para ... (explicar indicação e limitações).\"",
  "padroes": [
   "\\b[uú]nic[oa] (m[eé]dic[oa]|cl[ií]nica|profissional|no brasil|na cidade|na regi[aã]o|do estado|a (fazer|realizar|oferecer))",
   "\\bt[eé]cnica (exclusiva|in[eé]dita|pr[oó]pria|revolucion[aá]ria|secreta)\\b",
   "\\bm[eé]todo (exclusivo|in[eé]dito|revolucion[aá]rio|pr[oó]prio)\\b",
   "\\bprotocolo (exclusivo|pr[oó]prio|secreto)\\b",
   "\\bs[oó] aqui\\b",
   "\\bexclusividade\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [
   [
    "^(t[eé]cnica|m[eé]todo|protocolo) \\w+$",
    "$1"
   ]
  ],
  "correcao": "frase",
  "exemplos_violacao": [
   "Único médico da cidade a realizar a técnica X.",
   "Conheça meu método exclusivo de emagrecimento."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://smabr.com/publicidade-e-propaganda-medica/"
 },
 {
  "id": "CFM2336-PREM-01",
  "titulo": "Premiações promocionais (\"médico do ano\", \"melhor médico\")",
  "rotulo": "premiação promocional",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, XIII",
  "confirmado": true,
  "explicacao": "Prêmios do tipo 'médico do ano' costumam ser comerciais e não podem ser usados na divulgação.",
  "descricao": "Veda permitir que o nome integre listas de premiações com a finalidade de escolher ou indicar profissional para títulos como \"médico do ano\", \"destaque da especialidade\", \"melhor médico\" com foco promocional.",
  "sugestao": "Não divulgue premiações comerciais. Títulos acadêmicos comprováveis podem constar como currículo.",
  "padroes": [
   "\\bm[eé]dic[oa] do ano\\b",
   "\\bmelhor m[eé]dic[oa]\\b",
   "\\bdestaque (da|na) especialidade\\b",
   "\\beleit[oa] (o|a|como)? ?(melhor|destaque|top)",
   "\\bpr[eê]mio (de )?(melhor|destaque|excel[eê]ncia|qualidade)\\b",
   "\\btop doctor\\b",
   "\\bprofissional do ano\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Eleita Médica do Ano 2025!",
   "Recebi o prêmio de melhor médico da região."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-SELO-01",
  "titulo": "Selos de qualidade/certificações que induzem garantia",
  "rotulo": "selo que induz garantia",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, V (texto exato não confirmado; descrito por fonte secundária como selo de qualidade que induz garantia)",
  "confirmado": false,
  "explicacao": "Selos de qualidade associados a resultado induzem o paciente a esperar garantia.",
  "descricao": "Fontes que citam o texto oficial indicam que o art. 11, V trata de selo de qualidade com o mesmo fundamento do inciso IV (indução à garantia de resultados). Redação exata não confirmada.",
  "sugestao": "Remova selos comerciais; informe acreditações oficiais de forma neutra, sem associá-las a resultados.",
  "padroes": [
   "\\bselo (de )?(qualidade|excel[eê]ncia|ouro|garantia)\\b",
   "\\bcertificad[oa] (de|como) (centro de )?(excel[eê]ncia|qualidade|refer[eê]ncia)\\b",
   "\\bclinica certificada\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Clínica com Selo Ouro de qualidade em resultados.",
   "Certificada como centro de excelência em lipoaspiração."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-MEDO-01",
  "titulo": "Sensacionalismo por medo, pânico ou intranquilidade",
  "rotulo": "sensacionalismo pelo medo",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023; CDC art. 37, § 2º",
  "artigo": "Res. 2.336, art. 11, § 2º, alínea e; CDC art. 37, § 2º",
  "confirmado": true,
  "explicacao": "Usar medo ou urgência para convencer o paciente é sensacionalismo. Informe com calma.",
  "descricao": "É sensacionalismo veicular em público informação que possa causar intranquilidade, insegurança, pânico ou medo, de forma coletiva ou individual, mesmo que para fatos conhecidos. No CDC, é abusiva a publicidade que explore o medo.",
  "sugestao": "Informe com tom sereno e baseado em evidência: \"Manchas que mudam de cor ou tamanho devem ser avaliadas por um médico.\"",
  "padroes": [
   "\\bantes que seja tarde\\b",
   "\\bpode (te |lhe )?matar\\b",
   "\\bassassin[oa] silencios[oa]\\b",
   "\\b(voc[eê]|seu filho) (est[aá]|pode estar) (em risco|correndo risco|morrendo)\\b",
   "\\balerta (urgente|m[aá]ximo)\\b",
   "\\bn[aã]o ignore\\b",
   "\\bperigo (mortal|silencioso)\\b",
   "\\bepidemia silenciosa\\b",
   "\\bvoc[eê] pode (morrer|perder (a vis[aã]o|o p[eé]|a perna))\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [
   [
    "^antes que seja tarde$",
    "com tranquilidade"
   ],
   [
    "^n[aã]o ignore$",
    "observe"
   ]
  ],
  "correcao": "frase",
  "exemplos_violacao": [
   "Essa mancha pode te matar – agende antes que seja tarde!",
   "Alerta urgente: seu filho pode estar correndo risco."
  ],
  "fonte": "https://www.cremesp.org.br/?siteAcao=PesquisaLegislacao&dif=a&ficha=1&id=20730 ; https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-SEDU-01",
  "titulo": "Linguagem sedutora/transformação que induz percepção de garantia",
  "rotulo": "promessa de transformação",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, § 2º, alínea f",
  "confirmado": true,
  "explicacao": "Promessas de transformação ('corpo dos sonhos', 'resultado incrível') criam expectativa de resultado.",
  "descricao": "Usar de forma abusiva, enganosa ou sedutora representações visuais e informações que induzam à percepção de garantia de resultados é sensacionalismo.",
  "sugestao": "\"A lipoaspiração remove gordura localizada; não substitui hábitos saudáveis. Indicações e limites são discutidos na consulta.\"",
  "padroes": [
   "\\bcorpo dos sonhos\\b",
   "\\brosto (perfeito|dos sonhos)\\b",
   "\\bfique (perfeit[oa]|linda|lindo|jovem|maravilhos[oa])\\b",
   "\\btransforma[cç][aã]o (total|completa|radical|garantida|incr[ií]vel)\\b",
   "\\bnova (vers[aã]o de voc[eê]|mulher|pessoa)\\b",
   "\\bpele de (beb[eê]|porcelana)\\b",
   "\\bresultado(s)? (incr[ií]ve(l|is)|surpreendentes?|impressionantes?|perfeitos?)\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Conquiste o corpo dos sonhos com nossa lipo HD!",
   "Transformação total: veja que resultado incrível!"
  ],
  "fonte": "https://www.cremesp.org.br/?siteAcao=PesquisaLegislacao&dif=a&ficha=1&id=20730"
 },
 {
  "id": "CFM2336-TEC-01",
  "titulo": "Divulgação de método/técnica não reconhecida pelo CFM",
  "rotulo": "técnica não reconhecida",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023; CEM art. 113",
  "artigo": "Res. 2.336, art. 11, VII e § 2º, alínea b; CEM art. 113",
  "confirmado": true,
  "explicacao": "Essa técnica não é reconhecida pelo CFM e não pode ser divulgada ao público.",
  "descricao": "Veda-se divulgar método ou técnica não reconhecido pelo CFM e usar canais de comunicação para divulgar abordagem clínica/terapêutica sem reconhecimento do CFM (§ 2º, b). CEM art. 113 veda divulgar, fora do meio científico, tratamento cujo valor não esteja reconhecido cientificamente. A LISTA de termos é heurística baseada em controvérsias conhecidas (ozonioterapia, terapias antienvelhecimento, implantes hormonais estéticos, soroterapia); o status regulatório de cada uma deve ser conferido nas resoluções/pareceres CFM específicos — não verificado nesta pesquisa.",
  "sugestao": "Não divulgue ao público técnicas sem reconhecimento do CFM. Divulgue apenas procedimentos reconhecidos, com indicação e evidência.",
  "padroes": [
   "\\bozonioterapia\\b",
   "\\bsoroterapia\\b",
   "\\bsoro da (beleza|imunidade|vitalidade)\\b",
   "\\bchip da beleza\\b",
   "\\bimplante(s)? (hormona(l|is)|de gestrinona)\\b",
   "\\bgestrinona\\b",
   "\\bmedicina (anti-?aging|antienvelhecimento|ortomolecular)\\b",
   "\\bhorm[oô]nios? bioid[eê]ntic",
   "\\bterapia (com|de) c[eé]lulas-?tronco\\b",
   "\\bdetox (de|do) (f[ií]gado|organismo)\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Agende sua sessão de ozonioterapia para dores.",
   "Implante hormonal (chip da beleza) para definição muscular.",
   "Soroterapia para aumentar sua imunidade."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://portal.cfm.org.br/images/PDF/cem2019.pdf",
  "gravidade_original": "alerta",
  "ajuste_jalecon": "Gravidade elevada de 'alerta' para 'bloqueia': divulgar técnica não reconhecida pelo CFM segue vedado (orientação da coordenação jurídica do projeto)."
 },
 {
  "id": "CFM2336-EQP-01",
  "titulo": "Equipamento: capacidade privilegiada ou sem registro na Anvisa",
  "rotulo": "equipamento apresentado como superior",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 9º, II (permissão) e Art. 11, III (vedação, conforme manual CRM-MA)",
  "confirmado": true,
  "explicacao": "Apresentar um aparelho como único ou superior, ou sem registro na Anvisa, é vedado.",
  "descricao": "É permitido divulgar aparelhos e tecnologias dentro das informações aprovadas pela Anvisa (art. 9º, II). É vedado divulgar equipamento/medicamento sem registro na Anvisa (art. 11, III segundo o manual do CRM-MA) e atribuir capacidade privilegiada ao aparelho (fonte secundária).",
  "sugestao": "\"Utilizamos o laser X (registro Anvisa nº ...), indicado para ... conforme bula/manual aprovado.\"",
  "padroes": [
   "\\b(aparelho|equipamento|laser|tecnologia|m[aá]quina) (exclusiv[oa]|[uú]nic[oa]|mais moderno|mais avan[cç]ado|revolucion[aá]ri[oa]|de [uú]ltima gera[cç][aã]o que garante)",
   "\\b[uú]nic[oa] (aparelho|equipamento|laser|tecnologia)\\b",
   "\\bimportad[oa] (e )?(ainda )?sem registro\\b",
   "\\b(ainda )?n[aã]o (chegou|foi aprovad[oa]|est[aá] aprovad[oa]) (ao|no|pela) (brasil|anvisa)\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Laser exclusivo, o mais moderno do mundo, resultados em 1 sessão.",
   "Trouxemos dos EUA a tecnologia que ainda não chegou ao Brasil."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://crmma.org.br/wp-content/uploads/2024/03/Manual-de-publicidade-completo-1.pdf"
 },
 {
  "id": "CFM2336-AD-01",
  "titulo": "\"Antes e depois\" isolado, sem texto educativo, resultados insatisfatórios e complicações",
  "rotulo": "antes e depois sem finalidade educativa",
  "tipo": "condicional",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023; Manual de Publicidade Médica (CODAME/CFM), cap. 12",
  "artigo": "Art. 14, II, alíneas a e b",
  "confirmado": true,
  "explicacao": "Antes e depois só é permitido com finalidade educativa: texto sobre indicações e limites, conjunto com resultados bons e ruins, sem identificar o paciente e sem edição.",
  "descricao": "Imagens de pacientes só com finalidade educativa. Todo uso deve vir com texto educativo (indicações terapêuticas, fatores que influenciam resultados, complicações descritas na literatura) — alínea a. Antes e depois deve ser apresentado como conjunto de imagens com indicações, resultados satisfatórios e insatisfatórios e complicações — alínea b. O Manual (cap. 12) exige: apresentar a condição; antes de pelo menos 4 pacientes diferentes; depois de pelo menos 4 pacientes; descrição de resultados insatisfatórios e complicações; em vídeo, mínimo de 2 s por quadro. Post de antes e depois isolado não é permitido.",
  "sugestao": "Monte o conjunto exigido: condição tratada + antes/depois de ≥4 pacientes não identificados + texto sobre indicações, fatores que influenciam o resultado, resultados insatisfatórios e complicações.",
  "padroes": [
   "\\bantes e depois\\b",
   "\\bantes\\s?(x|/|vs\\.?|e)\\s?depois\\b",
   "#antesedepois",
   "\\bresultado (da|do|de uma|de um) (paciente|cliente)\\b",
   "\\bolha (esse|que|s[oó] esse) resultado\\b",
   "\\bresultado real\\b"
  ],
  "exceto_se": [
   "complica[cç]",
   "resultados? insatisfat[oó]ri",
   "indica[cç][oõ]es"
  ],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "manual",
  "exemplos_violacao": [
   "Antes e depois da minha paciente após 1 sessão de preenchimento 😍",
   "Olha esse resultado! #antesedepois"
  ],
  "fonte": "https://publicidademedica.cfm.org.br/manual/resolucao-comentada/capitulo-9 ; https://publicidademedica.cfm.org.br/manual/aplicacao-pratica/capitulo-12 ; https://portal.cfm.org.br/noticias/resolucao-libera-fotos-como-antes-e-depois/"
 },
 {
  "id": "CFM2336-IMG-01",
  "titulo": "Imagem de resultado editada/manipulada",
  "rotulo": "imagem editada",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 14, II, alínea f",
  "confirmado": true,
  "explicacao": "Imagens de resultado não podem ter filtro nem retoque.",
  "descricao": "É proibida qualquer edição, manipulação ou melhoramento das imagens de resultados. O texto não detecta a imagem em si; a regra captura menções e pedidos de edição no briefing/legenda.",
  "sugestao": "Use fotos originais, mesma luz/ângulo/distância no antes e no depois, sem filtros ou retoques.",
  "padroes": [
   "\\b(com|usei|aplicar|aplique|coloque|passe) (um )?filtro\\b",
   "\\bphotoshop\\b",
   "\\bfacetune\\b",
   "\\bretoc(ad[oa]|ar|ue)\\b",
   "\\b(melhor(ar|e)|clarear|suavizar) a (foto|imagem)\\b",
   "\\bimagem editada\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Aplique um filtro leve na foto do depois para ficar mais bonita.",
   "Foto do resultado retocada no Facetune."
  ],
  "fonte": "https://publicidademedica.cfm.org.br/resolucao/o-que-muda ; https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-IMG-02",
  "titulo": "Identificação do paciente em publicação",
  "rotulo": "paciente identificável",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023; CEM art. 75; LGPD",
  "artigo": "Res. 2.336, art. 14, II, alínea e; CEM art. 75; LGPD arts. 5º, II e 11",
  "confirmado": true,
  "explicacao": "O paciente não pode ser identificado (nome, @, rosto) na divulgação. Sigilo e LGPD valem também nas redes.",
  "descricao": "Veda-se o uso de imagens que identifiquem o paciente (ou terceiros). CEM art. 75: vedado fazer referência a casos clínicos identificáveis ou exibir pacientes/imagens que os tornem reconhecíveis em anúncios, mesmo com autorização. Uso de imagem exige consentimento expresso e escrito com finalidade, abrangência e ausência de contrapartida (manual comentado CFM). Dado de saúde é dado pessoal sensível (LGPD).",
  "sugestao": "Remova nome, @, rosto ou tatuagens identificáveis; use \"paciente do sexo feminino, 30-40 anos\" e garanta termo de consentimento específico.",
  "padroes": [
   "\\b(minha|meu|nossa|nosso) paciente,? (?!(que|de|da|do|com|fez|ficou|chegou|tinha|est[aá]|n[aã]o|j[aá]|se|e)\\b)[a-zà-ú]{3,},? (\\d{2} anos|fez|ficou|realizou|chegou)",
   "\\bpaciente @[a-z0-9_.]+",
   "\\bobrigad[oa]( pela confian[cç]a)?,? @[a-z0-9_.]+",
   "\\bmarque (a|o) paciente\\b",
   "\\b(a|o) paciente [a-zà-ú]+,? \\d{2} anos\\b",
   "\\bpaciente famos[oa]\\b",
   "\\bcliente vip\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Minha paciente Juliana, 34 anos, fez a rinoplastia...",
   "Obrigada pela confiança, @maria.silva!"
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://transparencia.cfm.org.br/codigo-de-etica-medica/ ; https://sistemas.cfm.org.br/normas/arquivos/despachos/BR/2019/143_2019.pdf"
 },
 {
  "id": "CFM2336-LIVE-01",
  "titulo": "Exibição de consulta ou procedimento em andamento / tempo real",
  "rotulo": "procedimento ao vivo",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, VIII (numeração por fonte secundária); Art. 14, II, alínea d (captura por terceiros só em partos)",
  "confirmado": false,
  "explicacao": "Mostrar consulta ou procedimento em andamento é vedado.",
  "descricao": "Fontes secundárias indicam vedação de expor consultas e procedimentos em andamento/tempo real, mesmo com autorização do paciente, salvo eventos científicos. A captura de imagens por equipes externas só é autorizada em partos (art. 14, II, d).",
  "sugestao": "Use ilustração, animação ou explicação em vídeo fora do ato médico; restrinja demonstração de técnica a ambiente médico/científico.",
  "padroes": [
   "\\b(ao vivo|live|em tempo real) (do|da|de) (centro cir[uú]rgico|procedimento|cirurgia|consulta|aplica[cç][aã]o)",
   "\\bacompanhe (a|o) (cirurgia|procedimento|consulta) (ao vivo|em tempo real)",
   "\\bbastidores (da|do) (cirurgia|centro cir[uú]rgico)\\b",
   "\\bfilmei (a|o) (cirurgia|procedimento)\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Live da cirurgia hoje às 15h, acompanhe!",
   "Bastidores do centro cirúrgico: veja a lipo acontecendo."
  ],
  "fonte": "https://www.gestaods.com.br/blog/o-que-nao-e-permitido-fazer-no-marketing-medico/ ; https://publicidademedica.cfm.org.br/manual/resolucao-comentada/capitulo-9"
 },
 {
  "id": "CFM2336-DEP-01",
  "titulo": "Depoimentos e repostagem de elogios de pacientes",
  "rotulo": "depoimento de paciente",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 1º, parágrafo sobre repostagens (número do parágrafo não confirmado)",
  "confirmado": false,
  "explicacao": "Depoimentos e elogios de pacientes só podem ser repostados de forma eventual, sóbria e sem identificar ninguém. Sobre resultado, não.",
  "descricao": "Publicações de terceiros/pacientes compartilhadas ou repostadas pelo médico passam a ser consideradas publicações do próprio médico. O portal do CFM admite repostagem desde que não reiterada e com depoimento sóbrio, sem adjetivos de superioridade nem promessa de resultado. Um limite numérico ('2 vezes por semestre') circula em blogs mas NÃO foi confirmado.",
  "sugestao": "Evite repostar elogios com superlativos ou promessas; se repostar, que seja eventual, sóbrio e sem identificar o paciente.",
  "padroes": [
   "\\bdepoimento\\b",
   "\\bolha o que (a|o|minha|meu) (paciente|cliente) (disse|falou|escreveu)\\b",
   "\\bfeedback (de|da|do) (paciente|cliente)\\b",
   "\\bmudou (a|minha) vida\\b",
   "\\bmelhor (m[eé]dic[oa]|doutor[a]?) (que j[aá]|do mundo)\\b",
   "\\bavalia[cç][oõ]es? 5 estrelas\\b",
   "\\bpacientes satisfeitos\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Olha o que minha paciente disse: 'a melhor médica do mundo, mudou minha vida!'",
   "Mais um feedback de paciente satisfeita ❤️"
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://publicidademedica.cfm.org.br/resolucao/o-que-muda"
 },
 {
  "id": "CFM2336-PRECO-01",
  "titulo": "Preço de consulta e formas de pagamento (permitido)",
  "rotulo": "preço da consulta (permitido)",
  "tipo": "orientacao",
  "gravidade": "orienta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 9º, VI",
  "confirmado": true,
  "explicacao": "Divulgar o valor da consulta e as formas de pagamento é permitido. Só não pode virar pacote nem vir com brinde.",
  "descricao": "É permitido divulgar o valor da consulta e os meios e formas de pagamento, sem caracterizar pacote ou consórcio. Regra informativa: confirma que menções de preço de CONSULTA são lícitas e verifica se não há pacote.",
  "sugestao": "Formato seguro: \"Consulta: R$ 400. Pagamento em Pix ou cartão.\" Sem 'pacote', brinde ou condição vinculada a outro serviço.",
  "padroes": [
   "\\bvalor da consulta\\b",
   "\\bconsulta (por|a partir de|:)? ?r\\$ ?\\d",
   "\\b(aceitamos|formas de pagamento|parcelamos|parcele em|pix|cart[aã]o de cr[eé]dito)\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "manual",
  "exemplos_violacao": [],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://www.em.com.br/app/colunistas/renato-assis/2023/09/12/interna-renato-assis,1560770/resolucao-cfm-2-336-2023-a-nova-publicidade-medica.shtml"
 },
 {
  "id": "CFM2336-PRECO-02",
  "titulo": "Preço de procedimento/cirurgia divulgado",
  "rotulo": "preço de procedimento",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 9º, VII (interpretação divergente)",
  "confirmado": false,
  "explicacao": "Divulgar preço de procedimento tem interpretação divergente entre os conselhos. É mais seguro informar o valor na consulta.",
  "descricao": "O art. 9º, VII permite INFORMAR QUE o valor de procedimentos particulares poderá ser acordado previamente entre as partes. Há divergência entre comentaristas: uns entendem que divulgar preço de tratamentos e cirurgias continua vedado; outros que preços de procedimentos podem ser informados. Por cautela, o Guardião alerta.",
  "sugestao": "\"O valor do procedimento é definido após avaliação e pode ser acordado previamente entre médico e paciente.\"",
  "padroes": [
   "\\b(cirurgia|procedimento|aplica[cç][aã]o|sess[aã]o|preenchimento|botox|toxina|lipo\\w*|rinoplastia|harmoniza[cç][aã]o|bioestimulador|laser|peeling)\\b[^.\\n]{0,40}\\br\\$ ?\\d",
   "\\br\\$ ?\\d[\\d.,]*[^.\\n]{0,40}\\b(cirurgia|procedimento|aplica[cç][aã]o|sess[aã]o|preenchimento|botox|toxina|lipo\\w*|rinoplastia|harmoniza[cç][aã]o|bioestimulador)\\b",
   "\\bpor apenas r\\$"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Botox por apenas R$ 790!",
   "Rinoplastia a partir de R$ 12.000 em 10x."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://www.em.com.br/app/colunistas/renato-assis/2023/09/12/interna-renato-assis,1560770/resolucao-cfm-2-336-2023-a-nova-publicidade-medica.shtml"
 },
 {
  "id": "CFM2336-DESC-01",
  "titulo": "Descontos e campanhas promocionais (permitidos com limites)",
  "rotulo": "desconto ou promoção",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 9º, VIII",
  "confirmado": true,
  "explicacao": "Descontos são permitidos com limites: de forma sóbria, sem urgência, sem brinde e sem condicionar a outro serviço.",
  "descricao": "É permitido anunciar abatimentos e descontos em campanhas promocionais, vedadas a venda casada, a premiação e outros mecanismos que desvirtuem a finalidade da medicina como atividade-meio (Manual CODAME). CRMs (ex.: Cremers) apontam 'mercantilização' (valores, descontos) entre as denúncias mais frequentes — por isso alerta, não bloqueio.",
  "sugestao": "Se usar desconto, apresente-o de forma informativa e sóbria, sem urgência, sem brinde, sem condicionar a outro serviço e sem banalizar o ato médico.",
  "padroes": [
   "\\bdesconto\\b",
   "\\bpromo[cç][aã]o\\b",
   "\\bpromocional\\b",
   "\\b\\d{1,2}\\s?% ?(off|de desconto)\\b",
   "\\bblack friday\\b",
   "\\bcondi[cç][aã]o especial\\b",
   "\\boferta\\b",
   "\\bimperd[ií]vel\\b",
   "\\bliquida[cç][aã]o\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [
   "promo[cç][aã]o (?:da|de) sa[uú]de"
  ],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Black Friday: 40% OFF em bioestimulador – imperdível!",
   "Promoção de harmonização facial só este mês."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://cremers.org.br/cremers-recebeu-94-denuncias-de-publicidade-medica-em-2022/"
 },
 {
  "id": "CFM2336-CASADA-01",
  "titulo": "Venda casada, brinde, combo ou pacote",
  "rotulo": "venda casada ou brinde",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 9º, VIII (parte final: vedada venda casada/premiação); Art. 9º, VI (não caracterizar pacote)",
  "confirmado": true,
  "explicacao": "Brinde, combo ou 'faça X e ganhe Y' é venda casada, vedada na publicidade médica.",
  "descricao": "Promoções não podem envolver venda casada, premiação ou mecanismo que desvirtue a medicina. Exemplos do próprio CFM: \"consulte e ganhe o exame\", \"faça o procedimento e ganhe um prêmio\". A divulgação do preço da consulta não pode caracterizar pacote.",
  "sugestao": "Ofereça cada serviço isoladamente, com informação clara; não vincule brindes ou outros serviços.",
  "padroes": [
   "\\bganhe (um|uma|o|a|\\d)",
   "\\bde brinde\\b",
   "\\bbrinde\\b",
   "\\bcombo\\b",
   "\\bpacote (de|com|promocional|completo|\\d+)\\b",
   "\\bleve \\d+,? pague \\d+\\b",
   "\\bna compra d[aeo]\\b",
   "\\b(consulte|fa[cç]a|agende)[^.\\n]{0,40} e ganhe\\b",
   "\\bcashback\\b",
   "\\b(sess[aã]o|aplica[cç][aã]o|consulta) (extra )?gr[aá]tis na\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Faça o preenchimento e ganhe uma limpeza de pele!",
   "Pacote 3 sessões de laser + consulta.",
   "Agende sua consulta e ganhe o exame de bioimpedância."
  ],
  "fonte": "https://www.ibes.med.br/perguntas-sobre-a-resolucao-cfm-2-336-2023-publicidade-e-propaganda-medica-ja-em-vigor/ ; https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-SORT-01",
  "titulo": "Sorteios e premiações de consultas, cirurgias ou tratamentos",
  "rotulo": "sorteio",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 9º, VIII (vedada premiação)",
  "confirmado": true,
  "explicacao": "Sortear consultas, procedimentos ou tratamentos é proibido.",
  "descricao": "Premiações e sorteios de cirurgias e tratamentos continuam vedados (relator e comentaristas; vedação de 'premiação' no texto do art. 9º, VIII).",
  "sugestao": "Não realize sorteios envolvendo atos médicos. Para engajamento, use conteúdo educativo.",
  "padroes": [
   "\\bsorteio\\b",
   "\\bsorte(ar|ando|aremos|amos)\\b",
   "\\bconcorra\\b",
   "\\bgiveaway\\b",
   "\\bpromo[cç][aã]o cultural\\b",
   "\\bvale-?(consulta|procedimento|presente)\\b",
   "\\bganhe uma (consulta|cirurgia|sess[aã]o|aplica[cç][aã]o)\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Sorteio! Concorra a uma sessão de botox: siga, curta e marque 3 amigas.",
   "Giveaway de uma rinoplastia."
  ],
  "fonte": "https://www.em.com.br/app/colunistas/renato-assis/2023/09/12/interna-renato-assis,1560770/resolucao-cfm-2-336-2023-a-nova-publicidade-medica.shtml ; https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-CONS-01",
  "titulo": "Oferta de serviços por consórcio e similares",
  "rotulo": "consórcio ou assinatura",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, X",
  "confirmado": true,
  "explicacao": "Oferecer atendimento por consórcio ou assinatura é vedado.",
  "descricao": "É vedado oferecer serviços por meio de consórcio e similares.",
  "sugestao": "Informe apenas formas de pagamento comuns (Pix, cartão, parcelamento) sem estrutura de consórcio/assinatura.",
  "padroes": [
   "\\bcons[oó]rcio\\b",
   "\\bcarta de cr[eé]dito\\b",
   "\\bclube de (assinatura|benef[ií]cios) (de|para) (procedimentos|botox|est[eé]tica)\\b",
   "\\bassinatura mensal de (botox|procedimentos|sess[oõ]es)\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Consórcio de cirurgia plástica: realize seu sonho!",
   "Assinatura mensal de botox por R$ 199."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-GRATIS-01",
  "titulo": "Consulta/avaliação gratuita como chamariz",
  "rotulo": "consulta grátis como chamariz",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "artigo não confirmado",
  "confirmado": false,
  "explicacao": "Consulta grátis usada para atrair pacientes pode ser vista como angariação de clientela.",
  "descricao": "Não foi localizada menção expressa a 'consulta gratuita' no texto da Res. 2.336/2023 nesta pesquisa. A prática tende a ser enquadrada como mercantilização/captação (venda casada quando vinculada a procedimento; sensacionalismo/autopromoção). Recomenda-se tratar como alerta até confirmação no texto integral ou parecer CRM/CFM.",
  "sugestao": "Divulgue o valor real da consulta. Se houver atendimento social/gratuito, descreva-o sem vínculo com venda de procedimento.",
  "padroes": [
   "\\b(primeira )?consulta gr[aá]tis\\b",
   "\\bconsulta gratuita\\b",
   "\\bavalia[cç][aã]o (gr[aá]tis|gratuita|sem custo)\\b",
   "\\bsem custo (algum|nenhum)?\\b",
   "\\bde gra[cç]a\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [
   [
    "^(?:primeira )?consulta (?:gr[aá]tis|gratuita)$",
    "=FRASE=O valor da consulta é informado no agendamento."
   ],
   [
    "^avalia[cç][aã]o (?:gr[aá]tis|gratuita|sem custo)$",
    "=FRASE=O valor da avaliação é informado no agendamento."
   ]
  ],
  "correcao": "frase",
  "exemplos_violacao": [
   "Primeira consulta grátis para novos pacientes!",
   "Avaliação gratuita para lipo – vagas limitadas."
  ],
  "fonte": "https://publicidademedica.cfm.org.br/resolucao/o-que-muda"
 },
 {
  "id": "CFM2336-URG-01",
  "titulo": "Urgência e escassez artificiais",
  "rotulo": "urgência artificial",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023; CDC art. 37",
  "artigo": "artigo não confirmado (enquadramento provável: art. 11, XVI — sensacionalismo/autopromoção; CDC art. 37, § 1º se a escassez for falsa)",
  "confirmado": false,
  "explicacao": "Escassez e urgência artificiais ('últimas vagas', 'só hoje') pressionam o paciente.",
  "descricao": "Gatilhos de escassez/urgência ('últimas vagas', 'só hoje') reforçam caráter mercantil e podem ser enganosos se não forem verdadeiros. Não há inciso expresso confirmado.",
  "sugestao": "Informe disponibilidade de agenda de forma neutra: \"Agenda aberta para outubro.\"",
  "padroes": [
   "\\b[uú]ltimas vagas\\b",
   "\\bs[oó] (hoje|at[eé] (amanh[aã]|domingo|sexta))\\b",
   "\\bcorra\\b",
   "\\bvagas limitadas\\b",
   "\\bpor tempo limitado\\b",
   "\\bn[aã]o perca\\b",
   "\\b[uú]ltima chance\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [
   "\\bcorra (?:com|no|na|em|devagar|sem|pelo|pela|mais|menos|ao|de)\\b",
   "\\bse (?:voc[eê] )?corr"
  ],
  "aplica_se": [],
  "trocas": [
   [
    "^[uú]ltimas vagas$",
    "agenda aberta"
   ],
   [
    "^vagas limitadas$",
    "agenda aberta"
   ]
  ],
  "correcao": "frase",
  "exemplos_violacao": [
   "Últimas vagas para o mutirão de lipo – corra!",
   "Só hoje: condição especial em preenchimento labial."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-DIAG-01",
  "titulo": "Oferta de diagnóstico/consulta por mídia social ou meio de massa",
  "rotulo": "diagnóstico pela rede social",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023; Decreto-Lei 4.113/1942",
  "artigo": "Res. 2.336, art. 9º, XII (conteúdo educativo não pode levar a diagnóstico/prognóstico — numeração por fonte secundária); DL 4.113/1942, art. 1º, IV",
  "confirmado": false,
  "explicacao": "Diagnóstico ou orientação de tratamento por rede social não é permitido. Convide para uma consulta.",
  "descricao": "O conteúdo educativo não pode ofertar consulta nem informações que levem a diagnóstico, procedimento ou prognóstico. O DL 4.113/1942, art. 1º, IV, veda anunciar consultas por correspondência, imprensa, rádio ou meios análogos. (Telemedicina regular segue norma própria e não é alvo desta regra.)",
  "sugestao": "\"Sinais como X merecem avaliação médica. Para atendimento, agende uma consulta (presencial ou por telemedicina).\"",
  "padroes": [
   "\\b(mande|manda|envie|envia) (a |sua |seu |uma )*(foto|exame|v[ií]deo)[^.\\n]{0,40}(direct|dm|whats|inbox)",
   "\\bdiagn[oó]stico (pelo|por|no) (direct|whats\\w*|dm|instagram|inbox)\\b",
   "\\bdescubra se voc[eê] tem\\b",
   "\\bfa[cç]a (o|nosso) (teste|quiz) e (saiba|descubra) se\\b",
   "\\bcomente (seu|seus) sintomas?\\b",
   "\\b(te digo|eu digo|te falo) (o que (voc[eê] tem|[eé])|qual (o )?tratamento)"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Manda a foto da sua mancha no direct que eu te digo o que é.",
   "Faça o quiz e descubra se você tem hipotireoidismo."
  ],
  "fonte": "https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf ; https://portal.cfm.org.br/leis/lei-4113-1942-obs-decreto-lei-4-113-regula-a-propaganda-de-medicos-cirurgioes-dentistas-parteiras-massagistas-enfermeiros-de-casas-de-saude-e-de-estabelecimentos-congeneres-e-a-de-preparados/"
 },
 {
  "id": "CFM2336-ESTAT-01",
  "titulo": "Dados estatísticos/científicos sem fonte ou manipulados",
  "rotulo": "dado sem fonte",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023; CDC art. 37, § 1º",
  "artigo": "Res. 2.336, art. 11, § 2º, alínea c; art. 11, VI e XVI (conteúdo inverídico)",
  "confirmado": true,
  "explicacao": "Números e estudos sem fonte podem enganar. Cite a fonte ou retire o número.",
  "descricao": "É sensacionalismo adulterar e/ou manipular dado estatístico e científico para benefício individual ou institucional. Afirmações de eficácia percentual ou 'comprovado cientificamente' exigem fonte verificável.",
  "sugestao": "Cite a fonte (autor, revista, ano) e o contexto do dado, sem extrapolar para promessa individual; ou remova o número.",
  "padroes": [
   "\\bcomprovad[oa] cientificamente\\b",
   "\\bestudos (comprovam|provam|mostram que)\\b",
   "\\bcientificamente provad[oa]\\b",
   "\\b\\d{2,3}\\s?% (dos|das) (pacientes|casos|mulheres|homens)\\b",
   "\\b\\d{2,3}\\s?% de (sucesso|efic[aá]cia|melhora)\\b",
   "\\baprovad[oa] pela (anvisa|fda) para\\b"
  ],
  "exceto_se": [
   "\\bfonte\\s?:",
   "\\bsegundo (?:a |o |dados)",
   "\\bde acordo com\\b"
  ],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "98% de sucesso comprovado cientificamente!",
   "Estudos comprovam: elimina 90% da gordura."
  ],
  "fonte": "https://www.cremesp.org.br/?siteAcao=PesquisaLegislacao&dif=a&ficha=1&id=20730 ; https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "CFM2336-ENSINO-01",
  "titulo": "Ensinar ao público leigo técnica restrita ao ambiente médico",
  "rotulo": "ensino de técnica ao leigo",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023",
  "artigo": "Art. 11, § 2º, alínea d; Art. 14, II, alínea b (ensino de técnica restrito ao meio médico)",
  "confirmado": true,
  "explicacao": "Ensinar técnica médica ao público leigo é vedado.",
  "descricao": "É sensacionalismo apresentar em público técnica, abordagem ou método científico que deva ser limitado ao ambiente médico; o ensino de técnicas deve ficar restrito ao meio médico. Cursos para leigos são permitidos apenas com caráter educativo (não para ensinar atos privativos).",
  "sugestao": "Ensine técnica apenas a médicos (com CRM) em ambiente científico; ao público, explique indicações e cuidados.",
  "padroes": [
   "\\baprenda a aplicar\\b",
   "\\btutorial de (aplica[cç][aã]o|preenchimento|botox|toxina|sutura)\\b",
   "\\bfa[cç]a (voc[eê] mesm[oa]|em casa) (sua|seu|a) (aplica[cç][aã]o|preenchimento|peeling)\\b",
   "\\bcurso de (botox|toxina|preenchimento|harmoniza[cç][aã]o|fios de pdo)[^.\\n]{0,30}(para (todos|leigos|esteticistas|n[aã]o m[eé]dicos)|sem forma[cç][aã]o)"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Aprenda a aplicar botox em casa com meu tutorial.",
   "Curso de preenchimento labial para não médicos."
  ],
  "fonte": "https://www.cremesp.org.br/?siteAcao=PesquisaLegislacao&dif=a&ficha=1&id=20730 ; https://publicidademedica.cfm.org.br/manual/resolucao-comentada/capitulo-9"
 },
 {
  "id": "CEM-COM-01",
  "titulo": "Participar de anúncio de empresa comercial / publicidade de produto",
  "rotulo": "propaganda de produto",
  "tipo": "presenca_proibida",
  "gravidade": "bloqueia",
  "norma": "Código de Ética Médica (Res. CFM 2.217/2018); Resolução CFM nº 2.336/2023",
  "artigo": "CEM art. 115; Res. 2.336, art. 11, IV",
  "confirmado": true,
  "explicacao": "Médico não pode fazer propaganda de produto nem participar de anúncio de empresa comercial (cupom, publi, link de compra).",
  "descricao": "CEM art. 115 veda participar de anúncios de empresas comerciais, qualquer que seja sua natureza, valendo-se da profissão. Res. 2.336, art. 11, IV veda participar de publicidade de medicamento, insumo, equipamento ou alimento induzindo à garantia de resultados. Fontes secundárias citam ainda vedação de anunciar, no consultório, empresas de que o médico seja investidor (art. 11, XIV/XV — redação não confirmada).",
  "sugestao": "Fale do princípio ativo/conduta sem marca, sem cupom e sem vínculo comercial. Médico não deve atuar como garoto-propaganda.",
  "padroes": [
   "#publi\\b",
   "#publipost\\b",
   "#parceria(paga)?\\b",
   "\\bcupom\\b",
   "\\bc[oó]digo (de desconto|promocional)\\b",
   "\\buse (meu|o) c[oó]digo\\b",
   "\\blink (na bio )?para comprar\\b",
   "\\bcompre (j[aá]|agora|o meu|o produto)\\b",
   "\\bminha (marca|linha) de (suplementos?|cosm[eé]ticos?|skincare)\\b",
   "\\brecebido de presente (da|do)\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Use meu cupom DRA10 para comprar o colágeno da marca X.",
   "#publi Esse sérum é o que eu recomendo para todas as minhas pacientes."
  ],
  "fonte": "https://portal.cfm.org.br/images/PDF/cem2019.pdf ; https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2023/2336_2023.pdf"
 },
 {
  "id": "LEI9294-MED-01",
  "titulo": "Propaganda ao público de medicamento de venda sob prescrição (por nome/marca)",
  "rotulo": "medicamento por marca",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Lei nº 9.294/1996; RDC Anvisa nº 96/2008 (validade parcialmente afastada pelo STJ no REsp 2.035.645)",
  "artigo": "artigo não confirmado nesta pesquisa (Lei 9.294/1996, art. 7º — verificar)",
  "confirmado": false,
  "explicacao": "Medicamento de venda sob prescrição não pode ser anunciado ao público pelo nome comercial. Use o nome do tratamento.",
  "descricao": "Medicamentos de venda sob prescrição só podem ser divulgados em meios dirigidos a profissionais (regra geral da Lei 9.294/1996 e RDC 96/2008; o STJ considerou ilegais disposições da RDC que extrapolam a lei, em processo específico). Citar marca de medicamento em post ao público é arriscado também pelo CEM art. 115. Lista de termos ilustrativa.",
  "sugestao": "Use o nome do procedimento/classe sem marca (\"aplicação de toxina botulínica\"; \"tratamento medicamentoso da obesidade, quando indicado\") e evite incentivar uso.",
  "padroes": [
   "\\b(ozempic|wegovy|mounjaro|saxenda|zepbound|victoza|rybelsus)\\b",
   "\\b(semaglutida|tirzepatida|liraglutida)\\b",
   "\\b(botox|dysport|xeomin)\\b",
   "\\b(roacutan|isotretino[ií]na)\\b",
   "\\b(emagre[cç]a|seque) com (ozempic|mounjaro|semaglutida|tirzepatida|a caneta)\\b",
   "\\bcaneta (do|para) emagrec"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [
   [
    "^(?:botox|dysport|xeomin)$",
    "toxina botulínica"
   ],
   [
    "^(?:ozempic|wegovy|mounjaro|saxenda|zepbound|victoza|rybelsus|semaglutida|tirzepatida|liraglutida)$",
    "tratamento medicamentoso, quando indicado"
   ],
   [
    "^(?:roacutan|isotretino[ií]na)$",
    "tratamento oral, quando indicado"
   ]
  ],
  "correcao": "frase",
  "exemplos_violacao": [
   "Emagreça com Mounjaro: agende sua consulta!",
   "Aplicação de Botox® com desconto."
  ],
  "fonte": "https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2024/26082024-Para-Primeira-Turma--Anvisa-extrapolou-sua-competencia-ao-criar-regras-sobre-propaganda-de-remedios.aspx ; https://bvsms.saude.gov.br/bvs/saudelegis/anvisa/2008/rdc0096_17_12_2008.html"
 },
 {
  "id": "LGPD-DADO-01",
  "titulo": "Dados de saúde de paciente em conteúdo publicitário",
  "rotulo": "dado de saúde de paciente",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "LGPD (Lei nº 13.709/2018); CEM art. 75",
  "artigo": "LGPD art. 5º, II e art. 11 (texto legal não re-verificado on-line nesta pesquisa); CEM art. 75",
  "confirmado": false,
  "explicacao": "Dados de saúde de pacientes são sensíveis pela LGPD e protegidos pelo sigilo médico. Não publique.",
  "descricao": "Dado referente à saúde é dado pessoal sensível; seu tratamento depende de base legal específica (em publicidade, na prática, consentimento específico e destacado). Combinado ao sigilo do CEM art. 75, qualquer dado clínico associado a paciente identificável deve ser bloqueado.",
  "sugestao": "Anonimize por completo; não publique documentos clínicos; obtenha termo de consentimento específico para uso de imagem.",
  "padroes": [
   "\\bprontu[aá]rio\\b",
   "\\b(exame|laudo|resultado de exame) d[ao] paciente\\b",
   "\\bcpf\\b",
   "\\b\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}\\b",
   "\\bdiagnosticad[oa] com [a-zà-ú]+ (a|o) paciente [a-zà-ú]+\\b",
   "\\b(hiv|soropositiv[oa]|c[aâ]ncer|depress[aã]o) d[ao] paciente [a-zà-ú]+\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [
   "(?:traga|leve|documento|rg|carteirinha)[^.\\n]{0,25}\\bcpf\\b"
  ],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Olha o exame da paciente Maria antes do tratamento.",
   "Print do prontuário mostrando a evolução."
  ],
  "fonte": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm ; https://transparencia.cfm.org.br/codigo-de-etica-medica/"
 },
 {
  "id": "META-ATRIB-01",
  "titulo": "Afirmar ou insinuar condição de saúde do leitor (atributos pessoais)",
  "rotulo": "fala da saúde de quem lê",
  "tipo": "presenca_proibida",
  "gravidade": "orienta",
  "norma": "Meta – Padrões de Publicidade: Violações de privacidade e atributos pessoais",
  "artigo": "Política de anúncios Meta (não é norma jurídica)",
  "confirmado": true,
  "explicacao": "As plataformas de anúncio recusam textos que afirmam algo sobre a saúde de quem lê ('você sofre de...?'). Fale do serviço, não do leitor.",
  "descricao": "Anúncios pagos no Facebook/Instagram não podem afirmar ou insinuar atributos pessoais do público, incluindo saúde física ou mental. Afeta impulsionamento/ads, não posts orgânicos. Sinalizar como risco de reprovação do anúncio.",
  "sugestao": "Fale do serviço, não do leitor: \"Tratamento da ansiedade: conheça as opções.\"",
  "padroes": [
   "\\bvoc[eê] (tem|sofre de|est[aá] com|convive com) (diabetes|depress[aã]o|ansiedade|obesidade|calv[ií]cie|celulite|flacidez|disfun[cç][aã]o|enxaqueca|acne|hipertens[aã]o|sobrepeso)\\b",
   "\\bsofre (com|de) (ansiedade|depress[aã]o|dor|calv[ií]cie|disfun[cç][aã]o)\\?",
   "\\bcansad[oa] (de ser|da sua|do seu) (gord|barriga|papada|flacidez)",
   "\\bvoc[eê] (é|est[aá]) (acima do peso|obes[oa]|careca|deprimid[oa])\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "manual",
  "exemplos_violacao": [
   "Você sofre de ansiedade? Agende agora.",
   "Cansada da sua papada?"
  ],
  "fonte": "https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/"
 },
 {
  "id": "IA2454-SINT-01",
  "titulo": "Simulação de resultado / imagem sintética gerada por IA em publicidade",
  "rotulo": "simulação de resultado",
  "tipo": "presenca_proibida",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.454/2026 (IA na medicina); Resolução CFM nº 2.336/2023",
  "artigo": "Res. 2.454/2026, art. 7º, § 3º (segundo fonte secundária — não confirmado); Res. 2.336, art. 14 e art. 11, § 2º, f",
  "confirmado": false,
  "explicacao": "Imagem gerada por IA ou simulação não pode ser apresentada como resultado de tratamento.",
  "descricao": "Comentário jurídico indica que a Res. 2.454/2026 manda que o uso de IA com finalidade mercantil, publicitária ou promocional observe as normas de publicidade médica e que conteúdo gerado/modificado por IA (inclusive imagem sintética) se sujeita às mesmas vedações. Simulações de 'como você ficaria' induzem percepção de garantia e não são imagens reais de pacientes (art. 14 exige imagens reais, sem manipulação).",
  "sugestao": "Não use imagens sintéticas como resultado. Para ilustrar, use ilustração claramente identificada como tal, sem representar resultado de paciente.",
  "padroes": [
   "\\bsimula[cç][aã]o (de|do) (resultado|rosto|corpo)\\b",
   "\\bveja como voc[eê] (vai )?ficaria\\b",
   "\\bveja como voc[eê] vai ficar\\b",
   "\\bimagem (gerada|criada) (por|com) (ia|intelig[eê]ncia artificial)\\b",
   "\\bresultado simulado\\b",
   "\\bpreview do (seu )?resultado\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [],
  "trocas": [],
  "correcao": "frase",
  "exemplos_violacao": [
   "Envie sua selfie e veja como você ficaria após a rinoplastia!",
   "Imagem gerada por IA mostrando o resultado do tratamento."
  ],
  "fonte": "https://alessandrocaldonazo.com/resolucao-cfm-2454-2026-inteligencia-artificial-medicina/ ; https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2026/2454_2026.pdf"
 },
 {
  "id": "CFM2336-PJ-01",
  "titulo": "Publicidade de clínica/hospital sem dados do diretor técnico",
  "rotulo": "clínica sem diretor técnico",
  "tipo": "ausencia_obrigatoria",
  "gravidade": "alerta",
  "norma": "Resolução CFM nº 2.336/2023; CEM art. 117, parágrafo único",
  "artigo": "Res. 2.336, art. 5º; CEM art. 117, parágrafo único",
  "confirmado": true,
  "explicacao": "Divulgação de clínica precisa trazer o nome e o CRM do diretor técnico.",
  "descricao": "Anúncios de estabelecimentos de saúde devem trazer o nome do estabelecimento, seu registro no CRM e nome e CRM do diretor técnico médico. Regra de ausência aplicada apenas quando o autor é pessoa jurídica.",
  "sugestao": "\"Clínica Bella Pele – CRM-SP PJ 9999 – Diretora técnica: Dra. Ana Souza – CRM-SP 123456 – RQE 7890.\"",
  "padroes": [
   "\\bdiretor(a)? t[eé]cnic[oa]\\b",
   "\\bresp(onsável)?\\.? t[eé]cnic[oa]\\b"
  ],
  "exceto_se": [],
  "ignorar_contexto": [],
  "aplica_se": [
   "(?:^|\\n|\\b(?:nossa|na|da|a|minha|sua|esta|nesta|uma)\\s)\\s*cl[ií]nica\\b(?! (?:geral|m[eé]dica)\\b)"
  ],
  "trocas": [],
  "correcao": "manual",
  "exemplos_violacao": [
   "Clínica Bella Pele – agende sua avaliação (sem diretor técnico e CRM da clínica)."
  ],
  "fonte": "https://abrasso.org.br/regras-publicidade-medica/publicidade-medica-cfm-2336-2023.pdf ; https://www.in.gov.br/materia/-/asset_publisher/Kujrw0TZC2Mb/content/id/48226289/do1-2018-11-01-resolucao-n-2-217-de-27-de-setembro-de-2018-48226042"
 }
];
  g.JALECON_REGRAS = REGRAS;
  if (typeof module !== 'undefined' && module.exports) module.exports = REGRAS;
})(typeof window !== 'undefined' ? window : globalThis);
