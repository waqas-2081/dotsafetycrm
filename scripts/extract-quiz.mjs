import fs from 'fs';

const p = 'd:/react project/dotsafetyadmin/backend/storage/framework/views/b70284fa6bb6c356f73e0b39518ce956.php';
const s = fs.readFileSync(p, 'utf8');

function extractAssign(varName) {
  const re = new RegExp(`\\$${varName}\\s*=\\s*(\\[.*?\\]);`, 's');
  const m = s.match(re);
  return m ? m[1] : null;
}

for (const name of [
  'hosQuestionOptions',
  'hosQuestionsText',
  'preTripQuestionOptions2',
  'preTripQuestionsText',
]) {
  const block = extractAssign(name);
  console.log('\n====', name, '====');
  console.log(block ? block.slice(0, 4000) : 'NOT FOUND');
  if (block && block.length > 4000) console.log('... total', block.length);
}

// traffic signs
const ti = s.indexOf('trafficSigns');
console.log('\ntraffic idx', ti);
const t2 = s.indexOf('question_1');
console.log('q1 idx', t2);
console.log(s.slice(Math.max(0, t2 - 200), t2 + 3500));
