# Dive GitHub Action

Install and build:

```bash
npm install
npm run build
```

Package and release:

```bash
npm run build
ncc build --source-map --license LICENSE
git commit -m "..."
git tag -a -m "..." vX.Y.Z
git push --follow-tags
```
