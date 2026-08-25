import fs from 'fs';

const p = 'd:/react project/dotsafetyadmin/backend/storage/framework/views/b70284fa6bb6c356f73e0b39518ce956.php';
const s = fs.readFileSync(p, 'utf8');
const start = s.indexOf('$trafficSignsQuestionData = [');
const end = s.indexOf('];', start);
const block = s.slice(start, end + 2);
fs.writeFileSync('d:/react project/dotsafetyadmin/frontend/scripts/traffic-raw.txt', block);
console.log('len', block.length);
console.log(block.slice(-800));
