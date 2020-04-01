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

There's no other change on backend. Since it was only a single file, so have emailed the file to you. Do tell in case you need me to create a new repo for backend too.


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
 - Tennant name on day in calendar. ( But since the day cell has to quite small in size, so it isn't necessary that entire name of tennant will be adjusted in it )

