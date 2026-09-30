const { supabase, isConfigured } = require('../config/supabase');

class LoanModel {
  static checkConfiguration() {
    if (!isConfigured()) {
      const error = new Error('Kredensial Supabase belum dikonfigurasi di file .env (SUPABASE_URL & SUPABASE_KEY)');
      error.statusCode = 503;
      throw error;
    }
  }

  static async findAll(filters = {}) {
    LoanModel.checkConfiguration();

    let query = supabase
      .from('loans')
      .select('*')
      .order('id', { ascending: true });

    if (filters.status) {
      query = query.ilike('status', filters.status.trim());
    }

    if (filters.borrower_name) {
      query = query.ilike('borrower_name', `%${filters.borrower_name.trim()}%`);
    }

    if (filters.book_title) {
      query = query.ilike('book_title', `%${filters.book_title.trim()}%`);
    }

    if (filters.search) {
      const searchTerm = `%${filters.search.trim()}%`;
      query = query.or(`borrower_name.ilike.${searchTerm},book_title.ilike.${searchTerm}`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }

  static async findById(id) {
    LoanModel.checkConfiguration();

    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  static async create(payload) {
    LoanModel.checkConfiguration();

    const { data, error } = await supabase
      .from('loans')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async update(id, payload) {
    LoanModel.checkConfiguration();

    const { data, error } = await supabase
      .from('loans')
      .update(payload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  static async delete(id) {
    LoanModel.checkConfiguration();

    const { data, error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }
}

module.exports = LoanModel;
