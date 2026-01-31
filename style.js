// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Form submission handler with Formspree integration
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Disable button and show loading
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    formMessage.innerHTML = '';
    formMessage.style.display = 'none';
    
    try {
      const formData = new FormData(this);
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        formMessage.innerHTML = '<div style="color: #00bcd4; padding: 10px; background: #1a1a1a; border-radius: 5px; margin-bottom: 15px;">✓ Thank you! Your message has been sent. I\'ll get back to you soon.</div>';
        formMessage.style.display = 'block';
        this.reset();
      } else {
        const data = await response.json();
        if (data.errors) {
          formMessage.innerHTML = `<div style="color: #ff6b6b; padding: 10px; background: #1a1a1a; border-radius: 5px; margin-bottom: 15px;">Error: ${data.errors.map(error => error.message).join(', ')}</div>`;
        } else {
          formMessage.innerHTML = '<div style="color: #ff6b6b; padding: 10px; background: #1a1a1a; border-radius: 5px; margin-bottom: 15px;">Oops! There was an error. Please try again.</div>';
        }
        formMessage.style.display = 'block';
      }
    } catch (error) {
      formMessage.innerHTML = '<div style="color: #ff6b6b; padding: 10px; background: #1a1a1a; border-radius: 5px; margin-bottom: 15px;">Network error. Please check your connection and try again.</div>';
      formMessage.style.display = 'block';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

