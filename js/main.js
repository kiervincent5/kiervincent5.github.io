/**
 * KV. — Kier Vincent Booc Portfolio
 * Core Application Logic & Interactive Components
 * Modular, performant, and fully accessible (ES6+)
 */

'use strict';

(function () {
    // =========================================================================
    // 1. PROJECT DATA REPOSITORY (Single Source of Truth)
    // =========================================================================
    const PROJECTS_DATA = {
        ecodrop: {
            title: 'SMC EcoDrop — Smart Plastic Bottle Recycler',
            images: [
                'assets/admin-dashboard.jpg',
                'assets/admin-advancedpanel.jpg',
                'assets/admin-globalsettings.jpg',
                'assets/user-dashboard.jpg',
                'assets/user-profile.jpg'
            ],
            description: `SMC EcoDrop: Smart Plastic Bottle Recycler with Reward System is an IoT capstone solution engineered to automate plastic recycling and incentivize students on campus.

⚙️ HARDWARE REQUIREMENTS:
• ESP8266 Wi-Fi Module — IoT microcontroller with wireless station/AP connectivity
• QR Code Reader Module (UART TTL) — Fast optical scanning of student identity QR codes
• Capacitive & Inductive Proximity Sensors — Dual-material verification (detects plastic bottles vs metals/foreign objects)
• Ultrasonic Sensor (HC-SR04) — Continuous fill-level measurement of the collection bin
• Servo Motor MG996R — High-torque actuator driving the intake trapdoor & sorting gate
• 12V Power Adapter, Jumper Wires & Breadboard Circuitry
• Local Wi-Fi Router — Dedicated LAN deployment connection

💻 SOFTWARE REQUIREMENTS:
• Python & Django Framework — Full-stack web application backend, REST APIs & point-reward engine
• Web-based Responsive Application — Student rewards portal & real-time administrative analytics panel
• Arduino IDE (C/C++) — Microcontroller firmware for sensor calibration, UART parsing & Wi-Fi transmission
• Visual Studio Code — Full-stack software and embedded development environment`
        },
        django: {
            title: 'Web & Backend Systems Platform',
            images: [
                'assets/django-dashboard.png'
            ],
            description: `High-performance backend platform engineered with Python and Django.

Key Features:
• Modular RESTful API architecture with Django REST Framework
• Secure authentication, token-based sessions, and role permissions
• Relational database modeling with automated migration pipelines
• Real-time server performance metrics and administrative analytics dashboard`
        },
        iotMobile: {
            title: 'IoT Mobile Controller & Telemetry',
            images: [
                'assets/iot-mobile.png'
            ],
            description: `Cross-platform mobile application interface for smart IoT embedded systems.

Key Features:
• Real-time telemetry monitoring displaying environment and sensor metrics
• Device actuator controls and state toggling over low-latency WebSockets
• Historical data logging with intuitive interactive charts
• Lightweight, responsive mobile-first UI with dark cyber aesthetic`
        }
    };

    // =========================================================================
    // 2. NAVIGATION CONTROLLER (Sticky Navbar, Mobile Drawer, Spy Observer)
    // =========================================================================
    const Navigation = {
        init() {
            this.navbar = document.getElementById('navbar');
            this.mobileToggle = document.getElementById('mobileToggle');
            this.mobileDrawer = document.getElementById('mobileDrawer');
            this.desktopLinks = document.querySelectorAll('.nav-menu .nav-link');
            this.mobileLinks = document.querySelectorAll('.mobile-drawer .nav-link');
            this.sections = document.querySelectorAll('section[id]');

            this.bindScrollState();
            this.bindMobileDrawer();
            this.bindSmoothScroll();
            this.initScrollSpy();
        },

        bindScrollState() {
            if (!this.navbar) return;

            let ticking = false;
            const updateNavbar = () => {
                const scrolled = window.scrollY > 30;
                this.navbar.classList.toggle('nav-scrolled', scrolled);
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateNavbar);
                    ticking = true;
                }
            }, { passive: true });

            updateNavbar();
        },

        bindMobileDrawer() {
            if (!this.mobileToggle || !this.mobileDrawer) return;

            const toggleDrawer = (open) => {
                const isOpen = open !== undefined ? open : !this.mobileDrawer.classList.contains('active');
                this.mobileDrawer.classList.toggle('active', isOpen);
                this.mobileToggle.setAttribute('aria-expanded', String(isOpen));

                const icon = this.mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars', !isOpen);
                    icon.classList.toggle('fa-xmark', isOpen);
                }
            };

            this.mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleDrawer();
            });

            this.mobileLinks.forEach(link => {
                link.addEventListener('click', () => toggleDrawer(false));
            });

            // Close drawer when clicking outside or pressing Escape
            document.addEventListener('click', (e) => {
                if (this.mobileDrawer.classList.contains('active') && 
                    !this.mobileDrawer.contains(e.target) && 
                    !this.mobileToggle.contains(e.target)) {
                    toggleDrawer(false);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.mobileDrawer.classList.contains('active')) {
                    toggleDrawer(false);
                }
            });
        },

        bindSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#' || !targetId) return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({ behavior: 'smooth' });

                        const serviceVal = anchor.getAttribute('data-service');
                        if (serviceVal) {
                            const serviceSelect = document.getElementById('serviceInterest');
                            if (serviceSelect) {
                                serviceSelect.value = serviceVal;
                            }
                        }

                        // Update URL hash without jumping
                        if (history.pushState) {
                            history.pushState(null, '', targetId);
                        }
                    }
                });
            });
        },

        initScrollSpy() {
            if (!this.sections.length || !('IntersectionObserver' in window)) return;

            const observerOptions = {
                root: null,
                threshold: 0.2,
                rootMargin: '-80px 0px -40% 0px'
            };

            const setActiveLink = (id) => {
                const updateList = (links) => {
                    links.forEach(link => {
                        const isCurrent = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('active', isCurrent);
                        if (isCurrent) {
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                };

                updateList(this.desktopLinks);
                updateList(this.mobileLinks);
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.getAttribute('id'));
                    }
                });
            }, observerOptions);

            this.sections.forEach(section => observer.observe(section));
        }
    };

    // =========================================================================
    // 3. MODAL LIGHTBOX CONTROLLER (Keyboard Navigation, Focus Trap, Carousel)
    // =========================================================================
    const Lightbox = {
        init() {
            this.modal = document.getElementById('projectModal');
            if (!this.modal) return;

            this.modalImg = document.getElementById('modalImg');
            this.modalTitle = document.getElementById('modalTitle');
            this.modalDesc = document.getElementById('modalDesc');
            this.modalDots = document.getElementById('modalDots');
            this.closeBtn = document.getElementById('closeModalBtn');
            this.prevBtn = this.modal.querySelector('.prev-arrow');
            this.nextBtn = this.modal.querySelector('.next-arrow');

            this.images = [];
            this.currentIndex = 0;
            this.lastFocusedElement = null;

            this.bindTriggers();
            this.bindControls();
        },

        bindTriggers() {
            document.querySelectorAll('[data-project-id], .clickable-image').forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const projectId = trigger.getAttribute('data-project-id');
                    let data = PROJECTS_DATA[projectId];

                    // Fallback to inline attributes if project-id is not provided
                    if (!data) {
                        const rawImages = trigger.getAttribute('data-images');
                        const images = rawImages ? rawImages.split(',').map(s => s.trim()) : [];
                        if (!images.length) {
                            const img = trigger.querySelector('img');
                            if (img) images.push(img.src);
                        }
                        data = {
                            title: trigger.getAttribute('data-title') || 'Project Showcase',
                            description: trigger.getAttribute('data-desc') || '',
                            images: images
                        };
                    }

                    this.open(data, trigger);
                });
            });
        },

        bindControls() {
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.step(-1);
                });
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.step(1);
                });
            }

            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }

            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });

            document.addEventListener('keydown', (e) => {
                if (!this.modal.classList.contains('active')) return;

                switch (e.key) {
                    case 'Escape':
                        this.close();
                        break;
                    case 'ArrowLeft':
                        this.step(-1);
                        break;
                    case 'ArrowRight':
                        this.step(1);
                        break;
                    case 'Tab':
                        this.trapFocus(e);
                        break;
                }
            });
        },

        open(data, triggerElement) {
            this.lastFocusedElement = triggerElement || document.activeElement;
            this.images = data.images || [];
            this.currentIndex = 0;

            if (this.modalTitle) this.modalTitle.textContent = data.title;
            if (this.modalDesc) this.modalDesc.textContent = data.description;

            this.updateImage();
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Set focus inside modal for screen readers and keyboard users
            if (this.closeBtn) this.closeBtn.focus();
        },

        close() {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';

            // Restore focus to original trigger
            if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
                this.lastFocusedElement.focus();
            }
        },

        step(direction) {
            const nextIndex = this.currentIndex + direction;
            if (nextIndex >= 0 && nextIndex < this.images.length) {
                this.currentIndex = nextIndex;
                this.updateImage();
            }
        },

        updateImage() {
            if (!this.modalImg) return;

            if (this.images.length > 0) {
                this.modalImg.src = this.images[this.currentIndex];
                this.modalImg.style.display = 'block';

                const hasMultiple = this.images.length > 1;
                if (this.prevBtn) {
                    this.prevBtn.style.display = hasMultiple ? 'flex' : 'none';
                    this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
                    this.prevBtn.setAttribute('aria-disabled', String(this.currentIndex === 0));
                }

                if (this.nextBtn) {
                    this.nextBtn.style.display = hasMultiple ? 'flex' : 'none';
                    this.nextBtn.classList.toggle('disabled', this.currentIndex === this.images.length - 1);
                    this.nextBtn.setAttribute('aria-disabled', String(this.currentIndex === this.images.length - 1));
                }

                this.renderDots();
            } else {
                this.modalImg.style.display = 'none';
                if (this.prevBtn) this.prevBtn.style.display = 'none';
                if (this.nextBtn) this.nextBtn.style.display = 'none';
                if (this.modalDots) this.modalDots.innerHTML = '';
            }
        },

        renderDots() {
            if (!this.modalDots) return;
            this.modalDots.innerHTML = '';

            if (this.images.length <= 1) return;

            this.images.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `modal-dot ${idx === this.currentIndex ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.currentIndex = idx;
                    this.updateImage();
                });
                this.modalDots.appendChild(dot);
            });
        },

        trapFocus(e) {
            const focusables = this.modal.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusables.length) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    // =========================================================================
    // 4. CONTACT FORM CONTROLLER (Async Simulation, Accessible Alerts)
    // =========================================================================
    const ContactForm = {
        init() {
            this.form = document.getElementById('contactForm');
            if (!this.form) return;

            this.submitBtn = document.getElementById('submitBtn');
            this.statusBox = document.getElementById('formStatus');

            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        },

        handleSubmit(e) {
            e.preventDefault();
            if (!this.submitBtn || !this.statusBox) return;

            // Simple HTML5 validity check
            if (!this.form.checkValidity()) {
                this.form.reportValidity();
                return;
            }

            const originalBtnHTML = this.submitBtn.innerHTML;
            this.submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending message...';
            this.submitBtn.disabled = true;

            // Simulated response delay
            setTimeout(() => {
                this.submitBtn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Message Sent!';
                this.submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

                this.statusBox.style.display = 'block';
                this.statusBox.className = 'status-alert-success';
                this.statusBox.setAttribute('role', 'status');
                this.statusBox.setAttribute('aria-live', 'polite');
                this.statusBox.textContent = '✓ Thank you! Your message has been received. I will respond to you within 24 hours.';

                this.form.reset();

                setTimeout(() => {
                    this.submitBtn.innerHTML = originalBtnHTML;
                    this.submitBtn.style.background = '';
                    this.submitBtn.disabled = false;
                    this.statusBox.style.display = 'none';
                }, 5000);
            }, 1200);
        }
    };

    // =========================================================================
    // 5. APPLICATION INITIALIZATION
    // =========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        Navigation.init();
        Lightbox.init();
        ContactForm.init();
    });
})();
