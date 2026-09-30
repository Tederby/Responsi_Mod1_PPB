const express = require('express');
const loanRoutes = require('./routes/loanRoutes');
const { isConfigured } = require('./config/supabase');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'REST API Layanan Pencatatan Peminjaman Buku Perpustakaan',
    status: 'online',
    supabase_configured: isConfigured(),
    endpoints: {
      getAllLoans: 'GET /loans',
      getLoansWithFilter: 'GET /loans?status=Terlambat',
      getLoanById: 'GET /loans/:id',
      createLoan: 'POST /loans',
      updateLoan: 'PUT /loans/:id',
      deleteLoan: 'DELETE /loans/:id'
    },
    documentation: 'Silakan baca file README.md untuk panduan lengkap & skema SQL'
  });
});

app.use('/loans', loanRoutes);
app.use('/api/loans', loanRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);

  if (statusCode >= 500 && statusCode !== 503) {
    console.error('Unhandled Server Error:', err);
  }

  if (err.code === '42P01') {
    return res.status(500).json({
      success: false,
      message: 'Tabel "loans" belum dibuat di Supabase. Jalankan query dari schema.sql di Supabase SQL Editor.',
      error: err.message
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server internal',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

module.exports = app;
