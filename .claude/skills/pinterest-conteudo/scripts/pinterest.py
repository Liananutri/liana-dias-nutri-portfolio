#!/usr/bin/env python3
"""Leitura do Pinterest para a skill pinterest-conteudo.

Modos:
  check                         testa API e RSS
  boards                        lista as pastas da conta (API v5)
  pins <board_id>               lista os pins de uma pasta (API v5)
  pin <id_ou_url>               detalhes de um pin (API v5)
  rss <usuario> [pasta]         pins recentes de uma pasta pública (sem token)

Opções: --limit N (padrão 50), --download PASTA (salva as imagens), --json

Token: variável PINTEREST_TOKEN. Na nuvem do Claude Code o proxy injeta o
segredo salvo para api.pinterest.com, então um valor fictício basta.
Só usa a biblioteca padrão.
"""
import argparse
import html
import json
import os
import re
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

API = "https://api.pinterest.com/v5"
UA = "Mozilla/5.0 (compatible; content-research-script)"


def _ctx():
    for var in ("SSL_CERT_FILE", "REQUESTS_CA_BUNDLE", "CURL_CA_BUNDLE"):
        path = os.environ.get(var)
        if path and os.path.exists(path):
            return ssl.create_default_context(cafile=path)
    if os.path.exists("/root/.ccr/ca-bundle.crt"):
        return ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
    return ssl.create_default_context()


CTX = _ctx()


def http_get(url, headers=None, raw=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
    with urllib.request.urlopen(req, context=CTX, timeout=30) as r:
        data = r.read()
    return data if raw else data.decode("utf-8", "replace")


def api_get(path, params=None):
    token = os.environ.get("PINTEREST_TOKEN", "pina_placeholder_injected_by_proxy")
    url = API + path + ("?" + urllib.parse.urlencode(params) if params else "")
    try:
        return json.loads(http_get(url, {"Authorization": f"Bearer {token}", "Accept": "application/json"}))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:300]
        sys.exit(f"ERRO API {e.code} em {path}: {body}\n"
                 "401/403 = token ausente/inválido ou sem escopos boards:read e pins:read.")
    except urllib.error.URLError as e:
        sys.exit(f"ERRO de rede ao acessar api.pinterest.com: {e.reason}\n"
                 "Provável bloqueio de rede do ambiente: libere api.pinterest.com e i.pinimg.com.")


def paged(path, limit):
    out, bookmark = [], None
    while len(out) < limit:
        params = {"page_size": min(100, limit - len(out))}
        if bookmark:
            params["bookmark"] = bookmark
        data = api_get(path, params)
        out += data.get("items", [])
        bookmark = data.get("bookmark")
        if not bookmark:
            break
    return out[:limit]


def best_image(pin):
    imgs = (pin.get("media") or {}).get("images") or {}
    for key in ("originals", "1200x", "600x", "400x300", "150x150"):
        if key in imgs and imgs[key].get("url"):
            return imgs[key]["url"]
    return None


def simplify(pin):
    return {
        "id": pin.get("id"),
        "titulo": pin.get("title") or "",
        "descricao": (pin.get("description") or "")[:300],
        "link_pin": f"https://www.pinterest.com/pin/{pin.get('id')}/" if pin.get("id") else pin.get("link_pin"),
        "link_origem": pin.get("link"),
        "imagem": best_image(pin) or pin.get("imagem"),
        "texto_alternativo": pin.get("alt_text") or "",
        "criado_em": pin.get("created_at"),
    }


def download(pins, folder):
    os.makedirs(folder, exist_ok=True)
    for i, p in enumerate(pins, 1):
        url = p.get("imagem")
        if not url:
            continue
        ext = os.path.splitext(urllib.parse.urlparse(url).path)[1] or ".jpg"
        dest = os.path.join(folder, f"{i:02d}-{p.get('id') or 'pin'}{ext}")
        try:
            with open(dest, "wb") as f:
                f.write(http_get(url, raw=True))
            p["arquivo"] = dest
        except Exception as e:  # segue com os demais
            p["erro_download"] = str(e)


def rss(user, board):
    path = f"{user}/{board}.rss" if board else f"{user}/feed.rss"
    try:
        xml = http_get(f"https://www.pinterest.com/{path}")
    except urllib.error.HTTPError as e:
        sys.exit(f"ERRO RSS {e.code}: confira usuário/pasta (use o trecho da URL, ex.: 'receitas-saudaveis') e se a pasta é pública.")
    except urllib.error.URLError as e:
        sys.exit(f"ERRO de rede ao acessar www.pinterest.com: {e.reason}\nLibere www.pinterest.com e i.pinimg.com.")
    pins = []
    for item in ET.fromstring(xml).iter("item"):
        desc = item.findtext("description") or ""
        m = re.search(r'<img[^>]+src="([^"]+)"', desc)
        img = m.group(1) if m else None
        if img:
            img = re.sub(r"/\d+x/", "/originals/", img)
        link = item.findtext("link") or ""
        pid = re.search(r"/pin/(\d+)", link)
        pins.append({
            "id": pid.group(1) if pid else None,
            "titulo": html.unescape(item.findtext("title") or ""),
            "descricao": html.unescape(re.sub(r"<[^>]+>", " ", desc)).strip()[:300],
            "link_pin": link,
            "imagem": img,
            "criado_em": item.findtext("pubDate"),
        })
    return pins


def pin_id(value):
    m = re.search(r"pin/(\d+)", value)
    return m.group(1) if m else value.strip("/")


def show(rows, as_json, kind):
    if as_json:
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return
    if kind == "boards":
        for b in rows:
            print(f"{b['id']}\t{b.get('pin_count', '?')} pins\t{b.get('privacy', '')}\t{b['name']}")
    else:
        for p in rows:
            print(f"- {p.get('titulo') or '(sem título)'}\n  pin: {p.get('link_pin')}\n  img: {p.get('imagem')}"
                  + (f"\n  arquivo: {p['arquivo']}" if p.get("arquivo") else "")
                  + (f"\n  desc: {p['descricao']}" if p.get("descricao") else ""))
    print(f"\n{len(rows)} itens.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("modo", choices=["check", "boards", "pins", "pin", "rss"])
    ap.add_argument("args", nargs="*")
    ap.add_argument("--limit", type=int, default=50)
    ap.add_argument("--download")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    if a.modo == "check":
        for name, url in (("API", API + "/user_account"), ("RSS", "https://www.pinterest.com/pinterest/feed.rss"),
                          ("Imagens", "https://i.pinimg.com/")):
            try:
                tok = os.environ.get("PINTEREST_TOKEN", "pina_placeholder_injected_by_proxy")
                http_get(url, {"Authorization": f"Bearer {tok}"} if name == "API" else None)
                print(f"{name}: OK")
            except urllib.error.HTTPError as e:
                print(f"{name}: HTTP {e.code}" + (" (rede OK; token ausente/inválido)" if name == "API" and e.code in (401, 403) else " (rede OK)"))
            except Exception as e:
                print(f"{name}: SEM ACESSO ({getattr(e, 'reason', e)})")
        return

    if a.modo == "boards":
        rows = [{"id": b["id"], "name": b.get("name"), "pin_count": b.get("pin_count"),
                 "privacy": b.get("privacy"), "description": b.get("description")}
                for b in paged("/boards", a.limit)]
        return show(rows, a.json, "boards")

    if a.modo == "pins":
        if not a.args:
            sys.exit("Uso: pins <board_id>  (veja os ids com 'boards')")
        rows = [simplify(p) for p in paged(f"/boards/{a.args[0]}/pins", a.limit)]
    elif a.modo == "pin":
        if not a.args:
            sys.exit("Uso: pin <id_ou_url>")
        rows = [simplify(api_get(f"/pins/{pin_id(a.args[0])}"))]
    else:  # rss
        if not a.args:
            sys.exit("Uso: rss <usuario> [pasta]")
        rows = rss(a.args[0], a.args[1] if len(a.args) > 1 else None)[: a.limit]

    if a.download:
        download(rows, a.download)
    show(rows, a.json, "pins")


if __name__ == "__main__":
    main()
