// ============================================
// SCENA 3D PRINCIPALE
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1117);
scene.fog = new THREE.Fog(0x0d1117, 100, 500);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 0);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// ============================================
// LUCI
// ============================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 50, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x58a6ff, 1, 100);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);

// ============================================
// AMBIENTE 3D
// ============================================

// Pavimento
const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a2332,
    roughness: 0.8,
    metalness: 0.1
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Stelle nello spazio
function addStars() {
    for (let i = 0; i < 200; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));
        star.position.set(x, y, z);
        scene.add(star);
    }
}
addStars();

// ============================================
// ELEMENTI DEL PORTFOLIO (Box 3D)
// ============================================
const portfolioItems = [];

function createPortfolioBox(title, description, x, z, color) {
    const geometry = new THREE.BoxGeometry(6, 6, 6);
    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.4,
        roughness: 0.6
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, 3, z);
    box.castShadow = true;
    box.receiveShadow = true;
    
    // Wireframe edges
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color }));
    box.add(line);
    
    scene.add(box);
    
    portfolioItems.push({
        mesh: box,
        title: title,
        description: description,
        visited: false
    });
    
    return box;
}

// Creo i punti del portfolio
createPortfolioBox(
    "PROFILE",
    "Enthusiastic Computer Engineering student with solid academic foundations in low-level and object-oriented programming (C, C++, Java). Looking for a challenging opportunity to bridge the gap between academic theory and real-world engineering.",
    -30, -30,
    0x58a6ff
);

createPortfolioBox(
    "SKILLS",
    "Programming: C, C++, Java, Python\nHardware: Assembly, VHDL\nTools: Git, Linux, LaTeX",
    30, -30,
    0x79c0ff
);

createPortfolioBox(
    "EDUCATION",
    "BSc in Computer, Communications and Electronic Engineering - University of Trento (2024-2027)\nHigh School Diploma in Applied Sciences - Liceo Antonio Rosmini (2019-2024)",
    0, -60,
    0x1f6feb
);

createPortfolioBox(
    "LANGUAGES",
    "Italian: C2\nRomanian: C2\nEnglish: IELTS B2 (Valid until May 2026)",
    -30, 30,
    0x238636
);

createPortfolioBox(
    "CONTACT",
    "📍 Trento, Italy\n📧 smedoiuandreimarius05@gmail.com\n📞 3894485239\nLinkedin: [Coming Soon]",
    30, 30,
    0xda3633
);

// ============================================
// MOVIMENTO E CONTROLLI
// ============================================

const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false
};

const velocity = new THREE.Vector3();
const speed = 0.1;

const euler = new THREE.Euler(0, 0, 0, 'YXZ');
let pitch = 0;
let yaw = 0;

// Tastiera
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w') movement.forward = true;
    if (key === 'a') movement.left = true;
    if (key === 's') movement.backward = true;
    if (key === 'd') movement.right = true;
    if (key === ' ') movement.up = true;
    if (key === 'shift') movement.down = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w') movement.forward = false;
    if (key === 'a') movement.left = false;
    if (key === 's') movement.backward = false;
    if (key === 'd') movement.right = false;
    if (key === ' ') movement.up = false;
    if (key === 'shift') movement.down = false;
});

// Mouse look
let mouseDown = false;
let mouseDelta = { x: 0, y: 0 };

window.addEventListener('mousedown', () => {
    mouseDown = true;
    document.body.style.cursor = 'none';
});

window.addEventListener('mouseup', () => {
    mouseDown = false;
    document.body.style.cursor = 'auto';
});

window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        mouseDelta.x += e.movementX * 0.002;
        mouseDelta.y += e.movementY * 0.002;
    }
});

// Joystick (Mobile/Touch)
let joystickInput = { x: 0, y: 0 };

if (typeof nipplejs !== 'undefined') {
    const manager = nipplejs.create({
        zone: document.getElementById('joystick'),
        mode: 'static',
        position: { left: '50%', bottom: '50px' },
        color: '#58a6ff'
    });

    manager.on('move', (evt, data) => {
        joystickInput.x = data.vector.x;
        joystickInput.y = data.vector.y;
    });

    manager.on('end', () => {
        joystickInput.x = 0;
        joystickInput.y = 0;
    });
}

// ============================================
// UPDATE CAMERA E POSIZIONE
// ============================================

function updatePlayerMovement() {
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    // Calcola direzioni basate sull'angolo della camera
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();
    
    // Movimento da tastiera
    if (movement.forward) velocity.add(forward.multiplyScalar(speed));
    if (movement.backward) velocity.add(forward.multiplyScalar(-speed));
    if (movement.left) velocity.add(right.multiplyScalar(-speed));
    if (movement.right) velocity.add(right.multiplyScalar(speed));
    if (movement.up) camera.position.y += speed;
    if (movement.down) camera.position.y -= speed;
    
    // Movimento da joystick
    const joystickForward = new THREE.Vector3();
    camera.getWorldDirection(joystickForward);
    joystickForward.y = 0;
    joystickForward.normalize();
    
    const joystickRight = new THREE.Vector3();
    joystickRight.crossVectors(new THREE.Vector3(0, 1, 0), joystickForward).normalize();
    
    velocity.add(joystickForward.multiplyScalar(joystickInput.y * speed * 0.5));
    velocity.add(joystickRight.multiplyScalar(joystickInput.x * speed * 0.5));
    
    // Attrito
    velocity.multiplyScalar(0.85);
    
    // Applica velocità alla posizione
    camera.position.add(velocity);
    
    // Limita altezza
    if (camera.position.y < 0.5) camera.position.y = 0.5;
    if (camera.position.y > 100) camera.position.y = 100;
    
    // Mouse look
    pitch -= mouseDelta.y;
    yaw -= mouseDelta.x;
    mouseDelta.x = 0;
    mouseDelta.y = 0;
    
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    
    euler.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
    camera.quaternion.setFromEuler(euler);
}

// ============================================
// DETECTIONZIONE PROSSIMITÀ
// ============================================

function updateHUD() {
    let closestItem = null;
    let closestDistance = 15;
    
    portfolioItems.forEach(item => {
        const distance = camera.position.distanceTo(item.mesh.position);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestItem = item;
        }
    });
    
    const titleEl = document.getElementById('current-section');
    const infoEl = document.getElementById('info-text');
    const detailsEl = document.getElementById('details');
    
    if (closestItem) {
        titleEl.textContent = closestItem.title;
        infoEl.textContent = `Distanza: ${closestDistance.toFixed(1)}m`;
        detailsEl.innerHTML = closestItem.description.replace(/\n/g, '<br>');
        
        if (closestDistance < 8) {
            closestItem.mesh.rotation.x += 0.002;
            closestItem.mesh.rotation.y += 0.002;
        }
    } else {
        titleEl.textContent = 'PORTFOLIO 3D';
        infoEl.textContent = 'Muoviti con il joystick per esplorare';
        detailsEl.innerHTML = '';
    }
}

// ============================================
// LOOP DI ANIMAZIONE
// ============================================

function animate() {
    requestAnimationFrame(animate);
    
    updatePlayerMovement();
    updateHUD();
    
    // Anima tutti i box
    portfolioItems.forEach(item => {
        const distance = camera.position.distanceTo(item.mesh.position);
        if (distance > 15) {
            item.mesh.rotation.x += 0.0005;
            item.mesh.rotation.y += 0.0005;
        }
    });
    
    renderer.render(scene, camera);
}

animate();

// ============================================
// RESPONSIVITÀ
// ============================================

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Avvia l'animazione
animate();