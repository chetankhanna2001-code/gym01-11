import {
  Dumbbell, Mountain, Footprints, Zap, Target, HeartPulse, Leaf, Bike, Swords, Flame, Timer,
  Trophy, CalendarDays, Users, TrendingUp, Sparkles, Sunrise, Heart, Medal,
} from 'lucide-react'

export const ease = [0.16, 1, 0.3, 1]

export const icons = {
  dumbbell: Dumbbell, flame: Flame, timer: Timer, trophy: Trophy, calendar: CalendarDays,
  users: Users, trending: TrendingUp, sparkles: Sparkles, sunrise: Sunrise, zap: Zap,
  heart: Heart, medal: Medal,
}

export const muscleMeta = {
  Chest: { icon: Dumbbell, color: '#C6FF3D' },
  Back: { icon: Mountain, color: '#22E1FF' },
  Legs: { icon: Footprints, color: '#A78BFA' },
  Arms: { icon: Zap, color: '#FB923C' },
  Core: { icon: Target, color: '#F472B6' },
  Cardio: { icon: HeartPulse, color: '#F43F5E' },
}

export const classMeta = {
  Yoga: { icon: Leaf, color: '#A78BFA', blurb: 'Mobility & breath' },
  HIIT: { icon: Zap, color: '#FB923C', blurb: 'Max-effort intervals' },
  Spin: { icon: Bike, color: '#22E1FF', blurb: 'Rhythm & endurance' },
  Boxing: { icon: Swords, color: '#F43F5E', blurb: 'Power & footwork' },
}

export const difficultyLevel = { Beginner: 1, Intermediate: 2, Advanced: 3 }

export const formatTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export const to12h = (t) => {
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`
}
