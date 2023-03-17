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
    .map(({ node: { pollId, url, multiHash, startDate, endDate } }) => ({
      pollId,
      url,
      multiHash,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    }))
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
