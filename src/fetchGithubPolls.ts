import axios, { AxiosResponse } from 'axios'
import { ParsedSpockPoll, PollWithRawMetadata } from './polls'

export default async function fetchGithubPolls(
  parsedSpockPolls: ParsedSpockPoll[]
): Promise<PollWithRawMetadata[]> {
  const pollsRes = await Promise.allSettled(
    parsedSpockPolls.map(async ({ pollId, url }) => {
      const res: AxiosResponse<string> = await axios.get(url)
      return {
        pollId,
        rawMetadata: res.data,
      }
    })
  )

  const polls = pollsRes
    .map((promise) => (promise.status === 'fulfilled' ? promise.value : null))
    .filter((poll) => !!poll) as PollWithRawMetadata[]

  return polls
}
