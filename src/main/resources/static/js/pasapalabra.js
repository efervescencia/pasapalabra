
var aciertos;
var fallos;
var tiempo;
var reloj;
var preguntas =[];
var actual;
var pos;
var estado;
var letras = "abcdefghijlmnñopqrstuvxyz";
var logeado = false;
var nombre_usuario = "anonimo";
var email_usuario = "";
var aciertos_usuario = 0; 
var roscos_usuario = 0;
var partidas_usuario = 0;
var antispam = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;



$(document).ready(function() {
    $('#login-form').on('submit', function(e) {
        e.preventDefault(); // Evita que el formulario se envíe de la manera predeterminada

        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            url: '/login', // La URL de tu endpoint de inicio de sesión
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(data) {
                // Si el inicio de sesión es exitoso, muestra la información del usuario y oculta el formulario
                $('#user-name').text(data.username);
                $('#user-photo').attr('src', data.photoUrl);
                $('#login-form').hide();
                $('#user-info').show();
            },
            error: function() {
                // Si hay un error, muestra un mensaje al usuario
                alert('Error de inicio de sesión');
            }
        });
    });
});




function iniciar(){
    aciertos =0;
    fallos =0;
    tiempo = 180;
    reloj=null;
    pos = 0;
    estado = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    dibujar();
    dibujar_tiempo(tiempo);
    poner_datos_login();
    records();
    $("#file").pekeUpload({theme:'bootstrap', allowedExtensions:"jpg|png", multi:'false'});
    //generar_antispam();
    $("#rosco_id").css("display", "block");
    }
    
    function poner_datos_login(){
    if(logeado==true)
    {					
    texto="-- "+nombre_usuario+" -- <span class='glyphicon glyphicon-thumbs-up'> </span> ";
    texto+=aciertos_usuario+" <span class='glyphicon glyphicon-bookmark'> </span> ";
    texto+=roscos_usuario+ " <a href='#panelModal_id' role='button' data-toggle='modal'> Panel. </a>";
    texto+="  <a href='#fotoModal_id' role='button' data-toggle='modal'> Foto. </a> ";
    texto+="  <a href='#' onClick='deslogear();'> Salir. </a>";
    
    $("#datos_usuario_id").html(texto);
    poner_foto_login();
    }
    }
    
    function poner_foto_login(){
    var foto_usuario = 'url(uploads/redimensionar.php?imagen='+email_usuario.replace('@','_')+')';
    $('#bg_id').css('background-image', foto_usuario);
    }
    
    function foto_subida(){
    poner_foto_login();
    $('#fotoModal_id').modal('hide');
    }
    
    function deslogear(){
    if(confirm('¿seguro que deseas salir?')){
    
        $('#bg_id').css('background-image', 'url(imagenes/redimensionar.php?imagen=foto_defecto.jpg)');
    
        web = "php/salir.php";
        $.ajax({
        async: false,
        type: "GET",
        url: web,
        success: function(data) {
    $("#datos_usuario_id").html("");
        }
        });
    } }
    
    
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
            {
            tiempo-=1;
            }
            else
            {
            finalizar();
            }
            dibujar_tiempo(tiempo);
    }
    
    
        function dibujar_tiempo(seg){
           //Recibimos el elemento canvas
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
    
    function cargarPreguntas(){
    
        web = "php/generaRosco.php?tema="+$("#tema_id").val();
        $.ajax({
        async: false,
        type: "GET",
        url: web,
        success: function(data) {
        for (var i=0, len=data.length; i < len; i++) {
            preguntas.push(data[i]);
        }
        },
       error: function(data) {
       alert("Error al cargar preguntas");
       }
        });
        preguntas.shift();	//Borramos la posicion 1, que solo contiene el numero de registros
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
    
    //GUARDAMOS LOS PUNTOS EN LA CUENTA SI ESTA LOGEADO
    if(logeado)
    {
    //PRIMERO LOS DATOS LOCALES
    aciertos_usuario = parseInt(aciertos_usuario) + parseInt(aciertos); 
    if(aciertos>=25){roscos_usuario++;}
    partidas_usuario++;
    
    poner_datos_login();
    
    //DATOS DE LA BASE DE DATOS
        web = "php/puntuar.php?email="+email_usuario+"&aciertos="+aciertos;
        $.ajax({
        async: true,
        type: "GET",
        url: web,
            success: function(data) {
        }
        });
    }
    }
    
    function quedanPreguntas(){
    return (preguntas.length >0);
    }
    
    function quitaAcentos (conAcentos) {
    
     especiales = new Array('á','é','í','ó','ú',' ');
     normales = new Array('a','e','i','o','u','');
     
    conAcentos = conAcentos.toLowerCase();
     
     i=0;
     while (i<especiales.length) {
     conAcentos = conAcentos.split(especiales[i]).join(normales[i]);
      i++
     }
     return ""+conAcentos;
    }
    
    function esIgual(uno, dos){
    
    if (uno.length==dos.length){
    
    for(i = 0;i<uno.length;i++)
    {
    if(uno[i]!=dos[i])
    {
    //alert("diferente:"+uno[i]+" a "+dos[i]);
    return false;
    }
    }
    }
    else{
    //alert("la longitud no es igual: "+uno.length+" y "+dos.length+"el primero de la primera es"+uno[0]);
    return false;
    }
    return true;
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
    
    function records(){
        $("#records_id").html("<span><h3>Los Mejores:</h3></span><hr>");
        mejores=1;
        $.ajax({ 
        type: "GET", 
        dataType: 'json',
        async: false,
        url: "php/records.php", 
        success: function(respuesta) {
        respuesta.forEach(function(entry) {
        $("#records_id").append("<h6><strong>"+entry['nombre']+"</strong></h6>");
        $("#records_id").append("<h6><span class='glyphicon glyphicon-thumbs-up'> </span>  "+entry['aciertos']+" <span class='glyphicon glyphicon-bookmark'> </span> "+entry['roscos']+"</h6><hr>");
        });
        }
        });
    }
    
    function registrar_usuario(){
    if(validar_registro())
    {
    if(existe_email($('#registro_email_id').val()))
        {
        alert("Ese email ya esta registrado.\n Si no recuerda la contraseña pinche en recordar contraseña.");
        }
    else{
        alert("El email no esta registrado vamos a intentar insertarlo");
        $.ajax({ 
        type: 'post', 
        dataType: 'json',
        parameters: "email="+ $('#registro_email_id').val() +"&password="+ $('#registro_password_id').val() +"&nombre="+ $('#registro_nombre_id').val(),
        async: false,
        url: "php/registrar.php", 
        success: function(respuesta) { 
                    if (respuesta=="registrado")
                    {
                    resultado = true;
                    }
                    else
                    {
                    alert("Hubo un problema al registrar la cuenta.");
                    resultado = false;
                    }
                    
            }});
        }
    }
    }
    
    function existe_email(email){
        var resultado = false;
        $.ajax({ 
        type: "GET", 
        dataType: 'json',
        async: false,
        url: "php/existe_email.php?email="+email, 
        success: function(respuesta) {
            if(respuesta=="1"){
            resultado=true;
            }}});
        return resultado;
    }
    
        function validar_registro(){
            var errores = 0;
            var error = "";
            if ($("#registro_antispam_id").val() != antispam){ 
                error+="el código antispam no es correcto.\n"; 
                errores++;
            }
            if ($("#registro_password_id").val() != $("#registro_password2_id").val()){ 
                error+="el password no coincide en los 2 campos.\n"; 
                errores++;
            }
            if (revisando_correo($("#registro_email_id").val())==false){	
                error+="El email parece incorrecto."; 
                errores++; 
            }
            if(errores==0)
            {
            return true;
            }
            else{
            alert(error);
            return false;
            }
    }
    
        function revisando_correo(str){
            var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (filter.test(str)){	return true;	}else{		return false;	}
        }
        
        
        function validar_login(form)
    {
            if (revisando_correo($("#login_email_id").val())==false){	
                alert("Por favor asegúrese de que su dirección de correo sea la correcta."); 
                return false; 
            }
            if (existe_email($("#login_email_id").val())==false){	
                alert("No tenemos ese email registrado."); 
                return false; 
            }
            return true;
        }
        
        function logear(form)
    {
    if (validar_login(form) ){
    
        $.ajax({ 
        type: 'post', 
        async: false,
        dataType: 'json',
        url: "php/autentication.php?email="+$('#login_email_id').val()+"&password="+$('#login_password_id').val(), 
        success: function(datos_usuario) {
                        if(datos_usuario!="error")
                    {
                    logeado=true;
                    nombre_usuario = datos_usuario[0];
                    partidas_usuario = datos_usuario[1];
                    roscos_usuario = datos_usuario[2];
                    aciertos_usuario = datos_usuario[3];
                    email_usuario = $('#login_email_id').val();
                    poner_datos_login();
                    $('#loginModal_id').modal('hide');
                    }
                    else
                    {
                    alert("La contraseña no es correcta.");
                    }
                    }});
        
    }
    }	
    
        function activada(form){
        $.ajax({ 
        type: 'post', 
        dataType: 'json',
        async: false,
        url: "php/activada.php?email="+$('#login_email_id').val(), 
        success: function(respuesta) { 
                    if (respuesta=="activada")
                    {
                    resultado = true;
                    }
                    else
                    {
                    alert("La cuenta esta sin activar,\n revise su correo por favor. \nSobretodo la carpeta de correo no deseado.");
                    resultado = false;
                    }	
            }});
            return resultado;
    }
    
    
    function generar_antispam(){
    antispam = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    $("#antispam_imagen_id").html("<span style='font-size: 20px;'><img src='imagen.php?codigo="+antispam+"' /></span>");
    }
    
    function modificar_datos(){
    alert("Lo sentimos, la modificación esta temporalmente desactivada, pruebe dentro de unos días.");
    }
    
    
    function recordar_password(){
    if(existe_email($('#login_email_id').val()))
        {
        alert("existe el email"+$('#login_email_id').val());
        $.ajax({ 
        type: 'GET', 
        dataType: 'json',
        async: false,
        url: "php/recuperar_password.php?email="+ $('#login_email_id').val(), 
        success: function(respuesta) { 
                    if (respuesta=="enviado")
                    {
                    alert("Hemos enviado un mail con instruciones para acceder a la contraseña.");
                    }
                    else
                    {
                    alert("Hubo un problema al verificar los datos-");
                    }			
            }});
        }
    else{
        alert("No tenemos registrado ese email.");
    }
    }
    
    