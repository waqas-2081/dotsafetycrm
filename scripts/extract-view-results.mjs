import fs from 'fs';
const f = 'd:/react project/dotsafetyadmin/backend/storage/framework/views/b70284fa6bb6c356f73e0b39518ce956.php';
const s = fs.readFileSync(f, 'utf8');
const i = s.indexOf('All Quizzes Results');
fs.writeFileSync(
  'd:/react project/dotsafetyadmin/frontend/scripts/all-quizzes.txt',
  s.slice(i - 200, i + 12000)
);
console.log('len from', i);
const j = s.indexOf('hoursOfServiceResultsModal');
console.log('hos results modal', j);
const k = s.indexOf('View Results');
console.log(s.slice(k - 300, k + 200));
