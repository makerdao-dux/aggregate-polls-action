import axios, { AxiosResponse } from 'axios'
import { SUBGRAPH_URLS, POLLING_DB_URLS, SupportedNetworks } from './constants'
import { SubgraphPoll, SpockPoll, ParsedPoll } from './polls'

export async function fetchSpockPolls(
  network: SupportedNetworks
): Promise<ParsedPoll[]> {
  const res: AxiosResponse<SpockPoll> = await axios.post(
    POLLING_DB_URLS[network],
    { operationName: 'activePolls' }
  )

  const spockPollsData = res.data.data.activePolls.edges
    .map(
      ({
        node: {
          creator,
          pollId,
          blockCreated,
          startDate,
          endDate,
          multiHash,
          url,
        },
      }) => ({
        creator,
        pollId,
        blockCreated,
        startDate: new Date(startDate * 1000).toISOString(),
        endDate: new Date(endDate * 1000).toISOString(),
        multiHash,
        url,
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

  return spockPollsData
}

//get latest polls created by whitelisted addresses
//TODO: add pagination to handle more than 1000 polls
export async function fetchSubgraphPolls(
  network: SupportedNetworks
): Promise<ParsedPoll[]> {
  const res: AxiosResponse<SubgraphPoll> = await axios.post(
    SUBGRAPH_URLS[network],
    {
      query: `
      {polls(orderBy: blockCreated, orderDirection: desc, first: 1000, where: {creator_in: ["0xdc7ee5da5d011bc98cf030968659f3ee92232843", "0x8541ccfc6e7eacebd233c6789a0fbf7c708b0e68", "0x777cc2b5ec4c50b5aec0c0d9f8d1b8599ef2a54c"]}) {
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
