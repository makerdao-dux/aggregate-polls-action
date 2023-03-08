import { PollVoteType } from './polls'

export const POLL_VOTE_TYPE = {
  PLURALITY_VOTE: 'Plurality Voting' as PollVoteType,
  RANKED_VOTE: 'Ranked Choice IRV' as PollVoteType,
  UNKNOWN: 'Unknown' as PollVoteType,
}

export enum PollInputFormat {
  singleChoice = 'single-choice',
  rankFree = 'rank-free',
  chooseFree = 'choose-free',
}
