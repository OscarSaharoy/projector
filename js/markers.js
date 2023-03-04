// Oscar Saharoy 2023

import * as THREE from './three.module.js'; 
import { GLTFLoader } from "./GLTFLoader.js";
import { renderScene } from "./trailviewer.js";


const markers = [
	{  path: "trailviewer/gltf/north.gltf", zRotation: 0,            color: 0xff0000 },
	{  path: "trailviewer/gltf/east.gltf",  zRotation: -Math.PI/2,   color: 0xffffff },
	{  path: "trailviewer/gltf/south.gltf", zRotation: -Math.PI,     color: 0xffffff },
	{  path: "trailviewer/gltf/west.gltf",  zRotation: -3*Math.PI/2, color: 0xffffff },
];

const gridPath = "trailviewer/gltf/grid.gltf";

export function loadMarkers( scene ) {

	const gltfLoader = new GLTFLoader();

	markers.forEach( marker =>

		gltfLoader.load( marker.path, gltf => {

			const root = gltf.scene;
			root.traverse( child => child.material = new THREE.MeshBasicMaterial({ color: marker.color }) );

			root.applyMatrix4(
				new THREE.Matrix4().makeTranslation(0, 10, -0.35)
			);
			root.applyMatrix4(
				new THREE.Matrix4().makeRotationZ( marker.zRotation )
			);

			root.renderOrder = -1;
			root.onAfterRender = renderer => renderer.clearDepth();

			scene.add(root);
			renderScene();
		} )
	);

	gltfLoader.load( gridPath, gltf => {

		const root = gltf.scene;
		root.traverse( child => child.material = new THREE.MeshBasicMaterial({ depthTest: false, color: 0xbbeeff }) );

		root.renderOrder = -1;
		root.onAfterRender = renderer => renderer.clearDepth();

		scene.add(root);
		renderScene();
	} );
}
