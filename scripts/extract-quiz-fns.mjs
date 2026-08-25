import fs from 'fs';
const f = 'd:/react project/dotsafetyadmin/backend/storage/framework/views/c4d3f4234eac9901109f4f090754f6e5.php';
const s = fs.readFileSync(f, 'utf8');

function dumpAround(label, needle, before = 100, after = 2500) {
  const i = s.indexOf(needle);
  console.log('\n###', label, i);
  if (i >= 0) console.log(s.slice(i - before, i + after));
}

dumpAround('nextQuestion fn', 'function nextQuestion');
dumpAround('previousQuestion fn', 'function previousQuestion');
dumpAround('question-step css', '.question-step');
dumpAround('showStep', 'function showStep');
dumpAround('updateStep', 'currentStep');
