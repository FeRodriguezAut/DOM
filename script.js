/**
 * ============================================
 * SISTEMA DE BÚSQUEDA DE USUARIOS Y REGISTRO DE TAREAS
 * ============================================
 * 
 * Este sistema permite:
 * 1. Buscar un usuario por su documento
 * 2. Mostrar la información del usuario encontrado
 * 3. Registrar tareas asociadas al usuario
 * 
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 * ============================================
 */

// ============================================
// 1. CONFIGURACIÓN DEL SERVIDOR
// ============================================

/**
 * URL_BASE: Es la dirección donde está nuestro servidor
 */
const URL_BASE = 'http://localhost:3000'; // Ajusta esto según tu servidor

// ============================================
// 2. SELECCIÓN DE ELEMENTOS DEL FORMULARIO DE BÚSQUEDA
// ============================================

/**
 * Aquí "agarramos" los elementos del HTML que vamos a usar
 * Es como tener referencias a los botones y cajas de texto
 * para poder trabajar con ellos
 */

// El formulario completo de búsqueda de usuario
const formularioBusqueda = document.getElementById('usuario');

// La caja de texto donde se escribe el documento
const inputDocumento = document.getElementById('documento');

// ============================================
// 3. FUNCIÓN PARA BUSCAR USUARIO
// ============================================

/**
 * Esta función busca un usuario en el servidor
 
 * @param {string} documento - El número de documento a buscar
 */
async function buscarUsuario(documento) {
    try {
        // Mostramos un mensaje en la consola para saber qué estamos haciendo
        console.log('🔍 Buscando usuario con documento:', documento);
        
        // Hacemos la petición al servidor
        
        const respuesta = await fetch(`${URL_BASE}/usuarios/${documento}`);
        
        // Verificamos si el servidor nos respondió correctamente
        if (!respuesta.ok) {
            // Si el servidor dice "no encontré ese usuario"
            throw new Error('Usuario no encontrado');
        }
        /** Conversion a .json */

        const usuario = await respuesta.json();
        
        // Mostramos en consola lo que encontramos
        console.log('✅ Usuario encontrado:', usuario);
        
        // Retornamos (devolvemos) el usuario encontrado
        return usuario;
        
    } catch (error) {
        // Si algo salió mal, mostramos el error
        console.error('❌ Error al buscar usuario:', error);
        
        // Mostramos un mensaje al usuario
        alert('No se encontró un usuario con ese documento');
        
        // Retornamos null (nada) porque no encontramos usuario
        return null;
    }
}

// ============================================
// 4. MANEJADOR DE BÚSQUEDA
// ============================================

/**
 * Esta función se ejecuta cuando el usuario hace clic en "Buscar"
 */
formularioBusqueda.addEventListener('submit', async function(evento) {
    // Evitamos que la página se recargue
    evento.preventDefault();
    
    // Obtenemos el valor que el usuario escribió
    const documento = inputDocumento.value.trim();
    
    // Verificamos que el usuario haya escrito algo
    if (documento === '') {
        alert('Por favor ingresa un documento');
        return; // Detenemos la ejecución aquí
    }
    
    // Llamamos a la función que busca el usuario
    const usuarioEncontrado = await buscarUsuario(documento);
    
    // Si encontramos un usuario, lo mostramos en consola
    if (usuarioEncontrado) {
        console.log(' Usuario listo para usar:', usuarioEncontrado);
    }
});

// ============================================
// 5. INICIALIZACIÓN
// ============================================

/**
 * Este código se ejecuta cuando la página termina de cargar
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Sistema de búsqueda iniciado');
    console.log('📋 Listo para buscar usuarios');
});




const usuario = document.querySelector("#usuario");


usuario.addEventListener('submit', (e) => {
  e.preventDefault();
  alert("Ok")
})