import Table from "./Table"
const TableComponent = {};

export default TableComponent

TableComponent.oninit = function (vnode) {
   vnode.state.table = new Table()
   console.log(vnode.state.table)
}



TableComponent.oncreate = function (vnode) {
    const selection = vnode.attrs.selection

    d3.select(vnode.dom)
        .datum({
            columns : vnode.attrs.columns,
            rows : vnode.attrs.rows,
            showTitles : vnode.attrs.showTitles
        })
        .call(vnode.state.table.draw)

    if(selection) {
       d3.select(vnode.dom).selectAll('tr.trow input').attr('checked', d => {
            console.log(d, selection.isSelected(d.row))
            return selection.isSelected(d.row) == false ? undefined : true
        })
        d3.select(vnode.dom).selectAll('tr.trow').classed('table-info', d => selection.isSelected(d.row))
    }

}

TableComponent.onbeforeupdate = function(vnode, old) {
    if(vnode.attrs.rows != old.attrs.rows) {
        this.forceRedraw = true
    }
    return true;
}

TableComponent.onupdate = function(vnode, old) {
    if(this.forceRedraw == true) {
        this.forceRedraw = false;

        d3.select(vnode.dom)
            .datum({
                columns : vnode.attrs.columns,
                rows : vnode.attrs.rows,
                showTitles : vnode.attrs.showTitles
            })
            .call(vnode.state.table.draw)
    }
}

TableComponent.view = function () {
    return m('div[table-component]')
}