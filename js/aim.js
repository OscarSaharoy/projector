// Oscar Saharoy 2023

import * as THREE from './three.module.js'; 
import contrailData from "../contrailData.js";


export function addRing( scene ) {

	const geometry = new THREE.TorusGeometry( 2, 0.01, 3, 48 );
	const material = new THREE.MeshBasicMaterial( { color: 0xccefff } );
	const torus = new THREE.Mesh( geometry, material );

	torus.lookAt( new THREE.Vector3( ...contrailData.deviceOrientation.up ) );

	torus.renderOrder = -1;
	torus.onAfterRender = renderer => renderer.clearDepth();

	scene.add( torus );
}


export async function evaluateFlightPath( contrailData, responseJSON ) {

	const userLLA = [ contrailData.userCoords.latitude, contrailData.userCoords.longitude, contrailData.userCoords.altitude ];

	// if no path was found for this flight, return 0
	if( responseJSON.path == undefined ) return 0;
	
	const pointScores = responseJSON.path.map( pathPoint => {

		const pointLLA = [ pathPoint[1], pathPoint[2], pathPoint[3] ];

		// point is too low to have a contrail form
		if( pointLLA[2] < 7000 ) return 0;

		const pointENU = LLAdeltaToENU( pointLLA, userLLA );

		// point is below horizon, can't be on the contrail the user saw
		if( pointENU[2] < 0 ) return 0;

		return pointNormalScore( pointENU, contrailData.direction.contrailViewerPlaneNormal );
	});

	console.log( responseJSON.callsign, pointScores.sort().reverse().slice(0,5).reduce( (acc,val) => acc + val, 0 ) );

	return pointScores.sort().reverse().slice(0,5).reduce( (acc,val) => acc + val, 0 );
}

