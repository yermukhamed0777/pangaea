# Third-party notices

PANGAEA is not derived from these packages; it depends on them. Their licences
apply to the packages themselves and to any bundled third-party code as described
below. Versions and licence identifiers were read from the installed packages in
`node_modules` on 2026-11-26.

| Package | Installed version | Licence |
|---|---|---|
| next | 16.2.9 | MIT |
| react | 19.2.7 | MIT |
| react-dom | 19.2.7 | MIT |
| framer-motion | 11.18.2 | MIT |
| lucide-react | 0.460.0 | ISC |
| tailwindcss | 3.4.19 | MIT |
| postcss | 8.5.15 | MIT |
| autoprefixer | 10.5.1 | MIT |
| typescript | 5.9.3 | Apache-2.0 |
| @types/node | 20.19.43 | MIT |
| @types/react | 19.2.17 | MIT |
| @types/react-dom | 19.2.3 | MIT |
| eslint (dev) | 10.15.0 | MIT |
| typescript-eslint (dev) | 8.74.0 | MIT |
| cross-env (dev) | 10.1.0 | MIT |
| playwright-core (dev) | 1.65.1 | Apache-2.0 |

The four packages marked `(dev)` are build/test-time only: they are not part of the
browser bundle and require no runtime keys. `playwright-core` drives a browser
already installed on the machine; it does not download one.

The static export under `out/` (generated, not tracked) contains minified copies
of client-side dependencies, including React and framer-motion. Those copies keep
their upstream licences. Full licence texts are available in each package under
`node_modules/<package>/LICENSE*` and in the dependency lockfile `package-lock.json`.

Fonts are loaded at build time by `next/font/google` (DM Sans, Instrument Serif,
JetBrains Mono). They are served as part of the generated site; their upstream
licences should be reviewed before commercial redistribution.
