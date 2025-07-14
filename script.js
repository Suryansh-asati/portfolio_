// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Fade-in Animation Observer
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    fadeObserver.observe(element);
});

// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Navigation
    nav.classList.toggle('active');

    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
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

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scrolled');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scrolled')) {
        // Scrolling down
        navbar.classList.add('scrolled');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scrolled')) {
        // Scrolling up
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});


// Form Submission with Animation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Create mailto link with subject and body
        const mailtoLink = `mailto:suryansh.asati1@gmail.com?subject=Portfolio Contact Form: ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
        
        // Open default email client
        window.location.href = mailtoLink;

        // Show success state
        submitButton.innerHTML = '<i class="fas fa-check"></i> Email Client Opened!';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 2 seconds
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}


const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.classList.remove('invisible');
    } else {
      entry.target.classList.remove('visible');
      entry.target.classList.add('invisible');
    }
  });
}, observerOptions);

// Target all desired elements
document.querySelectorAll('section, .skill-item, .project-card, .fade-in')
  .forEach(el => observer.observe(el));


// Mouse cursor tracking
document.addEventListener('DOMContentLoaded', () => {
    const indicator = document.getElementById('cursor-indicator');
    
    if (indicator) {
        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                indicator.style.left = `${e.clientX}px`;
                indicator.style.top = `${e.clientY}px`;
            });
        });
        
        // Hide cursor indicator when mouse leaves the window
        document.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0';
        });
        
        // Show cursor indicator when mouse enters the window
        document.addEventListener('mouseenter', () => {
            indicator.style.opacity = '1';
        });
    }
});

