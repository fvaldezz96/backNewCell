const { Router } = require('express')
const { Question, Cell, User, Role } = require('../db.js');

const router = Router();

router.get('/:cellId', async (req, res, next) => {
    let { cellId } = req.params
    try {
        let questions = await Question.findAll({ include: [{ model: Cell, where: { id: cellId } }] })
        let toObject = []

        questions?.map(e => {
            toObject.push({
                id: e.id,
                question: e.question,
                emailUser: e.emailUser,
                answer: e.answer,
                emailAdmin: e.emailAdmin,
                date: e.date
            })
        })

        if (toObject.length === 0) {
            res.send("no hay questions")
        } else {
            res.send(toObject)
        }

    }
    catch (error) { next(error); console.log(error) }
})

router.get('/role/:email', async (req, res, next) => {
    let { email } = req.params
    try {
        let user = await User.findOne({ where: { email: email }, include: [{ model: Role }] })

        let admin = false;

        if (user) {
            if (!(user.role.name === "Cliente")) {
                admin = true;
            }
        }

        res.send(admin);
    }
    catch (error) { next(error); console.log(error) }
})


router.post('/:cellId', async (req, res, next) => {
    let { emailUser, emailAdmin, question } = req.body
    let { cellId } = req.params
    try {
        let date = new Date();
        let q = await Question.create({ emailUser, emailAdmin, question, date });

        await q.setCell(cellId);
        q.save();

        res.send("Question sent!")
    }
    catch (error) { next(error) }
})

router.put('/:id', async (req, res, next) => {
    let { answer } = req.body
    let { id } = req.params;
    console.log(answer)
    try {
        await Question.update(
            { answer },
            { where: { id } }
        )

        return res.status(200).json("Answer updated")

    }
    catch (error) { next(error) }
})


module.exports = router