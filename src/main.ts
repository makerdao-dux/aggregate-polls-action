import * as core from '@actions/core'
import { SupportedNetworks } from './constants'
import fetchGithubPolls from './fetchGithubPolls'

import fetchSpockPolls from './fetchSpockPolls'
import { parseGithubMetadata } from './parseGithubMetadata'

async function run(): Promise<void> {
  try {
    const pollTagsFilePath = core.getInput('tags-file')
    const network = core.getInput('network')

    if (
      network !== SupportedNetworks.mainnet &&
      network !== SupportedNetworks.goerli
    ) {
      throw new Error('Unsupported network input parameter')
    }

    const spockPolls = await fetchSpockPolls(network)
    const pollsWithRawMetadata = await fetchGithubPolls(spockPolls)
    const polls = parseGithubMetadata(pollsWithRawMetadata, pollTagsFilePath)

    console.log(polls.filter((p) => p.type === 'single-choice').length)
    console.log(polls.filter((p) => p.type === 'rank-free').length)
    console.log(polls.filter((p) => p.type === 'choose-free').length)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
