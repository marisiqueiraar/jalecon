# Jalecon: pesquisa de benchmarks para testar as premissas do modelo

Data da pesquisa: 19–20/10/2026. Método: busca web (WebSearch). O WebFetch falhou por DNS em todas as tentativas (chartmogul.com, doutorconteudo.com.br, pulmo.com.br), então **nenhuma página foi lida na íntegra**: os números abaixo vêm dos trechos e resumos das buscas. A cota de buscas da sessão (200) se esgotou no fim do trabalho. Algumas lacunas ficaram abertas e estão marcadas como "não encontrado".

Legenda de confiança: **[A]** fonte primária (filing SEC, release de RI, comunicado oficial); **[B]** imprensa/analista reputado; **[C]** blog, agregador ou estimativa de terceiros (usar só como direção).

Conversão usada (churn mensal composto, `1-(1-m)^12`): 5%/mês = 46% ao ano; 3%/mês = 31% ao ano; 2,5%/mês = 26% ao ano; 2%/mês = 22% ao ano.

---

## 1. Análogos internacionais e o que aconteceu com eles

### PatientPop (EUA, marketing e "practice growth" para médicos), hoje Tebra
- **Preço:** não há tabela pública. Relatos de médicos em 2020 citam contrato base de **US$ 395/mês** e outro estimou cerca de **US$ 9 mil/ano** [C], em https://forums.studentdoctor.net/threads/marketing-and-seo-reccs.1412017/ (2020). Um concorrente diz que o plano básico de site partia de **US$ 700/mês** em 2020 [C, parte interessada], em https://hip.agency/patientpop-reviews/.
- **Clientes:** a própria empresa falava em "thousands of healthcare practices" em 2020 [B], em https://mercomcapital.com/patientpop-announces-funding/. Número exato: **não encontrado**. Agregadores divergem (1.000 vs 4.000 clientes) [C], em https://www.itqlick.com/patientpop.
- **Funding:** Series C de US$ 50M em ago/2020, total captado acima de US$ 125M [A/B], em https://www.prnewswire.com/news-releases/patientpop-announces-50m-in-series-c-funding-301117797.html. Receita de 2018 estimada em US$ 38,8M e 438 funcionários em 2020 [C, estimativa Latka], em https://getlatka.com/companies/patientpop.
- **Desfecho:** **não virou empresa independente**. Em nov/2021 fundiu-se com a Kareo (software de faturamento e EHR) para formar a **Tebra**, com cerca de 1.000 funcionários e mais de 100 mil profissionais atendidos [B], em https://hitconsultant.net/2021/11/02/kareo-patientpop-merge-tebra/ e https://www.businesswire.com/news/home/20211102005810/en/. Depois da fusão, avaliações de funcionários relatam **dois cortes de 10% e 9% do quadro em cerca de 10 meses** [C, Glassdoor anônimo], em https://www.glassdoor.com/Reviews/Employee-Review-Tebra-E7488218-RVW80082807.htm. Em dez/2025 a Tebra levantou **US$ 250M** (equity liderado pela Hildred mais dívida do J.P. Morgan) e declara mais de 140 mil profissionais e um "core business" lucrativo [A], em https://www.hildred.com/news/hildred-tebra-250m-financing. O PatientPop virou o módulo "Tebra Patient Experience".
- **Retenção e satisfação:** churn **não encontrado**. Reviews reclamam de **renovação automática anual com aviso de 60 dias**, de dificuldade para cancelar e de o site ficar com o fornecedor [C], em https://www.trustradius.com/products/tebra-patient-experience. Leitura: quando a retenção depende de contrato com multa, e não de valor percebido, o churn real fica escondido.

### Zocdoc (EUA, marketplace de agendamento)
- **Modelo de preço:** saiu da assinatura fixa para **cobrança por agendamento de paciente novo, sem mensalidade** [A], em https://www.zocdoc.com/about/newpricing/. Em Nova York, a transição criou uma licença anual a partir de **US$ 299** mais **US$ 35–110 por agendamento**, conforme a especialidade, o que gerou reclamação de médicos [B], em https://www.fiercehealthcare.com/practices/some-new-york-doctors-unhappy-about-zocdoc-s-new-pricing-model-company-says-it-was.
- **Escala:** cerca de **200 mil profissionais** na rede e **lucrativa em base anual desde 2023**, segundo o CEO [B], em https://fastcompany.com/91608291/zocdoc-becoming-infrastructure-for-booking-doctor. Depois da mudança de modelo, o número de profissionais subiu 50% nos estados que a adotaram e a receita cresceu 35% em 2019 [C, Wikipedia], em https://en.wikipedia.org/wiki/Zocdoc.
- **Lição:** médico paga com mais facilidade por **paciente entregue** do que por assinatura de "marketing". A Zocdoc só destravou crescimento quando trocou a mensalidade por pagamento por resultado.

### Doctolib (França, Alemanha e Itália: agenda, software de consultório e teleconsulta)
- ARR de **€ 348M em 2024 (+22,5%)** e EBITDA ajustado negativo em cerca de **€ 53,8M** [B, Les Echos via], em https://www.journaldugeek.com/2025/04/30/doctolib-nest-pas-rentable-mais-il-va-le-devenir/ e https://lessentieldeleco.fr/4114-doctolib-une-rentabilite-fragile-soutenue-par-largent-public/. Assinaturas são 99% da receita. O preço médio é de **€ 139–149/mês** por profissional pelo software principal [B/C], na mesma fonte. Base declarada: cerca de 300–400 mil profissionais "equipados", número não auditado e com datas divergentes [C], em https://bourseinside.fr/?p=4572.
- **Lição:** o maior caso europeu vende **software operacional (agenda e prontuário) a € 139–149**, e não marketing. Mesmo com ARR acima de € 300M e cerca de 12 anos de operação, ainda não era lucrativo em 2024.

### Docplanner / Doctoralia (Polônia, com o Brasil como mercado relevante)
- Receita consolidada de **€ 188,7M em 2024** (€ 150,9M em 2023) e prejuízo líquido de € 48,5M, segundo resumo de filing citado em busca [C, não verificado na fonte primária]. Em 2025 a empresa anunciou **EBITDA positivo** [C], em https://www.distillintelligence.com/news/docplanner-group. Fala-se em ARR de cerca de US$ 300M [C], em https://factorynewstoday.com/docplanners-ai-bet-and-ipo-plans-a-data-gold-rush-20260126/.
- **Brasil:** número de médicos pagantes e receita local **não encontrados**. O assistente de IA da Doctoralia (lançado em 2024) tem **mais de 30 mil médicos pagantes em 13 países**, com 1 milhão de consultas atendidas só no Brasil [B], em https://medicinasa.com.br/ia-clinicas/. A operação brasileira começou em 2017 com 6 pessoas e tinha 300 em 2019 [A], em https://www.prnewswire.com/news-releases/docplanner-grupo-ao-qual-pertence-doctoralia-capta-80-milhoes-de-euros-para-impulsionar-crescimento-834970623.html. Um site de organograma lista um time de "Sales Operations" de 83 pessoas, sem data [C], em https://theorg.com/org/doctoralia-brasil/teams/sales-operations.
- **Preço no Brasil:** planos **Starter R$ 429, Plus R$ 529, VIP R$ 679/mês** [A, página oficial possivelmente desatualizada], em https://pro.doctoralia.com.br/preco. Há relato de contrato fechado por R$ 247 [C], em https://www.reclameaqui.com.br/doctoralia/divergencia-de-precos-no-plano-doctoralia-para-profissionais-da-saude_zZECENzYe0mriN7j/.
- A Doctoralia **comprou a Feegow** (gestão de clínicas, mais de 40 mil profissionais e mais de 5 mil unidades) [A], em https://press.doctoralia.com.br/212904-doctoralia-anuncia-aquisicao-da-feegow.
- **Lição:** o principal incumbente brasileiro já vende "visibilidade + agenda + IA" ao médico a R$ 429–679 e tem força de vendas interna grande. É concorrente direto pelo mesmo orçamento.

### Weave (EUA, comunicação e engajamento de pacientes para dentistas e médicos; capital aberto)
- Receita de **US$ 204,3M em 2024 (+20%)**, margem bruta GAAP de **71%** (68% em 2023), prejuízo líquido de US$ 28,3M [A], em https://www.sec.gov/Archives/edgar/data/1609151/000160915125000022/weav-20241231.htm.
- **31.002 locations** no fim de 2023. **Gross revenue retention de 92%** e **NRR de 95%** em 2023 (eram 94% e 99% em 2022). Margem bruta de assinatura de 77% [A], em https://content.edgar-online.com/ExternalLink/EDGAR/0001609151-24-000021.html?hash=6db98aba9ad596256115f1cd5e3da53318aad1b48f3c0bb284d3961c446e1b0a&dest=weav-20231231_htm. No 3T24, GRR de 92% e NRR de 98% [A], em https://www.sec.gov/Archives/edgar/data/1609151/000160915124000142/weaveearningsrelease-q32024.htm.
- Receita por location calculada por mim: cerca de **US$ 490/mês** (2023).
- **Lição:** GRR de 92% ao ano equivale a cerca de 0,7% de churn de receita por mês. Esse é o teto para software **embutido na operação** (telefonia, mensagens, pagamentos), com hardware e integração ao sistema de gestão. Um produto de conteúdo e marketing não tem esse lock-in. Mesmo assim, a margem bruta ficou em 71–72%, abaixo dos 77–82% do Jalecon.

### Birdeye, Podium, Scorpion, Thryv, Yelp (marketing e reputação para SMBs locais)
- **Birdeye:** passou de **US$ 100M de ARR** em jun/2023 com "mais de 100 mil negócios" [A], em https://www.prnewswire.com/news-releases/birdeye-passes-100m-arr-milestone-on-accelerating-growth-and-expanded-ai-offering-301863899.html. Isso dá em média **menos de US$ 100/mês por negócio** (cálculo meu).
- **Podium:** mais de US$ 100M de ARR e valuation de US$ 3B em 2021. **Demitiu 12%** (de cerca de 1.300 funcionários) em dez/2022 [B], em https://www.forbes.com/sites/qai/2022/12/12/startup-podium-adds-to-the-growing-list-of-tech-layoffs/. Analistas apontam a sensibilidade de SMBs locais a ciclos econômicos [C], em https://research.contrary.com/company/podium.
- **Scorpion** (agência e tecnologia para saúde, jurídico e home services): recebeu **US$ 100M de PE** (Bregal Sagemount) em 2021 e tem mais de 1.000 funcionários [B], em https://www.localogy.com/2021/04/scorpion-raises-100-million-changes-management-moves-hq-to-utah/. Receita **não encontrada** (estimativas vão de US$ 25M a US$ 738M, sem valor).
- **Thryv** (SaaS para SMB, capital aberto): ARPU SaaS de **US$ 324/mês** no 4T24, 99 mil clientes SaaS e **NRR "seasoned" de 98%** [A], em https://www.businesswire.com/news/home/20250227685308/en/. Em 2T24 a NRR foi de 94% [A], em https://investor.thryv.com/news/news-details/2024/Thryv-Grows-SaaS-Revenue-25-in-Second-Quarter-2024-Raises-Full-Year-2024-SaaS-Adjusted-EBITDA-Guidance/default.aspx.
- **Yelp:** ao trocar contratos com prazo por contratos canceláveis a qualquer momento (mai/2018), teve **zero adição líquida de anunciantes no 3T18** e a ação caiu 32% [B], em https://www.marketingdive.com/news/yelps-ad-business-takes-a-hit-after-switching-to-non-term-contracts/541926/. O 10-K de 2025 diz que anunciantes podem cancelar a qualquer momento "as is typical in our industry" [A], em https://www.sec.gov/Archives/edgar/data/1345016/000134501626000019/yelp-20251231.htm.
- **Yodle:** um filing da Web.com em 2016 descreve churn **maior** nos produtos da Yodle (marketing local) do que na base de domínios. Comprada por US$ 342M [C, citação de filing não lida].
- **ProSites / Officite** (sites e marketing para dentistas e médicos): ProSites diz atender mais de 7.500 profissionais. Preço estimado entre US$ 150–500/mês mais setup [C], em https://www.flashcrafter.ai/dental-marketing-growth-engine/website-cost. Os dois foram absorvidos por grupos maiores (Henry Schein One / Internet Brands).

### Jasper (IA de conteúdo de marketing, comparativo de compressão de preço)
- Em 2023 **cortou a projeção de ARR em pelo menos 30%**, reduziu o valuation interno em cerca de 20% (de US$ 1,5B para cerca de US$ 1,2B), fez demissões e trocou de CEO, com o ChatGPT apontado como causa [B], em https://www.maginative.com/article/jasper-cuts-internal-valuation-as-ai-growth-slows/ e https://www.theinformation.com/briefings/jasper-cuts-internal-valuation-revenue-projections.

---

## 2. Benchmarks de churn: SMB SaaS e marketing para SMB

| Fonte | Recorte | Número | Churn mensal equivalente | Confiança |
|---|---|---|---|---|
| Recurly (dados 2023, via blogs) | B2B: software e serviços profissionais | 3,8% (período não explicitado no relatório) | ~3,8% | C. Ver https://recurly.com/research/churn-rate-benchmarks/ e https://adamfard.com/blog/average-churn-rate-for-subscription-services |
| ProfitWell (2021, via Vindi) | B2B SaaS para PMEs | 3,35%/mês | 3,35% | C, https://blog.vindi.com.br/taxa-de-churn-ideal/ |
| ChartMogul Retention Report 2023 | **Top quartil** de retenção de clientes, ARPA < US$ 25 | 64,7% ao ano (top quartil!) | ~3,6% (top quartil) | B, https://chartmogul.com/reports/saas-retention-report/ |
| ChartMogul 2023 | Top quartil, ARPA > US$ 500 | 85,7% ao ano | ~1,3% (top quartil) | B, mesma fonte |
| Mediana de churn bruto de MRR por ARPA (página hospedada no TechCrunch) | ARPA US$ 0–10 vs > US$ 500 | 8,9% vs 2,5%/mês | 8,9% / 2,5% | C, https://techcrunch.com/?p=2303308 |
| Baremetrics Open Benchmarks (reproduzido por agregadores) | ARPU **US$ 100–250** (faixa do plano de R$ 697) | **7,1% churn de usuários/mês**, 7,8% de receita | 7,1% | C, não verificado na fonte primária https://baremetrics.com/benchmarks |
| Paddle/ProfitWell (via agregador) | ARPU < US$ 100 | 6–9% de churn bruto de receita/mês | 6–9% | C |
| Blogs que citam Recurly/Paddle 2025 | SMB / self-serve | 3–7%/mês | 3–7% | C, https://stealthagents.com/research/saas-churn-rate-statistics-2026 |
| KeyBanc/Sapphire 2024 | SaaS privado (predomínio mid-market e enterprise) | GRR mediana 91% ao ano | ~0,8% de receita | A, https://www.key.com/content/dam/kco/documents/businesses___institutions/2024_kbcm_sapphire_saas_survey.pdf (não representa SMB) |
| Vendasta, estudo de 2015 com SMBs de marketing local | Pacotes < US$ 100 vs > US$ 100 | 28% vs **50% ao ano** | 2,7% vs **5,6%** | B/C, https://www.slideshare.net/slideshow/insights-into-customer-churn/55306390 |
| Vendasta, estudo de churn com 100–200 mil SMBs | Cliente com **um único produto** | **30% de retenção após 2 anos** | **~4,9%** | B/C, https://www.vendasta.com/content-library/insights/client-churn-study/ |
| Vendasta (mesmo estudo) | Cliente sem upsell nos 3 primeiros meses | 62% cancelaram em 2 anos | ~4%+ | mesma fonte |
| Localogy | Vendedores de mídia para SMB | "Bem acima de 50% ao ano" | > 5,6% | C, https://www.localogy.com/2019/09/churn-busting-best-practices-for-small-business-advertiser-retention/ |
| RevenueCat State of Subscription Apps 2026 | Apps de IA (consumo), plano mensal | Retenção em 12 meses de 6,1% vs 9,5% sem IA. Churn de apps de IA cerca de 30% mais rápido | n/a (B2C) | B, https://www.revenuecat.com/state-of-subscription-apps e https://techcrunch.com/2026/03/10/ai-powered-apps-struggle-with-long-term-retention-new-report-shows |

**Retenção de clientes em agências de marketing**
- Retainer: cerca de **18% de churn anual, vida média de 56 meses**. Projeto: 42% ao ano e 24 meses. Híbrido: 36 meses. Por performance: 30 meses [C], em https://focus-digital.co/average-marketing-agency-churn/. Isso equivale a **1,6% a 4,4% ao mês**.
- Agências retêm 75–85% dos clientes por ano (1,3% a 2,4% ao mês) [C], em https://agiled.app/statistics/client-retention-statistics. Em pesquisa com 165 líderes de agências, **24% dizem que o cliente típico sai em menos de 1 ano** [C], na mesma fonte.
- Vendasta 2023: churn mensal "típico" de agências entre **2% e 8%** [B/C], em https://www.vendasta.com/content-library/insights/agency-benchmarks-report/.
- Ressalva: agência tem relacionamento humano, contrato e custo de troca maiores que um SaaS self-serve. Os números de agência são um **piso otimista** para um SaaS de marketing, e não a referência central.

**Síntese do churn:** para um produto de marketing e conteúdo vendido a profissionais autônomos com ticket de US$ 50–150/mês, a evidência converge para **4% a 7% ao mês de churn de logos**. Ficar abaixo de 3% exige lock-in operacional (agenda, prontuário, telefonia, pagamentos) ou contrato anual pré-pago.

---

## 3. Benchmarks brasileiros

- **RD Station** (marketing para PMEs, o melhor análogo brasileiro de "SaaS de marketing para pequenos"): a TOTVS comprou cerca de 92% por **R$ 1,86 bi** em 2021. A receita líquida de 2021 era projetada em **R$ 206M**, com CAGR de 46% desde 2016 e receita de **R$ 156,5M em 2020** [B], em https://www.seudinheiro.com/2021/economia/totvs-compra-empresa-de-marketing-digital-rd-station-por-r-18-bi/ e https://www.infomoney.com.br/mercados/ceo-da-rd-station-venda-a-totvs-mostra-que-sucesso-na-tecnologia-vai-alem-das-empresas-pops-como-facebook/. Tinha **25–30 mil clientes** na época [B], em https://www.meioemensagem.com.br/marketing/totvs-compra-rd-station-por-r-2-bilhoes. Isso dá uma receita média calculada de **R$ 570–690/cliente/mês**. Hoje: ARR SaaS de **R$ 689M no 1T26 (+21,9% a/a)** e "taxa de retenção SaaS" de **94,6%** (queda de 40 pb a/a; definição exata não verificada) [A], em https://api.mziq.com/mzfilemanager/v2/d/d3be5d49-62e7-4def-a3e1-ab25ff09f153/ec6a0a0d-5763-7d91-9632-bf678600232e?origin=2. Churn mensal de logos **não encontrado**.
  - **Comparação crítica:** a RD Station, fundada em 2011 e horizontal (todas as PMEs do Brasil), levou **cerca de 10 anos para chegar a R$ 200M de receita**. O Jalecon projeta **R$ 72M de ARR no ano 5** num nicho único (médicos), ou seja, cerca de 35% do tamanho da RD Station no ano 10.
- **iClinic** (prontuário e gestão para médicos): comprada pela Afya em out/2020 por **R$ 182,7M** (61,5% à vista) com **23 mil usuários ativos** [B], em https://exame.com/negocios/de-olho-no-setor-de-telemedicina-afya-compra-iclinic-por-r-1827-milhoes/ e https://startupi.com.br/afya-educacional-anuncia-aquisicao-de-healthtech-por-r-1827-milhoes/. Preço de entrada de cerca de **R$ 89/mês** [C], em https://www.b2bstack.com.br/compare/iclinic-vs-medplus. Receita e churn **não encontrados**.
- **Afya Serviços Digitais** (iClinic, Whitebook e outros): **R$ 229,3M em 2023 (+20,7%)**, com 268 mil médicos e estudantes por mês no ecossistema [A], em https://www.afya.com.br/noticias/afya-registra-mais-um-ano-de-alta-performance.
- **Feegow:** mais de 40 mil profissionais e mais de 5 mil unidades. Comprada pela Doctoralia, valor não divulgado [A], em https://press.doctoralia.com.br/212904-doctoralia-anuncia-aquisicao-da-feegow. Preço de R$ 129–249/mês por profissional [C], em https://bydoctor.com.br/blog/feegow-vale-a-pena-analise-honesta-2026.
- **Amplimed, Medicina Direta:** clientes e receita **não encontrados**.
- **Conta Azul:** clientes e churn **não encontrados**.
- **Nuvemshop:** mais de 75 mil lojas ativas em 2021 e mais de 90 mil em 2022 [B], em https://www.baguete.com.br/noticias/nuvemshop-recebe-aporte-de-r-500-milhoes. Churn **não encontrado**.
- **Pesquisas setoriais:** o "Brazil SaaS Landscape" (2017, 597 respondentes, SaaSholic/Rock Content/Redpoint) foi o único survey brasileiro com métricas localizado. Nele, cerca de 60% das empresas com mais de R$ 1M de ARR recuperavam o CAC em menos de 6 meses (autodeclarado) [B], em https://blog.saasholic.com/p/brazil-saas-landscape-2017-a-primeira-pesquisa-sobre-o-mercado-saas-no-brasil. Um blog da Zendesk cita a mesma pesquisa com **churn médio de 4–5% ao mês** entre as startups respondentes [C], em https://www.zendesk.com.br/blog/churn-rate/. Distrito, ABStartups e Sales Hackers: **não encontrado** relatório com churn ou CAC de SaaS SMB. Um texto de valuation de 2026 diz que SaaS SMB dependente de Google e Meta tem **payback de 18–24 meses** com Selic alta [C], em https://negociosbrasil.com.br/quanto-vale-uma-empresa-saas-no-brasil/.

---

## 4. CAC: vender software a médicos e consultórios

- **Payback de CAC (Benchmarkit, B2B SaaS):** ACV < US$ 5 mil teve mediana de **cerca de 8–9 meses (dados 2024)** e cerca de 11 meses (dados 2025). O payback mediano geral foi de 16–18 meses [C, via], em https://www.chargebee.com/blog/understanding-cac-relevance-saas-company/ e https://www.getaleph.com/answers/cac-payback-period-saas-2026. A meta da Bessemer para SMB é menos de 12 meses [C], em https://www.marqeable.com/blog/cac-payback-period-benchmarks/.
  - **CAC implícito para o Jalecon** (cálculo meu): plano de R$ 697 com 80% de margem bruta dá R$ 558/mês de lucro bruto. Payback de 8–11 meses equivale a um **CAC de R$ 4.500 a R$ 6.100**. O modelo usa **R$ 1.800, o que dá payback de cerca de 3,2 meses**, ou 2,6 vezes o MRR. Fica no topo da distribuição.
- **Healthcare SaaS:** razão de CAC de cerca de **US$ 1,94 de S&M por US$ 1 de ARR novo**. Ciclo de venda para consultórios de 2–3 trimestres [C], em https://knowledgelib.io/finance/saas-benchmarks/healthcare-saas-benchmarks/2026.
- **CAC específico de software para médicos no Brasil:** **não encontrado** (iClinic, Feegow e Doctoralia não publicam).
- **Custo por lead em mídia paga de saúde no Brasil** (mede o custo de captar **pacientes**, não médicos; serve como piso de leilão):
  - Meta Ads em saúde e clínicas: CPL de **R$ 20–60** [C], em https://giorgiopasquale.com/blog/meta-ads-custo-por-lead/. Saúde e estética: CPL de R$ 25–80 e CPM de R$ 20–45 [C], em https://webcer.digital/quanto-custa-anunciar-google-ads-meta-ads/.
  - Google Ads em saúde: CPC de R$ 3–18. CPL de médicos e clínicas de **R$ 25–120** [C], em https://www.creisconsultoria.com/post/google-ads-medicos-campinas-1.
  - **CPL B2B com o médico como comprador:** não encontrado. Ilustração (não é dado): com CPL de R$ 60–150 por médico qualificado e conversão de lead em pagante de 3–5%, típica de trial SMB, o CAC só de mídia fica em **R$ 1.200 a R$ 5.000**, antes de SDR e vendedor. A Doctoralia, por exemplo, usa inside sales.
- A resolução **CFM 2.336/2023** (em vigor desde **11/03/2024**) liberou redes sociais, preços, campanhas e "antes e depois" educativo. Isso amplia a demanda por marketing e também a necessidade de compliance [B], em https://www.mattosfilho.com.br/unico/regras-publicidade-medica/ e https://legismap.com.br/conteudos/artigos-e-noticias/conselho-federal-de-medicina-atualiza-regras-para-a-publicidade-medica.

---

## 5. Quanto o médico brasileiro gasta com marketing

- **Pesquisa independente** (CFM, AMB, Doctoralia, Medicina S/A) sobre gasto mensal ou % que usa agência: **não encontrada**. Um blog cita "estudo Doctoralia 2022: mais de 70% das clínicas investem em redes sociais", sem link para o estudo [C], em https://eixo.digital/instagram-para-medicos-mais-seguidores-e-pacientes/.
- **Preços de mercado** (blogs de agências, parte interessada):
  - Agência para médico solo ou clínica pequena em SP: **R$ 2.500–8.000/mês** sem mídia. Setup de R$ 1.500–6.000 [C], em https://www.zdigital360.com/blog/quanto-custa-agencia-marketing-medico.html.
  - Freelancer experiente: R$ 1.500–4.000/mês [C], em https://fernandatavares.ia.br/blog/quanto-custa-marketing-medico.
  - Gestão de redes pequena (até 8 posts): R$ 900–4.000 [C], em https://eclinica.digital/quanto-custa-fazer-servicos-de-marketing-na-area-da-saude/.
- **Ferramentas de IA para Instagram médico já no mercado** (preços autodeclarados nos sites, via busca):
  - **Pulmo**: a partir de R$ 49,90/mês (anual) e R$ 199,90 para 100 posts, "conforme normas CFM", em https://www.pulmo.com.br/
  - **InstaMed**: R$ 97/mês para 8 conteúdos, com checagem de regras de publicidade médica, em https://instamed.temfavo.com/
  - **Doutor Conteúdo**: grátis, R$ 97, R$ 197 e R$ 397, em https://www.doutorconteudo.com.br/
  - **IAPostLab**: a partir de R$ 97, com "motor de ética" CFM/CRO/CFN/CFP/COFFITO, em https://iapostlab.com.br/
  - **ContentFlow**: análise automática de normas do CFM, preço não encontrado, em https://www.flowcontent.com.br/
  - CreatorMed (https://creatormed.ai/) também existe.
- **Software de referência para o médico:** iClinic a partir de R$ 89; Feegow R$ 129–249; Doctoralia R$ 429–679.
- **EUA:** uma pesquisa da Zocdoc indica gasto médio de **US$ 1.371/mês** em marketing por consultório (data não confirmada) [C], em https://thescript.zocdoc.com/?p=17485. A MGMA (2008) aponta mediana de **0,39% da receita** médica em marketing [B, antigo], em https://www.physicianspractice.com/view/setting-marketing-budget.
- **População-alvo:** cerca de **635,7 mil médicos** no Brasil (Demografia Médica 2025), 58% em 48 municípios com mais de 500 mil habitantes [B], em https://medicinasa.com.br/?p=133493 e https://futurodasaude.com.br/?p=35759. Os 6.465 clientes do ano 5 equivalem a cerca de 1% dos médicos. O tamanho do mercado não é a restrição; **disposição a pagar e retenção** é que são.

---

## 6. Compressão de preço por IA

- **Ferramentas de IA a R$ 50–400/mês já entregam a camada de conteúdo, com selo de "conforme CFM".** O plano de entrada do Jalecon (R$ 297) custa de 3 a 6 vezes mais que InstaMed, IAPostLab e Doutor Conteúdo (R$ 97) e Pulmo (R$ 49,90). O checker de compliance, apresentado como diferencial, **já é anunciado** por pelo menos quatro concorrentes (seção 5).
- **Jasper:** corte de pelo menos 30% no forecast de ARR e de 20% no valuation em 2023, depois que o ChatGPT tornou acessível o mesmo modelo de base (seção 1).
- **RevenueCat 2026:** apps de IA convertem mais (8,5% vs 5,6% de trial para pago) mas **retêm pior** (plano mensal com 6,1% de retenção em 12 meses vs 9,5%). É o padrão de "experimenta e cancela" [B], em https://www.revenuecat.com/state-of-subscription-apps.
- **Agências:** pesquisa da Productive (set/2025, 180 agências) diz que **27% já receberam pedido de desconto por causa de IA** e 47% esperam receber [C]. Citada em agregadores de preço de agência como https://www.swydo.com/blog/agency-pricing/ e https://www.hausadvisors.com/blog/ai-adoption-marketing-agencies-statistics. Não foi possível confirmar em qual dessas páginas está, nem a URL primária. Blogs relatam **queda de 20–35% no preço de produção de conteúdo** e preço estável em estratégia e mídia paga [C], em https://www.digitalapplied.com/blog/digital-marketing-pricing-2026-agency-costs.
- **Incumbentes empacotando IA:** o assistente de IA da Doctoralia tem mais de 30 mil médicos pagantes, e a Tebra captou US$ 250M para "AI automation". Quem já tem o médico na base (agenda, prontuário) adiciona IA de marketing como módulo, com CAC próximo de zero.

---

## Premissa do modelo vs. referência encontrada vs. avaliação

| Premissa do modelo | Referência encontrada | Avaliação |
|---|---|---|
| Churn de 5%/mês no plano de R$ 297 (46% ao ano) | Ferramentas de IA concorrentes a R$ 50–100. ARPU US$ 25–100: 6–9%/mês (Paddle/ProfitWell, [C]). ChartMogul: mesmo o top quartil com ARPA < US$ 25 perde cerca de 3,6%/mês. Apps de IA retêm pior (RevenueCat). Vendasta: 30% de retenção em 2 anos para produto único (~4,9%/mês) | **Otimista a realista.** Faixa provável de 5–8%/mês, com risco maior porque o plano compete de frente com ferramentas de R$ 97 |
| Churn de 3%/mês no plano de R$ 697 (31% ao ano) | ARPU US$ 100–250: 7,1%/mês (Baremetrics, [C]). Vendasta, pacotes > US$ 100: 50% ao ano (~5,6%/mês). Recurly B2B: 3,8%. Brasil 2017: 4–5%/mês. Agência em retainer: 1,6–2,4%/mês (com contrato e serviço humano) | **Otimista.** Referência central de 4–6%/mês. 3% só com contrato anual ou lock-in (agenda, CRM, site próprio hospedado) |
| Churn de 2,5%/mês no plano de R$ 1.497 | Agências com retainer: 1,6–2,4%/mês. ChartMogul top quartil com ARPA > US$ 500: ~1,3%/mês. Mas a esse preço o comprador compara com freelancer (R$ 1.500–4.000) e agência (R$ 2.500–8.000) | **Realista** se houver serviço humano junto. Otimista se for só software |
| Churn de 2%/mês em clínicas | ChartMogul ARPA > US$ 500: top quartil ~1,3%, mediana pior. Weave (software operacional) ~0,7% de receita/mês. Agências: 1,3–2,4% | **Realista** (pode ser conservador se o produto se integrar à operação da clínica) |
| CAC pago de R$ 1.800 no ano 1 | Payback mediano de 8–11 meses para ACV < US$ 5k (Benchmarkit), o que implica CAC de R$ 4.500–6.100. CAC/ARR em healthcare SaaS ~1,9x. Brasil SMB via Google e Meta: payback de 18–24 meses ([C]). Ilustração com CPL e conversão: R$ 1.200–5.000 só de mídia | **Otimista.** Payback de 3,2 meses seria top decil. Usar R$ 3.500–6.000 no cenário base, com vendedor ou SDR para os planos ≥ R$ 697 |
| Margem bruta de 77–82% | Weave 71–72% (77% só em assinatura). SaaS típico 75–80%. Agências ~50% (serviço humano). O custo de LLM e de revisão humana de compliance pressiona | **Realista** se for 100% software. **Otimista** se o plano de R$ 1.497 ou o compliance tiverem revisão humana (nesse caso 60–70%) |
| 6.465 clientes no ano 5 | ~1% de 635,7 mil médicos (cabe no mercado). iClinic tinha 23 mil usuários após ~8 anos a cerca de R$ 89+. RD Station tinha 25–30 mil clientes após ~10 anos, em escopo horizontal | **Otimista a realista** em número de logos. Com churn de 4–6%, exige adicionar cerca de 3–4 mil clientes brutos por ano só para manter a base |
| R$ 72M de ARR no ano 5 (ARPA implícito de **R$ 928/mês**, acima do plano principal de R$ 697) | RD Station: ~R$ 200M de receita no ano 10, com ARPA de ~R$ 570–690. Concorrentes de IA cobram R$ 50–400. Doctoralia R$ 429–679 | **Otimista.** O ARPA implícito exige um mix pesado em planos de R$ 1.497 e clínicas, justo o segmento em que o Jalecon compete com agências. R$ 72M em 5 anos seria um resultado top 1% para SaaS vertical SMB no Brasil |

---

## Lições dos análogos

1. **"Marketing para médicos" sozinho raramente vira empresa venture-scale independente.** O PatientPop captou mais de US$ 125M e terminou fundido com um software de faturamento e EHR (Kareo, que virou Tebra), seguido de ondas de demissão. ProSites e Officite foram absorvidos por grupos de software dental. Scorpion virou ativo de PE. Os vencedores (Doctolib, Docplanner, Zocdoc, Weave) venderam **infraestrutura operacional ou pacientes**, não conteúdo.
2. **Médico paga por paciente, não por post.** A Zocdoc só cresceu com lucro depois de trocar a assinatura por pagamento por agendamento novo. Um SaaS que entrega conteúdo e compliance sem medir pacientes gerados terá a mensalidade questionada todo mês.
3. **Retenção alta vem de lock-in operacional.** Weave (~0,7%/mês de perda de receita) tem telefonia e pagamentos embutidos. Marketing local sem contrato tem churn de 40–50% ou mais ao ano (Vendasta, Localogy, Yelp após contratos sem prazo). PatientPop dependia de renovação anual automática, e os reviews mostram atrito justamente aí.
4. **A camada de conteúdo por IA foi comoditizada em menos de 2 anos.** No Brasil já há pelo menos 5 ferramentas de R$ 49,90 a R$ 397 com "checagem CFM". Jasper mostra o que acontece com a camada de IA que só embrulha o modelo de base: forecast -30%, valuation -20% e troca de CEO.
5. **Os incumbentes têm a base e o canal.** A Doctoralia (R$ 429–679, inside sales, Feegow, assistente de IA com mais de 30 mil pagantes) e a Afya/iClinic (268 mil usuários no ecossistema) podem lançar "marketing + compliance" como módulo, com CAC marginal perto de zero. O Jalecon compete por um orçamento que o médico já gasta nesses players.
6. **Escala de referência no Brasil:** a melhor empresa brasileira de marketing para PMEs (RD Station) levou cerca de 10 anos até ~R$ 200M de receita. A maior venda de software para médicos (iClinic) saiu por R$ 182,7M com 23 mil usuários. Uma meta de R$ 72M de ARR em 5 anos num nicho exige execução no topo do topo.
7. **O compliance com a CFM 2.336/2023 é um bom gancho de aquisição, mas fraco como fosso.** As regras são públicas e a checagem por LLM é fácil de replicar. Como diferencial defensável, falta algo como responsabilização jurídica, verificação de CRM ou um histórico auditável.
8. **Implicações para o modelo:** rodar um cenário base com churn de 5–6% (plano de R$ 697), 7% (R$ 297), 3,5% (R$ 1.497) e 2,5% (clínicas), CAC de R$ 4.000–5.000 e margem de 70–75% nos planos com serviço humano. Testar contrato anual pré-pago e um componente de preço por resultado (paciente ou agendamento) para aproximar a retenção da de software operacional.

## Lacunas (não encontrado)
Churn e CAC de iClinic, Feegow, Amplimed, Medicina Direta, Conta Azul e Nuvemshop. Número de médicos pagantes da Doctoralia no Brasil. Receita e número de clientes do PatientPop em 2020–2021. Pesquisa independente sobre gasto mensal de médicos brasileiros com marketing e % que usa agência. CPL B2B (médico como comprador) no Brasil. Relatórios de Distrito, ABStartups e Sales Hackers com churn de SaaS SMB. Os valores atribuídos a Baremetrics, Paddle/ProfitWell e Productive vêm de agregadores e não foram conferidos na fonte primária.
