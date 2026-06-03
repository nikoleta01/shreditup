export type Performance = {
  id: string
  artist: string
  day: 1 | 2 | 3
  startTime: string
  endTime: string
  genre: string
  description?: string
}

export const FESTIVAL_NAME = 'Shreditup'

export const FESTIVAL_DAYS: Record<1 | 2 | 3, { date: Date; label: string; short: string }> = {
  1: { date: new Date('2026-09-04'), label: 'Piatok / Friday', short: 'Pia 4.9.' },
  2: { date: new Date('2026-09-05'), label: 'Sobota / Saturday', short: 'Sob 5.9.' },
  3: { date: new Date('2026-09-06'), label: 'Nedeľa / Sunday', short: 'Ned 6.9.' },
}

export const STAGE_NAME = 'Main Stage'

export const performances: Performance[] = [
  // Day 1 — Friday
  { id: 'd1-1', artist: 'Opening Act', day: 1, startTime: '16:00', endTime: '17:00', genre: 'Alternative', description: 'Kick off the festival weekend with our opening act.' },
  { id: 'd1-2', artist: 'The Gravel Road', day: 1, startTime: '17:15', endTime: '18:30', genre: 'Folk Rock' },
  { id: 'd1-3', artist: 'Neon Wolves', day: 1, startTime: '18:45', endTime: '20:00', genre: 'Indie Rock' },
  { id: 'd1-4', artist: 'Phantom Drift', day: 1, startTime: '20:30', endTime: '22:00', genre: 'Electronic Rock', description: 'Headlining Friday with their immersive light show.' },
  { id: 'd1-5', artist: 'DJ Afterburn', day: 1, startTime: '22:30', endTime: '00:00', genre: 'DJ Set' },

  // Day 2 — Saturday
  { id: 'd2-1', artist: 'Meadow Sons', day: 2, startTime: '14:00', endTime: '15:00', genre: 'Acoustic Folk' },
  { id: 'd2-2', artist: 'Static Flora', day: 2, startTime: '15:15', endTime: '16:30', genre: 'Shoegaze' },
  { id: 'd2-3', artist: 'Vortex Parade', day: 2, startTime: '16:45', endTime: '18:00', genre: 'Post-Punk' },
  { id: 'd2-4', artist: 'The Burning Maps', day: 2, startTime: '18:30', endTime: '20:00', genre: 'Psychedelic Rock', description: 'Extended set with special guests.' },
  { id: 'd2-5', artist: 'MZRI', day: 2, startTime: '20:30', endTime: '22:00', genre: 'Electronic' },
  { id: 'd2-6', artist: 'Saturday Headliner', day: 2, startTime: '22:30', endTime: '00:30', genre: 'Rock', description: 'The biggest act of the weekend.' },

  // Day 3 — Sunday
  { id: 'd3-1', artist: 'Morning Tide', day: 3, startTime: '13:00', endTime: '14:00', genre: 'Ambient' },
  { id: 'd3-2', artist: 'Copper Fields', day: 3, startTime: '14:15', endTime: '15:30', genre: 'Country Rock' },
  { id: 'd3-3', artist: 'Infrared', day: 3, startTime: '15:45', endTime: '17:00', genre: 'Synth Pop' },
  { id: 'd3-4', artist: 'Last Call Collective', day: 3, startTime: '17:30', endTime: '19:00', genre: 'Indie Folk' },
  { id: 'd3-5', artist: 'Sunday Closer', day: 3, startTime: '19:30', endTime: '21:30', genre: 'Alternative Rock', description: 'Closing the festival with an unforgettable set.' },
]

export function getPerformancesByDay(day: 1 | 2 | 3) {
  return performances.filter((p) => p.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
}
