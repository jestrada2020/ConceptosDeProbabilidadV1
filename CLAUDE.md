# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive web application for teaching probability and biostatistics concepts in Spanish. The application is a single-page web app built with vanilla HTML, CSS, and JavaScript that provides interactive learning modules for probability theory, set theory, contingency tables, conditional probability, and Bayes' theorem.

## Architecture

The project follows a modular structure where functionality is separated by mathematical concept:

### File Structure
```
/
├── index.html              # Main HTML file with complete UI structure
├── css/
│   └── styles.css         # Global styles and animations
└── js/                    # JavaScript modules by topic
    ├── AxiomasYTeoremasDeProbabilidad.js  # Probability axioms and theorems
    ├── conjuntos.js       # Set theory and Venn diagrams
    ├── probabilidadBasica.js   # Basic probability calculations
    ├── TablasDecontingencia.js # Contingency tables functionality
    ├── ProbCondicional.js     # Conditional probability
    └── ToremasDeBayes.js      # Bayes' theorem calculations
```

### Key Components

**Tab-based Navigation**: The application uses a tab system with sections for:
- Conjuntos (Set Theory) - Interactive Venn diagrams
- Probabilidad Básica (Basic Probability) - Calculators and simulators
- Tablas de Contingencia (Contingency Tables) - Interactive table builder
- Probabilidad Condicional (Conditional Probability) - Formula calculators
- Teorema de Bayes (Bayes' Theorem) - Step-by-step calculations

**Interactive Elements**:
- SVG-based Venn diagrams with dynamic highlighting
- Monte Carlo simulations for probability experiments
- Real-time probability calculations
- Chart.js visualizations for statistical distributions
- MathJax for mathematical formula rendering

## Development

This is a static web application that runs entirely in the browser. No build process or server is required.

### Running the Application
```bash
# Serve the application using any static web server
python3 -m http.server 8000
# OR
npx serve .
# OR
# Simply open index.html in a web browser
```

### Dependencies
The application uses CDN-hosted libraries:
- Tailwind CSS for styling
- Chart.js for data visualization  
- MathJax for mathematical notation
- FontAwesome for icons

### Code Organization

Each JavaScript module is responsible for:
- Event listeners for its corresponding tab
- Mathematical calculations specific to that topic
- DOM manipulation for interactive elements
- Chart/visualization generation

The modules follow a pattern where they:
1. Set up event listeners when the DOM loads
2. Provide calculation functions for their mathematical domain
3. Update the UI with results and visualizations

### Key Functions by Module

**conjuntos.js**: 
- `generateVennDiagram()` - Creates SVG Venn diagrams
- `highlightVennOperation()` - Highlights set operations
- Set calculation utilities

**probabilidadBasica.js**:
- Probability calculators
- Random experiment simulators (coin, dice, cards)
- Statistical tracking for repeated experiments

**TablasDecontingencia.js**:
- Dynamic contingency table generation
- Marginal and conditional probability calculations
- Chart generation for frequency distributions

**ProbCondicional.js**: 
- Conditional probability calculators
- Independence testing
- Dependency simulation tools

**ToremasDeBayes.js**:
- Multi-hypothesis Bayes calculations
- Medical diagnosis examples
- Probability visualization animations

## File Modifications

When editing this codebase:
- Mathematical calculations should be thoroughly tested
- Spanish text should be preserved for the educational content
- Interactive elements should provide immediate visual feedback
- New features should follow the existing modular pattern