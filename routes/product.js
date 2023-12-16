const express = require('express');
const db = require('../database/config');
const router = express.Router();

router.get('/products', function (req, res, next) {
    db.query('SELECT * FROM product', (err, data) => {
        if (err) throw err;
        res.render('product/product', {
            title: 'Warehouse | Product',
            data,
        });
    });
});

router.get('/products/detail/:id', function (req, res, next) {
    const { id } = req.params;
    db.query(`SELECT * FROM product WHERE ID_Product = ${id}`, (err, data) => {
        if (err) throw err;
        res.render('product/detail', {
            title: 'Warehouse | Detail Product',
            data: data[0],
        });
    });
});

router.get('/products/create', function (req, res) {
    res.render('product/create', {
        title: 'Warehouse | Create Product',
        message: '',
    });
});

router.post('/products', function (req, res) {
    const { Product_Name, Type_Product, Category } = req.body;

    if (!Product_Name || !Type_Product || !Category) {
        return res.status(400).render('product/create', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Create Product',
        });
    }

    const payloads = {
        Product_Name: Product_Name.toLowerCase(),
        Type_Product: Type_Product.toLowerCase(),
        Category: Category.toLowerCase(),
    };

    const query = `INSERT INTO product (Product_Name,Type_Product,category) VALUES  ('${payloads.Product_Name}','${payloads.Type_Product}','${payloads.Category}')`;
    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan produk');
        }
        res.status(200).redirect('/products');
    });
});

router.get('/products/edit/:id', function (req, res) {
    const { id } = req.params;
    db.query(
        `SELECT * FROM product WHERE ID_Product = ${id}`,
        (err, result) => {
            res.render('product/edit', {
                title: 'Warehouse | Edit Product',
                message: '',
                product: result[0],
            });
        }
    );
});

router.post('/products/edit/:id', function (req, res) {
    const { id } = req.params;
    const { Product_Name, Type_Product, Category } = req.body;

    if (!Product_Name || !Type_Product || !Category) {
        return res.status(400).render('product/edit', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Edit Product',
            product: {
                ID_Product: id,
                Product_Name,
                Type_Product,
                Category,
            },
        });
    }

    const payloads = {
        Product_Name: Product_Name.toLowerCase(),
        Type_Product: Type_Product.toLowerCase(),
        Category: Category.toLowerCase(),
    };

    const query = `UPDATE product SET ? WHERE ID_Product = ${id}`;
    db.query(
        {
            sql: query,
            values: {
                Product_Name: payloads.Product_Name,
                Type_Product: payloads.Type_Product,
                Category: payloads.Category,
            },
        },
        (err, _) => {
            if (err) {
                return res
                    .status(500)
                    .send('Terjadi kesalahan dalam penambahan produk');
            }
            res.status(200).redirect('/products');
        }
    );
});

router.post('/products/delete/:id', function (req, res) {
    const { id } = req.params;

    const query = `DELETE FROM product WHERE ID_Product = ${id}`;

    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan produk');
        }
        res.status(200).redirect('/products');
    });
});

module.exports = router;
