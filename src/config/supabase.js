require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.trim() !== '' &&
  supabaseKey.trim() !== '' &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project-id')
);

if (!isConfigured) {
  console.warn(
    '\n⚠️  PERINGATAN KONFIGURASI SUPABASE:\n' +
    '   SUPABASE_URL atau SUPABASE_KEY belum diisi di file .env.\n' +
    '   Silakan isi kredensial Supabase Anda di file .env agar request ke database dapat berjalan.\n'
  );
}

const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseKey : 'placeholder-key'
);

module.exports = {
  supabase,
  isConfigured: () => isConfigured
};
