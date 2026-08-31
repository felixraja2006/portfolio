/* ==========================================
   INTERACTIVE LOGIC - FELIX RAJA S PORTFOLIO
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------
       1. THEME SWITCHER (LIGHT/DARK MODE)
       -------------------------------------- */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const setDarkMode = (isDark) => {
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'light');
        }
    };
    
    // Initial Setting
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        setDarkMode(false);
    } else {
        setDarkMode(true);
    }
    
    // Toggle on Click
    themeToggle.addEventListener('click', () => {
        const isCurrentLight = document.documentElement.getAttribute('data-theme') === 'light';
        setDarkMode(isCurrentLight); // If currently light, switch to dark (true), and vice versa
    });

    /* --------------------------------------
       2. TYPING ANIMATION
       -------------------------------------- */
    const typingText = document.getElementById('typingText');
    const phrases = [
        'Frontend Developer', 
        'Computer Science Graduate', 
        'Tech Enthusiast'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    const type = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Removing characters
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            // Typing characters
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Types at normal pace
        }
        
        // Handle phrase transition states
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }
        
        setTimeout(type, typingSpeed);
    };
    
    // Initiate Typing
    setTimeout(type, 1000);

    /* --------------------------------------
       3. NAVIGATION INTERACTIONS
       -------------------------------------- */
    const header = document.querySelector('.header');
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');
    const scrollProgress = document.getElementById('scrollProgress');
    
    // Shrink header on scroll & calculate progress width
    window.addEventListener('scroll', () => {
        // Header backdrop density transition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Scroll progress bar calculations
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercentage = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolledPercentage}%`;
        
        // Update Active Nav Link based on current visible section
        let currentSectionId = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Scroll offset correction
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    // Burger Navigation Toggle
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when a nav link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* --------------------------------------
       4. SCROLL REVEAL (FADE IN EFFECTS)
       -------------------------------------- */
    const revealSections = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15 // Section must be 15% visible
    });
    
    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    /* --------------------------------------
       5. INTERACTIVE RESUME MODAL
       -------------------------------------- */
    const resumeModal = document.getElementById('resumeModal');
    const btnOpenResume = document.getElementById('btnOpenResume');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    
    const toggleModal = (show) => {
        if (show) {
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        } else {
            resumeModal.classList.remove('active');
            document.body.style.overflow = 'auto';   // Unlock background scroll
        }
    };
    
    btnOpenResume.addEventListener('click', () => toggleModal(true));
    btnCloseModal.addEventListener('click', () => toggleModal(false));
    modalBackdrop.addEventListener('click', () => toggleModal(false));
    
    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
            toggleModal(false);
        }
    });

    /* --------------------------------------
       6. CONTACT FORM & VALIDATIONS
       -------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const successToast = document.getElementById('successToast');
    const btnCloseToast = document.getElementById('btnCloseToast');
    
    const formFields = {
        name: {
            input: document.getElementById('formName'),
            validator: (val) => val.trim().length > 0
        },
        email: {
            input: document.getElementById('formEmail'),
            validator: (val) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(val.trim());
            }
        },
        subject: {
            input: document.getElementById('formSubject'),
            validator: (val) => val.trim().length > 0
        },
        message: {
            input: document.getElementById('formMessage'),
            validator: (val) => val.trim().length > 0
        }
    };
    
    // Add real-time input event listeners to clear error visual indicators
    Object.keys(formFields).forEach(key => {
        const field = formFields[key];
        field.input.addEventListener('input', () => {
            if (field.validator(field.input.value)) {
                field.input.classList.remove('invalid');
            }
        });
    });
    
    // Show success notification toast
    const triggerToast = () => {
        successToast.classList.add('active');
        setTimeout(() => {
            successToast.classList.remove('active');
        }, 5000); // Auto close after 5 seconds
    };
    
    btnCloseToast.addEventListener('click', () => {
        successToast.classList.remove('active');
    });
    
    // Handle Form Submit
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;
        
        // Validate all fields
        Object.keys(formFields).forEach(key => {
            const field = formFields[key];
            const isValid = field.validator(field.input.value);
            if (!isValid) {
                field.input.classList.add('invalid');
                isFormValid = false;
            } else {
                field.input.classList.remove('invalid');
            }
        });
        
        if (isFormValid) {
            // Mock successfully sending message
            const btnSubmit = document.getElementById('btnFormSubmit');
            const submitText = btnSubmit.querySelector('span');
            const submitIcon = btnSubmit.querySelector('i');
            
            // Disable button during mock load
            btnSubmit.style.pointerEvents = 'none';
            btnSubmit.style.opacity = '0.7';
            submitText.textContent = 'Sending...';
            submitIcon.className = 'fa-solid fa-spinner fa-spin';
            
            setTimeout(() => {
                // Clear Form
                contactForm.reset();
                
                // Restore button
                btnSubmit.style.pointerEvents = 'auto';
                btnSubmit.style.opacity = '1';
                submitText.textContent = 'Send Message';
                submitIcon.className = 'fa-regular fa-paper-plane';
                
                // Show notification toast
                triggerToast();
            }, 1200);
        }
    });
});
