import axios from 'axios'
import { config } from '../config'
import { logger } from '../logging'

export interface Proposal {
  id: string
  author: string
  symbol: string
  title: string
  body: string
  discussion: string
  snapshot: string
  state: string
  link: string
  /** UNIX timestamp in seconds */
  created: number
  /** UNIX timestamp in seconds */
  start: number
  /** UNIX timestamp in seconds */
  end: number

  space: {
    id: string
    name: string
    avatar: string
  }
}

export const getProposals = async (from: number, to: number, spaceSnapshotIds: string[]): Promise<Proposal[]> => {
  logger.info({ message: 'Requesting proposals from Snapshot', from, to, spaceSnapshotIds })
  const response = await axios.post(config.services.snapshot.url, {
    query: `
      query newProposals($from: Int, $to: Int, $space_in: [String]) {
        proposals(where: {created_gt: $from, created_lt: $to, space_in: $space_in}) {
          id
          author
          created
          symbol
          title
          body
          discussion
          start
          end
          snapshot
          state
          link

          space {
            id
            name
            avatar
          }
        }
      }
    `,
    variables: {
      from, to, space_in: spaceSnapshotIds,
    },
  })

  logger.info({ message: 'Response from Snapshot', from, to, spaceSnapshotIds, response })

  return response.data.data.proposals
}
