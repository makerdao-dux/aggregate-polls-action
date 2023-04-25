import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

import { PollVictoryConditionAND, VictoryCondition } from './polls'
import { PollVictoryConditions } from './constants'

// Generic function to determine if a victory condition exists in the nested array of victory conditions
export function findVictoryCondition(
  victoryConditions: (PollVictoryConditionAND | VictoryCondition)[],
  victoryCondition: PollVictoryConditions
): (PollVictoryConditionAND | VictoryCondition)[] {
  const found: (PollVictoryConditionAND | VictoryCondition)[] = []
  victoryConditions.forEach((v: VictoryCondition | PollVictoryConditionAND) => {
    if (v.type === PollVictoryConditions.and) {
      if (victoryCondition === PollVictoryConditions.and) {
        found.push(v)
        return
      }

      ;(v.conditions || []).forEach((i) => {
        if (i.type === victoryCondition) {
          found.push(i)
          return
        }
      })
    }

    if (v.type === victoryCondition) {
      found.push(v)
    }
  })
  return found
}

export function hasVictoryConditionInstantRunOff(
  victoryConditions: (PollVictoryConditionAND | VictoryCondition)[]
): boolean {
  return (
    findVictoryCondition(victoryConditions, PollVictoryConditions.instantRunoff)
      .length > 0
  )
}
export function hasVictoryConditionPlurality(
  victoryConditions: (PollVictoryConditionAND | VictoryCondition)[]
): boolean {
  return (
    findVictoryCondition(victoryConditions, PollVictoryConditions.plurality)
      .length > 0
  )
}

export function hasVictoryConditionMajority(
  victoryConditions: (PollVictoryConditionAND | VictoryCondition)[]
): boolean {
  return (
    findVictoryCondition(victoryConditions, PollVictoryConditions.majority)
      .length > 0
  )
}

export function hasVictoryConditionApproval(
  victoryConditions: (PollVictoryConditionAND | VictoryCondition)[]
): boolean {
  return (
    findVictoryCondition(victoryConditions, PollVictoryConditions.approval)
      .length > 0
  )
}

export function hasVictoryConditionAND(
  victoryConditions: (PollVictoryConditionAND | VictoryCondition)[]
): boolean {
  return (
    findVictoryCondition(victoryConditions, PollVictoryConditions.and).length >
    0
  )
}

export function hasVictoryConditionDefault(
  victoryConditions: (PollVictoryConditionAND | VictoryCondition)[]
): boolean {
  return (
    findVictoryCondition(victoryConditions, PollVictoryConditions.default)
      .length > 0
  )
}

export function hasVictoryConditionComparison(
  victoryConditions: (PollVictoryConditionAND | VictoryCondition)[]
): boolean {
  return (
    findVictoryCondition(victoryConditions, PollVictoryConditions.comparison)
      .length > 0
  )
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown)
  return result.toString().replace(/<a href/g, '<a target="_blank" href')
}
