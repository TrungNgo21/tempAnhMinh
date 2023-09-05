const express = require('express');
const app = express();
const port = 5501;

app.use(express.static('public'));
app.listen(port, () => {
    console.log(`App listening  on port ${port}`);
  })


app.use('/',express.static(__dirname + 'index.html'))



app.post('/display_item', (req,res) =>{
  const item = [
    {image: "Banana-Single.jpg",
    name: "Egg",
    brand: "Kosher",
    price: 90,
    source: "Warehouse A",
    item_category: "Food"},
  
    {image: "Banana-Single.jpg",
    name: "Mouse",
    brand: "Razer",
    price: 180,
    source: "Warehouse B",
    item_category: "Electronic"}
  ];
  
res.send(item);
})