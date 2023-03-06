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
