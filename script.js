document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('random-canvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clear-btn');
    const saveButton = document.getElementById('save-btn');
    let audioContext; // Will be initialized on first user click


    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // --- Helper Functions for Randomness ---
    const getRandomNumber = (min, max) => Math.random() * (max - min) + min;
    const getRandomColor = () => `hsl(${getRandomNumber(0, 360)}, 100%, 50%)`;
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // --- Drawing Functions ---
    function drawShape(x, y, size, color, shape, rotation, opacity, skewX, skewY) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = getRandomInt(2, 10);
        ctx.translate(x, y);
        ctx.transform(1, skewY, skewX, 1, 0, 0); // Apply skew
        ctx.rotate(rotation * Math.PI / 180);

        switch (shape) {
            case 'square':
                ctx.fillRect(-size / 2, -size / 2, size, size);
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -size / 2);
                ctx.lineTo(size / 2, size / 2);
                ctx.lineTo(-size / 2, size / 2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'line':
                ctx.beginPath();
                ctx.moveTo(-size / 2, 0);
                ctx.lineTo(size / 2, 0);
                ctx.stroke();
                break;
            case 'polygon': // New shape
                const sides = getRandomInt(5, 8);
                const angleStep = (Math.PI * 2) / sides;
                ctx.beginPath();
                ctx.moveTo(size / 2 * Math.cos(0), size / 2 * Math.sin(0));
                for (let i = 1; i <= sides; i++) {
                    ctx.lineTo(size / 2 * Math.cos(i * angleStep), size / 2 * Math.sin(i * angleStep));
                }
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore();
    }

    // --- Main Event Generation ---
    function generateRandomEvent(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const shapes = ['square', 'circle', 'triangle', 'line', 'polygon']; // Added polygon

        const randomShape = shapes[getRandomInt(0, shapes.length - 1)];
        const randomColor = getRandomColor();
        const randomSize = getRandomNumber(10, 150);
        const randomRotation = getRandomNumber(0, 360);
        const randomOpacity = getRandomNumber(0.2, 1);
        const randomSkewX = getRandomNumber(-0.5, 0.5); // Skew value
        const randomSkewY = getRandomNumber(-0.5, 0.5); // Skew value

        drawShape(x, y, randomSize, randomColor, randomShape, randomRotation, randomOpacity, randomSkewX, randomSkewY);

        // Initialize AudioContext on first click and play sound
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        playRandomSound();
    }

    // --- Sound Generation ---
    function playRandomSound() {
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        const waveTypes = ['sine', 'square', 'sawtooth', 'triangle'];
        const randomWave = waveTypes[getRandomInt(0, waveTypes.length - 1)];
        const randomFreq = getRandomNumber(100, 1000); // Frequency in Hz
        const randomVolume = getRandomNumber(0.1, 0.4);

        oscillator.type = randomWave;
        oscillator.frequency.setValueAtTime(randomFreq, audioContext.currentTime);

        gainNode.gain.setValueAtTime(randomVolume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5); // Fade out

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // --- Event Listeners ---
    canvas.addEventListener('click', generateRandomEvent);

    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    saveButton.addEventListener('click', () => {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'randomix_composition.png';
        link.click();
    });

    console.log('RandomiX Engine Updated: Added Save as PNG feature. Create and capture your chaos!');
});
