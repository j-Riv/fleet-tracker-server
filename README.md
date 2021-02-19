# Fleet Server

## Description

Node/Express/Sequelize Backend for [Fleet Tracker Client](https://github.com/j-Riv/fleet-tracker)

## Client

Can be found [here](https://github.com/j-Riv/fleet-tracker)

## Server Dependencies

- NGINX
- MySQL 8
- Node 10.15.3
- Yarn

Contents:

- [Project Setup](#project-setup)
  - [Config](#config)
  - [NGINX Proxy and SSL](#nginx-proxy-and-ssl)
- [Routes](#routes)

# Project setup

Create MySQL DB (vehicle_tracker) and create DB config:

```bash
cp /config/sample.json /config/config.json
```

Install Node Modules

```
yarn install
```

## Config

Project expects a `.env` file in the root directory with the following:

[Google Developer Console](https://console.developers.google.com)<br />
<i>(Google config is for Google Oauth 2 Passport. Don't Need GOOGLE for current configuration.)</i>

```
PASSPORT_SECRET=<< Database Secret Used For Hashing User Passwords >>
GOOGLE_CLIENT_ID=<< Google api client id >>
GOOGLE_CLIENT_SECRET=<< Google api client secret >>
```

Sequalize (MySQL) conf can be found in `/config`

## NGINX Proxy and SSL

The following instructions are for a Debian/Ubuntu Server.

Make sure nothing is running on port 80 `netstat -na | grep ':80.*LISTEN'`

Kill any process running on port 80 `sudo kill $(sudo lsof -t -i:80)`

Generate SSL Certificate(s) with [certbot](https://certbot.eff.org/)

Edit config or make seperate file `sudo nano /etc/nginx/sites-available/default`

```
server {
  listen 443 ssl;
  server_name <YourDomain.com>;
  ssl_certificate /etc/letsencrypt/live/<YourDomain.com>/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/<YourDomain.com>/privkey.pem;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_prefer_server_ciphers on;
  ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
  root /var/www/<YourPath></YourPath>
  index index.html index.htm;
  # Make site accessible from http://localhost/
  server_name localhost;
  location / {
     proxy_pass http://localhost:3000/;
     proxy_http_version 1.1;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection "upgrade";
     proxy_set_header Host $http_host;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $remote_addr;
     proxy_set_header X-Forward-Proto http;
     proxy_set_header X-Nginx-Proxy true;
     proxy_redirect off;
  }
}
server {
 listen 80;
 server_name <domain.com>;
 return 301 https://$host$request_uri;
}
```

If you created a new config file sym link it `sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/`

Test config `sudo nginx -t`
Restart nginx `sudo service nginx stop` & `sudo service nginx start`
