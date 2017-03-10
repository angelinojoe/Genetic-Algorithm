const TARGET = 'TO BE OR NOT TO BE, THAT IS THE QUESTION';
const OPTIMAL_SCORE = TARGET.length;
const ALPHABET = 'ABCDEFGHIJKLMONPQRSTUVWXYZ, ';
const MUT_PROB = 10;
const GENERATION_SIZE = 50;

const generateGenome = function(){
    var genome = [];
    for (var i = 0; i < TARGET.length; ++i){
        genome[i] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return genome.join('');
};

const getGenePool = function(){
    var genePool = [];
    for (var i = 0; i < GENERATION_SIZE;++i){
        genePool[i] = generateGenome();
    }
    return genePool;
};

const getFitness = function(genome){
    var fitness = 0;
    for (var i = 0; i < TARGET.length; ++i){
        if (genome[i] === TARGET[i]){
            fitness++;
        }
    }
    return fitness;
};

const getFittestHalf = function(pool){
    var poolScores = [];
    var returnPool = [];
    var fittest = 0;
    for (var i = 0; i < pool.length;++i){
      var currentFitness = getFitness(pool[i]);
      poolScores.push(getFitness(pool[i]));
      if (currentFitness > fittest) fittest = currentFitness;
    }
    var counter = 0;
    while (counter < 25){
      for (var j = 0; j < poolScores.length; j++){
        if (poolScores[j] === fittest){
          if (counter < 25){
            returnPool.push(pool[j]);
            counter++;
          }
        }
      }
      fittest--;
    }
    return returnPool;
};

const getSingleFittest = function(pool){
  var fittestIndex = 0;
  var fittest = 0;
    for (var i = 0; i < pool.length;++i){
        if (getFitness(pool[i]) > fittest){
            fittest = getFitness(pool[i]);
            fittestIndex = i;
        }
    }
    return pool[fittestIndex];
};

const doCrossover = function(fittestGenomes){
  var index = TARGET.length / 2;
  var newPopulation = [];
  for (var i = 0; i < fittestGenomes.length; i = i + 2){
    if (!fittestGenomes[i + 2]){
      makeChildren(i, i - 1, false);
    }
    else {
      makeChildren(i, i + 1, true);
    }
  }
    function makeChildren(p1, p2, makeTwo){
      var p1FirstHalf = fittestGenomes[p1].substring(0, index);
      var p1SecondHalf = fittestGenomes[p1].substring(index);
      var p2FirstHalf = fittestGenomes[2].substring(0, index);
      var p2SecondHalf = fittestGenomes[p2].substring(index);

      if (makeTwo){
        newPopulation.push(p1FirstHalf + p2SecondHalf);
        newPopulation.push(p2FirstHalf + p1SecondHalf);
      }
      else {
        newPopulation.push(p1FirstHalf + p2SecondHalf);
      }
    }

  return newPopulation.concat(fittestGenomes);
};

const doMutation = function(genome){
        var newGenome = '';
        for (var i = 0; i < genome.length;++i){
            if (Math.floor(Math.random() * MUT_PROB) === 1){
                //lock in characters if they already match target
                if (genome[i] !== TARGET[i]){
                    newGenome += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
                }
                else {
                    newGenome += genome[i];
                }
            }
            else {
                newGenome += genome[i];
            }
        }
        return newGenome;
    };

const evolve = function(){
    var numGenerations = 0;
    //initial population
    var population = getGenePool();
    //Terminating Criteria: Stop when most fit solution for that generation is equal to the optimal solution
    var fittest = getSingleFittest(population);
    while (getFitness(fittest) !== OPTIMAL_SCORE){
        numGenerations++;
        //Selection function: select best half of generation to survive
        var nextGen = getFittestHalf(population);
        //Crossover: fill generation back to 50 with combinations of fittest genes
        nextGen = doCrossover(nextGen);
        //Mutation: run each solution though function to mutate
        nextGen = nextGen.map((genome) => {
          return doMutation(genome);
        });
        //Start Over Again
        population = nextGen;
        fittest = getSingleFittest(population);
        console.log('Generation: ' + numGenerations + ' Solution: ' + fittest);
        }
       return fittest;
    };


evolve();
