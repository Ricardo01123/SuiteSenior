import nltk
import textwrap
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from heapq import nlargest

#recursos necesarios de NLTK
nltk.download('punkt')
nltk.download('stopwords')

#función para crear el resumen
def create_summary(text, num_sentences):

    #Tokenizando el texto en oraciones y palabras
    sentences = sent_tokenize(text)
    words = word_tokenize(text)

    #Eliminando palabras vacías
    stop_words = set(stopwords.words('spanish'))
    words = [word for word in words if not word.lower() in stop_words]

    #Calculando la frecuencia de cada palabra
    freq = nltk.FreqDist(words)

    #Calculando la puntuación de cada oración
    sentence_scores = {}
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word in freq:
                if len(sentence.split(' ')) < 30:
                    if sentence not in sentence_scores:
                        sentence_scores[sentence] = freq[word]
                    else:
                        sentence_scores[sentence] += freq[word]

    #seleccionar las N oraciones con mayor puntuacion
    summary_sentences = nlargest(num_sentences, sentence_scores, key=sentence_scores.get)

    #duvuelve el resumen como un string
    summary = ' '.join(summary_sentences)
    return summary

with open('prueba.txt', 'r', encoding='utf-8') as f:
    texto = f.read()

texto_alineado = '\n'.join(textwrap.wrap(texto, width=60))
#print(texto_alineado)

#resumen = create_summary(texto, 2)
#f.write(create_summary)
#print(resumen)

#nombre del archivo de salida
nombre_archivo = 'resumen.txt'

#generar el resumen
num_sentences = 5 #Numero de sentencias con el que se genera un buen resumen
resumen = create_summary(texto, num_sentences)

#alinear el resumen y escribirlo en el archivo de salida
with open(nombre_archivo, 'w', encoding='utf-8') as f:
    f.write('\n'.join(textwrap.wrap(resumen, width=60)))


