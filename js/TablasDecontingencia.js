
        // TABLAS DE CONTINGENCIA
        function updateContingencyTable() {
            const inputs = document.querySelectorAll('.cell-input');
            const data = [];
            
            inputs.forEach(input => {
                const row = parseInt(input.dataset.row);
                const col = parseInt(input.dataset.col);
                const value = parseInt(input.value) || 0;
                
                if (!data[row]) data[row] = [];
                data[row][col] = value;
            });
            
            // Calcular totales por fila
            data.forEach((row, i) => {
                const total = row.reduce((sum, val) => sum + val, 0);
                document.getElementById(`rowTotal${i}`).textContent = total;
            });
            
            // Calcular totales por columna
            for (let col = 0; col < 3; col++) {
                const total = data.reduce((sum, row) => sum + (row[col] || 0), 0);
                document.getElementById(`colTotal${col}`).textContent = total;
            }
            
            // Gran total
            const grandTotal = data.reduce((sum, row) => 
                sum + row.reduce((rowSum, val) => rowSum + val, 0), 0
            );
            document.getElementById('grandTotal').textContent = grandTotal;
            
            // Calcular probabilidades
            calculateContingencyProbabilities(data, grandTotal);
            updateContingencyCharts(data);
        }

        function calculateContingencyProbabilities(data, total) {
            if (total === 0) return;
            
            const marginalDiv = document.getElementById('marginalProbs');
            const jointDiv = document.getElementById('jointProbs');
            const conditionalDiv = document.getElementById('conditionalProbs');
            
            // Probabilidades marginales
            let marginalHTML = '<h5 class="font-semibold">Filas (A):</h5>';
            data.forEach((row, i) => {
                const rowTotal = row.reduce((sum, val) => sum + val, 0);
                const prob = (rowTotal / total).toFixed(4);
                marginalHTML += `<div>P(A${i+1}) = ${rowTotal}/${total} = ${prob}</div>`;
            });
            
            marginalHTML += '<h5 class="font-semibold mt-2">Columnas (B):</h5>';
            for (let col = 0; col < 3; col++) {
                const colTotal = data.reduce((sum, row) => sum + (row[col] || 0), 0);
                const prob = (colTotal / total).toFixed(4);
                marginalHTML += `<div>P(B${col+1}) = ${colTotal}/${total} = ${prob}</div>`;
            }
            marginalDiv.innerHTML = marginalHTML;
            
            // Probabilidades conjuntas
            let jointHTML = '';
            data.forEach((row, i) => {
                row.forEach((val, j) => {
                    const prob = (val / total).toFixed(4);
                    jointHTML += `<div>P(A${i+1} ∩ B${j+1}) = ${val}/${total} = ${prob}</div>`;
                });
            });
            jointDiv.innerHTML = jointHTML;
            
            // Probabilidades condicionales (ejemplo)
            let conditionalHTML = '<h5 class="font-semibold">P(B|A):</h5>';
            data.forEach((row, i) => {
                const rowTotal = row.reduce((sum, val) => sum + val, 0);
                if (rowTotal > 0) {
                    row.forEach((val, j) => {
                        const prob = (val / rowTotal).toFixed(4);
                        conditionalHTML += `<div>P(B${j+1}|A${i+1}) = ${val}/${rowTotal} = ${prob}</div>`;
                    });
                }
            });
            conditionalDiv.innerHTML = conditionalHTML;
        }

        function updateContingencyCharts(data) {
            const ctxA = document.getElementById('marginalChartA').getContext('2d');
            const ctxB = document.getElementById('marginalChartB').getContext('2d');
            
            // Datos para gráfico A (filas)
            const rowTotals = data.map(row => row.reduce((sum, val) => sum + val, 0));
            const rowLabels = rowTotals.map((_, i) => `A${i+1}`);
            
            // Datos para gráfico B (columnas)
            const colTotals = [];
            for (let col = 0; col < 3; col++) {
                colTotals.push(data.reduce((sum, row) => sum + (row[col] || 0), 0));
            }
            const colLabels = colTotals.map((_, i) => `B${i+1}`);
            
            // Destruir gráficos existentes
            if (marginalChartA) marginalChartA.destroy();
            if (marginalChartB) marginalChartB.destroy();
            
            // Crear nuevos gráficos
            marginalChartA = new Chart(ctxA, {
                type: 'pie',
                data: {
                    labels: rowLabels,
                    datasets: [{
                        data: rowTotals,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
            
            marginalChartB = new Chart(ctxB, {
                type: 'bar',
                data: {
                    labels: colLabels,
                    datasets: [{
                        label: 'Frecuencia',
                        data: colTotals,
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Event listeners para tablas de contingencia
        document.querySelectorAll('.cell-input').forEach(input => {
            input.addEventListener('input', updateContingencyTable);
        });

        document.getElementById('loadExample').addEventListener('click', () => {
            const examples = [
                [[20, 30, 10], [15, 25, 20]],
                [[45, 15, 10], [25, 35, 20]],
                [[30, 20, 25], [40, 15, 10]]
            ];
            
            const example = examples[Math.floor(Math.random() * examples.length)];
            
            document.querySelectorAll('.cell-input').forEach((input, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                input.value = example[row][col];
            });
            
            updateContingencyTable();
        });

        document.getElementById('clearTable').addEventListener('click', () => {
            document.querySelectorAll('.cell-input').forEach(input => {
                input.value = 0;
            });
            updateContingencyTable();
        });

        updateContingencyTable();
    