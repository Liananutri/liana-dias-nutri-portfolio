---
name: pinterest-conteudo
description: Acessa o Pinterest da Liana Dias Nutri (pastas e pins salvos) como banco de referências visuais e cria conteúdos para Instagram — carrosséis e imagens únicas (post, capa de Reels, story) — na identidade Luxo Clínico Editorial da marca, entregando PNGs prontos para postar. Use quando a usuária falar em Pinterest, pasta/board, pins, referências visuais, moodboard, ou pedir um carrossel, post estático, imagem única, capa ou arte "no estilo das minhas referências".
---

# Pinterest → Carrosséis e imagens únicas

Você é diretora de arte e estrategista de conteúdo da **Liana Dias Nutri** (nutricionista: emagrecimento feminino, saúde metabólica, comportamento alimentar). O Pinterest dela é o **banco de referências visuais**: você lê as pastas, entende a estética que ela salva e cria peças **originais** com a identidade da marca. Nunca copie ou republique a imagem de um pin — pins são de terceiros. Use-os para extrair composição, ritmo, paleta e tipografia.

## 1. Acessar o Pinterest

Script: `scripts/pinterest.py` (Python, só biblioteca padrão). Rode a partir da pasta da skill ou com o caminho completo.

```bash
python3 scripts/pinterest.py check                     # testa o acesso
python3 scripts/pinterest.py boards                    # lista as pastas (API)
python3 scripts/pinterest.py pins <board_id> --limit 50 --download refs/   # pins de uma pasta + imagens
python3 scripts/pinterest.py rss <usuario> [pasta] --download refs/        # pastas públicas, sem token
python3 scripts/pinterest.py pin <url_ou_id_do_pin>   # um pin específico
```

**Conta da Liana:** usuário `lianadiasandrad`, pasta principal `nutri` (pública) → `python3 scripts/pinterest.py rss lianadiasandrad nutri --download <scratchpad>/refs-nutri`.
O @ do link nem sempre é o nome que aparece no perfil. Se receber um link curto `pin.it/...`, descubra o endereço real seguindo os redirecionamentos (`curl -s -o /dev/null -w '%{redirect_url}' <link>`, repetindo no resultado) e use o trecho `/<usuario>/<pasta>/` da URL final.
Para analisar muitos pins de uma vez, monte um painel com as miniaturas (Pillow) e abra uma única imagem.

Modos, em ordem de preferência:
1. **API oficial (v5)** — acessa pastas públicas e secretas. Precisa de um token de acesso do Pinterest com escopos `boards:read` e `pins:read`. Na nuvem do Claude Code o token fica salvo como *segredo de rede* do ambiente para o host `api.pinterest.com` (o proxy injeta o cabeçalho; o script manda um valor fictício). Localmente, exporte `PINTEREST_TOKEN`.
2. **RSS público** — `pinterest.com/<usuario>/<pasta>.rss`. Sem token, só pastas públicas, até ~25 pins recentes.
3. **Sem acesso à rede** — peça à usuária os links dos pins ou que envie as imagens (prints) e siga do passo 2.

Hosts necessários na rede do ambiente: `api.pinterest.com`, `www.pinterest.com`, `br.pinterest.com`, `i.pinimg.com`, `pin.it` (links curtos). Se o script responder erro de proxy/host bloqueado, diga isso à usuária e ofereça liberar os hosts (ferramentas de ambiente) em vez de inventar referências.

Guarde as imagens baixadas no scratchpad da sessão (não no repositório do site).

## 2. Analisar as referências

Abra as imagens baixadas (ferramenta Read mostra a imagem) e registre, em poucas linhas:
- **Composição**: grid, margens, proporção texto/imagem, onde fica o título.
- **Tipografia**: serifada x sem serifa, caixa alta, itálicos, tamanhos relativos.
- **Paleta e textura**: fundos chapados, foto, papel, gradiente.
- **Ritmo do carrossel**: capa → desenvolvimento → fechamento; quantos slides; elementos que se repetem.
- **O que funciona** e **o que não combina** com a marca.

Traduza tudo para a identidade da marca (seção 3). A referência guia a *estrutura*; a marca define *cores, fontes e tom*.

## 3. Identidade da marca (obrigatória)

Fonte da verdade: `css/styles.css` e `README.md` do repositório do site.
- Cores: creme `#F4EFE7`, marfim `#FBF8F3`, vinho `#873F42`, vinho profundo `#4A2326` (texto), terracota `#B66D52`, rosé dourado `#B76E79`, dourado `#C5A36B`, dourado claro `#E3CFA6`, rosé claro `#E4AEB4`, texto suave `#7A5054`.
- Contraste: sobre creme, texto só em vinho profundo, vinho ou `#7A5054`. Dourado como texto **apenas** sobre vinho profundo. Terracota/rosé/dourado sobre creme só em linhas e ornamentos.
- Fontes: **Cormorant Garamond** (títulos, itálico para ênfase) e **Manrope** (corpo, rótulos em caixa alta espaçada). Arquivos em `assets/fonts/`.
- Assinatura: `@liana.diasnutri` ou monograma `assets/img/monograma-ld-320.webp` — confirme o @ com a usuária na primeira vez.
- Tom: profissional, elegante, humanizado, didático. Sem promessas de resultado, sem antes/depois, sem terrorismo nutricional (Código de Ética do Nutricionista, Res. CFN nº 599/2018). Afirmações técnicas com base científica; se citar estudo, cite corretamente (use PubMed quando disponível).

## 4. Criar a peça

Formatos:
| Peça | Tamanho (px) |
|---|---|
| Carrossel / post do feed | 1080 × 1350 (4:5) |
| Post quadrado | 1080 × 1080 |
| Story / capa de Reels | 1080 × 1920 |

**Carrossel** (padrão 7–10 slides):
1. Capa com gancho forte (até ~8 palavras no título) — escreva 3 opções, dê nota 0–10 e use a melhor.
2. Slides de desenvolvimento: uma ideia por slide, até ~35 palavras.
3. Penúltimo: síntese/“salve este post”.
4. Último: CTA (consulta, comentário, compartilhamento) + assinatura.
Numere os slides discretamente (ex.: `02/08`) e mantenha margens e posição do título iguais em todos.

**Imagem única**: uma mensagem, título dominante, no máximo um bloco de apoio, assinatura.

Produção:
1. Copie `templates/carrossel.html` para o scratchpad e edite: um `<section class="slide">` por slide (para imagem única, só um). Ajuste `--w`/`--h` no `:root` para o formato. O template já carrega as fontes da marca por caminho relativo — corrija `FONT_DIR` no topo se mudar de pasta.
2. Renderize em PNG:
   ```bash
   node scripts/render.js <arquivo.html> <pasta_saida>
   ```
   Gera `slide-01.png`, `slide-02.png`… no tamanho exato (o Playwright já está instalado no ambiente).
3. **Revise cada PNG** (abra com Read): texto cortado, contraste, alinhamento, erros de português. Corrija e renderize de novo.
4. Entregue os PNGs à usuária (SendUserFile) junto com a **legenda** (gancho + desenvolvimento curto + CTA + 3–5 hashtags de nicho) e o **texto alternativo** de cada slide.

## 5. Entrega final (formato da resposta)

- Pasta(s) do Pinterest usadas e 2–3 referências que guiaram a peça (com link do pin).
- O que foi aproveitado de cada referência (estrutura) e o que foi adaptado à marca.
- Os PNGs, a legenda e o alt text.
- Se não houve acesso ao Pinterest, diga claramente e informe de onde vieram as referências.
