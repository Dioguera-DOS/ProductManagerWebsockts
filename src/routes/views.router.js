const { Router } = require('express');
const router=Router()
const io = require('../app');
const ProductManager = require('../controller/productManager');


const productManager = new ProductManager();

router.get('/', async(req,res)=>{
    try {
        let result = await productManager.getProducts();
        res.setHeader('Content-type', 'application/json')
        res.status(200).render('home', {result, titulo: 'Home Page'})        
    } catch (error) {
        res.setHeader('Content-type', 'application/json')
        return res.status(400).json({message:"Server Error!!"})
        
    }
})

router.get('/realtimeproducts', async(req,res)=>{
    try {
        let result = await productManager.getProducts();
        res.setHeader('Content-type', 'application/json')
        res.status(200).render('realTimeProducts', {result, titulo: 'Home Page'})        
    } catch (error) {
        res.setHeader('Content-type', 'application/json')
        return res.status(400).json({message:"Server Error!!"})
        
    }
})


module.exports = router;