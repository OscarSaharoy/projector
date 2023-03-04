// Oscar Saharoy 2023

import * as THREE from './three.module.js'; 
import { GLTFLoader } from "./GLTFLoader.js";
import { renderScene } from "./trailviewer.js";
import { addVec, SHVtoENU, normalise, LLAdeltaToENU } from "../../js/math.js";
import { debounceCall } from "../../js/utility.js";

import contrailData from "../contrailData.js";
import callsigns from "../callsigns.js";


const gltfLoader = new GLTFLoader();
const planeMeshPath = "trailviewer/gltf/plane.gltf";


let _planeGLTF = null;
const getPlaneGLTFResolves = [];

function meshLoaded( gltf ) {
	_planeGLTF = gltf;
	getPlaneGLTFResolves.map( resolve => resolve(gltf) );
}

gltfLoader.load( planeMeshPath, meshLoaded );


async function getPlaneGLTF() {
	
	if( _planeGLTF ) return _planeGLTF;

	else return await new Promise( 
		resolve => getPlaneGLTFResolves.push( resolve )
	);
}


export async function addPlaneMesh( flightData, scene ) {

	if( !callsigns.filter( callsign => callsign == flightData.callsign ).length ) return;

	const flightLLA = [ flightData.latitude, flightData.longitude, flightData.altitude ];
	const userLLA = [ contrailData.userCoords.latitude, contrailData.userCoords.longitude, contrailData.userCoords.altitude || 0 ];
	const flightENU = LLAdeltaToENU( flightLLA, userLLA );

	const planeGLTF = await getPlaneGLTF();

	const root = planeGLTF.scene.clone();
	root.traverse( child => child.material = new THREE.MeshBasicMaterial({ color: flightData.color }) );

	const flightSHV = [ flightData.speed, flightData.heading, flightData.verticalRate || 0 ];
	const flightVelENU = SHVtoENU( flightSHV, flightLLA, userLLA );
	
	root.up.set(0, 0, 1);
	root.lookAt( ...flightVelENU );

	root.applyMatrix4(
		new THREE.Matrix4().makeTranslation(...flightENU)
	);
	root.scale.set(200,200,200)

	/*
	root.applyMatrix4(
		new THREE.Matrix4().makeRotationZ( marker.zRotation )
	);
	*/

	scene.add(root);
	debounceCall( renderScene );
}

