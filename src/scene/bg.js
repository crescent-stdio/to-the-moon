import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/addons/loaders/VOXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// import swordVOXModel from '../../assets/models/chr_sword.vox';
import crescentVOXModel from '../../assets/models/chr_crescent.vox';
import shootingStarVOXModel from '../../assets/models/shooting_star.vox';

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const crescentRatio = isMobile ? 10 : 40;
const crescentScale = isMobile ? 0.35 : 1.25;

let camera, scene, renderer;
let controls;
const clock = new THREE.Clock();
const boxNum = 30;
const shootingStarNum = 10;
let voxLength = 0;

let meshList = [];
let shootingStarMeshList = [];
// const shootingStarDirections = [];
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

  addBoxs();
  loadModels();
  // const pointLight = new THREE.PointLight(0x999999, 1, 1000);
  // pointLight.position.set(0, 0, 500);
  const ambientLight = new THREE.AmbientLight(0x999999);
  // scene.add(pointLight, ambientLight);
  // scene.add(pointLight);
  scene.add(ambientLight);

  document.body.onscroll = moveCamera;
  Array(300).fill().forEach(addStar);
  moveCamera();

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  for (let i = 0; i < voxLength; i++) {
    meshList[i].position.set(window.innerWidth / crescentRatio, -10, 0);
  }
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
  for (let i = 0; i < voxLength; i++) {
    meshList[i].rotation.x -= 0.001;
    meshList[i].rotation.y += 0.001;
    meshList[i].rotation.z -= 0.001;
  }
  for (const starMeshList of shootingStarMeshList) {
    for (const starMesh of starMeshList) {
      // move the shooting star from the star's rotation(euler angle)
      // calculate eular angle to main axis vector
      const rotation = new THREE.Euler();
      rotation.setFromQuaternion(starMesh.quaternion, 'XYZ');
      // move the shooting star using ratation
      const direction = new THREE.Vector3(0, 0, 1);
      direction.applyEuler(rotation);
      starMesh.position.addScaledVector(direction, Math.random(10) + 2);
      if (isOut(starMesh)) {
        for (let starMesh of starMeshList) {
          starMesh.position.x = (randomSign() * window.innerWidth) / 10 + (randomSign() * window.innerWidth) / 100;
          starMesh.position.y = (randomSign() * window.innerHeight) / 10 + (randomSign() * window.innerHeight) / 100;
          starMesh.position.z = randomSign() * Math.random() * 10;
          const starAngleX = 2.0 * Math.PI * Math.random();
          const starAngleY = 2.0 * Math.PI * Math.random();
          const starAngleZ = 2.0 * Math.PI * Math.random();
          starMesh.rotation.set(starAngleX, starAngleY, starAngleZ);
        }
      }
    }
  }
}
function moveCamera() {
  // top prop here shows how far we are from the top of the webpage
  const t = document.body.getBoundingClientRect().top;
  camera.position.y = t * 0.1;
}

function isOut(mesh) {
  return mesh.position.x > window.innerWidth / 10 || mesh.position.x < -window.innerWidth / 10 || mesh.position.y > window.innerHeight / 10 || mesh.position.y < -window.innerHeight / 10;
}
function randomSign() {
  return Math.random() > 0.5 ? 1 : -1;
}
function loadModels() {
  const voxLoader = new VOXLoader();
  voxLoader.load(crescentVOXModel, function (chunks) {
    voxLength = chunks.length;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const mesh = new VOXMesh(chunk);
      mesh.position.set(window.innerWidth / crescentRatio, -10, 20);
      mesh.rotateY(-Math.PI / 6);
      mesh.scale.setScalar(crescentScale);
      mesh.emissiveIntensity = 1;
      scene.add(mesh);
      meshList.push(mesh);
    }
  });

  const starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      c: { type: 'f', value: 8.0 },
      p: { type: 'f', value: 2.4 },
      glowColor: { type: 'c', value: new THREE.Color(0xfff000) },
      viewVector: { type: 'v3', value: camera.position },
    },
    fragmentShader: document.getElementById('fragmentShader').textContent,
    vertexShader: document.getElementById('vertexShader').textContent,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  for (let t = 0; t < shootingStarNum; t++) {
    const x = 50 * (2.0 * Math.random() - 1.0);
    const y = 50 * (2.0 * Math.random() - 1.0);
    const z = randomSign() * Math.random() * 10;
    const starScale = Math.random() * 0.15;
    const starAngleX = 2.0 * Math.PI * Math.random();
    const starAngleY = 2.0 * Math.PI * Math.random();
    const starAngleZ = 2.0 * Math.PI * Math.random();

    // const starAngleY = 0;
    // const starAngleZ = 0;
    const starMeshList = [];
    const starIntensity = 8.0 + Math.random();
    voxLoader.load(shootingStarVOXModel, function (chunks) {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const mesh = new VOXMesh(chunk);
        mesh.position.set(x, y, z);
        mesh.rotateX(starAngleX);
        mesh.rotateY(starAngleY - Math.PI / 4);
        mesh.rotateZ(starAngleZ - Math.PI / 4);
        mesh.scale.setScalar(starScale);
        mesh.material = starMaterial;
        mesh.material.uniforms.c.value = starIntensity;
        scene.add(mesh);
        starMeshList.push(mesh);
      }
    });
    shootingStarMeshList.push(starMeshList);
  }
}

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  material.emissive = new THREE.Color(0x222222);
  material.emissiveIntensity = Math.random() * 0.5;
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

function addBoxs() {
  for (let i = 0; i < boxNum; i++) {
    const boxSize = Math.random(2) + 1;
    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxColor = new THREE.Color(Math.random() * 0xffffff);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: boxColor });
    boxMaterial.emissive = boxColor;
    boxMaterial.emissiveIntensity = Math.random()*0.5;
    const box = new THREE.Mesh(boxGeometry, boxMaterial);

    box.position.x = 70 * (2.0 * Math.random() - 1.0);
    box.position.y = 50 * (2.0 * Math.random() - 1.0);
    box.position.z = 20 * (2.0 * Math.random());

    box.rotateX(2.0 * Math.PI * Math.random());
    box.rotateY(2.0 * Math.PI * Math.random());
    box.rotateZ(2.0 * Math.PI * Math.random());

    scene.add(box);
  }
}
