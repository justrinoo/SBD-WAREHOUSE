const express = require('express');
const db = require('../database/config');
const router = express.Router();

router.get('/vendors', function (req, res, next) {
    db.query('SELECT * FROM vendor', (err, data) => {
        if (err) throw err;
        res.render('vendor/index', {
            title: 'Warehouse | vendor',
            data,
        });
    });
});

router.get('/vendors/detail/:id', function (req, res, next) {
    const { id } = req.params;
    db.query(`SELECT * FROM vendor WHERE ID_Vendor = ${id}`, (err, data) => {
        if (err) throw err;
        res.render('vendor/detail', {
            title: 'Warehouse | Detail vendor',
            data: data[0],
        });
    });
});

router.get('/vendors/create', function (req, res) {
    res.render('vendor/create', {
        title: 'Warehouse | Create vendor',
        message: '',
    });
});

router.post('/vendors', function (req, res) {
    const { company_name, email, pic, contact } = req.body;

    if (!company_name || !email || !pic || !contact) {
        return res.status(400).render('vendor/create', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Create vendor',
        });
    }

    const payloads = {
        company_name: company_name.toLowerCase(),
        email: email.toLowerCase(),
        pic: pic.toLowerCase(),
        contact: contact.toLowerCase(),
    };

    const query = `INSERT INTO vendor (company_name,email,pic,contact) VALUES  ('${payloads.company_name}','${payloads.email}','${payloads.pic}','${payloads.contact}')`;
    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan vendor');
        }
        res.status(200).redirect('/vendors');
    });
});

router.get('/vendors/edit/:id', function (req, res) {
    const { id } = req.params;
    db.query(`SELECT * FROM vendor WHERE ID_Vendor = ${id}`, (err, result) => {
        res.render('vendor/edit', {
            title: 'Warehouse | Edit vendor',
            message: '',
            vendor: result[0],
        });
    });
});

router.post('/vendors/edit/:id', function (req, res) {
    const { id } = req.params;
    const { company_name, email, pic, contact } = req.body;

    if (!company_name || !email || !pic || !contact) {
        return res.status(400).render('vendor/edit', {
            message: 'Semua field harus di isi!',
            title: 'Warehouse | Edit vendor',
            vendor: {
                ID_Vendor: id,
                company_name,
                email,
                pic,
                contact,
            },
        });
    }

    const payloads = {
        company_name: company_name.toLowerCase(),
        email: email.toLowerCase(),
        pic: pic.toLowerCase(),
        contact: contact.toLowerCase(),
    };

    const query = `UPDATE vendor SET ? WHERE ID_Vendor = ${id}`;
    db.query(
        {
            sql: query,
            values: {
                company_name: payloads.company_name,
                email: payloads.email,
                pic: payloads.pic,
                contact: payloads.contact,
            },
        },
        (err, _) => {
            if (err) {
                return res
                    .status(500)
                    .send('Terjadi kesalahan dalam penambahan vendor');
            }
            res.status(200).redirect('/vendors');
        }
    );
});

router.post('/vendors/delete/:id', function (req, res) {
    const { id } = req.params;

    const query = `DELETE FROM vendor WHERE ID_Vendor = ${id}`;

    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan vendor');
        }
        res.status(200).redirect('/vendors');
    });
});

module.exports = router;
