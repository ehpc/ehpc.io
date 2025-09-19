ARG APP_VERSION=dev
ARG BUN_VERSION=1.2.22
ARG RUST_TOOLCHAIN_VERSION=1.89
ARG WASM_PACK_VERSION=0.13.1
ARG WASM_BINDGEN_VERSION=0.2.103
ARG BINARYEN_VERSION=version_124
ARG CADDY_VERSION=2.10.2

# Prepare toolchain

FROM docker.io/rust:${RUST_TOOLCHAIN_VERSION}-trixie AS toolchain-rust
ARG WASM_PACK_VERSION
ARG WASM_BINDGEN_VERSION
ARG BINARYEN_VERSION

RUN rustup target add wasm32-unknown-unknown
RUN curl -L --proto '=https' --tlsv1.2 -sSf --retry 5 --retry-delay 2 \
    https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh \
    | bash
RUN cargo binstall wasm-pack --version ${WASM_PACK_VERSION}
RUN cargo binstall wasm-bindgen-cli --version ${WASM_BINDGEN_VERSION}
RUN set -Eeuo pipefail; curl -L --retry 5 --retry-delay 2 \
    https://github.com/WebAssembly/binaryen/releases/download/${BINARYEN_VERSION}/binaryen-${BINARYEN_VERSION}-x86_64-linux.tar.gz \
    -o /tmp/binaryen.tar.gz && tar -xz --strip-components=1 -C /usr/local -f /tmp/binaryen.tar.gz

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

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    cargo fetch --manifest-path wasm/Cargo.toml

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

# Run app with Caddy

FROM docker.io/caddy:${CADDY_VERSION}-alpine AS runtime
ARG APP_VERSION
LABEL io.containers.autoupdate=registry
LABEL org.opencontainers.image.title="ehpc's personal website"
LABEL org.opencontainers.image.description="My personal website"
LABEL org.opencontainers.image.source="https://github.com/ehpc/ehpc.io"
LABEL org.opencontainers.image.url="https://ehpc.io"
LABEL org.opencontainers.image.vendor="ehpc"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.version="${APP_VERSION}"

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80
