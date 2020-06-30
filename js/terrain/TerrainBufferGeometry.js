/**
 * Terrain geometry based on PlaneBufferGeometry.
 * oskarbraten
 */

import Utilities from '../lib/Utilities.js';
import { PlaneBufferGeometry } from '../lib/three.module.js';

export default class TerrainBufferGeometry extends PlaneBufferGeometry {

    constructor({ heightmapImage, width = 100, numberOfSubdivisions = 128, height = 20 }) {

    	super(width, width, numberOfSubdivisions, numberOfSubdivisions);

        this.rotateX(-Math.PI / 2);

        this.numberOfSubdivisions = numberOfSubdivisions;

        this.width = width;
        this.height = height;

    	// get heightmap data
    	this.heightmap = Utilities.getHeightmapData(heightmapImage, this.numberOfSubdivisions + 1);

    	// assign Y-values
    	let v = 0;
    	for (let i = 0; i < this.heightmap.length; i++) {
    		this.attributes.position.array[v + 1] = this.heightmap[i] * this.height;
    		v += 3;
    	}

    	// move such that the center is in the corner and not in origo.
    	//this.translate(this.width / 2, 0, this.width / 2);

    	// recompute normals.
    	this.computeVertexNormals();
    }

    /**
     * [getHeightAt description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    getHeightAt(position) {

        position.x += (this.width / 2);
        position.z += (this.width / 2);

        if (0 > position.x || position.x > this.width || 0 > position.z || position.z > this.width) {
            return 0;
        }

        let v = this.numberOfSubdivisions;

        let factor = v / this.width;

        let x_max = Math.ceil(position.x * factor);
        let x_min = Math.floor(position.x * factor);

        let z_max = Math.ceil(position.z * factor);
        let z_min = Math.floor(position.z * factor);

        let h0 = this.heightmap[(z_max * (v + 1)) + x_max] * this.height;
        let h1 = this.heightmap[(z_max * (v + 1)) + x_min] * this.height;
        let h2 = this.heightmap[(z_min * (v + 1)) + x_max] * this.height;
        let h3 = this.heightmap[(z_min * (v + 1)) + x_min] * this.height;

        return Math.min(h0, h1, h2, h3);
    }

}