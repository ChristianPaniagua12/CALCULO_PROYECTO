// ==============================================
// PREGUNTAS DE CALCULO - MAZE PAINT
// Transformaciones Lineales
// ==============================================

var QUESTIONS = [
    {
        // NIVEL 1
        question: '<em>"Es una función T: V → W entre espacios vectoriales, tal que para todos los vectores u y v, y cualquier escalar c, se cumple que T(u + v) = T(u) + T(v) y T(cu) = cT(u)."</em>',
        options: [
            "Conjuntos isomorfos",
            "Transformación lineal",
            "Núcleo de una transformación lineal",
            "Relación en funciones"
        ],
        correct: 1
    },
    {
        // NIVEL 2
        question: '¿Cuál de las siguientes expresiones muestra las dos condiciones necesarias para demostrar que una función es una transformación lineal?',
        options: [
            "1) T(u + v) = T(u) + T(v) &nbsp; 2) T(cu) = cT(u)",
            "1) T(u − v) = T(u) − T(v) &nbsp; 2) T(cu) = T(u) + c",
            "1) T(u + v) = T(u · v) &nbsp; 2) T(cu) = T(c) + T(u)",
            "1) T(u + v) = T(u) + v &nbsp; 2) T(cu) = uT(c)"
        ],
        correct: 0
    },
    {
        // NIVEL 3
        question: 'Sea T: ℝ² → ℝ³ definida por:<br><br><strong>T(x, y) = (x − 3y², 5y − 2x, x²)</strong><br><br>¿La función T es una transformación lineal?',
        options: [
            "Verdadero",
            "Falso"
        ],
        correct: 1
    },
    {
        // NIVEL 4
        question: '¿Con cuál otro nombre se conoce el <strong>núcleo</strong> de una transformación lineal?',
        options: [
            "Imagen",
            "Kernel",
            "Codominio",
            "Isomorfismo"
        ],
        correct: 1
    },
    {
        // NIVEL 5
        question: 'Sea T: ℝ² → ℝ² definida por:<br><br><strong>T(x, y) = (x + 2y, 3x − 5y)</strong><br><br>Según el procedimiento, el núcleo de T es:',
        options: [
            "{(−1, 1)}",
            "{(2, −1)}",
            "{(−2, 1)}",
            "{(−2, −2)}"
        ],
        correct: 2
    },
    {
        // NIVEL 6
        question: '¿Cuándo se dice que una transformación lineal es un <strong>automorfismo</strong>?',
        options: [
            "Cuando es únicamente un endomorfismo.",
            "Cuando es únicamente un isomorfismo.",
            "Cuando su núcleo es diferente de cero.",
            "Cuando es isomorfismo y endomorfismo al mismo tiempo."
        ],
        correct: 3
    },
    {
        // NIVEL 7
        question: 'Sea T: P₂(x) → ℝ⁴. Si T es <strong>inyectiva</strong>, entonces se clasifica como:',
        options: [
            "Epimorfismo",
            "Isomorfismo",
            "Monomorfismo",
            "Automorfismo"
        ],
        correct: 2
    },
    {
        // NIVEL 8
        question: '¿Cuándo se dice que dos espacios vectoriales se denominan <strong>conjuntos isomorfos</strong>?',
        options: [
            "Cuando tienen el mismo núcleo.",
            "Cuando tienen la misma imagen.",
            "Cuando sus transformaciones lineales son inyectivas.",
            "Cuando ambas dimensiones son iguales."
        ],
        correct: 3
    },
    {
        // NIVEL 9
        question: 'Si T(1, 0) = (−2, 5) y T(0, 1) = (3, −4), ¿cuál es <strong>T(a, b)</strong>?',
        options: [
            "T(a, b) = (−2a + 3b, 5a − 4b)",
            "T(a, b) = (−2a − 3b, 5a + 4b)",
            "T(a, b) = (a − 2b, 5a − 4b)",
            "T(a, b) = (3a − 2b, −4a + 5b)"
        ],
        correct: 0
    },
    {
        // NIVEL 10
        question: 'Sea A la matriz:<br><br><strong style="font-size:0.95em">⎡ 1 &nbsp;−3⎤<br>⎢−4 &nbsp; 0⎥<br>⎣ 2 &nbsp; 1⎦</strong><br><br>¿Cuál es la transformación lineal T asociada a A?',
        options: [
            "T(x, y) = (x − 3y, −4x, 2x + y)",
            "T(x, y) = (x + 3y, −4x, 2x − y)",
            "T(x, y) = (−3x + y, −4y, x + 2y)",
            "T(x, y) = (x − 3y, −4y, 2x + y)"
        ],
        correct: 0
    }
];
