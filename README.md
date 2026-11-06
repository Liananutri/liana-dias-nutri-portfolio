# Liana Dias Nutri — site institucional

Site de uma página (HTML, CSS e JavaScript puros, sem dependências) com a identidade **Luxo Clínico Editorial**.

## Estrutura

```
index.html            todo o conteúdo, com as seções comentadas
css/styles.css        cores, fontes e layout (tokens no topo, em :root)
js/main.js            menu do celular, animações e links do WhatsApp
assets/img/           foto, logo, monograma e imagem de compartilhamento
assets/fonts/         Cormorant Garamond e Manrope (hospedadas no próprio site)
assets/icons/         favicon e ícone para iPhone
robots.txt, sitemap.xml
```

## Como atualizar

| O que mudar | Onde |
|---|---|
| Textos de qualquer seção | `index.html` (procure o comentário com o nome da seção) |
| Número do WhatsApp | `js/main.js`, constante `WHATSAPP` (o número também aparece escrito no botão de contato e no JSON-LD do `index.html`) |
| Mensagem pré-preenchida de cada botão | atributo `data-wa="..."` do link em `index.html` |
| Cores | `css/styles.css`, bloco `:root` |
| Posts do Instagram | `index.html`, seção Conteúdos: descomente a grade `post-grid` e preencha |
| Teste "Qual formato combina com você?" | Perguntas em `index.html` (seção Serviços, `#teste`); sugestões e regra de pontuação em `js/main.js` (`RESULTS`) |
| Depoimentos | `index.html`: remova `hidden` da seção `#depoimentos`. Publique **apenas relatos reais, com autorização por escrito** e em conformidade com o Código de Ética do Nutricionista (Res. CFN nº 599/2018) |

## Ver localmente

```
python3 -m http.server 8000
```
Abra `http://localhost:8000`. Abrir o arquivo direto no navegador (`file://`) impede o carregamento das fontes.

## Publicar (GitHub Pages)

Settings → Pages → *Deploy from a branch* → escolha a branch e a pasta `/ (root)`.

Ao ligar um domínio próprio, substitua `https://liananutri.github.io/liana-dias-nutri-portfolio/` pelo novo endereço em `index.html` (canonical, Open Graph e JSON-LD), `robots.txt` e `sitemap.xml`.

## Acessibilidade e cores

Paleta: vinho `#873F42`, terracota `#B66D52`, rosé dourado `#B76E79`, dourado `#C5A36B` e creme `#F4EFE7`, com o vinho profundo `#4A2326` (tom escuro do vinho) para o texto.
Contraste conferido sobre o creme: vinho profundo 11,8:1 · vinho 6,5:1 · texto secundário `#7A5054` 5,9:1.
Terracota (3,5:1), rosé dourado (3,3:1) e dourado (2,1:1) são usados só em linhas, ornamentos e detalhes sobre o creme. O dourado aparece como texto apenas sobre o vinho profundo (5,7:1).
As animações são desativadas quando o sistema está configurado para reduzir movimento.
