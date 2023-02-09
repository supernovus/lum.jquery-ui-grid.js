/**
 * The jQuery UI Grid class with pre-defined conflict resolvers added.
 * 
 * @module module:@lumjs/jquery-ui-grid
 * @see module:@lumjs/jquery-ui-grid/grid
 * @see module:@lumjs/grid/resolvers
 */

const UIGrid = require('./grid');
require('@lumjs/grid/resolvers').registerAll(UIGrid);
module.exports = UIGrid;
