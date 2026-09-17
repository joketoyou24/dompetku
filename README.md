# DompetKu 💚

Aplikasi web modern untuk mengatur keuangan pribadi — catat transaksi, atur anggaran bulanan, buat target tabungan, dan pantau semuanya lewat dashboard yang bersih ala Apple Finance + Notion.

## Fitur

- **Dashboard** — ringkasan pemasukan, pengeluaran, saldo, persentase tabungan, grafik bar & pie, 5 transaksi terakhir
- **Transaksi** — CRUD lengkap (tanggal, jenis, nominal, kategori, deskripsi, metode pembayaran)
- **Kategori** — 12 kategori default Indonesia, bisa tambah/ubah/hapus kategori sendiri
- **Anggaran Bulanan** — budget per kategori dengan progress bar (hijau/kuning/merah)
- **Target Tabungan** — progress lingkaran, tambah dana kapan saja
- **Laporan** — filter hari/minggu/bulan/tahun/custom, export CSV & PDF
- **Profil** — nama, foto, mata uang (IDR), mode terang/gelap
- **Auth** — login Google (OAuth) dan Email/Password

## Teknologi

Next.js 15 (App Router) · TypeScript · Tailwind CSS · komponen ala shadcn/ui · Recharts · Prisma ORM · SQLite (dev) / PostgreSQL (production) · Auth.js (NextAuth v5) · Zod · Server Actions

---

## 1. Menjalankan di Lokal

### Prasyarat
- Node.js ≥ 18.18
- npm

### Langkah

```bash
# 1. Install dependency
npm install

# 2. Salin file environment
cp .env.example .env

# 3. Generate AUTH_SECRET dan tempel ke .env
openssl rand -base64 32

# 4. Buat database SQLite + tabel
npm run db:push

# 5. Isi kategori default
npm run db:seed

# 6. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Login dengan Google (opsional saat development)
1. Buka [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Buat **OAuth 2.0 Client ID** tipe *Web application*
3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Isi `AUTH_GOOGLE_ID` dan `AUTH_GOOGLE_SECRET` di `.env`

Jika tidak diisi, login Google tidak akan berfungsi tapi login Email/Password tetap jalan normal.

---

## 2. Deploy ke Vercel

### Langkah singkat

1. **Push kode ke GitHub** (buat repo baru, push project ini)

2. **Siapkan database production (Vercel Postgres)**
   - Di dashboard Vercel: **Storage → Create Database → Postgres**
   - Setelah dibuat, salin `DATABASE_URL` yang diberikan (biasanya juga otomatis tersedia sebagai env var jika database di-link ke project)

3. **Ubah provider Prisma untuk production**

   Karena SQLite tidak didukung di lingkungan serverless Vercel, sebelum deploy ubah `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql" // ubah dari "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

   > Skema sengaja tidak memakai `enum` Prisma (field `type`, `paymentMethod` disimpan sebagai `String` + divalidasi via Zod), jadi model lain **tidak perlu diubah** apa pun saat pindah dari SQLite ke PostgreSQL.

4. **Import project ke Vercel**
   - [vercel.com/new](https://vercel.com/new) → pilih repo GitHub kamu
   - Framework Preset: **Next.js** (otomatis terdeteksi)
   - Build command & output biarkan default (`prisma generate && next build`, sudah diatur di `package.json`)

5. **Isi Environment Variables** di Vercel (Settings → Environment Variables):

   | Key | Isi |
   |---|---|
   | `DATABASE_URL` | connection string PostgreSQL dari Vercel Postgres |
   | `AUTH_SECRET` | hasil `openssl rand -base64 32` |
   | `AUTH_GOOGLE_ID` | Client ID dari Google Cloud Console |
   | `AUTH_GOOGLE_SECRET` | Client Secret dari Google Cloud Console |
   | `NEXT_PUBLIC_APP_URL` | `https://nama-project-kamu.vercel.app` |

   Jangan lupa tambahkan redirect URI production di Google Cloud Console:
   `https://nama-project-kamu.vercel.app/api/auth/callback/google`

6. **Deploy.** Vercel akan otomatis menjalankan `npm install` → `postinstall` (`prisma generate`) → `npm run build`.

7. **Migrasi skema ke database production** (sekali saja, dari lokal atau lewat Vercel CLI):

   ```bash
   # pastikan DATABASE_URL di .env lokal sudah diarahkan ke Postgres production
   npx prisma db push
   npx prisma db seed
   ```

   Atau jalankan lewat **Vercel CLI**:
   ```bash
   vercel env pull .env.production.local
   DATABASE_URL="<connection-string>" npx prisma db push
   DATABASE_URL="<connection-string>" npx prisma db seed
   ```

Setelah langkah di atas, aplikasi siap diakses dan berjalan tanpa konfigurasi tambahan selain environment variables.

---

## 3. Struktur Folder

```
dompetku/
├─ prisma/
│  ├─ schema.prisma        # model User, Category, Transaction, Budget, SavingGoal, dll
│  └─ seed.ts               # seed 12 kategori default Indonesia
├─ src/
│  ├─ app/
│  │  ├─ (auth)/login, register
│  │  ├─ (dashboard)/dashboard, transactions, categories, budget, savings, reports, settings
│  │  └─ api/               # Route Handlers: auth, register, transactions, categories, budgets, savings, reports/export
│  ├─ actions/               # Server Actions (mutasi via RSC)
│  ├─ components/
│  │  ├─ ui/                # komponen dasar ala shadcn/ui
│  │  ├─ layout/             # sidebar, bottom-nav, topbar
│  │  ├─ dashboard/, transactions/, budget/, savings/, reports/, categories/, settings/
│  ├─ lib/                   # prisma client, auth config, utils, validasi Zod
│  └─ types/                 # tipe TypeScript & type augmentation NextAuth
└─ .env.example
```

## 4. Environment Variables

Lihat `.env.example` untuk daftar lengkap. Variabel wajib:

- `DATABASE_URL` — koneksi database (`file:./dev.db` untuk dev, connection string Postgres untuk production)
- `AUTH_SECRET` — secret untuk Auth.js (generate dengan `openssl rand -base64 32`)
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` — kredensial OAuth Google (opsional jika hanya pakai login email)

## 5. Catatan Teknis

- **Enum di Prisma:** SQLite tidak mendukung tipe `enum`, jadi field `type` (INCOME/EXPENSE) dan `paymentMethod` (CASH/BANK/EWALLET) disimpan sebagai `String` dan divalidasi lewat Zod (`src/lib/validations.ts`) serta union type TypeScript (`src/types/index.ts`). Ini membuat satu skema Prisma bisa dipakai untuk SQLite maupun PostgreSQL tanpa perubahan model.
- **Kategori default** bersifat global (`isDefault: true`, `userId: null`) sehingga muncul untuk semua pengguna dan tidak bisa diedit/dihapus oleh user.
- **Export PDF** dibuat di sisi client menggunakan `jsPDF` + `jspdf-autotable` (tidak butuh endpoint server tambahan).
- **Export CSV** dibuat di server (`/api/reports/export`) dengan BOM UTF-8 agar nominal & teks Indonesia terbaca benar di Excel.

## 6. Script NPM

| Script | Keterangan |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build production (`prisma generate` lalu `next build`) |
| `npm run start` | Jalankan hasil build |
| `npm run db:push` | Sinkronkan skema Prisma ke database tanpa migration file |
| `npm run db:migrate` | Buat migration file (untuk workflow migrasi formal) |
| `npm run db:seed` | Isi kategori default |
| `npm run db:studio` | Buka Prisma Studio (GUI database) |

---

Dibuat dengan 💚 — DompetKu, atur keuangan pribadimu dengan mudah.
