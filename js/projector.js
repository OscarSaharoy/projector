// Oscar Saharoy 2023

import { draw } from "./draw.js";


const image = document.querySelector( "svg#image" );
const screen = document.querySelector( "svg#image rect#screen" );
const point = document.querySelector( "svg#image defs circle.point" ).cloneNode(true);


export function plotHomoPoint( [x, y, z], stroke="aqua" ) {

	plotPoint( [x/z, y/z], stroke );
}

export function plotPoint( [x, y], stroke="aqua" ) {

	const newPoint = point.cloneNode(true);

	newPoint.setAttribute( "cx", `${ x}` );
	newPoint.setAttribute( "cy", `${-y}` );
	newPoint.setAttribute( "stroke", stroke );

	image.appendChild( newPoint );
}


function clearImage() {
	
	image.querySelectorAll( "circle" ).forEach( node => node.remove() );
}


export function setScreenSize( width, height ) {

	screen.setAttribute( "x", `${-width /2}` );
	screen.setAttribute( "y", `${-height/2}` );
	screen.setAttribute( "width",  `${width}`  );
	screen.setAttribute( "height", `${height}` );
}
setScreenSize( 500, 500 );


function resizeImage() {

    const width  = image.clientWidth;
    const height = image.clientHeight;
	const aspect = width / height;

	image.setAttribute( "viewBox", `${-width/2} ${-height/2} ${width} ${height}` );
}

new ResizeObserver( resizeImage ).observe( image );


const StopException = { name: "StopException" };
export const stop = () => { throw StopException; };
let spacePressed = false;
let time = 0;

function drawLoop( millis, oldMillis ) {

	if( spacePressed )
		return requestAnimationFrame( newMillis => drawLoop(newMillis, newMillis) );

	try {
		time += ( millis - oldMillis ) / 1000;
		clearImage();
		draw( time );

	} catch(error) {

		if( error == StopException )
			return;

		else throw error;
	}

	requestAnimationFrame( newMillis => drawLoop(newMillis, millis) );
}
drawLoop( 0, 0 );

window.addEventListener( "keyup", e => spacePressed ^= e.key == " " );

