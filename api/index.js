
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

app.use(cors());
app.use(express.json()); // Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.static(path.join(__dirname, 'public'))); // Directorio público para archivos estáticos

app.get('/reservas', (req, res) => {
  pool.query('SELECT fecha FROM reserva', (err, result) => {
    if (err) {
      console.error('Error al obtener reservas de la base de datos', err);
      res.status(500).send('Error al obtener reservas');
    } else {
      const reservations = result.rows.map(row => row.fecha.toISOString().split('T')[0]);
      res.json(reservations);
    }
  });
});

app.post('/reservas', (req, res) => {
  const { fecha, cantidadPersonas, servicio } = req.body;
  const values = [fecha, cantidadPersonas, servicio];

  pool.query(
    'INSERT INTO reserva (fecha, cantidadpersonas, servicio) VALUES ($1, $2, $3) RETURNING *',
    values,
    (err, result) => {
      if (err) {
        console.error('Error al insertar reserva en la base de datos', err);
        res.status(500).send('Error al insertar reserva');
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});

