import fs from 'fs';

const traffic = JSON.parse(fs.readFileSync('d:/react project/dotsafetyadmin/frontend/scripts/traffic.json', 'utf8'));

const HOS_QUESTIONS = [
  {
    key: 'hos_regulations',
    text: '1. Who enforces H.O.S. regulations?',
    options: ['Police Officers', 'All of these answers are correct', 'D.O.T. Officials', 'Carriers'],
  },
  {
    key: 'hos_stands',
    text: '2. What does H.O.S. stand for?',
    options: ['Hours on Site', 'Home Time Optimization System', 'Hours of Service', 'Highway Organization System'],
  },
  {
    key: 'dot_stands',
    text: '3. What does D.O.T. stand for?',
    options: ['Department of Transportation', 'Department of Timekeeping', 'Days of On-Duty Time', 'Diary of Time'],
  },
  {
    key: 'logbook_inspect',
    text: '4. When can your logbook be inspected?',
    options: [
      'Your carrier can audit your logbook anytime',
      'At any weight station your logbook can be checked for any reason',
      'All of these answers are correct',
      'During a random traffic stop by any police officer',
    ],
  },
  {
    key: 'max_limits',
    text: '5. There are three maximum limits you must follow at all times. Those limits are:',
    options: [
      'None of these are correct',
      'The 16 hour on duty limit, the 10 hours driving time limit, and the 50/60 hour on duty limit',
      'The 14 hour on duty limit, the 11 hours driving time limit, and the 60/70 hour on duty limit',
      'The 11 hour on duty limit, the 14 hours driving time limit, and the 70/80 hour on duty limit',
    ],
  },
  {
    key: 'on_duty_limit',
    text: '6. What does the 14 hours On Duty limit mean?',
    options: [
      'From the time you first go on duty after a 10 consecutive hour break, you are allowed 14 consecutive hours to use your 11-hour drive time',
      'You must rest for at least 14 consecutive hours each day',
      'You can drive up to 14 consecutive hours per day',
      'You are allowed to drive for 7 hours then must take a 7-hour break',
    ],
  },
  {
    key: 'eleven_hour_limit',
    text: '7. Which statement below accurately describes the 11 hour driving limit?',
    options: [
      'You must take 11 consecutive hours off duty before you are allowed to drive',
      'Once you have driven a total of 11 hours in any consecutive hours of on duty time, you have reached the driving limit and must be off duty for another 10 consecutive hours before driving your truck again',
      'You can only drive between the hours of 9 AM to 8 PM each day',
      'You may not perform any on duty work (driving or non-driving duties) after 11 consecutive hours have passed since you began your work day',
    ],
  },
  {
    key: 'thirtyfour_restart',
    text: '8. What is a 34-hour restart?',
    options: [
      'If you drive less than 34 hours in 7 days, all your hours will reset',
      'If you take at least two 17-hour breaks within an 8-day period, all your hours will reset',
      'The regulations allow you to restart your 60 or 70-hour clock calculations after having at least 34 consecutive hours off duty',
      'After you have been on duty for 34 hours, you must take a 70-hour break',
    ],
  },
  {
    key: 'off_duty_time',
    text: '9. Which of the following is considered off duty time?',
    options: [
      'When you are relieved of all duty and responsibility for performing work',
      "Anytime you aren't driving",
      'Time spent doing paid work for anyone who is not a motor carrier',
      'Time inspecting or servicing your truck',
    ],
  },
  {
    key: 'on_duty_time',
    text: '10. Which of the following is considered on duty time?',
    options: [
      'All time loading and unloading your truck',
      'All of these are considered on duty time',
      'All driving time',
      'All time inspecting or servicing your truck, including fueling',
    ],
  },
];

const PRETRIP_QUESTIONS = [
  {
    key: 'degree_of_play',
    text: '1. More than ****** degrees of play in the steering wheel is considered excessive.',
    options: ['10', '12', '5', '45'],
  },
  {
    key: 'air_line_color',
    text: '2. What is the color of the Emergency Air Line that connects the tractor to the trailer?',
    options: ['Green', 'Red', 'Blue'],
  },
  {
    key: 'missing_nut_bolts',
    text: '3. Check your ****** and ****** for any missing nuts or bolts.',
    options: ['Steering column and gear box.', 'Windshield and mirror.', 'Sleeper and cargo.', 'None of the above'],
  },
  {
    key: 'prevent_damage',
    text: '4. The ****** should be fully raised and the crank handle secured to prevent damage.',
    options: ['Tank Mounting Straps', 'Landing Gear', 'Fuel Cap', 'Tire Flaps'],
  },
  {
    key: 'intersecting_cracks',
    text: '5. How many intersecting cracks in your windshield will cause a violation?',
    options: ['8', '3', '4', '2'],
  },
  {
    key: 'minimum_tread_depth',
    text: '6. The minimum tread depth on the steering axle tires is ******.',
    options: ["4/32'", "2'", "9/32'", "1/2'"],
  },
  {
    key: 'mud_flaps',
    text: '7. Mud flaps are required on your tractor and your trailer, but if they are missing, it is not an out-of-service violation.',
    options: ['True', 'False'],
  },
  {
    key: 'inspection_required',
    text: '8. Pre-trip inspections are required by ******.',
    options: ['Law', 'The Food and Drug Administration', 'Company Policy', 'A and C'],
  },
  {
    key: 'brake_shoe_lining',
    text: '9. A brake shoe lining or shoe and drum contaminated by oil or grease is an out-of-service violation.',
    options: ['True', 'False'],
  },
  {
    key: 'proper_inspection',
    text: '10. The majority of ****** can be spotted during a proper pre-trip inspection.',
    options: ['Construction Zones', 'Out of Service Violations', 'Damaged Product', 'People with Insomnia'],
  },
];

const TRAFFIC_QUESTIONS = Object.keys(traffic)
  .sort((a, b) => Number(a.split('_')[1]) - Number(b.split('_')[1]))
  .map((key) => ({
    key,
    text: traffic[key].text,
    image: traffic[key].image,
    // submit 1-based index as string (matches QuizAnswerService)
    options: traffic[key].options.map((label, i) => ({ value: String(i + 1), label })),
  }));

const out = `/** Quiz question banks — ported from original edit-form Blade */
export const HOS_QUESTIONS = ${JSON.stringify(HOS_QUESTIONS, null, 2)};

export const PRETRIP_QUESTIONS = ${JSON.stringify(PRETRIP_QUESTIONS, null, 2)};

export const TRAFFIC_QUESTIONS = ${JSON.stringify(TRAFFIC_QUESTIONS, null, 2)};

export const QUIZ_META = {
  english: { title: 'English Driver Questionnaire', durationMin: 10, endpoint: 'english', stateKey: 'english' },
  hos: { title: 'Hours of Service Questionnaire', durationMin: 10, endpoint: 'hours-of-service', stateKey: 'hos' },
  preTrip: { title: 'Pre-Trip Inspection Questionnaire', durationMin: 10, endpoint: 'pre-trip', stateKey: 'preTrip' },
  traffic: { title: 'Traffic & Road Sign Test', durationMin: 30, endpoint: 'traffic-signs', stateKey: 'traffic' },
};
`;

fs.writeFileSync('d:/react project/dotsafetyadmin/frontend/src/pages/forms/quizData.js', out);
console.log('wrote quizData.js', TRAFFIC_QUESTIONS.length);
