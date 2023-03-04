// Oscar Saharoy 2023

import * as THREE from './three.module.js'; 
import { canvas } from "./canvas.js";
import { camera } from "./camera.js";
import { loadMarkers } from "./markers.js";
import { addPathMesh } from "./generate-paths.js";
import { addPlaneMesh } from "./generate-planes.js";
import { addRing } from "./aim.js";
import { addLabel } from "./trailbox.js";

import time from "../time.js";
import flightDatas from "../input.js";


const scene = new THREE.Scene();
scene.background = new THREE.Color( "skyblue" );

const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, logarithmicDepthBuffer: true } );

const geo = new THREE.PlaneGeometry( 1000, 1000 );
const mat = new THREE.MeshBasicMaterial({ color: 0x3fe93e, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geo, mat);
plane.position.z = -2;
scene.add(plane);

loadMarkers( scene );
addRing( scene );
export const pathMeshes = flightDatas.map( flightData => addPathMesh( flightData, scene ) );
flightDatas.forEach( flightData => addLabel(flightData) );
export const flightMeshes = flightDatas.map( flightData => addPlaneMesh( flightData, scene ) );

export const renderScene = () => renderer.render( scene, camera );


function resizeRendererToDisplaySize( renderer ) {

    const width  = canvas.clientWidth;
    const height = canvas.clientHeight;
	const dpr    = window.devicePixelRatio || 1;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width*dpr, height*dpr, false );
	renderScene();
}

new ResizeObserver( () => resizeRendererToDisplaySize(renderer) ).observe( canvas );

