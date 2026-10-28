# Jalecon

Projeto do Grupo 1 da disciplina Digital Innovation Strategy (Insper, 2026).

**O que é (Fichas 2 e 3, entregues):** uma equipe de captação e atendimento para clínicas de 5 a 10 médicos, operada por agentes de IA e supervisionada por um especialista: conteúdo de cada médico, WhatsApp com agendamento e painel de contatos por canal e por médico, com cada peça conferida nas regras do CFM pelo Guardião e aprovada pelo diretor técnico. Planos por porte: Essencial R$ 2.900, Pro R$ 4.900 e Rede R$ 8.900 por mês. O MVP é o protótipo funcional publicado em jalecon.vercel.app, a ser validado num piloto pago com 3 a 5 clínicas.

## O que vale nota (e é só nisso que trabalhamos)

| Entrega | Peso | Onde | Situação em 28/10 |
|---|---|---|---|
| Fichas 1 a 4 | 40% | `fichas/` e Drive | 1, 2 e 3 entregues; 4 preenchida, em revisão do grupo |
| Lauda ABNT | 20% | a criar | aguardando as instruções da disciplina |
| Banca: pitch de 8 min, MVP ao vivo (5 min) e arguição (10 min) | 40% | `banca/` | a preparar; plano em `banca/README.md` |

## Pastas

| Pasta | O que tem |
|---|---|
| `fichas/` | Ficha 3 como foi entregue (PDF) e Ficha 4 no modelo da disciplina (.docx). As Fichas 1 e 2 estão no Drive. |
| `banca/` | Plano do pitch e do MVP ao vivo: deck de 8 minutos, roteiro da demo, vídeo de 60 segundos e perguntas da arguição. |
| `validacao/` | Pesquisa com médicos e gestores (perguntas, critérios fixados antes, mensagens de WhatsApp) e o Apps Script que grava as respostas na planilha. |
| `referencias/` | Fontes para o pitch e a arguição: mercado e concorrência, o memorando que explica a saída do médico individual para clínicas, notas de pesquisa (concorrência, regulação, benchmarks) e a base de regras do Guardião. |
| `site/` | Publicado na Vercel. O MVP (`index.html`, com o Guardião em `guardiao.js` e `guardiao-regras.js`), a pesquisa (`/pesquisa`), o manual da marca (`/marca`) e logos para baixar (`/arquivos`). |
| `02_identidade/` | Logos e diretrizes de marca. |
| `arquivo_v0/` | O que não usamos mais: a v0 (15/10) e as análises da v1 (19 a 26/10). Só registro. |

## Links

- MVP: https://jalecon.vercel.app
- Pesquisa (link único para médicos e gestores): https://jalecon.vercel.app/pesquisa
- Drive: pasta "10 · Entregas", com as fichas, a planilha da pesquisa e as referências

## Rodar o MVP localmente

Abra `site/index.html` no navegador. Não há etapa de build. Os dados de clínicas e médicos são fictícios; as regras do Guardião são reais.
