const express = require('express');
const mysql = require('mysql');
var app = express();

const path = require('path')

var formidable = require('formidable');
var fs = require('fs');
const fileUpload = require('express-fileupload');

var bodyParser= require('body-parser');
var con = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'n0m3l0',
	database:'SeniorSuite'
})
con.connect()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
	extended: true
}))
	
app.use(fileUpload());

app.use(express.static('public'))

app.post('/AgregarPaciente', (req,res)=>{
	let nombre = req.body.Nombre +' '+ req.body.Apellidos
	let expediente = req.body.Expediente
  let fechaNacimiento = req.body.FechaNacimiento
	let edad = req.body.Edad
	let sexo = req.body.Sexo
	let tel = req.body.Telefono
	let padecimiento = req.body.Padecimiento

  let form = new formidable.IncomingForm();
  
  let FotoPath = req.files.Foto,
      newPhotoPath = "/home/yerry/Documentos/github/SuiteSenior/webApp/public/FotosPacientes/" + FotoPath.name;
  console.log(FotoPath)


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
	con.query('INSERT INTO Paciente(No_Expediente, Nombre, Edad, FechaNacimiento, Sexo, Padecimiento, Telefono, Foto) values("'+expediente+'","'+nombre+'","'+edad+'","'+fechaNacimiento+'","'+sexo+'","'+padecimiento+'","'+tel+'","'+newPhotoPath+'")', (err, respuesta, fields)=>{
		if(err) return console.log('ERROR', err);
		console.log("Paciente agregado correctamente")

    con.query('INSERT INTO Familiar(Nombre_Familiar, Parentezco, Telefono_Familiar) values("'+faNom+'","'+parentezco+'","'+faTelefono+'")', (err, respuesta, fields)=>{
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

  //query para insertar el contacto
  
  })
  
})

app.get('/index', (req, res)=>{

	con.query('select * from Paciente natural join Sexo natural join Padecimiento', (err, respuesta, field)=>{
		if(err) return console.log('ERROR: ', err);

		var userHTML = ``
		var i = 0
		console.log(respuesta)
		respuesta.forEach(user =>{
			i++
			userHTML +=`<tr style="height: 29px;">
							<td class="u-border-1 u-border-grey-30 u-first-column u-grey-5 u-table-cell u-table-cell-7">
								<!--a class="u-active-none u-border-none u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-btn-1" href="Paciente.html"-->
								<form action="/Paciente" method="post">
                  <input type="submit" name="expediente" value=${user.No_Expediente}>  
                </form>
								<!-- /a>-->
							</td>
							<td class="u-border-1 u-border-grey-30 u-first-column u-grey-5 u-table-cell u-table-cell-7">
								<!-- a class="u-active-none u-border-none u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-btn-1" href="Paciente.html"-->
                
                ${user.Nombre}
                
								<!--/a-->
							</td>
							<td class="u-border-1 u-border-grey-30 u-table-cell">${user.Edad}</td>
							<td class="u-border-1 u-border-grey-30 u-table-cell">${user.Genero}</td>
							<td class="u-border-1 u-border-grey-30 u-table-cell">${user.Valor_Padecimiento}</td>
							<td class="u-border-1 u-border-grey-30 u-table-cell"><span class="u-file-icon u-icon"><form action="/eliminarPaciente" method="post"><button type="submit" name="expediente" value=${user.No_Expediente}><img src="../images/3405244-aebb539c.png" alt=""></button></form></span>
              <td class="u-border-1 u-border-grey-30 u-table-cell"><span class="u-file-icon u-icon"><form action="/editarPaciente" method="post"><button type="submit" name="expediente" value=${user.No_Expediente}><img src="../images/2990079.png" alt=""></button></form></span>
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
    <meta data-intl-tel-input-cdn-path="intlTelInput/"></head>
    <body class="u-body u-xl-mode" data-lang="en"><header class="u-clearfix u-header u-header" id="sec-12bb"><div class="u-clearfix u-sheet u-sheet-1">
          <a href="index" class="u-image u-logo u-image-1" data-image-width="572" data-image-height="190" title="Menu">
            <img src="images/image.png" class="u-logo-image u-logo-image-1">
          </a>
          <nav class="u-menu u-menu-dropdown u-offcanvas u-menu-1">
            <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
              <a class="u-button-style u-custom-left-right-menu-spacing u-custom-padding-bottom u-custom-top-bottom-menu-spacing u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#">
                <svg class="u-svg-link" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#menu-hamburger"></use></svg>
                <svg class="u-svg-content" version="1.1" id="menu-hamburger" viewBox="0 0 16 16" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><rect y="1" width="16" height="2"></rect><rect y="7" width="16" height="2"></rect><rect y="13" width="16" height="2"></rect>
  </g></svg>
              </a>
            </div>
            <div class="u-custom-menu u-nav-container">
              <ul class="u-nav u-unstyled u-nav-1"><li class="u-nav-item"><a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Menu</a>
  </li><li class="u-nav-item"><a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Sesión</a><div class="u-nav-popup"><ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10"><li class="u-nav-item"><a class="u-button-style u-nav-link u-white" href="Iniciar-Sesion.html">Cerrar sesión</a>
  </li></ul>
  </div>
  </li></ul>
            </div>
            <div class="u-custom-menu u-nav-container-collapse">
              <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
                <div class="u-inner-container-layout u-sidenav-overflow">
                  <div class="u-menu-close"></div>
                  <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-3"><li class="u-nav-item"><a class="u-button-style u-nav-link" href="index">Menu</a>
  </li><li class="u-nav-item"><a class="u-button-style u-nav-link" href="index">Sesión</a><div class="u-nav-popup"><ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10"><li class="u-nav-item"><a class="u-button-style u-nav-link" href="Iniciar-Sesion.html">Cerrar sesión</a>
  </li></ul>
  </div>
  </li></ul>
                </div>
              </div>
              <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
            </div>
          </nav>
        </div></header>
      <section class="u-align-center u-clearfix u-section-1" id="sec-6cce">
        <div class="u-clearfix u-sheet u-valign-top u-sheet-1">
          <!-- TITULO PACIENTES -->
          <h2 class="u-align-left u-text u-text-default u-text-1">Pacientes</h2>
          <div class="u-expanded-width u-table u-table-responsive u-table-1">
            <!-- LISTA DE PACIENTES -->
            <table class="u-table-entity u-table-entity-1">
              <colgroup>
                <col width="14.3%">
                <col width="15.6%">
                <col width="14.9%">
                <col width="12.4%">
                <col width="33.4%">
                <col width="4.7%">
                <col width="4.7%">
              </colgroup>
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
      
      
      <footer class="u-align-center u-clearfix u-footer u-grey-80 u-footer" id="sec-b565"><div class="u-clearfix u-sheet u-sheet-1"></div></footer>
      <section class="u-backlink u-clearfix u-grey-80">
        <a class="u-link" href="https://nicepage.com/website-templates" target="_blank">
          <span>Website Templates</span>
        </a>
        <p class="u-text">
          <span>created with</span>
        </p>
        <a class="u-link" href="" target="_blank">
          <span>Website Builder Software</span>
        </a>. 
      </section>
    
  </body></html>
						
						`)
	})
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

app.post('/editarPaciente', (req,res)=>{
	let nombreInicial = req.body.nombreInicial
	let nombreFinal = req.body.nombreFinal
	con.query("update usuario set nombre='"+nombreFinal+"' where nombre='"+nombreInicial+"'", (err, respuesta, fields)=>{
		if(err) return console.log('ERROR', err);
		return res.send("<h1> a '"+nombreInicial+"' le ha ocurrido una metamorphosis y ahora es '"+nombreFinal+"'</h1>");
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
  con.query("select * from Paciente natural join Notas_medicas natural join Padecimiento natural join Sexo natural join Sesiones_diarias natural join Familiar natural join Parentezco where No_Expediente='"+expediente+"' ORDER BY id_sesion ASC", (err, respuesta, fields)=>{
    if(err) return console.log('Ha ocurrido un error en la visualizacion del paciente', err);

    var pacienteHTML=``
    var sesionesHTML=``
    var familiaresHTML=``
    var i = 0, j=0
    var previousFam = "";
    var previousSick = "";

    console.log(respuesta)
    
    respuesta.forEach(paciente =>{
      if(paciente.Valor_Padecimiento == previousSick){

      }else{

      i++
      pacienteHTML += `
      
      <div class="u-custom-color-4 u-radius-50 u-shape u-shape-round u-shape-${i}">
        <div class="u-container-layout"></div>
        ${paciente.Valor_Padecimiento}
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
      
      <tr style="height: 28px;">
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
    <html style="font-size: 16px;" lang="en"><head>
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
      <meta data-intl-tel-input-cdn-path="intlTelInput/"></head>
      <body class="u-body u-xl-mode" data-lang="en"><header class="u-clearfix u-header u-header" id="sec-12bb"><div class="u-clearfix u-sheet u-sheet-1">
            <a href="index" class="u-image u-logo u-image-1" data-image-width="572" data-image-height="190" title="Menu">
              <img src="images/image.png" class="u-logo-image u-logo-image-1">
            </a>
            <nav class="u-menu u-menu-dropdown u-offcanvas u-menu-1">
              <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
                <a class="u-button-style u-custom-left-right-menu-spacing u-custom-padding-bottom u-custom-top-bottom-menu-spacing u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#">
                  <svg class="u-svg-link" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#menu-hamburger"></use></svg>
                  <svg class="u-svg-content" version="1.1" id="menu-hamburger" viewBox="0 0 16 16" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><rect y="1" width="16" height="2"></rect><rect y="7" width="16" height="2"></rect><rect y="13" width="16" height="2"></rect>
    </g></svg>
                </a>
              </div>
              <div class="u-custom-menu u-nav-container">
                <ul class="u-nav u-unstyled u-nav-1"><li class="u-nav-item"><a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Menu</a>
    </li><li class="u-nav-item"><a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Sesión</a><div class="u-nav-popup"><ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10"><li class="u-nav-item"><a class="u-button-style u-nav-link u-white" href="Iniciar-Sesion.html">Cerrar sesión</a>
    </li></ul>
    </div>
    </li></ul>
              </div>
              <div class="u-custom-menu u-nav-container-collapse">
                <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
                  <div class="u-inner-container-layout u-sidenav-overflow">
                    <div class="u-menu-close"></div>
                    <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-3"><li class="u-nav-item"><a class="u-button-style u-nav-link" href="index">Menu</a>
    </li><li class="u-nav-item"><a class="u-button-style u-nav-link" href="index">Sesión</a><div class="u-nav-popup"><ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10"><li class="u-nav-item"><a class="u-button-style u-nav-link" href="Iniciar-Sesion.html">Cerrar sesión</a>
    </li></ul>
    </div>
    </li></ul>
                  </div>
                </div>
                <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
              </div>
            </nav>
          </div></header>
        <section class="u-clearfix u-section-1" id="sec-64c6">
          <div class="u-clearfix u-sheet u-sheet-1">
            <h2 class="u-text u-text-default u-text-1">Paciente<span style="font-weight: 700;"></span>
            </h2>
            <div class="u-clearfix u-gutter-10 u-layout-wrap u-layout-wrap-1">
              <div class="u-layout">
                <div class="u-layout-col">
                  <div class="u-size-60">
                    <div class="u-layout-row">
                      <div class="u-container-style u-custom-color-3 u-layout-cell u-left-cell u-radius-50 u-shape-round u-size-26 u-layout-cell-1" src="">
                        <div class="u-container-layout u-container-layout-1">
                          <img class="u-image u-image-circle u-image-1" data-image-width="1080" data-image-height="1080" src="${respuesta[0].Foto}">
                          <h6 class="u-align-center u-text u-text-2">DATOS PERSONALES</h6>
                          <p class="u-align-left u-text u-text-3"><span class="u-file-icon u-icon u-text-white"><img src="images/3239948-dbce9193.png" alt=""></span>&nbsp; Fecha de nacimiento
                          </p>
                          <p class="u-align-left u-text u-text-4">${respuesta[0].FechaNacimiento}</p>
                          <p class="u-align-left u-text u-text-5"><span class="u-file-icon u-icon u-text-white"><img src="images/1742553-00bc93d6.png" alt=""></span>&nbsp; Edad
                          </p>
                          <p class="u-align-left u-text u-text-6">${respuesta[0].Edad}</p>
                          <p class="u-align-left u-text u-text-7"><span class="u-file-icon u-icon u-text-white"><img src="images/1161016-6952b3cd.png" alt=""></span>&nbsp; Sexo
                          </p>
                          <p class="u-align-left u-text u-text-8">${respuesta[0].Genero}</p>
                          <p class="u-align-left u-text u-text-9"><span class="u-file-icon u-icon u-text-white"><img src="images/159832-e6b11a25.png" alt=""></span>&nbsp; Teléfono
                          </p>
                          <p class="u-align-left u-text u-text-10">${respuesta[0].Telefono}</p>
                          <h6 class="u-align-left u-text u-text-11">Contactos</h6>
                          <div class="u-table u-table-responsive u-table-1">
                            <table class="u-table-entity">
                              <colgroup>
                                <col width="34.4%">
                                <col width="32.2%">
                                <col width="33.400000000000006%">
                              </colgroup>
                              <thead class="u-table-header u-table-header-1">
                                <tr style="height: 26px;">
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
                        </div>
                      </div>
                      <div class="u-align-left u-container-style u-layout-cell u-right-cell u-size-34 u-layout-cell-2">
                        <div class="u-container-layout u-valign-bottom u-container-layout-2">
                          <h2 class="u-text u-text-12">${respuesta[0].Nombre}</h2>
                          <h4 class="u-text u-text-13"><p>Expediente: </p>${respuesta[0].No_Expediente}</h4>
                          <h5 class="u-text u-text-14">PADECIMIENTOS</h5>
                          ${pacienteHTML}
                          <h5 class="u-text u-text-15">RESUMEN</h5>
                          <p class="u-text u-text-16">${respuesta[0].Resumen}}</p>
                          <div class="btn-group" >
                            <form action="/HistorialMedico" method="post">

                              <!--input type="submit" name="Expediente" id="Expediente" value="${respuesta[0].No_Expediente}"-->
                              <button type="submit" name="Expediente" id="Expediente" value="${respuesta[0].No_Expediente}" class="btn btn-primary btn-group-lg  u-border-none  u-btn-rectangle u-button-style u-custom-color-1 u-hover-palette-2-base u-btn-1">Historial Médico</button>
                            </form>

                            <form action="/grabarAudioPantalla" method="post">
                              <button type="submit" name="Expediente" id="Expediente" value="${respuesta[0].No_Expediente}" class="btn btn-primary btn-group-lg  u-border-none  u-btn-rectangle u-button-style u-custom-color-3 u-hover-palette-3-base u-btn-1">Iniciar sesion terapeutica</button>
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
        </section>
        
        
        <footer class="u-align-center u-clearfix u-footer u-grey-80 u-footer" id="sec-b565"><div class="u-clearfix u-sheet u-sheet-1"></div></footer>
        <section class="u-backlink u-clearfix u-grey-80">
          <a class="u-link" href="https://nicepage.com/website-templates" target="_blank">
            <span>Website Templates</span>
          </a>
          <p class="u-text">
            <span>created with</span>
          </p>
          <a class="u-link" href="" target="_blank">
            <span>Website Builder Software</span>
          </a>. 
        </section>
      
    </body></html>
    
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

  con.query("select * from Paciente natural join Notas_medicas natural join Padecimiento natural join Sexo natural join Sesiones_diarias natural join Familiar natural join Parentezco where No_Expediente='"+expediente+"' ORDER BY id_sesion ASC;", (err, respuesta, fields)=>{

    respuesta.forEach(familiar =>{

      if(familiar.Nombre_Familiar == previousFam){

      }else{
      familiaresHTML += `
      
      <tr style="height: 28px;">
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
      <br/>  
      <tr>
          <th scope="row">${index + 1}</th>
          <td>${sesion.fechaSesion}</td>
          <td><a class="btn btn-link" data-toggle="collapse" href="#collapse${index + 1}" role="button" aria-expanded="false" aria-controls="collapse${index + 1}">Sesión ${respuesta.length - index}</a></td>
        </tr>
        <tr>
          <td colspan="3">
            <div class="collapse" id="collapse${index + 1}">
              <div class="card card-body">
                <h5 class="card-title">Sesión ${respuesta.length - index}</h5>
                <p class="card-text">${sesion.SesionCompleta}</p>
                <h5 class="card-title">Resumen</h5>
                <p class="card-text">${sesion.Resumen}</p>
              </div>
            </div>
          </td>
        </tr>
      `;
    });

    res.send(`
    
    <!DOCTYPE html>
    <html style="font-size: 16px;" lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <meta name="keywords" content="Paciente​, Name">
        <meta name="description" content="">
        <title>Hitorial Médico</title>
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
<!-- Navigation Bar -->        
        <header class="u-clearfix u-header u-header" id="sec-12bb">
          <div class="u-clearfix u-sheet u-sheet-1">
            <div class="navbar">
              
            </div>
            <a href="index" class="u-image u-logo u-image-1" data-image-width="572" data-image-height="190" title="Menu">
                <img src="images/image.png" class="u-logo-image u-logo-image-1">
            </a>
            <nav class="u-menu u-menu-dropdown u-offcanvas u-menu-1">
            <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
            <a class="u-button-style u-custom-left-right-menu-spacing u-custom-padding-bottom u-custom-top-bottom-menu-spacing u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#">
            </a>
            </div>
            <div class="u-custom-menu u-nav-container">
              <ul class="u-nav u-unstyled u-nav-1">
                <li class="u-nav-item">
                  <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Menu</a>
                  </li>
                <li class="u-nav-item">
                  <a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="index" style="padding: 10px 20px;">Sesión</a>
                  <div class="u-nav-popup">
                    <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                      <li class="u-nav-item">
                        <a class="u-button-style u-nav-link u-white" href="Iniciar-Sesion.html">Cerrar sesión</a>
                        </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div class="u-custom-menu u-nav-container-collapse">
              <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
                <div class="u-inner-container-layout u-sidenav-overflow">
                  <div class="u-menu-close"></div>
                    <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-3"><li class="u-nav-item"><a class="u-button-style u-nav-link" href="index">Menu</a>
                      </li>
                      <li class="u-nav-item">
                        <a class="u-button-style u-nav-link" href="index">Sesión</a>
                        <div class="u-nav-popup">
                          <ul class="u-h-spacing-20 u-nav u-unstyled u-v-spacing-10">
                            <li class="u-nav-item"><a class="u-button-style u-nav-link" href="Iniciar-Sesion.html">Cerrar sesión</a>
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
<!-- Fin de Navigation Bar -->        
        <section class="u-clearfix u-section-1" id="sec-64c6">
          <div class="u-clearfix u-sheet u-sheet-1">
            <h2 class="u-text u-text-default u-text-1">Hitorial Médico<span style="font-weight: 700;"></span>
            </h2>
            <div class="u-clearfix u-gutter-10 u-layout-wrap u-layout-wrap-1">
              <div class="u-layout">
                <div class="u-layout-col">
                  <div class="u-size-60">
                    <div class="u-layout-row">
                      <div class="u-container-style u-custom-color-3 u-layout-cell u-left-cell u-radius-50 u-shape-round u-size-26 u-layout-cell-1" src="">
                        <div class="u-container-layout u-container-layout-1">
                          <img class="u-image u-image-circle u-image-1" data-image-width="1080" data-image-height="1080" src="${respuesta[0].Foto}">
                          <h6 class="u-align-center u-text u-text-2">DATOS PERSONALES</h6>
                          <p class="u-align-left u-text u-text-3"><span class="u-file-icon u-icon u-text-white"><img src="images/3239948-dbce9193.png" alt=""></span>&nbsp; Fecha de nacimiento
                          </p>
                          <p class="u-align-left u-text u-text-4">${respuesta[0].FechaNacimiento}</p>
                          <p class="u-align-left u-text u-text-5"><span class="u-file-icon u-icon u-text-white"><img src="images/1742553-00bc93d6.png" alt=""></span>&nbsp; Edad
                          </p>
                          <p class="u-align-left u-text u-text-6">${respuesta[0].Edad}</p>
                          <p class="u-align-left u-text u-text-7"><span class="u-file-icon u-icon u-text-white"><img src="images/1161016-6952b3cd.png" alt=""></span>&nbsp; Sexo
                          </p>
                          <p class="u-align-left u-text u-text-8">${respuesta[0].Genero}</p>
                          <p class="u-align-left u-text u-text-9"><span class="u-file-icon u-icon u-text-white"><img src="images/159832-e6b11a25.png" alt=""></span>&nbsp; Teléfono
                          </p>
                          <p class="u-align-left u-text u-text-10">${respuesta[0].Telefono}</p>
                          <h6 class="u-align-left u-text u-text-11">Contactos</h6>
                          <div class="u-table u-table-responsive u-table-1">
                            <table class="u-table-entity">
                              <colgroup>
                                <col width="34.4%">
                                <col width="32.2%">
                                <col width="33.400000000000006%">
                              </colgroup>
                              <thead class="u-table-header u-table-header-1">
                                <tr style="height: 26px;">
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
                        </div>
                      </div>
<!--Datos del Paciente-->                      
                      <div class="u-align-left u-container-style u-layout-cell u-right-cell u-size-34 u-layout-cell-2">
                        <div class="u-container-layout u-valign-top u-container-layout-2">
                          <h2 class="u-text u-text-12">${respuesta[0].Nombre}</h2>
                          <h4 class="u-text u-text-13">${respuesta[0].No_Expediente}</h4>
                          
                          <!--Tabla que contiene la fecha de sesión y el número de la sesión-->
                          <div class = "col">
                            <table class="table table-hover">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
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
        </section>
      
    </body></html>
    
    `)
  })

})

app.post("/grabarAudioPantalla", (req, res)=>{
  let expediente=req.body.Expediente;
  let doctor = req.body.doctor;

  res.send(`

  <!DOCTYPE HTML>
<html>

<body>
  <div class="container">
      <div class="display">

      </div>
      <button type="button" id="btn">Start</button>
      <button type="button" id="btn_pause">Pause</button>
      <button type="button" id="btn_stop">Stop</button>

      <form action="/grabarAudio" method="post">
        <input type="text" id="texto" name="texto" >
        <input type="text" value="${expediente}" id="expediente" name="expediente" hidden="True">
        <!--input type="text" disabled="True" value="${doctor}" id="doctor" name="doctor" hidden="True"-->
        <input type="submit" value="guardar Sesion">

      </form>

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


</body>

</html>


  `)
})

app.post("/grabarAudio", (req, res)=>{

  let expediente=req.body.expediente;
  let doctor = req.body.doctor;
  let texto = req.body.texto;
  console.log(texto)
  console.log(expediente)
  var cadena = "http://localhost:5000/"+expediente

  con.query("insert into Sesiones_diarias(No_Expediente, SesionCompleta) values('"+expediente+"', '"+texto+"')", (err, respuesta, fields)=>{
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

