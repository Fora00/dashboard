# Icon build

`build-icons.mjs` renders `public/icons/*` (app icon, maskable, apple-touch, per-project tiles)
from `choice.json` and the Lucide SVGs. It is run manually; outputs are committed. `sharp` is
deliberately not a repo dependency.

```sh
mkdir -p /tmp/icon-env && (cd /tmp/icon-env && npm init -y && npm i sharp lucide-static)
NODE_PATH=/tmp/icon-env/node_modules \
LUCIDE_DIR=/tmp/icon-env/node_modules/lucide-static/icons \
node scripts/icons/build-icons.mjs
```
