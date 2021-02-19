// google
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;
const ClientId = "1079180483133-pcpt10p6psilo2979knmpb3bsrd81ufm.apps.googleusercontent.com";
const ClientSecret = "HRZHR_7MYumb-gdp1VZwkPB6";
const RedirectionUrl = "http://localhost:3000/oauthCallback/"

module.exports = app => {
  app.get('/', (req, res) => {
    const url = getAuthUrl();
    res.send(url);
  });

  app.get("/oauthCallback", function (req, res) {
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code; // the query param code
    oauth2Client.getToken(code, function (err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.

      if (!err) {
        oauth2Client.setCredentials(tokens);
        //saving the token to current session
        session["tokens"] = tokens;
        res.send(`
            &lt;h3&gt;Login successful!!&lt;/h3&gt;
            &lt;a href="/details"&gt;Go to details page&lt;/a&gt;
        `);
      }
      else {
        res.send(`
            &lt;h3&gt;Login failed!!&lt;/h3&gt;
        `);
      }
    });
  });

  app.get("/details", function (req, res) {
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(req.session["tokens"]);
    console.log('oauth2Client');
    console.log(oauth2Client);

    const calendar = google.calendar({ version: 'v3', oauth2Client });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        let events = 'Upcoming 10 events: ';
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
          events = events + `${start} - ${event.summary}, `;
        });
        res.send(events);
      } else {
        console.log('No upcoming events found.');
        res.send('No Upcoming events found.')
      }
    });

  });
  
}

function getOAuthClient() {
  return new OAuth2(ClientId, ClientSecret, RedirectionUrl);
}

function getAuthUrl() {
  var oauth2Client = getOAuthClient();
  // generate a url that asks permissions for Google+ and Google Calendar scopes
  var scopes = [
    'https://www.googleapis.com/auth/calendar'
  ];

  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes // If you only need one scope you can pass it as string
  });

  return url;
}

function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });

    } else {
      console.log('No upcoming events found.');
    }
  });
}