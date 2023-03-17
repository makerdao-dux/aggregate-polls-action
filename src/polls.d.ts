export type SpockPoll = {
  data: {
    activePolls: {
      edges: {
        node: {
          creator: string
          pollId: number
          blockCreated: number
          startDate: number
          endDate: number
          multiHash: string
          url: string
        }
        cursor: string
      }[]
    }
  }
}

export type ParsedSpockPoll = {
  pollId: number
  url: string
  slug: string
  startDate: string
  endDate: string
}

export type PollWithRawMetadata = Omit<ParsedSpockPoll, 'url'> & {
  rawMetadata: string
}

export type PollOptions = {
  [key: string]: string
}

export type PollMetadata = Omit<PollWithRawMetadata, 'rawMetadata'> & {
  title: string
  summary: string
  type: string
  tags: string[]
  options: PollOptions
}

export type PollVoteType = 'Plurality Voting' | 'Ranked Choice IRV' | 'Unknown'

export type PollTags = {
  [key: string]: string[]
}
