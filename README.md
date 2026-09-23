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

## Rencana backend yang direkomendasikan
Laravel + MySQL + Livewire + Laravel Reverb.

Saat masuk tahap backend, halaman HTML ini dapat diubah bertahap menjadi Blade/Livewire, bukan dibuang dan dibuat ulang dari nol.
