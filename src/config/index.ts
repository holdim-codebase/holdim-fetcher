export const config = {
  intervalInSeconds: Number(process.env.INTERVAL_IN_SECONDS) ?? 16 * 60,
  services: {
    snapshot: {
      url: 'https://hub.snapshot.org/graphql',
    },
  },
  pubsub: {
    topicNameOrId: 'projects/holdim/topics/fetcher-settler',
  },
}
