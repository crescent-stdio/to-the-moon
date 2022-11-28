import * as THREE from 'three';
import { VOXLoader, VOXMesh } from 'three/addons/loaders/VOXLoader.js';

import shootingStarVOXModel from '../../assets/models/shooting_star.vox';

const isMobile = window.innerWidth < 768;
const crescentRatio = isMobile ? 80 : 40;
const crescentScale = isMobile ? 1 : 1.25;

let camera, scene, renderer;
let controls;
const clock = new THREE.Clock();
const boxNum = 30;
const shootingStarNum = 7;
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
    canvas: document.querySelector('#star-field'),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  // set scene
  scene = new THREE.Scene();

  // set background
  scene.background = new THREE.Color(0x222222);

  loadModels();
  // const pointLight = new THREE.PointLight(0x999999, 1, 1000);
  // pointLight.position.set(0, 0, 500);
  const ambientLight = new THREE.AmbientLight(0x999999);
  // scene.add(pointLight, ambientLight);
  // scene.add(pointLight);
  scene.add(ambientLight);
  Array(250).fill().forEach(addStar);

  document.body.onscroll = moveCamera;
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
  for (const starMeshList of shootingStarMeshList) {
    for (const starMesh of starMeshList) {
      // move the shooting star from the star's rotation(euler angle)
      // calculate eular angle to main axis vector
      const direction = new THREE.Vector3(-1, -1, 1);
      direction.applyQuaternion(starMesh.quaternion);
      starMesh.position.addScaledVector(direction, Math.random(10) + 1);

      // var arrow = new THREE.ArrowHelper(direction, starMesh.position, 1, 0xffff00);
      // scene.add(arrow);
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

  const starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      s: { type: 'f', value: 1000.0 },
      b: { type: 'f', value: 10.0 },
      p: { type: 'f', value: 20000.0 },
      glowColor: { type: 'c', value: new THREE.Color(0xfde047) },
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
        mesh.rotation.set(0, -Math.PI / 4, -Math.PI / 4);
        mesh.rotateX(starAngleX);
        mesh.rotateY(starAngleY);
        mesh.rotateZ(starAngleZ);
        mesh.scale.setScalar(starScale);
        mesh.material = starMaterial;
        // mesh.material.uniforms.s.value = starIntensity;
        // mesh.material.uniforms.glowColor.value = new THREE.Color(Math.random() * 0xfde047);
        scene.add(mesh);
        starMeshList.push(mesh);
        // mesh.updateProjectionMatrix();
      }
    });
    shootingStarMeshList.push(starMeshList);
  }
}

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  // const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  // material.emissive = new THREE.Color(0x222222);
  // material.emissiveIntensity = Math.random() * 0.5;
  const colorValue = Math.random()*0.8;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      s: { type: 'f', value: 0.0 },
      b: { type: 'f', value: 0.0 },
      p: { type: 'f', value: -1.0 },
      glowColor: { type: 'c', value: new THREE.Color(colorValue, colorValue, colorValue) },
    },
    fragmentShader: document.getElementById('fragmentShader').textContent,
    vertexShader: document.getElementById('vertexShader').textContent,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
