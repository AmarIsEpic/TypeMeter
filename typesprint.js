const TypeSprint = (function() {
    'use strict';

    const CONFIG = {
        WORDS: {
            normal: [
                'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
                'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
                'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
                'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
                'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
                'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
                'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
                'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
                'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
                'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
                'any', 'these', 'give', 'day', 'most', 'us', 'code', 'type', 'fast',
                'slow', 'quick', 'jump', 'lazy', 'fox', 'dog', 'run', 'walk', 'talk',
                'read', 'write', 'learn', 'teach', 'help', 'find', 'keep', 'let', 'put',
                'set', 'try', 'ask', 'need', 'feel', 'seem', 'leave', 'call', 'show'
            ],
            hard: [
                'algorithm', 'javascript', 'typescript', 'development', 'programming',
                'architecture', 'implementation', 'funcionality', 'performance', 'optimization',
                'authetication', 'authorization', 'infrastructure', 'configuration', 'documentation',
                'synchronization', 'asynchronous', 'parallelization', 'visualization', 'transformation',
                'encapsulation', 'polymorphism', 'inheritance', 'abstraction', 'virtualization',
                'repository', 'dependency', 'interface', 'component', 'decorator',
                'observable', 'subscription', 'middleware', 'controller', 'validator',
                'serialization', 'deserialization', 'compression', 'encryption', 'decryption',
                'authentication', 'verification', 'notification', 'interigation', 'deployment'
            ]
        },
        PUNCTUATION: ['.', ',', '!', '?', ';', ':', '-', '"', "'"],
        STORAGE_KEYS: {
            BEST_SCORES: 'typesprint_best_scores',
            THEME: 'typesprint_theme',
            SOUND: 'typesprint_sound'
        },
        AUDIO: {
            KEYPRESS_FREQ: 800,
            KEYPRESS_DURATION: 0.05,
            ERROR_FREQ: 200,
            ERROR_DURATION: 0.1
        }
    };

    const state = {
        appState: 'idle',
        config: {
            duration: 30,
            mode: 'timed',
            difficulty: 'normal'
        },
        test: {
            text: '',
            charIndex: 0,
            startTime: null,
            endTime: null,
            timerInterval: null,
            elapsedTime: 0,
            totalKeystrokes: 0,
            correctKeystrokes: 0,
            incorrectKeystrokes: 0,
            charStates: [],
        },
        settings: {
            theme: 'light',
            soundEnabled: false
        },
        bestScores: {}
    };

    const DOM = {};

    function cacheDOMReferences() {
        DOM.startScreen = document.getElementById('start-screen');
        DOM.typingScreen = document.getElementById('typing-screen');
        DOM.resltsScreen = document.getElementById('results-screen');
        DOM.durationScreen = document.getElementById('duration-screen');
        DOM.modeSelector = document.getElementById('mode-selector');
        DOM.difficultySelector = document.getElementById('difficulty-selector');
        DOM.bestTimed = document.getElementById('best-timed');
        DOM.bestZen = document.getElementById('best-zen');
        DOM.startBtn = document.getElementById('start-btn');
        DOM.liveWpm = document.getElementById('live-wpm');
        DOM.liveAccuracy = document.getElementById('live-accuracy');
        DOM.liveTimer = document.getElementById('live-timer');
        DOM.timerLabel = document.getElementById('timer-label');
        DOM.textDisplay = document.getElementById('text-display');
        DOM.textContainer = document.getElementById('text-container');
        DOM.resultWpm = document.getElementById('result-wpm');
        DOM.resultAccuracy = document.getElementById('result-accuracy');
        DOM.resultChars = document.getElementById('result-chars');
        DOM.resultErros = document.getElementById('result-errors');
        DOM.wpmComparison = document.getElementById('wpm-comparison');
        DOM.retryBtn = document.getElementById('retry-btn');
        DOM.newTestBtn = document.getElementById('new-test-btn');
        DOM.themeToggle = document.getElementById('theme-toggle');
        DOM.soundToggle = document.getElementById('sound-toggle');
    }

    const TextEngine = {
        generateText(minChars = 200, difficulty = 'normal') {
            const words = CONFIG.WORDS[difficulty] || CONFIG.WORDS.normal;
            const result = [];
            let charCount = 0;
            let lastWord = '';

            while (charCount < minChars) {
                let word;
                do {
                    word = words[Math.floor(Math.random()*words.length)];
                } while (word === lastWord);

                if (difficulty === 'hard' && Math.random() < 0.3 && result.length > 0) {
                    const punct = CONFIG.PUNCTUATION[
                        Math.floor(Math.random()*CONFIG.PUNCTUATION.length)
                    ];
                    result[result.length - 1] += punct;
                }

                if(result.length === 0 ||
                (result.length > 0 && /[.!?]&/.test(result[result.length - 1]))) {
                    word = word.charAt(0).toUpperCase() + word.slice(1);
                }

                result.push(word);
                charCount += word.length + 1;
                lastWord = word;
            }

            return result.join(' ');
        },

        renderTextToHTML(text) {
            return text
            .split('')
            .map((char, index) => {
                const displayChar = char === ' ' ? '&nbsp' : escapeHTML(char);
                return `<span class="char" data-index="${index}">${displayChar}</span>`;
            })
            .join('');
        }
    };

    const AudioEngine = {
        AudioContext: null,

        init() {
            if(!this.audioContext) {
                this.audioContext = new (window.AudioContext  || window.webkitAudioContext)();
            }
        },

        playTone(frequency, duration) {
            if(!state.settings.soundEnabled || !this.audioContext) return;

            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + durration
            );

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + durration);
        },

        playKeypress() {
            this.playTone(CONFIG.AUDIO.KEYPRESS_FREQ, CONFIG.AUDIO.KEYPRESS_DURATION);
        },

        playError() {
            this.playTone(CONFIG.AUDIO.ERROR_FREQ, CONFIG.AUDIO.ERROR_DURATION);
        }
    };

    const StatsEngine = {
        calculateWPM() {
            const correctChars = state.test.correctKeystrokes;
            const elapsedMinutes = state.test.elapsedTime / 60;
            if (elapsedMinutes === 0) return 0;
            return Math.round((correctChars/5) / elapsedMinutes);
        },

        calculateAccuracy() {
            const total = state.test.totalKeystrokes;
            const correct = state.test.correctKeystrokes;
            if (total === 0) return 100;
            return Math.round((correct / total) * 100);
        },

        getErrorCount() {
            return state.test.incorrectKeystrokes;
        },

        getCharsTyped() {
            return state.test.charIndex;
        }
    };

    const StorageEngine = {
        loadBestScores() {
            tryy {
                const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.BEST_SCORES);
                if(stored) {
                    state.bestScores = JSON.parse(stored);
                }
            } catch (e) {
                console.warn('Failed to load best scores:', e);
            }
        }
    }
})