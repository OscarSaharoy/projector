// Oscar Saharoy 2023

import * as THREE from './three.module.js'; 


const section = new THREE.Shape([
	new THREE.Vector2( -100,  100 ),
	new THREE.Vector2(  100,  100 ),
	new THREE.Vector2(  100, -100 ),
	new THREE.Vector2( -100, -100 ),
]);


function generatePathMesh( path ) {

	const spline = new THREE.CatmullRomCurve3(
		path.map( entry =>
			new THREE.Vector3(
				+entry[0],
				+entry[1],
				+entry[2]
			)
		)
	);

	const extrudeSettings = {
		steps: 20,
		bevelEnabled: false,
		extrudePath: spline
	};

	const randomDir = new THREE.Vector3().randomDirection();
	const r = Math.abs( randomDir.x ) * 0xff0000;
	const g = Math.abs( randomDir.y ) * 0x00ff00;
	const b = Math.abs( randomDir.z ) * 0x0000ff;
	const mat = new THREE.MeshBasicMaterial({ color: r+g+b });

	let color = Math.floor(r+g+b).toString(16);
	color = color.padStart( 6, "0" );

	const geometry = new THREE.ExtrudeGeometry( section, extrudeSettings );
	const mesh = new THREE.Mesh( geometry, mat );

	return [ color, mesh ];
}

export function addPathMesh( flightData, scene ) {

	const [ color, mesh ] = generatePathMesh( flightData.ENUts.map( ENUt => ENUt.ENU ) ) 

	flightData.mesh = mesh;
	flightData.mesh.flightData = flightData;
	flightData.color = `#${color}`;

	scene.add( flightData.mesh );

	return mesh;
}

