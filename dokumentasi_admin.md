# 📘 Panduan Penggunaan Modul Admin - Ase Laundry

Dokumen ini merupakan panduan lengkap mengenai fitur-fitur yang tersedia di dalam panel administrasi Ase Laundry. Sistem ini dirancang untuk memudahkan operasional kasir, mengontrol alur pengerjaan cucian, serta memberikan laporan yang akurat bagi pemilik usaha.

---

## 🔐 Sistem Hak Akses (Role-Based Access Control)
Sistem memiliki dua jenis peran akun yang membedakan fitur yang bisa diakses:
1. **Karyawan / Kasir**: Fokus pada operasional harian (membuat transaksi, mengubah status cucian, dan tutup kasir). Karyawan *tidak bisa* menghapus transaksi yang sudah tersimpan untuk menghindari kecurangan.
2. **Owner (Pemilik)**: Memiliki kendali penuh. Dapat melihat grafik penghasilan, laporan detail, mengubah harga katalog, hingga menghapus data transaksi jika diperlukan.

---

## 📦 Fitur-Fitur Utama (Menu Navigasi)

### 1. 📊 Dashboard (Khusus Owner)
Pusat kendali utama bagi pemilik. Menampilkan ringkasan bisnis secara cepat.
- **Metrik Utama**: Total Pendapatan, Transaksi Aktif, dan Berat Cucian yang sedang diproses.
- **Grafik Tren**: Visualisasi tren penghasilan atau jumlah pesanan dari waktu ke waktu.
- **Pesanan Menunggu**: Tabel sekilas untuk memantau cucian yang harus segera diselesaikan hari ini.

### 2. 📝 Transaksi Kasir (Owner & Karyawan)
Modul untuk menerima pelanggan baru di toko (Point of Sale).
- **Auto-Kalkulasi Harga**: Cukup masukkan berat (kg) dan pilih jenis layanan (misal: Cuci Komplit), sistem otomatis menghitung total harga.
- **Tally Counter Pakaian (Opsional)**: Kasir dapat mencatat rincian fisik pakaian (misal: 2 Kemeja, 1 Selimut) agar cucian tidak tertukar atau hilang.
- **Cetak Nota Termal**: Setelah pesanan tersimpan, kasir bisa langsung mengeklik tombol cetak yang dioptimalkan untuk ukuran kertas kasir termal.
- **Kirim Resi via WhatsApp**: Sistem otomatis merangkai pesan WhatsApp yang berisi sapaan, rincian biaya, dan Tautan Publik (Tracking) untuk dikirim langsung ke HP pelanggan tanpa perlu mengetik manual.

### 3. 📋 Papan Kanban Transaksi (Owner & Karyawan)
Halaman sentral untuk memantau cucian apa saja yang sedang dikerjakan.
- **Alur Pengerjaan (Status)**: Transaksi dipisahkan menjadi kolom *Antrean -> Dicuci -> Disetrika -> Siap Diambil -> Selesai*. Karyawan cukup memindahkan cucian dari satu kolom ke kolom lain seiring berjalannya proses.
- **Indikator Lunas**: Label warna hijau untuk LUNAS dan kuning untuk BELUM LUNAS yang bisa terlihat dari jarak jauh.
- **Pencarian & Filter**: Kemudahan mencari nama pelanggan atau nomor resi di tumpukan cucian.

### 4. 🔍 Detail Transaksi & Log Aktivitas (Owner & Karyawan)
Saat nomor resi diklik pada papan Kanban, Anda akan masuk ke halaman ini.
- **Edit & Update**: Karyawan bisa menandai cucian yang "Belum Lunas" menjadi "Lunas", mengubah tanggal pengambilan, serta menambahkan **Catatan Khusus** (misal: "Baju pelanggan sudah luntur dari awal").
- **Audit Trail (Log Keamanan)**: Secara otomatis merekam **Siapa** yang mengubah status dan **Kapan** diubahnya. Ini berguna jika *Owner* ingin mencari tahu karyawan mana yang memproses cucian tersebut jika terjadi komplain.
- **Aksi Ulang**: Terdapat tombol re-print Nota dan pengiriman ulang pesan WA.

### 5. 👥 Data Pelanggan (Owner & Karyawan)
Buku telepon digital khusus pelanggan laundry Anda.
- **Direktori Otomatis**: Setiap kali ada pelanggan baru yang mendaftar di kasir, data mereka (Nama dan Nomor WA) akan otomatis masuk ke direktori ini tanpa perlu input dua kali.
- **Kirim Promo Langsung**: Terdapat tombol "Kirim Promo" untuk menembak pesan massal ke WhatsApp pelanggan (sangat berguna untuk strategi *marketing* menjaga retensi pelanggan).

### 6. 💼 Laporan & Setoran (Khusus Owner)
Rekapitulasi keuangan tanpa repot menggunakan kalkulator.
- **Filter Tanggal**: Tarik laporan pendapatan spesifik dari tanggal X ke tanggal Y.
- **Tabel Transaksi Detail**: Rincian transaksi apa saja yang berkontribusi pada pendapatan hari itu, lengkap dengan total kilogram yang dikerjakan mesin cuci.

### 7. ⚙️ Pengaturan Layanan / Katalog (Khusus Owner)
Kontrol mandiri terhadap harga bisnis.
- **Manajemen Harga Fleksibel**: *Owner* dapat langsung mengubah tarif "Cuci Komplit" (misal dari Rp6.000 menjadi Rp7.000) tanpa perlu memanggil teknisi/programmer.
- **Tambah Layanan Baru**: *Owner* bisa mengekspansi layanan baru, misalnya menambah katalog "Cuci Helm" atau "Cuci Karpet" sesuai perkembangan bisnis.

### 8. 💰 Tutup Kasir / Shift Management (Karyawan)
Modul untuk mengakhiri hari kerja bagi kasir.
- **Rekonsiliasi Kas (Uang Fisik vs Sistem)**: Karyawan diwajibkan memasukkan hitungan uang tunai fisik yang ada di laci kasir. Sistem akan mencocokkannya dengan data transaksi masuk di website.
- Jika ada selisih uang (kurang/lebih), sistem akan menandainya. Fitur ini dirancang khusus untuk meminimalisasi kecurangan atau kelalaian karyawan dalam menerima uang tunai.

---

*(Catatan: Halaman Landing Page (`/`) di luar panel admin memang didedikasikan secara eksklusif hanya untuk form Cek Resi Publik / Portal Tracking Pelanggan)*
