var server = require('nodebootstrap-server');

server.setup(function(runningApp) {

  runningApp.set('view engine', 'handlebars');
  runningApp.engine('handlebars', require('hbs').__express);

  runningApp.use('/shipments/:tracking_number', require('shipment_detail'));

});
