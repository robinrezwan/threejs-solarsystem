import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// Get canvas and window size ---------------------------------------------------------------------

const canvas = document.querySelector('.canvas');
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Set up Renderer --------------------------------------------------------------------------------

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(size.width, size.height);

// Set up Scene -----------------------------------------------------------------------------------

const scene = new THREE.Scene();
// scene.background = new THREE.Color('#fafafa');
// scene.overrideMaterial = new THREE.MeshBasicMaterial({color: "#5f5f5f"});

// Set grid helper an axes helper
// const gridHelper = new THREE.GridHelper(size.width * 2, 500);
// scene.add(gridHelper);
// const axesHelper = new THREE.AxesHelper(size.width * 2);
// scene.add(axesHelper);

// Set background of the scene
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
    '/textures/stars.jpg',
    '/textures/stars.jpg',
    '/textures/stars.jpg',
    '/textures/stars.jpg',
    '/textures/stars.jpg',
    '/textures/stars.jpg',
]);
scene.background = cubeTexture;

// Set up Camera ----------------------------------------------------------------------------------

const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000);

// Set orbit controls to move the camera around
const orbit = new OrbitControls(camera, canvas);
camera.position.set(0, 50, 200);
orbit.update();

// Setup Light ------------------------------------------------------------------------------------

const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
scene.add(pointLight);

// Set up Mesh ------------------------------------------------------------------------------------

// Load textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    sun: textureLoader.load('/textures/sun.jpg'),
    mercury: textureLoader.load('/textures/mercury.jpg'),
    venus: textureLoader.load('/textures/venus.jpg'),
    earth: textureLoader.load('/textures/earth.jpg'),
    mars: textureLoader.load('/textures/mars.jpg'),
    jupiter: textureLoader.load('/textures/jupiter.jpg'),
    saturn: textureLoader.load('/textures/saturn.jpg'),
    uranus: textureLoader.load('/textures/uranus.jpg'),
    neptune: textureLoader.load('/textures/neptune.jpg'),
    saturnRing: textureLoader.load('/textures/saturn_ring.png'),
    uranusRing: textureLoader.load('/textures/uranus_ring.png'),
};

// Set up solar system data
const sunData = {
    'radius': 15,
    'rotation': 0.0008,
    'texture': textures.sun,
};

const planetsData = {
    'mercury': {
        'radius': 2.8,
        'distance': 25,
        'rotation': 0.0038,
        'revolution': 0.02,
        'texture': textures.mercury,
    },
    'venus': {
        'radius': 4.8,
        'distance': 40,
        'rotation': -0.002,
        'revolution': 0.013,
        'texture': textures.venus,
    },
    'earth': {
        'radius': 5,
        'distance': 60,
        'rotation': 0.1571,
        'revolution': 0.009,
        'texture': textures.earth,
    },
    'mars': {
        'radius': 3.2,
        'distance': 75,
        'rotation': 0.0107,
        'revolution': 0.006,
        'texture': textures.mars,
    },
    'jupiter': {
        'radius': 9,
        'distance': 100,
        'rotation': 0.65,
        'revolution': 0.0057,
        'texture': textures.jupiter,
    },
    'saturn': {
        'radius': 7.6,
        'distance': 125,
        'rotation': 0.5568,
        'revolution': 0.0055,
        'texture': textures.saturn,
        'ring': {
            'innerRadius': 9,
            'outerRadius': 12,
            'rotation': 0.5,
            'texture': textures.saturnRing,
        }
    },
    'uranus': {
        'radius': 6.6,
        'distance': 145,
        'rotation': 0.0003,
        'revolution': 0.0053,
        'texture': textures.uranus,
        'ring': {
            'innerRadius': 8,
            'outerRadius': 10.5,
            'rotation': 0.0004,
            'texture': textures.uranusRing,
        }
    },
    'neptune': {
        'radius': 6,
        'distance': 165,
        'rotation': 0.0003,
        'revolution': 0.0051,
        'texture': textures.neptune,
    }
};

// Create Sun mesh
const sunGeometry = new THREE.SphereGeometry(sunData.radius, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({map: sunData.texture});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

// Function for creating planets
function createPlanet(data) {
    const planet = {};

    const planetGeometry = new THREE.SphereGeometry(data.radius, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({map: data.texture});
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.set(data.distance, 0, 0);
    const planetCenter = new THREE.Object3D();
    planetCenter.add(planetMesh);

    planet.mesh = planetMesh;
    planet.center = planetCenter;

    if (data.ring) {
        const ringGeometry = new THREE.RingGeometry(data.ring.innerRadius, data.ring.outerRadius, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({map: data.ring.texture, side: THREE.DoubleSide});
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        planetMesh.add(ringMesh);
        ringMesh.rotateX(Math.PI / 2);
        planet.ringMesh = ringMesh;
    }
    return planet;
}

// Create Planet meshes
const mercury = createPlanet(planetsData.mercury, textures.mercury);
const venus = createPlanet(planetsData.venus, textures.venus);
const earth = createPlanet(planetsData.earth, textures.earth);
const mars = createPlanet(planetsData.mars, textures.mars);
const jupiter = createPlanet(planetsData.jupiter, textures.jupiter);
const saturn = createPlanet(planetsData.saturn, textures.saturn);
const uranus = createPlanet(planetsData.uranus, textures.uranus);
const neptune = createPlanet(planetsData.neptune, textures.neptune);

// Add planets to the scene
scene.add(mercury.center);
scene.add(venus.center);
scene.add(earth.center);
scene.add(mars.center);
scene.add(jupiter.center);
scene.add(saturn.center);
scene.add(uranus.center);
scene.add(neptune.center);

// Set initial rotation of planets around the sun randomly
mercury.center.rotateY(Math.random() * 2 * Math.PI);
venus.center.rotateY(Math.random() * 2 * Math.PI);
earth.center.rotateY(Math.random() * 2 * Math.PI);
mars.center.rotateY(Math.random() * 2 * Math.PI);
jupiter.center.rotateY(Math.random() * 2 * Math.PI);
saturn.center.rotateY(Math.random() * 2 * Math.PI);
uranus.center.rotateY(Math.random() * 2 * Math.PI);
neptune.center.rotateY(Math.random() * 2 * Math.PI);

// Start animation --------------------------------------------------------------------------------

function animate() {
    // Rotate sun on its axis
    sunMesh.rotateY(sunData.rotation);

    // Rotate planets around the sun
    mercury.center.rotateY(planetsData.mercury.revolution);
    venus.center.rotateY(planetsData.venus.revolution);
    earth.center.rotateY(planetsData.earth.revolution);
    mars.center.rotateY(planetsData.mars.revolution);
    jupiter.center.rotateY(planetsData.jupiter.revolution);
    saturn.center.rotateY(planetsData.saturn.revolution);
    uranus.center.rotateY(planetsData.uranus.revolution);
    neptune.center.rotateY(planetsData.neptune.revolution);

    // Rotate planets on their axis
    mercury.mesh.rotateY(planetsData.mercury.rotation);
    venus.mesh.rotateY(planetsData.venus.rotation);
    earth.mesh.rotateY(planetsData.earth.rotation);
    mars.mesh.rotateY(planetsData.mars.rotation);
    jupiter.mesh.rotateY(planetsData.jupiter.rotation);
    saturn.mesh.rotateY(planetsData.saturn.rotation);
    uranus.mesh.rotateY(planetsData.uranus.rotation);
    neptune.mesh.rotateY(planetsData.neptune.rotation);

    // Render scene
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Set up event listeners -------------------------------------------------------------------------

window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
});
