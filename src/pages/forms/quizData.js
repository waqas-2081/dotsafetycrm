/** Quiz question banks — ported from original edit-form Blade */
export const HOS_QUESTIONS = [
  {
    "key": "hos_regulations",
    "text": "1. Who enforces H.O.S. regulations?",
    "options": [
      "Police Officers",
      "All of these answers are correct",
      "D.O.T. Officials",
      "Carriers"
    ]
  },
  {
    "key": "hos_stands",
    "text": "2. What does H.O.S. stand for?",
    "options": [
      "Hours on Site",
      "Home Time Optimization System",
      "Hours of Service",
      "Highway Organization System"
    ]
  },
  {
    "key": "dot_stands",
    "text": "3. What does D.O.T. stand for?",
    "options": [
      "Department of Transportation",
      "Department of Timekeeping",
      "Days of On-Duty Time",
      "Diary of Time"
    ]
  },
  {
    "key": "logbook_inspect",
    "text": "4. When can your logbook be inspected?",
    "options": [
      "Your carrier can audit your logbook anytime",
      "At any weight station your logbook can be checked for any reason",
      "All of these answers are correct",
      "During a random traffic stop by any police officer"
    ]
  },
  {
    "key": "max_limits",
    "text": "5. There are three maximum limits you must follow at all times. Those limits are:",
    "options": [
      "None of these are correct",
      "The 16 hour on duty limit, the 10 hours driving time limit, and the 50/60 hour on duty limit",
      "The 14 hour on duty limit, the 11 hours driving time limit, and the 60/70 hour on duty limit",
      "The 11 hour on duty limit, the 14 hours driving time limit, and the 70/80 hour on duty limit"
    ]
  },
  {
    "key": "on_duty_limit",
    "text": "6. What does the 14 hours On Duty limit mean?",
    "options": [
      "From the time you first go on duty after a 10 consecutive hour break, you are allowed 14 consecutive hours to use your 11-hour drive time",
      "You must rest for at least 14 consecutive hours each day",
      "You can drive up to 14 consecutive hours per day",
      "You are allowed to drive for 7 hours then must take a 7-hour break"
    ]
  },
  {
    "key": "eleven_hour_limit",
    "text": "7. Which statement below accurately describes the 11 hour driving limit?",
    "options": [
      "You must take 11 consecutive hours off duty before you are allowed to drive",
      "Once you have driven a total of 11 hours in any consecutive hours of on duty time, you have reached the driving limit and must be off duty for another 10 consecutive hours before driving your truck again",
      "You can only drive between the hours of 9 AM to 8 PM each day",
      "You may not perform any on duty work (driving or non-driving duties) after 11 consecutive hours have passed since you began your work day"
    ]
  },
  {
    "key": "thirtyfour_restart",
    "text": "8. What is a 34-hour restart?",
    "options": [
      "If you drive less than 34 hours in 7 days, all your hours will reset",
      "If you take at least two 17-hour breaks within an 8-day period, all your hours will reset",
      "The regulations allow you to restart your 60 or 70-hour clock calculations after having at least 34 consecutive hours off duty",
      "After you have been on duty for 34 hours, you must take a 70-hour break"
    ]
  },
  {
    "key": "off_duty_time",
    "text": "9. Which of the following is considered off duty time?",
    "options": [
      "When you are relieved of all duty and responsibility for performing work",
      "Anytime you aren't driving",
      "Time spent doing paid work for anyone who is not a motor carrier",
      "Time inspecting or servicing your truck"
    ]
  },
  {
    "key": "on_duty_time",
    "text": "10. Which of the following is considered on duty time?",
    "options": [
      "All time loading and unloading your truck",
      "All of these are considered on duty time",
      "All driving time",
      "All time inspecting or servicing your truck, including fueling"
    ]
  }
];

export const PRETRIP_QUESTIONS = [
  {
    "key": "degree_of_play",
    "text": "1. More than ****** degrees of play in the steering wheel is considered excessive.",
    "options": [
      "10",
      "12",
      "5",
      "45"
    ]
  },
  {
    "key": "air_line_color",
    "text": "2. What is the color of the Emergency Air Line that connects the tractor to the trailer?",
    "options": [
      "Green",
      "Red",
      "Blue"
    ]
  },
  {
    "key": "missing_nut_bolts",
    "text": "3. Check your ****** and ****** for any missing nuts or bolts.",
    "options": [
      "Steering column and gear box.",
      "Windshield and mirror.",
      "Sleeper and cargo.",
      "None of the above"
    ]
  },
  {
    "key": "prevent_damage",
    "text": "4. The ****** should be fully raised and the crank handle secured to prevent damage.",
    "options": [
      "Tank Mounting Straps",
      "Landing Gear",
      "Fuel Cap",
      "Tire Flaps"
    ]
  },
  {
    "key": "intersecting_cracks",
    "text": "5. How many intersecting cracks in your windshield will cause a violation?",
    "options": [
      "8",
      "3",
      "4",
      "2"
    ]
  },
  {
    "key": "minimum_tread_depth",
    "text": "6. The minimum tread depth on the steering axle tires is ******.",
    "options": [
      "4/32'",
      "2'",
      "9/32'",
      "1/2'"
    ]
  },
  {
    "key": "mud_flaps",
    "text": "7. Mud flaps are required on your tractor and your trailer, but if they are missing, it is not an out-of-service violation.",
    "options": [
      "True",
      "False"
    ]
  },
  {
    "key": "inspection_required",
    "text": "8. Pre-trip inspections are required by ******.",
    "options": [
      "Law",
      "The Food and Drug Administration",
      "Company Policy",
      "A and C"
    ]
  },
  {
    "key": "brake_shoe_lining",
    "text": "9. A brake shoe lining or shoe and drum contaminated by oil or grease is an out-of-service violation.",
    "options": [
      "True",
      "False"
    ]
  },
  {
    "key": "proper_inspection",
    "text": "10. The majority of ****** can be spotted during a proper pre-trip inspection.",
    "options": [
      "Construction Zones",
      "Out of Service Violations",
      "Damaged Product",
      "People with Insomnia"
    ]
  }
];

export const TRAFFIC_QUESTIONS = [
  {
    "key": "question_1",
    "text": "1. This sign means?",
    "image": "/assets/images/test/handicap.jpg",
    "options": [
      {
        "value": "1",
        "label": "No parking anytime."
      },
      {
        "value": "2",
        "label": "No parking here to the corner."
      },
      {
        "value": "3",
        "label": "Disabled parking spot."
      },
      {
        "value": "4",
        "label": "No stopping or standing."
      }
    ]
  },
  {
    "key": "question_2",
    "text": "2. This sign means?",
    "image": "/assets/images/test/school-crossing.jpg",
    "options": [
      {
        "value": "1",
        "label": "School crossing."
      },
      {
        "value": "2",
        "label": "Pedestrian crossing."
      },
      {
        "value": "3",
        "label": "Church crossing."
      },
      {
        "value": "4",
        "label": "Pedestrian traffic only."
      }
    ]
  },
  {
    "key": "question_3",
    "text": "3. This sign means?",
    "image": "/assets/images/test/old-school.gif",
    "options": [
      {
        "value": "1",
        "label": "No motor vehicles allowed."
      },
      {
        "value": "2",
        "label": "School crossing."
      },
      {
        "value": "3",
        "label": "Pedestrian crossing."
      },
      {
        "value": "4",
        "label": "No pedestrian crossing."
      }
    ]
  },
  {
    "key": "question_4",
    "text": "4. This warning sign means?",
    "image": "/assets/images/test/circle.gif",
    "options": [
      {
        "value": "1",
        "label": "Left curve ahead."
      },
      {
        "value": "2",
        "label": "Three-way intersection ahead."
      },
      {
        "value": "3",
        "label": "Circular intersection ahead."
      },
      {
        "value": "4",
        "label": "U-turns allowed ahead."
      }
    ]
  },
  {
    "key": "question_5",
    "text": "5. This warning sign means?",
    "image": "/assets/images/test/dead-end.gif",
    "options": [
      {
        "value": "1",
        "label": "Two-way traffic ends ahead."
      },
      {
        "value": "2",
        "label": "Wrong way, turn around."
      },
      {
        "value": "3",
        "label": "This road or street terminates ahead."
      },
      {
        "value": "4",
        "label": "Do not enter, wrong way."
      }
    ]
  },
  {
    "key": "question_6",
    "text": "6. This sign means?",
    "image": "/assets/images/test/school-ahead.gif",
    "options": [
      {
        "value": "1",
        "label": "School advance warning, you're entering a school zone."
      },
      {
        "value": "2",
        "label": "Pedestrian crossing ahead."
      },
      {
        "value": "3",
        "label": "Pedestrians ahead warning sign."
      },
      {
        "value": "4",
        "label": "Pedestrians only, no vehicle traffic."
      }
    ]
  },
  {
    "key": "question_7",
    "text": "7. This sign means?",
    "image": "/assets/images/test/wrong-way.gif",
    "options": [
      {
        "value": "1",
        "label": "Traffic flows only to the left."
      },
      {
        "value": "2",
        "label": "Traffic flows only to the right."
      },
      {
        "value": "3",
        "label": "Your lane will end ahead."
      },
      {
        "value": "4",
        "label": "Do not drive past this sign, turn around."
      }
    ]
  },
  {
    "key": "question_8",
    "text": "8. This warning sign means?",
    "image": "/assets/images/test/pavement-ends.gif",
    "options": [
      {
        "value": "1",
        "label": "Road closed ahead."
      },
      {
        "value": "2",
        "label": "Road construction ahead."
      },
      {
        "value": "3",
        "label": "Pavement ends ahead."
      },
      {
        "value": "4",
        "label": "Lane ends ahead."
      }
    ]
  },
  {
    "key": "question_9",
    "text": "9. This sign means?",
    "image": "/assets/images/test/bus-stop.gif",
    "options": [
      {
        "value": "1",
        "label": "General information sign for a RV stop."
      },
      {
        "value": "2",
        "label": "General information sign for a mobile home park."
      },
      {
        "value": "3",
        "label": "General information sign for a truck stop."
      },
      {
        "value": "4",
        "label": "General information sign for a bus station."
      }
    ]
  },
  {
    "key": "question_10",
    "text": "10. This curve advisory speed sign means?",
    "image": "/assets/images/test/curve.gif",
    "options": [
      {
        "value": "1",
        "label": "Minimum advised speed limit is 25 mph in ideal conditions."
      },
      {
        "value": "2",
        "label": "Minimum advised speed limit is 25 mph in all conditions."
      },
      {
        "value": "3",
        "label": "Slow down, maximum advised speed is 25 mph in ideal conditions."
      },
      {
        "value": "4",
        "label": "Slow down, maximum advised speed is 25 mph in all conditions."
      }
    ]
  },
  {
    "key": "question_11",
    "text": "11. What type of sign is this?",
    "image": "/assets/images/test/county-route.jpg",
    "options": [
      {
        "value": "1",
        "label": "U. S. route sign."
      },
      {
        "value": "2",
        "label": "State route sign."
      },
      {
        "value": "3",
        "label": "County route sign."
      },
      {
        "value": "4",
        "label": "Interstate route sign."
      }
    ]
  },
  {
    "key": "question_12",
    "text": "12. This warning sign means?",
    "image": "/assets/images/test/reduced-school1.jpg",
    "options": [
      {
        "value": "1",
        "label": "School crossing ahead."
      },
      {
        "value": "2",
        "label": "Reduced speed limit, school zone ahead."
      },
      {
        "value": "3",
        "label": "Stop sign ahead."
      },
      {
        "value": "4",
        "label": "End of school zone ahead."
      }
    ]
  },
  {
    "key": "question_13",
    "text": "13. This warning sign means?",
    "image": "/assets/images/test/left-merging.gif",
    "options": [
      {
        "value": "1",
        "label": "Merging traffic entering from the right."
      },
      {
        "value": "2",
        "label": "Intersection warning ahead."
      },
      {
        "value": "3",
        "label": "Two lane traffic ahead."
      },
      {
        "value": "4",
        "label": "Merging traffic entering from the left."
      }
    ]
  },
  {
    "key": "question_14",
    "text": "14. This sign means?",
    "image": "/assets/images/test/one-way.gif",
    "options": [
      {
        "value": "1",
        "label": "Divided highway ends."
      },
      {
        "value": "2",
        "label": "Traffic flows only in the direction of the arrow."
      },
      {
        "value": "3",
        "label": "Wrong way, turn around."
      },
      {
        "value": "4",
        "label": "Divided highway begins."
      }
    ]
  },
  {
    "key": "question_15",
    "text": "15. This warning sign means?",
    "image": "/assets/images/test/low-clearance.gif",
    "options": [
      {
        "value": "1",
        "label": "Road narrows ahead."
      },
      {
        "value": "2",
        "label": "Road under water ahead."
      },
      {
        "value": "3",
        "label": "Road ramp ahead."
      },
      {
        "value": "4",
        "label": "Low clearance ahead."
      }
    ]
  },
  {
    "key": "question_16",
    "text": "16. This warning sign means?",
    "image": "/assets/images/test/playground2.jpg",
    "options": [
      {
        "value": "1",
        "label": "Road striping ahead."
      },
      {
        "value": "2",
        "label": "Road maintenance crew ahead."
      },
      {
        "value": "3",
        "label": "Children's playground ahead."
      },
      {
        "value": "4",
        "label": "Utility crew ahead."
      }
    ]
  },
  {
    "key": "question_17",
    "text": "17. This sign means?",
    "image": "/assets/images/test/no-left-turn.gif",
    "options": [
      {
        "value": "1",
        "label": "No right turn."
      },
      {
        "value": "2",
        "label": "No left turn."
      },
      {
        "value": "3",
        "label": "No u-turn."
      },
      {
        "value": "4",
        "label": "No turn on red."
      }
    ]
  },
  {
    "key": "question_18",
    "text": "18. This warning sign means?",
    "image": "/assets/images/test/dip.gif",
    "options": [
      {
        "value": "1",
        "label": "Ahead is a sharp rise in the profile of the road."
      },
      {
        "value": "2",
        "label": "Ahead is a sharp depression in the profile of the road."
      },
      {
        "value": "3",
        "label": "Pavement ends ahead."
      },
      {
        "value": "4",
        "label": "Ahead is a narrow bridge warning."
      }
    ]
  },
  {
    "key": "question_19",
    "text": "19. What type of sign is this?",
    "image": "/assets/images/test/interstate.gif",
    "options": [
      {
        "value": "1",
        "label": "State route sign."
      },
      {
        "value": "2",
        "label": "U. S. route sign."
      },
      {
        "value": "3",
        "label": "Interstate route sign."
      },
      {
        "value": "4",
        "label": "County route sign."
      }
    ]
  },
  {
    "key": "question_20",
    "text": "20. This warning sign means.",
    "image": "/assets/images/test/divided-ends.gif",
    "options": [
      {
        "value": "1",
        "label": "Reverse curve ahead."
      },
      {
        "value": "2",
        "label": "A divided highway ends ahead."
      },
      {
        "value": "3",
        "label": "One-way traffic ahead."
      },
      {
        "value": "4",
        "label": "A divided highway begins ahead."
      }
    ]
  },
  {
    "key": "question_21",
    "text": "21. This sign means?",
    "image": "/assets/images/test/ped-crossing.gif",
    "options": [
      {
        "value": "1",
        "label": "Ski resort ahead."
      },
      {
        "value": "2",
        "label": "Pedestrian crossing ahead."
      },
      {
        "value": "3",
        "label": "School zone ahead."
      },
      {
        "value": "4",
        "label": "School crossing ahead."
      }
    ]
  },
  {
    "key": "question_22",
    "text": "22. This sign means?",
    "image": "/assets/images/test/plane.gif",
    "options": [
      {
        "value": "1",
        "label": "General information sign for an aircraft manufacturing plant."
      },
      {
        "value": "2",
        "label": "Low flying aircraft warning."
      },
      {
        "value": "3",
        "label": "No fly zone ahead."
      },
      {
        "value": "4",
        "label": "General information sign for an airport."
      }
    ]
  },
  {
    "key": "question_23",
    "text": "23. This warning sign means?",
    "image": "/assets/images/test/left-lane-ends.gif",
    "options": [
      {
        "value": "1",
        "label": "Narrow bridge ahead."
      },
      {
        "value": "2",
        "label": "Left lane ends ahead."
      },
      {
        "value": "3",
        "label": "Soft shoulder warning ahead."
      },
      {
        "value": "4",
        "label": "Right lane ends ahead."
      }
    ]
  },
  {
    "key": "question_24",
    "text": "24. This warning sign means?",
    "image": "/assets/images/test/double-arrow.gif",
    "options": [
      {
        "value": "1",
        "label": "Keep to the right, merging traffic ahead."
      },
      {
        "value": "2",
        "label": "Traffic is permitted to pass on either side of an island or obstruction."
      },
      {
        "value": "3",
        "label": "Keep to the left, merging traffic ahead."
      },
      {
        "value": "4",
        "label": "Right lane stays to the right, left lane stays to the left."
      }
    ]
  },
  {
    "key": "question_25",
    "text": "25. What type of sign is this?",
    "image": "/assets/images/test/state-route.jpg",
    "options": [
      {
        "value": "1",
        "label": "Interstate route sign."
      },
      {
        "value": "2",
        "label": "U. S. route sign."
      },
      {
        "value": "3",
        "label": "County route sign."
      },
      {
        "value": "4",
        "label": "State route sign."
      }
    ]
  },
  {
    "key": "question_26",
    "text": "26. This warning sign means?",
    "image": "/assets/images/test/hairpin.gif",
    "options": [
      {
        "value": "1",
        "label": "Hairpin curve ahead, extreme right curve."
      },
      {
        "value": "2",
        "label": "Left curve ahead warning."
      },
      {
        "value": "3",
        "label": "Merging traffic from the right."
      },
      {
        "value": "4",
        "label": "Right turn ahead warning."
      }
    ]
  },
  {
    "key": "question_27",
    "text": "27. What type of sign is this?",
    "image": "/assets/images/test/us-route.jpg",
    "options": [
      {
        "value": "1",
        "label": "U. S. route sign."
      },
      {
        "value": "2",
        "label": "Interstate route sign."
      },
      {
        "value": "3",
        "label": "County route sign."
      },
      {
        "value": "4",
        "label": "State route sign."
      }
    ]
  },
  {
    "key": "question_28",
    "text": "28. This sign means?",
    "image": "/assets/images/test/no-right-turn.gif",
    "options": [
      {
        "value": "1",
        "label": "No right turn."
      },
      {
        "value": "2",
        "label": "No u-turn."
      },
      {
        "value": "3",
        "label": "No turn on red."
      },
      {
        "value": "4",
        "label": "No left turn."
      }
    ]
  },
  {
    "key": "question_29",
    "text": "29. This sign means?",
    "image": "/assets/images/test/mim-spped.gif",
    "options": [
      {
        "value": "1",
        "label": "Speed limit is 50 mph, minimum fine of $50 for violations."
      },
      {
        "value": "2",
        "label": "Max speed 50 mph, minimum speed 30 mph in all conditions."
      },
      {
        "value": "3",
        "label": "Max speed 50 mph, minimum speed 30 mph in ideal conditions."
      },
      {
        "value": "4",
        "label": "Speed limit is 50 mph, minimum fine of $30 for violations."
      }
    ]
  },
  {
    "key": "question_30",
    "text": "30. This exit advisory speed sign means?",
    "image": "/assets/images/test/exit.gif",
    "options": [
      {
        "value": "1",
        "label": "Slow down, maximum advised speed is 25 mph in ideal conditions."
      },
      {
        "value": "2",
        "label": "Minimum advised speed limit is 25 mph in ideal conditions."
      },
      {
        "value": "3",
        "label": "Slow down, maximum advised speed is 25 mph in all conditions."
      },
      {
        "value": "4",
        "label": "Minimum advised speed limit is 25 mph in all conditions."
      }
    ]
  }
];

export const QUIZ_META = {
  english: { title: 'English Driver Questionnaire', durationMin: 10, endpoint: 'english', stateKey: 'english' },
  hos: { title: 'Hours of Service Questionnaire', durationMin: 10, endpoint: 'hours-of-service', stateKey: 'hos' },
  preTrip: { title: 'Pre-Trip Inspection Questionnaire', durationMin: 10, endpoint: 'pre-trip', stateKey: 'preTrip' },
  traffic: { title: 'Traffic & Road Sign Test', durationMin: 30, endpoint: 'traffic-signs', stateKey: 'traffic' },
};

/** Answer keys — same as QuizAnswerService */
export const HOS_CORRECT = {
  hos_regulations: 'All of these answers are correct',
  hos_stands: 'Hours of Service',
  dot_stands: 'Department of Transportation',
  logbook_inspect: 'All of these answers are correct',
  max_limits: 'The 14 hour on duty limit, the 11 hours driving time limit, and the 60/70 hour on duty limit',
  on_duty_limit:
    'From the time you first go on duty after a 10 consecutive hour break, you are allowed 14 consecutive hours to use your 11-hour drive time',
  eleven_hour_limit:
    'Once you have driven a total of 11 hours in any consecutive hours of on duty time, you have reached the driving limit and must be off duty for another 10 consecutive hours before driving your truck again',
  thirtyfour_restart:
    'The regulations allow you to restart your 60 or 70-hour clock calculations after having at least 34 consecutive hours off duty',
  off_duty_time: 'When you are relieved of all duty and responsibility for performing work',
  on_duty_time: 'All of these are considered on duty time',
};

export const PRETRIP_CORRECT = {
  degree_of_play: '45',
  air_line_color: 'Red',
  missing_nut_bolts: 'Steering column and gear box.',
  prevent_damage: 'Landing Gear',
  intersecting_cracks: '2',
  minimum_tread_depth: "4/32'",
  mud_flaps: 'True',
  inspection_required: 'A and C',
  brake_shoe_lining: 'True',
  proper_inspection: 'Out of Service Violations',
};

export const TRAFFIC_CORRECT = {
  question_1: '3',
  question_2: '1',
  question_3: '2',
  question_4: '3',
  question_5: '3',
  question_6: '1',
  question_7: '4',
  question_8: '3',
  question_9: '4',
  question_10: '3',
  question_11: '3',
  question_12: '2',
  question_13: '4',
  question_14: '2',
  question_15: '4',
  question_16: '3',
  question_17: '2',
  question_18: '2',
  question_19: '3',
  question_20: '2',
  question_21: '2',
  question_22: '1',
  question_23: '2',
  question_24: '2',
  question_25: '4',
  question_26: '1',
  question_27: '1',
  question_28: '1',
  question_29: '3',
  question_30: '1',
};

