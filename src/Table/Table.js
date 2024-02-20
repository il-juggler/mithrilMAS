export default Table;

function Table(options = null) {
    this.draw = (function (selection) {
        let datum = selection.datum();
        let data = this.compute(datum.columns, datum.rows);
        let theadClass = "";
        let trHeadClass = "titulos";

        if(options) {
            if(options.stickyHeaders) {
                theadClass += " sticky";
                trHeadClass += " sticky";
            }
        }

        //Crear <table class="table">
        if(selection.select('table').empty()) {
            selection.append('table').attr('class','table');
        }
        const tableEl = selection.select('table');

         //Crear <thead>
        if(tableEl.select('thead').empty()) {
            tableEl.append('thead').attr('class', theadClass);
        }

        if(tableEl.select('thead tr').empty()) {
            tableEl.select('thead').append('tr').attr('class', trHeadClass);
        }

        const theadTR = tableEl.select('thead tr.titulos');
        theadTR.selectAll('th.header').data(datum.columns)
            .join(
                enter => enter.append('th').attr('class', 'header').style('background', '#009EE3').style('color', '#fff').style('vertical-align', 'middle').text(c => c.header),
                update => update.text(c => c.header),
                exit => exit.remove()
            )
        
        tableEl.select('thead').style('display', datum.showTitles === false ? 'none' : '')


        //Crear <tbody>
        if(tableEl.select('tbody').empty()) {
            tableEl.append('tbody')
        }
        
        const tBodyEl = tableEl.select('tbody');
        const tRows = tBodyEl.selectAll('tr.trow').data(data)
            .join(
                enter => enter.append('tr').attr('class', 'trow'),
                update => update,
                exit => exit.remove()
            ).call(function (sel) {
                return datum.updateRows ? datum.updateRows(sel) :  (update) => update  
            });

        const tCells = tRows.selectAll('td.cell').data(row => row.cells)
            .join(
                enter => enter.append('td').attr('class', 'cell').call(EnterCellColumns, datum),
                update => update,
                exit => exit.remove()
            ).call(UpdateCellColumns, datum);

    }).bind(this);

    this.compute = function(columns, rows) {
        return rows.map(row => {
            return {row, cells : columns.map(column => column.compute(row))}
        })
    }

    function EnterCellColumns(enter, datum) {
        datum.columns.forEach((column, index) => {          
            enter.filter(cell => cell.column == column).call(column.enter, datum.rows);
        });
    }

    function UpdateCellColumns(tCells, datum) {
        datum.columns.forEach(column => {
            tCells.filter(cell => cell.column == column).call(column.update)
        })
    }
}