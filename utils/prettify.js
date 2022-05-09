class Prettify {
    static _JSON(obj) {
        return JSON.stringify(obj, null, 4);
    }
}

module.exports = Prettify;