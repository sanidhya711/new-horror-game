import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/PointerLockControls.js';
import { OBJLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/MTLLoader';
import { FBXLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader';
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

var scene,camera,renderer,controls,textureLoader,mixer,clock,raycaster,pointer,note,noteHighlight,previousX,previousZ;

var keyboard = {
    w: false,
    a: false,
    s: false,
    d: false
}

var moveSpeed = 1;
var ySpeed = 0;
var yIncrement = 0.15;

function init(){
    camera = new THREE.PerspectiveCamera(65,window.innerWidth/window.innerHeight,0.1,500);
    camera.position.y = 35;
    camera.position.z = -290;
    camera.position.x = -310;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000,5,200);
    controls = new PointerLockControls(camera,document.body);
    textureLoader = new THREE.TextureLoader();
    clock = new THREE.Clock();
}
function addFloor(){
    var texture = textureLoader.load('floor.jpg');
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

function addWalls(){
    var texture = textureLoader.load('floor.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8,1.2);
    var wallMaterial = new THREE.MeshLambertMaterial({side:THREE.DoubleSide,map: texture});
    var wallGeometry = new THREE.PlaneGeometry(750,100);

    var wallLeft = new THREE.Mesh(wallGeometry,wallMaterial);
    wallLeft.position.x = 375;
    wallLeft.position.y = 50;
    wallLeft.rotation.y = Math.PI/2
    
    var wallRight = new THREE.Mesh(wallGeometry,wallMaterial);
    wallRight.position.x = -375;
    wallRight.position.y = 50;
    wallRight.rotation.y = Math.PI/2;

    var wallFront = new THREE.Mesh(wallGeometry,wallMaterial);
    wallFront.position.z = -375;
    wallFront.position.y = 50;

    var wallBehind = new THREE.Mesh(wallGeometry,wallMaterial);
    wallBehind.position.z = 375;
    wallBehind.position.y = 50;

    scene.add(wallLeft);
    scene.add(wallRight);
    scene.add(wallFront);
    scene.add(wallBehind);
}

function addBed(){
    var loader = new OBJLoader();    
    var mtlLoader = new MTLLoader();

    mtlLoader.load("https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/3d%20assets/Bed.mtl",
        function(texture){
            loader.setMaterials(texture);
            loader.load("https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/3d%20assets/Bed.obj",
                function(bed){
                    bed.scale.set(11.85,12,12);
                    bed.position.x = -345;
                    bed.position.z = -339;
                    bed.rotation.y = Math.PI/2;
                    scene.add(bed)
                ;},
                function(xhr){},
                function(error){console.log( error);}
        );},
        function(xhr){},
        function(error){console.log( 'An error happened');}
    );
}

function addSecondBed(){
    var loader = new OBJLoader();    
    var mtlLoader = new MTLLoader();

    mtlLoader.load('https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/3d%20assets/Bed.mtl',
        function(texture){
            loader.setMaterials(texture);
            loader.load('https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/3d%20assets/Bed.obj',
                function(bed){
                    bed.scale.set(11.85,12,12);
                    bed.position.x = -265;
                    bed.position.z = -339;
                    bed.rotation.y = Math.PI/2;
                    var box = new THREE.Box3().setFromObject(bed);
                    console.log( box.min,box.max,);
                    scene.add(bed)
                ;},
                function(xhr){},
                function(error){console.log( error);}
        );},
        function(xhr){},
        function(error){console.log( 'An error happened');}
    );
}

function addCeiling(){
    var texture = textureLoader.load('floor.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8,8);
    var ceilingMaterial = new THREE.MeshLambertMaterial({side:THREE.DoubleSide,map: texture});
    var ceilingGeometry = new THREE.PlaneGeometry(750,750);
    var ceiling = new THREE.Mesh(ceilingGeometry,ceilingMaterial);
    ceiling.rotation.x = Math.PI/2;
    ceiling.position.y = 100;
    scene.add(ceiling);
}

function addPainting(){
    var paintingMaterial = new THREE.MeshLambertMaterial({map:textureLoader.load("https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/painting.jpg")});
    var paintingGeometry = new THREE.PlaneGeometry(37,47);
    var painting = new THREE.Mesh(paintingGeometry,paintingMaterial);
    painting.position.y = 50;
    painting.position.z = -374;
    painting.position.x = -305;
    scene.add(painting);
}

function ceilingLight(){
    const width = 10;
    const height = 10;
    const intensity = 10;
    const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight.position.set( 0, 50, 0 );
    rectLight.lookAt(0,0,0);
    scene.add(rectLight)
}

function addCurtains(){
    var gltfLoader = new GLTFLoader();
    gltfLoader.load("https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/hospital_curtain/scene.gltf",function(gltf){
        gltf.scene.scale.set(15,20,30);
        gltf.scene.position.x = -215;
        gltf.scene.position.z = -325;
        scene.add(gltf.scene);
    },function(){},
    function(err){console.log(err);});
}

function addSecondCurtains(){
    var gltfLoader = new GLTFLoader();
    gltfLoader.load("https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/hospital_curtain/scene.gltf",function(gltf){
        gltf.scene.scale.set(15,20,30);
        gltf.scene.position.x = -258.3;
        gltf.scene.position.z = -265;
        gltf.scene.rotation.y = Math.PI/2 + 0.3;
        scene.add(gltf.scene);
    },function(){},
    function(err){console.log(err);});
}

function addZombieModel(){
    var zombieLoader = new FBXLoader();
    zombieLoader.load("zombie.fbx",function(zombie){
        zombie.scale.setScalar(0.25);
        var animLoader = new FBXLoader();
        animLoader.load("walk.fbx",function(anim){
            mixer = new THREE.AnimationMixer(zombie);
            var walk = mixer.clipAction(anim.animations[0]);
            walk.play();
            scene.add(zombie);
        });
    });
}

function addNote(){
    var noteGeometry = new THREE.PlaneGeometry(10,6);
    var noteMaterial = new THREE.MeshLambertMaterial({map:textureLoader.load("https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/note.png"),transparent:true});
    note = new THREE.Mesh(noteGeometry,noteMaterial);
    note.position.z = -256.5;
    note.position.x = -287;
    note.position.y = 37;
    note.rotation.y = Math.PI + 0.3;
    scene.add(note);

    //hifghlight note on hover
    var noteHighlightMaterial = new THREE.MeshLambertMaterial({color:'red',transparent:true,opacity:0.5});
    var noteHighlightGeometry = new THREE.PlaneGeometry(10.7,6.7);
    noteHighlight = new THREE.Mesh(noteHighlightGeometry,noteHighlightMaterial);
    noteHighlight.position.z = -256.4;
    noteHighlight.position.x = -287;
    noteHighlight.position.y = 37;
    noteHighlight.rotation.y = Math.PI + 0.3;
    noteHighlight.visible = false;
    scene.add(noteHighlight);
}

function addRaycaster(){
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    pointer.x = 0.5 * 2 - 1;
	pointer.y = -1 * 0.5 * 2 + 1;
}

function raycasterHandler(){
    if(raycaster){
        raycaster.setFromCamera(pointer,camera);
        const intersects = raycaster.intersectObject(note)[0];
        if(intersects && intersects.distance < 35){
            noteHighlight.visible = true;
        }else{
            noteHighlight.visible = false;
        }
    }
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
    if(keyboard["w"] || keyboard["a"] || keyboard["s"] || keyboard["d"] && document.getElementById("footsteps").paused){
        document.getElementById("footsteps").play();
    }else if(!document.getElementById("footsteps").paused){
        document.getElementById("footsteps").pause();
    }

    camera.position.y = camera.position.y - ySpeed;

    if(camera.position.y > 35){
        ySpeed = ySpeed + yIncrement;
    }else{
        ySpeed = 0;
    }

    collisionHandler();
}

function collisionHandler(){
    //check walls
    if(camera.position.x < -360){
        camera.position.x = -360;
    }
    if(camera.position.x > 360){
        camera.position.x = 360;
    }
    if(camera.position.z < -360){
        camera.position.z = -360;
    }
    if(camera.position.z > 360){
        camera.position.z = 360;
    }

    //check first curtains
    if(camera.position.z < -275){
        if(camera.position.x > -225 && camera.position.x < -210 ){
            camera.position.x = previousX;
        }
    }

    if(camera.position.x > -220 && camera.position.x < -210 ){
        if(camera.position.z < -275){
            camera.position.z = previousZ;
        }
    }

    //check for bed 1
    if(camera.position.z < -303){
        if(camera.position.x > -360 && camera.position.x < -329 ){
            camera.position.x = previousX;
        }
    }

    if(camera.position.x > -360 && camera.position.x < -329 ){
        if(camera.position.z < -303){
            camera.position.z = previousZ;
        }
    }

    //check for bed 2
    if(camera.position.z < -303){
        if(camera.position.x > -280 && camera.position.x < -249 ){
            camera.position.x = previousX;
        }
    }

    if(camera.position.x > -280 && camera.position.x < -249 ){
        if(camera.position.z < -303){
            camera.position.z = previousZ;
        }
    }

    previousX = camera.position.x;
    previousZ = camera.position.z;
}

window.addEventListener("keydown",function(eve){
    if(eve.key==" " && ySpeed==0){
        document.getElementById("jumping").volume = 0.6;
        document.getElementById("jumping").currentTime = 0;
        document.getElementById("jumping").play();
        ySpeed = -2.7;
    }
    else if(eve.key=="w" || eve.key == "a" || eve.key=="s" || eve.key=="d"){
        keyboard[eve.key] = true;
    }
});
window.addEventListener("keyup",function(eve){
    keyboard[eve.key] = false;
});

function render(){
    renderer.render(scene,camera);
    moveHandler();
    raycasterHandler();
    if(mixer){
        var delta = clock.getDelta();
        mixer.update(delta);
    }
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
        document.getElementById("bg-music").volume = 0.7;
        document.getElementById("zombies").play();
        document.getElementById("zombies").volume = 0.025;
    }
    controls.lock();
});

init();
addFloor();
addWalls();
addCeiling();
addLights();
addBed();
addSecondBed();
addPainting();
// ceilingLight();
addCurtains();
addSecondCurtains();
addZombieModel();
addRaycaster();
addNote();
render();

window.addEventListener("resize",resize);
