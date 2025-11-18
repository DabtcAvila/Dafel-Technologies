/**
 * DAFEL BANDA 3D PERSPECTIVE ENGINE
 * 
 * Advanced 3D transformation system for the Dafel banda SVG design
 * with perspective effects, depth mapping, and spatial animations.
 * 
 * Features:
 * - 3D perspective transformations
 * - Depth-based layer ordering
 * - Spatial rotation and translation
 * - Camera controls
 * - Parallax effects
 * - 3D lighting simulation
 * 
 * @version 1.0.0
 * @author Dafel Technologies
 */

class Dafel3DEngine {
    constructor(svgSelector = '.dafel-banda-animatable', config = {}) {
        this.svg = document.querySelector(svgSelector);
        this.container = this.svg.parentElement;
        
        // 3D Configuration
        this.config = {
            perspective: 1000,
            fov: 60,
            near: 1,
            far: 2000,
            cameraPosition: { x: 0, y: 0, z: 500 },
            lookAt: { x: 0, y: 0, z: 0 },
            enableLighting: true,
            lightPosition: { x: 100, y: -200, z: 300 },
            ambientLight: 0.3,
            ...config
        };

        // 3D Layers
        this.layers3D = [];
        this.camera = new Camera3D(this.config);
        this.renderer = new SVG3DRenderer(this.svg, this.config);
        
        // Transformation matrices
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();
        this.modelMatrix = new Matrix4();
        
        if (!this.svg) {
            console.error('Dafel3DEngine: SVG element not found');
            return;
        }

        this.init();
    }

    /**
     * Initialize the 3D engine
     */
    init() {
        this.setupContainer();
        this.initializeLayers();
        this.setupCamera();
        this.setupControls();
        
        console.log('Dafel3DEngine: Initialized with', this.layers3D.length, 'layers');
    }

    /**
     * Setup the 3D container
     */
    setupContainer() {
        // Apply perspective to container
        this.container.style.perspective = `${this.config.perspective}px`;
        this.container.style.perspectiveOrigin = 'center center';
        this.container.style.transformStyle = 'preserve-3d';
        
        // Enable 3D rendering for SVG
        this.svg.style.transformStyle = 'preserve-3d';
        this.svg.style.willChange = 'transform';
    }

    /**
     * Initialize 3D layers from SVG elements
     */
    initializeLayers() {
        const layerElements = this.svg.querySelectorAll('[data-layer]');
        
        layerElements.forEach((element, index) => {
            const layer3D = new Layer3D(element, index, this.config);
            this.layers3D.push(layer3D);
            
            // Set initial depth based on layer index
            const depth = (this.layers3D.length - index - 1) * 50;
            layer3D.setDepth(depth);
        });
    }

    /**
     * Setup camera system
     */
    setupCamera() {
        this.camera.setPosition(
            this.config.cameraPosition.x,
            this.config.cameraPosition.y,
            this.config.cameraPosition.z
        );
        
        this.camera.lookAt(
            this.config.lookAt.x,
            this.config.lookAt.y,
            this.config.lookAt.z
        );
        
        this.updateProjectionMatrix();
    }

    /**
     * Setup interactive controls
     */
    setupControls() {
        let isMouseDown = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        
        this.container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });
        
        this.container.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            
            const deltaX = e.clientX - lastMouseX;
            const deltaY = e.clientY - lastMouseY;
            
            this.camera.rotate(deltaY * 0.01, deltaX * 0.01, 0);
            this.updateView();
            
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });
        
        this.container.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        // Scroll for zoom
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoom = e.deltaY > 0 ? 1.1 : 0.9;
            this.camera.zoom(zoom);
            this.updateView();
        });
    }

    /**
     * Update projection matrix
     */
    updateProjectionMatrix() {
        const aspect = this.svg.clientWidth / this.svg.clientHeight;
        const fovRad = (this.config.fov * Math.PI) / 180;
        
        this.projectionMatrix.setPerspective(
            fovRad,
            aspect,
            this.config.near,
            this.config.far
        );
    }

    /**
     * Update view matrix
     */
    updateView() {
        this.viewMatrix = this.camera.getViewMatrix();
        
        // Apply transformations to all layers
        this.layers3D.forEach(layer => {
            layer.updateTransform(this.viewMatrix, this.projectionMatrix);
        });
        
        // Update lighting if enabled
        if (this.config.enableLighting) {
            this.updateLighting();
        }
    }

    /**
     * Update lighting simulation
     */
    updateLighting() {
        this.layers3D.forEach(layer => {
            const lightVector = this.getLightVector(layer.position);
            const lightIntensity = this.calculateLightIntensity(lightVector, layer.normal);
            layer.applyLighting(lightIntensity);
        });
    }

    /**
     * Get light vector for a position
     */
    getLightVector(position) {
        return {
            x: this.config.lightPosition.x - position.x,
            y: this.config.lightPosition.y - position.y,
            z: this.config.lightPosition.z - position.z
        };
    }

    /**
     * Calculate light intensity
     */
    calculateLightIntensity(lightVector, normal) {
        // Normalize vectors
        const lightLength = Math.sqrt(
            lightVector.x ** 2 + lightVector.y ** 2 + lightVector.z ** 2
        );
        const normalLength = Math.sqrt(
            normal.x ** 2 + normal.y ** 2 + normal.z ** 2
        );
        
        if (lightLength === 0 || normalLength === 0) return this.config.ambientLight;
        
        const lightNorm = {
            x: lightVector.x / lightLength,
            y: lightVector.y / lightLength,
            z: lightVector.z / lightLength
        };
        
        const normalNorm = {
            x: normal.x / normalLength,
            y: normal.y / normalLength,
            z: normal.z / normalLength
        };
        
        // Dot product for lighting calculation
        const dotProduct = lightNorm.x * normalNorm.x + 
                          lightNorm.y * normalNorm.y + 
                          lightNorm.z * normalNorm.z;
        
        const diffuse = Math.max(0, dotProduct);
        return this.config.ambientLight + (1 - this.config.ambientLight) * diffuse;
    }

    /**
     * Animate to specific camera position
     */
    animateCamera(targetPosition, targetLookAt, duration = 2000) {
        const startPosition = { ...this.camera.position };
        const startLookAt = { ...this.camera.lookAt };
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            
            // Interpolate position
            this.camera.setPosition(
                startPosition.x + (targetPosition.x - startPosition.x) * easedProgress,
                startPosition.y + (targetPosition.y - startPosition.y) * easedProgress,
                startPosition.z + (targetPosition.z - startPosition.z) * easedProgress
            );
            
            // Interpolate look at
            this.camera.lookAt(
                startLookAt.x + (targetLookAt.x - startLookAt.x) * easedProgress,
                startLookAt.y + (targetLookAt.y - startLookAt.y) * easedProgress,
                startLookAt.z + (targetLookAt.z - startLookAt.z) * easedProgress
            );
            
            this.updateView();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Create parallax effect
     */
    createParallax(scrollElement = window) {
        scrollElement.addEventListener('scroll', () => {
            const scrollY = scrollElement.scrollY || scrollElement.scrollTop || 0;
            const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
            
            this.layers3D.forEach((layer, index) => {
                const depth = (this.layers3D.length - index - 1) * 50;
                const parallaxOffset = scrollProgress * depth * 0.5;
                
                layer.setPosition(
                    layer.basePosition.x,
                    layer.basePosition.y - parallaxOffset,
                    layer.basePosition.z
                );
            });
            
            this.updateView();
        });
    }

    /**
     * Morph between different 3D configurations
     */
    morphTo3DConfig(targetConfig, duration = 2000) {
        const startConfig = { ...this.config };
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            
            // Interpolate configuration values
            Object.keys(targetConfig).forEach(key => {
                if (typeof targetConfig[key] === 'number') {
                    this.config[key] = startConfig[key] + 
                        (targetConfig[key] - startConfig[key]) * easedProgress;
                }
            });
            
            this.updateProjectionMatrix();
            this.updateView();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Create wave effect in 3D space
     */
    createWave3D(amplitude = 50, frequency = 0.01, speed = 0.02) {
        const startTime = performance.now();
        
        const animate = () => {
            const elapsed = performance.now() - startTime;
            
            this.layers3D.forEach((layer, index) => {
                const wave = Math.sin(
                    elapsed * speed + 
                    index * frequency + 
                    layer.basePosition.x * 0.01
                ) * amplitude;
                
                layer.setPosition(
                    layer.basePosition.x,
                    layer.basePosition.y + wave * 0.5,
                    layer.basePosition.z + wave
                );
            });
            
            this.updateView();
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    /**
     * Easing function
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    /**
     * Destroy the 3D engine
     */
    destroy() {
        // Reset styles
        this.container.style.perspective = '';
        this.container.style.perspectiveOrigin = '';
        this.container.style.transformStyle = '';
        
        this.svg.style.transformStyle = '';
        this.svg.style.willChange = '';
        
        this.layers3D.forEach(layer => {
            layer.destroy();
        });
        
        this.layers3D = [];
        
        console.log('Dafel3DEngine: Destroyed');
    }
}

/**
 * 3D Camera Class
 */
class Camera3D {
    constructor(config) {
        this.position = { x: 0, y: 0, z: 500 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.lookAt = { x: 0, y: 0, z: 0 };
        this.up = { x: 0, y: 1, z: 0 };
        this.config = config;
    }

    setPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }

    lookAt(x, y, z) {
        this.lookAt.x = x;
        this.lookAt.y = y;
        this.lookAt.z = z;
    }

    rotate(deltaX, deltaY, deltaZ) {
        this.rotation.x += deltaX;
        this.rotation.y += deltaY;
        this.rotation.z += deltaZ;
    }

    zoom(factor) {
        this.position.z *= factor;
        this.position.z = Math.max(50, Math.min(2000, this.position.z));
    }

    getViewMatrix() {
        const matrix = new Matrix4();
        matrix.setLookAt(
            this.position.x, this.position.y, this.position.z,
            this.lookAt.x, this.lookAt.y, this.lookAt.z,
            this.up.x, this.up.y, this.up.z
        );
        return matrix;
    }
}

/**
 * 3D Layer Class
 */
class Layer3D {
    constructor(element, index, config) {
        this.element = element;
        this.index = index;
        this.config = config;
        
        // 3D properties
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.normal = { x: 0, y: 0, z: 1 };
        
        // Store base position for effects
        this.basePosition = { x: 0, y: 0, z: 0 };
        
        // Original opacity for lighting
        this.originalOpacity = parseFloat(element.getAttribute('opacity')) || 1.0;
        
        this.setupElement();
    }

    setupElement() {
        this.element.style.transformStyle = 'preserve-3d';
        this.element.style.willChange = 'transform, opacity';
    }

    setPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.updateElement();
    }

    setRotation(x, y, z) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
        this.updateNormal();
        this.updateElement();
    }

    setDepth(z) {
        this.position.z = z;
        this.basePosition.z = z;
        this.updateElement();
    }

    updateNormal() {
        // Calculate normal vector based on rotation
        const rx = this.rotation.x;
        const ry = this.rotation.y;
        
        this.normal.x = Math.sin(ry) * Math.cos(rx);
        this.normal.y = -Math.sin(rx);
        this.normal.z = Math.cos(ry) * Math.cos(rx);
    }

    updateTransform(viewMatrix, projectionMatrix) {
        const modelMatrix = new Matrix4();
        modelMatrix.setTranslation(this.position.x, this.position.y, this.position.z);
        modelMatrix.rotateX(this.rotation.x);
        modelMatrix.rotateY(this.rotation.y);
        modelMatrix.rotateZ(this.rotation.z);
        
        // Apply view and projection transformations
        const mvpMatrix = new Matrix4();
        mvpMatrix.multiplyMatrices(projectionMatrix, viewMatrix);
        mvpMatrix.multiply(modelMatrix);
        
        this.updateElement();
    }

    updateElement() {
        const transform = `translate3d(${this.position.x}px, ${this.position.y}px, ${this.position.z}px) 
                          rotateX(${this.rotation.x}rad) 
                          rotateY(${this.rotation.y}rad) 
                          rotateZ(${this.rotation.z}rad) 
                          scale3d(${this.scale.x}, ${this.scale.y}, ${this.scale.z})`;
        
        this.element.style.transform = transform;
    }

    applyLighting(intensity) {
        const opacity = this.originalOpacity * intensity;
        this.element.style.opacity = Math.max(0.1, Math.min(1, opacity));
    }

    destroy() {
        this.element.style.transformStyle = '';
        this.element.style.willChange = '';
        this.element.style.transform = '';
        this.element.style.opacity = this.originalOpacity;
    }
}

/**
 * Simple 4x4 Matrix Class for 3D transformations
 */
class Matrix4 {
    constructor() {
        this.elements = new Float32Array(16);
        this.identity();
    }

    identity() {
        const te = this.elements;
        te[0] = 1; te[4] = 0; te[8] = 0; te[12] = 0;
        te[1] = 0; te[5] = 1; te[9] = 0; te[13] = 0;
        te[2] = 0; te[6] = 0; te[10] = 1; te[14] = 0;
        te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;
        return this;
    }

    setTranslation(x, y, z) {
        this.identity();
        this.elements[12] = x;
        this.elements[13] = y;
        this.elements[14] = z;
        return this;
    }

    rotateX(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const te = this.elements;
        
        const m11 = te[5], m12 = te[6], m13 = te[7];
        const m21 = te[9], m22 = te[10], m23 = te[11];
        
        te[5] = c * m11 + s * m21;
        te[6] = c * m12 + s * m22;
        te[7] = c * m13 + s * m23;
        
        te[9] = c * m21 - s * m11;
        te[10] = c * m22 - s * m12;
        te[11] = c * m23 - s * m13;
        
        return this;
    }

    rotateY(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const te = this.elements;
        
        const m11 = te[0], m12 = te[1], m13 = te[2];
        const m31 = te[8], m32 = te[9], m33 = te[10];
        
        te[0] = c * m11 - s * m31;
        te[1] = c * m12 - s * m32;
        te[2] = c * m13 - s * m33;
        
        te[8] = c * m31 + s * m11;
        te[9] = c * m32 + s * m12;
        te[10] = c * m33 + s * m13;
        
        return this;
    }

    rotateZ(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const te = this.elements;
        
        const m11 = te[0], m12 = te[1], m13 = te[2];
        const m21 = te[4], m22 = te[5], m23 = te[6];
        
        te[0] = c * m11 + s * m21;
        te[1] = c * m12 + s * m22;
        te[2] = c * m13 + s * m23;
        
        te[4] = c * m21 - s * m11;
        te[5] = c * m22 - s * m12;
        te[6] = c * m23 - s * m13;
        
        return this;
    }

    setPerspective(fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov / 2);
        const rangeInv = 1 / (near - far);
        
        const te = this.elements;
        te[0] = f / aspect;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        
        te[4] = 0;
        te[5] = f;
        te[6] = 0;
        te[7] = 0;
        
        te[8] = 0;
        te[9] = 0;
        te[10] = (far + near) * rangeInv;
        te[11] = -1;
        
        te[12] = 0;
        te[13] = 0;
        te[14] = (2 * far * near) * rangeInv;
        te[15] = 0;
        
        return this;
    }

    setLookAt(eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ) {
        // Calculate forward vector
        let fx = eyeX - targetX;
        let fy = eyeY - targetY;
        let fz = eyeZ - targetZ;
        
        // Normalize forward
        let flen = Math.sqrt(fx * fx + fy * fy + fz * fz);
        if (flen !== 0) {
            fx /= flen;
            fy /= flen;
            fz /= flen;
        }
        
        // Calculate right vector (cross product of up and forward)
        let rx = upY * fz - upZ * fy;
        let ry = upZ * fx - upX * fz;
        let rz = upX * fy - upY * fx;
        
        // Normalize right
        let rlen = Math.sqrt(rx * rx + ry * ry + rz * rz);
        if (rlen !== 0) {
            rx /= rlen;
            ry /= rlen;
            rz /= rlen;
        }
        
        // Calculate up vector (cross product of forward and right)
        const ux = fy * rz - fz * ry;
        const uy = fz * rx - fx * rz;
        const uz = fx * ry - fy * rx;
        
        const te = this.elements;
        te[0] = rx; te[4] = ux; te[8] = fx; te[12] = 0;
        te[1] = ry; te[5] = uy; te[9] = fy; te[13] = 0;
        te[2] = rz; te[6] = uz; te[10] = fz; te[14] = 0;
        te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;
        
        // Apply translation
        this.translate(-eyeX, -eyeY, -eyeZ);
        
        return this;
    }

    translate(x, y, z) {
        const te = this.elements;
        te[12] += te[0] * x + te[4] * y + te[8] * z;
        te[13] += te[1] * x + te[5] * y + te[9] * z;
        te[14] += te[2] * x + te[6] * y + te[10] * z;
        te[15] += te[3] * x + te[7] * y + te[11] * z;
        return this;
    }

    multiply(matrix) {
        return this.multiplyMatrices(this, matrix);
    }

    multiplyMatrices(a, b) {
        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;
        
        const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
        
        const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
        const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
        const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
        const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
        
        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        
        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        
        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        
        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        
        return this;
    }
}

/**
 * SVG 3D Renderer Class
 */
class SVG3DRenderer {
    constructor(svg, config) {
        this.svg = svg;
        this.config = config;
    }

    render(layers3D) {
        // Sort layers by Z depth for proper rendering order
        const sortedLayers = [...layers3D].sort((a, b) => b.position.z - a.position.z);
        
        sortedLayers.forEach((layer, index) => {
            layer.element.style.zIndex = index;
        });
    }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Dafel3DEngine, Camera3D, Layer3D, Matrix4 };
}