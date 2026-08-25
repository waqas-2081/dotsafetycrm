import fs from 'fs';

const f = 'd:/react project/dotsafetyadmin/backend/storage/framework/views/c4d3f4234eac9901109f4f090754f6e5.php';
const s = fs.readFileSync(f, 'utf8');

const markers = [
  'timerDisplay',
  'currentIndex',
  'showQuestion',
  'nextBtn',
  'btn-next',
  'Previous',
  'Next',
  'question-wrapper',
  'quiz-question',
  'active',
  'startTimer',
  'hoursOfService',
];

for (const m of markers) {
  const i = s.indexOf(m);
  console.log(m, i);
}

const i = s.indexOf('timerDisplay');
fs.writeFileSync(
  'd:/react project/dotsafetyadmin/frontend/scripts/quiz-timer-snip.txt',
  s.slice(Math.max(0, i - 500), i + 8000)
);
console.log('wrote snip', i);
