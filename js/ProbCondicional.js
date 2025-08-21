
        // PROBABILIDAD CONDICIONAL
        document.getElementById('calculateConditional').addEventListener('click', () => {
            const probAB = parseFloat(document.getElementById('probAB').value);
            const probB = parseFloat(document.getElementById('probB').value);
            const probA = parseFloat(document.getElementById('probA').value);
            
            if (probB === 0 || probA === 0) {
                alert('Las probabilidades no pueden ser cero para el cálculo condicional');
                return;
            }
            
            const probAGivenB = probAB / probB;
            const probBGivenA = probAB / probA;
            const independence = Math.abs(probAGivenB - probA) < 0.001;
            
            const resultsDiv = document.getElementById('conditionalResults');
            resultsDiv.innerHTML = `
                <div class="result-highlight">
                    <h4 class="font-bold">Resultados:</h4>
                    <p><strong>P(A|B) = P(A∩B)/P(B) = ${probAB}/${probB} = ${probAGivenB.toFixed(4)}</strong></p>
                    <p><strong>P(B|A) = P(A∩B)/P(A) = ${probAB}/${probA} = ${probBGivenA.toFixed(4)}</strong></p>
                    <p><strong>¿Son independientes?</strong> ${independence ? 'SÍ' : 'NO'}</p>
                    ${!independence ? `<p class="text-sm">P(A|B) ≠ P(A), por lo tanto son dependientes</p>` : 
                      `<p class="text-sm">P(A|B) = P(A), por lo tanto son independientes</p>`}
                </div>
            `;
            resultsDiv.classList.add('animation-fade');
        });

        // Simulador de dependencia
        document.getElementById('runSimulation').addEventListener('click', () => {
            const dependencyType = document.getElementById('dependencyType').value;
            const numSims = parseInt(document.getElementById('numSimulations').value);
            
            let results = { AB: 0, A: 0, B: 0, total: numSims };
            
            for (let i = 0; i < numSims; i++) {
                let eventA, eventB;
                
                if (dependencyType === 'independent') {
                    eventA = Math.random() < 0.4;
                    eventB = Math.random() < 0.3;
                } else if (dependencyType === 'positive') {
                    eventA = Math.random() < 0.4;
                    eventB = eventA ? Math.random() < 0.7 : Math.random() < 0.2;
                } else { // negative
                    eventA = Math.random() < 0.4;
                    eventB = eventA ? Math.random() < 0.1 : Math.random() < 0.5;
                }
                
                if (eventA && eventB) results.AB++;
                if (eventA) results.A++;
                if (eventB) results.B++;
            }
            
            const ctx = document.getElementById('dependencyChart').getContext('2d');
            
            if (dependencyChart) dependencyChart.destroy();
            
            dependencyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['P(A)', 'P(B)', 'P(A∩B)', 'P(A|B)', 'P(B|A)'],
                    datasets: [{
                        label: 'Probabilidad',
                        data: [
                            results.A / results.total,
                            results.B / results.total,
                            results.AB / results.total,
                            results.B > 0 ? results.AB / results.B : 0,
                            results.A > 0 ? results.AB / results.A : 0
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)'
                        ]
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
                    }
                }
            });
            
            document.getElementById('simulationStats').innerHTML = `
                <p><strong>Resultados de ${numSims} simulaciones:</strong></p>
                <p>P(A) = ${(results.A / results.total).toFixed(4)}</p>
                <p>P(B) = ${(results.B / results.total).toFixed(4)}</p>
                <p>P(A∩B) = ${(results.AB / results.total).toFixed(4)}</p>
                <p>P(A|B) = ${results.B > 0 ? (results.AB / results.B).toFixed(4) : 'N/A'}</p>
                <p>P(B|A) = ${results.A > 0 ? (results.AB / results.A).toFixed(4) : 'N/A'}</p>
            `;
        });
    