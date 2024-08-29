import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;

dotenv.config();
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

app.post('/login', async (req, res) => {
    const { username, password, bike } = req.body;
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(req.body.bike);

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );
        

        if (result.rows.length > 0) {
            if (username !== 'administrator') {
                const currentDate = new Date().toISOString().split('T')[0];
                console.log(currentDate);
                const client = await pool.connect();
                const logResult = await client.query(
                    'SELECT * FROM user_bike_logs WHERE username = $1 AND bike = $2 AND log_date = $3',
                    [username, bike, currentDate]
                );

                console.log(logResult.rows.length);

                if (logResult.rows.length == 0) {
                    await client.query(
                        'INSERT INTO user_bike_logs (username, bike, log_date, count) VALUES ($1, $2, $3, 0)',
                        [username, bike, currentDate]
                    );
                }

                client.release();
            }
            
            res.json({ message: 'Login successful', user: result.rows[0] });
        } else {
            
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/update-bike-log', async (req, res) => {
    const { username, bike } = req.body;
    const currentDate = new Date().toISOString().split('T')[0];
    console.log(currentDate);
    try {
        const result = await pool.query(
            'UPDATE user_bike_logs SET count = count + 1 WHERE username = $1 AND bike = $2 AND log_date = $3',
            [username, bike, currentDate]
        );

        if (result.rowCount > 0) {
            res.json({ message: 'Bike log count updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update bike log count' });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/filter-logs', async (req, res) => {
    const { fromDate, toDate } = req.body;
    console.log(req.body.fromDate);
    console.log(req.body.toDate);
    try {
        const result = await pool.query(
            `SELECT 
                to_char(log_date, 'YYYY-MM-DD') AS log_date, 
                username, 
                SUM(
                    CASE
                        WHEN bike = 'Bike1' THEN count * 50
                        WHEN bike = 'Bike2' THEN count * 60
                        WHEN bike = 'Bike3' THEN count * 80
                        ELSE 0
                    END
                ) AS total_minutes,
                SUM(count) AS total_bikes,
                -- Convert total_minutes into hours and minutes
                FLOOR(SUM(
                    CASE
                        WHEN bike = 'Bike1' THEN count * 50
                        WHEN bike = 'Bike2' THEN count * 60
                        WHEN bike = 'Bike3' THEN count * 80
                        ELSE 0
                    END
                ) / 60) AS hours,
                MOD(SUM(
                    CASE
                        WHEN bike = 'Bike1' THEN count * 50
                        WHEN bike = 'Bike2' THEN count * 60
                        WHEN bike = 'Bike3' THEN count * 80
                        ELSE 0
                    END
                ), 60) AS minutes
            FROM user_bike_logs
            WHERE log_date BETWEEN $1 AND $2
            GROUP BY log_date, username
            HAVING SUM(count) > 0
            ORDER BY log_date ASC
            `,
            [fromDate, toDate]
        );

        res.json({ logs: result.rows });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
 
app.post('/filter-logs-dashboard', async (req, res) => {
    const { fromDate, toDate, username } = req.body;
    try {
        const result = await pool.query(
            `SELECT 
                to_char(log_date, 'YYYY-MM-DD') as log_date, 
                username, 
                SUM(
                    CASE
                        WHEN bike = 'Bike1' THEN count * 50
                        WHEN bike = 'Bike2' THEN count * 60
                        WHEN bike = 'Bike3' THEN count * 80
                        ELSE 0
                    END
                ) AS total_minutes,
                SUM(count) AS total_bikes,
                -- Convert total_minutes into hours and minutes
                FLOOR(SUM(
                    CASE
                        WHEN bike = 'Bike1' THEN count * 50
                        WHEN bike = 'Bike2' THEN count * 60
                        WHEN bike = 'Bike3' THEN count * 80
                        ELSE 0
                    END
                ) / 60) AS hours,
                MOD(SUM(
                    CASE
                        WHEN bike = 'Bike1' THEN count * 50
                        WHEN bike = 'Bike2' THEN count * 60
                        WHEN bike = 'Bike3' THEN count * 80
                        ELSE 0
                    END
                ), 60) AS minutes
            FROM user_bike_logs
            WHERE log_date BETWEEN $1 AND $2 AND username = $3
            GROUP BY log_date, username
            HAVING SUM(count) > 0
            ORDER BY log_date ASC
            `,
            [fromDate, toDate, username]
        );
        res.json({ logs: result.rows });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

