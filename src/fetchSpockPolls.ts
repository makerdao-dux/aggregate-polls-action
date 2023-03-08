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
    .map(({ node: { pollId, url, multiHash } }) => ({ pollId, url, multiHash }))
    // Removes duplicate entries
    .reduce((acum, { pollId, url, multiHash }, i, pollArray) => {
      if (i === pollArray.findIndex((p) => p.multiHash === multiHash)) {
        acum.push({ pollId, url })
      }

      return acum
    }, [] as ParsedSpockPoll[])

  return spockPollsData
}
