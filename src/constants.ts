import { PollVoteType } from './polls'

export enum SupportedNetworks {
  mainnet = 'mainnet',
  goerli = 'goerli',
}

export enum PollInputFormat {
  singleChoice = 'single-choice',
  rankFree = 'rank-free',
  chooseFree = 'choose-free',
}

export const POLL_VOTE_TYPE = {
  PLURALITY_VOTE: 'Plurality Voting' as PollVoteType,
  RANKED_VOTE: 'Ranked Choice IRV' as PollVoteType,
  UNKNOWN: 'Unknown' as PollVoteType,
}

export const POLLING_DB_URLS = {
  [SupportedNetworks.mainnet]:
    'https://pollingdb2-mainnet-prod.makerdux.com/api/v1',
  [SupportedNetworks.goerli]:
    'https://pollingdb2-goerli-staging.makerdux.com/api/v1',
}
