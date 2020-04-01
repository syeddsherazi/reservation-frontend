Calendar Reservation Front End
=================


Basic Setup of App
-----------

Have implemented the project in Angular 7.2.0 using Angular Cli 7.3.9.

To run the project locally you'll first need to have angular cli installed globally on your system. Install angular cli using following command:

```
sudo npm install -g @angular/cli@7.3.9
```

Now clone project and go to its root and install packages using following command:

```
npm i
```

Now run the project using following command:

```
ng serve
```

The front end will serve on http://localhost:4200


Changes made on Backend Node
-----------

As mentioned in email, I've made slight changes on backend too.

As per my assumption, the end user needs to view the calendar based upon server's timezone. So have returned server's current time along with timezone for utilizing on front end. For this purpose have edited the route to get server time.

```
> GET CALL CODE
app.get('/now', function(request, response) {
  // Since UNIX timestamp would be the same for server and client browser,
  // returning the exact time of server. In this case fixed it to dubai instead of local.
  send(response, {
    time: moment()
      .tz(locale)
      .format('YYYY-MM-DD HH:mm'),
    timeZone: locale
  });
});


> New Response of request
GET localhost:3000/now   HTTP/1.1
Accept: application/json

> Response
{
	"time": "2020-04-01 06:06"
  "timeZone": "Asia/Dubai"
}
```

Another change which I made is comparing the reservation time while cancelling / making a new reservation request. Since the responses which I saw in json were in different times of day, but a room is reserved for an entire day, so I've checked if the time sent in api request and the time of the existing slot are from same day or not ( previously exact time was matching using === operator ). For this I've made two changes in /reserve endpoint:


```
> Changed How isReserved is checked
var isReserved = _.filter(data, function(night) {
      var nightTime = night['time'];
      //   return date == nightTime;
      // Check if passed timestamp is of same day, since reservations are for complete day
      return moment.unix(date).isSame(moment.unix(nightTime), 'day');
}).length;

> Changed how dates are matched while removing reservation
if (reserved) {
      data.push(tennantData);
    } else {
      _.remove(data, currentObject => {
        // Check if passed timestamp is of same day, since reservations are for complete day
        return moment
          .unix(tennantData.time)
          .isSame(moment.unix(currentObject.time), 'day');
      });
}
```

There's no other change on backend. Since it was only a single file. Do tell in case you need me to create a new repo for backend too.

Here's the server.js file for nodejs.

```
var _ = require('lodash'),
  express = require('express'),
  bodyParser = require('body-parser'),
  moment = require('moment-timezone');
var app = express();
var data = require('./init_data.json').data;

// Parse application/json
app.use(bodyParser.json());

// Stub data
var locale = 'Asia/Dubai';

// Probably not the safest way to handle CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Wrapper to send data with max latency of 1 second
function send(response, data) {
  setTimeout(function() {
    response.send(JSON.stringify(data));
  }, Math.floor(Math.random() * 1000));
}

// End-point to get booked nights
// * start and end are integers (seconds since Unix epoch)
app.get('/reserve/:start/:end', function(request, response) {
  var start = parseInt(request.params.start);
  var end = parseInt(request.params.end);

  if (isNaN(start) || isNaN(end)) {
    response.status(400);
    response.send('Bad Request');
    return;
  }

  var reserved = _.filter(data, function(night) {
    var nightTime = night['time'];
    return nightTime >= start && nightTime <= end;
  });

  send(response, {
    reserved: reserved
  });
});

// End-point to change
app.post('/reserve', function(request, response) {
  var body = request.body;
  var date = body.time;

  if (isNaN(date)) {
    response.status(400);
    response.send('Date is NaN');
    return;
  } else {
    var reserved = body.reserved;
    var name = body.tennantName;

    date = moment
      .unix(date)
      .tz(locale)
      .startOf('day')
      .unix();

    var tennantData = {
      tennantName: name,
      time: date
    };

    var isReserved = _.filter(data, function(night) {
      var nightTime = night['time'];
      // Check if passed timestamp is of same day, since reservations are for complete day
      return moment.unix(date).isSame(moment.unix(nightTime), 'day');
    }).length;

    console.log(isReserved);

    if (reserved && isReserved) {
      response.status(400);
      response.send('Slot already reserved');
      return;
    }

    if (!reserved && !isReserved) {
      response.status(400);
      response.send('Slot not found');
      return;
    }

    if (reserved) {
      data.push(tennantData);
    } else {
      _.remove(data, currentObject => {
        // Check if passed timestamp is of same day, since reservations are for complete day
        return moment
          .unix(tennantData.time)
          .isSame(moment.unix(currentObject.time), 'day');
      });
    }

    console.log(data);

    send(response, {
      success: true
    });
  }
});

// Get server time
app.get('/now', function(request, response) {
  // Since UNIX timestamp would be the same for server and client browser,
  // returning the exact time of server. In this case fixed it to dubai instead of local.
  send(response, {
    time: moment()
      .tz(locale)
      .format('YYYY-MM-DD HH:mm'),
    timeZone: locale
  });
});

var port = 3000;
console.info('API server listening at http://localhost:' + port);
app.listen(port);

```


Details of Front End Assignment Solution
---------------

Since the application was quite small, so kept the architecture to minimal e.g. didn't need any separate hierarchy for utils, services etc.

Implemented features include:
 - Calendar UI.
 - User can add a reservation by clicking on a day.
 - User can cancel a reservation by clicking on a day which is already reserved.
 - User can navigate between months by clicking on forward and back icon.
 - User can navigate between months/years by clicking the year/month text, its a dropdown.
 
Some nice to haves:
 - Reservations list showing all reservations of selected month.
 - Tennant name on day in calendar. ( But since the day cell has to be quite small in size, so it isn't necessary that entire name of tennant will be adjusted in it )

