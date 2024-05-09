import * as core from '@actions/core'
import { createHash } from 'crypto'
import { writeFileSync } from 'fs'

import { SupportedNetworks } from './constants'
import fetchGithubPolls from './fetchGithubPolls'
import fetchSpockPolls from './fetchSpockPolls'
import { parseGithubMetadata } from './parseGithubMetadata'

async function run(): Promise<void> {
  try {
    const pollTagsFilePath = core.getInput('tags-file')
    const network = core.getInput('network')
    const outputFilePath = core.getInput('output-file')
    const hashFilePath = core.getInput('hash-file')

    if (
      network !== SupportedNetworks.mainnet &&
      network !== SupportedNetworks.tenderly
    ) {
      throw new Error('Unsupported network input parameter')
    }

    const spockPolls = await fetchSpockPolls(network)
    const pollsWithRawMetadata = await fetchGithubPolls(spockPolls)
    const polls = await parseGithubMetadata(
      pollsWithRawMetadata,
      pollTagsFilePath
    )

    const pollsFile = JSON.stringify(polls, null, 2)
    const aggregatedPollsHash = createHash('sha256')
      .update(pollsFile)
      .digest('hex')
    const hashFile = JSON.stringify({ hash: aggregatedPollsHash }, null, 2)

    writeFileSync(outputFilePath, pollsFile)
    writeFileSync(hashFilePath, hashFile)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
