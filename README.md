# Dive GitHub Action

Analyze container image efficiency using [Dive](https://github.com/wagoodman/dive).

## Usage

### Inputs

| Name    | Type   | Required | Default                             | Description                                                                  |
| ------- | ------ | -------- | ----------------------------------- | ---------------------------------------------------------------------------- |
| image   | String | true     |                                     | Container image to analyze                                                   |
| config  | String | false    | `${{ github.workspace }}/.dive-ci`  | Path to [dive config file](https://github.com/wagoodman/dive#ci-integration) |

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
