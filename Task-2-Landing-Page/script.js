// 1 & 2. Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
});

// 3. CTA Alert
const ctaButton = document.getElementById('cta-button');

if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        alert('Thank you for exploring NovaFlow! This is a demonstration landing page.');
    });
}

// 4. Active Navigation Highlighting on Scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Trigger slightly before reaching the section
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});
