type Demonstration = {
  id: string
  name: string
  muscleGroup: string
  instructions: readonly [string, string]
  techniqueTip: string
  alternative?: string
  note?: string
  imageNote?: string
}

function movement(demonstration: Demonstration) {
  return {
    ...demonstration,
    images: [1, 2].map((frame) => `/ejercicios/${demonstration.id}-${frame}.webp`),
  }
}

const femoral = movement({
  id: 'femoral', name: 'Curl femoral en máquina', muscleGroup: 'Isquiotibiales',
  instructions: ['Ajusta el rodillo para que apoye justo encima de los talones.', 'Flexiona las rodillas y vuelve despacio a la posición inicial.'],
  techniqueTip: 'Mantén la cadera apoyada durante toda la repetición.',
})

const abduccion = movement({
  id: 'abduccion', name: 'Abducción de cadera en máquina', muscleGroup: 'Glúteo medio y abductores',
  instructions: ['Siéntate con la espalda apoyada y las almohadillas por fuera de las rodillas.', 'Abre las piernas con control y regresa lentamente.'],
  techniqueTip: 'Evita los rebotes y elige una carga que te permita mantener el torso quieto.',
})

function prescribe(demonstration: ReturnType<typeof movement>, sets: number, reps: string, rir: '2–3' | '3' = '2–3', perLeg = false) {
  return { ...demonstration, sets, reps, rir, perLeg }
}

export type Exercise = ReturnType<typeof prescribe>
export type Cardio = {
  icon: 'walk' | 'bike'
  title: string
  duration: string
  notes: readonly string[]
}

type Workout = {
  kind: 'workout'
  id: string
  title: string
  dayOfWeek: number
  focus: string
  muscleGroups: string[]
  exercises: Exercise[]
  cardio?: Cardio
  cardioNote?: string
}

type Rest = {
  kind: 'rest'
  id: string
  title: string
  dayOfWeek: number
  summary: string
  cardio?: Cardio
}

export type TrainingDay = Workout | Rest

export const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const

export const week: readonly TrainingDay[] = [
  {
    kind: 'workout', id: 'upper-a', title: 'Upper A', dayOfWeek: 0,
    focus: 'Espalda y tren superior', muscleGroups: ['Espalda', 'Pecho', 'Hombros', 'Brazos'],
    exercises: [
      prescribe(movement({
        id: 'jalon-pronado', name: 'Jalón al pecho en polea', muscleGroup: 'Dorsales / espalda',
        instructions: ['Sujeta la barra con las palmas hacia delante y un agarre cómodo.', 'Baja los hombros y lleva la barra hacia la parte alta del pecho.'],
        techniqueTip: 'Mantén el torso estable y resiste la subida de la barra.',
        alternative: 'Dominadas asistidas, si ya dominas la técnica.',
      }), 3, '8–12'),
      prescribe(movement({
        id: 'press-maquina', name: 'Press de pecho en máquina', muscleGroup: 'Pecho / tríceps',
        instructions: ['Ajusta el asiento para que las asas queden a la altura del pecho.', 'Empuja con la espalda apoyada y vuelve lentamente.'],
        techniqueTip: 'Evita bloquear los codos con fuerza al final.',
        alternative: 'Press de banca con mancuernas, si ya tienes buena técnica.',
      }), 2, '8–12'),
      prescribe(movement({
        id: 'remo-apoyado', name: 'Remo con pecho apoyado', muscleGroup: 'Espalda media',
        instructions: ['Apoya el pecho en la máquina o en un banco inclinado.', 'Lleva los codos hacia atrás y baja despacio.'],
        techniqueTip: 'Mantén el pecho en contacto con el apoyo y evita impulsarte.',
      }), 3, '8–12'),
      prescribe(movement({
        id: 'laterales', name: 'Elevaciones laterales con mancuernas', muscleGroup: 'Hombro lateral',
        instructions: ['Empieza con los brazos a los lados y los codos un poco flexionados.', 'Eleva las mancuernas hacia los lados y bájalas con control.'],
        techniqueTip: 'Evita encoger los hombros o balancear el cuerpo.',
      }), 2, '12–15'),
      prescribe(movement({
        id: 'curl-biceps', name: 'Curl de bíceps con mancuernas o polea', muscleGroup: 'Bíceps',
        instructions: ['Coloca los codos junto al cuerpo.', 'Flexiona los codos para subir el peso y baja despacio.'],
        techniqueTip: 'Mantén los codos estables y el torso quieto.',
      }), 2, '10–15'),
      prescribe(movement({
        id: 'triceps-cuerda', name: 'Extensión de tríceps en polea con cuerda', muscleGroup: 'Tríceps',
        instructions: ['Sujeta la cuerda de una polea alta con los codos cerca del cuerpo.', 'Extiende los codos hacia abajo y deja que vuelvan a flexionarse con control.'],
        techniqueTip: 'Mantén el tronco quieto durante toda la repetición.',
      }), 2, '10–15'),
    ],
    cardio: { icon: 'walk', title: 'Caminadora', duration: '15 min', notes: [
      'Camina a un ritmo moderado, sin correr. Deberías poder hablar en frases y cantar con dificultad.',
      'Si te resulta cómodo, usa una inclinación del 2–5 %. Ajusta el ritmo y la inclinación para caminar sin sujetarte de las barras.',
    ] },
  },
  {
    kind: 'workout', id: 'lower-a', title: 'Lower A', dayOfWeek: 1,
    focus: 'Glúteos y cuádriceps', muscleGroups: ['Glúteos', 'Cuádriceps', 'Isquiotibiales', 'Pantorrillas'],
    exercises: [
      prescribe(movement({
        id: 'hip-thrust', name: 'Hip thrust en máquina o con barra', muscleGroup: 'Glúteos',
        instructions: ['Coloca ambos pies firmes en el suelo y usa una barra acolchada si eliges esa versión.', 'Empuja desde los pies para extender la cadera y baja con control.'],
        techniqueTip: 'Termina el movimiento con la cadera extendida y la zona lumbar sin arquear.',
        alternative: 'Puente de glúteos con mancuerna si te resulta más fácil de aprender.',
      }), 3, '8–12'),
      prescribe(movement({
        id: 'goblet', name: 'Sentadilla goblet con mancuerna', muscleGroup: 'Cuádriceps y glúteos',
        instructions: ['Sostén la mancuerna cerca del pecho con ambas manos.', 'Flexiona caderas y rodillas hasta una profundidad que controles y vuelve a subir.'],
        techniqueTip: 'Mantén toda la planta del pie apoyada.',
        alternative: 'Sentadilla en máquina Smith con supervisión de un entrenador.',
      }), 3, '8–12'),
      prescribe(movement({
        id: 'bulgara', name: 'Sentadilla búlgara con apoyo', muscleGroup: 'Glúteos y cuádriceps',
        instructions: ['Coloca el pie trasero en un banco y adelanta el otro a una distancia cómoda.', 'Flexiona la pierna delantera despacio y empuja el suelo para volver a subir.'],
        techniqueTip: 'Usa un soporte fijo con una mano si necesitas ayuda para equilibrarte.',
        alternative: 'Zancada hacia atrás asistida.',
        imageNote: 'La foto muestra cómo colocar el pie trasero. Puedes practicar sin mancuernas y usar un apoyo fijo.',
      }), 2, '8–10', '3', true),
      prescribe({ ...femoral, name: 'Curl femoral sentado o acostado en máquina' }, 2, '10–15'),
      prescribe(abduccion, 2, '12–20'),
      prescribe(movement({
        id: 'pantorrillas', name: 'Elevaciones de pantorrillas en máquina', muscleGroup: 'Pantorrillas',
        instructions: ['Apoya la parte delantera de los pies en la plataforma.', 'Eleva los talones y vuelve a bajarlos despacio.'],
        techniqueTip: 'Usa un recorrido cómodo y evita rebotar abajo.',
      }), 2, '12–15'),
    ],
    cardioNote: 'Sin cardio adicional obligatorio. Puedes caminar a un ritmo tranquilo durante el día.',
  },
  {
    kind: 'rest', id: 'miercoles', title: 'Descanso', dayOfWeek: 2,
    summary: 'Tómate el día para descansar o sal a caminar a ritmo suave si tienes energía.',
    cardio: { icon: 'walk', title: 'Caminata suave', duration: '20–30 min', notes: [
      'Mantén una intensidad ligera. Si estás muy cansada, puedes descansar por completo.',
    ] },
  },
  {
    kind: 'workout', id: 'upper-b', title: 'Upper B', dayOfWeek: 3,
    focus: 'Espalda y tren superior', muscleGroups: ['Espalda', 'Pecho', 'Hombros', 'Brazos'],
    exercises: [
      prescribe(movement({
        id: 'remo-polea', name: 'Remo sentado en polea con agarre neutro', muscleGroup: 'Espalda media / dorsales',
        instructions: ['Apoya los pies y sujeta el asa con las palmas enfrentadas.', 'Tira del asa hacia el torso y extiende los brazos con control.'],
        techniqueTip: 'Mantén el torso estable y mueve los codos sin impulsarte con la zona lumbar.',
      }), 3, '8–12'),
      prescribe(movement({
        id: 'press-inclinado', name: 'Press inclinado con mancuernas o máquina', muscleGroup: 'Pecho superior / hombro anterior',
        instructions: ['Ajusta el respaldo a una inclinación moderada.', 'Empuja el peso hacia arriba y vuelve a bajarlo con control.'],
        techniqueTip: 'Mantén la espalda en el banco durante el descenso.',
      }), 2, '8–12'),
      prescribe(movement({
        id: 'jalon-neutro', name: 'Jalón al pecho con agarre neutro', muscleGroup: 'Dorsales / espalda',
        instructions: ['Ajusta el apoyo de los muslos y toma el asa con las palmas enfrentadas.', 'Lleva los codos hacia el torso y deja subir el asa lentamente.'],
        techniqueTip: 'Mantén los hombros lejos de las orejas.',
      }), 3, '10–12'),
      prescribe(movement({
        id: 'face-pull', name: 'Face pull en polea', muscleGroup: 'Deltoides posterior / espalda superior',
        instructions: ['Coloca la cuerda a la altura de la cara y da un paso atrás.', 'Tira hacia la cara, separando los extremos de la cuerda, y vuelve despacio.'],
        techniqueTip: 'Mantén el tronco estable y evita arquear la espalda.',
        alternative: 'Pájaros en máquina (reverse pec deck).',
      }), 2, '12–15'),
      prescribe(movement({
        id: 'martillo', name: 'Curl martillo con mancuernas', muscleGroup: 'Bíceps / braquial',
        instructions: ['Sostén las mancuernas con las palmas enfrentadas.', 'Flexiona los codos y vuelve a bajar las mancuernas despacio.'],
        techniqueTip: 'Conserva las muñecas neutras y evita balancear el cuerpo.',
      }), 2, '10–15'),
      prescribe(movement({
        id: 'triceps-alto', name: 'Extensión de tríceps en polea por encima de la cabeza', muscleGroup: 'Tríceps',
        instructions: ['Ponte de espaldas a la polea y sujeta la cuerda cerca de la cabeza.', 'Extiende los codos al frente y flexiónalos despacio al volver.'],
        techniqueTip: 'Mantén el tronco estable y los brazos superiores quietos.',
        alternative: 'Extensión de tríceps con cuerda hacia abajo si esta posición te incomoda.',
      }), 2, '10–15'),
    ],
    cardio: { icon: 'bike', title: 'Bicicleta estática', duration: '15 min', notes: [
      'Pedalea con una resistencia cómoda y una intensidad moderada. Usa un ritmo que te permita conversar. Mantén un ritmo estable, sin sprints ni intervalos intensos.',
    ] },
  },
  {
    kind: 'workout', id: 'lower-b', title: 'Lower B', dayOfWeek: 4,
    focus: 'Glúteos y cadena posterior', muscleGroups: ['Glúteos', 'Isquiotibiales', 'Cuádriceps', 'Abdomen'],
    exercises: [
      prescribe(movement({
        id: 'rumano', name: 'Peso muerto rumano con mancuernas', muscleGroup: 'Glúteos e isquiotibiales',
        instructions: ['Flexiona un poco las rodillas y lleva la cadera hacia atrás con las mancuernas cerca de las piernas.', 'Cuando llegues al punto que puedes controlar, extiende la cadera para volver a ponerte de pie.'],
        techniqueTip: 'Mantén la espalda neutra y detén la bajada antes de perder esa posición.',
        alternative: 'Practica la bisagra con una mancuerna o con una carga más ligera.',
        imageNote: 'La foto muestra la bisagra con mancuernas. Ajusta la profundidad a tu movilidad.',
      }), 3, '8–10', '3'),
      prescribe(movement({
        id: 'prensa', name: 'Prensa de piernas', muscleGroup: 'Cuádriceps y glúteos',
        instructions: ['Apoya los pies por completo en la plataforma.', 'Baja la plataforma con control y empuja hasta volver a la posición inicial.'],
        techniqueTip: 'Limita el recorrido al punto en el que aún puedas mantener la pelvis y la zona lumbar apoyadas.',
      }), 3, '10–12'),
      prescribe(movement({
        id: 'patada', name: 'Patada de glúteo en polea', muscleGroup: 'Glúteos',
        instructions: ['Sujeta la tobillera a la polea baja y apóyate en la máquina.', 'Lleva la pierna hacia atrás desde la cadera y vuelve lentamente.'],
        techniqueTip: 'Mantén la pelvis estable, sin arquear la espalda ni balancearte.',
        alternative: 'Máquina de extensión de cadera, si está disponible.',
      }), 2, '12–15', '2–3', true),
      prescribe(femoral, 2, '10–15'),
      prescribe(abduccion, 2, '12–20'),
      prescribe(movement({
        id: 'crunch', name: 'Crunch en polea', muscleGroup: 'Abdomen',
        instructions: ['Arrodíllate frente a la polea alta y sujeta la cuerda junto a la cabeza.', 'Acerca las costillas a la pelvis y vuelve con control.'],
        techniqueTip: 'Flexiona el tronco y deja que los brazos solo sujeten la cuerda.',
        note: 'Este ejercicio fortalece el abdomen. La pérdida de grasa ocurre de forma general en el cuerpo.',
      }), 2, '10–15'),
    ],
    cardioNote: 'Sin cardio adicional obligatorio.',
  },
  {
    kind: 'rest', id: 'sabado', title: 'Caminata opcional', dayOfWeek: 5,
    summary: 'Si te apetece moverte, puedes salir a caminar o usar la caminadora.',
    cardio: { icon: 'walk', title: 'Caminata rápida', duration: '25–30 min', notes: [
      'Camina a ritmo moderado. Deberías poder conversar y cantar con dificultad. Mantén un paso continuo, sin correr.',
      'Si todavía te estás adaptando, puedes empezar con 15–20 minutos.',
    ] },
  },
  {
    kind: 'rest', id: 'domingo', title: 'Descanso', dayOfWeek: 6,
    summary: 'Dedica el día a recuperarte antes de la próxima sesión.',
  },
]

export const trainingGuide = [
  { title: 'Antes de empezar', body: 'Haz 5 minutos de movimiento suave. Si lo necesitas, añade 1–2 series ligeras para practicar el primer ejercicio principal. Las series de la rutina son de trabajo y se cuentan después del calentamiento.' },
  { title: 'Esfuerzo y RIR', body: 'RIR 2 significa terminar una serie cuando sientes que podrías hacer 2 repeticiones más con buena técnica. Busca RIR 2–3, o RIR 3 en los ejercicios de equilibrio y bisagra indicados. Si todavía te cuesta estimarlo, termina con técnica estable y un esfuerzo controlado, antes del fallo.' },
  { title: 'Pausa entre series', body: 'Descansa 90–150 segundos en ejercicios que mueven varias articulaciones y 60–90 segundos en los de aislamiento. Tómate más tiempo si lo necesitas para recuperar una buena ejecución.' },
  { title: 'Carga y recorrido', body: 'Elige una carga que te permita cumplir el rango de repeticiones y el RIR. Cuando alcances el extremo superior con buena técnica y el RIR indicado, aumenta un poco la carga en sesiones siguientes. Usa un recorrido cómodo y sin dolor articular. Si un movimiento te cuesta, prueba la alternativa indicada y pide supervisión presencial.' },
  { title: 'Primeras 2–4 semanas', body: 'Concéntrate en aprender la técnica. Si una sesión completa te resulta excesiva, empieza con 2 series por ejercicio y aumenta gradualmente al volumen indicado.' },
  { title: 'Cardio', body: 'Haz el cardio después de las pesas. Empieza con 15 minutos el lunes y el jueves, y las caminatas opcionales del miércoles y sábado. Si te recuperas bien, añade 5 minutos por sesión o una caminata en un día cómodo. Como referencia a largo plazo, puedes acercarte a 150 minutos semanales de actividad aeróbica moderada, contando caminatas rápidas cotidianas.' },
] as const
