/**
 * DAFEL BANDA TOUCH & GESTURE ENGINE
 * 
 * Advanced touch and gesture recognition system for interactive animations
 * of the Dafel banda SVG. Supports multi-touch, gestures, and device motion.
 * 
 * Features:
 * - Multi-touch gesture recognition
 * - Pinch-to-zoom animations
 * - Swipe gesture effects
 * - Rotation gesture handling
 * - Device orientation animations
 * - Haptic feedback (when available)
 * - Touch pressure sensitivity
 * - Gesture-based morphing
 * 
 * @version 1.0.0
 * @author Dafel Technologies
 */

class DafelTouchEngine {
    constructor(svgSelector = '.dafel-banda-animatable', config = {}) {
        this.svg = document.querySelector(svgSelector);
        this.container = this.svg.parentElement;
        
        this.config = {
            enableMultiTouch: true,
            enableGestures: true,
            enableDeviceMotion: true,
            enableHaptics: true,
            swipeThreshold: 50,
            pinchThreshold: 0.1,
            rotationThreshold: 15,
            pressureSensitivity: 1.0,
            touchRadius: 50,
            gestureDebounce: 100,
            animationDuration: 300,
            elasticity: 0.3,
            ...config
        };

        // Touch state
        this.touches = new Map();
        this.gestureState = {
            isActive: false,
            type: null,
            startTime: 0,
            lastGesture: null
        };
        
        // Animation state
        this.layers = [];
        this.isAnimating = false;
        this.animationFrames = new Set();
        
        // Gesture recognition
        this.gestureRecognizer = new GestureRecognizer(this.config);
        this.touchTracker = new TouchTracker();
        this.deviceMotion = new DeviceMotionHandler(this.config);
        
        // Effects
        this.rippleEffects = [];
        this.touchParticles = [];

        if (!this.svg) {
            console.error('DafelTouchEngine: SVG element not found');
            return;
        }

        this.init();
    }

    /**
     * Initialize the touch engine
     */
    init() {
        this.setupLayers();
        this.setupTouchHandlers();
        this.setupGestureHandlers();
        this.setupDeviceMotion();
        this.createTouchVisualizations();
        
        console.log('DafelTouchEngine: Initialized');
    }

    /**
     * Setup layer references
     */
    setupLayers() {
        const layerElements = this.svg.querySelectorAll('[data-layer]');
        
        layerElements.forEach((element, index) => {
            this.layers.push({
                element: element,
                index: index,
                originalTransform: element.style.transform || '',
                originalOpacity: parseFloat(element.getAttribute('opacity')) || 1.0,
                bounds: element.getBBox(),
                isActive: false,
                touchCount: 0
            });
        });
    }

    /**
     * Setup touch event handlers
     */
    setupTouchHandlers() {
        // Prevent default touch behaviors
        this.container.style.touchAction = 'none';
        this.container.style.userSelect = 'none';
        
        // Touch events
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.container.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });
        
        // Mouse events for desktop compatibility
        this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.container.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Pointer events (modern approach)
        if (window.PointerEvent) {
            this.container.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
            this.container.addEventListener('pointermove', (e) => this.handlePointerMove(e));
            this.container.addEventListener('pointerup', (e) => this.handlePointerUp(e));
            this.container.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
        }
    }

    /**
     * Setup gesture handlers
     */
    setupGestureHandlers() {
        if (!this.config.enableGestures) return;
        
        // Custom gesture events
        this.gestureRecognizer.on('pinch', (data) => this.handlePinchGesture(data));
        this.gestureRecognizer.on('rotate', (data) => this.handleRotateGesture(data));
        this.gestureRecognizer.on('swipe', (data) => this.handleSwipeGesture(data));
        this.gestureRecognizer.on('tap', (data) => this.handleTapGesture(data));
        this.gestureRecognizer.on('longpress', (data) => this.handleLongPressGesture(data));
        this.gestureRecognizer.on('spread', (data) => this.handleSpreadGesture(data));
    }

    /**
     * Setup device motion handlers
     */
    setupDeviceMotion() {
        if (!this.config.enableDeviceMotion) return;
        
        this.deviceMotion.on('tilt', (data) => this.handleDeviceTilt(data));
        this.deviceMotion.on('shake', (data) => this.handleDeviceShake(data));
        this.deviceMotion.on('orientation', (data) => this.handleOrientationChange(data));
        
        this.deviceMotion.start();
    }

    /**
     * Create touch visualization elements
     */
    createTouchVisualizations() {
        // Create ripple effect container
        const rippleContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        rippleContainer.id = 'touch-ripples';
        this.svg.appendChild(rippleContainer);
        
        // Create particle container
        const particleContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        particleContainer.id = 'touch-particles';
        this.svg.appendChild(particleContainer);
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        e.preventDefault();
        
        Array.from(e.changedTouches).forEach(touch => {
            this.addTouch(touch);
        });
        
        this.gestureRecognizer.handleTouchStart(e);
        this.updateTouchAnimations();
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        e.preventDefault();
        
        Array.from(e.changedTouches).forEach(touch => {
            this.updateTouch(touch);
        });
        
        this.gestureRecognizer.handleTouchMove(e);
        this.updateTouchAnimations();
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        e.preventDefault();
        
        Array.from(e.changedTouches).forEach(touch => {
            this.removeTouch(touch);
        });
        
        this.gestureRecognizer.handleTouchEnd(e);
        this.updateTouchAnimations();
    }

    /**
     * Add touch point
     */
    addTouch(touch) {
        const touchData = {
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY,
            startX: touch.clientX,
            startY: touch.clientY,
            pressure: touch.force || 0.5,
            startTime: performance.now(),
            lastTime: performance.now(),
            velocity: { x: 0, y: 0 }
        };
        
        this.touches.set(touch.identifier, touchData);
        
        // Create touch visualization
        this.createTouchRipple(touchData);
        this.createTouchParticles(touchData);
        
        // Trigger haptic feedback
        this.triggerHapticFeedback('light');
        
        // Update affected layers
        this.updateLayerTouchState(touchData, true);
    }

    /**
     * Update touch point
     */
    updateTouch(touch) {
        const existing = this.touches.get(touch.identifier);
        if (!existing) return;
        
        const now = performance.now();
        const dt = now - existing.lastTime;
        
        // Calculate velocity
        const dx = touch.clientX - existing.x;
        const dy = touch.clientY - existing.y;
        existing.velocity.x = dx / dt;
        existing.velocity.y = dy / dt;
        
        // Update position
        existing.x = touch.clientX;
        existing.y = touch.clientY;
        existing.pressure = touch.force || 0.5;
        existing.lastTime = now;
        
        this.touches.set(touch.identifier, existing);
        
        // Update layer interactions
        this.updateLayerTouchState(existing, true);
    }

    /**
     * Remove touch point
     */
    removeTouch(touch) {
        const touchData = this.touches.get(touch.identifier);
        if (!touchData) return;
        
        this.touches.delete(touch.identifier);
        
        // Create release effects
        this.createReleaseEffect(touchData);
        
        // Update layer states
        this.updateLayerTouchState(touchData, false);
    }

    /**
     * Handle pinch gesture
     */
    handlePinchGesture(data) {
        const { scale, center } = data;
        
        this.layers.forEach((layer, index) => {
            const layerScale = 1 + (scale - 1) * (1 - index * 0.1);
            const transform = `${layer.originalTransform} scale(${layerScale})`;
            
            layer.element.style.transform = transform;
            layer.element.style.transformOrigin = `${center.x}px ${center.y}px`;
        });
        
        // Visual feedback
        this.createPinchEffect(center, scale);
        this.triggerHapticFeedback('medium');
    }

    /**
     * Handle rotation gesture
     */
    handleRotateGesture(data) {
        const { rotation, center } = data;
        
        this.layers.forEach((layer, index) => {
            const layerRotation = rotation * (1 - index * 0.15);
            const transform = `${layer.originalTransform} rotate(${layerRotation}deg)`;
            
            layer.element.style.transform = transform;
            layer.element.style.transformOrigin = `${center.x}px ${center.y}px`;
        });
        
        // Visual feedback
        this.createRotationEffect(center, rotation);
        this.triggerHapticFeedback('light');
    }

    /**
     * Handle swipe gesture
     */
    handleSwipeGesture(data) {
        const { direction, velocity, distance } = data;
        
        // Create wave effect based on swipe direction
        this.createSwipeWave(direction, velocity, distance);
        
        // Animate layers with stagger
        this.layers.forEach((layer, index) => {
            const delay = index * 50;
            const offsetMultiplier = Math.min(distance / 200, 2);
            
            setTimeout(() => {
                this.animateLayerSwipe(layer, direction, offsetMultiplier);
            }, delay);
        });
        
        this.triggerHapticFeedback('heavy');
    }

    /**
     * Handle tap gesture
     */
    handleTapGesture(data) {
        const { x, y, pressure } = data;
        
        // Find touched layer
        const touchedLayer = this.getLayerAtPoint(x, y);
        
        if (touchedLayer) {
            this.animateLayerTap(touchedLayer, x, y, pressure);
            this.createTapExplosion(x, y, pressure);
        }
        
        this.triggerHapticFeedback('light');
    }

    /**
     * Handle long press gesture
     */
    handleLongPressGesture(data) {
        const { x, y, duration } = data;
        
        const touchedLayer = this.getLayerAtPoint(x, y);
        
        if (touchedLayer) {
            this.morphLayerOnLongPress(touchedLayer, duration);
            this.createLongPressEffect(x, y, duration);
        }
        
        this.triggerHapticFeedback('heavy');
    }

    /**
     * Handle spread gesture (multi-finger expansion)
     */
    handleSpreadGesture(data) {
        const { fingerCount, expansion, center } = data;
        
        // Create expanding wave effect
        this.layers.forEach((layer, index) => {
            const expansionFactor = 1 + expansion * 0.3 * (1 - index * 0.1);
            const transform = `${layer.originalTransform} scale(${expansionFactor})`;
            
            layer.element.style.transform = transform;
        });
        
        // Create visual spread effect
        this.createSpreadEffect(center, fingerCount, expansion);
        this.triggerHapticFeedback('medium');
    }

    /**
     * Handle device tilt
     */
    handleDeviceTilt(data) {
        const { alpha, beta, gamma } = data;
        
        // Create parallax effect based on device orientation
        this.layers.forEach((layer, index) => {
            const depth = (this.layers.length - index - 1) * 2;
            const offsetX = gamma * depth * 0.1;
            const offsetY = beta * depth * 0.1;
            
            const transform = `${layer.originalTransform} translate(${offsetX}px, ${offsetY}px)`;
            layer.element.style.transform = transform;
        });
    }

    /**
     * Handle device shake
     */
    handleDeviceShake(data) {
        const { intensity } = data;
        
        // Create shake effect on all layers
        this.layers.forEach(layer => {
            this.animateShake(layer.element, intensity);
        });
        
        // Create particle burst
        this.createShakeParticles(intensity);
        this.triggerHapticFeedback('heavy');
    }

    /**
     * Handle orientation change
     */
    handleOrientationChange(data) {
        const { orientation } = data;
        
        // Animate transition to new orientation
        const rotationDegree = orientation === 'landscape' ? 5 : -5;
        
        this.layers.forEach((layer, index) => {
            const delay = index * 100;
            setTimeout(() => {
                this.animateOrientationChange(layer, rotationDegree);
            }, delay);
        });
    }

    /**
     * Update touch animations
     */
    updateTouchAnimations() {
        if (this.touches.size === 0) {
            this.resetLayerStates();
            return;
        }

        // Update ripple effects
        this.updateRippleEffects();
        
        // Update particle effects
        this.updateTouchParticles();
        
        // Continuous touch-based layer animations
        this.touches.forEach(touch => {
            this.updateTouchBasedLayerAnimation(touch);
        });
    }

    /**
     * Update layer touch state
     */
    updateLayerTouchState(touchData, isActive) {
        const touchedLayer = this.getLayerAtPoint(touchData.x, touchData.y);
        
        this.layers.forEach(layer => {
            const wasActive = layer.isActive;
            layer.isActive = this.isLayerTouched(layer);
            
            if (layer.isActive !== wasActive) {
                this.animateLayerStateChange(layer, layer.isActive);
            }
        });
    }

    /**
     * Get layer at specific point
     */
    getLayerAtPoint(x, y) {
        const point = this.svg.createSVGPoint();
        point.x = x;
        point.y = y;
        
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            const element = layer.element;
            
            if (element.isPointInFill && element.isPointInFill(point)) {
                return layer;
            }
        }
        
        return null;
    }

    /**
     * Check if layer is currently touched
     */
    isLayerTouched(layer) {
        for (let touch of this.touches.values()) {
            const touchedLayer = this.getLayerAtPoint(touch.x, touch.y);
            if (touchedLayer === layer) {
                return true;
            }
        }
        return false;
    }

    /**
     * Create touch ripple effect
     */
    createTouchRipple(touchData) {
        const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ripple.setAttribute('cx', touchData.x);
        ripple.setAttribute('cy', touchData.y);
        ripple.setAttribute('r', 0);
        ripple.setAttribute('fill', 'none');
        ripple.setAttribute('stroke', '#3AAFA3');
        ripple.setAttribute('stroke-width', 2);
        ripple.setAttribute('opacity', 0.8);
        
        const container = this.svg.querySelector('#touch-ripples');
        container.appendChild(ripple);
        
        // Animate ripple expansion
        const startTime = performance.now();
        const duration = 600;
        const maxRadius = this.config.touchRadius;
        
        const animateRipple = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                container.removeChild(ripple);
                return;
            }
            
            const radius = progress * maxRadius;
            const opacity = 0.8 * (1 - progress);
            
            ripple.setAttribute('r', radius);
            ripple.setAttribute('opacity', opacity);
            
            requestAnimationFrame(animateRipple);
        };
        
        requestAnimationFrame(animateRipple);
    }

    /**
     * Create touch particles
     */
    createTouchParticles(touchData) {
        const particleCount = Math.floor(touchData.pressure * 10) + 5;
        const container = this.svg.querySelector('#touch-particles');
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            particle.setAttribute('r', 1 + Math.random() * 2);
            particle.setAttribute('fill', '#5FD4C4');
            particle.setAttribute('opacity', 0.8);
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 10 + Math.random() * 20;
            const x = touchData.x + Math.cos(angle) * distance;
            const y = touchData.y + Math.sin(angle) * distance;
            
            particle.setAttribute('cx', x);
            particle.setAttribute('cy', y);
            
            container.appendChild(particle);
            
            // Animate particle
            this.animateParticle(particle, touchData);
        }
    }

    /**
     * Animate single particle
     */
    animateParticle(particle, touchData) {
        const startTime = performance.now();
        const duration = 800;
        const startX = parseFloat(particle.getAttribute('cx'));
        const startY = parseFloat(particle.getAttribute('cy'));
        const velocityX = (Math.random() - 0.5) * 2;
        const velocityY = (Math.random() - 0.5) * 2;
        
        const animateParticle = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const x = startX + velocityX * elapsed * 0.1;
            const y = startY + velocityY * elapsed * 0.1;
            const opacity = 0.8 * (1 - progress);
            const scale = 1 - progress * 0.5;
            
            particle.setAttribute('cx', x);
            particle.setAttribute('cy', y);
            particle.setAttribute('opacity', opacity);
            particle.setAttribute('transform', `scale(${scale})`);
            
            requestAnimationFrame(animateParticle);
        };
        
        requestAnimationFrame(animateParticle);
    }

    /**
     * Trigger haptic feedback
     */
    triggerHapticFeedback(intensity = 'light') {
        if (!this.config.enableHaptics || !navigator.vibrate) return;
        
        const patterns = {
            light: [10],
            medium: [15, 5, 15],
            heavy: [25, 10, 25, 10, 25]
        };
        
        navigator.vibrate(patterns[intensity] || patterns.light);
    }

    /**
     * Reset all layer states
     */
    resetLayerStates() {
        this.layers.forEach(layer => {
            layer.element.style.transform = layer.originalTransform;
            layer.element.style.opacity = layer.originalOpacity;
            layer.isActive = false;
        });
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            activeTouches: this.touches.size,
            activeAnimations: this.animationFrames.size,
            rippleEffects: this.rippleEffects.length,
            touchParticles: this.touchParticles.length,
            gestureState: { ...this.gestureState }
        };
    }

    /**
     * Destroy the touch engine
     */
    destroy() {
        // Remove event listeners
        this.container.removeEventListener('touchstart', this.handleTouchStart);
        this.container.removeEventListener('touchmove', this.handleTouchMove);
        this.container.removeEventListener('touchend', this.handleTouchEnd);
        
        // Stop device motion
        this.deviceMotion.stop();
        
        // Clear animations
        this.animationFrames.forEach(id => cancelAnimationFrame(id));
        this.animationFrames.clear();
        
        // Reset layers
        this.resetLayerStates();
        
        // Clear data
        this.touches.clear();
        this.layers = [];
        
        console.log('DafelTouchEngine: Destroyed');
    }

    // Additional animation methods would be implemented here...
    // (animateLayerTap, animateLayerSwipe, createSwipeWave, etc.)
}

/**
 * Gesture Recognition Class
 */
class GestureRecognizer {
    constructor(config) {
        this.config = config;
        this.touches = new Map();
        this.gestures = new Map();
        this.callbacks = new Map();
        this.lastGestureTime = 0;
    }

    on(gestureType, callback) {
        if (!this.callbacks.has(gestureType)) {
            this.callbacks.set(gestureType, []);
        }
        this.callbacks.get(gestureType).push(callback);
    }

    emit(gestureType, data) {
        const callbacks = this.callbacks.get(gestureType);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    handleTouchStart(e) {
        Array.from(e.touches).forEach(touch => {
            this.touches.set(touch.identifier, {
                startX: touch.clientX,
                startY: touch.clientY,
                x: touch.clientX,
                y: touch.clientY,
                startTime: performance.now()
            });
        });
    }

    handleTouchMove(e) {
        Array.from(e.touches).forEach(touch => {
            const existing = this.touches.get(touch.identifier);
            if (existing) {
                existing.x = touch.clientX;
                existing.y = touch.clientY;
            }
        });
        
        this.recognizeGestures();
    }

    handleTouchEnd(e) {
        Array.from(e.changedTouches).forEach(touch => {
            this.touches.delete(touch.identifier);
        });
        
        if (this.touches.size === 0) {
            this.finalizeGestures();
        }
    }

    recognizeGestures() {
        const touchArray = Array.from(this.touches.values());
        
        if (touchArray.length === 2) {
            this.recognizePinch(touchArray);
            this.recognizeRotation(touchArray);
        }
        
        if (touchArray.length === 1) {
            this.recognizeSwipe(touchArray[0]);
        }
    }

    recognizePinch(touches) {
        const [touch1, touch2] = touches;
        const currentDistance = this.getDistance(touch1, touch2);
        const startDistance = this.getDistance(
            { x: touch1.startX, y: touch1.startY },
            { x: touch2.startX, y: touch2.startY }
        );
        
        const scale = currentDistance / startDistance;
        const center = {
            x: (touch1.x + touch2.x) / 2,
            y: (touch1.y + touch2.y) / 2
        };
        
        this.emit('pinch', { scale, center });
    }

    recognizeRotation(touches) {
        const [touch1, touch2] = touches;
        const currentAngle = this.getAngle(touch1, touch2);
        const startAngle = this.getAngle(
            { x: touch1.startX, y: touch1.startY },
            { x: touch2.startX, y: touch2.startY }
        );
        
        const rotation = currentAngle - startAngle;
        const center = {
            x: (touch1.x + touch2.x) / 2,
            y: (touch1.y + touch2.y) / 2
        };
        
        this.emit('rotate', { rotation, center });
    }

    recognizeSwipe(touch) {
        const dx = touch.x - touch.startX;
        const dy = touch.y - touch.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.config.swipeThreshold) {
            const angle = Math.atan2(dy, dx);
            const direction = this.getDirection(angle);
            const velocity = distance / (performance.now() - touch.startTime);
            
            this.emit('swipe', { direction, velocity, distance });
        }
    }

    getDistance(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getAngle(point1, point2) {
        return Math.atan2(point2.y - point1.y, point2.x - point1.x);
    }

    getDirection(angle) {
        const degrees = angle * 180 / Math.PI;
        if (degrees >= -45 && degrees < 45) return 'right';
        if (degrees >= 45 && degrees < 135) return 'down';
        if (degrees >= 135 || degrees < -135) return 'left';
        return 'up';
    }

    finalizeGestures() {
        // Process any final gesture recognition
    }
}

/**
 * Touch Tracker Class
 */
class TouchTracker {
    constructor() {
        this.touchHistory = new Map();
        this.maxHistory = 10;
    }

    addTouch(touch) {
        if (!this.touchHistory.has(touch.identifier)) {
            this.touchHistory.set(touch.identifier, []);
        }
        
        const history = this.touchHistory.get(touch.identifier);
        history.push({
            x: touch.x,
            y: touch.y,
            timestamp: performance.now()
        });
        
        if (history.length > this.maxHistory) {
            history.shift();
        }
    }

    removeTouch(touchId) {
        this.touchHistory.delete(touchId);
    }

    getVelocity(touchId) {
        const history = this.touchHistory.get(touchId);
        if (!history || history.length < 2) return { x: 0, y: 0 };
        
        const current = history[history.length - 1];
        const previous = history[history.length - 2];
        const dt = current.timestamp - previous.timestamp;
        
        return {
            x: (current.x - previous.x) / dt,
            y: (current.y - previous.y) / dt
        };
    }
}

/**
 * Device Motion Handler Class
 */
class DeviceMotionHandler {
    constructor(config) {
        this.config = config;
        this.callbacks = new Map();
        this.isActive = false;
        this.lastOrientation = { alpha: 0, beta: 0, gamma: 0 };
        this.shakeThreshold = 15;
        this.lastShakeTime = 0;
    }

    on(eventType, callback) {
        if (!this.callbacks.has(eventType)) {
            this.callbacks.set(eventType, []);
        }
        this.callbacks.get(eventType).push(callback);
    }

    emit(eventType, data) {
        const callbacks = this.callbacks.get(eventType);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        
        window.addEventListener('deviceorientation', (e) => {
            this.handleOrientation(e);
        });
        
        window.addEventListener('devicemotion', (e) => {
            this.handleMotion(e);
        });
    }

    stop() {
        this.isActive = false;
        window.removeEventListener('deviceorientation', this.handleOrientation);
        window.removeEventListener('devicemotion', this.handleMotion);
    }

    handleOrientation(e) {
        const orientation = {
            alpha: e.alpha || 0,
            beta: e.beta || 0,
            gamma: e.gamma || 0
        };
        
        this.emit('tilt', orientation);
        this.lastOrientation = orientation;
    }

    handleMotion(e) {
        const acceleration = e.accelerationIncludingGravity;
        if (!acceleration) return;
        
        const magnitude = Math.sqrt(
            acceleration.x ** 2 + 
            acceleration.y ** 2 + 
            acceleration.z ** 2
        );
        
        const now = performance.now();
        if (magnitude > this.shakeThreshold && now - this.lastShakeTime > 500) {
            this.emit('shake', { intensity: magnitude / 30 });
            this.lastShakeTime = now;
        }
    }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        DafelTouchEngine, 
        GestureRecognizer, 
        TouchTracker, 
        DeviceMotionHandler 
    };
}