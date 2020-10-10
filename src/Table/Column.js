
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
        cell.text = this.text(value);
        return cell;
    }

    this.update = update => update.text( F('text') );
    this.enter = function () {}
}


function F(key) {
    return function (stuff) {
        return stuff[key];
    }
}