# Learning Platform UI Prototype

Prototype frontend statis untuk Learning Platform.

## Tujuan
Tahap ini sengaja fokus pada UI/UX dan alur pengguna. Belum ada backend, database, authentication asli, upload file asli, atau chat WebSocket sungguhan.

## Struktur

```text
learning-platform-ui/
├── index.html
├── login.html
├── register.html
├── resources.html
├── profile-student.html
├── profile-teacher.html
├── class-a.html
├── class-b.html
├── class-c.html
├── assets/
│   ├── style.css
│   ├── app.js
│   └── images/
│       └── README.txt
└── README.md
```

## Cara menjalankan
Buka `index.html` di browser, atau gunakan Live Server di VS Code.

## Catatan penting
Semua interaksi sekarang adalah simulasi frontend:
- Login/register belum memvalidasi ke server.
- Kode referral guru di-generate di browser.
- Progress dan status review menggunakan `localStorage`.
- Chat adalah simulasi lokal, bukan real-time.
- Notifikasi juga simulasi lokal.

## Home menyesuaikan status login
Panel utama dan navbar di `index.html` sekarang berbeda tergantung status login (simulasi):
- **Tamu** (belum pernah klik Masuk/Daftar di browser ini): panel menunjukkan alur belajar generik
  ("Begini alur belajarnya"), bukan data pribadi. Navbar menampilkan Masuk/Daftar.
  Tombol "Masuk kelas" di tiap kartu kelas mengarah ke halaman Daftar, bukan langsung ke kelas.
- **Murid yang sudah login**: panel menunjukkan progress kelas yang sebenarnya (dihitung dari
  `lp_lesson_statuses`, bukan angka statis). Navbar berubah jadi Profil/Keluar.
- **Guru yang sudah login**: panel diganti ajakan buka dashboard guru — progress belajar
  memang tidak relevan untuk peran guru.
- Status login disimpan terpisah dari data progress (`lp_session`), jadi klik "Keluar" tidak
  menghapus progress — hanya mengakhiri sesi. Reset total tetap lewat `?reset=1`.

## Tips uji di HP / tablet
- Tambahkan `?reset=1` di URL halaman mana pun (mis. `class-a.html?reset=1`) untuk mengembalikan data demo ke awal.
- Data demo dimulai dengan 7 pelajaran Kelas G sudah lulus (23%), sesuai angka di profil murid.
  Ubah konstanta `DEMO_SEED_APPROVED` di `assets/app.js` menjadi `0` untuk memulai sebagai murid baru.
- Ada status sesi simulasi (`lp_session`). Tamu (belum login/daftar) tidak melihat progres apa pun di Home;
  murid melihat progresnya sendiri, guru melihat panel Ruang Guru. Tombol "Keluar" mengakhiri sesi tanpa menghapus data.
- Status pelajaran disimpan per kelas dan per pelajaran (`lp_lesson_statuses`).
- Tombol bahasa EN/ID sementara hanya tampil di halaman yang sudah diterjemahkan (baru beranda).
  Hapus pengecekan di `initLanguage()` setelah halaman lain diberi atribut `data-i18n`.
- Membuka file lewat `http://192.168.x.x` dari HP bukan konteks aman: `navigator.clipboard` tidak tersedia,
  sehingga tombol "Salin kode" memakai fallback `execCommand`.

## Rencana backend yang direkomendasikan
Laravel + MySQL + Livewire + Laravel Reverb.

Saat masuk tahap backend, halaman HTML ini dapat diubah bertahap menjadi Blade/Livewire, bukan dibuang dan dibuat ulang dari nol.
