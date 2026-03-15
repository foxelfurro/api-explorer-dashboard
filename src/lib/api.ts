const API_BASE = '';

export function getApiBase(): string {
  return localStorage.getItem('api_base_url') || API_BASE;
}

export function setApiBase(url: string) {
  localStorage.setItem('api_base_url', url);
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('jwt_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body}`);
  }
  return res.json();
}

// Auth
export async function login(email: string, password: string) {
  const res = await fetch(`${getApiBase()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

// Admin Catalog
export async function getCatalog() {
  const res = await fetch(`${getApiBase()}/admin/catalog`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function createCatalogProduct(data: {
  sku: string; name: string; suggested_price: number; brand_id: number; image_url: string;
}) {
  const res = await fetch(`${getApiBase()}/admin/catalog`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateCatalogProduct(id: number, data: Record<string, unknown>) {
  const res = await fetch(`${getApiBase()}/admin/catalog/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Vendor
export async function getExplore() {
  const res = await fetch(`${getApiBase()}/vendor/explore`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function addToInventory(data: { catalog_id: number; stock: number; precio_personalizado: number }) {
  const res = await fetch(`${getApiBase()}/vendor/inventory`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getInventory() {
  const res = await fetch(`${getApiBase()}/vendor/inventory`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function updateInventoryItem(id: number, data: { stock?: number; precio_personalizado?: number }) {
  const res = await fetch(`${getApiBase()}/vendor/inventory/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Sales
export async function registerSale(data: { inventario_id: number; cantidad: number }) {
  const res = await fetch(`${getApiBase()}/sales/register`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
