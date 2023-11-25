const express = require('express');
const db = require('../database/config');
const router = express.Router();

router.get('/suppliers', function (req, res, next) {
    db.query('SELECT * FROM supplier', (err, data) => {
        if (err) throw err;
        res.render('supplier/index', {
            title: 'Warehouse | Supplier',
            data,
        });
    });
});

router.get('/suppliers/detail/:id', function (req, res, next) {
    const { id } = req.params;
    db.query(
        `SELECT * FROM supplier WHERE supplier_id = ${id}`,
        (err, data) => {
            if (err) throw err;
            res.render('supplier/detail', {
                title: 'Warehouse | Detail Supplier',
                data: data[0],
            });
        }
    );
});

router.get('/suppliers/create', function (req, res) {
    res.render('supplier/create', {
        title: 'Warehouse | Create Supplier',
        message: '',
    });
});

router.post('/suppliers', function (req, res) {
    const { supplier_name, contact_person, contact_email } = req.body;

    if (!supplier_name || !contact_person || !contact_email) {
        return res.status(400).render('supplier/create', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Create Supplier',
        });
    }

    const payloads = {
        supplier_name: supplier_name.toLowerCase(),
        contact_person: contact_person.toLowerCase(),
        contact_email: contact_email.toLowerCase(),
    };

    const query = `INSERT INTO supplier (supplier_name,contact_person,contact_email) VALUES  ('${payloads.supplier_name}','${payloads.contact_person}','${payloads.contact_email}')`;
    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan supplier');
        }
        res.status(200).redirect('/suppliers');
    });
});

router.get('/suppliers/edit/:id', function (req, res) {
    const { id } = req.params;
    db.query(
        `SELECT * FROM supplier WHERE supplier_id = ${id}`,
        (err, result) => {
            res.render('supplier/edit', {
                title: 'Warehouse | Edit Supplier',
                message: '',
                supplier: result[0],
            });
        }
    );
});

router.post('/suppliers/edit/:id', function (req, res) {
    const { id } = req.params;
    const { supplier_name, contact_person, contact_email } = req.body;

    if (!supplier_name || !contact_person || !contact_email) {
        return res.status(400).render('supplier/edit', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Edit Supplier',
            supplier: {
                supplier_id: id,
                supplier_name,
                contact_person,
                contact_email,
            },
        });
    }

    const payloads = {
        supplier_name: supplier_name.toLowerCase(),
        contact_person: contact_person.toLowerCase(),
        contact_email: contact_email.toLowerCase(),
    };

    const query = `UPDATE supplier SET ? WHERE supplier_id = ${id}`;
    db.query(
        {
            sql: query,
            values: {
                supplier_name: payloads.supplier_name,
                contact_person: payloads.contact_person,
                contact_email: payloads.contact_email,
            },
        },
        (err, _) => {
            if (err) {
                return res
                    .status(500)
                    .send('Terjadi kesalahan dalam penambahan supplier');
            }
            res.status(200).redirect('/suppliers');
        }
    );
});

router.post('/suppliers/delete/:id', function (req, res) {
    const { id } = req.params;

    const query = `DELETE FROM supplier WHERE supplier_id = ${id}`;

    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan supplier');
        }
        res.status(200).redirect('/suppliers');
    });
});

module.exports = router;
