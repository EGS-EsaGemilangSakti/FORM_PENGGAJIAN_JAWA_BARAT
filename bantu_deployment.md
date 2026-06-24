# link spreadsheet              : https://docs.google.com/spreadsheets/d/1mdUgndl0E2dFKQ_4oMAoGP0ccIW3YH2X_6ZEG5QirmQ/edit?gid=0#gid=0
# link folder PAYROLL_UPLOADS   : https://drive.google.com/drive/folders/1ocazo3KkDpNmUNcgLh4KsW30uks0vW15
## link folder KTP              : https://drive.google.com/drive/folders/1cauIAShMtk3smWrIDuFy0-017vWBoD0E
## link folder SURAT_KUASA      : https://drive.google.com/drive/folders/1woFgIMcjsHE5-H3UH-GeMVk36LGrkW6S
## link folder KARTU_KELUARGA   : https://drive.google.com/drive/folders/1Zn0osxg5zCKfY9dtk6vcVgmHl2h-eYc_

# ID yang dipakai Apps Script

SPREADSHEET_ID=1mdUgndl0E2dFKQ_4oMAoGP0ccIW3YH2X_6ZEG5QirmQ
ROOT_FOLDER_ID=1ocazo3KkDpNmUNcgLh4KsW30uks0vW15
KTP_FOLDER_ID=1cauIAShMtk3smWrIDuFy0-017vWBoD0E
SURAT_KUASA_FOLDER_ID=1woFgIMcjsHE5-H3UH-GeMVk36LGrkW6S
KARTU_KELUARGA_FOLDER_ID=1Zn0osxg5zCKfY9dtk6vcVgmHl2h-eYc_

# Script Properties yang perlu diisi di Google Apps Script

API_CO_ID_KEY=isi_api_key_api_co_id_di_sini
SPREADSHEET_ID=1mdUgndl0E2dFKQ_4oMAoGP0ccIW3YH2X_6ZEG5QirmQ
ROOT_FOLDER_ID=1ocazo3KkDpNmUNcgLh4KsW30uks0vW15
KTP_FOLDER_ID=1cauIAShMtk3smWrIDuFy0-017vWBoD0E
SURAT_KUASA_FOLDER_ID=1woFgIMcjsHE5-H3UH-GeMVk36LGrkW6S
KARTU_KELUARGA_FOLDER_ID=1Zn0osxg5zCKfY9dtk6vcVgmHl2h-eYc_
ALLOWED_ORIGINS=http://localhost:5173,https://form.cargo.jawabarat.com

# Tempat menaruh API key

API key API.CO.ID jangan ditaruh di React, jangan ditaruh di .env frontend, dan jangan di-hardcode di file .gs.

Taruh di:
Google Apps Script -> Project Settings -> Script Properties -> Add script property

Property:
API_CO_ID_KEY

Value:
API key dari API.CO.ID

# Urutan deployment yang disarankan

1. Push project ke GitHub.
2. Aktifkan GitHub Pages dengan Source: GitHub Actions.
3. Tunggu URL GitHub Pages aktif.
4. Ambil origin URL GitHub Pages, contoh:
   https://form.cargo.jawabarat.com
5. Isi Script Properties Apps Script:
   API_CO_ID_KEY
   SPREADSHEET_ID
   ROOT_FOLDER_ID
   KTP_FOLDER_ID
   SURAT_KUASA_FOLDER_ID
   KARTU_KELUARGA_FOLDER_ID
   ALLOWED_ORIGINS
6. Jalankan setup() di Apps Script.
7. Deploy Apps Script sebagai Web App.
8. Salin Web App URL.
9. Isi GitHub Actions variable:
   VITE_API_URL=https://script.google.com/macros/s/WEB_APP_DEPLOYMENT_ID/exec
10. Re-run workflow GitHub Pages agar frontend memakai URL Apps Script production.
