/**
 * DAFEL BANDA AI DESIGN SYSTEM - GENETIC EVOLUTION ENGINE
 * Advanced genetic algorithm for evolving design variations
 * 
 * This system uses genetic programming principles to evolve design parameters,
 * creating offspring designs through crossover and mutation operations,
 * and selecting the fittest designs based on aesthetic and functional criteria.
 */

class GeneticEvolution {
  constructor(parametricEngine, colorIntelligence, options = {}) {
    this.parametricEngine = parametricEngine;
    this.colorIntelligence = colorIntelligence;
    
    this.config = {
      populationSize: 20,
      generationLimit: 50,
      mutationRate: 0.15,
      crossoverRate: 0.8,
      elitismRate: 0.1,
      tournamentSize: 3,
      convergenceThreshold: 0.001,
      fitnessWeights: {
        harmony: 0.3,
        contrast: 0.2,
        balance: 0.2,
        novelty: 0.15,
        performance: 0.15
      },
      ...options
    };
    
    this.population = [];
    this.generation = 0;
    this.bestFitness = 0;
    this.fitnessHistory = [];
    this.isEvolutionRunning = false;
  }

  /**
   * Initialize the first generation with random variations
   */
  initializePopulation(baseParameters = null) {
    this.population = [];
    this.generation = 0;
    
    const seedParams = baseParameters || this.getDefaultParameters();
    
    for (let i = 0; i < this.config.populationSize; i++) {
      const individual = this.createRandomIndividual(seedParams);
      this.population.push(individual);
    }
    
    // Evaluate initial population
    this.evaluatePopulation();
    this.sortPopulationByFitness();
    
    console.log(`Initialized population of ${this.config.populationSize} individuals`);
  }

  /**
   * Create a random individual with genetic variations
   */
  createRandomIndividual(baseParams) {
    const individual = {
      id: this.generateIndividualId(),
      generation: this.generation,
      genes: this.mutateParameters(baseParams, 0.5), // High initial variation
      fitness: 0,
      fitnessBreakdown: {},
      design: null,
      parents: null
    };
    
    return individual;
  }

  /**
   * Run complete evolution process
   */
  async evolve(baseParameters = null, progressCallback = null) {
    if (this.isEvolutionRunning) {
      throw new Error('Evolution is already running');
    }
    
    this.isEvolutionRunning = true;
    
    try {
      // Initialize population
      this.initializePopulation(baseParameters);
      
      let converged = false;
      
      while (this.generation < this.config.generationLimit && !converged) {
        // Create next generation
        await this.evolveGeneration();
        
        // Check for convergence
        converged = this.checkConvergence();
        
        // Report progress
        if (progressCallback) {
          progressCallback({
            generation: this.generation,
            bestFitness: this.bestFitness,
            averageFitness: this.getAverageFitness(),
            converged: converged
          });
        }
        
        // Small delay to prevent UI blocking
        await this.sleep(10);
      }
      
      const result = {
        bestIndividual: this.population[0],
        population: this.population,
        generations: this.generation,
        fitnessHistory: this.fitnessHistory,
        converged: converged
      };
      
      console.log(`Evolution completed in ${this.generation} generations`);
      return result;
      
    } finally {
      this.isEvolutionRunning = false;
    }
  }

  /**
   * Evolve one generation
   */
  async evolveGeneration() {
    const newPopulation = [];
    
    // Elitism - keep best individuals
    const eliteCount = Math.floor(this.config.populationSize * this.config.elitismRate);
    for (let i = 0; i < eliteCount; i++) {
      newPopulation.push({ ...this.population[i] });
    }
    
    // Generate offspring to fill remaining slots
    while (newPopulation.length < this.config.populationSize) {
      let offspring;
      
      if (Math.random() < this.config.crossoverRate) {
        // Crossover
        const parent1 = this.selectParent();
        const parent2 = this.selectParent();
        offspring = this.crossover(parent1, parent2);
      } else {
        // Mutation only
        const parent = this.selectParent();
        offspring = this.mutate(parent);
      }
      
      newPopulation.push(offspring);
    }
    
    // Replace population
    this.population = newPopulation;
    this.generation++;
    
    // Evaluate new generation
    this.evaluatePopulation();
    this.sortPopulationByFitness();
    
    // Update fitness history
    this.updateFitnessHistory();
  }

  /**
   * Tournament selection for parent selection
   */
  selectParent() {
    const tournament = [];
    
    // Select random individuals for tournament
    for (let i = 0; i < this.config.tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * this.population.length);
      tournament.push(this.population[randomIndex]);
    }
    
    // Return fittest from tournament
    tournament.sort((a, b) => b.fitness - a.fitness);
    return tournament[0];
  }

  /**
   * Crossover operation between two parents
   */
  crossover(parent1, parent2) {
    const offspring = {
      id: this.generateIndividualId(),
      generation: this.generation,
      genes: this.combineGenes(parent1.genes, parent2.genes),
      fitness: 0,
      fitnessBreakdown: {},
      design: null,
      parents: [parent1.id, parent2.id]
    };
    
    // Apply mutation to offspring
    if (Math.random() < this.config.mutationRate) {
      offspring.genes = this.mutateParameters(offspring.genes, 0.1);
    }
    
    return offspring;
  }

  /**
   * Combine genes from two parents using various crossover strategies
   */
  combineGenes(genes1, genes2) {
    const offspring = JSON.parse(JSON.stringify(genes1)); // Deep clone
    
    // Uniform crossover - randomly select from each parent
    const sections = ['curve', 'layers', 'color', 'opacity', 'grid'];
    
    sections.forEach(section => {
      Object.keys(offspring[section]).forEach(param => {
        if (Math.random() < 0.5) {
          offspring[section][param] = genes2[section][param];
        }
      });
    });
    
    // Arithmetic crossover for numeric values
    const alpha = Math.random(); // Blending factor
    
    offspring.curve.intensity = alpha * genes1.curve.intensity + (1 - alpha) * genes2.curve.intensity;
    offspring.curve.amplitude = alpha * genes1.curve.amplitude + (1 - alpha) * genes2.curve.amplitude;
    offspring.color.saturation = alpha * genes1.color.saturation + (1 - alpha) * genes2.color.saturation;
    offspring.color.lightness = alpha * genes1.color.lightness + (1 - alpha) * genes2.color.lightness;
    
    return this.constrainParameters(offspring);
  }

  /**
   * Mutation operation
   */
  mutate(parent) {
    const offspring = {
      id: this.generateIndividualId(),
      generation: this.generation,
      genes: this.mutateParameters(parent.genes, this.config.mutationRate),
      fitness: 0,
      fitnessBreakdown: {},
      design: null,
      parents: [parent.id]
    };
    
    return offspring;
  }

  /**
   * Mutate parameters with given probability
   */
  mutateParameters(params, mutationRate) {
    const mutated = JSON.parse(JSON.stringify(params)); // Deep clone
    
    // Curve mutations
    if (Math.random() < mutationRate) {
      mutated.curve.intensity += this.gaussianRandom() * 0.2;
    }
    if (Math.random() < mutationRate) {
      mutated.curve.amplitude += this.gaussianRandom() * 30;
    }
    if (Math.random() < mutationRate) {
      mutated.curve.frequency += this.gaussianRandom() * 0.3;
    }
    if (Math.random() < mutationRate) {
      mutated.curve.phase += this.gaussianRandom() * 45;
    }
    
    // Layer mutations
    if (Math.random() < mutationRate) {
      mutated.layers.count += Math.round(this.gaussianRandom() * 2);
    }
    if (Math.random() < mutationRate) {
      mutated.layers.spacing += this.gaussianRandom() * 15;
    }
    if (Math.random() < mutationRate) {
      mutated.layers.thickness += this.gaussianRandom() * 20;
    }
    if (Math.random() < mutationRate) {
      mutated.layers.thicknessVariation += this.gaussianRandom() * 0.1;
    }
    
    // Color mutations
    if (Math.random() < mutationRate) {
      mutated.color.hueRange += this.gaussianRandom() * 20;
    }
    if (Math.random() < mutationRate) {
      mutated.color.hueVariation += this.gaussianRandom() * 15;
    }
    if (Math.random() < mutationRate) {
      mutated.color.saturation += this.gaussianRandom() * 0.1;
    }
    if (Math.random() < mutationRate) {
      mutated.color.lightness += this.gaussianRandom() * 0.1;
    }
    
    // Opacity mutations
    if (Math.random() < mutationRate) {
      mutated.opacity.baseRange += this.gaussianRandom() * 0.1;
    }
    if (Math.random() < mutationRate) {
      mutated.opacity.progression += this.gaussianRandom() * 0.05;
    }
    
    // Grid mutations
    if (Math.random() < mutationRate) {
      mutated.grid.density += Math.round(this.gaussianRandom() * 4);
    }
    if (Math.random() < mutationRate) {
      mutated.grid.intensity += this.gaussianRandom() * 0.1;
    }
    
    return this.constrainParameters(mutated);
  }

  /**
   * Constrain parameters to valid ranges
   */
  constrainParameters(params) {
    // Get parameter definitions from engine
    const paramDefs = this.parametricEngine.parameters;
    
    // Constrain each parameter to its valid range
    Object.keys(paramDefs).forEach(section => {
      Object.keys(paramDefs[section]).forEach(param => {
        const def = paramDefs[section][param];
        if (def.min !== undefined && def.max !== undefined) {
          params[section][param] = Math.max(def.min, Math.min(def.max, params[section][param]));
        }
      });
    });
    
    // Special constraints
    params.layers.count = Math.round(params.layers.count);
    params.grid.density = Math.round(params.grid.density);
    params.curve.phase = ((params.curve.phase % 360) + 360) % 360; // Keep 0-360
    
    return params;
  }

  /**
   * Evaluate fitness for entire population
   */
  evaluatePopulation() {
    this.population.forEach(individual => {
      this.evaluateIndividual(individual);
    });
  }

  /**
   * Evaluate fitness for a single individual
   */
  evaluateIndividual(individual) {
    try {
      // Generate design from genes
      individual.design = this.parametricEngine.generateVariation(individual.genes);
      
      // Calculate fitness components
      const fitnessComponents = {
        harmony: this.evaluateHarmony(individual),
        contrast: this.evaluateContrast(individual),
        balance: this.evaluateBalance(individual),
        novelty: this.evaluateNovelty(individual),
        performance: this.evaluatePerformance(individual)
      };
      
      // Calculate weighted fitness
      individual.fitness = 0;
      Object.keys(fitnessComponents).forEach(component => {
        const weight = this.config.fitnessWeights[component] || 0;
        individual.fitness += fitnessComponents[component] * weight;
      });
      
      individual.fitnessBreakdown = fitnessComponents;
      
    } catch (error) {
      console.error('Error evaluating individual:', error);
      individual.fitness = 0;
      individual.fitnessBreakdown = {};
    }
  }

  /**
   * Evaluate color harmony fitness
   */
  evaluateHarmony(individual) {
    if (!individual.design || !individual.design.layers) return 0;
    
    const colors = individual.design.layers.map(layer => layer.color?.hex).filter(Boolean);
    if (colors.length === 0) return 0;
    
    // Convert to HSL for analysis
    const hslColors = colors.map(color => this.hexToHsl(color));
    
    // Calculate hue harmony
    const hues = hslColors.map(hsl => hsl[0]);
    const hueRange = Math.max(...hues) - Math.min(...hues);
    const hueHarmony = hueRange < 60 ? 1.0 : Math.max(0, 1 - (hueRange - 60) / 120);
    
    // Calculate saturation consistency
    const saturations = hslColors.map(hsl => hsl[1]);
    const saturationVariance = this.calculateVariance(saturations);
    const saturationConsistency = Math.max(0, 1 - saturationVariance * 4);
    
    // Calculate lightness progression
    const lightnesses = hslColors.map(hsl => hsl[2]);
    const lightnessProgression = this.evaluateProgression(lightnesses);
    
    return (hueHarmony + saturationConsistency + lightnessProgression) / 3;
  }

  /**
   * Evaluate contrast fitness
   */
  evaluateContrast(individual) {
    if (!individual.design || !individual.design.layers) return 0;
    
    const opacities = individual.design.layers.map(layer => layer.color?.opacity || 0.5);
    
    // Prefer progressive opacity increase
    const progression = this.evaluateProgression(opacities);
    
    // Ensure sufficient contrast range
    const opacityRange = Math.max(...opacities) - Math.min(...opacities);
    const contrastRange = Math.min(1, opacityRange / 0.4); // Target range of 0.4
    
    return (progression + contrastRange) / 2;
  }

  /**
   * Evaluate visual balance fitness
   */
  evaluateBalance(individual) {
    const genes = individual.genes;
    
    // Evaluate parameter balance
    const curveBalance = this.evaluateParameterBalance(genes.curve);
    const layerBalance = this.evaluateParameterBalance(genes.layers);
    const colorBalance = this.evaluateParameterBalance(genes.color);
    
    // Prefer moderate values over extremes
    const intensityBalance = this.evaluateModerateness(genes.curve.intensity, 0.3, 2.0, 1.0);
    const saturationBalance = this.evaluateModerateness(genes.color.saturation, 0.3, 0.9, 0.6);
    
    return (curveBalance + layerBalance + colorBalance + intensityBalance + saturationBalance) / 5;
  }

  /**
   * Evaluate novelty fitness (diversity from existing population)
   */
  evaluateNovelty(individual) {
    if (this.population.length < 2) return 1.0;
    
    let totalDistance = 0;
    let count = 0;
    
    this.population.forEach(other => {
      if (other.id !== individual.id && other.fitness > 0) {
        const distance = this.calculateParameterDistance(individual.genes, other.genes);
        totalDistance += distance;
        count++;
      }
    });
    
    if (count === 0) return 1.0;
    
    const averageDistance = totalDistance / count;
    return Math.min(1.0, averageDistance / 2.0); // Normalize to 0-1 range
  }

  /**
   * Evaluate performance fitness (render efficiency, file size, etc.)
   */
  evaluatePerformance(individual) {
    const genes = individual.genes;
    
    // Prefer fewer layers for performance
    const layerEfficiency = Math.max(0, 1 - (genes.layers.count - 5) / 7); // Optimal around 5 layers
    
    // Prefer simpler grids
    const gridEfficiency = genes.grid.enabled ? 
      Math.max(0, 1 - (genes.grid.density - 16) / 16) : 1.0;
    
    // Prefer moderate curve complexity
    const curveEfficiency = this.evaluateModerateness(genes.curve.intensity, 0.3, 2.0, 1.0);
    
    return (layerEfficiency + gridEfficiency + curveEfficiency) / 3;
  }

  /**
   * Sort population by fitness (descending)
   */
  sortPopulationByFitness() {
    this.population.sort((a, b) => b.fitness - a.fitness);
    this.bestFitness = this.population[0]?.fitness || 0;
  }

  /**
   * Check for convergence
   */
  checkConvergence() {
    if (this.fitnessHistory.length < 10) return false;
    
    const recent = this.fitnessHistory.slice(-10);
    const variance = this.calculateVariance(recent);
    
    return variance < this.config.convergenceThreshold;
  }

  /**
   * Update fitness history
   */
  updateFitnessHistory() {
    this.fitnessHistory.push(this.bestFitness);
  }

  /**
   * Get population statistics
   */
  getPopulationStats() {
    const fitnesses = this.population.map(ind => ind.fitness);
    
    return {
      generation: this.generation,
      populationSize: this.population.length,
      bestFitness: Math.max(...fitnesses),
      averageFitness: fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length,
      worstFitness: Math.min(...fitnesses),
      standardDeviation: Math.sqrt(this.calculateVariance(fitnesses))
    };
  }

  /**
   * Get the best individuals from current population
   */
  getBestIndividuals(count = 5) {
    return this.population.slice(0, count);
  }

  /**
   * Export evolution results
   */
  exportEvolutionData() {
    return {
      config: this.config,
      generation: this.generation,
      population: this.population.map(ind => ({
        id: ind.id,
        generation: ind.generation,
        genes: ind.genes,
        fitness: ind.fitness,
        fitnessBreakdown: ind.fitnessBreakdown,
        parents: ind.parents
      })),
      fitnessHistory: this.fitnessHistory,
      stats: this.getPopulationStats()
    };
  }

  // Utility methods
  
  getDefaultParameters() {
    return {
      curve: {
        intensity: 1.0,
        amplitude: 180,
        frequency: 1.0,
        phase: 0
      },
      layers: {
        count: 7,
        spacing: 75,
        thickness: 120,
        thicknessVariation: 0.4
      },
      color: {
        hueRange: 190,
        hueVariation: 30,
        saturation: 0.6,
        lightness: 0.65
      },
      opacity: {
        baseRange: 0.6,
        progression: 0.12
      },
      grid: {
        enabled: true,
        density: 16,
        intensity: 0.3,
        layerStart: 4
      }
    };
  }

  generateIndividualId() {
    return 'ind_' + this.generation + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  gaussianRandom() {
    // Box-Muller transform for normal distribution
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  calculateVariance(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  evaluateProgression(values) {
    if (values.length < 2) return 1.0;
    
    // Check if values follow a progressive pattern
    let isIncreasing = true;
    let isDecreasing = true;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i] <= values[i-1]) isIncreasing = false;
      if (values[i] >= values[i-1]) isDecreasing = false;
    }
    
    return (isIncreasing || isDecreasing) ? 1.0 : 0.5;
  }

  evaluateParameterBalance(parameterGroup) {
    const values = Object.values(parameterGroup);
    const normalizedValues = values.map(val => 
      typeof val === 'boolean' ? (val ? 1 : 0) : val
    );
    
    // Prefer moderate variance in parameters
    const variance = this.calculateVariance(normalizedValues);
    return Math.max(0, 1 - variance / 2);
  }

  evaluateModerateness(value, min, max, target) {
    const range = max - min;
    const normalizedValue = (value - min) / range;
    const normalizedTarget = (target - min) / range;
    const distance = Math.abs(normalizedValue - normalizedTarget);
    return Math.max(0, 1 - distance * 2);
  }

  calculateParameterDistance(genes1, genes2) {
    let totalDistance = 0;
    let paramCount = 0;
    
    const sections = ['curve', 'layers', 'color', 'opacity'];
    
    sections.forEach(section => {
      Object.keys(genes1[section]).forEach(param => {
        if (typeof genes1[section][param] === 'number' && typeof genes2[section][param] === 'number') {
          // Normalize by parameter range
          const paramDef = this.parametricEngine.parameters[section][param];
          const range = paramDef ? (paramDef.max - paramDef.min) : 1;
          const distance = Math.abs(genes1[section][param] - genes2[section][param]) / range;
          totalDistance += distance;
          paramCount++;
        }
      });
    });
    
    return paramCount > 0 ? totalDistance / paramCount : 0;
  }

  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h * 360, s, l];
  }

  getAverageFitness() {
    const fitnesses = this.population.map(ind => ind.fitness);
    return fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default GeneticEvolution;