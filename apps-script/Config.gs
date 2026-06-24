const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
const DEFAULT_ROOT_FOLDER_ID = '1ocazo3KkDpNmUNcgLh4KsW30uks0vW15';
const DEFAULT_SPREADSHEET_ID = '';
const DEFAULT_KTP_FOLDER_ID = '1cauIAShMtk3smWrIDuFy0-017vWBoD0E';
const DEFAULT_SIM_FOLDER_ID = '';
const DEFAULT_SURAT_KUASA_FOLDER_ID = '1woFgIMcjsHE5-H3UH-GeMVk36LGrkW6S';
const DEFAULT_KARTU_KELUARGA_FOLDER_ID = '1Zn0osxg5zCKfY9dtk6vcVgmHl2h-eYc_';
const ROOT_FOLDER_ID = SCRIPT_PROPERTIES.getProperty('ROOT_FOLDER_ID') || DEFAULT_ROOT_FOLDER_ID;
const SPREADSHEET_ID = SCRIPT_PROPERTIES.getProperty('SPREADSHEET_ID') || DEFAULT_SPREADSHEET_ID;
const KTP_FOLDER_ID = SCRIPT_PROPERTIES.getProperty('KTP_FOLDER_ID') || DEFAULT_KTP_FOLDER_ID;
const SIM_FOLDER_ID = SCRIPT_PROPERTIES.getProperty('SIM_FOLDER_ID') || DEFAULT_SIM_FOLDER_ID;
const SURAT_KUASA_FOLDER_ID = SCRIPT_PROPERTIES.getProperty('SURAT_KUASA_FOLDER_ID') || DEFAULT_SURAT_KUASA_FOLDER_ID;
const KARTU_KELUARGA_FOLDER_ID = SCRIPT_PROPERTIES.getProperty('KARTU_KELUARGA_FOLDER_ID') || DEFAULT_KARTU_KELUARGA_FOLDER_ID;
const QR_FOLDER_ID = SCRIPT_PROPERTIES.getProperty('QR_FOLDER_ID') || '';
const DEFAULT_ALLOWED_ORIGINS = 'http://localhost:5173';
const ALLOWED_ORIGINS = (SCRIPT_PROPERTIES.getProperty('ALLOWED_ORIGINS') || DEFAULT_ALLOWED_ORIGINS).split(',').map(function (origin) {
  return origin.trim();
}).filter(String);
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = {
  ktp: ['application/pdf', 'image/jpeg', 'image/png'],
  sim: ['application/pdf', 'image/jpeg', 'image/png'],
  suratKuasa: ['application/pdf', 'image/jpeg', 'image/png'],
  kartuKeluarga: ['application/pdf', 'image/jpeg', 'image/png']
};
