module.exports = {
  apps: [
    {
      name: "whatsaas-lite",
      script: "npm",
      args: "start -- -p 4000",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
};
