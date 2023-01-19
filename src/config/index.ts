export const config = {
  parameters: {
    intervalInSeconds: Number(process.env.INTERVAL_IN_SECONDS ?? 16 * 60),
  },
  services: {
    snapshot: {
      url: 'https://hub.snapshot.org/graphql',
      whitelistedSpaces: [
        '1inch.eth',
        'uniswap',
        'aave.eth',
        'gelato.eth',
        'sushigov.eth',
        'ens.eth',
        'stakewise.eth',
        'opiumprotocol.eth',
        'paraswap-dao.eth',
        'lido-snapshot.eth',
        'pooltogether.eth',
        'balancer.eth',
        'stgdao.eth',
        'frax.eth',
        'rocketpool-dao.eth',
        'anglegovernance.eth',
        'fei.eth',
        'olympusdao.eth',
        'dydxgov.eth',
        'bitdao.eth',
        // 'interfacedao.eth',
        'banklessvault.eth',
        'hop.eth',
      ],
    },
  },
  pubsub: {
    topicNameOrId: 'projects/holdim/topics/fetcher-settler',
  },
}
