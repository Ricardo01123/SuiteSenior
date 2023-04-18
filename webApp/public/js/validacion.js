let usuario =document.getElementById("name-6797")
let password =document.getElementById("text-2713")
let form= document.getElementById("form_iniciar_sesion")
let alertas=document.getElementById("warnings")

form.addEventListener("submit",e=>{
    e.preventDefault()
    let warnings =""
    let invalido=false
    let regex_usu=/^[A-Za-z0-9_-]{5,20}$/
    alertas.innerHTML=""
    
    if (!regex_usu.test(usuario.value)){
        warnings += 'Usuario no valido <br>'
        invalido=true
    }
    if(password.value.length<8){
        warnings += 'La contraseña es menor a 8 digitos <br>'
        invalido =true
    }
    if(!password.match(/[A-z]/)){
        warnings += 'La contraseña debe tener al menos una letra <br>'
        invalido =true
    }
    if(!password.match(/[A-Z]/)){
        warnings += 'La contraseña debe tener al menos una letra mayuscula <br>'
        invalido =true
    }
    if(!password.match(/\d/)){
        warnings += 'La contraseña debe tener al menos un número <br>'
        invalido =true
    }
    if (invalido){
        alertas.innerHTML=warnings
    }else{
        //registrar en la BD
    }
    

})