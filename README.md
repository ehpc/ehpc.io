# ehpc.io

## Frontend Stack

- Build tool: [Vite](https://vite.dev/)
- Formatter: [dprint](https://dprint.dev/)
- JS/TS linter: [Oxlint](https://oxc.rs/)
- CSS: [PostCSS](https://postcss.org/) + [Stylelint](https://stylelint.io/)
- Testing framework: [Vitest](https://vitest.dev/)
- Git hooks: [husky](https://typicode.github.io/husky/)
- WASM: [wasm-bindgen](https://wasm-bindgen.github.io/wasm-bindgen/)

## Prerequisites

- Node.js 24+ and [bun](https://bun.sh/)
- Rust toolchain ([rustup](https://rustup.rs/)) and wasm32 target
  (`rustup target add wasm32-unknown-unknown`)

## Project Structure

- `src/` – frontend code
- `wasm/` – WebAssembly modules
- `public/` – static assets
