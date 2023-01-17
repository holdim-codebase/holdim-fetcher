
import fastifyFacotry from 'fastify'
import { config } from './config'
import { logger } from './logging'
import { queueProposals } from './services/pubsub'
import { getProposals } from './services/snapshot'

export const fastify = fastifyFacotry({ logger })

const SEC_IN_MS = 1e3
const MIN_IN_MS = SEC_IN_MS * 60
const HOUR_IN_MS = MIN_IN_MS * 60
const DAY_IN_MS = HOUR_IN_MS * 24

/**
 * Example: { frequency: SyncSignalFrequency.HOURLY, every: 12 }
 * Means that this cronjobs runs every 12 hours
 * It can be used to determine which syncs should be processed on the signal
 */
enum SyncSignalFrequency {
  PER_MINUTE = 'PER_MINUTE',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
}

interface SyncSignalMessage {
  frequency: SyncSignalFrequency
  every: number
}

const SyncSignalFrequencyToIntMap: {[key in SyncSignalFrequency]: number} = {
  [SyncSignalFrequency.DAILY]: DAY_IN_MS / 1e3,
  [SyncSignalFrequency.HOURLY]: HOUR_IN_MS / 1e3,
  [SyncSignalFrequency.PER_MINUTE]: MIN_IN_MS / 1e3,
}

fastify.post('/', async (request, reply) => {
  const nowInSeconds = Math.floor(Date.now() / 1e3)
  /** UNIX timestamps in seconds */
  let { from, to } = { from: nowInSeconds - config.parameters.intervalInSeconds, to: nowInSeconds }
  try {
    if (request.body) {
      const data: SyncSignalMessage = JSON.parse(
        Buffer.from((request.body as any).message.data, 'base64').toString('utf-8')
      )
      from = Math.floor(Date.now() / 1e3) - (SyncSignalFrequencyToIntMap[data.frequency] * data.every)
      to = Math.floor(Date.now() / 1e3)
    }
    const proposals = await getProposals(from, to, config.services.snapshot.whitelistedSpaces)
    await queueProposals(proposals)
    return await reply.status(200).send({})
  } catch (error) {
    logger.error(error)
    return reply.status(400).send({ message: (typeof error === 'object' && (error as { message?: string } || null)?.message) ?? 'unknown' })
  }
})

export const server = fastify
