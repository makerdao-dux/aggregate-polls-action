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

export async function fetchSubgraphPolls(
  network: SupportedNetworks
): Promise<ParsedPoll[]> {
  const res: AxiosResponse<SubgraphPoll> = await axios.post(
    SUBGRAPH_URLS[network],
    {
      query: `
        {polls(orderBy: blockCreated, first: 100) {
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
      operationName: 'activePolls'
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
