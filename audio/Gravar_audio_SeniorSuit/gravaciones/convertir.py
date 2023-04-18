# import required modules
import subprocess
from pydub import AudioSegment

nombre_archivo="audio_1"  
# convert mp3 to wav file
subprocess.call(['ffmpeg', '-i', 'media/'+nombre_archivo+'.mp3',
                 'media/'+nombre_archivo+'_conv.mp3'])

#separar aidio 

audio= AudioSegment.from_mp3("media/"+nombre_archivo+"_conv.mp3")#cargamos el archivo recivido 
segundos=30 #largo de los fragmentos
len_audio=len(audio)#obtenemos logitud de audio 
num_fragmentos=int(len_audio/(segundos*1000)) #obtenemos en cuantos fragmentos lo vamos a dividir 
fragmentos=[]
if(num_fragmentos >1 ): #solo haremos el procesamiento si el audio se puede dividir en al menos un fragmento
    for i in range(int(num_fragmentos)):
        fragmentos.append(audio[int(i*segundos*1000) :int((i*segundos*1000)+segundos*1000)]) #creamos los fragmentos

    if(len_audio%(segundos*1000)!=0):
        fragmentos.append(audio[num_fragmentos*1000*segundos:])#agregamos el ultimo pedaso del audio

    for i in range(len(fragmentos)):
        fragmentos[i].export("media/"+nombre_archivo+"_"+str(i+1)+".wav","wav") #exportamos fragmentos