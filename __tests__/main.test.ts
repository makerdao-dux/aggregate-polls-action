import { describe, expect, test } from '@jest/globals'
import fetchSpockPolls from '../src/fetchSpockPolls'
import fetchGithubPolls from '../src/fetchGithubPolls'
import { parseGithubMetadata } from '../src/parseGithubMetadata'
import { SupportedNetworks, PollInputFormat } from '../src/constants'
import { ParsedSpockPoll, PollWithRawMetadata } from '../src/polls'

const testSpockPolls: ParsedSpockPoll[] = [
  {
    pollId: 1,
    url: 'https://raw.githubusercontent.com/makerdao/community/master/governance/polls/Activate%20Liquidations%20for%20Stablecoin%20Vaults%20to%20Clear%20Bad%20Debt%20-%20October%2031%2C%202022.md',
    slug: 'Qmbndmkr',
    startDate: '2023-03-13T16:00:00.000Z',
    endDate: '2023-03-27T16:00:00.000Z',
    multiHash: 'QmVH4z3L5YmqGTFs6tifQ3jpJX5mXgdFNjy6ALEwNWwVbA',
    creator: '0x06ada798f9323392ca30c755383af879bd853168',
    blockCreated: 16819978,
  },
  {
    pollId: 2,
    url: 'https://raw.githubusercontent.com/makerdao/community/master/governance/polls/Activate%20the%20Governance%20Security%20Module.md',
    slug: 'QmdLRZGM',
    startDate: '2023-03-13T16:00:00.000Z',
    endDate: '2023-03-27T16:00:00.000Z',
    multiHash: 'QmbA2HpV3KCbJgzvLNv7xSogS3JenQDiqo3FFnKTGqTEpn',
    creator: '0xf563f100df419ccde59bfbe0692fc4c5bfe01706',
    blockCreated: 8292000,
  },
  {
    pollId: 3,
    url: 'https://raw.githubusercontent.com/makerdao/community/master/governance/polls/Add%20ETH-A%20to%20Liquidations%202.0%20Framework%20-%20April%2026%2C%202021.md',
    slug: 'QmTJBUXJ',
    startDate: '2023-03-13T16:00:00.000Z',
    endDate: '2023-03-27T16:00:00.000Z',
    multiHash: 'QmbA2HpV3KCbJgzvLNv7xSogS3JenQDiqo3FFnKTGqTEpn',
    creator: '0xf563f100df419ccde59bfbe0692fc4c5bfe01706',
    blockCreated: 8647876,
  },
  {
    pollId: 4,
    url: 'https://raw.githubusercontent.com/makerdao/community/master/governance/polls/wrong-poll-url.md',
    slug: 'QmT9Novb',
    startDate: '2023-03-13T16:00:00.000Z',
    endDate: '2023-03-27T16:00:00.000Z',
    multiHash: 'QmbQXVJR6pEXVmmfCJKfPFDEnBM36rdq5Dxab7CBUNnQQT',
    creator: '0x170f105d674bbcae575d957a58795af6e346ef6b',
    blockCreated: 9224660,
  },
]

const testGithubPollMetadata =
  '---\ntitle: Activate the Governance Security Module - December 9, 2019\nsummary: Signal your support to activate the GSM by setting the delay to 24 hours.\ndiscussion_link: https://forum.makerdao.com/t/914\npoll_rules: The voter may select to vote for one of the poll options or they may elect to abstain from the poll entirely\noptions:\n   0: Abstain\n   1: Yes\n   2: No\n---\n# Poll: Activate the Governance Security Module - December 9, 2019\n\nThe Maker Foundation Interim Risk Team has placed a Governance Poll into the [voting system](https://vote.makerdao.com/polling) which the community can use to activate the [Governance Security Module](https://docs.makerdao.com/smart-contract-modules/governance-module/pause-detailed-documentation#1-introduction-summary).\n\nThis Governance Poll ([FAQ](https://community-development.makerdao.com/governance/governance#is-there-more-than-one-type-of-vote)) will be active for three days beginning on Monday, December 9 at 5 PM UTC, the results of which may inform an Executive Vote ([FAQ](https://community-development.makerdao.com/governance/governance#what-is-continuous-approval-voting)) which will go live on Friday, December 13, at 5 PM UTC.\n\n## Review\n\nAdditional context was presented in a [blog post](https://blog.makerdao.com/governance-security-module-gsm/) on December 9, 2019. Please review to inform your position before voting.\n\n## Next Steps\n\n* On the Friday following the conclusion of the poll, there will be an Executive Vote asking MKR token holders if they support or reject the change proposed by this Governance Poll.\n\n---\n\n## Resources\n\nAdditional information about the Governance process can be found in the [Governance Risk Framework: Governing MakerDAO](https://community-development.makerdao.com/governance/governance-risk-framework)\n\nDemos, help and instructional material for the Governance Dashboard can be found at [Awesome MakerDAO](https://awesome.makerdao.com/#voting).\n\nTo participate in future Governance calls, please [join us](https://community-development.makerdao.com/governance/governance-and-risk-meetings) every Thursday at 17:00 UTC.\n\nTo add current and upcoming votes to your calendar, please see the [MakerDAO Public Events Calendar](https://calendar.google.com/calendar/embed?src=makerdao.com_3efhm2ghipksegl009ktniomdk%40group.calendar.google.com&ctz=America%2FLos_Angeles).\n'

const testPollParameters = {
  inputFormat: {
    type: 'single-choice',
    abstain: [0],
    options: [],
  },
  resultDisplay: 'single-vote-breakdown',
  victoryConditions: [
    {
      type: 'plurality',
    },
  ],
}

const testGithubPolls: PollWithRawMetadata[] = [
  {
    pollId: 49,
    slug: 'Qmbndmkr',
    startDate: '2023-03-13T16:00:00.000Z',
    endDate: '2023-03-27T16:00:00.000Z',
    rawMetadata: testGithubPollMetadata,
    url: 'https://raw.githubusercontent.com/makerdao/community/master/governance/polls/Activate%20the%20Governance%20Security%20Module.md',
    multiHash: 'QmbQXVJR6pEXVmmfCJKfPFDEnBM36rdq5Dxab7CBUNnQQT',
    creator: '0x170f105d674bbcae575d957a58795af6e346ef6b',
    blockCreated: 9224660,
  },
]

const pollTagsFilePath = '__tests__/polls/poll-tags.json'

describe('Polling module', () => {
  test('Fetch spock polls', async () => {
    const spockPolls = await fetchSpockPolls(SupportedNetworks.mainnet)

    expect(spockPolls.length).toBeGreaterThan(0)
    expect(spockPolls[0].pollId).toBeDefined()
    expect(typeof spockPolls[0].pollId).toBe('number')
    expect(spockPolls[0].url).toBeDefined()
    expect(typeof spockPolls[0].url).toBe('string')
    expect(spockPolls[0].slug).toBeDefined()
    expect(typeof spockPolls[0].slug).toBe('string')
    expect(spockPolls[0].slug).toHaveLength(8)
    expect(spockPolls[0].startDate).toBeDefined()
    expect(typeof spockPolls[0].startDate).toBe('string')
    expect(typeof new Date(spockPolls[0].startDate).toISOString()).toBe(
      'string'
    )
    expect(spockPolls[0].endDate).toBeDefined()
    expect(typeof spockPolls[0].endDate).toBe('string')
    expect(typeof new Date(spockPolls[0].endDate).toISOString()).toBe('string')
    expect(spockPolls[0].multiHash).toBeDefined()
    expect(typeof spockPolls[0].multiHash).toBe('string')
    expect(spockPolls[0].creator).toBeDefined()
    expect(typeof spockPolls[0].creator).toBe('string')
    expect(spockPolls[0].creator).toHaveLength(42)
    expect(spockPolls[0].creator.startsWith('0x')).toBe(true)
    expect(spockPolls[0].blockCreated).toBeDefined()
    expect(typeof spockPolls[0].blockCreated).toBe('number')
  })

  test('Fetch GitHub polls', async () => {
    const githubPolls = await fetchGithubPolls(testSpockPolls)

    expect(githubPolls).toHaveLength(3)
    expect(githubPolls[1].pollId).toBe(2)
    expect(githubPolls[1].rawMetadata).toBe(testGithubPollMetadata)
  })

  test('Parse GitHub metadata', () => {
    const polls = parseGithubMetadata(testGithubPolls, pollTagsFilePath)

    expect(polls).toHaveLength(1)
    expect(polls[0].tags).toEqual(['misc-governance', 'mcd-launch'])
    expect(polls[0].title).toBe(
      'Activate the Governance Security Module - December 9, 2019'
    )
    expect(polls[0].summary).toBe(
      'Signal your support to activate the GSM by setting the delay to 24 hours.'
    )
    expect(polls[0].options).toEqual({ '0': 'Abstain', '1': 'Yes', '2': 'No' })
    expect(
      polls[0].content.endsWith(
        'To add current and upcoming votes to your calendar, please see the [MakerDAO Public Events Calendar](https://calendar.google.com/calendar/embed?src=makerdao.com_3efhm2ghipksegl009ktniomdk%40group.calendar.google.com&ctz=America%2FLos_Angeles).\n'
      )
    ).toBe(true)
    expect(polls[0].discussionLink).toBe('https://forum.makerdao.com/t/914')
    expect(polls[0].parameters).toEqual(testPollParameters)
  })
})
