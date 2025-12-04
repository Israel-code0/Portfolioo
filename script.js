// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

// Set initial theme
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add animation class for smooth transition
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ===== FORM VALIDATION & SUBMISSION =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form[name="contact"]');
    
    if (!contactForm) return;
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Clear errors on input
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', function() {
            this.classList.remove('error');
            const errorDiv = this.parentElement.querySelector('.form-error');
            if (errorDiv) errorDiv.style.display = 'none';
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) return;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Submit to Netlify (Zapier will pick this up)
        const formData = new FormData(contactForm);
        
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(response => {
            if (response.ok) {
                // Success - Zapier will send auto-reply
                showSuccessMessage();
                contactForm.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('Something went wrong. Please try again or email me directly.');
        })
        .finally(() => {
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 3000);
        });
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        contactForm.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.classList.remove('error');
        });
        
        // Check required fields
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
            
            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Create or find error element
        let errorElement = field.parentElement.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function showSuccessMessage() {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.classList.add('success');
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Thank you! ✨</h4>
                <p>Your message has been sent successfully. You should receive an auto-reply email within a few minutes.</p>
            </div>
        `;
        
        // Insert after form
        contactForm.parentNode.insertBefore(successDiv, contactForm.nextSibling);
        
        // Remove after 10 seconds
        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => successDiv.remove(), 500);
        }, 10000);
    }
    
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Insert after form
        contactForm.parentNode.insertBefore(errorDiv, contactForm.nextSibling);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    }
});

// Add interactive hover effects to mockups
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const mockup = card.querySelector('.mockup-browser');
        if (mockup) {
            mockup.style.transform = 'translateY(-5px)';
            mockup.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const mockup = card.querySelector('.mockup-browser');
        if (mockup) {
            mockup.style.transform = 'translateY(0)';
            mockup.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }
    });
});

// Add animation to product items in e-commerce mockup
function animateEcommerceMockup() {
    const ecommercePreview = document.querySelector('.ecommerce-preview');
    if (ecommercePreview && !document.hidden) {
        const productItems = ecommercePreview.querySelectorAll('.product-item');
        productItems.forEach((item, index) => {
            // Reset animation
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            // Add pulsing animation
            item.style.animation = `productPulse ${2 + index * 0.5}s ease-in-out infinite`;
        });
    }
}

// Add CSS for product pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes productPulse {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
    }
    
    @keyframes chartGrow {
        from { transform: scaleY(0); }
        to { transform: scaleY(1); }
    }
    
    .chart-bar {
        transform-origin: bottom;
        animation: chartGrow 1.5s ease-out;
    }
    
    .stat-value {
        animation: countUp 2s ease-out;
    }
    
    @keyframes countUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    animateEcommerceMockup();
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const projectCard = entry.target;
                const mockup = projectCard.querySelector('.mockup-browser');
                if (mockup) {
                    mockup.classList.add('animate-in');
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
});

// Check if we're on localhost or Netlify
const isNetlify = window.location.hostname.includes('netlify.app') || 
                  window.location.hostname.includes('localhost');

// Use different form handling based on environment
if (isNetlify) {
    // Use Netlify form handling code
    // ... (Netlify code from above)
} else {
    // Use local testing code (shows alert)
    const contactForm = document.querySelector('form[name="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Form would submit to Netlify in production. Local test successful!');
            contactForm.reset();
        });
    }
}