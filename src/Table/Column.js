
export default Column;

function Column(name, config) {
    if(this instanceof Column === false) return new Column(name, config);
    if(!name) throw new Error('Must specify a name on a Column')
    if(!config) config = {};

    const column = this;
    const accesor = typeof config.value === 'function' ? config.value : F(name)
    
    //Esto retorna el valor en si mismo que vamos a usar
    this.value = accesor;

    //Esto retorna el valor formateado
    this.text = typeof config.text === 'function' ? config.text : a => a;

    this.compute = (row) => {
        let value = this.value(row);
        let cell  = {value,column,row};
        cell.text = this.text(value, cell);
        return cell;
    }

    this.update = typeof config.update == 'function' ? config.update : update => update.text( F('text') );
    this.enter  = typeof config.enter  == 'function' ? config.enter  : e => e;
    
    this.call = function(funk) {
        funk(column)
        return column
    }
}


function F(key) {
    return function (stuff) {
        return stuff[key];
    }
}