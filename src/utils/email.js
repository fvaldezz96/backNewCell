const hanldEmail = ({mail, data, amount}) => {
    if(mail || data || amount){
        const email = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;900&family=Righteous&display=swap" rel="stylesheet">
                        <style>
                            .img {
                                max-width: 100px;
                                border-radius: 25%;
                            }
            
                            h1, h2, h3, p {
                                text-align: center;
                                font-family: 'Lato', sans-serif;
                                font-family: 'Righteous', cursive;
                            }
                            .image {
                                background-color: rgb(31, 31, 31);
                                text-align: center;
                            }
            
                            .information {
        
                                background-color: rgb(211, 211, 211);
                                height: 50px;
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
                            .title{
                                color:white;
                            }
                        </style>
                    </head>
                    <body>
                        <div>
                            <div class="image">
                                <h2 class="title">CELL STORE</h2>
                            </div>
                            <h1>Thanks!</h1>
                            <h3>Hi ${mail} 👋</h3>
                            <p>Thanks for your purchase from Cell Store</p>
                     
                            <hr></hr>
                            <div class="information">
                                <h2>INFORMATION ABOUT YOUR ORDER:</h2>
                            </div>
                            <hr></hr>
                            <h3>Billed to: ${mail}</h3>
                            <h3>Font: Cell Store</h3>
                            <h3>Products: </h3>
                            <div>
                            <p>${data}</p>
                            </div>
                            <hr></hr>
                            <h3>Total [USD]: $${amount}</h3>
                            <hr></hr>
                            <div class="refound">
                                <p>
                                    Unless otherwise stated by the product or offer, any cell purchased from the Cell Store is eligible for a refund within 14 days of purchase (or, for pre-orders, upon release) if you played less than 2 hours. See more information in our <a href="">refund policy</a>.
                                </p>
                            </div>
                        </div>
                    </body>
                </html>
                `;
    email
    }else {
        console.log("null parameter the email!")
    }
}
 module.exports = hanldEmail