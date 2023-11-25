const express = require('express');
const db = require('../database/config');
const router = express.Router();

router.get('/warehouse', function (req, res, next) {
    db.query('SELECT * FROM warehouse', (err, data) => {
        if (err) throw err;
        res.render('warehouse/index', {
            title: 'Warehouse | Gudang',
            data,
        });
    });
});

router.get('/warehouse/detail/:id', function (req, res, next) {
    const { id } = req.params;
    db.query(
        `SELECT * FROM warehouse WHERE warehouse_id = ${id}`,
        (err, data) => {
            if (err) throw err;
            res.render('warehouse/detail', {
                title: 'Warehouse | Detail warehouse',
                data: data[0],
            });
        }
    );
});

router.get('/warehouse/create', function (req, res) {
    res.render('warehouse/create', {
        title: 'Warehouse | Create Gudang',
        message: '',
    });
});

router.post('/warehouse', function (req, res) {
    const { warehouse_name, location, warehouse_manager } = req.body;

    if (!warehouse_name || !location || !warehouse_manager) {
        return res.status(400).render('warehouse/create', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Create Gudang',
        });
    }

    const payloads = {
        warehouse_name: warehouse_name.toLowerCase(),
        location: location.toLowerCase(),
        warehouse_manager: warehouse_manager.toLowerCase(),
    };

    const query = `INSERT INTO warehouse (warehouse_name,location,warehouse_manager) VALUES  ('${payloads.warehouse_name}','${payloads.location}','${payloads.warehouse_manager}')`;
    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan warehouse');
        }
        res.status(200).redirect('/warehouse');
    });
});

router.get('/warehouse/edit/:id', function (req, res) {
    const { id } = req.params;
    db.query(
        `SELECT * FROM warehouse WHERE warehouse_id = ${id}`,
        (err, result) => {
            res.render('warehouse/edit', {
                title: 'Warehouse | Edit Gudang',
                message: '',
                warehouse: result[0],
            });
        }
    );
});

router.post('/warehouse/edit/:id', function (req, res) {
    const { id } = req.params;
    const { warehouse_name, location, warehouse_manager } = req.body;

    if (!warehouse_name || !location || !warehouse_manager) {
        return res.status(400).render('warehouse/edit', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Edit Gudang',
            warehouse: {
                warehouse_id: id,
                warehouse_name,
                location,
                warehouse_manager,
            },
        });
    }

    const payloads = {
        warehouse_name: warehouse_name.toLowerCase(),
        location: location.toLowerCase(),
        warehouse_manager: warehouse_manager.toLowerCase(),
    };

    const query = `UPDATE warehouse SET ? WHERE warehouse_id = ${id}`;
    db.query(
        {
            sql: query,
            values: {
                warehouse_name: payloads.warehouse_name,
                location: payloads.location,
                warehouse_manager: payloads.warehouse_manager,
            },
        },
        (err, _) => {
            if (err) {
                return res
                    .status(500)
                    .send('Terjadi kesalahan dalam penambahan warehouse');
            }
            res.status(200).redirect('/warehouse');
        }
    );
});

router.post('/warehouse/delete/:id', function (req, res) {
    const { id } = req.params;

    const query = `DELETE FROM warehouse WHERE warehouse_id = ${id}`;

    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan warehouse');
        }
        res.status(200).redirect('/warehouse');
    });
});

module.exports = router;
