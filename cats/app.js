/* ============================================================
   CAT BREED FINDER — app.js
   Forked from the Dog Breed Finder (../app.js). Same quiz flow and
   scoring engine, with cat-specific questions and breed data.
   ============================================================ */

// Breeds scoring at least this for coat.allergy are "allergy-friendlier": they get
// a badge, and are the only breeds shown when someone in the home has allergies.
const ALLERGY_FRIENDLY_MIN = 2;

// ── QUESTIONS ─────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'activity',
    category: 'Lifestyle',
    text: 'How much time can you spend playing with your cat each day?',
    layout: 'cols-2',
    options: [
      { value: 'low',    icon: '🛋️', label: 'A little',      desc: 'Under 15 min — a cat that mostly lounges' },
      { value: 'medium', icon: '🧶', label: 'Some',          desc: '15–30 min of wand toys and games' },
      { value: 'high',   icon: '🐁', label: 'Plenty',        desc: '30–60 min of interactive play' },
      { value: 'very',   icon: '🧗', label: 'Lots',          desc: 'Cat trees, puzzle feeders, even harness walks' },
    ],
  },
  {
    id: 'space',
    category: 'Home',
    text: 'What does your home look like?',
    layout: 'cols-2',
    options: [
      { value: 'small_apt', icon: '🏢', label: 'Small apartment',     desc: 'Studio or compact flat' },
      { value: 'apt',       icon: '🏙️', label: 'Roomy apartment',     desc: 'Space for cat trees and window perches' },
      { value: 'house',     icon: '🏡', label: 'House',               desc: 'Multiple rooms and stairs to explore' },
      { value: 'outdoor',   icon: '🌳', label: 'House + catio',       desc: 'Safe enclosed outdoor space or garden' },
    ],
  },
  {
    id: 'children',
    category: 'Family',
    text: 'Do you have children at home?',
    layout: '',
    options: [
      { value: 'none',  icon: '🧑', label: 'No children',          desc: 'Adults only household' },
      { value: 'young', icon: '👶', label: 'Young children (< 8)',  desc: 'Toddlers or young kids' },
      { value: 'older', icon: '🧒', label: 'Older children (8+)',   desc: 'School-age or teens' },
    ],
  },
  {
    id: 'pets',
    category: 'Family',
    text: 'Do you have other pets?',
    layout: 'cols-2',
    options: [
      { value: 'none', icon: '🚫', label: 'No other pets', desc: 'The cat will be solo' },
      { value: 'dogs', icon: '🐕', label: 'Dogs',          desc: 'Dog(s) in the house' },
      { value: 'cats', icon: '🐈', label: 'Other cats',    desc: 'Already have a cat' },
      { value: 'both', icon: '🐾', label: 'Dogs & cats',   desc: 'A full house!' },
    ],
  },
  {
    id: 'alone',
    category: 'Lifestyle',
    text: 'How many hours will the cat be alone each day?',
    layout: 'cols-2',
    options: [
      { value: 'rarely', icon: '🏠', label: 'Rarely',    desc: 'Almost always home' },
      { value: 'few',    icon: '⏱️', label: '2–4 hours', desc: 'Part of the day' },
      { value: 'half',   icon: '🕐', label: '4–8 hours', desc: 'Full work day' },
      { value: 'long',   icon: '🕗', label: '8+ hours',  desc: 'Long hours or frequent travel' },
    ],
  },
  {
    id: 'temperament',
    category: 'Personality',
    text: 'What kind of cat personality appeals to you most?',
    layout: 'cols-2',
    options: [
      { value: 'lap',         icon: '🤗', label: 'Lap cat',              desc: 'Loves cuddles and being held' },
      { value: 'companion',   icon: '👣', label: 'Devoted shadow',       desc: 'Follows you from room to room' },
      { value: 'independent', icon: '🦁', label: 'Independent',          desc: 'Affectionate on their own terms' },
      { value: 'playful',     icon: '🎾', label: 'Playful entertainer',  desc: 'Curious, active and mischievous' },
    ],
  },
  {
    id: 'vocal',
    category: 'Personality',
    text: 'How chatty would you like your cat to be?',
    layout: '',
    options: [
      { value: 'quiet',  icon: '🤫', label: 'Quiet',       desc: 'Soft purrs, the odd meow' },
      { value: 'some',   icon: '💬', label: 'Some chatter', desc: 'Trills and chirps are welcome' },
      { value: 'chatty', icon: '🗣️', label: 'Very chatty',  desc: 'I want a cat that talks back' },
    ],
  },
  {
    id: 'size',
    category: 'Preferences',
    text: 'What size cat do you prefer?',
    layout: 'cols-2',
    options: [
      { value: 'small',  icon: '🐱', label: 'Small',         desc: 'Under 4 kg (9 lb)' },
      { value: 'medium', icon: '🐈', label: 'Medium',        desc: '4–6 kg (9–13 lb)' },
      { value: 'large',  icon: '🦁', label: 'Large',         desc: '6 kg+ (13 lb+)' },
      { value: 'any',    icon: '✨', label: 'No preference', desc: 'Open to any size' },
    ],
  },
  {
    id: 'coat',
    category: 'Preferences',
    text: 'How do you feel about cat hair and allergies?',
    layout: '',
    options: [
      { value: 'fine',     icon: '😄', label: 'Fur is fine',          desc: 'No allergies — fluff welcome' },
      { value: 'low_shed', icon: '🧹', label: 'Prefer low shedding',  desc: 'Less hair on the sofa, please' },
      { value: 'allergy',  icon: '🤧', label: 'Allergies in the home', desc: 'Only show breeds often suggested for allergy sufferers', minWeight: ALLERGY_FRIENDLY_MIN },
    ],
  },
  {
    id: 'grooming',
    category: 'Preferences',
    text: 'How much grooming effort are you willing to put in?',
    layout: '',
    options: [
      { value: 'low',    icon: '✂️', label: 'Minimal',  desc: 'A quick brush now and then' },
      { value: 'medium', icon: '🪮', label: 'Moderate', desc: 'Brushing a couple of times a week' },
      { value: 'high',   icon: '🛁', label: 'High',     desc: 'Daily combing or regular baths are fine' },
    ],
  },
  {
    id: 'experience',
    category: 'Owner',
    text: 'What is your experience level with cats?',
    layout: '',
    options: [
      { value: 'first',  icon: '🌱', label: 'First-time owner',  desc: 'Never owned a cat before' },
      { value: 'some',   icon: '📖', label: 'Some experience',   desc: 'Had cats growing up or in the past' },
      { value: 'expert', icon: '🏅', label: 'Very experienced',  desc: 'Comfortable with demanding breeds' },
    ],
  },
  {
    id: 'household',
    category: 'Social',
    text: 'How lively is your household?',
    layout: '',
    options: [
      { value: 'quiet',      icon: '🕯️', label: 'Calm and quiet',     desc: 'Predictable routine, few visitors' },
      { value: 'occasional', icon: '☕', label: 'Some comings & goings', desc: 'Visitors now and then' },
      { value: 'lively',     icon: '🎉', label: 'Busy and bustling',   desc: 'Lots of noise, guests and activity' },
    ],
  },
];

// ── BREED DATABASE ─────────────────────────────────────────────────────────────
// Each breed has weighted trait scores (0–3) across each answer dimension.
// The recommendation engine sums matching weights from the user's answers.
// catApiId is TheCatAPI breed id (null if not listed); wikiTitle is the fallback image source.
// note is a "good to know" caveat (health, care or legal) shown on every card.

const BREEDS = [
  {
    name: 'Maine Coon',
    catApiId: 'mcoo',
    wikiTitle: 'Maine_Coon',
    tags: ['Gentle giant', 'Family-friendly', 'Sociable'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 0, apt: 1, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 3, half: 2, long: 1 },
      temperament: { lap: 1, companion: 3, independent: 1, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 2 },
      size:        { small: 0, medium: 0, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 0, allergy: 0 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 3 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      children_young:    'Famously patient and gentle with young children',
      pets_dogs:         'Easy-going and typically gets on well with dogs',
      pets_both:         'Sociable with dogs and other cats alike',
      size_large:        'One of the largest domestic breeds — a true gentle giant',
      vocal_some:        'Chats in soft chirps and trills rather than loud meows',
      household_lively:  'Unflappable in a busy, bustling home',
      experience_first:  'Friendly and adaptable — a great first cat',
    },
    note: 'Needs sturdy cat trees and extra-large litter boxes. Ask breeders about heart (HCM) and hip screening.',
  },
  {
    name: 'Ragdoll',
    catApiId: 'ragd',
    wikiTitle: 'Ragdoll',
    tags: ['Lap cat', 'Gentle', 'Quiet'],
    traits: {
      activity:    { low: 3, medium: 3, high: 1, very: 0 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 1 },
      vocal:       { quiet: 3, some: 2, chatty: 0 },
      size:        { small: 0, medium: 1, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      temperament_lap:   'Goes famously floppy when picked up — the ultimate lap cat',
      children_young:    'Placid and tolerant with gentle young children',
      vocal_quiet:       'Soft-spoken and rarely noisy',
      space_small_apt:   'Calm and content in an apartment',
      activity_low:      'Happy with gentle play and plenty of cuddle time',
      experience_first:  'Easy-going nature makes them ideal for first-time owners',
    },
    note: 'Best kept indoors — their trusting nature makes them vulnerable outside. Ask breeders about HCM heart screening.',
  },
  {
    name: 'Persian',
    catApiId: 'pers',
    wikiTitle: 'Persian_cat',
    tags: ['Serene', 'Quiet', 'Glamorous coat'],
    traits: {
      activity:    { low: 3, medium: 2, high: 0, very: 0 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 1 },
      children:    { none: 3, young: 1, older: 2 },
      pets:        { none: 3, dogs: 1, cats: 2, both: 1 },
      alone:       { rarely: 2, few: 3, half: 3, long: 2 },
      temperament: { lap: 3, companion: 2, independent: 2, playful: 0 },
      vocal:       { quiet: 3, some: 1, chatty: 0 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 0, allergy: 0 },
      grooming:    { low: 0, medium: 1, high: 3 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 3, occasional: 1, lively: 0 },
    },
    reasons: {
      activity_low:      'The epitome of a relaxed, low-energy indoor cat',
      vocal_quiet:       'One of the quietest breeds — ideal for apartments',
      household_quiet:   'Thrives in a calm, predictable home',
      temperament_lap:   'Loves settling into a lap for a long snooze',
      grooming_high:     'Rewards your grooming effort with a spectacular coat',
    },
    note: 'Needs daily combing to prevent mats. Very flat-faced lines can have breathing, eye and dental problems — look for breeders with more moderate faces and PKD-tested parents.',
  },
  {
    name: 'Exotic Shorthair',
    catApiId: 'esho',
    wikiTitle: 'Exotic_Shorthair',
    tags: ['Easy-going', 'Plush coat', 'Low-key'],
    traits: {
      activity:    { low: 3, medium: 3, high: 1, very: 0 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 1 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 2, cats: 3, both: 2 },
      alone:       { rarely: 2, few: 3, half: 3, long: 2 },
      temperament: { lap: 3, companion: 3, independent: 1, playful: 1 },
      vocal:       { quiet: 3, some: 1, chatty: 0 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 2, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 3, occasional: 2, lively: 1 },
    },
    reasons: {
      grooming_medium:   'Persian personality without the daily grooming',
      activity_low:      'Content with gentle play and lounging',
      vocal_quiet:       'Quiet and undemanding',
      alone_half:        'Copes well while you are out at work',
      experience_first:  'Low-drama and easy for first-time owners',
    },
    note: 'Shares the Persian\'s flat face, so watch for breathing issues and tear staining. Choose breeders who avoid extreme faces.',
  },
  {
    name: 'Himalayan',
    catApiId: 'hima',
    wikiTitle: 'Himalayan_cat',
    tags: ['Lap cat', 'Blue-eyed', 'Glamorous coat'],
    traits: {
      activity:    { low: 3, medium: 2, high: 0, very: 0 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 1 },
      children:    { none: 3, young: 1, older: 2 },
      pets:        { none: 3, dogs: 2, cats: 2, both: 2 },
      alone:       { rarely: 2, few: 3, half: 3, long: 2 },
      temperament: { lap: 3, companion: 3, independent: 1, playful: 1 },
      vocal:       { quiet: 3, some: 1, chatty: 0 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 0, allergy: 0 },
      grooming:    { low: 0, medium: 1, high: 3 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 3, occasional: 2, lively: 0 },
    },
    reasons: {
      temperament_lap:   'A sweet, blue-eyed lap cat',
      vocal_quiet:       'Quiet and gentle-voiced',
      activity_low:      'Content with calm play and long naps',
      household_quiet:   'Thrives in a peaceful home',
      grooming_high:     'Rewards daily grooming with a spectacular coat',
    },
    note: 'A Persian with Siamese-style points, so it needs daily combing and eye cleaning. Flat faces can cause breathing, eye and dental problems — choose moderate-faced, PKD-tested lines.',
  },
  {
    name: 'British Shorthair',
    catApiId: 'bsho',
    wikiTitle: 'British_Shorthair',
    tags: ['Calm', 'Independent', 'Teddy-bear looks'],
    traits: {
      activity:    { low: 3, medium: 3, high: 1, very: 0 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 3, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 3, half: 3, long: 2 },
      temperament: { lap: 1, companion: 2, independent: 3, playful: 1 },
      vocal:       { quiet: 3, some: 1, chatty: 0 },
      size:        { small: 0, medium: 2, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 3, occasional: 3, lively: 2 },
    },
    reasons: {
      alone_half:          'Content on their own while you are at work',
      temperament_independent: 'Affectionate but never clingy',
      space_small_apt:     'A calm couch potato — perfect for apartments',
      children_young:      'Tolerant and low-drama with children',
      pets_dogs:           'Laid-back enough to live happily with a dog',
      experience_first:    'Undemanding and easy to care for',
    },
    note: 'Prone to weight gain — keep them active and portion meals. Many prefer sitting beside you to being picked up.',
  },
  {
    name: 'British Longhair',
    catApiId: 'bslo',
    wikiTitle: 'British_Longhair',
    tags: ['Calm', 'Plush longhair', 'Independent'],
    traits: {
      activity:    { low: 3, medium: 3, high: 1, very: 0 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 3, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 3, half: 3, long: 2 },
      temperament: { lap: 1, companion: 2, independent: 3, playful: 1 },
      vocal:       { quiet: 3, some: 1, chatty: 0 },
      size:        { small: 0, medium: 2, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 0, allergy: 0 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 3, occasional: 3, lively: 2 },
    },
    reasons: {
      alone_half:          'Happy to hang out at home while you are at work',
      temperament_independent: 'Affectionate but never clingy',
      children_young:      'Gentle and patient with children',
      activity_low:        'Would rather nap than chase a laser pointer',
      experience_first:    'Steady and undemanding for first-time owners',
    },
    note: 'Sheds heavily in spring and autumn, so comb more often then. Many dislike being picked up. Watch their weight.',
  },
  {
    name: 'American Shorthair',
    catApiId: 'asho',
    wikiTitle: 'American_Shorthair',
    tags: ['Adaptable', 'Hardy', 'Easy-care'],
    traits: {
      activity:    { low: 2, medium: 3, high: 2, very: 1 },
      space:       { small_apt: 2, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 3, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 3, half: 3, long: 2 },
      temperament: { lap: 1, companion: 2, independent: 3, playful: 2 },
      vocal:       { quiet: 3, some: 2, chatty: 1 },
      size:        { small: 0, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      pets_both:         'Gets along with dogs and other cats',
      alone_half:        'Independent streak means they cope well alone',
      grooming_low:      'Low-maintenance short coat',
      household_lively:  'Adaptable to busy family life',
      experience_first:  'Robust, even-tempered and beginner-friendly',
    },
    note: 'A generally healthy, hardy breed, but prone to putting on weight. Portion control matters.',
  },
  {
    name: 'American Curl',
    catApiId: 'acur',
    wikiTitle: 'American_Curl',
    tags: ['Curled ears', 'Playful', 'People-oriented'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 3, some: 2, chatty: 0 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      temperament_playful: 'Keeps a kitten-like playfulness well into adulthood',
      temperament_companion: 'Wants to be part of everything the family does',
      children_young:      'Friendly and good with children',
      vocal_quiet:         'Not much of a talker — a quiet companion',
      experience_first:    'Adaptable and generally healthy',
    },
    note: 'Handle the curled ears gently (never force the cartilage flat) and clean them regularly, as ear infections are more common.',
  },
  {
    name: 'Russian Blue',
    catApiId: 'rblu',
    wikiTitle: 'Russian_Blue',
    tags: ['Gentle', 'Reserved', 'Routine-loving'],
    traits: {
      activity:    { low: 2, medium: 3, high: 2, very: 1 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 1, older: 3 },
      pets:        { none: 3, dogs: 2, cats: 3, both: 2 },
      alone:       { rarely: 2, few: 3, half: 3, long: 2 },
      temperament: { lap: 1, companion: 2, independent: 3, playful: 1 },
      vocal:       { quiet: 3, some: 1, chatty: 0 },
      size:        { small: 1, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 3, occasional: 1, lively: 0 },
    },
    reasons: {
      household_quiet:     'Loves routine and a peaceful home',
      vocal_quiet:         'Quiet and soft-spoken',
      temperament_independent: 'Devoted to their people but happy in their own space',
      coat_allergy:        'Often cited as tolerated better by people with mild allergies',
      alone_half:          'Comfortable being left alone during the day',
    },
    note: 'Can be shy with strangers and dislike change. Allergy tolerance varies, so spend time with the cat first.',
  },
  {
    name: 'Nebelung',
    catApiId: 'nebe',
    wikiTitle: 'Nebelung',
    tags: ['Gentle', 'Shy', 'Silky blue coat'],
    traits: {
      activity:    { low: 2, medium: 3, high: 2, very: 1 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 3, young: 1, older: 3 },
      pets:        { none: 3, dogs: 2, cats: 3, both: 2 },
      alone:       { rarely: 2, few: 3, half: 2, long: 1 },
      temperament: { lap: 2, companion: 3, independent: 2, playful: 1 },
      vocal:       { quiet: 3, some: 1, chatty: 0 },
      size:        { small: 0, medium: 3, large: 2, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 3, occasional: 1, lively: 0 },
    },
    reasons: {
      household_quiet:     'Loves routine and a peaceful home',
      vocal_quiet:         'Soft-spoken — gentle meows and purrs',
      temperament_companion: 'Shy with strangers but devoted to their own family',
      grooming_medium:     'Silky coat rarely mats, so weekly brushing is enough',
    },
    note: 'Easily stressed by noisy visitors or change, so give them a quiet retreat. Generally healthy but prone to weight gain and dental disease.',
  },
  {
    name: 'Chartreux',
    catApiId: 'char',
    wikiTitle: 'Chartreux',
    tags: ['Quiet', 'Loyal', 'Easy-going'],
    traits: {
      activity:    { low: 2, medium: 3, high: 2, very: 1 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 3, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 3, half: 3, long: 2 },
      temperament: { lap: 1, companion: 3, independent: 2, playful: 2 },
      vocal:       { quiet: 3, some: 1, chatty: 0 },
      size:        { small: 0, medium: 2, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 2, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 3, occasional: 2, lively: 1 },
    },
    reasons: {
      vocal_quiet:         'Famously quiet — many barely meow at all',
      temperament_companion: 'Bonds closely and follows their person around',
      pets_dogs:           'Gets along well with cat-friendly dogs',
      alone_half:          'Calm and self-possessed while you are out',
    },
    note: 'Their dense double coat sheds heavily in spring. Brush more often then.',
  },
  {
    name: 'Korat',
    catApiId: 'kora',
    wikiTitle: 'Korat',
    tags: ['Good-luck cat', 'Devoted', 'Silver-blue coat'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 3, young: 1, older: 3 },
      pets:        { none: 3, dogs: 2, cats: 2, both: 2 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 1, playful: 2 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 2, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 3, occasional: 1, lively: 0 },
    },
    reasons: {
      temperament_companion: 'Bonds deeply and likes to stay close to their people',
      coat_allergy:        'Short single coat releases less hair and dander than a double coat',
      coat_low_shed:       'Sleek single coat sheds lightly',
      household_quiet:     'Happiest in a calm, predictable home',
      grooming_low:        'Needs very little grooming',
    },
    note: 'Dislikes loud, busy homes and likes to be top cat with other pets. Ask breeders for GM1 and GM2 gangliosidosis DNA results — fatal inherited diseases that carrier testing prevents. Allergy tolerance varies.',
  },
  {
    name: 'Birman',
    catApiId: 'birm',
    wikiTitle: 'Birman',
    tags: ['Affectionate', 'Gentle', 'Family-friendly'],
    traits: {
      activity:    { low: 2, medium: 3, high: 2, very: 0 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 1 },
      vocal:       { quiet: 3, some: 2, chatty: 0 },
      size:        { small: 0, medium: 3, large: 2, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 2 },
    },
    reasons: {
      children_young:    'Patient and sturdy enough for gentle family play',
      temperament_lap:   'Sweet-natured and loves close contact',
      grooming_medium:   'Silky single coat is less prone to matting than most longhairs',
      pets_both:         'Social with other cats and dogs',
      experience_first:  'Easy-going and simple to care for',
    },
    note: 'A people-oriented cat that does not like long periods alone. A companion cat can help.',
  },
  {
    name: 'Burmese',
    catApiId: 'bure',
    wikiTitle: 'Burmese_cat',
    tags: ['Dog-like', 'Playful', 'People-oriented'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 1, some: 3, chatty: 2 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      temperament_companion: 'Dog-like devotion — follows you everywhere',
      children_young:     'Playful and tolerant with kids',
      household_lively:   'Loves being in the middle of family life',
      pets_dogs:          'Happily shares a home with a cat-friendly dog',
      grooming_low:       'Glossy short coat needs almost no grooming',
      coat_allergy:       'Short, dense coat sheds minimally — sometimes suggested for mild allergies',
    },
    note: 'Craves company and does not do well left alone for long. Best if someone is usually home.',
  },
  {
    name: 'Tonkinese',
    catApiId: 'tonk',
    wikiTitle: 'Tonkinese_cat',
    tags: ['Social', 'Chatty', 'Playful'],
    traits: {
      activity:    { low: 0, medium: 2, high: 3, very: 3 },
      space:       { small_apt: 2, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 0, some: 2, chatty: 3 },
      size:        { small: 1, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      temperament_playful: 'Curious, clever and endlessly entertaining',
      vocal_chatty:        'Loves a conversation — though softer-voiced than the Siamese',
      household_lively:    'Thrives on company and activity',
      children_older:      'A great playmate for older kids',
    },
    note: 'Needs lots of attention and stimulation. Consider a pair if you are out during the day.',
  },
  {
    name: 'Bombay',
    catApiId: 'bomb',
    wikiTitle: 'Bombay_cat',
    tags: ['Mini panther', 'Affectionate', 'Playful'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 1, long: 0 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 1, some: 3, chatty: 2 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      temperament_lap:     'Loves snuggling on your lap or in your bed',
      children_young:      'Playful and affectionate with children',
      household_lively:    'Enjoys being the centre of attention',
      grooming_low:        'Sleek, patent-leather coat needs little grooming',
      experience_first:    'Friendly and easy to live with',
    },
    note: 'Attention-seeking and gets lonely if left alone for long. Some lines carry the fatal Burmese craniofacial defect, so ask breeders about testing, and about HCM.',
  },
  {
    name: 'Burmilla',
    catApiId: 'buri',
    wikiTitle: 'Burmilla',
    tags: ['Silver coat', 'Gentle', 'Family-friendly'],
    traits: {
      activity:    { low: 2, medium: 3, high: 2, very: 1 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 3, half: 2, long: 1 },
      temperament: { lap: 2, companion: 3, independent: 1, playful: 2 },
      vocal:       { quiet: 3, some: 2, chatty: 0 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      children_young:      'Gentle and family-friendly',
      vocal_quiet:         'Quiet and undemanding',
      temperament_companion: 'Affectionate and engaging without being needy',
      experience_first:    'Laid-back and easy to care for',
    },
    note: 'Ask breeders about PKD (inherited from Persian ancestors) and HCM screening.',
  },
  {
    name: 'Australian Mist',
    catApiId: 'amis',
    wikiTitle: 'Australian_Mist',
    tags: ['Indoor-bred', 'Tolerant', 'Gentle'],
    traits: {
      activity:    { low: 3, medium: 3, high: 2, very: 1 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 3, half: 2, long: 1 },
      temperament: { lap: 3, companion: 3, independent: 1, playful: 1 },
      vocal:       { quiet: 3, some: 2, chatty: 1 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      children_young:      'Exceptionally tolerant of handling — great with young children',
      space_small_apt:     'Bred specifically to be content living indoors',
      temperament_lap:     'Mellow and happy to be picked up and cuddled',
      pets_dogs:           'Placid and usually gets on well with dogs',
      experience_first:    'Relaxed and easy — ideal for first-time owners',
    },
    note: 'Rare outside Australia, so expect to wait for a kitten. Energetic as kittens but calm as adults.',
  },
  {
    name: 'Siamese',
    catApiId: 'siam',
    wikiTitle: 'Siamese_cat',
    tags: ['Very vocal', 'Devoted', 'Intelligent'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 1, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 1, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 0, some: 1, chatty: 3 },
      size:        { small: 1, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      vocal_chatty:        'The most talkative breed of all — expect real conversations',
      temperament_companion: 'Forms an intense bond with their people',
      activity_very:       'Smart and athletic — loves puzzle toys and training',
      grooming_low:        'Sleek coat needs minimal grooming',
      coat_allergy:        'Short, fine coat sheds little — a frequent pick for allergy sufferers',
    },
    note: 'Demands attention and can be loud. Not a good fit if you are out all day or need quiet.',
  },
  {
    name: 'Oriental Shorthair',
    catApiId: 'orie',
    wikiTitle: 'Oriental_Shorthair',
    tags: ['Chatty', 'Clown-like', 'Sleek'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 1, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 1, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 0, some: 1, chatty: 3 },
      size:        { small: 2, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 3, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      vocal_chatty:        'Second only to the Siamese for chattiness',
      temperament_playful: 'A lively, clownish entertainer',
      coat_low_shed:       'Fine, close-lying coat sheds very little',
      coat_allergy:        'Sometimes tolerated better by people with mild allergies',
    },
    note: 'Needs constant company and stimulation. Consider getting two if you work away from home.',
  },
  {
    name: 'Balinese',
    catApiId: 'bali',
    wikiTitle: 'Balinese_cat',
    tags: ['Chatty', 'Elegant', 'Silky coat'],
    traits: {
      activity:    { low: 0, medium: 2, high: 3, very: 3 },
      space:       { small_apt: 2, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 1, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 0, some: 2, chatty: 3 },
      size:        { small: 1, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 3 },
      grooming:    { low: 2, medium: 3, high: 3 },
      experience:  { first: 1, some: 3, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      coat_allergy:        'Reported to produce less of the main cat allergen (Fel d 1)',
      vocal_chatty:        'Siamese-style chatter with a softer voice',
      temperament_companion: 'Devoted and loves to be involved in everything',
      grooming_medium:     'Silky single coat rarely mats despite its length',
    },
    note: 'Allergen levels vary between individual cats, so spend time with the kitten before committing. Needs lots of company.',
  },
  {
    name: 'Javanese',
    catApiId: 'java',
    wikiTitle: 'Javanese_cat',
    tags: ['Chatty', 'Devoted', 'Silky single coat'],
    traits: {
      activity:    { low: 0, medium: 2, high: 3, very: 3 },
      space:       { small_apt: 2, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 1, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 0, some: 1, chatty: 3 },
      size:        { small: 1, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 3 },
      grooming:    { low: 2, medium: 3, high: 3 },
      experience:  { first: 1, some: 3, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      coat_allergy:        'Shares the Balinese\'s reputation for producing less Fel d 1',
      coat_low_shed:       'Single coat with no undercoat sheds less than most longhairs',
      vocal_chatty:        'A true conversationalist — expect a steady stream of chatter',
      temperament_companion: 'Wants to be at the centre of everything you do',
      grooming_medium:     'Silky coat rarely mats — a weekly brush is enough',
    },
    note: 'The CFA now shows it as a colour division of the Balinese (same breed, extra point colours). Needs lots of company and play. Allergen levels vary between cats, so meet yours first.',
  },
  {
    name: 'Colorpoint Shorthair',
    catApiId: 'csho',
    wikiTitle: 'Colorpoint_Shorthair',
    tags: ['Very vocal', 'Affectionate', 'Colourful points'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 1, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 1, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 0, some: 1, chatty: 3 },
      size:        { small: 1, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      vocal_chatty:        'Famously talkative, with a huge range of sounds',
      temperament_companion: 'Loves to be close and seems to sense your mood',
      coat_allergy:        'Short, fine Siamese-type coat — a frequent pick for allergy sufferers',
      activity_very:       'Athletic and clever — thrives on daily interactive play',
      grooming_low:        'Sleek coat needs minimal grooming',
    },
    note: 'Essentially a Siamese in red, cream, tortie or lynx points, and just as vocal and needy. Not suited to long days alone. Regular tooth brushing helps prevent dental disease.',
  },
  {
    name: 'Snowshoe',
    catApiId: 'snow',
    wikiTitle: 'Snowshoe_cat',
    tags: ['White "boots"', 'Chatty', 'Family-friendly'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 2, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 1, some: 3, chatty: 2 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      vocal_some:          'Conversational, with a softer voice than the Siamese',
      children_young:      'Happy around children and tolerant of being picked up',
      household_lively:    'Does well in busy family homes',
      temperament_playful: 'Playful — and many even enjoy water',
      experience_first:    'Easy-going and generally healthy',
    },
    note: 'Rare and very people-focused, so it can develop separation anxiety if left alone for long.',
  },
  {
    name: 'Havana Brown',
    catApiId: 'hbro',
    wikiTitle: 'Havana_Brown',
    tags: ['Rare', 'People-oriented', 'Chocolate coat'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 1, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 2, occasional: 3, lively: 2 },
    },
    reasons: {
      temperament_companion: 'Wants to be involved in everything you do',
      vocal_some:          'Chats in sweet chirps and trills rather than demanding meows',
      pets_both:           'Compatible with other family pets',
      grooming_low:        'Glossy short coat needs very little grooming',
    },
    note: 'Extremely rare (estimated at under 1,000 cats worldwide), so expect a long wait. Needs an attentive owner and does not like long days alone.',
  },
  {
    name: 'Siberian',
    catApiId: 'sibe',
    wikiTitle: 'Siberian_cat',
    tags: ['Robust', 'Affectionate', 'Playful'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 1, apt: 2, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 3, half: 2, long: 1 },
      temperament: { lap: 2, companion: 3, independent: 2, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 0, medium: 1, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 3 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 3 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      coat_allergy:      'Many Siberians naturally produce lower levels of Fel d 1',
      children_young:    'Sturdy, playful and patient with children',
      pets_dogs:         'Confident and dog-friendly',
      temperament_playful: 'Retains a playful, kitten-like streak for years',
      experience_first:  'Friendly and adaptable for first-time owners',
    },
    note: 'Allergen levels vary widely from cat to cat, so meet your specific kitten first. Thick triple coat moults heavily twice a year.',
  },
  {
    name: 'Norwegian Forest Cat',
    catApiId: 'norw',
    wikiTitle: 'Norwegian_Forest_cat',
    tags: ['Climber', 'Independent', 'Majestic'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 0, apt: 1, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 3, half: 3, long: 1 },
      temperament: { lap: 1, companion: 2, independent: 3, playful: 2 },
      vocal:       { quiet: 3, some: 2, chatty: 0 },
      size:        { small: 0, medium: 0, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 0, allergy: 0 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 3 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      temperament_independent: 'Affectionate but not clingy — a perfect balance',
      space_outdoor:     'A natural climber that loves a catio or tall cat tree',
      alone_half:        'Self-sufficient while you are at work',
      children_young:    'Gentle and tolerant with family life',
      vocal_quiet:       'Quiet and low-key',
    },
    note: 'Water-resistant coat sheds heavily in spring. Needs vertical space to climb.',
  },
  {
    name: 'Ragamuffin',
    catApiId: 'raga',
    wikiTitle: 'Ragamuffin_cat',
    tags: ['Cuddly', 'Docile', 'Family-friendly'],
    traits: {
      activity:    { low: 3, medium: 3, high: 1, very: 0 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 2, long: 1 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 1 },
      vocal:       { quiet: 3, some: 2, chatty: 0 },
      size:        { small: 0, medium: 1, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      temperament_lap:   'A big, cuddly teddy bear that loves to be held',
      children_young:    'Docile and patient with children',
      pets_both:         'Accepting of other cats and dogs',
      activity_low:      'Relaxed and content with gentle play',
    },
    note: 'Prone to weight gain and best kept indoors. Ask breeders about heart screening.',
  },
  {
    name: 'Devon Rex',
    catApiId: 'drex',
    wikiTitle: 'Devon_Rex',
    tags: ['Pixie-like', 'Playful', 'Low-shedding'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 3, medium: 2, large: 0, any: 3 },
      coat:        { fine: 2, low_shed: 3, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      coat_low_shed:     'Short, wavy coat sheds far less than most breeds',
      coat_allergy:      'Low shedding means less allergen-laden fur around the home',
      temperament_lap:   'Loves perching on shoulders and snuggling under blankets',
      children_young:    'Playful and will happily entertain kids for hours',
      space_small_apt:   'Small and adaptable to apartment life',
    },
    note: 'Feels the cold — provide warm beds. Ears and skin need occasional gentle cleaning.',
  },
  {
    name: 'Cornish Rex',
    catApiId: 'crex',
    wikiTitle: 'Cornish_Rex',
    tags: ['Athletic', 'Perpetual kitten', 'Low-shedding'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 2, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 2 },
      size:        { small: 3, medium: 2, large: 0, any: 3 },
      coat:        { fine: 2, low_shed: 3, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 1, some: 3, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      activity_very:     'Acrobatic and energetic — a perpetual kitten',
      coat_low_shed:     'Soft, curly coat sheds very little',
      coat_allergy:      'Sheds very little, so less allergen-laden fur around the home',
      temperament_playful: 'Loves fetch and interactive games',
      pets_both:         'Sociable with other cats and dogs',
    },
    note: 'Needs warmth and lots of play. Not happy left alone for long days.',
  },
  {
    name: 'LaPerm',
    catApiId: 'lape',
    wikiTitle: 'LaPerm',
    tags: ['Curly coat', 'Affectionate', 'Outgoing'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 2 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 2, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 3, allergy: 2 },
      grooming:    { low: 2, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      coat_low_shed:       'Soft curly coat sheds considerably less than most breeds',
      coat_allergy:        'Curls help hold in dander — often suggested for allergy sufferers',
      temperament_lap:     'Active, but takes every chance to curl up in your lap',
      pets_both:           'Gets along with other cats and cat-friendly dogs',
      experience_first:    'Easy-going and generally healthy — a good first cat',
    },
    note: 'No known breed-specific genetic diseases. Teach young children not to pull the curls. Allergy tolerance still varies from cat to cat.',
  },
  {
    name: 'Selkirk Rex',
    catApiId: 'srex',
    wikiTitle: 'Selkirk_Rex',
    tags: ['Curly plush coat', 'Patient', 'Cuddly'],
    traits: {
      activity:    { low: 3, medium: 3, high: 1, very: 0 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 3, half: 2, long: 1 },
      temperament: { lap: 3, companion: 2, independent: 1, playful: 1 },
      vocal:       { quiet: 3, some: 2, chatty: 0 },
      size:        { small: 0, medium: 2, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      temperament_lap:     'Placid and cuddly — happy to be held',
      children_young:      'Patient and tolerant of handling',
      household_lively:    'Mellow enough for a busy home',
      vocal_quiet:         'Soft-spoken and rarely demanding',
      activity_low:        'Easy-going with modest play needs',
    },
    note: 'Despite the curls it is not a low-allergen breed — it sheds moderately year-round. Ask breeders for PKD and HCM screening of both parents.',
  },
  {
    name: 'Sphynx',
    catApiId: 'sphy',
    wikiTitle: 'Sphynx_cat',
    tags: ['Hairless', 'Extroverted', 'Velcro cat'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 1 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 2 },
      vocal:       { quiet: 2, some: 3, chatty: 2 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 2, low_shed: 3, allergy: 2 },
      grooming:    { low: 0, medium: 2, high: 3 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      coat_low_shed:     'No fur to shed on your furniture',
      temperament_lap:   'A heat-seeking cuddler that loves being under the covers',
      household_lively:  'An extroverted show-off that loves visitors',
      grooming_high:     'Your bathing routine keeps their skin healthy',
      coat_allergy:      'No fur to spread allergens around the home (the skin still produces them)',
    },
    note: 'Not truly allergen-free. Needs a bath every week or two to remove skin oils, and must be kept warm and indoors because they sunburn. Ask about HCM screening. Hairless cats cannot be bred, sold or newly acquired in the Netherlands since 2026, and Germany treats breeding whiskerless cats as "torture breeding".',
  },
  {
    name: 'Donskoy',
    catApiId: 'dons',
    wikiTitle: 'Donskoy_cat',
    tags: ['Hairless', 'Warm-hearted', 'Sociable'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 1 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 2 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 1, medium: 3, large: 1, any: 3 },
      coat:        { fine: 2, low_shed: 3, allergy: 2 },
      grooming:    { low: 0, medium: 2, high: 3 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      coat_low_shed:       'Little or no fur to shed',
      coat_allergy:        'Little or no fur to spread allergens around the home',
      temperament_lap:     'A warm-hearted cuddler that seeks out laps and blankets',
      pets_both:           'Very social with other cats and pets',
      grooming_high:       'Your wipe-downs and baths keep their skin healthy',
    },
    note: 'Not allergen-free. Needs a bath every week or two, warmth, sun protection and dental care. Hairless cats cannot be bred, sold or newly acquired in the Netherlands since 2026, and Germany treats breeding whiskerless cats as "torture breeding".',
  },
  {
    name: 'Peterbald',
    catApiId: null,
    wikiTitle: 'Peterbald',
    tags: ['Bald to velvety', 'Devoted', 'Energetic'],
    traits: {
      activity:    { low: 0, medium: 2, high: 3, very: 3 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 1 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 3, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 1, some: 3, chatty: 2 },
      size:        { small: 1, medium: 3, large: 0, any: 3 },
      coat:        { fine: 2, low_shed: 3, allergy: 2 },
      grooming:    { low: 0, medium: 2, high: 3 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      coat_low_shed:       'Bald or velvety coat means very little shedding',
      coat_allergy:        'Little or no fur to spread allergens around the home',
      temperament_companion: 'Follows their favourite person everywhere',
      activity_high:       'Playful, curious and loves to climb',
      grooming_high:       'Regular bathing keeps their skin healthy',
    },
    note: 'Coats range from fully bald to short and straight, so ask which type you are getting. Bald cats need baths, warmth and sun protection, and fall under the Netherlands\' 2026 hairless-cat ban. Not allergen-free.',
  },
  {
    name: 'Abyssinian',
    catApiId: 'abys',
    wikiTitle: 'Abyssinian_cat',
    tags: ['Active', 'Curious', 'Athletic'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 0, apt: 2, house: 3, outdoor: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 2, half: 1, long: 0 },
      temperament: { lap: 0, companion: 2, independent: 2, playful: 3 },
      vocal:       { quiet: 3, some: 2, chatty: 1 },
      size:        { small: 2, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 2, lively: 3 },
    },
    reasons: {
      activity_very:     'One of the most active, playful breeds — always on the go',
      temperament_playful: 'Endlessly curious and busy exploring',
      space_house:       'Loves having room to climb, run and investigate',
      vocal_quiet:       'Busy but not noisy — a quiet-voiced breed',
      grooming_low:      'Short ticked coat is very low maintenance',
    },
    note: 'Rarely a lap cat. Needs daily play and vertical space, or boredom leads to mischief.',
  },
  {
    name: 'Somali',
    catApiId: 'soma',
    wikiTitle: 'Somali_cat',
    tags: ['Energetic', 'Fox-like', 'Playful'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 0, apt: 2, house: 3, outdoor: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 2, half: 1, long: 0 },
      temperament: { lap: 0, companion: 2, independent: 2, playful: 3 },
      vocal:       { quiet: 3, some: 2, chatty: 1 },
      size:        { small: 1, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 1, medium: 3, high: 3 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 2, lively: 3 },
    },
    reasons: {
      activity_high:     'Lively and athletic — loves interactive play',
      temperament_playful: 'Mischievous, clever and full of fun',
      grooming_medium:   'Semi-long coat with a stunning bushy tail',
      household_lively:  'Enjoys being where the action is',
    },
    note: 'The long-haired Abyssinian, with the same high energy. Needs climbing space and daily play.',
  },
  {
    name: 'Egyptian Mau',
    catApiId: 'emau',
    wikiTitle: 'Egyptian_Mau',
    tags: ['Fastest cat', 'Loyal', 'Naturally spotted'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 0, apt: 2, house: 3, outdoor: 3 },
      children:    { none: 2, young: 1, older: 3 },
      pets:        { none: 2, dogs: 2, cats: 3, both: 2 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 1, companion: 3, independent: 2, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 2, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 3, occasional: 2, lively: 1 },
    },
    reasons: {
      activity_very:       'The fastest domestic cat — loves to run, leap and play',
      temperament_companion: 'Forms a deep bond with a favourite person',
      vocal_some:          'Communicates in soft chirps and melodic trills',
      household_quiet:     'Reserved with strangers and happiest in a calm home',
      grooming_low:        'Short, silky coat needs little grooming',
    },
    note: 'Can be shy with visitors and needs daily exercise and climbing space. One of the healthier pedigree breeds, but ask about HCM screening.',
  },
  {
    name: 'Ocicat',
    catApiId: 'ocic',
    wikiTitle: 'Ocicat',
    tags: ['Wild looks', 'Dog-like', 'Social'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 1, apt: 2, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 1, half: 0, long: 0 },
      temperament: { lap: 2, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 1, some: 3, chatty: 2 },
      size:        { small: 0, medium: 3, large: 2, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      activity_very:       'Athletic and clever — loves puzzles and fetch',
      temperament_companion: 'Dog-like loyalty to the whole family',
      children_young:      'Outgoing and good with children',
      coat_allergy:        'Short, close coat sheds little — often listed as allergy-friendlier',
      pets_both:           'Usually gets on well with other pets',
    },
    note: 'All-domestic despite the wild look, so no hybrid restrictions apply. Dislikes being left alone. Ask breeders about renal amyloidosis, HCM and PRA.',
  },
  {
    name: 'Bengal',
    catApiId: 'beng',
    wikiTitle: 'Bengal_cat',
    tags: ['Wild looks', 'High-energy', 'Intelligent'],
    traits: {
      activity:    { low: 0, medium: 0, high: 2, very: 3 },
      space:       { small_apt: 0, apt: 1, house: 3, outdoor: 3 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 2, both: 2 },
      alone:       { rarely: 2, few: 2, half: 1, long: 0 },
      temperament: { lap: 0, companion: 2, independent: 2, playful: 3 },
      vocal:       { quiet: 1, some: 3, chatty: 2 },
      size:        { small: 0, medium: 3, large: 2, any: 3 },
      coat:        { fine: 3, low_shed: 3, allergy: 2 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 0, some: 1, expert: 3 },
      household:   { quiet: 1, occasional: 2, lively: 3 },
    },
    reasons: {
      activity_very:     'Extremely athletic — ideal for owners who love to play',
      space_outdoor:     'Thrives with a catio or secure outdoor space',
      coat_low_shed:     'Sleek pelt-like coat sheds relatively little',
      experience_expert: 'Clever and demanding — best with an experienced owner',
      household_lively:  'Unfazed by busy, active households',
      coat_allergy:      'Pelt-like coat sheds relatively little — often listed as allergy-friendlier',
    },
    note: 'Restricted or banned in some areas (e.g. Hawaii, Connecticut, New York City), especially early generations, so check local laws. Can become destructive without enough stimulation.',
  },
  {
    name: 'Toyger',
    catApiId: 'toyg',
    wikiTitle: 'Toyger',
    tags: ['Tiger stripes', 'Trainable', 'Easy-going'],
    traits: {
      activity:    { low: 1, medium: 2, high: 3, very: 3 },
      space:       { small_apt: 1, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 2, long: 1 },
      temperament: { lap: 1, companion: 3, independent: 1, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 0, medium: 3, large: 2, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      activity_high:       'Active and playful, and can be trained to walk on a leash',
      temperament_companion: 'Loyal and people-loving — often called dog-like',
      children_young:      'Friendly with children and dogs',
      household_lively:    'Laid-back enough for a busy home',
    },
    note: 'All-domestic (not a wild hybrid). Ask about heart screening, as some lines carry HCM and cataract risks from Bengal ancestry.',
  },
  {
    name: 'Savannah',
    catApiId: 'sava',
    wikiTitle: 'Savannah_cat',
    tags: ['Exotic hybrid', 'Very active', 'Dog-like'],
    traits: {
      activity:    { low: 0, medium: 0, high: 1, very: 3 },
      space:       { small_apt: 0, apt: 0, house: 2, outdoor: 3 },
      children:    { none: 2, young: 0, older: 2 },
      pets:        { none: 2, dogs: 2, cats: 1, both: 1 },
      alone:       { rarely: 2, few: 1, half: 1, long: 0 },
      temperament: { lap: 0, companion: 2, independent: 3, playful: 3 },
      vocal:       { quiet: 1, some: 2, chatty: 3 },
      size:        { small: 0, medium: 1, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 3, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 0, some: 0, expert: 3 },
      household:   { quiet: 1, occasional: 2, lively: 2 },
    },
    reasons: {
      activity_very:     'Incredible athlete — leaps, climbs and even walks on a leash',
      space_outdoor:     'Needs lots of space, ideally with an outdoor enclosure',
      experience_expert: 'A challenging breed for very experienced owners',
      temperament_independent: 'Confident and bold with a dog-like loyalty',
    },
    note: 'Banned in some US states (e.g. Georgia, Hawaii, Nebraska, Rhode Island) and early generations (F1–F4) are restricted in many more, so check local laws first. Expensive and very demanding.',
  },
  {
    name: 'Turkish Angora',
    catApiId: 'tang',
    wikiTitle: 'Turkish_Angora',
    tags: ['Elegant', 'Lively', 'Clever'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 1, apt: 2, house: 3, outdoor: 3 },
      children:    { none: 2, young: 1, older: 3 },
      pets:        { none: 2, dogs: 2, cats: 3, both: 2 },
      alone:       { rarely: 2, few: 2, half: 1, long: 0 },
      temperament: { lap: 0, companion: 2, independent: 2, playful: 3 },
      vocal:       { quiet: 1, some: 3, chatty: 2 },
      size:        { small: 2, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 1 },
      grooming:    { low: 2, medium: 3, high: 3 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 2, lively: 3 },
    },
    reasons: {
      temperament_playful: 'Clever, lively and loves to be the centre of attention',
      grooming_medium:   'Silky single coat is surprisingly easy to care for',
      activity_high:     'Energetic and loves climbing to high places',
      household_lively:  'Enjoys a busy home with plenty going on',
    },
    note: 'White cats with blue eyes have a higher risk of congenital deafness. Needs an engaged owner.',
  },
  {
    name: 'Turkish Van',
    catApiId: 'tvan',
    wikiTitle: 'Turkish_Van',
    tags: ['Water-loving', 'Athletic', 'Independent'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 0, apt: 1, house: 3, outdoor: 3 },
      children:    { none: 2, young: 0, older: 3 },
      pets:        { none: 2, dogs: 2, cats: 2, both: 2 },
      alone:       { rarely: 2, few: 2, half: 2, long: 1 },
      temperament: { lap: 0, companion: 2, independent: 3, playful: 3 },
      vocal:       { quiet: 1, some: 3, chatty: 2 },
      size:        { small: 0, medium: 1, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 0, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 2, lively: 3 },
    },
    reasons: {
      temperament_independent: 'Bold and self-assured',
      activity_very:     'Powerful athlete that loves to climb and play',
      grooming_low:      'Cashmere-like coat has no undercoat and resists matting',
      space_outdoor:     'Makes the most of a large home or catio',
    },
    note: 'Famous for loving water. Most dislike being held or cuddled, so not a lap cat.',
  },
  {
    name: 'Japanese Bobtail',
    catApiId: 'jbob',
    wikiTitle: 'Japanese_Bobtail',
    tags: ['Pom-pom tail', 'Talkative', 'Playful'],
    traits: {
      activity:    { low: 0, medium: 1, high: 3, very: 3 },
      space:       { small_apt: 1, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 1, companion: 3, independent: 1, playful: 3 },
      vocal:       { quiet: 1, some: 2, chatty: 3 },
      size:        { small: 2, medium: 3, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      vocal_chatty:        'Talks in a sing-song range of chirps and meows',
      children_young:      'An energetic playmate that gets on well with kids',
      pets_dogs:           'Outgoing and usually good with dogs',
      activity_very:       'Loves fetch and seemingly endless play',
      household_lively:    'Adapts easily to busy homes and even travel',
    },
    note: 'The bobbed tail comes from a recessive gene that, unlike the Manx gene, is not linked to spinal problems. High energy, so plan for plenty of play and climbing space.',
  },
  {
    name: 'Kurilian Bobtail',
    catApiId: 'kuri',
    wikiTitle: 'Kurilian_Bobtail',
    tags: ['Pom-pom tail', 'Hunter', 'Water-loving'],
    traits: {
      activity:    { low: 0, medium: 2, high: 3, very: 3 },
      space:       { small_apt: 0, apt: 1, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 3, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 3, half: 2, long: 1 },
      temperament: { lap: 1, companion: 2, independent: 3, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 0, medium: 2, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 0, allergy: 0 },
      grooming:    { low: 2, medium: 3, high: 3 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      temperament_independent: 'Clever and independent, yet snuggles with a favourite person',
      activity_very:       'Very active, with a strong hunting and play drive',
      pets_dogs:           'Adapts well to dogs and other cats',
      space_outdoor:       'Loves high perches and room to explore',
    },
    note: 'A keen hunter, so keep fish tanks and small pets such as hamsters well out of reach. Many love playing in water.',
  },
  {
    name: 'American Bobtail',
    catApiId: 'abob',
    wikiTitle: 'American_Bobtail',
    tags: ['Bobbed tail', 'Dog-like', 'Adaptable'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 3, half: 2, long: 1 },
      temperament: { lap: 2, companion: 3, independent: 1, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 0, medium: 2, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 0, allergy: 0 },
      grooming:    { low: 2, medium: 3, high: 3 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      space_small_apt:     'Highly adaptable — happy in a small apartment or a big house',
      temperament_playful: 'Loves fetch, hide-and-seek and puzzle toys',
      children_young:      'A devoted family cat that gets on with kids and pets',
      household_lively:    'Adapts easily to new situations — even travel',
      experience_first:    'Easy-going and adaptable for first-time owners',
    },
    note: 'Prone to obesity and diabetes, so portion control and daily play matter.',
  },
  {
    name: 'Pixie-bob',
    catApiId: 'pixi',
    wikiTitle: 'Pixie-bob',
    tags: ['Bobcat looks', 'Dog-like', 'Easy-going'],
    traits: {
      activity:    { low: 2, medium: 3, high: 3, very: 1 },
      space:       { small_apt: 1, apt: 2, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 3, half: 2, long: 1 },
      temperament: { lap: 1, companion: 3, independent: 2, playful: 2 },
      vocal:       { quiet: 3, some: 2, chatty: 0 },
      size:        { small: 0, medium: 2, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 0 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 3, some: 3, expert: 2 },
      household:   { quiet: 2, occasional: 3, lively: 3 },
    },
    reasons: {
      pets_dogs:           'Gets along particularly well with dogs',
      temperament_companion: 'Devoted — often described as a dog in a cat\'s body',
      vocal_quiet:         'Chirps and trills rather than meows',
      children_young:      'Calm and stable around children',
      experience_first:    'Relaxed, easy-going and generally healthy',
    },
    note: 'Despite the bobcat look it is an all-domestic breed. Many have extra toes (polydactyly), so remember to trim those claws too.',
  },
  {
    name: 'Singapura',
    catApiId: 'sing',
    wikiTitle: 'Singapura_cat',
    tags: ['Tiny', 'Curious', 'People-oriented'],
    traits: {
      activity:    { low: 0, medium: 2, high: 3, very: 3 },
      space:       { small_apt: 3, apt: 3, house: 3, outdoor: 2 },
      children:    { none: 2, young: 2, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 3, few: 2, half: 1, long: 0 },
      temperament: { lap: 1, companion: 3, independent: 0, playful: 3 },
      vocal:       { quiet: 3, some: 2, chatty: 1 },
      size:        { small: 3, medium: 1, large: 0, any: 3 },
      coat:        { fine: 3, low_shed: 2, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 2, some: 3, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      size_small:        'The smallest recognised breed — just 2–4 kg (4–8 lb)',
      space_small_apt:   'Compact enough for any apartment',
      temperament_companion: 'Nosy helper that wants to be involved in everything',
      vocal_quiet:       'Soft-voiced despite being very social',
    },
    note: 'Small but very active and people-focused. Does not enjoy long stretches alone.',
  },
];

// ── RECOMMENDATION ENGINE ─────────────────────────────────────────────────────

function isAllergyFriendly(breed) {
  return breed.traits.coat.allergy >= ALLERGY_FRIENDLY_MIN;
}

// An answer with a minWeight (e.g. allergies) rules out breeds scoring below it
function isEligible(breed, answers) {
  return QUESTIONS.every(q => {
    const opt = q.options.find(o => o.value === answers[q.id]);
    return !opt || opt.minWeight === undefined || breed.traits[q.id][opt.value] >= opt.minWeight;
  });
}

function scoreBreeds(answers) {
  return BREEDS.filter(breed => isEligible(breed, answers)).map(breed => {
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
      btn.dataset.value = opt.value;
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
    const isSelected = btn.dataset.value === value;
    btn.classList.toggle('selected', isSelected);
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

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

// Optional free key from https://thecatapi.com. Without one, TheCatAPI may
// ignore breed filtering, so its photos are only used when tagged with the breed.
const CAT_API_KEY = '';

// Primary source: TheCatAPI (random photo of the breed).
async function fetchCatApiImage(catApiId) {
  const headers = CAT_API_KEY ? { 'x-api-key': CAT_API_KEY } : {};
  const res = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${catApiId}&limit=1`, { headers });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  const image = Array.isArray(data) && data[0];
  // Reject untagged/random cats so a card never shows the wrong breed
  const isBreed = image && Array.isArray(image.breeds) && image.breeds.some(b => b.id === catApiId);
  if (!isBreed || !image.url) throw new Error('No matching image');
  return image.url;
}

// Fallback: the lead image of the breed's Wikipedia article.
async function fetchWikipediaImage(wikiTitle) {
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`);
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  const src = (data.thumbnail && data.thumbnail.source) || (data.originalimage && data.originalimage.source);
  if (!src) throw new Error('No image');
  return src;
}

async function fetchBreedImage(breed) {
  // Not every breed is on TheCatAPI (catApiId: null), so skip straight to Wikipedia
  const sources = [
    breed.catApiId && (() => fetchCatApiImage(breed.catApiId)),
    () => fetchWikipediaImage(breed.wikiTitle),
  ].filter(Boolean);
  for (const source of sources) {
    try {
      return await source();
    } catch {
      // Try the next source
    }
  }
  return null;
}

function showImagePlaceholder(skeleton) {
  skeleton.style.backgroundImage = 'none';
  skeleton.style.background = '#e8e6e1';
  skeleton.textContent = '🐱';
  skeleton.style.display = 'flex';
  skeleton.style.alignItems = 'center';
  skeleton.style.justifyContent = 'center';
  skeleton.style.fontSize = '3rem';
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
        ${isAllergyFriendly(breed) ? '<span class="breed-tag breed-tag-allergy">Allergy-friendlier</span>' : ''}
        ${breed.tags.map(t => `<span class="breed-tag">${t}</span>`).join('')}
      </div>
      <div class="breed-reasons-title">Why this breed suits you</div>
      <ul class="breed-reasons">
        ${reasons.filter(Boolean).map(r => `<li>${r}</li>`).join('')}
      </ul>
      ${breed.note ? `<p class="breed-note"><strong>Good to know:</strong> ${breed.note}</p>` : ''}
    </div>
  `;

  // Load image async
  const imgWrap = card.querySelector('.breed-img-wrap');
  fetchBreedImage(breed).then(url => {
    const skeleton = imgWrap.querySelector('.breed-img-skeleton');
    if (url) {
      const img = document.createElement('img');
      img.alt = breed.name;
      img.src = url;
      img.onload = () => {
        skeleton.remove();
        imgWrap.appendChild(img);
      };
      img.onerror = () => showImagePlaceholder(skeleton);
    } else {
      showImagePlaceholder(skeleton);
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

    document.getElementById('allergyCallout').hidden = state.answers.coat !== 'allergy';

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

if (typeof document !== 'undefined') {
  document.getElementById('breedCount').textContent =
    `✔ ${BREEDS.length} breeds, including ${BREEDS.filter(isAllergyFriendly).length} allergy-friendlier picks`;

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
}

if (typeof module !== 'undefined') {
  module.exports = { QUESTIONS, BREEDS, scoreBreeds, isAllergyFriendly, MAX_SCORE };
}
