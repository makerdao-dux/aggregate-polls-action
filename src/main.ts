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
      network !== SupportedNetworks.goerli
    ) {
      throw new Error('Unsupported network input parameter')
    }

    const spockPolls = await fetchSpockPolls(network)
    const pollsWithRawMetadata = await fetchGithubPolls(spockPolls)
    const polls = parseGithubMetadata(pollsWithRawMetadata, pollTagsFilePath)

    const stringPolls = JSON.stringify(polls, null, 2)
    const hashedPolls = createHash('sha256').update(stringPolls).digest('hex')

    writeFileSync(outputFilePath, stringPolls)
    writeFileSync(hashFilePath, hashedPolls)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
