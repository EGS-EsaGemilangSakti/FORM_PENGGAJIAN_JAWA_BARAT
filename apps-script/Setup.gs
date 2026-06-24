function setup() {
  validateRequiredSetupConfig();
  createSpreadsheetHeaders();
  deleteObsoletePayrollSheets();
  createPlacementSheets();
  createPositionPlacementSheets();
  syncPlacementSheetsFromMain();
  syncPositionPlacementSheetsFromMain();
  applyDuplicateNikFormattingToPayrollSheets();
  DriveApp.getFolderById(ROOT_FOLDER_ID);
  DriveApp.getFolderById(KTP_FOLDER_ID);
  DriveApp.getFolderById(SURAT_KUASA_FOLDER_ID);
  DriveApp.getFolderById(KARTU_KELUARGA_FOLDER_ID);
  getQrFolder();
  console.log('Setup berhasil: header spreadsheet, sinkronisasi sheet penempatan dan posisi penempatan, format duplikat NIK, serta folder Drive dan QR valid.');
}

function validateRequiredSetupConfig() {
  const requiredConfig = {
    ROOT_FOLDER_ID: ROOT_FOLDER_ID,
    SPREADSHEET_ID: SPREADSHEET_ID,
    KTP_FOLDER_ID: KTP_FOLDER_ID,
    SURAT_KUASA_FOLDER_ID: SURAT_KUASA_FOLDER_ID,
    KARTU_KELUARGA_FOLDER_ID: KARTU_KELUARGA_FOLDER_ID
  };

  Object.keys(requiredConfig).forEach(function (key) {
    if (!String(requiredConfig[key] || '').trim()) {
      throw new Error(key + ' belum diatur di Script Properties.');
    }
  });
}

const OBSOLETE_PLACEMENTS = [
  'DRIVER JNT TGR',
  'DRIVER JNT PKU',
  'DRIVER JNT BTN',
  'DRIVER JNT JRT SUNTER',
  'DRIVER CARGO SUKABUMI',
  'DRIVER CARGO BANDUNG',
  'DRIVER VIP',
  'DRIVER FASTRANS',
  'DRIVER CARGO CIANJUR',
  'DRIVER APL JURUMUDI',
  'DRIVER APL SEMARANG',
  'DRIVER APL BANDUNG'
];
const OBSOLETE_POSITIONS = ['DRIVER SIM B1/B2 UMUM'];

function deleteObsoletePayrollSheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheetNames = [];

  OBSOLETE_PLACEMENTS.forEach(function (placement) {
    sheetNames.push(getPlacementSheetName(placement));
  });

  OBSOLETE_POSITIONS.forEach(function (position) {
    OBSOLETE_PLACEMENTS.forEach(function (placement) {
      sheetNames.push(getPositionPlacementSheetName(position, placement));
    });
  });

  sheetNames.forEach(function (sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (sheet && spreadsheet.getSheets().length > 1) {
      spreadsheet.deleteSheet(sheet);
    }
  });
}

function createPlacementSheets() {
  PLACEMENTS.forEach(function (placement) {
    const sheet = getSheet(getPlacementSheetName(placement));
    createSpreadsheetHeadersForSheet(sheet);
  });
}

function createPositionPlacementSheets() {
  POSITIONS.forEach(function (position) {
    PLACEMENTS.forEach(function (placement) {
      const sheet = getSheet(getPositionPlacementSheetName(position, placement));
      createSpreadsheetHeadersForSheet(sheet);
    });
  });
}

function syncPlacementSheetsFromMain() {
  const mainSheet = getSheet(SHEET_NAME);
  const lastRow = mainSheet.getLastRow();
  const rows = lastRow > 1 ? mainSheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues() : [];
  const placementColumnIndex = HEADERS.indexOf('Penempatan');

  PLACEMENTS.forEach(function (placement) {
    const sheetName = getPlacementSheetName(placement);
    const sheet = getSheet(sheetName);
    createSpreadsheetHeadersForSheet(sheet);

    if (sheet.getMaxRows() > 1) {
      sheet.getRange(2, 1, sheet.getMaxRows() - 1, HEADERS.length).clearContent();
    }

    const placementRows = rows.filter(function (row) {
      return String(row[placementColumnIndex] || '').trim() === placement;
    });

    if (placementRows.length > 0) {
      sheet.getRange(2, 1, placementRows.length, HEADERS.length).setValues(placementRows);
    }
  });
}

function syncPositionPlacementSheetsFromMain() {
  const mainSheet = getSheet(SHEET_NAME);
  const lastRow = mainSheet.getLastRow();
  const rows = lastRow > 1 ? mainSheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues() : [];
  const placementColumnIndex = HEADERS.indexOf('Penempatan');
  const positionColumnIndex = HEADERS.indexOf('Posisi');

  POSITIONS.forEach(function (position) {
    PLACEMENTS.forEach(function (placement) {
      const sheetName = getPositionPlacementSheetName(position, placement);
      const sheet = getSheet(sheetName);
      createSpreadsheetHeadersForSheet(sheet);

      if (sheet.getMaxRows() > 1) {
        sheet.getRange(2, 1, sheet.getMaxRows() - 1, HEADERS.length).clearContent();
      }

      const positionPlacementRows = rows.filter(function (row) {
        return String(row[positionColumnIndex] || '').trim() === position
          && String(row[placementColumnIndex] || '').trim() === placement;
      });

      if (positionPlacementRows.length > 0) {
        sheet.getRange(2, 1, positionPlacementRows.length, HEADERS.length).setValues(positionPlacementRows);
      }
    });
  });
}

function applyDuplicateNikFormattingToPayrollSheets() {
  applyDuplicateNikFormattingToSheet(getSheet(SHEET_NAME));
  PLACEMENTS.forEach(function (placement) {
    applyDuplicateNikFormattingToSheet(getSheet(getPlacementSheetName(placement)));
  });
  POSITIONS.forEach(function (position) {
    PLACEMENTS.forEach(function (placement) {
      applyDuplicateNikFormattingToSheet(getSheet(getPositionPlacementSheetName(position, placement)));
    });
  });
}

function applyDuplicateNikFormattingToSheet(sheet) {
  const dataRange = sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), HEADERS.length);
  const duplicateNikFormula = '=AND($F2<>"",COUNTIF($F:$F,$F2)>1)';

  const preservedRules = sheet.getConditionalFormatRules().filter(function (rule) {
    const condition = rule.getBooleanCondition();
    if (!condition || condition.getCriteriaType() !== SpreadsheetApp.BooleanCriteria.CUSTOM_FORMULA) {
      return true;
    }
    const criteriaValues = condition.getCriteriaValues();
    return criteriaValues[0] !== duplicateNikFormula;
  });

  const duplicateNikRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(duplicateNikFormula)
    .setBackground('#f4cccc')
    .setFontColor('#990000')
    .setRanges([dataRange])
    .build();

  preservedRules.push(duplicateNikRule);
  sheet.setConditionalFormatRules(preservedRules);
}
