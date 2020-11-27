import LRU from 'lru-cache'

const options = {
  max: 500,
  maxAge: 1000 * 60 * 10  // 10 minutes
}

export const cache = new LRU(options)
