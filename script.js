// Initialize Animate On Scroll library with custom configuration
AOS.init({
    duration: 800,      // Animation duration in milliseconds
    once: true,         // Animation occurs only once
    offset: 100         // Offset (in px) from the original trigger point
});

// Initialize fade-in animation using Intersection Observer API
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add 'visible' class when element enters viewport
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1  // Trigger when 10% of element is visible
});

// Apply fade observer to all elements with 'fade-in' class
document.querySelectorAll('.fade-in').forEach(element => {
    fadeObserver.observe(element);
});

// Mobile Navigation Setup
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

// Handle mobile menu toggle
burger.addEventListener('click', () => {
    // Toggle mobile navigation visibility
    nav.classList.toggle('active');

    // Animate each navigation link with a staggered delay
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            // Add staggered animation to each link
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Animate burger menu icon
    burger.classList.toggle('toggle');
});

// Implement smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Smooth scroll to target section
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        }
    });
});

// Navbar scroll effect implementation
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

// Handle navbar visibility on scroll
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Reset navbar state at page top
    if (currentScroll <= 0) {
        navbar.classList.remove('scrolled');
        return;
    }
    
    // Add/remove scrolled class based on scroll direction
    if (currentScroll > lastScroll && !navbar.classList.contains('scrolled')) {
        // Scrolling down - hide navbar
        navbar.classList.add('scrolled');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scrolled')) {
        // Scrolling up - show navbar
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});



// Load saved profile picture from local storage
const savedProfilePicture = localStorage.getItem('profilePicture');
if (savedProfilePicture) {
    profilePreview.src = savedProfilePicture;
}

// Resume download functionality
const resumeBtn = document.querySelector('.resume-btn');
resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Create temporary link for download
    const resumeUrl = 'path/to/your/resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Contact form submission handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Get form field values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Create mailto link with form data
        const mailtoLink = `mailto:suryansh.asati1@gmail.com?subject=Portfolio Contact Form: ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
        
        // Open default email client
        window.location.href = mailtoLink;

        // Show success message
        submitButton.innerHTML = '<i class="fas fa-check"></i> Email Client Opened!';
        
        // Reset form
        contactForm.reset();
        
        // Reset button state after delay
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Project card hover animations
document.querySelectorAll('.project-card').forEach(card => {
    // Add hover effects
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.querySelector('.project-overlay').style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.querySelector('.project-overlay').style.opacity = '0';
    });
});

// Skill item hover animations
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
});

// Social links hover animations
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-3px)';
    });

    item.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

// Scroll animation configuration
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Initialize scroll observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply scroll animations to sections and elements
document.querySelectorAll('section, .skill-item, .project-card').forEach(element => {
    observer.observe(element);
});

// Newsletter subscription handling
const newsletterForm = document.querySelector('.card__form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email) {
            // Create mailto link for newsletter subscription
            const mailtoLink = `mailto:suryansh.asati1@gmail.com?subject=Newsletter Subscription&body=Please add this email to newsletter: ${email}`;
            
            // Save email to local storage
            let savedEmails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
            savedEmails.push({
                email: email,
                date: new Date().toISOString()
            });
            localStorage.setItem('newsletterEmails', JSON.stringify(savedEmails));
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Clear input and show success message
            emailInput.value = '';
            
            const signUpButton = this.querySelector('.sign-up');
            const originalText = signUpButton.textContent;
            signUpButton.textContent = 'Subscribed!';
            signUpButton.style.backgroundColor = 'var(--primary-color)';
            
            // Reset button state after delay
            setTimeout(() => {
                signUpButton.textContent = originalText;
                signUpButton.style.backgroundColor = '';
            }, 2000);
        }
    });
}

// Utility function to get saved newsletter emails
function getSavedEmails() {
    const emails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
    return emails.map(entry => ({
        email: entry.email,
        subscribed: new Date(entry.date).toLocaleString()
    }));
}

// Export newsletter emails to CSV
function exportEmailsToCSV() {
    const emails = getSavedEmails();
    const csvContent = "Email,Subscription Date\n" + 
        emails.map(entry => `${entry.email},${entry.subscribed}`).join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
