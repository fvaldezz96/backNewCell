const { Brand, Product, Op, Question, Rating } = require('../db')

const obtenerProductos = async () => {
    let productos = await Product.findAll({ where: { disabled: false }, include: [{ model: Brand }] })
    let toObj = []
    productos?.map((e) => {
        toObj.push({
            id: e.id,
            line: e.line,
            model: e.model,
            capacity: e.capacity,
            price: e.price,
            stock: e.stock,
            image: e.image,
            spec: e.spec,
            memoryRAM: e.memoryRAM,
            description: e.description,
            brand: e.brand.name,
            disabled: e.disabled
        })
    })
    return toObj;
}
const obtenerProductosById = async (id) => {
    let e = await Product.findByPk(id, { include: [{ model: Brand }, { model: Question }, { model: Rating }] })
    const producto = {
        id: e.id,
        line: e.line,
        model: e.model,
        capacity: e.capacity,
        price: e.price,
        stock: e.stock,
        image: e.image,
        spec: e.spec,
        memoryRAM: e.memoryRAM,
        description: e.description,
        brand: e.brand.name,
        questions: e.questions,
        ratings: e.ratings

    }
    if (!e.disabled) {
        return producto
    }

}

const obtenerProductosAdmin = async () => {
    let productos = await Product.findAll({ include: [{ model: Brand }] })
    let toObj = []
    productos?.map((e) => {
        toObj.push({
            id: e.id,
            line: e.line,
            model: e.model,
            capacity: e.capacity,
            price: e.price,
            stock: e.stock,
            image: e.image,
            spec: e.spec,
            memoryRAM: e.memoryRAM,
            description: e.description,
            brand: e.brand.name,
            disabled: e.disabled
        })
    })
    return toObj;
}

module.exports = {
    obtenerProductos,
    obtenerProductosById,
    obtenerProductosAdmin
}