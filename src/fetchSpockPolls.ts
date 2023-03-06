import axios, { AxiosResponse } from 'axios'
import { SpockPoll, ParsedSpockPoll } from './spockPoll'

export default async function fetchSpockPolls(): Promise<ParsedSpockPoll[]> {
  const res: AxiosResponse<SpockPoll> = await axios.post(
    'https://pollingdb2-mainnet-prod.makerdux.com/api/v1',
    { operationName: 'activePolls' }
  )

  const spockPollsData = res.data.data.activePolls.edges.map(
    ({ node: { pollId, url } }) => ({ pollId, url })
  )

  return spockPollsData
}
