let formulario = document.getElementById("form_paciente")
let expediente =document.getElementById("Expediente")
let nombre =document.getElementById("Nombre")
let telefono =document.getElementById("Telefono")
let alertas=document.getElementById("warnings")

form.addEventListener("submit",e=>{
    e.preventDefault()
    let warnings =""
    let invalido=false
    alertas.innerHTML=""
    let regex_nombre=/^[A-Za-z\sàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{5,25}$/gm
    let regex_expediente=/^[A-Z]{4}-[0-9]{6}/gm //los primeros 4 elementos son letras un guin medio y los siguientes 6 npumeros
    let regex_telefono=/^(\(\+?\d{2}\)[\*|\s|\-|\.]?(([\d][\*|\s|\-|\.]?){6})(([\d][\s|\-|\.]?){2})?|(\+?[\d][\s|\-|\.]?){8}(([\d][\s|\-|\.]?){2}(([\d][\s|\-|\.]?){2})?)?)$/
    
    if(!regex_expediente,test(expediente.value)){
        warnings+= 'Expediente invalido <br>'
        invalido=true
    }
    if(!regex_nombre.test(nombre.value)){
        warnings+= 'Nombre invalido <br>'
        invalido=true
    }
    if(!regex_telefono.test(telefono.value)){
        warnings+= 'Numero telefónico invalido <br>'
        invalido=true
    }
    if (invalido){
        console.log(warnings)
        alertas.innerHTML=warnings
    }else{
        //registrar en la BD
    }



})