        // Variables globales
        let marginalChartA, marginalChartB, dependencyChart, bayesChart;
        let coinStats = { heads: 0, tails: 0 };
        let diceStats = [0, 0, 0, 0, 0, 0];
        let cardStats = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };

        // MathJax Configuration
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\(', '\)']],
                displayMath: [['$$', '$$'], ['\[', '\]']]
            },
            svg: {
                fontCache: 'global'
            }
        };

        // Navegación por pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Actualizar botones
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active', 'bg-blue-500', 'text-white');
                    b.classList.add('bg-gray-200', 'hover:bg-gray-300');
                });
                btn.classList.add('active', 'bg-blue-500', 'text-white');
                btn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
                
                // Mostrar contenido
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Modo oscuro
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            const btn = document.getElementById('darkModeToggle');
            btn.innerHTML = isDark ? '<i class="fas fa-sun"></i> Modo Claro' : '<i class="fas fa-moon"></i> Modo Oscuro';
        });

        // Inicialización
        
        // Inicializar al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            // Renderizar MathJax si está disponible
            if (window.MathJax) {
                MathJax.typesetPromise();
            }
        });
    