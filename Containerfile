ARG BUN_VERSION=1.2.22
ARG RUST_TOOLCHAIN_VERSION=1.89
ARG WASM_PACK_VERSION=0.13.1
ARG WASM_BINDGEN_VERSION=0.2.103
ARG WASM_OPT_VERSION=0.116.1
ARG CADDY_VERSION=2.10.2

# Prepare toolchain

FROM docker.io/rust:${RUST_TOOLCHAIN_VERSION}-trixie AS toolchain-rust
ARG WASM_PACK_VERSION
ARG WASM_BINDGEN_VERSION
ARG WASM_OPT_VERSION

RUN rustup target add wasm32-unknown-unknown
RUN cargo install wasm-pack --version ${WASM_PACK_VERSION}
RUN cargo install wasm-bindgen-cli --version ${WASM_BINDGEN_VERSION}
RUN cargo install wasm-opt --version ${WASM_OPT_VERSION}

FROM toolchain-rust AS toolchain
ARG BUN_VERSION

RUN curl -fsSL https://bun.sh/install | bash -s -- bun-v${BUN_VERSION}
ENV BUN_INSTALL="/root/.bun" 
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Install dependencies

FROM toolchain AS deps
WORKDIR /app

RUN mkdir ./wasm
COPY package.json bun.lock ./
COPY ./wasm/Cargo.toml ./wasm/Cargo.lock ./wasm/
COPY ./wasm/src ./wasm/src

RUN bun install --frozen-lockfile
RUN cargo fetch --manifest-path wasm/Cargo.toml

# Run tests

FROM deps AS test
WORKDIR /app
COPY . .

RUN bun test:all

# Build WASM

FROM test AS build-wasm
WORKDIR /app

RUN bun build:wasm

# Build Vite app

FROM build-wasm AS build
WORKDIR /app

RUN bun build:vite

RUN curl --version

# Run app with Caddy

FROM docker.io/caddy:${CADDY_VERSION}-alpine AS runtime
LABEL io.containers.autoupdate=registry
LABEL org.opencontainers.image.title="ehpc's personal website" \
      org.opencontainers.image.description="My personal website" \
      org.opencontainers.image.source="https://github.com/ehpc/ehpc.io"
      org.opencontainers.image.url="https://ehpc.io"
      org.opencontainers.image.vendor="ehpc"
      org.opencontainers.image.version="v2.0.0"
      org.opencontainers.image.licenses="MIT"

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80
