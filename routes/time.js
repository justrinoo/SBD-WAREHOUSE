const express = require('express');
const moment = require('moment');
const db = require('../database/config');
const router = express.Router();
moment.locale('id');

router.get('/time', function (req, res, next) {
    db.query('SELECT * FROM time', (err, data) => {
        if (err) throw err;
        const parseTime = data?.map((time) => {
            const newTime = {
                ...time,
                timeAndDate: moment(time.timeAndDate).format('LLLL'),
            };
            return newTime;
        });
        res.render('time/index', {
            title: 'Warehouse | Waktu',
            data: parseTime,
        });
    });
});

router.get('/time/detail/:id', function (req, res, next) {
    const { id } = req.params;
    db.query(`SELECT * FROM time WHERE time_id = ${id}`, (err, data) => {
        if (err) throw err;
        res.render('time/detail', {
            title: 'Warehouse | Detail Waktu',
            data: data[0],
        });
    });
});

router.get('/time/create', function (req, res) {
    res.render('time/create', {
        title: 'Warehouse | Buat Waktu',
        message: '',
    });
});

router.post('/time', function (req, res) {
    const { timeAndDate } = req.body;

    if (!timeAndDate) {
        return res.status(400).render('time/create', {
            message: 'field tanggal harus di isi!',
            title: 'Warehouse | Buat Waktu',
        });
    }

    const hours = new Date().getHours();
    const minute = new Date().getMinutes();

    const newTime = `${timeAndDate} ${hours}:${minute}`;

    const payloads = {
        timeAndDate: newTime,
    };

    const query = `INSERT INTO time (timeAndDate) VALUES  ('${payloads.timeAndDate}')`;
    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan time');
        }
        res.status(200).redirect('/time');
    });
});

router.get('/time/edit/:id', function (req, res) {
    const { id } = req.params;
    db.query(`SELECT * FROM time WHERE time_id = ${id}`, (err, result) => {
        const parseTime = result.map((time) => {
            const newTime = {
                ...time,
                timeAndDate: time.timeAndDate.split(' ')[0],
            };
            return newTime;
        });

        res.render('time/edit', {
            title: 'Warehouse | Ubah Waktu',
            message: '',
            time: parseTime[0],
        });
    });
});

router.post('/time/edit/:id', function (req, res) {
    const { id } = req.params;
    const { timeAndDate } = req.body;

    if (!timeAndDate) {
        return res.status(400).render('time/edit', {
            message: 'field tanggal harus di isi!',
            title: 'Warehouse | Ubah Waktu',
            time: {
                time_id: id,
                timeAndDate,
            },
        });
    }

    const hours = new Date().getHours();
    const minute = new Date().getMinutes();

    const newTime = `${timeAndDate} ${hours}:${minute}`;

    const payloads = {
        timeAndDate: newTime,
    };

    const query = `UPDATE time SET ? WHERE time_id = ${id}`;
    db.query(
        {
            sql: query,
            values: {
                timeAndDate: payloads.timeAndDate,
            },
        },
        (err, _) => {
            if (err) {
                return res
                    .status(500)
                    .send('Terjadi kesalahan dalam penambahan time');
            }
            res.status(200).redirect('/time');
        }
    );
});

router.post('/time/delete/:id', function (req, res) {
    const { id } = req.params;

    const query = `DELETE FROM time WHERE time_id = ${id}`;

    db.query(query, (err, _) => {
        if (err) {
            return res
                .status(500)
                .send('Terjadi kesalahan dalam penambahan time');
        }
        res.status(200).redirect('/time');
    });
});

module.exports = router;
