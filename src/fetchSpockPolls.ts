import axios, { AxiosResponse } from 'axios'
import { POLLING_DB_URLS, SupportedNetworks } from './constants'
import { SpockPoll, ParsedSpockPoll } from './polls'

export default async function fetchSpockPolls(
  network: SupportedNetworks
): Promise<ParsedSpockPoll[]> {
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
    }, [] as ParsedSpockPoll[])

  return spockPollsData
}
