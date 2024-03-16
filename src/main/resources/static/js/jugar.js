
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
    dibujar();
    //dibujar_tiempo(tiempo);
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
       //Comprobacion sobre si encontramos un elemento
       //y podemos extraer su contexto con getContext(), que indica compatibilidad con canvas
       if (elemento && elemento.getContext) {
          //Accedo al contexto de '2d' de este canvas, necesario para dibujar
          var contexto = elemento.getContext('2d');
          if (contexto) {
             //Si tengo el contexto 2d es que todo ha ido bien y puedo empezar a dibujar en el canvas
            
            contexto.font = '24px "Tahoma"';
            contexto.textAlign = "center";
            contexto.textBaseline = "center";
            
            contexto.fillStyle = '#000000';
            contexto.beginPath();
            contexto.arc(40, 400,35, 0, Math.PI*2, true);
            contexto.fill();
    
            contexto.fillStyle = '#aaaaFF';
            contexto.beginPath();
            contexto.arc(40, 400,30, 0, Math.PI*2, true);
            contexto.fill();
            
            contexto.fillStyle = '#000000';
            contexto.fillText(seg.toString(), 40,410 );	
        
            }
    }
    }
    
    
        function dibujar(){
       //Recibimos el elemento canvas
       var elemento = document.getElementById('canvas_id');
       //Comprobacion sobre si encontramos un elemento
       //y podemos extraer su contexto con getContext(), que indica compatibilidad con canvas
       if (elemento && elemento.getContext) {
          //Accedo al contexto de '2d' de este canvas, necesario para dibujar
          var contexto = elemento.getContext('2d');
          if (contexto) {
             //Si tengo el contexto 2d es que todo ha ido bien y puedo empezar a dibujar en el canvas
            
            contexto.fillStyle = '#000000';
            contexto.font = '24px "Tahoma"';
            contexto.textAlign = "center";
            contexto.textBaseline = "center";
            
            
            for (var i=0;i<25;i++)
            {
            x= 220 + 190*Math.cos((i*14.4-90)*Math.PI/180);
            y= 225 + 190*Math.sin((i*14.4-90)*Math.PI/180);
            
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
            
            contexto.fillStyle = '#0000F0';
            contexto.fillRect(10,445,65,40);
            
            contexto.strokeStyle = "rgb(0,0,0)";
            contexto.lineWidth  = 3;
            contexto.strokeRect(5,445,75,1);
            contexto.strokeRect(5,485,80,1);
            contexto.strokeRect(10,440,1,75);
            contexto.strokeRect(75,435,1,80);
            
            contexto.fillStyle = '#FFFFFF';
            contexto.fillText(aciertos.toString(), 50,475 );	
    
          }
       }
    }
    
  
    function jugar(){
    
    if (quedanPreguntas() && tiempo>0)
    {
    actual = preguntas.shift();
    var l=actual[0];
    
    pos = letras.indexOf(l);
    dibujar();
    
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
    dibujar();
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
    

        

    
    