// ─── EQUIPMENT LIST ───────────────────────────────────────────

const EQUIPMENT_OPTIONS = [
  // Free weights
  { id: 'barbell',         label: 'Barbell + Plates', category: 'free_weights' },
  { id: 'dumbbells',       label: 'Dumbbells', category: 'free_weights' },
  { id: 'ez_bar',          label: 'EZ Curl Bar', category: 'free_weights' },
  { id: 'trap_bar',        label: 'Trap / Hex Bar', category: 'free_weights' },
  { id: 'kettlebells',     label: 'Kettlebells', category: 'free_weights' },
  // Benches & racks
  { id: 'bench',           label: 'Adjustable Bench', category: 'benches' },
  { id: 'squat_rack',      label: 'Squat Rack / Power Rack', category: 'benches' },
  { id: 'smith_machine',   label: 'Smith Machine', category: 'benches' },
  // Cable & pulley
  { id: 'cables',          label: 'Cable Machine', category: 'cables' },
  { id: 'cable_crossover', label: 'Cable Crossover Station', category: 'cables' },
  // Pull & bodyweight
  { id: 'pull_up_bar',     label: 'Pull-Up Bar', category: 'bodyweight' },
  { id: 'dip_station',     label: 'Dip Station', category: 'bodyweight' },
  { id: 'bodyweight',      label: 'Bodyweight Only', category: 'bodyweight' },
  // Leg machines
  { id: 'leg_press',       label: 'Leg Press', category: 'machines' },
  { id: 'hack_squat',      label: 'Hack Squat Machine', category: 'machines' },
  { id: 'leg_curl',        label: 'Leg Curl / Extension', category: 'machines' },
  { id: 'hip_thrust_machine', label: 'Hip Thrust Machine', category: 'machines' },
  { id: 'calf_machine',    label: 'Calf Raise Machine', category: 'machines' },
  { id: 'adductor_abductor', label: 'Adductor / Abductor Machine', category: 'machines' },
  // Upper body machines
  { id: 'lat_pulldown',    label: 'Lat Pulldown', category: 'machines' },
  { id: 'seated_row',      label: 'Seated Row Machine', category: 'machines' },
  { id: 'chest_press',     label: 'Chest Press Machine', category: 'machines' },
  { id: 'shoulder_press_machine', label: 'Shoulder Press Machine', category: 'machines' },
  { id: 'pec_deck',        label: 'Pec Deck / Fly Machine', category: 'machines' },
  { id: 'chest_supported_row', label: 'Chest-Supported Row', category: 'machines' },
  { id: 'rear_delt_machine', label: 'Rear Delt / Reverse Fly Machine', category: 'machines' },
  { id: 'preacher_curl',   label: 'Preacher Curl Bench', category: 'machines' },
  // Cardio / other
  { id: 'bands',           label: 'Resistance Bands', category: 'other' },
];

// ─── EXERCISE DATABASE ────────────────────────────────────────
// Each exercise has: id, name, muscles (primary + secondary), equipment required,
// priority (lower = preferred), and substitution chain.
//
// Priority ordering: when multiple exercises hit the same muscle and all equipment
// is available, lower priority number wins. Substitutions list fallbacks when
// primary equipment is unavailable.

const EXERCISE_DB = [
  // ── CHEST ──
  { id: 'barbell_bench',       name: 'Barbell Bench Press',         muscles: { primary: ['chest'], secondary: ['triceps', 'shoulders'] }, equipment: ['barbell', 'bench'], priority: 1, anchor: true,
    substitutions: ['smith_bench', 'db_bench', 'chest_press_machine'], cue: "Blades pinched, slight arch. 2-sec descent to mid-chest, drive through the floor." },
  { id: 'smith_bench',         name: 'Smith Machine Bench Press',   muscles: { primary: ['chest'], secondary: ['triceps', 'shoulders'] }, equipment: ['smith_machine', 'bench'], priority: 2, anchor: true,
    substitutions: ['db_bench', 'chest_press_machine'], cue: "Fixed bar path \u2014 control the descent, touch just below nipple line, press up and slightly back." },
  { id: 'db_bench',            name: 'Dumbbell Bench Press',        muscles: { primary: ['chest'], secondary: ['triceps', 'shoulders'] }, equipment: ['dumbbells', 'bench'], priority: 3, anchor: true,
    substitutions: ['chest_press_machine', 'push_ups'], cue: "Deep stretch at the bottom, dumbbells over lower chest. Keep tension \u2014 don't clank at the top." },
  { id: 'chest_press_machine', name: 'Machine Chest Press',         muscles: { primary: ['chest'], secondary: ['triceps'] }, equipment: ['chest_press'], priority: 4, anchor: false,
    substitutions: ['push_ups'], cue: "Seat set so handles align with mid-chest. Full squeeze at lockout, slow return." },
  { id: 'incline_barbell',     name: 'Incline Barbell Bench',       muscles: { primary: ['chest'], secondary: ['shoulders', 'triceps'] }, equipment: ['barbell', 'bench'], priority: 1, anchor: true,
    substitutions: ['incline_smith', 'incline_db'], cue: "30\u201345\u00b0 bench. Bar to upper chest, elbows ~45\u00b0. Emphasize the clavicular head." },
  { id: 'incline_smith',       name: 'Incline Smith Press',         muscles: { primary: ['chest'], secondary: ['shoulders', 'triceps'] }, equipment: ['smith_machine', 'bench'], priority: 2, anchor: true,
    substitutions: ['incline_db'], cue: "Upper-chest focus. 2-sec descent, pause an inch off the chest, press without flaring." },
  { id: 'incline_db',          name: 'Incline Dumbbell Press',      muscles: { primary: ['chest'], secondary: ['shoulders', 'triceps'] }, equipment: ['dumbbells', 'bench'], priority: 3, anchor: true,
    substitutions: ['chest_press_machine'], cue: "Palms slightly in, deep stretch. Press up and together, squeeze at the top." },
  { id: 'cable_fly_htl',       name: 'Cable Fly (High to Low)',     muscles: { primary: ['chest'], secondary: [] }, equipment: ['cables'], priority: 1, anchor: false,
    substitutions: ['db_fly', 'pec_deck_fly'], cue: "High-to-low targets lower chest. Soft elbows, hug down and in, hold the squeeze 1 sec." },
  { id: 'cable_fly_lth',       name: 'Cable Fly (Low to High)',     muscles: { primary: ['chest'], secondary: ['shoulders'] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: ['incline_db_fly', 'pec_deck_fly'], cue: "Low-to-high hits upper chest. Sweep up and together, control the stretch back." },
  { id: 'db_fly',              name: 'Dumbbell Fly',                muscles: { primary: ['chest'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 3, anchor: false,
    substitutions: ['pec_deck_fly'], cue: "Big stretch at the bottom, elbow bend fixed. Hug \u2014 don't press." },
  { id: 'incline_db_fly',      name: 'Incline Dumbbell Fly',        muscles: { primary: ['chest'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 4, anchor: false,
    substitutions: ['pec_deck_fly'], cue: "Upper-chest stretch. Wide arc, control the negative, squeeze at the top." },
  { id: 'pec_deck_fly',        name: 'Pec Deck Fly',                muscles: { primary: ['chest'], secondary: [] }, equipment: ['pec_deck'], priority: 5, anchor: false,
    substitutions: [], cue: "Constant tension. Squeeze pads together, pause 1 sec, slow return without touching the stack." },
  { id: 'hex_press',           name: 'Hex Press',                   muscles: { primary: ['chest'], secondary: ['triceps'] }, equipment: ['dumbbells', 'bench'], priority: 5, anchor: false,
    substitutions: ['db_fly'], cue: "Press dumbbells hard together the whole set \u2014 inner-chest activation. Squeeze at top." },
  { id: 'push_ups',            name: 'Push-Ups',                    muscles: { primary: ['chest'], secondary: ['triceps', 'shoulders'] }, equipment: ['bodyweight'], priority: 10, anchor: false,
    substitutions: [], cue: "Body in a straight line, elbows ~45\u00b0. Full range \u2014 chest to floor, full lockout." },

  // ── BACK ──
  { id: 'barbell_row',         name: 'Barbell Row',                 muscles: { primary: ['back'], secondary: ['biceps', 'rear_delts'] }, equipment: ['barbell'], priority: 1, anchor: true,
    substitutions: ['db_row', 'cable_row'], cue: "Hinge ~45\u00b0, flat back. Pull to lower ribs, drive elbows back, squeeze the lats." },
  { id: 'db_row',              name: 'Dumbbell Row',                muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['dumbbells', 'bench'], priority: 2, anchor: true,
    substitutions: ['cable_row'], cue: "Supported on bench. Pull to hip, full stretch at the bottom, no torso rotation." },
  { id: 'cable_row',           name: 'Seated Cable Row',            muscles: { primary: ['back'], secondary: ['biceps', 'rear_delts'] }, equipment: ['seated_row'], priority: 3, anchor: true,
    substitutions: ['db_row'], cue: "Chest tall, pull to navel. Lead with elbows, squeeze the blades, control the stretch." },
  { id: 'cable_row_wide',      name: 'Seated Cable Row (Wide)',     muscles: { primary: ['back', 'rear_delts'], secondary: ['biceps'] }, equipment: ['seated_row'], priority: 4, anchor: true,
    substitutions: ['barbell_row', 'db_row'], cue: "Wide grip, elbows flared \u2014 upper back and rear delts. Squeeze, then long stretch forward." },
  { id: 'wtd_pullup',          name: 'Weighted Pull-Up',            muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['pull_up_bar'], priority: 1, anchor: true,
    substitutions: ['lat_pulldown_machine', 'bw_pullup'], cue: "Full dead hang, chin over bar. Drive elbows to hips, control the descent." },
  { id: 'bw_pullup',           name: 'Bodyweight Pull-Up',          muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['pull_up_bar'], priority: 3, anchor: false,
    substitutions: ['lat_pulldown_machine'], cue: "Dead hang to chin-over-bar. No kipping \u2014 smooth and controlled both ways." },
  { id: 'lat_pulldown_machine',name: 'Lat Pulldown',                muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['lat_pulldown'], priority: 2, anchor: true,
    substitutions: ['bw_pullup', 'db_row'], cue: "Pull to upper chest, lean back slightly. Full stretch at top, drive elbows down." },
  { id: 'close_grip_pulldown', name: 'Close Grip Lat Pulldown',     muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['lat_pulldown'], priority: 4, anchor: false,
    substitutions: ['bw_pullup'], cue: "Neutral close grip hits lower lats. Full stretch overhead, pull to sternum." },
  { id: 'cable_pullover',      name: 'Cable Pullover',              muscles: { primary: ['back'], secondary: [] }, equipment: ['cables'], priority: 3, anchor: false,
    substitutions: ['db_pullover'], cue: "Arms nearly straight. Feel the lat at full stretch, pull down in an arc to the hips." },
  { id: 'db_pullover',         name: 'Dumbbell Pullover',           muscles: { primary: ['back', 'chest'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 5, anchor: false,
    substitutions: [], cue: "Deep stretch over the bench. Slight elbow bend, pull the dumbbell over in an arc." },

  // ── SHOULDERS ──
  { id: 'military_press',      name: 'Military Press (Barbell)',    muscles: { primary: ['shoulders'], secondary: ['triceps'] }, equipment: ['barbell'], priority: 1, anchor: true,
    substitutions: ['smith_shoulder_press', 'db_shoulder_press'], cue: "Braced core, glutes tight. Press to full lockout, bar tracks over mid-foot." },
  { id: 'smith_shoulder_press',name: 'Smith Machine Shoulder Press',muscles: { primary: ['shoulders'], secondary: ['triceps'] }, equipment: ['smith_machine'], priority: 2, anchor: true,
    substitutions: ['db_shoulder_press'], cue: "Seat back slightly. Press to lockout, control down to ear level \u2014 no bouncing." },
  { id: 'db_shoulder_press',   name: 'Dumbbell Shoulder Press',     muscles: { primary: ['shoulders'], secondary: ['triceps'] }, equipment: ['dumbbells', 'bench'], priority: 3, anchor: true,
    substitutions: [], cue: "Dumbbells at ear height to start. Press up and slightly in, full stretch at the bottom." },
  { id: 'cable_lat_raise',     name: 'Cable Lateral Raise',         muscles: { primary: ['side_delts'], secondary: [] }, equipment: ['cables'], priority: 1, anchor: false,
    substitutions: ['db_lat_raise'], cue: "One arm, constant tension. Lead with the elbow, don't shrug \u2014 pause at the top." },
  { id: 'db_lat_raise',        name: 'Dumbbell Lateral Raise',      muscles: { primary: ['side_delts'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: false,
    substitutions: [], cue: "Slight lean, pinky-high. Raise to shoulder height, control down \u2014 chase the burn, not the weight." },
  { id: 'face_pull',           name: 'Face Pull',                   muscles: { primary: ['rear_delts'], secondary: ['traps'] }, equipment: ['cables'], priority: 1, anchor: false,
    substitutions: ['band_pull_apart', 'rear_delt_fly'], cue: "Pull rope to forehead, elbows high and wide. External-rotate at the end \u2014 rear delt and shoulder health." },
  { id: 'rear_delt_fly',       name: 'Rear Delt Fly (Dumbbell)',    muscles: { primary: ['rear_delts'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 2, anchor: false,
    substitutions: [], cue: "Hinge forward, slight elbow bend. Sweep out and back, squeeze rear delts, slow return." },
  { id: 'band_pull_apart',     name: 'Band Pull-Apart',             muscles: { primary: ['rear_delts'], secondary: ['traps'] }, equipment: ['bodyweight'], priority: 5, anchor: false,
    substitutions: [], cue: "Arms straight, pull the band to your chest. Squeeze the blades, control back." },

  // ── QUADS ──
  { id: 'barbell_squat',       name: 'Barbell Squat',               muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings'] }, equipment: ['barbell'], priority: 1, anchor: true,
    substitutions: ['smith_squat', 'goblet_squat', 'leg_press_exercise'], cue: "Brace hard, hips and knees break together. Depth to parallel or below, drive through mid-foot." },
  { id: 'smith_squat',         name: 'Smith Machine Squat',         muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings'] }, equipment: ['smith_machine'], priority: 2, anchor: true,
    substitutions: ['goblet_squat', 'leg_press_exercise'], cue: "Feet slightly forward. Sit down between the bars, hit depth, drive up \u2014 great for quad focus." },
  { id: 'goblet_squat',        name: 'Goblet Squat',                muscles: { primary: ['quads'], secondary: ['glutes'] }, equipment: ['dumbbells'], priority: 4, anchor: false,
    substitutions: ['leg_press_exercise', 'bodyweight_squat'], cue: "Weight at the chest, elbows inside knees. Sit tall and deep, drive through the heels." },
  { id: 'leg_press_exercise',  name: 'Leg Press',                   muscles: { primary: ['quads'], secondary: ['glutes'] }, equipment: ['leg_press'], priority: 3, anchor: false,
    substitutions: ['goblet_squat', 'smith_squat'], cue: "Feet mid-platform. Deep controlled descent, knees track over toes, don't lock out hard." },
  { id: 'leg_extension',       name: 'Leg Extension',               muscles: { primary: ['quads'], secondary: [] }, equipment: ['leg_curl'], priority: 2, anchor: false,
    substitutions: ['goblet_squat'], cue: "Squeeze quads hard at the top, 1-sec hold. Slow the negative, no swinging." },
  { id: 'bulgarian_split',     name: 'Bulgarian Split Squat',       muscles: { primary: ['quads', 'glutes'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 2, anchor: true,
    substitutions: ['smith_lunge', 'db_lunge'], cue: "Rear foot elevated, weight on the front heel. Sink straight down, drive up \u2014 own the balance." },
  { id: 'smith_lunge',         name: 'Smith Machine Lunge',         muscles: { primary: ['quads', 'glutes'], secondary: [] }, equipment: ['smith_machine'], priority: 3, anchor: true,
    substitutions: ['db_lunge'], cue: "Long stride, drop the back knee. Drive through the front heel, torso upright." },
  { id: 'db_lunge',            name: 'Dumbbell Lunge',              muscles: { primary: ['quads', 'glutes'], secondary: [] }, equipment: ['dumbbells'], priority: 4, anchor: true,
    substitutions: ['bodyweight_squat'], cue: "Step out and drop straight down. Push through the front heel, controlled and balanced." },
  { id: 'bodyweight_squat',    name: 'Bodyweight Squat',            muscles: { primary: ['quads'], secondary: ['glutes'] }, equipment: ['bodyweight'], priority: 10, anchor: false,
    substitutions: [], cue: "Full depth, chest up. Control down, drive up \u2014 squeeze glutes at the top." },

  // ── HAMSTRINGS ──
  { id: 'rdl',                 name: 'Romanian Deadlift',           muscles: { primary: ['hamstrings', 'glutes'], secondary: ['back'] }, equipment: ['barbell'], priority: 1, anchor: true,
    substitutions: ['db_rdl', 'good_morning'], cue: "Soft knees, push hips back. Bar close to the legs, feel the stretch, drive hips forward to stand." },
  { id: 'db_rdl',              name: 'Dumbbell Romanian Deadlift',  muscles: { primary: ['hamstrings', 'glutes'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: true,
    substitutions: ['good_morning'], cue: "Hinge at the hips, dumbbells tracking the thighs. Stretch to mid-shin, squeeze glutes up." },
  { id: 'good_morning',        name: 'Good Mornings',               muscles: { primary: ['hamstrings'], secondary: ['back', 'glutes'] }, equipment: ['barbell'], priority: 3, anchor: false,
    substitutions: ['smith_good_morning'], cue: "Soft knees, flat back, hinge forward. Load the hamstrings, bar path over mid-foot." },
  { id: 'smith_good_morning',  name: 'Good Mornings (Smith)',       muscles: { primary: ['hamstrings'], secondary: ['back', 'glutes'] }, equipment: ['smith_machine'], priority: 4, anchor: false,
    substitutions: [], cue: "Fixed bar on traps. Push hips back, flat back, stop at a strong hamstring stretch." },
  { id: 'prone_leg_curl',      name: 'Prone Leg Curl',              muscles: { primary: ['hamstrings'], secondary: [] }, equipment: ['leg_curl'], priority: 1, anchor: false,
    substitutions: ['seated_leg_curl', 'db_rdl'], cue: "Curl heels to glutes, squeeze at the top. Slow the negative, hips stay down." },
  { id: 'seated_leg_curl',     name: 'Seated Leg Curl',             muscles: { primary: ['hamstrings'], secondary: [] }, equipment: ['leg_curl'], priority: 2, anchor: false,
    substitutions: ['db_rdl'], cue: "Drive heels down and under, deep squeeze. Control back to full stretch." },

  // ── GLUTES ──
  { id: 'hip_thrust',          name: 'Barbell Hip Thrust',          muscles: { primary: ['glutes'], secondary: ['hamstrings'] }, equipment: ['barbell', 'bench'], priority: 1, anchor: true,
    substitutions: ['smith_hip_thrust', 'cable_kickback'], cue: "Shoulders on bench, chin tucked. Drive hips to full lockout, squeeze hard, 1-sec hold." },
  { id: 'smith_hip_thrust',    name: 'Smith Machine Hip Thrust',    muscles: { primary: ['glutes'], secondary: ['hamstrings'] }, equipment: ['smith_machine', 'bench'], priority: 2, anchor: true,
    substitutions: ['cable_kickback'], cue: "Bar over hips, feet flat. Full lockout, pause and squeeze at the top, control down." },
  { id: 'cable_kickback',      name: 'Cable Kickback',              muscles: { primary: ['glutes'], secondary: [] }, equipment: ['cables'], priority: 3, anchor: false,
    substitutions: [], cue: "Hinge slightly, drive the heel back and up. Squeeze the glute, no lower-back arch." },
  { id: 'cable_hip_abduction', name: 'Cable Hip Abduction',         muscles: { primary: ['glutes'], secondary: [] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: [], cue: "Lean into the cable, drive the leg out. Controlled \u2014 squeeze the glute med at the end." },
  { id: 'cable_hip_adduction', name: 'Cable Hip Adduction',         muscles: { primary: ['glutes'], secondary: [] }, equipment: ['cables'], priority: 4, anchor: false,
    substitutions: [], cue: "Drive the leg across the midline. Squeeze the inner thigh, slow return." },

  // ── CALVES ──
  { id: 'standing_calf',       name: 'Standing Calf Raise',         muscles: { primary: ['calves'], secondary: [] }, equipment: ['smith_machine'], priority: 1, anchor: false,
    substitutions: ['seated_calf', 'calf_on_leg_press'], cue: "Full stretch at the bottom, explode to a high toe-point. 1-sec squeeze up top." },
  { id: 'seated_calf',         name: 'Seated Calf Raise',           muscles: { primary: ['calves'], secondary: [] }, equipment: ['smith_machine'], priority: 2, anchor: false,
    substitutions: ['calf_on_leg_press'], cue: "Bent knee hits the soleus. Deep stretch, pause, drive up \u2014 don't bounce." },
  { id: 'calf_on_leg_press',   name: 'Calf Raise on Leg Press',     muscles: { primary: ['calves'], secondary: [] }, equipment: ['leg_press'], priority: 3, anchor: false,
    substitutions: ['db_calf_raise'], cue: "Toes on the platform edge. Big stretch down, full extension up, controlled tempo." },
  { id: 'db_calf_raise',       name: 'Dumbbell Calf Raise',         muscles: { primary: ['calves'], secondary: [] }, equipment: ['dumbbells'], priority: 5, anchor: false,
    substitutions: [], cue: "Balls of the feet on a plate/step. Full stretch, drive to a high point, squeeze." },

  // ── BICEPS ──
  { id: 'barbell_curl',        name: 'Barbell Curl',                muscles: { primary: ['biceps'], secondary: ['forearms'] }, equipment: ['barbell'], priority: 1, anchor: false,
    substitutions: ['db_curl', 'cable_curl'], cue: "Elbows pinned to the sides. Curl up, squeeze, control down \u2014 no swinging." },
  { id: 'db_curl',             name: 'Dumbbell Curl',               muscles: { primary: ['biceps'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: false,
    substitutions: ['cable_curl'], cue: "Supinate as you curl, squeeze at the top. Slow negatives, no swing." },
  { id: 'cable_curl',          name: 'Cable Curl',                  muscles: { primary: ['biceps'], secondary: [] }, equipment: ['cables'], priority: 3, anchor: false,
    substitutions: ['db_curl'], cue: "Constant tension. Elbows fixed, curl and squeeze, resist on the way down." },
  { id: 'incline_db_curl',     name: 'Incline Dumbbell Curl',       muscles: { primary: ['biceps'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 2, anchor: false,
    substitutions: ['cable_curl'], cue: "Lie back on the incline \u2014 biceps in a deep stretch. Curl without the elbows drifting forward." },
  { id: 'hammer_curl',         name: 'Hammer Curl',                 muscles: { primary: ['biceps', 'forearms'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: false,
    substitutions: ['cable_curl'], cue: "Neutral grip for brachialis and forearm. Curl up, control down, no swing." },
  { id: 'reverse_curl',        name: 'Reverse Curl',                muscles: { primary: ['forearms', 'biceps'], secondary: [] }, equipment: ['barbell'], priority: 3, anchor: false,
    substitutions: ['db_curl'], cue: "Overhand grip, wrists neutral. Strict reps for the brachioradialis and forearms." },

  // ── TRICEPS ──
  { id: 'skull_crusher',       name: 'Skull Crusher',               muscles: { primary: ['triceps'], secondary: [] }, equipment: ['barbell', 'bench'], priority: 1, anchor: false,
    substitutions: ['rope_pushdown', 'overhead_tri_ext'], cue: "Elbows fixed, lower to forehead/behind. Long-head stretch, extend and squeeze." },
  { id: 'rope_pushdown',       name: 'Rope Pushdown',               muscles: { primary: ['triceps'], secondary: [] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: ['overhead_tri_ext'], cue: "Elbows pinned. Push down and split the rope at the bottom, full lockout squeeze." },
  { id: 'overhead_tri_ext',    name: 'Overhead Tricep Extension',   muscles: { primary: ['triceps'], secondary: [] }, equipment: ['cables'], priority: 3, anchor: false,
    substitutions: ['db_overhead_tri'], cue: "Long-head focus \u2014 arms overhead, deep stretch. Extend fully, control back." },
  { id: 'db_overhead_tri',     name: 'DB Overhead Tricep Extension', muscles: { primary: ['triceps'], secondary: [] }, equipment: ['dumbbells'], priority: 4, anchor: false,
    substitutions: [], cue: "One or two hands overhead. Deep stretch behind the head, extend to lockout." },
  { id: 'close_grip_bench',    name: 'Close Grip Bench Press',      muscles: { primary: ['triceps'], secondary: ['chest'] }, equipment: ['barbell', 'bench'], priority: 2, anchor: false,
    substitutions: ['rope_pushdown'], cue: "Shoulder-width grip, elbows tucked. Drive through the triceps, full lockout." },
  { id: 'dips',                name: 'Dips',                        muscles: { primary: ['triceps', 'chest'], secondary: ['shoulders'] }, equipment: ['dip_station'], priority: 2, anchor: false,
    substitutions: ['rope_pushdown'], cue: "Lean forward for chest, upright for triceps. Full depth, control, lock out at the top." },

  // ── TRAPS ──
  { id: 'barbell_shrug',       name: 'Barbell Shrug',               muscles: { primary: ['traps'], secondary: [] }, equipment: ['barbell'], priority: 1, anchor: false,
    substitutions: ['db_shrug'], cue: "Straight up, 1-sec hold at the top. No rolling \u2014 squeeze the traps, control down." },
  { id: 'db_shrug',            name: 'Dumbbell Shrug',              muscles: { primary: ['traps'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: false,
    substitutions: [], cue: "Dumbbells at the sides. Shrug to your ears, pause and squeeze, slow negative." },

  // ── ABS ──
  { id: 'hanging_leg_raise',   name: 'Hanging Leg Raise',           muscles: { primary: ['abs'], secondary: [] }, equipment: ['pull_up_bar'], priority: 1, anchor: false,
    substitutions: ['cable_crunch', 'decline_situp'], cue: "Dead hang, no swinging. Raise the legs with the lower abs, control the descent." },
  { id: 'cable_crunch',        name: 'Cable Crunch',                muscles: { primary: ['abs'], secondary: [] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: ['decline_situp'], cue: "Kneel, rope by the head. Crunch down with the abs \u2014 round the spine, squeeze, slow return." },
  { id: 'decline_situp',       name: 'Decline Sit-Up',              muscles: { primary: ['abs'], secondary: [] }, equipment: ['bench'], priority: 3, anchor: false,
    substitutions: ['bodyweight_crunch'], cue: "Controlled up and down. Don't yank the neck \u2014 drive with the abs, add weight to progress." },
  { id: 'cable_rotation',      name: 'Cable Rotation (Obliques)',   muscles: { primary: ['abs'], secondary: [] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: ['russian_twist'], cue: "Braced core, rotate from the trunk. Obliques do the work, not the arms." },
  { id: 'russian_twist',       name: 'Russian Twist',               muscles: { primary: ['abs'], secondary: [] }, equipment: ['bodyweight'], priority: 5, anchor: false,
    substitutions: [], cue: "Feet up, lean back. Rotate side to side under control, touch each side." },
  { id: 'bodyweight_crunch',   name: 'Bodyweight Crunch',           muscles: { primary: ['abs'], secondary: [] }, equipment: ['bodyweight'], priority: 10, anchor: false,
    substitutions: [], cue: "Short-range crunch, ribs to hips. Squeeze at the top, no neck pulling." },
];

// ─── EXERCISE LOOKUP HELPERS ──────────────────────────────────

function getExerciseById(id) {
  return EXERCISE_DB.find(e => e.id === id) || null;
}

function getExercisesForMuscle(muscle, availableEquipment) {
  return EXERCISE_DB
    .filter(e => {
      const hitsMuscle = e.muscles.primary.includes(muscle);
      const hasEquipment = e.equipment.every(eq => availableEquipment.includes(eq));
      return hitsMuscle && hasEquipment;
    })
    .sort((a, b) => a.priority - b.priority);
}

function getAnchorsForMuscle(muscle, availableEquipment) {
  return getExercisesForMuscle(muscle, availableEquipment).filter(e => e.anchor);
}

function getAccessoriesForMuscle(muscle, availableEquipment) {
  return getExercisesForMuscle(muscle, availableEquipment).filter(e => !e.anchor);
}

function findSubstitute(exerciseId, availableEquipment) {
  const ex = getExerciseById(exerciseId);
  if (!ex) return null;
  for (const subId of ex.substitutions) {
    const sub = getExerciseById(subId);
    if (sub && sub.equipment.every(eq => availableEquipment.includes(eq))) {
      return sub;
    }
  }
  return null;
}
