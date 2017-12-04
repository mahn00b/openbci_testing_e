var neataptic = require('neataptic');
var jsdom = require('jsdom');
var expect = require('chai').expect;
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`);
//var window = document.defaultView;
global.$ = require('jquery')(window);

var TrainingSet = [
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] }
];

var myNetwork = neataptic.architect.Perceptron(2, 3, 1);

myNetwork.train(TrainingSet, {
    log: 10,
    error: 0.03,
    iterations: 1000,
    rate: 0.3
});



// console.log(myNetwork.activate([0,0])); // [0.1257225731473885]
// console.log(myNetwork.activate([0,1])); // [0.9371910625522613]
// console.log(myNetwork.activate([1,0])); // [0.7770757408042104]
// console.log(myNetwork.activate([1,1])); // [0.1639697315652196]
