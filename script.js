// Function to load markdown content
async function loadMarkdownContent(section) {
    try {
        let markdownText = '';

        // Special handling for different sections
        if (section === 'faq') {
            // Dynamically load all FAQ files and concatenate them
            markdownText = await loadAllFAQFiles();
        } else if (section.startsWith('faq') && section !== 'faq') {
            // Handle individual FAQ sections (faq1, faq2, faq3, etc.)
            const response = await fetch(`content/${section}.md`);
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
        if (section.startsWith('faq')) {
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

// Function to dynamically load all FAQ files
async function loadAllFAQFiles() {
    let markdownText = '';
    let faqIndex = 1;
    let hasMoreFAQs = true;

    while (hasMoreFAQs) {
        try {
            const response = await fetch(`content/faq${faqIndex}.md`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();

            if (faqIndex === 1) {
                // First FAQ file, include the header
                markdownText = text;
            } else {
                // Subsequent FAQ files, remove the header to avoid duplicates
                markdownText = markdownText + '\n\n' + removeHeaderFromMarkdown(text);
            }

            faqIndex++;
        } catch (error) {
            // If we get an error (likely 404 for non-existent file), stop the loop
            hasMoreFAQs = false;
        }
    }

    // If no individual FAQ files were found, try loading the original faq.md
    if (faqIndex === 1) {
        try {
            const response = await fetch('content/faq.md');
            if (response.ok) {
                markdownText = await response.text();
            }
        } catch (error) {
            // If faq.md doesn't exist either, return empty string
        }
    }

    return markdownText;
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


// Helper function to remove header from markdown text (to avoid duplicate headers when concatenating)
function removeHeaderFromMarkdown(text) {
    // Remove the first line if it starts with # (header)
    return text.replace(/^#[^\n]*\n/, '');
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
            // Check if this is a section link (like decision_table or testing_for_auditors) that should load a new page
            if (targetId === 'decision_table') {
                loadMarkdownContent('decision_table');
            } else if (targetId === 'testing_for_auditors') {
                loadMarkdownContent('testing_for_auditors');
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

    // Search in all regular markdown files
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

    // If not found in regular sections, search in FAQ files
    if (!found) {
        found = await searchInFAQFiles(searchTerm);
    }

    if (!found) {
        alert(`"${searchTerm}"에 대한 검색 결과가 없습니다.`);
    }
}

// Function to search in all FAQ files
async function searchInFAQFiles(searchTerm) {
    let faqIndex = 1;
    let hasMoreFAQs = true;

    while (hasMoreFAQs) {
        try {
            const response = await fetch(`content/faq${faqIndex}.md`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();

            if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
                // Load the specific FAQ file where the term was found
                await loadMarkdownContent(`faq${faqIndex}`);

                // Highlight the search term after content loads
                setTimeout(() => highlightText(searchTerm), 100);

                return true;
            }

            faqIndex++;
        } catch (error) {
            // If we get an error (likely 404 for non-existent file), stop the loop
            hasMoreFAQs = false;
        }
    }

    return false;
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