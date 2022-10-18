const { Router } = require('express')
const { Rating, Cell, User, Role, Order } = require('../db.js');
const router = Router();

router.get('/k/:cellId', async (req, res, next) => {
   let { cellId } = req.params;
   try {
      let ratings = await Rating.findAll({ include: [{ model: Cell, where: { id: cellId } }] })
      let toObj = [];

      ratings?.map(e => {
         toObj.push({
            id: e.id,
            rating: e.rating,
            emailUser: e.emailUser,
            comment: e.comment,
            date: e.date
         })
      })

      toObj.length === 0 ? res.send("not rating") : res.send(toObj)

   } catch (error) {
      next(error);
      console.log(error)
   }
})

router.get('/role', async (req, res, next) => {
   let { em, cellId } = req.query;


   try {
      let user = await User.findOne({ where: { email: em }, include: [{ model: Role }] })

      if (!user || user.length > 0) {
         res.send(false)
      }

      let validate = await Rating.findAll({ include: [{ model: Cell, where: { id: cellId } }], where: { emailUser: user.email } })

      if (validate.length >= 1) {
         res.send(false)
      }

      let orders = await Order.findAll({
         where: { userId: user.id },
         include: [{
            all: true
         }]

      })

      orders?.map((e) => {
         e.cells?.map((i) => {
            if (i.id.toString() === cellId.toString()) {
               return res.send(true)
            }
         })
      })
      res.send(false);
   }
   catch (error) { next(error) }

})



/**/


router.post('/:cellId', async (req, res, next) => {
   let { emailUser, rating, comment } = req.body
   let { cellId } = req.params
   try {
      let date = new Date();
      let r = await Rating.create({ emailUser, rating, date, comment });

      await r.setCell(cellId);
      r.save();
      res.send("Rating sent!")
   }
   catch (error) { next(error) }
})


module.exports = router;