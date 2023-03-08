import path from 'path'
import { existsSync, readFileSync } from 'fs'
import { PollMetadata, PollTags } from './polls'

export function assignTags(
  pollMetadata: Omit<PollMetadata, 'tags'>[],
  pollTagsFilePath: string
): PollMetadata[] {
  const tagsPath = path.join(process.cwd(), pollTagsFilePath)

  if (!existsSync(tagsPath)) {
    throw new Error('Tags file does not exist')
  }

  const tagsFileContent = readFileSync(tagsPath, 'utf8')
  const tags: PollTags = JSON.parse(tagsFileContent)

  const polls = pollMetadata.map((poll) => ({
    ...poll,
    tags: tags[poll.pollId] || [],
  }))

  return polls
}
