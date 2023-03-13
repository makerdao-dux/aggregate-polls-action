<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Aggregate Poll Action

This GitHub action fetches the poll metadata for each poll in the polling DB, extracts the title and poll type, assigns the corresponding tags to each poll, and finally aggregates all of the polls into a single file, writing it to the disk.

## Inputs

### `network`

**Required** The network from which to fetch polls from, either Mainnet or Goerli. Default: `mainnet`.

### `tags-file`

**Required** The path to the file containing the Poll ID -> Tags mapping, used to assign tags to the polls from the DB. Default: `governance/polls/meta/poll-tags.json`

### `output-file`

**Required** The path and name of the file that will be created containing the aggregated list of polls.

## Example usage

```yaml
uses: makerdao-dux/aggregate-polls-action@v1.1.2
with:
  network: "mainnet"
  tags-file: "governance/polls/meta/poll-tags.json"
  output-file: "governance/polls/meta/polls.json"
```

### Full example: 

```yaml
name: 'Aggregate Polls'
on:
  push:
    branches:
      - master
    paths:
      - governance/polls/**
      - '!governance/polls/meta/polls.json'
  workflow_dispatch:
jobs:
  aggregate_polls:
    runs-on: ubuntu-latest
    name: Aggregates all of the polls into a single file, creating a pull request with the new file.
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.pull_request.head.ref }}
      - name: Upload
        id: upload
        uses: makerdao-dux/aggregate-polls-action@v1.1.2
        with:
          network: 'mainnet'
          tags-file: 'governance/polls/meta/poll-tags.json'
          output-file: 'governance/polls/meta/polls.json'
      - name: Update pull request with polls changes 
        uses: EndBug/add-and-commit@v9
        with:
          author_name: github-actions[bot]
          author_email: github-actions[bot]@users.noreply.github.com
          message: 'Added polls aggregated file'
          add: 'governance/polls/meta/polls.json'
          fetch: false
          push: false
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v4
```

Based on:
- https://github.com/actions/typescript-action
- https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
