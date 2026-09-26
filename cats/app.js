/* ============================================================
   CAT BREED FINDER — app.js
   Forked from the Dog Breed Finder (../app.js). Same quiz flow and
   scoring engine, with cat-specific questions and breed data.
   ============================================================ */

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
      { value: 'allergy',  icon: '🤧', label: 'Someone has mild allergies', desc: 'Looking for lower-allergen breeds (no cat is allergen-free)' },
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
// catApiId is TheCatAPI breed id; wikiTitle is the fallback image source.
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
    name: 'Russian Blue',
    catApiId: 'rblu',
    wikiTitle: 'Russian_Blue',
    tags: ['Gentle', 'Reserved', 'Lower-allergen'],
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
      coat:        { fine: 3, low_shed: 2, allergy: 1 },
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
      coat:        { fine: 3, low_shed: 2, allergy: 1 },
      grooming:    { low: 3, medium: 3, high: 2 },
      experience:  { first: 1, some: 2, expert: 3 },
      household:   { quiet: 1, occasional: 3, lively: 3 },
    },
    reasons: {
      vocal_chatty:        'The most talkative breed of all — expect real conversations',
      temperament_companion: 'Forms an intense bond with their people',
      activity_very:       'Smart and athletic — loves puzzle toys and training',
      grooming_low:        'Sleek coat needs minimal grooming',
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
    tags: ['Lower-allergen', 'Chatty', 'Elegant'],
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
    name: 'Siberian',
    catApiId: 'sibe',
    wikiTitle: 'Siberian_cat',
    tags: ['Lower-allergen', 'Robust', 'Affectionate'],
    traits: {
      activity:    { low: 1, medium: 3, high: 3, very: 2 },
      space:       { small_apt: 1, apt: 2, house: 3, outdoor: 3 },
      children:    { none: 2, young: 3, older: 3 },
      pets:        { none: 2, dogs: 3, cats: 3, both: 3 },
      alone:       { rarely: 2, few: 3, half: 2, long: 1 },
      temperament: { lap: 2, companion: 3, independent: 2, playful: 3 },
      vocal:       { quiet: 2, some: 3, chatty: 1 },
      size:        { small: 0, medium: 1, large: 3, any: 3 },
      coat:        { fine: 3, low_shed: 1, allergy: 2 },
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
      temperament_playful: 'Loves fetch and interactive games',
      pets_both:         'Sociable with other cats and dogs',
    },
    note: 'Needs warmth and lots of play. Not happy left alone for long days.',
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
    },
    note: 'Not truly allergen-free. Needs a bath every week or two to remove skin oils, and must be kept warm and indoors because they sunburn. Ask about HCM screening.',
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
      coat:        { fine: 3, low_shed: 3, allergy: 1 },
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
    },
    note: 'Restricted or banned in some areas (e.g. Hawaii, Connecticut, New York City), especially early generations, so check local laws. Can become destructive without enough stimulation.',
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
  try {
    return await fetchCatApiImage(breed.catApiId);
  } catch {
    try {
      return await fetchWikipediaImage(breed.wikiTitle);
    } catch {
      return null;
    }
  }
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
  module.exports = { QUESTIONS, BREEDS, scoreBreeds, MAX_SCORE };
}
