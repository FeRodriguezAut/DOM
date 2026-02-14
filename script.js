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
        alert('No se encontró un usuario con ese documento');
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
}

// ============================================
// FUNCIONES PARA VALIDAR FORMULARIO DE TAREAS
// ============================================

function validarFormularioTareas() {
    const titulo = inputTitulo.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const estado = selectEstado.value;
    
    if (titulo === '') {
        alert('Por favor ingresa el título de la tarea');
        return false;
    }
    
    if (descripcion === '') {
        alert('Por favor ingresa la descripción de la tarea');
        return false;
    }
    
    if (estado === '') {
        alert('Por favor selecciona el estado de la tarea');
        return false;
    }
    
    return true;
}

// ============================================
// FUNCIONES PARA TAREAS
// ============================================

async function registrarTarea(tarea) {
    try {
        console.log('📝 Registrando tarea:', tarea);
        
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
        alert('Hubo un error al registrar la tarea. Intenta nuevamente.');
        return null;
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
        return [];
    }
}

function mostrarTareasEnTabla(tareas) {
    // Limpiamos el cuerpo de la tabla
    cuerpoTabla.innerHTML = '';
    
    // Actualizamos el contador
    const cantidad = tareas.length;
    contadorTareas.textContent = `${cantidad} ${cantidad === 1 ? 'tarea' : 'tareas'}`;
    
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
        
        fila.innerHTML = `
            <td>${tarea.titulo}</td>
            <td>${tarea.descripcion}</td>
            <td>
                <span class="estado-badge estado-${tarea.estado}">
                    ${tarea.estado.replace('_', ' ')}
                </span>
            </td>
        `;
        
        cuerpoTabla.appendChild(fila);
    });
    
    // Mostramos la sección de lista de tareas
    seccionListaTareas.classList.remove('hidden');
}

// ============================================
// EVENTO DE BÚSQUEDA
// ============================================

formularioBusqueda.addEventListener('submit', async function(evento) {
    evento.preventDefault();
    
    const documento = inputDocumento.value.trim();
    
    if (documento === '') {
        alert('Por favor ingresa un documento');
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
        alert('¡Tarea registrada exitosamente!');
        formularioTareas.reset();
        inputTitulo.focus();
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Sistema iniciado');
});