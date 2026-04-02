// ==============================================
// MAZE PAINT - Desafio de Calculo
// Motor del juego completo
// ==============================================

// ==================== NIVEL DATA ====================
// Cada nivel: grid (0=muro, 1=pintable), start, nombre, color, maxMoves
var LEVELS = [
    {
        // 5x6 - Espiral con trampa (si vas → primero, pierdes)
        // Solucion: ↓→↓←→↑← (7 movimientos)
        name: "Primer Trazo",
        grid: [
            [1,1,1,1,1,1],
            [1,0,0,0,0,1],
            [1,1,1,1,0,1],
            [0,0,0,1,0,1],
            [1,1,1,1,1,1]
        ],
        start: [0, 0],
        color: '#E07A5F',
        maxMoves: 14
    },
    {
        // 6x6 - Espiral doble con giro reverso
        // Solucion: →↓←↑←↓→ (7 movimientos)
        name: "El Caracol",
        grid: [
            [1,1,1,1,1,1],
            [0,0,0,0,0,1],
            [1,1,1,1,0,1],
            [1,0,0,1,0,1],
            [1,0,0,1,1,1],
            [1,1,1,1,0,0]
        ],
        start: [0, 0],
        color: '#3D8B7A',
        maxMoves: 14
    },
    {
        // 7x7 - Espiral de dos capas
        // Solucion: →↓←↑→↓← (7 movimientos)
        name: "Doble Espiral",
        grid: [
            [1,1,1,1,1,1,1],
            [0,0,0,0,0,0,1],
            [1,1,1,1,1,0,1],
            [1,0,0,0,1,0,1],
            [1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1],
            [1,1,1,1,1,1,1]
        ],
        start: [0, 0],
        color: '#E6A23C',
        maxMoves: 14
    },
    {
        // 8x6 - Serpiente con bolsillo interior
        // Solucion: →↓←↓→↑←↓ (8 movimientos)
        name: "El Laberinto",
        grid: [
            [1,1,1,1,1,1],
            [0,0,0,0,0,1],
            [1,1,1,1,1,1],
            [1,0,0,0,0,0],
            [1,0,1,1,1,1],
            [1,0,1,0,0,1],
            [1,0,0,0,0,1],
            [1,1,1,1,1,1]
        ],
        start: [0, 0],
        color: '#7B68AE',
        maxMoves: 15
    },
    {
        // 9x6 - Espiral + extension serpiente
        // Solucion: →↓←↑←↓→↓← (9 movimientos)
        name: "La Serpiente",
        grid: [
            [1,1,1,1,1,1],
            [0,0,0,0,0,1],
            [1,1,1,1,0,1],
            [1,0,0,1,0,1],
            [1,0,0,1,1,1],
            [1,0,0,0,0,0],
            [1,1,1,1,1,1],
            [0,0,0,0,0,1],
            [1,1,1,1,1,1]
        ],
        start: [0, 0],
        color: '#52B788',
        maxMoves: 16
    },
    {
        // 9x8 - Triple espiral (3 capas)
        // Solucion: →↓←↑→↓←↑→ (9 movimientos)
        name: "La Fortaleza",
        grid: [
            [1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,0,1],
            [1,0,0,0,0,1,0,1],
            [1,0,1,1,0,1,0,1],
            [1,0,1,0,0,1,0,1],
            [1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1]
        ],
        start: [0, 0],
        color: '#C44569',
        maxMoves: 16
    },
    {
        // 12x6 - Bolsillo interior + serpiente + retroceso obligatorio
        // Solucion: →↓←↓→↑←↓↑→↓↓←↓→ (15 movimientos, 3 de retroceso)
        name: "El Maestro",
        grid: [
            [1,1,1,1,1,1],
            [0,0,0,0,0,1],
            [1,1,1,1,1,1],
            [1,0,0,0,0,0],
            [1,0,1,1,1,1],
            [1,0,1,0,0,1],
            [1,0,0,0,0,1],
            [1,1,1,1,1,1],
            [0,0,0,0,0,1],
            [1,1,1,1,1,1],
            [1,0,0,0,0,0],
            [1,1,1,1,1,1]
        ],
        start: [0, 0],
        color: '#4A7FC1',
        maxMoves: 22
    }
];

// ==================== ESTADO ====================
var playerName = '';
var completedLevels = [];
var currentLevel = -1;
var playerPos = { r: 0, c: 0 };
var painted = [];
var isAnimating = false;
var moveCount = 0;

// Audio
var audioCtx = null;
var masterGain = null;
var isMusicPlaying = false;
var padOscillators = [];
var melodyTimeout = null;
var chordIndex = 0;
var phraseIndex = 0;
var noteInPhrase = 0;

// Progresion de acordes: I-vi-IV-V en C
var CHORDS = [
    [261.63, 329.63, 392.00],
    [220.00, 261.63, 329.63],
    [174.61, 220.00, 261.63],
    [196.00, 246.94, 293.66]
];

// 4 frases melodicas que se alternan
var PHRASES = [
    [523.25, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25, 587.33],
    [659.25, 783.99, 1046.50, 987.77, 880.00, 783.99, 659.25, 587.33],
    [783.99, 880.00, 783.99, 659.25, 587.33, 523.25, 587.33, 659.25],
    [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25]
];

// Touch
var touchStartX = 0;
var touchStartY = 0;
var touchStartTime = 0;

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    if (loadProgress()) {
        showScreen('levels');
        renderLevelSelect();
    } else {
        showScreen('splash');
    }
    setupInputHandlers();
    window.addEventListener('resize', function() {
        if (currentLevel >= 0 && document.getElementById('screen-game').classList.contains('active')) {
            renderMaze();
        }
    });
});

// ==================== LOCAL STORAGE ====================
function saveProgress() {
    try {
        localStorage.setItem('mazePaintCalculo', JSON.stringify({
            playerName: playerName,
            completedLevels: completedLevels
        }));
    } catch (e) {}
}

function loadProgress() {
    try {
        var data = JSON.parse(localStorage.getItem('mazePaintCalculo'));
        if (data && data.playerName) {
            playerName = data.playerName;
            completedLevels = data.completedLevels || [];
            return true;
        }
    } catch (e) {}
    return false;
}

// ==================== PANTALLAS ====================
function showScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    var target = document.getElementById('screen-' + id);
    if (target) target.classList.add('active');
}

function showNameInput() {
    showScreen('name');
    setTimeout(function() {
        document.getElementById('player-name').focus();
    }, 350);
}

function submitName() {
    var input = document.getElementById('player-name');
    var name = input.value.trim();
    if (!name) {
        input.classList.add('shake');
        setTimeout(function() { input.classList.remove('shake'); }, 500);
        return;
    }
    playerName = name;
    completedLevels = [];
    saveProgress();
    showScreen('levels');
    renderLevelSelect();
}

function showLevelSelect() {
    showScreen('levels');
    renderLevelSelect();
}

function renderLevelSelect() {
    document.getElementById('welcome-msg').textContent = 'Hola, ' + playerName + '!';
    var grid = document.getElementById('level-grid');
    grid.innerHTML = '';

    for (var i = 0; i < LEVELS.length; i++) {
        var level = LEVELS[i];
        var isCompleted = completedLevels.indexOf(i) !== -1;
        var isUnlocked = i === 0 || completedLevels.indexOf(i - 1) !== -1;

        var btn = document.createElement('button');
        btn.className = 'level-btn';
        if (isCompleted) btn.classList.add('completed');
        if (!isUnlocked) btn.classList.add('locked');
        btn.style.setProperty('--level-color', level.color);

        var inner = '<span class="level-num">' + (i + 1) + '</span>';
        inner += '<span class="level-name">' + level.name + '</span>';
        if (isCompleted) inner += '<span class="level-check">&check;</span>';
        btn.innerHTML = inner;

        if (isUnlocked) {
            btn.setAttribute('data-level', i);
            btn.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-level'));
                startLevel(idx);
            });
        }

        grid.appendChild(btn);
    }
}

function goToLevels() {
    currentLevel = -1;
    showLevelSelect();
}

// ==================== TOAST ====================
function showToast(msg, duration) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('active');
    void toast.offsetWidth;
    toast.classList.add('active');
    setTimeout(function() {
        toast.classList.remove('active');
    }, duration || 1500);
}

// ==================== JUEGO ====================
function startLevel(index) {
    currentLevel = index;
    var level = LEVELS[index];
    var rows = level.grid.length;
    var cols = level.grid[0].length;

    painted = [];
    for (var r = 0; r < rows; r++) {
        painted[r] = [];
        for (var c = 0; c < cols; c++) {
            painted[r][c] = false;
        }
    }

    playerPos = { r: level.start[0], c: level.start[1] };
    painted[playerPos.r][playerPos.c] = true;
    moveCount = 0;
    isAnimating = false;

    showScreen('game');
    document.getElementById('level-title').textContent = 'Nivel ' + (index + 1);
    document.getElementById('level-subtitle').textContent = level.name;
    document.getElementById('max-moves').textContent = level.maxMoves;
    document.documentElement.style.setProperty('--current-level-color', level.color);

    updateMoveDisplay();
    renderMaze();
}

function updateMoveDisplay() {
    var level = LEVELS[currentLevel];
    var moveEl = document.getElementById('move-count');
    var label = moveEl.parentElement;
    moveEl.textContent = moveCount;

    if (moveCount >= level.maxMoves - 2 && moveCount < level.maxMoves) {
        label.classList.add('danger');
    } else {
        label.classList.remove('danger');
    }
}

function renderMaze() {
    var level = LEVELS[currentLevel];
    var container = document.getElementById('maze-container');
    var rows = level.grid.length;
    var cols = level.grid[0].length;

    var maxWidth = Math.min(window.innerWidth - 48, 400);
    var maxHeight = window.innerHeight - 180;
    var gap = 4;
    var cellByWidth = Math.floor((maxWidth - gap * (cols - 1)) / cols);
    var cellByHeight = Math.floor((maxHeight - gap * (rows - 1)) / rows);
    var cellSize = Math.min(cellByWidth, cellByHeight, 80);
    var totalW = cellSize * cols + gap * (cols - 1);
    var totalH = cellSize * rows + gap * (rows - 1);

    container.style.width = totalW + 'px';
    container.style.height = totalH + 'px';
    container.innerHTML = '';

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = 'cell-' + r + '-' + c;
            cell.style.left = (c * (cellSize + gap)) + 'px';
            cell.style.top = (r * (cellSize + gap)) + 'px';
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';

            if (level.grid[r][c] === 0) {
                cell.classList.add('wall');
            } else if (painted[r][c]) {
                cell.classList.add('painted');
            } else {
                cell.classList.add('empty');
            }
            container.appendChild(cell);
        }
    }

    var playerEl = document.createElement('div');
    playerEl.id = 'player';
    playerEl.className = 'player';
    var pSize = Math.round(cellSize * 0.62);
    playerEl.style.width = pSize + 'px';
    playerEl.style.height = pSize + 'px';
    playerEl.style.left = (playerPos.c * (cellSize + gap) + (cellSize - pSize) / 2) + 'px';
    playerEl.style.top = (playerPos.r * (cellSize + gap) + (cellSize - pSize) / 2) + 'px';
    playerEl.style.transition = 'none';
    container.appendChild(playerEl);

    container.dataset.cellSize = cellSize;
    container.dataset.gap = gap;
}

function handleMove(direction) {
    if (isAnimating || currentLevel < 0) return;

    var level = LEVELS[currentLevel];
    var rows = level.grid.length;
    var cols = level.grid[0].length;

    var dr = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
    var dc = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;

    var cr = playerPos.r;
    var cc = playerPos.c;
    var path = [];

    while (true) {
        var nr = cr + dr;
        var nc = cc + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) break;
        if (level.grid[nr][nc] === 0) break;
        cr = nr;
        cc = nc;
        path.push({ r: cr, c: cc });
    }

    if (path.length === 0) return;

    isAnimating = true;
    playSound('move');

    var dest = path[path.length - 1];
    playerPos = { r: dest.r, c: dest.c };

    var container = document.getElementById('maze-container');
    var playerEl = document.getElementById('player');
    var cellSize = parseInt(container.dataset.cellSize);
    var gap = parseInt(container.dataset.gap);
    var pSize = Math.round(cellSize * 0.62);

    var duration = Math.min(path.length * 0.065, 0.4);
    playerEl.style.transition = 'left ' + duration + 's ease-out, top ' + duration + 's ease-out';
    playerEl.style.left = (dest.c * (cellSize + gap) + (cellSize - pSize) / 2) + 'px';
    playerEl.style.top = (dest.r * (cellSize + gap) + (cellSize - pSize) / 2) + 'px';

    var cellDelay = (duration * 1000) / path.length;
    for (var i = 0; i < path.length; i++) {
        (function(idx) {
            setTimeout(function() {
                var pos = path[idx];
                if (!painted[pos.r][pos.c]) {
                    painted[pos.r][pos.c] = true;
                    var cellEl = document.getElementById('cell-' + pos.r + '-' + pos.c);
                    if (cellEl) {
                        cellEl.classList.remove('empty');
                        cellEl.classList.add('painted', 'paint-anim');
                    }
                    playSound('paint');
                }
            }, idx * cellDelay);
        })(i);
    }

    setTimeout(function() {
        moveCount++;
        updateMoveDisplay();
        isAnimating = false;

        if (isLevelComplete()) {
            setTimeout(celebrateAndShowQuestion, 350);
        } else if (moveCount >= level.maxMoves) {
            setTimeout(function() {
                playSound('fail');
                showToast('Sin movimientos! Intenta de nuevo', 1800);
                setTimeout(function() {
                    startLevel(currentLevel);
                }, 2000);
            }, 200);
        }
    }, duration * 1000 + 80);
}

function isLevelComplete() {
    var level = LEVELS[currentLevel];
    var rows = level.grid.length;
    var cols = level.grid[0].length;
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            if (level.grid[r][c] === 1 && !painted[r][c]) return false;
        }
    }
    return true;
}

function celebrateAndShowQuestion() {
    isAnimating = true;
    playSound('complete');

    var level = LEVELS[currentLevel];
    var rows = level.grid.length;
    var cols = level.grid[0].length;

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            if (painted[r][c]) {
                var cell = document.getElementById('cell-' + r + '-' + c);
                if (cell) {
                    var dist = Math.abs(r - playerPos.r) + Math.abs(c - playerPos.c);
                    cell.style.animationDelay = (dist * 0.055) + 's';
                    cell.classList.add('celebrate');
                }
            }
        }
    }

    setTimeout(function() {
        showQuestion();
    }, 1100);
}

function resetLevel() {
    if (currentLevel >= 0) startLevel(currentLevel);
}

// ==================== PREGUNTAS ====================
function showQuestion() {
    var q = QUESTIONS[currentLevel];
    var modal = document.getElementById('modal-question');

    document.getElementById('question-level').textContent = 'Nivel ' + (currentLevel + 1);

    var content = document.getElementById('question-content');
    if (q.image) {
        content.innerHTML = '<img src="' + q.image + '" alt="Pregunta" class="question-image">';
    } else {
        content.innerHTML = '<p class="question-text">' + q.question + '</p>';
    }

    var optContainer = document.getElementById('options-container');
    optContainer.innerHTML = '';
    var labels = ['A', 'B', 'C', 'D'];

    for (var i = 0; i < q.options.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = '<span class="option-label">' + labels[i] + '</span> ' + q.options[i];
        btn.setAttribute('data-idx', i);
        btn.addEventListener('click', function() {
            selectAnswer(parseInt(this.getAttribute('data-idx')));
        });
        optContainer.appendChild(btn);
    }

    document.getElementById('question-feedback').textContent = '';
    document.getElementById('question-feedback').className = 'feedback';

    modal.classList.add('active');
}

function selectAnswer(index) {
    var q = QUESTIONS[currentLevel];
    var options = document.querySelectorAll('.option-btn');

    if (options[index].classList.contains('disabled')) return;

    if (index === q.correct) {
        options[index].classList.add('correct');
        playSound('correct');

        document.getElementById('question-feedback').textContent = 'Correcto!';
        document.getElementById('question-feedback').className = 'feedback correct';

        for (var i = 0; i < options.length; i++) {
            options[i].classList.add('disabled');
        }

        if (completedLevels.indexOf(currentLevel) === -1) {
            completedLevels.push(currentLevel);
            saveProgress();
        }

        setTimeout(function() {
            document.getElementById('modal-question').classList.remove('active');
            isAnimating = false;
            if (completedLevels.length === LEVELS.length) {
                showVictory();
            } else {
                showLevelSelect();
            }
        }, 1400);
    } else {
        options[index].classList.add('wrong', 'shake');
        playSound('wrong');

        document.getElementById('question-feedback').textContent = 'Incorrecto! Debes repetir el nivel';
        document.getElementById('question-feedback').className = 'feedback wrong';

        for (var i = 0; i < options.length; i++) {
            options[i].classList.add('disabled');
        }

        setTimeout(function() {
            document.getElementById('modal-question').classList.remove('active');
            isAnimating = false;
            setTimeout(function() {
                startLevel(currentLevel);
            }, 400);
        }, 1800);
    }
}

function showVictory() {
    document.getElementById('victory-name').textContent = playerName;
    showScreen('victory');
    playSound('victory');
}

function resetGame() {
    playerName = '';
    completedLevels = [];
    localStorage.removeItem('mazePaintCalculo');
    showScreen('splash');
}

// ==================== AUDIO ====================
function initAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.5;
        masterGain.connect(audioCtx.destination);
    } catch (e) {}
}

function startMusic() {
    if (!audioCtx) initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (isMusicPlaying) return;
    isMusicPlaying = true;

    chordIndex = 0;
    phraseIndex = 0;
    noteInPhrase = 0;

    var firstChord = CHORDS[0];
    padOscillators = [];
    for (var i = 0; i < firstChord.length; i++) {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = firstChord[i];
        gain.gain.value = 0.032;
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        padOscillators.push({ osc: osc, gain: gain });
    }

    function playMelodyNote() {
        if (!isMusicPlaying) return;
        try {
            var phrase = PHRASES[phraseIndex % PHRASES.length];
            var freq = phrase[noteInPhrase % phrase.length];

            freq *= 1 + (Math.random() - 0.5) * 0.015;

            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.type = noteInPhrase % 2 === 0 ? 'triangle' : 'sine';
            osc.frequency.value = freq;
            var now = audioCtx.currentTime;
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 0.48);

            noteInPhrase++;

            if (noteInPhrase >= 8) {
                noteInPhrase = 0;
                phraseIndex++;
                chordIndex = phraseIndex % CHORDS.length;

                var newChord = CHORDS[chordIndex];
                var transTime = audioCtx.currentTime + 0.3;
                for (var p = 0; p < padOscillators.length && p < newChord.length; p++) {
                    padOscillators[p].osc.frequency.exponentialRampToValueAtTime(newChord[p], transTime);
                }
            }
        } catch (e) {}

        melodyTimeout = setTimeout(playMelodyNote, 350 + Math.random() * 60);
    }

    playMelodyNote();
    updateMusicButton();
}

function stopMusic() {
    isMusicPlaying = false;
    for (var i = 0; i < padOscillators.length; i++) {
        try { padOscillators[i].osc.stop(); } catch (e) {}
    }
    padOscillators = [];
    if (melodyTimeout) {
        clearTimeout(melodyTimeout);
        melodyTimeout = null;
    }
    updateMusicButton();
}

function toggleMusic() {
    if (!audioCtx) initAudio();
    if (isMusicPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
}

function updateMusicButton() {
    var btn = document.getElementById('music-btn');
    if (!btn) return;
    btn.innerHTML = '&#9835; Musica: ' + (isMusicPlaying ? 'ON' : 'OFF');
    if (isMusicPlaying) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

function playSound(type) {
    if (!audioCtx) initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    var now = audioCtx.currentTime;

    try {
        if (type === 'move') {
            var osc = audioCtx.createOscillator();
            var g = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(380, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
            g.gain.setValueAtTime(0.09, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.connect(g); g.connect(masterGain);
            osc.start(now); osc.stop(now + 0.12);
        }

        if (type === 'paint') {
            var osc = audioCtx.createOscillator();
            var g = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 550 + Math.random() * 350;
            g.gain.setValueAtTime(0.04, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc.connect(g); g.connect(masterGain);
            osc.start(now); osc.stop(now + 0.09);
        }

        if (type === 'complete') {
            var freqs = [523.25, 659.25, 783.99, 1046.50];
            for (var i = 0; i < freqs.length; i++) {
                (function(freq, delay) {
                    var osc = audioCtx.createOscillator();
                    var g = audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = freq;
                    var t = now + delay;
                    g.gain.setValueAtTime(0.1, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
                    osc.connect(g); g.connect(masterGain);
                    osc.start(t); osc.stop(t + 0.32);
                })(freqs[i], i * 0.11);
            }
        }

        if (type === 'correct') {
            var freqs = [523.25, 659.25, 783.99];
            for (var i = 0; i < freqs.length; i++) {
                var osc = audioCtx.createOscillator();
                var g = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freqs[i];
                g.gain.setValueAtTime(0.09, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
                osc.connect(g); g.connect(masterGain);
                osc.start(now); osc.stop(now + 0.6);
            }
        }

        if (type === 'wrong') {
            var osc = audioCtx.createOscillator();
            var g = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
            g.gain.setValueAtTime(0.06, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.connect(g); g.connect(masterGain);
            osc.start(now); osc.stop(now + 0.3);
        }

        if (type === 'fail') {
            var freqs = [440, 370, 311, 261];
            for (var i = 0; i < freqs.length; i++) {
                (function(freq, delay) {
                    var osc = audioCtx.createOscillator();
                    var g = audioCtx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.value = freq;
                    var t = now + delay;
                    g.gain.setValueAtTime(0.07, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                    osc.connect(g); g.connect(masterGain);
                    osc.start(t); osc.stop(t + 0.25);
                })(freqs[i], i * 0.12);
            }
        }

        if (type === 'victory') {
            var scale = [523.25, 659.25, 783.99, 880.00, 1046.50];
            for (var i = 0; i < scale.length; i++) {
                (function(freq, delay) {
                    var osc = audioCtx.createOscillator();
                    var g = audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = freq;
                    var t = now + delay;
                    g.gain.setValueAtTime(0.1, t);
                    g.gain.exponentialRampToValueAtTime(0.008, t + 0.45);
                    osc.connect(g); g.connect(masterGain);
                    osc.start(t); osc.stop(t + 0.5);
                })(scale[i], i * 0.14);
            }
        }
    } catch (e) {}
}

// ==================== INPUT ====================
function setupInputHandlers() {
    document.addEventListener('touchstart', function(e) {
        if (!document.getElementById('screen-game').classList.contains('active')) return;
        if (document.getElementById('modal-question').classList.contains('active')) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (document.getElementById('screen-game').classList.contains('active') &&
            !document.getElementById('modal-question').classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        if (!document.getElementById('screen-game').classList.contains('active')) return;
        if (document.getElementById('modal-question').classList.contains('active')) return;

        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        var dt = Date.now() - touchStartTime;

        if (Math.abs(dx) < 25 && Math.abs(dy) < 25) return;
        if (dt > 800) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            handleMove(dx > 0 ? 'right' : 'left');
        } else {
            handleMove(dy > 0 ? 'down' : 'up');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (!document.getElementById('screen-game').classList.contains('active')) return;
        if (document.getElementById('modal-question').classList.contains('active')) return;

        var map = {
            ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
            w: 'up', s: 'down', a: 'left', d: 'right'
        };
        if (map[e.key]) {
            e.preventDefault();
            handleMove(map[e.key]);
        }
    });

    var nameInput = document.getElementById('player-name');
    if (nameInput) {
        nameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') submitName();
        });
    }
}
