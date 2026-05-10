Tentu, ini adalah **Product Requirements Document (PRD)** yang sangat mendetail dan sudah disesuaikan dengan hasil observasi serta wawancara langsung yang kamu lakukan di **Laundry On Express**. Dokumen ini dirancang untuk menjadi fondasi kuat sebelum kamu menyusun dokumen SRS yang lebih teknis.

# ---

**Product Requirements Document (PRD)**

**Proyek:** WashTrack (Sistem Informasi Manajemen & Pelacakan Laundry)

**Status:** Draft v1.1 (Berdasarkan Hasil Observasi Lapangan)

**Tim:** Kelompok 1

## **1\. Ringkasan Eksekutif (Executive Summary)**

Laundry On Express saat ini masih mengandalkan sistem pencatatan manual menggunakan nota fisik tiga rangkap dan buku besar. Masalah utama yang ditemukan adalah risiko nota hilang/rusak, kesulitan melacak pakaian yang "terbang" atau tertukar, serta beban kerja kasir dalam menjawab pertanyaan pelanggan mengenai status cucian. **WashTrack** adalah solusi berbasis web untuk mendigitalisasi seluruh proses ini, memberikan transparansi status kepada pelanggan secara *real-time*, dan mengotomatisasi rekapitulasi setoran harian.

## **2\. Masalah yang Dihadapi (Problem Statements)**

* **Kehilangan Data:** Nota fisik sering hilang atau jatuh, menyebabkan kebingungan saat pengambilan barang.  
* **Inefisiensi Komunikasi:** Pelanggan sering bertanya status cucian secara manual, yang mengganggu produktivitas pekerja.  
* **Risiko Operasional:** Tidak adanya catatan detail (seperti baju luntur atau barang kurang) di sistem digital yang mudah diakses.  
* **Rekapitulasi Manual:** Proses setoran ke *owner* setiap malam masih dilakukan dengan menghitung nota fisik satu per satu.

## **3\. Tujuan Produk (Product Goals)**

* Mendigitalisasi 100% pencatatan transaksi masuk.  
* Menyediakan portal pelacakan mandiri bagi pelanggan guna mengurangi beban tanya-jawab manual.  
* Meningkatkan akurasi pelaporan keuangan harian bagi *owner*.

## **4\. User Personas**

1. **Admin/Kasir (Shift 1 & 2):** Petugas yang menginput data, memperbarui status pengerjaan, dan melakukan serah terima barang.  
2. **Pelanggan:** Individu yang menitipkan pakaian dan ingin mengetahui kepastian waktu selesai tanpa harus datang/chat ke toko.  
3. **Owner:** Pihak yang menerima setoran dan memantau performa laundry secara berkala.

## **5\. Kebutuhan Fungsional (Functional Requirements)**

### **A. Modul Transaksi & Kasir**

* **FR-1: Input Pesanan:** Kasir dapat memasukkan nama pelanggan, nomor WhatsApp, berat (min 2kg), dan jenis layanan.  
* **FR-2: Logika Harga Dinamis:** Sistem menghitung total biaya otomatis berdasarkan:  
  * Reguler (3 hari): Rp4.000/kg  
  * Kilat (2 hari): Rp5.000/kg  
  * Kilat (1 hari): Rp8.000/kg  
  * Express (5 jam): Rp10.000/kg  
* **FR-3: Catatan Kondisi Khusus:** Fitur untuk mencatat detail khusus (misal: "Baju luntur", "Kaus kaki kurang 1", "Ada noda tinta") untuk menghindari komplain.  
* **FR-4: Generator Resi Unik:** Sistem menghasilkan kode resi unik (Contoh: CK-0305-X7K2) yang sulit ditebak.

### **B. Modul Manajemen Status (State Management)**

* **FR-5: Update Status:** Pekerja dapat mengubah status cucian melalui tombol cepat: Antrean $\\rightarrow$ Dicuci $\\rightarrow$ Disetrika $\\rightarrow$ Siap Diambil $\\rightarrow$ Selesai.  
* **FR-6: Manajemen Pengambilan:** Mencatat tanggal pengambilan dan status pembayaran (Lunas/Belum Lunas).  
* **FR-7: Penanganan Barang Lama:** Menandai barang yang sudah lebih dari periode tertentu (misal: \> 2 tahun) untuk status "Disumbangkan".

### **C. Modul Pelanggan (Public Portal)**

* **FR-8: Pelacakan Mandiri:** Halaman publik di mana pelanggan memasukkan nomor resi/HP untuk melihat *progress bar* pengerjaan.  
* **FR-9: Link Tracking Otomatis:** Sistem menghasilkan link (URL parameter) yang bisa dibagikan via WhatsApp agar pelanggan tinggal klik tanpa mengetik resi.

### **D. Modul Laporan (Admin Dashboard)**

* **FR-10: Rekap Setoran Harian:** Menampilkan total pendapatan rupiah dan total berat (kg) per hari untuk memudahkan setoran ke *owner* tiap malam.

## **6\. Kebutuhan Non-Fungsional (Non-Functional Requirements)**

* **NFR-1: Mobile Responsive:** UI harus optimal diakses via *smartphone* karena kasir Laundry On Express sering menggunakan HP saat operasional.  
* **NFR-2: Kecepatan:** Waktu *loading* halaman tracking harus di bawah 2 detik.  
* **NFR-3: Keamanan Data:** Melakukan sanitasi karakter pada kode resi (menghilangkan karakter ambigu seperti 0, O, 1, I).

## **7\. Atribut Data Utama (Entity Relationship Preview)**

* **Customer:** id\_cust, nama, no\_wa.  
* **Service:** id\_service, nama\_layanan, harga\_per\_kg, estimasi\_waktu.  
* **Transaction:** id\_transaksi, kode\_resi, total\_berat, total\_biaya, status\_pembayaran, status\_cucian, catatan\_khusus, created\_at.

## **8\. Rencana Tech Stack**

* **Framework:** Next.js (Full-stack).  
* **Styling:** Tailwind CSS (Clean & Minimalist).  
* **ORM:** Prisma.  
* **Database:** PostgreSQL (Supabase/Neon).

---

PRD ini sudah mencakup detail operasional dari Laundry On Express (seperti pembagian *shift*, tarif harga, hingga masalah baju luntur). Kamu bisa menggunakan poin-poin di atas untuk mengisi bagian **Functional Requirements** dan **Data Requirements** di dokumen SRS kamu nanti\!