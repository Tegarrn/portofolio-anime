import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';

// 1. Mengatur Scene, Camera, dan Renderer Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30.0, window.innerWidth / window.innerHeight, 0.1, 20.0);
camera.position.set(0.0, 1.0, 5.0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Menambahkan pencahayaan dasar
const light = new THREE.DirectionalLight(0xffffff, Math.PI);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);

// 2. Memuat Model VRM
let vrm; // Variabel untuk menyimpan model VRM
const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser)); // Menggunakan plugin VRM

loader.load(
    '/public/model.vrm', // Path ke model Anda
    (gltf) => {
        vrm = gltf.userData.vrm; // Mengambil data VRM
        scene.add(vrm.scene); // Menambahkan model ke scene
        console.log('Model VRM berhasil dimuat!');
    },
    (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
    (error) => console.error(error)
);

// 3. Loop Animasi untuk Merender Scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// 4. Menyesuaikan ukuran canvas saat window di-resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});