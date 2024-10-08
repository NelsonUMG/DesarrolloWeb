const personaje = document.getElementById('personaje');
const gameArea = document.getElementById('gameArea');
const gameArea2 = document.getElementById('gameArea2');
const meta = document.getElementById('meta');
let contadorMuertes = 0;


const archivosMusica = [
    'cancion1.mp3',
    'cancion2.mp3',
    'cancion3.mp3'
];

let indiceMusicaActual = 0;
const musicaFondo = document.getElementById('musicaFondo');
musicaFondo.volume = 0.3;

function reproducirSiguienteCancion() {
    indiceMusicaActual = (indiceMusicaActual + 1) % archivosMusica.length;
    musicaFondo.src = archivosMusica[indiceMusicaActual];
    musicaFondo.play().catch(error => {
        console.log('Error al reproducir:', error);
    });
}

function iniciarMusica() {
    musicaFondo.src = archivosMusica[indiceMusicaActual];
    musicaFondo.play().catch(error => {
        console.log('Error al iniciar la música:', error);
    });

    musicaFondo.addEventListener('ended', reproducirSiguienteCancion);
}

// Esperar la interacción del usuario para iniciar la música
document.addEventListener('click', iniciarMusica, { once: true });




const niveles = [
    {
        fondo: 'callebg.jpg',
        obstaculos: [
            { id: 'obstaculo1', direccion: 'derecha', bottom: 100 }
        ]
    },
    {
        fondo: 'callebg2.jpg',
        obstaculos: [
            { id: 'obstaculo1', direccion: 'derecha', bottom: 50 },
            { id: 'obstaculo1', direccion: 'derecha', bottom: 149 },
            { id: 'obstaculo1', direccion: 'izquierda2', bottom: 241 }
        ]
    },
    {
        fondo: 'callebg3.jpg',
        obstaculos: [
            { id: 'obstaculo1', direccion: 'vertical', bottom: Math.random() * 400 },
            { id: 'obstaculo1', direccion: 'vertical', bottom: Math.random() * 400 },
            
        ]
    }
    // Agrega más niveles si lo deseas
];

let nivelActual = 0;
// Definir variables globales para las velocidades
window.velocidadPersonaje = 10; // Velocidad inicial del personaje
window.velocidadObstaculos = 3; // Velocidad inicial de los obstáculos

// Configurar la dificultad según el radio button seleccionado
function configurarDificultad() {
    const dificultadSeleccionada = document.querySelector('input[name="dificultad"]:checked').value;

    switch (dificultadSeleccionada) {
        case 'baja':
            window.velocidadPersonaje = 5;
            window.velocidadObstaculos = 2;
            break;
        case 'media':
            window.velocidadPersonaje = 10;
            window.velocidadObstaculos = 5;
            break;
        case 'alta':
            window.velocidadPersonaje = 15;
            window.velocidadObstaculos = 8;
            break;
        default:
            window.velocidadPersonaje = 10;
            window.velocidadObstaculos = 3;
            break;
    }
}

// Inicializar la dificultad al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    configurarDificultad();
});

// Configurar la dificultad cuando se cambie el radio button
document.querySelectorAll('input[name="dificultad"]').forEach(radio => {
    radio.addEventListener('change', configurarDificultad);
});

document.addEventListener('keydown', moverPersonaje);

// Función para mover el personaje
function moverPersonaje(event) {
    let topPos = parseInt(window.getComputedStyle(personaje).getPropertyValue('bottom'));
    let leftPos = parseInt(window.getComputedStyle(personaje).getPropertyValue('left'));

    // Tecla hacia arriba (avanzar)
    if (event.key === 'ArrowUp') {
        if (topPos + velocidadPersonaje + personaje.offsetHeight < gameArea.offsetHeight) {
            personaje.style.bottom = (topPos + velocidadPersonaje) + 'px';
        } else {
            verificarMeta();
        }
    }

    // Tecla hacia abajo (retroceder)
    if (event.key === 'ArrowDown') {
        if (topPos - velocidadPersonaje >= 0) {
            personaje.style.bottom = (topPos - velocidadPersonaje) + 'px';
        }
    }

    // Tecla hacia la izquierda
    if (event.key === 'ArrowLeft') {
        if (leftPos - velocidadPersonaje >= 0) {
            personaje.style.left = (leftPos - velocidadPersonaje) + 'px';
        }
    }

    // Tecla hacia la derecha
    if (event.key === 'ArrowRight') {
        if (leftPos + velocidadPersonaje + personaje.offsetWidth <= gameArea.offsetWidth) {
            personaje.style.left = (leftPos + velocidadPersonaje) + 'px';
        }
    }

    verificarColision();
}

// Función para verificar si el personaje ha llegado a la meta
function verificarMeta() {
    const topPos = parseInt(window.getComputedStyle(personaje).getPropertyValue('bottom'));
    const metaPos = gameArea.offsetHeight - meta.offsetHeight;

    if (topPos + personaje.offsetHeight >= metaPos) {
        pasarAlSiguienteNivel();
    }
}

// Función para cargar el nivel actual
function cargarNivel(nivel) {
    const configuracion = niveles[nivel];
    
    // Asignar el fondo a gameArea
    gameArea.style.backgroundImage = `url(${configuracion.fondo})`;
    
    // Cambiar la imagen del personaje según el nivel
    if (nivel === 1) {
        personaje.style.backgroundImage = 'url(personaje2.png)';
    } else {
        personaje.style.backgroundImage = 'url(personaje.png)';
    }

    // Elimina obstáculos existentes
    document.querySelectorAll('.obstaculo').forEach(obstaculo => obstaculo.remove());

    // Agrega nuevos obstáculos a gameArea
    configuracion.obstaculos.forEach(obstaculoConfig => {
        const obstaculo = document.createElement('div');
        obstaculo.id = obstaculoConfig.id;
        obstaculo.className = 'obstaculo';
        obstaculo.style.bottom = `${obstaculoConfig.bottom}px`;
        obstaculo.style.left = obstaculoConfig.direccion === 'derecha' ? '0px' : `${gameArea.offsetWidth - 60}px`;
        obstaculo.dataset.direccion = obstaculoConfig.direccion;

        // Cambiar imagen del obstáculo en el nivel 1 (callebg2.jpg)
        if (nivel === 1) {
            obstaculo.style.backgroundImage = 'url(obstaculo2.gif)';
            obstaculo.style.width = '25px';
            obstaculo.style.height = '30px';
        } else {
            obstaculo.style.backgroundImage = 'url(obstaculo.png)'; // Imagen por defecto para otros niveles
        }

        gameArea.appendChild(obstaculo);

        // Si hay gameArea2 y se necesita duplicar obstáculos
        if (gameArea2) {
            const obstaculo2 = obstaculo.cloneNode(true);
            gameArea2.appendChild(obstaculo2);
        }
    });
}



function moverObstaculos() {
    const minDistance = 100; // Distancia mínima entre obstáculos en píxeles

    document.querySelectorAll('.obstaculo').forEach(obstaculo => {
        const direccion = obstaculo.dataset.direccion;
        const gameAreaRect = gameArea.getBoundingClientRect();
        let topPos = parseInt(window.getComputedStyle(obstaculo).getPropertyValue('bottom'));
        let leftPos = parseInt(window.getComputedStyle(obstaculo).getPropertyValue('left'));

        if (nivelActual === 2) { // Nivel 3 en el array (índice 2)
            if (direccion === 'vertical') {
                // Mover hacia abajo
                if (topPos <= -30) { // Ajustar según la altura del obstáculo
                    obstaculo.style.bottom = `${gameAreaRect.height}px`;

                    // Evitar que los obstáculos aparezcan demasiado cerca uno del otro
                    let newLeftPos;
                    let isTooClose;
                    do {
                        newLeftPos = Math.random() * (gameAreaRect.width - 50); // Posición aleatoria
                        isTooClose = false;
                        document.querySelectorAll('.obstaculo').forEach(otherObstaculo => {
                            if (otherObstaculo !== obstaculo) {
                                let otherLeftPos = parseInt(window.getComputedStyle(otherObstaculo).getPropertyValue('left'));
                                if (Math.abs(newLeftPos - otherLeftPos) < minDistance) {
                                    isTooClose = true;
                                }
                            }
                        });
                    } while (isTooClose);

                    obstaculo.style.left = `${newLeftPos}px`;
                } else {
                    obstaculo.style.bottom = (topPos - velocidadObstaculos) + 'px';
                    obstaculo.style.transform = 'rotate(90deg)';
                }
            }
        } else {
            // Movimiento para otros niveles
            if (direccion === 'derecha') {
                if (leftPos >= gameArea.offsetWidth) {
                    obstaculo.style.left = '-60px';
                } else {
                    obstaculo.style.left = (leftPos + velocidadObstaculos) + 'px';
                }
            } else if (direccion === 'izquierda') {
                if (leftPos <= -60) {
                    obstaculo.style.left = `${gameArea.offsetWidth}px`;
                } else {
                    obstaculo.style.left = (leftPos - velocidadObstaculos) + 'px';
                    obstaculo.style.transform = 'rotate(180deg)';
                }
            } else if (direccion === 'izquierda2') {
                if (leftPos <= -60) {
                    obstaculo.style.left = `${gameArea.offsetWidth}px`;
                } else {
                    obstaculo.style.left = (leftPos - velocidadObstaculos) + 'px';
                }
            }
        }
        
        verificarColision();
    });
}


const sonidoColision = new Audio('colision.mp3');

// Función para verificar colisión entre el personaje y los obstáculos
function verificarColision() {
    const personajeRect = personaje.getBoundingClientRect();

    document.querySelectorAll('.obstaculo').forEach(obstaculo => {
        const obstaculoRect = obstaculo.getBoundingClientRect();

        if (
            personajeRect.left < obstaculoRect.right &&
            personajeRect.right > obstaculoRect.left &&
            personajeRect.top < obstaculoRect.bottom &&
            personajeRect.bottom > obstaculoRect.top
        ) {
            sonidoColision.play();
            // Incrementar contador de muertes solo si hay colisión
            contadorMuertes++;
            actualizarInfoJuego();

            alert('¡Colisión! Has perdido. Reiniciando nivel...');
            reiniciarNivel();
        }
    });
}

// Actualiza la visualización del nivel y las muertes
function actualizarInfoJuego() {
    document.getElementById('nivel').innerText = `Nivel: ${nivelActual + 1}`;
    document.getElementById('muertes').innerText = `Muertes: ${contadorMuertes}`;
}

// Función para reiniciar el nivel
function reiniciarNivel() {
    // Reiniciar la posición del personaje
    personaje.style.bottom = '0px';
    personaje.style.left = '50%';

    // Reiniciar los obstáculos del nivel actual
    if (nivelActual === 2) {
        document.querySelectorAll('.obstaculo').forEach(obstaculo => {
            if (obstaculo.dataset.direccion === 'vertical') {
                obstaculo.style.bottom = `${gameArea.offsetHeight}px`;
                obstaculo.style.left = `${Math.random() * (gameArea.offsetWidth - 30)}px`;
            }
        });
    } else {
        cargarNivel(nivelActual);
    }
}

// Función para pasar al siguiente nivel
function pasarAlSiguienteNivel() {
    nivelActual++;
    actualizarInfoJuego();

    if (nivelActual < niveles.length) {
        alert(`¡Felicidades! Has pasado al nivel ${nivelActual + 1}.`);
        cargarNivel(nivelActual);
        reiniciarNivel();
    } else {
        alert('¡Has completado todos los niveles!');
        reiniciarEstadoJuego(); // Reiniciar estado del juego al llegar al final
        cargarNivel(nivelActual);
        reiniciarNivel();
    }
}


function reiniciarEstadoJuego() {
    contadorMuertes = 0; // Reiniciar el contador de muertes
    nivelActual = 0; 
    actualizarInfoJuego(); 
}


// Inicializar el primer nivel
cargarNivel(nivelActual);
actualizarInfoJuego();

// Mueve los obstáculos continuamente
setInterval(moverObstaculos, 30);
