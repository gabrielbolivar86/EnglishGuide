// Lección 1 — Keygel Salazar
// Fundamentos de Redacción: Estructura de Oraciones y Conectores de Tiempo
import {
  html, LessonHeader, Section, Block, Pause, ExtraBanner,
  Hl, ColorLegend, Formula, Vocab, Reading, Example, Exercise, Goals,
  Check, WriteLine, WriteBox, WordPicker, Choice, RadioQuestion,
} from '../../../src/components/lesson/index.js';

export default function Lesson1() {
  return html`
    <${LessonHeader}
      title="Lección 1: Fundamentos de Redacción"
      subtitle="Estructura de Oraciones y Conectores de Tiempo (90 Minutos)" />

    <${Section} title="📖 Vocabulario de la Clase">
      <p>Antes de la teoría, repasamos el vocabulario de rutina diaria usado en los ejemplos de hoy:</p>
      <${Vocab} items=${[
        ['Wake up', 'Despertarse'],
        ['Take a shower', 'Ducharse / Bañarse'],
        ['Have breakfast', 'Desayunar'],
        ['Study', 'Estudiar'],
      ]} />
    <//>

    <${Block} title="🎨 Guía Visual de Código de Colores">
      <p>Para identificar rápidamente cada elemento gramatical durante la lección:</p>
      <${ColorLegend} />
    <//>

    <${Section} n=${1} title="Teoría Leve: Presente Simple y Conectores" minutes=${15}>
      <p>Estructura básica para construir oraciones breves y claras:</p>
      <${Formula} parts=${['connector', 'subject', 'verb', 'complement']} />
      <h4>Conectores de Orden (Sequence Connectors):</h4>
      <ul>
        <li><${Hl} t="connector">First<//> (Primero) - Inicio de la rutina.</li>
        <li><${Hl} t="connector">Next / Then<//> (Luego / Después) - Acciones intermedias.</li>
        <li><${Hl} t="connector">After that<//> (Después de eso) - Transición.</li>
        <li><${Hl} t="connector">Finally<//> (Finalmente) - Última acción.</li>
      </ul>
      <${Check}>¡Entendido! Domino la estructura teórica y los 5 conectores.<//>
    <//>

    <${Section} n=${2} title="Práctica Guiada: Mi Día en Oraciones" minutes=${30}>
      <p><strong>Paso A (I Do / We Do):</strong> Responde ¿Qué hiciste hoy? Escribe 4 oraciones sueltas en inglés:</p>
      <${WriteLine} label="1. Primera acción del día:" placeholder="Ej: I wake up at 7:00 AM" />
      <${WriteLine} label="2. Segunda acción:" placeholder="Ej: I take a shower" />
      <${WriteLine} label="3. Tercera acción:" placeholder="Ej: I have breakfast" />
      <${WriteLine} label="4. Última acción:" placeholder="Ej: I study English" />

      <p><strong>Paso B (Unión con Conectores):</strong> Une tus oraciones anteriores usando conectores para formar un único párrafo fluido:</p>
      <${Example}>
        <${Hl} t="connector">First<//>, <${Hl} t="subject">I<//> <${Hl} t="verb">wake up<//> <${Hl} t="complement">at 7:00 AM<//>. <${Hl} t="connector">Next<//>, <${Hl} t="subject">I<//> <${Hl} t="verb">take<//> <${Hl} t="complement">a shower<//>. <${Hl} t="connector">After that<//>, <${Hl} t="subject">I<//> <${Hl} t="verb">have<//> <${Hl} t="complement">breakfast<//>. <${Hl} t="connector">Finally<//>, <${Hl} t="subject">I<//> <${Hl} t="verb">study<//> <${Hl} t="complement">English<//>.
      <//>
      <${WriteBox} placeholder="Escribe aquí tu párrafo completo uniendo las oraciones..." />
      <${Check}>Párrafo redactado y verificado con código de colores.<//>
    <//>

    <${Pause} minutes=${10}>
      Momento de descansar la vista, estirarse o tomar agua antes del taller práctico.
      <${Check} centered>Descanso completado. ¡Listos para continuar!<//>
    <//>

    <${Section} n=${4} title="Taller ELA: Lectura y Secuencia de Eventos" minutes=${25}>
      <p>Lee el siguiente texto corto y selecciona el orden correcto de los eventos:</p>
      <${Reading}>
        "Sarah is preparing for her exam. <strong>First</strong>, she organizes her notes on the desk. <strong>Next</strong>, she reads chapters 1 and 2. <strong>After that</strong>, she writes a summary paragraph. <strong>Finally</strong>, she sleeps early to rest."
      <//>
      <${RadioQuestion} name="q1"
        question=${html`<strong>Pregunta:</strong> ¿Qué hace Sarah inmediatamente <em>después</em> de leer los capítulos 1 y 2?`}
        options=${[
          'A) Organiza sus notas en el escritorio.',
          'B) Escribe un párrafo de resumen.',
          'C) Duerme temprano para descansar.',
        ]} />
      <${Check}>Ejercicio resuelto e identificado correctamente.<//>
    <//>

    <${Section} n=${5} title="Cierre y Metas de Progreso" minutes=${10}>
      <p>Para finalizar la lección, repasamos los 3 niveles de metas configurados para garantizar tu éxito hacia BYU–Pathway:</p>
      <${Goals}
        claseTitulo="Meta de esta Clase (Lograda Hoy)"
        clase="Completar un diagrama visual con código de colores e identificar correctamente 5 conectores de secuencia (first, next, then, after that, finally) en un texto corto de lectura."
        semana="Escribir 1 párrafo diario de 4 a 5 oraciones en inglés sobre mis actividades cotidianas usando conectores de secuencia (first, then, after that, finally) de lunes a sábado (6 párrafos en total) en mi libreta para dominar la primera pregunta del examen ELA."
        mesTitulo="Meta General del Mes (BYU–Pathway)"
        mes="Completar 8 sesiones de estudio asistido y 24 actividades autónomas en 4 semanas para responder con confianza el test de práctica de lectura (Reading) y redactar los 2 textos del examen ELA obteniendo una autoevaluación superior al 80% para postular a BYU–Pathway." />
      <${Check}>Clase 1 completada y metas acordadas para la semana.<//>
    <//>

    <${ExtraBanner}>Estos ejercicios no se hicieron durante la clase en vivo. Son material adicional para que Keygel practique por su cuenta cuando quiera reforzar lo aprendido.<//>

    <${Section} title="Extra 1. Identificación Visual de Elementos" tag="Práctica individual" extra>
      <p>Practica identificando cada parte de las oraciones en Presente Simple:</p>
      <${Exercise}>
        <p class="sentence">Oración: <strong>"Then, I eat a healthy breakfast."</strong></p>
        <${WordPicker} prompt=${html`<strong>Paso 1:</strong> Haz clic en el <strong>Conector de Orden</strong>:`}
          options=${['Then', 'I', 'eat', 'a healthy breakfast']} answer="Then" />
        <${WordPicker} prompt=${html`<strong>Paso 2:</strong> Haz clic en el <strong>Sujeto</strong>:`}
          options=${['Then', 'I', 'eat', 'a healthy breakfast']} answer="I" />
        <${WordPicker} prompt=${html`<strong>Paso 3:</strong> Haz clic en el <strong>Verbo</strong>:`}
          options=${['Then', 'I', 'eat', 'a healthy breakfast']} answer="eat" />
      <//>
      <${Exercise}>
        <p class="sentence">Oración: <strong>"First, she drinks a glass of water."</strong></p>
        <${WordPicker} prompt=${html`<strong>Paso 1:</strong> Haz clic en el <strong>Conector de Orden</strong>:`}
          options=${['First', 'she', 'drinks', 'a glass of water']} answer="First" />
      <//>
    <//>

    <${Section} title="Extra 2. Análisis Sintáctico" tag="Práctica individual" extra>
      <p>Demuestra tu dominio reconociendo los componentes de las oraciones:</p>
      <${Exercise}>
        <${WordPicker} prompt=${html`<strong>1. En la oración "Finally, I sleep at 10:00 PM", ¿cuál es el conector?</strong>`}
          options=${['Finally', 'I', 'sleep']} answer="Finally" />
      <//>
      <${Exercise}>
        <${WordPicker} prompt=${html`<strong>2. En la oración "Next, he cleans his bedroom", ¿cuál es el verbo de acción?</strong>`}
          options=${['Next', 'he', 'cleans']} answer="cleans" />
      <//>
    <//>

    <${Section} title="Extra 3. Lectura y Comprensión" tag="Práctica individual" extra>
      <p>Lee la siguiente historia corta formada por 2 párrafos en Presente Simple:</p>
      <${Reading}>
        <p><strong>Paragraph 1:</strong> Everyday, Mark follows a productive routine. <strong>First</strong>, he wakes up at 6:00 AM and drinks a glass of water. <strong>Then</strong>, he prepares a healthy breakfast for his family.</p>
        <p><strong>Paragraph 2:</strong> <strong>After that</strong>, Mark walks to work at 8:00 AM. He works on his computer all morning. <strong>Finally</strong>, he returns home and reads a book before bed.</p>
      <//>
      <${Choice} question="Pregunta 1: ¿Qué hace Mark inmediatamente después de despertarse?"
        options=${['A) Bebe un vaso de agua.', 'B) Camina hacia su trabajo.']} answer=${0} />
      <${Choice} question="Pregunta 2: ¿A qué hora camina Mark hacia su trabajo?"
        options=${['A) A las 6:00 AM.', 'B) A las 8:00 AM.']} answer=${1} />
      <${Check}>Práctica extra de lectura y comprensión completada.<//>
    <//>
  `;
}
