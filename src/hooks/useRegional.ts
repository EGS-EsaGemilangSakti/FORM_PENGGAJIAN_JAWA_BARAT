import { useQuery } from '@tanstack/react-query';
import { getBirthRegencies, getDistricts, getProvinces, getRegencies, getVillages } from '../services/regionalData';

export function useProvinces() {
  return useQuery({
    queryKey: ['regional', 'provinces'],
    queryFn: getProvinces,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useRegencies(provinceCode: string) {
  return useQuery({
    queryKey: ['regional', 'regencies', provinceCode],
    queryFn: () => getRegencies(provinceCode),
    enabled: provinceCode.length === 2,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useDistricts(regencyCode: string) {
  return useQuery({
    queryKey: ['regional', 'districts', regencyCode],
    queryFn: () => getDistricts(regencyCode),
    enabled: regencyCode.length === 4,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useVillages(districtCode: string) {
  return useQuery({
    queryKey: ['regional', 'villages', districtCode],
    queryFn: () => getVillages(districtCode),
    enabled: districtCode.length === 6,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useBirthRegencies() {
  return useQuery({
    queryKey: ['regional', 'birth-regencies'],
    queryFn: getBirthRegencies,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
