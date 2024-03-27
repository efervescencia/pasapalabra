
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

function iniciar(){
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
            // mostrar primera pregunta
            dibujar_pregunta(rosco[letras[pos]].texto);
        })
        .catch(error => console.error('Error:', error));
    }

    function cicloDeJuego() {
        var respuesta = document.getElementById('respuestaInput').value;
        document.getElementById('respuestaInput').value = ''; // Limpiar el input
    
        if (respuesta === '') {
            // Si el input está vacío, interpretarlo como "pasapalabra" y pasar a la siguiente pregunta
            pos = (pos + 1) % letras.length;
        } else {
            // Si se proporciona una respuesta, comprobar si es correcta
            if (respuesta.toLowerCase() === estado_preguntas[pos].pregunta.respuesta.toLowerCase()) {
                // Si la respuesta es correcta, marcar la pregunta como respondida correctamente
                estado_preguntas[pos].estado = 1;
                aciertos++;
            } else {
                // Si la respuesta es incorrecta, marcar la pregunta como respondida incorrectamente
                estado_preguntas[pos].estado = -1;
                fallos++;
            }
    
            // Pasar a la siguiente pregunta que aún no ha sido respondida
            do {
                pos = (pos + 1) % estado_preguntas.length;
            } while (estado_preguntas[pos].estado !== 0 && !estado_preguntas.every(val => val.estado !== 0));
        }
    
        // Dibujar la siguiente pregunta
        dibujar_pregunta(rosco[letras[pos]].texto);
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


    function comprobarRespuesta() {
        // Obtiene la respuesta del usuario
        var respuestaUsuario = document.getElementById('respuestaInput').value;
    
        // Comprueba si la respuesta es correcta
        if (rosco[letraActual].respuesta === respuestaUsuario) {
            // Si la respuesta es correcta, marca la pregunta como respondida
            estadoPreguntas[pos] = 1;
        }
    
        // Limpia el input
        document.getElementById('respuestaInput').value = '';
    
        // Continúa con el ciclo de juego
        cicloDeJuego();
    }

    
    function quitarSegundo(){
            if(tiempo>0)
            { tiempo-=1; }
            else
            { finalizar(); }
            dibujar_tiempo(tiempo);
    }


    function finalizar(){
        clearInterval(reloj);
        // Código para finalizar el juego...
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
        canvas.height = window.innerHeight-380;
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
                var centroY = elemento.height / 2; // Centro del canvas (y)
    
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
                        case 2:	contexto.fillStyle = '#cc5555';break;
                    }
    
                    contexto.beginPath();
                    contexto.arc(x, y-7,20, 0, Math.PI*2, true);
                    contexto.fill();
    
                    contexto.fillStyle = '#000000';
                    contexto.fillText(letras.charAt(i), x , y );
                }

                // Dibujar la puntuación cerca del círculo de las letras
                var puntuacionX = centroX - radio -90;
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
            }
        }
    }
    


        
    

    

        

    
    