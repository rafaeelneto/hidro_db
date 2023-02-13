module.exports = function override(config, env) {
  console.log('override');
  let loaders = config.resolve;
  loaders.fallback = {
    fs: false,
    tls: false,
    net: false,
    // http: require.resolve('stream-http'),
    https: false,
    // zlib: require.resolve('browserify-zlib'),
    // path: require.resolve('path-browserify'),
    process: require.resolve('process/browser'),
    util: require.resolve('stream-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    crypto: require.resolve('crypto-browserify'),
  };

  loaders;

  return config;
};
