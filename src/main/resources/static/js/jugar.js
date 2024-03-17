
var aciertos;
var fallos;
var tiempo;
var reloj;
var preguntas =[];
var actual;
var pos;
var estado;
var letras = "abcdefghijlmnñopqrstuvxyz";
var aciertos_usuario = 0; 
var roscos_usuario = 0;
var partidas_usuario = 0;

window.onload = function() {
iniciar();
};

function iniciar(){
    aciertos =0;
    fallos =0;
    tiempo = 180;
    reloj=null;
    pos = 0;
    estado = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    dibujar_rosco();
    window.addEventListener('resize', resizeCanvas, false);
    // Call resizeCanvas once to initially size and draw the canvas
    resizeCanvas();
    dibujar_tiempo(tiempo);
    //poner_datos_login();
    //records();
    } 
    
    function otraVez(){
    $("#jugarDeNuevo_id").css("display","none");
    $('#preguntas_id').html("");
    while(preguntas.length>0)
    {
    preguntas.shift();
    }
    iniciar();
    $("#menu_id").css("display","block");
    $("#respuestas_id").css("display", "none");
    }
    
    function comenzar(){
    $("#menu_id").css("display", "none");
    $("#respuestas_id").css("display", "block");
    $("#preguntas_id").html("<h3>Generando rosco...</h3>.");
    cargarPreguntas();
    jugar();
    }
    
    
    function quitarSegundo(){
            if(tiempo>0)
            { tiempo-=1; }
            else
            { finalizar(); }
            dibujar_tiempo(tiempo);
    }
    
    
    function dibujar_tiempo(seg){
        var elemento = document.getElementById('canvas_id');
        if (elemento && elemento.getContext) {
            var contexto = elemento.getContext('2d');
            if (contexto) {
                var radio = Math.min(elemento.width, elemento.height) / 2 - 30; // Radio del rosco
                var centroX = elemento.width / 2; // Centro del canvas (x)
                var centroY = elemento.height / 2; // Centro del canvas (y)
    
                // Posición del tiempo relativa al rosco
                var tiempoX = centroX - radio - (radio/4); 
                var tiempoY = centroY - radio +(radio/5);
    
                contexto.font = '24px "Tahoma"';
                contexto.textAlign = "center";
                contexto.textBaseline = "center";
    
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
    
                    switch(estado[i]){
                        case 0:	contexto.fillStyle = '#3b5998';	
                                    if(pos == i)
                        {contexto.fillStyle = '#cccccc';};break;
                        case 1:	contexto.fillStyle = '#55cc55';break;
                        case 2:	contexto.fillStyle = '#cc5555';break;
                    }
    
                    contexto.beginPath();
                    contexto.arc(x, y-5,20, 0, Math.PI*2, true);
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
    

    
  
    function jugar(){
    
    if (quedanPreguntas() && tiempo>0)
    {
    actual = preguntas.shift();
    var l=actual[0];
    
    pos = letras.indexOf(l);
    dibujar_rosco();
    
    var mensaje;
    
    if (l=="ñ" || l=="q" || l=="x" || l=="y")
        {mensaje="<p>Contiene la <B>"+l+":</B></p><p>"+actual[1]+"</p>";}
    else
        {mensaje="<p>Empieza con <B>"+l+":</B></p><p>"+actual[1]+"</p>";}
        
    $("#preguntas_id").html(mensaje);
    $("#respuesta_usuario_id" ).focus();
    reloj = setInterval(quitarSegundo,1000);  
    }
    else
    {
    finalizar();
    }
    }
    
    function finalizar(){
    //SE HA ACABADO EL JUEGO.
    clearInterval(reloj);
    dibujar_rosco();
    if(aciertos>24){
    $('#preguntas_id').html("<br>La partida se ha acabado.<br><h3>HAS ACERTADO TODO EL ROSCO!!!</h3>.");
    }
    else
    {
    $('#preguntas_id').html("<br><h4>La partida se ha acabado.</h4>");
    }
    
    $("#respuestas_id").css("display", "none");
    $("#jugarDeNuevo_id").css("display","block");
    $("#jugarDeNuevo_id").focus();
}
 
    
    function quedanPreguntas(){
    return (preguntas.length >0);
    }
    

    
    function comprobar(){
    
    var rtecleada = quitaAcentos($("#respuesta_usuario_id").val().trim());
    clearInterval(reloj);
    
    if( tiempo>0){
    
        if ( rtecleada != "" && rtecleada != "p" && rtecleada != "pasa" && rtecleada != "pasapalabra" )
        {
        web = "php/correcta.php?id="+actual[2];
        $.ajax({
        async: false,
        type: "GET",
        dataType:"text",
        url: web,
        success: function(data) {
        var rcorrecta = quitaAcentos(data.trim());
        if(rcorrecta[0]<'A' || rcorrecta[0]>'z')
            {	
            rcorrecta=rcorrecta.substr(1);
            }
        if ( esIgual(rcorrecta,rtecleada) || esIgual(rcorrecta+"s",rtecleada) || esIgual(rcorrecta+"es",rtecleada) )
        {
        aciertos+=1;estado[pos]=1;
        }
        else
        {
        fallos+=1;estado[pos]=2;alert("La respuesta correcta es: "+data);
        }
        }
        });
        }
        else{
        // SE PASA PALABRA
        preguntas.push(actual);
        }	
        }
        $("#respuesta_usuario_id").val("");
        jugar();
        }
        
    
    function pasapalabra(){
    clearInterval(reloj);
    if(tiempo>0){
    preguntas.push(actual);
    }
    jugar();
    }
    

        

    
    