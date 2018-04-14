var PythonShell = require('python-shell');
var Cyton = require('openbci').Cyton;

var port = "/dev/ttyUSB1";

var ourboard = new Cyton();

var py = new PythonShell('./predictor.py', {mode: 'text'});

py.on('message', function(data){
    console.log("we got some python stuff");
    console.log(data);

});

py.on('error', function(err){

  console.log('Python messed up', err.message);
});


ourboard.connect(port).then(function(boardSerial){
    console.log("Board connected");


    py.send({test: 'testing'});

      // ourboard.streamStart();
      //
      // ourboard.on('sample', function(sample){
      //
      //   py.send(JSON.stringify(sample.channelData));
      //
      // });
      //

  py.receive("dude");


ourboard.on('disconnect', function(){

  py.end(function(err){
    if(err){
      throw err;
    };
    consol.log(finished);
  });

});






}).catch(function(err){
  console.log("error connecting to openbci", err.message);
});
