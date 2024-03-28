
var aciertos;
var fallos;
var tiempo;
var reloj;
var estado_preguntas =[];
var actual;
var pos;
var estado;
var letras = "ABCDEFGHIJLMNÑOPQRSTUVXYZ";
var aciertos_usuario = 0; 
var roscos_usuario = 0;
var partidas_usuario = 0;
var letraActual = 'A';
var preguntaActual;
var rosco = {};
var preguntas;

// Carga los sonidos
var sonidoSintonia = new Audio('mp3/sintonia.mp3');
sonidoSintonia.volume = 0.2;
var sonidoClick = new Audio('mp3/click.mp3');
sonidoClick.loop = true;
var sonidoJugar = new Audio('mp3/jugar.mp3');
var sonidoFin = new Audio('mp3/fin.mp3');
var sonidoAcierto = new Audio('mp3/acierto.mp3');
var sonidoFallo = new Audio('mp3/fallo.mp3');
var sonidoPasapalabra = new Audio('mp3/pasapalabra.mp3');
sonidoPasapalabra.volume = 0.2;
let musicOn = true;


window.onload = function() {
iniciar();
document.getElementById('playButton').addEventListener('click', jugar);

document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        // Inicia el ciclo de juego
        cicloDeJuego();
    }
});

};

function playMusic() {
    if (tiempo === 180 || tiempo === 0) {
        musicOn = true;
        sonidoSintonia.play();
        document.getElementById('musicButton').innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

function stopMusic() {
        musicOn = false;
        sonidoSintonia.pause();
        document.getElementById('musicButton').innerHTML = '<i class="fas fa-volume-mute"></i>';
}

function toggleMusic() {
    if (musicOn) {
        stopMusic();
    } else {
        playMusic();
    }
}

function iniciar(){
    if (musicOn) {
        sonidoSintonia.play();
    }
    // iniciarTiempo();
    tiempo = 180;
    // iniciarRosco();
    pos = 0;
    aciertos =0;
    fallos =0;
    for (let i = 0; i < letras.length; i++) {
        estado_preguntas[i] = 0;
    }
    dibujar_rosco();
    window.addEventListener('resize', resizeCanvas, false);
    // Call resizeCanvas once to initially size and draw the canvas
    resizeCanvas();
    dibujar_tiempo(tiempo);
    //poner_datos_login();
    document.getElementById('playButton').hidden = false;

    } 
    


    function jugar(){
        fetch('/rosco')
        .then(response => {
            if (response.headers.get('Content-Type').includes('application/json')) {
                return response.json();
            } else {
                throw new Error('Received non-JSON response');
            }
        })
        .then(data => {
            rosco = data;
            //ocultamos boton
            document.getElementById('playButton').hidden = true;
            reloj = setInterval(quitarSegundo, 1000); // 1000 milisegundos = 1 segundo 
            quitarSegundo(); // Llamar a quitarSegundo inmediatamente después de iniciar el intervalo
            sonidoSintonia.pause();
            sonidoSintonia.currentTime = 0; // Opcional: reinicia el sonido para la próxima vez que se reproduzca
            sonidoClick.play();
            // mostrar primera pregunta
            dibujar_pregunta(rosco[letras[pos]].texto);
        })
        .catch(error => console.error('Error:', error));
    }

    async function cicloDeJuego() {
        var respuesta = document.getElementById('respuestaInput').value;
    
        if (respuesta === '') {
            sonidoPasapalabra.play();
            // Si el input está vacío, interpretarlo como "pasapalabra"
        } else {
            // Si se proporciona una respuesta, comprobar si es correcta
            respuestaCorrecta = await comprobarRespuesta();
            if (respuestaCorrecta=== 'OK') {
                // Si la respuesta es correcta, marcar la pregunta como respondida correctamente
                estado_preguntas[pos] = 1;
                aciertos++;
            } else {
                // Si la respuesta es incorrecta, marcar la pregunta como respondida incorrectamente
                estado_preguntas[pos] = -1;
                fallos++;
                alert("La respuesta correcta era: "+respuestaCorrecta);
            }
        }
    
        // Pasar a la siguiente pregunta que aún no ha sido respondida
        do {
            pos = (pos + 1) % estado_preguntas.length;
        } while (estado_preguntas[pos] !== 0 && !estado_preguntas.every(val => val !== 0));
    
        // Dibujar la siguiente pregunta
        dibujar_pregunta(rosco[letras[pos]].texto);
        document.getElementById('respuestaInput').value = ''; // Limpiar el input
    }
    
    function siguienteLetra(letra) {
        // Encuentra el índice de la letra actual en la cadena de texto 'letras'
        var indiceActual = letras.indexOf(letra);
    
        // Si la letra no se encuentra en 'letras', devuelve un error
        if (indiceActual === -1) {
            console.error(`La letra '${letra}' no se encuentra en 'letras'`);
            return;
        }
    
        // Calcula el índice de la siguiente letra
        var indiceSiguiente = (indiceActual + 1) % letras.length;
    
        // Devuelve la siguiente letra
        return letras[indiceSiguiente];
    }
    
    function dibujar_pregunta(pregunta) {
        var elementoCanvas = document.getElementById('canvas_id');
        if (elementoCanvas && elementoCanvas.getContext) {
            var contextoCanvas = elementoCanvas.getContext('2d');
            if (contextoCanvas) {
    
                // Vuelve a dibujar el rosco
                dibujar_rosco();
    
                // Redibujar el tiempo
                dibujar_tiempo(tiempo);
    
                var radioRosco = Math.min(elementoCanvas.width, elementoCanvas.height) / 2 - 30; // Radio del rosco
                var centroXCanvas = elementoCanvas.width / 2; // Centro del canvas (x)
                var centroYCanvas = elementoCanvas.height / 2; // Centro del canvas (y)
    
                contextoCanvas.fillStyle = '#000000';
                contextoCanvas.font = '24px "Tahoma"';
                contextoCanvas.textAlign = "center";
                contextoCanvas.textBaseline = "middle";
    
                // Divide la pregunta en palabras
                var palabrasPregunta = pregunta.split(' ');
                var lineaTexto = '';
                var lineasTexto = [];
    
                for (var n = 0; n < palabrasPregunta.length; n++) {
                    var pruebaLinea = lineaTexto + palabrasPregunta[n] + ' ';
                    var metricsTexto = contextoCanvas.measureText(pruebaLinea);
                    var testWidthTexto = metricsTexto.width;
                    if (testWidthTexto > radioRosco * 2 * 0.7 && n > 0) {
                        lineasTexto.push(lineaTexto);
                        lineaTexto = palabrasPregunta[n] + ' ';
                    }
                    else {
                        lineaTexto = pruebaLinea;
                    }
                }
                lineasTexto.push(lineaTexto);
    
                // Dibuja las líneas en el canvas, centradas verticalmente
                var lineHeightTexto = parseInt(contextoCanvas.font); // Altura de la línea
                var totalHeightTexto = lineasTexto.length * lineHeightTexto; // Altura total del texto
                var startYTexto = centroYCanvas - totalHeightTexto / 2 + lineHeightTexto / 2; // Posición y de inicio para el dibujo
    
                contextoCanvas.fillStyle = '#000000'; // Establece el color del texto a negro
    
                for (var i = 0; i < lineasTexto.length; i++) {
                    contextoCanvas.fillText(lineasTexto[i], centroXCanvas, startYTexto + i * lineHeightTexto);
                }
            }
        }
    }


    async function comprobarRespuesta() {
        // Obtiene la respuesta del usuario
        var respuestaUsuario = document.getElementById('respuestaInput').value;
        
        // ID de la pregunta actual
        var idPregunta = rosco[letras[pos]].id;

        // Reemplaza 'urlDelBackend' con la URL de tu backend
        var url = '/comprobarRespuesta';
    
        // Los datos que enviarás en la solicitud
        var datos = {
            idPregunta: idPregunta,
            respuesta: respuestaUsuario
        };
    
        // Obtiene el token CSRF del meta tag
        var csrfToken = document.querySelector('meta[name="_csrf"]').content;
    
        // Opciones de la solicitud fetch
        var opciones = {
            method: 'POST', // o 'GET' si tu backend lo requiere
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken // Incluye el token CSRF en la cabecera de la solicitud
            },
            body: JSON.stringify(datos) // convierte los datos a una cadena JSON
        };
    
        try {
            let response = await fetch(url, opciones);
            let data = await response.json();
    
            if (data.respuesta === 'OK') {
                // La respuesta es correcta
                sonidoAcierto.play();
                return 'OK';
            } else {
                // La respuesta es incorrecta
                sonidoFallo.play();
                return data.respuesta;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    
    function quitarSegundo(){
            if(tiempo>0)
            { 
                tiempo-=1; 
            }
            else
            { 
                sonidoClick.pause();
                sonidoClick.currentTime = 0; // Opcional: reinicia el sonido para la próxima vez que se reproduzca
                sonidoFin.play();
                finalizar(); 
            }
            dibujar_tiempo(tiempo);
    }


    function finalizar(){
        clearInterval(reloj);
        // Código para finalizar el juego...

        // Obtén el contexto del canvas
        var elemento = document.getElementById('canvas_id');
        var contexto = elemento.getContext('2d');

        // Dibuja un rectángulo semi-transparente sobre todo el canvas
        contexto.fillStyle = 'rgba(0, 0, 0, 0.5)';
        contexto.fillRect(0, 0, elemento.width, elemento.height);

        // Dibuja el mensaje
        contexto.fillStyle = '#FFFFFF';
        contexto.font = '40px "Tahoma"';
        contexto.textAlign = "center";
        contexto.textBaseline = "middle";
        contexto.fillText("Tiempo agotado", elemento.width / 2, elemento.height / 2);
        
        // Pregunta al usuario si quiere jugar otra vez
        var jugarOtraVez = confirm("¿Quieres jugar otra vez?");
        if (jugarOtraVez) {
            // Reinicia el juego
            iniciar();
        }
        else {
            // Después de 2 segundos (2000 milisegundos), redirigir a la página de records
            setTimeout(function() {
            window.location.href = '/';
            }, 2000);
            }
        }
        

   
    
    function dibujar_tiempo(seg){
        var elemento = document.getElementById('canvas_id');
        if (elemento && elemento.getContext) {
            var contexto = elemento.getContext('2d');
            if (contexto) {
                var radio = Math.min(elemento.width, elemento.height) / 2 - 30; // Radio del rosco
                var centroX = elemento.width / 2 - 30; // Centro del canvas (x)
                var centroY = elemento.height / 2; // Centro del canvas (y)
    
                // Posición del tiempo relativa al rosco
                var tiempoX = centroX - radio - (radio/4); 
                var tiempoY = centroY - radio +(radio/5);
    
                contexto.font = '24px "Tahoma"';
                contexto.textAlign = "center";
                contexto.textBaseline = "middle";
    
                contexto.fillStyle = '#000000';
                contexto.beginPath();
                contexto.arc(tiempoX, tiempoY, 35, 0, Math.PI*2, true);
                contexto.fill();
    
                contexto.fillStyle = '#aaaaFF';
                contexto.beginPath();
                contexto.arc(tiempoX, tiempoY, 30, 0, Math.PI*2, true);
                contexto.fill();
    
                contexto.fillStyle = '#000000';
                contexto.fillText(seg.toString(), tiempoX, tiempoY + 10);
            }
        }
    }
    
    
    

    function resizeCanvas() {
        var canvas = document.getElementById('canvas_id');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.6;
        dibujar_rosco();
    }
    
    function dibujar_rosco(){
        //Recibimos el elemento canvas
        var elemento = document.getElementById('canvas_id');
        //Comprobacion sobre si encontramos un elemento
        //y podemos extraer su contexto con getContext(), que indica compatibilidad con canvas
        if (elemento && elemento.getContext) {
            //Accedo al contexto de '2d' de este canvas, necesario para dibujar
            var contexto = elemento.getContext('2d');
            if (contexto) {
                contexto.clearRect(0, 0, elemento.width, elemento.height);
                //Si tengo el contexto 2d es que todo ha ido bien y puedo empezar a dibujar en el canvas
                var radio = Math.min(elemento.width, elemento.height) / 2 - 30; // Radio del rosco
                var centroX = elemento.width / 2; // Centro del canvas (x)
                var centroY = ((elemento.height ) / 2 ) ; // Centro del canvas (y)

                contexto.fillStyle = '#000000';
                contexto.font = '24px "Tahoma"';
                contexto.textAlign = "center";
                contexto.textBaseline = "center";
    
                for (var i=0;i<25;i++)
                {
                    x= centroX + radio*Math.cos((i*14.4-90)*Math.PI/180);
                    y= centroY + radio*Math.sin((i*14.4-90)*Math.PI/180);
    
                    contexto.fillStyle = '#ffffff';
                    contexto.beginPath();
                    contexto.arc(x, y-5,25, 0, Math.PI*2, true);
                    contexto.fill();
    
                    switch(estado_preguntas[i]){
                        case 0:	contexto.fillStyle = '#3b5998';	
                                    if(pos == i)
                        {contexto.fillStyle = '#cccccc';};break;
                        case 1:	contexto.fillStyle = '#55cc55';break;
                        case -1:	contexto.fillStyle = '#cc5555';break;
                    }
    
                    contexto.beginPath();
                    contexto.arc(x, y-7,20, 0, Math.PI*2, true);
                    contexto.fill();
    
                    contexto.fillStyle = '#000000';
                    contexto.fillText(letras.charAt(i), x , y );
                }

        // Dibujar la puntuación cerca del círculo de las letras
        var puntuacionX = centroX - radio - elemento.width * 0.06; // 10% del ancho del canvas
        var puntuacionY = centroY + radio / 3 * 2;

        contexto.fillStyle = '#0000F0';
        contexto.fillRect(puntuacionX, puntuacionY, 65, 40);
        
        contexto.strokeStyle = "rgb(0,0,0)";
        contexto.lineWidth  = 3;
        contexto.beginPath();
        contexto.moveTo(puntuacionX - 5, puntuacionY);
        contexto.lineTo(puntuacionX + 70, puntuacionY);
        contexto.stroke();
                
        contexto.beginPath();
        contexto.moveTo(puntuacionX - 5, puntuacionY + 40);
        contexto.lineTo(puntuacionX + 70, puntuacionY + 40);
        contexto.stroke();
        
        contexto.beginPath();
        contexto.moveTo(puntuacionX, puntuacionY - 5);
        contexto.lineTo(puntuacionX, puntuacionY + 45);
        contexto.stroke();
        
        contexto.beginPath();
        contexto.moveTo(puntuacionX + 65, puntuacionY - 5);
        contexto.lineTo(puntuacionX + 65, puntuacionY + 45);
        contexto.stroke();
        
        contexto.fillStyle = '#FFFFFF';
        contexto.fillText(aciertos.toString(), puntuacionX + 30, puntuacionY + 25);

        // Dibujar el número de fallos debajo de la puntuación
        var fallosX = puntuacionX;
        var fallosY = puntuacionY + elemento.height * 0.1; // 10% de la altura del canvas

        contexto.fillStyle = '#FF0000'; // Fondo rojo
        contexto.fillRect(fallosX, fallosY, 65, 40);

        contexto.strokeStyle = "rgb(0,0,0)";
        contexto.lineWidth  = 3;
        contexto.beginPath();
        contexto.moveTo(fallosX - 5, fallosY);
        contexto.lineTo(fallosX + 70, fallosY);
        contexto.stroke();

        contexto.beginPath();
        contexto.moveTo(fallosX - 5, fallosY + 40);
        contexto.lineTo(fallosX + 70, fallosY + 40);
        contexto.stroke();

        contexto.beginPath();
        contexto.moveTo(fallosX, fallosY - 5);
        contexto.lineTo(fallosX, fallosY + 45);
        contexto.stroke();

        contexto.beginPath();
        contexto.moveTo(fallosX + 65, fallosY - 5);
        contexto.lineTo(fallosX + 65, fallosY + 45);
        contexto.stroke();

        contexto.fillStyle = '#FFFFFF'; // Texto blanco
        contexto.fillText(fallos.toString(), fallosX + 30, fallosY + 25);
            }
        }
    }
 