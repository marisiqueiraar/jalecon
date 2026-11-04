# MVP ao vivo: roteiro dos 5 minutos

O MVP é o protótipo funcional descrito na Ficha 3, agora como versão web (menu lateral com o ciclo completo). Na banca, mostramos um fluxo só, do diagnóstico ao painel, sem passear por todas as telas. As demais (Estúdio, IA revisa IA, revisão do médico, biblioteca normativa, agenda, validação, viabilidade e piloto) ficam para a arguição: no modo banca, o botão "Ver o menu completo" abre todas.

**Endereço:** https://jalecon.vercel.app/?banca=1 (abre direto na demonstração guiada; sem `?banca=1`, o botão "Ver funcionando" leva ao mesmo lugar).

A demonstração conta uma história só, em 9 cenas. À direita, um celular mostra o que o paciente (ou o gestor) vê; à esquerda, o que acontece na clínica. Para avançar: botão da cena seguinte, a barra de cenas no topo ou as setas do teclado. A plataforma completa (Estúdio, IA revisa IA, revisão do médico, biblioteca normativa, agenda, validação, viabilidade e piloto) fica em "Explorar a plataforma", para a arguição.

## Antes de começar (no intervalo das 20h15)

1. Abrir o endereço acima no Chrome do computador que vai ao projetor. Testar a internet da sala.
2. Tela cheia (F11) e zoom em 100%. Conferir se o celular aparece inteiro.
3. Clicar em **Recomeçar**, no topo. Isso apaga qualquer teste anterior e carrega a clínica de exemplo.
4. Deixar o vídeo de 60 segundos aberto numa segunda aba, como plano B.
5. Combinar quem clica e quem fala. Sugestão: uma pessoa clica e outra narra.

## As 9 cenas (cerca de 5 minutos)

| Cena | O que clicar | O que falar (curto) |
|---|---|---|
| 1. O problema | Nada: as mensagens da Ana aparecem sozinhas no celular. | "Hoje a captação da clínica passa por várias soluções: a agência cuida dos posts, os anúncios trazem cliques, a recepção cuida do WhatsApp e a agenda é outro sistema. São boas soluções, mas nem sempre conectadas. A Ana escreve na hora do almoço e, no dia seguinte, já marcou em outro lugar. Na nossa pesquisa, 70% dos pacientes já desistiram de um médico por demora." |
| 2. Estúdio | Nada: os agentes trabalham e o Instagram do Dr. Rafael se preenche. | "A Jalecon cria o mês de cada médico, com marca própria e no tom dele. Antes de ir ao ar, tudo passa pelos revisores e pelo Guardião, que já marcou o que não pode ser publicado." |
| 3. Médico revisa | No celular do médico: **mais curto** e **mais acolhedor**. | "O Dr. Rafael não escreve nem posta: recebe o mês no celular e pede ajustes em português. Cada pedido vira preferência, e o mês seguinte já sai assim. É o que nenhuma agência faz." |
| 4. Guardião | **Aplicar as sugestões do Guardião** e depois **Aprovar o mês como diretora técnica**. | "Este post promete eliminar a dor de vez. O Guardião bloqueia, explica a regra do CFM e sugere a troca. Só a diretora técnica aprova, e a decisão fica registrada: é a proteção dela no CRM." |
| 5. Sua vez | Pedir uma frase a alguém da banca e digitar. | "Alguém nos dita uma frase de anúncio?" Se ninguém sugerir, usar os exemplos. O celular mostra o resultado enquanto se digita. |
| 6. Google | Nada até a busca terminar; depois tocar em **Agendar pelo WhatsApp** no celular. | "A Ana viu o post do Dr. Rafael sobre dor no joelho e pesquisou o nome dele. Achou o perfil no Google, com nome, CRM e RQE, que a Jalecon criou e mantém." |
| 7. WhatsApp | No celular, nas sugestões: a primeira mensagem da Ana; depois **"Particular. Será que é menisco?…"**; depois **"Pode ser. Tem horário esta semana?"**; escolher um horário. | "O agente responde em segundos, como uma boa recepção: uma mensagem por vez. Pergunta se é particular ou convênio, não dá diagnóstico (o Guardião mostra a regra), e só depois oferece os horários livres do Dr. Rafael. À esquerda, o horário entra na agenda e a recepção recebe o resumo em uma frase." Se a banca quiser, digitar "qual remédio posso tomar?", "quero falar com uma pessoa" ou "dor no peito". |
| 8. Véspera | No celular: **1 · Confirmo**. À esquerda: **Oferecer o horário**. No celular do Marcos: **1 · Quero o horário**. | "Na véspera, cada paciente recebe o lembrete. Quem não pode ir libera o horário, e a lista de espera ocupa a vaga. Na pesquisa, todos os que faltaram disseram que esqueceram ou que era difícil desmarcar." |
| 9. Do post à consulta | Nada. No fim, **Ver a proposta para a clínica**. | "Este é o ponto central: como a Jalecon cuida de tudo, o gestor vê a jornada inteira da Ana, do post do dia 12 até a consulta de R$ 450, e quais posts de cada médico viram paciente. Nenhuma agência enxerga a agenda, e nenhum robô de WhatsApp sabe qual post trouxe o paciente. O WhatsApp é a porta de entrada; o produto é a captação inteira num lugar só." |

## Sobre a cena das 22h47

A demonstração usa 12h40 (hora do almoço) de propósito. Na pesquisa com pacientes, só 2 de 27 (7%) fizeram o primeiro contato fora do horário comercial (P3, corte de 25%: não passou). O argumento do WhatsApp é a velocidade da resposta (P2: 70% já desistiram por demora), em qualquer horário.

## O que é real e o que é simulado (para a arguição)

- **Roda de verdade no navegador:** o cálculo do raio-x, o Guardião (as regras do CFM, a marcação dos trechos e as sugestões), a aprovação com registro, a conversa do WhatsApp gravando na agenda, a confirmação com lista de espera e o resumo do que aconteceu na demonstração.
- **Simulado:** os números do "mês 3 do piloto" no painel (calculados a partir do diagnóstico, não medidos), os dados da clínica e dos médicos (fictícios), o Estúdio e os revisores (modelos e regras, não IA generativa) e o WhatsApp, que reconhece intenções por regras em vez de usar IA.
- **Real:** as 39 regras do Guardião e os números da pesquisa (placar recalculado das respostas da planilha, em Bastidores → Validação).
- **Se perguntarem "o WhatsApp é IA?":** "Neste protótipo, o agente reconhece intenções por regras, para a demo ser previsível; vocês podem escrever o que quiserem. No piloto, é um agente de IA com as mesmas regras do Guardião e supervisão humana, ligado ao WhatsApp Business da clínica."
- **Se perguntarem "e se o Guardião errar?":** "Ele não decide sozinho: quem aprova é o diretor técnico. As regras estão sendo validadas por um advogado de direito médico, e o protótipo avisa quais ainda estão em validação."

## Plano B: vídeo de 60 segundos

Gravar a tela seguindo o mesmo fluxo, mais rápido (Windows: Win + Alt + R pela Xbox Game Bar; Mac: Cmd + Shift + 5). Sem áudio, porque a fala é ao vivo.

| Tempo | Tela |
|---|---|
| 0 a 6 s | Cena 1: as mensagens da Ana sem resposta |
| 6 a 14 s | Cena 2: o Instagram do Dr. Rafael se preenchendo |
| 14 a 26 s | Cena 3: post bloqueado → Aplicar as sugestões → Aprovar |
| 26 a 34 s | Cena 5: busca no Google → Agendar pelo WhatsApp |
| 34 a 48 s | Cena 6: conversa até a consulta marcada e o horário na agenda |
| 48 a 55 s | Cena 7: lembrete, vaga e lista de espera |
| 55 a 60 s | Cena 8: resumo da semana no celular do gestor |

Antes de gravar, clicar em "Recomeçar". Salvar o arquivo no computador da apresentação e no Drive (pasta "10 · Entregas da disciplina").
