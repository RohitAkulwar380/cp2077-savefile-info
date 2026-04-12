// ══════════════════════════════════════════════════════════════════════════════
// NIGHT CITY CHRONICLE — parser.js v2.1 (Design Migrated)
// ══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS — one per category
// ─────────────────────────────────────────────────────────────────────────────
const ICONS = {
  lifepath: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1L2 5.5V13h3.5V9.5h3V13H12V5.5L7 1Z" stroke="#FF6B35" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,
  romance: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 12C7 12 1.5 8 1.5 5A3.5 3.5 0 0 1 7 3.2 3.5 3.5 0 0 1 12.5 5C12.5 8 7 12 7 12Z" stroke="#FF6B9D" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,
  death: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5C4.515 1.5 2.5 3.515 2.5 6c0 1.7.9 3.19 2.25 4.02L4.5 12.5h5l-.25-2.48A4.5 4.5 0 0 0 11.5 6C11.5 3.515 9.485 1.5 7 1.5Z" stroke="#FF2D55" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M5.5 12.5h3" stroke="#FF2D55" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,
  choice: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polygon points="7,1 13,12 1,12" stroke="#00E5FF" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M7 5.5v3M7 10v.5" stroke="#00E5FF" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,
  ep1: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1l1.6 4.2H13l-3.5 2.6 1.3 4.2L7 9.5 3.2 12l1.3-4.2L1 5.2h4.4Z" stroke="#A78BFA" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,
  side: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 3.5h10M2 7h7.5M2 10.5h5" stroke="#2DC78A" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,
};

// ─────────────────────────────────────────────────────────────────────────────
// FACT_DB — maps fact keys → metadata
// ─────────────────────────────────────────────────────────────────────────────
const FACT_DB = [
  // Lifepath
  { key: 'q000_corpo_background', tag: 'lifepath', text: 'Corporate origin — Arasaka insider who lost everything in one night' },
  { key: 'q000_street_kid_background', tag: 'lifepath', text: 'Street Kid origin — raised in Watson\'s gangs, knew the city before the chip' },
  { key: 'q000_nomad_background', tag: 'lifepath', text: 'Nomad origin — drove into Night City from the Badlands alone' },
  // Romances
  { key: 'sq027_panam_lover', tag: 'romance', text: 'Romanced Panam Palmer — chose family and the open road with the Aldecaldos' },
  { key: 'q115_panam_romance_chosen', tag: 'romance', text: 'Panam romance confirmed in the Nomad ending — she waited' },
  { key: 'sq031_rogue_lover', tag: 'romance', text: 'Romanced Rogue Amendiares — a legendary night with Night City\'s greatest fixer' },
  { key: 'sq026_judy_lover', tag: 'romance', text: 'Romanced Judy Álvarez — dove into the deep lake and didn\'t want to come back up' },
  { key: 'sq029_river_lover', tag: 'romance', text: 'Romanced River Ward — the detective and the merc, honest in a dishonest city' },
  { key: 'sq028_kerry_lover', tag: 'romance', text: 'Romanced Kerry Eurodyne — something unexpected in the chaos' },
  { key: 'sq030_friendship', tag: 'romance', text: 'Built genuine friendship with River Ward — took the kids to the stars together' },
  { key: 'sq028_kerry_friend', tag: 'romance', text: 'Close friends with Kerry Eurodyne — helped the rockstar find himself again' },
  { key: 'sq026_done', tag: 'romance', text: 'Completed Judy Álvarez storyline — stood with her against Clouds and Maiko' },
  // Deaths
  { key: 'q112_takemura_dead', tag: 'death', text: 'Goro Takemura did not survive — left behind during the Arasaka raid on Mikoshi' },
  { key: 'q116_saul_dead', tag: 'death', text: 'Saul Bright died — the Aldecaldo leader didn\'t make it through the assault on Arasaka' },
  { key: 'sq031_grayson_killed', tag: 'death', text: 'Executed Grayson — the Maelstrom pirate captain received no mercy' },
  { key: 'q304_kurt_dead', tag: 'death', text: 'Kurt Hansen eliminated — Dogtown\'s warlord fell during Phantom Liberty' },
  { key: 'q305_fact_songbird_dead', tag: 'death', text: 'Songbird is dead — handed her to Reed rather than helping her escape to freedom' },
  // Choices
  { key: 'mq303_v_has_doubts', min: 2, tag: 'choice', text: 'V harbored deep doubts throughout the Johnny Silverhand arc — humanity clinging on' },
  { key: 'mq303_finale_shock', tag: 'choice', text: 'Chose the shock option in Tapeworm — decisive and unflinching at the crossroads' },
  { key: 'mq303_gangers_left_actors', tag: 'choice', text: 'Let the gangers leave during the Samurai concert — chose restraint over violence' },
  { key: 'mq301_03_contacts', tag: 'choice', text: 'Used all three contacts to find Hanako — exhaustive endgame preparation' },
  { key: 'sq032_03_mikoshi_known', tag: 'choice', text: 'Entered Mikoshi — went to the digital afterlife and faced what was waiting' },
  { key: 'q003_anthony_won', tag: 'choice', text: 'Spared Anthony Gilchrist — a moment of mercy in the Corporate prologue' },
  { key: 'mq301_finished', tag: 'choice', text: 'The shared-body journey with Johnny fully resolved' },
  { key: 'mq303_jhn_on_actors', tag: 'choice', text: 'Johnny opened up about the Samurai actors — a rare honest moment between them' },
  // Side
  { key: 'sq021_randy_saved', tag: 'side', text: 'Saved Randy — protected the young Aldecaldo during River Ward\'s questline' },
  { key: 'sq023_joshua_inside', tag: 'side', text: 'Joshua Stephenson went through with it — strangest braindance in Night City' },
  { key: 'sq018_done', tag: 'side', text: 'Completed Heroes — said goodbye to Jackie Welles the right way' },
  { key: 'sq018_03a_misty_invited', tag: 'side', text: 'Invited Misty to Jackie\'s ofrenda — she got the closure she needed' },
  { key: 'sq031_rogue_met_johnny', tag: 'side', text: 'Rogue met Johnny again — a charged reunion decades in the making' },
  { key: 'sq025_done', tag: 'side', text: 'Resolved the Delamain crisis — those fractured AI fragments found their answer' },
  { key: 'sq027_done', tag: 'side', text: 'Completed Panam Palmer\'s arc — Riders on the Storm through Queen of the Highway' },
  { key: 'sq024_done', tag: 'side', text: 'Completed The Beast in Me — raced with Claire Russell through loss and revenge' },
  { key: 'sq011_done', tag: 'side', text: 'Completed the full Kerry Eurodyne arc — Holdin\' On through A Like Supreme' },
  { key: 'q103_helped_panam', tag: 'side', text: 'Helped Panam reclaim the Raffen Shiv truck — one of the first bonds forged' },
  { key: 'q108_done', tag: 'side', text: 'Completed Never Fade Away — played through Johnny\'s last night in 2023' },
  { key: 'sq004_mitch_available', tag: 'side', text: 'Mitch survived and remains with the Aldecaldos — loyal to the end' },
  // Phantom Liberty
  { key: 'ep1_active', tag: 'ep1', text: 'Phantom Liberty expansion active — entered Dogtown and Cold War spycraft' },
  { key: 'q301_done', tag: 'ep1', text: 'Survived the Stadium — made first contact with Reed and Songbird' },
  { key: 'q304_done', tag: 'ep1', text: 'Completed Firestarter — the Phantom Liberty climax, loyalties decided' },
  { key: 'q304_songbirds_path', tag: 'ep1', text: 'Chose Songbird\'s path in Firestarter — sided with her over Reed' },
  { key: 'q306_done', tag: 'ep1', text: 'Completed Phantom Liberty via the Songbird path — a deal was struck in Dogtown' },
  { key: 'q305_finished', tag: 'ep1', text: 'Completed the Reed Epilogue — Phantom Liberty\'s story reached its end' },
  { key: 'q306_finale_deal_done', tag: 'ep1', text: 'The final deal in Phantom Liberty was struck — Songbird\'s fate sealed' },
];

/**
 * DBH FLOWCHART DEFINITION
 * Acts as the "skeleton" for our horizontal narrative matrix.
 */
const FLOW_DEF = [
  // ── PROLOGUE ────────────────────────────────────────────────────────────────
  {
    id: 'prologue', type: 'branch', label: 'PROLOGUE: LIFEPATH',
    paths: [
      { label: 'CORPO', nodes: [{ id: 'lp_corpo', label: 'Corpo Rat', fact: 'q000_corpo_background', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400' }] },
      { label: 'STREET KID', nodes: [{ id: 'lp_street', label: 'The Rescue', fact: 'q000_street_kid_background', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400' }] },
      { label: 'NOMAD', nodes: [{ id: 'lp_nomad', label: 'Where is My Mind?', fact: 'q000_nomad_background', img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400' }] },
    ]
  },

  // ── ACT 1 ───────────────────────────────────────────────────────────────────
  { id: 'act1_heist', type: 'main', label: 'The Heist', quest: 'q005', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=400' },
  { id: 'act1_konpeki', type: 'main', label: 'Konpeki Plaza', quest: 'q005', img: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400' },
  { id: 'act1_chip', type: 'main', label: 'The Chip In', fact: 'mq001_johhny_met', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400' },
  { id: 'act1_rescue', type: 'main', label: 'The Rescue', quest: 'q001', img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400' },

  // ── ACT 2: FINDING A CURE ────────────────────────────────────────────────── 
  {
    id: 'act2_search', type: 'branch', label: 'ACT II — FINDING A CURE',
    paths: [
      {
        label: 'THE VOODOO BOYS',
        nodes: [
          { id: 'vb_tapeworm', label: 'Tapeworm', quest: 'mq303', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400' },
          { id: 'vb_transmission', label: 'Transmission', quest: 'q110', img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400' },
          { id: 'vb_cyberspace', label: 'Cyberspace', fact: 'q110_03_cyberspace' },
          { id: 'vb_last_caress', label: 'Last Caress', quest: 'q111' },
        ]
      },
      {
        label: 'THE NOMADS',
        nodes: [
          { id: 'nm_panam', label: 'Ghost Town', quest: 'q103', img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400' },
          { id: 'nm_hellman', label: 'Lightning Breaks', quest: 'q104', img: 'https://images.unsplash.com/photo-1527333656061-ca7adf608ae1?w=400' },
          { id: 'nm_riders', label: 'Riders on the Storm', quest: 'sq027_01' },
          { id: 'nm_queen', label: 'Queen of the Highway', quest: 'sq027' },
        ]
      },
      {
        label: 'THE PARADE',
        nodes: [
          { id: 'par_tapeworm2', label: 'Search & Destroy', quest: 'q112', img: 'https://images.unsplash.com/photo-1533972751724-9b3b9df1ac65?w=400' },
          { id: 'par_hanako', label: 'Gimme Danger', fact: 'q112_04_hideout' },
          { id: 'par_hunt', label: 'Play It Safe', quest: 'q113' },
          { id: 'par_destroy', label: 'Search and Destroy', quest: 'q114' },
        ]
      },
    ]
  },

  // ── JOHNNY SIDEQUEST BRIDGE ─────────────────────────────────────────────────
  {
    id: 'johnny_arc', type: 'branch', label: 'JOHNNY SILVERHAND ARC',
    paths: [
      {
        label: 'CHIPPIN\' IN',
        nodes: [
          { id: 'jhn_nfa', label: 'Never Fade Away', quest: 'q108', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400' },
          { id: 'jhn_chippin', label: "Chippin' In", quest: 'sq031' },
          { id: 'jhn_rogue', label: 'Rogue Reunion', fact: 'sq031_rogue_met_johnny' },
        ]
      },
      {
        label: 'BLISTERING LOVE',
        nodes: [
          { id: 'jhn_blist', label: 'Blistering Love', quest: 'sq032' },
          { id: 'jhn_mikoshi', label: 'Mikoshi', fact: 'sq032_03_mikoshi_known' },
        ]
      },
    ]
  },

  // ── ACT 3 GATE ──────────────────────────────────────────────────────────────
  { id: 'nocturne', type: 'main', label: 'Nocturne Op55N1', quest: 'mq301', img: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400' },
  { id: 'act3_point', type: 'main', label: 'Point of No Return', quest: 'mq302', img: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400' },

  // ── PHANTOM LIBERTY (DLC) — filtered out if not played ──────────────────────
  { id: 'dogtown', type: 'main', label: 'Dogtown Entry', fact: 'ep1_active', img: 'https://images.unsplash.com/photo-1542382257-80dee826212e?w=400' },
  { id: 'pl_stadium', type: 'main', label: 'The Shard', quest: 'q301', img: 'https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?w=400' },
  {
    id: 'pl_climax', type: 'branch', label: 'PHANTOM LIBERTY — FIRESTARTER',
    paths: [
      {
        label: 'SONGBIRD PATH',
        nodes: [
          { id: 'pl_song', label: 'Sided with So Mi', fact: 'q304_songbirds_path', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400' },
          { id: 'pl_song_end', label: 'Run This Town', quest: 'q306' },
          { id: 'pl_tower', label: 'The Tower', quest: 'q307' },
        ]
      },
      {
        label: 'REED PATH',
        nodes: [
          { id: 'pl_reed', label: 'Sided with Reed', quest: 'q305', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400' },
          { id: 'pl_reed_epi', label: 'Reed Epilogue', fact: 'q305_finished' },
        ]
      },
    ]
  },

  // ── FINALE ──────────────────────────────────────────────────────────────────
  {
    id: 'endings', type: 'endings', label: 'FINALE — THE ENDINGS',
    paths: [
      { label: 'THE DEVIL', color: '#FF2D55', nodes: [{ id: 'end_devil', label: 'Belly of the Beast\n→ Where is My Mind?', quest: 'q201' }] },
      { label: 'THE STAR', color: '#2DC78A', nodes: [{ id: 'end_star', label: 'We Gotta Live Together\n→ Watchtower', quest: ['q202', 'q202_nomads'], fact: 'q116_saul_dead' }] },
      { label: 'THE SUN', color: '#F5E642', nodes: [{ id: 'end_sun', label: 'For Whom the Bell Tolls\n→ Path of Glory', quest: 'q203' }] },
      { label: 'TEMPERANCE', color: '#FF6B9D', nodes: [{ id: 'end_temper', label: 'Secure Your Soul\n→ New Dawn Fades', quest: 'q204' }] },
      { label: 'THE TOWER (DLC)', color: '#A78BFA', nodes: [{ id: 'end_tower', label: 'Run This Town\n→ Things Done Changed', quest: ['q307', 'q307_tomorrow'] }] },
      { label: 'KING OF SWORDS (DLC)', color: '#FF6B35', nodes: [{ id: 'end_swords', label: 'Reed Epilogue\n→ Leave in Silence', fact: ['q305_finished', 'q305_fact_songbird_dead'] }] },
      { label: 'KING OF WANDS (DLC)', color: '#A78BFA', nodes: [{ id: 'end_wands', label: 'Songbird Path\n→ Mission Complete', fact: 'q306_done' }] },
    ]
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ENDING DETECTION
// ─────────────────────────────────────────────────────────────────────────────
function detectEnding(facts, finSet) {
  const detected = [];

  // DLC Endings (Phantom Liberty)
  if (finSet.has('q307_tomorrow') || finSet.has('q307'))
    detected.push({ label: 'THE TOWER — SONGBIRD FREE', color: '#A78BFA' });
  else if (facts['q305_finished'] || facts['q305_fact_songbird_dead'])
    detected.push({ label: 'REED ENDING — SONGBIRD DEAD', color: '#FF6B35' });
  else if (facts['q306_done'])
    detected.push({ label: 'SONGBIRD PATH — MISSION COMPLETE', color: '#A78BFA' });

  // Main Game Endings
  if (finSet.has('q201_heir') || finSet.has('q201'))
    detected.push({ label: 'THE DEVIL — ARASAKA CONTRACT', color: '#FF2D55' });
  if (finSet.has('q203_legend') || finSet.has('q203'))
    detected.push({ label: 'THE SUN — LEGEND OF NIGHT CITY', color: '#F5E642' });
  if (finSet.has('q202_nomads') || finSet.has('q202') || facts['q116_saul_dead'])
    detected.push({ label: 'THE STAR — WITH THE NOMADS', color: '#2DC78A' });
  if (finSet.has('q204_reborn') || finSet.has('q204'))
    detected.push({ label: 'TEMPERANCE — JOHNNY LIVES', color: '#FF6B9D' });

  return detected;
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTRAIT LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const PORTRAIT_SRC = {
  male: 'img/965790.jpg',
  female: 'img/Cyberpunk-2077-GIrl-4K-Wallpaper.jpg',
};
function setPortrait(bodyGender) {
  const img = document.getElementById('portrait-img');
  const ph = document.getElementById('portrait-placeholder');
  const g = (bodyGender || '').toLowerCase();
  const src = (g === 'female' || g === 'woman') ? PORTRAIT_SRC.female : PORTRAIT_SRC.male;
  img.onload = () => { ph.style.display = 'none'; img.style.display = 'block' };
  img.onerror = () => { ph.style.display = 'flex'; img.style.display = 'none' };
  img.src = src;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────
const dropZone = document.getElementById('upload-zone');
const uploadLabel = dropZone.querySelector('.upload-label');
const fileInput = document.getElementById('file-input');
const dashboard = document.getElementById('dashboard');
const endingBadge = document.getElementById('ending-badge');
const factList = document.getElementById('ui-story-facts');
const factCount = document.getElementById('fact-count');

// ─────────────────────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────────────────────
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over') });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]) });

document.getElementById('filters').addEventListener('click', e => {
  const pill = e.target.closest('.filter-pill');
  if (!pill) return;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  const tag = pill.dataset.tag;
  const items = document.querySelectorAll('.fact-item');
  items.forEach(li => li.classList.toggle('hidden', tag !== 'all' && li.dataset.tag !== tag));
  const visible = tag === 'all' ? items.length : [...items].filter(li => li.dataset.tag === tag).length;
  factCount.textContent = `${visible} ENTRIES`;
});

// View Toggle Tab Listeners
document.querySelectorAll('.view-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const view = tab.dataset.view;
    document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.getElementById('view-flowchart').style.display = view === 'flowchart' ? 'block' : 'none';
    document.getElementById('view-list').style.display = view === 'list' ? 'block' : 'none';
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FILE HANDLING
// ─────────────────────────────────────────────────────────────────────────────
function handleFile(file) {
  if (!file.name.endsWith('.json')) { alert('Upload a .json metadata file.'); return }
  const r = new FileReader();
  r.onload = e => { try { processSaveData(JSON.parse(e.target.result)) } catch (err) { alert('Cannot parse file.'); console.error(err) } };
  r.readAsText(file);
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE PROCESSOR
// ─────────────────────────────────────────────────────────────────────────────
function processSaveData(raw) {
  dashboard.style.display = 'block';
  dashboard.classList.add('fade-in');

  // Minimize upload zone
  dropZone.classList.add('mini');
  uploadLabel.textContent = '▲ LOAD DIFFERENT SAVE FILE ▲';
  const m = raw?.Data?.metadata || raw;

  // ── Basic stats ────────────────────────────────────────────────────────────
  const lp = m.lifePath || '—';
  const lpEl = document.getElementById('ui-lifepath');
  lpEl.textContent = lp;
  lpEl.className = 'stat-val';
  if (lp.includes('Corpo')) lpEl.classList.add('lp-corpo');
  if (lp.includes('Nomad')) lpEl.classList.add('lp-nomad');
  if (lp.includes('Street')) lpEl.classList.add('lp-street');

  if (typeof m.playTime === 'number') {
    const h = Math.floor(m.playTime / 3600);
    const min = Math.floor((m.playTime % 3600) / 60);
    document.getElementById('ui-playtime').textContent = `${h}h ${min}m`;
  } else {
    document.getElementById('ui-playtime').textContent = m.playtime || '—';
  }
  document.getElementById('ui-level').textContent = Math.floor(m.level || 0);
  document.getElementById('ui-streetcred').textContent = Math.floor(m.streetCred || 0);
  document.getElementById('ui-difficulty').textContent = m.difficulty || '—';
  document.getElementById('ui-patch').textContent = m.buildPatch || '—';

  // ── Portrait ───────────────────────────────────────────────────────────────
  setPortrait(m.bodyGender || m.playerGender || '');

  // ── Parse facts ───────────────────────────────────────────────────────────
  const facts = {};
  (m.facts || []).forEach(f => {
    const eq = f.lastIndexOf('=');
    if (eq < 0) return;
    facts[f.slice(0, eq)] = parseInt(f.slice(eq + 1));
  });

  // ── Parse finishedQuests ──────────────────────────────────────────────────
  const finRaw = (m.finishedQuests || '').trim().split(/\s+/).filter(Boolean);
  const finSet = new Set(finRaw);
  const cnt = { main: 0, side: 0, gig: 0, ncpd: 0 };
  finRaw.forEach(id => {
    if (/^(mq|q)\d/.test(id) || id.startsWith('09_')) cnt.main++;
    else if (/^sq/.test(id)) cnt.side++;
    else if (/^ma_/.test(id)) cnt.gig++;
    else if (/^sts_/.test(id)) cnt.ncpd++;
  });
  const updateCard = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  };

  updateCard('qn-main', cnt.main);
  updateCard('qn-side', cnt.side);
  updateCard('qn-gig', cnt.gig);
  updateCard('qn-ncpd', cnt.ncpd);

  const endings = detectEnding(facts, finSet);
  endingBadge.innerHTML = '';
  if (endings.length > 0) {
    endings.forEach(e => {
      const div = document.createElement('div');
      div.className = 'ending-entry';
      div.style.borderColor = e.color;
      div.style.boxShadow = `0 0 14px ${e.color}15`;
      div.innerHTML = `
                <span class="ql">NARRATIVE FINALE</span>
                <span class="ending-name" style="color:${e.color}">${e.label}</span>
            `;
      endingBadge.appendChild(div);
    });
    endingBadge.style.display = 'flex';
  } else {
    endingBadge.style.display = 'none';
  }

  // ── Narrative facts ───────────────────────────────────────────────────────
  factList.innerHTML = '';
  const matched = FACT_DB.filter(f => {
    if (!(f.key in facts)) return false;
    return f.min !== undefined ? facts[f.key] >= f.min : facts[f.key] > 0;
  });

  if (!matched.length) {
    factList.innerHTML = '<li class="empty-state">NO NARRATIVE FLAGS DETECTED IN THIS SAVE</li>';
    factCount.style.display = 'none';
  } else {
    matched.forEach(f => {
      const li = document.createElement('li');
      li.className = 'fact-item';
      li.dataset.tag = f.tag;
      li.innerHTML = `
            <div class="fact-icon-box">${ICONS[f.tag] || ICONS.choice}</div>
            <div>
                <div class="fact-label">${f.text}</div>
                <span class="fact-cat">${f.tag}</span>
            </div>`;
      factList.appendChild(li);
    });
    factCount.textContent = `${matched.length} ENTRIES`;
    factCount.style.display = 'inline';
  }

  // ── Build Flowchart Matrix ────────────────────────────────────────────────
  buildFlowchartMatrix(facts, finSet);

  // ── Update Lore ───────────────────────────────────────────────────────────
  if (typeof matchLore === 'function') matchLore(facts, finSet);
}

// ─────────────────────────────────────────────────────────────────────────────
// LORE MATCHING — uses LORE_MAP for precise fact→page linking
// ─────────────────────────────────────────────────────────────────────────────
function matchLore(facts, finishedSet) {
  const uiLoreContext = document.getElementById('ui-lore-context');
  if (!uiLoreContext) return;
  uiLoreContext.innerHTML = '';

  if (typeof LORE_CORPUS === 'undefined') {
    uiLoreContext.innerHTML = '<p class="error-msg">⚠ Lore database offline — run scrape_wiki.py first.</p>';
    return;
  }

  const triggeredTitles = new Set();

  Object.entries(LORE_MAP).forEach(([factKey, wikiTitle]) => {
    if (facts[factKey] && facts[factKey] > 0) {
      triggeredTitles.add(wikiTitle);
    }
  });

  const FINISHED_LORE = {
    'q005_heist': 'The Heist',
    'q110_03_cyberspace': 'Transmission',
    'q112_04_hideout': 'Search and Destroy',
    'sq031': "Chippin' In",
    'sq026': 'Judy Álvarez',
    'sq027': 'Panam Palmer',
    'sq028': 'Kerry Eurodyne',
    'q202_nomads': 'All Along the Watchtower',
    'q203_legend': 'Path of Glory',
    'q201_heir': "Where is My Mind?",
    'q204_reborn': 'New Dawn Fades',
    'q307_tomorrow': 'Things Done Changed',
    'q305_reed_epilogue': 'Leave in Silence',
  };
  Object.entries(FINISHED_LORE).forEach(([questId, wikiTitle]) => {
    if (finishedSet.has(questId)) triggeredTitles.add(wikiTitle);
  });

  if (triggeredTitles.size === 0) {
    uiLoreContext.innerHTML = '<div class="empty-state">No database matches for the narrative flags in this save.</div>';
    return;
  }

  triggeredTitles.forEach(title => {
    const page = LORE_CORPUS.find(p =>
      p.title === title ||
      p.title.toLowerCase() === title.toLowerCase() ||
      p.title.replace(/_/g, ' ') === title
    );
    if (!page) return;

    const div = document.createElement('div');
    div.className = 'lore-entry';

    let snippet = page.text;
    if (snippet.toLowerCase().startsWith(title.toLowerCase())) {
      snippet = snippet.slice(title.length).replace(/^[\s.–—:]+/, '');
    }
    snippet = snippet.slice(0, 320).trim() + '…';

    div.innerHTML = `
      <div class="lore-title">
        <span class="lore-tag">DATABASE MATCH</span>
        ${page.title.replace(/_/g, ' ')}
      </div>
      <p class="lore-text">${snippet}</p>
    `;
    uiLoreContext.appendChild(div);
  });
}

/**
 * BUILD FLOWCHART MATRIX
 * Recursive-style builder for the DBH horizontal canvas.
 */
function buildFlowchartMatrix(facts, finSet) {
  const canvas = document.getElementById('dbh-canvas');
  if (!canvas) return;
  canvas.innerHTML = '';

  // Hide all Phantom Liberty items if the DLC wasn't played
  const hasPL = (facts['ep1_active'] > 0) || finSet.has('q301') || finSet.has('ep1_active');
  const PL_IDS = new Set(['dogtown', 'pl_stadium', 'pl_climax']);

  const activeDef = FLOW_DEF.filter(item => {
    // Top-level DLC items
    if (!hasPL && (PL_IDS.has(item.id) || item.label.includes('PHANTOM LIBERTY'))) return false;
    return true;
  }).map(item => {
    // Filter out Tower and other PL endings from endings list if no PL
    if (!hasPL && item.type === 'endings') {
      const DLC_ENDINGS = new Set(['end_tower', 'end_swords', 'end_wands']);
      return { ...item, paths: item.paths.filter(p => !p.nodes.some(n => DLC_ENDINGS.has(n.id))) };
    }
    return item;
  });

  let completedNodes = 0;
  let totalNodes = 0;

  const createNodeEl = (node, isDim = true) => {
    totalNodes++;
    if (!isDim) completedNodes++;

    const col = document.createElement('div');
    col.className = 'dbh-node-col';

    // Thumbnail (if exists) or Spacer (for alignment)
    if (node.img) {
      const thumb = document.createElement('div');
      thumb.className = `dbh-thumb ${isDim ? 'dim' : ''}`;
      const img = document.createElement('img');
      img.src = node.img;
      thumb.appendChild(img);
      col.appendChild(thumb);
    } else {
      const spacer = document.createElement('div');
      spacer.className = 'dbh-thumb-spacer';
      col.appendChild(spacer);
    }

    // Box
    const box = document.createElement('div');
    box.className = `dbh-box ${isDim ? 'dim' : ''}`;

    const icon = isDim ?
      `<svg class="dbh-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" fill="none" stroke-width="1"/></svg>` :
      `<svg class="dbh-icon" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    box.innerHTML = `${icon} <span>${node.label}</span>`;
    col.appendChild(box);

    return col;
  };

  const createLine = (isActive = false) => {
    const line = document.createElement('div');
    line.className = `dbh-line ${isActive ? '' : 'dim'}`;
    return line;
  };

  activeDef.forEach((item, idx) => {
    // Connecting line between top-level items — attaches before each item
    if (idx > 0) {
      const prevActive = isItemActive(activeDef[idx - 1], facts, finSet);
      const currActive = isItemActive(item, facts, finSet);
      canvas.appendChild(createLine(prevActive || currActive));
    }

    if (item.type === 'main') {
      const active = isNodeActive(item, facts, finSet);
      canvas.appendChild(createNodeEl(item, !active));
    }
    else if (item.type === 'branch') {
      // Outer wrapper positioned relatively so label can float above
      const branchGroup = document.createElement('div');
      branchGroup.className = 'dbh-branch-group';

      // Label floats above — absolutely positioned so it doesn't affect flex alignment
      const groupLabel = document.createElement('div');
      groupLabel.className = 'dbh-branch-group-label';
      groupLabel.textContent = item.label;
      branchGroup.appendChild(groupLabel);

      // branchesEl is what actually sits in the flex row
      const branchesEl = document.createElement('div');
      branchesEl.className = 'dbh-branches';

      item.paths.forEach((path, pIdx) => {
        const branch = document.createElement('div');
        branch.className = 'dbh-branch';

        const pathActive = path.nodes.some(n => isNodeActive(n, facts, finSet));

        // Create Spine Segments (Dynamic DBH style)
        const vTop = document.createElement('div');
        vTop.className = `dbh-branch-v-top ${pathActive ? 'active' : ''}`;
        branch.appendChild(vTop);

        const vBot = document.createElement('div');
        vBot.className = `dbh-branch-v-bot ${pathActive ? 'active' : ''}`;
        branch.appendChild(vBot);

        const hLine = document.createElement('div');
        hLine.className = `dbh-branch-h ${pathActive ? 'active' : ''}`;
        branch.appendChild(hLine);

        const pathLabel = document.createElement('div');
        pathLabel.className = `dbh-path-label ${pathActive ? 'active' : ''}`;
        pathLabel.textContent = path.label;
        branch.appendChild(pathLabel);

        path.nodes.forEach((n, nidx) => {
          const nActive = isNodeActive(n, facts, finSet);
          if (nidx > 0) {
            const prevNActive = isNodeActive(path.nodes[nidx - 1], facts, finSet);
            branch.appendChild(createLine(nActive || prevNActive));
          }
          branch.appendChild(createNodeEl(n, !nActive));
        });

        branchesEl.appendChild(branch);
      });

      branchGroup.appendChild(branchesEl);
      canvas.appendChild(branchGroup);
    }
    else if (item.type === 'endings') {
      const endGroup = document.createElement('div');
      endGroup.className = 'dbh-branch-group';

      const groupLabel = document.createElement('div');
      groupLabel.className = 'dbh-branch-group-label';
      groupLabel.textContent = item.label;
      endGroup.appendChild(groupLabel);

      // Wrap endings in a dbh-branches container so it gets the border-left spine
      const endBranches = document.createElement('div');
      endBranches.className = 'dbh-branches';

      item.paths.forEach((path, pIdx) => {
        const node = path.nodes[0];
        const active = isNodeActive(node, facts, finSet);
        totalNodes++;
        if (active) completedNodes++;

        // Each ending is a branch row with segments + card
        const branch = document.createElement('div');
        branch.className = 'dbh-branch';

        const vTop = document.createElement('div');
        vTop.className = `dbh-branch-v-top ${active ? 'active' : ''}`;
        branch.appendChild(vTop);

        const vBot = document.createElement('div');
        vBot.className = `dbh-branch-v-bot ${active ? 'active' : ''}`;
        branch.appendChild(vBot);

        const hLine = document.createElement('div');
        hLine.className = `dbh-branch-h ${active ? 'active' : ''}`;
        branch.appendChild(hLine);

        const card = document.createElement('div');
        card.className = `dbh-ending-card ${active ? 'active' : 'dim'}`;
        card.style.setProperty('--end-color', path.color);

        const icon = active
          ? `<svg class="dbh-icon" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
          : `<svg class="dbh-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" fill="none" stroke-width="1"/></svg>`;

        const [mainLabel, subLabel] = node.label.split('\n');
        card.innerHTML = `
                    <div class="dbh-ending-card-tag">${path.label}</div>
                    <div class="dbh-ending-card-body">${icon}<span>${mainLabel}${subLabel ? `<br><span class="dbh-ending-sub">${subLabel}</span>` : ''}</span></div>
                `;
        branch.appendChild(card);
        endBranches.appendChild(branch);
      });

      endGroup.appendChild(endBranches);
      canvas.appendChild(endGroup);
    }
  });

  const totalCount = FLOW_DEF.reduce((acc, item) => {
    if (item.type === 'main') return acc + 1;
    if (item.type === 'branch' || item.type === 'endings')
      return acc + item.paths.reduce((pacc, p) => pacc + p.nodes.length, 0);
    return acc;
  }, 0);

  const completion = Math.round((completedNodes / Math.max(totalCount, 1)) * 100);
  const compEl = document.getElementById('dbh-completion');
  if (compEl) compEl.textContent = `${completion}% NARRATIVE COMPLETE`;

  const pathEl = document.getElementById('dbh-path-count');
  if (pathEl) pathEl.textContent = completedNodes;

  const endEl = document.getElementById('dbh-ending-count');
  if (endEl) {
    const endingQuests = ['q201', 'q202', 'q203', 'q204', 'q307'];
    const endingsDone = endingQuests.filter(q => {
      const sfx = ['', '_heir', '_nomads', '_legend', '_reborn', '_tomorrow'];
      return sfx.some(s => finSet.has(q + s));
    }).length;
    endEl.textContent = endingsDone;
  }
}

function isItemActive(item, facts, finSet) {
  if (item.type === 'main') return isNodeActive(item, facts, finSet);
  if (item.type === 'branch' || item.type === 'endings')
    return item.paths.some(p => p.nodes.some(n => isNodeActive(n, facts, finSet)));
  return false;
}

function isNodeActive(node, facts, finSet) {
  // Support single or multiple fact triggers
  if (node.fact) {
    const factsToCheck = Array.isArray(node.fact) ? node.fact : [node.fact];
    if (factsToCheck.some(f => facts[f] > 0)) return true;
  }

  // Support single or multiple quest triggers (with suffixes)
  if (node.quest) {
    const questsToCheck = Array.isArray(node.quest) ? node.quest : [node.quest];
    const suffixes = ['', '_done', '_heir', '_nomads', '_legend', '_reborn', '_tomorrow'];
    if (questsToCheck.some(q => suffixes.some(s => finSet.has(q + s)))) return true;
  }

  if (node.id === 'konpeki' && (finSet.has('q005') || finSet.has('q006'))) return true;

  // fallback: treat node.id as a fact key
  if (node.id && facts[node.id] > 0) return true;
  return false;
}