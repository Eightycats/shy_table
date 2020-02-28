/**
 * Table component that waits to lazily create row elements as they are needed
 * and hides row elements that aren't currently visible in the viewport at the
 * current scroll location.
 */
class ShyTable {

    /**
     * Constructor takes the name of the tables parent element and information 
     * about how to create the row elements.
     * 
     * @param {string} parentId the selector string for the table's parent element.
     * @param {function} createRow function use to create a row element from the row data.
     *                             Function should accept the row Object and the row index as args.
     * @param {number} rowHeight the height of the rows to create in pixels.
     * @param {number} bufferRows the number of extra rows to keep visible above and below the viewport.
     */
    constructor(parentId, createRow, rowHeight = 30, bufferRows = 20) {
        // the data backing the rows of this table
        this.data = [];
        // the collection of row elements
        this.rows = [];
        this.parent = $(parentId);
        this.container = $('<div class="shyContainer"><div>');
        this.parent.addClass('shyParent');
        this.parent.append(this.container);
        this.createRow = createRow;
        this.rowHeight = rowHeight;
        // the number of extra rows to keep around above and below the viewport
        this.bufferRows = bufferRows;

        // estimate out how many rows should be visible based on the height of
        // the rows and the height of the parent.
        this.visibleRows = 0;
        this.calculateVisibleRows();

        // estimated range of visible rows
        this.fromRow = 0;
        this.toRow = 0;

        // keep track of where we are actually at in the viewport
        // recalculate what needs to be visible
        this.parent.on('scroll', (event) => {
            this.showVisibleRows(event.target.scrollTop);
        });

        // recalculate what's visible if we resize
        $( window ).resize(() => {
            this.calculateVisibleRows();
            this.updateVisibleRows();
        });
    }

    /**
     * Removes all data and row elements and resets this table.
     */
    clear() {
        this.container.empty();
        this.data = [];
        this.rows = [];
        this.fromRow = 0;
        this.toRow = 0;
        this.parent.scrollTop(0);
    }

    /**
     * Sets row data that will be displayed in this table.
     * Clears and replaces the current data, if any.
     * 
     * @param {Object[]} rowData each element of the 
     */
    setData(rowData) {
        this.clear();

        this.data = rowData;
        this.rows = [];

        var newHeight = this.data.length * this.rowHeight;
        if (this.container.height() != newHeight) {
            this.container.height(newHeight);
        }

        this.updateVisibleRows();
    }

    /**
     * Gets the row element at the given index.
     * Creates and populates a new row element if one does not already exist.
     * 
     * @param {number} index the row index.
     */
    getRowElement(index) {
        if (!this.rows[index]) {
            this.rows[index] = this.createRowElement(this.data[index], index);
        }
        return this.rows[index];
    }

    /**
     * Creates a new row element and sets its position.
     * 
     * @param {Object} row the row data used to populate the row element.
     * @param {number} index the current row index.
     */
    createRowElement(row, index) {
        var rowElement = this.createRow(row, index);
        rowElement.addClass('shyRow');
        rowElement.height(this.rowHeight);
        rowElement.offset({top: index * this.rowHeight, left: 0});
        this.container.append(rowElement);
        return rowElement;
    }

    /**
     * Gets the current scroll position and calls showVisibleRows() for that location.
     */
    updateVisibleRows() {
        var scrollTop = this.parent.scrollTop();
        if (scrollTop != 'undefined') {
            this.showVisibleRows(scrollTop);
        }
    }

    /**
     * Makes sure that the rows at the given scroll position exist and are visible.
     * Hides any rows that were previously visible but are now out of range.
     * 
     * @param {number} scrollTop the y position of our scroll.
     */
    showVisibleRows(scrollTop) {
        if (!this.data.length) {
            this.fromRow = 0;
            this.toRow = 0;
            return;
        }

        var top = Math.floor(scrollTop / this.rowHeight);
        top = Math.max(0, top - this.bufferRows);
        var bottom = top + this.visibleRows + this.bufferRows * 2;
        bottom = Math.min(this.data.length - 1, bottom + this.bufferRows);

        // hide rows that are now out of range
        for (var i = this.fromRow; top > i && this.toRow >= i; i++) {
            this.getRowElement(i).hide();
        }

        for (var j = this.toRow; j > bottom && j >= this.fromRow; j--) {
            this.getRowElement(j).hide();
        }

        // show rows that weren't visible before
        for (var k = top; k < this.fromRow && k < bottom; k++) {
            this.getRowElement(k).show();
        }

        for (var l = Math.max(this.toRow, top); l <= bottom; l++) {
            this.getRowElement(l).show();
        }

        this.fromRow = top;
        this.toRow = bottom;
    }

    /**
     * Updates how many rows are visible at a time based off the height of our parent container.
     */
    calculateVisibleRows() {
        this.visibleRows = Math.floor(this.parent.height() / this.rowHeight);
    }
}
