// Oscar Saharoy 2022

export const range = n =>
	Object.keys( Array(n).fill(0) ).map( parseFloat );

export function sum( arr ) {
	return arr.reduce( (acc,val) => acc + val, 0 );
}


export const rotateX = theta =>
	[[ 1,               0,                0 ],
	 [ 0, Math.cos(theta), -Math.sin(theta) ],
	 [ 0, Math.sin(theta),  Math.cos(theta) ]]

export const rotateY = theta =>
	[[  Math.cos(theta), 0, Math.sin(theta) ],
	 [                0, 1,               0 ],
	 [ -Math.sin(theta), 0, Math.cos(theta) ]]

export const rotateZ = theta =>
	[[ Math.cos(theta), -Math.sin(theta), 0 ],
	 [ Math.sin(theta),  Math.cos(theta), 0 ],
	 [               0,                0, 1 ]]

export const rotate2D = theta =>
	[[ Math.cos(theta), -Math.sin(theta) ],
	 [ Math.sin(theta),  Math.cos(theta) ]];
	

export const identity = rows =>
	range(rows).map( x => range(rows).map( y => x==y ? 1 : 0 ) );

export const vec0 = rows =>
	Array(rows).fill(0);

export const scaleVec = (vec,f) =>
	vec.map( x => x*f );

export const addVec = (vecA,vecB) =>
	vecA.map( (_,i) => vecA[i] + vecB[i] );

export const subVec = (vecA,vecB) =>
	vecA.map( (_,i) => vecA[i] - vecB[i] );

export const scaleMat = (mat,f) =>
	mat.map( row => scaleVec(row, f) );

export const dot = (vecA,vecB) =>
	vecA.reduce( (sum,_,i) => sum + vecA[i]*vecB[i], 0 );

export const cross = (vecA,vecB) =>
	[
		vecA[1]*vecB[2] - vecA[2]*vecB[1],
		vecA[2]*vecB[0] - vecA[0]*vecB[2],
		vecA[0]*vecB[1] - vecA[1]*vecB[0],
	];

export const meanVec = vecs =>
	scaleVec( 
		vecs.reduce( (acc,vec) => 
			addVec(acc, vec), vec0(vecs[0].length) ),
		1 / vecs.length 
	);

export const length2 = vec =>
	vec.reduce( (acc,val) => acc + val*val, 0 );

export const length = vec =>
	Math.sqrt( length2(vec) );

export const arg = vec =>
	Math.atan2( vec[1], vec[0] );

export const normalise = vec =>
	scaleVec( vec, 1/length(vec) );

export const matVecMul = (mat,vec) =>
	mat.map( row => dot(row, vec) );

export const transpose = mat =>
	mat[0].map( (_,j) => mat.map( (_,i) => mat[i][j] ) );

export const matMatMul = (matA,matB) =>
	transpose(transpose(matB).map( colB => matA.map( rowA => dot(colB,rowA) ) ));

export const matMultiMul = (...mats) =>
	mats.length == 2 ? matMatMul(...mats) : matMatMul( mats[0], matMultiMul(...mats.slice(1)) );

export const vecString = vec =>
	`[ ${vec.reduce( (acc,val,j) => acc + (j>0?", ":"") + val.toPrecision(5), "" )} ]`;

export const matString = mat =>
	`[${mat.reduce( (str,row,i) => str + vecString(row) + (i<mat.length-1?",\n ":""), "" )}]`;


export const degrees = radians => 
	( (radians % (2*Math.PI)) + 2*Math.PI ) % (2*Math.PI) / Math.PI * 180;

export const radians = degrees => 
	( (degrees % 360) + 360 ) % 360 * Math.PI / 180;

const cosD = degrees =>
	Math.cos( radians(degrees) );

const sinD = degrees =>
	Math.sin( radians(degrees) );

export function distBetweenLines( line1, line2 ) {
	
	const perpToBoth = cross( line1.dir, line2.dir );
	
	return dot( subVec(line1.origin, line2.origin), perpToBoth )
		 / dot( perpToBoth, perpToBoth );
}

export function pointDistToLine( point, line ) {
	
	const pr  = subVec( point, line.origin );
	return Math.sqrt( dot(pr, pr) - dot(pr, normalise(line.dir)) ** 2 );
}


export function projectOntoPlane( direction, planeNormal ) {

	return subVec( direction, scaleVec( planeNormal, dot( planeNormal, direction ) ) );
}


export function ordinaryLeastSquares( X, y ) {

	return matMultiMul( inverse( matMatMul( transpose(X), X ) ), transpose(X), y );
}

export function inverse( mat ) {

	const rows = mat.length;
	const cols = mat[0].length;

	if( rows != cols ) throw Error("No inverse, nonsquare matrix");

	let r, s, f, value, temp

	if (rows === 1) {
		// this is a 1 x 1 matrix
		value = mat[0][0]
		if (value === 0) {
			throw Error('Cannot calculate inverse, determinant is zero')
		}
		return [[
			divideScalar(1, value)
		]]
	} else if (rows === 2) {
		// this is a 2 x 2 matrix
		const d = det(mat)
		if (d === 0) {
			throw Error('Cannot calculate inverse, determinant is zero')
		}
		return [
			[
				divideScalar(mat[1][1], d),
				divideScalar(unaryMinus(mat[0][1]), d)
			],
			[
				divideScalar(unaryMinus(mat[1][0]), d),
				divideScalar(mat[0][0], d)
			]
		]
	} else {
		// this is a matrix of 3 x 3 or larger
		// calculate inverse using gauss-jordan elimination
		//            https://en.wikipedia.org/wiki/Gaussian_elimination
		//            http://mathworld.wolfram.com/MatrixInverse.html
		//            http://math.uww.edu/~mcfarlat/inverse.htm

		// make a copy of the matrix (only the arrays, not of the elements)
		const A = mat.concat()
		for (r = 0; r < rows; r++) {
			A[r] = A[r].concat()
		}

		// create an identity matrix which in the end will contain the
		// matrix inverse
		const B = identity(rows)

		// loop over all columns, and perform row reductions
		for (let c = 0; c < cols; c++) {
			// Pivoting: Swap row c with row r, where row r contains the largest element A[r][c]
			let ABig = Math.abs(A[c][c])
			let rBig = c
			r = c + 1
			while (r < rows) {
				if (Math.abs(A[r][c]) > ABig) {
					ABig = Math.abs(A[r][c])
					rBig = r
				}
				r++
			}
			if (ABig === 0) {
				throw Error('Cannot calculate inverse, determinant is zero')
			}
			r = rBig
			if (r !== c) {
				temp = A[c]; A[c] = A[r]; A[r] = temp
				temp = B[c]; B[c] = B[r]; B[r] = temp
			}

			// eliminate non-zero values on the other rows at column c
			const Ac = A[c]
			const Bc = B[c]
			for (r = 0; r < rows; r++) {
				const Ar = A[r]
				const Br = B[r]
				if (r !== c) {
					// eliminate value at column c and row r
					if (Ar[c] !== 0) {
						f = -Ar[c] / Ac[c]

						// add (f * row c) to row r to eliminate the value
						// at column c
						for (s = c; s < cols; s++) {
							Ar[s] = Ar[s] + f * Ac[s]
						}
						for (s = 0; s < cols; s++) {
							Br[s] = Br[s] + f * Bc[s]
						}
					}
				} else {
					// normalize value at Acc to 1,
					// divide each value on row r with the value at Acc
					f = Ac[c]
					for (s = c; s < cols; s++) {
						Ar[s] = Ar[s] / f
					}
					for (s = 0; s < cols; s++) {
						Br[s] = Br[s] / f
					}
				}
			}
		}
		return B;
	}
}

export function quadraticRoots( a, b, c ) {

	const determinant = b*b - 4*a*c;

	if( determinant < 0 ) throw { name: "NoRealRoots" }

	return [ ( -b - Math.sqrt(determinant) ) / (2*a), ( -b + Math.sqrt(determinant) ) / (2*a) ];
}

