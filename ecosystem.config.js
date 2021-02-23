module.exports = {
  apps: [{
    name: 'Fleet-Server',
    port: 3000,
    script: 'yarn start',
    cwd: '/var/www/path-to-current-directory',
    env: {
      NODE_ENV: 'production'
    }
  }]
};