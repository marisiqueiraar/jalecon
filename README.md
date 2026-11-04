# Jalecon

Projeto do Grupo 1 da disciplina Digital Innovation Strategy (Insper, 2026).

**O que é (Fichas 2 e 3, entregues):** uma equipe de captação e atendimento para clínicas de 5 a 10 médicos, operada por agentes de IA e supervisionada por um especialista: conteúdo de cada médico, WhatsApp com agendamento e painel de contatos por canal e por médico, com cada peça conferida nas regras do CFM pelo Guardião e aprovada pelo diretor técnico. Planos por porte: Essencial R$ 2.900, Pro R$ 4.900 e Rede R$ 8.900 por mês. O MVP é o protótipo funcional publicado em jalecon.vercel.app, a ser validado num piloto pago com 3 a 5 clínicas.

## O que vale nota (e é só nisso que trabalhamos)

| Entrega | Peso | Onde | Situação em 28/10 |
|---|---|---|---|
| Fichas 1 a 4 | 40% | `fichas/` e Drive | 1, 2 e 3 entregues; 4 preenchida, em revisão do grupo |
| Lauda ABNT | 20% | a criar | aguardando as instruções da disciplina |
| Banca: pitch de 8 min, MVP ao vivo (5 min) e arguição (10 min) | 40% | `banca/` | deck, demo e roteiros prontos; falta validação final, vídeo e ensaio (`banca/README.md`) |

## Pastas

| Pasta | O que tem |
|---|---|
| `fichas/` | Ficha 3 como foi entregue (PDF) e Ficha 4 no modelo da disciplina (.docx). As Fichas 1 e 2 estão no Drive. |
| `banca/` | Plano do pitch e do MVP ao vivo: deck de 8 minutos, roteiro da demo, vídeo de 60 segundos e perguntas da arguição. |
| `validacao/` | Pesquisa com médicos e gestores (perguntas, critérios fixados antes, mensagens de WhatsApp), o Apps Script que grava as respostas na planilha e o roteiro da pesquisa com pacientes. |
| `referencias/` | Fontes para o pitch e a arguição: mercado e concorrência, o memorando que explica a saída do médico individual para clínicas, notas de pesquisa (concorrência, regulação, benchmarks) e a base de regras do Guardião. |
| `site/` | Publicado na Vercel. A versão web do MVP (`index.html`, ver abaixo), a pesquisa (`/pesquisa`), o manual da marca (`/marca`) e logos para baixar (`/arquivos`). |
| `02_identidade/` | Logos e diretrizes de marca. |
| `arquivo_v0/` | O que não usamos mais: a v0 (15/10), as análises da v1 (19 a 26/10) e a demo em formato de celular (`demo_clinica_celular/`, até 04/11). Só registro. |

## Links

- MVP: https://jalecon.vercel.app
- Pesquisa (link único para médicos e gestores): https://jalecon.vercel.app/pesquisa
- Drive: pasta "10 · Entregas", com as fichas, a planilha da pesquisa e as referências

## O MVP: versão web para clínicas

Plataforma web (não app) com todas as funções do pitch e das fichas para testar. Menu lateral em quatro blocos:

| Bloco | Telas | De onde vem |
|---|---|---|
| Ciclo Jalecon | 1 Anamnese e raio-x · 2 Estúdio (marca, conteúdo do mês, site, Google, campanha) · 3 IA revisa IA · 4 Médico revisa (conversa com o Redator, preferências aprendidas) · 5 Guardião e aprovação do diretor técnico · 6 Pulso (painel por canal e por médico) | Slides "A solução" e "Como funciona" |
| Atendimento | WhatsApp em que você escreve como paciente (agenda, preço, convênio, recusa de diagnóstico, urgência, passagem para pessoa) · Agenda com confirmação e lista de espera | Slides "Proposta de valor" e "MVP ao vivo"; Ficha 3, seção 4 |
| Guardião | Teste ao vivo · Biblioteca normativa (39 regras, 12 em validação) · Trilha de auditoria exportável | Slide "Guardião" |
| Bastidores · banca | Validação (placar calculado das respostas da pesquisa, dito × feito, resumo para o slide) · Viabilidade (conta de padeiro editável, concorrência) · Piloto e pedido | Fichas 3 e 4; slides de viabilidade, piloto, validação e pedido |

- **Ver como:** gestor, diretor técnico ou médico. Só o diretor técnico aprova; só o médico autor revisa a própria peça.
- **Modo banca:** `jalecon.vercel.app/?banca=1` troca o menu pelo roteiro de 5 minutos com cronômetro (`banca/Roteiro_MVP_ao_vivo.md`).
- **Modo entrevista:** `?entrevista=1` ou a chave no menu esconde os preços.
- **Premissas do raio-x:** editáveis e com a fonte de cada uma. O padrão usa a pesquisa com pacientes (7% dos contatos fora do horário, P3); a hipótese do pitch (35%) fica a um clique.
- **Dados da pesquisa:** `site/pesquisa-dados.js` guarda só campos fechados e anonimizados da planilha "02 · Entrevistas v1 · placar das hipóteses" (coleta até 03/11). Para atualizar, troque os registros e o placar se recalcula.

Arquivos: `web-base.js` (núcleo, menu, papéis, banca), `web-ciclo.js`, `web-operacao.js`, `web-banca.js` (telas), `web.css`; motores sem IA paga em `guardiao.js`, `conteudo.js` (Estúdio), `revisao.js` (conversa com o Redator), `critica.js` (IA revisa IA), `atendimento.js` (WhatsApp), `clinica-dados.js`, `negocio.js` e `pesquisa-dados.js`.

## Rodar localmente

Na pasta `site/`, rode `python3 -m http.server` e abra `http://localhost:8000`. Não há etapa de build. Clínica, médicos e pacientes são fictícios; as regras do Guardião e os dados da pesquisa são reais.
