const express = require('express');
const db = require('../database/config');
const router = express.Router();

router.get('/receivings', function (req, res, next) {
    db.query(
        'SELECT ID_Receiving, Date_Time, warehouse.warehouse_name, Kuantity_Product, Note FROM receiving INNER JOIN warehouse ON warehouse.ID_Warehouse = receiving.ID_Warehouse',
        (err, data) => {
            console.log('data', data);
            if (err) throw err;
            res.render('receiving/index', {
                title: 'Warehouse | receiving',
                data,
            });
        }
    );
});

router.get('/receivings/detail/:id', function (req, res, next) {
    const { id } = req.params;
    db.query(
        `SELECT ID_Receiving, Date_Time, warehouse.warehouse_name, Kuantity_Product, Note FROM receiving INNER JOIN warehouse ON warehouse.ID_Warehouse = receiving.ID_Warehouse WHERE ID_Receiving = ${id}`,
        (err, data) => {
            console.log('data', data);
            if (err) throw err;
            res.render('receiving/detail', {
                title: 'Warehouse | Detail receiving',
                data: data[0],
            });
        }
    );
});

router.get('/receivings/create', async function (req, res) {
    const tempWarehouse = [];

    const warehouseQuery = () =>
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
    await warehouseQuery();

    res.render('receiving/create', {
        title: 'Warehouse | Create receiving',
        message: '',
        warehouse: tempWarehouse,
    });
});

router.post('/receivings', async function (req, res) {
    const tempWarehouse = [];

    const warehouseQuery = () =>
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
    await warehouseQuery();

    const { Date_Time, ID_Warehouse, Kuantity_Product, Note } = req.body;

    if (!Date_Time || !ID_Warehouse || !Kuantity_Product || !Note) {
        return res.status(400).render('receiving/create', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Create receiving',
            warehouse: tempWarehouse,
        });
    }

    const payloads = {
        Date_Time: Date_Time.toLowerCase(),
        ID_Warehouse: ID_Warehouse.toLowerCase(),
        Kuantity_Product: Kuantity_Product.toLowerCase(),
        Note: Note.toLowerCase(),
    };
    const query = `INSERT INTO receiving (Date_Time, ID_Warehouse,Kuantity_Product,Note) VALUES  ('${payloads.Date_Time}','${payloads.ID_Warehouse}','${payloads.Kuantity_Product}','${payloads.Note}')`;

    db.query(query, (err, _) => {
        console.log(err);
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan receiving');
        }
        res.status(200).redirect('/receivings');
    });
});

router.get('/receivings/edit/:id', async function (req, res) {
    const tempWarehouse = [];

    const warehouseQuery = () =>
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
    await warehouseQuery();

    const { id } = req.params;
    db.query(
        `SELECT ID_Receiving, Date_Time, warehouse.warehouse_name, Kuantity_Product, Note FROM receiving INNER JOIN warehouse ON warehouse.ID_Warehouse = receiving.ID_Warehouse WHERE ID_Receiving = ${id}`,
        (err, result) => {
            res.render('receiving/edit', {
                title: 'Warehouse | Edit receiving',
                message: '',
                receiving: result[0],
                warehouse: tempWarehouse,
            });
        }
    );
});

router.post('/receivings/edit/:id', function (req, res) {
    const { id } = req.params;
    const { date_time, id_warehouse, kuantity_product, note } = req.body;

    if (!date_time || !id_warehouse || !kuantity_product || !note) {
        return res.status(400).render('receiving/edit', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Edit receiving',
            receiving: {
                ID_Receiving: id,
                date_time,
                id_warehouse,
                kuantity_product,
                note,
            },
        });
    }

    const payloads = {
        date_time: date_time.toLowerCase(),
        id_warehouse: id_warehouse.toLowerCase(),
        kuantity_product: kuantity_product.toLowerCase(),
        note: note.toLowerCase(),
    };

    const query = `UPDATE receiving SET ? WHERE ID_Receiving = ${id}`;
    db.query(
        {
            sql: query,
            values: {
                date_time: payloads.date_time,
                id_warehouse: payloads.id_warehouse,
                kuantity_product: payloads.kuantity_product,
                note: payloads.note,
            },
        },
        (err, _) => {
            if (err) {
                return res
                    .status(500)
                    .send('Terjadi kesalahan dalam penambahan receiving');
            }
            res.status(200).redirect('/receivings');
        }
    );
});

router.post('/receivings/delete/:id', function (req, res) {
    const { id } = req.params;

    const query = `DELETE FROM receiving WHERE ID_Receiving = ${id}`;

    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan receiving');
        }
        res.status(200).redirect('/receivings');
    });
});

module.exports = router;
