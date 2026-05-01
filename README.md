# jancejka.cz

Jednostránkový rozcestník pro doménu [jancejka.cz](https://jancejka.cz) odkazující na:

- **[saman.jancejka.cz](https://saman.jancejka.cz)** — Šamanismus & Léčení
- **[dev.jancejka.cz](https://dev.jancejka.cz)** — Vývoj & Portfolio

## Stack

- [Astro 6](https://astro.build) — statický generátor, nulový JS na klientu
- [Tailwind CSS v4](https://tailwindcss.com) — přes PostCSS (`@tailwindcss/postcss`)
- [Geist Sans](https://vercel.com/font) — self-hosted variable font
- [BusyBox httpd](https://busybox.net) — minimální HTTP server v Docker obrazu
- [caddy-docker-proxy](https://github.com/lucaslorentz/caddy-docker-proxy) — TLS a reverse proxy

## Lokální vývoj

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # výstup do dist/
npm run preview    # preview buildu
```

## Docker

### Ruční build obrazu

```bash
docker build -t jancejka-cz .
docker run -p 8080:80 jancejka-cz
# http://localhost:8080
```

### CI/CD

Každý push do větve `main` spustí GitHub Actions workflow (`.github/workflows/docker.yml`), který:

1. Sestaví Docker obraz z `Dockerfile`
2. Pushne ho do GitHub Container Registry jako:
   - `ghcr.io/<owner>/<repo>:latest`
   - `ghcr.io/<owner>/<repo>:sha-<commit>`

Autentizace probíhá automaticky přes `GITHUB_TOKEN` — žádný secret není potřeba nastavovat ručně.

## Nasazení na serveru

Předpoklady na serveru:

- Docker + Docker Compose
- běžící `lucaslorentz/caddy-docker-proxy` na externí síti `frontend-proxy`

### 1. Přihlášení do ghcr.io

```bash
echo $CR_PAT | docker login ghcr.io -u <github-username> --password-stdin
```

`CR_PAT` je [GitHub Personal Access Token](https://github.com/settings/tokens) s oprávněním `read:packages`.

### 2. Nasazení

```bash
# Nastav správné jméno obrazu
export GITHUB_REPOSITORY=<owner>/<repo>

docker compose pull
docker compose up -d
```

Nebo uprav `image:` přímo v `compose.yml` a spusť bez proměnné.

### 3. Aktualizace na novou verzi

```bash
docker compose pull
docker compose up -d --remove-orphans
```

### DNS

Doména `jancejka.cz` musí mířit na server. Caddy zajistí TLS certifikát automaticky přes Let's Encrypt.

| Záznam | Typ  | Hodnota             |
|--------|------|---------------------|
| `@`    | A    | `<IP serveru>`      |
| `www`  | CNAME | `jancejka.cz`      |

Pro `www` redirect přidej do `compose.yml` labels:

```yaml
caddy: "jancejka.cz www.jancejka.cz"
caddy.@www.host: www.jancejka.cz
caddy.redir: "@www https://jancejka.cz{uri} permanent"
caddy.reverse_proxy: "{{upstreams 80}}"
caddy.encode: gzip
```

## Struktura projektu

```
├── .github/workflows/docker.yml   # CI/CD pipeline
├── public/fonts/                  # Geist Sans Variable (self-hosted)
├── src/
│   ├── styles/global.css          # Tailwind + šamanská paleta + @font-face
│   └── pages/index.astro          # celá stránka
├── compose.yml                    # Docker Compose pro produkci
├── Dockerfile                     # multi-stage: node:22-alpine → busybox:musl
└── postcss.config.mjs             # Tailwind v4 přes PostCSS
```

## Barevná paleta

Konzistentní s [saman.jancejka.cz](https://saman.jancejka.cz):

| Proměnná          | Hex       | Použití                    |
|-------------------|-----------|----------------------------|
| `--color-ritual`  | `#c2813a` | zlatý jantar — karta Saman |
| `--color-mystic`  | `#7055a8` | fialová — karta Dev        |
| `--color-sage`    | `#4e7969` | šalvějová — rezerva        |
| `--color-copper`  | `#9c5535` | měděná — rezerva           |
