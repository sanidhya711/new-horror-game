import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/PointerLockControls.js';
import { OBJLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/MTLLoader';
import { FBXLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader';
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

var scene,camera,renderer,controls,textureLoader,mixer,clock,raycaster,pointer,note,noteHighlight,axeGlobal,previousX,previousZ,canPickUpAxe,zombieGlobal,axeInHand,axeAnimationRunning,onHighGround,canGetInCar,driving,carGlobal;

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
    camera.position.z = 700;
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
    // scene.add(wallBehind);
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
        zombieGlobal = zombie;
        zombie.scale.setScalar(0.25);
        var animLoader = new FBXLoader();
        animLoader.load("walk.fbx",function(anim){
            mixer = new THREE.AnimationMixer(zombie);
            var walk = mixer.clipAction(anim.animations[0]);
            walk.play();
            scene.add(zombie);
            addZombieAudio();
        });
    });
}

function addZombieAudio(){
    const listener = new THREE.AudioListener();
    camera.add( listener );
    const sound = new THREE.PositionalAudio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/zombies.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setRefDistance(15);
        sound.play();
    });
    zombieGlobal.add(sound);
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
    var noteHighlightMaterial = new THREE.MeshLambertMaterial({color:'white',transparent:true,opacity:0.5});
    var noteHighlightGeometry = new THREE.PlaneGeometry(10.7,6.7);
    noteHighlight = new THREE.Mesh(noteHighlightGeometry,noteHighlightMaterial);
    noteHighlight.position.z = -256.4;
    noteHighlight.position.x = -287;
    noteHighlight.position.y = 37;
    noteHighlight.rotation.y = Math.PI + 0.3;
    noteHighlight.visible = false;
    scene.add(noteHighlight);
}

function addAxe(){
    var loader = new GLTFLoader();
    loader.load("https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/axe/scene.gltf",(axeGroup) => {
        axeGlobal = axeGroup.scene.children[0];
        var axe = axeGroup.scene.children[0];
        axe.position.z = -285;
        axe.position.x = -368;
        axe.position.y = 32;
        axe.scale.setScalar(12);
        axe.rotation.x = Math.PI/2;
        axe.rotation.y = 2;
        axe.rotation.z = -1*(Math.PI/2 -0.1);
        scene.add(axe);
    });
}

function handleAxeInHand(){
    if(axeInHand && !axeAnimationRunning){
        axeGlobal.position.copy(camera.position);
        axeGlobal.translateZ(-10);
        axeGlobal.translateX(8);
        axeGlobal.translateY(-9);


        var originalVector =  camera.rotation.toVector3();
        originalVector.z = originalVector.z - 0.1;
        var newEuler = new THREE.Euler();
        newEuler.setFromVector3(originalVector);
        axeGlobal.rotation.copy(newEuler);
    }
}

function pickupAxe(){
    if(canPickUpAxe){
        axeInHand = true;
        window.addEventListener("mousedown",handleAxeSwing)
    }
}

function zombieMovement(){
    
}

function addGrass(){
    textureLoader.load("https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/grass.jpg",(texture)=>{
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(8,8);
        var grassMaterial = new THREE.MeshLambertMaterial({map:texture,side:THREE.DoubleSide});
        var grassGeometry = new THREE.PlaneGeometry(750,750);
        var grass = new THREE.Mesh(grassGeometry,grassMaterial);
        grass.position.z  = 750;
        grass.rotation.x = Math.PI/2;
        scene.add(grass);
    });
}

function addCar(){
    var loader = new GLTFLoader();
    loader.load("https://raw.githubusercontent.com/sanidhya711/new-horror-game/master/car/scene.gltf",(car)=>{
        carGlobal = car.scene;
        car.scene.scale.setScalar(0.2);
        car.scene.position.z = 800;
        car.scene.position.y = 1;
        scene.add(car.scene);
    });
}

function handleEnterCar(){
    if(!driving){
        if(camera.position.z < 880 && camera.position.z > 700){
            if(camera.position.x > -60 && camera.position.x < 50){
                if(!driving){
                    canGetInCar = true;
                    document.getElementById("messages").innerText="press f to enter car";
                    document.getElementById("messages").style.display = "inline-block";
                }
            }else{
                canGetInCar = false;
            }
        }
    }
}

function getInCar(){
    if(canGetInCar){
        canGetInCar = false;
        camera.position.y = 100;
        camera.position.z = camera.position.z -100;
        camera.position.x = 0;
        driving = true;
        document.getElementById("messages").innerText="press f to exit car";
        document.getElementById("messages").style.display = "inline-block";
    }
}

function exitCar(){
    if(driving){
        camera.position.y = 35;
        camera.position.z = carGlobal.position.z;
        camera.position.x = carGlobal.position.x;
        camera.rotation.copy(carGlobal.rotation);
        camera.rotation.y = carGlobal.rotation.y + Math.PI;
        camera.translateX(50);
        driving = false;
    }
}

var startPosition,finalPosition,startRotation,finalRotation;
var animationClock;

function handleAxeSwing(eve){
    if(eve.button == 0 && !axeAnimationRunning){
        axeAnimationRunning = true;

        startPosition = new THREE.Vector3();
        startPosition.copy(axeGlobal.position);
        
        var vectorRotation = axeGlobal.rotation.toVector3();
        startRotation = new THREE.Vector3();
        startRotation.copy(vectorRotation);

        finalPosition = new THREE.Vector3();   
        finalPosition.copy(axeGlobal.position);     
        finalPosition.x = finalPosition.x - 25;
        finalPosition.y  = finalPosition.y - 5;
        finalPosition.z = finalPosition.z - 10;

        finalRotation = new THREE.Vector3();
        finalRotation.copy(vectorRotation);
        finalRotation.x = -1 * (Math.PI/2 + 0.5);
        finalRotation.y = Math.PI/3 - 0.5;
        finalRotation.z = 0;

        animationClock = new THREE.Clock();
        playAxeAnimation();
    }
}


function playAxeAnimation(){
    // document.getElementById("axe").play();
    var delta = (Math.round(animationClock.getElapsedTime() * 100)/100) * 4;
    var currentPosition = new THREE.Vector3().lerpVectors(startPosition,finalPosition,delta);
    var currentRotation = new THREE.Vector3().lerpVectors(startRotation,finalRotation,delta);
    var currentEuler = new THREE.Euler();
    currentEuler.setFromVector3(currentRotation); 
    axeGlobal.position.copy(currentPosition);
    axeGlobal.rotation.copy(currentEuler);
    if(delta<1){
        requestAnimationFrame(playAxeAnimation);
    }else{
        setTimeout(() => {
            axeAnimationRunning = false;
        },200);
    }
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

        var intersectsNote = raycaster.intersectObject(note)[0];
        if(intersectsNote && intersectsNote.distance < 35){
            noteHighlight.visible = true;
        }else{
            noteHighlight.visible = false;
        }

        if(axeGlobal){
            var intersectsAxe = raycaster.intersectObject(axeGlobal,true)[0];
            if(intersectsAxe && intersectsAxe.distance < 35){
                canPickUpAxe = true
                document.getElementById("messages").style.display = "inline-block";
            }else{
                canPickUpAxe = false;
            }
        }
    }
}

function moveHandler(){
    if(!driving){
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
    
        if(camera.position.y > 35 && !onHighGround){
            ySpeed = ySpeed + yIncrement;
        }else{
            ySpeed = 0;
        }
    
        collisionHandler();
    }
}

function carMoveHandler(){
    if(driving){
        //move forward
        if(keyboard["w"]){
            carGlobal.translateZ(2);
            camera.position.copy(carGlobal.position);
            camera.translateZ(100);
            camera.position.y = 100;
        }
        //move backwards
        if(keyboard["s"]){
            carGlobal.translateZ(-2);
            camera.position.copy(carGlobal.position);
            camera.translateZ(100);
            camera.position.y = 100;
        }
        // rotate left
        if(keyboard["a"]){
            if(carGlobal.rotation.y < Math.PI/2){
                carGlobal.rotation.y = carGlobal.rotation.y + 0.005;
            }
        }
        if(keyboard["d"]){
            if(carGlobal.rotation.y > -1*Math.PI/2){
                carGlobal.rotation.y = carGlobal.rotation.y - 0.005;
            }
        }
    }
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
    // if(camera.position.z > 360){
    //     camera.position.z = 360;
    // }

    //check first curtains
    if(camera.position.z < -275){
        if(camera.position.x > -225 && camera.position.x < -210 ){
            camera.position.x = previousX;
        }
    }
    if(camera.position.x > -220 && camera.position.x < -210 ){
        if(camera.position.z < -275 && previousZ > -275){
            camera.position.z = previousZ;
        }
    }

    //check for bed 1
    if(camera.position.z < -301){
        if(camera.position.x > -360 && camera.position.x < -329 ){
            camera.position.x = previousX;
        }
    }

    if(camera.position.x > -360 && camera.position.x < -329 ){
        if(camera.position.z < -300 && previousZ > -300){
            camera.position.z = previousZ;
        }
    }

    //check for bed 2
    if(camera.position.z < -301){
        if(camera.position.x > -280 && camera.position.x < -249 ){
            camera.position.x = previousX;
        }
    }
    if(camera.position.x > -280 && camera.position.x < -249 ){
        if(camera.position.z < -300 && previousZ > -300){
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
    if(eve.key=="f"){
        pickupAxe();
        exitCar();
        getInCar();
    }
});
window.addEventListener("keyup",function(eve){
    keyboard[eve.key] = false;
});

function render(){
    moveHandler();
    carMoveHandler()
    raycasterHandler();
    handleAxeInHand();
    handleEnterCar();

    if(mixer){
        var delta = clock.getDelta();
        mixer.update(delta);
    }
    renderer.render(scene,camera);
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
addCurtains();
addSecondCurtains();
addZombieModel();
addRaycaster();
addNote();
addAxe();
addGrass();
pickupAxe();
addCar();
getInCar();
// zombieMovement();
render();

window.addEventListener("resize",resize);


// very useful for getting bounds of model
// var box = new THREE.Box3().setFromObject(car.scene);
// const helper = new THREE.Box3Helper(box,0xffff00);
// scene.add( helper );
// console.log(box.max);
// console.log(box.min);