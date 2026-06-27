const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message || `Request failed with status ${status}`);
  }
}
export function token(){ if(typeof window==='undefined') return ''; return localStorage.getItem('token') || ''; }
export function isLoggedIn(){ return Boolean(token()); }
export async function api<T>(path:string, options:RequestInit = {}):Promise<T>{
 const authToken=token();
 const res = await fetch(`${API}${path}`, { ...options, headers:{'Content-Type':'application/json', ...(authToken?{Authorization:`Bearer ${authToken}`}:{}) , ...(options.headers||{})}});
 if(!res.ok) throw new ApiError(res.status, await errorMessage(res));
 if (res.status === 204) return undefined as T;
 const text = await res.text();
 return (text ? JSON.parse(text) : undefined) as T;
}

async function errorMessage(res: Response) {
 const text = await res.text();
 if (!text) return res.statusText;
 try {
  const body = JSON.parse(text) as { message?: string; detail?: string; error?: string };
  return body.message || body.detail || body.error || text;
 } catch {
  return text;
 }
}
