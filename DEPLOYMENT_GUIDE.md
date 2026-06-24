# Deployment Guide

## 1. Siapkan Google Spreadsheet

1. Buat spreadsheet baru.
2. Salin ID dari URL spreadsheet.
3. ID berada di antara `/d/` dan `/edit`.

## 2. Siapkan Google Drive

1. Gunakan folder utama Drive:
   `1ocazo3KkDpNmUNcgLh4KsW30uks0vW15`
2. Gunakan folder dokumen:
   - KTP: `1cauIAShMtk3smWrIDuFy0-017vWBoD0E`
   - SIM: isi dengan folder SIM baru
   - Surat Kuasa: `1woFgIMcjsHE5-H3UH-GeMVk36LGrkW6S`
   - Kartu Keluarga: `1Zn0osxg5zCKfY9dtk6vcVgmHl2h-eYc_`
3. Folder `QR_CODES` akan dibuat otomatis di folder utama saat `setup()` berjalan.

## 3. Siapkan Apps Script

1. Buka `https://script.google.com`.
2. Buat project baru.
3. Buat file:
   - `Config.gs`
   - `Setup.gs`
   - `Code.gs`
4. Salin isi file dari folder `apps-script`.

## 4. Isi Script Properties

Masuk ke Project Settings, tambahkan:

```text
API_CO_ID_KEY=api_key_api_co_id
ROOT_FOLDER_ID=1ocazo3KkDpNmUNcgLh4KsW30uks0vW15
SPREADSHEET_ID=spreadsheet_id_baru
KTP_FOLDER_ID=1cauIAShMtk3smWrIDuFy0-017vWBoD0E
SIM_FOLDER_ID=folder_id_sim_baru
SURAT_KUASA_FOLDER_ID=1woFgIMcjsHE5-H3UH-GeMVk36LGrkW6S
KARTU_KELUARGA_FOLDER_ID=1Zn0osxg5zCKfY9dtk6vcVgmHl2h-eYc_
ALLOWED_ORIGINS=http://localhost:5173,https://username.github.io
```

`API_CO_ID_KEY` diisi di Script Properties Google Apps Script. Jangan isi API key di React, `.env` frontend, atau hardcode di file `.gs`. Gunakan origin final GitHub Pages yang benar untuk production.

## 5. Jalankan Setup

1. Pilih fungsi `setup`.
2. Klik Run.
3. Berikan permission.
4. Pastikan sheet `Payroll Submissions` dan `Audit Log` berhasil dibuat.

## 6. Publish Web App

1. Klik Deploy.
2. Pilih New deployment.
3. Type: Web app.
4. Execute as: Me.
5. Who has access: Anyone.
6. Klik Deploy.
7. Salin Web App URL.

## 7. Konfigurasi Frontend

Buat `.env.local`:

```env
VITE_API_URL=https://script.google.com/macros/s/WEB_APP_DEPLOYMENT_ID/exec
```

## 8. Run dan Build

```bash
npm install
npm run dev
npm run build
```

## 9. Deploy GitHub Pages

1. Push source code ke GitHub pada branch `main`.
2. Di repository GitHub, buka Settings -> Pages.
3. Pada Build and deployment, pilih Source: GitHub Actions.
4. Workflow `.github/workflows/deploy-pages.yml` akan menjalankan `npm ci` dan `npm run build`.
5. Setelah deploy selesai, buka repository Settings -> Pages -> Custom domain.
6. Jika memakai custom domain, isi custom domain baru untuk repository ini.
7. Di DNS provider domain, buat record:
   - Type: `CNAME`
   - Name/Host: subdomain custom yang dipakai
   - Value/Target: `username.github.io`
8. Masukkan origin custom domain ke Script Properties `ALLOWED_ORIGINS`.

Contoh `ALLOWED_ORIGINS` setelah GitHub Pages aktif:

```text
http://localhost:5173,https://username.github.io
```

Jika GitHub Pages memakai path repository seperti `https://username.github.io/form-penggajian/`, origin yang dimasukkan tetap hanya:

```text
https://username.github.io
```

Setelah `ALLOWED_ORIGINS` diisi dengan origin GitHub Pages, deploy Apps Script sebagai Web App dan salin URL Web App ke variable GitHub repository.

Di GitHub repository, buka Settings -> Secrets and variables -> Actions -> Variables, lalu buat:

```text
VITE_API_URL=https://script.google.com/macros/s/WEB_APP_DEPLOYMENT_ID/exec
```
