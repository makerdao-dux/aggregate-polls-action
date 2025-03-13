import axios, { AxiosResponse } from 'axios'
import { SUBGRAPH_URLS, SupportedNetworks } from './constants'
import { SubgraphPoll, ParsedSubgraphPoll } from './polls'

export default async function fetchSpockPolls(
  network: SupportedNetworks
): Promise<ParsedSubgraphPoll[]> {
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
    }, [] as ParsedSubgraphPoll[])

  return subgraphPollsData
}
