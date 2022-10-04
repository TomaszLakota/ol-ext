/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/

import ol_ext_SVGFilter from '../../util/SVGFilter.js'

/** Apply a sobel filter on an image
 * @constructor
 * @requires ol.filter
 * @extends {ol_ext_SVGFilter}
 * @param {*} options
 *  @param {boolean} options.grayscale get grayscale image, default false,
 *  @param {boolean} options.alpha get alpha channel, default false
 */
var ol_ext_SVGFilter_Sobel = class olextSVGFilterSobel extends ol_ext_SVGFilter {
  constructor(options) {
    options = options || {};
    super({ id: options.id, color: 'sRGB' });

    var operation = {
      feoperation: 'feConvolveMatrix',
      in: 'SourceGraphic',
      preserveAlpha: true,
      order: 3
    };
    // Vertical
    operation.kernelMatrix = [
      -1, -2, -1, 
      0,  0,  0,
      1,  2,  1
    ];
    operation.result = 'V1';
    this.addOperation(operation);
    operation.kernelMatrix = [
      1,  2,  1, 
      0,  0,  0,
      -1, -2, -1
    ];
    operation.result = 'V2';
    this.addOperation(operation);
    // Horizontal
    operation.kernelMatrix = [
      -1,  0,  1, 
      -2,  0,  2,
      -1,  0,  1
    ];
    operation.result = 'H1';
    this.addOperation(operation);
    operation.kernelMatrix = [
      1, -0, -1, 
      2,  0, -2,
      1,  0, -1
    ];
    operation.result = 'H2';
    this.addOperation(operation);
    // Compose V
    this.addOperation({
      feoperation: 'feComposite',
      operator: 'arithmetic',
      in: 'V1',
      in2: 'V2',
      k2: 1,
      k3: 1,
      result: 'V'
    });
    // Compose H
    this.addOperation({
      feoperation: 'feComposite',
      operator: 'arithmetic',
      in: 'H1',
      in2: 'H2',
      k2: 1,
      k3: 1,
      result: 'H'
    });
    // Merge
    this.addOperation({
      feoperation: 'feBlend',
      mode: 'lighten',
      in: 'H',
      in2: 'V'
    });
    if (options.grayscale) this.grayscale();
    else if (options.alpha) this.luminanceToAlpha({ gamma: options.gamma });
  }
};

export default ol_ext_SVGFilter_Sobel
