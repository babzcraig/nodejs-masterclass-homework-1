// create an environments container
const environments = {};

// staging env vars
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging"
};

// production env vars
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production"
};

// Determine which config to export
const currentEnv =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// check that the environment is one of our config objects
const envToExport =
  typeof environments[currentEnv] == "object"
    ? environments[currentEnv]
    : environments.staging;

// export module
module.exports = envToExport;
