import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module';
import { GUI } from 'three/addons/libs/lil-gui.module.min';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Water } from 'three/examples/jsm/objects/Water';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils';
import render from 'hexo/lib/plugins/helper/render';

let container, stats;
let camera, scene, renderer;
let controls;
const clock = new THREE.Clock();


init();
animate();

function init() {
  // set canvas
  container = document.getElementById('canvas');
  document.body.appendChild(container);

  // set camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(-1, 2, 3);

  // set renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // set scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

  // set light
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);

  // set plane
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const n = 10;
  const texture = new THREE.TextureLoader().load(
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/crate.gif',
  );
  for (let i = 0; i < n; i++) {
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshPhongMaterial({ map: texture });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);

    box.position.x = 10 * (2.0 * Math.random() - 1.0);
    box.position.y = 10 * (2.0 * Math.random() - 1.0);
    box.position.z = 10 * (2.0 * Math.random() - 1.0);
    scene.add(box);
  }

  // controlsㅁ
  controls = new FirstPersonControls(camera, renderer.domElement);

  controls.movementSpeed = 10;
  controls.lookSpeed = 0.125;
  controls.lookVertical = true;

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();

  camera.aspect = window.innerWidth / window.innderHeight;
  controls.handleResize();
}

function animate() {
  
  requestAnimationFrame(animate);
  
  controls.update( clock.getDelta() );
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
}
