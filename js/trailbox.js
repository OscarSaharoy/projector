// Oscar Saharoy 2023

const trailbox = document.getElementById( "trailbox" );
const trailLabelTemplate = trailbox.querySelector( "div.template" );

export function addLabel( flightData ) {

	const trailLabel = trailLabelTemplate.cloneNode(true);
	trailLabel.classList.remove( "template" );

	const trailLabelP = trailLabel.querySelector( "p" );
	trailLabelP.innerHTML = flightData.callsign;
	trailLabelP.style.color = flightData.color;

	trailbox.appendChild( trailLabel );
}

