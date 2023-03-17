import * as core from '@actions/core'
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

    if (
      network !== SupportedNetworks.mainnet &&
      network !== SupportedNetworks.goerli
    ) {
      throw new Error('Unsupported network input parameter')
    }

    const spockPolls = await fetchSpockPolls(network)
    const pollsWithRawMetadata = await fetchGithubPolls(spockPolls)
    const pollListData = parseGithubMetadata(
      pollsWithRawMetadata,
      pollTagsFilePath
    )

    writeFileSync(outputFilePath, JSON.stringify(pollListData, null, 2))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
