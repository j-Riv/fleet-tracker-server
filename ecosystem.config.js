module.exports = {
  apps: [{
    name: 'Fleet-Server',
    port: 3000,
    script: 'yarn start',
    cwd: '/var/www/fleet.suavecito.com/vehicle-tracker-server',
    env: {
      NODE_ENV: 'production'
    }
  }]
};