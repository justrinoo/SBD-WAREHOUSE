const express = require('express');
const moment = require('moment');
const db = require('../database/config');
const router = express.Router();
moment.locale('id');

router.get('/stock', function (req, res, next) {
	db.query(
		'SELECT ID_Stock, receiving.Kuantity_Product, stock.Stock_Balance, product.Product_Name, vendor.company_name, warehouse.warehouse_name FROM stock JOIN product ON product.ID_Product = stock.ID_Product JOIN vendor ON vendor.ID_Vendor = stock.ID_Vendor JOIN warehouse ON warehouse.ID_Warehouse = stock.ID_Warehouse JOIN receiving ON receiving.ID_Receiving = stock.ID_Receiving',
		(err, result) => {
			console.log(result);
			if (err) {
				throw new Error(err);
			}
			res.render('stock/index', {
				title: 'Warehouse | Stock',
				message: '',
				data: result,
			});
		},
	);
});

router.get('/stocks/detail/:id', function (req, res, next) {
	const { id } = req.params;
	db.query(
		`SELECT ID_Stock, stock.Kuantity_Product, stock.Stock_Balance, product.Product_Name, vendor.company_name, warehouse.warehouse_name FROM stock JOIN product ON product.ID_Product = stock.ID_Product JOIN vendor ON vendor.ID_Vendor = stock.ID_Vendor JOIN warehouse ON warehouse.ID_Warehouse = stock.ID_Warehouse WHERE ID_Stock = ${id}`,
		(err, data) => {
			if (err) throw err;
			res.render('stock/detail', {
				title: 'Warehouse | Detail stock',
				data: data[0],
			});
		},
	);
});

router.get('/stock/create', async function (req, res) {
	try {
		const tempProducts = [];
		const tempvendors = [];
		const tempWarehouse = [];
		const tempReceiving = [];

		const productQuery = () =>
			new Promise((resolve, reject) => {
				db.query(
					'SELECT * FROM product',
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							tempProducts.push(...result);
							resolve(result);
						}
					},
				);
			});
		const VendorQuery = () =>
			new Promise((resolve, reject) => {
				db.query(
					'SELECT * FROM vendor',
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							tempvendors.push(...result);
							resolve(result);
						}
					},
				);
			});
		const wareHouseQuery = () =>
			new Promise((resolve, reject) => {
				db.query(
					'SELECT * FROM warehouse',
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							tempWarehouse.push(...result);
							resolve(result);
						}
					},
				);
			});
		const receivingQuery = () =>
			new Promise((resolve, reject) => {
				db.query(
					'SELECT * FROM receiving',
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							tempReceiving.push(...result);
							resolve(result);
						}
					},
				);
			});

		await productQuery();
		await VendorQuery();
		await wareHouseQuery();
		await receivingQuery();

		res.render('stock/create', {
			title: 'Warehouse | Create stock',
			message: '',
			products: tempProducts,
			vendor: tempvendors,
			warehouse: tempWarehouse,
			receiving: tempReceiving,
		});
	} catch (error) {
		throw new Error(error.response);
	}
});

router.post('/stock', async function (req, res) {
	try {
		const tempProducts = [];
		const tempvendors = [];
		const tempWarehouse = [];
		const tempReceiving = [];

		const productQuery = () =>
			new Promise((resolve, reject) => {
				db.query(
					'SELECT * FROM product',
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							tempProducts.push(...result);
							resolve(result);
						}
					},
				);
			});
		const VendorQuery = () =>
			new Promise((resolve, reject) => {
				db.query(
					'SELECT * FROM vendor',
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							tempvendors.push(...result);
							resolve(result);
						}
					},
				);
			});
		const wareHouseQuery = () =>
			new Promise((resolve, reject) => {
				db.query(
					'SELECT * FROM warehouse',
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							tempWarehouse.push(...result);
							resolve(result);
						}
					},
				);
			});
		const receivingQuery = () =>
			new Promise((resolve, reject) => {
				db.query(
					'SELECT * FROM receiving',
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							tempReceiving.push(...result);
							resolve(result);
						}
					},
				);
			});

		await productQuery();
		await VendorQuery();
		await wareHouseQuery();
		await receivingQuery();

		const {
			ID_Vendor,
			ID_Product,
			ID_Warehouse,
			// ID_Receiving,
			Stock_Balance,
		} = req.body;

		if (
			!ID_Vendor ||
			!ID_Product ||
			!ID_Warehouse ||
			// !ID_Receiving ||
			!Stock_Balance
		) {
			return res.status(400).render('stock/create', {
				message: 'Semua field harus di isi!',
				title: 'Warehouse | Create stock',
				products: tempProducts,
				vendor: tempvendors,
				warehouse: tempWarehouse,
				receiving: tempReceiving,
			});
		}

		const payloads = {
			ID_Vendor: ID_Vendor,
			ID_Product: ID_Product,
			ID_Warehouse: ID_Warehouse,
			// ID_Receiving: ID_Receiving,
			Stock_Balance,
		};

		const query = `INSERT INTO stock (ID_Vendor, ID_Product,  ID_Warehouse, ID_Receiving, Stock_Balance) VALUES  ('${
			payloads.ID_Vendor
		}','${payloads.ID_Product}','${
			payloads.ID_Warehouse
		}', '${payloads.ID_Receiving ?? 1}', '${
			payloads.Stock_Balance
		}')`;
		db.query(query, (err, _) => {
			if (err) {
				return res
					.status(500)
					.send('Terjadi kesalahan dalam penambahan stock');
			}
			res.status(200).redirect('/stock');
		});
	} catch (error) {
		// console.log('error', error);
	}
});

router.get('/stock/edit/:id', function (req, res) {
	const { id } = req.params;
	db.query(
		`SELECT * FROM stock WHERE stock_id = ${id}`,
		(err, result) => {
			res.render('stock/edit', {
				title: 'Warehouse | Edit stock',
				message: '',
				stock: result[0],
			});
		},
	);
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
					.send(
						'Terjadi kesalahan dalam penambahan produk',
					);
			}
			res.status(200).redirect('/stock');
		},
	);
});

router.post('/stock/delete/:id', function (req, res) {
	const { id } = req.params;

	const query = `DELETE FROM stock WHERE ID_Stock = ${id}`;

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
