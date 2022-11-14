import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module';
import { GUI } from 'three/addons/libs/lil-gui.module.min';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Water } from 'three/examples/jsm/objects/Water';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils';

let container, stats;

let camera, scene, renderer;
let controls;
let sun = new THREE.Vector3();
let water;
const clock = new THREE.Clock();
let sunX = 100;
let sunY = 1000;
let sunZ = 200;

const pickingData = [];
let highlightBox;
const pointer = new THREE.Vector2();
let pickingTexture, pickingScene;
const offset = new THREE.Vector3(10, 10, 10);

init();
animate();

function init() {
  container = document.getElementById('canvas');
  document.body.appendChild(container);

  // camera

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
  // camera.position.z = 250;
  camera.position.set(30, 30, 100);

  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
  scene.fog = new THREE.Fog(scene.background, 3500, 15000);

  // world
  pickingScene = new THREE.Scene();
  pickingTexture = new THREE.WebGLRenderTarget(1, 1);
  const pickingMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
  const defaultMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
    vertexColors: true,
    shininess: 0,
  });

  const s = 200;

  let geometry = new THREE.BoxGeometry(s, s, s);
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 50 });

  const geometriesDrawn = [];
  const geometriesPicking = [];

  for (let i = 0; i < 3000; i++) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;

    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    scene.add(mesh);

    geometriesDrawn.push(geometry);
    geometry = geometry.clone();
    geometriesPicking.push(geometry);

    pickingData[i] = {
      position: mesh.position,
      rotation: mesh.rotation,
      scale: s,
    };
  }
  const objects = new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(geometriesDrawn), defaultMaterial);
  scene.add(objects);
  pickingScene.add(new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(geometriesPicking), pickingMaterial));

  highlightBox = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshLambertMaterial({ color: 0xffff00 }));
  scene.add(highlightBox);

  // lights

  // const dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
  // dirLight.position.set(0, -1, 0).normalize();
  // dirLight.color.setHSL(0.1, 0.7, 0.5);
  // scene.add(dirLight);

  makeWater();
  makeSun();

  // lensflares
  const textureLoader = new THREE.TextureLoader();

  const textureFlare0 = textureLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/lensflare/lensflare0.png',
  );
  const textureFlare3 = textureLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/lensflare/lensflare3.png',
  );

  // addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
  // addLight(0.08, 0.8, 0.5, 0, 0, -1000);
  // addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);
  addLight(0.995, 0.5, 0.9, sunX, sunY, sunZ);

  function addLight(h, s, l, x, y, z) {
    const light = new THREE.PointLight(0xffff00, 1.5, 2000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);

    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    light.add(lensflare);
  }

  //

  controls = new FlyControls(camera, renderer.domElement);

  controls.movementSpeed = 2500;
  controls.domElement = container;
  controls.rollSpeed = Math.PI / 6;
  controls.autoForward = false;
  controls.dragToLook = true;
  // controls = new TrackballControls(camera, renderer.domElement);
  // controls.rotateSpeed = 1.0;
  // controls.zoomSpeed = 1.2;
  // controls.panSpeed = 0.8;
  // controls.noZoom = false;
  // controls.noPan = false;
  // controls.staticMoving = true;
  // controls.dynamicDampingFactor = 0.3;

  // stats

  stats = new Stats();
  container.appendChild(stats.dom);
  renderer.domElement.addEventListener('pointermove', onPointerMove);

  // events
  window.addEventListener('resize', onWindowResize);
}

//

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  const delta = clock.getDelta();
  controls.update(delta);
  pick();
  water.material.uniforms['time'].value += 1.0 / 60.0;
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
}

function makeSun() {
  // Skybox

  const sky = new Sky();
  sky.scale.setScalar(20000);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;

  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180,
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  let renderTarget;

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    sunX = 400 * Math.cos(phi) * Math.cos(theta);
    sunY = 400 * Math.sin(phi);
    sunZ = 400 * Math.cos(phi) * Math.sin(theta);
    // const phi = Math.atan2(sunY, sunX);
    // const theta = Math.acos(sunZ / Math.sqrt(sunX * sunX + sunY * sunY + sunZ * sunZ));

    sun.setFromSphericalCoords(1, phi, theta);
    // const sunPosition = new THREE.Vector3({sunX, sunY, sunZ});

    sky.material.uniforms['sunPosition'].value.copy(sun);

    if (renderTarget !== undefined) renderTarget.dispose();

    renderTarget = pmremGenerator.fromScene(sky);

    scene.environment = renderTarget.texture;
  }

  updateSun();

  //
}

function makeWater() {
  // Water

  const waterGeometry = new THREE.PlaneGeometry(100000, 100000);

  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/waternormals.jpg',
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      },
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;

  scene.add(water);
}

function onPointerMove(e) {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
}

function pick() {
  //render the picking scene off-screen

  // set the view offset to represent just a single pixel under the mouse

  camera.setViewOffset(
    renderer.domElement.width,
    renderer.domElement.height,
    (pointer.x * window.devicePixelRatio) | 0,
    (pointer.y * window.devicePixelRatio) | 0,
    1,
    1,
  );

  // render the scene

  renderer.setRenderTarget(pickingTexture);
  renderer.render(pickingScene, camera);

  // clear the view offset so rendering returns to normal

  camera.clearViewOffset();

  //create buffer for reading single pixel

  const pixelBuffer = new Uint8Array(4);

  //read the pixel

  renderer.readRenderTargetPixels(pickingTexture, 0, 0, 1, 1, pixelBuffer);

  //interpret the pixel as an ID

  const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];
  const data = pickingData[id];

  if (data) {
    //move our highlightBox so that it surrounds the picked object

    if (data.position && data.rotation && data.scale) {
      highlightBox.position.copy(data.position);
      highlightBox.rotation.copy(data.rotation);
      highlightBox.scale.copy(data.scale).add(offset);
      highlightBox.visible = true;
    }
  } else {
    highlightBox.visible = false;
  }
}
