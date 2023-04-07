const express = require('express');
const mysql = require('mysql');
var app = express();

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
	


app.use(express.static('public'))

app.post('/AgregarPaciente', (req,res)=>{
	let nombre = req.body.Nombre
	let expediente = req.body.Expediente
	let edad = req.body.Edad
	let sexo = req.body.Sexo
	let tel = req.body.Telefono
	let padecimiento = req.body.Padecimiento
	con.query('INSERT INTO Paciente(No_Expediente, Nombre, Edad, Sexo, Padecimiento, Telefono) values("'+expediente+'","'+nombre+'","'+edad+'","'+sexo+'","'+padecimiento+'","'+tel+'")', (err, respuesta, fields)=>{
		if(err) return console.log('ERROR', err);
		return res.send(
		`
		<h1>Paciente agregado con exito </h1>
		<a href= /index>regresar al lobby</a>
		
		`);
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
                <form action="/Paciente" method="post">
                  <input type="submit" name="nombre" value=${user.Nombre}>  
                </form>
								</a>
							</td>
							<td class="u-border-1 u-border-grey-30 u-table-cell">${user.Edad}</td>
							<td class="u-border-1 u-border-grey-30 u-table-cell">${user.Genero}</td>
							<td class="u-border-1 u-border-grey-30 u-table-cell">${user.Valor_Padecimiento}</td>
							<td class="u-border-1 u-border-grey-30 u-table-cell"><span class="u-file-icon u-icon"><form action="/eliminarUsusario" method="post"><button type="submit" name="expediente" value=${user.No_Expediente}><img src="../images/8138280.png" alt=""></button></form></span>
						</tr>`
							
		})
		return res.send(`
		
		
		
		<!DOCTYPE html>
<html style="font-size: 16px;" lang="es"><head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8">
    <meta name="keywords" content="Pacientes">
    <meta name="description" content="">
    <title>Menu</title>
    <link rel="stylesheet" href="../css/nicepage.css" media="screen">
<link rel="stylesheet" href="../css/Menu.css" media="screen">
    <script class="u-script" type="text/javascript" src="../js/jquery-1.9.1.min.js" defer=""></script>
    <script class="u-script" type="text/javascript" src="../js/nicepage.js" defer=""></script>
    <meta name="generator" content="Nicepage 5.7.13, nicepage.com">
    <link id="u-theme-google-font" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Open+Sans:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i">
    
    
    <script type="application/ld+json">{
		"@context": "http://schema.org",
		"@type": "Organization",
		"name": "",
		"logo": "../images/default-logo.png"
}</script>
    <meta name="theme-color" content="#478ac9">
    <meta property="og:title" content="Menu">
    <meta property="og:type" content="website">
  <meta data-intl-tel-input-cdn-path="intlTelInput/"></head>
  <body data-home-page="https://website4514212.nicepage.io/Menu.html?version=944104b0-b156-45d4-84c0-714f246523c3" data-home-page-title="Menu" class="u-body u-xl-mode" data-lang="es"><header class="u-clearfix u-header u-header" id="sec-3b0a"><div class="u-clearfix u-sheet u-sheet-1">
        <a href="https://nicepage.com" class="u-image u-logo u-image-1">
          <img src="../images/default-logo.png" class="u-logo-image u-logo-image-1">
        </a>
        <nav class="u-menu u-menu-one-level u-offcanvas u-menu-1">
          <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
            <a class="u-button-style u-custom-left-right-menu-spacing u-custom-padding-bottom u-custom-top-bottom-menu-spacing u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#">
              <svg class="u-svg-link" viewBox="0 0 24 24"><use xlink:href="#menu-hamburger"></use></svg>
              <svg class="u-svg-content" version="1.1" id="menu-hamburger" viewBox="0 0 16 16" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><rect y="1" width="16" height="2"></rect><rect y="7" width="16" height="2"></rect><rect y="13" width="16" height="2"></rect>
</g></svg>
            </a>
          </div>
          <div class="u-custom-menu u-nav-container">
            <ul class="u-nav u-unstyled u-nav-1"><li class="u-nav-item"><a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="Menu.html" style="padding: 10px 20px;">Menu</a>
</li></ul>
          </div>
          <div class="u-custom-menu u-nav-container-collapse">
            <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
              <div class="u-inner-container-layout u-sidenav-overflow">
                <div class="u-menu-close"></div>
                <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-2"><li class="u-nav-item"><a class="u-button-style u-nav-link" href="Menu.html">Menu</a>
</li></ul>
              </div>
            </div>
            <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
          </div>
        </nav>
      </div></header>
    <section class="u-align-center u-clearfix u-section-1" id="sec-e37d">
      <div class="u-clearfix u-sheet u-sheet-1">
        <h2 class="u-text u-text-default u-text-1">Pacientes</h2>
        <div class="u-expanded-width u-table u-table-responsive u-table-1">
          <table class="u-table-entity u-table-entity-1">
            <colgroup>
              <col width="16.6%">
              <col width="16.6%">
              <col width="16.6%">
              <col width="16.6%">
              <col width="28.9%">
              <col width="4.7%">
            </colgroup>
            <thead class="u-custom-color-1 u-table-header u-table-header-1">
              <tr style="height: 31px;">
                <th class="u-border-1 u-border-palette-4-base u-table-cell">No. Expediente</th>
                <th class="u-border-1 u-border-palette-4-base u-table-cell">Nombre</th>
                <th class="u-border-1 u-border-palette-4-base u-table-cell">Edad</th>
                <th class="u-border-1 u-border-palette-4-base u-table-cell">Sexo</th>
                <th class="u-border-1 u-border-palette-4-base u-table-cell">Padecimiento</th>
                <th class="u-border-1 u-border-palette-4-base u-table-cell"></th>
              </tr>
            </thead>
            <tbody class="u-table-body">
              
                ${userHTML}
               
            </tbody>
          </table>
        </div>
        <a href="AgregarPaciente.html" class="u-border-none u-btn u-btn-round u-button-style u-custom-color-3 u-hover-palette-2-light-1 u-radius-6 u-btn-9">Agregar Paciente</a>
      </div>
    </section>
    
    
    <footer class="u-align-center u-clearfix u-footer u-grey-80 u-footer" id="sec-8e17"><div class="u-clearfix u-sheet u-sheet-1"></div></footer>
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

app.post('/eliminarUsusario', (req,res)=>{
	let expediente = req.body.expediente
  console.log("este es el expediente del que vamos a funar: " + expediente);
	con.query("DELETE FROM Paciente where No_Expediente='"+expediente+"'", (err, respuesta, fields)=>{
		if(err) return console.log('ERROR', err);
    console.log("Se ha eliminado el paciente de la base de datos")
		return res.redirect("/index");
	})
})

app.post('/modificarUsuario', (req,res)=>{
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
  con.query("select * from Paciente natural join Notas_medicas natural join Padecimiento natural join Sexo natural join Sesiones_diarias where No_Expediente='"+expediente+"' or Nombre='"+nombre+"'", (err, respuesta, fields)=>{
    if(err) return console.log('Ha ocurrido un error en la visualizacion del paciente', err);

    var pacienteHTML=``
    var i = 1
    console.log(respuesta)
    
    respuesta.forEach(paciente =>{
      i++
      pacienteHTML += `
      
      <div class="u-container-style u-custom-color-2 u-group u-radius-30 u-shape-round u-group-${i}">
        <div class="u-container-layout"></div>
        ${paciente.Valor_Padecimiento}
      </div>
      
      `
    })

    return res.send(`
    <!DOCTYPE html>
<html style="font-size: 16px;" lang="es"><head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8">
    <meta name="keywords" content="Paciente">
    <meta name="description" content="">
    <title>Paciente</title>
    <link rel="stylesheet" href="../css/nicepage.css" media="screen">
<link rel="stylesheet" href="../css/Paciente.css" media="screen">
    <script class="u-script" type="text/javascript" src="../js/jquery-1.9.1.min.js" defer=""></script>
    <script class="u-script" type="text/javascript" src="../js/nicepage.js" defer=""></script>
    <meta name="generator" content="Nicepage 5.7.13, nicepage.com">
    <link id="u-theme-google-font" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Open+Sans:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i">
    
    
    <script type="application/ld+json">{
		"@context": "http://schema.org",
		"@type": "Organization",
		"name": "",
		"logo": "<div class="">images/default-logo.png"
}</script>
    <meta name="theme-color" content="#478ac9">
    <meta property="og:title" content="Paciente">
    <meta property="og:type" content="website">
  <meta data-intl-tel-input-cdn-path="intlTelInput/"></head>
  <body class="u-body u-xl-mode" data-lang="es"><header class="u-clearfix u-header u-header" id="sec-3b0a"><div class="u-clearfix u-sheet u-sheet-1">
        <a href="https://nicepage.com" class="u-image u-logo u-image-1">
          <img src="../images/default-logo.png" class="u-logo-image u-logo-image-1">
        </a>
        <nav class="u-menu u-menu-one-level u-offcanvas u-menu-1">
          <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
            <a class="u-button-style u-custom-left-right-menu-spacing u-custom-padding-bottom u-custom-top-bottom-menu-spacing u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#">
              <svg class="u-svg-link" viewBox="0 0 24 24"><use xlink:href="#menu-hamburger"></use></svg>
              <svg class="u-svg-content" version="1.1" id="menu-hamburger" viewBox="0 0 16 16" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><rect y="1" width="16" height="2"></rect><rect y="7" width="16" height="2"></rect><rect y="13" width="16" height="2"></rect>
</g></svg>
            </a>
          </div>
          <div class="u-custom-menu u-nav-container">
            <ul class="u-nav u-unstyled u-nav-1"><li class="u-nav-item"><a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="Menu.html" style="padding: 10px 20px;">Menu</a>
</li></ul>
          </div>
          <div class="u-custom-menu u-nav-container-collapse">
            <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
              <div class="u-inner-container-layout u-sidenav-overflow">
                <div class="u-menu-close"></div>
                <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-2"><li class="u-nav-item"><a class="u-button-style u-nav-link" href="Menu.html">Menu</a>
</li></ul>
              </div>
            </div>
            <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
          </div>
        </nav>
      </div></header>
    <section class="u-clearfix u-section-1" id="sec-2212">
      <div class="u-clearfix u-sheet u-sheet-1">
        <h2 class="u-text u-text-default u-text-1">Paciente</h2>
        <div class="u-clearfix u-expanded-width u-gutter-10 u-layout-wrap u-layout-wrap-1">
          <div class="u-layout">
            <div class="u-layout-col">
              <div class="u-size-60">
                <div class="u-layout-row">
                  <div class="u-container-style u-custom-color-1 u-layout-cell u-left-cell u-radius-43 u-shape-round u-size-26 u-layout-cell-1" src="">
                    <div class="u-container-layout u-container-layout-1">
                      <div class="u-image u-image-circle u-image-1" data-image-width="1080" data-image-height="1080"></div>
                      <p class="u-large-text u-text u-text-variant u-text-2">DATOS PERSONALES</p>
                      <p class="u-large-text u-text u-text-variant u-text-3">Fecha de Nacimiento </p>
                      <p>${respuesta[0].Edad}</p>
                      <p class="u-large-text u-text u-text-variant u-text-4">CONTACTOS</p>
                      <p>Aqui pondremos los contactos, si los tiene</p>
                    </div>
                  </div>
                  <div class="u-align-left u-container-style u-layout-cell u-right-cell u-size-34 u-layout-cell-2">
                    <div class="u-container-layout u-container-layout-2">
                      <h3 class="u-text u-text-5">${respuesta[0].Nombre}</h3>
                      <h4 class="u-text u-text-6">${respuesta[0].No_Expediente}</h4>
                      <p class="u-large-text u-text u-text-variant u-text-7">PADECIMIENTOS</p>
                      
                      ${pacienteHTML}

                      
                      <p class="u-large-text u-text u-text-variant u-text-8">RESUMEN</p>
                      <p class="u-text u-text-9">${respuesta[0].Resumen}</p>
                      <a href="" class="u-btn u-btn-rectangle u-button-style u-btn-1">learn more</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
    <footer class="u-align-center u-clearfix u-footer u-grey-80 u-footer" id="sec-8e17"><div class="u-clearfix u-sheet u-sheet-1"></div></footer>
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

app.listen(8080, ()=>{
	console.log('Servidor escuchando en el puesrto 8080 aiuda porfavor')
})