const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Joi = require('joi');
const app = express();

app.use('/views', express.static(path.join(__dirname, '')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'index.ejs'));
});

app.post('/', (req, res) => {
    console.log(req.body);
    const schema = Joi.object().keys({
        name: Joi.string().trim().required(),
        address: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        province: Joi.string().trim().required(),
        volume: Joi.number().sign('positive').greater(1).required(),
    });
    Joi.valid(req.body, schema, (err, result) => {
        if (err) {
            res.send('invalid input');
        }
        res.send('500');
    });
    //database work
    res.json({ success: true });
});

app.listen(3000);
