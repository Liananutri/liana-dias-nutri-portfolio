# CLAUDE.md — Site Liana Dias Nutri

## Fonte de contexto da marca
O posicionamento, o público, o tom de voz, os serviços e as metas estão no Notion, na página
**"Cérebro da Marca — Liana Dias Nutri"** (https://app.notion.com/p/41d7d198cbf281f0b66eeee694053011).
Leia essa página antes de escrever ou alterar qualquer texto do site. Se ela e este arquivo divergirem, vale o Notion.

## Posicionamento (resumo)
- Eixo principal: **nutrição clínica** (saúde metabólica e intestinal: resistência à insulina, diabetes, climatério, composição corporal, SII).
- Complemento: **comportamento alimentar** (é o método; o clínico é o problema que se resolve).
- Público: mulheres de 20 a 50 anos, que já tentaram várias dietas, em Niterói e São Gonçalo (presencial) ou em qualquer lugar (online).
- Conversão: WhatsApp. O serviço prioritário são os acompanhamentos de 3, 6 e 12 meses.

## Estrutura
Site estático de uma página, sem build e sem dependências. Ver `README.md` para o mapa completo.
- `index.html`: todo o conteúdo; seções marcadas por comentários.
- `css/styles.css`: tokens de cor e fonte em `:root`. Não use cores fora deles.
- `js/main.js`: constante `WHATSAPP`, teste "Qual formato combina com você?" (`RESULTS`) e animações.

## Regras inegociáveis
- **Ética (Res. CFN nº 599/2018):** sem antes e depois, sem promessa de resultado e sem termos milagrosos ("detox", "seque", "queime gordura"). Depoimentos só reais e com autorização por escrito.
- **Preços não aparecem no site.** Valores apenas pelo WhatsApp.
- **Não invente dados** (formação, números, depoimentos, títulos). O que não estiver no Notion, pergunte.
- **Contraste:** texto em vinho profundo `#4A2326`. Dourado, terracota e rosé só em detalhes sobre o creme; dourado como texto só sobre o vinho profundo.
- **Fontes:** Cormorant Garamond (títulos) e Manrope (texto), hospedadas em `assets/fonts/`.
- Mantenha `prefers-reduced-motion`, o layout responsivo e os textos alternativos das imagens.
- Ao mudar textos de posicionamento, atualize também `<title>`, `meta description`, Open Graph e o JSON-LD.
- Ao mudar o número do WhatsApp, atualize os três lugares indicados no `README.md`.

## Pendência conhecida
O site ainda comunica só "nutrição comportamental" (hero, meta description, Open Graph, faixa de palavras, seção Abordagem e Conteúdos).
Ele precisa ser alinhado ao eixo clínico, com o comportamental como complemento.

## Testar
`python3 -m http.server 8000` e abra http://localhost:8000 (com `file://` as fontes não carregam).
Publicação: GitHub Pages, a partir da branch principal.
