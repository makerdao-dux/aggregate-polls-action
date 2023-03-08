import matter from 'gray-matter'

import { PollMetadata, PollWithRawMetadata } from './polls'
import { PollVoteType } from './polls'
import { POLL_VOTE_TYPE, PollInputFormat } from './constants'
import { assignTags } from './fetchPollTags'

export function parseGithubMetadata(
  pollsWithRawMetadata: PollWithRawMetadata[],
  pollTagsFilePath: string
): PollMetadata[] {
  const polls = pollsWithRawMetadata
    .map(({ pollId, rawMetadata }) => {
      const { data: pollMetadata } = matter(rawMetadata)

      const title: string = pollMetadata.title || ''
      const voteType: PollVoteType =
        (pollMetadata as { vote_type: PollVoteType | null })?.vote_type ||
        POLL_VOTE_TYPE.UNKNOWN

      const pollType = pollMetadata.parameters
        ? validatePollType(pollMetadata.parameters)
        : oldVoteTypeToNew(voteType)

      return {
        pollId,
        title,
        type: pollType,
      }
    })
    .filter((poll) => poll.type) as Omit<PollMetadata, 'tags'>[]

  const pollsWithTags = assignTags(polls, pollTagsFilePath)

  return pollsWithTags
}

const validatePollType = (
  params: Record<string, unknown>
): PollInputFormat | null => {
  let inputFormatType = ''

  if (typeof params.input_format === 'string') {
    inputFormatType = params.input_format
  } else {
    inputFormatType = (params.input_format as any).type
  }

  if (
    inputFormatType === PollInputFormat.rankFree ||
    inputFormatType === PollInputFormat.singleChoice ||
    inputFormatType === PollInputFormat.chooseFree
  ) {
    return inputFormatType
  } else {
    return null
  }
}

const oldVoteTypeToNew = (voteType: PollVoteType): PollInputFormat => {
  if (
    voteType === POLL_VOTE_TYPE.PLURALITY_VOTE ||
    voteType === POLL_VOTE_TYPE.UNKNOWN
  ) {
    return PollInputFormat.singleChoice
  } else {
    return PollInputFormat.rankFree
  }
}
