/**
 * Decision Pilot IA - Lógica de Aplicación
 * Gestión de eventos y construcción de prompts estructurados.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referencias de la Interfaz
    const selectCaso = document.getElementById('caso-estudio');
    const form = document.getElementById('form-prompt');
    const btnGenerar = document.getElementById('btn-generar');
    const btnCopiar = document.getElementById('btn-copiar');
    const seccionResultado = document.getElementById('resultado');
    const outputPrompt = document.getElementById('output-prompt');

    // 2. Evento: Generar Prompt
    btnGenerar.addEventListener('click', () => {
        if (!validarFormulario()) {
            alert('Por favor, rellena todos los campos obligatorios.');
            return;
        }

        const datosUsuario = {
            caso: selectCaso.value,
            contexto: document.getElementById('contexto').value,
            decision: document.getElementById('decision').value,
            datos: document.getElementById('datos').value,
            restricciones: document.getElementById('restricciones').value
        };

        // Obtener el prompt desde el diccionario (definido en prompts.js)
        const promptFinal = construirPrompt(datosUsuario);

        // Mostrar resultado
        outputPrompt.textContent = promptFinal;
        seccionResultado.style.display = 'block';
        seccionResultado.scrollIntoView({ behavior: 'smooth' });
    });

    // 3. Evento: Copiar al Portapapeles
    btnCopiar.addEventListener('click', async () => {
        const texto = outputPrompt.textContent;
        try {
            await navigator.clipboard.writeText(texto);
            const originalText = btnCopiar.textContent;
            btnCopiar.textContent = '¡Copiado con éxito!';
            btnCopiar.style.backgroundColor = '#10b981'; // Verde temporal
            
            setTimeout(() => {
                btnCopiar.textContent = originalText;
                btnCopiar.style.backgroundColor = '';
            }, 2000);
        } catch (err) {
            console.error('Error al copiar: ', err);
        }
    });

    // 4. Función de Validación
    function validarFormulario() {
        if (!selectCaso.value) return false;
        
        const camposObligatorios = ['contexto', 'decision', 'datos'];
        return camposObligatorios.every(id => {
            const el = document.getElementById(id);
            return el.value.trim().length > 0;
        });
    }

    // 5. Opcional: Limpiar o precargar datos al cambiar de caso
    selectCaso.addEventListener('change', () => {
        seccionResultado.style.display = 'none';
        console.log(`Cambiado al escenario: ${selectCaso.value}`);
        // Aquí se podrían inyectar placeholders dinámicos según el caso
    });
});