const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const Joi = require("joi");
const warehouse = express()

warehouse.use('/public', express.static(path.join(__dirname, '')))
warehouse.use(bodyParser.urlencoded({extended:false}))
warehouse.use(bodyParser.json())

warehouse.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'', 'index.html'));
})

warehouse.post('/', (req,res) => {
    console.log(req.body);
    const schema = Joi.object().keys({
        name: Joi.string().trim().required(),
        address: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        province: Joi.string().trim().required(),
        volume: Joi.number().sign("positive").greater(1).required()
    })
    Joi.valid(req.body, schema, (err,result) => {
        if (err) {
            res.send('invalid input')
        }
        res.send('500')
    })
    //database work
    res.json({success: true});
})

warehouse.listen(3000);