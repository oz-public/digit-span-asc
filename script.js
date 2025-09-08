class DigitSpanGame {
    constructor() {
        this.sequence = [];
        this.ascendingDigits = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.intervalId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateSliderValues();
    }
    
    initializeElements() {
        this.digitCountSlider = document.getElementById('digitCount');
        this.intervalSlider = document.getElementById('interval');
        this.digitCountValue = document.getElementById('digitCountValue');
        this.intervalValue = document.getElementById('intervalValue');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.digitDisplay = document.getElementById('digitDisplay');
        this.inputSection = document.getElementById('inputSection');
        this.userInput = document.getElementById('userInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.results = document.getElementById('results');
        this.feedback = document.getElementById('feedback');
        this.playAgainBtn = document.getElementById('playAgainBtn');
    }
    
    bindEvents() {
        this.digitCountSlider.addEventListener('input', () => this.updateSliderValues());
        this.intervalSlider.addEventListener('input', () => this.updateSliderValues());
        this.startBtn.addEventListener('click', () => this.startGame());
        this.stopBtn.addEventListener('click', () => this.stopGame());
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        // Allow Enter key to submit answer
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }
    
    updateSliderValues() {
        this.digitCountValue.textContent = this.digitCountSlider.value;
        this.intervalValue.textContent = this.intervalSlider.value;
    }
    
    generateSequence() {
        const count = parseInt(this.digitCountSlider.value);
        this.sequence = [];
        
        // Generate random digits from 0-9
        for (let i = 0; i < count; i++) {
            this.sequence.push(Math.floor(Math.random() * 10));
        }
        
        // Calculate ascending digits (digits bigger than the previous one)
        this.ascendingDigits = [this.sequence[0]]; // First digit is always included
        
        for (let i = 1; i < this.sequence.length; i++) {
            if (this.sequence[i] > this.sequence[i - 1]) {
                this.ascendingDigits.push(this.sequence[i]);
            }
        }
        
        console.log('Full sequence:', this.sequence);
        console.log('Ascending digits:', this.ascendingDigits);
    }
    
    startGame() {
        this.generateSequence();
        this.currentIndex = 0;
        this.isPlaying = true;
        
        // Update UI
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.digitCountSlider.disabled = true;
        this.intervalSlider.disabled = true;
        this.inputSection.classList.add('hidden');
        this.results.classList.add('hidden');
        this.userInput.value = '';
        
        // Start displaying sequence
        this.displayNextDigit();
    }
    
    displayNextDigit() {
        if (!this.isPlaying || this.currentIndex >= this.sequence.length) {
            this.endSequence();
            return;
        }
        
        const digit = this.sequence[this.currentIndex];
        this.digitDisplay.innerHTML = `<span class="current-digit">${digit}</span>`;
        
        this.currentIndex++;
        
        const interval = parseInt(this.intervalSlider.value);
        this.intervalId = setTimeout(() => this.displayNextDigit(), interval);
    }
    
    endSequence() {
        this.isPlaying = false;
        this.digitDisplay.innerHTML = '<span class="ready-text">Sequence complete! Enter your answer below.</span>';
        this.inputSection.classList.remove('hidden');
        this.stopBtn.disabled = true;
        this.userInput.focus();
    }
    
    stopGame() {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
        
        this.isPlaying = false;
        this.resetUI();
    }
    
    resetUI() {
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.digitCountSlider.disabled = false;
        this.intervalSlider.disabled = false;
        this.digitDisplay.innerHTML = '<span class="ready-text">Click Start to begin!</span>';
        this.inputSection.classList.add('hidden');
        this.results.classList.add('hidden');
    }
    
    checkAnswer() {
        const userAnswer = this.userInput.value.trim();
        
        if (!userAnswer) {
            this.showFeedback('Please enter your answer!', false);
            return;
        }
        
        // Parse user input - support both "1 3 4 6" and "1346" formats
        let userDigits;
        
        if (userAnswer.includes(' ')) {
            // Whitespace-separated format
            userDigits = userAnswer.split(/\s+/).map(str => {
                const num = parseInt(str);
                return isNaN(num) ? null : num;
            }).filter(num => num !== null);
        } else {
            // No whitespace format - split each character as a digit
            userDigits = userAnswer.split('').map(char => {
                const num = parseInt(char);
                return isNaN(num) ? null : num;
            }).filter(num => num !== null);
        }
        
        // Check if answer matches
        const isCorrect = this.arraysEqual(userDigits, this.ascendingDigits);
        
        if (isCorrect) {
            this.showFeedback(
                `🎉 Correct! You found all ${this.ascendingDigits.length} ascending digits.<br>
                <strong>Full sequence:</strong> ${this.sequence.join(' ')}<br>
                <strong>Correct answer:</strong> ${this.ascendingDigits.join(' ')}`, 
                true
            );
        } else {
            // Format user answer to match their input style for clarity
            const userAnswerDisplay = userAnswer.includes(' ') ? userDigits.join(' ') : userDigits.join('');
            
            this.showFeedback(
                `❌ Not quite right.<br>
                <strong>Full sequence:</strong> ${this.sequence.join(' ')}<br>
                <strong>Your answer:</strong> ${userAnswerDisplay}<br>
                <strong>Correct answer:</strong> ${this.ascendingDigits.join(' ')}`, 
                false
            );
        }
        
        this.inputSection.classList.add('hidden');
        this.results.classList.remove('hidden');
    }
    
    showFeedback(message, isSuccess) {
        this.feedback.innerHTML = message;
        this.feedback.className = isSuccess ? 'success' : 'error';
    }
    
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((val, index) => val === arr2[index]);
    }
    
    resetGame() {
        this.sequence = [];
        this.ascendingDigits = [];
        this.currentIndex = 0;
        this.userInput.value = '';
        this.resetUI();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DigitSpanGame();
});
