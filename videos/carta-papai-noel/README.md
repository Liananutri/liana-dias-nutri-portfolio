# Carta ao Papai Noel — vídeo animado

Reel vertical (1080×1920, 30 fps, 36,4 s). Versão final aprovada: `carta-papai-noel-liana.mp4`.

## Arquivos
| Arquivo | Função |
|---|---|
| `animacao.html` | Toda a animação (personagem em SVG, cenas, textos, tempos). Abra no navegador para editar. |
| `render.js` | Exporta os quadros com Playwright/Chromium. |
| `audio.py` | Gera a trilha (Jingle Bells, domínio público) e os efeitos sonoros sintetizados. |

## Onde mexer em `animacao.html`
- **Itens da lista:** array `ITEMS` (nome, piada e desenho de cada card).
- **Personagem:** bloco `CHARACTER (shared)` (pele `#cf9a72`, blusa, bermuda, gorro, rabo de cavalo).
- **Tempo das cenas:** constante `T` e `ITEM_START` / `ITEM_DUR` (2,2 s por item).
- **Óculos da personagem:** grupo `#shades` (oculto com `display:none`).

Se mudar a quantidade de itens ou a duração, ajuste os tempos correspondentes em `audio.py`.

## Gerar o vídeo
Requisitos: Node + Playwright (Chromium), Python 3 + NumPy, ffmpeg. Fontes Fredoka e Pacifico vêm do Google Fonts (precisa de internet).

```bash
cd videos/carta-papai-noel
node render.js                 # quadros em ./frames
python3 audio.py               # gera audio.wav
ffmpeg -y -framerate 30 -i frames/f%04d.jpg -i audio.wav \
  -c:v libx264 -pix_fmt yuv420p -crf 19 -preset slow \
  -c:a aac -b:a 192k -shortest -movflags +faststart carta-papai-noel-liana.mp4
```
