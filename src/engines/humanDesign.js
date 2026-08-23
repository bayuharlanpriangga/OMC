// ═══════════════════════════════════════════════════════════
//  HUMAN DESIGN ENGINE
//  88° solar arc (not 88 days) for design chart
// ═══════════════════════════════════════════════════════════
// Authentic HD gate order on the wheel (I Ching hexagrams mapped clockwise from 0° Aries)
// Gate 41 starts at ~337.5° (in Pisces), each gate = 5.625°
// Authentic sequence from Jovian Archive
const HD_GATE_WHEEL = [41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60];
// Offset: Gate 41 begins at longitude 337.5° (approx) = Pisces 7.5°
const HD_GATE_OFFSET = 337.5;

function lonToGate(lon) {
  const adjusted = normalizeAngle(lon - HD_GATE_OFFSET);
  const idx = Math.floor(adjusted / 5.625) % 64;
  return HD_GATE_WHEEL[Math.max(0,Math.min(63,idx))];
}

function lonToLine(lon) {
  // Each gate has 6 lines (5.625° / 6 = 0.9375° per line)
  const adjusted = normalizeAngle(lon - HD_GATE_OFFSET);
  const gateOffset = adjusted % 5.625;
  return Math.floor(gateOffset / 0.9375) + 1; // 1-6
}

// Find JD when Sun reaches target longitude (for 88° solar arc)
// Newton's method approximation
function jdWhenSunAt(targetLon, jdApprox) {
  let jd = jdApprox;
  for(let iter=0; iter<10; iter++) {
    const curLon = sunLongitude(jd);
    let diff = normalizeAngle(targetLon - curLon);
    if(diff > 180) diff -= 360; // shortest arc
    if(Math.abs(diff) < 0.001) break;
    jd += diff / 360; // Sun moves ~1°/day
  }
  return jd;
}

function getDesignJD(birthJD) {
  // Design = when Sun was exactly 88° LESS than birth Sun longitude
  const birthSunLon = sunLongitude(birthJD);
  const designSunTarget = normalizeAngle(birthSunLon - 88);
  // Approximate: 88 days before birth
  const jdApprox = birthJD - 88;
  return jdWhenSunAt(designSunTarget, jdApprox);
}

// ═══════════════════════════════════════════════════════════
//  HUMAN DESIGN ENGINE — Graph-based (proper channel connectivity)
//  Type derived from center CONNECTIVITY, not gate boolean presence
// ═══════════════════════════════════════════════════════════

// Complete HD channel list: [gateA, gateB, centerA, centerB]
const HD_CHANNEL_MAP = [
  // Head-Ajna
  [64,47,'Head','Ajna'],[61,24,'Head','Ajna'],[63,4,'Head','Ajna'],
  // Ajna-Throat
  [17,62,'Ajna','Throat'],[43,23,'Ajna','Throat'],[11,56,'Ajna','Throat'],
  // Throat connections
  [35,36,'Throat','Solar Plexus'],[12,22,'Throat','Solar Plexus'],
  [16,48,'Throat','Spleen'],[20,57,'Throat','Spleen'],
  [10,20,'G','Throat'],[31,7,'Throat','G'],[8,1,'Throat','G'],
  [33,13,'Throat','G'],[45,21,'Throat','Heart'],[26,44,'Heart','Spleen'],
  // G center
  [2,14,'G','Sacral'],[46,29,'G','Sacral'],[15,5,'G','Sacral'],
  // Heart/Will
  [21,45,'Heart','Throat'],[26,44,'Heart','Spleen'],
  [25,51,'G','Heart'],[40,37,'Heart','Solar Plexus'],
  // Solar Plexus
  [6,59,'Solar Plexus','Sacral'],[37,40,'Solar Plexus','Heart'],
  [55,39,'Solar Plexus','Root'],[49,19,'Solar Plexus','Root'],
  [30,41,'Solar Plexus','Root'],[22,12,'Solar Plexus','Throat'],
  // Sacral
  [27,50,'Sacral','Spleen'],[59,6,'Sacral','Solar Plexus'],
  [34,57,'Sacral','Spleen'],[34,20,'Sacral','Throat'],
  [9,52,'Sacral','Root'],[3,60,'Sacral','Root'],
  [42,53,'Sacral','Root'],[29,46,'Sacral','G'],
  [5,15,'Sacral','G'],[14,2,'Sacral','G'],
  // Spleen
  [48,16,'Spleen','Throat'],[57,20,'Spleen','Throat'],
  [57,10,'Spleen','G'],[57,34,'Spleen','Sacral'],
  [44,26,'Spleen','Heart'],[50,27,'Spleen','Sacral'],
  [32,54,'Spleen','Root'],[28,38,'Spleen','Root'],
  [18,58,'Spleen','Root'],
  // Root
  [38,28,'Root','Spleen'],[39,55,'Root','Solar Plexus'],
  [41,30,'Root','Solar Plexus'],[19,49,'Root','Solar Plexus'],
  [53,42,'Root','Sacral'],[60,3,'Root','Sacral'],
  [52,9,'Root','Sacral'],[54,32,'Root','Spleen'],
  [58,18,'Root','Spleen'],
];

// Build gate→channels lookup
const GATE_CHANNELS = {};
HD_CHANNEL_MAP.forEach(([a,b,cA,cB]) => {
  if(!GATE_CHANNELS[a]) GATE_CHANNELS[a] = [];
  if(!GATE_CHANNELS[b]) GATE_CHANNELS[b] = [];
  GATE_CHANNELS[a].push({partner:b, centerSelf:cA, centerPartner:cB});
  GATE_CHANNELS[b].push({partner:a, centerSelf:cB, centerPartner:cA});
});

// Get defined centers via channel completion — proper graph approach
function getDefinedCenters(allGates) {
  const gateSet = new Set(allGates);
  const definedCenters = new Set();
  const definedChannels = [];

  HD_CHANNEL_MAP.forEach(([a,b,cA,cB]) => {
    if(gateSet.has(a) && gateSet.has(b)) {
      definedCenters.add(cA);
      definedCenters.add(cB);
      definedChannels.push([a,b,cA,cB]);
    }
  });

  return { centers: [...definedCenters], channels: definedChannels };
}

// Check if two centers are CONNECTED via defined channels (BFS)
function centersConnected(centerA, centerB, definedChannels) {
  if(centerA === centerB) return true;
  const adj = {};
  definedChannels.forEach(([,,cA,cB]) => {
    if(!adj[cA]) adj[cA]=[];
    if(!adj[cB]) adj[cB]=[];
    adj[cA].push(cB); adj[cB].push(cA);
  });
  const visited = new Set([centerA]);
  const queue = [centerA];
  while(queue.length) {
    const cur = queue.shift();
    if(cur === centerB) return true;
    (adj[cur]||[]).forEach(n => { if(!visited.has(n)) { visited.add(n); queue.push(n); }});
  }
  return false;
}

// Proper HD Type determination via graph connectivity
function determineHDType(allGates) {
  const {centers, channels} = getDefinedCenters(allGates);
  const dc = new Set(centers);

  // Reflector: NO defined centers (no complete channels at all)
  if(dc.size === 0) return 'Reflector';

  const hasSacral = dc.has('Sacral');
  const hasThroat = dc.has('Throat');

  // Motor centers: Heart, Solar Plexus, Sacral, Root
  const motorCenters = ['Heart','Solar Plexus','Sacral','Root'];
  const definedMotors = motorCenters.filter(m => dc.has(m));

  // Manifestor: motor(s) defined AND motor connected to Throat (no Sacral)
  if(!hasSacral && hasThroat) {
    const motorConnectedToThroat = definedMotors
      .filter(m => m !== 'Sacral')
      .some(m => centersConnected(m, 'Throat', channels));
    if(motorConnectedToThroat) return 'Manifestor';
  }

  // Generator types: Sacral is defined
  if(hasSacral) {
    if(hasThroat) {
      // Check if Sacral connects to Throat (possibly via other centers)
      if(centersConnected('Sacral', 'Throat', channels)) return 'Manifesting Generator';
      // Check if any motor connects to throat while sacral is also defined
      const motorToThroat = definedMotors
        .filter(m => m !== 'Sacral')
        .some(m => centersConnected(m, 'Throat', channels));
      if(motorToThroat) return 'Manifesting Generator';
    }
    return 'Generator';
  }

  // Projector: no Sacral, no motor-to-throat connection
  return 'Projector';
}

// Authority — proper hierarchy with dependency checks
function determineAuthority(allGates) {
  const {centers, channels} = getDefinedCenters(allGates);
  const dc = new Set(centers);
  const type = determineHDType(allGates);

  // Reflector always → Lunar
  if(type === 'Reflector') return 'Lunar';

  // Emotional (Solar Plexus) — overrides everything if defined
  if(dc.has('Solar Plexus')) return 'Emotional';

  // Sacral — only for Generators/MG
  if(dc.has('Sacral') && (type==='Generator'||type==='Manifesting Generator')) return 'Sacral';

  // Splenic — if Spleen defined (Projectors, Manifestors)
  if(dc.has('Spleen')) return 'Splenic';

  // Ego/Heart — Heart defined AND connected to Throat or G
  if(dc.has('Heart')) {
    if(dc.has('Throat') && centersConnected('Heart','Throat',channels)) return 'Ego Manifested';
    if(dc.has('G') && centersConnected('Heart','G',channels)) return 'Ego Projected';
    return 'Ego Manifested';
  }

  // Self-Projected — G defined and connected to Throat (no motors defined)
  if(dc.has('G') && dc.has('Throat') && centersConnected('G','Throat',channels)) return 'Self-Projected';

  // Mental (No-Authority Projector) — only Ajna or Head defined, projector
  if(type === 'Projector') return 'Mental';

  return 'Lunar';
}

// Expose getDefinedCenters as simpler interface
function getDefinedCentersList(allGates) {
  return getDefinedCenters(allGates).centers;
}

// Profile: line numbers from personality Sun gate and design Sun gate
function lonToLine(lon) {
  const adjusted = normalizeAngle(lon - HD_GATE_OFFSET);
  const gateOffset = adjusted % 5.625;
  return Math.floor(gateOffset / 0.9375) + 1;
}


