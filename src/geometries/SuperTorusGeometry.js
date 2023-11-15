import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

class SuperTorusGeometry extends BufferGeometry {

	constructor( w0=1, w1=1, radius = 1, tube = 0.4, radialSegments = 8, tubularSegments = 6, arc = Math.PI * 2 ) {

		super();
		this.type = 'SuperTorusGeometry';

		this.parameters = {
            w0: w0,
			w1: w1,
			radius: radius,
			tube: tube,
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

        var cu, su, cv, sv;

		// generate vertices, normals and uvs

		for ( let j = 0; j <= radialSegments; j ++ ) {

			for ( let i = 0; i <= tubularSegments; i ++ ) {

				const u = i / tubularSegments * arc;
				const v = j / radialSegments * Math.PI * 2;

				// vertex
                cu = Math.cos(u);
                su = Math.sin(u);
                cv = Math.cos(v);
                sv = Math.sin(v);
				vertex.x = ( radius + tube * (Math.sign(cv) * Math.pow(Math.abs( cv ),w0 )) ) * Math.sign(cu)*Math.pow(Math.abs( cu ),w1);
				vertex.y = ( radius + tube * (Math.sign(cv)*Math.pow(Math.abs( cv ),w0 ))) * Math.sign(su)*Math.pow(Math.abs( su ),w1);
				vertex.z = tube * (Math.sign(sv)*Math.pow(Math.abs( sv ),w0));

				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				center.x = radius * Math.cos( u );
				center.y = radius * Math.sin( u );
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

		return new SuperTorusGeometry( data.w0, data.w1, data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc );

	}

}

export { SuperTorusGeometry, SuperTorusGeometry as SuperTorusBufferGeometry };
