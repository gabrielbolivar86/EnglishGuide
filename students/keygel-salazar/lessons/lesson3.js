// Lección 3 — Keygel Salazar (Semana 2, Clase 1)
// Connecting Ideas and Daily Actions: because, so, also + 3ª persona + a/an/my/the/to
import {
  html, LessonHeader, Section, Pause, Hl, ColorLegend, VocabColumns, Tip, ClassGoal,
  Goals, Check, Choice, Exercise, Instruction, RuleCards, Compare, Timer, WritingGoals, StructuredReading,
} from '../../../src/components/lesson/index.js';

const READING = [
  ['subject', 'Karen'], ' ', ['verb', 'has'], ' ', ['preposition', 'a'], ' ', ['complement', 'busy routine'], '. ',
  ['connector', 'First'], ', ', ['subject', 'she'], ' ', ['verb', 'gets ready'], ' ', ['preposition', 'to'], ' ', ['verb', 'go'], ' ', ['preposition', 'to'], ' ', ['complement', 'work at 7:30 AM'], '. ',
  ['subject', 'She'], ' ', ['verb', 'prepares'], ' ', ['preposition', 'a'], ' ', ['complement', 'quick breakfast'], ' ', ['connector', 'because'], ' ', ['subject', 'she'], ' ', ['verb', 'leaves'], ' ', ['complement', 'early'], '. ',
  'At ', ['preposition', 'the'], ' office, ', ['subject', 'she'], ' ', ['verb', 'checks'], ' ', ['complement', 'important documents'], ', ', ['connector', 'and'], ' ', ['subject', 'she'], ' ', ['connector', 'also'], ' ', ['verb', 'writes'], ' ', ['complement', 'emails'], '. ',
  ['subject', 'She'], ' ', ['verb', 'works'], ' ', ['complement', 'fast'], ', ', ['connector', 'so'], ' ', ['subject', 'she'], ' ', ['verb', 'finishes'], ' ', ['complement', 'all her tasks before 5:00 PM'], '.',
];

const OK = '✔ Excellent! You identified the correct words.';

export default function Lesson3() {
  return html`
    <${LessonHeader}
      title="Lesson 3: Connecting Ideas and Daily Actions"
      subtitle="Cause, addition, articles, and third-person verb rules in Present Simple" />

    <${ClassGoal}>Construir 6 oraciones compuestas en Presente Simple usando adecuadamente because, so y also, aplicando las reglas de 3ª persona (-s, -es, -ies) y seleccionando correctamente a/an, my, the y to.<//>

    <${Section} title="🎨 Today's Colors and Connectors" minutes=${10}>
      <p>Hoy sumamos un quinto color para las palabras pequeñas que conectan y señalan cosas:</p>
      <${ColorLegend} items=${['subject', 'verb', 'complement', 'connector', 'preposition']} labels=${{
        subject: 'Sujeto (¿Quién?)', verb: 'Verbo (Acción)', complement: 'Complemento (Detalle)',
        connector: 'Conector', preposition: 'Preposición / Artículo (nuevo)',
      }} />

      <${VocabColumns} columns=${[
        { title: 'Conectores (Repaso)', t: 'connector', items: ['and = y', 'first = primero', 'then = luego'] },
        { title: 'Conectores Nuevos', t: 'connector', items: ['because = porque', 'so = así que / por eso', 'also = también'] },
        { title: 'Palabras Pequeñas', t: 'preposition', items: ['a / an = un, una', 'the = el, la, los, las', 'my = mi, mis', 'to = a / para'] },
      ]} />

      <${Tip} title="🔗 ¿Cómo funcionan because, so y also?">
        <strong>because</strong> presenta la <em>causa</em> (el porqué):<br />
        <${Hl} t="subject">I<//> <${Hl} t="verb">eat<//> <${Hl} t="complement">a quick breakfast<//> <${Hl} t="connector">because<//> <${Hl} t="subject">I<//> <${Hl} t="verb">leave<//> <${Hl} t="complement">early<//>.
        <br /><br />
        <strong>so</strong> presenta el <em>resultado</em> (lo que pasa por eso):<br />
        <${Hl} t="subject">I<//> <${Hl} t="verb">leave<//> <${Hl} t="complement">early<//>, <${Hl} t="connector">so<//> <${Hl} t="subject">I<//> <${Hl} t="verb">eat<//> <${Hl} t="complement">a quick breakfast<//>.
        <br /><br />
        <strong>also</strong> <em>agrega</em> otra acción y va <strong>antes del verbo</strong>:<br />
        <${Hl} t="subject">She<//> <${Hl} t="verb">checks<//> <${Hl} t="complement">documents<//>, <${Hl} t="connector">and<//> <${Hl} t="subject">she<//> <${Hl} t="connector">also<//> <${Hl} t="verb">writes<//> <${Hl} t="complement">emails<//>.
      <//>
    <//>

    <${Section} title="✏️ When Does the Verb Change?" minutes=${15}>
      <p>Con <strong>he</strong>, <strong>she</strong>, <strong>it</strong> o una sola persona (<em>my boss, Karen, my mother</em>) el verbo cambia su final. Hay 4 reglas:</p>
      <${RuleCards} rules=${[
        { title: '1. Regla general: +s', when: 'La mayoría de los verbos', examples: [['cook', 'cooks'], ['work', 'works']] },
        { title: '2. Sonidos fuertes: +es', when: 'Terminan en -ch, -sh, -s, -x, -z, -o', examples: [['watch', 'watches'], ['brush', 'brushes'], ['go', 'goes']] },
        { title: '3. Consonante + y: -ies', when: 'La "y" se cambia por "ies"', examples: [['study', 'studies'], ['carry', 'carries']] },
        { title: '4. Vocal + y: +s', when: 'La "y" se queda igual', examples: [['pray', 'prays'], ['play', 'plays']] },
      ]} />
      <div class="formula-box">
        <${Hl} t="subject">My coworker<//> <${Hl} t="verb">studies<//> <${Hl} t="complement">English<//>
        <${Hl} t="connector">because<//> <${Hl} t="subject">she<//> <${Hl} t="verb">wants<//> <${Hl} t="preposition">to<//> <${Hl} t="verb">travel<//>.
      </div>
    <//>

    <${Section} title="🧠 Natural English vs. Literal Translation" minutes=${10}>
      <p>Algunas frases no se traducen palabra por palabra desde el español:</p>
      <${Compare} title='"Voy al trabajo"'
        left=${{ label: '✖ Literal', body: html`I go to <s>the</s> work.` }}
        right=${{ label: '✔ Natural',
          body: html`<${Hl} t="subject">I<//> <${Hl} t="verb">go<//> <${Hl} t="preposition">to<//> <${Hl} t="complement">work<//>.`,
          note: 'Lugares de rutina fija (work, school, bed) no llevan "the".' }} />
      <${Compare} title='"Cocina y limpia"'
        left=${{ label: '✖ Confusión común', body: html`She cooks <s>an</s> cleans.` }}
        right=${{ label: '✔ Natural',
          body: html`<${Hl} t="subject">She<//> <${Hl} t="verb">cooks<//> <${Hl} t="connector">and<//> <${Hl} t="verb">cleans<//>.`,
          note: html`<strong>and</strong> une acciones. <strong>an</strong> va solo antes de una cosa que empieza con sonido de vocal: <em>an apple, an email</em>.` }} />
      <${Compare} title='Los dos usos de "to"' variant="pair"
        left=${{ label: '📍 Destino (a dónde)', body: html`<${Hl} t="subject">I<//> <${Hl} t="verb">go<//> <${Hl} t="preposition">to<//> <${Hl} t="complement">the office<//>.` }}
        right=${{ label: '⚙️ Antes de otro verbo', body: html`<${Hl} t="subject">I<//> <${Hl} t="verb">get ready<//> <${Hl} t="preposition">to<//> <${Hl} t="verb">go<//>.` }} />

      <${Tip} title="⚡ Nuance Box: Quick vs. Fast">
        <strong>Quick</strong> = dura poco tiempo → I take <strong>a quick shower</strong>. <em>(una ducha corta)</em><br />
        <strong>Fast</strong> = alta velocidad → He <strong>walks fast</strong>. <em>(camina rápido)</em>
      <//>
    <//>

    <${Section} title="🔍 Small Words Challenge" tag="Actividad interactiva">
      <${Instruction} es="Selecciona la opción correcta para completar cada oración.">Select the correct option to complete each sentence.<//>
      <${Exercise}>
        <${Choice} inline success=${OK} question='1. "I get ready _____ go _____ work at 7:00 AM."'
          options=${['to / to', 'an / to', 'to / the']} answer=${0}
          hints=${['', 'Después de otro verbo usamos "to" (get ready to go). "an" no puede ir antes de un verbo.', 'Casi: el primer espacio está bien, pero "go to work" no lleva "the" porque es una rutina fija.']} />
      <//>
      <${Exercise}>
        <${Choice} inline success=${OK} question='2. "My mother prepares _____ apple and drinks tea in _____ kitchen."'
          options=${['a / my', 'an / the', 'and / a']} answer=${1}
          hints=${['¿Cómo empieza la palabra "apple"? Si empieza con sonido de vocal, usamos "an", no "a".', '', '"and" une acciones, no va antes de una cosa. Antes de "apple" necesitamos un artículo.']} />
      <//>
      <${Exercise}>
        <${Choice} inline success=${OK} question='3. "He cooks dinner _____ cleans the house every evening."'
          options=${['an', 'and', 'to']} answer=${1}
          hints=${['Suenan parecido, pero "an" es un artículo. Para unir dos acciones (cooks + cleans) usamos "and".', '', '"to" va antes de un verbo en su forma base (to clean). Aquí "cleans" ya está conjugado: necesitamos unir dos acciones.']} />
      <//>
      <${Exercise}>
        <${Choice} inline success=${OK} question='4. "I visit _____ boss _____ ask about the new project."'
          options=${['my / and', 'the / an', 'to / so']} answer=${0}
          hints=${['', 'Revisa el segundo espacio: "an" no puede unir dos acciones (visit + ask). ¿Qué palabra significa "y"?', '¿De quién es el jefe? Necesitamos una palabra que indique dueño ("my"). Además, "so" indica resultado, no suma acciones.']} />
      <//>
    <//>

    <${Section} title="🔗 Verbs and Connectors Challenge" tag="Actividad interactiva">
      <${Instruction} es="Completa las oraciones compuestas con la forma verbal y conectores correctos.">Complete the compound sentences with the correct verb forms and connectors.<//>
      <${Exercise}>
        <${Choice} inline success=${OK} question='1. "Karen _____ a quick breakfast _____ she leaves early."'
          options=${['cook / so', 'cooks / because', 'cooks / also']} answer=${1}
          hints=${['"Karen" es una sola persona (she): el verbo necesita -s. Y "sale temprano" es la causa, no el resultado.', '', 'El verbo está bien. Pero "sale temprano" explica por qué desayuna rápido: ¿qué conector presenta una causa?']} />
      <//>
      <${Exercise}>
        <${Choice} inline success=${OK} question='2. "David works fast, _____ he finishes his tasks, and he _____ writes reports."'
          options=${['so / also', 'because / also', 'so / an']} answer=${0}
          hints=${['', 'Terminar sus tareas es el resultado de trabajar rápido, no la causa. ¿Qué conector presenta un resultado?', 'El primer espacio está bien. Pero "an" es un artículo y no puede ir antes de un verbo. ¿Qué palabra significa "también"?']} />
      <//>
      <${Exercise}>
        <${Choice} inline success=${OK} question='3. "My coworker _____ his desk, and he also _____ emails."'
          options=${['clean / check', 'cleans / checks', 'cleans / check']} answer=${1}
          hints=${['"My coworker" y "he" son tercera persona: los dos verbos necesitan -s.', '', 'El primero está bien. Pero después de "he also" el verbo sigue en tercera persona: ¿le falta algo a "check"?']} />
      <//>
      <${Exercise}>
        <${Choice} inline success=${OK} question='4. "She takes a quick shower _____ she wants _____ arrive on time."'
          options=${['so / to', 'because / to', 'because / the']} answer=${1}
          hints=${['Llegar a tiempo es la razón de la ducha corta. ¿Qué conector explica el porqué?', '', 'El conector está bien. Pero entre dos verbos (wants + arrive) usamos "to", no "the".']} />
      <//>
    <//>

    <${Pause} title="☕ Pausa Activa" minutes=${10}>
      Toma agua, estírate y descansa la vista mirando algo lejano antes de leer.
      <${Check} centered>Descanso completado. ¡Continuamos!<//>
    <//>

    <${Section} title="📖 Read Like the ELA Test" tag="Comprensión lectora">
      <${Instruction} es="Lee el texto atentamente y responde las preguntas de opción múltiple.">Read the text carefully and answer the multiple-choice questions below.<//>
      <${StructuredReading} parts=${READING}>
        <${Choice} question="Question 1: Why does Karen prepare a quick breakfast?"
          options=${['A) Because she stays at home.', 'B) Because she leaves early for work.', "C) Because she doesn't cook."]} answer=${1}
          error="✖ Not quite. Busca el conector because en el texto y vuelve a intentarlo." />
        <${Choice} question="Question 2: What does Karen do at the office in addition to checking documents?"
          options=${['A) She cooks lunch.', 'B) She also writes emails.', 'C) She takes a nap.']} answer=${1}
          error="✖ Not quite. Busca el conector also en el texto y vuelve a intentarlo." />
        <${Choice} question="Question 3: What is the result of Karen working fast?"
          options=${['A) She finishes all her tasks before 5:00 PM.', 'B) She goes home at 8:00 PM.', 'C) She reads a book at the office.']} answer=${0}
          error="✖ Not quite. Busca el conector so en el texto y vuelve a intentarlo." />
      <//>
      <${Check}>Respondí las preguntas y encontré because, so y also en el texto.<//>
    <//>

    <${Section} title="✍️ Your Turn: 6 Connected Sentences" minutes=${5}>
      <${Instruction} es="Escribe 6 oraciones sobre tu día. Usa because, so y also al menos dos veces cada uno.">Write 6 sentences about your day. Use because, so, and also at least two times each.<//>
      <p><strong>Ejemplo:</strong> <${Hl} t="subject">My boss<//> <${Hl} t="verb">checks<//> <${Hl} t="complement">reports<//> <${Hl} t="connector">because<//> <${Hl} t="subject">he<//> <${Hl} t="verb">wants<//> <${Hl} t="preposition">to<//> <${Hl} t="verb">finish<//> <${Hl} t="complement">early<//>.</p>
      <${Timer} minutes=${5} />
      <${WritingGoals} placeholder="Escribe aquí tus 6 oraciones..."
        sentences=${6} targets=${{ because: 2, so: 2, also: 2 }}
        checks=${[
          { pattern: /\b(go|goes) to the (work|school|bed)\b/g, tip: 'Revisa "go to the work": las rutinas fijas no llevan "the" → go to work.' },
          { pattern: /\ba [aeiou]\w*/g, tip: (m) => `Revisa: ${m.join(', ')}. Antes de sonido de vocal usamos "an".` },
        ]}
        note="Recuerda revisar tú misma la -s / -es / -ies de cada verbo con he, she o un nombre." />
      <${Check}>Escribí mis 6 oraciones y revisé mi borrador.<//>
    <//>

    <${Section} title="🎯 Cierre y Metas de Progreso">
      <${Tip} title="💡 How today's lesson helps you in the Pathway ELA Test">
        <strong>Reading:</strong> Reconocer <${Hl} t="connector">because<//>, <${Hl} t="connector">so<//> y <${Hl} t="connector">also<//> te ayuda a identificar rápidamente causa, resultado y detalles adicionales en el texto.
        <br /><br />
        <strong>Writing:</strong> Usar correctamente la 3ª persona (-s, -es, -ies) y evitar la traducción literal del español aumenta tu precisión gramatical en el ensayo de 5 minutos.
      <//>

      <p><strong>✅ Autoevaluación</strong></p>
      <${Check}>Identifico las reglas para agregar -s, -es e -ies a los verbos.<//>
      <${Check}>Distingo entre a, an, and, my y the.<//>
      <${Check}>Conecto oraciones compuestas usando because, so y also.<//>

      <div class="mt"></div>
      <${Goals}
        claseTitulo="Meta de la Clase de Hoy (Verificación)"
        clase="Construí 6 oraciones compuestas en Presente Simple con because, so y also, aplicando la 3ª persona y eligiendo bien a/an, my, the y to."
        semanaTitulo="Meta Semanal (Miércoles a Miércoles)"
        semana="Anotar diariamente en mi libreta 2 oraciones compuestas en Presente Simple sobre personas de mi entorno, usando la 3ª persona y los conectores because, so o also."
        mesTitulo="Meta General del Mes (BYU–Pathway)"
        mes="Completar 8 sesiones de estudio asistido y 24 actividades autónomas en 4 semanas, avanzando de forma progresiva hacia el examen ELA." />
      <${Check}>Clase 3 completada y metas acordadas para la semana.<//>
    <//>
  `;
}
