var neataptic = require('neataptic');
var jsdom = require('jsdom');
var expect = require('chai').expect;
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`);
//var window = document.defaultView;
global.$ = require('jquery')(window);

var network = new neataptic.architect.LSTM(1,6,1);

var trainingData = [
    { input: [0], output: [0] },
    { input: [0], output: [0] },
    { input: [0], output: [1] },
    { input: [1], output: [0] },
    { input: [0], output: [0] },
    { input: [0], output: [0] },
    { input: [0], output: [1] },
];

network.train(trainingData, {
    log: 500,
    iterations: 6000,
    error: 0.03,
    clear: true,
    rate: 0.05,
});

for(var i in trainingData){
    var input = trainingData[i].input;
    var output = Math.round(network.activate([input]));
    //$('html').append('<p>Input: ' + input[0] + ', output: ' + output + '</p>');
}
