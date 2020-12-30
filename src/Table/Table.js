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
            );

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
        datum.columns.forEach(column => {
            enter.filter(cell => cell.column == column).call(column.enter)
        })
    }

    function UpdateCellColumns(tCells, datum) {
        datum.columns.forEach(column => {
            tCells.filter(cell => cell.column == column).call(column.update)
        })
    }
}