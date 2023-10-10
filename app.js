
let express = require('express');
const { Client } = require('pg');

let app = express();

const conn = new Client({
    user: 'postgres',
    password: 'Employee@System123',
    database: 'postgres',
    port: 5432,
    host: 'db.mbelawzwvclvwgrdaqtr.supabase.co',
    ssl: { rejectUnauthorized: false },
});
conn.connect(function (res, err) {
    console.log('Database Connected');
});

app.use(express.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

const port = 5000;

app.listen(port, () => console.log(`Server is listening on port ${port}`));

app.get('/mobiles', function (req, res) {
    let { brand, RAM, ROM, OS } = req.query;

    let sql = 'SELECT * from mobiles ';
    let sql2 = 'WHERE ';
    const conditions = [];
    if (brand) {
         conditions.push({ column: 'brand', value: brand });
        let brandArr = brand.split(',');
        let brandQuery = brandArr.map((a) => `brand = '${a}' `);
        //console.log(brandQuery);
        sql2 = sql2 + brandQuery.join(' OR ');
        //console.log(sql2);     
    }
    if (RAM) {
        conditions.push({ column: 'RAM', value: RAM });
        let arr = RAM.split(',');
        let query = arr.map((a) => `RAM = '${a}' `);
        sql2 = sql2 + (brand ? ' AND ' : '') + query.join(' OR ');
    }
    if (ROM) {
        conditions.push({ column: 'ROM', value: ROM });
        let arr = ROM.split(',');
        let query = arr.map((a) => `ROM = '${a}' `);
       sql2 = sql2 + ((brand || RAM) ? ' AND ' : '') + query.join(' OR ');
    }
    if (OS) {
         conditions.push({ column: 'OS', value: OS });
        let arr = OS.split(',');
        let query = arr.map((a) => `OS = '${a}' `);
        sql2 = sql2 + ((brand || RAM || ROM) ? ' AND ' : '') + query.join(' OR ');
    }
    if (conditions.length > 0) {
        sql = sql + sql2;
    }
    conn.query(sql, function (err, results) {
        if (err) {
          res.status(500).json({ error: 'Database Error', message: err.message });
        } else {
            res.json(results.rows);
        }
    });

});


app.post('/mobiles', function (req, res) {
    let { name, price, brand, RAM, ROM, OS } = req.body;
    let values = [name, price, brand, RAM, ROM, OS];
    let sql = 'INSERT INTO mobiles (name,price,brand,RAM,ROM,OS) VALUES ($1,$2,$3,$4,$5,$6) ';
    conn.query(sql,values, function (err, results) {
        if (err) {
            res.status(500).json({ error: 'Database Error', message: err.message });
        } else {
            res.json({message:`Successfully Inserted :,`});
        }
    });
});
app.put('/mobiles/:id', function (req, res) {
    let { id } = req.params;
    let { name, price, brand, RAM, ROM, OS } = req.body;
    let values = [name, price, brand, RAM, ROM, OS,id];
    let sql = `UPDATE mobiles 
                SET name = $1, price = $2, brand=$3, RAM=$4, ROM=$5, OS=$6 
                WHERE id =$7
                `;
    conn.query(sql,values, function (err, results) {
        if (err) {
            res.status(500).json({ error: 'Database Error', message: err.message });
        } else {
            res.json({message:`Successfully Updated `});
        }
    });
});
app.delete('/mobiles/:id', function (req, res) {
    let id = req.params.id;
    let sql = 'DELETE FROM mobiles WHERE id=$1 ';
    conn.query(sql,[id], function (err, results) {
        if (err) {
            res.status(500).json({ error: 'Database Error', message: err.message });
        } else {
            res.json({message:`Successfully DELETED`});
        }
    });
});

