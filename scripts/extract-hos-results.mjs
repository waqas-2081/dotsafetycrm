import fs from 'fs';
const f = 'd:/react project/dotsafetyadmin/backend/storage/framework/views/b70284fa6bb6c356f73e0b39518ce956.php';
const s = fs.readFileSync(f, 'utf8');
// Find hoursOfServiceModal that shows results (with Completed badge)
const needle = 'Hours of Service Questionnaire <?php if(isset($hoursOfServiceTest)';
let i = s.indexOf(needle);
if (i < 0) i = s.indexOf('id="hoursOfServiceModal"');
// There may be multiple - find the one near View Results section (after All Quizzes)
const allQ = s.indexOf('All Quizzes Results');
i = s.indexOf('id="hoursOfServiceModal"', allQ);
console.log('hos modal after all quizzes', i);
fs.writeFileSync(
  'd:/react project/dotsafetyadmin/frontend/scripts/hos-results-modal.txt',
  s.slice(i, i + 9000)
);
console.log(s.slice(i, i + 2500));
