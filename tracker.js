// Load program from localStorage
let generatedProgram = null;
let generatorProfile = null;
let currentDay = 0;
let sessionLogs = {};
let editingExerciseIndex = -1;
let editingExerciseSectionIdx = -1;
let editingDayIdx = -1;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  loadProgramData();
  if (!generatedProgram) {
    showNoProgramState();
    return;
  }
  buildDayTabs();
  switchDay(0);
});

function loadProgramData() {
  const stored = localStorage.getItem('generated_program');
  const profile = localStorage.getItem('generator_profile');

  if (stored) {
    generatedProgram = JSON.parse(stored);
  }
  if (profile) {
    generatorProfile = JSON.parse(profile);
  }
}

function showNoProgramState() {
  document.getElementById('mainContent').innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📋</div>
      <h2>No Program Generated Yet</h2>
      <p>Go back and generate a program first!</p>
      <button class="primary" onclick="window.location.href='index.html'" style="margin-top:20px;">Generate Program</button>
    </div>
  `;
}

function buildDayTabs() {
  const tabsContainer = document.getElementById('dayTabs');
  const selector = document.getElementById('daySelector');

  generatedProgram.days.forEach((day, idx) => {
    // Add to selector
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = day.label || `Day ${idx + 1}`;
    selector.appendChild(opt);

    // Add tab
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.textContent = day.label || `Day ${idx + 1}`;
    tab.onclick = () => switchDay(idx);
    tabsContainer.appendChild(tab);
  });
}

function switchDay(dayIdx) {
  currentDay = parseInt(dayIdx);
  if (currentDay < 0 || currentDay >= generatedProgram.days.length) return;

  // Update active tab
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', i === currentDay);
  });
  document.getElementById('daySelector').value = currentDay;

  // Initialize session logs for this day if not present
  if (!sessionLogs[currentDay]) {
    sessionLogs[currentDay] = { _date: new Date().toISOString().split('T')[0], exercises: [] };
  }

  renderDay();
}

function renderDay() {
  const day = generatedProgram.days[currentDay];
  const main = document.getElementById('mainContent');

  let html = `
    <div class="day-header">
      <div class="day-title">${day.label}</div>
      <div class="day-subtitle">${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
    </div>
    <div class="sections">
  `;

  // Render sections (Anchors, Accessories, etc.)
  const sections = day.weekA?.sections || [];
  sections.forEach((section, sIdx) => {
    html += `
      <div class="section">
        <div class="section-title">${section.label}</div>
        ${renderExercises(section.exercises, sIdx)}
      </div>
    `;
  });

  html += '</div>';
  main.innerHTML = html;
}

function renderExercises(exercises, sectionIdx) {
  if (!exercises || exercises.length === 0) {
    return '<div class="empty-state" style="padding: 20px; text-align: center; color: var(--muted);">No exercises</div>';
  }

  let html = '';
  exercises.forEach((ex, exIdx) => {
    const logged = sessionLogs[currentDay]?.exercises?.find(e => e.id === ex.id) || { sets: [] };

    html += `
      <div class="exercise">
        <div class="exercise-header">
          <div>
            <div class="exercise-name">${ex.name.value || ex.name}</div>
            ${ex.note ? `<div class="exercise-note">${ex.note}</div>` : ''}
          </div>
          <div class="exercise-actions">
            <button onclick="openEditModal(${currentDay}, ${sectionIdx}, ${exIdx})">Edit</button>
            <button onclick="removeExercise(${currentDay}, ${exIdx})">Remove</button>
          </div>
        </div>
        <div class="sets-grid">
          ${renderSets(ex, exIdx, logged.sets || [])}
        </div>
      </div>
    `;
  });

  return html;
}

function renderSets(exercise, exIdx, loggedSets) {
  const numSets = exercise.sets?.value || 3;
  let html = '';

  for (let i = 0; i < numSets; i++) {
    const logged = loggedSets[i] || {};
    html += `
      <div class="set-row">
        <div class="set-label">Set ${i + 1}</div>
        <input
          type="number"
          placeholder="lbs"
          value="${logged.weight || ''}"
          onchange="updateExerciseLog(${currentDay}, ${exIdx}, ${i}, 'weight', this.value)"
          data-day="${currentDay}" data-ex="${exIdx}" data-set="${i}" data-field="weight"
        />
        <input
          type="number"
          placeholder="reps"
          value="${logged.reps || ''}"
          onchange="updateExerciseLog(${currentDay}, ${exIdx}, ${i}, 'reps', this.value)"
          data-day="${currentDay}" data-ex="${exIdx}" data-set="${i}" data-field="reps"
        />
        <span style="font-size: 12px; color: var(--muted);">${exercise.reps?.value || '8-12'}</span>
      </div>
    `;
  }

  return html;
}

function updateExerciseLog(dayIdx, exIdx, setIdx, field, value) {
  if (!sessionLogs[dayIdx]) {
    sessionLogs[dayIdx] = { _date: new Date().toISOString().split('T')[0], exercises: [] };
  }

  const day = generatedProgram.days[dayIdx];
  const exercise = day.weekA?.sections?.[0]?.exercises?.[exIdx];

  if (!exercise) return;

  let exLog = sessionLogs[dayIdx].exercises.find(e => e.id === exercise.id);
  if (!exLog) {
    exLog = { id: exercise.id, name: exercise.name.value || exercise.name, sets: [] };
    sessionLogs[dayIdx].exercises.push(exLog);
  }

  if (!exLog.sets[setIdx]) {
    exLog.sets[setIdx] = {};
  }

  exLog.sets[setIdx][field] = value;
}

function openEditModal(dayIdx, sectionIdx, exIdx) {
  editingDayIdx = dayIdx;
  editingExerciseSectionIdx = sectionIdx;
  editingExerciseIndex = exIdx;

  const day = generatedProgram.days[dayIdx];
  const exercise = day.weekA?.sections?.[sectionIdx]?.exercises?.[exIdx];

  if (!exercise) return;

  document.getElementById('editExerciseName').textContent = exercise.name.value || exercise.name;

  // Get exercise suggestions
  const muscle = getMuscleForExercise(exercise.id);
  const alternatives = getExerciseAlternatives(exercise.id, muscle);

  let suggestionsHtml = alternatives.map(alt => `
    <div class="suggestion" onclick="swapExercise('${alt.id}', '${alt.name}')">
      <div class="suggestion-name">${alt.name}</div>
      <div class="suggestion-reason">${alt.reason}</div>
    </div>
  `).join('');

  document.getElementById('exerciseSuggestions').innerHTML = suggestionsHtml || '<div style="color: var(--muted);">No alternatives available</div>';

  // Volume suggestions
  const volumeSuggestions = getVolumeSuggestions(exercise);
  document.getElementById('volumeSuggestions').innerHTML = volumeSuggestions;

  document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
}

function swapExercise(newExId, newExName) {
  const day = generatedProgram.days[editingDayIdx];
  const section = day.weekA?.sections?.[editingExerciseSectionIdx];

  if (section && section.exercises[editingExerciseIndex]) {
    const oldExercise = section.exercises[editingExerciseIndex];
    section.exercises[editingExerciseIndex] = {
      ...oldExercise,
      id: newExId,
      name: { value: newExName, source: 'user_override', rule: 'exercise_substitution' }
    };
  }

  closeEditModal();
  renderDay();
}

function getExerciseAlternatives(exerciseId, muscle) {
  // Find exercises that work the same muscle
  const alternatives = [];

  EXERCISES.forEach(ex => {
    if (ex.id === exerciseId) return; // Skip current

    // Simple logic: same muscle group
    if (ex.muscles?.primary?.includes(muscle) || ex.muscles?.secondary?.includes(muscle)) {
      alternatives.push({
        id: ex.id,
        name: ex.name,
        reason: 'Similar muscle, different movement'
      });
    }
  });

  return alternatives.slice(0, 5);
}

function getMuscleForExercise(exerciseId) {
  const ex = EXERCISES.find(e => e.id === exerciseId);
  return ex?.muscles?.primary?.[0] || 'chest';
}

function getVolumeSuggestions(exercise) {
  const currentSets = exercise.sets?.value || 3;

  return `
    <div class="suggestion" onclick="adjustVolume(${currentSets - 1})">
      <div class="suggestion-name">Reduce to ${Math.max(1, currentSets - 1)} sets</div>
      <div class="suggestion-reason">Less volume, more recovery</div>
    </div>
    <div class="suggestion" onclick="adjustVolume(${currentSets + 1})">
      <div class="suggestion-name">Increase to ${currentSets + 1} sets</div>
      <div class="suggestion-reason">More volume, more stimulus</div>
    </div>
  `;
}

function adjustVolume(newSets) {
  const day = generatedProgram.days[editingDayIdx];
  const section = day.weekA?.sections?.[editingExerciseSectionIdx];

  if (section && section.exercises[editingExerciseIndex]) {
    section.exercises[editingExerciseIndex].sets = {
      value: newSets,
      source: 'user_override',
      rule: 'volume_adjustment'
    };
  }

  closeEditModal();
  renderDay();
}

function removeExercise(dayIdx, exIdx) {
  const day = generatedProgram.days[dayIdx];
  day.weekA?.sections?.forEach(section => {
    section.exercises = section.exercises.filter((_, i) => i !== exIdx);
  });

  renderDay();
}

function applyEdit() {
  closeEditModal();
  renderDay();
}

function saveWorkout() {
  if (!sessionLogs[currentDay] || sessionLogs[currentDay].exercises.length === 0) {
    alert('Log some exercises first!');
    return;
  }

  // Save to localStorage
  const workoutHistory = JSON.parse(localStorage.getItem('workout_history') || '[]');
  workoutHistory.push({
    date: new Date().toISOString(),
    dayLabel: generatedProgram.days[currentDay].label,
    exercises: sessionLogs[currentDay].exercises
  });

  localStorage.setItem('workout_history', JSON.stringify(workoutHistory));

  // Save exercise history
  sessionLogs[currentDay].exercises.forEach(ex => {
    const hist = JSON.parse(localStorage.getItem(`hist_${ex.id}`) || '[]');
    const completedSets = ex.sets.filter(s => s.weight || s.reps);
    if (completedSets.length > 0) {
      hist.push({
        date: new Date().toISOString().split('T')[0],
        sets: completedSets
      });
      localStorage.setItem(`hist_${ex.id}`, JSON.stringify(hist));
    }
  });

  alert('Workout saved!');

  // Clear for next session
  sessionLogs[currentDay] = { _date: new Date().toISOString().split('T')[0], exercises: [] };
  renderDay();
}
