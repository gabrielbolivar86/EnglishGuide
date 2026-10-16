// ==========================================================
// BLOQUES PARA ESCRIBIR LECCIONES
// En students/<slug>/lessons/<id>.js:
//   import { html, LessonHeader, Section, Vocab, ... } from '../../../src/components/lesson/index.js';
//   export default function Lesson() { return html`...`; }
// ==========================================================
export { html } from '../../lib/preact.js';
export { LessonHeader, Section, Block, Pause, ExtraBanner } from './Layout.js';
export { Hl, ColorLegend, Formula, GRAMMAR } from './Grammar.js';
export { Vocab, VocabColumns, Reading, Example, Exercise, Goals, ClassGoal, Tip, StepsGuide, Instruction, RuleCards, Compare } from './Content.js';
export { Check, WriteLine, WriteBox, WordPicker, Choice, RadioQuestion } from './Interactive.js';
export { SentenceSlot, PartsQuiz, Timer, WritingCheck, WritingGoals, StructuredReading, conjugate } from './Activities.js';
