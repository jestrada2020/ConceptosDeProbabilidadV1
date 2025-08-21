// TEORÍA DE CONJUNTOS - GeoGebra Integration
// Venn diagrams are now handled by the embedded GeoGebra application

// GeoGebra Applet Configuration
function initializeGeoGebra() {
    console.log("Inicializando GeoGebra...");
    
    // Verificar que el contenedor existe
    const container = document.getElementById('geogebra-container');
    if (!container) {
        console.error("Container 'geogebra-container' not found");
        return;
    }
    
    // Configuración corregida de la aplicación GeoGebra
    const parameters = {
        "appName": "classic",
        "width": container.offsetWidth || 600,
        "height": container.offsetHeight || 450,
        "showToolBar": true,
        "showAlgebraInput": false,
        "showMenuBar": false,
        "showResetIcon": false,
        "enableLabelDrags": false,
        "enableShiftDragZoom": true,
        "enableRightClick": false,
        "errorDialogsActive": false,
        "useBrowserForJS": false,
        "allowStyleBar": false,
        "preventFocus": false,
        "showZoomButtons": true,
        "capturingThreshold": 3,
        "language": "es",
        "country": "ES",
        "material_id": "hxe36psy",
        "appletOnLoad": function(api) {
            console.log("GeoGebra applet loaded successfully with material hxe36psy - Conjuntos apropiados");
        }
    };
    
    try {
        // Crear y mostrar la aplicación
        const applet = new GGBApplet(parameters, true);
        applet.inject('geogebra-container');
        console.log("GeoGebra injection attempted");
    } catch (error) {
        console.error("Error initializing GeoGebra:", error);
        // Fallback: usar iframe si falla la API
        fallbackToIframe();
    }
}

// Función de respaldo usando iframe
function fallbackToIframe() {
    console.log("Usando iframe con enlace apropiado para conjuntos...");
    const container = document.getElementById('geogebra-container');
    if (container) {
        container.innerHTML = `
            <iframe 
                src="https://www.geogebra.org/classic/hxe36psy" 
                width="100%" 
                height="100%" 
                frameborder="0"
                allowfullscreen
                title="Diagramas de Venn y Conjuntos - GeoGebra"
                style="border: none;">
            </iframe>
        `;
    }
}

        // Calculadora de conjuntos
        document.getElementById('calculateSets').addEventListener('click', () => {
            const setAInput = document.getElementById('setA').value;
            const setBInput = document.getElementById('setB').value;
            const universeInput = document.getElementById('setUniverse').value;
            
            const setA = new Set(setAInput.split(',').map(s => s.trim()).filter(s => s !== ''));
            const setB = new Set(setBInput.split(',').map(s => s.trim()).filter(s => s !== ''));
            const universe = universeInput ? 
                new Set(universeInput.split(',').map(s => s.trim()).filter(s => s !== '')) :
                new Set([...setA, ...setB]); // Universo por defecto
            
            const union = new Set([...setA, ...setB]);
            const intersection = new Set([...setA].filter(x => setB.has(x)));
            const differenceAB = new Set([...setA].filter(x => !setB.has(x)));
            const differenceBA = new Set([...setB].filter(x => !setA.has(x)));
            const symmetricDifference = new Set([...differenceAB, ...differenceBA]);
            
            // Complementos
            const complementA = new Set([...universe].filter(x => !setA.has(x)));
            const complementB = new Set([...universe].filter(x => !setB.has(x)));
            const complementUnion = new Set([...universe].filter(x => !union.has(x)));
            const complementIntersection = new Set([...universe].filter(x => !intersection.has(x)));
            
            // Verificar si son disjuntos
            const areDisjoint = intersection.size === 0;
            
            // Verificar inclusión
            const aSubsetB = [...setA].every(x => setB.has(x));
            const bSubsetA = [...setB].every(x => setA.has(x));

            const results = document.getElementById('setResults');
            results.innerHTML = `
                <div class="result-highlight space-y-3">
                    <h4 class="font-bold text-lg mb-3">Resultados de las Operaciones:</h4>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <h5 class="font-semibold text-blue-600">Conjuntos Originales:</h5>
                            <p><strong>A:</strong> {${Array.from(setA).join(', ')}}</p>
                            <p><strong>B:</strong> {${Array.from(setB).join(', ')}}</p>
                            <p><strong>U:</strong> {${Array.from(universe).join(', ')}}</p>
                        </div>
                        
                        <div class="space-y-2">
                            <h5 class="font-semibold text-green-600">Cardinalidades:</h5>
                            <p><strong>|A|:</strong> ${setA.size}</p>
                            <p><strong>|B|:</strong> ${setB.size}</p>
                            <p><strong>|U|:</strong> ${universe.size}</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div class="space-y-2">
                            <h5 class="font-semibold text-purple-600">Operaciones Básicas:</h5>
                            <p><strong>A ∪ B:</strong> {${Array.from(union).join(', ')}} <span class="text-gray-500">(|${union.size}|)</span></p>
                            <p><strong>A ∩ B:</strong> {${Array.from(intersection).join(', ')}} <span class="text-gray-500">(|${intersection.size}|)</span></p>
                            <p><strong>A - B:</strong> {${Array.from(differenceAB).join(', ')}} <span class="text-gray-500">(|${differenceAB.size}|)</span></p>
                            <p><strong>B - A:</strong> {${Array.from(differenceBA).join(', ')}} <span class="text-gray-500">(|${differenceBA.size}|)</span></p>
                            <p><strong>A Δ B:</strong> {${Array.from(symmetricDifference).join(', ')}} <span class="text-gray-500">(|${symmetricDifference.size}|)</span></p>
                        </div>
                        
                        <div class="space-y-2">
                            <h5 class="font-semibold text-orange-600">Complementos:</h5>
                            <p><strong>A':</strong> {${Array.from(complementA).join(', ')}} <span class="text-gray-500">(|${complementA.size}|)</span></p>
                            <p><strong>B':</strong> {${Array.from(complementB).join(', ')}} <span class="text-gray-500">(|${complementB.size}|)</span></p>
                            <p><strong>(A ∪ B)':</strong> {${Array.from(complementUnion).join(', ')}} <span class="text-gray-500">(|${complementUnion.size}|)</span></p>
                            <p><strong>(A ∩ B)':</strong> {${Array.from(complementIntersection).join(', ')}} <span class="text-gray-500">(|${complementIntersection.size}|)</span></p>
                        </div>
                    </div>
                    
                    <div class="mt-4 p-3 bg-gray-50 rounded">
                        <h5 class="font-semibold text-gray-700 mb-2">Propiedades:</h5>
                        <ul class="text-sm space-y-1">
                            <li class="${areDisjoint ? 'text-green-600' : 'text-gray-500'}">
                                ${areDisjoint ? '✓' : '✗'} A y B son conjuntos disjuntos
                            </li>
                            <li class="${aSubsetB ? 'text-green-600' : 'text-gray-500'}">
                                ${aSubsetB ? '✓' : '✗'} A ⊆ B (A es subconjunto de B)
                            </li>
                            <li class="${bSubsetA ? 'text-green-600' : 'text-gray-500'}">
                                ${bSubsetA ? '✓' : '✗'} B ⊆ A (B es subconjunto de A)
                            </li>
                            <li class="${aSubsetB && bSubsetA ? 'text-green-600' : 'text-gray-500'}">
                                ${aSubsetB && bSubsetA ? '✓' : '✗'} A = B (conjuntos iguales)
                            </li>
                        </ul>
                    </div>
                </div>
            `;
            results.classList.add('animation-fade');
        });

        // Inicialización de GeoGebra y calculadora de conjuntos
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Conjuntos module loaded - initializing GeoGebra');
            
            let geogebraInitialized = false;
            
            // Función para intentar inicializar GeoGebra
            const attemptGeoGebraInit = () => {
                if (geogebraInitialized) return;
                
                const container = document.getElementById('geogebra-container');
                if (!container) {
                    console.log('GeoGebra container not found, retrying...');
                    setTimeout(attemptGeoGebraInit, 500);
                    return;
                }
                
                const conjuntosTab = document.getElementById('conjuntos');
                const isTabActive = conjuntosTab && conjuntosTab.classList.contains('active');
                
                if (isTabActive) {
                    // Usar directamente iframe con el enlace más apropiado para conjuntos
                    console.log('Using direct iframe with appropriate sets/Venn diagrams GeoGebra link...');
                    fallbackToIframe();
                    geogebraInitialized = true;
                }
            };
            
            // Intentar inicializar inmediatamente
            setTimeout(attemptGeoGebraInit, 1000);
            
            // También inicializar GeoGebra cuando se active la pestaña de conjuntos
            const conjuntosTabBtn = document.querySelector('[data-tab="conjuntos"]');
            if (conjuntosTabBtn) {
                conjuntosTabBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        if (!geogebraInitialized) {
                            attemptGeoGebraInit();
                        }
                    }, 300);
                });
            }
            
            // Listener global para cambios de pestaña
            document.addEventListener('click', (e) => {
                if (e.target.matches('[data-tab="conjuntos"]')) {
                    setTimeout(() => {
                        if (!geogebraInitialized) {
                            attemptGeoGebraInit();
                        }
                    }, 300);
                }
            });
        });