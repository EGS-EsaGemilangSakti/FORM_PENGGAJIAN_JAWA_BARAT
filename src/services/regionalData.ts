import type { DistrictOption, ProvinceOption, RegencyOption, VillageOption } from '../types/regional';

const DATA_PATHS = {
  provinces: 'data/provinces.json',
  regencies: 'data/regencies.json',
  districts: 'data/districts.json',
  villages: 'data/villages.json',
};

let provincesPromise: Promise<ProvinceOption[]> | null = null;
let regenciesPromise: Promise<RegencyOption[]> | null = null;
let districtsPromise: Promise<DistrictOption[]> | null = null;
let villagesPromise: Promise<VillageOption[]> | null = null;

function dataUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

async function fetchRegionalJson<T>(path: string): Promise<T[]> {
  const response = await fetch(dataUrl(path));
  if (!response.ok) {
    throw new Error('Gagal memuat data wilayah');
  }
  return response.json() as Promise<T[]>;
}

export function getProvinces(): Promise<ProvinceOption[]> {
  provincesPromise ??= fetchRegionalJson<ProvinceOption>(DATA_PATHS.provinces);
  return provincesPromise;
}

export function getRegencies(provinceCode: string): Promise<RegencyOption[]> {
  regenciesPromise ??= fetchRegionalJson<RegencyOption>(DATA_PATHS.regencies);
  return regenciesPromise.then((items) => items.filter((item) => item.province_code === provinceCode));
}

export function getDistricts(regencyCode: string): Promise<DistrictOption[]> {
  districtsPromise ??= fetchRegionalJson<DistrictOption>(DATA_PATHS.districts);
  return districtsPromise.then((items) => items.filter((item) => item.regency_code === regencyCode));
}

export function getVillages(districtCode: string): Promise<VillageOption[]> {
  villagesPromise ??= fetchRegionalJson<VillageOption>(DATA_PATHS.villages);
  return villagesPromise.then((items) => items.filter((item) => item.district_code === districtCode));
}

export function getBirthRegencies(): Promise<RegencyOption[]> {
  regenciesPromise ??= fetchRegionalJson<RegencyOption>(DATA_PATHS.regencies);
  return regenciesPromise;
}
