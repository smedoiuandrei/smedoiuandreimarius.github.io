// 1. Configurazione base della Scena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// 2. Creazione dell'oggetto 3D principale (Torus Knot in wireframe)
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshBasicMaterial({ color: 0x58a6ff, wireframe: true });
const torusKnot = new THREE.Mesh(geometry, material);

scene.add(torusKnot);

// 3. Generazione di particelle spaziali di contorno
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    // Posiziona casualmente le particelle
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}
// Aggiungi 200 particelle alla scena
Array(200).fill().forEach(addStar);

// 4. Animazione in loop
function animate() {
    requestAnimationFrame(animate);

    // Rotazione fluida dell'oggetto centrale
    torusKnot.rotation.x += 0.003;
    torusKnot.rotation.y += 0.003;
    torusKnot.rotation.z += 0.003;

    renderer.render(scene, camera);
}

// 5. Responsività: adatta il canvas se la finestra viene ridimensionata
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Avvia l'animazione
animate();