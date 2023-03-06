// Oscar Saharoy 2023

import { draw } from "./draw.js";


const image = document.querySelector( "svg#image" );
const screen = document.querySelector( "svg#image rect#screen" );
const point = document.querySelector( "svg#image defs circle.point" ).cloneNode(true);

const explorer = document.querySelector( "svg#explorer" );


export const plotHomoPoint = ([x, y, z], stroke="aqua") =>
	plotPoint( [x/z, y/z], stroke );


let freePoints = [];

export function plotPoint( [x, y], stroke="aqua" ) {

	const madeNew = freePoints.length == 0;
	const newPoint = freePoints.pop() || point.cloneNode(true);

	newPoint.setAttribute( "cx", `${ x}` );
	newPoint.setAttribute( "cy", `${-y}` );
	newPoint.setAttribute( "stroke", stroke );

	if( madeNew ) image.appendChild( newPoint );
	newPoint.classList.remove( "free" );

	return newPoint;
}


function clearImage() {
	
	freePoints = [ ...image.querySelectorAll( "circle" ) ];
	freePoints.forEach( node => node.classList.add( "free" ) );
	//freePoints.forEach( node => node.remove() );
}


function resizeSVG( elm ) {

    const width  = elm.clientWidth;
    const height = elm.clientHeight;
	const aspect = width / height;

	elm.setAttribute( "viewBox", `${-width/2} ${-height/2} ${width} ${height}` );
}

new ResizeObserver( () => resizeSVG( image ) ).observe( image );
new ResizeObserver( () => resizeSVG( explorer ) ).observe( explorer );


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

