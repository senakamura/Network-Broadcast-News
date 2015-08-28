var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';

var client = net.connect({port: PORT, address: HOST}, function (){
  console.log('wen connect');
  process.stdin.pipe(client);

  client.on('data',function(data){
    process.stdout.write(data);
  });
});

client.on('end', function() {
  console.log('wen disconnect');
});