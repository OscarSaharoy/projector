// Oscar Saharoy 2023

import * as THREE from './three.module.js'; 
import { canvas } from "./canvas.js";

import time from "../time.js";


const infoBox = document.getElementById( "info-box" );
const infoBoxP = infoBox.querySelector( "p" );


function getMinsAgo( pathIntersection ) {

	const intersectENU = pathIntersection.point;
	const pathENUts = pathIntersection.object.flightData.ENUts;

	for( let i = 1; i < pathENUts.length; ++i ) {

		const prevENU = new THREE.Vector3( ...pathENUts[i-1].ENU );
		const ENU = new THREE.Vector3( ...pathENUts[i].ENU );
		const segment = new THREE.Vector3().subVectors( ENU, prevENU );
		const delta = new THREE.Vector3().subVectors( intersectENU, prevENU );

		const dot   = delta.clone().dot(   segment.clone().normalize() );
		const cross = delta.clone().cross( segment.clone().normalize() );

		if( dot > 0 && dot < segment.length() && cross.length() < 4e+3 ) {
			const interpolatedTime = pathENUts[i-1].t + ( pathENUts[i].t - pathENUts[i-1].t ) * dot / segment.length();
			const timeDelta = ( interpolatedTime - time );
			return timeDelta > 0 ?
				`${Math.floor(  timeDelta / 60) }m ${ Math.floor( timeDelta) % 60 }s ago` :
				`${Math.floor( -timeDelta / 60) }m ${ Math.floor(-timeDelta) % 60 }s from now`;
		}
		
	}

	return "?";
}


function infoString( pathIntersection ) {

	return `
		${pathIntersection.object.flightData.callsign} <br>
		E: ${Math.floor(pathIntersection.point.x)} <br>
		N: ${Math.floor(pathIntersection.point.y)} <br>
		U: ${Math.floor(pathIntersection.point.z)} <br>
		${getMinsAgo( pathIntersection )}`;

}

export function displayInfo( clickEvent, pathIntersection ) {
	
	infoBox.classList.remove( "hidden" );

	infoBoxP.innerHTML = infoString( pathIntersection );
	infoBox.style.borderColor = pathIntersection.object.flightData.color;

	let top = clickEvent.clientY;
	if( top + infoBox.offsetHeight > canvas.offsetHeight )
		top -= infoBox.offsetHeight;

	let left = clickEvent.clientX;
	if( left + infoBox.offsetWidth > canvas.offsetWidth )
		left -= (left + infoBox.offsetWidth) - canvas.offsetWidth;

	infoBox.style.top  = `${top}px`;
	infoBox.style.left = `${left}px`;
}

export function hideInfo() {
	infoBox.classList.add( "hidden" );
}

