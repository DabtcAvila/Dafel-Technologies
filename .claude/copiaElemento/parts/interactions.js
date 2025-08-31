/**
 * ARKHAM SECTION - INTERACCIONES ADICIONALES
 * ==========================================
 * 
 * Maneja Lottie animations, hover effects, y otras interacciones
 */

class ArkhamInteractions {
    constructor() {
        this.lottieAnimations = {};
        this.hoverTimers = {};
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        console.log('🎭 Inicializando Arkham Interactions');
        
        this.setupLottieAnimations();
        this.setupHoverEffects();
        this.setupButtonInteractions();
        this.setupResponsiveHandlers();
        
        console.log('✅ Interacciones configuradas');
    }
    
    setupLottieAnimations() {
        const lottieElements = document.querySelectorAll('[data-animation-type=\"lottie\"]');
        
        lottieElements.forEach((element, index) => {
            const src = element.getAttribute('data-src');
            const loop = element.getAttribute('data-loop') === '1';
            const autoplay = element.getAttribute('data-autoplay') === '1';
            
            if (src && typeof lottie !== 'undefined') {
                console.log(`🎬 Configurando Lottie: ${src}`);
                
                try {
                    const animation = lottie.loadAnimation({
                        container: element,
                        renderer: 'svg',
                        loop: loop,
                        autoplay: false, // Controlamos manualmente
                        path: src
                    });
                    
                    this.lottieAnimations[`lottie-${index}`] = {
                        animation: animation,
                        element: element,
                        isPlaying: false,
                        shouldAutoplay: autoplay
                    };
                    
                    // Configurar eventos
                    animation.addEventListener('complete', () => {
                        this.onLottieComplete(`lottie-${index}`);
                    });
                    
                } catch (error) {
                    console.error('❌ Error configurando Lottie:', error);
                }
            } else if (!src) {
                console.warn('⚠️ Elemento Lottie sin data-src');
            } else {
                console.warn('⚠️ Librería Lottie no disponible');
                // Fallback: mostrar elemento estático
                element.style.backgroundColor = 'rgba(0,0,0,0.1)';
                element.innerHTML = '<div style=\"display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:12px;\">Animación Lottie</div>';
            }
        });
    }
    
    playLottieForTab(tabNumber) {
        // Reproducir animación Lottie correspondiente al tab activo
        Object.keys(this.lottieAnimations).forEach(key => {
            const lottie = this.lottieAnimations[key];
            
            if (tabNumber === 3) { // Solo en el tab 3 se muestra Lottie
                if (!lottie.isPlaying) {
                    console.log(`▶️ Reproduciendo Lottie para tab ${tabNumber}`);
                    lottie.animation.play();
                    lottie.isPlaying = true;
                }
            } else {
                if (lottie.isPlaying) {
                    console.log(`⏸️ Pausando Lottie`);
                    lottie.animation.pause();
                    lottie.isPlaying = false;
                }
            }
        });
    }
    
    onLottieComplete(lottieKey) {
        const lottie = this.lottieAnimations[lottieKey];
        if (lottie) {
            lottie.isPlaying = false;
            console.log(`✅ Lottie ${lottieKey} completado`);
        }
    }
    
    setupHoverEffects() {
        const tabs = document.querySelectorAll('.scroll-tab');
        
        tabs.forEach(tab => {
            // Hover en tabs
            tab.addEventListener('mouseenter', (e) => {
                if (!tab.classList.contains('active')) {
                    this.onTabHover(tab, true);
                }
            });
            
            tab.addEventListener('mouseleave', (e) => {
                if (!tab.classList.contains('active')) {
                    this.onTabHover(tab, false);
                }
            });
        });
        
        // Hover en botones
        const buttons = document.querySelectorAll('.btn-hover');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.onButtonHover(button, true);
            });
            
            button.addEventListener('mouseleave', (e) => {
                this.onButtonHover(button, false);
            });
        });
    }
    
    onTabHover(tab, isEntering) {
        const arrow = tab.querySelector('.arrow-rights');
        const tagline = tab.querySelector('.tagline-2');
        
        if (isEntering) {
            // Efectos de hover
            if (arrow) {
                arrow.style.transform = 'translateX(4px)';
                arrow.style.opacity = '1';
            }
            if (tagline) {
                tagline.style.color = '#333';
            }
            tab.style.backgroundColor = '#f8f9fa';
        } else {
            // Remover efectos de hover
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
                arrow.style.opacity = tab.classList.contains('active') ? '0' : '1';
            }
            if (tagline) {
                tagline.style.color = tab.classList.contains('active') ? '#000' : '#666';
            }
            tab.style.backgroundColor = 'transparent';
        }
    }
    
    onButtonHover(button, isEntering) {
        if (isEntering) {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        }
    }
    
    setupButtonInteractions() {
        const ctaButton = document.querySelector('.button.secondary');
        
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                // Animación de click
                ctaButton.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    ctaButton.style.transform = 'scale(1)';
                }, 150);
                
                console.log('🔗 CTA Button clicked');
                // Aquí se puede agregar tracking o navegación
            });
        }
    }
    
    setupResponsiveHandlers() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.onResize();
            }, 250);
        });
        
        // Detectar cambios de orientación en mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.onResize();
            }, 500);
        });
    }
    
    onResize() {
        const isMobile = window.innerWidth <= 768;
        console.log(`📱 Resize detectado: ${isMobile ? 'Mobile' : 'Desktop'}`);
        
        // Ajustar elementos según el tamaño de pantalla
        this.updateResponsiveElements(isMobile);
        
        // Reiniciar animaciones Lottie si es necesario
        Object.keys(this.lottieAnimations).forEach(key => {
            const lottie = this.lottieAnimations[key];
            try {
                lottie.animation.resize();
            } catch (error) {
                console.warn('⚠️ Error redimensionando Lottie:', error);
            }
        });
    }
    
    updateResponsiveElements(isMobile) {
        const section = document.querySelector('.arkham-tabs-section');
        const desktopTabs = document.querySelector('.cvt-desk');
        const mobileTabs = document.querySelector('.cvt-mobile');
        
        if (isMobile) {
            // Configuración mobile
            if (desktopTabs) desktopTabs.style.display = 'none';
            if (mobileTabs) mobileTabs.style.display = 'flex';
            
            // Simplificar animaciones en mobile
            document.body.classList.add('mobile-mode');
        } else {
            // Configuración desktop
            if (desktopTabs) desktopTabs.style.display = 'flex';
            if (mobileTabs) mobileTabs.style.display = 'none';
            
            document.body.classList.remove('mobile-mode');
        }
    }
    
    // MÉTODOS PÚBLICOS
    triggerLottie(tabNumber) {
        this.playLottieForTab(tabNumber);
    }
    
    resetAnimations() {
        Object.keys(this.lottieAnimations).forEach(key => {
            const lottie = this.lottieAnimations[key];
            lottie.animation.stop();
            lottie.isPlaying = false;
        });
    }
    
    debugInfo() {
        return {
            lottieCount: Object.keys(this.lottieAnimations).length,
            isMobile: window.innerWidth <= 768,
            lottieStates: Object.keys(this.lottieAnimations).map(key => ({
                key: key,
                isPlaying: this.lottieAnimations[key].isPlaying
            }))
        };
    }
}

// INTEGRACIÓN CON SCROLL SYSTEM
if (typeof window !== 'undefined') {
    let arkhamInteractions;
    
    document.addEventListener('DOMContentLoaded', () => {
        arkhamInteractions = new ArkhamInteractions();
        
        // Conectar con el sistema de scroll si existe
        if (window.ArkhamScrollSystem) {
            console.log('🔗 Conectando interacciones con scroll system');
            
            // Observar cambios de tab para activar Lottie
            const originalActivateTab = window.ArkhamScrollSystem.activateTab;
            window.ArkhamScrollSystem.activateTab = function(tabNumber, withAnimation) {
                originalActivateTab.call(this, tabNumber, withAnimation);
                
                // Activar Lottie cuando corresponda
                if (arkhamInteractions) {
                    arkhamInteractions.triggerLottie(tabNumber);
                }
            };
        }
        
        // Exponer para debugging
        window.ArkhamInteractions = arkhamInteractions;
        window.debugInteractions = () => console.log(arkhamInteractions.debugInfo());
    });
}

/**
 * LOAD LOTTIE LIBRARY DINAMICALLY
 */
function loadLottieIfNeeded() {
    if (typeof lottie === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
        script.onload = () => {
            console.log('📦 Lottie cargado dinámicamente');
            // Reinicializar configuración Lottie
            if (window.ArkhamInteractions) {
                window.ArkhamInteractions.setupLottieAnimations();
            }
        };
        document.head.appendChild(script);
    }
}

// Cargar Lottie si hay elementos que lo necesitan
if (document.querySelector('[data-animation-type=\"lottie\"]')) {
    loadLottieIfNeeded();
}