import { PubSub } from '@google-cloud/pubsub'
import { config } from '../config'
import { Proposal } from './snapshot'

export const queuePrpoposals = async (proposals: Proposal[]) => {
  const pubsub = new PubSub()
  const topic = pubsub.topic(config.pubsub.topicNameOrId)
  for (const proposal of proposals) {
    await topic.publishMessage({ json: proposal })
  }
}
