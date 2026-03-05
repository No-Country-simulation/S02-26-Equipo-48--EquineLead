# Build Stage
FROM rust:1.83-slim as builder

WORKDIR /usr/src/app
COPY . .

# Instalar dependencias necesarias para la compilación (si las hay)
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Compilar la aplicación en modo release
RUN cargo build --release

# Runtime Stage
FROM debian:bookworm-slim

WORKDIR /usr/local/bin

# Instalar dependencias de ejecución (openssl es necesaria para reqwest)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiar el binario desde la etapa de construcción
COPY --from=builder /usr/src/app/target/release/equine_lead_e48 .
COPY --from=builder /usr/src/app/.env.example ./.env

CMD ["./equine_lead_e48"]
