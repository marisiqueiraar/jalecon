# Jalecon: análise de concorrência no Brasil

**Data da pesquisa:** 19/10/2026
**Escopo:** quem já atende, no Brasil, a necessidade de marketing digital de médicos (marca, site, Google Business Profile, Instagram, campanhas pagas, conformidade com a Resolução CFM 2.336/2023), a que preço e com que tração.
**Preços planejados do Jalecon, para comparação:** R$ 297, R$ 697 e R$ 1.497 por mês (médico) e R$ 3.900 por mês (clínica).

> **Como os dados foram coletados.** Não foi possível abrir nenhuma página direto: o WebFetch e o curl falharam com DNS `ENOTFOUND` e proxy `403`. Por isso, todos os preços e afirmações abaixo vêm dos trechos das próprias páginas exibidos pelo buscador (WebSearch), consultados em 19/10/2026. Quase tudo é autodeclarado pelos fornecedores. Quando um dado não apareceu, está marcado como **"não encontrado"**. Antes de qualquer decisão de investimento, vale conferir manualmente os preços das páginas citadas, porque vários sites mostram valores que se contradizem.

---

## 1. Resumo executivo

1. **A camada "IA que cria posts de Instagram para médicos, com aviso de conformidade com o CFM" já está comoditizada.** Encontrei pelo menos 8 produtos ativos com essa proposta: Pulmo, InstaMed, CreatorMed, Doutor Conteúdo, ConteudoMed, GalilAI, Clinicacopy e Post2GO. Custam de **R$ 27,90 a R$ 229 por mês**. Vários já dizem seguir o CFM, publicar via API da Meta e só publicar depois da aprovação do médico. O InstaMed, em especial, descreve quase o mesmo fluxo central do Jalecon: pautas mensais, carrosséis, revisão contra as regras de publicidade médica e publicação só com aprovação.
2. **Dizer que o conteúdo está "conforme o CFM" não diferencia ninguém.** Pulmo, CreatorMed, InstaMed e o siteparamedico.com.br (Medyno) usam o argumento, e o Doutor Conteúdo fala em "conteúdo medicamente verificado". No mercado vizinho de dentistas, o Sorriai faz o mesmo com a CFO-196.
3. **O que ainda não achei em um único produto de software:** marca, site, Google Business Profile, Instagram e campanhas pagas, tudo com IA, revisado pelo chat e com checagem de conformidade, por R$ 300 a R$ 1.500 por mês. Hoje o médico monta isso combinando peças: uma ferramenta de IA (R$ 50 a R$ 200), o site da Doctoralia (R$ 99) ou O Site Médico (R$ 100 a R$ 500 mais R$ 2.490 de implantação), e um freelancer ou agência para anúncios (R$ 1.000 a R$ 4.000 mais mídia).
4. **Agências cobram tipicamente R$ 2.500 a R$ 8.000 por mês de honorários para médico solo, sem mídia.** A mediana dos pontos médios das faixas publicadas fica em torno de **R$ 3.250 por mês** (ver seção 4d). Não existe pesquisa independente: todas as faixas vêm de blogs de agências.
5. **O concorrente estratégico mais perigoso é a Doctoralia (Docplanner).** Ela já recebe dos médicos R$ 429 a R$ 679 por mês, vende site por R$ 99 por mês, tem integração oficial "Agendar online com o Google" e IA própria (Noa). O grupo tem receita de cerca de € 189 milhões (2024) e atingiu EBITDA positivo em 2025. O ponto fraco dela é a reputação junto aos médicos: 720 reclamações em 6 meses no Reclame Aqui, muitas sobre cancelamento e fidelidade.

---

## 2. Verificação dos nomes citados no rascunho anterior

| Nome citado | Existe? | O que é de fato | Preço encontrado | Fonte |
|---|---|---|---|---|
| **Pulmo** | Sim | IA que gera posts, carrosséis e stories para o Instagram de médicos e agenda a publicação. Diz ser "Parceira Oficial Meta", usar a API oficial e seguir as normas do CFM. Tem teste grátis de 7 dias. | Starter R$ 49,90/mês (10 posts, cartão em 12x), plano intermediário R$ 89,90, Platinum R$ 199,90 (100 posts). A landing fala em oferta para "os próximos 100 médicos". | https://www.pulmo.com.br/ ; https://www.pulmo.com.br/landing2.html |
| **InstaMed** | Sim, em dois domínios | IA planeja pautas, cria carrosséis, "verifica as regras de publicidade médica" e publica no Instagram só depois da aprovação. Pede CRM e RQE e diz não guardar dados de pacientes. **É o mais parecido com o núcleo do Jalecon.** Os dois domínios exibem o mesmo texto. Também existe um `instamed.vercel.app`. Não confundir com a InstaMed dos EUA, que é de pagamentos. | Essencial R$ 97 (8 conteúdos, condição para os primeiros assinantes), Individual R$ 149 (16 conteúdos), Profissional R$ 199 (24 conteúdos) | https://instamedai.app/ ; https://instamed.temfavo.com/ |
| **Doutor Conteúdo** | Sim | Gera posts únicos e carrosséis por especialidade para médicos, dentistas e fisioterapeutas. O usuário baixa os posts, sem publicação automática. Diz oferecer "conteúdo medicamente verificado". | Grátis (5 posts/mês), R$ 97/mês (30 posts), R$ 197/mês (100 posts, voltado a clínicas) | https://www.doutorconteudo.com.br/ |
| **CreatorMed** | Sim | "Primeira IA treinada para conteúdo médico": analisa o perfil e a identidade visual e gera carrossel, post, stories e reels, com calendário mensal. Diz ter "integração aprovada pela Meta" e conteúdo "conforme o CFM". | **Não encontrado** | https://creatormed.ai/ |
| **MedContent AI** | Só como protótipo | Landing page em vercel.app com repositório público no GitHub da conta `wahabfaisal883-png`, com cara de projeto pessoal. Promete 8 tipos de conteúdo e teste de 7 dias. Não achei empresa brasileira por trás. Existe também um "MedContent Pro" (medcontentpro.com), que é outro produto. | Não encontrado | https://medcontent-ai.vercel.app/ ; https://github.com/wahabfaisal883-png/medcontent-ai |
| **Medyno** | Não confirmado como produto independente | Aparece só dentro do siteparamedico.com.br, como a plataforma que cria sites de médicos com IA (SEO local, "ética CFM", conteúdo mensal, revisão humana, prévia grátis). Uma busca isolada por "Medyno" não retornou nada. | Não encontrado (há prévia grátis; os planos não apareceram) | https://siteparamedico.com.br/ ; https://siteparamedico.com.br/blog/seo-para-medicos-e-clinicas-com-ia |
| **ConteudoMed** | Sim | Plataforma de IA para conteúdo de saúde: roteiros, calendário editorial e capas. Diz ter "500+ profissionais de saúde" (autodeclarado). | Grátis (3 créditos), Profissional R$ 30/mês (10 créditos), Clínica Premium R$ 50/mês (30 créditos) | https://conteudomed.digital/ |

---

## 3. Tabela de concorrentes (37 players)

Legenda de categoria: **IA** = gerador de conteúdo com IA; **AG** = agência ou serviço; **DIR** = diretório ou agendamento que vende visibilidade; **PMS** = software de gestão de clínica; **GEN** = ferramenta genérica para pequenas empresas; **TPL** = templates ou biblioteca de posts.

| # | Player | URL | Cat. | O que entrega | Preço mensal (visto em 19/10/2026) | Claim CFM/compliance | Tração (sinais) | Fontes |
|---|---|---|---|---|---|---|---|---|
| 1 | **InstaMed** | instamedai.app | IA | Pauta, carrossel, checagem de regras e publicação no Instagram após aprovação | R$ 97 / 149 / 199 | Sim, "revisados contra as regras de publicidade médica" | Não encontrado ("condição para os primeiros assinantes" sugere fase inicial) | https://instamedai.app/ ; https://instamed.temfavo.com/ |
| 2 | **Pulmo** | pulmo.com.br | IA | Posts, carrosséis e stories, agendamento via API Meta, sugestão de pautas por especialidade | R$ 49,90 / 89,90 / 199,90 | Sim, "segue normas do CFM" | Oferta para "os próximos 100 médicos" (fase inicial) | https://www.pulmo.com.br/ ; https://www.pulmo.com.br/landing2.html |
| 3 | **CreatorMed** | creatormed.ai | IA | Carrossel, post, stories, reels, calendário mensal, publicação ou agendamento pela Meta | Não encontrado | Sim, "ético, conforme o CFM" | "Milhares de conteúdos", "milhões de visualizações" (autodeclarado) | https://creatormed.ai/ |
| 4 | **Doutor Conteúdo** | doutorconteudo.com.br | IA | Posts e carrosséis por especialidade, para baixar | Grátis / R$ 97 / R$ 197 | "Conteúdo medicamente verificado" | "10.000+ posts", "98% de satisfação" (autodeclarado) | https://www.doutorconteudo.com.br/ |
| 5 | **ConteudoMed** | conteudomed.digital | IA | Curadoria, roteiros, calendário editorial, capas | Grátis / R$ 30 / R$ 50 | Não encontrado | "500+ profissionais" (autodeclarado) | https://conteudomed.digital/ |
| 6 | **GalilAI** | galilai.com.br | IA (genérica com páginas para médicos) | Posts e Reels com IA, app iOS, páginas por especialidade (oncologia, saúde mental) | A partir de R$ 27,90 (compras no app até R$ 99,90) | Não encontrado | App na App Store, reclamações de cobrança no Reclame Aqui | https://galilai.com.br/posts-medicos-ia-instagram ; https://www.reclameaqui.com.br/empresa/galilai/ ; https://sorriai.com.br/blog/sorriai-vs-galilai-vs-clickposts |
| 7 | **Clinicacopy** | clinicacopy.com.br | IA | Planeja, cria e publica posts, artes e campanhas no Instagram para clínicas e consultórios | R$ 79 / 149 / 229 (teste de 21 dias) | Não encontrado | Não encontrado | https://clinicacopy.com.br/ |
| 8 | **Post2GO** | post2go.com.br | IA (genérica) | Calendário e posts com IA, "posts prontos para cada especialidade" | R$ 197 / 497 / 897 | Não | Não encontrado | https://post2go.com.br/ ; https://post2go.com.br/blog/30-ideias-posts-clinicas-profissionais-saude |
| 9 | **Doctor Creator (ecossistema)** | doctorcreator.com.br | IA, cursos e AG | "IA Médico Creator" (Reels, carrosséis, legendas), Arsenal de prompts, Creator Lab (50+ agentes), "Claude para Médicos", mentoria e agência de influência médica | IA Médico Creator R$ 67 (pagamento único, promo); Arsenal R$ 147/ano; Creator Lab R$ 397; mentoria não encontrado | Não encontrado | "Mais de 1.000 médicos mentorados" ou "500 médicos" (números autodeclarados e conflitantes) | https://doctorcreator.com.br/iamc/ ; https://arsenal.doctorcreator.com.br/ ; https://douglasgomides.com.br/imprensa ; https://claude.doctorcreator.com.br/ |
| 10 | **siteparamedico.com.br / Medyno** | siteparamedico.com.br | IA (site) | Site de médico gerado por IA, SEO local, agendamento, conteúdo mensal, revisão humana | Não encontrado (prévia grátis) | Sim, "ética CFM" | Não encontrado | https://siteparamedico.com.br/ |
| 11 | **MedContent AI** | medcontent-ai.vercel.app | IA (protótipo) | Promete 8 tipos de conteúdo e agendamento | Não encontrado | Não | Repositório pessoal no GitHub | https://github.com/wahabfaisal883-png/medcontent-ai |
| 12 | **Sorriai Post** (odontologia, mercado vizinho) | sorriai.com.br | IA | Posts, imagem e vídeo, publicação em Instagram, Facebook e **Google Business** | R$ 49 / 79 / 129 | Sim, filtro CFO-196/2019 | Não encontrado | https://sorriai.com.br/precos ; https://sorriai.com.br/ |
| 13 | **MedLeads** | medleads.app | AG/plataforma | Gestão de tráfego pago, anúncios, chatbot, qualificação com IA | Starter R$ 3.997; Med PRO R$ 6.497 (mídia à parte, até R$ 5 mil no Starter) | Não encontrado | Não encontrado | https://www.medleads.app/ |
| 14 | **O Site Médico** | ositemedico.com.br | AG (produtizada) | Site, Google Meu Negócio, relatórios, e-mail, hospedagem, blog | R$ 100 / 300 / 500 mais R$ 2.490 de implantação | Não encontrado | Não encontrado | https://ositemedico.com.br/ |
| 15 | **WE Marketing Médico** | wemarketingmedico.com.br | AG | Posts, anúncios Meta e Google | Planos antigos de R$ 990 / 1.790 / 2.990 (página de cerca de 5 anos; a agência diz que abandonou planos fixos) | Não encontrado | Não encontrado | https://wemarketingmedico.com.br/afinal-quanto-custa-fazer-marketing-para-medicos/ |
| 16 | **Agência do Médico** | agenciadomedico.com.br | AG | Site, marketing, identidade visual; contratação online sem fidelidade | Não encontrado ("sob necessidade") | Não encontrado | "+1.856 clínicas e consultórios atendidos" (autodeclarado) | https://agenciadomedico.com.br/ |
| 17 | **Future Marketing** | futuremarketing.com.br | AG | Marketing médico | Não encontrado | Não encontrado | "+300 clínicas" (autodeclarado) | https://www.futuremarketing.com.br/ |
| 18 | **Grupo KOP** | grupokop.com.br | AG | Marketing digital para médicos | Não encontrado | Não encontrado | "+100 clientes médicos" (autodeclarado) | https://www.grupokop.com.br/marketing-para-medicos |
| 19 | **M4H** | agenciam4h.com.br | AG | Marketing médico | "Planos a partir de R$ 1.500" | Não encontrado | Não encontrado | https://agenciam4h.com.br/agencia-de-marketing-medico-ou-equipe-interna/ |
| 20 | **Doctoralia** (Docplanner) | pro.doctoralia.com.br | DIR e agenda | Perfil no marketplace, agenda online, prontuário (Plus), campanhas por e-mail e SMS (VIP), botão "Agendar" no Google, site profissional, IA Noa Notes | Starter R$ 429, Plus R$ 529, VIP R$ 679 (anual em 12x); site +R$ 99; Noa Notes +R$ 199 | Não para conteúdo | Pagantes no Brasil: **não encontrado**. Cerca de 12 mil especialistas cadastrados (2021, SciELO); 530 mil profissionais no marketplace; 7 milhões de agendamentos por mês (2023); grupo com 300 mil+ profissionais usando soluções; receita do grupo € 188,7 milhões (2024); EBITDA positivo em 2025 | https://pro.doctoralia.com.br/preco ; https://certu.com.br/comparar/certu-vs-doctoralia ; https://www.scielo.br/j/cebape/a/n8FLLThqjZgqR3SLkk66Q5H/?lang=en ; https://www.startse.com/artigos/doctoralia-anuncia-felipe-rizzo-como-novo-ceo/ ; https://www.elfinanciero.com.mx/mundo-empresa/2026/01/27/docplanner-alcanza-la-rentabilidad-y-consolida-su-apuesta-por-la-inteligencia-artificial-en-salud/ |
| 21 | **BoaConsulta** | profissionais.boaconsulta.com | DIR e PMS | Agenda, prontuário, teleconsulta e perfil no marketplace | Essencial R$ 67; Controle R$ 85 (por profissional) | Não | "1,5 milhão de acessos mensais" (autodeclarado); principal concorrente da Doctoralia segundo a SimilarWeb | https://profissionais.boaconsulta.com/planos-e-precos/ ; https://www.similarweb.com/pt/website/doctoralia.com.br/competitors/ |
| 22 | **Afya iClinic** (+ AgendarConsulta) | iclinic.com.br | PMS | Prontuário e agenda; módulo "iClinic Marketing" (e-mail); perfil no AgendarConsulta; webinars sobre GBP; clube de benefícios com parceiros de marketing | Starter R$ 99, Plus R$ 129, Pro R$ 169, Premium R$ 299 (por profissional) | Não | Afya declara de 23 mil a 120 mil profissionais (números conflitantes); ecossistema Afya com 300 mil+ médicos e alunos (Bloomberg Línea, nov/2025); aquisição pela Afya por cerca de R$ 182,7 milhões (2020) | https://iclinic.com.br/precos/ ; https://blog.iclinic.com.br/marketing-para-medicos-iclinic/ ; https://www.bloomberglinea.com.br/negocios/o-medico-tem-uma-carreira-longa-a-afya-construiu-um-ecossistema-para-atende-lo/ ; https://startupi.com.br/afya-educacional-anuncia-aquisicao-de-healthtech-por-r-1827-milhoes/ |
| 23 | **Feegow** | feegowclinic.com.br | PMS | Gestão de clínica, agendamento online limitado; sem módulo de marketing dedicado | R$ 129 / 199 / 249 por profissional | Não | Não encontrado | https://feegowclinic.com.br/precos-e-planos ; https://cloudia.com.br/8-melhores-softwares-medicos-do-mercado-2024/ |
| 24 | **Amplimed** | amplimed.com.br | PMS | Gestão, portal de agendamento, "Amélia Copilot", e-mail marketing em plano superior | A partir de R$ 89 por profissional | Não | Não encontrado | https://www.amplimed.com.br/blog/o-que-e-amplimed/ ; https://www.clinicasyspro.com.br/clinicasyspro-vs-amplimed.html |
| 25 | **Ninsaúde (Apolo/Clinic)** | ninsaude.com | PMS | "Ninsaúde Ads": campanhas por SMS (WhatsApp previsto), pagas por campanha | Não encontrado (R$ 79 em matéria de cerca de 7 anos) | Não | Não encontrado | https://www.ninsaude.com/pt-br/marketing-medico/ |
| 26 | **Clinicorp** | clinicorp.com | PMS (foco odonto) | CRM de leads e campanhas, IA e agentes | Standard R$ 149,90–159,90; Premium R$ 369,90; CRM avulso R$ 69,90; WhatsApp R$ 0,30 por crédito | Não | Não encontrado | https://www.clinicorp.com/planos ; https://www.clinicasyspro.com.br/clinicasyspro-vs-clinicorp.html |
| 27 | **Medicina Direta** | medicinadireta.com.br | PMS | Prontuário e gestão; sem módulo de marketing encontrado | R$ 289 (1 usuário) a R$ 1.090 (10 usuários) mais implantação de R$ 949 | Não | Não encontrado | https://store.omie.com.br/apps/medicina-direta |
| 28 | **MEDX** | medx.med.br | PMS | Gestão com "marketing integrado" (campanhas a pacientes) | R$ 3.000 a 6.600 por ano (cerca de R$ 250 a 550 por mês) | Não | Não encontrado | https://info.medx.med.br/planos-e-precos/ ; https://care.medx.med.br/ |
| 29 | **Cloudia** | cloudia.com.br | Atendimento com IA | Secretária virtual no WhatsApp, agendamento, lembretes; integra com Feegow | A partir de R$ 449,90 (IA generativa como adicional, cerca de +R$ 100) | Não | "1.500+ clínicas" (autodeclarado) | https://cloudia.com.br/planos/ ; https://www.pixeljarbas.com.br/blog/pixeljarbas-vs-cloudia |
| 30 | **mLabs** | mlabs.com.br | GEN | Agendamento e calendário multirrede, incluindo **Google Meu Negócio** e aprovação de posts | A partir de R$ 29,90 por marca (anual) | Não | Não encontrado | https://ajuda.mlabs.com.br/pt-BR/articles/5120283-como-funcionam-os-planos-da-mlabs ; https://nacao.digital/blog/melhores-ferramentas-social-media/ |
| 31 | **Etus** | etus.com.br | GEN | Agendamento de posts | R$ 9,90 a 18,90 por perfil (dado de 2021; preço de 2026 não encontrado) | Não | Não encontrado | https://www.techtudo.com.br/listas/2021/08/etus-ou-mlabs-compare-planos-e-precos-dos-gerenciadores.ghtml |
| 32 | **Canva** | canva.com | GEN/TPL | Design e templates | Pro R$ 35 (ou R$ 290 por ano); Pro+ R$ 49 | Não | Não encontrado | https://www.darlanevandro.com.br/canva-pro-valor-quanto-custa/ |
| 33 | **RD Station Marketing** | rdstation.com | GEN | Automação, e-mail, landing pages | Light R$ 50 (promo, 3 meses; referência R$ 79); Basic a partir de R$ 309 | Não | Não encontrado | https://www.rdstation.com/planos/marketing/ |
| 34 | **ChatGPT Plus** | chatgpt.com | GEN | Texto e imagem genéricos, "faça você mesmo" | Cerca de R$ 99,99 a 124 (fontes de terceiros, não oficiais) | Não | Não encontrado | https://www.cometapi.com/chatgpt-plus-subscription-price-in-brazil-2026-guide/ ; https://gptprompts.ai/pt-br/precos-chatgpt |
| 35 | **Packs de posts para Canva** (Packs para Empreendedoras, Packs do Biel, Divulga Aê) | vários | TPL | 700+ artes médicas editáveis, calendário 2026 | Pagamento único (valores não encontrados nos trechos) | Não | Não encontrado | https://packsparaempreendedoras.com/comboareamedica/ ; https://packsdobiel.com.br/cardiologista/ |
| 36 | **Oftalmo VIP** (Agência MedConecta) | oftalmoassinatura.agenciamedconecta.com | TPL por assinatura | 20 vídeos, 30 stories e legendas por mês para oftalmologistas | R$ 97 | Pede para o médico incluir CRM e RQE | Não encontrado | https://oftalmoassinatura.agenciamedconecta.com/ |
| 37 | **Healo** | healocrm.com.br | CRM com IA | CRM e atendimento no WhatsApp com IA para consultórios | Ticket médio de R$ 407 (no início da operação) | Não | 21 clientes pagantes após 2 meses; meta de 1.000 clientes até 2030 | https://www.spacemoney.com.br/empreendedorismo/healo-crm-medico-ia-consultorios ; https://braziljournal.com/a-maioria-dos-medicos-mal-usa-um-crm-a-healo-quer-mudar-isso |

> Nota: a linha da Healo foi incluída como sinal de que há startups financiadas por anjos subindo de nível na jornada do paciente (CRM e WhatsApp), não como concorrente direto de conteúdo.

### Observações por grupo

**Grupo 1: IA para conteúdo médico.** O segmento é muito barato (R$ 27,90 a R$ 229 por mês), raso (Instagram, às vezes Facebook e Google Business) e cheio de produtos em fase inicial: ofertas para "os primeiros 100 médicos" ou "primeiros assinantes", landing pages em vercel.app, nenhum aporte encontrado. Isso mostra **barreira de entrada muito baixa**: um produto parecido com o "núcleo Instagram" do Jalecon pode ser montado em semanas, e pelo visto está sendo. Nenhum deles publica tração verificável. No mercado vizinho de dentistas, o Sorriai já faz conteúdo, Google Business e filtro de conformidade (CFO-196) por R$ 49 a R$ 129, o que serve de modelo do que pode surgir para médicos.

**Grupo 2: agências.** São centenas, regionais e fragmentadas. Quase nenhuma publica preço. As faixas aparecem em artigos das próprias agências (ver seção 4d). As maiores alegações de base de clientes são autodeclaradas: Agência do Médico com 1.856, Future com 300+, KOP com 100+. MedLeads (R$ 3.997 a R$ 6.497) é a oferta mais próxima de "plataforma de campanhas pagas com IA para médicos", mas é cara e não inclui conteúdo nem site.

**Grupo 3: diretórios.** A Doctoralia domina. A SimilarWeb aponta a BoaConsulta como principal site semelhante. Os planos da Doctoralia (R$ 429 a R$ 679) ficam **na mesma faixa de gasto mensal dos planos de R$ 297 e R$ 697 do Jalecon**, ou seja, disputam o mesmo orçamento do médico. Reclame Aqui (01/03 a 31/08/2026): nota 7,3, 720 reclamações, 81,7% resolvidas, só 58,3% "voltariam a fazer negócio". Médicos reclamam de fidelidade de 12 meses, multas e de "não gerar pacientes". Fonte: https://www.reclameaqui.com.br/empresa/doctoralia/ e reclamações como https://www.reclameaqui.com.br/doctoralia/doctoralia-nao-gera-pacientes-propaganda-enganosa-e-prejuizo-financeiro_QKlTlIpxL4f3BYnr/

**Grupo 4: softwares de gestão (PMS).** Nenhum tem um módulo real de criação de conteúdo, site ou anúncios. O que existe é marketing para a base de pacientes atual: e-mail (iClinic, Amplimed), SMS (Ninsaúde Ads), CRM com WhatsApp (Clinicorp, MEDX). O iClinic terceiriza marketing via clube de benefícios com parceiros, o que é um canal de parceria possível.

**Grupo 5: ferramentas genéricas.** O médico "faça você mesmo" gasta perto de R$ 35 (Canva) + R$ 100 (ChatGPT) + R$ 30 (mLabs, que já publica no Google Meu Negócio), ou seja, **cerca de R$ 165 por mês**. Esse é o preço de referência contra o qual o plano de R$ 297 será comparado.

**Grupo 6: "compliance CFM" como argumento de venda.** Já usado por Pulmo, CreatorMed, InstaMed e siteparamedico/Medyno (e Sorriai na odontologia). **Não encontrei nenhuma startup que venda só uma ferramenta de verificação de anúncios médicos** contra a 2.336/2023. Isso pode ser um espaço, mas também pode indicar pouca disposição a pagar por compliance isolado. Contexto regulatório que aumenta a importância do tema:
- Em **9/06/2026** o CFM lançou um módulo de IA na Plataforma Nacional de Fiscalização que monitora redes sociais e detecta infrações de publicidade. Fontes: https://portal.cfm.org.br/noticias/cfm-lanca-inteligencia-artificial-para-revolucionar-a-fiscalizacao-medica-no-brasil/ e https://futurodasaude.com.br/cfm-inteligencia-artificial-fiscalizacao/
- A **Resolução CFM 2.454/2026**, sobre IA na medicina, foi publicada no DOU em 27/02/2026 e está em vigor desde 26/08/2026. Um pedido de suspensão está em análise no TRF1. Fontes: https://portal.cfm.org.br/noticias/cfm-normatiza-uso-da-ia-na-medicina/ e https://jornaldebarueri.com.br/tecnologia/trf1-analisa-pedido-de-suspensao-da-regra-de-ia-na-medicina
- Guias do setor reforçam que a responsabilidade pelo conteúdo gerado por IA continua sendo do médico. Fonte: https://www.usebip.com/blogs/bip-insights/marketing-medico-em-2026-o-que-a-resolucao-cfm-2-336-2023-permite-bip

Na prática, isso significa que **"checar contra o CFM" vira requisito básico de entrada, e não um diferencial cobrável**, a menos que o Jalecon assuma responsabilidade de verdade (por exemplo, revisão humana, histórico auditável ou garantia).

---

## 4. Análise

### (a) Existe uma lacuna entre as ferramentas baratas e as agências caras?

A escada de preços que existe hoje (por mês, sem mídia):

| Faixa | Quem está lá | O que entrega |
|---|---|---|
| R$ 0–60 | ConteudoMed, GalilAI, Pulmo Starter, mLabs, Canva | Posts e agendamento |
| R$ 79–229 | InstaMed, Doutor Conteúdo, Clinicacopy, Pulmo Platinum, Post2GO Executor, Oftalmo VIP | Instagram com IA e "compliance" |
| R$ 100–500 (+R$ 2.490 de implantação) | O Site Médico | Site e Google Meu Negócio |
| R$ 429–877 | Doctoralia (plano + site + Noa) | Visibilidade no marketplace, agenda, site e botão no Google |
| R$ 1.500–4.000 | Freelancers, agências de entrada (M4H a partir de R$ 1.500) | Instagram e anúncios, com qualidade variável |
| R$ 2.500–8.000 | Agências especializadas para médico solo | Escopo completo |
| R$ 3.997–6.497 | MedLeads | Tráfego pago, chatbot e IA |

**Conclusão: a lacuna existe, mas é estreita e pode não durar.**
- **O que está aberto:** nenhum produto de software encontrado junta site, GBP, Instagram e anúncios com IA e conformidade por R$ 300 a R$ 1.500. A faixa de R$ 500 a R$ 1.500 é ocupada só por freelancers e agências de entrada, com qualidade irregular (o próprio mercado avisa que propostas abaixo de R$ 1.500 costumam ser só Instagram ou serviço fraco: https://www.zdigital360.com/blog/quanto-custa-agencia-marketing-medico.html).
- **O que já está fechado:** o pedaço Instagram com IA e compliance (plano de R$ 297) está lotado e ancorado em R$ 50 a R$ 200. O pedaço site e GBP tem O Site Médico, o site da Doctoralia e o siteparamedico. O que sobra de diferencial real é (i) **integração** de tudo e (ii) **campanhas pagas**, que é a parte mais difícil: depende das políticas de saúde da Meta e do Google, a verba de mídia é separada e o resultado é cobrado.
- **Risco de preço:** o plano de R$ 297 custa de 1,5 a 6 vezes os concorrentes de IA mais próximos e só se justifica se incluir de fato site e GBP gerenciados. Os planos de R$ 697 e R$ 1.497 precisam provar gestão de anúncios que funcione, ou o médico compara com um freelancer de R$ 1.500.
- **Clínicas (R$ 3.900):** competem diretamente com agências de R$ 8.000 a R$ 15.000 e com MedLeads, que custa R$ 3.997. Há espaço de preço, mas clínicas costumam exigir atendimento humano.

### (b) Concorrente mais perigoso

1. **Doctoralia (estratégico).** Já tem relação de cobrança com médicos que pagam R$ 429 a R$ 679 por mês, ou seja, é o mesmo orçamento. Também já vende **site (R$ 99)**, tem a **integração oficial com o Google** (botão "Agendar online" no Perfil da Empresa, anunciada no Google for Brasil 2024: https://saudedigitalnews.com.br/11/06/2024/google-e-doctoralia-unem-forcas-para-facilitar-agendamentos-medicos-no-brasil/), tem **IA própria (Noa)** e caixa (EBITDA positivo em 2025). Adicionar "posts com IA" é um recurso a mais para ela. Ponto fraco: pouca confiança dos médicos (fidelidade, multas, "não gera pacientes"). Daí o espaço para um posicionamento de "sua marca é sua, sem fidelidade".
2. **InstaMed e Pulmo (tático).** São quase idênticos à proposta central do Jalecon, custam de 3 a 6 vezes menos e já dizem seguir o CFM e publicar via Meta. Vão moldar a percepção de preço do médico.
3. **Agências locais.** O médico que já tem agência raramente troca relacionamento humano por software. O mercado é fragmentado, mas a fidelidade é grande.

### (c) Doctoralia ou iClinic/Afya conseguiriam adicionar isso com facilidade?

- **Doctoralia: tecnicamente sim, com facilidade; estrategicamente, só em parte.** Ela já tem perfil, site, Google, IA (Noa) e campanhas por e-mail e SMS no plano VIP. Gerar posts com IA seria um recurso incremental. O conflito é que o negócio dela é o **marketplace**: incentivar a marca própria e o tráfego direto do médico canibaliza o valor do perfil pago. Mesmo assim, ela pode vender um "pacote presença digital" como adicional (como já faz com o site a R$ 99). **Risco: alto.**
- **iClinic/Afya: tecnicamente sim; hoje prefere parcerias.** Já tem o iClinic Marketing (e-mail), o AgendarConsulta, conteúdo educativo sobre GBP e marketing, cursos e um **clube de benefícios com parceiros de marketing**. O ecossistema da Afya alcança 300 mil+ médicos e estudantes. É mais provável que **faça parceria ou compre** do que construa. Isso é um risco, mas também uma possível saída para o Jalecon (canal de distribuição ou aquisição).
- **Outros softwares de gestão (Feegow, Amplimed, Clinicorp, Ninsaúde):** mais focados em operação e em marketing para a base de pacientes. Risco baixo a médio no curto prazo, mas qualquer um pode integrar um gerador de posts com IA de terceiros em poucos meses.

### (d) Quanto os médicos realmente pagam a agências

Não existe pesquisa independente. Todas as faixas vêm de blogs de agências, então há viés de quem vende.

| Fonte | Faixa (honorários mensais, sem mídia, salvo indicação) | Ponto médio |
|---|---|---|
| zdigital360 (SP), médico solo ou clínica pequena | R$ 2.500–8.000 (setup de R$ 1.500–6.000; mídia a partir de R$ 3.000) | R$ 5.250 |
| zdigital360, médico solo iniciante | R$ 2.500–4.000 | R$ 3.250 |
| Fernanda Tavares, freelancer | R$ 1.500–4.000 | R$ 2.750 |
| Fernanda Tavares, agência | R$ 3.500–15.000 | R$ 9.250 |
| FarmaCerto, agência generalista | R$ 1.500–5.000 | R$ 3.250 |
| FarmaCerto, boutique de saúde | R$ 4.000–12.000 | R$ 8.000 |
| Markanty, conteúdo orgânico e presença | R$ 3.000–6.000 | R$ 4.500 |
| WE Marketing Médico (planos antigos, cerca de 2021) | R$ 990–2.990 | R$ 1.790 (plano do meio) |
| Social media genérico para PME | R$ 800–2.500 | R$ 1.650 |
| Pontos isolados: M4H "a partir de R$ 1.500"; Douglas Gomides R$ 4.000–25.000 + mídia; Pulmo diz que "agência custa R$ 2.000+" | | |

- **Faixa típica para médico solo:** **R$ 2.500 a R$ 8.000 por mês** de honorários, mais mídia (R$ 1.000 a R$ 3.000 ou mais). O total para um consultório solo já estabelecido fica em cerca de R$ 4.500 a R$ 9.500 por mês, segundo Fernanda Tavares.
- **Mediana:** a mediana dos 9 pontos médios da tabela acima é **cerca de R$ 3.250 por mês**, sem mídia. É uma estimativa feita por mim a partir de faixas publicadas, não um dado de pesquisa.
- **Implicação:** o plano de R$ 1.497 sai por cerca de 46% da mediana e o de R$ 697 por cerca de 21%. A economia faz sentido no papel, mas o médico que paga agência está comprando também atendimento humano e responsabilidade.

Fontes da seção (d):
- https://www.zdigital360.com/blog/quanto-custa-agencia-marketing-medico.html
- https://fernandatavares.ia.br/blog/quanto-custa-marketing-medico
- https://farmacerto.com/quanto-custa-marketing-saude-brasil/
- https://markantygrowth.com/marketing-medico/quanto-custa
- https://douglasgomides.com.br/blog/agencia-de-marketing-medico
- https://wemarketingmedico.com.br/afinal-quanto-custa-fazer-marketing-para-medicos/
- https://agenciam4h.com.br/agencia-de-marketing-medico-ou-equipe-interna/
- https://post2go.com.br/blog/quanto-custa-estrategia-redes-sociais-pme-brasil-2026

---

## 5. Contexto de mercado

- **Número de médicos:** 635.706 médicos em atividade estimados para o fim de 2025 (Demografia Médica 2025, USP/AMB). Fonte: https://med.estrategia.com/portal/noticias/brasil-tera-635-mil-medicos-ate-o-fim-do-ano-confira-os-principais-dados-da-demografia-medica-2025/ e https://istoe.com.br/brasil-deve-chegar-a-6357-mil-medicos-em-2025-mulheres-sao-maioria
- **Percentual de médicos que pagam por marketing e gasto médio:** não encontrado. Não há pesquisa independente.
- **Investimento em startups do nicho:** não encontrei aporte em nenhuma startup de conteúdo ou marketing com IA para médicos. Os aportes da área de IA em saúde vão para documentação clínica (por exemplo, Voa Health, com US$ 3 milhões da Prosus) e atendimento (Ailum, pré-seed de R$ 600 mil). Fonte: https://www.bloomberglinea.com.br/startups/prosus-investe-em-startup-brasileira-que-mira-ser-um-hub-de-agentes-de-ia-para-saude/ e https://folhavitoria.com.br/folha-business/startup-capixaba-de-ia-para-clinicas-atrai-investidores-em-rodada-pre-seed

## 6. Lacunas e limitações da pesquisa

- Nenhuma página foi aberta diretamente (falha de rede no WebFetch e no curl). Todos os dados vêm de trechos indexados pelo buscador.
- **Não encontrado:** preço do CreatorMed, preço do siteparamedico/Medyno, número de médicos pagantes da Doctoralia no Brasil, tração verificável (clientes, receita, aporte) de qualquer gerador de conteúdo com IA, preço atual do Etus e da Ninsaúde, e percentual de médicos que contratam agência.
- Os números de usuários da iClinic se contradizem entre as próprias páginas da Afya (23 mil, 70 mil e 120 mil).
- As faixas de preço de agências vêm de quem vende serviços de agência, então provavelmente estão infladas.
