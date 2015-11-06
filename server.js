var server = require('nodebootstrap-server');
var healthcheck = require('connect-service-healthcheck');

server.setup(function(runningApp) {

  runningApp.set('view engine', 'handlebars');
  runningApp.engine('handlebars', require('hbs').__express);

  runningApp.use('/shipments/:tracking_number', require('shipment_detail'));

  // Healthcheck
  var pjson = require('./package.json');
  runningApp.use( '/healthcheck',
    healthcheck({
      componentHealthchecks: function() {
        return {foo: BPromise.resolve('foo is good')};
      },
      memoryName: 'VerySecretUsername',
      memoryPass: 'MuchMoreSecretPassword',
      version: pjson.version
    })
  );


});
