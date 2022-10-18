const transportator = require('./configurations')

async function sendEmailSale(emailBuyer, usernameBuyer, nameProducts) {
    transportator.sendMail({
        from: 'phonesecommerce@gmail.com',
        to: emailBuyer,
        subject: "Transaction confirmed!",
        text: `Hi! we inform you that ${usernameBuyer} has made a purchase of the following products: ${nameProducts}`
    })
    transportator.sendMail({
        from: emailBuyer,
        to: 'phonesecommerce@gmail.com',
        subject: "Transaction confirmed!",
        text: `The user ${usernameBuyer} has made a purchase of the following products: ${nameProducts}`
    })
}

async function sendClaimMail(msg, service, email) {
    transportator.sendMail({
        from: email,
        to: 'phonesecommerce@gmail.com',
        subject: "Issue '" + service + "'",
        text: `${msg} \n ${email}`
    })
}

async function autoClaimRes(username, email, service) {
    transportator.sendMail({
        from: 'phonesecommerce@gmail.com',
        to: email,
        subject: "Issue '" + service + "'",
        html: `
        <!DOCTYPE html>
        <html>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;900&family=Righteous&display=swap" rel="stylesheet">
                <style>
                    .img {
                        max-width: 200px;
                    }
                    h1, h2, h3, p {
                        text-align: center;
                        font-family: sans-serif;
                        font-family: cursive;
                    }
                    .image {
                        background-color: rgb(31, 31, 31);
                        text-align: center;
                    }
                    .information {
                        background-color: rgb(211, 211, 211);
                        text-align: center;
                        justify-content: center;
                    }
                    .refound {
                        display: flex;
                        align-items: center;
                        background-color: aliceblue;
                        height: 100PX;
                        color: rgb(141, 141, 141);
                    }
                </style>
            </head>
            <body>
                <div>
                    <div class="image">
                        <a href="">
                            <img class="img" src="https://apple2fan.com/wp-content/uploads/2020/10/Captura-de-pantalla-2020-10-13-a-las-19.46.59.png" alt="iconImg"/>
                        </a>
                    </div>
                    <h3>Hi ${username}</h3>
                    <h1>You are comunicating with us about your '${service}' problem!</h1>
                    <div class="information">
                        <h2>INFORMATION ABOUT YOUR CLAIM:</h2>
                        <p>Your claim is alredy being processed. Soon someone from our team will contact you through this email, thank you for informing us of your problem, we're happy to help</p>
                    <div class="refound">
                    </div>
                </div>
            </body>
        </html>`
    })
}

module.exports = { sendEmailSale, sendClaimMail, autoClaimRes }


