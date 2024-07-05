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
   try {
      let { em, cellId } = req.query;

      if (!em || !cellId || isNaN(cellId)) {
         return res.status(400).send('Missing or invalid Id parameter');
      }

      const user = await User.findOne({ where: { email: em }, include: [{ model: Role }] });

      if (!user) {
         return res.status(400).json({ message: 'User not found or no access' });
      }

      const allRatings = await Rating.findAll({
         include: [{ model: Cell, where: { id: cellId } }],
         where: { emailUser: user.email }
      });

      const orders = await Order.findAll({ where: { userId: user.id }, include: [{ all: true }] });

      let foundCell = 0;
      for (const order of orders) {
         for (const dataCell of order.cells) {
            if (dataCell.id.toString() === cellId.toString()) {
               foundCell++;
               break;
            }
         }
      }

      if (allRatings.length < foundCell) {
         res.status(200).send(true);
      } else {
         res.status(200).send(false);
      }

   } catch (error) {
      console.log('Error in router.get(/role,):', error);
      res.status(500).json({ message: 'send try...catch' });
   }
});

router.get('/rating-check', async (req, res, next) => {
   try {
      let { em, cellId } = req.query;
      if (!em || !cellId || isNaN(cellId)) {
         return res.status(400).send('Missing or invalid Id parameter');
      }
      const user = await User.findOne({ where: { email: em }, include: [{ model: Role }] });
      if (!user) res.status(400).json({ message: 'User not found or no access' })
      const allRatings = await Rating.findAll({
         include: [{ model: Cell, where: { id: cellId } }],
         where: { emailUser: user.email }
      });
      allRatings.length > 0 ? res.status(200).send(false) : res.status(200).send(true)
   } catch (error) {
      console.log(error)
      res.status(500).json(error)
      next()
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