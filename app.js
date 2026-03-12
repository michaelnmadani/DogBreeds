/* ============================================================
   DOG BREED FINDER — app.js
   ============================================================ */

// ── QUESTIONS ─────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'exercise',
    category: 'Lifestyle',
    text: 'How much exercise can you provide each day?',
    layout: 'cols-2',
    options: [
      { value: 'low',    icon: '🛋️',  label: 'Very little',    desc: 'Short walks, mostly indoor' },
      { value: 'medium', icon: '🚶',  label: 'Moderate',        desc: '30–60 min walks daily' },
      { value: 'high',   icon: '🏃',  label: 'Active',          desc: '1–2 hours of activity' },
      { value: 'very',   icon: '🏔️',  label: 'Very active',    desc: 'Running, hiking, sports' },
    ],
  },
  {
    id: 'space',
    category: 'Home',
    text: 'What does your living space look like?',
    layout: 'cols-2',
    options: [
      { value: 'apartment',        icon: '🏢', label: 'Small apartment',       desc: 'No outdoor space' },
      { value: 'apartment_access', icon: '🏙️', label: 'Apartment + park',      desc: 'Easy access to outdoors' },
      { value: 'house_small',      icon: '🏡', label: 'House, small yard',      desc: 'Some outdoor space' },
      { value: 'house_large',      icon: '🌳', label: 'House, large yard',      desc: 'Plenty of room to roam' },
    ],
  },
  {
    id: 'children',
    category: 'Family',
    text: 'Do you have children at home?',
    layout: '',
    options: [
      { value: 'none',   icon: '🧑',  label: 'No children',           desc: 'Adults only household' },
      { value: 'young',  icon: '👶',  label: 'Young children (< 8)',   desc: 'Toddlers or young kids' },
      { value: 'older',  icon: '🧒',  label: 'Older children (8+)',    desc: 'School-age or teens' },
    ],
  },
  {
    id: 'pets',
    category: 'Family',
    text: 'Do you have other pets?',
    layout: 'cols-2',
    options: [
      { value: 'none',   icon: '🚫', label: 'No other pets',  desc: 'The dog will be solo' },
      { value: 'dogs',   icon: '🐕', label: 'Other dogs',     desc: 'Already have a dog' },
      { value: 'cats',   icon: '🐈', label: 'Cats',           desc: 'Cat(s) in the house' },
      { value: 'both',   icon: '🐾', label: 'Dogs & cats',    desc: 'A full house!' },
    ],
  },
  {
    id: 'alone',
    category: 'Lifestyle',
    text: 'How many hours will the dog be alone each day?',
    layout: 'cols-2',
    options: [
      { value: 'rarely',  icon: '🏠', label: 'Rarely',      desc: 'Almost always home' },
      { value: 'few',     icon: '⏱️', label: '2–4 hours',   desc: 'Part of the day' },
      { value: 'half',    icon: '🕐', label: '4–8 hours',   desc: 'Full work day' },
      { value: 'long',    icon: '🕗', label: '8+ hours',    desc: 'Long working hours' },
    ],
  },
  {
    id: 'size',
    category: 'Preferences',
    text: 'What size dog do you prefer?',
    layout: 'cols-2',
    options: [
      { value: 'small',   icon: '🐩', label: 'Small',        desc: 'Under 10 kg (22 lb)' },
      { value: 'medium',  icon: '🐕', label: 'Medium',       desc: '10–25 kg (22–55 lb)' },
      { value: 'large',   icon: '🐕‍🦺', label: 'Large',       desc: '25–45 kg (55–100 lb)' },
      { value: 'any',     icon: '✨', label: 'No preference', desc: 'Open to any size' },
    ],
  },
  {
    id: 'shedding',
    category: 'Preferences',
    text: 'How do you feel about dog hair and shedding?',
    layout: '',
    options: [
      { value: 'none',     icon: '🙅', label: 'Minimal shedding',    desc: 'I hate finding hair everywhere' },
      { value: 'some',     icon: '😐', label: 'Some shedding is fine', desc: 'A little fur is okay' },
      { value: 'heavy',    icon: '😄', label: 'Heavy shedding is fine', desc: 'I love fluffy dogs, bring it on' },
    ],
  },
  {
    id: 'grooming',
    category: 'Preferences',
    text: 'How much grooming effort are you willing to put in?',
    layout: '',
    options: [
      { value: 'low',     icon: '✂️', label: 'Minimal',    desc: 'Quick brush occasionally' },
      { value: 'medium',  icon: '🪮', label: 'Moderate',   desc: 'Regular brushing, occasional salon' },
      { value: 'high',    icon: '💅', label: 'High',       desc: 'Happy to groom regularly or visit a groomer' },
    ],
  },
  {
    id: 'experience',
    category: 'Owner',
    text: 'What is your experience level with dogs?',
    layout: '',
    options: [
      { value: 'first',  icon: '🌱', label: 'First-time owner',   desc: 'Never owned a dog before' },
      { value: 'some',   icon: '📖', label: 'Some experience',    desc: 'Had dogs growing up or in the past' },
      { value: 'expert', icon: '🏅', label: 'Very experienced',   desc: 'Confident with training and behaviour' },
    ],
  },
  {
    id: 'temperament',
    category: 'Preferences',
    text: 'What temperament appeals to you most?',
    layout: 'cols-2',
    options: [
      { value: 'calm',        icon: '😴', label: 'Calm & gentle',       desc: 'Relaxed, low-key companion' },
      { value: 'playful',     icon: '🎾', label: 'Playful & energetic', desc: 'Always ready for fun' },
      { value: 'independent', icon: '🦅', label: 'Independent',         desc: 'Confident, not needy' },
      { value: 'affectionate',icon: '🤗', label: 'Affectionate & cuddly', desc: 'Loves being close to you' },
    ],
  },
  {
    id: 'strangers',
    category: 'Social',
    text: 'How should the dog behave around strangers?',
    layout: '',
    options: [
      { value: 'friendly',   icon: '👋', label: 'Friendly with everyone', desc: 'Loves meeting new people' },
      { value: 'selective',  icon: '🤔', label: 'Selective',              desc: 'Warms up after an introduction' },
      { value: 'protective', icon: '🛡️', label: 'Protective',            desc: 'Reserved and watchful' },
    ],
  },
  {
    id: 'climate',
    category: 'Environment',
    text: 'What is the climate like where you live?',
    layout: '',
    options: [
      { value: 'hot',      icon: '☀️', label: 'Hot',       desc: 'Warm or tropical climate' },
      { value: 'moderate', icon: '🌤️', label: 'Moderate',  desc: 'Mild, temperate climate' },
      { value: 'cold',     icon: '❄️', label: 'Cold',      desc: 'Cold winters, snow possible' },
    ],
  },
];

// ── BREED DATABASE ─────────────────────────────────────────────────────────────
// Each breed has weighted trait scores (0–3) across each answer dimension.
// The recommendation engine sums matching weights from the user's answers.

const BREEDS = [
  {
    name: 'Labrador Retriever',
    apiName: 'retriever/labrador',
    tags: ['Family-friendly', 'Easy to train', 'Adaptable'],
    traits: {
      exercise:    { low: 0, medium: 2, high: 3, very: 2 },
      space:       { apartment: 0, apartment_access: 1, house_small: 3, house_large: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 2, both: 3 },
      alone:       { rarely: 3, few: 3, half: 2, long: 0 },
      size:        { small: 0, medium: 1, large: 3, any: 3 },
      shedding:    { none: 0, some: 2, heavy: 3 },
      grooming:    { low: 3, medium: 2, high: 1 },
      experience:  { first: 3, some: 3, expert: 2 },
      temperament: { calm: 2, playful: 3, independent: 0, affectionate: 3 },
      strangers:   { friendly: 3, selective: 1, protective: 0 },
      climate:     { hot: 1, moderate: 3, cold: 2 },
    },
    reasons: {
      exercise_high:     'Thrives with active daily exercise',
      children_young:    'Famously gentle and patient with young children',
      experience_first:  'One of the easiest breeds to train — great for first-timers',
      temperament_playful: 'Energetic and playful by nature',
      temperament_affectionate: 'Incredibly loving and devoted to family',
    },
  },
  {
    name: 'Golden Retriever',
    apiName: 'retriever/golden',
    tags: ['Family-friendly', 'Gentle', 'Trainable'],
    traits: {
      exercise:    { low: 0, medium: 2, high: 3, very: 2 },
      space:       { apartment: 0, apartment_access: 1, house_small: 3, house_large: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 3, half: 1, long: 0 },
      size:        { small: 0, medium: 1, large: 3, any: 3 },
      shedding:    { none: 0, some: 1, heavy: 3 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      temperament: { calm: 2, playful: 3, independent: 0, affectionate: 3 },
      strangers:   { friendly: 3, selective: 2, protective: 0 },
      climate:     { hot: 1, moderate: 3, cold: 2 },
    },
    reasons: {
      children_young:    'Exceptionally gentle — a classic family dog',
      pets_cats:         'Naturally accepting of cats and other animals',
      experience_first:  'Eager to please, simple to train',
      temperament_affectionate: 'Devoted and deeply loving',
    },
  },
  {
    name: 'French Bulldog',
    apiName: 'bulldog/french',
    tags: ['Low exercise', 'Apartment-friendly', 'Compact'],
    traits: {
      exercise:    { low: 3, medium: 3, high: 1, very: 0 },
      space:       { apartment: 3, apartment_access: 3, house_small: 3, house_large: 2 },
      children:    { none: 3, young: 2, older: 3 },
      pets:        { none: 3, dogs: 2, cats: 2, both: 2 },
      alone:       { rarely: 3, few: 2, half: 2, long: 1 },
      size:        { small: 3, medium: 1, large: 0, any: 3 },
      shedding:    { none: 2, some: 3, heavy: 1 },
      grooming:    { low: 3, medium: 2, high: 1 },
      experience:  { first: 3, some: 2, expert: 2 },
      temperament: { calm: 3, playful: 2, independent: 2, affectionate: 3 },
      strangers:   { friendly: 2, selective: 3, protective: 1 },
      climate:     { hot: 0, moderate: 3, cold: 2 },
    },
    reasons: {
      space_apartment: 'Perfectly sized for apartment living',
      exercise_low:    'Happy with short walks — no intense exercise needed',
      experience_first: 'Low-maintenance and adaptable for new owners',
      temperament_calm: 'A laid-back, easy-going companion',
    },
  },
  {
    name: 'Border Collie',
    apiName: 'collie/border',
    tags: ['Highly intelligent', 'Energetic', 'Athletic'],
    traits: {
      exercise:    { low: 0, medium: 0, high: 2, very: 3 },
      space:       { apartment: 0, apartment_access: 0, house_small: 2, house_large: 3 },
      children:    { none: 2, young: 1, older: 3 },
      pets:        { none: 3, dogs: 2, cats: 1, both: 1 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      size:        { small: 0, medium: 3, large: 1, any: 3 },
      shedding:    { none: 0, some: 2, heavy: 3 },
      grooming:    { low: 1, medium: 3, high: 2 },
      experience:  { first: 0, some: 1, expert: 3 },
      temperament: { calm: 0, playful: 3, independent: 2, affectionate: 2 },
      strangers:   { friendly: 1, selective: 3, protective: 2 },
      climate:     { hot: 1, moderate: 3, cold: 3 },
    },
    reasons: {
      exercise_very:    'Needs intense daily exercise — perfect for very active owners',
      experience_expert: 'Thrives with experienced, engaged owners',
      space_house_large: 'Loves having room to run and explore',
      temperament_playful: 'Exceptionally energetic and playful',
    },
  },
  {
    name: 'Poodle (Standard)',
    apiName: 'poodle/standard',
    tags: ['Low-shedding', 'Highly trainable', 'Hypoallergenic'],
    traits: {
      exercise:    { low: 0, medium: 2, high: 3, very: 2 },
      space:       { apartment: 1, apartment_access: 2, house_small: 3, house_large: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 2, both: 3 },
      alone:       { rarely: 3, few: 2, half: 2, long: 1 },
      size:        { small: 0, medium: 1, large: 3, any: 3 },
      shedding:    { none: 3, some: 2, heavy: 0 },
      grooming:    { low: 0, medium: 2, high: 3 },
      experience:  { first: 2, some: 3, expert: 3 },
      temperament: { calm: 2, playful: 2, independent: 1, affectionate: 3 },
      strangers:   { friendly: 2, selective: 3, protective: 1 },
      climate:     { hot: 2, moderate: 3, cold: 2 },
    },
    reasons: {
      shedding_none: 'One of the best choices for allergy sufferers — minimal shedding',
      experience_first: 'Highly intelligent and eager to please',
      temperament_affectionate: 'Deeply bonded and loving with family',
    },
  },
  {
    name: 'Cavalier King Charles Spaniel',
    apiName: 'spaniel/cocker',
    tags: ['Gentle', 'Affectionate', 'Adaptable'],
    traits: {
      exercise:    { low: 3, medium: 3, high: 1, very: 0 },
      space:       { apartment: 3, apartment_access: 3, house_small: 3, house_large: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      size:        { small: 3, medium: 1, large: 0, any: 3 },
      shedding:    { none: 0, some: 2, heavy: 2 },
      grooming:    { low: 1, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      temperament: { calm: 3, playful: 2, independent: 0, affectionate: 3 },
      strangers:   { friendly: 3, selective: 2, protective: 0 },
      climate:     { hot: 2, moderate: 3, cold: 1 },
    },
    reasons: {
      space_apartment:  'Small, adaptable — thrives in apartments',
      temperament_affectionate: 'Extraordinarily affectionate and people-oriented',
      children_young:  'Exceptionally gentle with young children',
      experience_first: 'Calm temperament makes them easy for new owners',
    },
  },
  {
    name: 'German Shepherd',
    apiName: 'germanshepherd',
    tags: ['Loyal', 'Protective', 'Versatile'],
    traits: {
      exercise:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { apartment: 0, apartment_access: 0, house_small: 2, house_large: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 3, dogs: 2, cats: 1, both: 1 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      size:        { small: 0, medium: 0, large: 3, any: 3 },
      shedding:    { none: 0, some: 1, heavy: 3 },
      grooming:    { low: 2, medium: 3, high: 2 },
      experience:  { first: 1, some: 2, expert: 3 },
      temperament: { calm: 1, playful: 2, independent: 2, affectionate: 2 },
      strangers:   { friendly: 0, selective: 2, protective: 3 },
      climate:     { hot: 1, moderate: 3, cold: 3 },
    },
    reasons: {
      strangers_protective: 'Natural protector — highly loyal to family',
      exercise_high:        'Energetic and loves vigorous exercise',
      experience_expert:    'Thrives with confident, consistent training',
    },
  },
  {
    name: 'Shih Tzu',
    apiName: 'shihtzu',
    tags: ['Low exercise', 'Apartment-friendly', 'Companion'],
    traits: {
      exercise:    { low: 3, medium: 2, high: 0, very: 0 },
      space:       { apartment: 3, apartment_access: 3, house_small: 3, house_large: 2 },
      children:    { none: 3, young: 2, older: 3 },
      pets:        { none: 3, dogs: 2, cats: 2, both: 2 },
      alone:       { rarely: 3, few: 2, half: 2, long: 1 },
      size:        { small: 3, medium: 0, large: 0, any: 3 },
      shedding:    { none: 3, some: 2, heavy: 0 },
      grooming:    { low: 0, medium: 2, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      temperament: { calm: 3, playful: 2, independent: 1, affectionate: 3 },
      strangers:   { friendly: 2, selective: 3, protective: 1 },
      climate:     { hot: 1, moderate: 3, cold: 2 },
    },
    reasons: {
      space_apartment: 'Tiny size makes them ideal apartment dogs',
      shedding_none:   'Minimal shedding — hair-friendly home',
      exercise_low:    'Happy with gentle walks and indoor play',
      temperament_calm: 'Sweet, gentle, and very calm indoors',
    },
  },
  {
    name: 'Beagle',
    apiName: 'beagle',
    tags: ['Sociable', 'Curious', 'Family-friendly'],
    traits: {
      exercise:    { low: 0, medium: 3, high: 3, very: 2 },
      space:       { apartment: 1, apartment_access: 2, house_small: 3, house_large: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 2, both: 2 },
      alone:       { rarely: 2, few: 2, half: 1, long: 0 },
      size:        { small: 2, medium: 3, large: 0, any: 3 },
      shedding:    { none: 0, some: 3, heavy: 2 },
      grooming:    { low: 3, medium: 2, high: 0 },
      experience:  { first: 2, some: 3, expert: 2 },
      temperament: { calm: 1, playful: 3, independent: 2, affectionate: 2 },
      strangers:   { friendly: 3, selective: 2, protective: 0 },
      climate:     { hot: 2, moderate: 3, cold: 2 },
    },
    reasons: {
      children_young:  'Great with kids — loves to play and is very sociable',
      pets_dogs:       'Pack dog — loves being around other dogs',
      exercise_medium: 'Perfect for moderately active families',
    },
  },
  {
    name: 'Dachshund',
    apiName: 'dachshund',
    tags: ['Spirited', 'Compact', 'Brave'],
    traits: {
      exercise:    { low: 2, medium: 3, high: 1, very: 0 },
      space:       { apartment: 3, apartment_access: 3, house_small: 3, house_large: 2 },
      children:    { none: 3, young: 1, older: 2 },
      pets:        { none: 3, dogs: 2, cats: 1, both: 1 },
      alone:       { rarely: 2, few: 2, half: 2, long: 1 },
      size:        { small: 3, medium: 1, large: 0, any: 3 },
      shedding:    { none: 2, some: 3, heavy: 1 },
      grooming:    { low: 3, medium: 2, high: 1 },
      experience:  { first: 2, some: 3, expert: 2 },
      temperament: { calm: 1, playful: 2, independent: 3, affectionate: 2 },
      strangers:   { friendly: 1, selective: 3, protective: 2 },
      climate:     { hot: 2, moderate: 3, cold: 1 },
    },
    reasons: {
      space_apartment: 'Compact body — fits any living space',
      temperament_independent: 'Confident and independent personality',
      size_small:      'Conveniently small and portable',
    },
  },
  {
    name: 'Siberian Husky',
    apiName: 'husky',
    tags: ['Athletic', 'High-energy', 'Striking'],
    traits: {
      exercise:    { low: 0, medium: 0, high: 2, very: 3 },
      space:       { apartment: 0, apartment_access: 0, house_small: 1, house_large: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 0, both: 1 },
      alone:       { rarely: 2, few: 1, half: 1, long: 0 },
      size:        { small: 0, medium: 2, large: 3, any: 3 },
      shedding:    { none: 0, some: 0, heavy: 3 },
      grooming:    { low: 1, medium: 3, high: 2 },
      experience:  { first: 0, some: 1, expert: 3 },
      temperament: { calm: 0, playful: 3, independent: 3, affectionate: 1 },
      strangers:   { friendly: 3, selective: 1, protective: 0 },
      climate:     { hot: 0, moderate: 2, cold: 3 },
    },
    reasons: {
      exercise_very:    'Born for high-intensity activity — ideal for runners',
      climate_cold:     'Built for cold climates — thrives in the snow',
      space_house_large: 'Needs lots of space to move and explore',
    },
  },
  {
    name: 'Corgi (Pembroke Welsh)',
    apiName: 'corgi',
    tags: ['Intelligent', 'Spirited', 'Adaptable'],
    traits: {
      exercise:    { low: 0, medium: 3, high: 3, very: 1 },
      space:       { apartment: 1, apartment_access: 2, house_small: 3, house_large: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 2, both: 2 },
      alone:       { rarely: 3, few: 3, half: 2, long: 1 },
      size:        { small: 2, medium: 3, large: 0, any: 3 },
      shedding:    { none: 0, some: 1, heavy: 3 },
      grooming:    { low: 2, medium: 3, high: 1 },
      experience:  { first: 2, some: 3, expert: 3 },
      temperament: { calm: 1, playful: 3, independent: 2, affectionate: 2 },
      strangers:   { friendly: 2, selective: 3, protective: 1 },
      climate:     { hot: 1, moderate: 3, cold: 3 },
    },
    reasons: {
      temperament_playful: 'Lively, fun and full of personality',
      exercise_medium:     'A great balance of activity and chill time',
      children_older:      'Gets along brilliantly with older children',
    },
  },
  {
    name: 'Boxer',
    apiName: 'boxer',
    tags: ['Playful', 'Loyal', 'Protective'],
    traits: {
      exercise:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { apartment: 0, apartment_access: 1, house_small: 3, house_large: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 3, dogs: 2, cats: 1, both: 1 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      size:        { small: 0, medium: 0, large: 3, any: 3 },
      shedding:    { none: 1, some: 3, heavy: 2 },
      grooming:    { low: 3, medium: 2, high: 1 },
      experience:  { first: 1, some: 2, expert: 3 },
      temperament: { calm: 0, playful: 3, independent: 1, affectionate: 3 },
      strangers:   { friendly: 1, selective: 2, protective: 3 },
      climate:     { hot: 1, moderate: 3, cold: 1 },
    },
    reasons: {
      children_young:      'Patient and gentle giant with children',
      strangers_protective: 'Naturally alert and protective of family',
      temperament_playful:  'Boundless energy and enthusiasm for play',
    },
  },
  {
    name: 'Maltese',
    apiName: 'maltese',
    tags: ['Low-shedding', 'Elegant', 'Devoted'],
    traits: {
      exercise:    { low: 3, medium: 2, high: 0, very: 0 },
      space:       { apartment: 3, apartment_access: 3, house_small: 2, house_large: 2 },
      children:    { none: 3, young: 1, older: 2 },
      pets:        { none: 3, dogs: 2, cats: 2, both: 2 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      size:        { small: 3, medium: 0, large: 0, any: 3 },
      shedding:    { none: 3, some: 2, heavy: 0 },
      grooming:    { low: 0, medium: 2, high: 3 },
      experience:  { first: 2, some: 3, expert: 2 },
      temperament: { calm: 2, playful: 2, independent: 0, affectionate: 3 },
      strangers:   { friendly: 2, selective: 3, protective: 1 },
      climate:     { hot: 2, moderate: 3, cold: 1 },
    },
    reasons: {
      shedding_none:   'Virtually no shedding — great for a tidy home',
      space_apartment: 'Tiny and perfectly suited to apartment life',
      temperament_affectionate: 'Deeply devoted lap dog',
    },
  },
  {
    name: 'Australian Shepherd',
    apiName: 'shepherd/australian',
    tags: ['Energetic', 'Highly trainable', 'Agile'],
    traits: {
      exercise:    { low: 0, medium: 0, high: 2, very: 3 },
      space:       { apartment: 0, apartment_access: 0, house_small: 2, house_large: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 1, both: 2 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      size:        { small: 0, medium: 2, large: 2, any: 3 },
      shedding:    { none: 0, some: 2, heavy: 3 },
      grooming:    { low: 1, medium: 3, high: 2 },
      experience:  { first: 1, some: 2, expert: 3 },
      temperament: { calm: 0, playful: 3, independent: 2, affectionate: 2 },
      strangers:   { friendly: 1, selective: 3, protective: 2 },
      climate:     { hot: 1, moderate: 3, cold: 3 },
    },
    reasons: {
      exercise_very:    'Excels with intense exercise and mental stimulation',
      experience_expert: 'Loves learning — thrives with an engaged, active owner',
      space_house_large: 'Room to run brings out the best in this breed',
    },
  },
  {
    name: 'Great Dane',
    apiName: 'dane/great',
    tags: ['Gentle giant', 'Calm', 'Loyal'],
    traits: {
      exercise:    { low: 1, medium: 3, high: 2, very: 1 },
      space:       { apartment: 0, apartment_access: 0, house_small: 2, house_large: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 3, dogs: 2, cats: 1, both: 1 },
      alone:       { rarely: 3, few: 3, half: 2, long: 1 },
      size:        { small: 0, medium: 0, large: 1, any: 3 },
      shedding:    { none: 0, some: 3, heavy: 2 },
      grooming:    { low: 3, medium: 2, high: 0 },
      experience:  { first: 1, some: 2, expert: 3 },
      temperament: { calm: 3, playful: 2, independent: 1, affectionate: 2 },
      strangers:   { friendly: 2, selective: 2, protective: 2 },
      climate:     { hot: 1, moderate: 3, cold: 1 },
    },
    reasons: {
      temperament_calm:  'Despite their size, Danes are calm and gentle',
      space_house_large: 'Needs space — a large home suits this gentle giant',
      children_older:    'Patient and loving with older children',
    },
  },
  {
    name: 'Bichon Frisé',
    apiName: 'bichon',
    tags: ['Hypoallergenic', 'Cheerful', 'Adaptable'],
    traits: {
      exercise:    { low: 2, medium: 3, high: 1, very: 0 },
      space:       { apartment: 3, apartment_access: 3, house_small: 3, house_large: 2 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      size:        { small: 3, medium: 0, large: 0, any: 3 },
      shedding:    { none: 3, some: 2, heavy: 0 },
      grooming:    { low: 0, medium: 2, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      temperament: { calm: 2, playful: 2, independent: 0, affectionate: 3 },
      strangers:   { friendly: 3, selective: 2, protective: 0 },
      climate:     { hot: 2, moderate: 3, cold: 2 },
    },
    reasons: {
      shedding_none:   'Hypoallergenic coat — excellent for allergy sufferers',
      space_apartment: 'Perfectly suited to apartment living',
      pets_cats:       'Gets along beautifully with cats and other animals',
      experience_first: 'Happy, easy-going temperament ideal for new owners',
    },
  },
  {
    name: 'Rottweiler',
    apiName: 'rottweiler',
    tags: ['Protective', 'Powerful', 'Loyal'],
    traits: {
      exercise:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { apartment: 0, apartment_access: 0, house_small: 2, house_large: 3 },
      children:    { none: 2, young: 1, older: 2 },
      pets:        { none: 3, dogs: 1, cats: 0, both: 0 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      size:        { small: 0, medium: 0, large: 3, any: 3 },
      shedding:    { none: 0, some: 2, heavy: 3 },
      grooming:    { low: 3, medium: 2, high: 0 },
      experience:  { first: 0, some: 1, expert: 3 },
      temperament: { calm: 2, playful: 1, independent: 2, affectionate: 2 },
      strangers:   { friendly: 0, selective: 1, protective: 3 },
      climate:     { hot: 1, moderate: 3, cold: 2 },
    },
    reasons: {
      strangers_protective: 'Outstanding guard and protection dog',
      exercise_high:        'Powerful and benefits from strong, consistent exercise',
      experience_expert:    'Best with an experienced, confident owner',
    },
  },
  {
    name: 'Pomeranian',
    apiName: 'pomeranian',
    tags: ['Lively', 'Bold', 'Compact'],
    traits: {
      exercise:    { low: 2, medium: 3, high: 1, very: 0 },
      space:       { apartment: 3, apartment_access: 3, house_small: 3, house_large: 2 },
      children:    { none: 3, young: 1, older: 2 },
      pets:        { none: 3, dogs: 2, cats: 2, both: 2 },
      alone:       { rarely: 2, few: 2, half: 2, long: 1 },
      size:        { small: 3, medium: 0, large: 0, any: 3 },
      shedding:    { none: 0, some: 1, heavy: 3 },
      grooming:    { low: 0, medium: 2, high: 3 },
      experience:  { first: 2, some: 3, expert: 2 },
      temperament: { calm: 1, playful: 3, independent: 2, affectionate: 2 },
      strangers:   { friendly: 2, selective: 3, protective: 2 },
      climate:     { hot: 1, moderate: 3, cold: 3 },
    },
    reasons: {
      space_apartment: 'Tiny size makes them excellent for small spaces',
      size_small:      'Wonderfully portable and easy to handle',
      temperament_playful: 'Bright, lively personality in a small package',
    },
  },
  {
    name: 'Whippet',
    apiName: 'whippet',
    tags: ['Gentle', 'Athletic', 'Quiet indoors'],
    traits: {
      exercise:    { low: 1, medium: 2, high: 3, very: 2 },
      space:       { apartment: 2, apartment_access: 3, house_small: 3, house_large: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 1, both: 1 },
      alone:       { rarely: 3, few: 3, half: 2, long: 1 },
      size:        { small: 0, medium: 3, large: 1, any: 3 },
      shedding:    { none: 2, some: 3, heavy: 1 },
      grooming:    { low: 3, medium: 2, high: 0 },
      experience:  { first: 2, some: 3, expert: 2 },
      temperament: { calm: 3, playful: 2, independent: 1, affectionate: 2 },
      strangers:   { friendly: 2, selective: 3, protective: 1 },
      climate:     { hot: 2, moderate: 3, cold: 1 },
    },
    reasons: {
      temperament_calm: 'Surprisingly calm indoors despite athletic build',
      shedding_none:    'Very low-maintenance short coat',
      space_apartment_access: 'Quiet at home, sprints outside — great balance',
    },
  },
  {
    name: 'Irish Setter',
    apiName: 'setter/irish',
    tags: ['Energetic', 'Friendly', 'Beautiful'],
    traits: {
      exercise:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { apartment: 0, apartment_access: 0, house_small: 2, house_large: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 2, both: 2 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      size:        { small: 0, medium: 0, large: 3, any: 3 },
      shedding:    { none: 0, some: 2, heavy: 3 },
      grooming:    { low: 1, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 2 },
      temperament: { calm: 0, playful: 3, independent: 1, affectionate: 3 },
      strangers:   { friendly: 3, selective: 2, protective: 0 },
      climate:     { hot: 1, moderate: 3, cold: 2 },
    },
    reasons: {
      exercise_high:       'Thrives with lots of vigorous exercise',
      children_young:      'Enthusiastic and loving with children of all ages',
      strangers_friendly:  'One of the most sociable and outgoing breeds',
    },
  },
  {
    name: 'Basset Hound',
    apiName: 'hound/basset',
    tags: ['Laid-back', 'Gentle', 'Scent hound'],
    traits: {
      exercise:    { low: 3, medium: 3, high: 0, very: 0 },
      space:       { apartment: 2, apartment_access: 3, house_small: 3, house_large: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 2, both: 2 },
      alone:       { rarely: 2, few: 2, half: 2, long: 1 },
      size:        { small: 0, medium: 2, large: 2, any: 3 },
      shedding:    { none: 0, some: 2, heavy: 2 },
      grooming:    { low: 3, medium: 2, high: 0 },
      experience:  { first: 2, some: 3, expert: 2 },
      temperament: { calm: 3, playful: 1, independent: 2, affectionate: 2 },
      strangers:   { friendly: 2, selective: 3, protective: 1 },
      climate:     { hot: 1, moderate: 3, cold: 2 },
    },
    reasons: {
      exercise_low:     'Happy with slow-paced, relaxed walks',
      temperament_calm: 'One of the calmest, most laid-back breeds',
      children_young:   'Patient and docile with young children',
    },
  },
  {
    name: 'Yorkshire Terrier',
    apiName: 'terrier/yorkshire',
    tags: ['Feisty', 'Low-shedding', 'Portable'],
    traits: {
      exercise:    { low: 2, medium: 3, high: 1, very: 0 },
      space:       { apartment: 3, apartment_access: 3, house_small: 3, house_large: 2 },
      children:    { none: 3, young: 0, older: 2 },
      pets:        { none: 3, dogs: 1, cats: 1, both: 0 },
      alone:       { rarely: 2, few: 2, half: 2, long: 1 },
      size:        { small: 3, medium: 0, large: 0, any: 3 },
      shedding:    { none: 3, some: 2, heavy: 0 },
      grooming:    { low: 0, medium: 2, high: 3 },
      experience:  { first: 2, some: 3, expert: 2 },
      temperament: { calm: 0, playful: 2, independent: 3, affectionate: 2 },
      strangers:   { friendly: 1, selective: 3, protective: 2 },
      climate:     { hot: 2, moderate: 3, cold: 2 },
    },
    reasons: {
      shedding_none:    'Almost no shedding — perfect for keeping the house clean',
      size_small:       'Tiny, portable, and easy to carry anywhere',
      space_apartment:  'Big personality in a very small package',
    },
  },
];

// ── RECOMMENDATION ENGINE ─────────────────────────────────────────────────────

function scoreBreeds(answers) {
  return BREEDS.map(breed => {
    let score = 0;
    const matchedReasonKeys = [];

    QUESTIONS.forEach(q => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;
      const traitMap = breed.traits[q.id];
      if (!traitMap) return;
      const weight = traitMap[userAnswer] || 0;
      score += weight;

      // Collect reason key if we have a matching canned reason
      const key = `${q.id}_${userAnswer}`;
      if (breed.reasons && breed.reasons[key]) {
        matchedReasonKeys.push(key);
      }
    });

    // Fallback: pick first 2 generic reasons if none matched
    const allReasonKeys = Object.keys(breed.reasons || {});
    const usedKeys = matchedReasonKeys.length > 0 ? matchedReasonKeys : allReasonKeys.slice(0, 2);
    const reasons = [...new Set(usedKeys)].slice(0, 3).map(k => breed.reasons[k]);

    return { breed, score, reasons };
  }).sort((a, b) => b.score - a.score);
}

// Maximum possible score (all 3s across 12 questions)
const MAX_SCORE = QUESTIONS.length * 3;

// ── QUIZ STATE ─────────────────────────────────────────────────────────────────

const state = {
  current: 0,
  answers: {},
};

// ── DOM HELPERS ───────────────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function updateProgress(index) {
  const total = QUESTIONS.length;
  const pct = Math.round((index / total) * 100);

  const wrapper = document.getElementById('progressWrapper');
  wrapper.classList.toggle('visible', index > 0);

  document.getElementById('progressText').textContent = `Question ${Math.min(index + 1, total)} of ${total}`;
  document.getElementById('progressPct').textContent = `${pct}%`;

  const fill = document.getElementById('progressFill');
  fill.style.width = `${pct}%`;

  const bar = document.getElementById('progressBar');
  bar.setAttribute('aria-valuenow', pct);

  // Dots
  const dotsEl = document.getElementById('progressDots');
  dotsEl.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    if (i < index) dot.classList.add('done');
    if (i === index) dot.classList.add('current');
    dot.title = `Question ${i + 1}`;
    dotsEl.appendChild(dot);
  }
}

// ── QUESTION RENDERER ─────────────────────────────────────────────────────────

function renderQuestion(index) {
  const q = QUESTIONS[index];
  const card = document.getElementById('questionCard');

  // Animate out then in
  card.style.opacity = '0';
  card.style.transform = 'translateY(12px)';

  setTimeout(() => {
    document.getElementById('questionNumber').textContent = `${index + 1} / ${QUESTIONS.length}`;
    document.getElementById('questionCategory').textContent = q.category;
    document.getElementById('questionText').textContent = q.text;

    const grid = document.getElementById('optionsGrid');
    grid.className = 'options-grid' + (q.layout ? ` ${q.layout}` : '');
    grid.innerHTML = '';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      if (state.answers[q.id] === opt.value) btn.classList.add('selected');
      btn.setAttribute('aria-pressed', state.answers[q.id] === opt.value ? 'true' : 'false');
      btn.innerHTML = `
        <span class="option-icon" aria-hidden="true">${opt.icon}</span>
        <span class="option-body">
          <span class="option-label">${opt.label}</span>
          ${opt.desc ? `<span class="option-desc">${opt.desc}</span>` : ''}
        </span>
      `;
      btn.addEventListener('click', () => selectOption(q.id, opt.value));
      grid.appendChild(btn);
    });

    document.getElementById('backBtn').disabled = index === 0;

    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  }, 120);

  updateProgress(index);
}

function selectOption(questionId, value) {
  state.answers[questionId] = value;

  // Flash selected state
  const grid = document.getElementById('optionsGrid');
  grid.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
  });
  const selected = [...grid.querySelectorAll('.option-btn')].find(
    btn => btn.querySelector('.option-label').textContent ===
      QUESTIONS[state.current].options.find(o => o.value === value).label
  );
  if (selected) {
    selected.classList.add('selected');
    selected.setAttribute('aria-pressed', 'true');
  }

  // Auto-advance after short delay
  setTimeout(() => {
    if (state.current < QUESTIONS.length - 1) {
      state.current++;
      renderQuestion(state.current);
    } else {
      showResults();
    }
  }, 280);
}

// ── RESULTS BUILDER ───────────────────────────────────────────────────────────

async function fetchBreedImage(apiName) {
  try {
    const res = await fetch(`https://dog.ceo/api/breed/${apiName}/images/random`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.status === 'success' ? data.message : null;
  } catch {
    return null;
  }
}

function buildBreedCard(scored, rank) {
  const { breed, score, reasons } = scored;
  const matchPct = Math.round((score / MAX_SCORE) * 100);

  const card = document.createElement('div');
  card.className = 'breed-card';
  card.style.opacity = '0'; // will fade in

  card.innerHTML = `
    <div class="breed-img-wrap">
      <div class="breed-img-skeleton"></div>
      <span class="breed-rank">#${rank}</span>
    </div>
    <div class="breed-info">
      <div class="breed-top">
        <div class="breed-name">${breed.name}</div>
        <div class="breed-score">
          <div class="breed-score-bar">
            <div class="breed-score-fill" style="width:${matchPct}%"></div>
          </div>
          ${matchPct}% match
        </div>
      </div>
      <div class="breed-tags">
        ${breed.tags.map(t => `<span class="breed-tag">${t}</span>`).join('')}
      </div>
      <div class="breed-reasons-title">Why this breed suits you</div>
      <ul class="breed-reasons">
        ${reasons.filter(Boolean).map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
  `;

  // Load image async
  const imgWrap = card.querySelector('.breed-img-wrap');
  fetchBreedImage(breed.apiName).then(url => {
    const skeleton = imgWrap.querySelector('.breed-img-skeleton');
    if (url) {
      const img = document.createElement('img');
      img.alt = breed.name;
      img.src = url;
      img.onload = () => {
        skeleton.remove();
        imgWrap.appendChild(img);
      };
      img.onerror = () => skeleton.remove();
    } else {
      skeleton.style.backgroundImage = 'none';
      skeleton.style.background = '#e8e6e1';
      skeleton.textContent = '🐶';
      skeleton.style.display = 'flex';
      skeleton.style.alignItems = 'center';
      skeleton.style.justifyContent = 'center';
      skeleton.style.fontSize = '3rem';
    }
  });

  return card;
}

function showResults() {
  showScreen('screenLoading');

  // Animate loading bar
  const bar = document.getElementById('loadingBarFill');
  let progress = 0;
  const interval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18, 90);
    bar.style.width = `${progress}%`;
  }, 150);

  setTimeout(() => {
    clearInterval(interval);
    bar.style.width = '100%';

    const scored = scoreBreeds(state.answers);
    const top5 = scored.slice(0, 5);

    const grid = document.getElementById('resultsGrid');
    grid.innerHTML = '';
    top5.forEach((s, i) => {
      const card = buildBreedCard(s, i + 1);
      grid.appendChild(card);
      // Stagger fade-in
      setTimeout(() => { card.style.opacity = '1'; card.style.transition = 'opacity 0.4s ease'; }, i * 100 + 50);
    });

    updateProgress(QUESTIONS.length);
    document.getElementById('progressText').textContent = 'All done!';
    document.getElementById('progressPct').textContent = '100%';

    setTimeout(() => showScreen('screenResults'), 300);
  }, 1400);
}

// ── INIT ──────────────────────────────────────────────────────────────────────

document.getElementById('startBtn').addEventListener('click', () => {
  showScreen('screenQuiz');
  renderQuestion(0);
});

document.getElementById('backBtn').addEventListener('click', () => {
  if (state.current > 0) {
    state.current--;
    renderQuestion(state.current);
  }
});

document.getElementById('restartBtn').addEventListener('click', () => {
  state.current = 0;
  state.answers = {};
  updateProgress(0);
  document.getElementById('progressWrapper').classList.remove('visible');
  showScreen('screenWelcome');
});
