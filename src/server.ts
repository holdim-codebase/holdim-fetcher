
import fastifyFacotry from 'fastify'
import { logger } from './logging'
import { queuePrpoposals } from './services/pubsub'
import { getProposals } from './services/snapshot'

export const fastify = fastifyFacotry({ logger })

fastify.post('/', async (request, reply) => {
  try {
    const { from, to } = request.body as { from: number, to: number }
    const proposals = await getProposals(from, to)
    await queuePrpoposals(proposals)
    return await reply.status(200).send({})
  } catch (error) {
    logger.error(error)
    return reply.status(400).send({ message: (typeof error === 'object' && (error as { message?: string } || null)?.message) || 'unknown' })
  }
})

export const server = fastify
