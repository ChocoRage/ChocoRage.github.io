export function cloneObject(source: Object): Object {
    if(source && source instanceof Object) {
        var obj = new Object()
        Object.keys(source).map(key => {
            if(!!source[key]){
                if(source[key] instanceof Object) {
                    obj[key] = cloneObject(source[key])
                } else if(source[key] instanceof Function) {
                    // TODO
                } else {
                    obj[key] = source[key]
                }
            }
        })
        return obj
    }
}