export default Table;

function Table() {
    this.draw = (function (selection) {
        let datum = selection.datum()
        let data = this.compute(datum.columns, datum.rows)

        //Crear <table class="table">
        if(selection.select('table').empty()) {
            selection.append('table').attr('class','table')
        }
        const tableEl = selection.select('table');

         //Crear <thead>
        if(tableEl.select('thead').empty()) {
            tableEl.append('thead')
        }


        if(tableEl.select('thead tr').empty()) {
            tableEl.select('thead').append('tr').attr('class', 'titulos')
        }

        const theadTR = tableEl.select('thead tr.titulos');
        theadTR.selectAll('th.header').data(datum.columns)
            .join(
                enter => enter.append('th').attr('class', 'header').style('background', '#009EE3').style('color', '#fff').style('vertical-align', 'middle').text(c => c.header),
                update => update.text(c => c.header),
                exit => exit.remove()
            )
        
        console.log('showTitles', datum.showTitles);
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
                return datum.updateRows ? datum.updateRows(sel) :  update 
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
            enter.filter(cell => cell.column == column).call(column.enter, datum[index]);
        })
    }

    function UpdateCellColumns(tCells, datum) {
        datum.columns.forEach(column => {
            tCells.filter(cell => cell.column == column).call(column.update)
        })
    }
}