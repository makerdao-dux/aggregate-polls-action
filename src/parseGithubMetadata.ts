import matter from 'gray-matter'
import validUrl from 'valid-url'

import {
  PollMetadata,
  PollOptions,
  PollWithRawMetadata,
  PollVoteType,
} from './polls'
import { POLL_VOTE_TYPE } from './constants'
import { assignTags } from './fetchPollTags'
import {
  validatePollParameters,
  oldVoteTypeToNewParameters,
} from './validatePollParameters'
import { markdownToHtml } from './utils'

export async function parseGithubMetadata(
  pollsWithRawMetadata: PollWithRawMetadata[],
  pollTagsFilePath: string
): Promise<PollMetadata[]> {
  const polls = await Promise.all(
    pollsWithRawMetadata.map(async ({ rawMetadata, ...poll }) => {
      const { data: pollMetadata, content: markdownContent } =
        matter(rawMetadata)

      const content = await markdownToHtml(markdownContent)

      const title: string = pollMetadata?.title || ''
      const summary: string = pollMetadata?.summary || ''
      const options: PollOptions = pollMetadata?.options || {}
      const discussionLink =
        pollMetadata?.discussion_link &&
        validUrl.isUri(pollMetadata.discussion_link)
          ? pollMetadata.discussion_link
          : null

      // Parse old vote type
      const voteType: PollVoteType =
        (pollMetadata as { vote_type: PollVoteType | null })?.vote_type ||
        POLL_VOTE_TYPE.UNKNOWN

      const [parameters, errorParameters] = pollMetadata.parameters
        ? validatePollParameters(pollMetadata.parameters)
        : oldVoteTypeToNewParameters(voteType)

      if (errorParameters.length > 0 || !parameters) {
        throw new Error(
          `Invalid poll parameters for poll ${poll.pollId}. ${errorParameters}`
        )
      }

      const { startDate, endDate } = poll

      return {
        ...poll,
        startDate,
        endDate,
        title,
        summary,
        discussionLink,
        content,
        options,
        parameters,
      }
    })
  )

  const filteredPolls = polls.filter((poll) => !!poll) as Omit<
    PollMetadata,
    'tags'
  >[]

  const pollsWithTags = assignTags(filteredPolls, pollTagsFilePath)

  return pollsWithTags.sort((a, b) => a.pollId - b.pollId)
}
