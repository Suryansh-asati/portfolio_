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

// Profile Picture Upload
const profileInput = document.getElementById('profile-input');
const profilePreview = document.getElementById('profile-preview');

profileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePreview.src = e.target.result;
            // Save to localStorage
            localStorage.setItem('profilePicture', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load saved profile picture
const savedProfilePicture = localStorage.getItem('profilePicture');
if (savedProfilePicture) {
    profilePreview.src = savedProfilePicture;
}

// Resume Download
const resumeBtn = document.querySelector('.resume-btn');
resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Replace with your actual resume URL
    const resumeUrl = 'path/to/your/resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

// Project Card Hover Effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.querySelector('.project-overlay').style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.querySelector('.project-overlay').style.opacity = '0';
    });
});

// Skill Item Animation
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
});

// Social Links Animation
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-3px)';
    });

    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and animated elements
document.querySelectorAll('section, .skill-item, .project-card').forEach(element => {
    observer.observe(element);
});

// Newsletter form handling
const newsletterForm = document.querySelector('.card__form');
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (email) {
        // Create mailto link for newsletter subscription
        const mailtoLink = `mailto:suryansh.asati1@gmail.com?subject=Newsletter Subscription&body=Please add this email to newsletter: ${email}`;
        
        // Save to localStorage
        let savedEmails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
        savedEmails.push({
            email: email,
            date: new Date().toISOString()
        });
        localStorage.setItem('newsletterEmails', JSON.stringify(savedEmails));
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Clear the input and show success message
        emailInput.value = '';
        
        // Show success message with animation
        const signUpButton = this.querySelector('.sign-up');
        const originalText = signUpButton.textContent;
        signUpButton.textContent = 'Subscribed!';
        signUpButton.style.backgroundColor = 'var(--primary-color)';
        
        setTimeout(() => {
            signUpButton.textContent = originalText;
            signUpButton.style.backgroundColor = '';
        }, 2000);
    }
});

// Function to get all saved emails with timestamps
function getSavedEmails() {
    const emails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
    return emails.map(entry => ({
        email: entry.email,
        subscribed: new Date(entry.date).toLocaleString()
    }));
}

// Function to export emails to CSV
function exportEmailsToCSV() {
    const emails = getSavedEmails();
    const csvContent = "Email,Subscription Date\n" + 
        emails.map(entry => `${entry.email},${entry.subscribed}`).join("\n");
    
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

const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.1
};

const appearOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('visible');
    } else {
        entry.target.classList.remove('visible');
    }
});
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

var loader = document.getElementById('load');
var scroll = document.getElementById('main');
function myloadfunction(){
    loader.style.display='none';
    scroll.style.overflow='hidden';
}

window.addEventListener('load', () => {
    const loader = document.getElementById('preloader');
    loader.style.display = 'none'; // hides the preloader when page is fully loaded
});
