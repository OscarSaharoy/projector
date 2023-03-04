// Oscar Saharoy 2023

import * as THREE from './three.module.js'; 
import { canvas } from "./canvas.js";
import { camera } from "./camera.js";
import { pathMeshes } from "./trailviewer.js";
import { hideInfo, displayInfo } from "./info-box.js";


const dpr = window.devicePixelRatio || 1;
const raycaster = new THREE.Raycaster();

function click( clickEvent ) {
	
	const pointer = new THREE.Vector2();

	pointer.x =   ( clickEvent.clientX * dpr / canvas.width  ) * 2 - 1;
	pointer.y = - ( clickEvent.clientY * dpr / canvas.height ) * 2 + 1;

	raycaster.setFromCamera( pointer, camera );
	const pathIntersection = raycaster.intersectObjects( pathMeshes )[0];

	if( !pathIntersection ) return;
	
	displayInfo( clickEvent, pathIntersection );
}

canvas.addEventListener( "click", click );
canvas.addEventListener( "pointermove", click );


