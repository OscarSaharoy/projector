// Oscar Saharoy 2023

const image = document.querySelector( "svg#image" );
const screen = document.querySelector( "svg#image rect#screen" );




function setScreenSize( width, height ) {

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

