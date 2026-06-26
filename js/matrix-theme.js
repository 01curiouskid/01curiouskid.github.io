document.addEventListener('DOMContentLoaded', () => {
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let inputBuffer = [];
    
    let animationFrameId = null;
    let canvas = null;
    let ctx = null;
    let drops = [];
    const fontSize = 16;
    const characters = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charArray = characters.split("");

    // Create exit button for mobile/desktop convenience
    const exitBtn = document.createElement('button');
    exitBtn.id = 'matrix-exit-btn';
    exitBtn.innerText = 'Wake Up (Exit Matrix)';
    exitBtn.style.position = 'fixed';
    exitBtn.style.bottom = '20px';
    exitBtn.style.right = '20px';
    exitBtn.style.zIndex = '9999';
    exitBtn.style.padding = '10px 15px';
    exitBtn.style.backgroundColor = '#000';
    exitBtn.style.color = '#39ff14';
    exitBtn.style.border = '1px solid #39ff14';
    exitBtn.style.borderRadius = '5px';
    exitBtn.style.fontFamily = 'monospace';
    exitBtn.style.cursor = 'pointer';
    exitBtn.style.display = 'none';
    exitBtn.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
    exitBtn.addEventListener('click', () => {
        if (typeof window.toggleMatrixTheme === 'function') {
            window.toggleMatrixTheme();
        }
    });
    document.body.appendChild(exitBtn);

    document.addEventListener('keydown', (e) => {
        // Ignore typing inside inputs/textareas
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        inputBuffer.push(e.key);
        if (inputBuffer.length > konamiCode.length) {
            inputBuffer.shift();
        }
        
        const isMatch = konamiCode.every((key, i) => {
            return key.toLowerCase() === inputBuffer[i]?.toLowerCase();
        });
        
        if (isMatch) {
            toggleMatrixTheme();
            inputBuffer = [];
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('matrix-active')) {
            toggleMatrixTheme();
        }
    });

    function toggleMatrixTheme() {
        const body = document.body;
        const isActive = body.classList.toggle('matrix-active');
        
        const btn = document.getElementById('matrix-exit-btn');
        if (btn) btn.style.display = isActive ? 'block' : 'none';
        
        if (isActive) {
            startMatrixRain();
        } else {
            stopMatrixRain();
        }
    }
    window.toggleMatrixTheme = toggleMatrixTheme;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const columns = Math.floor(canvas.width / fontSize);
        const oldLen = drops.length;
        if (columns > oldLen) {
            for (let i = oldLen; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
        } else if (columns < oldLen) {
            drops.length = columns;
        }
    }

    function draw() {
        if (!ctx || !canvas) return;
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = fontSize + "px monospace";
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            if (Math.random() > 0.98) {
                ctx.fillStyle = "#fff";
            } else {
                ctx.fillStyle = "#39ff14";
            }
            
            ctx.fillText(text, x, y);
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
        
        animationFrameId = requestAnimationFrame(draw);
    }

    function startMatrixRain() {
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'matrix-canvas';
            document.body.appendChild(canvas);
            ctx = canvas.getContext('2d');
        }
        
        drops = [];
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        animationFrameId = requestAnimationFrame(draw);
    }

    function stopMatrixRain() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        window.removeEventListener('resize', resizeCanvas);
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
            canvas = null;
            ctx = null;
        }
    }
});
