var router = require('express').Router({ mergeParams: true });
module.exports = router;

var _      = require("lodash"),
    moment = require("moment"),
    faker  = require("faker");

router.get('/', function(req, res) {

  var context = {};
  context.layout = null;

  context.title = "Shipmen Details";
  context.base_url = require("config").app.base_url;

  context.number = req.params.tracking_number;
  context.weight = getRandomFloat(1,7);
  context.pieces = getRandomInt(1,5);
    var packaging_options = ["Package", "Box", "Envelope", "Oversized Box"];
  context.packaging = packaging_options[getRandomInt(0,3)];
  context.dimensions = getRandomInt(2,8) + "x" + getRandomInt(2,5) + "x" + getRandomInt(1,4) + " in";
  context.po_number = getRandomInt(4325678, 74599999);
  context.destination_address = faker.fake('{{address.streetAddress}}, {{address.city}}, {{address.state}}, {{address.zipCode}}');

  var numSteps = getRandomInt(4,22);
  var steps = [];

  var maxDateFromNow = getRandomInt(0,4);
  var minDateBeforeNow = getRandomInt(0,4);

  var maxDate = moment().add(maxDateFromNow, 'days');
  var minDate = moment().subtract(minDateBeforeNow, 'days');
  var currDate = minDate;

  for (var i=0; i < numSteps; i++) {
    currDate = faker.date.between(minDate, maxDate);
    minDate = currDate;
    steps[i] = {};
    steps[i].date = currDate;
    steps[i].ago = moment(currDate).fromNow();
    steps[i].rel = "item";
    steps[i].activity = faker.lorem.sentence();
    steps[i].address = faker.fake('{{address.city}}, {{address.state}}, {{address.zipCode}}');
  }
  context.steps = steps;

  var randomUser = faker.helpers.createCard(); // random contact card containing many properties

  context.user = _.pick(randomUser, 'name', 'email', 'address', 'phone');
  context.user.uuid = req.params.uuid;

  context.userString = JSON.stringify(context.user);

  var affordances = [
    {rel: context.base_url + "/customer-shipments", url: "/users/{uuid}/shipments"}
  ];
  affordances[affordances.length-1].last = true;
  context.affordances = affordances;

  var entities = [
    {rel: context.base_url + "/current-customer-shipments", url: "/users/" + req.params.uuid + "/shipments"}
  ];
  entities[entities.length-1].last = true;
  context.entities = entities;

  var template = __dirname + '/views/shipment_siren';

  res.set('Content-Type', require("config").app.media_type);

  return res.status(200).render(template, context);

});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFloat(min, max) {
  return (Math.floor((Math.random() * (max - min)) * 100))/100 + min;
}