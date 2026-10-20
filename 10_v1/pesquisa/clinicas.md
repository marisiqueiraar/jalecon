# Jalecon: pesquisa para o pivô para clínicas

Data da pesquisa: 20/10/2026. Método: 45 buscas na web (WebSearch). WebFetch e curl não funcionam neste ambiente, então **nenhuma página foi lida na íntegra**. Os números abaixo vêm dos trechos e resumos que o buscador mostrou, sempre com o link de origem. Este arquivo complementa `benchmarks.md`, `concorrencia.md` e `regulatorio.md` e não repete o que já está lá, a não ser quando o dado é necessário para a conta.

Recorte avaliado: clínicas médicas privadas de 2 a 15 médicos (depois redes e clínicas odontológicas), comprando marketing + atendimento de leads no WhatsApp + conformidade com o CFM por cerca de R$ 2.900 a R$ 8.900 por mês.

Legenda de confiança: **[A]** fonte primária ou oficial (norma, filing, release de RI, órgão público); **[B]** imprensa, relatório de mercado ou estudo acadêmico; **[C]** blog, fornecedor ou dado autodeclarado. **Estimativa** = conta minha, com a premissa explícita.

---

## 1. Tamanho do mercado

### 1.1 Clínicas médicas (CNPJ e CNES)
- **CNPJs nas CNAEs de atividade médica ambulatorial (8630-5/01, 8630-5/02 e 8630-5/03):** **291.362 clínicas registradas, incluindo 17.481 filiais**, em todos os municípios do país. São Paulo (capital) tem 33.193, Rio de Janeiro 16.845 e Salvador 6.328. Foram abertas **42.717 clínicas em 2022** [B, Sebrae, artigo de 20/01/2023, base Receita Federal], em https://www.sebraepr.com.br/comunidade/artigo/sebrae-em-dados-clinicas-medicas
  - Leitura: esse número **não mede clínicas de verdade**. A maioria é CNPJ de um médico só, aberto para faturar como PJ (plantão, consultório). A pesquisa anterior já tinha achado cerca de 215 mil CNPJs ativos só na 8630-5/03 ("restrita a consultas"), ver `03_Mercado_e_Concorrencia.html`. O médico não pode ser empresário individual nem MEI nessas CNAEs, então abre sociedade limitada unipessoal (SLU) [C], em https://www.contabilizei.com.br/contabilidade-online/medico-empresario-individual/
  - Separação por CNAE (quantos em 01, 02 e 03) e por porte: **não encontrado**. Contagem atual nas bases de Econodata, Empresômetro ou Casa dos Dados: **não apareceu nas buscas**.
- **CNES (estabelecimentos de saúde cadastrados):**
  - Total nacional de "Clínica/Centro de especialidade", "Policlínica" e "Consultório isolado" por natureza jurídica: **não encontrado** (só existe no TabNet/DataSUS, que não abre aqui).
  - Ponto de referência estadual: a **Bahia** passou de 20.154 estabelecimentos em 2022 para **23.094 em out/2025**. Os consultórios isolados foram de 4.426 para **5.585** e as clínicas/centros de especialidade de 4.568 para **5.200** [B, Bahia Notícias com relatórios do CNES/MS], em https://www.bahianoticias.com.br/saude/noticia/32853-estabelecimentos-de-saude-crescem-na-bahia-e-chegam-a-23-mil-cadastros-consultorios-clinicas-e-farmacias-puxam-alta
  - **Estimativa (minha):** a Bahia tem cerca de 7% da população e cerca de 4–5% dos médicos do país. Extrapolando as 5.200 clínicas/centros de especialidade, o Brasil teria entre **75 mil e 125 mil** estabelecimentos desse tipo, somando públicos e privados. É uma conta grosseira, só para ordem de grandeza.
  - Dado antigo: **15,4 mil clínicas médicas privadas e filantrópicas** no CNES/SUS em 2016 [B, KPMG, antigo e limitado a quem se relaciona com o SUS], em https://assets.kpmg.com/content/dam/kpmg/pdf/2016/03/mercado-imobiliario-medico.pdf. A KPMG descreve o setor como muito descentralizado e pouco profissionalizado.
  - O CNES **subconta o setor privado**: um estudo da UFSC achou **68,5% dos estabelecimentos privados de saúde com CNPJ ativo fora do CNES** [B], em https://repositorio.ufsc.br/handle/123456789/229890
- **Registro de pessoas jurídicas nos CRMs:** toda empresa privada que presta assistência médica tem de se registrar no CRM (Res. CFM 1.980/2011, Leis 6.839/1980 e 9.656/1998) [A], em https://www.contabeis.com.br/legislacao/185661/resolucao-cfm-1980-2011/. **O número total de PJs registradas nos CRMs não foi encontrado**. Seria o melhor denominador do mercado; vale pedir por LAI ao CFM.
- **Médicos sócios de empresas (Demografia Médica 2025):** percentual **não encontrado** nos trechos. O dado próximo é que **48% dos médicos trabalham sem contrato formal** (eram 30% em 2015) [B, Medway, resumo da DMB 2025], em https://www.medway.com.br/conteudos/como-esta-o-mercado-e-a-remuneracao-na-medicina/
- **Distribuição por porte** (número de médicos ou de funcionários por clínica): **não encontrada** em nenhuma fonte. Um painel (Caravela) fala em "11,3 mil estabelecimentos com empregos formais" em clínicas médicas, mas o número coincide com o total do Espírito Santo no painel do Sebrae-ES (11.311 empresas) e pode ser um recorte estadual. **Não usar** [C], em https://www.caravela.info/setores/cl%C3%ADnicas-m%C3%A9dicas
- **Clínicas que atendem majoritariamente particular:** percentual **não encontrado**. Há só sinais indiretos (ver 2.1: 75% investem em anúncios pagos).

### 1.2 Clínicas odontológicas
- **CNPJs na CNAE 8630-5/04 (atividade odontológica):** cerca de **191,7 mil estabelecimentos ativos** com essa atividade principal, com média de 2 CNAEs secundárias (as mais comuns: imagem sem tomografia, 9,73%, e prótese dentária, 8,78%) [B, Sebrae, sem data clara], em https://sebraepr.com.br/comunidade/artigo/sebrae-em-dados-atividades-odontologicas. Assim como na medicina, boa parte deve ser de um dentista só.
- **Dentistas:** um estudo cita **333.030 cirurgiões-dentistas registrados** (ano não informado no trecho) e outro cita 311.980 generalistas e 113.386 inscrições de especialistas [B, artigos acadêmicos com dados do CFO], em https://seer.atitus.edu.br/index.php/JOI/article/download/1340/pdf_10. A pesquisa anterior usava "mais de 450 mil" (fonte secundária). **O número oficial atual do CFO não foi confirmado.**
- **EPAOs (Entidades Prestadoras de Assistência Odontológica) registradas no CFO:** **não encontrado**. O registro é obrigatório (Res. CFO 63/2005) [A], em https://www.legisweb.com.br/legislacao/?id=102684. A Res. CFO 277/2025 classificou os ambientes de assistência odontológica por complexidade [B], em https://legismap.com.br/conteudos/artigos-e-noticias/cfo-esclarece-valorizacao-cfo-publica-resolucao-que-regulamenta-os-ambientes-de-trabalho-na-odontologia
- **Sinal de densidade digital:** a Clinicorp (software para clínicas odontológicas e estéticas) diz atender **mais de 30 mil clínicas** (ver seção 3). Isso indica que existem, no mínimo, algumas dezenas de milhares de clínicas odontológicas estruturadas o bastante para pagar software.

---

## 2. Gasto e dor

### 2.1 Quanto as clínicas investem em marketing
- **Panorama das Clínicas e Hospitais 2025 (Doctoralia + Feegow):** **74% das clínicas investem em marketing digital**, mas **só 24% têm estratégia estruturada de conversão e gestão da jornada do paciente**. **59% dos gestores têm como prioridade aumentar o faturamento** [B, pesquisa de parte interessada divulgada pela imprensa], em https://www.abcdacomunicacao.com.br/clinicas-com-faturamento-anual-entre-r-6-milhoes-e-r-40-milhoes-seguem-padroes-de-gestao-ainda-pouco-comuns-na-saude/. A edição de 2024 ouviu 1.048 clínicas e hospitais nos 26 estados.
- **Panorama 2026 (639 gestores e profissionais em 26 estados):** **75% investem em anúncios pagos**, **85% usam o Instagram** e **67% nunca mapearam a jornada do paciente** [B], em https://medicinasa.com.br/?p=163779 e https://medicinasa.com.br/?p=167547
- **Gasto em reais ou em % do faturamento:** **não encontrado** em nenhuma pesquisa. O relatório completo da Doctoralia só é entregue a quem respondeu.
- **Preços de mercado (todos de fornecedores, [C]):**
  - Agências para médico solo ou clínica pequena: R$ 2.500–8.000/mês sem mídia (já documentado em `concorrencia.md`, seção 4d). Para agência especializada e boutique de saúde, as faixas publicadas vão até **R$ 12.000–15.000/mês** (FarmaCerto R$ 4.000–12.000; Fernanda Tavares R$ 3.500–15.000).
  - Gestor de tráfego: fee fixo de **R$ 500 a R$ 5.000/mês**, até mais de R$ 15.000 para operação grande; alternativa de **10–20% da verba de mídia** [C, Trafius, mai/2026], em https://trafius.com.br/blog/preco-de-gestor-de-trafego-em-2026-tabela-por-porte
  - **MedLeads** (tráfego, chatbot e qualificação com IA): R$ 3.997–6.497/mês, mais mídia [C], em https://www.medleads.app/
  - **CRC (central de relacionamento) interna:** vagas de clínica odontológica pagam **R$ 1.750–2.000 brutos/mês** para quem faz do primeiro contato ao agendamento [C, InfoJobs], em https://www.infojobs.com.br/vaga-de-crc-consultor-relacionamento-o-cliente-em-sao-paulo__10719190.aspx. **Estimativa:** com encargos e benefícios, o custo de uma CRC CLT fica em cerca de R$ 3.000–3.800/mês, e uma clínica que atende das 7h às 21h precisaria de duas.
  - **Leitura:** uma clínica que hoje paga agência (R$ 3.000–8.000) + secretária com IA (R$ 450–1.000, seção 3) + uma CRC (R$ 3.000–3.800) gasta **cerca de R$ 6.500 a R$ 12.800/mês** nas funções que a Jalecon quer juntar. Esse é o valor de referência para o pacote de R$ 2.900–8.900 (estimativa a partir de preços [C]).

### 2.2 Perda de leads, tempo de resposta e conversão
- **Dificuldade de captar:** em pesquisa da Conclínica com clínicas privadas, **60% dizem que atrair pacientes novos é difícil** e **42,2% têm dificuldade de confirmar consultas** [B, Medicina S/A], em https://medicinasa.com.br/agendamento-consultas/
- **Fora do horário:** reportagem do Estado de Minas (ago/2026) com o título "Metade dos pacientes busca atendimento fora do expediente" [B, só título e trecho vistos], em https://www.em.com.br/mundo-corporativo/2026/08/amp/7475195-metade-dos-pacientes-busca-atendimento-fora-do-expediente.html
- **Confirmação por WhatsApp:** **83% das clínicas confirmam consultas pelo WhatsApp** (edição anterior do Panorama Doctoralia, ano não identificado) [B], em https://medicinasa.com.br/?p=104722
- **Tempo de resposta:** **não encontrei pesquisa de cliente oculto com clínicas brasileiras.** Os fornecedores repetem que responder em até 5 minutos dá **até 21 vezes mais conversão** do que responder depois de 30 minutos (estudo MIT/InsideSales, antigo e de outro contexto) e que "78% compram de quem responde primeiro" (sem fonte primária) [C], em https://www.aurorainbox.com/pt/2026/03/04/tempo-de-resposta-impacto-nas-vendas/ e https://www.clint.digital/blog/?p=2740
- **Conversão de lead em agendamento:** o único número achado é da agência DigiOdonto: **18,6% com CRC humana + IA contra 11,8% sem processo estruturado** (dados internos, sem amostra divulgada, odontologia) [C], em https://www.abcdacomunicacao.com.br/por-que-seguidores-nao-garantem-agenda-cheia-o-paradoxo-da-visibilidade-sem-conversao-em-clinicas-de-saude/
- **Custo por agendamento com robô:** caso publicado pela Cloudia (Avelar Odontologia): **747 agendamentos pelo robô a R$ 15,40 cada** [C, case do fornecedor], em https://cloudia.com.br/cases-de-sucesso/case-avelar-odontologia/

### 2.3 Faltas (no-show)
- **Panorama 2026 (Doctoralia + Feegow):** **34% das clínicas e hospitais têm no-show acima de 11%**. O não comparecimento é o **5º maior desafio de gestão**, citado por 17% [B], em https://medicinasa.com.br/?p=163779
- **Linx (via Medicina S/A):** faltas de cerca de **24% de fevereiro a novembro** e perto de **40% em dezembro e janeiro** [B/C, levantamento de fornecedor], em https://medicinasa.com.br/?p=79276
- **Botdesigner (chatbots):** média de **20% ao mês** de no-show, sem metodologia [C], em https://www.bnews.com.br/noticias/economia-e-mercado/atendimento-virtual-aumenta-receita-de-hospitais-revela-pesquisa-veja-numeros.html
- **Clínicas sem tecnologia:** **8,5% a mais de absenteísmo** [B/C, título da Medicina S/A], em https://medicinasa.com.br/?p=106267
- **SUS (referência pública):** 27,5% num município do RS em 2024 (41.966 faltas em 158.508 consultas) [B, acadêmico], em https://www.publicacoeseventos.unijui.edu.br/index.php/conintsau/article/download/27042/25594/63517. Revisões citam 25% no SUS e 32% na atenção básica do Rio [B], em https://revistas.usp.br/rmrp/article/download/159626/154332/356524
- **Valor da perda:** a Medicina S/A estimou até **R$ 144 mil/ano** por clínica na Grande SP, com 30 faltas/mês × R$ 300 (conta da redação, não pesquisa) [C], em https://medicinasa.com.br/agendamento-consultas/
- **Síntese:** para clínica privada, a faixa defensável é **10% a 25% de no-show**, mais alta nas férias. Reduzir faltas é um ganho fácil de medir e serve para provar o ROI do produto.

---

## 3. Concorrentes para clínicas

| Player | O que entrega | Preço | Tração / sinais | Confiança e fonte |
|---|---|---|---|---|
| **Cloudia** | Secretária virtual com IA no WhatsApp, atendimento 24h, agendamento, lembretes; integra com Feegow | A partir de **R$ 449,90/mês** com **200 contatos únicos**; agendamento pela IA só no plano **Elite**; implantação a partir de **R$ 700**; **R$ 200/mês por número de WhatsApp adicional**; anual com 8–16% de desconto | Fundada em mar/2016; finalista do BNDES Garagem. Clientes autodeclarados conflitantes: "1.000+ clínicas" (site), "1.500+" (pesquisa anterior), "6.000 estabelecimentos" (página de vagas antiga). **Aporte não encontrado** | [C] https://cloudia.com.br/planos/ ; https://cloudia.com.br/blip-para-clinicas-ou-cloudia-qual-escolher/ ; https://www.cloudia.com.br/sobre-nos/ ; https://www.cloudia.com.br/trabalhe-conosco/ |
| **Clinicorp** | Gestão de clínicas odontológicas e estéticas, meios de pagamento, CRM de leads, campanhas, WhatsApp, IA e agentes | Standard R$ 149,90–159,90; Premium R$ 369,90; CRM avulso R$ 69,90; WhatsApp R$ 0,30/crédito (já em `concorrencia.md`) | **Mais de 30 mil clínicas** e **mais de R$ 10 bi em pagamentos** em ~7 anos (jan/2026); "57 mil profissionais impactados" (Reclame Aqui). Fundada em 2017 (SC). Série A em fev/2022, total captado de **US$ 16,66M** (Caplight; as bases divergem) | [B] https://startupi.com.br/?p=196323 ; [C] https://www.caplight.com/company/clinicorp ; https://www.cbinsights.com/company/clinicorp ; https://www.reclameaqui.com.br/empresa/clinicorp/ |
| **Doctoralia (planos de clínica) + Feegow** | Marketplace, agenda, Noa (IA), gestão de clínica (Feegow), campanhas por e-mail e SMS | Plano de clínica no Brasil **não encontrado**. Um agregador estrangeiro cita cerca de **€ 129/mês por clínica** e € 69 por profissional (não é tabela brasileira) [C]. Feegow: R$ 129–249 por profissional (`benchmarks.md`) | Feegow: **mais de 70 mil profissionais e mais de 9 mil unidades** (2026, autodeclarado; eram 40 mil e 5 mil na aquisição) | [C] https://zoftwarehub.com/products/doctoralia/pricing ; [B/C] https://medicinasa.com.br/?p=167547 |
| **iClinic (Afya)** | Prontuário e agenda, iClinic Marketing (e-mail) | R$ 99–299 por profissional (`concorrencia.md`) | Churn e número de clínicas: **não encontrado** | ver `concorrencia.md` |
| **Amplimed** | Gestão, portal de agendamento, Amélia Copilot | A partir de R$ 89 por profissional | **Não encontrado** | ver `concorrencia.md` |
| **Amigo Tech** | Agenda, prontuário, faturamento, contabilidade e conta digital para clínicas | Não encontrado | **R$ 160M (~US$ 33M) da Riverwood Capital** (minoritário), jan/2024. Clientes: não encontrado | [B/A] https://www.riverwoodcapital.com/rwcm_news/amigo-tech-raises-30-million-from-riverwood-capital-to-modernize-empower-medical-practices-in-brazil/ |
| **Simples Dental** | Software de gestão odontológica (freemium na origem) | Não encontrado | A Dental Cremer comprou 40% no ano seguinte à fundação; faturava R$ 1M e mirava R$ 2M em 2017. **Dados atuais não encontrados** | [B, antigo] https://consumidormoderno.com.br/startup-odontologia-faturam-1-milhao/ |
| **MedLeads** | Tráfego pago, anúncios, chatbot, qualificação com IA | R$ 3.997 / R$ 6.497 mais mídia | Clínicas atendidas: **não encontrado** | [C] https://www.medleads.app/ |
| **Healo** | CRM e WhatsApp com IA para consultórios | Ticket médio de R$ 407 | 21 pagantes em 2 meses (`concorrencia.md`) | [B] |
| **Clinia** | IA para clínicas de saúde | Não encontrado | **Captou R$ 2M com a ABSeed** | [B] https://startups.com.br/negocios/clinia-capta-r-2m-com-abseed-para-levar-ia-a-clinicas-de-saude/ |
| **GestãoDS + CESAR** | Desenvolvimento de agentes de IA para gestão de clínicas | Não encontrado | Parceria anunciada | [B] https://www.baguete.com.br/public/noticias/gestaods-e-cesar-vao-desenvolver-agentes-de-ia |
| **Outras secretárias com IA e plataformas de WhatsApp** (clina.ai, Wati, Aurora Inbox, Botconversa, Blip) | Chatbot e agendamento no WhatsApp | clina.ai: base grátis e módulos avulsos; Aurora Inbox: US$ 99–329/mês. Preço da "Laura" e do Botconversa para clínicas: **não encontrado** | Não encontrado | [C] https://www.capterra.com/p/10049959/clina-ai/ ; https://www.aurorainbox.com/pt/?p=38229 |
| **Agências focadas em clínicas** | Marketing, às vezes com CRC | R$ 2.500–15.000/mês | Agência do Médico "+1.856 clínicas e consultórios"; Future "+300 clínicas"; KOP "+100" (autodeclarado, `concorrencia.md`). DigiOdonto vende "CRC humano + IA" para odonto | [C] |

**Quem já junta marketing + atendimento + agenda?**
- **Ninguém encontrado** junta, em uma oferta para clínica médica, (i) geração de demanda (conteúdo e mídia paga), (ii) atendimento de leads no WhatsApp com IA, (iii) agenda e (iv) conformidade com o CFM.
- Os mais próximos atacam pedaços diferentes: **MedLeads** (mídia + chatbot, sem agenda nem compliance declarado); **Clinicorp** (gestão + CRM + WhatsApp + IA, com marketing só para a base, foco odonto); **Doctoralia + Feegow** (marketplace + agenda + gestão + IA, sem marketing de marca própria); **Cloudia** (atendimento + agenda, sem marketing); agências tipo **DigiOdonto** (marketing + CRC, serviço humano).
- **Risco:** Clinicorp e Doctoralia/Feegow já têm a agenda e o cadastro do paciente, que é onde está o lock-in. Para elas, adicionar "marketing com IA" é um módulo. Para a Jalecon, entrar em agenda é construir ou integrar com o sistema de gestão que a clínica já usa (Feegow, iClinic, Amplimed, Clinicorp).
- **Nos EUA, o mesmo movimento:** em 2025 a Birdeye se reposicionou como "Agentic Marketing Platform", com agentes de IA autônomos (BirdAI) [C], em https://yespress.io/birdeye-qualified-opposite-roads-ai-future

---

## 4. Retenção e vendas B2B

### 4.1 Churn de software e serviço vertical para clínicas
- **Weave (2025):** **GRR de 89%** e **NRR de 93%** em 31/12/2025, piorando em relação a 2023–2024 (GRR 92%, NRR 95–98%) [A, release do 4T25 e 10-K], em https://www.businesswire.com/news/home/20260218591820/en/Weave-Announces-Fourth-Quarter-and-Full-Year-2025-Financial-Results/ e https://www.sec.gov/Archives/edgar/data/1609151/000160915126000016/weav-20251231.htm. GRR de 89% ao ano equivale a **cerca de 1,0% de perda de receita por mês** (conta minha). Mesmo um software dentro da operação (telefone, mensagens, pagamentos) perde ~11% da receita por ano.
- **Tebra/PatientPop, Birdeye, Podium:** churn **não divulgado**. Podium: só estimativas de sites de "template de business model", sem valor [C].
- **iClinic, Clinicorp, Feegow, Amplimed:** churn **não encontrado** (não divulgam).
- **Referências já levantadas** (`benchmarks.md`): agências com retainer têm 1,6–2,4%/mês; SMB SaaS com ARPA acima de US$ 500 tem ~1,3%/mês no top quartil; marketing local sem contrato tem 4–6%/mês.

### 4.2 Produtividade de vendas e ciclo
- **Benchmarks brasileiros com números:** **não encontrei** os dados de reuniões por SDR, fechamentos por executivo ou ciclo em dias em Meetime, RD Station, Reev, Exact Sales ou Ramper. O que apareceu:
  - **Inside Sales Benchmark Brasil (edição 2021, dados de 2020):** **turnover médio de vendedores de 55%** nas operações brasileiras [B, PDF do Sebrae], em https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/d1b610935f6b287105fdd7789a58772c/$File/31648.pdf
  - **Panorama de Vendas RD Station (3ª edição, dados de 2023):** **74% das empresas não atingiram os resultados esperados** [B], mesma fonte agregada acima.
  - **Salários no Brasil (2026):** SDR de **R$ 3.500–7.000 + comissão**; closer de **R$ 6.000–15.000 + bônus** [C, blog de plataforma de vendas], em https://jobrise.io/pt/blog/brazil-sales-development-representative-application-guide-2026/
  - Um currículo-exemplo cita **12 reuniões qualificadas por mês** para SDR B2B outbound [C], mesma fonte.
- **Benchmarks dos EUA (Bridge Group, via blogs de fornecedores) [C]:** SDR outbound marca **12–15 reuniões qualificadas por mês** (top performers 20+); SDR inbound **20–25 por mês**. Atingimento de cota: **SDR ~68%**; **AE caiu de 66% (2022) para 51% (2024)**. Média de 40–50 ligações por dia e ~4,4 conversas de qualidade, em https://prospeo.io/s/outbound-sdr-metrics e https://www.11x.ai/tips/sdr-metrics
- **CAC payback:** o "ótimo" varia de **2 meses (self-serve) a 9 meses (enterprise)**, segundo análise com dados da Maxio [C], em https://www.saashero.net/strategy/maxio-cac-benchmarks-b2b-saas/. A mediana Benchmarkit para ACV abaixo de US$ 5 mil é de 8–11 meses (`benchmarks.md`). Um blog brasileiro sugere 5–7 meses [C], em https://germanoinsights.substack.com/p/metricas-saas-guia-completo
- **Ciclo de venda para clínicas no Brasil:** **não encontrado**. Healthcare SaaS nos EUA cita 2–3 trimestres para consultórios (`benchmarks.md`, [C]).

---

## 5. Regulatório específico de clínicas

### 5.1 Res. CFM 2.336/2023: publicidade de estabelecimentos
- **Conteúdo obrigatório:** a publicidade de hospitais, clínicas e demais estabelecimentos deve trazer o **nome do estabelecimento**, o **número de registro no CRM**, o **nome do diretor técnico com o CRM dele** e, quando o estabelecimento for de especialidade, o **RQE** [B, resumo da Demarest], em https://www.demarest.com.br/publicidade-medica-nas-redes-sociais-resolucao-cfm-traz-atualizacoes/. `regulatorio.md` atribui essa regra ao **art. 5º** [C pelo resumo da Abrasso]. **O número do artigo continua sem conferência no PDF oficial**.
- **Pessoa jurídica também é alvo das vedações:** o art. 11 abre com "É vedado ao médico e, **naquilo que couber, às pessoas jurídicas**, entes sindicais e associativos" [C, `regulatorio.md`]. Ou seja, as proibições (promessa de resultado, sensacionalismo, sorteio, venda casada) valem para a página da clínica.
- **Código de Ética Médica, art. 117, parágrafo único:** anúncios de estabelecimentos de saúde devem trazer nome e CRM do **diretor técnico** [A, `regulatorio.md`].
- **Base da responsabilidade:** os considerandos da 2.336 citam a **Res. CFM 2.147/2016** (deveres do diretor técnico) [B], em https://www.demarest.com.br/?p=146352
- **Responsabilidade da PJ nos casos de publicidade:** o trecho específico **não foi encontrado**.

### 5.2 Res. CFM 2.147/2016: diretor técnico
- A norma trata de **responsabilidade, atribuições e direitos de diretores técnicos, diretores clínicos e chefias de serviço** [A], em https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2016/2147_2016.pdf e https://www.legisweb.com.br/legislacao/?id=330399
- A assistência médica e as condições técnicas de atendimento nas instituições públicas ou privadas são **responsabilidade do diretor técnico e do diretor clínico, que respondem perante o CRM** [A/B, CFM], em https://portal.cfm.org.br/noticias/divulga-cfm-no-amazonas-debate-atribuicoes-e-direitos-de-diretores-tecnicos-e-clinicos/
- **Publicidade:** material do CFM sobre os deveres do diretor técnico lista a obrigação de **"assegurar que as propagandas institucionais obedeçam"** à resolução de publicidade (na época, a 1.974/2011, hoje substituída pela 2.336/2023) [B, apresentação do CFM via resumo de busca]. **O artigo exato da 2.147 não foi confirmado**.
- Uma nota técnica do CFM de 2026 confirma que o diretor técnico segue sob a 2.147/2016 [A, via busca], em https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2026/2467_2026.pdf (o número do arquivo sugere uma Res. CFM 2.467/2026, não verificada).
- **Implicação para o produto:** na clínica, o comprador (sócio ou gestor) e o responsável ético (diretor técnico) podem ser pessoas diferentes. O Guardião passa a ser uma ferramenta **do diretor técnico**: histórico de aprovação por peça, CRM do DT em todo anúncio, trilha de auditoria. É um argumento de venda mais forte na clínica do que no médico solo.

### 5.3 Punições por publicidade de clínica
- Um julgado do **TRF-1** registra que o **CRM-MG instaurou vários processos administrativos contra uma clínica** pela possível prática de infração em publicidade [B, via resumo de busca; o buscador não deixou claro de qual link veio o trecho, sendo o mais provável] https://www.cjf.jus.br/cjf/outras-noticias/2010/marco-1/artigo-do-crm-mg-nao-teve-aptidao-para-causar-dano-moral (notícia de 2010). Mostra que o CRM processa a clínica, além do médico.
- Caso de **censura pública a diretor técnico** achado (Santa Casa de Campo Grande, confirmada pelo CFM em mar/2025), mas o motivo foi **assistencial, não publicidade** [B], em https://www.campograndenews.com.br/cidades/capital/diretor-da-santa-casa-sofre-censura-publica-por-infracao-etica
- **Caso noticiado de diretor técnico punido por publicidade da clínica: não encontrado.** Os casos de publicidade em `regulatorio.md` são de médicos pessoa física.

### 5.4 Res. CFM 2.460/2026 (cashback e vantagens vinculadas à contratação de médicos): **existe e está confirmada**
- **Datas:** assinada em **21/05/2026**, publicada no DOU em **15/06/2026**, com vigência imediata [A, portal do CFM e PDF oficial], em https://portal.cfm.org.br/noticias/cfm-proibe-cashback-e-vantagens-economicas-vinculadas-a-contratacao-de-medicos e https://portal.cfm.org.br/wp-content/uploads/2026/06/2460_2026.pdf
- **O que proíbe:** o médico não pode **pagar, receber ou conceder vantagem econômica vinculada a vagas, escalas, plantões ou indicação de serviços**, como devolução de parte da remuneração, **comissões, "cashback" e bonificações** [A].
- **Alcance:** a infração **independe da forma jurídica** e alcança empresas intermediadoras, **plataformas digitais** e cooperativas, além do médico que intermedia, facilita ou se beneficia [A/B], em https://portal.afya.com.br/saude/cfm-proibe-comissoes-e-bonificacoes-na-contratacao-de-medicos
- **Exceção:** o art. 6º trata de remunerações previstas formalmente em contrato (trecho cortado, **ler o texto completo**).
- **Sanção:** infração ética, que pode chegar à cassação (Lei 3.268/1957) [B].
- **Por que importa para a Jalecon:** um escritório diz que a norma "alcança a **economia da indicação em saúde**" [B/C], em https://lexlegal.com.br/?p=75156. **Interpretação a validar com advogado:** programas de indicação que paguem médicos por trazer outras clínicas, ou que deem ao médico comissão por paciente encaminhado, ficam em zona de risco. Cobrar da clínica por resultado (lead ou consulta agendada) é outra relação (fornecedor e cliente PJ), mas precisa de parecer.

---

## 6. Análogos e saídas

### 6.1 EUA
- **Weave (2025):** receita de **US$ 239,0M (+17%)**, margem bruta GAAP de **72,1%** (71,4% em 2024), **39.625 locations** (+4.628 líquidas no ano), NRR de 93% e GRR de 89% [A], em https://www.businesswire.com/news/home/20260218591820/en/Weave-Announces-Fourth-Quarter-and-Full-Year-2025-Financial-Results/
  - **ARPA (estimativa minha):** US$ 239M ÷ média de ~37,3 mil locations ÷ 12 ≈ **US$ 530/mês por location** (cerca de R$ 2.900/mês, ao câmbio de ~R$ 5,5, também estimativa).
  - **Valor de mercado:** **US$ 507–583M em ago/2026** [C, agregadores de cotação], em https://public.com/stocks/weav/market-cap e https://fintel.io/s/us/weav. O Yahoo mostrava **EV/receita de 1,62x** num momento anterior [C], em https://ca.finance.yahoo.com/quote/WEAV. A ação caiu cerca de 63% em 12 meses até fev/2026 [C]. **Leitura:** software de comunicação para clínicas, com 72% de margem e crescimento de 17%, vale **~1,6–2x a receita** em bolsa hoje.
- **Birdeye:** passou de US$ 100M de ARR em jun/2023 com menos de US$ 10M de queima de caixa desde a fundação [A, blog da própria empresa], em https://birdeye.com/blog/celebrating-100m-arr-milestone/. Diz ter **mais de 150 mil negócios** como clientes em 2025 e cerca de 1.100 funcionários [C], em https://yespress.io/birdeye.md. ARR de 2025: **não encontrado**.
- **Podium:** receita e ARR oficiais de 2025 **não encontrados**. As estimativas que aparecem (US$ 120M, US$ 470M) vêm de sites de template e **não devem ser usadas** [C].
- **Tebra/PatientPop:** ver `benchmarks.md` (US$ 250M de financiamento em dez/2025, mais de 140 mil profissionais).

### 6.2 Brasil
- **Feegow → Doctoralia:** comprada em **jul/2022**, por **valor não divulgado**. A DNA Capital era investidora da Feegow. O CEO Silvio Maia ficou [B], em https://www.baguete.com.br/noticias/doctoralia-adquire-feegow e https://startups.com.br/negocios/doctoralia-compra-brasileira-feegow-e-mira-gestao-para-clinicas/. Hoje: 70 mil+ profissionais e 9 mil+ unidades [C].
- **iClinic → Afya:** **R$ 182,7M** em out/2020, com 23 mil usuários ativos (`benchmarks.md`). Isso dá **~R$ 7.900 por usuário** (conta minha). Receita na aquisição e múltiplo: **não encontrados**.
- **Clinicorp:** Série A em 2022, com total de **~US$ 16,66M** captado (Caplight; PitchBook e CB Insights divergem) [C]. 30 mil+ clínicas e R$ 10 bi+ em pagamentos [B]. Receita: **não encontrada**.
- **Amigo Tech:** **R$ 160M (~US$ 33M)** da Riverwood, jan/2024 [B].
- **Simples Dental:** só o dado antigo da Dental Cremer com 40% (por volta de 2016–2017) [B]. Atual: **não encontrado**.
- **Cloudia:** **aporte não encontrado**. Parece crescer sem venture capital relevante divulgado.
- **Múltiplos de referência:** RD Station a ~9x a receita em 2021 (R$ 1,86 bi ÷ R$ 206M, `benchmarks.md`, outro momento de mercado); Weave a ~1,6–2x hoje. Os múltiplos das transações brasileiras de software para clínicas (Feegow, iClinic) **não foram divulgados**.
- **Leitura das saídas:** os compradores são **plataformas que já têm o profissional** (Doctoralia, Afya) e fundos de growth e PE (Riverwood, DNA Capital). Um ativo "marketing + atendimento para clínicas" seria comprável por Doctoralia/Feegow, Afya/iClinic, Clinicorp, Amigo ou por um consolidador de software de gestão, e mais facilmente se estiver integrado ao sistema de gestão deles.

---

## Implicações para o modelo de clínicas

Todas as faixas abaixo são **estimativas minhas**, a partir dos dados acima. Nenhuma tem fonte direta.

### Número de clínicas endereçáveis

| Recorte | Conservador | Base | Otimista | Como cheguei |
|---|---|---|---|---|
| Clínicas médicas privadas com 2–15 médicos | 30 mil | 45 mil | 70 mil | CNES: ~75–125 mil "clínicas/centros de especialidade" (extrapolação da Bahia), menos públicas, menos clínicas de um médico só. Os 291 mil CNPJs do Sebrae são o teto absoluto e são inflados por PJ de um médico |
| ... dessas, endereçáveis (investem em captação e têm parcela relevante de particular, em cidades com mais de 100 mil habitantes) | **10 mil** | **20 mil** | **35 mil** | 74–75% investem em marketing ou anúncios (Panorama Doctoralia). O filtro de particular e de cidade é suposição (30–50%) |
| Clínicas odontológicas com 2+ dentistas | 25 mil | 40 mil | 60 mil | 191,7 mil CNPJs na 8630-5/04; Clinicorp sozinha tem 30 mil+ clínicas clientes |
| ... dessas, endereçáveis ao ticket de R$ 2.900+ | **8 mil** | **15 mil** | **25 mil** | Odonto é quase todo particular e investe muito em captação, mas o faturamento por clínica é menor. Talvez exija um plano de R$ 1.900–2.900 |

Conta de sanidade: 20 mil clínicas médicas × R$ 4.200 × 12 ≈ **R$ 1,0 bi/ano** de mercado endereçável médico (base). Para R$ 50M de ARR seriam cerca de 1.000 clínicas, ou **5% do endereçável base** (10% no conservador).

### Preço (ARPA mensal)

| | Conservador | Base | Otimista |
|---|---|---|---|
| ARPA médio | R$ 2.900 | R$ 4.200 | R$ 6.000 |
| Justificativa | Ancorado em agência de entrada e MedLeads Starter (R$ 3.997) | Mix de planos de R$ 2.900, R$ 4.900 e R$ 8.900, com a maioria no meio | Redes e clínicas de 10–15 médicos, com cobrança variável por consulta agendada |

Referências: o "custo de substituição" é de ~R$ 6.500–12.800/mês (agência + secretária com IA + CRC). A Weave tem ARPA de ~US$ 530 (~R$ 2.900) só por software. O preço da Jalecon se sustenta se a clínica a vir como **substituta de agência + CRC**, e não como mais um software.

### Churn mensal (logos)

| Conservador | Base | Otimista |
|---|---|---|
| 3,5% | 2,5% | 1,5% |

Referências: Weave ~1,0%/mês de perda de receita, com lock-in de telefonia e pagamentos; agências com retainer de 1,6–2,4%; marketing local sem contrato de 4–6%. O otimista exige integração com a agenda, contrato de 12 meses e ROI medido (consultas agendadas, queda de no-show). Margem bruta: com CRC humana ou gestor de tráfego no pacote, usar **55–65%**, não os 75–80% de software puro.

### CAC e produtividade de vendas

| Parâmetro | Conservador | Base | Otimista |
|---|---|---|---|
| Reuniões realizadas por SDR/mês | 10 | 15 | 22 (com inbound forte) |
| Fechamentos por executivo (AE)/mês | 3 | 5 | 8 |
| Taxa de fechamento das reuniões | 12% | 18% | 25% |
| Ciclo de venda | 90 dias | 45–60 dias | 30 dias |
| CAC por clínica (salários + mídia + eventos) | R$ 20.000 | R$ 12.000 | R$ 6.000 |
| Payback do CAC (sobre o lucro bruto, margem de 60%) | ~11 meses | ~5 meses | ~2 meses |

Premissas: SDR com custo total de R$ 6–12 mil e AE de R$ 12–25 mil por mês (salários de R$ 3,5–7 mil e R$ 6–15 mil mais encargos); 12–15 reuniões por SDR outbound e 20–25 inbound (Bridge Group); atingimento de cota de AE de 51% (Bridge 2024); turnover de vendedores de 55% ao ano no Brasil (Inside Sales Benchmark). O conservador reflete a mediana de payback de 8–11 meses para SaaS de ticket baixo. O base supõe parcerias com softwares de gestão (Feegow, iClinic, Amplimed) e eventos de sociedades médicas.

### O que não foi possível confirmar
1. Total nacional de clínicas no CNES por tipo ("Clínica/Centro de especialidade", "Policlínica", "Consultório isolado") e por natureza jurídica privada.
2. Número de CNPJs ativos por CNAE (8630-5/01, 02, 03 e 04) com data atual, e a distribuição por porte ou número de sócios.
3. Número de pessoas jurídicas registradas nos CRMs (pedir ao CFM por LAI) e de EPAOs registradas no CFO.
4. Percentual de médicos sócios de empresas (Demografia Médica 2025) e de clínicas que atendem majoritariamente particular.
5. Gasto das clínicas com marketing em reais ou em % do faturamento (o Panorama Doctoralia só diz quem investe, não quanto).
6. Pesquisa independente de tempo de resposta no WhatsApp e de conversão de lead em consulta em clínicas médicas.
7. Preços dos planos de clínica da Doctoralia no Brasil, da "Laura" e do Botconversa para clínicas, e o número de clínicas atendidas pela MedLeads.
8. Churn de iClinic, Clinicorp, Feegow, Amplimed, Tebra, Birdeye e Podium.
9. Benchmarks brasileiros de produtividade de SDR e AE, ciclo de venda e taxa de conversão (Meetime, RD Station, Reev, Exact Sales, Ramper). Os números dos EUA vêm de blogs que citam a Bridge Group.
10. Número dos artigos da Res. CFM 2.336/2023 (estabelecimentos) e da Res. CFM 2.147/2016 (publicidade institucional), e o texto completo do art. 6º da Res. CFM 2.460/2026.
11. Caso noticiado de diretor técnico punido por publicidade da clínica.
12. Valor da compra da Feegow, receita e múltiplo da iClinic na aquisição, aportes da Cloudia e dados atuais da Simples Dental.
