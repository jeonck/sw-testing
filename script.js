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
    // Check if clicked element is a practice card or inside a practice card
    const practiceCard = e.target.closest('.practice-card');
    if (practiceCard && practiceCard.hasAttribute('data-page')) {
        e.preventDefault();
        const pageName = practiceCard.getAttribute('data-page');
        loadMarkdownContent(pageName);
        return;
    }

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
            } else if (targetId === 'static-practice' || targetId === 'blackbox-practice' || targetId === 'defect-practice' || targetId === 'nonfunctional-practice' || targetId === 'process-practice') {
                // Load the testing practice section when clicking on internal links
                loadMarkdownContent('testing_practice');
            } else if (targetId === 'log-analysis' || targetId === 'exploratory-testing' || targetId === 'mobile-web' || targetId === 'retest-regression' || targetId === 'test-data') {
                // Load the testing execution section when clicking on internal links
                loadMarkdownContent('testing_execution');
            } else if (targetId === 'chrome_devtools_guide') {
                // Load the chrome devtools guide when clicking on internal link
                loadMarkdownContent('chrome_devtools_guide');
            } else if (targetId === 'mobile_testing_guide') {
                // Load the mobile testing guide when clicking on internal link
                loadMarkdownContent('mobile_testing_guide');
            } else if (targetId === 'server_log_analysis') {
                // Load the server log analysis guide when clicking on internal link
                loadMarkdownContent('server_log_analysis');
            } else if (targetId === 'monkey_vs_exploratory') {
                // Load the monkey vs exploratory guide when clicking on internal link
                loadMarkdownContent('monkey_vs_exploratory');
            } else if (targetId === 'test_charter_guide') {
                // Load the test charter guide when clicking on internal link
                loadMarkdownContent('test_charter_guide');
            } else if (targetId === 'heuristic_techniques') {
                // Load the heuristic techniques guide when clicking on internal link
                loadMarkdownContent('heuristic_techniques');
            } else if (targetId === 'android_vs_ios') {
                // Load the android vs ios guide when clicking on internal link
                loadMarkdownContent('android_vs_ios');
            } else if (targetId === 'network_throttling_guide') {
                // Load the network throttling guide when clicking on internal link
                loadMarkdownContent('network_throttling_guide');
            } else if (targetId === 'dark_mode_orientation_guide') {
                // Load the dark mode and orientation guide when clicking on internal link
                loadMarkdownContent('dark_mode_orientation_guide');
            } else if (targetId === 'regression_test_impact_analysis') {
                // Load the regression test impact analysis guide when clicking on internal link
                loadMarkdownContent('regression_test_impact_analysis');
            } else if (targetId === 'confirmation_vs_regression_strategy') {
                // Load the confirmation vs regression strategy guide when clicking on internal link
                loadMarkdownContent('confirmation_vs_regression_strategy');
            } else if (targetId === 'hotfix_smoke_test_guide') {
                // Load the hotfix smoke test guide when clicking on internal link
                loadMarkdownContent('hotfix_smoke_test_guide');
            } else if (targetId === 'sql_basics_for_testers') {
                // Load the SQL basics for testers guide when clicking on internal link
                loadMarkdownContent('sql_basics_for_testers');
            } else if (targetId === 'bulk_data_testing') {
                // Load the bulk data testing guide when clicking on internal link
                loadMarkdownContent('bulk_data_testing');
            } else if (targetId === 'api_testing_postman') {
                // Load the API testing with Postman guide when clicking on internal link
                loadMarkdownContent('api_testing_postman');
            } else if (targetId === 'document-review' || targetId === 'requirements-review' || targetId === 'design-review' || targetId === 'code-review' || targetId === 'static-tips' || targetId === 'static-case') {
                // Load the static testing practice section when clicking on internal links
                loadMarkdownContent('testing_practice_static');
            } else if (targetId === 'boundary-analysis' || targetId === 'equivalence-partitioning' || targetId === 'blackbox-tips' || targetId === 'blackbox-case') {
                // Load the blackbox testing practice section when clicking on internal links
                loadMarkdownContent('testing_practice_blackbox');
            } else if (targetId === 'defect-report-structure' || targetId === 'communication-strategy' || targetId === 'defect-tips' || targetId === 'defect-case') {
                // Load the defect testing practice section when clicking on internal links
                loadMarkdownContent('testing_practice_defect');
            } else if (targetId === 'performance-testing' || targetId === 'security-testing' || targetId === 'nonfunctional-tips' || targetId === 'nonfunctional-case') {
                // Load the nonfunctional testing practice section when clicking on internal links
                loadMarkdownContent('testing_practice_nonfunctional');
            } else if (targetId === 'test-planning' || targetId === 'test-design' || targetId === 'test-execution' || targetId === 'process-tips' || targetId === 'process-case') {
                // Load the process testing practice section when clicking on internal links
                loadMarkdownContent('testing_practice_process');
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
    const sections = ['introduction', 'sdlc', 'static', 'dynamic', 'management', 'tools', 'testing_practice', 'testing_practice_static', 'testing_practice_blackbox', 'testing_practice_defect', 'testing_practice_nonfunctional', 'testing_practice_process', 'testing_execution', 'chrome_devtools_guide', 'mobile_testing_guide', 'server_log_analysis', 'monkey_vs_exploratory', 'test_charter_guide', 'heuristic_techniques', 'android_vs_ios', 'network_throttling_guide', 'dark_mode_orientation_guide', 'regression_test_impact_analysis', 'confirmation_vs_regression_strategy', 'hotfix_smoke_test_guide', 'sql_basics_for_testers', 'bulk_data_testing', 'api_testing_postman', 'resources', 'faq'];
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

    // If not found in FAQ files, search in testing practice files
    if (!found) {
        found = await searchInTestingPracticeFiles(searchTerm);
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

// Function to search in testing practice files
async function searchInTestingPracticeFiles(searchTerm) {
    const practiceSections = ['testing_practice_static', 'testing_practice_blackbox', 'testing_practice_defect', 'testing_practice_nonfunctional', 'testing_practice_process'];

    for (const section of practiceSections) {
        try {
            const response = await fetch(`content/${section}.md`);
            if (!response.ok) {
                continue;
            }
            const content = await response.text();

            if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
                // Load the specific testing practice file where the term was found
                await loadMarkdownContent(section);

                // Highlight the search term after content loads
                setTimeout(() => highlightText(searchTerm), 100);

                return true;
            }
        } catch (error) {
            console.error(`Error searching in ${section}:`, error);
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