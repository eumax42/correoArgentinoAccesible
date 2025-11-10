// ===== CORREO ARGENTINO - SITIO ACCESIBLE =====
// Script principal con todas las funcionalidades accesibles

class CorreoArgentinoAccessible {
    constructor() {
        this.currentCarouselSlide = 0;
        this.carouselInterval = null;
        this.isAutoPlay = true;
        this.trackingData = {
            'RA123456789AR': [
                { status: 'Envío recibido', date: '15 Ene, 10:30', location: 'Sucursal Central' },
                { status: 'En proceso de clasificación', date: '15 Ene, 14:15', location: 'Centro de Distribución' },
                { status: 'En tránsito', date: '16 Ene, 08:45', location: 'Hacia destino final' },
                { status: 'Entregado', date: '17 Ene, 14:20', location: 'Sucursal destino' }
            ],
            'RB987654321AR': [
                { status: 'Envío recibido', date: '14 Ene, 09:15', location: 'Sucursal Norte' },
                { status: 'En proceso de clasificación', date: '14 Ene, 16:30', location: 'Centro de Distribución' },
                { status: 'En tránsito', date: '15 Ene, 11:00', location: 'Hacia destino final' }
            ]
        };
        this.init();
    }

    init() {
        this.setupAccessibility();
        this.setupCarousel();
        this.setupNavigation();
        this.setupTrackingForm();
        this.setupCalculator();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.announcePageLoad();
    }

    // ===== CONFIGURACIÓN DE ACCESIBILIDAD =====
    setupAccessibility() {
        // Cargar preferencias guardadas
        this.loadAccessibilityPreferences();
        
        // Configurar botones de accesibilidad
        this.setupAccessibilityButtons();
        
        // Mejorar focus para elementos personalizados
        this.enhanceFocusManagement();
        
        // Configurar live regions para anuncios
        this.setupLiveRegions();
    }

    loadAccessibilityPreferences() {
        // Alto contraste
        if (localStorage.getItem('correo-highContrast') === 'true') {
            document.body.classList.add('high-contrast');
            this.updateHighContrastButton(true);
        }

        // Texto grande
        if (localStorage.getItem('correo-largeText') === 'true') {
            document.body.classList.add('large-text');
            this.updateFontSizeButton(true);
        }
    }

    setupAccessibilityButtons() {
        const highContrastBtn = document.getElementById('high-contrast-btn');
        const fontSizeBtn = document.getElementById('font-size-btn');

        if (highContrastBtn) {
            highContrastBtn.addEventListener('click', () => this.toggleHighContrast());
            highContrastBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleHighContrast();
                }
            });
        }

        if (fontSizeBtn) {
            fontSizeBtn.addEventListener('click', () => this.toggleFontSize());
            fontSizeBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleFontSize();
                }
            });
        }
    }

    toggleHighContrast() {
        const isActive = document.body.classList.toggle('high-contrast');
        this.updateHighContrastButton(isActive);
        localStorage.setItem('correo-highContrast', isActive);
        this.announceToScreenReader(isActive ? 
            'Modo alto contraste activado' : 'Modo alto contraste desactivado');
    }

    updateHighContrastButton(isActive) {
        const btn = document.getElementById('high-contrast-btn');
        if (btn) {
            const icon = btn.querySelector('i');
            const text = btn.querySelector('span');
            
            if (isActive) {
                icon.className = 'fas fa-sun';
                text.textContent = 'Contraste Normal';
                btn.setAttribute('aria-pressed', 'true');
            } else {
                icon.className = 'fas fa-adjust';
                text.textContent = 'Alto Contraste';
                btn.setAttribute('aria-pressed', 'false');
            }
        }
    }

    toggleFontSize() {
        const isActive = document.body.classList.toggle('large-text');
        this.updateFontSizeButton(isActive);
        localStorage.setItem('correo-largeText', isActive);
        this.announceToScreenReader(isActive ? 
            'Tamaño de texto grande activado' : 'Tamaño de texto normal activado');
    }

    updateFontSizeButton(isActive) {
        const btn = document.getElementById('font-size-btn');
        if (btn) {
            const text = btn.querySelector('span');
            
            if (isActive) {
                text.textContent = 'A-';
                btn.setAttribute('aria-pressed', 'true');
            } else {
                text.textContent = 'A+';
                btn.setAttribute('aria-pressed', 'false');
            }
        }
    }

    enhanceFocusManagement() {
        // Hacer las tarjetas de servicio focusables
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const link = card.querySelector('.service-link');
                    if (link) {
                        link.click();
                    }
                }
            });
        });

        // Mejorar focus en dropdowns
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown(toggle);
                } else if (e.key === 'Escape') {
                    this.closeAllDropdowns();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.openDropdown(toggle);
                }
            });
        });
    }

    setupLiveRegions() {
        // Crear región live para anuncios
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.classList.add('sr-only');
        liveRegion.id = 'live-announcements';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Limpiar después de un tiempo
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 3000);
        }
    }

    // ===== CARRUSEL INTERACTIVO =====
    setupCarousel() {
        this.carouselSlides = document.querySelectorAll('.carousel-slide');
        this.carouselIndicators = document.querySelectorAll('.indicator');
        this.carouselPrev = document.querySelector('.carousel-control.prev');
        this.carouselNext = document.querySelector('.carousel-control.next');

        if (this.carouselSlides.length === 0) return;

        this.setupCarouselEvents();
        this.startAutoPlay();
        this.updateCarouselAccessibility();
    }

    setupCarouselEvents() {
        // Botones anterior/siguiente
        if (this.carouselPrev) {
            this.carouselPrev.addEventListener('click', () => {
                this.previousSlide();
                this.resetAutoPlay();
            });
            
            this.carouselPrev.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.previousSlide();
                    this.resetAutoPlay();
                }
            });
        }

        if (this.carouselNext) {
            this.carouselNext.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
            
            this.carouselNext.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.nextSlide();
                    this.resetAutoPlay();
                }
            });
        }

        // Indicadores
        this.carouselIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
            
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                    this.resetAutoPlay();
                }
            });
        });

        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.hero-carousel')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousSlide();
                        this.resetAutoPlay();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        this.resetAutoPlay();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.goToSlide(0);
                        this.resetAutoPlay();
                        break;
                    case 'End':
                        e.preventDefault();
                        this.goToSlide(this.carouselSlides.length - 1);
                        this.resetAutoPlay();
                        break;
                }
            }
        });

        // Pausar en hover/focus
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
            carousel.addEventListener('focusin', () => this.pauseAutoPlay());
            carousel.addEventListener('focusout', () => this.resumeAutoPlay());
        }
    }

    updateCarouselAccessibility() {
        this.carouselSlides.forEach((slide, index) => {
            const isActive = index === this.currentCarouselSlide;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', !isActive);
            
            if (isActive) {
                slide.removeAttribute('inert');
            } else {
                slide.setAttribute('inert', '');
            }
        });

        this.carouselIndicators.forEach((indicator, index) => {
            const isActive = index === this.currentCarouselSlide;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive);
            indicator.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        // Anunciar cambio de slide
        const activeSlide = this.carouselSlides[this.currentCarouselSlide];
        const slideLabel = activeSlide.getAttribute('aria-label');
        if (slideLabel) {
            this.announceToScreenReader(slideLabel);
        }
    }

    nextSlide() {
        this.currentCarouselSlide = (this.currentCarouselSlide + 1) % this.carouselSlides.length;
        this.updateCarouselAccessibility();
    }

    previousSlide() {
        this.currentCarouselSlide = (this.currentCarouselSlide - 1 + this.carouselSlides.length) % this.carouselSlides.length;
        this.updateCarouselAccessibility();
    }

    goToSlide(index) {
        if (index >= 0 && index < this.carouselSlides.length) {
            this.currentCarouselSlide = index;
            this.updateCarouselAccessibility();
        }
    }

    startAutoPlay() {
        if (this.isAutoPlay) {
            this.carouselInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
    }

    pauseAutoPlay() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }
    }

    resumeAutoPlay() {
        if (this.isAutoPlay && !this.carouselInterval) {
            this.startAutoPlay();
        }
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.resumeAutoPlay();
    }

    // ===== NAVEGACIÓN Y DROPDOWNS =====
    setupNavigation() {
        this.setupDropdowns();
        this.setupMobileNavigation();
    }

    setupDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(toggle);
            });

            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', () => {
                this.closeAllDropdowns();
            });

            // Prevenir que el dropdown se cierre al hacer clic dentro
            const dropdownMenu = toggle.nextElementSibling;
            if (dropdownMenu) {
                dropdownMenu.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });
    }

    toggleDropdown(toggle) {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        this.closeAllDropdowns();
        
        if (!isExpanded) {
            this.openDropdown(toggle);
        }
    }

    openDropdown(toggle) {
        const dropdownMenu = toggle.nextElementSibling;
        if (dropdownMenu) {
            toggle.setAttribute('aria-expanded', 'true');
            dropdownMenu.style.display = 'block';
            
            // Focus en el primer elemento del dropdown
            const firstItem = dropdownMenu.querySelector('a');
            if (firstItem) {
                firstItem.focus();
            }
        }
    }

    closeAllDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        
        dropdownToggles.forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
        });
        
        dropdownMenus.forEach(menu => {
            menu.style.display = 'none';
        });
    }

    setupMobileNavigation() {
        // En pantallas pequeñas, convertir el menú en acordeón
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        this.handleMobileNavigation(mediaQuery);
        mediaQuery.addListener(this.handleMobileNavigation);
    }

    handleMobileNavigation = (mediaQuery) => {
        const navItems = document.querySelectorAll('.nav-item.has-dropdown');
        
        if (mediaQuery.matches) {
            // Modo móvil
            navItems.forEach(item => {
                const toggle = item.querySelector('.dropdown-toggle');
                const menu = item.querySelector('.dropdown-menu');
                
                if (toggle && menu) {
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.style.display = 'none';
                }
            });
        } else {
            // Modo desktop - restaurar comportamiento hover
            navItems.forEach(item => {
                const menu = item.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = '';
                }
            });
            this.closeAllDropdowns();
        }
    }

    // ===== FORMULARIO DE RASTREO =====
    setupTrackingForm() {
        const trackingForm = document.getElementById('tracking-form');
        if (!trackingForm) return;

        this.setupTrackingValidation(trackingForm);
        this.setupTrackingSubmission(trackingForm);
    }

    setupTrackingValidation(form) {
        const trackingInput = form.querySelector('#tracking-number');

        // Validación en tiempo real del número de tracking
        if (trackingInput) {
            trackingInput.addEventListener('input', (e) => {
                this.validateTrackingNumber(e.target);
            });

            trackingInput.addEventListener('blur', (e) => {
                this.validateTrackingNumber(e.target);
            });
        }
    }

    validateTrackingNumber(input) {
        const value = input.value.toUpperCase().trim();
        const helpText = input.parentElement.querySelector('.help-text');
        
        // Actualizar valor en mayúsculas
        input.value = value;

        if (value.length === 0) {
            this.setFieldValidity(input, false, '');
        } else if (value.length !== 13) {
            this.setFieldValidity(input, false, 'El número de tracking debe tener 13 caracteres');
        } else if (!/^[A-Z0-9]{13}$/.test(value)) {
            this.setFieldValidity(input, false, 'Solo se permiten letras y números');
        } else {
            this.setFieldValidity(input, true, '');
        }

        return input.validity.valid;
    }

    setFieldValidity(field, isValid, message) {
        if (isValid) {
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('error');
        } else {
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('error');
        }

        // Mostrar/ocultar mensaje de error
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement && message) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentElement.appendChild(errorElement);
        }

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
    }

    setupTrackingSubmission(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateTrackingForm(form)) {
                this.submitTrackingForm(form);
            }
        });
    }

    validateTrackingForm(form) {
        const trackingInput = form.querySelector('#tracking-number');
        return this.validateTrackingNumber(trackingInput);
    }

    submitTrackingForm(form) {
        const trackingInput = form.querySelector('#tracking-number');
        const trackingNumber = trackingInput.value.toUpperCase().trim();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Simular envío
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rastreando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Simular respuesta
            this.showTrackingResult(trackingNumber);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    showTrackingResult(trackingNumber) {
        const trackingData = this.trackingData[trackingNumber];
        
        if (trackingData) {
            this.updateTrackingTimeline(trackingData);
            this.updateTrackingSummary(trackingNumber, trackingData);
            this.announceToScreenReader(`Resultados de rastreo encontrados para ${trackingNumber}`);
        } else {
            this.showTrackingError(trackingNumber);
        }
    }

    updateTrackingTimeline(trackingData) {
        const timeline = document.querySelector('.tracking-timeline');
        if (!timeline) return;

        // Limpiar timeline existente
        timeline.innerHTML = '';

        // Agregar nuevos items
        trackingData.forEach((item, index) => {
            const isCompleted = index < trackingData.length - 1;
            const isActive = index === trackingData.length - 1;
            
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`;
            timelineItem.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <span class="timeline-status">${item.status}</span>
                    <span class="timeline-date">${item.date}</span>
                    <span class="timeline-location">${item.location}</span>
                </div>
            `;
            timeline.appendChild(timelineItem);
        });
    }

    updateTrackingSummary(trackingNumber, trackingData) {
        const lastStatus = trackingData[trackingData.length - 1];
        const summaryItems = document.querySelectorAll('.summary-item');
        
        // Actualizar número de tracking
        if (summaryItems[0]) {
            summaryItems[0].querySelector('.summary-value').textContent = trackingNumber;
        }
        
        // Actualizar estado actual
        if (summaryItems[1]) {
            const statusElement = summaryItems[1].querySelector('.summary-value');
            statusElement.textContent = lastStatus.status;
            statusElement.className = 'summary-value ' + this.getStatusClass(lastStatus.status);
        }
        
        // Actualizar fecha estimada de entrega
        if (summaryItems[2]) {
            const estimatedDate = this.calculateEstimatedDelivery(lastStatus.date);
            summaryItems[2].querySelector('.summary-value').textContent = estimatedDate;
        }
    }

    getStatusClass(status) {
        if (status.includes('Entregado')) return 'status-delivered';
        if (status.includes('tránsito')) return 'status-in-transit';
        if (status.includes('recibido') || status.includes('clasificación')) return 'status-processing';
        return '';
    }

    calculateEstimatedDelivery(lastDate) {
        // Simular cálculo de fecha estimada
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date.toLocaleDateString('es-AR');
    }

    showTrackingError(trackingNumber) {
        this.announceToScreenReader(`No se encontraron resultados para el número de tracking ${trackingNumber}`);
        
        // Mostrar mensaje de error
        const message = document.createElement('div');
        message.className = 'success-message';
        message.style.background = 'var(--error-red)';
        message.innerHTML = `
            <div class="success-content">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <h4>No se encontró el envío</h4>
                    <p>El número de tracking ${trackingNumber} no existe o aún no está en el sistema.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 5000);
    }

    // ===== CALCULADORA DE ENVÍOS =====
    setupCalculator() {
        const calculatorForm = document.getElementById('calculator-form');
        if (!calculatorForm) return;

        this.setupCalculatorEvents(calculatorForm);
        this.setupCalculatorSubmission(calculatorForm);
    }

    setupCalculatorEvents(form) {
        // Recalcular en tiempo real cuando cambien los inputs
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                if (this.validateCalculatorForm(form)) {
                    this.calculateShippingCost(form);
                }
            });
        });
    }

    setupCalculatorSubmission(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateCalculatorForm(form)) {
                this.calculateShippingCost(form);
            }
        });
    }

    validateCalculatorForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.setFieldValidity(field, false, 'Este campo es obligatorio');
                isValid = false;
            } else {
                this.setFieldValidity(field, true, '');
            }
        });

        return isValid;
    }

    calculateShippingCost(form) {
        const formData = new FormData(form);
        const origen = formData.get('origen');
        const destino = formData.get('destino');
        const peso = parseFloat(formData.get('peso'));
        const tipoEnvio = formData.get('tipo-envio');
        const seguro = formData.get('seguro') === 'on';

        // Simular cálculo de costos (en una implementación real, esto vendría de una API)
        let baseCost = 0;

        // Costo base por peso
        if (peso <= 1) baseCost = 800;
        else if (peso <= 3) baseCost = 1200;
        else if (peso <= 5) baseCost = 1800;
        else if (peso <= 10) baseCost = 2500;
        else baseCost = 3500;

        // Multiplicador por tipo de envío
        const multipliers = {
            'estandar': 1,
            'express': 1.5,
            'prioritario': 2
        };
        baseCost *= multipliers[tipoEnvio] || 1;

        // Costo por distancia (simplificado)
        if (origen !== destino) {
            baseCost *= 1.3;
        }

        // Seguro
        const seguroCost = seguro ? 500 : 0;

        const totalCost = baseCost + seguroCost;

        this.displayCalculationResult({
            base: baseCost,
            seguro: seguroCost,
            total: totalCost,
            origen,
            destino,
            peso,
            tipoEnvio,
            seguroIncluido: seguro
        });
    }

    displayCalculationResult(result) {
        const resultContainer = document.getElementById('calculator-result');
        if (!resultContainer) return;

        const tipoEnvioText = {
            'estandar': 'Estándar',
            'express': 'Express',
            'prioritario': 'Prioritario'
        }[result.tipoEnvio] || 'Estándar';

        resultContainer.innerHTML = `
            <div class="calculation-result">
                <div class="result-header">
                    <h3 class="result-title">Costo de Envío</h3>
                    <div class="result-amount">$${this.formatCurrency(result.total)}</div>
                </div>
                <div class="result-details">
                    <div class="detail-item">
                        <span>Origen - Destino:</span>
                        <span>${result.origen} → ${result.destino}</span>
                    </div>
                    <div class="detail-item">
                        <span>Peso:</span>
                        <span>${result.peso} kg</span>
                    </div>
                    <div class="detail-item">
                        <span>Tipo de envío:</span>
                        <span>${tipoEnvioText}</span>
                    </div>
                    <div class="detail-item">
                        <span>Costo base:</span>
                        <span>$${this.formatCurrency(result.base)}</span>
                    </div>
                    ${result.seguroIncluido ? `
                    <div class="detail-item">
                        <span>Seguro de envío:</span>
                        <span>$${this.formatCurrency(result.seguro)}</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <span>Total:</span>
                        <span>$${this.formatCurrency(result.total)}</span>
                    </div>
                </div>
            </div>
        `;

        this.announceToScreenReader(`Cálculo completado. Costo total: $${this.formatCurrency(result.total)}`);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-AR').format(amount);
    }

    // ===== EVENT LISTENERS GLOBALES =====
    setupEventListeners() {
        // Mejorar experiencia de formularios
        this.enhanceFormExperiences();
        
        // Configurar búsqueda
        this.setupSearch();
        
        // Manejar errores de carga de imágenes
        this.handleImageErrors();
        
        // Configurar interacciones de tarjetas de servicio
        this.setupServiceCards();
    }

    enhanceFormExperiences() {
        // Auto-focus en primer campo de formulario
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const firstInput = form.querySelector('input, select, textarea');
            if (firstInput && !firstInput.disabled) {
                form.addEventListener('focusin', () => {
                    if (!firstInput.matches(':focus')) {
                        firstInput.focus();
                    }
                });
            }
        });
    }

    setupSearch() {
        const searchForm = document.querySelector('.search-box form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = searchForm.querySelector('input');
                if (input.value.trim()) {
                    this.performSearch(input.value.trim());
                }
            });
        }
    }

    performSearch(query) {
        // Simular búsqueda
        this.announceToScreenReader(`Buscando: ${query}. Mostrando resultados...`);
        console.log('Buscando en Correo Argentino:', query);
        
        // En una implementación real, aquí iría la lógica de búsqueda
        // Por ahora, mostrar un mensaje
        this.showSearchResults(query);
    }

    showSearchResults(query) {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="success-content">
                <i class="fas fa-search"></i>
                <div>
                    <h4>Búsqueda: "${query}"</h4>
                    <p>Esta funcionalidad se conectaría con el sistema de búsqueda real de Correo Argentino.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 4000);
    }

    setupServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    const link = card.querySelector('.service-link');
                    if (link) {
                        link.click();
                    }
                }
            });
        });
    }

    handleImageErrors() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                const alt = img.getAttribute('alt') || 'Imagen';
                img.outerHTML = `<div class="image-placeholder" role="img" aria-label="${alt} no disponible">
                    <i class="fas fa-image"></i>
                    <span>${alt}</span>
                </div>`;
            });
        });
    }

    // ===== NAVEGACIÓN POR TECLADO =====
    setupKeyboardNavigation() {
        // Atajos de teclado globales
        document.addEventListener('keydown', (e) => {
            // Skip to main content (tecla S)
            if (e.key === 's' || e.key === 'S') {
                const skipLink = document.querySelector('.skip-link');
                if (skipLink) {
                    e.preventDefault();
                    skipLink.focus();
                }
            }
            
            // Navegación por headings (tecla H)
            if (e.key === 'h' || e.key === 'H') {
                this.navigateHeadings(e.shiftKey);
            }
            
            // Acceso rápido a búsqueda (tecla /)
            if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                const searchInput = document.querySelector('.search-box input');
                if (searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                }
            }
        });

        // Trap focus en modales (si los hubiera)
        this.setupFocusTrapping();
    }

    navigateHeadings(backwards = false) {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const currentIndex = headings.findIndex(h => h === document.activeElement);
        
        let nextIndex;
        if (backwards) {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : headings.length - 1;
        } else {
            nextIndex = currentIndex < headings.length - 1 ? currentIndex + 1 : 0;
        }
        
        if (headings[nextIndex]) {
            headings[nextIndex].setAttribute('tabindex', '-1');
            headings[nextIndex].focus();
            this.announceToScreenReader(`Encabezado: ${headings[nextIndex].textContent}`);
        }
    }

    setupFocusTrapping() {
        // En una implementación real, esto atraparía el focus en modales
        console.log('Focus trapping configurado para Correo Argentino');
    }

    // ===== INICIALIZACIÓN Y UTILIDADES =====
    announcePageLoad() {
        // Esperar a que la página esté completamente cargada
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.announceToScreenReader('Página de Correo Argentino completamente cargada. Use la tecla S para saltar al contenido principal.');
            });
        } else {
            this.announceToScreenReader('Página de Correo Argentino completamente cargada. Use la tecla S para saltar al contenido principal.');
        }
    }

    // Utilidad para formatear números
    formatNumber(number) {
        return new Intl.NumberFormat('es-AR').format(number);
    }

    // Utilidad para fechas
    formatDate(date) {
        return new Intl.DateTimeFormat('es-AR').format(date);
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la aplicación
    const correoApp = new CorreoArgentinoAccessible();
    
    // Hacer disponible globalmente para debugging
    window.correoApp = correoApp;
    
    // Configurar Service Worker (si está disponible)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registrado para Correo Argentino'))
            .catch(err => console.log('Service Worker no registrado:', err));
    }
});

// ===== POLYFILLS PARA ACCESIBILIDAD =====
// Polyfill para inert (si el navegador no lo soporta)
if (!HTMLElement.prototype.hasOwnProperty('inert')) {
    Object.defineProperty(HTMLElement.prototype, 'inert', {
        get: function() {
            return this.hasAttribute('inert');
        },
        set: function(value) {
            if (value) {
                this.setAttribute('inert', '');
                this.setAttribute('aria-hidden', 'true');
                this.style.pointerEvents = 'none';
                this.style.userSelect = 'none';
            } else {
                this.removeAttribute('inert');
                this.removeAttribute('aria-hidden');
                this.style.pointerEvents = '';
                this.style.userSelect = '';
            }
        }
    });
}

// Polyfill para focus-visible
(function() {
    const className = 'focus-visible';
    const lastMouseClickTime = 0;
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    function handleKeyDown() {
        document.body.classList.add(className);
    }
    
    function handleMouseDown() {
        document.body.classList.remove(className);
    }
})();

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (event) => {
    console.error('Error capturado en Correo Argentino:', event.error);
    // En producción, aquí se reportaría el error a un servicio de monitoreo
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada en Correo Argentino:', event.reason);
    // En producción, aquí se reportaría el error a un servicio de monitoreo
});

// ===== PERFORMANCE Y OFFLINE =====
// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        // Agregar recursos críticos aquí
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Lazy loading para imágenes
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== MOCK DATA PARA DEMOSTRACIÓN =====
// Datos de ejemplo para funcionalidades de demostración
window.mockTrackingData = {
    'RA123456789AR': [
        { status: 'Envío recibido', date: '15 Ene, 10:30', location: 'Sucursal Central' },
        { status: 'En proceso de clasificación', date: '15 Ene, 14:15', location: 'Centro de Distribución' },
        { status: 'En tránsito', date: '16 Ene, 08:45', location: 'Hacia destino final' },
        { status: 'Entregado', date: '17 Ene, 14:20', location: 'Sucursal destino' }
    ],
    'RB987654321AR': [
        { status: 'Envío recibido', date: '14 Ene, 09:15', location: 'Sucursal Norte' },
        { status: 'En proceso de clasificación', date: '14 Ene, 16:30', location: 'Centro de Distribución' },
        { status: 'En tránsito', date: '15 Ene, 11:00', location: 'Hacia destino final' }
    ],
    'RC555666777AR': [
        { status: 'Envío recibido', date: '16 Ene, 13:45', location: 'Sucursal Oeste' },
        { status: 'En proceso de clasificación', date: '16 Ene, 17:20', location: 'Centro de Distribución' }
    ]
};
