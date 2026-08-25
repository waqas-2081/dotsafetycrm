import fs from 'fs';

const f = 'd:/react project/dotsafetyadmin/backend/storage/framework/views/c4d3f4234eac9901109f4f090754f6e5.php';
const s = fs.readFileSync(f, 'utf8');

const i = s.indexOf('id="hoursOfServiceModal"');
const chunk = s.slice(i, i + 12000);
fs.writeFileSync('d:/react project/dotsafetyadmin/frontend/scripts/hos-modal.html.txt', chunk);

const j = s.indexOf('nextBtn');
fs.writeFileSync(
  'd:/react project/dotsafetyadmin/frontend/scripts/quiz-next-js.txt',
  s.slice(j - 200, j + 6000)
);

const k = s.indexOf('function startTimer');
console.log('startTimer', k);
fs.writeFileSync(
  'd:/react project/dotsafetyadmin/frontend/scripts/start-timer.txt',
  s.slice(k, k + 5000)
);

const m = s.indexOf('currentStep');
console.log('currentStep occurrences');
let idx = 0;
while ((idx = s.indexOf('currentStep', idx)) !== -1) {
  console.log(idx);
  idx++;
}
