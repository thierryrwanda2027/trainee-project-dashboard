/**
 * Niyonkuru Thierry - Portfolio Main JavaScript
 * Handles Theme Toggling, Smooth Scrolling, Project Filtering, Form Validation, and AI Toast Recommendations.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Theme Toggle (Dark/Light Mode)
       ========================================================================== */
    const themeBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const iconSun = document.querySelector('.icon-sun');
    const iconMoon = document.querySelector('.icon-moon');

    // Check local storage for theme preference, default is dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            iconSun.style.display = 'block';
            iconMoon.style.display = 'none';
        } else {
            iconSun.style.display = 'none';
            iconMoon.style.display = 'block';
        }
    }

    /* ==========================================================================
       2. Mobile Navigation Toggle
       ========================================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('open');
        mainNav.classList.toggle('nav-open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(mainNav.classList.contains('nav-open')) {
                mobileMenuBtn.classList.remove('open');
                mainNav.classList.remove('nav-open');
            }
        });
    });

    /* ==========================================================================
       3. Smooth Scrolling & Active State Update
       ========================================================================== */
    // Smooth scrolling is handled by CSS scroll-behavior: smooth, 
    // but we need JS to update the active link on scroll
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
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

    /* ==========================================================================
       4. Project Filtering
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    // Optional: Add a subtle fade-in animation
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       5. Contact Form Validation (Client-Side)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic Validation Check
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill out all fields.';
                formStatus.className = 'form-status error';
                return;
            }

            // Simulate form submission (e.g., via EmailJS or custom backend later)
            formStatus.textContent = 'Sending message...';
            formStatus.className = 'form-status';

            setTimeout(() => {
                formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 1500);
        });
    }

    /* ==========================================================================
       6. Bonus AI Feature: Skill Recommendation Toast
       ========================================================================== */
    const skillPills = document.querySelectorAll('.skill-pill');
    const toastContainer = document.getElementById('ai-toast');
    const toastMessage = document.getElementById('toast-message');
    const toastLink = document.getElementById('toast-link');
    const toastClose = document.querySelector('.toast-close');

    // Mock Data representing an AI mapping between Skills and Content
    const aiRecommendations = {
        'cybersecurity': {
            msg: "AI Match: Since you're interested in Cybersecurity, check out my thoughts on securing IoT devices in mechanical systems.",
            linkText: "Read Blog Post",
            url: "blog.html#cyber-iot"
        },
        'forex': {
            msg: "AI Match: Interest in Forex detected. See my custom Dashboard project built with JS and public market APIs.",
            linkText: "View Project",
            url: "#projects"
        },
        'maintenance': {
            msg: "AI Match: Mechanical Maintenance is my strong suit. See my final year project on pedal-powered water pumps.",
            linkText: "View Project",
            url: "#projects"
        },
        'german': {
            msg: "AI Match: Sprechen Sie Deutsch? Check out my bilingual technical documentation on GitHub.",
            linkText: "View GitHub",
            url: "#"
        },
        'default': {
            msg: "AI Match: That's a great skill! Check out my overall project portfolio to see how I apply it.",
            linkText: "View Portfolio",
            url: "#projects"
        }
    };

    let toastTimeout;

    function showToast(skillId) {
        // Clear existing timeout if a new toast is triggered quickly
        if(toastTimeout) clearTimeout(toastTimeout);

        const rec = aiRecommendations[skillId] || aiRecommendations['default'];
        
        toastMessage.textContent = rec.msg;
        toastLink.textContent = rec.linkText;
        toastLink.href = rec.url;

        // Ensure class doesn't have hidden, add visible state logic
        toastContainer.classList.remove('hidden');

        // Auto hide after 8 seconds
        toastTimeout = setTimeout(() => {
            toastContainer.classList.add('hidden');
        }, 8000);
    }

    // Attach click listeners to all skill pills
    skillPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const skillId = e.target.getAttribute('data-skill');
            
            // Add visual feedback to clicked pill
            skillPills.forEach(p => p.style.backgroundColor = ''); // Reset others
            e.target.style.backgroundColor = 'rgba(14, 165, 233, 0.2)'; // Highlight current
            
            showToast(skillId);
        });
    });

    // Close toast manually
    toastClose.addEventListener('click', () => {
        toastContainer.classList.add('hidden');
        if(toastTimeout) clearTimeout(toastTimeout);
    });

});

/* ==========================================================================
   7. Project Modal Logic
   ========================================================================== */

const projectData = {
    project1: {
        title: "Pedal Powered Water Pump",
        img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&h=400&fit=crop",
        tags: ['<span class="tag">Mechanical Design</span>', '<span class="tag">AutoCAD</span>'],
        desc: "Design and construction of a sustainable, pedal-powered water pump for my mechanical engineering final year project. This project leverages human energy efficiently to pump water from lower elevations to agricultural fields in rural settings without access to electricity.",
        liveLink: "#",
        githubLink: "#"
    },
    project2: {
        title: "East Africa Youth Hope Project",
        img: "https://images.unsplash.com/photo-1593113565694-c6f8716c0296?w=800&h=400&fit=crop",
        tags: ['<span class="tag">Leadership</span>', '<span class="tag">Community</span>'],
        desc: "As the founder of this organization, I lead initiatives to provide resources, mentorship, and tech education to youth across the region. We focus on bridging the digital divide and inspiring the next generation of engineers and leaders.",
        liveLink: "#",
        githubLink: "#"
    },
    project3: {
        title: "Crypto/Forex Dashboard",
        img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
        tags: ['<span class="tag">JavaScript</span>', '<span class="tag">REST APIs</span>'],
        desc: "A custom web dashboard that aggregates financial market data utilizing public APIs. Built entirely with vanilla JavaScript, HTML, and CSS, it features real-time price updates, moving average calculations, and light/dark theme support.",
        liveLink: "#",
        githubLink: "#"
    }
};

window.openModal = function(projectId) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const data = projectData[projectId];
    if (!data) return;

    document.getElementById('modal-img').src = data.img;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-tags').innerHTML = data.tags.join('');
    document.getElementById('modal-desc').textContent = data.desc;
    document.getElementById('modal-live-link').href = data.liveLink;
    document.getElementById('modal-github-link').href = data.githubLink;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.modal-close');

    if (modal && closeBtn) {
        // Close modal via button
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore background scrolling
        });

        // Close modal by clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }
});
