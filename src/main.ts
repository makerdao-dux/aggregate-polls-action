import * as core from '@actions/core'

import fetchSpockPolls from './fetchSpockPolls'

async function run(): Promise<void> {
  try {
    const spockPolls = await fetchSpockPolls()

    console.log(spockPolls)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
