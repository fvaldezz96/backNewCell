const { Router } = require('express')
const { Rating, Cell, User, Role, Order } = require('../db.js');
const router = Router();

router.get('/k/:cellId', async (req, res, next) => {
   let { cellId } = req.params;
   try {
      let ratings = await Rating.findAll({
         include: [{ model: Cell, where: { id: cellId } }]
      })
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
      toObj.length === 0 ? "not rating" : res.status(200).send(toObj)
   } catch (error) {
      console.log(error)
      res.status(404).json(error);
      next(error);
   }
})

router.get('/role', async (req, res, next) => {
   let { em, cellId } = req.query;

   if (!cellId || isNaN(cellId)) {
      return res.status(400).send('Missing or invalid cellId parameter');
   }

   let userData = await User.findOne({ where: { email: em }, include: [{ model: Role }] })

   if (!userData || userData.length > 0) {
      return res.status(400).send(false)
   }

   let validate = await Rating.findAll({
      include: [{ model: Cell, where: { id: cellId } }],
      where: { emailUser: userData.email }
   })

   if (validate.length >= 1) {
      return res.status(400).send(false)
   }

   let orders = await Order.findAll({
      where: { userId: userData.id },
      include: [{
         all: true
      }]
   })

   // orders?.map((e) => {
   //    e.cells?.map((i) => {
   //       if (i.id.toString() === cellId.toString()) {
   //          return res.send(true)
   //       }
   //    })
   // })
   // res.send(false);
   try {
      let foundCell = false;
      for (const order of orders) {
         for (const dataCell of order.cells) {
            if (dataCell.id.toString() === cellId.toString()) {
               foundCell = true;
               break;
            }
         }
         if (foundCell) break;
      }
      res.status(200).json({ message: 'Data Orders', data: foundCell })
   }
   catch (error) {
      console.log('Error send(router.get(/role,)🥵:', error)
      res.status(500).send(`Send Error ${error}`)
      next(error)
   }

})
/**/
router.post('/:cellId', async (req, res, next) => {
   let { emailUser, rating, comment } = req.body
   let { cellId } = req.params
   try {
      if (!cellId || !emailUser || !rating) {
         return res.send("Missing required parameters")
      }

      let date = new Date();
      let ratingCreate = await Rating.create({ emailUser, rating, date, comment });

      await ratingCreate.setCell(cellId);
      ratingCreate.save();
      res.send("Rating sent!")
   }
   catch (error) {
      console.log(error)
      next(error)
   }
})


module.exports = router;