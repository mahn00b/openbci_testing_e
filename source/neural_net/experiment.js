var path = require('path');
var fs = require('fs');
var argv = require('yargs').argv;
var args = require('minimist')(process.argv.slice(2));
var jsonfile = require('jsonfile');
var OpenBCIBoard = require('openbci');
var channels = ['1','2','3','4','5','6','7','8'];
let testname = args['_'][3];

// Experiment Model
var experiment = {
    name: argv._[3],
    subject: argv._[1],
    duration: argv._[5],
    filePath: path.join('../../resources', 'test_data', argv._[3] + '-' + argv._[1] + '.json'),
    patternsTotal: 0,
    patterns: [],   
};

//For writing to the json file
let input = {};
//debugging
//console.log(experiment);

// OpenBCI

const board = new OpenBCIBoard.OpenBCIBoard();

board.autoFindOpenBCIBoard()
    .then(onBoardFind);

// Board find handler
function onBoardFind (portName) {
    if (portName) {
        console.log('board found', portName);
        board.connect(portName)
            .then(onBoardConnect);
    }
}

// Board connect handler
function onBoardConnect () {
    board.on('ready', onBoardReady);
}

// Board ready handler
function onBoardReady () {
    console.log(experiment.name + ' experiment started');
    board.streamStart();
    board.on('sample', addSample);
    setTimeout(disconnectBoard, experiment.duration);
}

// Add sample
function addSample (sample) {
    experiment.patternsTotal++;
    input['input']=sample.channelData;
    input['output']=[0];
    experiment.patterns.push(input);
}

// Save experiment
function saveExperiment () {
    jsonfile.writeFile(experiment.filePath, experiment, { spaces: 2 }, function (error) {
        if (!error) {
            console.log(experiment.name + ' experiment finished with ' + experiment.patternsTotal  + ' samples');
            console.log('Experiment path: ' + experiment.filePath);
        } else {
            console.log(experiment.name + ' experiment failed. sucks to be you.');
        }
    });
}

// Save experiment
// function saveExperimentToNeural () {
//     jsonfile.writeFile(newFilePath, experiment, { spaces: 2 }, function (error) {
//         if (!error) {
//             //console.log(experiment.name + ' experiment finished with ' + experiment.samplesTotal  + ' samples');
//             console.log("saved to neural net");
//             //console.log('Experiment path: ' + experiment.filePath);
//         } else {
//             console.log(experiment.name + ' experiment failed. sucks to be you.');
//         }
//     });
// }

/**
 * Disconnect board
 */
function disconnectBoard () {
    board.streamStop()
        .then(function () {
            setTimeout(function () {
                board.disconnect();
                saveExperiment();
                //saveExperimentToNeural();
                console.log('board disconnected');
            }, 50);
        });
}
