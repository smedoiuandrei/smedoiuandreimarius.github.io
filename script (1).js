// ── RENDERER ──────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000510);
scene.fog = new THREE.FogExp2(0x000510, 0.018);

const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 200);

// ── LIGHTING ──────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x102040, 1.2));
const sun = new THREE.DirectionalLight(0x6090ff, 0.6);
sun.position.set(15, 30, 15);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
scene.add(sun);

// ── FLOOR ─────────────────────────────────────────────────────────────────
const floorMat = new THREE.MeshStandardMaterial({ color: 0x000a18, roughness: 0.9 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Grid
const grid = new THREE.GridHelper(120, 60, 0x00ffc8, 0x002222);
grid.material.opacity = 0.4;
grid.material.transparent = true;
scene.add(grid);

// ── STARS ─────────────────────────────────────────────────────────────────
(() => {
  const pos = [];
  for (let i = 0; i < 2000; i++)
    pos.push((Math.random()-0.5)*250, 5+Math.random()*100, (Math.random()-0.5)*250);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12 })));
})();

// ── CHARACTER ─────────────────────────────────────────────────────────────
const player = new THREE.Group();
scene.add(player);

const mkBox = (w, h, d, color, emissive = 0, ei = 0) => {
  const m = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: ei, roughness: 0.5, metalness: 0.4 });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.castShadow = true;
  return mesh;
};

const torso   = mkBox(0.60, 0.80, 0.30, 0x0d0d2e, 0x00ffc8, 0.15);
const head    = mkBox(0.44, 0.44, 0.44, 0xffd0a0);
const lArm    = mkBox(0.20, 0.66, 0.20, 0x111136, 0x001122, 0.1);
const rArm    = mkBox(0.20, 0.66, 0.20, 0x111136, 0x001122, 0.1);
const lLeg    = mkBox(0.24, 0.76, 0.24, 0x080820);
const rLeg    = mkBox(0.24, 0.76, 0.24, 0x080820);

torso.position.y  = 1.40;
head.position.y   = 2.06;
lArm.position.set( 0.42, 1.35, 0);
rArm.position.set(-0.42, 1.35, 0);
lLeg.position.set( 0.16, 0.58, 0);
rLeg.position.set(-0.16, 0.58, 0);

[torso, head, lArm, rArm, lLeg, rLeg].forEach(m => player.add(m));

// Glowing eyes
const eyeM = new THREE.MeshStandardMaterial({ color: 0x00ffc8, emissive: 0x00ffc8, emissiveIntensity: 2 });
const eyeG = new THREE.BoxGeometry(0.07, 0.06, 0.04);
const le = new THREE.Mesh(eyeG, eyeM); le.position.set( 0.10, 2.08, 0.23); player.add(le);
const re = new THREE.Mesh(eyeG, eyeM); re.position.set(-0.10, 2.08, 0.23); player.add(re);

// Neon edge outline on torso
const edgesT = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.62,0.82,0.32)), new THREE.LineBasicMaterial({ color: 0x00ffc8 }));
edgesT.position.copy(torso.position);
player.add(edgesT);

// Player glow light
const pLight = new THREE.PointLight(0x00ffc8, 0.6, 5);
pLight.position.set(0, 2, 0);
player.add(pLight);

// ── PORTFOLIO ZONES ───────────────────────────────────────────────────────
const ZONES = [
  {
    id: 'profile',
    title: 'PROFILE',
    pos: [0, -14],
    color: 0x00ffc8,
    content: `<b style="color:#fff;font-size:15px">Smedoiu Andrei Marius</b><br><br>
      Computer Engineering student con solide basi in programmazione low-level e OOP.<br><br>
      📍 Ala (Trento), Via Tre Chiodi 21<br>
      📧 smedoiuandreimarius05@gmail.com<br>
      📱 +39 389 4485239<br><br>
      <span style="opacity:0.7;font-size:12px">Nato il 14.08.2005</span>`
  },
  {
    id: 'skills',
    title: 'SKILLS',
    pos: [14, 0],
    color: 0xff2aaa,
    content: `<b style="color:#fff">Programming Languages</b><br>
      <span class="tag">C</span><span class="tag">C++</span><span class="tag">Java</span><span class="tag">Python</span><br><br>
      <b style="color:#fff">Hardware & Low-Level</b><br>
      <span class="tag">Assembly</span><span class="tag">VHDL</span><br><br>
      <b style="color:#fff">Developer Tools</b><br>
      <span class="tag">Git</span><span class="tag">Linux</span><span class="tag">LaTeX</span><br><br>
      <b style="color:#fff">Focus Areas</b><br>
      Algorithms · Software Dev · Low-Level Architecture`
  },
  {
    id: 'education',
    title: 'EDUCATION',
    pos: [-14, 0],
    color: 0xffaa00,
    content: `<b style="color:#fff">University of Trento</b><br>
      BSc Computer, Communications & Electronic Engineering<br>
      <span style="opacity:0.6;font-size:11px">2024 → 2027 (expected)</span><br><br>
      Core: C, C++, Python, Java<br>
      Hardware: Assembly, VHDL<br>
      Focus: Algorithms, software dev, low-level arch<br><br>
      <b style="color:#fff">Liceo A. Rosmini — Rovereto</b><br>
      Diploma in Applied Sciences<br>
      <span style="opacity:0.6;font-size:11px">2019 → 2024</span>`
  },
  {
    id: 'languages',
    title: 'LANGUAGES',
    pos: [0, 14],
    color: 0x4488ff,
    content: `<b style="color:#fff">Language Proficiency</b><br><br>
      🇬🇧 &nbsp;<b>English</b> &nbsp;— &nbsp;B2 &nbsp;<span style="opacity:0.6;font-size:11px">(IELTS, valid to May 2026)</span><br><br>
      🇷🇴 &nbsp;<b>Romanian</b> &nbsp;— &nbsp;C2 &nbsp;<span style="opacity:0.6;font-size:11px">Madrelingua</span><br><br>
      🇮🇹 &nbsp;<b>Italiano</b> &nbsp;— &nbsp;C2 &nbsp;<span style="opacity:0.6;font-size:11px">Fluente</span>`
  }
];

const zoneMeta = [];

ZONES.forEach(z => {
  const g = new THREE.Group();
  g.position.set(z.pos[0], 0, z.pos[1]);
  scene.add(g);

  const col = z.color;

  // Base platform
  const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.18, 4),
    new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.3, roughness: 0.4, metalness: 0.8 }));
  base.position.y = 0.09;
  base.receiveShadow = true;
  g.add(base);

  // Central column
  const col3d = new THREE.Mesh(new THREE.BoxGeometry(0.28, 4.5, 0.28),
    new THREE.MeshStandardMaterial({ color: 0x05050f, emissive: col, emissiveIntensity: 0.12, metalness: 0.9 }));
  col3d.position.y = 2.25;
  col3d.castShadow = true;
  g.add(col3d);

  // Sign panel
  const signGeo = new THREE.BoxGeometry(3.2, 1.6, 0.12);
  const sign = new THREE.Mesh(signGeo,
    new THREE.MeshStandardMaterial({ color: 0x030318, emissive: col, emissiveIntensity: 0.08, roughness: 0.1, metalness: 0.95 }));
  const ang = Math.atan2(z.pos[0], z.pos[1]);
  sign.rotation.y = ang;
  sign.position.set(Math.sin(ang) * 0.5, 4.3, Math.cos(ang) * 0.5);
  g.add(sign);

  // Sign outline
  const sEdge = new THREE.LineSegments(new THREE.EdgesGeometry(signGeo), new THREE.LineBasicMaterial({ color: col }));
  sEdge.rotation.copy(sign.rotation);
  sEdge.position.copy(sign.position);
  g.add(sEdge);

  // Zone light
  const zl = new THREE.PointLight(col, 1.0, 12);
  zl.position.y = 3;
  g.add(zl);

  // Ring at base
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.05, 8, 32),
    new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.8 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.2;
  g.add(ring);

  // Floating particles
  const particles = [];
  for (let i = 0; i < 10; i++) {
    const p = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.07, 0.07),
      new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 2 })
    );
    const a = (i / 10) * Math.PI * 2;
    p.position.set(Math.cos(a) * 2, 1.5 + Math.random() * 2, Math.sin(a) * 2);
    p.userData.angle = a;
    p.userData.speed = 0.4 + Math.random() * 0.3;
    p.userData.height = 1.5 + Math.random() * 2;
    particles.push(p);
    g.add(p);
  }

  zoneMeta.push({ g, z, zl, ring, sign, particles });
});

// ── DECORATIVE AMBIENT CUBES ──────────────────────────────────────────────
const ambCubes = [];
for (let i = 0; i < 25; i++) {
  const s = 0.15 + Math.random() * 0.45;
  const wireframe = Math.random() > 0.45;
  const colors = [0x00ffc8, 0xff2aaa, 0xffaa00, 0x4488ff];
  const c = colors[Math.floor(Math.random() * colors.length)];
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(s, s, s),
    new THREE.MeshStandardMaterial({ color: wireframe ? 0x001010 : c, emissive: c, emissiveIntensity: wireframe ? 0.4 : 0.2, wireframe })
  );
  const ang = Math.random() * Math.PI * 2;
  const r = 10 + Math.random() * 28;
  m.position.set(Math.cos(ang)*r, 1+Math.random()*6, Math.sin(ang)*r);
  m.userData.rs = (Math.random()-0.5) * 0.025;
  m.userData.fo = Math.random() * Math.PI * 2;
  scene.add(m);
  ambCubes.push(m);
}

// ── CONTROLS ──────────────────────────────────────────────────────────────
const keys = new Set();
document.addEventListener('keydown', e => keys.add(e.key));
document.addEventListener('keyup', e => keys.delete(e.key));

// Virtual joystick
let jx = 0, jy = 0, jActive = false;
const jZone = document.getElementById('joystick-zone');
const jStick = document.getElementById('joystick-stick');
const MAX_R = 34;

function moveStick(cx, cy) {
  const r = jZone.getBoundingClientRect();
  let dx = cx - (r.left + r.width/2);
  let dy = cy - (r.top + r.height/2);
  const d = Math.sqrt(dx*dx + dy*dy);
  if (d > MAX_R) { dx = dx/d*MAX_R; dy = dy/d*MAX_R; }
  jStick.style.left = (37 + dx) + 'px';
  jStick.style.top  = (37 + dy) + 'px';
  jx = dx / MAX_R; jy = dy / MAX_R;
}
function resetStick() {
  jx = 0; jy = 0; jActive = false;
  jStick.style.left = '37px'; jStick.style.top = '37px';
  jStick.classList.remove('active');
}

jZone.addEventListener('touchstart', e => { e.preventDefault(); jActive = true; jStick.classList.add('active'); moveStick(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
jZone.addEventListener('touchmove',  e => { e.preventDefault(); if (jActive) moveStick(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
jZone.addEventListener('touchend',   resetStick);
jZone.addEventListener('mousedown',  e => { jActive = true; jStick.classList.add('active'); moveStick(e.clientX, e.clientY); });
document.addEventListener('mousemove', e => { if (jActive) moveStick(e.clientX, e.clientY); });
document.addEventListener('mouseup',   resetStick);

// ── MINIMAP ───────────────────────────────────────────────────────────────
const mmCanvas = document.getElementById('mm-canvas');
mmCanvas.width = 100; mmCanvas.height = 100;
const mmCtx = mmCanvas.getContext('2d');

function drawMinimap() {
  mmCtx.clearRect(0,0,100,100);
  mmCtx.fillStyle = 'rgba(0,8,24,0.9)';
  mmCtx.fillRect(0,0,100,100);

  // zones
  const ZONE_COLORS = ['#00ffc8','#ff2aaa','#ffaa00','#4488ff'];
  ZONES.forEach((z, i) => {
    const mx = 50 + z.pos[0] * 1.8;
    const mz = 50 + z.pos[1] * 1.8;
    mmCtx.fillStyle = ZONE_COLORS[i];
    mmCtx.fillRect(mx-4, mz-4, 8, 8);
    mmCtx.font = '6px Courier New';
    mmCtx.fillText(z.id.substring(0,3).toUpperCase(), mx-6, mz+12);
  });

  // player dot
  const px = 50 + player.position.x * 1.8;
  const pz = 50 + player.position.z * 1.8;
  mmCtx.fillStyle = '#fff';
  mmCtx.beginPath();
  mmCtx.arc(px, pz, 3, 0, Math.PI * 2);
  mmCtx.fill();
}

// ── MAIN LOOP ─────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let walkT = 0;
let activeZoneId = null;
const SPEED = 0.085;
const PROX_DIST = 5.5;

const infoPanel   = document.getElementById('info-panel');
const panelTitle  = document.getElementById('panel-title');
const panelContent= document.getElementById('panel-content');
const zoneLabel   = document.getElementById('zone-label');

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  const t  = clock.getElapsedTime();

  // ── Movement ──
  let mx = 0, mz = 0;
  if (keys.has('w') || keys.has('W') || keys.has('ArrowUp'))    mz -= 1;
  if (keys.has('s') || keys.has('S') || keys.has('ArrowDown'))  mz += 1;
  if (keys.has('a') || keys.has('A') || keys.has('ArrowLeft'))  mx -= 1;
  if (keys.has('d') || keys.has('D') || keys.has('ArrowRight')) mx += 1;
  if (jActive) { mx = jx; mz = jy; }

  const moving = mx !== 0 || mz !== 0;

  if (moving) {
    const len = Math.sqrt(mx*mx + mz*mz);
    mx /= len; mz /= len;
    player.rotation.y = Math.atan2(mx, mz);
    player.position.x = Math.max(-48, Math.min(48, player.position.x + mx * SPEED));
    player.position.z = Math.max(-48, Math.min(48, player.position.z + mz * SPEED));
    walkT += dt * 9;
    player.position.y = Math.abs(Math.sin(walkT * 0.5)) * 0.04;
  } else {
    player.position.y *= 0.88;
    walkT *= 0.9;
  }

  // Walk anim
  const sw = Math.sin(walkT) * (moving ? 0.42 : 0);
  lArm.rotation.x =  sw;
  rArm.rotation.x = -sw;
  lLeg.rotation.x = -sw;
  rLeg.rotation.x =  sw;

  // Idle bob
  head.position.y = 2.06 + Math.sin(t * 1.3) * 0.012;

  // ── Camera ──
  const camTarget = player.position.clone().add(new THREE.Vector3(0, 8, 11));
  camera.position.lerp(camTarget, 0.07);
  camera.lookAt(player.position.x, player.position.y + 1.2, player.position.z);

  // ── Zone proximity ──
  let nearZone = null, nearDist = Infinity;
  zoneMeta.forEach(zm => {
    const dx = player.position.x - zm.g.position.x;
    const dz = player.position.z - zm.g.position.z;
    const d  = Math.sqrt(dx*dx + dz*dz);
    if (d < PROX_DIST && d < nearDist) { nearDist = d; nearZone = zm; }

    // Pulse zone light
    zm.zl.intensity = d < PROX_DIST ? 2.4 + Math.sin(t*4)*0.4 : 0.9;

    // Rotate ring
    zm.ring.rotation.z = t * 0.5;

    // Orbit particles
    zm.particles.forEach(p => {
      p.userData.angle += p.userData.speed * dt;
      p.position.x = Math.cos(p.userData.angle) * 2;
      p.position.z = Math.sin(p.userData.angle) * 2;
      p.position.y = p.userData.height + Math.sin(t * 2 + p.userData.angle) * 0.3;
      p.rotation.y += 0.05;
    });
  });

  // Panel visibility
  if (nearZone) {
    const cHex = '#' + nearZone.z.color.toString(16).padStart(6,'0');
    if (nearZone.z.id !== activeZoneId) {
      activeZoneId = nearZone.z.id;
      infoPanel.style.display = 'block';
      infoPanel.style.borderColor = cHex;
      infoPanel.style.boxShadow = `0 0 30px ${cHex}33`;
      infoPanel.style.color = cHex;
      panelTitle.textContent = nearZone.z.title;
      panelContent.innerHTML = nearZone.z.content;
      const tags = panelContent.querySelectorAll('.tag');
      tags.forEach(t2 => t2.style.borderColor = cHex);
    }
    zoneLabel.style.display = 'none';
  } else {
    if (activeZoneId) {
      activeZoneId = null;
      infoPanel.style.display = 'none';
    }
    // Show hint when near (slightly farther)
    let anyClose = false;
    zoneMeta.forEach(zm => {
      const dx = player.position.x - zm.g.position.x;
      const dz = player.position.z - zm.g.position.z;
      if (Math.sqrt(dx*dx + dz*dz) < PROX_DIST + 3) anyClose = true;
    });
    zoneLabel.style.display = anyClose ? 'block' : 'none';
    if (anyClose) zoneLabel.textContent = '▲  Avvicinati al pannello  ▲';
  }

  // ── Ambient cubes ──
  ambCubes.forEach(c => {
    c.rotation.x += c.userData.rs;
    c.rotation.y += c.userData.rs * 0.65;
    c.position.y += Math.sin(t + c.userData.fo) * 0.003;
  });

  // ── Minimap ──
  drawMinimap();

  renderer.render(scene, camera);
}

// ── RESIZE ────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ── START ─────────────────────────────────────────────────────────────────
setTimeout(() => {
  document.getElementById('loading').style.display = 'none';
  animate();
}, 600);
