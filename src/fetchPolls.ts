import axios, { AxiosResponse } from 'axios'
import { SUBGRAPH_URLS, SupportedNetworks } from './constants'
import { SubgraphPoll, ParsedPoll } from './polls'

//get latest polls created by whitelisted addresses after the start date
//TODO: add pagination to handle more than 1000 polls
export async function fetchSubgraphPolls(
  network: SupportedNetworks,
  argStartUnix: number = 0
): Promise<ParsedPoll[]> {
  const res: AxiosResponse<SubgraphPoll> = await axios.post(
    SUBGRAPH_URLS[network],
    {
      query: `
        query filteredPolls($argStartUnix: BigInt){polls(orderBy: blockCreated, orderDirection: desc, first: 1000, where: {startDate_gte: $argStartUnix, creator_in: ["0xdc7ee5da5d011bc98cf030968659f3ee92232843", "0x8541ccfc6e7eacebd233c6789a0fbf7c708b0e68", "0x777cc2b5ec4c50b5aec0c0d9f8d1b8599ef2a54c"]}) {
          id
          creator
          startDate
          endDate
          multiHash
          url
          blockCreated
        }
      }
      `,
      variables: { argStartUnix}
    }
  )
  const subgraphPollsData = res.data.data.polls
    .map(
      ({
          creator,
          id,
          startDate,
          endDate,
          multiHash,
          url,
          blockCreated
      }) => ({
        creator,
        pollId: Number(id),
        startDate: new Date(Number(startDate) * 1000).toISOString(),
        endDate: new Date(Number(endDate) * 1000).toISOString(),
        multiHash,
        url,
        blockCreated: Number(blockCreated)
      })
    )
    // Removes duplicate entries
    .reduce((acum, poll, i, pollArray) => {
      if (i === pollArray.findIndex((p) => p.multiHash === poll.multiHash)) {
        acum.push({
          ...poll,
          slug: poll.multiHash.slice(0, 8),
        })
      }

      return acum
    }, [] as ParsedPoll[])

  return subgraphPollsData
}
