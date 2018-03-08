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


//add static assest: images, icons, stylesheets
app.use('/scripts', express.static(path.join(__dirname, 'source/scripts')));
app.use('/plugins', express.static(path.join(__dirname, 'source/plugins')));
app.use('/images', express.static(path.join(__dirname, 'resources/images')));


//for better optimization I split up images from stylesheets
app.use('/styles', express.static(path.join(__dirname, 'source/styles')));




app.get('/', function (request, response) {

    response.sendFile(path.join(__dirname,'index.html'));


});


app.get('/brainScan', function (request, response) {

    response.send("sample");


});

app.get('/brainConnected', function(response,request){

    response.send(theMan);

});


app.listen(8081);
