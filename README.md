# Dive GitHub Action

[![Release][release-badge]][release]
[![GitHub Marketplace][marketplace-badge]][marketplace]

Analyze container image efficiency using [Dive](https://github.com/wagoodman/dive).

## Usage

### Inputs

| Name       | Type   | Required | Default                             | Description                                                                  |
| ---------- | ------ | -------- | ----------------------------------- | ---------------------------------------------------------------------------- |
| image      | String | true     |                                     | Container image to analyze                                                   |
| config     | String | false    | `${{ github.workspace }}/.dive-ci`  | Path to [dive config file](https://github.com/wagoodman/dive#ci-integration) |
| exit-zero  | String | false    | `false`                             | Whether to force exit with zero even when scan fails ("true"/"false")        |

### Outputs

| Name                | Description                 |
| ------------------- | --------------------------- |
| efficiency          | Efficiency of the image     |
| wasted-bytes        | Number of wasted bytes      |
| user-wasted-percent | Percentage of space waster  |

### Example

```yaml
name: "Example Workflow with Dive"

on: [push]

jobs:
  sample-workflow:
    runs-on: ubuntu-latest
    name: Analyze image efficiency using Dive
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Analyze image efficiency
        uses: MartinHeinz/dive-action@v0.1.0
        with:
          image: 'ghcr.io/github-username/some-image:latest'
          config: ${{ github.workspace }}/.dive-ci
```

## Development

Install and build:

```bash
npm install
npm run build
```

Package and release:

```bash
npm i -g @vercel/ncc

npm run build
ncc build --source-map --license LICENSE
git commit -m "..."
git tag -a -m "..." vX.Y.Z
git push --follow-tags
```

[release]: https://github.com/MartinHeinz/dive-action/releases/latest
[release-badge]: https://img.shields.io/github/release/MartinHeinz/dive-action.svg?logo=github&color=green
[marketplace]: https://github.com/marketplace/actions/dive-container-image-analysis
[marketplace-badge]: https://img.shields.io/badge/marketplace-dive--container--image--analysis-green?logo=github
