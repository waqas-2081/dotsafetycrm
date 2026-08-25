import fs from 'fs';
const f = 'd:/react project/dotsafetyadmin/backend/storage/framework/views/c4d3f4234eac9901109f4f090754f6e5.php';
const s = fs.readFileSync(f, 'utf8');
const i = s.indexOf('function ModalTimer');
const j = s.indexOf('class ModalTimer');
console.log('fn', i, 'class', j);
const start = i >= 0 ? i : j;
fs.writeFileSync(
  'd:/react project/dotsafetyadmin/frontend/scripts/ModalTimer.txt',
  s.slice(start, start + 9000)
);
console.log(s.slice(start, start + 500));
