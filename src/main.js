// ── INIT FORMS ON PAGE LOAD ──
document.addEventListener('DOMContentLoaded', ()=>{
  ['astro','hd','bazi','ziwei','num'].forEach(sid=>buildInputForm(sid+'-form-container', sid));
  
  initGalaxyBackground();


  // Remove the old static star div approach (if any)
  // Keep existing date/time/city pickers working for hidden panels
  if(typeof renderCdGrid==='function') renderCdGrid();
});


// NOTE: duplicate reset() below intentionally overrides the one in
// formFlow.js — kept as in the original file (last script tag wins).
// Keep legacy functions working (for compat section partner picker)
function reset() {
  _globalD=null; _globalRaw=null;
  goPage('home',null);
}
