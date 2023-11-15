import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

class SuperEllisGeometry extends BufferGeometry {

	constructor( w0 = 1.0, w1 = 1.0, a=1.0, b=1.0, c=1.0, radialSegments = 11, tubularSegments = 15, arc = 2*Math.PI ) {

		super();
		this.type = 'SuperEllisGeometry';

		this.parameters = {
			w0: w0,
			w1: w1,
            a: a,
            b: b,
            c: c,
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

        const u0 = - Math.PI;
        const v0 = - Math.PI/2;

        var cu, su, cv, sv;

		// generate vertices, normals and uvs

		for ( let j = 0; j <= radialSegments; j ++ ) {

			for ( let i = 0; i <= tubularSegments; i ++ ) {

				const v = v0 + i / tubularSegments * Math.PI;
				const u = u0 + j / radialSegments * arc;

				// vertex
                cu = Math.cos(u);
                su = Math.sin(u);
                cv = Math.cos(v);
                sv = Math.sin(v);
				vertex.x = a * Math.sign(cv)*Math.pow(Math.abs(cv), w0)  * Math.sign(cu)*Math.pow(Math.abs(cu), w1);
				vertex.y = b * Math.sign(cv)*Math.pow(Math.abs(cv), w0)  * Math.sign(su)*Math.pow(Math.abs(su), w1);
				vertex.z = c * Math.sign(sv)*Math.pow(Math.abs(sv), w0);

				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				center.x = 0;
				center.y = 0;
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
		return new SuperEllisGeometry( data.w0, data.w1, data.a, data.b, data.c, data.radialSegments, data.tubularSegments, data.arc );

	}

}

export { SuperEllisGeometry, SuperEllisGeometry as SuperEllisBufferGeometry };
