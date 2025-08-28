
// TEOREMA DE BAYES
document.addEventListener('DOMContentLoaded', function() {
    let bayesChart = null;
    let animationInterval = null;
    let isAnimating = false;

    // Verificar que los elementos existen antes de agregar event listeners
    const numHypothesesElement = document.getElementById('numHypotheses');
    if (numHypothesesElement) {
        numHypothesesElement.addEventListener('change', (e) => {
            generateBayesInputs(parseInt(e.target.value));
        });
    }

        function generateBayesInputs(numHyp) {
            const container = document.getElementById('bayesInputs');
            let html = '';
            
            for (let i = 0; i < numHyp; i++) {
                html += `
                    <div class="bg-gray-50 p-4 rounded mb-4">
                        <h5 class="font-semibold mb-2">Hipótesis H${i+1}</h5>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="block text-sm">P(H${i+1}) - Prior:</label>
                                <input type="number" class="prior-prob w-full p-2 border rounded" 
                                       data-hypothesis="${i}" step="0.01" min="0" max="1" value="${(1/numHyp).toFixed(2)}">
                            </div>
                            <div>
                                <label class="block text-sm">P(E|H${i+1}) - Verosimilitud:</label>
                                <input type="number" class="likelihood w-full p-2 border rounded" 
                                       data-hypothesis="${i}" step="0.01" min="0" max="1" value="0.5">
                            </div>
                        </div>
                    </div>
                `;
            }
            
            container.innerHTML = html;
        }

    const calculateBayesElement = document.getElementById('calculateBayes');
    if (calculateBayesElement) {
        calculateBayesElement.addEventListener('click', () => {
            const priorInputs = document.querySelectorAll('.prior-prob');
            const likelihoodInputs = document.querySelectorAll('.likelihood');
            
            const priors = Array.from(priorInputs).map(input => parseFloat(input.value));
            const likelihoods = Array.from(likelihoodInputs).map(input => parseFloat(input.value));
            
            // Validar que los priors sumen 1
            const priorSum = priors.reduce((sum, p) => sum + p, 0);
            if (Math.abs(priorSum - 1) > 0.001) {
                alert('Los priors deben sumar 1.0');
                return;
            }
            
            // Calcular probabilidad marginal de la evidencia
            const marginalEvidence = priors.reduce((sum, prior, i) => 
                sum + prior * likelihoods[i], 0
            );
            
            if (marginalEvidence === 0) {
                alert('La probabilidad marginal de la evidencia no puede ser cero');
                return;
            }
            
            // Calcular probabilidades posteriores
            const posteriors = priors.map((prior, i) => 
                (prior * likelihoods[i]) / marginalEvidence
            );
            
            // Mostrar resultados
            const resultsDiv = document.getElementById('bayesResults');
            let resultsHTML = '<div class="result-highlight"><h4 class="font-bold">Probabilidades Posteriores:</h4>';
            
            posteriors.forEach((posterior, i) => {
                resultsHTML += `
                    <p><strong>P(H${i+1}|E) = ${priors[i].toFixed(4)} × ${likelihoods[i].toFixed(4)} / ${marginalEvidence.toFixed(4)} = ${posterior.toFixed(4)}</strong></p>
                `;
            });
            
            resultsHTML += `<p class="mt-2"><strong>P(E) = ${marginalEvidence.toFixed(4)}</strong></p></div>`;
            resultsDiv.innerHTML = resultsHTML;
            
            // Actualizar visualización
            updateBayesVisualization(priors, posteriors);
        });
    }

        function updateBayesVisualization(priors, posteriors) {
            const ctx = document.getElementById('bayesVisualization').getContext('2d');
            
            if (bayesChart) bayesChart.destroy();
            
            const labels = priors.map((_, i) => `H${i+1}`);
            
            bayesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Prior P(H)',
                        data: priors,
                        backgroundColor: 'rgba(255, 99, 132, 0.8)'
                    }, {
                        label: 'Posterior P(H|E)',
                        data: posteriors,
                        backgroundColor: 'rgba(54, 162, 235, 0.8)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 1
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Comparación de Probabilidades Prior y Posterior'
                        }
                    }
                }
            });
        }

    // Ejemplos prácticos de Bayes
    const solveUrnsElement = document.getElementById('solveUrns');
    if (solveUrnsElement) {
        solveUrnsElement.addEventListener('click', () => {
            // Problema de las urnas
            const priorA = 1/3, priorB = 1/3, priorC = 1/3;
            const likelihoodA = 3/8, likelihoodB = 2/3, likelihoodC = 2/5;
            
            const marginalRed = priorA * likelihoodA + priorB * likelihoodB + priorC * likelihoodC;
            
            const posteriorA = (priorA * likelihoodA) / marginalRed;
            const posteriorB = (priorB * likelihoodB) / marginalRed;
            const posteriorC = (priorC * likelihoodC) / marginalRed;
            
            document.getElementById('urnsResults').innerHTML = `
                <div class="result-highlight">
                    <h5 class="font-bold">Solución:</h5>
                    <p><strong>P(Roja) = ${marginalRed.toFixed(4)}</strong></p>
                    <p><strong>P(A|Roja) = ${posteriorA.toFixed(4)} = ${(posteriorA*100).toFixed(1)}%</strong></p>
                    <p><strong>P(B|Roja) = ${posteriorB.toFixed(4)} = ${(posteriorB*100).toFixed(1)}%</strong></p>
                    <p><strong>P(C|Roja) = ${posteriorC.toFixed(4)} = ${(posteriorC*100).toFixed(1)}%</strong></p>
                </div>
            `;
        });
    }

    const solveMedicalElement = document.getElementById('solveMedical');
    if (solveMedicalElement) {
        solveMedicalElement.addEventListener('click', () => {
            const sensitivity = parseFloat(document.getElementById('sensitivity').value) / 100;
            const specificity = parseFloat(document.getElementById('specificity').value) / 100;
            const prevalence = parseFloat(document.getElementById('prevalence').value) / 100;
            
            const falsePositiveRate = 1 - specificity;
            
            const marginalPositive = sensitivity * prevalence + falsePositiveRate * (1 - prevalence);
            const posteriorSick = (sensitivity * prevalence) / marginalPositive;
            
            document.getElementById('medicalResults').innerHTML = `
                <div class="result-highlight">
                    <h5 class="font-bold">Resultado del Diagnóstico:</h5>
                    <p><strong>P(Enfermo|Test+) = ${(posteriorSick*100).toFixed(2)}%</strong></p>
                    <p><strong>P(Sano|Test+) = ${((1-posteriorSick)*100).toFixed(2)}%</strong></p>
                    <p class="text-sm mt-2">
                        Aunque el test sea positivo, la probabilidad real de estar enfermo es solo del 
                        ${(posteriorSick*100).toFixed(1)}% debido a la baja prevalencia de la enfermedad.
                    </p>
                </div>
            `;
        });
    }

    // Event listeners para los botones de animación
    const animateBayesElement = document.getElementById('animateBayes');
    if (animateBayesElement) {
        animateBayesElement.addEventListener('click', () => {
            if (!isAnimating) {
                animateBayesProcess();
            }
        });
    }

    const stopAnimationElement = document.getElementById('stopAnimation');
    if (stopAnimationElement) {
        stopAnimationElement.addEventListener('click', () => {
            stopBayesAnimation();
        });
    }

        function animateBayesProcess() {
            if (isAnimating) return;
            
            isAnimating = true;
            const ctx = document.getElementById('bayesVisualization').getContext('2d');
            
            if (bayesChart) bayesChart.destroy();
            
            // Datos de ejemplo para la animación
            const steps = [
                { 
                    title: "Paso 1: Probabilidades Prior",
                    data: [0.4, 0.35, 0.25],
                    description: "Creencias iniciales sobre cada hipótesis antes de observar evidencia"
                },
                { 
                    title: "Paso 2: Nueva Evidencia Observada",
                    data: [0.4, 0.35, 0.25],
                    description: "Observamos nueva evidencia E que puede cambiar nuestras creencias"
                },
                { 
                    title: "Paso 3: Calculando Verosimilitudes",
                    data: [0.3, 0.55, 0.15],
                    description: "Evaluamos P(E|H) para cada hipótesis - ¿qué tan probable es la evidencia bajo cada hipótesis?"
                },
                { 
                    title: "Paso 4: Aplicando Teorema de Bayes",
                    data: [0.2, 0.65, 0.15],
                    description: "Multiplicamos prior × verosimilitud y normalizamos para obtener las posteriores"
                },
                { 
                    title: "Paso 5: Probabilidades Posteriores",
                    data: [0.15, 0.75, 0.10],
                    description: "Nuevas creencias actualizadas: la Hipótesis B es ahora la más probable"
                }
            ];
            
            let currentStep = 0;
            
            function nextStep() {
                if (!isAnimating || currentStep >= steps.length) {
                    if (currentStep >= steps.length) {
                        // Reiniciar animación si no se ha detenido
                        currentStep = 0;
                        if (isAnimating) {
                            animationInterval = setTimeout(nextStep, 2000);
                        }
                    }
                    return;
                }
                
                const step = steps[currentStep];
                
                if (bayesChart) bayesChart.destroy();
                
                bayesChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Hipótesis A', 'Hipótesis B', 'Hipótesis C'],
                        datasets: [{
                            data: step.data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(255, 205, 86, 0.8)'
                            ],
                            borderColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)'
                            ],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                            duration: 1500,
                            easing: 'easeOutCubic'
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: step.title,
                                font: { size: 16, weight: 'bold' }
                            },
                            legend: {
                                position: 'bottom',
                                labels: {
                                    generateLabels: function(chart) {
                                        const data = chart.data;
                                        return data.labels.map((label, i) => ({
                                            text: `${label}: ${(data.datasets[0].data[i] * 100).toFixed(1)}%`,
                                            fillStyle: data.datasets[0].backgroundColor[i],
                                            strokeStyle: data.datasets[0].borderColor[i],
                                            lineWidth: data.datasets[0].borderWidth
                                        }));
                                    }
                                }
                            }
                        }
                    }
                });
                
                // Mostrar descripción
                updateAnimationDescription(step.description, currentStep + 1, steps.length);
                
                currentStep++;
                animationInterval = setTimeout(() => {
                    nextStep();
                }, 3500);
            }
            
            nextStep();
        }

        function stopBayesAnimation() {
            isAnimating = false;
            if (animationInterval) {
                clearTimeout(animationInterval);
                animationInterval = null;
            }
            
            // Limpiar descripción
            const descContainer = document.getElementById('animationDescription');
            if (descContainer) {
                descContainer.innerHTML = `
                    <p class="text-sm text-gray-700">
                        <i class="fas fa-pause-circle mr-2 text-gray-500"></i>
                        <strong>Animación detenida.</strong> Haz clic en "Animar Proceso de Bayes" para reiniciar.
                    </p>
                `;
            }
        }

        function updateAnimationDescription(description, currentStep, totalSteps) {
            // Buscar si existe el contenedor de descripción, si no, crearlo
            let descContainer = document.getElementById('animationDescription');
            if (!descContainer) {
                const visualizationSection = document.querySelector('#bayesVisualization').parentNode.parentNode;
                descContainer = document.createElement('div');
                descContainer.id = 'animationDescription';
                descContainer.className = 'mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded';
                visualizationSection.appendChild(descContainer);
            }
            
            const progressBar = currentStep && totalSteps ? 
                `<div class="mt-2 bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: ${(currentStep/totalSteps)*100}%"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Paso ${currentStep} de ${totalSteps}</p>` : '';
            
            descContainer.innerHTML = `
                <p class="text-sm text-gray-700">
                    <i class="fas fa-info-circle mr-2 text-blue-500"></i>
                    <strong>Explicación:</strong> ${description}
                </p>
                ${progressBar}
            `;
        }

    // Inicializar con 2 hipótesis por defecto
    generateBayesInputs(2);

// Cerrar el DOMContentLoaded
});
    