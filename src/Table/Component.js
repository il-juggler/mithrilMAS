import Table from "./Table"
const TableComponent = {};

export default TableComponent

TableComponent.oninit = function (vnode) {
    let options = {};
    if(vnode.attrs.stickyHeaders){
        options.stickyHeaders = true;
    }

    vnode.state.table = new Table(options);
}


TableComponent.oncreate = function (vnode) {
    const selection = vnode.attrs.selection
    
    d3.select(vnode.dom)
        .datum({
            columns : vnode.attrs.columns,
            rows : vnode.attrs.rows,
            showTitles : vnode.attrs.showTitles,
            updateRows : vnode.attrs.updateRows
        })
        .call(vnode.state.table.draw)

    if(selection) {
       d3.select(vnode.dom).selectAll('tr.trow input').attr('checked', d => {
            return selection.isSelected(d.row) == false ? undefined : true
        })

        d3.select(vnode.dom)
            .selectAll('tr.trow')
            .classed('table-info', d => selection.isSelected(d.row))
    }

}

TableComponent.onbeforeupdate = function(vnode, old) {
    if(vnode.attrs.rows != old.attrs.rows || vnode.attrs.columns != old.attrs.columns) {
        this.forceRedraw = true
    }
    return true;
}

TableComponent.onupdate = function(vnode) {

    if(this.forceRedraw == true) {
        this.forceRedraw = false;

        d3.select(vnode.dom)
            .datum({
                columns : vnode.attrs.columns,
                rows : vnode.attrs.rows,
                showTitles : vnode.attrs.showTitles,
                updateRows : vnode.attrs.updateRows
            })
            .call(vnode.state.table.draw)
    }
}

TableComponent.view = function (vnode) {
    let tableStyle = "";
    if(vnode.attrs.stickyHeaders){
        tableStyle = "height: 80vh !important;";
    }

    return m('div[table-component]', {style: tableStyle});
}