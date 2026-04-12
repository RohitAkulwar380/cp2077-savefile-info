// ══════════════════════════════════════════════════════════════════════════════
// NIGHT CITY CHRONICLE — parser.js v2.1 (Design Migrated)
// ══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS — one per category
// ─────────────────────────────────────────────────────────────────────────────
const ICONS = {
  lifepath:`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1L2 5.5V13h3.5V9.5h3V13H12V5.5L7 1Z" stroke="#FF6B35" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,
  romance:`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 12C7 12 1.5 8 1.5 5A3.5 3.5 0 0 1 7 3.2 3.5 3.5 0 0 1 12.5 5C12.5 8 7 12 7 12Z" stroke="#FF6B9D" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,
  death:`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5C4.515 1.5 2.5 3.515 2.5 6c0 1.7.9 3.19 2.25 4.02L4.5 12.5h5l-.25-2.48A4.5 4.5 0 0 0 11.5 6C11.5 3.515 9.485 1.5 7 1.5Z" stroke="#FF2D55" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M5.5 12.5h3" stroke="#FF2D55" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,
  choice:`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polygon points="7,1 13,12 1,12" stroke="#00E5FF" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M7 5.5v3M7 10v.5" stroke="#00E5FF" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,
  ep1:`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1l1.6 4.2H13l-3.5 2.6 1.3 4.2L7 9.5 3.2 12l1.3-4.2L1 5.2h4.4Z" stroke="#A78BFA" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,
  side:`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 3.5h10M2 7h7.5M2 10.5h5" stroke="#2DC78A" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,
};

// ─────────────────────────────────────────────────────────────────────────────
// FACT_DB — maps fact keys → metadata
// ─────────────────────────────────────────────────────────────────────────────
const FACT_DB = [
  // Lifepath
  { key:'q000_corpo_background',      tag:'lifepath', text:'Corporate origin — Arasaka insider who lost everything in one night' },
  { key:'q000_street_kid_background', tag:'lifepath', text:'Street Kid origin — raised in Watson\'s gangs, knew the city before the chip' },
  { key:'q000_nomad_background',      tag:'lifepath', text:'Nomad origin — drove into Night City from the Badlands alone' },
  // Romances
  { key:'sq027_panam_lover',          tag:'romance',  text:'Romanced Panam Palmer — chose family and the open road with the Aldecaldos' },
  { key:'q115_panam_romance_chosen',  tag:'romance',  text:'Panam romance confirmed in the Nomad ending — she waited' },
  { key:'sq031_rogue_lover',          tag:'romance',  text:'Romanced Rogue Amendiares — a legendary night with Night City\'s greatest fixer' },
  { key:'sq026_judy_lover',           tag:'romance',  text:'Romanced Judy Álvarez — dove into the deep lake and didn\'t want to come back up' },
  { key:'sq029_river_lover',          tag:'romance',  text:'Romanced River Ward — the detective and the merc, honest in a dishonest city' },
  { key:'sq028_kerry_lover',          tag:'romance',  text:'Romanced Kerry Eurodyne — something unexpected in the chaos' },
  { key:'sq030_friendship',           tag:'romance',  text:'Built genuine friendship with River Ward — took the kids to the stars together' },
  { key:'sq028_kerry_friend',         tag:'romance',  text:'Close friends with Kerry Eurodyne — helped the rockstar find himself again' },
  { key:'sq026_done',                 tag:'romance',  text:'Completed Judy Álvarez storyline — stood with her against Clouds and Maiko' },
  // Deaths
  { key:'q112_takemura_dead',         tag:'death',    text:'Goro Takemura did not survive — left behind during the Arasaka raid on Mikoshi' },
  { key:'q116_saul_dead',             tag:'death',    text:'Saul Bright died — the Aldecaldo leader didn\'t make it through the assault on Arasaka' },
  { key:'sq031_grayson_killed',       tag:'death',    text:'Executed Grayson — the Maelstrom pirate captain received no mercy' },
  { key:'q304_kurt_dead',             tag:'death',    text:'Kurt Hansen eliminated — Dogtown\'s warlord fell during Phantom Liberty' },
  { key:'q305_fact_songbird_dead',    tag:'death',    text:'Songbird is dead — handed her to Reed rather than helping her escape to freedom' },
  // Choices
  { key:'mq303_v_has_doubts',        min:2, tag:'choice', text:'V harbored deep doubts throughout the Johnny Silverhand arc — humanity clinging on' },
  { key:'mq303_finale_shock',         tag:'choice',   text:'Chose the shock option in Tapeworm — decisive and unflinching at the crossroads' },
  { key:'mq303_gangers_left_actors',  tag:'choice',   text:'Let the gangers leave during the Samurai concert — chose restraint over violence' },
  { key:'mq301_03_contacts',          tag:'choice',   text:'Used all three contacts to find Hanako — exhaustive endgame preparation' },
  { key:'sq032_03_mikoshi_known',     tag:'choice',   text:'Entered Mikoshi — went to the digital afterlife and faced what was waiting' },
  { key:'q003_anthony_won',           tag:'choice',   text:'Spared Anthony Gilchrist — a moment of mercy in the Corporate prologue' },
  { key:'mq301_finished',             tag:'choice',   text:'The shared-body journey with Johnny fully resolved' },
  { key:'mq303_jhn_on_actors',        tag:'choice',   text:'Johnny opened up about the Samurai actors — a rare honest moment between them' },
  // Side
  { key:'sq021_randy_saved',          tag:'side',     text:'Saved Randy — protected the young Aldecaldo during River Ward\'s questline' },
  { key:'sq023_joshua_inside',        tag:'side',     text:'Joshua Stephenson went through with it — strangest braindance in Night City' },
  { key:'sq018_done',                 tag:'side',     text:'Completed Heroes — said goodbye to Jackie Welles the right way' },
  { key:'sq018_03a_misty_invited',    tag:'side',     text:'Invited Misty to Jackie\'s ofrenda — she got the closure she needed' },
  { key:'sq031_rogue_met_johnny',     tag:'side',     text:'Rogue met Johnny again — a charged reunion decades in the making' },
  { key:'sq025_done',                 tag:'side',     text:'Resolved the Delamain crisis — those fractured AI fragments found their answer' },
  { key:'sq027_done',                 tag:'side',     text:'Completed Panam Palmer\'s arc — Riders on the Storm through Queen of the Highway' },
  { key:'sq024_done',                 tag:'side',     text:'Completed The Beast in Me — raced with Claire Russell through loss and revenge' },
  { key:'sq011_done',                 tag:'side',     text:'Completed the full Kerry Eurodyne arc — Holdin\' On through A Like Supreme' },
  { key:'q103_helped_panam',          tag:'side',     text:'Helped Panam reclaim the Raffen Shiv truck — one of the first bonds forged' },
  { key:'q108_done',                  tag:'side',     text:'Completed Never Fade Away — played through Johnny\'s last night in 2023' },
  { key:'sq004_mitch_available',      tag:'side',     text:'Mitch survived and remains with the Aldecaldos — loyal to the end' },
  // Phantom Liberty
  { key:'ep1_active',                 tag:'ep1',      text:'Phantom Liberty expansion active — entered Dogtown and Cold War spycraft' },
  { key:'q301_done',                  tag:'ep1',      text:'Survived the Stadium — made first contact with Reed and Songbird' },
  { key:'q304_done',                  tag:'ep1',      text:'Completed Firestarter — the Phantom Liberty climax, loyalties decided' },
  { key:'q304_songbirds_path',        tag:'ep1',      text:'Chose Songbird\'s path in Firestarter — sided with her over Reed' },
  { key:'q306_done',                  tag:'ep1',      text:'Completed Phantom Liberty via the Songbird path — a deal was struck in Dogtown' },
  { key:'q305_finished',              tag:'ep1',      text:'Completed the Reed Epilogue — Phantom Liberty\'s story reached its end' },
  { key:'q306_finale_deal_done',      tag:'ep1',      text:'The final deal in Phantom Liberty was struck — Songbird\'s fate sealed' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ENDING DETECTION
// ─────────────────────────────────────────────────────────────────────────────
function detectEnding(facts, finSet) {
  const detected = [];

  // DLC Endings (Phantom Liberty)
  if (finSet.has('q307_tomorrow') || finSet.has('q307'))
      detected.push({ label:'THE TOWER — SONGBIRD FREE', color:'#A78BFA' });
  else if (facts['q305_finished'] || facts['q305_fact_songbird_dead'])
      detected.push({ label:'REED ENDING — SONGBIRD DEAD', color:'#FF6B35' });
  else if (facts['q306_done'])
      detected.push({ label:'SONGBIRD PATH — MISSION COMPLETE', color:'#A78BFA' });

  // Main Game Endings
  if (finSet.has('q201_heir') || finSet.has('q201'))
      detected.push({ label:'THE DEVIL — ARASAKA CONTRACT', color:'#FF2D55' });
  if (finSet.has('q203_legend') || finSet.has('q203'))
      detected.push({ label:'THE SUN — LEGEND OF NIGHT CITY', color:'#F5E642' });
  if (finSet.has('q202_nomads') || finSet.has('q202') || facts['q116_saul_dead'])
      detected.push({ label:'THE STAR — WITH THE NOMADS', color:'#2DC78A' });
  if (finSet.has('q204_reborn') || finSet.has('q204'))
      detected.push({ label:'TEMPERANCE — JOHNNY LIVES', color:'#FF6B9D' });
  
  return detected;
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTRAIT LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const PORTRAIT_SRC = {
  male:   'img/965790.jpg',
  female: 'img/Cyberpunk-2077-GIrl-4K-Wallpaper.jpg',
};
function setPortrait(bodyGender) {
  const img = document.getElementById('portrait-img');
  const ph  = document.getElementById('portrait-placeholder');
  const g   = (bodyGender || '').toLowerCase();
  const src = (g === 'female' || g === 'woman') ? PORTRAIT_SRC.female : PORTRAIT_SRC.male;
  img.onload  = () => { ph.style.display = 'none';  img.style.display = 'block' };
  img.onerror = () => { ph.style.display = 'flex';  img.style.display = 'none'  };
  img.src = src;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────
const dropZone    = document.getElementById('upload-zone');
const uploadLabel = dropZone.querySelector('.upload-label');
const fileInput   = document.getElementById('file-input');
const dashboard   = document.getElementById('dashboard');
const endingBadge = document.getElementById('ending-badge');
const factList    = document.getElementById('ui-story-facts');
const factCount   = document.getElementById('fact-count');

// ─────────────────────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────────────────────
dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('drag-over') });
dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('drag-over'));
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

// ─────────────────────────────────────────────────────────────────────────────
// FILE HANDLING
// ─────────────────────────────────────────────────────────────────────────────
function handleFile(file) {
  if (!file.name.endsWith('.json')) { alert('Upload a .json metadata file.'); return }
  const r = new FileReader();
  r.onload = e => { try { processSaveData(JSON.parse(e.target.result)) } catch(err) { alert('Cannot parse file.'); console.error(err) } };
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
    if (lp.includes('Corpo'))  lpEl.classList.add('lp-corpo');
    if (lp.includes('Nomad'))  lpEl.classList.add('lp-nomad');
    if (lp.includes('Street')) lpEl.classList.add('lp-street');

    if (typeof m.playTime === 'number') {
        const h = Math.floor(m.playTime / 3600);
        const min = Math.floor((m.playTime % 3600) / 60);
        document.getElementById('ui-playtime').textContent = `${h}h ${min}m`;
    } else {
        document.getElementById('ui-playtime').textContent = m.playtime || '—';
    }
    document.getElementById('ui-level').textContent      = Math.floor(m.level || 0);
    document.getElementById('ui-streetcred').textContent = Math.floor(m.streetCred || 0);
    document.getElementById('ui-difficulty').textContent = m.difficulty || '—';
    document.getElementById('ui-patch').textContent      = m.buildPatch || '—';

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
    const finSet  = new Set(finRaw);
    const cnt = { main:0, side:0, gig:0, ncpd:0 };
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
    updateCard('qn-gig',  cnt.gig);
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
}

// ─────────────────────────────────────────────────────────────────────────────
// LORE MATCHING — uses LORE_MAP for precise fact→page linking
// ─────────────────────────────────────────────────────────────────────────────
function matchLore(facts, finishedSet) {
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