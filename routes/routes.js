var Connection = require('../connection');
require('dotenv').config();

//Initialize new API Connection:
var api = new Connection({
    hash: process.env.STORE_HASH,
    token: process.env.STORE_TOKEN,
    cid: process.env.STORE_CID,
    host: 'https://api.bigcommerce.com' //The BigCommerce API Host
});

var appRouter = function (app) {

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get("/", function (req, res) {
        res.status(200).send({
            message: 'Welcome to the API'
        });
    });

    app.get("/modifiers/:id", function(req,res) {
        console.log(req.params.id);
        var productId = req.params.id;
        api.get('products/'+productId+'/modifiers').then(function(product) {
            api.get('products/'+productId+'/complex-rules').then(function(productRules) {

                var productData = {
                    product,
                    productRules
                }

                res.status(200).json(productData);

            }).catch((err) => {
                console.log(err)
            }); 

        }).catch((err) => {
            console.log(err)
        }); 
    })

};

module.exports = appRouter;