const { sendEmailSale, sendClaimMail, autoClaimRes } = require('./generateNotifications')
//usernameSeller,emailSeller,usernameBuyer,nameProduct
async function saleMail(id) {
    try {
        // const foundOrder = await _findById({ _id: id })
        // const foundUserSeller = await findById(foundOrder.userseller).populate({ path: "orders" });
        // const foundUserBuyer = await findById(foundOrder.user).populate({ path: "orders" })
        // const foundIdProducts = foundOrder.products.map(pro => pro.products);
        // const foundProducts = await Promise.all(foundIdProducts.map((id) => __findById(id)))
        // const foundProductsName = foundProducts.map(p => p.name)
        // await sendEmailSale(foundUserSeller.username, foundUserSeller.email, foundUserBuyer.username, foundProductsName.join(', '))
    } catch (e) {
        console.log(e)
    }
}
async function sendClaim(req, res) {
    try {
        const { name, email, subject, message } = req.body
        await sendClaimMail(message, subject, email);
        await autoClaimRes(name, email, subject)
        res.status(200).send({ message: "Info send!" })
    } catch (e) {
        res.status(500).send({ error: e })
    }
}
module.exports = { saleMail, sendClaim }