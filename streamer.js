var Cyton = require('openbci').Cyton;

var port = "/dev/ttyUSB0";

var ourboard = new Cyton();

var PythonShell = require('python-shell');
var AGGREGATION_TIMER = null;
var samples = [];
// pyshell.send(JSON.stringify([0, 1]));
// pyshell.send(JSON.stringify([0, 1, 2]));
// pyshell.on('message', function (message) {
//             // received a message sent from the Python script (a simple "print" statement)
//             console.log(message);
//         });
//         // end the input stream and allow the process to exit
//         pyshell.end(function (err) {
//             if (err){
//                 throw err;
//             };
//
//             console.log('finished');
//           });

ourboard.connect(port).then(function(boardSerial){
    console.log("Board connected");


    ourboard.streamStart();

    AGGREGATION_TIMER = setInterval(aggregateInput, 250);

    ourboard.on('sample', function(sample){
        //here is where we need to send to the python file
        //we seem to have issues when we send multiple times
        samples.push(sample.channelData);

    })

});


function aggregateInput(){

  var pyshell = new PythonShell('./predictor.py');

  pyshell.send(JSON.stringify(samples));

  samples = [];
  pyshell.on('message', function (message) {
      // received a message sent from the Python script (a simple "print" statement)

      console.log(message);
      //console.log((parseInt(message) === 1 ? "it's a blink": "it's not a blink"));
  });
  // end the input stream and allow the process to exit
  pyshell.end(function (err) {
      if (err){
          throw err;
      };


  });
}
