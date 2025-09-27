


// JavaScript for interactive elements
        document.addEventListener('DOMContentLoaded', function() {
            // Book data and filtering variables
            let currentCategory = 'all';
            let currentSearchTerm = '';
            
            // Get DOM elements
            const booksContainer = document.getElementById('booksContainer');
            const categoryLinks = document.querySelectorAll('.category-link');
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');
            const bookCards = document.querySelectorAll('.book-card');
            
            // Add animation to download buttons
            const downloadButtons = document.querySelectorAll('.download-btn');
            
            downloadButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Animation effect
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
                    this.style.opacity = '0.8';
                    
                    // Simulate download process
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                        this.style.background = 'var(--success)';
                        
                        // Reset after 2 seconds
                        setTimeout(() => {
                            this.innerHTML = originalText;
                            this.style.background = '';
                            this.style.opacity = '1';
                        }, 2000);
                    }, 1500);
                });
            });
            
            // Category filter functionality
            categoryLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Update active category
                    categoryLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Get the category to filter by
                    currentCategory = this.getAttribute('data-category');
                    
                    // Filter books
                    filterBooks();
                });
            });
            
            // Search functionality
            searchButton.addEventListener('click', function() {
                currentSearchTerm = searchInput.value.trim().toLowerCase();
                filterBooks();
            });
            
            // Real-time search as user types
            searchInput.addEventListener('keyup', function() {
                currentSearchTerm = this.value.trim().toLowerCase();
                filterBooks();
            });
            
            // Filter books based on category and search term
            function filterBooks() {
                let hasVisibleBooks = false;
                
                bookCards.forEach(card => {
                    const categories = card.getAttribute('data-categories');
                    const title = card.getAttribute('data-title');
                    const author = card.getAttribute('data-author');
                    
                    // Check if book matches current category
                    const categoryMatch = currentCategory === 'all' || categories.includes(currentCategory);
                    
                    // Check if book matches search term
                    const searchMatch = currentSearchTerm === '' || 
                                      title.includes(currentSearchTerm) || 
                                      author.includes(currentSearchTerm);
                    
                    // Show or hide book based on filters
                    if (categoryMatch && searchMatch) {
                        card.style.display = 'flex';
                        hasVisibleBooks = true;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Show no results message if no books match
                let noResults = document.querySelector('.no-results');
                if (!hasVisibleBooks) {
                    if (!noResults) {
                        noResults = document.createElement('div');
                        noResults.className = 'no-results';
                        noResults.innerHTML = `
                            <i class="fas fa-search"></i>
                            <p>No books found matching your criteria</p>
                        `;
                        booksContainer.appendChild(noResults);
                    }
                } else if (noResults) {
                    noResults.remove();
                }
            }
            
            // Newsletter form handling
            const newsletterForm = document.querySelector('.newsletter');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const emailInput = this.querySelector('input');
                    if (emailInput.value.trim() !== '') {
                        alert(`Thank you for subscribing with: ${emailInput.value}`);
                        emailInput.value = '';
                    }
                });
            }
            
            // Simulate loading animation for book cards
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            bookCards.forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
        });


const form = document.querySelector('form');
    const resultDiv = document.querySelector('.result');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const word = form.elements[0].value.trim();
      if (word) {
        getWordInfo(word);
      } else {
        resultDiv.innerHTML = `<p>Please enter a word!</p>`;
      }
    });

    const getWordInfo = async (word) => {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        resultDiv.innerHTML = `
          <h2>Word: ${data[0].word}</h2>
          <p><strong>Part of Speech:</strong> ${data[0].meanings[0].partOfSpeech}</p>
          <p><strong>Meaning:</strong> ${data[0].meanings[0].definitions[0].definition}</p>
          <p><strong>Example:</strong> ${data[0].meanings[0].definitions[0].example || "No example available."}</p>
          <a href="${data[0].sourceUrls}" target="_blank" class="btn-readmore">Read More</a>
        `;
      }
      catch(error) {
        resultDiv.innerHTML = `<p>Sorry, the word "<strong>${word}</strong>" was not found.</p>`;
      }
    }
   