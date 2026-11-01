-- PulseFit sample data. Safe to run repeatedly (upserts on unique keys).

INSERT INTO exercises (name, muscle_group, sets, reps, difficulty, rest_seconds, description) VALUES
  -- Chest
  ('Barbell Bench Press',     'Chest',  4, '8',         'Intermediate',  90, 'Keep shoulder blades pinned and drive through your feet.'),
  ('Incline Dumbbell Press',  'Chest',  3, '10',        'Intermediate',  75, 'A 30 degree bench angle hits the upper chest best.'),
  ('Cable Fly',               'Chest',  3, '12-15',     'Beginner',      60, 'Hug a big tree and squeeze at the middle.'),
  ('Push-Ups',                'Chest',  3, 'AMRAP',     'Beginner',      60, 'Body in one straight line, chest to fist height.'),
  ('Weighted Dips',           'Chest',  3, '8',         'Advanced',      90, 'Lean forward slightly to bias the chest over triceps.'),
  -- Back
  ('Conventional Deadlift',   'Back',   5, '5',         'Advanced',     150, 'Push the floor away and keep the bar close to your shins.'),
  ('Pull-Ups',                'Back',   4, '8',         'Intermediate',  90, 'Lead with your chest, elbows to your back pockets.'),
  ('Seated Cable Row',        'Back',   3, '12',        'Beginner',      60, 'Pause for one second with the handle at your ribs.'),
  ('Bent-Over Barbell Row',   'Back',   4, '10',        'Intermediate',  75, 'Flat back, pull the bar to your belly button.'),
  ('Lat Pulldown',            'Back',   3, '12',        'Beginner',      60, 'Drive elbows down and slightly back, no swinging.'),
  -- Legs
  ('Back Squat',              'Legs',   5, '5',         'Advanced',     150, 'Brace hard, sit between your hips, then drive up.'),
  ('Romanian Deadlift',       'Legs',   4, '8',         'Intermediate',  90, 'Soft knees, hinge until you feel the hamstrings stretch.'),
  ('Walking Lunges',          'Legs',   3, '12 / leg',  'Beginner',      60, 'Long strides, back knee kisses the floor.'),
  ('Bulgarian Split Squat',   'Legs',   3, '10 / leg',  'Advanced',      75, 'Lean slightly forward to bias the glutes.'),
  ('Leg Press',               'Legs',   4, '12',        'Beginner',      90, 'Feet shoulder width, never lock out your knees.'),
  -- Arms
  ('Barbell Curl',            'Arms',   3, '10',        'Beginner',      60, 'Elbows glued to your sides, no swinging.'),
  ('Skull Crushers',          'Arms',   3, '10',        'Intermediate',  60, 'Lower to your forehead and keep your upper arms still.'),
  ('Hammer Curl',             'Arms',   3, '12',        'Beginner',      45, 'A neutral grip builds forearms and the brachialis.'),
  ('Overhead Triceps Extension', 'Arms', 3, '12',       'Intermediate',  60, 'Keep elbows pointing forward and stretch at the bottom.'),
  ('Close-Grip Bench Press',  'Arms',   4, '8',         'Advanced',      90, 'Hands shoulder width, elbows tucked close to your body.'),
  -- Core
  ('Hanging Leg Raise',       'Core',   3, '12',        'Advanced',      60, 'Curl your pelvis up rather than just lifting your legs.'),
  ('Plank Hold',              'Core',   3, '60 s',      'Beginner',      45, 'Squeeze your glutes and pull elbows toward your toes.'),
  ('Cable Woodchopper',       'Core',   3, '12 / side', 'Intermediate',  45, 'Rotate from the hips while your arms stay long.'),
  ('Dead Bug',                'Core',   3, '10 / side', 'Beginner',      45, 'Press your lower back into the floor the whole time.'),
  ('Ab Wheel Rollout',        'Core',   3, '10',        'Advanced',      60, 'Roll out only as far as you can keep your back flat.'),
  -- Cardio
  ('Assault Bike Sprints',    'Cardio', 8, '20 s',      'Advanced',      40, 'All-out effort, then recover fully between rounds.'),
  ('Rowing Intervals',        'Cardio', 5, '500 m',     'Intermediate',  90, 'Legs, hips, arms on the drive. Then reverse it.'),
  ('Jump Rope',               'Cardio', 5, '2 min',     'Beginner',      45, 'Stay on the balls of your feet, wrists do the work.'),
  ('Burpees',                 'Cardio', 4, '12',        'Intermediate',  60, 'Chest to floor, then explode up with a jump.'),
  ('Incline Treadmill Walk',  'Cardio', 1, '20 min',    'Beginner',       0, 'Set a 10 to 12 percent incline and keep a brisk pace.')
ON CONFLICT (name) DO UPDATE SET
  muscle_group = EXCLUDED.muscle_group,
  sets         = EXCLUDED.sets,
  reps         = EXCLUDED.reps,
  difficulty   = EXCLUDED.difficulty,
  rest_seconds = EXCLUDED.rest_seconds,
  description  = EXCLUDED.description;

-- 10 classes in the current week (Monday-based), relative to when the seed runs.
INSERT INTO classes (title, coach_name, start_time, duration_minutes, capacity, intensity) VALUES
  ('Sunrise HIIT',       'Coach Jay',   date_trunc('week', now()) + interval '0 days 06:30', 45, 20, 'High'),
  ('Power Vinyasa Yoga', 'Coach Priya', date_trunc('week', now()) + interval '0 days 18:00', 60, 18, 'Low'),
  ('Rhythm Spin',        'Coach Leo',   date_trunc('week', now()) + interval '1 days 07:00', 45, 24, 'Medium'),
  ('Fight Fit Boxing',   'Coach Dre',   date_trunc('week', now()) + interval '1 days 19:30', 50, 16, 'High'),
  ('Strength Lab',       'Coach Maya',  date_trunc('week', now()) + interval '2 days 18:00', 60, 14, 'Medium'),
  ('Tabata Tower',       'Coach Sana',  date_trunc('week', now()) + interval '3 days 12:15', 30, 20, 'High'),
  ('Yin & Breath',       'Coach Priya', date_trunc('week', now()) + interval '3 days 20:00', 60, 18, 'Low'),
  ('Climb Club Spin',    'Coach Leo',   date_trunc('week', now()) + interval '4 days 17:30', 45, 24, 'High'),
  ('Sparring Basics',    'Coach Dre',   date_trunc('week', now()) + interval '5 days 10:30', 60, 16, 'Medium'),
  ('Sunday Restore',     'Coach Priya', date_trunc('week', now()) + interval '6 days 10:00', 60, 18, 'Low')
ON CONFLICT (title, start_time) DO NOTHING;
