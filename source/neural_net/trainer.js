var glob = require("glob");
var path = require('path');
var argv = require('yargs').argv;
var async = require('async');
var jsonfile = require('jsonfile');
var OpenBCIBoard = require('openbci-sdk');
var neataptic = require('neataptic');
var jsdom = require('jsdom');
var expect = require('chai').expect;
var Node = neataptic.Node;
var Neat = neataptic.Neat;
var Network = neataptic.Network;
var Methods = neataptic.Methods;
var Architect = neataptic.Architect;
var Trainer = neataptic.Trainer;

var randomExperiment;
var trainedNetwork;
var channelsToFilter = []; // Add channels to filter. Eg.: ['2','4']
var networkStateFilePath = path.join(__dirname, '/network_states/state.json');
var experimentFilesPath = path.join(__dirname, '../../resources/test_data/*.json');
var action = argv._[0] || null;
// OpenBCI
const board = new OpenBCIBoard.OpenBCIBoard();

let classifiers = {};
//console.log(typeof(dsp.DFT));
//var dft = new dsp.DFT(1024,44100);
/**
 * Read experiments and invoke @interpret
 * @type {Array}
 */
glob(experimentFilesPath, (error, experimentFiles) => {
    experimentFiles = experimentFiles
        .map((experimentFile) => {
            return async.apply(jsonfile.readFile, experimentFile)
        });
    
    async.parallel(experimentFiles, (error, experiments) => {
        if (error) return console.log('failed to load experiments');
        experiments.forEach(x=>{classifiers[x.name] = 0});
        
        // experiments = experiments.map(x=>{
        //     //console.log(x);
        //     x['patterns'].map(y=>{
        //         console.log(dft.forward(y['input']));
        //         return dft.forward(y['input']);
        //     });
        // });
        // experiments.forEach(x=>{console.log(x)});
        
        if (action === 'exercise') {
            var patterns = getPatternsFromExperiments(experiments);
            exercise(patterns,experimentFiles.length);
        }
        if (action === 'test') {
            var experiments = getPatternsFromExperiments(experiments);
            //randomExperiment = experiments[
            //    Math.floor(Math.random() * experiments.length)];
            //console.log('testing: ' + randomExperiment.name);
            experiments.forEach(x=>{
                test(x);
            });
        }
        if (action === 'interpret') {
            jsonfile.readFile(networkStateFilePath, (error, networkState) => {
                trainedNetwork = new Network.fromJSON(networkState);
                board.autoFindOpenBCIBoard()
                    .then(onBoardFind);
            });

        }
    });
});

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
    board.streamStart();
    board.on('sample', interpret);
    setTimeout(disconnectBoard, argv._[2]);
}

/**
 * getRandomPatternFromExperiments
 * @param experiments
 */
function getRandomPatternFromExperiments (experiments) {
    randomExperiment = experiments[Math.floor(Math.random() * experiments.length)];
    var randomPattern = randomExperiment.patterns[Math.floor(Math.random() * randomExperiment.patterns.length)];
    return filterChannelsFromPatterns([randomPattern], channelsToFilter)[0];
}

/**
 * exercise
 * @param patterns
 */
function exercise (patterns,numFiles) {
    //console.log('training...', patterns);
    var net = new neataptic.architect.NARX(8,[8,8,6,4],1,8,8);
    
    net.train(patterns, {
        log: 100,
        iterations: 10000,
        error: 0.0001,
        rate: 0.2
    });
    
    var trainingState = net.toJSON();
    jsonfile.writeFileSync(networkStateFilePath, trainingState);
    console.log('training completed. neural network state located at ' + networkStateFilePath);
}

/**
 * test
 * @param input
 */
function test (input) {
    jsonfile.readFile(networkStateFilePath, (error, networkState) => {
        var net = new neataptic.Network.fromJSON(networkState);
        //console.log('interpreting...', input['input']);
        var output = net.activate(input['input']);
        console.log("actual: " + output + ',' + " target: " + input['output']);
        //getTestResults(output);
    });
}

/**
 * interpret
 * @param sample
 */
function interpret (sample) {
    var output = {};
    var result = [];
    result.push(trainNetwork.activate(sample.channelData));
    classifiers[getMostAccurate(result).keyword]++;
}

/**
 * getPatternsFromExperiments: Parses patterns the way neataptic is expecting it
 */
function getPatternsFromExperiments(experiments) {
    var patterns = [];
    experiments.forEach((experiment) => {
        patterns = patterns.concat(experiment.patterns);
    });
    return filterChannelsFromPatterns(patterns, channelsToFilter);
}

/**
 * filterChannelsFromPatterns
 * @param patterns
 * @param channels
 */
function filterChannelsFromPatterns (patterns, channels) {
    patterns.forEach((pattern) => {
        var numsArray = [];
        Object.keys(pattern.input).forEach((index) => {
            numsArray.push(pattern.input[index]);
        });
        var lowestChannel = Math.min.apply(Math, numsArray);
        var highestChannel = Math.max.apply(Math, numsArray);
        //console.log(lowestChannel, highestChannel);
        Object.keys(pattern.input).forEach((channel) => {
            // Make all numbers positive
            pattern.input[channel] = (pattern.input[channel] - lowestChannel) / (highestChannel - lowestChannel);
            if (channels.indexOf(channel) !== -1) {
                delete pattern.input[channel];
            }
        });
    });
    return patterns;
}

/**
 * getMostAccurate
 * @param output
 */
function getMostAccurate (output) {
    var result = {};
    var scores = [];
    var mostAccurate;
    //console.log(output);
    //console.log(Object.keys(output));
    Object.keys(output).forEach((keyword) => {
        scores.push(output[keyword]);
    });
    console.log("****test****");
    console.log(output);
    mostAccurate = Math.max.apply(Math, scores);
    Object.keys(output).forEach((keyword) => {
        if (output[keyword] === mostAccurate) {
            result = {
                keyword: keyword,
                accuracy: output[keyword]
            }
        }
    });
    //console.log(result);
    return result;
}

/**
 * getTestResults
 * @param output
 */
function getTestResults (output) {
    var mostAccurate = getMostAccurate(output, randomExperiment);
    console.log('random experiment selected: ' + randomExperiment.name);
    console.log('most accurate output was ' + mostAccurate.keyword + ' with ' + mostAccurate.accuracy + ' accuracy');
   
    if (mostAccurate.keyword === randomExperiment.name) {
        console.log('TEST PASSED');
    } else {
        console.log('output', output);
        console.log('TEST FAILED');
    }
}

/**
 * disconnectBoard
 */
function disconnectBoard () {
    board.streamStop()
        .then(function () {
            setTimeout(function () {
                console.log(classifiers);
                board.disconnect();
            }, 50);
        });
}
