import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowRight, Bike, BookOpen, CalendarDays, ChevronRight, CircleHelp,
  Dumbbell, Footprints, ImageOff, Leaf, X,
} from 'lucide-react'
import { trainingGuide, week, weekdays, type Cardio, type Exercise, type TrainingDay } from './data/workouts'

const colombia = 'America/Bogota'
const weekdayFormat = new Intl.DateTimeFormat('es-CO', { weekday: 'long', timeZone: colombia })
const dateFormat = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: colombia,
})

function getToday(date: Date) {
  return weekdays.findIndex((day) => day.toLowerCase() === weekdayFormat.format(date))
}

function colombianMidnight(now: number) {
  // Colombia uses UTC−5 throughout the year.
  const offset = 5 * 60 * 60 * 1000
  const day = 24 * 60 * 60 * 1000
  return (Math.floor((now - offset) / day) + 1) * day + offset
}

function useColombianDate() {
  const [date, setDate] = useState(() => new Date())

  useEffect(() => {
    let timer: number
    function sync() {
      window.clearTimeout(timer)
      const now = Date.now()
      setDate(new Date(now))
      timer = window.setTimeout(sync, colombianMidnight(now) - now)
    }
    sync()
    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('focus', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return date
}

function ExerciseImage({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <span className="image-fallback" role="img" aria-label={`${alt}. Imagen no disponible`}>
      <ImageOff size={24} aria-hidden="true" />
    </span>
  ) : (
    <img src={src} alt={alt} width={560} height={420} loading={eager ? 'eager' : 'lazy'}
      decoding="async" onError={() => setFailed(true)} />
  )
}

function Prescription({ exercise }: { exercise: Exercise }) {
  return (
    <div className="prescription">
      <span><strong>{exercise.sets}</strong> series <span className="times">×</span> <strong>{exercise.reps}</strong> repeticiones
        {exercise.perLeg && <strong className="per-leg"> por pierna</strong>}
      </span>
      <span className="rir">RIR {exercise.rir}</span>
    </div>
  )
}

function ExerciseCard({ exercise, index, onOpen }: { exercise: Exercise; index: number; onOpen: () => void }) {
  return (
    <li>
      <article className="exercise">
        <div className="thumbnail">
          <ExerciseImage src={exercise.images[0]} alt={`Foto de ${exercise.name.toLowerCase()}`} eager={index < 2} />
        </div>
        <div className="exercise-info">
          <h3>{exercise.name}</h3>
          <p className="muscle">{exercise.muscleGroup}</p>
          <Prescription exercise={exercise} />
          <button type="button" className="exercise-action" onClick={onOpen} aria-haspopup="dialog"
            aria-label={`Ver cómo hacerlo: ${exercise.name}`}>
            Ver cómo hacerlo <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </article>
    </li>
  )
}

function CardioCard({ cardio, optional = false }: { cardio: Cardio; optional?: boolean }) {
  const Icon = cardio.icon === 'bike' ? Bike : Footprints
  return (
    <section className="cardio" aria-label={optional ? 'Actividad opcional' : 'Cardio después de las pesas'}>
      <div className="tile-icon"><Icon size={23} aria-hidden="true" /></div>
      <div>
        <p className="cardio-label">{optional ? 'Actividad opcional' : 'Cardio después de las pesas'}</p>
        <h3>{cardio.title} <span>{cardio.duration}</span></h3>
        {cardio.notes.map((note) => <p className="cardio-note" key={note}>{note}</p>)}
      </div>
    </section>
  )
}

function WorkoutView({ day, onExercise, onHelp }: {
  day: Extract<TrainingDay, { kind: 'workout' }>
  onExercise: (exercise: Exercise) => void
  onHelp: () => void
}) {
  const totalSets = day.exercises.reduce((sum, exercise) => sum + exercise.sets, 0)
  return (
    <>
      <section className="workout-header" aria-labelledby="workout-title">
        <div className="workout-heading">
          <h2 id="workout-title">{day.title}</h2>
          <p>{day.focus}</p>
        </div>
        <div className="workout-summary">
          <div className="totals">
            <span><strong>{day.exercises.length}</strong> ejercicios</span>
            <span><strong>{totalSets}</strong> series de trabajo</span>
          </div>
          <p>{day.muscleGroups.join(' · ')}</p>
        </div>
      </section>
      <section aria-labelledby="exercise-list-title">
        <div className="section-heading">
          <h2 id="exercise-list-title">Ejercicios</h2>
          <button type="button" className="text-button" onClick={onHelp} aria-haspopup="dialog">
            <CircleHelp size={17} aria-hidden="true" /> ¿Qué es RIR?
          </button>
        </div>
        <ol className="exercise-list">
          {day.exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} onOpen={() => onExercise(exercise)} />
          ))}
        </ol>
      </section>
      {day.cardio && <CardioCard cardio={day.cardio} />}
      {day.cardioNote && <p className="cardio-quiet"><Footprints size={20} aria-hidden="true" />{day.cardioNote}</p>}
    </>
  )
}

function RestDay({ day, isToday, onSelect }: {
  day: Extract<TrainingDay, { kind: 'rest' }>
  isToday: boolean
  onSelect: (day: number) => void
}) {
  const upcoming = [...week.slice(day.dayOfWeek + 1), ...week.slice(0, day.dayOfWeek)]
    .find((item) => item.kind === 'workout')!
  const isWalk = day.id === 'sabado'

  return (
    <>
      <section className="rest-hero">
        <div className="tile-icon">{isWalk ? <Footprints size={27} aria-hidden="true" /> : <Leaf size={27} aria-hidden="true" />}</div>
        <h2>{isWalk ? 'Caminata opcional' : isToday ? 'Hoy toca recuperar energía' : 'Día de descanso'}</h2>
        <p>{day.summary}</p>
      </section>
      {day.cardio && <CardioCard cardio={day.cardio} optional />}
      <button className="next-workout" type="button" onClick={() => onSelect(upcoming.dayOfWeek)}>
        <span><span className="cardio-label">Próximo entrenamiento</span>
          <strong>{weekdays[upcoming.dayOfWeek]} · {upcoming.title}</strong>
          <span className="muscle">{upcoming.focus}</span>
        </span>
        <ArrowRight size={22} aria-hidden="true" />
      </button>
    </>
  )
}

function WeekNavigation({ today, selected, onSelect }: {
  today: number; selected: number; onSelect: (day: number) => void
}) {
  return (
    <section aria-label="Días de la semana" className="week-section">
      <div className="week-grid">
        {week.map((day) => (
          <button className="day-button" key={day.id} type="button" aria-pressed={selected === day.dayOfWeek}
            aria-label={`${weekdays[day.dayOfWeek]}, ${day.title}${today === day.dayOfWeek ? ', hoy' : ''}`}
            onClick={() => onSelect(day.dayOfWeek)}>
            <span aria-hidden="true">{weekdays[day.dayOfWeek].slice(0, 3)}</span>
            <span className="day-icon" aria-hidden="true">
              {day.kind === 'workout' ? <Dumbbell size={17} /> : day.cardio ? <Footprints size={17} /> : <Leaf size={17} />}
            </span>
            {today === day.dayOfWeek && <span className="today-dot" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </section>
  )
}

function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current!
    const trigger = document.activeElement
    dialog.showModal()
    return () => {
      dialog.close()
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog ref={ref} className="modal" aria-labelledby="modal-title" onCancel={(event) => {
      event.preventDefault()
      close()
    }} onClick={(event) => {
      if (event.target === event.currentTarget) close()
    }}>
      <div className="modal-content">
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" type="button" onClick={close} aria-label="Cerrar" autoFocus>
            <X size={22} aria-hidden="true" />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}

function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  return (
    <>
      <p className="muscle">{exercise.muscleGroup}</p>
      <Prescription exercise={exercise} />
      <div className="demonstration">
        {exercise.images.map((image, index) => (
          <figure key={image}>
            <ExerciseImage src={image} alt={`${exercise.name}, ${index === 0 ? 'posición inicial' : 'segunda posición'}`} eager />
            <figcaption>{index === 0 ? 'Posición inicial' : 'Durante el movimiento'}</figcaption>
          </figure>
        ))}
      </div>
      {exercise.imageNote && <p className="muscle image-note">{exercise.imageNote}</p>}
      <div className="detail-copy">
        <h3>Cómo hacerlo</h3>
        <ol>{exercise.instructions.map((line) => <li key={line}>{line}</li>)}</ol>
        <div className="tip"><h3>Consejo de técnica</h3><p>{exercise.techniqueTip}</p></div>
        {exercise.alternative && <section><h3>Alternativa</h3><p>{exercise.alternative}</p></section>}
        {exercise.note && <p>{exercise.note}</p>}
      </div>
    </>
  )
}

type Overlay = { type: 'exercise'; exercise: Exercise } | { type: 'guide' | 'rir' }

export function App() {
  const date = useColombianDate()
  const today = getToday(date)
  const [tab, setTab] = useState<'today' | 'week'>('today')
  const [selected, setSelected] = useState<number | null>(null)
  const [overlay, setOverlay] = useState<Overlay | null>(null)
  const active = tab === 'today' ? today : selected ?? today
  const day = week[active]

  function navigate(view: 'today' | 'week', dayIndex: number | null = null) {
    setTab(view)
    setSelected(dayIndex)
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="/" onClick={(event) => {
            event.preventDefault()
            navigate('today')
          }}>
            <span className="brand-mark"><Dumbbell size={22} aria-hidden="true" /></span>
            Mi Rutina
          </a>
          <nav aria-label="Navegación principal" className="main-nav">
            <button type="button" aria-current={tab === 'today' ? 'page' : undefined} onClick={() => navigate('today')}>
              <Dumbbell size={19} aria-hidden="true" /> Hoy
            </button>
            <button type="button" aria-current={tab === 'week' ? 'page' : undefined} onClick={() => navigate('week')}>
              <CalendarDays size={19} aria-hidden="true" /> Semana
            </button>
          </nav>
          <button type="button" className="guide-button" onClick={() => setOverlay({ type: 'guide' })} aria-haspopup="dialog">
            <BookOpen size={18} aria-hidden="true" /> Guía rápida
          </button>
        </div>
      </header>
      <main className="shell main-content">
        {tab === 'today' ? (
          <div className="intro">
            <p className="date"><CalendarDays size={17} aria-hidden="true" /> {dateFormat.format(date).replace(/^./, (letter) => letter.toUpperCase())}</p>
            <h1>{day.kind === 'workout' ? '¡Vamos a entrenar!' : 'Tu rutina de hoy'}</h1>
          </div>
        ) : (
          <>
            <div className="intro"><h1>Tu semana</h1></div>
            <WeekNavigation today={today} selected={active} onSelect={setSelected} />
            <p className="selected-day">{weekdays[active]}{active === today && <span>Hoy</span>}</p>
          </>
        )}
        {day.kind === 'workout' ? (
          <WorkoutView day={day} onExercise={(exercise) => setOverlay({ type: 'exercise', exercise })}
            onHelp={() => setOverlay({ type: 'rir' })} />
        ) : (
          <RestDay day={day} isToday={active === today} onSelect={(dayIndex) => navigate('week', dayIndex)} />
        )}
      </main>
      {overlay && (
        <Modal close={() => setOverlay(null)}
          title={overlay.type === 'exercise' ? overlay.exercise.name : overlay.type === 'rir' ? '¿Qué es RIR?' : 'Guía rápida'}>
          {overlay.type === 'exercise' ? <ExerciseDetail exercise={overlay.exercise} /> : (
            <div className="detail-copy guide-copy">
              {overlay.type === 'rir' ? (
                <p>RIR 2 significa terminar una serie cuando sientes que podrías hacer 2 repeticiones más con buena técnica.</p>
              ) : (
                <>
                  {trainingGuide.map((item) => <section key={item.title}><h3>{item.title}</h3><p>{item.body}</p></section>)}
                  <p className="muscle">Estas pautas son generales. Para una valoración individual, consulta a un profesional.</p>
                </>
              )}
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
