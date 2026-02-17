/**
 * SISTEMA DE BÚSQUEDA DE USUARIOS Y REGISTRO DE TAREAS
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const URL_BASE = 'http://localhost:3000';

// ============================================
// ELEMENTOS DEL DOM - Formulario de búsqueda
// ============================================

const formularioBusqueda = document.getElementById('usuario');
const inputDocumento = document.getElementById('documento');
const datosUsuario = document.getElementById('datosUsuario');
const infoUsuario = document.getElementById('infoUsuario');
const seccionTareas = document.getElementById('seccionTareas');

// ============================================
// ELEMENTOS DEL DOM - Formulario de tareas
// ============================================

const formularioTareas = document.getElementById('formularioTareas');
const inputTitulo = document.getElementById('tituloTarea');
const inputDescripcion = document.getElementById('descripcionTarea');
const selectEstado = document.getElementById('estadoTarea');
const btnAgregarTarea = document.getElementById('btnAgregarTarea');

// Elementos de error
const errorTitulo = document.getElementById('errorTitulo');
const errorDescripcion = document.getElementById('errorDescripcion');
const errorEstado = document.getElementById('errorEstado');

// ============================================
// ELEMENTOS DEL DOM - Tabla de tareas
// ============================================

const seccionListaTareas = document.getElementById('seccionListaTareas');
const tablaTareas = document.getElementById('tablaTareas');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const mensajeSinTareas = document.getElementById('mensajeSinTareas');
const contadorTareas = document.getElementById('contadorTareas');

// Variable para guardar el usuario actual
let usuarioActual = null;

// Variable para guardar las tareas actuales
let tareasActuales = [];

// ============================================
// FUNCIONES DE BÚSQUEDA
// ============================================

async function buscarUsuario(documento) {
    try {
        console.log('🔍 Buscando usuario con documento:', documento);
        
        const respuesta = await fetch(`${URL_BASE}/usuarios?documento=${documento}`);
        
        if (!respuesta.ok) {
            throw new Error('Error en la petición al servidor');
        }
        
        const usuarios = await respuesta.json();
        
        if (usuarios.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        
        const usuario = usuarios[0];
        
        console.log('✅ Usuario encontrado:', usuario);
        return usuario;
        
    } catch (error) {
        console.error('❌ Error:', error);
        mostrarMensajeError('No se encontró un usuario con ese documento');
        return null;
    }
}

// ============================================
// FUNCIONES PARA MOSTRAR DATOS
// ============================================

function mostrarDatosUsuario(usuario) {
    infoUsuario.innerHTML = '';
    
    const html = `
        <div style="background-color: var(--color-gray-50); padding: 1rem; border-radius: 8px;">
            <p style="margin-bottom: 0.5rem;">
                <strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}
            </p>
            <p style="margin-bottom: 0.5rem;">
                <strong>Documento:</strong> ${usuario.documento}
            </p>
            <p style="margin-bottom: 0;">
                <strong>Email:</strong> ${usuario.email || 'No registrado'}
            </p>
        </div>
    `;
    
    infoUsuario.innerHTML = html;
    datosUsuario.classList.remove('hidden');
    seccionTareas.classList.remove('hidden');
}

function ocultarDatosUsuario() {
    datosUsuario.classList.add('hidden');
    seccionTareas.classList.add('hidden');
    seccionListaTareas.classList.add('hidden');
    usuarioActual = null;
    tareasActuales = [];
    
    // Limpiamos el formulario de tareas
    formularioTareas.reset();
    limpiarErrores();
}

// ============================================
// FUNCIONES PARA VALIDAR FORMULARIO DE TAREAS
// ============================================

function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.previousElementSibling.classList.add('error');
}

function limpiarError(elemento) {
    elemento.textContent = '';
    elemento.previousElementSibling.classList.remove('error');
}

function limpiarErrores() {
    limpiarError(errorTitulo);
    limpiarError(errorDescripcion);
    limpiarError(errorEstado);
}

function validarFormularioTareas() {
    // Limpiamos errores anteriores
    limpiarErrores();
    
    let esValido = true;
    
    // Validamos título
    const titulo = inputTitulo.value.trim();
    if (titulo === '') {
        mostrarError(errorTitulo, 'El título es obligatorio');
        esValido = false;
    }
    
    // Validamos descripción
    const descripcion = inputDescripcion.value.trim();
    if (descripcion === '') {
        mostrarError(errorDescripcion, 'La descripción es obligatoria');
        esValido = false;
    }
    
    // Validamos estado
    const estado = selectEstado.value;
    if (estado === '') {
        mostrarError(errorEstado, 'Debes seleccionar un estado');
        esValido = false;
    }
    
    return esValido;
}

// ============================================
// FUNCIONES PARA TAREAS
// ============================================

async function registrarTarea(tarea) {
    try {
        console.log('📝 Registrando tarea:', tarea);
        
        // Deshabilitamos el botón mientras se procesa
        btnAgregarTarea.disabled = true;
        btnAgregarTarea.textContent = 'Guardando...';
        
        const respuesta = await fetch(`${URL_BASE}/tareas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarea)
        });
        
        if (!respuesta.ok) {
            throw new Error('Error al registrar la tarea');
        }
        
        const tareaCreada = await respuesta.json();
        
        console.log('✅ Tarea registrada exitosamente:', tareaCreada);
        return tareaCreada;
        
    } catch (error) {
        console.error('❌ Error al registrar tarea:', error);
        mostrarMensajeError('Hubo un error al registrar la tarea. Intenta nuevamente.');
        return null;
    } finally {
        // Rehabilitamos el botón
        btnAgregarTarea.disabled = false;
        btnAgregarTarea.innerHTML = '<span class="btn__text">Agregar Tarea</span><span class="btn__icon">➕</span>';
    }
}

async function cargarTareasUsuario(documento) {
    try {
        console.log('📋 Cargando tareas del usuario:', documento);
        
        const respuesta = await fetch(`${URL_BASE}/tareas?documento=${documento}`);
        
        if (!respuesta.ok) {
            throw new Error('Error al cargar tareas');
        }
        
        const tareas = await respuesta.json();
        
        console.log('✅ Tareas cargadas:', tareas);
        return tareas;
        
    } catch (error) {
        console.error('❌ Error al cargar tareas:', error);
        mostrarMensajeError('No se pudieron cargar las tareas del usuario');
        return [];
    }
}

function agregarTareaATabla(tarea) {
    const fila = document.createElement('tr');
    
    // Guardamos el ID en la fila
    fila.dataset.tareaId = tarea.id;
    
    fila.innerHTML = `
        <td>${tarea.titulo}</td>
        <td>${tarea.descripcion}</td>
        <td>
            <span class="estado-badge estado-${tarea.estado}">
                ${tarea.estado.replace('_', ' ')}
            </span>
        </td>
        <td>
            <div class="acciones">
                <button class="btn-accion btn-eliminar" onclick="eliminarTarea(${tarea.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </td>
    `;
    
    // Agregamos la fila al inicio de la tabla
    cuerpoTabla.insertBefore(fila, cuerpoTabla.firstChild);
    
    // Actualizamos el array de tareas actuales
    tareasActuales.unshift(tarea);
    
    // Actualizamos el contador
    actualizarContador();
    
    // Si la tabla estaba oculta, la mostramos
    if (tablaTareas.classList.contains('hidden')) {
        mensajeSinTareas.classList.add('hidden');
        tablaTareas.classList.remove('hidden');
        seccionListaTareas.classList.remove('hidden');
    }
}

function mostrarTareasEnTabla(tareas) {
    // Limpiamos el cuerpo de la tabla
    cuerpoTabla.innerHTML = '';
    
    // Guardamos las tareas en la variable global
    tareasActuales = tareas;
    
    // Actualizamos el contador
    actualizarContador();
    
    // Si no hay tareas, mostramos el mensaje y ocultamos la tabla
    if (tareas.length === 0) {
        mensajeSinTareas.classList.remove('hidden');
        tablaTareas.classList.add('hidden');
        return;
    }
    
    // Ocultamos el mensaje y mostramos la tabla
    mensajeSinTareas.classList.add('hidden');
    tablaTareas.classList.remove('hidden');
    
    // Creamos una fila para cada tarea
    tareas.forEach(tarea => {
    const fila = document.createElement('tr');
    
    // Guardamos el ID de la tarea en un atributo data
    fila.dataset.tareaId = tarea.id;
    
    fila.innerHTML = `
        <td>${tarea.titulo}</td>
        <td>${tarea.descripcion}</td>
        <td>
            <span class="estado-badge estado-${tarea.estado}">
                ${tarea.estado.replace('_', ' ')}
            </span>
        </td>
        <td>
            <div class="acciones">
                <button class="btn-accion btn-eliminar" onclick="eliminarTarea(${tarea.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </td>
    `;
    
    cuerpoTabla.appendChild(fila);
});
    
    // Mostramos la sección de lista de tareas
    seccionListaTareas.classList.remove('hidden');
}

function actualizarContador() {
    const cantidad = tareasActuales.length;
    contadorTareas.textContent = `${cantidad} ${cantidad === 1 ? 'tarea' : 'tareas'}`;
}

// ============================================

/**
 * Elimina una tarea del servidor y actualiza la tabla
 * @param {number} id - ID de la tarea a eliminar
 */
async function eliminarTarea(id) {
    try {
        // Confirmación antes de eliminar
        const confirmar = confirm('¿Estás seguro de que deseas eliminar esta tarea?');
        
        if (!confirmar) {
            // Si el usuario cancela, no hacemos nada
            return;
        }
        
        console.log('🗑️ Eliminando tarea con ID:', id);
        
        // Enviamos petición DELETE al servidor
        const respuesta = await fetch(`${URL_BASE}/tareas/${id}`, {
            method: 'DELETE'
        });
        
        if (!respuesta.ok) {
            throw new Error('Error al eliminar la tarea');
        }
        
        console.log('✅ Tarea eliminada exitosamente');
        
        // Mostramos mensaje de éxito
        mostrarMensajeExito('Tarea eliminada exitosamente');
        
        // Actualizamos la tabla
        // Opción 1: Remover solo la fila eliminada (más eficiente)
        removerFilaDeTarea(id);
        
        // Opción 2: Recargar todas las tareas (más seguro)
        // const tareas = await cargarTareasUsuario(usuarioActual.documento);
        // mostrarTareasEnTabla(tareas);
        
    } catch (error) {
        console.error('❌ Error al eliminar tarea:', error);
        mostrarMensajeError('No se pudo eliminar la tarea. Intenta nuevamente.');
    }
}


// ============================================

/**
 * Remueve visualmente una fila de la tabla
 * @param {number} id - ID de la tarea cuya fila se debe remover
 */
function removerFilaDeTarea(id) {
    // Buscamos la fila que tiene ese ID en su atributo data
    const fila = document.querySelector(`tr[data-tarea-id="${id}"]`);
    
    if (fila) {
        // Agregamos animación de salida
        fila.style.animation = 'fadeOut 0.3s ease-out';
        
        // Después de la animación, removemos del DOM
        setTimeout(() => {
            fila.remove();
            
            // Actualizamos el array de tareas actuales
            tareasActuales = tareasActuales.filter(tarea => tarea.id !== id);
            
            // Actualizamos el contador
            actualizarContador();
            
            // Si no quedan tareas, mostramos el mensaje vacío
            if (tareasActuales.length === 0) {
                mensajeSinTareas.classList.remove('hidden');
                tablaTareas.classList.add('hidden');
            }
        }, 300);
    }
}



// ============================================
// FUNCIONES PARA MENSAJES
// ============================================

function mostrarMensajeExito(texto = '✅ Tarea registrada exitosamente') {
    mostrarNotificacion(texto, 'success');
}

function mostrarMensajeError(texto) {
    mostrarNotificacion(texto, 'error');
}

function mostrarNotificacion(texto, tipo) {
    // Creamos un elemento temporal para el mensaje
    const mensaje = document.createElement('div');
    mensaje.textContent = texto;
    
    const colorFondo = tipo === 'success' ? '#10b981' : '#ef4444';
    
    mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${colorFondo};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(mensaje);
    
    // Removemos el mensaje después de 3 segundos
    setTimeout(() => {
        mensaje.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(mensaje)) {
                document.body.removeChild(mensaje);
            }
        }, 300);
    }, 3000);
}

// ============================================
// EVENTO DE BÚSQUEDA
// ============================================

formularioBusqueda.addEventListener('submit', async function(evento) {
    evento.preventDefault();
    
    const documento = inputDocumento.value.trim();
    
    if (documento === '') {
        mostrarMensajeError('Por favor ingresa un documento');
        return;
    }
    
    ocultarDatosUsuario();
    
    const usuarioEncontrado = await buscarUsuario(documento);
    
    if (usuarioEncontrado) {
        usuarioActual = usuarioEncontrado;
        mostrarDatosUsuario(usuarioEncontrado);
        
        // Cargamos las tareas del usuario
        const tareas = await cargarTareasUsuario(usuarioEncontrado.documento);
        mostrarTareasEnTabla(tareas);
    }
});


// ============================================
// EVENTO DE REGISTRO DE TAREAS
// ============================================

formularioTareas.addEventListener('submit', async function(evento) {
    evento.preventDefault();
    
    if (!validarFormularioTareas()) {
        return;
    }
    
    const nuevaTarea = {
        documento: usuarioActual.documento,
        titulo: inputTitulo.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        estado: selectEstado.value
    };
    
    const tareaRegistrada = await registrarTarea(nuevaTarea);
    
    if (tareaRegistrada) {
        // Mostramos mensaje de éxito
        mostrarMensajeExito();
        
        // Agregamos la tarea a la tabla inmediatamente
        agregarTareaATabla(tareaRegistrada);
        
        // Limpiamos el formulario
        formularioTareas.reset();
        limpiarErrores();
        inputTitulo.focus();
    }
});

// ============================================
// LIMPIAR ERRORES AL ESCRIBIR
// ============================================

inputTitulo.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        limpiarError(errorTitulo);
    }
});

inputDescripcion.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        limpiarError(errorDescripcion);
    }
});

selectEstado.addEventListener('change', function() {
    if (this.value !== '') {
        limpiarError(errorEstado);
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Sistema iniciado y listo para usar');
    console.log('🔧 Versión final del proyecto');
});