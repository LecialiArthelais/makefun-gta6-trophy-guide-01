// GTA VI trophy guide & tracker: all 55 official PS5 trophies, checklist saved in
// localStorage, export/import, search, filters by grade and kind, spoiler setting.
const KEY = 'gta6-trophy-checklist';
const rows = document.getElementById('rows');
const gradeSel = document.getElementById('grade');
const kindSel = document.getElementById('kind');
const searchInput = document.getElementById('search');
const spoilerBox = document.getElementById('spoiler');
let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
const doc = await (await fetch('data/trophies.json')).json();

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function matches(t) {
  if (gradeSel.value !== 'all' && t.grade !== gradeSel.value) return false;
  if (kindSel.value === 'missable') { if (!t.missable) return false; }
  else if (kindSel.value !== 'all' && t.kind !== kindSel.value) return false;
  const q = searchInput.value.trim().toLowerCase();
  if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
  return true;
}

function render() {
  rows.replaceChildren();
  let shown = 0;
  for (const t of doc.trophies) {
    if (!matches(t)) continue;
    shown++;
    const isEarned = earned.has(t.name);
    const hidden = spoilerBox.checked && t.hidden && !isEarned;
    const tr = document.createElement('tr');
    if (t.missable) tr.classList.add('missable');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned;
    box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      save();
      render();
    });
    const nameCell = document.createElement('td');
    const strong = document.createElement('strong');
    strong.textContent = hidden ? '??? Hidden trophy' : t.name;
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = hidden ? 'Hidden until earned — tick it off to reveal.' : t.description;
    nameCell.append(strong, desc);
    if (t.missable) {
      const badge = document.createElement('span');
      badge.className = 'badge missable-badge';
      badge.textContent = '⚠ POSSIBLY MISSABLE';
      nameCell.append(badge);
    }
    const gradeCell = document.createElement('td');
    gradeCell.textContent = t.grade;
    gradeCell.className = 'grade-' + t.grade;
    const kindCell = document.createElement('td');
    kindCell.textContent = t.kind;
    const guideCell = document.createElement('td');
    const guideText = document.createElement('div');
    guideText.textContent = hidden ? 'Guide hidden with the spoiler setting.' : t.guide;
    guideCell.append(guideText);
    if (!hidden && t.sources && t.sources.length) {
      const src = document.createElement('div');
      src.className = 'sources';
      src.textContent = 'Sources: ' + t.sources.join(', ');
      guideCell.append(src);
    }
    const boxCell = document.createElement('td');
    boxCell.append(box);
    tr.append(boxCell, nameCell, gradeCell, kindCell, guideCell);
    rows.append(tr);
  }
  const total = doc.trophies.length;
  document.getElementById('progress').textContent = `${earned.size} of ${total} earned`;
  document.getElementById('barfill').style.width = (earned.size / total * 100) + '%';
  const counts = {};
  for (const t of doc.trophies) {
    if (earned.has(t.name)) counts[t.grade] = (counts[t.grade] || 0) + 1;
  }
  const totals = {};
  for (const t of doc.trophies) totals[t.grade] = (totals[t.grade] || 0) + 1;
  document.getElementById('bygrade').textContent =
    ['platinum', 'gold', 'silver', 'bronze'].map(g => `${g}: ${counts[g] || 0}/${totals[g] || 0}`).join(' · ');
  if (shown === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.textContent = 'No trophies match these filters.';
    tr.append(td);
    rows.append(tr);
  }
}

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify([...earned])], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
});
document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Reset all trophy progress? This clears every ticked trophy.')) return;
  localStorage.removeItem(KEY);
  earned = new Set();
  save();
  render();
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const names = JSON.parse(await file.text());
    earned = new Set(names.filter((n) => doc.trophies.some((t) => t.name === n)));
  } catch { /* keep current progress on a bad file */ }
  save();
  render();
});
gradeSel.addEventListener('change', render);
kindSel.addEventListener('change', render);
searchInput.addEventListener('input', render);
spoilerBox.addEventListener('change', render);

const list = document.getElementById('sourcelist');
if (doc.sources) {
  for (const s of doc.sources) {
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.name;
    a.target = '_blank';
    a.rel = 'noopener';
    list.append(a, document.createTextNode(' · '));
  }
  list.lastChild.remove();
}
render();
