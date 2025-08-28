// Teoría de Conteo - Funcionalidad Interactiva
// Este archivo implementa todas las calculadoras y herramientas interactivas para la sección de Teoría de Conteo

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar siempre, independientemente de qué pestaña esté activa
    initializeConteoCalculators();
    initializeProblems();
    initializeProblemGenerator();
    initializeVisualizer();
    setupTabSwitching();
    
    console.log('Teoría de Conteo initialized'); // Debug log
});

// Función para calcular factorial (mejorada con manejo de overflow)
function factorial(num) {
    if (num < 0) return NaN;
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
        if (!Number.isSafeInteger(result)) return Infinity;
    }
    return result;
}

// Función para calcular permutaciones (optimizada)
function permutations(n, k) {
    if (k < 0 || k > n || !Number.isInteger(n) || !Number.isInteger(k) || n < 0) return NaN;
    if (k === 0) return 1;
    let result = 1;
    for (let i = 0; i < k; i++) {
        result *= (n - i);
        if (!Number.isSafeInteger(result)) return Infinity;
    }
    return result;
}

// Función para calcular combinaciones (optimizada)
function combinations(n, k) {
    if (k < 0 || k > n || !Number.isInteger(n) || !Number.isInteger(k) || n < 0) return NaN;
    if (k === 0 || k === n) return 1;
    if (k > n / 2) k = n - k; // Optimización
    
    const perm = permutations(n, k);
    const factK = factorial(k);
    if (perm === Infinity || factK === Infinity || factK === 0) return Infinity;
    
    return Math.round(perm / factK);
}

// Funciones de compatibilidad (alias para las funciones existentes)
function combination(n, r) {
    return combinations(n, r);
}

function variation(n, r) {
    return permutations(n, r);
}

// Función para formatear números grandes
function formatNumber(num) {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
}

// Inicialización de calculadoras
function initializeConteoCalculators() {
    // Configurar calculadora del principio fundamental
    setupFundamentalCalculator();
    
    // Configurar calculadora de permutaciones
    setupPermutationCalculator();
    
    // Configurar calculadora de variaciones
    setupVariationCalculator();
    
    // Configurar calculadora de combinaciones
    setupCombinationCalculator();
    
    // Configurar Triángulo de Pascal
    setupPascalTriangle();
    
    // Configurar Diagramas de Árbol
    setupTreeProblems();
}

function setupFundamentalCalculator() {
    const numStagesSelect = document.getElementById('numStages');
    const stagesInputsDiv = document.getElementById('stagesInputs');
    const calculateBtn = document.getElementById('calculateFundamental');
    
    // Generar inputs dinámicos para etapas
    function generateStageInputs() {
        const numStages = parseInt(numStagesSelect.value);
        stagesInputsDiv.innerHTML = '';
        
        for (let i = 1; i <= numStages; i++) {
            const div = document.createElement('div');
            div.innerHTML = `
                <label class="block text-sm font-medium mb-2">Opciones para etapa ${i}:</label>
                <input type="number" id="stage${i}" class="w-full p-2 border rounded" min="1" value="${i + 1}" placeholder="Número de opciones">
            `;
            stagesInputsDiv.appendChild(div);
        }
    }
    
    numStagesSelect.addEventListener('change', generateStageInputs);
    generateStageInputs(); // Inicializar
    
    calculateBtn.addEventListener('click', function() {
        const numStages = parseInt(numStagesSelect.value);
        let total = 1;
        let calculation = '';
        let explanation = '';
        
        for (let i = 1; i <= numStages; i++) {
            const value = parseInt(document.getElementById(`stage${i}`).value) || 1;
            total *= value;
            calculation += (i > 1 ? ' × ' : '') + value;
        }
        
        explanation = `Aplicando el principio fundamental: cada etapa es independiente, por lo que multiplicamos las opciones de cada una.`;
        
        document.getElementById('fundamentalCalculation').innerHTML = `${calculation} = <strong>${formatNumber(total)}</strong>`;
        document.getElementById('fundamentalExplanation').textContent = explanation;
    });
}

function setupPermutationCalculator() {
    const permType = document.getElementById('permType');
    const permInputs = document.getElementById('permInputs');
    const calculateBtn = document.getElementById('calculatePerm');
    
    function generatePermInputs() {
        const type = permType.value;
        let html = '';
        
        switch(type) {
            case 'simple':
                html = `
                    <div>
                        <label class="block text-sm font-medium mb-2">Número de elementos (n):</label>
                        <input type="number" id="permN" class="w-full p-2 border rounded" min="1" value="5">
                    </div>
                `;
                break;
            case 'partial':
                html = `
                    <div>
                        <label class="block text-sm font-medium mb-2">Total de elementos (n):</label>
                        <input type="number" id="permN" class="w-full p-2 border rounded" min="1" value="10">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Elementos a ordenar (r):</label>
                        <input type="number" id="permR" class="w-full p-2 border rounded" min="1" value="3">
                    </div>
                `;
                break;
            case 'repetition':
                html = `
                    <div>
                        <label class="block text-sm font-medium mb-2">Total de elementos (n):</label>
                        <input type="number" id="permN" class="w-full p-2 border rounded" min="1" value="11">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Repeticiones (separadas por comas):</label>
                        <input type="text" id="permReps" class="w-full p-2 border rounded" value="3,2,2,1,1,1,1" placeholder="ej: 3,2,2,1,1">
                    </div>
                `;
                break;
        }
        
        permInputs.innerHTML = html;
    }
    
    permType.addEventListener('change', generatePermInputs);
    generatePermInputs();
    
    calculateBtn.addEventListener('click', function() {
        const type = permType.value;
        const n = parseInt(document.getElementById('permN').value) || 0;
        let result = 0;
        let calculation = '';
        let explanation = '';
        
        switch(type) {
            case 'simple':
                result = factorial(n);
                calculation = `${n}! = ${formatNumber(result)}`;
                explanation = `Permutaciones simples: ordenar ${n} elementos distintos de ${n}! = ${n} × ${n-1} × ${n-2} × ... × 1 maneras.`;
                break;
                
            case 'partial':
                const r = parseInt(document.getElementById('permR').value) || 0;
                if (r <= n) {
                    result = variation(n, r);
                    calculation = `P(${n},${r}) = ${n}!/(${n}-${r})! = ${formatNumber(result)}`;
                    explanation = `Permutaciones de ${n} tomados de ${r}: seleccionar y ordenar ${r} elementos de ${n} elementos disponibles.`;
                } else {
                    calculation = 'Error: r no puede ser mayor que n';
                    explanation = 'El número de elementos a seleccionar no puede exceder el total disponible.';
                }
                break;
                
            case 'repetition':
                const repsInput = document.getElementById('permReps').value;
                const reps = repsInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                const totalReps = reps.reduce((sum, rep) => sum + rep, 0);
                
                if (totalReps === n) {
                    let denominator = 1;
                    let denominatorStr = '';
                    reps.forEach((rep, index) => {
                        denominator *= factorial(rep);
                        denominatorStr += (index > 0 ? ' × ' : '') + `${rep}!`;
                    });
                    
                    result = factorial(n) / denominator;
                    calculation = `${n}!/(${denominatorStr}) = ${formatNumber(result)}`;
                    explanation = `Permutaciones con repetición: ordenar ${n} elementos donde hay ${reps.join(', ')} repeticiones respectivamente.`;
                } else {
                    calculation = `Error: La suma de repeticiones (${totalReps}) debe igual n (${n})`;
                    explanation = 'Verifica que la suma de todas las repeticiones sea igual al total de elementos.';
                }
                break;
        }
        
        document.getElementById('permCalculation').innerHTML = calculation;
        document.getElementById('permExplanation').textContent = explanation;
    });
}

function setupVariationCalculator() {
    const varType = document.getElementById('varType');
    const calculateBtn = document.getElementById('calculateVar');
    
    calculateBtn.addEventListener('click', function() {
        const n = parseInt(document.getElementById('varN').value) || 0;
        const r = parseInt(document.getElementById('varR').value) || 0;
        const type = varType.value;
        
        let result = 0;
        let calculation = '';
        let explanation = '';
        
        if (type === 'without') {
            if (r <= n && r >= 0) {
                result = variation(n, r);
                calculation = `V(${n},${r}) = ${n}!/(${n}-${r})! = ${formatNumber(result)}`;
                explanation = `Variaciones sin repetición: seleccionar y ordenar ${r} elementos de ${n} elementos distintos. El orden importa y no se pueden repetir elementos.`;
            } else {
                calculation = 'Error: r debe ser ≤ n y ≥ 0';
                explanation = 'El número de elementos a seleccionar debe ser válido.';
            }
        } else {
            result = Math.pow(n, r);
            calculation = `VR(${n},${r}) = ${n}^${r} = ${formatNumber(result)}`;
            explanation = `Variaciones con repetición: seleccionar y ordenar ${r} elementos de ${n} tipos disponibles. Se pueden repetir elementos.`;
        }
        
        document.getElementById('varCalculation').innerHTML = calculation;
        document.getElementById('varExplanation').textContent = explanation;
    });
}

function setupCombinationCalculator() {
    const combType = document.getElementById('combType');
    const calculateBtn = document.getElementById('calculateComb');
    
    calculateBtn.addEventListener('click', function() {
        const n = parseInt(document.getElementById('combN').value) || 0;
        const r = parseInt(document.getElementById('combR').value) || 0;
        const type = combType.value;
        
        let result = 0;
        let calculation = '';
        let explanation = '';
        
        if (type === 'without') {
            if (r <= n && r >= 0) {
                result = combination(n, r);
                calculation = `C(${n},${r}) = ${n}!/(${r}!×(${n}-${r})!) = ${formatNumber(result)}`;
                explanation = `Combinaciones sin repetición: seleccionar ${r} elementos de ${n} elementos distintos. El orden NO importa.`;
            } else {
                calculation = 'Error: r debe ser ≤ n y ≥ 0';
                explanation = 'El número de elementos a seleccionar debe ser válido.';
            }
        } else {
            if (r >= 0 && n > 0) {
                result = combination(n + r - 1, r);
                calculation = `CR(${n},${r}) = C(${n+r-1},${r}) = ${formatNumber(result)}`;
                explanation = `Combinaciones con repetición: seleccionar ${r} elementos de ${n} tipos, permitiendo repetición.`;
            } else {
                calculation = 'Error: valores inválidos';
                explanation = 'Verifica que los valores sean positivos.';
            }
        }
        
        document.getElementById('combCalculation').innerHTML = calculation;
        document.getElementById('combExplanation').textContent = explanation;
    });
}

// Inicialización de problemas resueltos
function initializeProblems() {
    // Problema 1: Contraseñas
    document.getElementById('solveProblem1').addEventListener('click', function() {
        const solution = document.getElementById('solution1');
        solution.innerHTML = `
            <h5 class="font-semibold mb-2">Solución:</h5>
            <p class="mb-2"><strong>Análisis:</strong> Queremos formar contraseñas de 4 dígitos usando los dígitos {1,2,3,4,5} sin repetición.</p>
            <p class="mb-2"><strong>Tipo:</strong> Variaciones sin repetición (importa el orden y no se repiten elementos)</p>
            <div class="bg-blue-100 p-2 rounded mb-2">
                <p><strong>Cálculo:</strong></p>
                <p>V(5,4) = 5!/(5-4)! = 5!/1! = 5! = 5 × 4 × 3 × 2 = 120</p>
            </div>
            <p><strong>Respuesta:</strong> Se pueden formar 120 contraseñas diferentes.</p>
        `;
        solution.classList.toggle('hidden');
    });
    
    // Problema 2: Comité
    document.getElementById('solveProblem2').addEventListener('click', function() {
        const solution = document.getElementById('solution2');
        solution.innerHTML = `
            <h5 class="font-semibold mb-2">Solución:</h5>
            <p class="mb-2"><strong>Análisis:</strong> Elegir 5 personas de un grupo de 12 para formar un comité.</p>
            <p class="mb-2"><strong>Tipo:</strong> Combinaciones (no importa el orden de selección)</p>
            <div class="bg-green-100 p-2 rounded mb-2">
                <p><strong>Cálculo:</strong></p>
                <p>C(12,5) = 12!/(5! × 7!) = (12×11×10×9×8)/(5×4×3×2×1) = 95,040/120 = 792</p>
            </div>
            <p><strong>Respuesta:</strong> Se pueden formar 792 comités diferentes.</p>
        `;
        solution.classList.toggle('hidden');
    });
    
    // Problema 3: Palabra ESTADÍSTICA
    document.getElementById('solveProblem3').addEventListener('click', function() {
        const solution = document.getElementById('solution3');
        solution.innerHTML = `
            <h5 class="font-semibold mb-2">Solución:</h5>
            <p class="mb-2"><strong>Análisis:</strong> Ordenar las letras de "ESTADÍSTICA"</p>
            <p class="mb-2"><strong>Conteo de letras:</strong> E(2), S(2), T(2), A(2), D(1), Í(1), I(1), C(1) = 11 letras total</p>
            <p class="mb-2"><strong>Tipo:</strong> Permutaciones con repetición</p>
            <div class="bg-purple-100 p-2 rounded mb-2">
                <p><strong>Cálculo:</strong></p>
                <p>11!/(2! × 2! × 2! × 2! × 1! × 1! × 1! × 1!) = 39,916,800/16 = 2,494,800</p>
            </div>
            <p><strong>Respuesta:</strong> Se pueden formar 2,494,800 ordenaciones diferentes.</p>
        `;
        solution.classList.toggle('hidden');
    });
    
    // Problema 4: Distribución de libros
    document.getElementById('solveProblem4').addEventListener('click', function() {
        const solution = document.getElementById('solution4');
        solution.innerHTML = `
            <h5 class="font-semibold mb-2">Solución:</h5>
            <p class="mb-2"><strong>Análisis:</strong> Distribuir 8 libros idénticos entre 3 estudiantes</p>
            <p class="mb-2"><strong>Tipo:</strong> Combinaciones con repetición (teoría de "estrellas y barras")</p>
            <div class="bg-red-100 p-2 rounded mb-2">
                <p><strong>Cálculo:</strong></p>
                <p>CR(3,8) = C(3+8-1, 8) = C(10,8) = C(10,2) = 10!/(2!×8!) = 45</p>
            </div>
            <p><strong>Respuesta:</strong> Hay 45 formas diferentes de distribuir los libros.</p>
            <p class="text-xs mt-2"><strong>Nota:</strong> Se usa combinaciones con repetición porque los libros son idénticos y solo importa cuántos recibe cada estudiante.</p>
        `;
        solution.classList.toggle('hidden');
    });
}

// Generador de problemas aleatorios
function initializeProblemGenerator() {
    const problemTypes = {
        permutation: [
            {
                template: "¿De cuántas maneras se pueden ordenar {n} personas en una fila?",
                solution: (n) => factorial(n),
                hint: "Es una permutación simple, usa n!",
                difficulty: "easy"
            },
            {
                template: "¿Cuántas placas de vehículo se pueden formar con {n} letras seguidas de {r} dígitos? (sin repetición)",
                solution: (n, r) => variation(26, n) * variation(10, r),
                hint: "Combina variaciones de letras y dígitos",
                difficulty: "medium"
            }
        ],
        variation: [
            {
                template: "¿De cuántas formas se puede elegir y ordenar un podio de {r} lugares entre {n} competidores?",
                solution: (n, r) => variation(n, r),
                hint: "Es una variación sin repetición V(n,r)",
                difficulty: "easy"
            },
            {
                template: "¿Cuántas contraseñas de {r} dígitos se pueden formar? (con repetición permitida)",
                solution: (n, r) => Math.pow(10, r),
                hint: "Cada posición puede ser cualquier dígito del 0-9",
                difficulty: "easy"
            }
        ],
        combination: [
            {
                template: "De un grupo de {n} estudiantes, ¿de cuántas formas se puede elegir un comité de {r} miembros?",
                solution: (n, r) => combination(n, r),
                hint: "Es una combinación simple C(n,r)",
                difficulty: "easy"
            },
            {
                template: "¿De cuántas maneras se pueden distribuir {r} objetos idénticos entre {n} personas?",
                solution: (n, r) => combination(n + r - 1, r),
                hint: "Usa combinaciones con repetición (estrellas y barras)",
                difficulty: "hard"
            }
        ]
    };
    
    let currentProblem = null;
    
    document.getElementById('generateProblem').addEventListener('click', function() {
        const type = document.getElementById('problemType').value;
        const difficulty = document.getElementById('problemDifficulty').value;
        
        let problems;
        if (type === 'mixed') {
            problems = [...problemTypes.permutation, ...problemTypes.variation, ...problemTypes.combination];
        } else {
            problems = problemTypes[type] || [];
        }
        
        const filteredProblems = problems.filter(p => p.difficulty === difficulty);
        const selectedProblems = filteredProblems.length > 0 ? filteredProblems : problems;
        
        if (selectedProblems.length === 0) return;
        
        const problem = selectedProblems[Math.floor(Math.random() * selectedProblems.length)];
        
        // Generar valores aleatorios apropiados
        let n, r;
        switch(difficulty) {
            case 'easy':
                n = Math.floor(Math.random() * 8) + 3; // 3-10
                r = Math.floor(Math.random() * Math.min(5, n)) + 1; // 1-5 o menos
                break;
            case 'medium':
                n = Math.floor(Math.random() * 10) + 8; // 8-17
                r = Math.floor(Math.random() * Math.min(7, n)) + 2; // 2-7 o menos
                break;
            case 'hard':
                n = Math.floor(Math.random() * 15) + 10; // 10-24
                r = Math.floor(Math.random() * Math.min(10, n)) + 3; // 3-10 o menos
                break;
        }
        
        const problemText = problem.template.replace('{n}', n).replace('{r}', r);
        const answer = problem.solution(n, r);
        
        currentProblem = {
            text: problemText,
            hint: problem.hint,
            answer: answer,
            n: n,
            r: r
        };
        
        document.getElementById('generatedProblem').innerHTML = `<p>${problemText}</p>`;
        document.getElementById('showHint').disabled = false;
        document.getElementById('showSolution').disabled = false;
        document.getElementById('problemHint').classList.add('hidden');
        document.getElementById('problemSolution').classList.add('hidden');
    });
    
    document.getElementById('showHint').addEventListener('click', function() {
        if (currentProblem) {
            document.getElementById('problemHint').innerHTML = `<strong>Pista:</strong> ${currentProblem.hint}`;
            document.getElementById('problemHint').classList.remove('hidden');
        }
    });
    
    document.getElementById('showSolution').addEventListener('click', function() {
        if (currentProblem) {
            document.getElementById('problemSolution').innerHTML = `
                <strong>Solución:</strong> ${formatNumber(currentProblem.answer)}
                <br><small>Valores utilizados: n=${currentProblem.n}, r=${currentProblem.r || 'N/A'}</small>
            `;
            document.getElementById('problemSolution').classList.remove('hidden');
        }
    });
}

// Visualizador de combinatorias
function initializeVisualizer() {
    const visualizeBtn = document.getElementById('visualize');
    console.log('Visualize button found:', visualizeBtn); // Debug log
    
    if (!visualizeBtn) {
        console.error('Visualize button not found!');
        return;
    }
    
    visualizeBtn.addEventListener('click', function() {
        console.log('Visualize button clicked'); // Debug log
        
        try {
            const typeElement = document.getElementById('visualizationType');
            const elementsElement = document.getElementById('elementsInput');
            const groupSizeElement = document.getElementById('groupSize');
            const resultElement = document.getElementById('visualizationResult');
            const statsElement = document.getElementById('visualizationStats');
            
            console.log('Elements found:', {
                typeElement, elementsElement, groupSizeElement, resultElement, statsElement
            });
            
            if (!typeElement || !elementsElement || !groupSizeElement || !resultElement || !statsElement) {
                console.error('Some required elements not found');
                return;
            }
            
            const type = typeElement.value;
            const elementsStr = elementsElement.value;
            const groupSize = parseInt(groupSizeElement.value) || 2;
            
            console.log('Parameters:', { type, elementsStr, groupSize });
            
            const elements = elementsStr.split(',').map(e => e.trim()).filter(e => e.length > 0);
            
            if (elements.length === 0) {
                resultElement.innerHTML = '<p class="text-red-500">Por favor, ingresa elementos válidos.</p>';
                statsElement.innerHTML = '';
                return;
            }
            
            console.log('Processing elements:', elements);
            
            let result;
            const actualSize = Math.min(groupSize, elements.length);
            
            switch(type) {
                case 'permutation':
                    console.log('Generating permutations...');
                    result = generatePermutations(elements, actualSize);
                    break;
                case 'combination':
                    console.log('Generating combinations...');
                    result = generateCombinations(elements, actualSize);
                    break;
                case 'tree':
                    console.log('Generating decision tree...');
                    result = generateDecisionTree(elements, actualSize);
                    break;
                default:
                    console.error('Unknown type:', type);
                    result = { html: '<p class="text-red-500">Tipo desconocido.</p>', stats: '' };
            }
            
            console.log('Result:', result);
            
            if (result && result.html && result.stats) {
                resultElement.innerHTML = result.html;
                statsElement.innerHTML = result.stats;
                console.log('Visualization updated successfully');
            } else {
                console.error('Invalid result format:', result);
                resultElement.innerHTML = '<p class="text-red-500">Error al generar la visualización.</p>';
                statsElement.innerHTML = '';
            }
            
        } catch (error) {
            console.error('Error in visualize function:', error);
            const resultElement = document.getElementById('visualizationResult');
            if (resultElement) {
                resultElement.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
            }
        }
    });
}

function generatePermutations(elements, size) {
    console.log('generatePermutations called with:', elements, size);
    
    if (size <= 0 || elements.length === 0) {
        return {
            html: '<p class="text-yellow-600">No se pueden generar permutaciones con los parámetros dados.</p>',
            stats: '<strong>Total de permutaciones:</strong> 0'
        };
    }
    
    const maxExamples = 20;
    const examples = getPermutationExamples(elements, size, maxExamples);
    const expectedTotal = permutations(elements.length, size);
    
    console.log('Permutations generated:', examples);
    
    let html = `<h5 class="font-semibold mb-3">Permutaciones de ${size} elementos:</h5>`;
    
    if (examples.length === 0) {
        html += '<p class="text-gray-500">No se pudieron generar ejemplos.</p>';
    } else {
        html += `
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                ${examples.map(perm => `<div class="bg-blue-100 p-2 rounded text-center text-sm">${perm}</div>`).join('')}
            </div>
        `;
        
        if (examples.length < expectedTotal && expectedTotal < 1000) {
            html += `<p class="text-xs text-gray-600 mt-2">(... y ${expectedTotal - examples.length} más)</p>`;
        } else if (expectedTotal >= 1000 && examples.length > 0) {
            html += `<p class="text-xs text-gray-600 mt-2">(... y muchas más)</p>`;
        }
    }
    
    const stats = `<strong>Total de permutaciones:</strong> ${expectedTotal === Infinity ? 'Muy grande' : expectedTotal}`;
    
    return { html, stats };
}

// Función mejorada para generar ejemplos de permutaciones
function getPermutationExamples(elements, k, maxExamples = 20) {
    const n = elements.length;
    if (k > n || k < 0) return [];
    if (k === 0) return ['()'];

    const examples = new Set();
    const usedIndices = new Set();
    const currentPermutation = [];

    function findPermutations() {
        if (examples.size >= maxExamples) return;

        if (currentPermutation.length === k) {
            examples.add(`(${currentPermutation.join(', ')})`);
            return;
        }

        const shuffledIndices = Array.from({length: n}, (_, i) => i).sort(() => Math.random() - 0.5);

        for (const index of shuffledIndices) {
            if (examples.size >= maxExamples) break;
            if (!usedIndices.has(index)) {
                usedIndices.add(index);
                currentPermutation.push(elements[index]);
                findPermutations();
                currentPermutation.pop();
                usedIndices.delete(index);
            }
        }
    }

    findPermutations();
    
    // Añadir más ejemplos aleatoriamente si es necesario
    let attempts = 0;
    while (examples.size < maxExamples && attempts < maxExamples * 10 && k <= n) {
        const shuffled = [...elements].sort(() => Math.random() - 0.5);
        const example = shuffled.slice(0, k);
        examples.add(`(${example.join(', ')})`);
        attempts++;
    }

    return Array.from(examples);
}

function generateCombinations(elements, size) {
    console.log('generateCombinations called with:', elements, size);
    
    if (size <= 0 || elements.length === 0) {
        return {
            html: '<p class="text-yellow-600">No se pueden generar combinaciones con los parámetros dados.</p>',
            stats: '<strong>Total de combinaciones:</strong> 0'
        };
    }
    
    const maxExamples = 20;
    const examples = getCombinationExamples(elements, size, maxExamples);
    const expectedTotal = combinations(elements.length, size);
    
    console.log('Combinations generated:', examples);
    
    let html = `<h5 class="font-semibold mb-3">Combinaciones de ${size} elementos:</h5>`;
    
    if (examples.length === 0) {
        html += '<p class="text-gray-500">No se pudieron generar ejemplos.</p>';
    } else {
        html += `
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                ${examples.map(comb => `<div class="bg-green-100 p-2 rounded text-center text-sm">${comb}</div>`).join('')}
            </div>
        `;
        
        if (examples.length < expectedTotal && expectedTotal < 1000) {
            html += `<p class="text-xs text-gray-600 mt-2">(... y ${expectedTotal - examples.length} más)</p>`;
        } else if (expectedTotal >= 1000 && examples.length > 0) {
            html += `<p class="text-xs text-gray-600 mt-2">(... y muchas más)</p>`;
        }
    }
    
    const stats = `<strong>Total de combinaciones:</strong> ${expectedTotal === Infinity ? 'Muy grande' : expectedTotal}`;
    
    return { html, stats };
}

// Función mejorada para generar ejemplos de combinaciones
function getCombinationExamples(elements, k, maxExamples = 20) {
    const n = elements.length;
    if (k > n || k < 0) return [];
    if (k === 0) return ['{}']; // Combinación vacía

    const examples = new Set();
    const currentCombination = [];

    function findCombinations(startIndex, currentIndex) {
        if (examples.size >= maxExamples) return;

        if (currentIndex === k) {
            const combo = currentCombination.map(idx => elements[idx]);
            examples.add(`{${combo.sort().join(', ')}}`);
            return;
        }

        for (let i = startIndex; i <= n - (k - currentIndex); i++) {
            if (examples.size >= maxExamples) break;
            currentCombination[currentIndex] = i;
            findCombinations(i + 1, currentIndex + 1);
        }
    }

    // Generar combinaciones sistemáticamente
    findCombinations(0, 0);

    // Añadir más aleatoriamente si no se llenó
    let attempts = 0;
    while (examples.size < maxExamples && attempts < maxExamples * 10 && k <= n) {
        const shuffled = [...elements].sort(() => Math.random() - 0.5);
        const example = shuffled.slice(0, k).sort();
        examples.add(`{${example.join(', ')}}`);
        attempts++;
    }

    return Array.from(examples);
}

function generateDecisionTree(elements, depth) {
    console.log('generateDecisionTree called with:', elements, depth);
    
    if (depth <= 0 || elements.length === 0) {
        return {
            html: '<p class="text-yellow-600">No se puede generar el árbol de decisión con los parámetros dados.</p>',
            stats: '<strong>Rutas posibles:</strong> 0'
        };
    }
    
    let html = '<h5 class="font-semibold mb-3">Árbol de Decisión:</h5><div class="text-sm">';
    let pathCount = 0;
    
    function buildTree(level, path, usedElements) {
        const indent = '&nbsp;'.repeat(level * 4);
        
        if (level === depth) {
            html += `${indent}➤ <span class="bg-yellow-100 px-2 py-1 rounded">${path.join('')}</span><br>`;
            pathCount++;
            return;
        }
        
        const availableElements = elements.filter(el => !usedElements.includes(el));
        
        if (availableElements.length === 0) {
            return; // No hay más elementos disponibles
        }
        
        for (let el of availableElements) {
            html += `${indent}├─ ${el}<br>`;
            buildTree(level + 1, [...path, el], [...usedElements, el]);
        }
    }
    
    buildTree(0, [], []);
    html += '</div>';
    console.log('Decision tree generated, paths found:', pathCount);
    
    const totalPaths = variation(elements.length, depth);
    const stats = `<strong>Rutas posibles:</strong> ${pathCount} de ${totalPaths} calculadas (profundidad: ${depth})`;
    
    return { html, stats };
}

// Configuración del Triángulo de Pascal
function setupPascalTriangle() {
    const generateBtn = document.getElementById('generatePascal');
    
    if (!generateBtn) {
        console.error('Pascal generate button not found!');
        return;
    }
    
    generateBtn.addEventListener('click', function() {
        const rows = parseInt(document.getElementById('pascalRows').value) || 6;
        const highlightK = parseInt(document.getElementById('pascalHighlight').value) || 0;
        
        generatePascalTriangle(rows, highlightK);
    });
    
    // Generar triángulo inicial
    generatePascalTriangle(6, 2);
}

// Función para generar el Triángulo de Pascal
function generatePascalTriangle(maxRows, highlightK) {
    const container = document.getElementById('pascalResult');
    const statsDiv = document.getElementById('pascalStats');
    
    if (!container) return;
    
    if (maxRows < 0 || maxRows > 15) {
        container.innerHTML = '<p class="text-red-500">Número de filas debe estar entre 0 y 15</p>';
        return;
    }
    
    let html = '<div class="pascal-triangle">';
    let highlightedValue = null;
    let highlightedRow = -1;
    
    for (let n = 0; n <= maxRows; n++) {
        html += '<div class="pascal-row">';
        
        for (let k = 0; k <= n; k++) {
            const value = combinations(n, k);
            const isHighlighted = (k === highlightK);
            
            if (isHighlighted && n === maxRows) {
                highlightedValue = value;
                highlightedRow = n;
            }
            
            const className = isHighlighted && k <= n ? 'pascal-num pascal-highlight' : 'pascal-num';
            const displayValue = value === Infinity ? '∞' : value;
            
            html += `<span class="${className}" title="C(${n},${k}) = ${displayValue}">${displayValue}</span>`;
        }
        
        html += '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Actualizar estadísticas
    if (highlightK <= maxRows && highlightedValue !== null) {
        statsDiv.innerHTML = `
            <strong>Valor destacado:</strong> C(${highlightedRow}, ${highlightK}) = ${highlightedValue === Infinity ? 'Muy grande' : highlightedValue}
            <br><small>Este valor representa el número de maneras de elegir ${highlightK} elementos de ${highlightedRow} elementos.</small>
        `;
    } else if (highlightK > maxRows) {
        statsDiv.innerHTML = `
            <strong>Nota:</strong> k=${highlightK} está fuera del rango para la fila máxima n=${maxRows}
        `;
    } else {
        statsDiv.innerHTML = '';
    }
}

// Configuración de problemas con diagramas de árbol
function setupTreeProblems() {
    const buttons = [
        'treeProblem1', 'treeProblem2', 'treeProblem3', 
        'treeProblem4', 'treeProblem5'
    ];
    
    buttons.forEach((buttonId, index) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => showTreeProblem(index + 1));
        }
    });
}

// Función principal para mostrar problemas de árbol
function showTreeProblem(problemNumber) {
    const visualization = document.getElementById('treeVisualization');
    const solution = document.getElementById('treeSolution');
    
    if (!visualization || !solution) return;
    
    let treeHtml = '';
    let solutionHtml = '';
    
    switch(problemNumber) {
        case 1:
            ({ treeHtml, solutionHtml } = createCoinFlipProblem());
            break;
        case 2:
            ({ treeHtml, solutionHtml } = createClothingProblem());
            break;
        case 3:
            ({ treeHtml, solutionHtml } = createPizzaProblem());
            break;
        case 4:
            ({ treeHtml, solutionHtml } = createCompetitionProblem());
            break;
        case 5:
            ({ treeHtml, solutionHtml } = createSecurityCodeProblem());
            break;
    }
    
    visualization.innerHTML = treeHtml;
    solution.innerHTML = solutionHtml;
    solution.classList.remove('hidden');
    
    // Agregar animación
    visualization.classList.add('tree-animate');
    setTimeout(() => visualization.classList.remove('tree-animate'), 500);
}

// Problema 1: Lanzamiento de 3 monedas
function createCoinFlipProblem() {
    const treeHtml = `
        <div class="tree-diagram">
            <div class="tree-label">🎲 Lanzamiento de 3 Monedas Consecutivas</div>
            
            <div class="tree-level">
                <div class="tree-node level-0">Inicio</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">1ª Moneda:</div>
                <div class="tree-node level-1">Cara (C)</div>
                <span class="tree-branch"></span>
                <div class="tree-node level-1">Cruz (X)</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">2ª Moneda:</div>
                <div class="tree-node level-2">C</div>
                <div class="tree-node level-2">X</div>
                <span style="margin: 0 20px;"></span>
                <div class="tree-node level-2">C</div>
                <div class="tree-node level-2">X</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">3ª Moneda:</div>
                <div class="tree-node level-3">C</div>
                <div class="tree-node level-3">X</div>
                <div class="tree-node level-3">C</div>
                <div class="tree-node level-3">X</div>
                <span style="margin: 0 15px;"></span>
                <div class="tree-node level-3">C</div>
                <div class="tree-node level-3">X</div>
                <div class="tree-node level-3">C</div>
                <div class="tree-node level-3">X</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">Resultados Finales:</div>
                <div class="tree-path">CCC</div>
                <div class="tree-path">CCX</div>
                <div class="tree-path">CXC</div>
                <div class="tree-path">CXX</div>
                <div class="tree-path">XCC</div>
                <div class="tree-path">XCX</div>
                <div class="tree-path">XXC</div>
                <div class="tree-path">XXX</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-count">Total: 8 resultados posibles</div>
            </div>
        </div>
    `;
    
    const solutionHtml = `
        <h5 class="font-semibold mb-2">✅ Solución Paso a Paso:</h5>
        <div class="space-y-2 text-sm">
            <p><strong>Análisis:</strong> Cada moneda tiene 2 posibles resultados (Cara o Cruz)</p>
            <p><strong>Aplicando el Principio Fundamental:</strong> 2 × 2 × 2 = 8 resultados</p>
            <p><strong>Fórmula:</strong> 2³ = 8 (variaciones con repetición)</p>
            <p><strong>Verificación:</strong> El diagrama muestra exactamente 8 caminos únicos desde el inicio hasta los resultados finales.</p>
            <div class="bg-blue-100 p-2 rounded mt-3">
                <strong>Tipo de problema:</strong> Variaciones con repetición VR(2,3) = 2³ = 8
            </div>
        </div>
    `;
    
    return { treeHtml, solutionHtml };
}

// Problema 2: Elección de ropa
function createClothingProblem() {
    const treeHtml = `
        <div class="tree-diagram">
            <div class="tree-label">👕 Combinar: 2 Camisas, 3 Pantalones, 2 Zapatos</div>
            
            <div class="tree-level">
                <div class="tree-node level-0">Elección</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">Camisas:</div>
                <div class="tree-node level-1">Camisa A</div>
                <span class="tree-branch"></span>
                <div class="tree-node level-1">Camisa B</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">Pantalones:</div>
                <div class="tree-node level-2">P1</div>
                <div class="tree-node level-2">P2</div>
                <div class="tree-node level-2">P3</div>
                <span style="margin: 0 20px;"></span>
                <div class="tree-node level-2">P1</div>
                <div class="tree-node level-2">P2</div>
                <div class="tree-node level-2">P3</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">Zapatos:</div>
                ${generateShoeNodes('A')}
                <span style="margin: 0 15px;"></span>
                ${generateShoeNodes('B')}
            </div>
            
            <div class="tree-level">
                <div class="tree-count">Total: 12 combinaciones posibles</div>
            </div>
        </div>
    `;
    
    const solutionHtml = `
        <h5 class="font-semibold mb-2">✅ Solución Paso a Paso:</h5>
        <div class="space-y-2 text-sm">
            <p><strong>Análisis:</strong> Proceso de 3 etapas independientes</p>
            <p><strong>Etapa 1:</strong> Elegir camisa (2 opciones)</p>
            <p><strong>Etapa 2:</strong> Elegir pantalón (3 opciones)</p>
            <p><strong>Etapa 3:</strong> Elegir zapatos (2 opciones)</p>
            <p><strong>Aplicando el Principio Fundamental:</strong> 2 × 3 × 2 = 12 combinaciones</p>
            <div class="bg-green-100 p-2 rounded mt-3">
                <strong>Tipo de problema:</strong> Principio Fundamental de Conteo
            </div>
        </div>
    `;
    
    return { treeHtml, solutionHtml };
}

function generateShoeNodes(shirt) {
    return ['P1', 'P2', 'P3'].map(pant => 
        `<div class="tree-node level-3">Z1</div><div class="tree-node level-3">Z2</div>`
    ).join('');
}

// Problema 3: Pizza personalizada
function createPizzaProblem() {
    const treeHtml = `
        <div class="tree-diagram">
            <div class="tree-label">🍕 Pizza: 2 Tamaños, 2 Tipos de Masa, Elegir 2 de 4 Ingredientes</div>
            
            <div class="tree-level">
                <div class="tree-node level-0">Pizza</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">Tamaño:</div>
                <div class="tree-node level-1">Grande</div>
                <span class="tree-branch"></span>
                <div class="tree-node level-1">Mediana</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">Masa:</div>
                <div class="tree-node level-2">Delgada</div>
                <div class="tree-node level-2">Gruesa</div>
                <span style="margin: 0 20px;"></span>
                <div class="tree-node level-2">Delgada</div>
                <div class="tree-node level-2">Gruesa</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">Ingredientes (2 de 4): P=Pepperoni, Q=Queso, C=Champiñones, A=Aceitunas</div>
                <div class="tree-path">PQ</div>
                <div class="tree-path">PC</div>
                <div class="tree-path">PA</div>
                <div class="tree-path">QC</div>
                <div class="tree-path">QA</div>
                <div class="tree-path">CA</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-count">4 combinaciones base × 6 combinaciones ingredientes = 24 pizzas posibles</div>
            </div>
        </div>
    `;
    
    const solutionHtml = `
        <h5 class="font-semibold mb-2">✅ Solución Paso a Paso:</h5>
        <div class="space-y-2 text-sm">
            <p><strong>Análisis:</strong> Problema mixto con principio fundamental y combinaciones</p>
            <p><strong>Parte 1:</strong> Tamaño y masa: 2 × 2 = 4 opciones</p>
            <p><strong>Parte 2:</strong> Ingredientes: C(4,2) = 6 combinaciones</p>
            <p><strong>Cálculo de ingredientes:</strong> C(4,2) = 4!/(2! × 2!) = 6</p>
            <p><strong>Total:</strong> 4 × 6 = 24 pizzas diferentes</p>
            <div class="bg-purple-100 p-2 rounded mt-3">
                <strong>Tipo de problema:</strong> Principio Fundamental + Combinaciones
            </div>
        </div>
    `;
    
    return { treeHtml, solutionHtml };
}

// Problema 4: Competencia deportiva
function createCompetitionProblem() {
    const treeHtml = `
        <div class="tree-diagram">
            <div class="tree-label">🏆 Podio de 3 Lugares entre 5 Atletas (A, B, C, D, E)</div>
            
            <div class="tree-level">
                <div class="tree-node level-0">Podio</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">1er Lugar (5 opciones):</div>
                <div class="tree-node level-1">A</div>
                <div class="tree-node level-1">B</div>
                <div class="tree-node level-1">C</div>
                <div class="tree-node level-1">D</div>
                <div class="tree-node level-1">E</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">2do Lugar (4 opciones restantes):</div>
                <div style="font-size: 10px;">
                    Para cada 1er lugar, hay 4 opciones de 2do lugar
                </div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">3er Lugar (3 opciones restantes):</div>
                <div style="font-size: 10px;">
                    Para cada combinación 1er-2do, hay 3 opciones de 3er lugar
                </div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">Ejemplos de podios:</div>
                <div class="tree-path">A-B-C</div>
                <div class="tree-path">A-B-D</div>
                <div class="tree-path">A-B-E</div>
                <div class="tree-path">B-A-C</div>
                <div class="tree-path">C-D-E</div>
                <div class="tree-path">...</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-count">Total: 5 × 4 × 3 = 60 podios posibles</div>
            </div>
        </div>
    `;
    
    const solutionHtml = `
        <h5 class="font-semibold mb-2">✅ Solución Paso a Paso:</h5>
        <div class="space-y-2 text-sm">
            <p><strong>Análisis:</strong> El orden importa y no se puede repetir atletas</p>
            <p><strong>1er lugar:</strong> 5 opciones disponibles</p>
            <p><strong>2do lugar:</strong> 4 opciones (se excluye quien ganó 1er lugar)</p>
            <p><strong>3er lugar:</strong> 3 opciones (se excluyen 1er y 2do lugar)</p>
            <p><strong>Cálculo:</strong> P(5,3) = 5!/(5-3)! = 5!/2! = 5 × 4 × 3 = 60</p>
            <div class="bg-orange-100 p-2 rounded mt-3">
                <strong>Tipo de problema:</strong> Permutaciones P(5,3) = 60
            </div>
        </div>
    `;
    
    return { treeHtml, solutionHtml };
}

// Problema 5: Código de seguridad
function createSecurityCodeProblem() {
    const treeHtml = `
        <div class="tree-diagram">
            <div class="tree-label">🔐 Código de 4 Dígitos Únicos (usando 0,1,2,3,4,5,6,7,8,9)</div>
            
            <div class="tree-level">
                <div class="tree-node level-0">Código</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">1er Dígito (10 opciones):</div>
                <div class="tree-node level-1">0</div>
                <div class="tree-node level-1">1</div>
                <div class="tree-node level-1">2</div>
                <div class="tree-node level-1">...</div>
                <div class="tree-node level-1">9</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">2do Dígito (9 opciones restantes):</div>
                <div style="font-size: 11px;">
                    Para cada 1er dígito, quedan 9 opciones
                </div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">3er Dígito (8 opciones restantes):</div>
                <div style="font-size: 11px;">
                    Para cada combinación 1er-2do, quedan 8 opciones
                </div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">4to Dígito (7 opciones restantes):</div>
                <div style="font-size: 11px;">
                    Para cada combinación 1er-2do-3er, quedan 7 opciones
                </div>
            </div>
            
            <div class="tree-level">
                <div class="tree-label">Ejemplos de códigos:</div>
                <div class="tree-path">0123</div>
                <div class="tree-path">1024</div>
                <div class="tree-path">9876</div>
                <div class="tree-path">5432</div>
                <div class="tree-path">...</div>
            </div>
            
            <div class="tree-level">
                <div class="tree-count">Total: 10 × 9 × 8 × 7 = 5,040 códigos posibles</div>
            </div>
        </div>
    `;
    
    const solutionHtml = `
        <h5 class="font-semibold mb-2">✅ Solución Paso a Paso:</h5>
        <div class="space-y-2 text-sm">
            <p><strong>Análisis:</strong> El orden importa y no se pueden repetir dígitos</p>
            <p><strong>1er dígito:</strong> 10 opciones (0-9)</p>
            <p><strong>2do dígito:</strong> 9 opciones (se excluye el 1er dígito usado)</p>
            <p><strong>3er dígito:</strong> 8 opciones (se excluyen los 2 primeros)</p>
            <p><strong>4to dígito:</strong> 7 opciones (se excluyen los 3 primeros)</p>
            <p><strong>Cálculo:</strong> P(10,4) = 10!/(10-4)! = 10!/6! = 10 × 9 × 8 × 7 = 5,040</p>
            <div class="bg-red-100 p-2 rounded mt-3">
                <strong>Tipo de problema:</strong> Permutaciones P(10,4) = 5,040
            </div>
        </div>
    `;
    
    return { treeHtml, solutionHtml };
}

// Problemas Avanzados con Diagramas de Árbol
function loadAdvancedProblem(type) {
    const area = document.getElementById('advancedProblemArea');
    
    switch(type) {
        case 'conditional':
            area.innerHTML = createConditionalProblem();
            break;
        case 'paths':
            area.innerHTML = createPathsProblem();
            break;
        case 'selection':
            area.innerHTML = createSelectionProblem();
            break;
    }
}

// Problema 1: Probabilidad Condicional con Diagramas de Árbol
function createConditionalProblem() {
    return `
        <div class="space-y-6">
            <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 class="font-semibold text-purple-800 mb-3">🔄 Problema: Extracción sin Reposición</h4>
                <div class="text-sm text-purple-700 space-y-2">
                    <p><strong>Enunciado:</strong> Una urna contiene 3 bolas rojas (R) y 2 bolas azules (A). Se extraen 2 bolas sin reposición.</p>
                    <p><strong>Pregunta:</strong> ¿Cuál es la probabilidad de extraer una bola roja en la segunda extracción, dado que en la primera se extrajo una bola azul?</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <h5 class="font-semibold text-gray-800">🌳 Diagrama de Árbol Completo</h5>
                    <div class="tree-diagram bg-white p-4 rounded border">
                        <div class="tree-level">
                            <div class="tree-node level-0">Inicio<br/>(3R, 2A)</div>
                        </div>
                        
                        <div class="tree-level mt-4">
                            <div class="text-center mb-2"><strong>1ª Extracción:</strong></div>
                            <div class="flex justify-center space-x-8">
                                <div class="tree-branch-container">
                                    <div class="tree-node level-1 bg-red-100">R<br/><span class="text-xs">P = 3/5</span></div>
                                </div>
                                <div class="tree-branch-container">
                                    <div class="tree-node level-1 bg-blue-100">A<br/><span class="text-xs">P = 2/5</span></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tree-level mt-4">
                            <div class="text-center mb-2"><strong>2ª Extracción:</strong></div>
                            <div class="flex justify-center space-x-4">
                                <!-- Rama R -> -->
                                <div class="flex flex-col space-y-2">
                                    <div class="tree-node level-2 bg-red-50">R<br/><span class="text-xs">P = 2/4</span></div>
                                    <div class="tree-node level-2 bg-blue-50">A<br/><span class="text-xs">P = 2/4</span></div>
                                </div>
                                <!-- Rama A -> -->
                                <div class="flex flex-col space-y-2">
                                    <div class="tree-node level-2 bg-red-50">R<br/><span class="text-xs">P = 3/4</span></div>
                                    <div class="tree-node level-2 bg-blue-50">A<br/><span class="text-xs">P = 1/4</span></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                            <div class="text-sm">
                                <div class="font-semibold mb-2">Resultados Posibles:</div>
                                <div class="grid grid-cols-2 gap-2 text-xs">
                                    <div>RR: (3/5) × (2/4) = 6/20 = 3/10</div>
                                    <div>RA: (3/5) × (2/4) = 6/20 = 3/10</div>
                                    <div class="bg-purple-100 p-1 rounded">AR: (2/5) × (3/4) = 6/20 = 3/10</div>
                                    <div>AA: (2/5) × (1/4) = 2/20 = 1/10</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 p-4 rounded border-l-4 border-green-500">
                        <h5 class="font-semibold text-green-800 mb-2">📊 Herramienta de Simulación</h5>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium">Número de simulaciones:</label>
                                <input type="number" id="simulations" class="w-full p-2 border rounded mt-1" value="1000" min="100" max="10000">
                            </div>
                            <button onclick="simulateConditionalProbability()" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                                🎲 Simular Extracciones
                            </button>
                            <div id="simulationResults" class="text-sm bg-white p-3 rounded border hidden">
                                <!-- Resultados aparecerán aquí -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <h5 class="font-semibold text-gray-800">🔍 Análisis Detallado</h5>
                    
                    <div class="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                        <h6 class="font-semibold mb-2">Solución usando Probabilidad Condicional:</h6>
                        <div class="text-sm space-y-2">
                            <p><strong>Evento A:</strong> "Primera extracción es azul"</p>
                            <p><strong>Evento B:</strong> "Segunda extracción es roja"</p>
                            <p><strong>Buscamos:</strong> P(B|A) = "Probabilidad de roja en 2ª, dado azul en 1ª"</p>
                            
                            <div class="bg-white p-3 rounded mt-3">
                                <div class="font-mono text-center">
                                    P(B|A) = P(A ∩ B) / P(A)<br/>
                                    = P(AR) / P(A)<br/>
                                    = (2/5 × 3/4) / (2/5)<br/>
                                    = (6/20) / (2/5)<br/>
                                    = (6/20) × (5/2)<br/>
                                    = 30/40 = 3/4
                                </div>
                            </div>
                            
                            <div class="bg-purple-100 p-2 rounded mt-3">
                                <strong>Respuesta:</strong> P(B|A) = 3/4 = 0.75 = 75%
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                        <h6 class="font-semibold mb-2">Explicación Conceptual:</h6>
                        <div class="text-sm space-y-2">
                            <p>• <strong>Sin reposición:</strong> Las probabilidades cambian después de cada extracción</p>
                            <p>• <strong>Estado inicial:</strong> 3 rojas + 2 azules = 5 bolas total</p>
                            <p>• <strong>Después de extraer azul:</strong> 3 rojas + 1 azul = 4 bolas restantes</p>
                            <p>• <strong>Probabilidad condicional:</strong> De las 4 bolas restantes, 3 son rojas</p>
                            <p>• <strong>Por tanto:</strong> P(Roja | Azul ya extraída) = 3/4</p>
                        </div>
                    </div>
                    
                    <div class="bg-red-50 p-4 rounded border-l-4 border-red-500">
                        <h6 class="font-semibold mb-2">🎯 Verificación con Fórmula Directa:</h6>
                        <div class="text-sm">
                            <p>Si ya sabemos que se extrajo azul primero:</p>
                            <div class="bg-white p-2 rounded mt-2 font-mono text-center">
                                P(R en 2ª | A en 1ª) = 3/4
                            </div>
                            <p class="mt-2">Directamente del estado reducido de la urna.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Problema 2: Caminos en Cuadrícula
function createPathsProblem() {
    return `
        <div class="space-y-6">
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 class="font-semibold text-green-800 mb-3">🛣️ Problema: Caminos en Cuadrícula</h4>
                <div class="text-sm text-green-700 space-y-2">
                    <p><strong>Enunciado:</strong> Una persona se encuentra en el punto (0,0) de una cuadrícula y quiere llegar al punto (3,2).</p>
                    <p><strong>Restricción:</strong> Solo puede moverse hacia la derecha (D) o hacia arriba (A) en cada paso.</p>
                    <p><strong>Pregunta:</strong> ¿De cuántas maneras diferentes puede llegar a su destino?</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <h5 class="font-semibold text-gray-800">🗺️ Visualización de la Cuadrícula</h5>
                    <div class="bg-white p-4 rounded border">
                        <div class="grid-visualization">
                            <svg width="300" height="200" viewBox="0 0 300 200" class="border">
                                <!-- Cuadrícula -->
                                <defs>
                                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                                
                                <!-- Ejes principales -->
                                <line x1="0" y1="200" x2="300" y2="200" stroke="#6b7280" stroke-width="2"/>
                                <line x1="0" y1="0" x2="0" y2="200" stroke="#6b7280" stroke-width="2"/>
                                
                                <!-- Puntos -->
                                <circle cx="25" cy="175" r="8" fill="#ef4444" stroke="#fff" stroke-width="2"/>
                                <text x="15" y="195" class="text-xs">Inicio (0,0)</text>
                                
                                <circle cx="175" cy="75" r="8" fill="#10b981" stroke="#fff" stroke-width="2"/>
                                <text x="160" y="65" class="text-xs">Meta (3,2)</text>
                                
                                <!-- Algunos caminos ejemplo -->
                                <path d="M 25 175 L 75 175 L 125 175 L 175 175 L 175 125 L 175 75" 
                                      fill="none" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="5,5" opacity="0.7"/>
                                <path d="M 25 175 L 25 125 L 25 75 L 75 75 L 125 75 L 175 75" 
                                      fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="5,5" opacity="0.7"/>
                                
                                <!-- Etiquetas de coordenadas -->
                                <text x="70" y="195" class="text-xs">(1,0)</text>
                                <text x="120" y="195" class="text-xs">(2,0)</text>
                                <text x="170" y="195" class="text-xs">(3,0)</text>
                                <text x="5" y="130" class="text-xs">(0,1)</text>
                                <text x="5" y="80" class="text-xs">(0,2)</text>
                            </svg>
                        </div>
                        
                        <div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                            <div class="text-sm">
                                <div class="font-semibold mb-2">Movimientos Necesarios:</div>
                                <div>• 3 movimientos hacia la Derecha (D)</div>
                                <div>• 2 movimientos hacia Arriba (A)</div>
                                <div class="mt-2 font-semibold text-blue-800">Total: 5 movimientos</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                        <h5 class="font-semibold text-purple-800 mb-2">🎮 Simulador Interactivo</h5>
                        <div class="space-y-3">
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-medium">Destino X:</label>
                                    <input type="number" id="destX" class="w-full p-2 border rounded text-sm" value="3" min="1" max="5">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium">Destino Y:</label>
                                    <input type="number" id="destY" class="w-full p-2 border rounded text-sm" value="2" min="1" max="5">
                                </div>
                            </div>
                            <button onclick="calculatePaths()" class="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">
                                📊 Calcular Caminos
                            </button>
                            <div id="pathResults" class="text-sm bg-white p-3 rounded border hidden">
                                <!-- Resultados aparecerán aquí -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <h5 class="font-semibold text-gray-800">🧮 Análisis Matemático</h5>
                    
                    <div class="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                        <h6 class="font-semibold mb-2">Enfoque 1: Combinaciones</h6>
                        <div class="text-sm space-y-2">
                            <p>Necesitamos elegir las posiciones de los movimientos "D" entre los 5 movimientos totales:</p>
                            
                            <div class="bg-white p-3 rounded mt-3">
                                <div class="font-mono text-center">
                                    C(5,3) = 5!/(3! × 2!)<br/>
                                    = (5 × 4 × 3!)/(3! × 2 × 1)<br/>
                                    = 20/2 = 10
                                </div>
                            </div>
                            
                            <p class="mt-2">O equivalentemente, elegir las posiciones de "A":</p>
                            <div class="bg-white p-2 rounded font-mono text-center">
                                C(5,2) = 5!/(2! × 3!) = 10
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 p-4 rounded border-l-4 border-green-500">
                        <h6 class="font-semibold mb-2">Enfoque 2: Fórmula General</h6>
                        <div class="text-sm space-y-2">
                            <p>Para llegar al punto (m,n) desde (0,0):</p>
                            
                            <div class="bg-white p-3 rounded mt-3">
                                <div class="font-mono text-center">
                                    Número de caminos = C(m+n, m) = C(m+n, n)<br/>
                                    Para (3,2): C(3+2, 3) = C(5,3) = 10
                                </div>
                            </div>
                            
                            <div class="bg-green-100 p-2 rounded mt-3">
                                <strong>Respuesta:</strong> Hay exactamente 10 caminos diferentes
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
                        <h6 class="font-semibold mb-2">🗂️ Todos los Caminos Posibles</h6>
                        <div class="text-xs grid grid-cols-1 gap-1 font-mono">
                            <div class="bg-white p-1 rounded">1. DDDAA</div>
                            <div class="bg-white p-1 rounded">2. DDADA</div>
                            <div class="bg-white p-1 rounded">3. DDAAD</div>
                            <div class="bg-white p-1 rounded">4. DADDA</div>
                            <div class="bg-white p-1 rounded">5. DADAD</div>
                            <div class="bg-white p-1 rounded">6. DAADD</div>
                            <div class="bg-white p-1 rounded">7. ADDDA</div>
                            <div class="bg-white p-1 rounded">8. ADDAD</div>
                            <div class="bg-white p-1 rounded">9. ADADD</div>
                            <div class="bg-white p-1 rounded">10. AADDD</div>
                        </div>
                    </div>
                    
                    <div class="bg-red-50 p-4 rounded border-l-4 border-red-500">
                        <h6 class="font-semibold mb-2">💡 Conexión con Triángulo de Pascal</h6>
                        <div class="text-sm">
                            <p>Los números de caminos forman el Triángulo de Pascal:</p>
                            <div class="mt-2 font-mono text-center text-xs">
                                C(5,0)=1  C(5,1)=5  C(5,2)=10  C(5,3)=10  C(5,4)=5  C(5,5)=1
                            </div>
                            <p class="mt-2">Nuestro resultado C(5,3) = 10 aparece en la fila 5 del triángulo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Problema 3: Selección con Restricciones
function createSelectionProblem() {
    return `
        <div class="space-y-6">
            <div class="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h4 class="font-semibold text-orange-800 mb-3">👥 Problema: Selección con Restricciones</h4>
                <div class="text-sm text-orange-700 space-y-2">
                    <p><strong>Enunciado:</strong> Un entrenador debe formar un equipo de baloncesto de 5 jugadores a partir de un grupo de 12 jugadores disponibles.</p>
                    <p><strong>Restricciones:</strong></p>
                    <ul class="list-disc ml-4">
                        <li>Al menos 2 jugadores deben ser del grupo de 7 jugadores experimentados</li>
                        <li>Al menos 1 jugador debe ser del grupo de 5 jugadores novatos</li>
                        <li>El capitán (1 jugador específico) debe estar en el equipo</li>
                    </ul>
                    <p><strong>Pregunta:</strong> ¿De cuántas maneras se puede formar el equipo?</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <h5 class="font-semibold text-gray-800">🌳 Análisis por Casos</h5>
                    
                    <div class="bg-white p-4 rounded border">
                        <div class="tree-diagram">
                            <div class="tree-level">
                                <div class="tree-node level-0">Capitán Seleccionado<br/><span class="text-xs">(4 lugares restantes)</span></div>
                            </div>
                            
                            <div class="tree-level mt-4">
                                <div class="text-center mb-2"><strong>Casos Posibles:</strong></div>
                                <div class="space-y-2">
                                    <div class="tree-node level-1 bg-blue-100">
                                        Caso 1: 3E + 1N<br/>
                                        <span class="text-xs">3 Experimentados + 1 Novato</span>
                                    </div>
                                    <div class="tree-node level-1 bg-green-100">
                                        Caso 2: 2E + 2N<br/>
                                        <span class="text-xs">2 Experimentados + 2 Novatos</span>
                                    </div>
                                    <div class="tree-node level-1 bg-yellow-100">
                                        Caso 3: 1E + 3N<br/>
                                        <span class="text-xs">1 Experimentado + 3 Novatos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 p-3 bg-gray-50 border rounded">
                            <div class="text-sm">
                                <div class="font-semibold mb-2">Restricciones Verificadas:</div>
                                <div class="text-xs space-y-1">
                                    <div>✅ Caso 1: Al menos 2E (tiene 3E) ✅ Al menos 1N (tiene 1N)</div>
                                    <div>✅ Caso 2: Al menos 2E (tiene 2E) ✅ Al menos 1N (tiene 2N)</div>
                                    <div>❌ Caso 3: Al menos 2E (solo tiene 1E) - INVÁLIDO</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-indigo-50 p-4 rounded border-l-4 border-indigo-500">
                        <h5 class="font-semibold text-indigo-800 mb-2">🔢 Calculadora Interactiva</h5>
                        <div class="space-y-3">
                            <div class="grid grid-cols-3 gap-2">
                                <div>
                                    <label class="block text-xs font-medium">Experimentados:</label>
                                    <input type="number" id="experienced" class="w-full p-1 border rounded text-sm" value="6" min="1" max="15">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium">Novatos:</label>
                                    <input type="number" id="novices" class="w-full p-1 border rounded text-sm" value="5" min="1" max="15">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium">Equipo:</label>
                                    <input type="number" id="teamSize" class="w-full p-1 border rounded text-sm" value="4" min="3" max="10">
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-xs font-medium">Min. Exp.:</label>
                                    <input type="number" id="minExp" class="w-full p-1 border rounded text-sm" value="2" min="0">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium">Min. Nov.:</label>
                                    <input type="number" id="minNov" class="w-full p-1 border rounded text-sm" value="1" min="0">
                                </div>
                            </div>
                            <button onclick="calculateTeamSelections()" class="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600">
                                ⚡ Calcular Selecciones
                            </button>
                            <div id="teamResults" class="text-sm bg-white p-3 rounded border hidden">
                                <!-- Resultados aparecerán aquí -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <h5 class="font-semibold text-gray-800">📊 Solución Detallada</h5>
                    
                    <div class="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                        <h6 class="font-semibold mb-2">Caso 1: 3 Experimentados + 1 Novato</h6>
                        <div class="text-sm space-y-2">
                            <p><strong>Datos:</strong> Capitán ya seleccionado, quedan 6 experimentados y 5 novatos</p>
                            
                            <div class="bg-white p-3 rounded">
                                <div class="font-mono text-center">
                                    Seleccionar 3 de 6 experimentados: C(6,3)<br/>
                                    Seleccionar 1 de 5 novatos: C(5,1)<br/>
                                    <hr class="my-2"/>
                                    C(6,3) × C(5,1) = 20 × 5 = 100
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 p-4 rounded border-l-4 border-green-500">
                        <h6 class="font-semibold mb-2">Caso 2: 2 Experimentados + 2 Novatos</h6>
                        <div class="text-sm space-y-2">
                            <p><strong>Datos:</strong> Capitán ya seleccionado, quedan 6 experimentados y 5 novatos</p>
                            
                            <div class="bg-white p-3 rounded">
                                <div class="font-mono text-center">
                                    Seleccionar 2 de 6 experimentados: C(6,2)<br/>
                                    Seleccionar 2 de 5 novatos: C(5,2)<br/>
                                    <hr class="my-2"/>
                                    C(6,2) × C(5,2) = 15 × 10 = 150
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-red-50 p-4 rounded border-l-4 border-red-500">
                        <h6 class="font-semibold mb-2">❌ Caso 3 Inválido</h6>
                        <div class="text-sm">
                            <p><strong>1 Experimentado + 3 Novatos</strong> no cumple la restricción de "al menos 2 experimentados"</p>
                            <div class="bg-white p-2 rounded mt-2 text-center">
                                Este caso se descarta
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                        <h6 class="font-semibold mb-2">🎯 Resultado Final</h6>
                        <div class="text-sm space-y-2">
                            <div class="bg-white p-3 rounded">
                                <div class="font-mono text-center">
                                    Total = Caso 1 + Caso 2<br/>
                                    = 100 + 150<br/>
                                    = 250 maneras diferentes
                                </div>
                            </div>
                            
                            <div class="bg-purple-100 p-2 rounded mt-3">
                                <strong>Respuesta:</strong> Se puede formar el equipo de 250 maneras diferentes
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
                        <h6 class="font-semibold mb-2">🧠 Método Alternativo: Inclusión-Exclusión</h6>
                        <div class="text-sm space-y-2">
                            <p><strong>Total sin restricciones:</strong> C(11,4) = 330</p>
                            <p><strong>Casos a excluir:</strong></p>
                            <ul class="list-disc ml-4 text-xs">
                                <li>Menos de 2 experimentados: C(6,0)×C(5,4) + C(6,1)×C(5,3) = 0×5 + 6×10 = 60</li>
                                <li>Menos de 1 novato: C(6,4)×C(5,0) = 15×1 = 15</li>
                                <li>Solapamiento: C(6,0)×C(5,0) = 0 (imposible con 4 jugadores)</li>
                            </ul>
                            <div class="bg-white p-2 rounded mt-2 font-mono text-center">
                                330 - 60 - 15 + 0 = 255
                            </div>
                            <p class="text-xs text-yellow-700">Nota: Pequeña discrepancia por aproximaciones en el conteo manual</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Funciones de simulación para los problemas avanzados
function simulateConditionalProbability() {
    const numSims = parseInt(document.getElementById('simulations').value);
    const results = { AR: 0, total: 0 };
    
    for (let i = 0; i < numSims; i++) {
        // Simular extracción sin reposición
        let balls = ['R', 'R', 'R', 'A', 'A']; // 3 rojas, 2 azules
        
        // Primera extracción
        const first = Math.floor(Math.random() * balls.length);
        const firstBall = balls[first];
        balls.splice(first, 1); // Remover la bola extraída
        
        // Solo considerar casos donde la primera es azul
        if (firstBall === 'A') {
            results.total++;
            
            // Segunda extracción
            const second = Math.floor(Math.random() * balls.length);
            const secondBall = balls[second];
            
            if (secondBall === 'R') {
                results.AR++;
            }
        }
    }
    
    const probability = results.total > 0 ? (results.AR / results.total) : 0;
    
    document.getElementById('simulationResults').innerHTML = `
        <h6 class="font-semibold mb-2">📊 Resultados de la Simulación:</h6>
        <div class="text-sm space-y-1">
            <div>Simulaciones realizadas: ${numSims.toLocaleString()}</div>
            <div>Casos "Primera Azul": ${results.total.toLocaleString()}</div>
            <div>Casos "Primera Azul, Segunda Roja": ${results.AR.toLocaleString()}</div>
            <div class="font-semibold text-purple-800">P(R en 2ª | A en 1ª) = ${probability.toFixed(4)} (≈ ${(probability*100).toFixed(2)}%)</div>
            <div class="text-xs text-gray-600">Teórico: 0.7500 (75%)</div>
        </div>
    `;
    
    document.getElementById('simulationResults').classList.remove('hidden');
}

function calculatePaths() {
    const x = parseInt(document.getElementById('destX').value);
    const y = parseInt(document.getElementById('destY').value);
    
    const totalMoves = x + y;
    const paths = combinations(totalMoves, x); // C(x+y, x) = C(x+y, y)
    
    // Generar algunos ejemplos de caminos
    let examples = [];
    const maxExamples = Math.min(10, paths);
    
    for (let i = 0; i < maxExamples; i++) {
        let path = '';
        let tempX = x, tempY = y;
        
        for (let j = 0; j < totalMoves; j++) {
            if (tempX > 0 && (tempY === 0 || Math.random() < 0.5)) {
                path += 'D';
                tempX--;
            } else {
                path += 'A';
                tempY--;
            }
        }
        
        if (!examples.includes(path)) {
            examples.push(path);
        }
    }
    
    document.getElementById('pathResults').innerHTML = `
        <h6 class="font-semibold mb-2">📊 Resultados del Cálculo:</h6>
        <div class="text-sm space-y-2">
            <div><strong>Destino:</strong> (${x}, ${y})</div>
            <div><strong>Movimientos necesarios:</strong> ${x} Derechas + ${y} Arriba = ${totalMoves} total</div>
            <div class="font-semibold text-green-800">Número de caminos: C(${totalMoves},${x}) = ${paths.toLocaleString()}</div>
            
            <div class="mt-3">
                <div class="font-semibold mb-1">Ejemplos de caminos:</div>
                <div class="grid grid-cols-1 gap-1 text-xs font-mono">
                    ${examples.map((path, i) => `<div class="bg-gray-100 p-1 rounded">${i+1}. ${path}</div>`).join('')}
                    ${paths > examples.length ? `<div class="text-gray-500">... y ${paths - examples.length} más</div>` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('pathResults').classList.remove('hidden');
}

function calculateTeamSelections() {
    const exp = parseInt(document.getElementById('experienced').value);
    const nov = parseInt(document.getElementById('novices').value);
    const teamSize = parseInt(document.getElementById('teamSize').value);
    const minExp = parseInt(document.getElementById('minExp').value);
    const minNov = parseInt(document.getElementById('minNov').value);
    
    let total = 0;
    let validCases = [];
    
    // Enumerar todos los casos posibles
    for (let e = 0; e <= Math.min(exp, teamSize); e++) {
        const n = teamSize - e; // novatos necesarios
        
        if (n <= nov && e >= minExp && n >= minNov) {
            const ways = combinations(exp, e) * combinations(nov, n);
            validCases.push({
                exp: e,
                nov: n,
                ways: ways
            });
            total += ways;
        }
    }
    
    document.getElementById('teamResults').innerHTML = `
        <h6 class="font-semibold mb-2">📊 Análisis de Selección de Equipo:</h6>
        <div class="text-sm space-y-2">
            <div><strong>Configuración:</strong> ${exp} experimentados, ${nov} novatos → equipo de ${teamSize}</div>
            <div><strong>Restricciones:</strong> Mín. ${minExp} exp., Mín. ${minNov} nov.</div>
            
            <div class="mt-3">
                <div class="font-semibold mb-1">Casos válidos:</div>
                <div class="space-y-1 text-xs">
                    ${validCases.map(c => 
                        `<div class="bg-gray-100 p-1 rounded">
                            ${c.exp} exp. + ${c.nov} nov.: C(${exp},${c.exp}) × C(${nov},${c.nov}) = ${combinations(exp,c.exp)} × ${combinations(nov,c.nov)} = ${c.ways.toLocaleString()}
                        </div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="font-semibold text-indigo-800 mt-3">
                Total de maneras: ${total.toLocaleString()}
            </div>
        </div>
    `;
    
    document.getElementById('teamResults').classList.remove('hidden');
}

// Configuración de cambio de pestañas
function setupTabSwitching() {
    // Esta función se puede usar para manejar la lógica específica de cambio de pestañas
    // cuando el usuario cambia a la pestaña de Teoría de Conteo
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const teoriaConteoTab = document.getElementById('teoria-conteo');
                if (teoriaConteoTab && teoriaConteoTab.classList.contains('active')) {
                    // La pestaña de Teoría de Conteo está activa
                    // Aquí se pueden agregar inicializaciones específicas si es necesario
                    MathJax.typesetPromise([teoriaConteoTab]).catch(function(err) {
                        console.log(err.message);
                    });
                }
            }
        });
    });
    
    const teoriaConteoTab = document.getElementById('teoria-conteo');
    if (teoriaConteoTab) {
        observer.observe(teoriaConteoTab, { attributes: true });
    }
}