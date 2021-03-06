(function($) {
    'use strict';

    var sortAsNumber = function(a, b) {

        var aAsNumber = parseFloat(a);
        var bAsNumber = parseFloat(b);
        return aAsNumber - bAsNumber;

    };

    var sortAsString = function(a, b) {

        if(a === b) return 0;
        return a > b ? 1 : -1;

    };

    var sortAsDate = function(a, b) {

        var aAsDate = new Date(a);
        var bAsDate = new Date(b);
        if(aAsDate === bAsDate) return 0;
        return aAsDate > bAsDate ? 1 : -1;

    };


    var sort = function(column, type, direction) {

        var $column = $(column);
        var tBody = $column.closest('table').find('tbody');
        var tableRows = tBody.children();
        var columnIndex = $column.parent().children().index($column);

        if(typeof type === 'function') {
            tableRows.sort(function(a, b) {
                var valA = $($(a).children().get(columnIndex)).text();
                var valB = $($(b).children().get(columnIndex)).text();
                return type(valA, valB);
            });
        } else {
            tableRows.sort(function(a, b) {
                var valA = $($(a).children().get(columnIndex)).text();
                var valB = $($(b).children().get(columnIndex)).text();
                switch(type) {
                    case 'Number':
                        return sortAsNumber(valA, valB);
                    case 'String':
                        return sortAsString(valA, valB);
                    case 'Date':
                        return sortAsDate(valA, valB);
                    default:
                        throw new Error('Unsupported type ' + type);
                }
            });
        }

        //preserve event listeners which were bound to table cells
        var sortedRows = tableRows.clone(true);
        tableRows.remove();
        if(direction === 'descending') {
            sortedRows = tableRows.toArray().reverse();
        }
        tBody.append(sortedRows);


    };

    var init = function(opts) {

        var column;
        var currentDirections = {};

        for(column in opts.columns) {
            if(opts.columns.hasOwnProperty(column)) {
                currentDirections[column] = undefined;
            }
        }

        this.find('thead>tr>th')
            .filter(function() {
                return opts.columns.hasOwnProperty($(this).text());
            })
            .css(opts.css)
            .click(function(e) {
                var columnHeader = $(this).text();
                if(currentDirections[columnHeader] === undefined ||
                        currentDirections[columnHeader] === 'descending') {
                    currentDirections[columnHeader] = 'ascending';
                } else if(currentDirections[columnHeader] === 'ascending') {
                    currentDirections[columnHeader] = 'descending';
                }
                sort(this, opts.columns[columnHeader], currentDirections[columnHeader]);
            });

    };

    $.fn.sorTable = function(method, direction, type) {

        //initialization
        if(direction === undefined && type === undefined){
            var opts = $.extend({}, $.fn.sorTable.defaults, method);
            init.apply(this, [opts]);
        } else {
            var column = this.find('thead>tr>th:contains("' + method + '")');
            if(column.length === 0){
                throw new Error('No column with name ' + method);
            }
            sort(column, type, direction);
        }

    };

    $.fn.sorTable.defaults = {

        css: {
            cursor: "pointer"
        }

    };

})(jQuery);
