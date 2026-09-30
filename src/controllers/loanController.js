const LoanModel = require('../models/loanModel');

const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const getAllLoans = async (req, res, next) => {
  try {
    const { status, borrower_name, book_title, search } = req.query;

    const data = await LoanModel.findAll({
      status,
      borrower_name,
      book_title,
      search
    });

    return res.status(200).json({
      success: true,
      message: 'Data peminjaman berhasil diambil',
      total: data.length,
      filters: {
        status: status || null,
        search: search || null
      },
      data
    });
  } catch (error) {
    next(error);
  }
};

const getLoanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await LoanModel.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Data peminjaman dengan ID ${id} tidak ditemukan`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data peminjaman berhasil ditemukan',
      data
    });
  } catch (error) {
    next(error);
  }
};

const createLoan = async (req, res, next) => {
  try {
    const {
      borrower_name,
      nama_peminjam,
      book_title,
      judul_buku,
      loan_date,
      tanggal_pinjam,
      due_date,
      tanggal_jatuh_tempo,
      return_date,
      tanggal_kembali,
      status
    } = req.body;

    const finalBorrower = (borrower_name || nama_peminjam || '').trim();
    const finalBook = (book_title || judul_buku || '').trim();

    if (!finalBorrower) {
      return res.status(400).json({
        success: false,
        message: 'Field borrower_name (nama_peminjam) wajib diisi'
      });
    }

    if (!finalBook) {
      return res.status(400).json({
        success: false,
        message: 'Field book_title (judul_buku) wajib diisi'
      });
    }

    const todayStr = formatDate(new Date());
    const finalLoanDate = loan_date || tanggal_pinjam || todayStr;

    let finalDueDate = due_date || tanggal_jatuh_tempo;
    if (!finalDueDate) {
      const defaultDue = new Date(finalLoanDate);
      defaultDue.setDate(defaultDue.getDate() + 7);
      finalDueDate = formatDate(defaultDue);
    }

    const finalReturnDate = return_date || tanggal_kembali || null;
    const finalStatus = (status || (finalReturnDate ? 'Kembali' : 'Dipinjam')).trim();

    const payload = {
      borrower_name: finalBorrower,
      book_title: finalBook,
      loan_date: finalLoanDate,
      due_date: finalDueDate,
      return_date: finalReturnDate,
      status: finalStatus
    };

    const newLoan = await LoanModel.create(payload);

    return res.status(201).json({
      success: true,
      message: 'Data peminjaman berhasil ditambahkan',
      data: newLoan
    });
  } catch (error) {
    next(error);
  }
};

const updateLoan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await LoanModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Data peminjaman dengan ID ${id} tidak ditemukan`
      });
    }

    const {
      borrower_name,
      nama_peminjam,
      book_title,
      judul_buku,
      loan_date,
      tanggal_pinjam,
      due_date,
      tanggal_jatuh_tempo,
      return_date,
      tanggal_kembali,
      status
    } = req.body;

    const payload = {};

    if (borrower_name !== undefined || nama_peminjam !== undefined) {
      payload.borrower_name = (borrower_name || nama_peminjam || '').trim();
    }
    if (book_title !== undefined || judul_buku !== undefined) {
      payload.book_title = (book_title || judul_buku || '').trim();
    }
    if (loan_date !== undefined || tanggal_pinjam !== undefined) {
      payload.loan_date = loan_date || tanggal_pinjam;
    }
    if (due_date !== undefined || tanggal_jatuh_tempo !== undefined) {
      payload.due_date = due_date || tanggal_jatuh_tempo;
    }
    if (return_date !== undefined || tanggal_kembali !== undefined) {
      payload.return_date = return_date || tanggal_kembali || null;
    }
    if (status !== undefined) {
      payload.status = status.trim();
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data pembaruan yang dikirimkan'
      });
    }

    const updatedLoan = await LoanModel.update(id, payload);

    return res.status(200).json({
      success: true,
      message: 'Data peminjaman berhasil diperbarui',
      data: updatedLoan
    });
  } catch (error) {
    next(error);
  }
};

const deleteLoan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await LoanModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Data peminjaman dengan ID ${id} tidak ditemukan`
      });
    }

    await LoanModel.delete(id);

    return res.status(200).json({
      success: true,
      message: `Data peminjaman dengan ID ${id} berhasil dihapus`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan
};
