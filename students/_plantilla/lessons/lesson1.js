// PLANTILLA DE LECCIÓN — copia este archivo como lessonN.js
// Bloques disponibles: ver src/components/lesson/index.js
import {
  html, LessonHeader, Section, Block, Pause, ExtraBanner,
  Hl, ColorLegend, Formula, Vocab, Reading, Example, Exercise, Goals,
  Check, WriteLine, WriteBox, WordPicker, Choice, RadioQuestion,
} from '../../../src/components/lesson/index.js';

export default function Lesson() {
  return html`
    <${LessonHeader} title="Lección 1: Título" subtitle="Subtítulo (90 Minutos)" />

    <${Section} title="📖 Vocabulario de la Clase">
      <${Vocab} items=${[['Word', 'Palabra'], ['Another word', 'Otra palabra']]} />
    <//>

    <${Section} n=${1} title="Teoría" minutes=${15}>
      <${ColorLegend} />
      <${Formula} parts=${['connector', 'subject', 'verb', 'complement']} />
      <p>Ejemplo: <${Hl} t="subject">I<//> <${Hl} t="verb">study<//> <${Hl} t="complement">English<//>.</p>
      <${Check}>¡Entendido!<//>
    <//>

    <${Section} n=${2} title="Práctica" minutes=${30}>
      <${WriteLine} label="1. Escribe una oración:" placeholder="Ej: I wake up at 7:00 AM" />
      <${WriteBox} placeholder="Escribe un párrafo..." />
      <${WordPicker} prompt="Haz clic en el verbo:" options=${['I', 'study', 'English']} answer="study" />
      <${Choice} question="¿Pregunta?" options=${['A) Opción correcta', 'B) Opción incorrecta']} answer=${0} />
    <//>

    <${Pause} minutes=${10} />

    <${Section} n=${4} title="Cierre y Metas" minutes=${10}>
      <${Goals} clase="Meta de la clase." semana="Meta semanal." mes="Meta del mes." />
    <//>
  `;
}
