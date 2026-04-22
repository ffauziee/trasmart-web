# Laporan Proyek TrasMart Web

## 1. Gambaran Umum
TrasMart Web adalah aplikasi web berbasis Next.js yang dirancang untuk mendukung konsep konversi sampah menjadi poin. Pengguna dapat mendaftar, masuk ke sistem, memantau saldo poin, melihat riwayat setoran sampah, dan menukarkan poin dengan reward yang tersedia.

Proyek ini menggabungkan autentikasi Supabase, halaman landing yang informatif, dashboard poin, katalog reward, serta halaman akun untuk mengelola profil pengguna.

## 2. Tujuan Proyek
Tujuan utama aplikasi ini adalah:

1. Mendorong kebiasaan daur ulang melalui insentif poin.
2. Memberikan pengalaman pengguna yang sederhana untuk login, melihat poin, dan menukar reward.
3. Menyediakan sistem akun yang terhubung dengan data Supabase.
4. Menampilkan informasi aktivitas pengguna secara terpusat dalam dashboard.

## 3. Fitur Utama
### 3.1 Landing Page
Halaman awal menampilkan penjelasan singkat tentang TrasMart, ajakan untuk bergabung, dan ringkasan manfaat aplikasi.

### 3.2 Autentikasi Pengguna
Aplikasi mendukung:

- Login menggunakan email dan password.
- Register akun baru.
- Login dan registrasi melalui OAuth Google dan GitHub.

### 3.3 Dashboard Poin
Pengguna dapat melihat:

- total poin yang dimiliki,
- target reward berikutnya,
- grafik aktivitas poin,
- status mesin terdekat,
- riwayat setoran sampah berdasarkan tanggal.

### 3.4 Reward Shop
Halaman reward digunakan untuk:

- melihat katalog reward,
- memfilter reward berdasarkan kategori,
- menukar poin dengan reward,
- melihat riwayat reward yang sudah ditukarkan.

### 3.5 Halaman Akun
Halaman akun menyediakan:

- informasi profil pengguna,
- edit data profil,
- ringkasan saldo poin aktif,
- aksi cepat seperti logout.

### 3.6 Proteksi Route
Middleware digunakan untuk membatasi akses ke halaman tertentu agar hanya pengguna yang sudah login yang dapat membuka dashboard, reward, dan account.

## 4. Teknologi yang Digunakan
Project ini dibangun dengan teknologi berikut:

- Next.js 16
- React 19
- TypeScript
- Supabase Authentication dan data client
- SCSS Modules
- Tailwind CSS 4
- Lucide React untuk ikon

## 5. Struktur Fitur dan Folder
Ringkasan folder penting dalam proyek ini:

- `src/app` berisi halaman utama, login, register, dashboard, reward, account, dan layout aplikasi.
- `src/components` berisi komponen UI seperti sidebar dan notification bell.
- `src/contexts` berisi context untuk sidebar, theme, dan user.
- `src/hooks` berisi hook untuk autentikasi dan navigasi.
- `src/lib/utils/supabase` berisi konfigurasi client, server, dan middleware Supabase.
- `src/lib/mock` berisi fungsi pengambil data dashboard, reward, dan poin.
- `src/types` berisi tipe data untuk dashboard dan reward.

## 6. Alur Kerja Aplikasi
Alur penggunaan aplikasi secara umum adalah sebagai berikut:

1. Pengguna membuka landing page.
2. Pengguna melakukan registrasi atau login.
3. Setelah berhasil masuk, pengguna diarahkan ke area utama aplikasi.
4. Pengguna melihat saldo poin, histori transaksi, dan status mesin.
5. Pengguna membuka katalog reward dan menukar poin bila mencukupi.
6. Pengguna dapat memperbarui profil di halaman akun.

## 7. Konfigurasi Environment
Sebelum menjalankan aplikasi, siapkan variabel environment berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Pastikan pengaturan autentikasi di Supabase sudah aktif untuk email/password serta provider Google dan GitHub jika fitur OAuth akan digunakan.

## 8. Cara Menjalankan Proyek
### 8.1 Instalasi Dependensi

```bash
npm install
```

### 8.2 Menjalankan Mode Development

```bash
npm run dev
```

### 8.3 Build Produksi

```bash
npm run build
```

### 8.4 Menjalankan Build Produksi

```bash
npm run start
```

### 8.5 Pemeriksaan Kode

```bash
npm run lint
```

## 9. Catatan Implementasi
- Dashboard dan reward menggunakan data Supabase untuk menghitung poin, transaksi, dan riwayat penukaran.
- Reward yang tersedia dihitung dari stok dan jumlah penukaran pengguna.
- Halaman akun memuat data profil dari context pengguna dan melakukan sinkronisasi saldo poin secara berkala.
- Notifikasi aktivitas dipicu melalui event aplikasi ketika ada perubahan data reward atau poin.

## 10. Kesimpulan
TrasMart Web adalah aplikasi portal reward bertema lingkungan yang menghubungkan aktivitas daur ulang dengan sistem poin. Proyek ini sudah mencakup alur pengguna lengkap, mulai dari autentikasi, pemantauan poin, penukaran reward, hingga pengelolaan profil akun.