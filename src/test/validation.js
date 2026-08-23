// ═══════════════════════════════════════════════════════════
//  VALIDATION TEST SUITE — access via URL hash #test
// ═══════════════════════════════════════════════════════════
const VALIDATION_CASES = [
  { name:'Bayu (real)', date:'2005-04-18', time:'10:28', lat:-6.732, lon:108.552, tz:7,
    expect:{ Sun:'Aries', Moon:'Leo', Asc:'Cancer', Mercury:'Aries', Venus:'Taurus',
             Mars:'Aquarius', Jupiter:'Libra', Saturn:'Cancer', Uranus:'Pisces',
             Neptune:'Aquarius', Pluto:'Sagittarius', BaziDM:'Yang Water',
             BaziYear:'Yin Wood', BaziMonth:'Yang Metal' }},
  { name:'J2000 test', date:'2000-01-01', time:'12:00', lat:0, lon:0, tz:0,
    expect:{ Sun:'Capricorn', Moon:null, Asc:null }},
  { name:'Feb 3 1995 (before lichun)', date:'1995-02-03', time:'12:00', lat:-6.2, lon:106.8, tz:7,
    expect:{ BaziYear:'Yang Wood' }}, // 1994 Jia Xu year
  { name:'Feb 6 1995 (after lichun)', date:'1995-02-06', time:'12:00', lat:-6.2, lon:106.8, tz:7,
    expect:{ BaziYear:'Yin Wood' }}, // 1995 Yi Hai year
];

function runValidation() {
  const results = [];
  VALIDATION_CASES.forEach(tc => {
    const D = computeChart(tc.name, tc.date, tc.time, 'test', tc.lat, tc.lon, tc.tz);
    const row = { name:tc.name, pass:[], fail:[] };
    const exp = tc.expect;
    if(exp.Sun) { const ok=D.planets.Sun.sign===exp.Sun; (ok?row.pass:row.fail).push('Sun: '+D.planets.Sun.sign+' (exp '+exp.Sun+')'); }
    if(exp.Moon) { const ok=D.planets.Moon.sign===exp.Moon; (ok?row.pass:row.fail).push('Moon: '+D.planets.Moon.sign+' (exp '+exp.Moon+')'); }
    if(exp.Asc) { const ok=D.planets.Ascendant.sign===exp.Asc; (ok?row.pass:row.fail).push('Asc: '+D.planets.Ascendant.sign+' (exp '+exp.Asc+')'); }
    if(exp.Mercury) { const ok=D.planets.Mercury.sign===exp.Mercury; (ok?row.pass:row.fail).push('Mercury: '+D.planets.Mercury.sign+' (exp '+exp.Mercury+')'); }
    if(exp.Venus) { const ok=D.planets.Venus.sign===exp.Venus; (ok?row.pass:row.fail).push('Venus: '+D.planets.Venus.sign+' (exp '+exp.Venus+')'); }
    if(exp.Mars) { const ok=D.planets.Mars.sign===exp.Mars; (ok?row.pass:row.fail).push('Mars: '+D.planets.Mars.sign+' (exp '+exp.Mars+')'); }
    if(exp.BaziDM) { const ok=D.bazi.dayMaster===exp.BaziDM; (ok?row.pass:row.fail).push('BaziDM: '+D.bazi.dayMaster+' (exp '+exp.BaziDM+')'); }
    if(exp.BaziYear) { const ok=D.bazi.year.el===exp.BaziYear; (ok?row.pass:row.fail).push('BaziYear: '+D.bazi.year.el+' (exp '+exp.BaziYear+')'); }
    if(exp.BaziMonth) { const ok=D.bazi.month.el===exp.BaziMonth; (ok?row.pass:row.fail).push('BaziMonth: '+D.bazi.month.el+' (exp '+exp.BaziMonth+')'); }
    results.push(row);
  });

  // Display validation panel
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(5,5,10,.97);z-index:9000;overflow:auto;padding:40px;font-family:var(--font-mono)';
  const total = results.reduce((a,r)=>a+r.pass.length+r.fail.length,0);
  const passed = results.reduce((a,r)=>a+r.pass.length,0);
  panel.innerHTML = '<div style="max-width:700px;margin:0 auto">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px">' +
    '<div style="font-size:20px;color:var(--gold)">OMC Validation Suite</div>' +
    '<div style="font-size:12px;color:'+(passed===total?'var(--green)':'var(--gold)')+'">'+passed+'/'+total+' tests passed</div>' +
    '<button onclick="this.parentElement.parentElement.parentElement.remove()" style="background:none;border:1px solid var(--b2);color:var(--dim);padding:6px 14px;cursor:pointer;font-family:var(--font-mono)">Close</button>' +
    '</div>' +
    results.map(r =>
      '<div style="margin-bottom:20px;padding:16px;background:var(--s1);border:1px solid '+(r.fail.length?'rgba(196,96,74,.3)':'rgba(90,158,120,.3)')+';">' +
      '<div style="font-size:11px;letter-spacing:.2em;color:var(--gold);margin-bottom:10px">'+r.name+'</div>' +
      r.pass.map(p=>'<div style="color:var(--green);font-size:10px;padding:2px 0">✓ '+p+'</div>').join('') +
      r.fail.map(f=>'<div style="color:var(--red);font-size:10px;padding:2px 0">✗ '+f+'</div>').join('') +
      '</div>'
    ).join('') +
    '</div>';
  document.body.appendChild(panel);
}

// Trigger validation with URL hash
if(typeof window !== 'undefined' && window.location.hash === '#test') {
  window.addEventListener('load', ()=>setTimeout(runValidation, 100));
}

// Init on load — wrapped in DOMContentLoaded to prevent null addEventListener errors
document.addEventListener('DOMContentLoaded', function() {
  initDatePicker();
  initWheels();
  // Default
  var iCityEl = document.getElementById('iCity');
  if(iCityEl) iCityEl.value = '';
});



