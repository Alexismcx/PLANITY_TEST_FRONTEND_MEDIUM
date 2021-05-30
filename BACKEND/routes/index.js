var express = require('express');
var router = express.Router();
const axios = require('axios');
const cartListModel = require('../models/cartList');

/* GET home page. */
router.get('/beer-list', async function (req, res, next) {
  var config = {
    method: 'get',
    url: `https://api.punkapi.com/v2/beers?`,
    headers: {}
  };

  try {
    const api = await axios(config);
    res.send(api.data);
  } catch (error) {
    res.sendStatus(400)
  }
});

router.get('/beer-details/:ids', async function (req, res, next) {
  var config = {
    method: 'get',
    url: `https://api.punkapi.com/v2/beers?ids=${req.params.ids}`,
    headers: {}
  };

  try {
    const api = await axios(config);
    res.send(api.data);
  } catch (error) {
    res.sendStatus(400)
  }
});

router.post('/save-beer-cart', async function (req, res, next) {


  const newOrder = new cartListModel({
    tag: req.body.tag,
    name: req.body.name,
    image_url: req.body.image_url,
  })

  const searchForSameTag = await cartListModel.findOne({tag: req.body.tag})
  
  if(searchForSameTag === null){
    console.log("YES");
    try {
      const orderSaved = await newOrder.save();
      res.json(orderSaved)
    } catch (err) {
      res.status(400).json(err);
    }
  }

})

router.get('/cart-list', async function (req, res, next) {
  try {
    const allBeerOrdered = await cartListModel.find()
    console.log(allBeerOrdered);
    res.json(allBeerOrdered)
  } catch (err) {
    res.status(400).json(err);
  }
})

router.delete('/delete-beer-cart', async function (req, res, next) {

  try{
    var deleteBeer = await cartListModel.deleteOne({tag: req.body.tag})
    res.sendStatus(200)
  }catch(err){
    res.status(400).json(err)
  }
})



module.exports = router;
