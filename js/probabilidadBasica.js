
        // PROBABILIDAD BÁSICA
        document.getElementById('calculateProbability').addEventListener('click', () => {
            const favorable = parseInt(document.getElementById('favorableCases').value);
            const total = parseInt(document.getElementById('totalCases').value);
            
            if (favorable > total) {
                alert('Los casos favorables no pueden ser mayores que el total');
                return;
            }
            
            const probability = favorable / total;
            const percentage = (probability * 100).toFixed(2);
            
            const resultDiv = document.getElementById('probabilityResult');
            const valueDiv = document.getElementById('probabilityValue');
            const marker = document.getElementById('probabilityMarker');
            
            valueDiv.innerHTML = `
                <p>P(Evento) = ${favorable}/${total} = ${probability.toFixed(4)} = ${percentage}%</p>
            `;
            
            marker.style.left = `${probability * 100}%`;
            resultDiv.classList.remove('hidden');
            resultDiv.classList.add('animation-fade');
        });

        // Simuladores
        document.getElementById('flipCoin').addEventListener('click', () => {
            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            const coinResult = document.getElementById('coinResult');
            
            if (result === 'heads') {
                coinResult.textContent = '👑';
                coinStats.heads++;
            } else {
                coinResult.textContent = '🪙';
                coinStats.tails++;
            }
            
            document.getElementById('headsCount').textContent = coinStats.heads;
            document.getElementById('tailsCount').textContent = coinStats.tails;
        });

        document.getElementById('rollDice').addEventListener('click', () => {
            const result = Math.floor(Math.random() * 6) + 1;
            document.getElementById('diceResult').textContent = `⚀⚁⚂⚃⚄⚅`[result - 1];
            
            diceStats[result - 1]++;
            
            const freqDiv = document.getElementById('diceFreq');
            freqDiv.innerHTML = diceStats.map((count, i) => 
                `${i + 1}: ${count}`
            ).join(' | ');
        });

        document.getElementById('drawCard').addEventListener('click', () => {
            const suits = ['♥️', '♦️', '♣️', '♠️'];
            const suitNames = ['hearts', 'diamonds', 'clubs', 'spades'];
            const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            
            const suit = Math.floor(Math.random() * 4);
            const value = values[Math.floor(Math.random() * values.length)];
            
            document.getElementById('cardResult').textContent = `${value}${suits[suit]}`;
            
            cardStats[suitNames[suit]]++;
            
            document.getElementById('heartsCount').textContent = cardStats.hearts;
            document.getElementById('diamondsCount').textContent = cardStats.diamonds;
            document.getElementById('clubsCount').textContent = cardStats.clubs;
            document.getElementById('spadesCount').textContent = cardStats.spades;
        });
    