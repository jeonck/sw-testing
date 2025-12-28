// Function to load markdown content
async function loadMarkdownContent(section) {
    try {
        let markdownText = '';

        // Special handling for different sections
        if (section === 'faq') {
            // Load single FAQ file
            const response = await fetch('content/faq.md');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            markdownText = await response.text();
        } else {
            // Load single file for other sections
            const response = await fetch(`content/${section}.md`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            markdownText = await response.text();
        }

        const htmlContent = marked.parse(markdownText);
        document.getElementById('content-container').innerHTML = `<div class="markdown-content">${htmlContent}</div>`;

        // Render Mermaid diagrams if they exist
        setTimeout(() => {
            if (typeof mermaid !== 'undefined') {
                mermaid.init(undefined, '.mermaid, [class*="mermaid"]');
            }

            // Add target="_blank" to all links in the content after Mermaid renders
            addBlankTargetToContentLinks();
        }, 100);

        // Add separators to FAQ headings if this is the FAQ section
        if (section === 'faq') {
            addSeparatorsToFaq();
        }

        // Update active nav link
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`.nav-link[data-section="${section}"]`)?.classList.add('active');
    } catch (error) {
        console.error('Error loading markdown content:', error);
        document.getElementById('content-container').innerHTML = `<p>콘텐츠를 불러오는 중 오류가 발생했습니다: ${error.message}</p>`;
    }
}

// Function to add separators between FAQ items
function addSeparatorsToFaq() {
    const contentContainer = document.querySelector('.markdown-content');
    if (!contentContainer) return;

    // Get all h2 elements (FAQ questions)
    const h2Elements = contentContainer.querySelectorAll('h2');

    // Add a separator div before each H2 element (except the first one)
    h2Elements.forEach((h2, index) => {
        // Add a separator div before each H2 except the first one
        if (index > 0) {
            const separator = document.createElement('div');
            separator.className = 'faq-separator';
            // Insert the separator right before the H2
            h2.parentNode.insertBefore(separator, h2);
        }
    });
}


// Function to add target="_blank" to all links in content
function addBlankTargetToContentLinks() {
    const contentContainer = document.querySelector('#content-container');
    if (!contentContainer) return;

    const links = contentContainer.querySelectorAll('a');
    links.forEach(link => {
        // Add target="_blank" to all links in the content
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}


// Handle navigation links for different sections
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const section = this.getAttribute('data-section');

        // Load the markdown content
        loadMarkdownContent(section);
    });
});

// Handle internal anchors within the same page
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#') && !e.target.classList.contains('nav-link')) {
            e.preventDefault();
            const targetId = href.substring(1);
            // Check if this is a section link (like decision_table) that should load a new page
            if (targetId === 'decision_table') {
                loadMarkdownContent('decision_table');
            } else {
                // Handle as internal anchor link
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }
});

// Function to perform search
async function performSearch(searchTerm) {
    if (!searchTerm) {
        alert('검색어를 입력해주세요.');
        return;
    }

    // Search in all markdown files
    const sections = ['introduction', 'sdlc', 'static', 'dynamic', 'management', 'tools', 'resources', 'faq'];
    let found = false;

    for (const section of sections) {
        try {
            const response = await fetch(`content/${section}.md`);
            if (!response.ok) continue;

            const content = await response.text();

            if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
                // Load the section where the term was found
                await loadMarkdownContent(section);

                // Highlight the search term after content loads
                setTimeout(() => highlightText(searchTerm), 100);

                found = true;
                break;
            }
        } catch (error) {
            console.error(`Error searching in ${section}:`, error);
        }
    }

    if (!found) {
        alert(`"${searchTerm}"에 대한 검색 결과가 없습니다.`);
    }
}

// Add search functionality
document.addEventListener('DOMContentLoaded', async function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Load the default section (introduction) when page loads
    await loadMarkdownContent('introduction');

    // Event listeners for search
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value.trim());
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value.trim());
        }
    });
});

// Function to highlight search terms in the content
function highlightText(searchTerm) {
    if (!searchTerm) return;

    // Remove previous highlights
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentElement;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });

    // Find and highlight new matches in the content container
    const contentContainer = document.getElementById('content-container');
    highlightInElement(contentContainer, searchTerm);
}

// Helper function to highlight text in an element
function highlightInElement(element, searchTerm) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                return node.nodeValue.toLowerCase().includes(searchTerm.toLowerCase()) && 
                       !node.parentElement.classList.contains('highlight') ?
                    NodeFilter.FILTER_ACCEPT : 
                    NodeFilter.FILTER_REJECT;
            }
        }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    textNodes.forEach(textNode => {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = textNode.nodeValue.split(regex);
        
        if (parts.length > 1) {
            const fragment = document.createDocumentFragment();
            
            parts.forEach(part => {
                if (part.toLowerCase() === searchTerm.toLowerCase()) {
                    const highlightSpan = document.createElement('span');
                    highlightSpan.className = 'highlight';
                    highlightSpan.textContent = part;
                    fragment.appendChild(highlightSpan);
                } else {
                    fragment.appendChild(document.createTextNode(part));
                }
            });
            
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    });
}