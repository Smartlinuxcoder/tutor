# Usa l'immagine ufficiale di Bun
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build dell'applicazione
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Genera i tipi di SvelteKit e compila l'app
RUN bun run build

# Immagine di produzione
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copia solo i file necessari per la produzione
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Esponi la porta
EXPOSE 3000

# Avvia l'app
CMD ["bun", "run", "./build/index.js"]