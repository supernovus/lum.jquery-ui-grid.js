const core = require('@lumjs/core');
const {isObj,N,S} = core.types;
const WebGrid = require('@lumjs/web-grid/grid');
const $ = require('jquery');

/**
 * UIGrid
 *
 * An extension of the DisplayGrid library that uses jQuery UI to perform
 * item placement, and other UI related tasks.
 * 
 * @deprecated Uses jQuery UI which is deprecated.
 *
 * @exports module:@lumjs/jquery-ui-grid/grid
 * @extends module:@lumjs/web-grid/grid
 */
class UIGrid extends WebGrid
{
  constructor (options={}, defs={})
  {
    defs.resizeDisplayHeight = false, // If true, resize the workspace height.
    defs.resizeDisplayWidth  = false, // If true, resize the workspace width.
    defs.resizeUseCallback   = false, // If true, use a callback to resize.

    // Call our parent constructor.
    super(options, defs);
  }

  getDisplayItem (ditem)
  {
    const dtype = typeof ditem;
    if (dtype === N || dtype === S)
    { // An offset value.
      ditem = this.display[ditem];
    }
    else if (isObj(ditem) && isObj(ditem.displayItem))
    { // Looks like we were passed a Grid item.
      ditem = ditem.displayItem;
    }

    if (!isObj(ditem) 
      || ditem.x === undefined 
      || ditem.y === undefined 
      || ditem.h === undefined 
      || ditem.w === undefined)
    { // Don't know what to do with this.
      console.error("Invalid item passed to getDisplayItem()", ditem);
      return;
    }

    return ditem;
  }

  resetDisplaySize ()
  {
    const set = this.settings;
    const ws = $(set.displayElement);
    ws.height(set.cellHeight);
  }

  resizeDisplayForItem (ditem)
  {
    ditem = this.getDisplayItem(ditem);
    if (ditem === undefined) return;

    const set = this.settings;
    const ws = $(set.displayElement);
    let changed = false;

    if (set.resizeDisplayHeight)
    {
      const wsHeight = ws.height();
      const cellHeight = ditem.h+ditem.y;
      if (cellHeight >= wsHeight)
      {
        const padding = set.cellHeight;
        ws.height(cellHeight+padding);
        changed = true;
      }
    }

    if (set.resizeDisplayWidth)
    {
      const wsWidth = ws.width();
      const cellWidth = ditem.w+ditem.x;
      if (cellWidth >= wsWidth)
      {
        const padding = set.cellWidth;
        ws.width(cellWidth+padding);
        changed = true;
      }
    }

    if (changed)
    { // Refresh some other settings for the current display element.
      this.setDisplayElement(null, {rebuild: false});
    }
  }

  addItemToDisplay (ditem, delem)
  {
    ditem = this.getDisplayItem(ditem);

    if (ditem === undefined) return;
    if (delem.position === undefined)
    {
      console.error("Invalid element passed to addItemToDisplay()", delem);
      return;
    }

    //console.debug("addItemToDisplay", ditem, delem);
    this.trigger('preAddItemToDisplay', ditem, delem);
    this.resizeDisplayForItem(ditem);
    const set = this.settings;
    const ws = $(set.displayElement);
    ws.append(delem);
    const at = "left+"+ditem.x+" top+"+ditem.y;
    const my = "left top";
    const qpos =     
    {
      my: my,
      at: at,
      of: ws,
      collision: 'none',
    };
    delem.position(qpos);
    delem.height(ditem.h);
    delem.width(ditem.w);
    this.trigger('postAddItemToDisplay', ditem, delem);
  }

  getElementDimensions (delem)
  {
    const set = this.settings;
    const h = Math.round(delem.height() / set.cellHeight);
    const w = Math.round(delem.width() / set.cellWidth);
    return {h: h, w: w};
  }

  /**
   * Build a *Resize Object* that can respond to mouse events
   * to handle resizing an object. You'll have to make mouse event
   * listeners to call this, as well as the methods returned.
   *
   * @param {Event} event - An event object, usually from a mousedown event.
   * @param {Element} element - A jQuery element object.
   * @param {object} item - The underlying Grid item.
   * @param {object} [opts] Any options or extra variables to include.
   * This object will be modified directly, turning it into the
   * *Resize Object*, so don't pass something you don't want modified!
   * @param {bool} [opts.useCallback] Use a callback to calculate the dimensions.
   * @param {bool} [opts.useEvents] If true, register mousemove and mouseup events.
   * @param {string} [opts.rootElement='body'] Selector for root element.
   * @param {number} [opts.interval] The interval to run the callback.
   * @param {function} [opts.onCalculate] A callback done after calculation.
   * Has a signature of: `(el, newWidth, newHeight, conf)`.
   * @param {function} [opts.doCalculate] A function replacing the calculation.
   * Has the same signature as `onCalculate`, but while that callback is
   * called after the standard calculation, this replaces the standard.
   * This is mutually exclusive with `onCalculate` and if both are used,
   * this option takes precedence.
   * @param {function} [opts.onUpdate] To be called when we update the size.
   * @param {function} [opts.onFinish] To be called when we're done.
   * Has a signature of: `(item, finfo)`
   *
   * @return {object} The *Resize Object*, populated with necessary properties.
   */
  startResize (event, element, item, opts={})
  {
    if (opts.useCallback === undefined)
      opts.useCallback = this.settings.resizeUseCallBack;

    // Populate the rest of the object properties we require.
    opts.grid = this;
    opts.element = element;
    opts.item = item;
    opts.startX = event.clientX;
    opts.startY = event.clientY;
    opts.currentX = event.clientX;
    opts.currentY = event.clientY;
    opts.width = element.width();
    opts.height = element.height();

    // A couple default event handlers.
    const DefaultEvents =
    {
      mouseMove: function (e)
      {
        opts.update(e);
      },
      mouseUp: function (e)
      {
        opts.finish();
      },
    }

    // A method for handling mousemove events.
    opts.update = function (event)
    {
      this.currentX = event.clientX;
      this.currentY = event.clientY;
      if (!this.useCallback)
      { // We're going to directly calculate the resize now.
        this.calculate();
      }
      if (typeof this.onUpdate === 'function')
      {
        this.onUpdate();
      }
    }

    // A method for calculating and previewing the current size.
    opts.calculate = function ()
    {
      const newWidth 
        = this.width
        + this.currentX
        - this.startX;
      const newHeight 
        = this.height
        + this.currentY
        - this.startY;

      const set = this.grid.settings;

//      console.debug(newWidth, newHeight, set.cellWidth, set.cellHeight);

      const el = this.element;
      if (typeof this.doCalculate === 'function')
      { // We're overriding the calcuation.
        this.doCalculate(element, newWidth, newHeight, set);
      }
      else
      { // Do the standard calculation, resizing the element on the screen.
        if (newWidth >= set.cellWidth)
          el.width(newWidth);
        if (newHeight >= set.cellHeight)
          el.height(newHeight);
        if (typeof this.onCalculate === 'function')
        {
          this.onCalculate(element, newWidth, newHeight, set);
        }
      }
    }

    // A method for finishing the resize operation.
    opts.finish = function ()
    {
      if (this.useCallback)
      {
        clearInterval(this.watch);
      }
      const el = this.element;
      const item = this.item;
      const newdim = this.grid.getElementDimensions(el);
      const finfo = this.grid.displayItemFits(item, newdim, true);
      if (finfo && finfo.fits)
      {
        this.grid.resizeItem(item, newdim);
      }
      if (typeof this.onFinish === 'function')
      {
        this.onFinish(item, finfo);
      }
      if (this.useEvents)
      {
        const root = this.getRootElement();
        root.off('mousemove', DefaultEvents.mouseMove);
        root.off('mouseup',   DefaultEvents.mouseUp);
      }
    }

    opts.getRootElement = function ()
    {
      return ('rootElement' in this ? $(this.rootElement) : $('body'));
    }

    if (opts.useEvents)
    {
      const root = opts.getRootElement();
      root.on('mousemove', DefaultEvents.mouseMove);
      root.on('mouseup',   DefaultEvents.mouseUp);
    }

    if (opts.useCallback)
    { // Register a watch callback to update the element size.
      const callback = function ()
      {
        opts.calculate();
      }
      const interval = opts.interval ? opts.interval : 25;
      opts.watch = setInterval(callback, interval);
    }

    return opts;

  } // startResize()

  /*
    * Example usage:
    *
    *   // Assuming a view controller object called 'gui' with certain methods.
    *
    *   const gridObj = gui.getGridObject(); // Get your grid object.
    *   let resizeObj = null;
    *
    *   $('.grid-item .resize-grip').on('mousedown', function (e)
    *   {
    *     // Find the item element that is being resized.
    *     const element = $(this).closest('.grid-item');
    *
    *     // Find the Grid item for the element.
    *     const id = element.prop(id).replace('grid-item-','');
    *     const item = oQuery.get(id, gridObj.items);
    *
    *     const opts =
    *     {
    *       useEvents: true,
    *       onFinish: function (item, finfo)
    *       {
    *         gridObj.buildDisplay(); // Rebuild the display items.
    *         gui.redrawDisplay();    // Your method to redraw the display.
    *         resizeObj = null;       // Clear the resizeObj.
    *       }
    *     };
    *
    *     // Create a resizeObj instance.
    *     resizeObj = gridObj.startResize(e, element, item, opts);
    *   });
    *
    *   // If 'useEvents' is false, then you'll need to add event handlers
    *   // yourself, an example is below:
    *
    *   $('body').on('mousemove', function (e)
    *   {
    *     if (resizeObj)
    *     {
    *       resizeObj.update(e);
    *     }
    *   });
    *
    *   $('body').on('mouseup', function (e)
    *   {
    *     if (resizeObj)
    *     {
    *       resizeObj.finish();     // Finish the move.
    *     }
    *   });
    */

} // class UIGrid

module.exports = UIGrid;
