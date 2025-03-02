export const EXTERNAL_ROUTES = {
  subspace: 'https://subspace.network/',
  forum: 'https://forum.subspace.network/',
  gemini2guide:
    'https://forum.subspace.network/t/how-to-check-your-balance-for-gemini-ii-incentivized-testnet/1081',
  docs: 'https://docs.subspace.network/',
  social: {
    twitter: 'https://twitter.com/NetworkSubspace',
    discord: 'https://discord.gg/subspace-network',
    telegram: 'https://t.me/subspace_network',
    github: 'https://github.com/subspace',
    reddit: 'https://www.reddit.com/r/sub',
    medium: 'https://medium.com/subspace-network',
    youtube: 'https://www.youtube.com/channel/UCojYRCZOtVTJHJXivOYJzeQ',
    linkedin: 'https://www.linkedin.com/company/subspace-blockchain/',
    subSocial: 'https://app.subsocial.network/@NetworkSubspace',
  },
}

export const INTERNAL_ROUTES = {
  home: '/',
  blocks: {
    id: {
      path: ':blockId',
      page: (chain: string, domain: string, blockId: number): string =>
        `/${chain}/${domain}/blocks/${blockId}`,
    },
    list: 'blocks',
  },
  accounts: {
    list: 'accounts',
    id: {
      path: ':accountId',
      page: (chain: string, domain: string, accountId: string): string =>
        `/${chain}/${domain}/accounts/${accountId}`,
    },
    rewards: {
      path: ':accountId/rewards',
      page: (chain: string, domain: string, accountId: string): string =>
        `/${chain}/${domain}/accounts/${accountId}/rewards`,
    },
  },
  events: {
    id: {
      path: ':eventId',
      page: (chain: string, domain: string, eventId: string): string =>
        `/${chain}/${domain}/events/${eventId}`,
    },
    list: 'events',
  },
  extrinsics: {
    id: {
      path: ':extrinsicId',
      page: (chain: string, domain: string, extrinsicId: string): string =>
        `/${chain}/${domain}/extrinsics/${extrinsicId}`,
    },
    list: 'extrinsics',
  },
  logs: {
    id: {
      path: ':logId',
      page: (chain: string, domain: string, logId: string): string =>
        `/${chain}/${domain}/logs/${logId}`,
    },
    list: 'logs',
  },
  operators: {
    id: {
      path: ':operatorId',
      page: (chain: string, domain: string, operatorId: string): string =>
        `/${chain}/${domain}/operators/${operatorId}`,
    },
    list: 'operators',
  },
  search: {
    result: {
      path: 'search/result/:type',
      page: (chain: string, domain: string, type: string): string =>
        `/${chain}/${domain}/search/result/${type}`,
    },
    empty: '/search/no-result-found',
  },
  leaderboard: {
    farmers: 'farmers',
    operators: 'operators',
    nominators: 'nominators',
  },
  notFound: '/404',
}
