import { PublicFacility, Region, BudgetProject, EquityMetric, CitizenFeedback } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function fetchFacilities(params?: {
  category?: string;
  sub_category?: string;
  region_id?: number;
  has_wheelchair_ramp?: boolean;
  has_tactile_paving?: boolean;
  has_disabled_toilet?: boolean;
  search?: string;
  per_page?: number;
}): Promise<{ data: PublicFacility[]; meta: any }> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.sub_category) query.set('sub_category', params.sub_category);
  if (params?.region_id) query.set('region_id', String(params.region_id));
  if (params?.has_wheelchair_ramp) query.set('has_wheelchair_ramp', '1');
  if (params?.has_tactile_paving) query.set('has_tactile_paving', '1');
  if (params?.has_disabled_toilet) query.set('has_disabled_toilet', '1');
  if (params?.search) query.set('search', params.search);
  if (params?.per_page) query.set('per_page', String(params.per_page));

  try {
    const res = await fetch(`${API_BASE_URL}/facilities?${query.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('API response was not ok');
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using fallback mock data:', err);
    return { data: [], meta: { total: 0 } };
  }
}

export async function fetchFacilityById(id: number): Promise<PublicFacility | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/facilities/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function fetchRegions(): Promise<Region[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/regions`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data;
  } catch {
    return [];
  }
}

export async function fetchRegionsGeoJSON(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/regions/geojson`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchBudgetProjects(): Promise<{ summary: any; data: BudgetProject[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/budget-projects`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { summary: {}, data: [] };
  }
}

export async function fetchEquityAnalytics(): Promise<{ summary: any; rankings: EquityMetric[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/equity`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { summary: {}, rankings: [] };
  }
}

export async function submitCitizenFeedback(payload: {
  facility_id?: number | null;
  citizen_name: string;
  citizen_email?: string;
  title: string;
  description: string;
  category: string;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
}): Promise<{ status: string; data?: CitizenFeedback; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return { status: 'error', message: err.message || 'Gagal mengirim laporan' };
  }
}

export async function trackCitizenFeedback(trackingCode: string): Promise<CitizenFeedback | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/feedback/track/${trackingCode}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}
