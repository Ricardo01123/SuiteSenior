const express = require('express');
const mysql = require('mysql');
var app = express();

const path = require('path')

var formidable = require('formidable');
var fs = require('fs');
const fileUpload = require('express-fileupload');

const session = require("express-session");

var bodyParser= require('body-parser');
var con = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'n0m3l0',
	database:'SeniorSuite'
})
con.connect()

app.use(session({
  secret: "987f4bd6d4315c20b2ec70a46ae846d19d0ce563450c02c5b1bc71d5d580060b",
  saveUninitialized: true,
  resave: true,
}));


app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
	extended: true
}))
	
app.use(fileUpload());

app.use(express.static('public'))

app.get("/CerrarSesion", (req, res)=>{
  req.session.nombre = null;
  req.session.contraseña = null;
  req.session.id_usuario = null;
  req.session.sexo = null;

  res.redirect("/Iniciar-Sesion.html");
})

app.post('/AgregarPaciente', (req,res)=>{
	let nombre = req.body.Nombre +' '+ req.body.Apellidos
	let expediente = req.body.Expediente
  let fechaNacimiento = req.body.FechaNacimiento
	let edad = Math.abs((new Date(Date.now() - new Date(fechaNacimiento).getTime()).getUTCFullYear()) - 1970);
	let sexo = req.body.Sexo
	let tel = req.body.Telefono
	let padecimiento = req.body.Padecimiento

  let form = new formidable.IncomingForm();
  
  let FotoPath = req.files.Foto,

      newPhotoPath = "/home/yerry/Documentos/github/SuiteSenior/webApp/public/FotosPacientes" + FotoPath.name;



  //variables del contacto del paciente
  let faNom = req.body.FamiliarNombre + ' ' + req.body.FamiliarApellido
  let parentezco = req.body.Parentezco
  let faTelefono = req.body.phone2

  //primero cargamos la foto al servidor para depsués agregar al nuevo paciente a la base de datos

  FotoPath.mv(newPhotoPath, err => {
    if (err) { return res.status(500).send(err); }
    console.log("File uploaded!");
  });

  //recortamos el nombre de acceso para que el servidor lea las fotos posteriormente
  newPhotoPath = "./FotosPacientes/" + FotoPath.name

  //query para insertar al paciente
	con.query('INSERT INTO Paciente(No_Expediente, Nombre, Edad, FechaNacimiento, Sexo, Padecimiento, Telefono, Foto, id_usuario) values("'+expediente+'","'+nombre+'","'+edad+'","'+fechaNacimiento+'","'+sexo+'","'+padecimiento+'","'+tel+'","'+newPhotoPath+'","'+req.session.id_usuario+'")', (err, respuesta, fields)=>{
		if(err) return console.log('ERROR', err);
		console.log("Paciente agregado correctamente")

    con.query('INSERT INTO Familiar(Nombre_Familiar, Parentezco, Telefono_Familiar) values("'+faNom+'","'+parentezco+'","'+faTelefono+'")', (err, respuesta, fields)=>{
      if(err){
        console.log('ERROR', err);
        console.log('No se ha añadido ningun familiar')
      }else{
        console.log("familiar del paciente agregado")
      }
      
      con.query('update Notas_medicas set id_usuario = "'+req.session.id_usuario+'" where No_Expediente="'+expediente+'"', (err, respuesta, fields)=>{

      })
      con.query('update Paciente set Familiar = (select Familiar from Familiar where Nombre_Familiar = "'+faNom+'") where No_Expediente="'+expediente+'"', (err, respuesta, fields)=>{
        if(err){
          console.log('ERROR', err);
          console.log('No se ha asignado al familiar')
        }else{
          console.log("familiar del paciente asignado")
        }

        return res.redirect(
          "/Index"

                 
          );
      })
	})

  //query para insertar el contacto
  
  })
  
})

app.get('/index', (req, res)=>{

    // Si, por ejemplo, no hay nombre
    if(!req.session.nombre){
      res.redirect("./Iniciar-Sesion.html");
    }else{
    

      con.query('select * from Paciente natural join Sexo natural join Padecimiento where id_usuario="'+req.session.id_usuario+'"', (err, respuesta, field)=>{
        if(err) return console.log('ERROR: ', err);

        var userHTML = ``
        var i = 0
        var membreteDoctor = "";

        console.log(respuesta)

        //logica para sacar el membrete del doctor
        if(req.session.sexo == 1){
          membreteDoctor= `
          
          <div class="avatar avatar-sm avatar-circle"> Dr. ${req.session.nombre} 
            <img class="avatar-img" src="doctor.png" alt="logo" style="width:40px;">
            <span class="avatar-status avatar-sm-status avatar-status-success"></span>
          </div>

          `
        }else{
          membreteDoctor= `
          
          <div class="avatar avatar-sm avatar-circle"> Dra. ${req.session.nombre} 
            <img class="avatar-img" src="doctora.png" alt="logo" style="width:40px;">
            <span class="avatar-status avatar-sm-status avatar-status-success"></span>
          </div>

          `
        }


        respuesta.forEach(user =>{
          i++
          userHTML +=`<tr>
                  <td>
                    <form action="/Paciente" method="post">
                      <input type="submit" name="expediente" value=${user.No_Expediente}>  
                    </form>
                  </td>
                  <td >
                    <!-- a class="u-active-none u-border-none u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-btn-1" href="Paciente.html"-->
                    
                    ${user.Nombre}
                    
                    <!--/a-->
                  </td>
                  <td>${user.Edad}</td>
                  <td>${user.Genero}</td>
                  <td>${user.Valor_Padecimiento}</td>
                  <td><span class="u-file-icon u-icon"><form action="/eliminarPaciente" method="post"><button type="submit" name="expediente" value=${user.No_Expediente}><img src="../images/3405244-aebb539c.png" alt=""></button></form></span>
                  <td><span class="u-file-icon u-icon"><form action="/editarPacientePagina" method="post"><button type="submit" name="expediente" value=${user.No_Expediente}><img src="../images/2990079.png" alt=""></button></form></span>
                </tr>`
                  
        })
        return res.send(`
          
    <!DOCTYPE html>
      <html style="font-size: 16px;" lang="en"><head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta charset="utf-8">
          <meta name="keywords" content="Pacientes">
          <meta name="description" content="">
          <title>Menu</title>
          <link rel="stylesheet" href="./css/nicepage.css" media="screen">
      <link rel="stylesheet" href="./css/Menu.css" media="screen">
          <script class="u-script" type="text/javascript" src="./js/jquery.js" defer=""></script>
          <script class="u-script" type="text/javascript" src="./js/nicepage.js" defer=""></script>
          <meta name="generator" content="Nicepage 5.8.2, nicepage.com">
          <link id="u-theme-google-font" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Open+Sans:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i">
          
          
          <script type="application/ld+json">{
          "@context": "http://schema.org",
          "@type": "Organization",
          "name": "",
          "logo": "images/image.png"
      }</script>
          <meta name="theme-color" content="#478ac9">
          <meta property="og:title" content="Menu">
          <meta property="og:type" content="website">
        <meta data-intl-tel-input-cdn-path="intlTelInput/">

        
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
        <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
      
      
        </head>
        <body class="u-body u-xl-mode" data-lang="en">
<div class = "flex-container">


<!-- Barra de Navegación --> 
        <header class="u-clearfix u-header u-header" id="sec-12bb">
          <div class="u-clearfix u-sheet u-sheet-1">
            <a href="index" class="u-image u-logo u-image-1" data-image-width="572" data-image-height="190" title="Menu">
              <img src="images/image.png" class="u-logo-image u-logo-image-1">
              </a>
            <nav class="u-menu u-menu-dropdown u-offcanvas u-menu-1">
              <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
                <a class="u-button-style u-custom-left-right-menu-spacing u-custom-padding-bottom u-custom-top-bottom-menu-spacing u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#">
                  <svg class="u-svg-link" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#menu-hamburger"></use>
                  </svg>
                    <svg class="u-svg-content" version="1.1" id="menu-hamburger" viewBox="0 0 16 16" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><rect y="1" width="16" height="2"></rect>
                      <rect y="7" width="16" height="2"> 
                      </rect>
                      <rect y="13" width="16" height="2">
                      </rect>
                    </g>
                  </svg>
                  </a>
              </div>
              <div class="u-custom-menu u-nav-container">
                <ul class="u-nav u-unstyled u-nav-1">
                  <li class="u-nav-item">
                    <!-- Account -->
                    <div class="dropdown">
                      <a class="navbar-dropdown-account-wrapper" href="index" id="accountNavbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                        ${membreteDoctor}
                      </a>
                    </div>
                    <!-- End Account -->
                  </li>
                  <li class="u-nav-item">
                    <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Menu</a>
                    </li>
                  <li class="u-nav-item">
                    <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Sesión</a>
                    <div class="u-nav-popup">
                      <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                        <li class="u-nav-item">
                          <a class="u-button-style u-nav-link u-white" href="/CerrarSesion">Cerrar sesión</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="u-custom-menu u-nav-container-collapse">
                <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
                  <div class="u-inner-container-layout u-sidenav-overflow">
                    <div class="u-menu-close">
                    </div>
                    <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-3">
                      <li class="u-nav-item">
                        <a class="u-button-style u-nav-link" href="index">Menu</a>
                        </li>
                      <li class="u-nav-item">
                        <a class="u-button-style u-nav-link" href="index">Sesión</a>
                        <div class="u-nav-popup">
                          <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                            <li class="u-nav-item">
                              <a class="u-button-style u-nav-link" href="/CerrarSesion">Cerrar sesión</a>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
              </div>
            </nav>
          </div>
        </header>
  


        
        <section class="u-align-center u-clearfix u-section-1" id="sec-6cce">
          <div class="u-clearfix u-sheet u-valign-top u-sheet-1">
            <!-- TITULO PACIENTES -->
            <h2 class="u-align-left u-text u-text-default u-text-1">Pacientes</h2>

<!-- LISTA DE PACIENTES -->
              <div class="u-expanded-width u-table u-table-responsive u-table-1">
                <table class="table table-hover">
                  <colgroup>
                    <col width="14.3%">
                    <col width="15.6%">
                    <col width="14.9%">
                    <col width="12.4%">
                    <col width="33.4%">
                    <col width="4.7%">
                    <col width="4.7%">
                  </colgroup>

<!-- ENCABEZADO DE LA TABLA -->
                  <thead class="u-custom-color-3 u-table-header u-table-header-1">
                    <tr style="height: 26px;">
                      <th class="u-border-1 u-border-custom-color-3 u-table-cell">No. Expediente</th>
                      <th class="u-border-1 u-border-custom-color-3 u-table-cell">Nombre</th>
                      <th class="u-border-1 u-border-custom-color-3 u-table-cell">Edad</th>
                      <th class="u-border-1 u-border-custom-color-3 u-table-cell">Sexo</th>
                      <th class="u-border-1 u-border-custom-color-3 u-table-cell">Padecimiento</th>
                      <th class="u-border-1 u-border-custom-color-3 u-table-cell"></th>
                      <th class="u-border-1 u-border-custom-color-3 u-table-cell"></th>
                    </tr>
                  </thead>


                  <tbody class="u-table-body">
                    <tr style="height: 36px;">
                      ${userHTML}
                    </tr>
                  </tbody>
                </table>
                
              </div>
              <a href="/AgregarPaciente.html" class="u-border-none u-btn u-btn-round u-button-style u-custom-color-1 u-hover-palette-2-base u-radius-6 u-btn-9">Agregar Paciente</a>
            </div>
          </section>
          
<!--Footer-->    
          <footer class="u-align-center  u-footer" id="sec-b565">
            <div class="u-clearfix u-sheet u-sheet-1">
              <p class="u-small-text u-text u-text-variant u-text-1">© Suite Senior, 2023</p>  
            </div>
          </footer>
        </div>
      </body>
</html>
                
                `)
      })
    }
})

  app.post('/eliminarPaciente', (req,res)=>{
	let expediente = req.body.expediente
  console.log("este es el expediente del que vamos a funar: " + expediente);
	con.query("DELETE FROM Paciente where No_Expediente='"+expediente+"'", (err, respuesta, fields)=>{
		if(err) return console.log('ERROR', err);
    console.log("Se ha eliminado el paciente de la base de datos")
		return res.redirect("/index");
	})
})

app.post("/editarPacientePagina", (req, res)=>{
  let expediente = req.body.expediente;

  con.query("select * from Paciente natural join Notas_medicas natural join Padecimiento natural join Sexo natural join Sesiones_diarias natural join Familiar natural join Parentezco where No_Expediente='"+expediente+"' ORDER BY id_sesion ASC", (err, respuesta, fields)=>{
    if(err) return console.log('ERROR', err);

    var membreteDoctor=""

    //logica para sacar el membrete del doctor
    if(req.session.sexo == 1){
      membreteDoctor= `
      
      <div class="avatar avatar-sm avatar-circle"> Dr. ${req.session.nombre} 
        <img class="avatar-img" src="doctor.png" alt="logo" style="width:40px;">
        <span class="avatar-status avatar-sm-status avatar-status-success"></span>
      </div>

      `
    }else{
      membreteDoctor= `
      
      <div class="avatar avatar-sm avatar-circle"> Dra. ${req.session.nombre} 
        <img class="avatar-img" src="doctora.png" alt="logo" style="width:40px;">
        <span class="avatar-status avatar-sm-status avatar-status-success"></span>
      </div>

      `
    }

    return res.send(`
    
    <!DOCTYPE html>
    <html style="font-size: 16px;" lang="en"><head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <meta name="keywords" content="">
        <meta name="description" content="">
        <title>editar paciente</title>
        <link rel="stylesheet" href="./css/nicepage.css" media="screen">
    <link rel="stylesheet" href="./css/Agregar-paciente.css" media="screen">
        <script class="u-script" type="text/javascript" src="./js/jquery.js" defer=""></script>
        <script class="u-script" type="text/javascript" src="./js/nicepage.js" defer=""></script>
        <meta name="generator" content="Nicepage 5.8.2, nicepage.com">
        <meta name="referrer" content="origin">
        <link id="u-theme-google-font" rel="stylesheet" href="./css/https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Open+Sans:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i">
        
        <link
         rel="stylesheet"
         href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css"
       />
       <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>
    
        <!-- formato para fecha-->
        
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
        <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
        <link rel="stylesheet" href="./css/addPacient.css">
    
        <script type="application/ld+json">{
        "@context": "http://schema.org",
        "@type": "Organization",
        "name": "",
        "logo": "images/image.png"
    }</script>
        <meta name="theme-color" content="#478ac9">
        <meta property="og:title" content="Editar Paciente">
        <meta property="og:type" content="website">
      <meta data-intl-tel-input-cdn-path="intlTelInput/"></head>
      <body class="u-body u-xl-mode" data-lang="en">
      
      
      
      <!-- Barra de Navegación --> 
      <header class="u-clearfix u-header u-header" id="sec-12bb">
        <div class="u-clearfix u-sheet u-sheet-1">
          <a href="index" class="u-image u-logo u-image-1" data-image-width="572" data-image-height="190" title="Menu">
            <img src="images/image.png" class="u-logo-image u-logo-image-1">
            </a>
          <nav class="u-menu u-menu-dropdown u-offcanvas u-menu-1">
            <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
              <a class="u-button-style u-custom-left-right-menu-spacing u-custom-padding-bottom u-custom-top-bottom-menu-spacing u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#">
                <svg class="u-svg-link" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#menu-hamburger"></use>
                </svg>
                  <svg class="u-svg-content" version="1.1" id="menu-hamburger" viewBox="0 0 16 16" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><rect y="1" width="16" height="2"></rect>
                    <rect y="7" width="16" height="2"> 
                    </rect>
                    <rect y="13" width="16" height="2">
                    </rect>
                  </g>
                </svg>
                </a>
            </div>
            <div class="u-custom-menu u-nav-container">
              <ul class="u-nav u-unstyled u-nav-1">
                <li class="u-nav-item">
                  <!-- Account -->
                  <div class="dropdown">
                    <a class="navbar-dropdown-account-wrapper" href="index" id="accountNavbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                      ${membreteDoctor}
                    </a>
                  </div>
                  <!-- End Account -->
                </li>
                <li class="u-nav-item">
                  <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Menu</a>
                  </li>
                <li class="u-nav-item">
                  <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Sesión</a>
                  <div class="u-nav-popup">
                    <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                      <li class="u-nav-item">
                        <a class="u-button-style u-nav-link u-white" href="/CerrarSesion">Cerrar sesión</a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div class="u-custom-menu u-nav-container-collapse">
              <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
                <div class="u-inner-container-layout u-sidenav-overflow">
                  <div class="u-menu-close">
                  </div>
                  <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-3">
                    <li class="u-nav-item">
                      <a class="u-button-style u-nav-link" href="index">Menu</a>
                      </li>
                    <li class="u-nav-item">
                      <a class="u-button-style u-nav-link" href="index">Sesión</a>
                      <div class="u-nav-popup">
                        <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                          <li class="u-nav-item">
                            <a class="u-button-style u-nav-link" href="/CerrarSesion">Cerrar sesión</a>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
            </div>
          </nav>
          </div>
        </header>

    
        <section class="u-clearfix u-section-1" id="sec-6cd5">
          <div class="u-clearfix u-sheet u-sheet-1">
            <h3 class="u-text u-text-default u-text-1">Editar Paciente</h3>
            <div class="container-forms">
              <div class="text-container-form">
                <p class="u-form-group u-form-text u-text u-text-2"> DATOS DEL PACIENTE</p>
              </div>
    
              <div class="u-form u-form-1">
                <form action="/editarPaciente" method="post" enctype="multipart/form-data">
                  
                  <div class="u-form-group u-form-group-8">
                    <label for="text-10ec" class="u-label"></label>
                    <div class="card">
                      
                      <div class="image-container">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6dELQJyJy7ztzrvRwn5hZDqng576Fg8kxljVjlzYBgxln-dq_dUhk-3Tae5FBktIzzHU&usqp=CAU" id="profile-pic">
                        <label for="input-file" class="foto">Subir Foto</label>
                      </div>
                      <input type="file" id="input-file" name="Foto" class="fotoinput" accept="image/jpeg,image/png,image/jpg" required="required">
                    </div>
                  
                  <!--input type="file" placeholder="" id="text-10ec" name="Foto" class="u-input u-input-rectangle"-->
                </div>
                <!--  NOMBRE Y APELLIDO PACIENTE -->
                <div class="u-form-group u-form-name u-form-partition-factor-2 u-form-group-3 flex-grow">
                  <label for="name-b6ca" class="u-label">Nombre(s) <span style="color: red">*</span></label>
                  <input type="text" placeholder="Ingrese su nombre" id="name-b6ca" name="Nombre" value="${respuesta[0].Nombre}" class="u-input u-input-rectangle u-input-name-rec" required="" onkeypress="return (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122 || event.charCode == 32)">
                </div>
                <div class="u-form-group u-form-name u-form-partition-factor-2 u-form-group-4 flex-grow">
                  <label for="name-b6ca" class="u-label">Apellidos <span style="color: red">*</span></label>
                  <input type="text" placeholder="Ingrese sus apellidos" id="name-b6ca-1" name="Apellidos" class="u-input u-input-rectangle u-input-name-rec" required="" onkeypress="return (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122 || event.charCode == 32)">
                </div>
                
                <!-- NO EXPENDIE -->
                <div class="u-form-group u-form-group-2">
                  <!-- 4año de registro 3institucion (072) no paciente 4digito -->
                  <!-- 20210720001-->
                  <!-- 20200720002-->
                  <label for="text-3d4d" class="u-label input-container">No. Expediente <span style="color: red">*</span> </label>
                  <input type="text" id="text-3d4d-1" name="Expediente" value="${respuesta[0].No_Expediente}" class="u-input u-input-rectangle" required="required"
                  onkeypress="return (event.charCode >= 48 && event.charCode <= 57)">
                </div>
                
                <!--  FECHA NACIMIENTO -->
                <div class="u-form-date u-form-group u-form-group-5">
                  <label for="date-aeb1" class="u-label">Fecha de Nacimiento <span style="color: red">*</span></label>
                  <input  type="date" id="fechaNacimiento" name="FechaNacimiento"
                        min="1900-01-01" max="1973-12-31" class="u-input u-input-rectangle grid-grow u-input-date-rec" required="required" >
                  <!--input type="text" readonly="readonly" placeholder="MM/DD/YYYY" id="date-aeb1" name="Edad" class="u-input u-input-rectangle" required="" data-date-format="mm/dd/yyyy"-->
                  <!--input type="number" name="Edad" class="u-input u-input-rectangle" required=""-->
                </div>
                <!--  EDAD EN NUMERO -->
                <!--div class="u-form-group u-form-date u-form-partition-factor-2 u-form-group-5 flex-grow">
                  <label for="name-b6ca" class="u-label">Edad <span style="color: red">*</span></label>
                  <input id="edad" type="text" placeholder="Ingrese su Edad" id="name-b6ca" name="Edad" value="${respuesta[0].Edad}" class="u-input u-input-rectangle u-input-name-rec" required="">
                </div-->
                
                <!--  SEXO -->
                <div class="u-form-checkbox-group u-form-group u-form-input-layout-horizontal u-form-group-6">
                  <label class="u-label">Sexo<span style="color: red">*</span></label>
                  <div class="u-form-checkbox-group-wrapper">
                    <div class="u-input-row">
                      <input id="field-d33e" type="radio" name="Sexo" value="2" class="u-field-input" data-calc="Femenino" required="required">
                      <label class="u-field-label" for="field-d33e">Femenino</label>
                    </div>
                    <div class="u-input-row">
                      <input id="field-2d8a" type="radio" name="Sexo" value="1" class="u-field-input" data-calc="Masculino" required="required">
                      <label class="u-field-label" for="field-2d8a">Masculino</label>
                    </div>
                  </div>
                </div>
    
                <!--  INPUT TELEFONO PACIENTE   -->
                <div class="u-form-group u-form-phone u-form-group-7 ">
                  <label for="phone-c919" class="u-label">Teléfono <span style="color: red">*</span></label>
                  <input id="phone" type="tel" pattern="\+?\d{0,3}[\s\(\-]?([0-9]{4})[\s\)\-]?([\s\-]?)([0-9]{4})" name="Telefono" value="${respuesta[0].Telefono}" class="u-input u-input-rectangle u-input-tel" required="required"
                  onkeypress="return (event.charCode >= 48 && event.charCode <= 57)">
                </div>
                 
                <!--  TRANSTORNO -->
                <div class="u-form-checkbox-group u-form-group u-form-input-layout-horizontal u-form-group-9">
                  <label class="u-label">Transtorno <span style="color: red">*</span></label>
                  <div class="u-form-checkbox-group-wrapper">
                    <div class="checkbox-group required">
                      <input id="field-3dd5" type="radio" name="Padecimiento" value="1" class="u-field-input" data-calc="estrés">
                      <label class="u-field-label" for="field-3dd5">Estrés</label>
                    
                      <input id="field-4c54" type="radio" name="Padecimiento" value="3" class="u-field-input" data-calc="ansiedad">
                      <label class="u-field-label" for="field-4c54">Ansiedad</label>
                    
                      <input id="field-cb40" type="radio" name="Padecimiento" value="4" class="u-field-input" data-calc="estres postraumatico">
                      <label class="u-field-label" for="field-cb40">Estrés postraumatico</label>
                    </div>
                  </div>
                </div>
    
                <!--  ADD CONTACTS -->
                <div class="text-container-form">
                  <p class="u-form-group u-form-text u-text u-text-2"> Otros contactos</p>
                </div>
                
                <div class="container-contacts">
                  <!--  CONTACTO 1 -->
                  <div>
                    <label for="name-bf8f" class="u-label"><strong>Contacto 1</strong> </label>
                  </div>
                  
                  <!--p> <strong> Contacto 1</strong></p-->
                  <!--  NOMBRE Y APELLIDO CONTACTO -->
                  <div class="u-form-group u-form-name u-form-partition-factor-2 u-form-group-11">
                    <label for="name-bf8f" class="u-label">Nombre(s) <span style="color: red">*</span></label>
                    <input type="text" placeholder="Ingrese su nombre" id="name-bf8f" name="FamiliarNombre" value="${respuesta[0].Nombre_Familiar}" class="u-input u-input-rectangle u-input-name-rec" required="required" onkeypress="return (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122 || event.charCode == 32)">
                  </div>
                  <div class="u-form-group u-form-name u-form-partition-factor-2 u-form-group-12">
                    <label for="name-bf8f" class="u-label">Apellidos <span style="color: red">*</span></label>
                    <input type="text" required="required" placeholder="Ingrese sus apellidos" id="name-bf8f" name="FamiliarApellido" class="u-input u-input-rectangle u-input-name-rec" onkeypress="return (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122 || event.charCode == 32)">
                  </div>
                  <!--  PARENTZCO CONTACTO 1 -->
                  <div class="u-form-group u-form-select u-form-group-13">
                    <label for="select-5ae0" class="u-label">Parentesco <span style="color: red">*</span></label>
                    <div class="u-form-select-wrapper">
                      <select id="select-5ae0-2" name="Parentezco" class="u-input u-input-rectangle" required="required">
                        <option value="1" data-calc="Hijo">Hijo</option>
                        <option value="2" data-calc="cónyuge">Cónyuge</option>
                        <option value="3" data-calc="tutor">Tutor</option>
                      </select>
                      <svg class="u-caret u-caret-svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" style="fill:currentColor;" xml:space="preserve"><polygon class="st0" points="8,12 2,4 14,4 "></polygon></svg>
                    </div>
                  </div>
                  <!--  TELEFONO CONTATO 1 -->
                  <div class="u-form-group u-form-phone u-form-group-7">
                    <label for="phone2" class="u-label">Teléfono <span style="color: red">*</span></label>
                    <input id="phone2" type="tel" pattern="\+?\d{0,3}[\s\(\-]?([0-9]{4})[\s\)\-]?([\s\-]?)([0-9]{4})" name="phone2" value="${respuesta[0].Telefono_Familiar}" class="u-input u-input-rectangle" required="required" onkeypress="return (event.charCode >= 48 && event.charCode <= 57)">
    
                    <!--label for="phone-7ba8" class="u-label">Teléfono</label>
                    <input type="tel" pattern="\+?\d{0,3}[\s\(\-]?([0-9]{2,3})[\s\)\-]?([\s\-]?)([0-9]{3})[\s\-]?([0-9]{2})[\s\-]?([0-9]{2})" placeholder="Enter your phone (e.g. +14155552675)" id="phone-7ba8" name="FamiliarTelefono" class="u-input u-input-rectangle" required="required"-->
                  </div>
                </div>
                <div class="u-align-left u-form-group u-form-submit">
                  <div class="btn-group">
                    <button type="button" class="btn btn-primary add-button" data-toggle="modal" data-target="#exampleModalLong" onclick="sendData()">Editar Paciente</button>
                    <!--div class="alert alert-success" role="alert">
                      <h4 class="alert-heading">Well done!</h4>
                      <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
                      <hr>
                      <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
                    </div-->
                      <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLongTitle">Editar Paciente</h5>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div class="modal-body">
                              <p>¿Estas seguro de desea editar los datos de <strong> <span id="nombre-modal"></span> <span id="apellidos-modal"></span> </strong>?</p>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary cancel-button" data-dismiss="modal">Cerrar</button>
                              <input type="submit" class="btn btn-primary add-button " placeholder="Añadir Paciente">
                            </div>
                          </div>
                        </div>
                      </div>
    
                    <button type="button" class="btn btn-primary cancel-button" data-toggle="modal" data-target="#exampleModalCenter">Cancelar</button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Cancelar Editar Paciente</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                            ¿Estas seguro de cancelar el editar los datos del paciente?
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary cancel-button" data-dismiss="modal">Cancelar</button>
                            <button type="button" onclick="window.location.href='/Index'"  class="btn btn-primary add-button">Aceptar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  
                  <!--a href="/editarPaciente" class="u-border-none u-btn u-btn-submit u-button-style u-custom-color-1 u-hover-palette-2-base u-btn-1">Editar Paciente</a-->
    
                  <!--SUBMIT ANTERIOR-->
                  <!--input type="submit" class="u-border-none u-btn u-btn-submit u-button-style u-custom-color-1 u-hover-palette-2-base u-btn-1" value="Editar Paciente"-->
                </div>
                <div class="u-form-send-message u-form-send-success"> Nuevo paciente registrado. </div>
                <div class="u-form-send-error u-form-send-message"> Error: no se pudo añadir el nuevo paciente. </div>
                <input type="hidden" value="" name="recaptchaResponse">
                <input type="hidden" name="formServices" value="9c9200e6ee6509b1b8131a8b97db2bc6">
              </form>
            </div>
            </div>
            <!-- CANCELAR ANTERIOR-->
            <!--a href="/index" class="u-border-none u-btn u-button-style u-custom-color-4 u-hover-custom-color-5 u-btn-2">Cancelar</a-->
          </div>
        </section>
        
        
<!--Footer-->    
          <footer class="u-align-center  u-footer" id="sec-b565">
            <div class="u-clearfix u-sheet u-sheet-1">
              <p class="u-small-text u-text u-text-variant u-text-1">© Suite Senior, 2023</p>  
            </div>
          </footer>
        <!-- script para fecha-->
        <script src="js/edad.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
        <script>
          flatpickr("input[type=datatime-local]", {});
        </script>
        <!-- SCRIPT IMAGEN-->
        <script>
          const input = document.getElementById('input-file');
          const img = document.getElementById('profile-pic');
        
          input.addEventListener('change', () => {
            const file = input.files[0];
            const reader = new FileReader();
        
            reader.addEventListener('load', () => {
              img.src = reader.result;
            });
        
            reader.readAsDataURL(file);
          });
        </script>
    
        <script>
          const phoneInputField = document.querySelector("#phone");
          const phoneInput = window.intlTelInput(phoneInputField, {
            utilsScript:
              "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
          });
    
          const phoneInputField2 = document.querySelector("#phone2");
          const phoneInput2 = window.intlTelInput(phoneInputField2, {
            utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
          });
          /*  ELIMINAR/COMENTAR SI SE ELIMINA CONTACTO 2*/
          const phoneInputField3 = document.querySelector("#phone3");
          const phoneInput3 = window.intlTelInput(phoneInputField3, {
            utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
          }); //HASTA ACA
        </script>
    
        <script>
          // Obtener los valores de los inputs
            const nombreInput = document.getElementById("name-b6ca");
            const apellidosInput = document.getElementById("name-b6ca-1");
    
            // Agregar los valores al contenido del modal
            const nombreModal = document.getElementById("nombre-modal");
            const apellidosModal = document.getElementById("apellidos-modal");
    
            nombreModal.textContent = nombreInput.value;
            apellidosModal.textContent = apellidosInput.value;
        </script>
    
        <!--  MODAL SCRIPT RESUMEN DATOS PACIENTE -->
        <!--
        <script>
          function sendData() {
            var sexo = document.querySelector('input[name="Sexo"]:checked').value;
            // Aquí puedes hacer una petición AJAX para enviar el valor del radio button a tu script.
            return sexo // Imprime el valor del radio button en la consola para verificar que se ha capturado correctamente.
          }
    
          
          document.querySelector(".add-button").addEventListener("click", function() {
            // Obtener los valores de los inputs
            var nombre = document.getElementById("name-b6ca").value;
            var apellidos = document.getElementById("name-b6ca-1").value;
            var expediente = document.getElementById("text-3d4d-1").value;
            var fechaNacimiento = document.getElementById("fechaNacimiento").value;
            var edad= document.getElementById("edad").value;
            var sexo = sendData();
            var telefono= document.getElementById("phone").value;
            var padecimiento= document.getElementById("text-3d4d-1").value;
            var nomCont1= document.getElementById("text-3d4d-1").value;
            var parentezcoSelect = document.getElementById("select-5ae0-2");
            var parentezcoValue = parentezcoSelect.options[parentezcoSelect.selectedIndex].value;
            /*
            var parCont1= selectElement;
            var telCont1= document.getElementById("text-3d4d-1").value;
            var nomCont2= document.getElementById("text-3d4d-1").value;
            var parCont2= document.getElementById("text-3d4d-1").value;
            var telCont2= document.getElementById("text-3d4d-1").value;*/
            
            var checkboxes = document.querySelectorAll('input[name="Padecimiento"]:checked');
            var opcionesSeleccionadas = document.getElementById('opcionesSeleccionadas');
            
            // Recorrer los checkboxes seleccionados y agregar sus valores a la lista en el modal
            for (var i = 0; i < checkboxes.length; i++) {
              var opcion = document.createElement('li');
              opcion.appendChild(document.createTextNode(checkboxes[i].getAttribute('data-calc')));
              opcionesSeleccionadas.appendChild(opcion);
            }
    
            // Mostrar los valores en el cuerpo del modal
            //*
            document.querySelector(".modal-body").innerHTML = "<p>Nombre: " + nombre + apellidos + "</p>" +
                                                              "<p>Expediente: " + expediente + "</p>" + 
                                                              "<p>Fecha de Nacimiento: " + fechaNacimiento + "</p>" + 
                                                              "<p>Edad: " + edad + "</p>" + 
                                                              "<p>Sexo: " + sexo + "</p>"  +
                                                              "<p>Telefono: " + telefono + "</p>" + 
                                                              "<p>Padecimieto(s): " + "<ul>" + opcionesSeleccionadas + "</ul>"+ "</p>" + 
                                                              "<p>Contacto 1: " +  
                                                                "</p>" + "<p  >" + nomCont1 + "   " + parentezcoValue + "   "+ telCont1 + "   "+"</p>" +
                                                                "<p>Contacto 1: " +  
                                                                "</p>" + "<p  >" + nomCont2 + "   " + parCont2 + "   "+ telCont2 + "   "+"</p>" ; //*/
                                                               
          });
        </script> -->
        
    
    </body>
  </html>

    `)
  })

})

app.post('/editarPaciente', (req,res)=>{
	let nombre = req.body.Nombre +' '+ req.body.Apellidos
	let expediente = req.body.Expediente
  let id_Familiar = 0
  let fechaNacimiento = req.body.FechaNacimiento
	let edad = Math.abs((new Date(Date.now() - new Date(fechaNacimiento).getTime()).getUTCFullYear()) - 1970);
	let sexo = req.body.Sexo
	let tel = req.body.Telefono
	let padecimiento = req.body.Padecimiento

  let form = new formidable.IncomingForm();
  
  let FotoPath = req.files.Foto,

      newPhotoPath = "/home/yerry/Documentos/github/SuiteSenior/webApp/public/FotosPacientes" + FotoPath.name;



  //variables del contacto del paciente
  let faNom = req.body.FamiliarNombre + ' ' + req.body.FamiliarApellido
  let parentezco = req.body.Parentezco
  let faTelefono = req.body.phone2

  //primero cargamos la foto al servidor para depsués agregar al nuevo paciente a la base de datos

  FotoPath.mv(newPhotoPath, err => {
    if (err) { return res.status(500).send(err); }
    console.log("File uploaded!");
  });

  //recortamos el nombre de acceso para que el servidor lea las fotos posteriormente
  newPhotoPath = "./FotosPacientes/" + FotoPath.name

  //query para insertar al paciente

  con.query("select Familiar from Paciente natural join Familiar where No_Expediente='"+expediente+"'", (err, respuesta, fields)=>{
    if(err) return console.log('ERROR', err);

    id_Familiar = respuesta[0].Familiar

    con.query('Update Paciente set No_Expediente="'+expediente+'", Nombre="'+nombre+'", Edad="'+edad+'", FechaNacimiento="'+fechaNacimiento+'", Sexo="'+sexo+'", Padecimiento="'+padecimiento+'", Telefono="'+tel+'", Foto="'+newPhotoPath+'", id_usuario="'+req.session.id_usuario+'" where No_Expediente = "'+expediente+'"', (err, respuesta, fields)=>{
      if(err) return console.log('ERROR', err);
      console.log("Paciente agregado correctamente")
  
      con.query('update Familiar set Nombre_Familiar="'+faNom+'", Parentezco="'+parentezco+'", Telefono_Familiar="'+faTelefono+'" where Familiar = "'+id_Familiar+'"', (err, respuesta, fields)=>{
        if(err){
          console.log('ERROR', err);
          console.log('No se ha añadido ningun familiar')
        }else{
          console.log("familiar del paciente agregado")
        }
    
        con.query('update Paciente set Familiar = (select Familiar from Familiar where Nombre_Familiar = "'+faNom+'") where No_Expediente="'+expediente+'"', (err, respuesta, fields)=>{
          if(err){
            console.log('ERROR', err);
            console.log('No se ha asignado al familiar')
          }else{
            console.log("familiar del paciente asignado")
          }
  
          return res.redirect(
            "/Index"
  
                   
          );
        })
      })
    })
  })

})

app.post('/iniciarSesion', (req, res) =>{  
  let usuario = req.body.usuario
  let contraseña = req.body.contraseña

  //return res.send("<h1>holi</h1>")

  console.log("usuario: " + usuario + "\ncontraseña: " + contraseña)

  con.query("select * from Usuario where usuario = '"+usuario+"' and contraseña = '"+contraseña+"'", (err, respuesta, fields)=>{
    if(err) return console.log('Ha ocurrido un error en el inicio de sesion', err);
    console.log(respuesta);


    try{
      if (respuesta[0].usuario != null){
        console.log(respuesta[0].usuario, " ha iniciado sesion en el sistema");
        
        //agregamos los datos a la sesion
        req.session.nombre = req.body.usuario;
        req.session.contraseña = req.body.contraseña;
        req.session.id_usuario = respuesta[0].id_usuario;
        req.session.sexo = respuesta[0].Sexo;

        return res.redirect("/index");
      }
    }catch(error){
      console.log("alguien está tratando de iniciar sesion");
      return res.redirect('/Iniciar-Sesion.html');
      //res.render('view', { errormessage: 'your message' })
    }

  })
})

app.post("/Paciente", (req, res)=>{
  let expediente = req.body.expediente
  let nombre = req.body.nombre
  console.log("este es el expediente, y estamos en paciente: "+ expediente)
  con.query("select * from Paciente natural join Notas_medicas natural join Padecimiento natural join Sexo natural join Sesiones_diarias natural join Familiar natural join Parentezco where No_Expediente='"+expediente+"' ORDER BY id_sesion DESC", (err, respuesta, fields)=>{
    if(err) return console.log('Ha ocurrido un error en la visualizacion del paciente', err);

    var pacienteHTML=``
    var sesionesHTML=``
    var familiaresHTML=``
    var i = 0, j=0
    var previousFam = "";
    var previousSick = "";
    var membreteDoctor = "";

    console.log(respuesta)
    
    //logica para sacar el membrete del doctor
    if(req.session.sexo == 1){
      membreteDoctor= `
      
      <div class="avatar avatar-sm avatar-circle"> Dr. ${req.session.nombre} 
        <img class="avatar-img" src="doctor.png" alt="logo" style="width:40px;">
        <span class="avatar-status avatar-sm-status avatar-status-success"></span>
      </div>

      `
    }else{
      membreteDoctor= `
      
      <div class="avatar avatar-sm avatar-circle"> Dra. ${req.session.nombre} 
        <img class="avatar-img" src="doctora.png" alt="logo" style="width:40px;">
        <span class="avatar-status avatar-sm-status avatar-status-success"></span>
      </div>

      `
    }

    respuesta.forEach(paciente =>{
      if(paciente.Valor_Padecimiento == previousSick){

      }else{

      i++
      pacienteHTML += `
      
      <div class="u-custom-color-4 u-radius-50 u-shape u-shape-round u-shape-${i}">
        <div class="u-container-layout" style = "font-size: 23px" align = "middle" position = "sticky">${paciente.Valor_Padecimiento}</div>
        
      </div>
      
      `
      }
      previousSick = paciente.Valor_Padecimiento;
    })

    respuesta.forEach(sesion =>{
      j++
      sesionesHTML += `
      
      <tr style="height: 75px;">
        <td class="u-border-1 u-border-grey-30 u-first-column u-grey-5 u-table-cell u-table-cell-6">Row 1</td>
        <td class="u-border-1 u-border-grey-30 u-table-cell">Description</td>
        <td class="u-border-1 u-border-grey-30 u-table-cell">Description</td>
        <td class="u-border-1 u-border-grey-30 u-table-cell">Description</td>
        <td class="u-border-1 u-border-grey-30 u-table-cell"></td>
      </tr>
      
      `
    })

    respuesta.forEach(familiar =>{
      
      if(familiar.Nombre_Familiar == previousFam){

      }else{
      familiaresHTML += `
      
      <tr style="height: 28px; font-size: 17px;">
        <td class="u-table-cell">${familiar.Nombre_Familiar}</td>
        <td class="u-table-cell">${familiar.Valor_Parentezco}</td>
        <td class="u-table-cell">${familiar.Telefono_Familiar}</td>
      </tr>

      `
      }
      previousFam=familiar.Nombre_Familiar;
    })

    return res.send(`

    <!DOCTYPE html>
    <html style="font-size: 16px;" lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <meta name="keywords" content="Paciente​, Name">
        <meta name="description" content="">
        <title>Paciente</title>
        <link rel="stylesheet" href="./css/nicepage.css" media="screen">
        <link rel="stylesheet" href="./css/Paciente.css" media="screen">
        <script class="u-script" type="text/javascript" src="./js/jquery.js" defer=""></script>
        <script class="u-script" type="text/javascript" src="./js/nicepage.js" defer=""></script>
        <meta name="generator" content="Nicepage 5.8.2, nicepage.com">
        <link id="u-theme-google-font" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Open+Sans:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i">
        
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
        <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script type="application/ld+json">{
        "@context": "http://schema.org",
        "@type": "Organization",
        "name": "",
        "logo": "images/image.png"
        }</script>
        <meta name="theme-color" content="#478ac9">
        <meta property="og:title" content="Paciente">
        <meta property="og:type" content="website">
        <meta data-intl-tel-input-cdn-path="intlTelInput/">
      </head>

    <body class="u-body u-xl-mode" data-lang="en">
    
    
    
<!-- Barra de Navegación --> 
      <header class="u-clearfix u-header u-header" id="sec-12bb">
        <div class="u-clearfix u-sheet u-sheet-1">
          <a href="index" class="u-image u-logo u-image-1" data-image-width="572" data-image-height="190" title="Menu">
            <img src="images/image.png" class="u-logo-image u-logo-image-1">
            </a>
          <nav class="u-menu u-menu-dropdown u-offcanvas u-menu-1">
            <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
              <a class="u-button-style u-custom-left-right-menu-spacing u-custom-padding-bottom u-custom-top-bottom-menu-spacing u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#">
                <svg class="u-svg-link" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#menu-hamburger"></use>
                </svg>
                  <svg class="u-svg-content" version="1.1" id="menu-hamburger" viewBox="0 0 16 16" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><rect y="1" width="16" height="2"></rect>
                    <rect y="7" width="16" height="2"> 
                    </rect>
                    <rect y="13" width="16" height="2">
                    </rect>
                  </g>
                </svg>
                </a>
            </div>
            <div class="u-custom-menu u-nav-container">
              <ul class="u-nav u-unstyled u-nav-1">
                <li class="u-nav-item">
<!-- Account -->
                  <div class="dropdown">
                    <a class="navbar-dropdown-account-wrapper" href="index" id="accountNavbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                      ${membreteDoctor}
                    </a>
                  </div>
    <!-- End Account -->
                </li>
                <li class="u-nav-item">
                  <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Menu</a>
                  </li>
                <li class="u-nav-item">
                  <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Sesión</a>
                  <div class="u-nav-popup">
                    <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                      <li class="u-nav-item">
                        <a class="u-button-style u-nav-link u-white" href="/CerrarSesion">Cerrar sesión</a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div class="u-custom-menu u-nav-container-collapse">
              <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
                <div class="u-inner-container-layout u-sidenav-overflow">
                  <div class="u-menu-close">
                  </div>
                  <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-3">
                    <li class="u-nav-item">
                      <a class="u-button-style u-nav-link" href="index">Menu</a>
                      </li>
                    <li class="u-nav-item">
                      <a class="u-button-style u-nav-link" href="index">Sesión</a>
                      <div class="u-nav-popup">
                        <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                          <li class="u-nav-item">
                            <a class="u-button-style u-nav-link" href="/CerrarSesion">Cerrar sesión</a>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
            </div>
          </nav>
          </div>
        </header>





        <section class="u-clearfix u-section-1" id="sec-64c6">
          <div class="u-clearfix u-sheet u-sheet-1">
          <div style="border-radius: 10px; background-color: #FFFCFC; padding: 20px; border: 2px solid black;">
            <h2 class="u-text u-text-default u-text-3">Paciente<span style="font-weight: 700;"></span>
            </h2>



            <div class="u-clearfix u-gutter-10 u-layout-wrap u-layout-wrap-1">
            <div class="u-layout">
              <div class="u-layout-col">
                <div class="u-size-60">
                  <div class="u-layout-row">
                    <div class="u-container-style u-custom-color-3 u-layout-cell u-left-cell u-radius-50 u-shape-round u-size-26 u-layout-cell-1" src="">
                      <div class="u-container-layout u-container-layout-1">
                        <img class="u-image u-image-circle u-image-1" data-image-width="1080" data-image-height="1080" src="${respuesta[0].Foto}">
                        <br>
                        <h4 class="u-align-center" display-4 style="font-size: 30px;">Datos Personales</h4>
                        <p></p>
                        <p class="u-align-left u-text u-text-3"><span class="u-file-icon u-icon u-text-white"><img src="images/3239948-dbce9193.png" alt=""></span>&nbsp; <b> Fecha de nacimiento </b> ${new Date(respuesta[0].FechaNacimiento).toLocaleDateString('es-ES')}</p>

                        <p class="u-align-left u-text u-text-5"><span class="u-file-icon u-icon u-text-white"><img src="images/1742553-00bc93d6.png" alt=""></span>&nbsp; <b> Edad:</b> ${respuesta[0].Edad} años
                        </p>
                        <p class="u-align-left u-text u-text-7"><span class="u-file-icon u-icon u-text-white"><img src="images/1161016-6952b3cd.png" alt=""></span> &nbsp; <b> Sexo:</b>  ${respuesta[0].Genero} 
                        </p>
                        <p class="u-align-left u-text u-text-9"><span class="u-file-icon u-icon u-text-white"><img src="images/159832-e6b11a25.png" alt=""></span>&nbsp; <b> Teléfono </b> ${respuesta[0].Telefono}
                        </p>
                        <p></p>

                        
                        <h4 class="u-align-center" display-4 style="font-size: 30px;">Contactos</h4>
                        


<!-- Contactos Familiares-->
                        <div class="u-table u-table-responsive u-table-1">
                          <table class="u-table-entity" id =  "tabla-grande">
                            <colgroup>
                              <col width="34.4%">
                              <col width="32.2%">
                              <col width="33.400000000000006%">
                            </colgroup>
                            <thead class="u-table-header u-table-header-1">
                              <tr style="height: 26px; font-size: 17px;">
                                <th class="u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-white u-table-cell">Nombre</th>
                                <th class="u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-white u-table-cell">Parentesco</th>
                                <th class="u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-white u-table-cell">Celular</th>
                              </tr>
                            </thead>
                            <tbody class="u-table-body u-table-body-1">
                              ${familiaresHTML}
                            </tbody>
                          </table>
                        </div>
<!-- Fin de Contactos Familiares-->


                      </div>
                    </div>
                    <br>


<!--Datos del Paciente-->                      
                    <div class="u-align-left u-container-style u-layout-cell u-right-cell u-size-34 u-layout-cell-2">
                      <div class="u-container-layout u-valign-top u-container-layout-2">

                        <h2 class="u-text u-text-12" style="font-size: 40px;">${respuesta[0].Nombre}</h2>
                      
                        <h4 class="u-text u-text-13"> <b>No. de Expediente:</b> <u>${respuesta[0].No_Expediente}</u></h4>
                      
                        <!--Scrool para el resumen-->
                        
                        <h5 class="u-text u-text-14">PADECIMIENTOS</h5> ${pacienteHTML}
                          <h5 class="u-text u-text-15">Resumen de la ultima Sesión</h5>
                          <p></p>
                          <div class = "centered-content" scroll="no" style="overflow: auto; height: 400px; width: 98%; border: 1px black; padding: 10px; border-radius: 10px;">
                          <p class="u-text u-text-16" align = "justify">${respuesta[0].Resumen}}</p>
                          </div>
                          
                           <p></p>
                          
                           <div class="btn-group form-style1 centered-content">
                           <form class="form-style1" action="/HistorialMedico" method="post">
                             <button type="submit" name="Expediente" id="Expediente" value="${respuesta[0].No_Expediente}" class="btn btn-primary u-border-none u-btn-rectangle u-button-style u-custom-color-1 u-hover-palette-2-base">Historial Médico</button>
                           </form>
                         
                           <form class="form-style1" action="/grabarAudioPantalla" method="post">
                             <button type="submit" name="Expediente" id="Expediente" value="${respuesta[0].No_Expediente}" class="btn btn-primary u-border-none u-btn-rectangle u-button-style u-custom-color-3 u-hover-palette-3-base">Iniciar sesion terapeutica</button>
                           </form>
                         </div> 
                          
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>
        
        
        <!--Footer-->    
    <footer class="u-align-center  u-footer" id="sec-b565">
      <div class="u-clearfix u-sheet u-sheet-1">
        <p class="u-small-text u-text u-text-variant u-text-1">© Suite Senior, 2023</p>  
      </div>
    </footer>
  
</body>
</html>
    
    `)
  })
})

app.post("/HistorialMedico", (req, res)=>{
  let expediente = req.body.Expediente;

  var familiaresHTML="";
  var previousFam = "";
  var previousSession = "";
  var sesionesFechasHTML = "";

  var contador = 0;

  con.query("select * from Paciente natural join Notas_medicas natural join Padecimiento natural join Sexo natural join Sesiones_diarias natural join Familiar natural join Parentezco where No_Expediente='"+expediente+"' ORDER BY id_sesion DESC;", (err, respuesta, fields)=>{

    var membreteDoctor="";

    //logica para sacar el membrete del doctor
    if(req.session.sexo == 1){
      membreteDoctor= `
      
      <div class="avatar avatar-sm avatar-circle"> Dr. ${req.session.nombre} 
        <img class="avatar-img" src="doctor.png" alt="logo" style="width:40px;">
        <span class="avatar-status avatar-sm-status avatar-status-success"></span>
      </div>

      `
    }else{
      membreteDoctor= `
      
      <div class="avatar avatar-sm avatar-circle"> Dra. ${req.session.nombre} 
        <img class="avatar-img" src="doctora.png" alt="logo" style="width:40px;">
        <span class="avatar-status avatar-sm-status avatar-status-success"></span>
      </div>

      `
    }

    respuesta.forEach(familiar =>{

      if(familiar.Nombre_Familiar == previousFam){

      }else{
      familiaresHTML += `
      
      <tr style="height: 28px; font-size: 17px;">
        <td class="u-table-cell">${familiar.Nombre_Familiar}</td>
        <td class="u-table-cell">${familiar.Valor_Parentezco}</td>
        <td class="u-table-cell">${familiar.Telefono_Familiar}</td>
      </tr>

      `
      }
      previousFam = familiar.Nombre_Familiar;
    })

    contador = 0;
    respuesta.forEach((sesion, index) => {

      sesionesFechasHTML += `
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${new Date(sesion.fechaSesion).toLocaleDateString('es-ES')}</td>
        <td><a class="btn btn-link" data-toggle="collapse" href="#collapse${index + 1}" role="button" aria-expanded="false" aria-controls="collapse${index + 1}">Sesión ${respuesta.length - index}</a></td>
      </tr>
      <tr>


      <td colspan="3">
      <div class="collapse" id="collapse${index + 1}">
        <div class="card card-body">
          <div style="height: 400px; overflow-y: scroll;">
            <h3 class="card-title"><b>Sesión ${respuesta.length - index}</b> <button type="button" class="btn btn-light" onclick="document.querySelector('#collapse${index + 1} .card-text:last-child').scrollIntoView({ behavior: 'smooth' });"><b>Ver resumen</b></button> </h3>
            <p class="card-text">${sesion.SesionCompleta}</p>          
                <h3 class="card-title"><b>Resumen</b> <button type="button" class="btn btn-light" onclick="document.querySelector('#collapse${index + 1} .card-title:first-child').scrollIntoView({ behavior: 'smooth' });"><b>Ir al inicio</b></button></h3>
                <p class="card-text">${sesion.Resumen}</p>
          </div>
        </div>
      </div>
    </td>
    
    
      </tr>
    
      `;
    });
    contador++;
    res.send(`
    
    <!DOCTYPE html>
    <html style="font-size: 16px;" lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <meta name="keywords" content="Paciente​, Name">
        <meta name="description" content="">
        <title>Historial de Sesiones</title>
        <link rel="stylesheet" href="./css/nicepage.css" media="screen">
        <link rel="stylesheet" href="./css/Paciente.css" media="screen">
        <script class="u-script" type="text/javascript" src="./js/jquery.js" defer=""></script>
        <script class="u-script" type="text/javascript" src="./js/nicepage.js" defer=""></script>
        <meta name="generator" content="Nicepage 5.8.2, nicepage.com">
        <link id="u-theme-google-font" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Open+Sans:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        
        
        
          <script type="application/ld+json">
            {
              "@context": "http://schema.org",
              "@type": "Organization",
              "name": "",
              "logo": "images/image.png"
            }
          </script>
        <meta name="theme-color" content="#478ac9">
        <meta property="og:title" content="Paciente">
        <meta property="og:type" content="website">
        <meta data-intl-tel-input-cdn-path="intlTelInput/">
      </head>
      <body class="u-body u-xl-mode" data-lang="en">




<!-- Barra de Navegación --> 
      <header class="u-clearfix u-header u-header" id="sec-12bb">
        <div class="u-clearfix u-sheet u-sheet-1">
          <a href="index" class="u-image u-logo u-image-1" data-image-width="572" data-image-height="190" title="Menu">
            <img src="images/image.png" class="u-logo-image u-logo-image-1">
            </a>
          <nav class="u-menu u-menu-dropdown u-offcanvas u-menu-1 ">
            <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
              <a class="u-button-style u-custom-left-right-menu-spacing u-custom-padding-bottom u-custom-top-bottom-menu-spacing u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#">
                <svg class="u-svg-link" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#menu-hamburger"></use>
                </svg>
                  <svg class="u-svg-content" version="1.1" id="menu-hamburger" viewBox="0 0 16 16" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><rect y="1" width="16" height="2"></rect>
                    <rect y="7" width="16" height="2"> 
                    </rect>
                    <rect y="13" width="16" height="2">
                    </rect>
                  </g>
                </svg>
                </a>
            </div>


            <div class="u-custom-menu u-nav-container">
              <ul class="u-nav u-unstyled u-nav-1">
                <li class="u-nav-item">
    <!-- Cuenta -->
                  <div class="dropdown">
                    <a class="navbar-dropdown-account-wrapper" href="index" id="accountNavbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-bs-dropdown-animation="">
                      ${membreteDoctor}
                    </a>
                  </div>
    <!-- Fin de la cuent -->
                </li>
                <li class="u-nav-item">
                  <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Menu</a>
                  </li>
                <li class="u-nav-item">
                  <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Sesión</a>
                  <div class="u-nav-popup">
                    <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                      <li class="u-nav-item">
                        <a class="u-button-style u-nav-link u-white" href="/CerrarSesion">Cerrar sesión</a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

  <!-- Menu de la barra de navegación -->
            <div class="u-custom-menu u-nav-container-collapse">
              <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
                <div class="u-inner-container-layout u-sidenav-overflow">
                  <div class="u-menu-close">
                  </div>
                  <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-3">
                    <li class="u-nav-item">
                      <a class="u-button-style u-nav-link" href="index">Menu</a>
                      </li>
                    <li class="u-nav-item">
                      <a class="u-button-style u-nav-link" href="index">Sesión</a>
                      <div class="u-nav-popup">
                        <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                          <li class="u-nav-item">
                            <a class="u-button-style u-nav-link" href="/CerrarSesion">Cerrar sesión</a>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
  <!-- Fin Menú -->
              <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
            </div>
          </nav>
          </div>
        </header>
<!-- Fin de Navigation Bar -->  



        <section class="u-clearfix u-section-1" id="sec-64c6">
        
          <div class="u-clearfix u-sheet u-sheet-1">
          <div style="border-radius: 10px; background-color: #FFFCFC; padding: 20px; border: 2px solid black;">

            <h2 class="u-text u-text-default u-text-3">Historial de Sesiones<span style="font-weight: 700;"></span>
            </h2>
            <div class="u-clearfix u-gutter-10 u-layout-wrap u-layout-wrap-1">
              <div class="u-layout">
                <div class="u-layout-col">
                  <div class="u-size-60">
                    <div class="u-layout-row">
                      <div class="u-container-style u-custom-color-3 u-layout-cell u-left-cell u-radius-50 u-shape-round u-size-26 u-layout-cell-1" src="">
                        <div class="u-container-layout u-container-layout-1">
                          <img class="u-image u-image-circle u-image-1" data-image-width="1080" data-image-height="1080" src="${respuesta[0].Foto}">
                          <br>
                          <h4 class="u-align-center" display-4 style="font-size: 30px;">Datos Personales</h4>
                          <p></p>
                          <p class="u-align-left u-text u-text-3"><span class="u-file-icon u-icon u-text-white"><img src="images/3239948-dbce9193.png" alt=""></span>&nbsp; <b> Fecha de nacimiento </b> ${new Date(respuesta[0].FechaNacimiento).toLocaleDateString('es-ES')}</p>

                          <p class="u-align-left u-text u-text-5"><span class="u-file-icon u-icon u-text-white"><img src="images/1742553-00bc93d6.png" alt=""></span>&nbsp; <b> Edad:</b> ${respuesta[0].Edad} años
                          </p>
                          <p class="u-align-left u-text u-text-7"><span class="u-file-icon u-icon u-text-white"><img src="images/1161016-6952b3cd.png" alt=""></span> &nbsp; <b> Sexo:</b>  ${respuesta[0].Genero} 
                          </p>
                          <p class="u-align-left u-text u-text-9"><span class="u-file-icon u-icon u-text-white"><img src="images/159832-e6b11a25.png" alt=""></span>&nbsp; <b> Teléfono </b> ${respuesta[0].Telefono}
                          </p>
                          <p></p>

                          
                          <h4 class="u-align-center" display-4 style="font-size: 30px;">Contactos</h4>
                          


<!-- Contactos Familiares-->
                          <div class="u-table u-table-responsive u-table-1">
                            <table class="u-table-entity" id =  "tabla-grande">
                              <colgroup>
                                <col width="34.4%">
                                <col width="32.2%">
                                <col width="33.400000000000006%">
                              </colgroup>
                              <thead class="u-table-header u-table-header-1">
                                <tr style="height: 26px; font-size: 17px;">
                                  <th class="u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-white u-table-cell">Nombre</th>
                                  <th class="u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-white u-table-cell">Parentesco</th>
                                  <th class="u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-white u-table-cell">Celular</th>
                                </tr>
                              </thead>
                              <tbody class="u-table-body u-table-body-1">
                                ${familiaresHTML}
                              </tbody>
                            </table>
                          </div>
<!-- Fin de Contactos Familiares-->


                        </div>
                      </div>
                      <br>


<!--Datos del Paciente-->                      
                      <div class="u-align-left u-container-style u-layout-cell u-right-cell u-size-34 u-layout-cell-2">
                        <div class="u-container-layout u-valign-top u-container-layout-2">
                          <h2 class="u-text u-text-12" style="font-size: 40px;">${respuesta[0].Nombre}</h2>
                          <h4 class="u-text u-text-13"> <b>No. de Expediente:</b> <u>${respuesta[0].No_Expediente}</u></h4>
                          <div>
                          <br>
                          </div>


<!--Tabla que contiene la fecha de sesión y el número de la sesión-->
                          <div class = "col">
                            <table class="table table-hover">
                              <thead>
                                <tr>
                                  <th scope="col">No.</th>
                                  <th scope="col">Fecha</th>
                                  <th scope="col">No. Sesión</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${sesionesFechasHTML}
                              </tbody>
                            </table>
                          </div>


                              <!--Datos Resumen-->



                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>
      
      
    </body>
  </html>
    
    `)
  })

})

app.post("/grabarAudioPantalla", (req, res)=>{
  let expediente=req.body.Expediente;
  let doctor = req.body.doctor;

  res.send(`

  <!DOCTYPE HTML>
  <html>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatibe" content="IE-edge"> 
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
  
    <link rel="stylesheet" href="./css/Grabar-sesion.css" media="screen">
    <link rel="stylesheet" href="./css/Agregar-paciente.css" media="screen">
    <head>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  </head>
  <body>
    <div class="container">

      
      <button type="button" class="regresar" data-toggle="modal" data-target="#exampleModalLong" onclick="sendData()">Regresar a pagina anterior</button>
                  
                    <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Regresar</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                            <p>¿Estas seguro de que deseas regresar a la página anterior?</p>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary cancel-button" data-dismiss="modal">Cerrar</button>
                            <form action="/Paciente" method=post>
                              <button type="submit" class="btn btn-primary add-button" name="expediente" value="${expediente}">Aceptar</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
  
  
      <div class="card" >
        <!--img class="card-img-top" src="data:image/jpeg;base64,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" alt="Card image cap"-->
        <div class="card-body">
          <h5 class="card-title">Iniciar nueva sesión terapéutica</h5>
          <div>
            <section>
              
              <div class="pulse">
                
                <span style="--i:0;"></span>
                <span style="--i:1;"></span>
                <span style="--i:2;"></span>
                <span style="--i:3;"></span>
                <p class="pulse-text"><strong id="texto-grabar">Grabar</strong></p>
                
              </div>
              
            </section>
          </div>
  
          <div class="display">
  
          </div>
          <div class="button-section">
          <button type="button" id="btn" class="btn btn-primary btn-tape btn-start">
            <span class="material-symbols-outlined">
              play_arrow
              </span>
              </button>
          <button type="button" id="btn_pause" class="btn btn-primary btn-tape btn-pause">
            <span class="material-symbols-outlined">
              pause
              </span></button>
          <button type="button" id="btn_stop" class="btn btn-primary btn-tape btn-stop">
            <span class="material-symbols-outlined">
              stop
              </span></button>
  
            </div>
          <form action="/grabarAudio" method="post" class="g">
            <input type="hidden"  value="algo" id="texto" name="texto" >
            <input type="hidden"  value="algo" id="resumen" name="resumen" >
            <input type="hidden"  value="${expediente}" id="expediente" name="expediente">
            <input type="hidden"  value="${req.session.id_usuario}" id="doctor" name="doctor">
         
            <input type="submit" value="Guardar Sesion" class="btn btn-primary guardar">
    
          </form>
  
        </div>
      </div>
      
        
  
        <!-- <form action="/grabarAudio" method="post">
          <input type="submit" name="texto" id="texto" value="valor">
        </form> -->
    </div>
    <!-- Para el codificador de mp3 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js"></script>
    <!-- Librería para generar las grabadoras de audio -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/RecordRTC/5.5.6/RecordRTC.js"></script>
    <!-- Librería para un cliente de HTTP -->
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.6/axios.min.js"></script>
    <script src="./js/grabarAudio.js"></script>
  
    <script>
      var button = document.getElementById("btn");
      button.addEventListener("click", function() {
        var animation = document.getElementById("animation");
        animation.classList.add("active");
      });
    </script>

    <script>
      // selecciona el botón y agrega un event listener
      const play = document.querySelector('#btn');
      const textoGrabar = document.querySelector('#texto-grabar');
      play.addEventListener('click', () => {
        // selecciona el elemento que deseas cambiar
        const elemento = document.querySelector('.pulse');
        textoGrabar.textContent = 'Grabando...';
        // cambia el color del elemento
        elemento.style.background = 'green';
      });

    </script>

    <script>
      // selecciona el botón y agrega un event listener
      const pause = document.querySelector('#btn_pause');
      const textoPause = document.querySelector('#texto-grabar');
      pause.addEventListener('click', () => {
        // selecciona el elemento que deseas cambiar
        const elemento = document.querySelector('.pulse');
        textoPause.textContent = 'Sesión pausada';
        // cambia el color del elemento
        elemento.style.background = "#c03dac";
      });

    </script>

    <script>
      // selecciona el botón y agrega un event listener
      const stopbtn = document.querySelector('#btn_stop');
      const textoStop = document.querySelector('#texto-grabar');
      stopbtn.addEventListener('click', () => {
        // selecciona el elemento que deseas cambiar
        const elemento = document.querySelector('.pulse');
        textoStop.textContent = 'Sesión finalizada';
        // cambia el color del elemento
        elemento.style.background = "#ff0000";
      });

    </script>

  
  </body>
  
  </html>


  `)
})

app.post("/grabarAudio", (req, res)=>{

  let expediente=req.body.expediente;
  let doctor = req.body.doctor;
  let texto = req.body.texto;
  let resumen = req.body.resumen;
  console.log(texto)
  console.log("este es el resumen\n\n\n" + resumen)
  console.log(expediente)
  var cadena = "http://localhost:5000/"+expediente

  con.query("insert into Sesiones_diarias(No_Expediente, SesionCompleta, Resumen) values('"+expediente+"', '"+texto+"','"+resumen+"')", (err, respuesta, fields)=>{
    if(err) return console.log('Ha ocurrido un error en la insercion de la sesion', err);

    console.log("se ha insertado una sesion para el paciente")

    return res.redirect("/index");
  })

 
  
  
//   res.send(`
  
//   <!DOCTYPE HTML>
// <html>

// <body>
//   <div class="container">
//       <div class="display">

//       </div>
//       <button type="button" id="btn">Start</button>
//       <button type="button" id="btn_pause">Pause</button>
//       <button type="button" id="btn_stop">Stop</button>
//   </div>
//   <!-- Para el codificador de mp3 -->
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js"></script>
//   <!-- Librería para generar las grabadoras de audio -->
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/RecordRTC/5.5.6/RecordRTC.js"></script>
//   <!-- Librería para un cliente de HTTP -->
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.6/axios.min.js"></script>
//   <script src="./js/grabarAudio.js"></script>


// </body>

// </html>
  
//   `)
})

app.listen(8080, ()=>{

	console.log('Servidor escuchando en el puerto 8080 aiuda porfavor')
})

