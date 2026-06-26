document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-input');
    const autocomplete = document.getElementById('terminal-autocomplete');
    const output = document.getElementById('terminal-output');
    const terminalBox = document.querySelector('.interactive-terminal');

    const commands = {
        '--help': `Available commands:\n  --status\n  --version\n  --git-blame\n  --pip-install-perfection\n  --sudo-rm-problems\n  --run-weekend-prototype\n  --white-rabbit`,
        '--status': `> Currently breaking local code, optimizing real-time loops, and building things that shouldn't work, but do.`,
        '--version': `v2.0.26-nightly (Experimental Patch)\n\n<span style="color: #ff5f56;">[🛑 ERROR]</span> thermal_throttling: Local GPU hit 69°C while running LLMs models locally for no reason.\n<span style="color: #ffbd2e;">[⚠️ WARNING]</span> hates to do repetitive tasks.\n<span style="color: #27c93f;">[💡 STATUS]</span> system running purely on curiosity and a stubborn refusal to give up.`,
        '--git-blame': `> Locating the absolute disaster who broke the prod pipeline.\n<span style="color: #ff5f56;">[🛑 ERROR]</span> identity_crisis: The git history confirms I am the one who wrote this terrible code 3 hours ago.\n<span style="color: #ffbd2e;">[⚠️ WARNING]</span> do not judge my past self, I was operating on 2% brain capacity.\n<span style="color: #27c93f;">[💡 STATUS]</span> system rewriting the entire script from scratch because pride is deprecated.`,
        '--pip-install-perfection': `> Collecting perfection...\n<span style="color: #ff5f56;">[🛑 ERROR]</span> HTTP_404_Not_Found: Could not find a version that satisfies the requirement 'perfection'.\n<span style="color: #ffbd2e;">[⚠️ WARNING]</span> this developer profile operates entirely on trial, error, and messy prototypes.\n<span style="color: #27c93f;">[💡 STATUS]</span> system successfully installed 'aggressive_learning' and 'raw_curiosity' instead.`,
        '--sudo-rm-problems': `> Executing global cleanup engine...\n<span style="color: #ff5f56;">[🛑 ERROR]</span> permission_denied: You cannot delete problems without reading the documentation first.\n<span style="color: #ffbd2e;">[⚠️ WARNING]</span> running away from a broken loop will not fix the sub-100ms latency target.\n<span style="color: #27c93f;">[💡 STATUS]</span> system swallowing its pride and debugging line by line.`,
        '--run-weekend-prototype': `> Spinning up a chaotic project just to see if it works.\n<span style="color: #ff5f56;">[🛑 ERROR]</span> import_error: Cannot find module 'patience'. It was never installed.\n<span style="color: #ffbd2e;">[⚠️ WARNING]</span> highly likely to drop this build midway if a cooler idea pops into my head.\n<span style="color: #27c93f;">[💡 STATUS]</span> system breaking code intentionally because a green terminal is boring anyway.`,
        '--white-rabbit': `> Follow the white rabbit... Wake up, Adarsh.\n<span style="color: #27c93f;">[💡 STATUS]</span> system overriding reality...`
    };

    const commandKeys = Object.keys(commands);
    let selectedIndex = 0;
    let isTyping = false;
    let typeWriterTimeout = null;

    // Focus input automatically if clicking anywhere on the terminal box
    terminalBox.addEventListener('click', () => {
        input.focus();
    });

    // Terminal Window Buttons Logic
    const btnClose = document.getElementById('term-btn-close');
    const btnMax = document.getElementById('term-btn-max');
    const termBubble = document.getElementById('terminal-bubble');
    const heroHeading = document.querySelector('h1.site-heading');

    let isMaximized = false;

    if (btnClose && termBubble) {
        btnClose.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent terminal click focus
            
            // Revert maximized state if active
            if (isMaximized) {
                isMaximized = false;
                terminalBox.style.maxWidth = '1000px';
                terminalBox.style.maxHeight = '';
                terminalBox.style.height = '';
                heroHeading.style.display = 'block';
                btnMax.classList.remove('is-maximized');
            }
            
            terminalBox.style.display = 'none';
            termBubble.style.display = 'flex';
        });

        termBubble.addEventListener('click', () => {
            terminalBox.style.display = 'inline-block';
            termBubble.style.display = 'none';
            input.focus();
        });
    }

    if (btnMax && heroHeading) {
        btnMax.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent terminal click focus
            isMaximized = !isMaximized;
            if (isMaximized) {
                // Enlarge terminal and hide text
                terminalBox.style.maxWidth = '100%';
                terminalBox.style.maxHeight = '90vh';
                terminalBox.style.height = '90vh';
                heroHeading.style.display = 'none';
                btnMax.classList.add('is-maximized');
            } else {
                // Revert
                terminalBox.style.maxWidth = '1000px';
                terminalBox.style.maxHeight = '';
                terminalBox.style.height = '';
                heroHeading.style.display = 'block';
                btnMax.classList.remove('is-maximized');
            }
        });
    }

    function renderAutocomplete() {
        const val = input.value.toLowerCase();
        
        // Match starting with the value, or containing it
        let matches = commandKeys.filter(cmd => cmd.toLowerCase().includes(val));
        
        // If empty, show all
        if (!val) {
            matches = commandKeys;
        }

        autocomplete.innerHTML = '';
        
        if (matches.length > 0) {
            autocomplete.style.display = 'block';
            
            // Fix bounds for selectedIndex
            if (selectedIndex >= matches.length) selectedIndex = matches.length - 1;
            if (selectedIndex < 0) selectedIndex = 0;

            matches.forEach((cmd, index) => {
                const li = document.createElement('li');
                li.textContent = cmd;
                if (index === selectedIndex) {
                    li.classList.add('active');
                }
                li.addEventListener('click', () => {
                    input.value = cmd;
                    autocomplete.style.display = 'none';
                    executeCommand(cmd);
                });
                autocomplete.appendChild(li);
            });
        } else {
            autocomplete.style.display = 'none';
        }
    }

    function typeWriter(element, htmlContent, speed, callback) {
        element.innerHTML = '';
        let i = 0;
        let isTag = false;
        let text = '';
        
        // Clear any ongoing typing
        if (typeWriterTimeout) clearTimeout(typeWriterTimeout);

        function type() {
            if (i < htmlContent.length) {
                let char = htmlContent.charAt(i);
                
                if (char === '<') {
                    isTag = true;
                }
                
                text += char;
                element.innerHTML = text;
                
                if (char === '>') {
                    isTag = false;
                }
                
                i++;
                if (isTag) {
                    type(); // Skip delay for HTML tags
                } else {
                    typeWriterTimeout = setTimeout(type, speed);
                }
            } else if (callback) {
                callback();
            }
        }
        
        isTyping = true;
        type();
    }

    function executeCommand(cmd) {
        autocomplete.style.display = 'none';
        let response = commands[cmd];
        if (!response) {
            response = `<span style="color: #ff5f56;">[🛑 ERROR]</span> Command not found: ${cmd}\nType --help to see available commands.`;
        }
        
        // Fast char-by-char speed (10ms)
        typeWriter(output, response, 10, () => {
            isTyping = false;
            if (cmd === '--white-rabbit' && typeof window.toggleMatrixTheme === 'function') {
                window.toggleMatrixTheme();
            }
        });
    }

    input.addEventListener('input', () => {
        selectedIndex = 0; // Reset selection when typing
        renderAutocomplete();
    });

    input.addEventListener('keydown', (e) => {
        const lis = autocomplete.querySelectorAll('li');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (lis.length > 0) {
                selectedIndex = (selectedIndex + 1) % lis.length;
                renderAutocomplete();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (lis.length > 0) {
                selectedIndex = (selectedIndex - 1 + lis.length) % lis.length;
                renderAutocomplete();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (autocomplete.style.display === 'block' && lis.length > 0) {
                // Pick the selected from autocomplete
                const selectedCmd = lis[selectedIndex].textContent;
                input.value = selectedCmd;
                executeCommand(selectedCmd);
            } else {
                // Execute whatever is written
                executeCommand(input.value);
            }
        } else if (e.key === 'Backspace') {
            // If they are clearing a command to type a new one, stop typewriter
            if (isTyping) {
                clearTimeout(typeWriterTimeout);
                isTyping = false;
            }
        }
    });

    // Initial State: --help pre-filled, input focused, dropdown visible
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    renderAutocomplete();
});
