import * as THREE from 'three';

import TWEEN from 'three/addons/libs/tween.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const table = [
    'H', 'Hydrogen', '1.00794', 1, 1,
    'He', 'Helium', '4.002602', 18, 1,
    'Li', 'Lithium', '6.941', 1, 2,
    'Be', 'Beryllium', '9.012182', 2, 2,
    'B', 'Boron', '10.811', 13, 2,
    'C', 'Carbon', '12.0107', 14, 2,
    'N', 'Nitrogen', '14.0067', 15, 2,
    'O', 'Oxygen', '15.9994', 16, 2,
    'F', 'Fluorine', '18.9984032', 17, 2,
    'Ne', 'Neon', '20.1797', 18, 2,
    'Na', 'Sodium', '22.98976...', 1, 3,
    'Mg', 'Magnesium', '24.305', 2, 3,
    'Al', 'Aluminium', '26.9815386', 13, 3,
    'Si', 'Silicon', '28.0855', 14, 3,
    'P', 'Phosphorus', '30.973762', 15, 3,
    'S', 'Sulfur', '32.065', 16, 3,
    'Cl', 'Chlorine', '35.453', 17, 3,
    'Ar', 'Argon', '39.948', 18, 3,
    'K', 'Potassium', '39.948', 1, 4,
    'Ca', 'Calcium', '40.078', 2, 4,
    'Sc', 'Scandium', '44.955912', 3, 4,
    'Ti', 'Titanium', '47.867', 4, 4,
    'V', 'Vanadium', '50.9415', 5, 4,
    'Cr', 'Chromium', '51.9961', 6, 4,
    'Mn', 'Manganese', '54.938045', 7, 4,
    'Fe', 'Iron', '55.845', 8, 4,
    'Co', 'Cobalt', '58.933195', 9, 4,
    'Ni', 'Nickel', '58.6934', 10, 4,
    'Cu', 'Copper', '63.546', 11, 4,
    'Zn', 'Zinc', '65.38', 12, 4,
    'Ga', 'Gallium', '69.723', 13, 4,
    'Ge', 'Germanium', '72.63', 14, 4,
    'As', 'Arsenic', '74.9216', 15, 4,
    'Se', 'Selenium', '78.96', 16, 4,
    'Br', 'Bromine', '79.904', 17, 4,
    'Kr', 'Krypton', '83.798', 18, 4,
    'Rb', 'Rubidium', '85.4678', 1, 5,
    'Sr', 'Strontium', '87.62', 2, 5,
    'Y', 'Yttrium', '88.90585', 3, 5,
    'Zr', 'Zirconium', '91.224', 4, 5,
    'Nb', 'Niobium', '92.90628', 5, 5,
    'Mo', 'Molybdenum', '95.96', 6, 5,
    'Tc', 'Technetium', '(98)', 7, 5,
    'Ru', 'Ruthenium', '101.07', 8, 5,
    'Rh', 'Rhodium', '102.9055', 9, 5,
    'Pd', 'Palladium', '106.42', 10, 5,
    'Ag', 'Silver', '107.8682', 11, 5,
    'Cd', 'Cadmium', '112.411', 12, 5,
    'In', 'Indium', '114.818', 13, 5,
    'Sn', 'Tin', '118.71', 14, 5,
    'Sb', 'Antimony', '121.76', 15, 5,
    'Te', 'Tellurium', '127.6', 16, 5,
    'I', 'Iodine', '126.90447', 17, 5,
    'Xe', 'Xenon', '131.293', 18, 5,
    'Cs', 'Caesium', '132.9054', 1, 6,
    'Ba', 'Barium', '132.9054', 2, 6,
    'La', 'Lanthanum', '138.90547', 4, 9,
    'Ce', 'Cerium', '140.116', 5, 9,
    'Pr', 'Praseodymium', '140.90765', 6, 9,
    'Nd', 'Neodymium', '144.242', 7, 9,
    'Pm', 'Promethium', '(145)', 8, 9,
    'Sm', 'Samarium', '150.36', 9, 9,
    'Eu', 'Europium', '151.964', 10, 9,
    'Gd', 'Gadolinium', '157.25', 11, 9,
    'Tb', 'Terbium', '158.92535', 12, 9,
    'Dy', 'Dysprosium', '162.5', 13, 9,
    'Ho', 'Holmium', '164.93032', 14, 9,
    'Er', 'Erbium', '167.259', 15, 9,
    'Tm', 'Thulium', '168.93421', 16, 9,
    'Yb', 'Ytterbium', '173.054', 17, 9,
    'Lu', 'Lutetium', '174.9668', 18, 9,
    'Hf', 'Hafnium', '178.49', 4, 6,
    'Ta', 'Tantalum', '180.94788', 5, 6,
    'W', 'Tungsten', '183.84', 6, 6,
    'Re', 'Rhenium', '186.207', 7, 6,
    'Os', 'Osmium', '190.23', 8, 6,
    'Ir', 'Iridium', '192.217', 9, 6,
    'Pt', 'Platinum', '195.084', 10, 6,
    'Au', 'Gold', '196.966569', 11, 6,
    'Hg', 'Mercury', '200.59', 12, 6,
    'Tl', 'Thallium', '204.3833', 13, 6,
    'Pb', 'Lead', '207.2', 14, 6,
    'Bi', 'Bismuth', '208.9804', 15, 6,
    'Po', 'Polonium', '(209)', 16, 6,
    'At', 'Astatine', '(210)', 17, 6,
    'Rn', 'Radon', '(222)', 18, 6,
    'Fr', 'Francium', '(223)', 1, 7,
    'Ra', 'Radium', '(226)', 2, 7,
    'Ac', 'Actinium', '(227)', 4, 10,
    'Th', 'Thorium', '232.03806', 5, 10,
    'Pa', 'Protactinium', '231.0588', 6, 10,
    'U', 'Uranium', '238.02891', 7, 10,
    'Np', 'Neptunium', '(237)', 8, 10,
    'Pu', 'Plutonium', '(244)', 9, 10,
    'Am', 'Americium', '(243)', 10, 10,
    'Cm', 'Curium', '(247)', 11, 10,
    'Bk', 'Berkelium', '(247)', 12, 10,
    'Cf', 'Californium', '(251)', 13, 10,
    'Es', 'Einstenium', '(252)', 14, 10,
    'Fm', 'Fermium', '(257)', 15, 10,
    'Md', 'Mendelevium', '(258)', 16, 10,
    'No', 'Nobelium', '(259)', 17, 10,
    'Lr', 'Lawrencium', '(262)', 18, 10,
    'Rf', 'Rutherfordium', '(267)', 4, 7,
    'Db', 'Dubnium', '(268)', 5, 7,
    'Sg', 'Seaborgium', '(271)', 6, 7,
    'Bh', 'Bohrium', '(272)', 7, 7,
    'Hs', 'Hassium', '(270)', 8, 7,
    'Mt', 'Meitnerium', '(276)', 9, 7,
    'Ds', 'Darmstadtium', '(281)', 10, 7,
    'Rg', 'Roentgenium', '(280)', 11, 7,
    'Cn', 'Copernicium', '(285)', 12, 7,
    'Nh', 'Nihonium', '(286)', 13, 7,
    'Fl', 'Flerovium', '(289)', 14, 7,
    'Mc', 'Moscovium', '(290)', 15, 7,
    'Lv', 'Livermorium', '(293)', 16, 7,
    'Ts', 'Tennessine', '(294)', 17, 7,
    'Og', 'Oganesson', '(294)', 18, 7
];

let camera, scene, renderer, glRenderer, loader, mixer, clock, currentAtomModel;
let controls;

const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

const cameraInitPosition = {x: 0, y: 0, z: 3000};
const controlInitTarget = {x: 0, y: 0, z: 0};
const atomPosition = {x: 3000, y: 3000, z: 1000};
const highlighTargetPosition = atomPosition;
const highlighCameraPosition = {x: atomPosition.x - 500, y:atomPosition.y - 500, z: atomPosition.z + 1000}

function removeAtomModel() {
    let atomModel = scene.getObjectByName('atomModel');
    if (atomModel !== undefined) {
        scene.remove(atomModel);
    }
}
function setCameraControl(cameraPosition, controlTarget) {
    new TWEEN.Tween( camera.position )
        .to(cameraPosition, 3000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()

    new TWEEN.Tween( controls.target )
        .to(controlTarget, 3000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()

    new TWEEN.Tween( this )
        .to( {}, 2000*2)
        .onUpdate( render )
        .onComplete(controls.update)
        .start();

    camera.updateProjectionMatrix();
    controls.update();
}

function addAtomModel(gltf){
    gltf.scene.animations = gltf.animations;
    gltf.scene.scale.set(1000, 1000, 1000);
    gltf.scene.position.set(atomPosition.x, atomPosition.y, atomPosition.z);
    gltf.scene.rotation.x += 0.5;
    gltf.scene.rotation.z += 0.5;

    removeAtomModel();

    gltf.scene.name = 'atomModel';
    scene.add(gltf.scene);
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction(gltf.scene.animations[0]).play();

    render();
    animate();
}

function setUpLights(){
    const light1 = new THREE.SpotLight();
    light1.position.set(atomPosition.x + 500, atomPosition.y + 500, atomPosition.z);
    light1.target.position.set(atomPosition.x, atomPosition.y, atomPosition.z);
    light1.target.updateMatrixWorld();
    scene.add(light1);

    const light2 = new THREE.SpotLight();
    light2.position.set(atomPosition.x - 500, atomPosition.y - 500, atomPosition.z);
    light2.target.position.set(atomPosition.x, atomPosition.y, atomPosition.z);
    light2.target.updateMatrixWorld();
    scene.add(light2);

    const light3 = new THREE.SpotLight();
    light3.position.set(atomPosition.x + 500, atomPosition.y - 500, atomPosition.z);
    light3.target.position.set(atomPosition.x, atomPosition.y, atomPosition.z);
    light3.target.updateMatrixWorld();
    scene.add(light3);

    const light4 = new THREE.SpotLight();
    light4.position.set(atomPosition.x - 500, atomPosition.y + 500, atomPosition.z);
    light4.target.position.set(atomPosition.x, atomPosition.y, atomPosition.z);
    light4.target.updateMatrixWorld();
    scene.add(light4);
}

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(cameraInitPosition.x, cameraInitPosition.y, cameraInitPosition.z);

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(1000));

    loader = new GLTFLoader();
    clock = new THREE.Clock();

    renderer = new CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector( '#css' ).appendChild( renderer.domElement );

    glRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector( '#webgl' ).appendChild( glRenderer.domElement );

    controls = new TrackballControls( camera, renderer.domElement );

    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener( 'change', render );

    setUpLights();

    // table

    for ( let i = 0; i < table.length; i += 5 ) {

        const element = document.createElement( 'div' );
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,0.5)';

        const number = document.createElement( 'div' );
        number.className = 'number';
        number.textContent = ( i / 5 ) + 1;
        element.appendChild( number );

        const symbol = document.createElement( 'div' );
        symbol.className = 'symbol';
        symbol.textContent = table[ i ];
        element.appendChild( symbol );

        const details = document.createElement( 'div' );
        details.className = 'details';
        details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
        element.appendChild( details );

        const objectCSS = new CSS3DObject( element );
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;

        objectCSS.element.addEventListener('mousedown', function () {

            let name = String(( i / 5 ) + 1);
            while (name.length !== 3){
                name = '0' + name;
            }
            name += '_' + table[ i + 1 ].toLowerCase();

            loader.load(`https://storage.googleapis.com/search-ar-edu/periodic-table/element_${name}/element_${name}.glb`,
                function (gltf) {
                    addAtomModel(gltf);
                    setCameraControl(highlighCameraPosition, highlighTargetPosition);

                    const menu = document.getElementById('menu');
                    const button = document.createElement( 'button' );
                    const buttonElement = menu.appendChild(button);
                    buttonElement.id = 'close';
                    buttonElement.textContent = 'X';
                    buttonElement.addEventListener('click', function () {
                        setCameraControl(cameraInitPosition, controlInitTarget);
                        buttonElement.remove();
                    });

                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            );
        });

        objectCSS.element.addEventListener('mouseenter', function () {

            new TWEEN.Tween( objectCSS.position )
                .to({z: 100}, 200)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start()

            new TWEEN.Tween( objectCSS.scale )
                .to({x: 2, y:2}, 200)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start()

            new TWEEN.Tween( this )
                .to( {}, 200)
                .onUpdate( render )
                .start();

            objectCSS.element.style.backgroundColor = 'rgba(0,127,127,1)';
        });

        objectCSS.element.addEventListener('mouseleave', function () {

            new TWEEN.Tween( objectCSS.scale )
                .to({x: 1, y:1}, 200)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start()

            new TWEEN.Tween( objectCSS.position )
                .to({z: 0}, 200)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start()

            new TWEEN.Tween( this )
                .to( {}, 200)
                .onUpdate( render )
                .start();

            objectCSS.element.style.backgroundColor = 'rgba(0,127,127,0.5)';
        });

        scene.add( objectCSS );
        objects.push( objectCSS );

        const object = new THREE.Object3D();
        object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
        object.position.y = - ( table[ i + 4 ] * 180 ) + 990;

        targets.table.push( object );

    }

    transform( targets.table, 2000 );

    window.addEventListener( 'resize', onWindowResize );

}

function transform( targets, duration ) {

    TWEEN.removeAll();

    for ( let i = 0; i < objects.length; i ++ ) {

        const object = objects[ i ];
        const target = targets[ i ];

        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

    }

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( render )
        .start();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function animate() {

    if (mixer !== undefined){
        const delta = clock.getDelta();
        mixer.update(delta);
    }

    TWEEN.update();
    controls.update();

    scene.updateMatrixWorld();
    requestAnimationFrame( animate );

    // TODO: check if any WebJL objects in view
    glRenderer.render( scene, camera );
}

function render() {

    glRenderer.render( scene, camera );
    renderer.render( scene, camera );
}
