
import fastifyFacotry from 'fastify'
import { config } from './config'
import { logger } from './logging'
import { queuePrpoposals } from './services/pubsub'
import { getProposals } from './services/snapshot'

export const fastify = fastifyFacotry({ logger })

fastify.post('/', async (request, reply) => {
  try {
    /** UNIX timestamp in seconds */
    const nowInSeconds = Math.floor(Date.now() / 1e3)
    const { from, to } = { from: nowInSeconds - config.intervalInSeconds, to: nowInSeconds }
    const proposals = await getProposals(from, to)
    await queuePrpoposals(proposals)
    return await reply.status(200).send({})
  } catch (error) {
    logger.error(error)
    return reply.status(400).send({ message: (typeof error === 'object' && (error as { message?: string } || null)?.message) ?? 'unknown' })
  }
})

export const server = fastify
