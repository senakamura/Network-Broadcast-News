var net = require('net');

var HOST = '0.0.0.0';
var PORT = 6969;
var clientId = 0;
var clientList = [];
var clientsConnected = [];

var ADMIN = 'DA BOSS';

var server = net.createServer(clientConnected);

server.listen(PORT, HOST, function (){
  process.stdout.write('buggah steh werkin on ' + HOST + ':' + PORT + '\n');
});

function clientConnected(client){
  // clientId++;
  // client.id = clientId;
  // clientList[clientId] = client;
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

    function isClient (element, index, array){
      var key = client.remotePort;
      return element[key];
    }

    if (!clientList.some(isClient)){
      console.log('does not exist! making new client id');
      var key = client.remotePort;
      var newClient = {};
      newClient[key] = {
        username: data.split('\n')[0],
        port: key
      };
      clientList.push(newClient);
    }

    // console.log(clientList);


    clientsConnected.forEach(function (socket){
      console.log(socket.remotePort);
      if (client.remotePort !== socket.remotePort){
        console.log('it dont match!');
        socket.write(data);
      }else {
        console.log('it matches!');

      }
    });

  });
}

//admin powers

process.stdin.on('data', function (data){

  if (data.toString().charAt(0) === '/'){
    var command = data.toString().substring(0, data.toString().indexOf(' '));
    var user = data.toString().substring(data.toString().indexOf(' ') + 1, data.length -1);

    console.log('cmd', command + '    |  usr', user);
    console.log('commencing admin powers');

    switch (command){
      case '/ls':
        console.log(clientList);
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