const { Router } = require('express')
const { Cell, User } = require('../db');
const router = Router();

router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  const user = await User.findByPk(id)
  const cart = await user.getCart()
  return res.status(200).send(cart)
})


router.post('/', async (req, res, next) => {
  const { phoneId, userId } = req.body
  try {
    const user = await User.findByPk(userId)
    if (user && phoneId) {
      await user.addCart(phoneId)
      return res.status(200).send("Added to cart")
    }
    res.status(406).send("Not added, missing field")
  } catch (err) {
    res.status(406).send("something went wrong, user/phone id not found/valid")
  }
})

router.delete('/', async (req, res, next) => {
  const { userId, phoneId } = req.body
  console.log({ userId, phoneId });
  if (!userId) {
    return res.status(406).send("Not removed, missing field")
  }
  try {
    const user = await User.findByPk(userId)
    if(!phoneId){
      await user.setCart([])
      return res.status(200).send("All items has been removed from cart")
    }
    await user.removeCart(phoneId)
    return res.status(200).send("Item removed from cart")
  } catch (err) {
    console.log(err)
    res.status(406).send("something went wrong")
  }
})


module.exports = router