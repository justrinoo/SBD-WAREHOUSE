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
    db.query(`SELECT * FROM product WHERE product_id = ${id}`, (err, data) => {
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
    const { product_name, category, brand } = req.body;

    if (!product_name || !category || !brand) {
        return res.status(400).render('product/create', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Create Product',
        });
    }

    const payloads = {
        product_name: product_name.toLowerCase(),
        category: category.toLowerCase(),
        brand: brand.toLowerCase(),
    };

    const query = `INSERT INTO product (product_name,category,brand) VALUES  ('${payloads.product_name}','${payloads.category}','${payloads.brand}')`;
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
        `SELECT * FROM product WHERE product_id = ${id}`,
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
    const { product_name, category, brand } = req.body;

    if (!product_name || !category || !brand) {
        return res.status(400).render('product/edit', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Edit Product',
            product: {
                product_id: id,
                product_name,
                category,
                brand,
            },
        });
    }

    const payloads = {
        product_name: product_name.toLowerCase(),
        category: category.toLowerCase(),
        brand: brand.toLowerCase(),
    };

    const query = `UPDATE product SET ? WHERE product_id = ${id}`;
    db.query(
        {
            sql: query,
            values: {
                product_name: payloads.product_name,
                category: payloads.category,
                brand: payloads.brand,
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

    const query = `DELETE FROM product WHERE product_id = ${id}`;

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
