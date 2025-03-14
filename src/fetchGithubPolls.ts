import axios, { AxiosResponse } from 'axios'
import { ParsedPoll, PollWithRawMetadata } from './polls'

export default async function fetchGithubPolls(
  parsedPolls: ParsedPoll[]
): Promise<PollWithRawMetadata[]> {
  const pollsInChunks = []
  const chunkSize = 20
  const pollsRes = []

  for (let i = 0; i < parsedPolls.length; i += chunkSize) {
    pollsInChunks.push(parsedPolls.slice(i, i + chunkSize))
  }

  for (let j = 0; j < pollsInChunks.length; j++) {
    const settledPolls = await Promise.allSettled(
      pollsInChunks[j].map(async (poll) => {
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
