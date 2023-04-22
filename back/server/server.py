from flask import Flask, request, render_template, send_from_directory
import whisper
import pymysql

#---------------------------------------------------------------------------------#
#coneccion BD

def obtener_conexion():
    return pymysql.connect(host='localhost',
                                user='root',
                                password='n0m3l0',
                                db='SeniorSuite')

def obtener_paciente_por_expediente(expediente):
    conexion = obtener_conexion()
    paciente = None
    with conexion.cursor() as cursor:
        cursor.execute(
            "SELECT No_Expediente, Nombre, id_usuario FROM Paciente natural join Usuario WHERE No_Expediente = %s", (expediente,))
        paciente = cursor.fetchone()
    conexion.close()

    print(paciente)
    return paciente

def obtener_No_sesiones(expediente):
    conexion = obtener_conexion()
    sesiones = 0
    with conexion.cursor() as cursor:
        cursor.execute(
            "SELECT count(id_sesion) FROM Sesiones_diarias WHERE No_Expediente = %s", (expediente,))
        sesiones = cursor.fetchone()
    conexion.close()

    print(sesiones)
    return paciente


#---------------------------------------------------------------------------------#

app = Flask(__name__)

LANGUAGE="Spanish"
model = whisper.load_model("small", )

#voy a hacer una ligera modificacion a la pagina index para que puedan recibir la informacion del paciente

@app.route("/<expediente>")
def index(expediente):
    paciente = obtener_paciente_por_expediente(expediente)

    return render_template("index.html")

@app.route("/script.js")
def script():
    return app.send_static_file("script.js")

#---------------------------------------------------------------------------------#

app.config['CLIENT_AUDIOS'] = "C:/Users/Yerry/Documents/github/SuiteSenior/back/server/audios"  #<- Esto se tiene que cambiar en cada pc

@app.route("/audios/<audio_name>")
def get_image(audio_name):
    
    print(app.config['CLIENT_AUDIOS'])
    #return "thanks"
    
    try:
        return send_from_directory(app.config['CLIENT_AUDIOS'], audio_name, as_attachment=False)
    except (FileNotFoundError):
        abort(404)
#---------------------------------------------------------------------------------#

@app.route("/upload", methods=["POST"])
def upload():
    # Obtains the Blob object from the request
    audio_file = request.files["audio_file"]

    # Saves the Blob object to a file
    with open("audio.wav", "wb") as f:
        f.write(audio_file.read())
    
    res = model.transcribe("audio.wav", language=LANGUAGE, fp16=False)['text']
    print(res)
    
    return res




if __name__ == "__main__":
    app.run("0.0.0.0")

    x = input("inserte el expediente del paciente")
    
    paciente = obtener_paciente_por_expediente(x)
    sesiones = obtener_No_sesiones(x)
    print(paciente)
    print("sesiones: ", sesiones)