import {
  PollInputFormat,
  PollVictoryConditions,
  PollResultDisplay,
} from './constants'

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
  multiHash: string
  slug: string
  startDate: string
  endDate: string
  creator: string
  blockCreated: number
}

export type PollWithRawMetadata = ParsedSpockPoll & {
  rawMetadata: string
}

export type PollOptions = {
  [key: string]: string
}

//  { type : comparison, options: [0, 1, 4], comparator : '>=10000' }
export type PollVictoryConditionComparison = {
  type: PollVictoryConditions.comparison
  options: number[]
  comparator: string
  value: number
}

// { type : default, value: 2 }
export type PollVictoryConditionDefault = {
  type: PollVictoryConditions.default
  value: number
}

// { type : majority, percent: 50 }
export type PollVictoryConditionMajority = {
  type: PollVictoryConditions.majority
  percent: number
}

// { type : 'plurality' }
export type PollVictoryConditionPlurality = {
  type: PollVictoryConditions.plurality
}

// { type : 'instant-runoff' }
export type PollVictoryConditionInstantRunoff = {
  type: PollVictoryConditions.instantRunoff
}

// { type : 'approval' }
export type PollVictoryConditionApproval = {
  type: PollVictoryConditions.approval
}

// { type : 'and', conditions: conditions[] }
export type PollVictoryConditionAND = {
  type: PollVictoryConditions.and
  conditions: VictoryCondition[]
}

export type VictoryCondition =
  | PollVictoryConditionComparison
  | PollVictoryConditionDefault
  | PollVictoryConditionMajority
  | PollVictoryConditionApproval
  | PollVictoryConditionInstantRunoff
  | PollVictoryConditionPlurality

type PollParameters = {
  inputFormat: {
    type: PollInputFormat
    abstain: number[]
    options: number[]
  }
  victoryConditions: (PollVictoryConditionAND | VictoryCondition)[]
  resultDisplay: PollResultDisplay
}

export type PollMetadata = ParsedSpockPoll & {
  title: string
  summary: string
  discussionLink: string
  content: string
  options: PollOptions
  parameters: PollParameters
  tags: string[]
}

export type PollVoteType = 'Plurality Voting' | 'Ranked Choice IRV' | 'Unknown'

export type PollTags = {
  [key: string]: string[]
}
