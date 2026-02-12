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

// Variable para guardar el usuario actual
let usuarioActual = null;

// ============================================
// FUNCIONES DE BÚSQUEDA
// ============================================

async function buscarUsuario(documento) {
    try {
        console.log('🔍 Buscando usuario con documento:', documento);
        
        // Buscamos en la tabla de usuarios filtrando por documento
        const respuesta = await fetch(`${URL_BASE}/usuarios?documento=${documento}`);
        
        if (!respuesta.ok) {
            throw new Error('Error en la petición al servidor');
        }
        
        // La respuesta es un array de usuarios que coinciden con el documento
        const usuarios = await respuesta.json();
        
        // Verificamos si encontramos algún usuario
        if (usuarios.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        
        // Tomamos el primer usuario encontrado (debería ser único por documento)
        const usuario = usuarios[0];
        
        console.log(' Usuario encontrado:', usuario);
        return usuario;
        
    } catch (error) {
        console.error(' Error:', error);
        alert('No se encontró un usuario con ese documento');
        return null;
    }
}

// ============================================
// FUNCIONES PARA MOSTRAR DATOS
// ============================================

function mostrarDatosUsuario(usuario) {
    // Limpiamos el contenedor
    infoUsuario.innerHTML = '';
    
    // Creamos el HTML con los datos del usuario
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
    
    // Insertamos el HTML en el contenedor
    infoUsuario.innerHTML = html;
    
    // Mostramos la sección de datos de usuario
    datosUsuario.classList.remove('hidden');
    
    // Mostramos la sección de tareas
    seccionTareas.classList.remove('hidden');
}

function ocultarDatosUsuario() {
    datosUsuario.classList.add('hidden');
    seccionTareas.classList.add('hidden');
    usuarioActual = null;
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
    
    // Ocultamos datos anteriores
    ocultarDatosUsuario();
    
    // Buscamos el usuario
    const usuarioEncontrado = await buscarUsuario(documento);
    
    if (usuarioEncontrado) {
        // Guardamos el usuario actual
        usuarioActual = usuarioEncontrado;
        
        // Mostramos los datos en la página
        mostrarDatosUsuario(usuarioEncontrado);
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Sistema iniciado');
});




