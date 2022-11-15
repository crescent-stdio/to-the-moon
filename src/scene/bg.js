import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/addons/loaders/VOXLoader.js';
// import swordVOXModel from '../../assets/models/chr_sword.vox';
import crescentVOXModel from '../../assets/models/chr_crescent.vox';

let camera, scene, renderer;
let controls;
const clock = new THREE.Clock();
const boxNum = 30;
let voxLength = 0;

// fire the func when scrolled
init();
animate();

function init() {
  // set camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 100);

  // set renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  // set scene
  scene = new THREE.Scene();

  // set background
  scene.background = new THREE.Color(0x222222);

  loadVOX();
  for (let i = 0; i < boxNum; i++) {
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxColor = new THREE.Color(Math.random() * 0xffffff);
    // const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xfde047 });
    const boxMaterial = new THREE.MeshPhongMaterial({ color: boxColor });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);

    box.position.x = 50 * (2.0 * Math.random() - 1.0);
    box.position.y = 50 * (2.0 * Math.random() - 1.0);
    box.position.z = 20 * (2.0 * Math.random());

    box.rotateX(2.0 * Math.PI * Math.random());
    box.rotateY(2.0 * Math.PI * Math.random());
    box.rotateZ(2.0 * Math.PI * Math.random());

    scene.add(box);
  }
  const pointLight = new THREE.PointLight(0x444444);
  pointLight.position.set(5, 5, 5);
  const ambientLight = new THREE.AmbientLight(0x444444);
  scene.add(pointLight, ambientLight);

  document.body.onscroll = moveCamera;
  Array(250).fill().forEach(addStar);
  moveCamera();

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
  for (let i = 0; i < boxNum; i++) {
    scene.children[i].rotateX(0.001);
    scene.children[i].rotateY(0.001);
    scene.children[i].rotateZ(0.001);
    // scene.children[i].position.y += 0.01;
  }
  // rotate the crescent VOX model
  for (let i = boxNum; i < boxNum + voxLength; i++) {
    scene.children[i].rotateX(0.01);

    scene.children[i].rotateY(0.01);
    scene.children[i].rotateZ(0.01);
  }
}
function moveCamera() {
  // top prop here shows how far we are from the top of the webpage
  const t = document.body.getBoundingClientRect().top;

  // camera.position.z = t * -0.01;
  // camera.position.x = t * -0.0002;
  camera.position.y = t * 0.1;
}

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

function loadVOX() {
  const voxLoader = new VOXLoader();
  voxLoader.load(crescentVOXModel, function (chunks) {
    voxLength = chunks.length;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const mesh = new VOXMesh(chunk);
      mesh.position.set(0, -10, 0);
      mesh.rotateY(-Math.PI / 6);
      mesh.scale.setScalar(1.5);
      scene.add(mesh);
    }
  });
}
