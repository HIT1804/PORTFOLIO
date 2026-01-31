// Smooth scroll navigation for all anchor links
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navUl = document.querySelector('nav ul');
  const navLinksList = document.querySelectorAll('nav ul li a');

  if (menuToggle && navUl) {
    menuToggle.addEventListener('click', () => {
      navUl.classList.toggle('nav-active');
      
      // Icon animation (optional - Toggle between bars and times)
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (navUl.classList.contains('nav-active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when link is clicked
    navLinksList.forEach(link => {
      link.addEventListener('click', () => {
        navUl.classList.remove('nav-active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
  // Get all navigation links
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const homeButtons = document.querySelectorAll('.buttons a[href^="#"]');
  const logo = document.querySelector('.logo');
  
  // Function to smoothly scroll to a section
  function smoothScrollTo(target) {
    const targetElement = document.querySelector(target);
    if (targetElement) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      // Use smooth scroll with better browser support
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Fallback for older browsers
      if (!('scrollBehavior' in document.documentElement.style)) {
        smoothScrollFallback(targetPosition);
      }
    }
  }
  
  // Fallback smooth scroll for older browsers
  function smoothScrollFallback(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
  }
  
  // Add click event to logo to scroll to home
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      smoothScrollTo('#home');
    });
  }
  
  // Add click event listeners to all navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        smoothScrollTo(targetId);
      }
    });
  });
  
  // Add click event listeners to home section buttons
  homeButtons.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        smoothScrollTo(targetId);
      }
    });
  });
  
  // Prevent default scroll behavior for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && href.length > 1) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    });
  });
  
  // Add active state to navigation links on scroll
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavigation() {
    const scrollY = window.pageYOffset || window.scrollY;
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerHeight - 150;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
    
    // Handle home section
    if (scrollY < 100) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
          link.classList.add('active');
        }
      });
    }
  }
  
  window.addEventListener('scroll', highlightNavigation);
  highlightNavigation(); // Call once on load

  // Resume File Upload Functionality
  const resumeUploadArea = document.getElementById('resumeUploadArea');
  const resumeFileInput = document.getElementById('resumeFileInput');
  const resumeDisplay = document.getElementById('resumeDisplay');
  const resumeEmbed = document.getElementById('resumeEmbed');
  const resumeFileName = document.getElementById('resumeFileName');
  const resumeDownloadLink = document.getElementById('resumeDownloadLink');
  const resumeViewLink = document.getElementById('resumeViewLink');
  const resumeRemoveBtn = document.getElementById('resumeRemoveBtn');

  // Check if resume is already stored in localStorage
  const storedResume = localStorage.getItem('resumeFile');
  if (storedResume) {
    const resumeData = JSON.parse(storedResume);
    displayResume(resumeData.name, resumeData.url, resumeData.type);
  }

  // Click on upload area to trigger file input
  if (resumeUploadArea && resumeFileInput) {
    resumeUploadArea.addEventListener('click', () => {
      resumeFileInput.click();
    });

    // Drag and drop functionality
    resumeUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      resumeUploadArea.style.borderColor = '#00bcd4';
      resumeUploadArea.style.background = 'rgba(0, 188, 212, 0.15)';
    });

    resumeUploadArea.addEventListener('dragleave', () => {
      resumeUploadArea.style.borderColor = 'rgba(0, 188, 212, 0.5)';
      resumeUploadArea.style.background = 'rgba(0, 188, 212, 0.05)';
    });

    resumeUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      resumeUploadArea.style.borderColor = 'rgba(0, 188, 212, 0.5)';
      resumeUploadArea.style.background = 'rgba(0, 188, 212, 0.05)';
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    });

    // File input change
    resumeFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }

  function handleFileUpload(file) {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      alert('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB.');
      return;
    }

    // Create object URL for the file
    const fileURL = URL.createObjectURL(file);
    
    // Store file info in localStorage
    const resumeData = {
      name: file.name,
      url: fileURL,
      type: file.type
    };
    localStorage.setItem('resumeFile', JSON.stringify(resumeData));

    // Display the resume
    displayResume(file.name, fileURL, file.type);
  }

  function displayResume(fileName, fileURL, fileType) {
    // Hide upload area
    if (resumeUploadArea) {
      resumeUploadArea.style.display = 'none';
    }

    // Show display area
    if (resumeDisplay) {
      resumeDisplay.style.display = 'block';
    }

    // Update file name
    if (resumeFileName) {
      resumeFileName.textContent = fileName;
    }

    // Set download link
    if (resumeDownloadLink) {
      resumeDownloadLink.href = fileURL;
      resumeDownloadLink.download = fileName;
    }

    // Set view link
    if (resumeViewLink) {
      resumeViewLink.href = fileURL;
    }

    // Show PDF embed if it's a PDF
    if (fileType === 'application/pdf' && resumeEmbed) {
      resumeEmbed.style.display = 'block';
      const iframe = document.getElementById('resumeIframe');
      if (iframe) {
        iframe.src = fileURL;
      }
    } else if (resumeEmbed) {
      resumeEmbed.style.display = 'none';
    }
  }

  // Remove resume
  if (resumeRemoveBtn) {
    resumeRemoveBtn.addEventListener('click', () => {
      // Clear localStorage
      localStorage.removeItem('resumeFile');
      
      // Hide display and embed
      if (resumeDisplay) {
        resumeDisplay.style.display = 'none';
      }
      if (resumeEmbed) {
        resumeEmbed.style.display = 'none';
      }
      
      // Show upload area
      if (resumeUploadArea) {
        resumeUploadArea.style.display = 'block';
      }
      
      // Clear file input
      if (resumeFileInput) {
        resumeFileInput.value = '';
      }
    });
  }
});
