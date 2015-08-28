var net = require('net');

var HOST = '0.0.0.0';
var PORT = 6969;
var clientId = 0;
var clientList = {};
var clientsConnected = [];

var ADMIN = 'DA BOSS';

var server = net.createServer(clientConnected);

server.listen(PORT, HOST, function (){
  process.stdout.write('buggah steh werkin on ' + HOST + ':' + PORT + '\n');
});

function clientConnected(client){
  clientId++;
  client.id = clientId;
  clientList[clientId] = client;
  clientsConnected.push(client);

  // console.log(clientsConnected);

  console.log('connections... ', Object.keys(clientList));

  client.on('end', function (){
    console.log(' disconnected');
  });

  client.write('Plz Enterz Usrnamez: ');
  client.setEncoding('utf8');

  // console.log(client);

  console.log('connected ' + client.remoteAddress + ':' + client.remotePort);

  client.on('data', function (data){
    // console.log('client connected');
    // console.log(data);

    console.log('broadcasting ' + client.remoteAddress + ':' + client.remotePort + ' : ' + data);

    if (!clientList.hasOwnProperty(client.remotePort)){
      var key = client.remotePort;
      clientList[key] = data.split('\n')[0];
    }

    for (var n in clientList){
      if (client.remotePort.toString() === n){
        for (var i = 0; i < clientsConnected.length; i++){
          clientsConnected[i].write(clientList[n] + ': ' + data);
        }
      }
    }
  });
}

//admin powers

process.stdin.on('data', function (data){

  if (data.toString().charAt(0) === '/'){
    var command = data.toString().substring(0, data.toString().indexOf(' '));
    var user = data.toString().substring(data.toString().indexOf(' ') + 1, data.length -1);

    console.log('cmd', command + '|  usr', user);
    console.log('commencing admin powers');

    switch (command){
      case '/ls':
        console.log(Object.keys(clientList));
        break;
      case '/kick':
        console.log('kicking ' + user);
        break;
    }
  }else {
    clientsConnected.forEach(function (socket){
      socket.write('[' + ADMIN + ']: ' + data.toString());
    });
  }
});