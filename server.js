/**
 * Created by Mahmoud on 12/7/2017.
 */
//const {Cyton} = require('openbci');
//const APP_UTILITIES = require('source/utilities/app_utilities.js').Core_Utilies;
//const APP_CONSTANTS = APP_UTILITIES.Constants;
//const ourBoard = new Cyton({verbose: true});
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const Cyton = require('openbci-cyton');


var current_experiment = null;
var obj = { };
var port = "/dev/ttyUSB0";
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






app.get('/startScanning', function (req, res) {
//This is where we will get openbci readings to save to a file

  if(!isBoardConnected){
    response.send(new Error("openbci not connected"));
    return;
  }


    var experiment = {
      subject: req.query.subject || "unknown",
      test: req.query.test || "random_test",
      iteration: req.query.iter || 0,
      filePath: path.join(__dirname, data, this.subject, '_', this.test, '_', this.iteration, '.txt');
      total_patterns: 0,
      patterns: []
    }



});

app.get('/connectHeadset', function(req, res){
//request to turn on board

console.log("Request to connect");
  ourBoard.connect(port).then(function(boardSerial){
      console.log("Board connected");
      isBoardConnected = true;

      ourBoard.on('sample', function(sample){

        console.log(sample);

      });


  });


});






// Add sample
function addSample (experiment, output, sample) {
    experiment.total_patterns++;
    input['input']=sample.channelData;
    input['output']=[output];
    experiment.patterns.push(input);
}



// Save experiment
function saveExperiment (experiment) {
    jsonfile.writeFile(experiment.filePath, experiment, { spaces: 2 }, function (error) {
        if (!error) {
            console.log(experiment.name + ' experiment finished with ' + experiment.patternsTotal  + ' samples');
            console.log('Experiment path: ' + experiment.filePath);
        } else {
            console.log(experiment.name + ' experiment failed. sucks to be you.');
        }
    });
}







app.listen(8081);
