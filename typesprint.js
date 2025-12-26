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

    const DOM = {}
})