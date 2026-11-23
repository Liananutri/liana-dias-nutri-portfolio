# Liana Dias Nutri — site institucional

Site de uma página (HTML, CSS e JavaScript puros, sem dependências) com a identidade **Luxo Clínico Editorial**.

## Estrutura

```
index.html            todo o conteúdo, com as seções comentadas
css/styles.css        cores, fontes e layout (tokens no topo, em :root)
js/main.js            menu do celular, animações e links do WhatsApp
assets/img/           foto, logo, monograma e imagem de compartilhamento
assets/fonts/         Lora e Poppins (hospedadas no próprio site, licença SIL OFL)
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

Paleta (Cérebro da Marca, Notion): vinho `#3B0F1B`, vinho profundo `#4A1728`, texto `#2A0A13`, terracota `#C1694F`, rosé dourado `#B76E79`, dourado `#E8C877`, creme `#FDF6ED` e marfim `#FBF8F3`. Tipografia: Lora itálico nos títulos e Poppins no texto.
Os tons `--rose-claro`, `--rose-palido`, `--dourado-claro` e `--texto-suave` são derivados, só para texto legível sobre fundos escuros ou como texto secundário.
Contraste conferido sobre o creme: texto 17:1 · vinho 15,4:1 · vinho profundo 13,6:1 · texto secundário `#6E3A4A` 8,3:1. Dourado sobre o vinho profundo: 9:1.
Terracota (3,5:1), rosé dourado (3,3:1) e dourado (2,1:1) são usados só em linhas, ornamentos e detalhes sobre o creme. O dourado aparece como texto apenas sobre o vinho profundo (5,7:1).
As animações são desativadas quando o sistema está configurado para reduzir movimento.
