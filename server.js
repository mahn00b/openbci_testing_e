/**
 * Created by Mahmoud on 12/7/2017.
 */

const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const Cyton = require('openbci').Cyton;


var current_experiment = null;
var obj = { };
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

    response.sendFile(path.join(__dirname,'index.html'));


});


//This is where we will get openbci readings to save to a file
app.get('/startExperiment', function (req, res) {

  if(!isBoardConnected){
    console.log("Failed to start new experiment");
    response.send(new Error("openbci not connected"));
    return;
  }

    current_experiment = {
      subject: req.query.subject || "unknown",
      test: req.query.test || "random_test",
      iteration: req.query.iter || 1,
      filePath: path.join(__dirname, "data", this.subject, this.test + '_' + this.iteration + '.txt'),
      total_patterns: 0,
      patterns: []
    };

  console.log("Created a new experiment");


});

app.get('/connectHeadset', function(req, res){
//request to turn on board

console.log("Request to connect");
  ourBoard.connect(otherPort).then(function(boardSerial){
      console.log("Board connected");


      isBoardConnected = true;





  }).catch(function(err){
      console.log("Error maintaining a connection.")

  });


});


app.get('/collectSample', function(req, res){

    if(!current_experiment){
        console.log("experiment not initialized");
        res.send(new Error("experiment not initialized"));
        return;
    }

    if(!isBoardConnected){
        console.log("openbci not connected");
        res.send(new Error("openbci not connected"));
        return;
    }



    console.log("Request to connect");
    ourBoard.connect(otherPort).then(function(boardSerial){
        console.log("Board connected");


        isBoardConnected = true;



        ourBoard.on('ready', function(){

            ourBoard.startStream().then(function(){

                ourBoard.on('sample', function(sample) {

                    addSample(current_experiment, 1 ,sample);

                });

            }).catch(function(err){
                console.log("There was an error collecting a sample",err.message);
            });


        });


    }).catch(function(err){
        console.log("Error maintaining a connection.")

    });

});


app.get('/endExperiment', function(req, res) {

    saveExperiment(current_experiment);
    current_experiment = null;
    ourBoard.disconnect();
});


ourBoard.on('disconnect', function(){

    console.log("Board Disconnected");
    isBoardConnected = false;

});


// Add sample
function addSample (experiment, output, sample) {
    experiment.total_patterns++;
    var input = {};
    input['input']=sample.channelData;
    input['output']=[output];
    experiment.patterns.push(input);
}



// Save experiment
function saveExperiment (experiment) {
    fs.writeFile(experiment.filePath, experiment, { spaces: 2 }, function (error) {
        if (!error) {
            console.log(experiment.test + ' experiment finished with ' + experiment.total_patterns  + ' samples');
            console.log('Experiment path: ' + experiment.filePath);
        } else {
            console.log(experiment.test + ' experiment failed. sucks to be you.');
        }
    });
}

/*
Possible way to handle promise rejections, what an annoying bug

process.on("unhandledRejection", (e) => {
    // handle error
});
*/





app.listen(8081);
