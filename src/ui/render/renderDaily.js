// ═══════════════════════════════════════════════════════════
//  DAILY PULL ENGINE
// ═══════════════════════════════════════════════════════════
function renderDaily(D) {
  const now = new Date();
  const jdNow = toJD(now.getFullYear(), now.getMonth()+1, now.getDate(), 12);
  const moonSign = lonToSign(moonLongitude(jdNow));
  const sunSign = lonToSign(sunLongitude(jdNow));
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const dayNum = now.getDate();

  const dateFmt = now.toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  document.getElementById('daily-date').textContent = dateFmt;

  // Energy based on transit moon × natal chart
  const moonEL = {'Aries':'Fire','Taurus':'Earth','Gemini':'Air','Cancer':'Water','Leo':'Fire','Virgo':'Earth','Libra':'Air','Scorpio':'Water','Sagittarius':'Fire','Capricorn':'Earth','Aquarius':'Air','Pisces':'Water'};
  const mEl = moonEL[moonSign.sign] || 'Air';
  const moodMap = {Fire:'Aktif & Berani', Earth:'Stabil & Fokus', Air:'Analitis & Komunikatif', Water:'Intuitif & Sensitif'};
  const prodMap = {Fire:'Tinggi untuk aksi dan inisiasi', Earth:'Tinggi untuk detail dan penyelesaian', Air:'Tinggi untuk komunikasi dan brainstorming', Water:'Tinggi untuk refleksi dan koneksi emosional'};

  document.getElementById('daily-title').textContent = `${moodMap[mEl]} · Moon in ${moonSign.sign}`;
  document.getElementById('daily-sub').textContent = `Energi transit hari ini dipengaruhi Moon ${moonSign.sign} ${moonSign.deg}° — ${mEl} energy dominan`;

  // Pills
  const pillData = [
    {lbl: mEl+' Energy', col: 'var(--gold)'},
    {lbl: moonSign.sign+' Moon', col: 'var(--blue2)'},
    {lbl: D.bazi.favEl+' Boost', col: 'var(--green)'},
  ];
  document.getElementById('daily-pills').innerHTML = pillData.map(p=>
    `<span style="font-family:var(--font-mono);font-size:8px;letter-spacing:.2em;padding:5px 12px;border:1px solid ${p.col}44;color:${p.col};border-radius:2px">${p.lbl}</span>`
  ).join('');

  // Body
  const interaction = mEl === D.bazi.favEl.split(' ').pop() ? 'selaras dengan elemen favoritmu' : 'membutuhkan adaptasi lebih dari energi dasarmu';
  document.getElementById('daily-body').textContent = `Dengan Moon transit di ${moonSign.sign}, energi hari ini ${interaction}. ${prodMap[mEl]}. Bagi ${D.hd.type}, ini adalah hari yang ${dayOfWeek===0||dayOfWeek===6?'baik untuk introspeksi dan reset':dayOfWeek===1?'bagus untuk memulai sesuatu baru':'cocok untuk melanjutkan momentum yang sudah ada'}.`;

  // Moon
  const moonDescMap = {
    Aries:'Impulsif & energik. Bagus untuk memulai, buruk untuk patience.',
    Taurus:'Lambat tapi solid. Bagus untuk hal-hal praktis dan sensory experience.',
    Gemini:'Pikiran berlari. Bagus untuk komunikasi, buruk untuk keputusan final.',
    Cancer:'Emosi tinggi. Koneksi personal terasa dalam. Batasan mungkin lebih mudah dissolved.',
    Leo:'Ekspresif dan teatrikal. Bagus untuk presentasi dan show of confidence.',
    Virgo:'Detail-oriented. Bagus untuk analisis dan problem-solving sistematis.',
    Libra:'Harmoni-seeking. Bagus untuk negosiasi dan relationship repair.',
    Scorpio:'Intens dan investigatif. Hal-hal tersembunyi bisa muncul ke permukaan.',
    Sagittarius:'Optimistis dan expansive. Bagus untuk big picture thinking.',
    Capricorn:'Ambisius dan disciplined. Bagus untuk goal-setting dan struktur.',
    Aquarius:'Detached dan idealistis. Bagus untuk inovasi, buruk untuk emotional intimacy.',
    Pisces:'Dreamy dan permeable. Boundary-mu mungkin lebih tipis dari biasanya.'
  };
  document.getElementById('daily-moon').textContent = `☽ ${moonSign.sign} ${moonSign.deg}°`;
  document.getElementById('daily-moon-desc').textContent = moonDescMap[moonSign.sign]||'—';

  // Shadow trigger
  const shadowTriggers = {
    Aries:'Hari ini kamu mungkin terlalu reaktif. Pause sebelum respond.',
    Taurus:'Resistensi terhadap perubahan bisa muncul. Cek apakah itu wisdom atau ketakutan.',
    Gemini:'Overthinking dan second-guessing bisa tinggi. Trust your first instinct.',
    Cancer:'Kebutuhan akan validation mungkin lebih tinggi. Perhatikan dari mana kamu mencarinya.',
    Leo:'Kebutuhan untuk diakui bisa clash dengan realita. Jaga ekspektasi.',
    Virgo:'Tendency untuk overcriticize — diri sendiri atau orang lain — bisa naik.',
    Libra:'Tendency untuk menghindari keputusan sulit. Pilih satu dan komit.',
    Scorpio:'Old wounds bisa teraktivasi. Perhatikan projection.',
    Sagittarius:'Impulsivitas dan overpromising. Realistis dengan kapasitas.',
    Capricorn:'Workaholic mode sebagai pelarian dari sesuatu yang perlu dirasakan.',
    Aquarius:'Detachment bisa terasa seperti clarity tapi sebenarnya adalah avoidance.',
    Pisces:'Boundary dissolution. Pastikan kamu tidak mengambil beban emosi orang lain.'
  };
  document.getElementById('daily-shadow').textContent = shadowTriggers[moonSign.sign]||'—';

  // Energy windows
  const windows = [
    {time:'06:00 – 09:00', label:'Pagi', energy:'Tinggi', note:'Best untuk planning dan intention setting'},
    {time:'10:00 – 13:00', label:'Siang awal', energy:mEl==='Fire'?'Puncak':'Baik', note:prodMap[mEl]},
    {time:'14:00 – 16:00', label:'Siang akhir', energy:'Medium', note:'Fokus ke komunikasi dan follow-up'},
    {time:'19:00 – 22:00', label:'Malam', energy:mEl==='Water'?'Tinggi':'Medium', note:'Refleksi, journaling, dan koneksi personal'},
  ];
  document.getElementById('daily-windows').innerHTML = windows.map(w=>
    `<div style="display:grid;grid-template-columns:100px 1fr;gap:12px;align-items:start;padding:10px 0;border-bottom:1px solid var(--b1)">
      <div><div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.15em;color:var(--muted)">${w.time}</div><div style="font-family:var(--font-sans);font-size:11px;color:${w.energy==='Puncak'||w.energy==='Tinggi'?'var(--gold)':'var(--dim)'};margin-top:2px">${w.energy}</div></div>
      <div style="font-size:12px;color:var(--dim);line-height:1.5">${w.note}</div>
    </div>`
  ).join('');

  // Cosmic weather
  document.getElementById('daily-cosmic').textContent = `Sun transit di ${sunSign.sign} ${sunSign.deg}° dan Moon di ${moonSign.sign} menciptakan dynamic ${moonEL[sunSign.sign]===mEl?'yang kohesif — dua energi berbicara dalam bahasa yang sama':'yang kontrastif — ada tegangan produktif antara dorongan solar dan kebutuhan lunar'}. Untuk ${D.sunSign} dengan ${D.bazi.dayMaster}, hari ini adalah ${mEl===D.bazi.favEl.split(' ').pop()?'natural ally':'kesempatan untuk melatih fleksibilitas energetik'}.`;
}

