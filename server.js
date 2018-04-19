/**
 * Created by Mahmoud on 12/7/2017.
 */

const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const Cyton = require('openbci').Cyton;
const Crypto = require('crypto');

var CURRENT_OUTPUT = 0;
var current_experiment = null;
var port = "/dev/ttyUSB0";
var otherPort = "COM3";
var isBoardConnected = false;
//add static assest: images, icons, stylesheets
app.use('/scripts', express.static(path.join(__dirname, 'src/scripts')));
app.use('/plugins', express.static(path.join(__dirname, 'src/plugins')));
//app.use('/images', express.static(path.join(__dirname, 'resources/images')));


//for better optimization I split up images from stylesheets
app.use('/styles', express.static(path.join(__dirname, 'src/styles')));


const ourBoard = new Cyton();


app.get('/', function (request, response) {

    response.sendFile(path.join(__dirname, 'index.html'));


});


//This is where we will get openbci readings to save to a file
app.get('/startExperiment', function (req, res) {
    /*
     if(!isBoardConnected){
     console.log("Failed to start new experiment");
     res.send(new Error("openbci not connected"));
     return;
     }
     */
    console.log("Query Request", req.query);

      var personal_info = req.query.subject + "_" + req.query.test + '_' + req.query.iter;

      const hash = Crypto.createHash('sha256');
        hash.update(personal_info)
        var superman = hash.digest('hex');

    current_experiment = {
        test: req.query.test || "random_test",
        sample_duration: req.query.sample_duration*1000,//convert to milliseconds
        iteration: req.query.iter || 1,
        filePath: path.join(__dirname, "data", superman + '.json'),
        total_patterns: 0,
        date: new Date().toLocaleString(),
        patterns: []
    };

    ourBoard.connect(port).then(function (boardSerial) {
        console.log("Board connected");


        isBoardConnected = true;


          console.log("Board is Streaming");
          ourBoard.streamStart();

            res.send(current_experiment);
            console.log("We have started streaming");
            ourBoard.on('sample', function (sample) {

                    addSample(current_experiment, CURRENT_OUTPUT, sample);

                });




    }).catch(function (err) {
        console.log("Error maintaining a connection.");
        console.log(err.message);
    });


    console.log("Created a new experiment");


});

app.get('/connectHeadset', function (req, res) {
//request to turn on board

    console.log("Request to connect");
    ourBoard.connect(otherPort).then(function (boardSerial) {
        console.log("Board connected");


        isBoardConnected = true;


    }).catch(function (err) {
        console.log("Error maintaining a connection.")

    });


});


app.get('/collectSample', function (req, res) {

    if (!current_experiment) {
        console.log("experiment not initialized");
        res.send(new Error("experiment not initialized"));
        return;
    }
    /*
     if(!isBoardConnected){
     console.log("openbci not connected");
     res.send(new Error("openbci not connected"));
     return;
     }
     */

    CURRENT_OUTPUT = 1;

    setTimeout(resetOutput, current_experiment.sample_duration);

    res.send("sample collected");

    console.log("Adjusted output");

});


app.get('/endExperiment', function (req, res) {
    console.log("Ending Experiment");
    saveExperiment(current_experiment);
    current_experiment = null;
    ourBoard.disconnect();
    res.send("Dude it's over");
});


ourBoard.on('disconnect', function () {

    console.log("Board Disconnected");
    isBoardConnected = false;

});


// Add sample
function addSample(experiment, output, sample) {
    experiment.total_patterns++;
    var input = {};
//    input['input'] = [sample.channelData[0], sample.channelData[1]];
    input['input'] = sample.channelData;
    input['output'] = [output];
    experiment.patterns.push(input);
}


// Save experiment
function saveExperiment(experiment) {
    console.log("Starting to save file", experiment.filePath);
    fs.writeFile(experiment.filePath, JSON.stringify(experiment), {spaces: 2}, function (error) {
        if (!error) {
            //JSON.parse(experiment);
            //console.log(experiment.test + ' experiment finished with ' + experiment.total_patterns + ' samples');
            //console.log('Experiment path: ' + experiment.filePath);
            console.log("Successfully Saved!");
        } else {
            console.log(experiment.test + ' experiment failed. sucks to be you.');
        }
    });
}


 function resetOutput() { CURRENT_OUTPUT = 0}


/*
 Possible way to handle promise rejections, what an annoying bug

 process.on("unhandledRejection", (e) => {
 // handle error
 });
 */


app.listen(8081);
