let cache = {},
  version = Date.now()

const Cache = {
  invalidateAll: () => {
    version++
    Object.keys(cache).forEach(key => (cache[key] = {}))
  },

  getVersion: () => version,

  getDeepCache: name => {
    if (!cache[name]) {
      cache[name] = id => Cache.getCache(`${name}_deep_${id}`)
    }
    return cache[name]
  },

  getCache: name => {
    if (!cache[name]) {
      cache[name] = {}
    }

    return {
      get: id => cache[name][id],

      put: (id, content) => {
        version++
        cache[name][id] = content
      },

      delete: id => {
        version++
        cache[name][id] = undefined
      },

      deleteAll: id => {
        version++
        cache[name] = {}
      },
    }
  },
}

module.exports = Cache
