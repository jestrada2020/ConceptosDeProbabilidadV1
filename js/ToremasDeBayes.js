
        // TEOREMA DE BAYES
        document.getElementById('numHypotheses').addEventListener('change', (e) => {
            generateBayesInputs(parseInt(e.target.value));
        });

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

        document.getElementById('calculateBayes').addEventListener('click', () => {
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
        document.getElementById('solveUrns').addEventListener('click', () => {
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

        document.getElementById('solveMedical').addEventListener('click', () => {
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

        generateBayesInputs(2);
    