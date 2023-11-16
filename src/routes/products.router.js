const express = require('express');
const router = express.Router();
const ProductManager = require('../controller/productManager');
const io = require('../app') 



const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let limit = req.query.limit ? parseInt(req.query.limit) : undefined;

        if (limit && limit < 0) {
            return res.status(400).json({ error: "Limit not acepted." });
        }

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.status(200).json(limitedProducts);
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Server error!" });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error!" });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const result = await productManager.deleteProduct(productId);
        
        if (result) {
            res.status(200).json({ message: "Producto borrado correctamente" });
        } else if (!result) {
            res.status(404).json({ message: "Producto no encontrado" });
        } //else {
        //     res.status(500).json({ error: "Error de servidor!" });
        // }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor!!!!!" });
    }
});


router.post('/', async (req, res) => {
    try {
        const { title, description, price, code, stock, category, status } = req.body;
        const thumbnails = req.body.thumbnails || [];

        const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Faltan campos requeridos: ${missingFields.join(', ')}` });
        }

        const typeValidation = {
            title: 'string',
            description: 'string',
            price: 'number',
            code: 'string',
            stock: 'number',
            category: 'string',
            status: 'boolean'
        };

        const invalidFields = Object.entries(typeValidation).reduce((acc, [field, type]) => {
            if (req.body[field] !== undefined) {
                if (type === 'array' && !Array.isArray(req.body[field])) {
                    acc.push(field);
                } else if (typeof req.body[field] !== type) {
                    acc.push(field);
                }
            }
            return acc;
        }, []);

        if (!Array.isArray(thumbnails)) {
            return res.status(400).json({ error: 'Formato inválido para el campo thumbnails' });
        }

        if (invalidFields.length > 0) {
            return res.status(400).json({ error: `Tipos de datos inválidos en los campos: ${invalidFields.join(', ')}` });
        }

        const productData = {
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status: status !== undefined ? status : true
        };

        const result = await productManager.addProductRawJSON(productData);

        const responseCodes = {
            "Ya existe un producto con ese código. No se agregó nada.": 400,
            "Producto agregado correctamente.": 201,
            "Error agregando producto.": 500,
        };

        //io.emit("producto", result)

        const reStatus = responseCodes[result] || 500;       
        return res.status(reStatus).json({ message: result });

        

    } catch (error) {
        return res.status(500).json({ error: "Error de servidor!" });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updates = req.body;
        const result = await productManager.updateProduct(productId, updates);
        if (result) {
            res.status(200).json({ message: "Product Updated" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor!" });
    }
});

module.exports = router;