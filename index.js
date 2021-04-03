import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/PointerLockControls.js';

var scene,camera,renderer,controls,loader;

var keyboard = {
    w: false,
    a: false,
    s: false,
    d: false
}

var moveSpeed = 1;

function init(){
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,500);
    camera.position.y = 35;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000,5,225);
    controls = new PointerLockControls(camera,document.body);
    loader = new THREE.TextureLoader();
}
function addFloor(){
    var texture = loader.load('floor.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8,8);
    var floorMaterial = new THREE.MeshLambertMaterial({side:THREE.DoubleSide,map: texture});
    var floorGeometry = new THREE.PlaneGeometry(750,750);
    var floor = new THREE.Mesh(floorGeometry,floorMaterial);
    floor.rotation.x = Math.PI/2;
    scene.add(floor);
}
function addLights(){
    var light = new THREE.AmbientLight(0xFFFFFF,0.5);
    scene.add(light);
}
function moveHandler(){
    if(keyboard["w"]){
        controls.moveForward(moveSpeed);
    }
    if(keyboard["a"]){
        controls.moveRight(-1*moveSpeed);
    }
    if(keyboard["s"]){
        controls.moveForward(-1*moveSpeed);
    }
    if(keyboard["d"]){
        controls.moveRight(moveSpeed);
    }
    if(keyboard["w"] || keyboard["a"] || keyboard["s"] || keyboard["d"]){
        document.getElementById("footsteps").play();
        document.getElementById("footsteps").volume = 0.8;
    }else{
        document.getElementById("footsteps").pause();
    }
}

window.addEventListener("keydown",function(eve){
    keyboard[eve.key] = true;
});
window.addEventListener("keyup",function(eve){
    keyboard[eve.key] = false;
});

function render(){
    renderer.render(scene,camera);
    moveHandler();
    requestAnimationFrame(render);
}

function resize(){
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}

var first = true;

document.addEventListener("click",function(){
    if(first){
        first = false;
        document.getElementById("bg-music").play();
        document.getElementById("bg-music").volume = 0.45;
    }
    controls.lock();
});

init();
addFloor();
addLights();
render();

window.addEventListener("resize",resize);
