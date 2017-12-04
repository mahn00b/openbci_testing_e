var neataptic = require('neataptic');
var jsdom = require("jsdom");

var WIDTH            = 800;
var HEIGHT           = 800;

var MAX_AREA         = 10000;
var MIN_AREA         = 400;

var RELATIVE_SIZE    = 1.1;
var DECREASE_SIZE    = 0.998;

var DETECTION_RADIUS = 150;
var FOOD_DETECTION   = 3;
var PLAYER_DETECTION = 3;

var MIN_SPEED        = 0.6;
var SPEED            = 3;

var FOOD_AREA        = 80;
var FOOD_AMOUNT      = Math.round(WIDTH * HEIGHT * 4e-4);

// GA settings
var PLAYER_AMOUNT     = Math.round(WIDTH * HEIGHT * 8e-5);
var ITERATIONS        = 1000;
var START_HIDDEN_SIZE = 0;
var MUTATION_RATE     = 0.3;
var ELITISM_PERCENT   = 0.1;

// Trained population
var USE_TRAINED_POP = true;
/** Construct the genetic algorithm */
function initNeat(){
  var neat = new neataptic.Neat(
    1 + PLAYER_DETECTION * 3 + FOOD_DETECTION * 2,
    2,
    null,
    {
      mutation: neataptic.methods.mutation.ALL,
      popsize: PLAYER_AMOUNT,
      mutationRate: MUTATION_RATE,
      elitism: Math.round(ELITISM_PERCENT * PLAYER_AMOUNT),
      network: new neataptic.architect.Random(
        1 + PLAYER_DETECTION * 3 + FOOD_DETECTION * 2,
        START_HIDDEN_SIZE,
        2
      )
    }
  );

    if(USE_TRAINED_POP) neat.population = PLAYER_AMOUNT;
    return neat;
}

var neat = initNeat();

/** Start the evaluation of the current generation */
function startEvaluation(){
  players = [];
  highestScore = 0;

  for(var genome in neat.population){
    genome = neat.population[genome];
    new Player(genome);
  }
}

/** End the evaluation of the current generation */
function endEvaluation(){
  console.log('Generation:', neat.generation, '- average score:', neat.getAverage());

  neat.sort();
  var newPopulation = [];

  // Elitism
  for(var i = 0; i < neat.elitism; i++){
    newPopulation.push(neat.population[i]);
  }

  // Breed the next individuals
  for(var i = 0; i < neat.popsize - neat.elitism; i++){
    newPopulation.push(neat.getOffspring());
  }

  // Replace the old population with the new population
  neat.population = newPopulation;
  neat.mutate();

  neat.generation++;
  startEvaluation();
}




