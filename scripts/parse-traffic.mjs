import fs from 'fs';

// Convert PHP assoc array text to JS object via careful eval after transform
const raw = fs.readFileSync('d:/react project/dotsafetyadmin/frontend/scripts/traffic-php.txt', 'utf8');
// strip `$trafficSignsQuestionData = `
let body = raw.replace(/^\$trafficSignsQuestionData\s*=\s*/, '').trim();
if (body.endsWith(';')) body = body.slice(0, -1);

// Very rough PHP -> JSON: only for this known structure
body = body
  .replace(/=>/g, ':')
  .replace(/'/g, '"')
  .replace(/\$/g, '')
  .replace(/,\s*]/g, '}')
  .replace(/\[\s*"/g, '{"') // won't work for nested arrays

// Better: manual parse with regex for each question
const questions = {};
const re = /'(question_\d+)'\s*=>\s*\[\s*'text'\s*=>\s*'((?:\\'|[^'])*)'\s*,\s*'image'\s*=>\s*'((?:\\'|[^'])*)'\s*,\s*'options'\s*=>\s*\[((?:.|\n)*?)\]\s*\]/g;
let m;
while ((m = re.exec(raw))) {
  const key = m[1];
  const text = m[2].replace(/\\'/g, "'");
  const image = m[3];
  const optsRaw = m[4];
  const opts = [];
  const ore = /'((?:\\'|[^'])*)'/g;
  let om;
  while ((om = ore.exec(optsRaw))) opts.push(om[1].replace(/\\'/g, "'"));
  questions[key] = { text, image, options: opts };
}
console.log('count', Object.keys(questions).length);
fs.writeFileSync(
  'd:/react project/dotsafetyadmin/frontend/scripts/traffic.json',
  JSON.stringify(questions, null, 2)
);
