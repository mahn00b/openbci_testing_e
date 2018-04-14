var Cyton = require('openbci').Cyton;

var port = "/dev/ttyUSB1";

var ourboard = new Cyton();

var PythonShell = require('python-shell');
var pyshell = new PythonShell('./predictor.py');

pyshell.send(JSON.stringify([0, 1]));
ourboard.connect(port).then(function(boardSerial){
    console.log("Board connected");

    ourboard.streamStart();
    ourboard.on('sample', function(sample){
        //here is where we need to send to the python file
        //we seem to have issues when we send multiple times
    })
        pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            console.log(message);
        });
        // end the input stream and allow the process to exit
        pyshell.end(function (err) {
            if (err){
                throw err;
            };

            console.log('finished');
        });
});
