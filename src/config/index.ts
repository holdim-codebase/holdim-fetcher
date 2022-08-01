export const config = {
  parameters: {
    intervalInSeconds: Number(process.env.INTERVAL_IN_SECONDS ?? 16 * 60),
  },
  services: {
    snapshot: {
      url: 'https://hub.snapshot.org/graphql',
      whitelistedSpaces: [
        'uniswap',
        'sushigov.eth',
        'ens.eth',
        'gelato.eth',
        'aave.eth',
        '1inch.eth',
      ],
    },
  },
  pubsub: {
    topicNameOrId: 'projects/holdim/topics/fetcher-settler',
  },
}
