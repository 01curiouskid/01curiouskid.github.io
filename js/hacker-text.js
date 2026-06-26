document.addEventListener('DOMContentLoaded', () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]";

    // Attach to only the top navigation bar links
    document.querySelectorAll(".site-navbar .navbar-nav > li > a").forEach(element => {
        
        // Store original text nodes once so we don't lose them
        const textNodes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue.trim() !== '') {
                textNodes.push({
                    node: node,
                    originalText: node.nodeValue
                });
            }
        }

        element.addEventListener("mouseover", event => {
            // Lock width and disable transition to prevent shaking other navbar items
            if (!element.dataset.interval) {
                const rect = element.getBoundingClientRect();
                element.style.transition = 'none';
                element.style.width = `${rect.width}px`;
                element.style.whiteSpace = 'nowrap';
            }

            let iterations = 0;
            
            if (element.dataset.interval) {
                clearInterval(element.dataset.interval);
            }

            element.dataset.interval = setInterval(() => {
                textNodes.forEach(item => {
                    item.node.nodeValue = item.originalText.split("").map((letter, index) => {
                        if(index < iterations) {
                            return item.originalText[index];
                        }
                        // Don't scramble spaces
                        if(item.originalText[index] === ' ') return ' ';
                        
                        return letters[Math.floor(Math.random() * letters.length)];
                    }).join("");
                });
                
                const maxLength = Math.max(...textNodes.map(i => i.originalText.length));
                
                if(iterations >= maxLength){ 
                    clearInterval(element.dataset.interval);
                    element.dataset.interval = '';
                    
                    // Ensure perfectly restored text at the end
                    textNodes.forEach(item => {
                        item.node.nodeValue = item.originalText;
                    });

                    // Restore original styles
                    element.style.transition = '';
                    element.style.width = '';
                    element.style.whiteSpace = '';
                }
                
                iterations += 1 / 6; 
            }, 30);
        });
    });
});
