import { PollMetadata, PollWithRawMetadata } from './polls'

export function parseGithubMetadata(
  pollsWithRawMetadata: PollWithRawMetadata[]
): PollMetadata[] {
  const polls = pollsWithRawMetadata.map(({ pollId, rawMetadata }) => {
    // RegEx to extract title from rawMetadata string
    const titleRegex = /(?<=title: )(.*?)(?=\n)/i
    const title = rawMetadata.match(titleRegex)

    return {
      pollId,
      title: title ? title[0] : '',
    }
  })

  return polls
}
