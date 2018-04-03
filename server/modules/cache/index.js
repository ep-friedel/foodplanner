let cache = {},
    version = Date.now();


module.exports = {
    invalidateAll: () => {
        version++;
        Object.keys(cache).forEach(key => cache[key] = {});
    },

    getVersion: () => version,

    getCache: name => {
        if (!cache[name]) {
            cache[name] = {};
        }

        return {
            get: id => cache[name][id],

            put: (id, content) => {
                version++;
                cache[name][id] = content;
            },

            delete: id => {
                version++;
                cache[name][id] = undefined;
            },

            deleteAll: id => {
                version++;
                cache[name] = {};
            },
        }
    }
}


