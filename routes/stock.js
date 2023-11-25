const express = require('express');
const moment = require('moment');
const db = require('../database/config');
const router = express.Router();
moment.locale('id');

router.get('/stock', function (req, res, next) {
    db.query(
        'SELECT stock.stock_id, product.product_name, stock.quantity_in_stock, supplier.supplier_name, warehouse.warehouse_name, time.timeAndDate FROM stock INNER JOIN product ON product.product_id = stock.product_id INNER JOIN supplier ON supplier.supplier_id = stock.supplier_id INNER JOIN warehouse ON warehouse.warehouse_id = stock.warehouse_id INNER JOIN time ON time.time_id = stock.time_id',
        (err, data) => {
            const newData = data?.map((stock) => {
                const newTime = {
                    ...stock,
                    timeAndDate: moment(stock.timeAndDate).format('LLLL'),
                };
                return newTime;
            });

            if (err) throw err;
            res.render('stock/index', {
                title: 'Warehouse | stock',
                data: newData,
            });
        }
    );
});

router.get('/stock/detail/:id', function (req, res, next) {
    const { id } = req.params;
    db.query(`SELECT * FROM stock WHERE stock_id = ${id}`, (err, data) => {
        if (err) throw err;
        res.render('stock/detail', {
            title: 'Warehouse | Detail stock',
            data: data[0],
        });
    });
});

router.get('/stock/create', async function (req, res) {
    try {
        const tempProducts = [];
        const tempSuppliers = [];
        const tempWarehouse = [];
        const tempTime = [];

        const productQuery = () =>
            new Promise((resolve, reject) => {
                db.query('SELECT * FROM product', (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        tempProducts.push(...result);
                        resolve(result);
                    }
                });
            });
        const SupplierQuery = () =>
            new Promise((resolve, reject) => {
                db.query('SELECT * FROM supplier', (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        tempSuppliers.push(...result);
                        resolve(result);
                    }
                });
            });
        const wareHouseQuery = () =>
            new Promise((resolve, reject) => {
                db.query('SELECT * FROM warehouse', (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        tempWarehouse.push(...result);
                        resolve(result);
                    }
                });
            });
        const timeQuery = () =>
            new Promise((resolve, reject) => {
                db.query('SELECT * FROM time', (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        const data = result?.map((time) => {
                            const newTime = {
                                ...time,
                                timeAndDate: moment(time.timeAndDate).format(
                                    'LLLL'
                                ),
                            };
                            return newTime;
                        });
                        tempTime.push(...data);
                        resolve(result);
                    }
                });
            });

        await productQuery();
        await SupplierQuery();
        await wareHouseQuery();
        await timeQuery();

        res.render('stock/create', {
            title: 'Warehouse | Create stock',
            message: '',
            products: tempProducts,
            supplier: tempSuppliers,
            warehouse: tempWarehouse,
            time: tempTime,
        });
    } catch (error) {
        console.log('error', error);
    }
});

router.post('/stock', async function (req, res) {
    try {
        const tempProducts = [];
        const tempSuppliers = [];
        const tempWarehouse = [];
        const tempTime = [];

        const productQuery = () =>
            new Promise((resolve, reject) => {
                db.query('SELECT * FROM product', (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        tempProducts.push(...result);
                        resolve(result);
                    }
                });
            });
        const SupplierQuery = () =>
            new Promise((resolve, reject) => {
                db.query('SELECT * FROM supplier', (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        tempSuppliers.push(...result);
                        resolve(result);
                    }
                });
            });
        const wareHouseQuery = () =>
            new Promise((resolve, reject) => {
                db.query('SELECT * FROM warehouse', (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        tempWarehouse.push(...result);
                        resolve(result);
                    }
                });
            });
        const timeQuery = () =>
            new Promise((resolve, reject) => {
                db.query('SELECT * FROM time', (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        const data = result?.map((time) => {
                            const newTime = {
                                ...time,
                                timeAndDate: moment(time.timeAndDate).format(
                                    'LLLL'
                                ),
                            };
                            return newTime;
                        });
                        tempTime.push(...data);
                        resolve(result);
                    }
                });
            });

        await productQuery();
        await SupplierQuery();
        await wareHouseQuery();
        await timeQuery();

        const {
            product_id,
            supplier_id,
            warehouse_id,
            time_id,
            quantity_in_stock,
        } = req.body;

        if (
            !product_id ||
            !supplier_id ||
            !warehouse_id ||
            !time_id ||
            !quantity_in_stock
        ) {
            return res.status(400).render('stock/create', {
                message: 'Semua field harus di isi!',
                title: 'Warehouse | Create stock',
                products: tempProducts,
                supplier: tempSuppliers,
                warehouse: tempWarehouse,
                time: tempTime,
            });
        }

        const payloads = {
            product_id,
            supplier_id,
            warehouse_id,
            time_id,
            quantity_in_stock,
        };

        const query = `INSERT INTO stock (product_id, supplier_id, warehouse_id, time_id, quantity_in_stock) VALUES  ('${payloads.product_id}','${payloads.supplier_id}','${payloads.warehouse_id}', '${payloads.time_id}', '${payloads.quantity_in_stock}')`;
        db.query(query, (err, _) => {
            console.log('err', err);
            if (err) {
                return res
                    .status(500)
                    .send('Terjadi kesalahan dalam penambahan stock');
            }
            res.status(200).redirect('/stock');
        });
    } catch (error) {
        console.log('error', error);
    }
});

router.get('/stock/edit/:id', function (req, res) {
    const { id } = req.params;
    db.query(`SELECT * FROM stock WHERE stock_id = ${id}`, (err, result) => {
        res.render('stock/edit', {
            title: 'Warehouse | Edit stock',
            message: '',
            stock: result[0],
        });
    });
});

router.post('/stock/edit/:id', function (req, res) {
    const { id } = req.params;
    const { stock_name, category, brand } = req.body;

    if (!stock_name || !category || !brand) {
        return res.status(400).render('stock/edit', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Edit stock',
            stock: {
                stock_id: id,
                stock_name,
                category,
                brand,
            },
        });
    }

    const payloads = {
        stock_name: stock_name.toLowerCase(),
        category: category.toLowerCase(),
        brand: brand.toLowerCase(),
    };

    const query = `UPDATE stock SET ? WHERE stock_id = ${id}`;
    db.query(
        {
            sql: query,
            values: {
                stock_name: payloads.stock_name,
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
            res.status(200).redirect('/stock');
        }
    );
});

router.post('/stock/delete/:id', function (req, res) {
    const { id } = req.params;

    const query = `DELETE FROM stock WHERE stock_id = ${id}`;

    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan produk');
        }
        res.status(200).redirect('/stock');
    });
});

module.exports = router;
