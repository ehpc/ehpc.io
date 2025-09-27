# ehpc.io

Hi there! This is the repo for my personal website. :cat:

Hope you find something interesting! :dog:

Also, feel free to check out my [LaTeX resume](https://github.com/ehpc/resume). 

## Frontend Stack

- Package manager: [Bun](https://bun.sh)
- Build tool: [Vite](https://vite.dev/)
- Formatter: [dprint](https://dprint.dev/)
- JS/TS linter: [Oxlint](https://oxc.rs/)
- CSS: [PostCSS](https://postcss.org/) + [Stylelint](https://stylelint.io/)
- Testing framework: [bun:test](https://bun.com/docs/cli/test)
- Git hooks: [husky](https://typicode.github.io/husky/)
- WASM: [wasm-bindgen](https://wasm-bindgen.github.io/wasm-bindgen/)

## Prerequisites

- Node.js 24+ and [bun](https://bun.sh/)
- Rust toolchain ([rustup](https://rustup.rs/)),
  [wasm-pack](https://drager.github.io/wasm-pack/) and wasm32 target
  (`rustup target add wasm32-unknown-unknown`)

## Project Structure

- `src/` – frontend code :baby_chick:
- `wasm/` – WebAssembly modules :crab:
- `public/` – static assets :penguin:

## Release process

A [GitHub Action](https://github.com/features/actions) runs on every push
to test and build the web app.
The resulting container image is published to the GitHub Actions
Container Registry.

A new version is marked with a SemVer tag by running:

```sh
bun pm version <INCREMENT>
```

The site is hosted on my VPS, which runs on
[NixOS](https://nixos.org/). The OS is fully managed through the
[config repo](https://github.com/ehpc/ehpc.io-configs), which serves
as the single source of truth. System changes are applied via:

```sh
git pull
sudo nixos-rebuild switch --flake .#nixos
```

A basic [kubernetes](https://kubernetes.io/) cluster handles load balancing
and application separation. Updating a deployment is as simple as:

```sh
kubectl -n ehpc-io rollout restart deployment <DEPLOYMENT>
```
