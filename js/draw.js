// Oscar Saharoy 2023

import { plotPoint, plotHomoPoint, stop } from "./projector.js";
import * as math from "./math.js";
Object.entries(math).forEach(([name, exported]) => window[name] = exported);


const homogenousToXY = ([x1,x2,x3]) =>
	[x1 / Math.max(1e-8, x3), x2 / Math.max(1e-8, x3)];


const XYPoints = range(100).map( _ => [ Math.random() * 2 - 1, Math.random() * 2 - 1, 0 ] );

const genLinePoints = (a, b, n) =>
	range(n).map( x => addVec( a, scaleVec( b, x-n/2 ) ) );

const linePoints = [
	...genLinePoints([0,0,0], [1,0,0], 30),
	...genLinePoints([0,0,0], [0,1,0], 30),
];

const horizonHomoPoints = range(100).map( x => [Math.sin(x/50*Math.PI), Math.cos(x/50*Math.PI), 0, 0] );

const phi = 1.61803398;
const pi  = 3.14159265;
const tau = pi * 2;

const genSpherePoints = n => range( Math.floor(n) ).map( x => [
	Math.sin( x * tau*phi ) * (1-((2*x-n)/n)**2)**0.5,
	Math.cos( x * tau*phi ) * (1-((2*x-n)/n)**2)**0.5,
	(2*x - n) / n 
] );
const spherePoints = genSpherePoints(200);

const squarePoints = [
	[0, 0, 1],
	[1, 0, 1],
	[0, 1, 1],
	[1, 1, 1],
];


export function draw( t ) {

	const Rx = rotateX(1.17);
	const Ry = rotateY(0.2*t);
	const Rz = rotateZ(t);
	const R = matMultiMul( Rx, Ry, Rz );

	const T = [0, 0, 2];

	const RT = transpose( [...transpose(R), T] );

	const K = [
		[ 500,   0, 0 ],
		[   0, 500, 0 ],
		[   0,   0, 1 ],
	];

	const P = matMatMul( K, RT );

	for( const p of genSpherePoints(100 - Math.sin(t) * 50) ) {

		plotHomoPoint( matVecMul( P, [...p, 1] ), "red" );
	}

	//stop();
}

