// Oscar Saharoy 2023

const splitscreenDiv = document.getElementById( "splitscreen" );
const divider = document.getElementById( "divider" );


let pointerdown = false;

divider.addEventListener( "pointerdown", () => pointerdown = true  );
window.addEventListener( "pointerup",    () => pointerdown = false );
window.addEventListener( "pointerleave", () => pointerdown = false );
window.addEventListener( "pointermove", redivide );

function redivide( event ) {

	if( !pointerdown ) return;

	const totalWidth = splitscreenDiv.clientWidth;
	const rightPercentage = event.clientX / totalWidth * 100;
	const leftPercentage  = ( totalWidth - event.clientX ) / totalWidth * 100;

	splitscreenDiv.style.gridTemplateColumns = `${rightPercentage}% 0 ${leftPercentage}%`;
}
