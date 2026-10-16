// Lección 2 — Keygel Salazar
// Construyendo Oraciones de Rutina y Acción
import {
  html, LessonHeader, Section, Pause, Hl, ColorLegend, VocabColumns, Tip, ClassGoal, StepsGuide,
  Goals, Check, Choice, SentenceSlot, PartsQuiz, Timer, WritingCheck, StructuredReading,
} from '../../../src/components/lesson/index.js';

const READING = [
  ['subject', 'Daniela'], ' ', ['verb', 'wakes up'], ' ', ['complement', 'early every day'], '. ',
  ['connector', 'First'], ', ', ['subject', 'she'], ' ', ['verb', 'takes'], ' ', ['complement', 'a shower'], ' ', ['connector', 'and'], ' ', ['verb', 'eats'], ' ', ['complement', 'a quick breakfast'], '. ',
  ['connector', 'Then'], ', ', ['subject', 'she'], ' ', ['verb', 'goes'], ' ', ['complement', 'to the office'], ' ', ['connector', 'and'], ' ', ['verb', 'checks'], ' ', ['complement', 'her emails'], '. ',
  ['connector', 'After that'], ', ', ['subject', 'she'], ' ', ['verb', 'writes'], ' ', ['complement', 'reports for her boss'], '. ',
  ['connector', 'Finally'], ', ', ['subject', 'she'], ' ', ['verb', 'goes'], ' ', ['complement', 'home'], ' ', ['connector', 'and'], ' ', ['verb', 'reads'], ' ', ['complement', 'a book before bed'], '.',
];

export default function Lesson2() {
  return html`
    <${LessonHeader}
      title="Lección 2: Construyendo Oraciones de Rutina y Acción"
      subtitle="Sintaxis en Presente Simple y combinación de ideas cotidianas" />

    <${ClassGoal}>Comprender la estructura de oraciones simples (Sujeto + Verbo + Predicado) y armar al menos 5 oraciones fluidas sobre actividades cotidianas usando la validación interactiva.<//>

    <${Section} title="🔤 Palabras de mi Día a Día">
      <p>Este es el código de colores que usaremos para armar oraciones hoy:</p>
      <${ColorLegend} items=${['subject', 'verb', 'complement', 'connector']} labels=${{
        subject: 'Sujeto (¿Quién?)', verb: 'Verbo (Acción)', complement: 'Predicado (Detalle)', connector: 'Conector (Orden)',
      }} />

      <${Tip} title=${html`🔗 Un conector nuevo: <${Hl} t="connector">And<//>`}>
        <strong>And</strong> significa <strong>"y"</strong> en español. A diferencia de First, Then, After that y Finally (que indican <em>orden</em>), <strong>and</strong> solo une dos acciones o ideas que pasan en el mismo momento, sin decir cuál fue antes o después.
        <br /><br />
        <strong>Ejemplo:</strong> <${Hl} t="subject">She<//> <${Hl} t="verb">takes<//> <${Hl} t="complement">a shower<//> <${Hl} t="connector">and<//> <${Hl} t="verb">eats<//> <${Hl} t="complement">breakfast<//>.
        <br />
        <em>(Ella se ducha y desayuna — las dos cosas, sin marcar un orden específico entre ellas.)</em>
      <//>

      <p>Vocabulario de tu entorno real — trabajo, casa y familia:</p>
      <${VocabColumns} columns=${[
        { title: 'Sujetos', t: 'subject', items: ['I', 'We', 'They', 'My mother', 'My father', 'My brother', 'My boss', 'My coworker', 'My client', 'Daniela', 'Carlos'] },
        { title: 'Verbos de Acción', t: 'verb', items: ['wake up', 'eat', 'cook', 'clean', 'study', 'work', 'read', 'sleep', 'check', 'write'] },
        { title: 'Predicados (Casa y Trabajo)', t: 'complement', items: ['breakfast at 8:00 AM', 'lunch for the family', 'the house', 'English on my computer', 'important documents', 'reports at work', 'a book before bed'] },
        { title: 'Conectores (Repaso)', t: 'connector', items: ['First', 'Then', 'Next', 'After that', 'Finally', 'And (nuevo)'] },
      ]} />
    <//>

    <${Section} title="🎰 Arma tu Oración" tag="Actividad interactiva">
      <p>Presiona <strong>Girar</strong> en cada familia de palabras. El verbo y el predicado siempre están emparejados a propósito, así que toda combinación que salga tiene sentido — el idioma se conjuga solo según quién sea el sujeto.</p>
      <${SentenceSlot} title="🍳 Familia 1: Comida"
        subjects=${['I', 'My mother', 'We', 'Daniela']}
        pairs=${[['eat', 'breakfast at 8:00 AM'], ['cook', 'lunch for the family'], ['prepare', 'dinner in the evening']]} />
      <${SentenceSlot} title="💼 Familia 2: Oficina y Estudio"
        subjects=${['I', 'My boss', 'My coworker', 'Carlos']}
        pairs=${[['check', 'important documents'], ['write', 'reports at work'], ['study', 'English on the computer']]} />
      <${SentenceSlot} title="🏠 Familia 3: Hogar y Descanso"
        subjects=${['I', 'My brother', 'They', 'Daniela']}
        pairs=${[['clean', 'the house in the afternoon'], ['read', 'a book before bed'], ['watch', 'a video at night']]} />
      <${Check}>Combiné al menos 3 oraciones distintas en cada familia.<//>
    <//>

    <${Section} title="🔍 Identifica las Partes" tag="Actividad interactiva">
      <p>Haz clic en la palabra o frase correcta según lo que se te pide:</p>
      <${PartsQuiz} label="Oración 1" hints
        parts=${[['subject', 'My mother'], ['verb', 'cooks'], ['complement', 'dinner in the evening']]} />
      <${PartsQuiz} label="Oración 2"
        parts=${[['subject', 'My boss'], ['verb', 'checks'], ['complement', 'reports at work']]} />
      <${PartsQuiz} label="Oración 3"
        note='Recuerda: el sujeto también puede ser el nombre de una persona, no solo "I", "She" o "My mother".'
        parts=${[['subject', 'Daniela'], ['verb', 'writes'], ['complement', 'an email every morning']]} />
    <//>

    <${Pause} title="☕ Pausa Activa" minutes=${10}>
      Toma agua, estírate o descansa la vista antes de escribir.
      <${Check} centered>Descanso completado. ¡Continuamos!<//>
    <//>

    <${Section} title="✍️ Mi Rutina Diaria: Taller de Escritura" minutes=${5}>
      <p><strong>Reto:</strong> Describe your daily routine. Write 5 complete sentences about your daily activities from morning to night using subjects, verbs, complements, and connectors.</p>
      <${Timer} minutes=${5} />
      <${WritingCheck} placeholder="Escribe aquí tu borrador de 5 oraciones..."
        connectors=${['first', 'then', 'next', 'after that', 'finally']}
        verbs=${['wake up', 'eat', 'cook', 'clean', 'study', 'work', 'read', 'sleep', 'check', 'write']} />
      <${Check}>Escribí mis 5 oraciones y revisé mi borrador.<//>
    <//>

    <${Section} title="📖 Ahora te toca leer a ti" tag="Comprensión lectora">
      <p>Lee el siguiente texto sobre la rutina de Daniela y responde las preguntas. Al final podrás revelar dónde están los sujetos, verbos, predicados y conectores.</p>
      <${StructuredReading} parts=${READING}>
        <${Choice} question="Pregunta 1: ¿Qué hace Daniela inmediatamente después de tomar la ducha?"
          options=${['A) Revisa sus correos electrónicos.', 'B) Come un desayuno rápido.']} answer=${1} />
        <${Choice} question="Pregunta 2: ¿Para quién escribe reportes Daniela?"
          options=${['A) Para su jefe.', 'B) Para su hermano.']} answer=${0} />
        <${Choice} question="Pregunta 3: ¿A dónde va Daniela después de desayunar?"
          options=${['A) A la oficina.', 'B) A dormir.']} answer=${0} />
        <${Choice} question="Pregunta 4: ¿Qué hace Daniela al final del día, antes de dormir?"
          options=${['A) Revisa sus correos electrónicos.', 'B) Lee un libro.']} answer=${1} />
        <${Choice} question="Pregunta 5: ¿Qué conector marca la última acción de su rutina?"
          options=${['A) Then', 'B) Finally']} answer=${1} />
      <//>
      <${Check}>Respondí las preguntas y revisé la estructura del texto.<//>
    <//>

    <${StepsGuide} title="🗺️ Guía Fácil para Escribir" steps=${[
      { title: 'Paso 1: Planifica en español', body: 'Anota qué haces primero, qué haces después y qué haces al final.' },
      { title: 'Paso 2: Oraciones simples', body: html`Arma cada idea en inglés: <${Hl} t="subject">Persona<//> + <${Hl} t="verb">Acción<//> + <${Hl} t="complement">Detalle<//>.` },
      { title: 'Paso 3: Une con conectores', body: html`Junta tus oraciones con <${Hl} t="connector">First<//>, <${Hl} t="connector">Then<//>, <${Hl} t="connector">Next<//>, <${Hl} t="connector">After that<//>, <${Hl} t="connector">Finally<//>.` },
    ]} />

    <${Section} title="🎯 Cierre y Metas de Progreso">
      <${Goals}
        claseTitulo="Meta de la Clase de Hoy (Verificación)"
        clase="Construí oraciones simples (Sujeto + Verbo + Predicado) sin omitir el verbo, usando la máquina de combinar y la actividad de identificación."
        semanaTitulo="Meta Semanal de Vocabulario Real (Miércoles a Miércoles)"
        semana="Analizar diariamente mi jornada laboral y familiar para identificar 3 palabras o personas de mi entorno real (ej. document, office, my boss) y buscar su equivalente en inglés, anotándolas en mi libreta."
        mesTitulo="Meta General del Mes (BYU–Pathway)"
        mes="Completar 8 sesiones de estudio asistido y 24 actividades autónomas en 4 semanas, avanzando de forma progresiva hacia el examen ELA." />
      <${Check}>Clase 2 completada y metas acordadas para la semana.<//>
    <//>
  `;
}
