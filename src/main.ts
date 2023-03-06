import * as core from '@actions/core'
import fetchGithubPolls from './fetchGithubPolls'

import fetchSpockPolls from './fetchSpockPolls'

async function run(): Promise<void> {
  try {
    const spockPolls = await fetchSpockPolls()
    const pollsWithRawMetadata = await fetchGithubPolls(spockPolls)
    console.log(pollsWithRawMetadata)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
