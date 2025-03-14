import * as core from '@actions/core'
import { createHash } from 'crypto'
import { writeFileSync } from 'fs'

import { SupportedNetworks } from './constants'
import fetchGithubPolls from './fetchGithubPolls'
import { fetchSpockPolls, fetchSubgraphPolls } from './fetchPolls'
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

    const [spockPolls, subgraphPolls] = await Promise.all([
      fetchSpockPolls(network),
      fetchSubgraphPolls(network)
    ]);

    const cutoffDate = new Date('2025-03-01T00:00:00Z'); // TODO: Set to cutoff date
    
    const fetchedPolls = [
      ...spockPolls.filter(poll => new Date(poll.startDate) < cutoffDate),
      ...subgraphPolls.filter(poll => new Date(poll.startDate) >= cutoffDate)
    ];
    
    const pollsWithRawMetadata = await fetchGithubPolls(fetchedPolls)
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
