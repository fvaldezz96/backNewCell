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
      console.log('toObj resultado!', toObj)
      toObj.length === 0 ? res.send("not rating") : res.send(toObj)

   } catch (error) {
      next(error);
      console.log(error)
   }
})

router.get('/role', async (req, res, next) => {
   let { em, cellId } = req.query;
   if (!cellId || isNaN(cellId)) {
      return res.status(400).send('Missing or invalid cellId parameter');
   }
   try {
      let user = await User.findOne({
         where: { email: em },
         include: [{ model: Role }]
      })
      // Verificar si el usuario tiene roles
      if (!user || user.length > 0) {
         return res.send('Unauthorized: or user not found');
      }
      try {
         let existingRating = await Rating.findAll({
            include: [{ model: Cell, where: { id: cellId } }],
            where: { emailUser: user.email }
         })

         if (existingRating.length >= 1) {
            return res.send(false)
         }

         let orders = await Order.findAll({
            where: { userId: user.id }, //cambie "id" por "userId"
            include: [{ all: true }]
         })

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
         res.send(foundCell)
      } catch (error) {
         console.error('Error fetching ratings or orders:', error);
         return res.status(500).send('Internal Server Error');
      }
      // orders.map(async (e) => {
      //    await e.cells.map((dataCells) => {
      //       if (dataCells.id.toString() === cellId.toString()) {
      //          return res.send(true)
      //       }
      //    })
      // })
   }
   catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Internal Server Error');
      next(error)
   }
})
router.post('/:cellId', async (req, res, next) => {
   let { emailUser, rating, comment } = req.body
   let { cellId } = req.params
   try {
      let date = new Date();
      let ratingCreate = await Rating.create({ emailUser, rating, date, comment });
      await ratingCreate.setCell(cellId);
      ratingCreate.save();
      res.send("Rating sent!")
   }
   catch (error) { next(error) }
})


module.exports = router;