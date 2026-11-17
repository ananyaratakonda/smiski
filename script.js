
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('model-container');

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);


const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);


scene.add(new THREE.AmbientLight(0xffffff, 2));

const mainLight = new THREE.DirectionalLight(0xffffff, 3);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 2);
fillLight.position.set(-5, 3, 5);
scene.add(fillLight);

const modelGroup = new THREE.Group();
scene.add(modelGroup);

const loader = new GLTFLoader();

loader.load('./basicBox.glb', (gltf) => {

    const model = gltf.scene;

    modelGroup.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center);

    model.rotation.y = Math.PI / 6;

    const size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

  camera.position.set(
    maxDimension * 0.8,
    maxDimension * 1.2,
    maxDimension * 2
);

    camera.lookAt(0, 0, 0);

    console.log('Smiski loaded!');

}, undefined, (error) => {
    console.error('Error loading Smiski:', error);
});

let isDragging = false;
let previousMouseX = 0;

container.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('mousemove', (event) => {

    if (!isDragging) return;

    const deltaX = event.clientX - previousMouseX;

    modelGroup.rotation.y += deltaX * 0.01;

    previousMouseX = event.clientX;
});


let previousTouchX = 0;

container.addEventListener('touchstart', (event) => {
    previousTouchX = event.touches[0].clientX;
}, { passive: true });

container.addEventListener('touchmove', (event) => {

    const currentTouchX = event.touches[0].clientX;
    const deltaX = currentTouchX - previousTouchX;

    modelGroup.rotation.y += deltaX * 0.01;

    previousTouchX = currentTouchX;

}, { passive: true });

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );
});
