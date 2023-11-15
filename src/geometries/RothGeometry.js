import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

class RothGeometry extends BufferGeometry {

	constructor( w0 = 1/(6*Math.PI), w1 = 1/(3*Math.PI), radialSegments = 11, tubularSegments = 15, arc = 29*Math.PI/8 ) {

		super();
		this.type = 'RothGeometry';

		this.parameters = {
			w0: w0,
			w1: w1,
			radialSegments: radialSegments,
			tubularSegments: tubularSegments,
			arc: arc
		};

		radialSegments = Math.floor( radialSegments );
		tubularSegments = Math.floor( tubularSegments );

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// helper variables

		const center = new Vector3();
		const vertex = new Vector3();
		const normal = new Vector3();

        const u0 = - Math.PI/3;
        const v0 = 5*Math.PI/2;

		// generate vertices, normals and uvs

		for ( let j = 0; j <= radialSegments; j ++ ) {

			for ( let i = 0; i <= tubularSegments; i ++ ) {

				const v = v0 + i / tubularSegments * arc;
				const u = u0 + j / radialSegments * Math.PI * 2;

				// vertex

				vertex.x = ( 1 - Math.exp(w0*v))* Math.cos( v )  * (5.0/4.0 + Math.cos( u ));
				vertex.y = ( Math.exp(w0*v)-1 )* Math.sin( v )  * (5.0/4.0 + Math.cos( u ));
				vertex.z = 7 - Math.exp(w1*v) - Math.sin(u) + Math.exp(w0*v) * Math.sin( u );

				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				center.x = w0 * Math.cos( u );
				center.y = w0 * Math.sin( u );
				normal.subVectors( vertex, center ).normalize();

				normals.push( normal.x, normal.y, normal.z );

				// uv

				uvs.push( i / tubularSegments );
				uvs.push( j / radialSegments );

			}

		}

		// generate indices

		for ( let j = 1; j <= radialSegments; j ++ ) {

			for ( let i = 1; i <= tubularSegments; i ++ ) {

				// indices

				const a = ( tubularSegments + 1 ) * j + i - 1;
				const b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
				const c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
				const d = ( tubularSegments + 1 ) * j + i;

				// faces

				indices.push( a, b, d );
				indices.push( b, c, d );

			}

		}

		// build geometry

		this.setIndex( indices );
		this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
		this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

	}

	static fromJSON( data ) {
		return new RothGeometry( data.w0, data.w1, data.radialSegments, data.tubularSegments, data.arc );

	}

}

export { RothGeometry, RothGeometry as RothBufferGeometry };
