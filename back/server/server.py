from flask import Flask, request, render_template, send_from_directory
import whisper


app = Flask(__name__)

LANGUAGE="Spanish"
model = whisper.load_model("small", )

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/script.js")
def script():
    return app.send_static_file("script.js")

#---------------------------------------------------------------------------------#

app.config['CLIENT_IMAGES'] = "/home/yerry/Documentos/github/SuiteSenior/back/server/Fotos"

@app.route("/get_image/<image_name>")
def get_image(image_name):
    
    print(app.config['CLIENT_IMAGES'])
    #return "thanks"
    
    try:
        return send_from_directory(app.config['CLIENT_IMAGES'], image_name, as_attachment=False)
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