import * as core from '@actions/core'
import fetchGithubPolls from './fetchGithubPolls'

import fetchSpockPolls from './fetchSpockPolls'
import { parseGithubMetadata } from './parseGithubMetadata'

async function run(): Promise<void> {
  try {
    const pollTagsFilePath = core.getInput('tags-file')

    const spockPolls = await fetchSpockPolls()
    const pollsWithRawMetadata = await fetchGithubPolls(spockPolls)
    const polls = parseGithubMetadata(pollsWithRawMetadata, pollTagsFilePath)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
