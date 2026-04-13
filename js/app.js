/**
 * Decision Pilot IA - Lógica de Aplicación
 * Gestión de eventos, carga de ejemplos y construcción de prompts.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referencias de la Interfaz
    const selectCaso = document.getElementById('caso-estudio');
    const btnGenerar = document.getElementById('btn-generar');
    const btnCopiar = document.getElementById('btn-copiar');
    const seccionResultado = document.getElementById('resultado');
    const outputPrompt = document.getElementById('output-prompt');
    
    // Variables para almacenar los datos del JSON
    let ejemplosData = [];

    // 2. Carga de datos desde ejemplos.json
    // IMPORTANTE: El archivo debe estar en la ruta 'data/ejemplos.json'
    fetch('data/ejemplos.json')
        .then(response => response.json())
        .then(data => {
            ejemplosData = data.casos;
            console.log('Ejemplos cargados correctamente');
        })
        .catch(error => console.error('Error cargando ejemplos:', error));

    // 3. Evento: Cambiar de caso (Hidratación del formulario)
    selectCaso.addEventListener('change', () => {
        const idSeleccionado = selectCaso.value;
        const casoEncontrado = ejemplosData.find(c => c.id === idSeleccionado);

        if (casoEncontrado) {
            // Rellenar campos automáticamente
            document.getElementById('contexto').value = casoEncontrado.contexto;
            document.getElementById('decision').value = casoEncontrado.decision;
            document.getElementById('datos').value = casoEncontrado.datos;
            document.getElementById('restricciones').value = casoEncontrado.restricciones;
            
            // Ocultar resultado anterior al cambiar de caso
            seccionResultado.style.display = 'none';
        }
    });

    // 4. Evento: Generar Prompt
    btnGenerar.addEventListener('click', () => {
        if (!validarFormulario()) {
            alert('Por favor, selecciona un caso y rellena los campos obligatorios.');
            return;
        }

        const datosUsuario = {
            caso: selectCaso.value,
            contexto: document.getElementById('contexto').value,
            decision: document.getElementById('decision').value,
            datos: document.getElementById('datos').value,
            restricciones: document.getElementById('restricciones').value
        };

        // Construir prompt usando la lógica de prompts.js
        const promptFinal = construirPrompt(datosUsuario);

        // Mostrar resultado con efecto visual
        outputPrompt.textContent = promptFinal;
        seccionResultado.style.display = 'block';
        seccionResultado.scrollIntoView({ behavior: 'smooth' });
    });

    // 5. Evento: Copiar al Portapapeles
    btnCopiar.addEventListener('click', async () => {
        const texto = outputPrompt.textContent;
        try {
            await navigator.clipboard.writeText(texto);
            const originalText = btnCopiar.textContent;
            btnCopiar.textContent = '¡Copiado con éxito!';
            btnCopiar.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                btnCopiar.textContent = originalText;
                btnCopiar.style.backgroundColor = '';
            }, 2000);
        } catch (err) {
            alert('No se pudo copiar el texto automáticamente.');
        }
    });

    // 6. Función de Validación
    function validarFormulario() {
        if (!selectCaso.value) return false;
        
        const camposObligatorios = ['contexto', 'decision', 'datos'];
        return camposObligatorios.every(id => {
            const el = document.getElementById(id);
            return el.value.trim().length > 0;
        });
    }
});