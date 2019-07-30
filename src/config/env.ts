const env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (env !== "production" && env !== "development")
    process.exit(1), console.error("No 'Dev' or 'Prod' environment.");

const config = require("./keys/env.json");
const envConfig = config[env];
Object.keys(envConfig).forEach((key: string): void => {
    process.env[key] = envConfig[key];
});