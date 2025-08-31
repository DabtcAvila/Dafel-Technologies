/**
 * ARKHAM SECTION - SISTEMA DE SCROLL SINCRONIZADO
 * ================================================
 * 
 * PROBLEMA IDENTIFICADO: El scroll no está sincronizado con las animaciones
 * SOLUCIÓN: Sistema basado en Intersection Observer + scroll manual
 */

class ArkhamScrollSystem {
    constructor() {
        this.currentTab = 1;
        this.isAnimating = false;
        this.scrollThreshold = 100; // píxeles para cambio de tab
        this.lastScrollTop = 0;
        
        // Elementos del DOM
        this.section = null;
        this.tabs = [];
        this.levels = [];
        this.tabContents = [];
        
        // Estado de los tabs
        this.tabStates = {
            1: { active: true, level: 'first-level' },
            2: { active: false, level: 'float-level-2' },
            3: { active: false, level: 'float-level-3' }
        };
        
        this.init();
    }
    
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        console.log('🚀 Inicializando Arkham Scroll System');
        
        // Obtener elementos del DOM
        this.section = document.querySelector('.arkham-tabs-section');
        this.tabs = document.querySelectorAll('.scroll-tab');
        this.levels = document.querySelectorAll('.level');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        if (!this.section) {
            console.error('❌ No se encontró la sección Arkham');
            return;
        }
        
        console.log(`✅ Encontrados: ${this.tabs.length} tabs, ${this.levels.length} niveles`);
        
        // Configurar el estado inicial
        this.setInitialState();
        
        // Configurar eventos
        this.setupScrollListeners();
        this.setupTabClickListeners();
        this.setupIntersectionObserver();
        
        console.log('✅ Sistema de scroll configurado');
    }
    
    setInitialState() {
        // Configurar estado inicial según el original
        this.activateTab(1, false); // Sin animación inicial
    }
    
    setupScrollListeners() {
        let scrollTimeout;
        
        // Listener principal de scroll
        window.addEventListener('scroll', () => {
            // Debounce para mejorar performance
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 10);
        });
        
        // Listener de scroll con wheel para mayor precisión
        this.section.addEventListener('wheel', (e) => {
            if (this.isWithinSection()) {
                this.handleWheelScroll(e);
            }
        });
    }
    
    setupTabClickListeners() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabNumber = this.getTabNumber(tab);
                if (tabNumber && tabNumber !== this.currentTab) {
                    this.activateTab(tabNumber, true);
                }
            });
        });
    }
    
    setupIntersectionObserver() {
        // Observer para detectar cuando la sección está visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.body.classList.add('arkham-visible');
                    // Activar animaciones cuando la sección es visible
                    this.startAnimations();
                } else {
                    document.body.classList.remove('arkham-visible');
                }
            });
        }, {
            threshold: 0.3 // 30% de la sección visible
        });
        
        observer.observe(this.section);
    }
    
    handleScroll() {
        if (!this.isWithinSection() || this.isAnimating) return;
        
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = currentScrollTop > this.lastScrollTop ? 'down' : 'up';
        const scrollDelta = Math.abs(currentScrollTop - this.lastScrollTop);
        
        // Solo procesar si el scroll es significativo
        if (scrollDelta < 20) return;
        
        this.lastScrollTop = currentScrollTop;
        
        // Determinar qué tab debe estar activo basado en posición de scroll
        const newTab = this.calculateActiveTab(currentScrollTop, scrollDirection);
        
        if (newTab && newTab !== this.currentTab) {
            console.log(`📜 Scroll detectado: Tab ${this.currentTab} → ${newTab}`);
            this.activateTab(newTab, true);
        }
    }
    
    handleWheelScroll(e) {
        if (this.isAnimating) {
            e.preventDefault();
            return;
        }
        
        const delta = e.deltaY;
        const threshold = 50;
        
        if (Math.abs(delta) > threshold) {
            if (delta > 0 && this.currentTab < 3) {
                // Scroll hacia abajo - siguiente tab
                e.preventDefault();
                this.activateTab(this.currentTab + 1, true);
            } else if (delta < 0 && this.currentTab > 1) {
                // Scroll hacia arriba - tab anterior
                e.preventDefault();
                this.activateTab(this.currentTab - 1, true);
            }
        }
    }
    
    calculateActiveTab(scrollTop, direction) {
        const sectionRect = this.section.getBoundingClientRect();
        const sectionTop = scrollTop + sectionRect.top;
        const sectionHeight = sectionRect.height;
        const relativeScroll = (scrollTop - sectionTop) / sectionHeight;
        
        // Dividir la sección en 3 partes para los 3 tabs
        if (relativeScroll < 0.33) {
            return 1;
        } else if (relativeScroll < 0.66) {
            return 2;
        } else if (relativeScroll <= 1) {
            return 3;
        }
        
        return this.currentTab; // Mantener tab actual si está fuera de rango
    }
    
    activateTab(tabNumber, withAnimation = true) {
        if (this.isAnimating && withAnimation) return;
        
        const previousTab = this.currentTab;
        this.currentTab = tabNumber;
        
        console.log(`🎯 Activando Tab ${tabNumber} (anterior: ${previousTab})`);
        
        if (withAnimation) {
            this.isAnimating = true;
            // Actualizar clase del body para CSS targeting
            document.body.className = document.body.className
                .replace(/tab-[1-3]-active/g, '');
            document.body.classList.add(`tab-${tabNumber}-active`);
        }
        
        // Actualizar estado visual de los tabs
        this.updateTabStates(tabNumber);
        
        // Actualizar niveles isométricos
        this.updateLevels(tabNumber, withAnimation);
        
        // Actualizar contenido de tabs
        this.updateTabContents(tabNumber, withAnimation);
        
        if (withAnimation) {
            setTimeout(() => {
                this.isAnimating = false;
                console.log('✅ Animación completada');
            }, 800); // Duración de la animación
        }
    }
    
    updateTabStates(activeTab) {
        this.tabs.forEach((tab) => {
            const tabNum = this.getTabNumber(tab);
            if (tabNum === activeTab) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    updateLevels(activeTab, withAnimation) {
        console.log(`🎨 Actualizando niveles para tab ${activeTab}`);
        
        this.levels.forEach((level, index) => {
            level.classList.remove('animate-in', 'float-in');
            
            // Nivel 1 (base) - siempre visible cuando hay tabs activos
            if (index === 0) {
                if (withAnimation) {
                    level.classList.add('animate-in');
                }
                level.style.opacity = '1';
                level.style.transform = 'translate(0px, 0px)';
                return;
            }
            
            // Niveles flotantes
            const shouldBeVisible = index < activeTab;
            
            if (shouldBeVisible) {
                level.style.opacity = '1';
                level.style.top = '0%';
                
                // Posicionamiento específico según nivel
                const translateX = 20 * index;
                const translateY = -60 * index;
                level.style.transform = `translate(${translateX}px, ${translateY}px)`;
                
                if (withAnimation) {
                    level.classList.add('float-in');
                }
            } else {
                level.style.opacity = '0';
                level.style.top = '-100%';
                level.style.transform = 'translate(0px, 0px)';
            }
        });
    }
    
    updateTabContents(activeTab, withAnimation) {
        this.tabContents.forEach((content, index) => {
            const tabNum = index + 1;
            content.classList.remove('expand');
            
            if (tabNum === activeTab) {
                content.style.maxHeight = '70px';
                content.style.opacity = '1';
                content.style.paddingBottom = '20px';
                content.style.zIndex = '1';
                
                if (withAnimation) {
                    content.classList.add('expand');
                }
            } else {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.style.paddingBottom = '0px';
                content.style.zIndex = '-1';
            }
        });
    }
    
    startAnimations() {
        // Iniciar animaciones Lottie u otras cuando sea necesario
        const lottieElement = document.querySelector('[data-animation-type=\"lottie\"]');
        if (lottieElement && typeof lottie !== 'undefined') {
            // Configurar Lottie si está disponible
            console.log('🎭 Lottie detectado, configurando...');
        }
    }
    
    isWithinSection() {
        const rect = this.section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // La sección está visible si su top está por encima de la ventana
        // y su bottom está por debajo de la parte superior de la ventana
        return rect.top < windowHeight && rect.bottom > 0;
    }
    
    getTabNumber(tabElement) {
        const classList = tabElement.classList;
        for (let className of classList) {
            const match = className.match(/scroll-tab-(\d+)/);
            if (match) {
                return parseInt(match[1]);
            }
        }
        return null;
    }
    
    // MÉTODOS PÚBLICOS PARA DEBUGGING
    debugInfo() {
        return {
            currentTab: this.currentTab,
            isAnimating: this.isAnimating,
            tabsFound: this.tabs.length,
            levelsFound: this.levels.length,
            isWithinSection: this.isWithinSection()
        };
    }
    
    forceTab(tabNumber) {
        console.log(`🔧 Forzando activación del tab ${tabNumber}`);
        this.activateTab(tabNumber, true);
    }
}

// INICIALIZACIÓN GLOBAL
let arkhamScrollSystem;

// Auto-inicialización
if (typeof window !== 'undefined') {
    arkhamScrollSystem = new ArkhamScrollSystem();
    
    // Exponer para debugging
    window.ArkhamScrollSystem = arkhamScrollSystem;
    
    // Comandos de debugging
    window.debugArkham = () => console.log(arkhamScrollSystem.debugInfo());
    window.forceTab = (n) => arkhamScrollSystem.forceTab(n);
}

/**
 * NOTAS PARA FUTURAS SESIONES:
 * 
 * PROBLEMA IDENTIFICADO:
 * - El scroll original no está sincronizado con las animaciones de los niveles
 * - Los tabs cambian pero los niveles isométricos no responden correctamente
 * - Falta coordinación entre el scroll del viewport y el estado interno
 * 
 * SOLUCIÓN IMPLEMENTADA:
 * - Sistema basado en Intersection Observer para detectar cuando la sección es visible
 * - Cálculo de tab activo basado en posición relativa del scroll dentro de la sección
 * - Manejo de wheel events para scroll más preciso
 * - Debouncing para mejorar performance
 * - Estados sincronizados entre CSS y JavaScript
 * 
 * PUNTOS CRÍTICOS:
 * - La función calculateActiveTab() es clave para la sincronización
 * - Los timings de las animaciones (800ms) deben coincidir con las CSS
 * - El isAnimating flag previene conflictos durante las transiciones
 * 
 * TESTING:
 * - Usar window.debugArkham() para ver estado actual
 * - Usar window.forceTab(n) para probar tabs individualmente
 * - Verificar que los niveles isométricos aparezcan en orden correcto
 */