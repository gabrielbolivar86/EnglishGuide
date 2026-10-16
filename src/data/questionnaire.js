// ==========================================================
// CUESTIONARIO DE PERFIL DE APRENDIZAJE — preguntas
// Los IDs (S1_1, S2_3, ...) son fijos: la rúbrica del backend depende de ellos.
// Las secciones 2 y 3 se muestran mezcladas (shuffle) pero se guardan por ID.
// ==========================================================
export const SECCION1 = [
  { id:'S1_1', tipo:'texto', enunciado:'1. Describe una habilidad o área de conocimiento que domines ampliamente. ¿Cómo fue tu proceso de aprendizaje desde cero y qué recurso o método facilitó tu comprensión?',
    ejemplo:'Ejemplos: resolver el cubo Rubik, inglés, matemáticas, alguna materia específica de la universidad, cocina, tocar guitarra, edición de video, un deporte, etc.' },
  { id:'S1_2', tipo:'texto', enunciado:'2. Recuerda una ocasión en la que hayas experimentado dificultades al aprender un tema. ¿Qué aspectos de la explicación o del material resultaron confusos y qué estrategia te ayudó a superar ese obstáculo?',
    ejemplo:'Ejemplos: una materia difícil del colegio o la universidad, un idioma nuevo, un instrumento musical, un software o herramienta técnica, un trámite complicado, etc.' },
  { id:'S1_3', tipo:'texto', enunciado:'3. Si pudieras estructurar una sesión ideal de aprendizaje de 60 minutos, ¿cómo distribuirías el tiempo, qué recursos utilizarías y qué rol esperarías del facilitador?',
    ejemplo:'Piensa en: ¿empezarías con teoría o con la práctica? ¿usarías videos, lecturas, ejercicios? ¿cuánto tiempo de descanso necesitas?' }
];

export const SECCION2 = [
  { id:'S2_1', tipo:'opcion', enunciado:'1. Al abordar un concepto complejo por primera vez, ¿qué recurso prefieres revisar inicialmente?', opciones:{
    a:'Un caso real de aplicación o un problema práctico por resolver.',
    b:'Una secuencia organizada de reglas, pasos e instrucciones explícitas.',
    c:'Un diagrama, mapa conceptual o representación gráfica.' } },
  { id:'S2_2', tipo:'opcion', enunciado:'2. Ante un error en la resolución de un ejercicio, ¿qué tipo de retroalimentación prefieres?', opciones:{
    a:'Recibir una comparación visual clara entre la respuesta correcta e incorrecta.',
    b:'Obtener una explicación inmediata sobre la regla o lógica que originó el fallo.',
    c:'Contar con tiempo para finalizar el intento y detectar la falla de forma autónoma.' } },
  { id:'S2_3', tipo:'opcion', enunciado:'3. Para consolidar la información y no olvidarla a largo plazo, ¿qué método te resulta más natural?', opciones:{
    a:'Reorganizar la información en un esquema sintético o ficha de resumen.',
    b:'Aplicar el concepto en un proyecto práctico o explicárselo a otra persona.',
    c:'Repasar apuntes estructurados y realizar ejercicios de autoevaluación.' } },
  { id:'S2_4', tipo:'opcion', enunciado:'4. ¿Qué aspecto genera mayor fatiga mental durante una sesión de estudio?', opciones:{
    a:'Explicaciones extensas únicamente teóricas o verbales, sin apoyo visual.',
    b:'Exceso de teoría abstracta sin aplicaciones o ejemplos inmediatos.',
    c:'Falta de estructura, cambios imprevistos de tema o ausencia de una agenda clara.' } },
  { id:'S2_5', tipo:'opcion', enunciado:'5. Al tomar apuntes durante una explicación, normalmente sueles...', opciones:{
    a:'Registrar reglas exactas, listas numeradas y definiciones en orden secuencial.',
    b:'Anotar únicamente ejemplos concretos, conceptos clave o situaciones reales.',
    c:'Elaborar esquemas, conectar ideas con flechas o utilizar códigos de color.' } }
];

export const SECCION3 = [
  { id:'S3_1', tipo:'opcion', enunciado:'1. Durante una práctica en vivo sin preparación previa, en caso de experimentar un bloqueo momentáneo, ¿cuál sería la intervención más conveniente?', opciones:{
    a:'Disponer de unos minutos en silencio o por escrito para analizar la respuesta sin presión.',
    b:'Recibir una orientación inicial o resolver el ejercicio de forma guiada en conjunto.',
    c:'Intentar responder directamente en voz alta, priorizando la práctica sobre el margen de error.' } },
  { id:'S3_2', tipo:'opcion', enunciado:'2. Al finalizar una etapa de aprendizaje, ¿qué logro proporcionaría mayor satisfacción?', opciones:{
    a:'Adquirir un procedimiento práctico para resolver tareas de forma rápida, aun con un enfoque teórico limitado.',
    b:'Comprender a fondo la lógica y el funcionamiento del sistema, aunque requiera más tiempo de asimilación.' } },
  { id:'S3_3', tipo:'opcion', enunciado:'3. Al estudiar de forma independiente, ¿cuál es el indicador principal de que un tema ha sido comprendido adecuadamente?', opciones:{
    a:'La capacidad de resolver ejercicios o evaluaciones de prueba sin consultar material de apoyo.',
    b:'La habilidad para explicar el concepto con palabras propias o enseñárselo a otra persona.',
    c:'La percepción de que la regla o lógica del tema es clara y ya no genera dudas conceptuales.' } },
  { id:'S3_4', tipo:'opcion', enunciado:'4. ¿En qué momento del día consideras que dispones de mayor claridad mental para procesar temas complejos?', opciones:{
    a:'Mañana (primeras horas del día).',
    b:'Tarde (bloque vespertino).',
    c:'Noche (bloque nocturno).' } }
];

export const SECTIONS = [
  { titulo: 'Sección 1 · Tu experiencia', preguntas: SECCION1, mezclar: false },
  { titulo: 'Sección 2 · Cómo procesas', preguntas: SECCION2, mezclar: true },
  { titulo: 'Sección 3 · Dinámica de clase', preguntas: SECCION3, mezclar: true },
];

export const ALL_QUESTION_IDS = [...SECCION1, ...SECCION2, ...SECCION3].map((q) => q.id);
