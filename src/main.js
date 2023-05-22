import * as THREE from 'three';

import TWEEN from 'three/addons/libs/tween.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { elementsTable } from '/public/periodicTable.json';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let camera, scene, renderer, glRenderer, loader, mixer, clock;
let controls;

const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

const cameraInitPosition = {x: 0, y: 0, z: 3000};
const controlInitTarget = {x: 0, y: 0, z: 0};
const atomPosition = {x: 3000, y: 3000, z: 1000};
const highlightTargetPosition = {x: atomPosition.x * 1.30, y:atomPosition.y, z: atomPosition.z}; //atomPosition;
const highlightCameraPosition = {x: atomPosition.x * 1.30, y:atomPosition.y, z: atomPosition.z * 3};

function removeElementModel() {
    let elementModel = scene.getObjectByName('elementModel');
    if (elementModel !== undefined) {
        scene.remove(elementModel);
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

function addElementModel(gltf){
    gltf.scene.animations = gltf.animations;
    gltf.scene.scale.set(1000, 1000, 1000);
    gltf.scene.position.set(atomPosition.x, atomPosition.y, atomPosition.z);
    gltf.scene.rotation.x += 0.25;
    gltf.scene.rotation.z += 0.75;

    removeElementModel();

    gltf.scene.name = 'elementModel';
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

function addElementCard(el){
    removeElementCard();

    const elementCard = document.createElement( 'div' );
    elementCard.className = 'elementCard';
    elementCard.style.backgroundColor = 'rgba(0,127,127,0.5)';

    const title = document.createElement( 'div' );
    title.className = 'titleBox';
    title.textContent = el.name + ', ' + el.symbol;
    elementCard.appendChild( title );

    const imgBox = document.createElement( 'img' );
    imgBox.className = 'imgBox';
    imgBox.src = el.image.url;
    // imgBox.src = ;
    elementCard.appendChild( imgBox );

    const imgCaption = document.createElement( 'div' );
    imgCaption.className = 'imgCaption';
    imgCaption.textContent = el.image.title + '\n' + el.image.attribution;
    elementCard.appendChild( imgCaption );

    const infoBox = document.createElement( 'div' );
    infoBox.className = 'infoBox';
    infoBox.innerHTML = el.summary;
    elementCard.appendChild( infoBox );

    const objectCSS = new CSS3DObject( elementCard );
    objectCSS.position.x = highlightTargetPosition.x * 1.05;
    objectCSS.position.y = highlightTargetPosition.y;
    objectCSS.position.z = highlightTargetPosition.z;
    objectCSS.position.z = highlightTargetPosition.z;

    objectCSS.name = 'elementCard';
    return objectCSS;
}

function removeElementCard(){
    let elementCard = scene.getObjectByName('elementCard');
    if (elementCard !== undefined) {
        scene.remove(elementCard);
    }
}

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    // const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2,
    //     window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
    camera.position.set(cameraInitPosition.x, cameraInitPosition.y, cameraInitPosition.z);

    scene = new THREE.Scene();

    loader = new GLTFLoader();
    clock = new THREE.Clock();

    renderer = new CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector( '#css' ).appendChild( renderer.domElement );

    glRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector( '#webgl' ).appendChild( glRenderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );

    controls.minDistance = 500;
    controls.maxDistance = 6000;

    controls.minAzimuthAngle = -0.1;
    controls.maxAzimuthAngle = 0.1;

    controls.minPolarAngle = Math.PI / 2 - 0.1;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;

    controls.addEventListener( 'change', render );

    setUpLights();

    // table

    for ( const el of elementsTable) {

        const element = document.createElement( 'div' );
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,0.5)';

        const number = document.createElement( 'div' );
        number.className = 'number';
        number.textContent = el.number;
        element.appendChild( number );

        const symbol = document.createElement( 'div' );
        symbol.className = 'symbol';
        symbol.textContent = el.symbol;
        element.appendChild( symbol );

        const details = document.createElement( 'div' );
        details.className = 'details';
        details.innerHTML = el.name + '<br>' + el.atomic_mass; //table[ i + 1 ] + '<br>' + table[ i + 2 ];
        element.appendChild( details );

        const objectCSS = new CSS3DObject( element );
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;

        objectCSS.element.addEventListener('mousedown', function () {

            loader.load(el.bohr_model_3d,
                function (gltf) {
                    addElementModel(gltf);
                    setCameraControl(highlightCameraPosition, highlightTargetPosition);
                    const elementCard = addElementCard(el);
                    scene.add( elementCard );

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
        object.position.x = ( el.xpos * 140 ) - 1330;
        object.position.y = - ( el.ypos * 180 ) + 990;

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

    glRenderer.setSize( window.innerWidth, window.innerHeight )
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
