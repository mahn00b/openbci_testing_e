/**
 * Created by Mahmoud on 12/7/2017.
 */
const {Cyton} = require('openbci');
const APP_UTILITIES = require('source/utilities/app_utilities').Core_Utilies;
const APP_CONSTANTS = APP_UTILITIES.Constants;
const ourBoard = new Cyton({verbose: true});
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const portName = APP_CONSTANTS.PORTS.ADAMS_PORT_0;

//add static assest: images, icons, stylesheets
app.use('/scripts', express.static(path.join(__dirname, 'js')));
app.use('/plugins', express.static(path.join(__dirname, 'plugins')));
app.use('/images', express.static(path.join(__dirname, 'images')));


//for better optimization I split up images from stylesheets
app.use('/styles', express.static(path.join(__dirname, 'css')));

ourBoard.connect(portName)
    .then(function () {
        ourBoard.on('ready', function () {

            // ourBoard.softReset();
            // ourBoard.usingVersionTwoFirmware();
            ourBoard.streamStart();


            ourBoard.on('error', err => {
                console.log(err);
            });

            ourBoard.on('sample', sample => {
                // sample.channelData.map(x=>{console.log(x)})

            });

        });
    });




app.get('/', function (request, response) {

    response.sendFile(path.join(__dirname,'source','views', 'openbci_tests','vertical_direction_test.html'));


});


app.get('/brainScan', function (request, response) {

    response.send("sample");


});

app.get('/brainConnected', function(response,request){

    response.send(theMan);

});

function setToTrue () { theMan = true;}

app.listen(8081);
