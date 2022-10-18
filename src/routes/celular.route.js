
const { Router } = require('express')
const { obtenerProductos, obtenerProductosById, obtenerProductosAdmin } = require('../Middleware/getProducto.middleware')
const { crearProducto } = require('../Middleware/crearProducto.middleware')
const { crearMarca } = require('../Middleware/crearMarca.middleware')
const { Cell, Brand } = require('../db');
const { Op } = require("sequelize");

const router = Router();



router.get('/home', async (req, res, next) => {
  const f = req.query;
  console.log("--f--", f);
  let condition = {}
  let d = {
    disabled: false
  }
  const filters = Object.assign(f, d)
  try {
    for (key in filters) {
      if (key === "brand") { continue }
      if (key === "capacity" || key === "price") {
        let [min, max] = filters[key].split("/");
        condition[key] = { [Op.between]: [min, max] }
        continue
      }
      if (key === "model") {
        condition[key] = { [Op.substring]: filters[key] }
        continue
      }
      condition[key] = filters[key]
    }
    let products = await Cell.findAll({ include: [{ model: Brand }], where: condition })
    if (filters.brand) {
      products = products.filter(e => e.brand.name === filters.brand)
    }
    products = products.map((e) => {
      return {
        id: e.id,
        line: e.line,
        model: e.model,
        capacity: e.capacity,
        price: e.price,
        stock: e.stock,
        image: e.image,
        spec: e.spec,
        disabled: e.disabled,
        memoryRAM: e.memoryRAM,
        description: e.description,
        brand: e.brand.name
      }
    })
    return res.send(products)
  }
  catch (error) { next(error.message); console.log(error.message) }
})

router.get('/home/:id', async (req, res, next) => {
  let { id } = req.params
  try {
    let product = await obtenerProductosById(id)
    return res.send(product)
  }
  catch (error) { next(error); console.log(error) }
})

router.post('/', async (req, res, next) => {
  let { line, model, capacity, price, stock, image, spec, memoryRAM, description, disabled, brand } = req.body
  console.log(req.body, 'soy lo que le llega al back')
  try {
    let productoCreado = await crearProducto(line, model, capacity, price, stock, image, spec, memoryRAM, description, brand, disabled)
    productoCreado.flag ? res.send(productoCreado.message)
      : res.send(productoCreado.message)
  }
  catch (error) { next(error) }
})

router.put('/:id', async (req, res, next) => {
  let { line, model, capacity, price, stock, image, spec, memoryRAM, description, brand, disabled } = req.body
  let { id } = req.params;

  try {
    await Cell.update(
      { line, model, capacity, price, stock, image, spec, memoryRAM, description, brand, disabled },
      { where: { id } }
    )

    if (brand) {
      let marca = await crearMarca(brand)
      let cel = await Cell.findByPk(id)

      await cel.setBrand(marca)
      cel.save();
    }

    return res.status(200).json("Cell updated")

  }
  catch (error) { next(error) }
})


router.get('/panel', async (req, res, next) => {
  const filters = req.query;
  let condition = {}

  try {
    if (Object.keys(filters).length === 0) {
      const products = await obtenerProductosAdmin();
      return res.send(products)
    }

    for (key in filters) {
      if (key === "brand") { continue }
      if (key === "capacity" || key === "price") {
        let [min, max] = filters[key].split("/");
        condition[key] = { [Op.between]: [min, max] }
        continue
      }
      if (key === "model") {
        condition[key] = { [Op.substring]: filters[key] }
        continue
      }
      condition[key] = filters[key]
    }
    let products = await Cell.findAll({ include: [{ model: Brand }], where: condition })
    if (filters.brand) {
      products = products.filter(e => e.brand.name === filters.brand)
    }
    products = products.map((e) => {
      return {
        id: e.id,
        line: e.line,
        model: e.model,
        capacity: e.capacity,
        price: e.price,
        stock: e.stock,
        image: e.image,
        spec: e.spec,
        disabled: e.disabled,
        memoryRAM: e.memoryRAM,
        description: e.description,
        brand: e.brand.name
      }
    })
    return res.send(products)
  }
  catch (error) { next(error.message); console.log(error.message) }
})







module.exports = router

