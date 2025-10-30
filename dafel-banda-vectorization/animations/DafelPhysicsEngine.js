/**
 * DAFEL BANDA ADVANCED PHYSICS ENGINE
 * 
 * A sophisticated animation engine specifically designed for the Dafel banda SVG
 * with physics-based animations, collision detection, fluid dynamics, and more.
 * 
 * Features:
 * - Spring physics for natural motion
 * - Collision detection between layers
 * - Fluid dynamics simulation
 * - Particle systems
 * - GPU acceleration
 * - Performance optimization
 * 
 * @version 1.0.0
 * @author Dafel Technologies
 */

class DafelPhysicsEngine {
    constructor(svgSelector = '.dafel-banda-animatable', config = {}) {
        // Core properties
        this.svg = document.querySelector(svgSelector);
        this.layers = [];
        this.particles = [];
        this.springs = [];
        this.colliders = [];
        
        // Configuration
        this.config = {
            gravity: { x: 0, y: 0.1 },
            friction: 0.98,
            airResistance: 0.999,
            springConstant: 0.1,
            dampening: 0.9,
            maxVelocity: 50,
            collisionRestitution: 0.8,
            targetFPS: 60,
            adaptiveQuality: true,
            enableGPU: true,
            batteryMode: false,
            ...config
        };

        // Performance monitoring
        this.performance = {
            frameCount: 0,
            lastTime: 0,
            fps: 60,
            deltaTime: 0,
            averageFPS: 60,
            memoryUsage: 0,
            isOptimizing: false
        };

        // Animation state
        this.isRunning = false;
        this.animationFrame = null;
        this.timeline = [];
        
        if (!this.svg) {
            console.error('DafelPhysicsEngine: SVG element not found');
            return;
        }

        this.init();
    }

    /**
     * Initialize the physics engine
     */
    init() {
        this.setupGPUAcceleration();
        this.initializeLayers();
        this.setupPerformanceMonitoring();
        this.detectBatteryStatus();
        
        console.log('DafelPhysicsEngine: Initialized with', this.layers.length, 'layers');
    }

    /**
     * Setup GPU acceleration if available
     */
    setupGPUAcceleration() {
        if (!this.config.enableGPU) return;

        // Enable GPU acceleration for all animatable elements
        const elements = this.svg.querySelectorAll('[data-animate="true"]');
        elements.forEach(el => {
            el.style.willChange = 'transform, opacity, filter';
            el.style.transform = 'translateZ(0)'; // Force hardware acceleration
        });

        // Check WebGL support for advanced effects
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.hasWebGL = !!gl;
        
        if (this.hasWebGL) {
            console.log('DafelPhysicsEngine: WebGL acceleration enabled');
        }
    }

    /**
     * Initialize physics bodies for each layer
     */
    initializeLayers() {
        const layerElements = this.svg.querySelectorAll('[data-layer]');
        
        layerElements.forEach((element, index) => {
            const layer = new PhysicsLayer(element, index, this.config);
            this.layers.push(layer);
            
            // Setup collision bounds
            this.setupCollisionBounds(layer);
        });
    }

    /**
     * Setup collision detection bounds for a layer
     */
    setupCollisionBounds(layer) {
        const bbox = layer.element.getBBox();
        const collider = new AABB(
            bbox.x,
            bbox.y,
            bbox.width,
            bbox.height,
            layer
        );
        this.colliders.push(collider);
    }

    /**
     * Performance monitoring setup
     */
    setupPerformanceMonitoring() {
        this.performance.lastTime = performance.now();
        
        // Memory monitoring (if available)
        if (performance.memory) {
            setInterval(() => {
                this.performance.memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
            }, 1000);
        }
    }

    /**
     * Detect battery status for power optimization
     */
    detectBatteryStatus() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.config.batteryMode = battery.level < 0.2 || !battery.charging;
                
                battery.addEventListener('levelchange', () => {
                    this.config.batteryMode = battery.level < 0.2 || !battery.charging;
                    this.adaptQuality();
                });
            });
        }
    }

    /**
     * Adaptive quality based on performance
     */
    adaptQuality() {
        if (!this.config.adaptiveQuality) return;

        const lowPerformance = this.performance.averageFPS < 30;
        const batteryLow = this.config.batteryMode;
        
        if (lowPerformance || batteryLow) {
            // Reduce quality
            this.config.targetFPS = 30;
            this.config.springConstant *= 0.5;
            this.particles = this.particles.slice(0, Math.floor(this.particles.length / 2));
            
            this.performance.isOptimizing = true;
            console.log('DafelPhysicsEngine: Performance optimization enabled');
        } else if (this.performance.isOptimizing && this.performance.averageFPS > 50) {
            // Restore quality
            this.config.targetFPS = 60;
            this.config.springConstant /= 0.5;
            this.performance.isOptimizing = false;
            console.log('DafelPhysicsEngine: Performance optimization disabled');
        }
    }

    /**
     * Start the physics simulation
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }

    /**
     * Stop the physics simulation
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    /**
     * Main animation loop
     */
    animate(currentTime = performance.now()) {
        if (!this.isRunning) return;

        // Calculate delta time
        this.performance.deltaTime = currentTime - this.performance.lastTime;
        this.performance.lastTime = currentTime;
        
        // Update FPS
        this.updateFPS();
        
        // Adaptive quality check
        if (this.performance.frameCount % 60 === 0) {
            this.adaptQuality();
        }

        // Physics update
        this.updatePhysics(this.performance.deltaTime);
        
        // Render
        this.render();
        
        this.performance.frameCount++;
        this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    }

    /**
     * Update FPS calculation
     */
    updateFPS() {
        const fps = 1000 / this.performance.deltaTime;
        this.performance.fps = fps;
        
        // Rolling average
        this.performance.averageFPS = this.performance.averageFPS * 0.9 + fps * 0.1;
    }

    /**
     * Update physics simulation
     */
    updatePhysics(deltaTime) {
        const dt = Math.min(deltaTime / 16.67, 2); // Cap at 2x normal frame time
        
        // Update springs
        this.updateSprings(dt);
        
        // Update layers
        this.layers.forEach(layer => {
            layer.update(dt, this.config);
        });
        
        // Update particles
        this.updateParticles(dt);
        
        // Collision detection
        this.detectCollisions();
        
        // Fluid dynamics
        this.updateFluidDynamics(dt);
    }

    /**
     * Update spring physics
     */
    updateSprings(deltaTime) {
        this.springs.forEach(spring => {
            spring.update(deltaTime, this.config);
        });
    }

    /**
     * Update particle systems
     */
    updateParticles(deltaTime) {
        // Remove dead particles
        this.particles = this.particles.filter(particle => particle.life > 0);
        
        // Update existing particles
        this.particles.forEach(particle => {
            particle.update(deltaTime, this.config);
        });
    }

    /**
     * Collision detection between layers
     */
    detectCollisions() {
        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                const collision = this.colliders[i].intersects(this.colliders[j]);
                if (collision) {
                    this.resolveCollision(this.colliders[i], this.colliders[j]);
                }
            }
        }
    }

    /**
     * Resolve collision between two colliders
     */
    resolveCollision(colliderA, colliderB) {
        const layerA = colliderA.layer;
        const layerB = colliderB.layer;
        
        // Simple elastic collision response
        const tempVelX = layerA.velocity.x;
        const tempVelY = layerA.velocity.y;
        
        layerA.velocity.x = layerB.velocity.x * this.config.collisionRestitution;
        layerA.velocity.y = layerB.velocity.y * this.config.collisionRestitution;
        
        layerB.velocity.x = tempVelX * this.config.collisionRestitution;
        layerB.velocity.y = tempVelY * this.config.collisionRestitution;
        
        // Trigger collision event
        this.onCollision(layerA, layerB);
    }

    /**
     * Fluid dynamics simulation for wave effects
     */
    updateFluidDynamics(deltaTime) {
        // Simplified fluid simulation using wave propagation
        this.layers.forEach((layer, index) => {
            const neighbors = this.getNeighborLayers(layer, index);
            
            neighbors.forEach(neighbor => {
                const distance = this.getDistance(layer.position, neighbor.position);
                const influence = Math.max(0, 1 - distance / 200);
                
                if (influence > 0) {
                    // Apply wave-like forces
                    const waveForce = {
                        x: Math.sin(performance.now() * 0.001 + distance * 0.01) * influence * 0.5,
                        y: Math.cos(performance.now() * 0.001 + distance * 0.01) * influence * 0.3
                    };
                    
                    layer.addForce(waveForce);
                }
            });
        });
    }

    /**
     * Get neighboring layers for fluid dynamics
     */
    getNeighborLayers(layer, currentIndex) {
        const neighbors = [];
        const range = 2;
        
        for (let i = Math.max(0, currentIndex - range); 
             i <= Math.min(this.layers.length - 1, currentIndex + range); 
             i++) {
            if (i !== currentIndex) {
                neighbors.push(this.layers[i]);
            }
        }
        
        return neighbors;
    }

    /**
     * Calculate distance between two points
     */
    getDistance(pos1, pos2) {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Render all physics objects
     */
    render() {
        this.layers.forEach(layer => {
            layer.render();
        });
        
        this.particles.forEach(particle => {
            particle.render();
        });
    }

    /**
     * Add a spring between two layers
     */
    addSpring(layerA, layerB, restLength = null) {
        if (restLength === null) {
            restLength = this.getDistance(layerA.position, layerB.position);
        }
        
        const spring = new Spring(layerA, layerB, restLength);
        this.springs.push(spring);
        return spring;
    }

    /**
     * Create particle burst effect
     */
    createParticleBurst(x, y, count = 20, config = {}) {
        const defaultConfig = {
            life: 60,
            speed: 5,
            size: 2,
            color: '#3AAFA3',
            gravity: true
        };
        
        const particleConfig = { ...defaultConfig, ...config };
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = particleConfig.speed * (0.5 + Math.random() * 0.5);
            
            const particle = new Particle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                particleConfig
            );
            
            this.particles.push(particle);
        }
    }

    /**
     * Apply impulse to a layer
     */
    applyImpulse(layerIndex, forceX, forceY) {
        if (layerIndex >= 0 && layerIndex < this.layers.length) {
            this.layers[layerIndex].addForce({ x: forceX, y: forceY });
        }
    }

    /**
     * Collision event handler
     */
    onCollision(layerA, layerB) {
        // Create particle burst at collision point
        const midX = (layerA.position.x + layerB.position.x) / 2;
        const midY = (layerA.position.y + layerB.position.y) / 2;
        
        this.createParticleBurst(midX, midY, 10, {
            life: 30,
            speed: 3,
            size: 1.5,
            color: '#5FD4C4'
        });
        
        // Trigger custom event
        this.svg.dispatchEvent(new CustomEvent('layerCollision', {
            detail: { layerA, layerB }
        }));
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            fps: Math.round(this.performance.averageFPS),
            frameTime: Math.round(this.performance.deltaTime * 100) / 100,
            memoryUsage: Math.round(this.performance.memoryUsage * 100) / 100,
            isOptimizing: this.performance.isOptimizing,
            layerCount: this.layers.length,
            particleCount: this.particles.length,
            springCount: this.springs.length
        };
    }

    /**
     * Clean up and destroy the engine
     */
    destroy() {
        this.stop();
        
        // Clean up GPU acceleration
        const elements = this.svg.querySelectorAll('[data-animate="true"]');
        elements.forEach(el => {
            el.style.willChange = 'auto';
            el.style.transform = '';
        });
        
        // Clear arrays
        this.layers = [];
        this.particles = [];
        this.springs = [];
        this.colliders = [];
        
        console.log('DafelPhysicsEngine: Destroyed');
    }
}

/**
 * Physics Layer Class
 */
class PhysicsLayer {
    constructor(element, index, config) {
        this.element = element;
        this.index = index;
        
        // Physics properties
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.forces = { x: 0, y: 0 };
        this.mass = parseFloat(element.getAttribute('data-mass')) || 1.0;
        this.originalOpacity = parseFloat(element.getAttribute('opacity')) || 1.0;
        
        // Get initial transform
        const transform = element.style.transform || '';
        const matrix = this.parseTransform(transform);
        this.position.x = matrix.translateX;
        this.position.y = matrix.translateY;
        
        // Animation properties
        this.rotation = 0;
        this.scale = 1;
        this.opacity = this.originalOpacity;
    }

    parseTransform(transform) {
        const matrix = {
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
        };
        
        // Parse translate
        const translateMatch = transform.match(/translate\(([^)]+)\)/);
        if (translateMatch) {
            const values = translateMatch[1].split(',');
            matrix.translateX = parseFloat(values[0]) || 0;
            matrix.translateY = parseFloat(values[1]) || 0;
        }
        
        return matrix;
    }

    addForce(force) {
        this.forces.x += force.x;
        this.forces.y += force.y;
    }

    update(deltaTime, config) {
        // Apply forces
        this.acceleration.x = this.forces.x / this.mass;
        this.acceleration.y = this.forces.y / this.mass;
        
        // Apply gravity
        this.acceleration.x += config.gravity.x;
        this.acceleration.y += config.gravity.y;
        
        // Update velocity
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        
        // Apply friction
        this.velocity.x *= config.friction;
        this.velocity.y *= config.friction;
        
        // Limit velocity
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > config.maxVelocity) {
            this.velocity.x = (this.velocity.x / speed) * config.maxVelocity;
            this.velocity.y = (this.velocity.y / speed) * config.maxVelocity;
        }
        
        // Update position
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        
        // Clear forces
        this.forces.x = 0;
        this.forces.y = 0;
    }

    render() {
        // Apply transform to DOM element
        const transform = `translate(${this.position.x}px, ${this.position.y}px) 
                          scale(${this.scale}) 
                          rotate(${this.rotation}deg)`;
        
        this.element.style.transform = transform;
        this.element.style.opacity = this.opacity;
    }
}

/**
 * Spring Physics Class
 */
class Spring {
    constructor(bodyA, bodyB, restLength, stiffness = 0.1, damping = 0.9) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;
        this.restLength = restLength;
        this.stiffness = stiffness;
        this.damping = damping;
    }

    update(deltaTime, config) {
        const dx = this.bodyB.position.x - this.bodyA.position.x;
        const dy = this.bodyB.position.y - this.bodyA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;
        
        const extension = distance - this.restLength;
        const forceAmount = extension * this.stiffness;
        
        const forceX = (dx / distance) * forceAmount;
        const forceY = (dy / distance) * forceAmount;
        
        // Apply forces
        this.bodyA.addForce({ x: forceX, y: forceY });
        this.bodyB.addForce({ x: -forceX, y: -forceY });
        
        // Apply damping
        const relativeVelX = this.bodyB.velocity.x - this.bodyA.velocity.x;
        const relativeVelY = this.bodyB.velocity.y - this.bodyA.velocity.y;
        
        const dampingForceX = relativeVelX * this.damping;
        const dampingForceY = relativeVelY * this.damping;
        
        this.bodyA.addForce({ x: dampingForceX, y: dampingForceY });
        this.bodyB.addForce({ x: -dampingForceX, y: -dampingForceY });
    }
}

/**
 * Particle Class
 */
class Particle {
    constructor(x, y, vx, vy, config) {
        this.position = { x, y };
        this.velocity = { x: vx, y: vy };
        this.life = config.life;
        this.maxLife = config.life;
        this.size = config.size;
        this.color = config.color;
        this.gravity = config.gravity;
        
        // Create DOM element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.element.setAttribute('r', this.size);
        this.element.setAttribute('fill', this.color);
        this.element.style.pointerEvents = 'none';
        
        // Add to SVG
        const svg = document.querySelector('.dafel-banda-animatable');
        if (svg) {
            svg.appendChild(this.element);
        }
    }

    update(deltaTime, config) {
        // Apply gravity if enabled
        if (this.gravity) {
            this.velocity.y += config.gravity.y * deltaTime;
        }
        
        // Update position
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        
        // Apply air resistance
        this.velocity.x *= config.airResistance;
        this.velocity.y *= config.airResistance;
        
        // Decrease life
        this.life--;
        
        // Update opacity based on life
        const opacity = this.life / this.maxLife;
        this.element.style.opacity = opacity;
        
        // Remove element if dead
        if (this.life <= 0 && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    render() {
        if (this.life > 0) {
            this.element.setAttribute('cx', this.position.x);
            this.element.setAttribute('cy', this.position.y);
        }
    }
}

/**
 * AABB Collision Detection Class
 */
class AABB {
    constructor(x, y, width, height, layer) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.layer = layer;
    }

    intersects(other) {
        return !(this.x + this.width < other.x ||
                other.x + other.width < this.x ||
                this.y + this.height < other.y ||
                other.y + other.height < this.y);
    }

    update() {
        // Update position based on layer position
        const bbox = this.layer.element.getBBox();
        this.x = bbox.x + this.layer.position.x;
        this.y = bbox.y + this.layer.position.y;
    }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DafelPhysicsEngine, PhysicsLayer, Spring, Particle, AABB };
}