import axios, { AxiosResponse } from 'axios'
import { ParsedSubgraphPoll, PollWithRawMetadata } from './polls'

export default async function fetchGithubPolls(
  parsedSubgraphPolls: ParsedSubgraphPoll[]
): Promise<PollWithRawMetadata[]> {
  const subgraphPollsInChunks = []
  const chunkSize = 20
  const pollsRes = []

  for (let i = 0; i < parsedSubgraphPolls.length; i += chunkSize) {
    subgraphPollsInChunks.push(parsedSubgraphPolls.slice(i, i + chunkSize))
  }

  for (let j = 0; j < subgraphPollsInChunks.length; j++) {
    const settledPolls = await Promise.allSettled(
      subgraphPollsInChunks[j].map(async (poll) => {
        const res: AxiosResponse<string> = await axios.get(poll.url)
        return {
          ...poll,
          rawMetadata: res.data,
        }
      })
    )

    pollsRes.push(...settledPolls)
  }

  const polls = pollsRes
    .map((promise) => (promise.status === 'fulfilled' ? promise.value : null))
    .filter((poll) => !!poll) as PollWithRawMetadata[]

  return polls
}
