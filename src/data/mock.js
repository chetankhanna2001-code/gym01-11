// Mock data for screens not yet backed by the database (Progress, Classes, parts of Profile)
// plus static marketing content. Live data comes from /api.

export const user = {
  name: 'Alex Rivera',
  firstName: 'Alex',
  handle: '@alexlifts',
  initials: 'AR',
  membership: 'Elite',
  memberId: 'PF-2048-7731',
  memberSince: 'March 2024',
  validThru: '03/27',
  homeGym: 'PulseFit Downtown',
  goal: 'Build strength',
  level: 14,
  xp: 7420,
  xpNext: 9000,
  totals: { workouts: 248, hours: 186, prs: 14, bestStreak: 21 },
}

export const features = [
  { icon: 'dumbbell', title: 'Plans that adapt', text: 'Smart programs that progress your weights and volume as you get stronger.' },
  { icon: 'timer', title: 'Live workout mode', text: 'Big rest timers, one-tap set tracking and a finish line worth celebrating.' },
  { icon: 'trending', title: 'Progress you can see', text: 'Strength curves, PR history and weekly trends in one clean view.' },
  { icon: 'calendar', title: 'Book in seconds', text: 'Yoga, HIIT, Spin and Boxing. See open spots, tap, done.' },
  { icon: 'flame', title: 'Streaks that stick', text: 'Daily streaks and badges that keep you coming back.' },
  { icon: 'trophy', title: 'Earn your trophies', text: 'Unlock achievements for every milestone, from first rep to 300 sessions.' },
]

// Marketing preview card on the landing page (not user data)
export const heroPreview = { name: "Upper Body Power" }

export const muscleGroups = ['Chest', 'Back', 'Legs', 'Arms', 'Core', 'Cardio']

export const strengthData = [
  { month: 'Nov', bench: 60, squat: 85, deadlift: 110 },
  { month: 'Dec', bench: 62.5, squat: 90, deadlift: 115 },
  { month: 'Jan', bench: 62.5, squat: 92.5, deadlift: 120 },
  { month: 'Feb', bench: 65, squat: 95, deadlift: 122.5 },
  { month: 'Mar', bench: 67.5, squat: 100, deadlift: 127.5 },
  { month: 'Apr', bench: 67.5, squat: 102.5, deadlift: 130 },
  { month: 'May', bench: 70, squat: 105, deadlift: 135 },
  { month: 'Jun', bench: 72.5, squat: 107.5, deadlift: 137.5 },
  { month: 'Jul', bench: 72.5, squat: 110, deadlift: 140 },
  { month: 'Aug', bench: 75, squat: 112.5, deadlift: 142.5 },
  { month: 'Sep', bench: 77.5, squat: 117.5, deadlift: 145 },
  { month: 'Oct', bench: 80, squat: 120, deadlift: 150 },
]

export const personalRecords = [
  { id: 'pr1', lift: 'Deadlift', value: '150', unit: 'kg', date: 'Oct 12, 2026', delta: '+10 kg', isNew: true, tier: 'gold' },
  { id: 'pr2', lift: 'Back Squat', value: '120', unit: 'kg', date: 'Oct 4, 2026', delta: '+7.5 kg', isNew: true, tier: 'gold' },
  { id: 'pr3', lift: 'Bench Press', value: '80', unit: 'kg', date: 'Oct 18, 2026', delta: '+5 kg', isNew: true, tier: 'gold' },
  { id: 'pr4', lift: 'Overhead Press', value: '52.5', unit: 'kg', date: 'Sep 21, 2026', delta: '+2.5 kg', isNew: false, tier: 'silver' },
  { id: 'pr5', lift: 'Pull-Ups', value: '15', unit: 'reps', date: 'Aug 30, 2026', delta: '+3 reps', isNew: false, tier: 'silver' },
  { id: 'pr6', lift: '5K Run', value: '22:48', unit: 'min', date: 'Jul 14, 2026', delta: '−41 s', isNew: false, tier: 'bronze' },
]

export const classTypes = ['Yoga', 'HIIT', 'Spin', 'Boxing']

const rawSchedule = {
  Mon: [
    ['06:30', 'HIIT', 'Metcon Blast', 'Coach Jay', 45, 20, 17],
    ['12:15', 'Yoga', 'Lunch Flow', 'Coach Priya', 40, 18, 9],
    ['18:00', 'Spin', 'Climb Club', 'Coach Leo', 45, 24, 24],
    ['19:30', 'Boxing', 'Fight Fit', 'Coach Dre', 50, 16, 11],
  ],
  Tue: [
    ['07:00', 'Spin', 'Sunrise Ride', 'Coach Leo', 45, 24, 14],
    ['12:30', 'HIIT', 'Express Burn', 'Coach Sana', 30, 20, 20],
    ['18:30', 'Boxing', 'Pad Work', 'Coach Dre', 50, 16, 13],
    ['20:00', 'Yoga', 'Deep Stretch', 'Coach Priya', 45, 18, 6],
  ],
  Wed: [
    ['06:30', 'Yoga', 'Power Vinyasa', 'Coach Priya', 50, 18, 12],
    ['12:00', 'Spin', 'Tempo Intervals', 'Coach Leo', 40, 24, 21],
    ['18:00', 'HIIT', 'Tabata Tower', 'Coach Jay', 45, 20, 15],
    ['19:15', 'Boxing', 'Bag Burner', 'Coach Dre', 45, 16, 16],
  ],
  Thu: [
    ['07:00', 'HIIT', 'Sunrise Shred', 'Coach Sana', 40, 20, 12],
    ['12:15', 'Boxing', 'Lunch Knockout', 'Coach Dre', 40, 16, 8],
    ['18:30', 'Spin', 'Rhythm Ride', 'Coach Leo', 45, 24, 22],
    ['20:00', 'Yoga', 'Yin & Breath', 'Coach Priya', 60, 18, 10],
  ],
  Fri: [
    ['06:30', 'Spin', 'Fast Friday', 'Coach Leo', 45, 24, 18],
    ['12:00', 'Yoga', 'Midday Reset', 'Coach Priya', 40, 18, 7],
    ['17:30', 'HIIT', 'Friday Finisher', 'Coach Jay', 45, 20, 19],
  ],
  Sat: [
    ['09:00', 'HIIT', 'Weekend Warrior', 'Coach Sana', 50, 22, 20],
    ['10:30', 'Boxing', 'Sparring Basics', 'Coach Dre', 60, 16, 14],
    ['11:30', 'Yoga', 'Slow Flow', 'Coach Priya', 60, 18, 11],
  ],
  Sun: [
    ['10:00', 'Yoga', 'Sunday Restore', 'Coach Priya', 60, 18, 13],
    ['11:00', 'Spin', 'Long Ride', 'Coach Leo', 60, 24, 16],
  ],
}

const intensityByType = { Yoga: 1, Spin: 2, Boxing: 3, HIIT: 3 }

export const schedule = Object.fromEntries(
  Object.entries(rawSchedule).map(([day, list]) => [
    day,
    list.map(([time, type, name, coach, duration, capacity, taken], i) => ({
      id: `${day}-${i}`,
      day,
      time,
      type,
      name,
      coach,
      duration,
      capacity,
      taken,
      intensity: intensityByType[type],
    })),
  ]),
)

export const allClasses = Object.values(schedule).flat()
export const findClass = (id) => allClasses.find((c) => c.id === id)

export const achievements = [
  { id: 'a1', name: 'First Rep', desc: 'Completed your first workout', icon: 'sparkles', unlocked: true, date: 'Mar 2024' },
  { id: 'a2', name: 'On Fire', desc: 'Hit a 7-day streak', icon: 'flame', unlocked: true, date: 'Apr 2024' },
  { id: 'a3', name: 'Early Bird', desc: '10 workouts before 7 AM', icon: 'sunrise', unlocked: true, date: 'Jun 2024' },
  { id: 'a4', name: 'Iron Club', desc: 'Lifted 100 tonnes in total', icon: 'dumbbell', unlocked: true, date: 'Jan 2026' },
  { id: 'a5', name: 'Class Act', desc: 'Attended 10 group classes', icon: 'users', unlocked: true, date: 'Feb 2026' },
  { id: 'a6', name: 'PR Machine', desc: 'Set 10 personal records', icon: 'trophy', unlocked: true, date: 'Sep 2026' },
  { id: 'a7', name: 'Unstoppable', desc: 'Hit a 30-day streak', icon: 'zap', unlocked: false, progress: 12, goal: 30 },
  { id: 'a8', name: 'Road Warrior', desc: 'Log 100 km of cardio', icon: 'heart', unlocked: false, progress: 64, goal: 100 },
  { id: 'a9', name: 'Centurion', desc: 'Complete 300 workouts', icon: 'medal', unlocked: false, progress: 248, goal: 300 },
]

export const quotes = [
  { text: 'The only bad workout is the one that didn’t happen.', author: 'Unknown' },
  { text: 'Strength doesn’t come from what you can do. It comes from overcoming the things you once thought you couldn’t.', author: 'Rikki Rogers' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln (attr.)' },
  { text: 'Motivation gets you going. Habit keeps you growing.', author: 'Unknown' },
  { text: 'Don’t count the days. Make the days count.', author: 'Muhammad Ali' },
  { text: 'Sweat is just fat crying.', author: 'Gym wisdom' },
  { text: 'You don’t have to be extreme, just consistent.', author: 'Unknown' },
  { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { text: 'The body achieves what the mind believes.', author: 'Unknown' },
  { text: 'Fall in love with the process and the results will come.', author: 'Eric Thomas' },
]

export function quoteOfTheDay(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date - start) / 86400000)
  return quotes[dayOfYear % quotes.length]
}
