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
}

export type PollWithRawMetadata = {
  pollId: number
  rawMetadata: string
}

export type PollMetadata = {
  pollId: number
  title: string
  tags: string[]
  type: string
}

export type PollVoteType = 'Plurality Voting' | 'Ranked Choice IRV' | 'Unknown'

export type PollTags = {
  [key: string]: string[]
}
