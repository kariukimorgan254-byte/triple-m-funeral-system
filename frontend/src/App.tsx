// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Car, Package, Plus, X, Lock, LogOut, ChevronLeft, Sparkles, Sun, Moon,
  Calculator, CheckCircle2, ChevronRight as RightArrow, Flower2, ArrowDownCircle,
  Camera, LayoutDashboard, Trash2, UploadCloud, ZoomIn, Feather,
  PenTool, Copy, Share2, Eye, ImagePlus, Printer, FileText,
  User as UserIcon, DollarSign, Clock, AlertTriangle, Check, Search, RefreshCw,
  MapPin, Navigation, Route, Phone, Mail, UserCheck
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

function mediaSrc(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:image')) return url;
  return `${API}${url.startsWith('/') ? '' : '/'}${url}`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// --- CUSTOM SVG ICONS ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const TripleMLogo = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="100" cy="100" r="92" stroke="#D4AF37" strokeWidth="4" opacity="0.6" />
    <circle cx="100" cy="100" r="84" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
    <g transform="translate(10, 5)">
      <path d="M 35 125 L 52 65 L 70 100 L 88 65 L 105 125" stroke="#D4AF37" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 62 115 L 80 50 L 98 88 L 116 50 L 134 115" stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 91 125 L 109 65 L 127 100 L 145 65 L 163 125" stroke="#D4AF37" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <path d="M 55 140 C 75 160, 125 160, 145 140" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
    <circle cx="100" cy="150" r="4" fill="#F59E0B" />
    <path d="M 92 148 Q 85 142 80 149 Q 88 152 92 148 Z" fill="#D4AF37" />
    <path d="M 108 148 Q 115 142 120 149 Q 112 152 108 148 Z" fill="#D4AF37" />
    <polygon points="100,26 103,34 111,34 105,39 107,47 100,42 93,47 95,39 89,34 97,34" fill="#F59E0B" />
  </svg>
);

// --- TS INTERFACES ---
interface User { id: string; email: string; firstName: string; lastName: string; role: string; }
interface InventoryItem { id: string; sku: string; name: string; material: string; size: string; retailPrice: string; currentStock: number; isLowStock: boolean; imageUrl?: string | null; }
interface Hearse { id: string; vehicleName: string; make: string; model: string; year: number; licensePlate: string; status: 'AVAILABLE' | 'DISPATCHED' | 'MAINTENANCE'; currentMileage: number; imageUrl?: string | null; }
interface TransportLocation { name: string; town: string; distanceKm: number; }
interface TransportPlan { morgue: TransportLocation; ceremony: TransportLocation; restingPlace: TransportLocation; returnToBase: TransportLocation; totalKm: number; baseDispatchFee: number; distanceFee: number; totalTransportCost: number; }
interface Booking { id: string; bookingNumber: string; clientName: string; contactPhone: string; burialDate: string; casketName: string; hearseName: string; selectedServices: string[]; totalQuote: number; amountPaid: number; status: 'PENDING' | 'CONFIRMED' | 'COMPLETED'; transport?: TransportPlan; }
interface Memorial { id: string; fullName: string; age: string; dates: string; photos: string[]; eulogy: string; faith: string; relationship: string; tone: string; survivedBy: string; createdAt: string; }
interface PaymentReceipt { id: string; amount: number; referenceNumber: string; date: string; status: 'PENDING_APPROVAL' | 'VERIFIED' | 'REJECTED'; note?: string; }
// ==========================================
// AUTHENTICATION & API CLIENT (PHP / MySQL)
// ==========================================

// 1. Live Login API Call
async function apiLogin(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const res = await fetch(`${API}/api/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Invalid credentials' };
    }
    // Save JWT token & User info to localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    return { success: true, user: data.user, token: data.token };
  } catch (err: any) {
    return { success: false, error: 'Cannot connect to backend server. Make sure PHP is running.' };
  }
}

// 2. Validate Existing Session on Page Reload
async function apiGetMe(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API}/api/me.php`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

// 3. Helper to make authenticated requests anywhere in your app
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  return fetch(`${API}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
    ...options,
    headers,
  });
}
// --- GLOBAL SHARED CONFIGURATIONS ---
const nav = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics' },
  { id: 'inventory', icon: Package, label: 'Caskets' },
  { id: 'hearses', icon: Car, label: 'Hearse Fleet' },
  { id: 'bookings', icon: FileText, label: 'Arrangements' },
  { id: 'receipts', icon: DollarSign, label: 'M-Pesa Verify' },
  { id: 'memorials', icon: Feather, label: 'Memorials' },
] as const;

const INITIAL_COFFINS: InventoryItem[] = [
  { id: 'c1', sku: 'CK-MAH-01', name: 'Royal Mahogany Executive Casket', material: 'SOLID_WOOD', size: 'STANDARD', retailPrice: '125000', currentStock: 3, isLowStock: false },
  { id: 'c2', sku: 'CK-OAK-02', name: 'Imperial Oak Presidential Dome', material: 'SOLID_WOOD', size: 'OVERSIZED', retailPrice: '185000', currentStock: 1, isLowStock: true },
  { id: 'c3', sku: 'CK-PIN-03', name: 'Classic Eco-Pine Vault Casket', material: 'VENEER', size: 'STANDARD', retailPrice: '45000', currentStock: 8, isLowStock: false },
  { id: 'c4', sku: 'CK-STL-04', name: 'Milano Brushed Steel Vault', material: 'METAL_STEEL', size: 'STANDARD', retailPrice: '150000', currentStock: 2, isLowStock: false },
];

const INITIAL_HEARSES: Hearse[] = [
  { id: 'h1', vehicleName: 'Silver Grace Mercedes Funeral Coach', make: 'Mercedes-Benz', model: 'Sprinter Hearse Special', year: 2020, licensePlate: 'KBY 104M', status: 'AVAILABLE', currentMileage: 124500, imageUrl: null },
  { id: 'h2', vehicleName: 'Eternal Peace Limousine Coach', make: 'Volvo', model: 'V90 Funeral Specialist', year: 2022, licensePlate: 'KDD 882X', status: 'DISPATCHED', currentMileage: 42100, imageUrl: null },
  { id: 'h3', vehicleName: 'Golden Gate Heavy-Duty 4x4 Hearse', make: 'Toyota', model: 'Land Cruiser 4WD', year: 2018, licensePlate: 'KBQ 550A', status: 'AVAILABLE', currentMileage: 210800, imageUrl: null },
];

const REGIONAL_MORGUE_PRESETS = [
  { name: 'Nakuru County PGH Mortuary', town: 'Nakuru CBD', distanceKm: 42 },
  { name: 'Subukia Sub-County Hospital Mortuary', town: 'Subukia Town', distanceKm: 4 },
  { name: 'Umash Funeral Home', town: 'Nakuru CBD', distanceKm: 45 },
  { name: 'Nyahururu County Referral Hospital Morgue', town: 'Nyahururu', distanceKm: 48 },
  { name: 'Lee Funeral Home', town: 'Nairobi', distanceKm: 185 },
];

const REGIONAL_CEREMONY_PRESETS = [
  { name: 'National Shrine of Mary Mother of God Basilica', town: 'Subukia', distanceKm: 8 },
  { name: 'PCEA Ebenezer Cathedral', town: 'Nakuru CBD', distanceKm: 44 },
  { name: 'St. Peter\'s Catholic Parish Church', town: 'Subukia Town', distanceKm: 3 },
  { name: 'Bahati ACK Parish Church', town: 'Bahati', distanceKm: 28 },
  { name: 'Rural Homestead Compound', town: 'Mbogoini Village', distanceKm: 18 },
];

const REGIONAL_RESTING_PRESETS = [
  { name: 'Subukia Public Cemetery Grounds', town: 'Subukia', distanceKm: 6 },
  { name: 'Nakuru South Cemetery', town: 'Nakuru South', distanceKm: 46 },
  { name: 'Bahati Public Cemetery', town: 'Bahati', distanceKm: 30 },
  { name: 'Family Ancestral Burial Plot', town: 'Mbogoini Village', distanceKm: 22 },
  { name: 'Sabor Ancestral Farm Plot', town: 'Sabor Area', distanceKm: 34 },
];

const INITIAL_BOOKINGS: Booking[] = [
  { 
    id: 'b1', bookingNumber: 'BK-24-9982', clientName: 'John Kamau', contactPhone: '0722123456', 
    burialDate: '2024-11-20', casketName: 'Royal Mahogany Executive Casket', hearseName: 'Silver Grace Mercedes Funeral Coach', 
    selectedServices: ['Hearse Logistics', 'Lowering Gear (Standard Mechanical)', 'Simple Wreath Package'], 
    totalQuote: 187400, amountPaid: 60000, status: 'CONFIRMED',
    transport: {
      morgue: { name: 'Nakuru County PGH Mortuary', town: 'Nakuru CBD', distanceKm: 42 },
      ceremony: { name: 'National Shrine of Mary Mother of God Basilica', town: 'Subukia', distanceKm: 8 },
      restingPlace: { name: 'Family Ancestral Burial Plot', town: 'Mbogoini Village', distanceKm: 22 },
      returnToBase: { name: 'Triple M Base Operational Hub', town: 'Subukia', distanceKm: 0 },
      totalKm: 145,
      baseDispatchFee: 20000,
      distanceFee: 17400,
      totalTransportCost: 37400
    }
  },
];

const INITIAL_RECEIPTS: PaymentReceipt[] = [
  { id: 'rec_1', amount: 60000, referenceNumber: 'SDR97G8H2K', date: '2024-11-15', status: 'VERIFIED', note: 'Initial Commitment Deposit' }
];

function getLocalData<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(`triplem_${key}`);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalData<T>(key: string, data: T) {
  try {
    localStorage.setItem(`triplem_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

function calculateDetailedLogistics(
  morgueDist: number,
  ceremonyDist: number,
  restingDist: number
): TransportPlan {
  const baseDispatchFee = 20000;
  const perKmRate = 120;
  
  const legOneToBaseMorgue = morgueDist || 0; 
  const legTwoMorgueCeremony = Math.abs((morgueDist || 0) - (ceremonyDist || 0)) + 5; 
  const legThreeCeremonyResting = Math.abs((ceremonyDist || 0) - (restingDist || 0)) + 5; 
  const legFourRestingBase = restingDist || 0; 
  
  const totalKm = Math.round(legOneToBaseMorgue + legTwoMorgueCeremony + legThreeCeremonyResting + legFourRestingBase);
  const distanceFee = totalKm * perKmRate;
  const totalTransportCost = baseDispatchFee + distanceFee;

  return {
    morgue: { name: 'Unspecified Morgue', town: 'Regional Area', distanceKm: morgueDist },
    ceremony: { name: 'Unspecified Ceremony Venue', town: 'Regional Area', distanceKm: ceremonyDist },
    restingPlace: { name: 'Unspecified Resting Place', town: 'Regional Area', distanceKm: restingDist },
    returnToBase: { name: 'Triple M Base Operational Hub', town: 'Subukia Base', distanceKm: 0 },
    totalKm,
    baseDispatchFee,
    distanceFee,
    totalTransportCost
  };
}

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgStyle = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-amber-600';

  return (
    <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-semibold text-xs ${bgStyle}`}>
      <span>{message}</span>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 cursor-pointer"><X size={14} /></button>
    </div>
  );
};

const TransportInvoiceModal = ({ transport, clientName, bookingNumber, onClose }: { transport: TransportPlan; clientName: string; bookingNumber: string; onClose: () => void }) => {
  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Hearse Transport Invoice - ${bookingNumber}</title>
          <style>
            body { font-family: 'Georgia', serif; padding: 40px; color: #110905; background: #FDFBF7; max-width: 750px; margin: auto; }
            .invoice-box { border: 1px solid #E5E7EB; padding: 30px; border-radius: 20px; background: #FFF; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
            .header { text-align: center; border-bottom: 3px double #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { color: #2A1810; font-size: 24px; margin: 5px 0; font-weight: 900; }
            .meta-grid { display: flex; justify-content: space-between; margin: 20px 0; font-size: 13px; line-height: 1.5; }
            .section-title { color: #854D0E; font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; }
            .route-card { background: #FFFDF9; border-left: 4px solid #D4AF37; padding: 15px; font-size: 13px; border-radius: 8px; line-height: 1.6; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #F3F4F6; }
            th { background: #F9FAFB; text-transform: uppercase; font-size: 10px; letter-spacing: 1.5px; font-weight: 800; color: #4B5563; }
            .amount { text-align: right; font-weight: bold; }
            .grand-total { background: #1C0F0A; color: #FBBF24; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 900; margin-top: 30px; }
            .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 2px; line-height: 1.8; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <h1>TRIPLE M FUNERAL SERVICES</h1>
              <p style="margin: 0; font-size: 12px; color: #6B7280; letter-spacing: 1px; text-transform: uppercase;">Dignity • Compassion • Subukia Hub</p>
              <p style="margin-top: 20px; font-size: 18px; font-weight: bold; letter-spacing: 1px;">ITEMIZED TRANSPORT LOGISTICS INVOICE</p>
            </div>
            
            <div class="meta-grid">
              <div>
                <strong style="font-size: 11px; text-transform: uppercase; color: #6B7280;">Billed To:</strong><br/>
                <span style="font-size: 15px; font-weight: bold; color: #2A1810;">${clientName}</span><br/>
                <span>Consolidated Account ID: ${bookingNumber}</span>
              </div>
              <div style="text-align: right;">
                <strong style="font-size: 11px; text-transform: uppercase; color: #6B7280;">Invoice Details:</strong><br/>
                <span>Ref No: <strong>TRN-${bookingNumber}</strong></span><br/>
                <span>Issue Date: ${new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div class="section-title">Verified Logistical Route Flow</div>
            <div class="route-card">
              <strong style="color: #854D0E;">1. Collection (Morgue):</strong> ${transport.morgue.name} (${transport.morgue.town})<br/>
              <strong style="color: #854D0E;">2. Service Ceremony:</strong> ${transport.ceremony.name} (${transport.ceremony.town})<br/>
              <strong style="color: #854D0E;">3. Committal Site (Resting):</strong> ${transport.restingPlace.name} (${transport.restingPlace.town})<br/>
              <strong style="color: #854D0E;">4. Return Route Base:</strong> ${transport.returnToBase.name}<br/>
              <hr style="border: 0; border-top: 1px solid #FEF3C7; margin: 10px 0;" />
              <strong>Total Accounted Operational Loop:</strong> ${transport.totalKm} Kilometers
            </div>

            <div class="section-title">Itemized Logistics Bill</div>
            <table>
              <thead>
                <tr><th>Description</th><th style="text-align: right;">Cost (KES)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Base Hearse Mobilization & Dispatch Fee</td>
                  <td class="amount">${transport.baseDispatchFee.toLocaleString()}.00</td>
                </tr>
                <tr>
                  <td>Distance Surcharge Settle (${transport.totalKm} KM Total Route @ KES 120/km)</td>
                  <td class="amount">${transport.distanceFee.toLocaleString()}.00</td>
                </tr>
              </tbody>
            </table>
            
            <div class="grand-total">
              <span>ESTIMATED LOGISTICS TOTAL</span>
              <span>KES ${transport.totalTransportCost.toLocaleString()}.00</span>
            </div>

            <div class="footer">
              <p>Thank you for letting Triple M Funeral Services support your family's journey.</p>
              <p style="font-size: 9px; margin-top: 15px; color: #9CA3AF;">M-Pesa Business paybill: 400200 • Account: ${bookingNumber}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden text-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto border border-stone-200">
        <div className="bg-gradient-to-r from-[#1C0F0A] to-[#2A1810] text-white p-6 flex justify-between items-center border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <Route className="text-amber-400" size={20} />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-amber-100">Hearse Logistics Invoice</h3>
              <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Ref: TRN-{bookingNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5">
            <p className="text-[10px] uppercase font-black text-amber-800 tracking-widest mb-3">Operational Loop Timeline</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">1</div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase text-stone-500 font-extrabold">Dispatch From Hub To Morgue</p>
                  <p className="text-sm font-black text-stone-800">{transport.morgue.name}</p>
                  <p className="text-xs text-stone-500">{transport.morgue.town} • Base Offset: {transport.morgue.distanceKm} KM</p>
                </div>
              </div>
              <div className="ml-4 border-l-2 border-dashed border-amber-400/60 h-4"></div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">2</div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase text-stone-500 font-extrabold">Mobilize From Morgue To Ceremony</p>
                  <p className="text-sm font-black text-stone-800">{transport.ceremony.name}</p>
                  <p className="text-xs text-stone-500">{transport.ceremony.town} • Route Offset: {transport.ceremony.distanceKm} KM</p>
                </div>
              </div>
              <div className="ml-4 border-l-2 border-dashed border-amber-400/60 h-4"></div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1C0F0A] text-amber-300 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">3</div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase text-stone-500 font-extrabold">Final Journey To Resting Place</p>
                  <p className="text-sm font-black text-stone-800">{transport.restingPlace.name}</p>
                  <p className="text-xs text-stone-500">{transport.restingPlace.town} • Final Offset: {transport.restingPlace.distanceKm} KM</p>
                </div>
              </div>
              <div className="ml-4 border-l-2 border-dashed border-stone-300 h-4"></div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-150 text-stone-600 flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-stone-200">4</div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase text-stone-500 font-extrabold">Operational Hub Retract Return</p>
                  <p className="text-sm font-bold text-stone-700">{transport.returnToBase.name}</p>
                  <p className="text-xs text-stone-400">Subukia Depot Base Hub</p>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-amber-200 flex justify-between text-xs">
              <span className="font-extrabold text-stone-600">Total Route Leg Loop:</span>
              <span className="font-black text-amber-700">{transport.totalKm} KM Total</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-black text-stone-500 tracking-widest mb-3">Itemized Costs</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3.5 bg-stone-50 rounded-xl border">
                <span className="font-bold text-stone-600">Base Hearse Mobilization Fee</span>
                <span className="font-black text-stone-800">KES {transport.baseDispatchFee.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between p-3.5 bg-stone-50 rounded-xl border">
                <span className="font-bold text-stone-600">Logistics Mileage Charge ({transport.totalKm} KM Route Loop @ KES 120/km)</span>
                <span className="font-black text-stone-800">KES {transport.distanceFee.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between p-4 bg-[#1C0F0A] text-amber-100 rounded-2xl mt-4 shadow-md">
                <span className="font-black uppercase tracking-wider text-xs flex items-center gap-1"><Navigation size={14} /> Total Logistics Bill</span>
                <span className="font-black text-base text-amber-300">KES {transport.totalTransportCost.toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-stone-150">
            <button onClick={handlePrint} className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md cursor-pointer"><Printer size={14} /> Print Formal Invoice</button>
            <button onClick={onClose} className="px-6 py-3 border border-stone-200 hover:bg-stone-50 font-bold rounded-xl text-xs transition cursor-pointer">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageLightbox = ({ media, onClose }: { media: { url: string; title: string; subtitle?: string } | null; onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  if (!media) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3 text-white">
          <div>
            <h3 className="text-base font-serif font-bold text-amber-100">{media.title}</h3>
            {media.subtitle && <p className="text-[11px] text-stone-400">{media.subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1 transition cursor-pointer"><X size={16} /> Close</button>
        </div>
        <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center max-h-[80vh]">
          <img src={media.url} alt={media.title} className="max-h-[80vh] max-w-full object-contain" />
        </div>
      </div>
    </div>
  );
};

const MemorialPageViewer = ({ memorial, onClose }: { memorial: Memorial; onClose: () => void }) => (
  <div className="fixed inset-0 z-[90] bg-gradient-to-br from-[#2A1810] via-[#1C0F0A] to-[#110905] overflow-y-auto">
    <div className="max-w-3xl mx-auto p-4 md:p-10">
      <button onClick={onClose} className="mb-6 text-amber-400 hover:text-amber-200 flex items-center gap-1.5 text-xs font-bold transition cursor-pointer"><X size={16} /> Close Memorial View</button>
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-950/20">
        <div className="bg-gradient-to-r from-[#1C0F0A] to-[#2A1810] text-white p-8 text-center border-b-4 border-amber-500">
          <TripleMLogo className="w-16 h-16 mx-auto mb-4" />
          <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-2">In Cherished Remembrance</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-100">{memorial.fullName}</h1>
          <p className="text-sm text-stone-300 mt-2 italic">{memorial.dates}</p>
        </div>
        
        {memorial.photos.length > 0 && (
          <div className="p-6 bg-stone-50 border-b border-stone-200">
            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest text-center mb-4">Memory Gallery</p>
            <div className={`grid gap-3 ${memorial.photos.length === 1 ? 'grid-cols-1' : memorial.photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {memorial.photos.map((photo, idx) => (
                <div key={idx} className="aspect-square overflow-hidden rounded-2xl border-2 border-amber-500/20 shadow-sm">
                  <img src={photo} alt={`Memory ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-8 md:p-12 text-slate-800">
          <h2 className="text-2xl font-serif font-bold text-[#2A1810] text-center mb-6">The Eulogy</h2>
          <div className="text-slate-700 font-serif text-base leading-relaxed whitespace-pre-wrap">{memorial.eulogy}</div>
        </div>
        
        <div className="p-6 bg-[#1C0F0A] text-center border-t border-stone-800">
          <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Triple M Funeral Services • Nakuru - Subukia</p>
        </div>
      </div>
    </div>
  </div>
);

function generateEulogyText(data: {
  fullName: string; age: string; relationship: string; personality: string;
  achievements: string; hobbies: string; survivedBy: string; faith: string; tone: string;
}): string {
  const { fullName, age, relationship, personality, achievements, hobbies, survivedBy, faith, tone } = data;
  const firstName = fullName.trim().split(' ')[0] || 'our beloved';

  let toneOpening = '';
  let legacySection = '';
  let faithClosing = '';

  if (tone === 'poetic') {
    toneOpening = `We gather quieted by sorrow, yet illuminated by a constellation of beautiful memories. Today, we celebrate the delicate, poetic cadence of ${fullName}, a dear ${relationship} who graced this world for ${age} glorious years. To know ${firstName} was to understand standard grace; they possessed a soul woven from ${personality}, offering light to every shadowed corner of Subukia.`;
  } else if (tone === 'celebratory') {
    toneOpening = `What a life! What a journey! Today, we raise our voices not just in grief, but in absolute, roaring celebration of ${fullName}! For ${age} spectacular years, this wonderful ${relationship} taught us how to live with fire and unshakeable joy. Possessing an infectious aura characterized by being ${personality}, ${firstName} turned the everyday into a festival of community love!`;
  } else {
    toneOpening = `In accordance with custom and deep institutional reverence, we assemble today to render our final respects to ${fullName}, who has departed this earthly sphere at the age of ${age}. As a respected ${relationship}, ${firstName} leaves behind an unblemished record of virtue, distinguished by a character described by peers as ${personality}.`;
  }

  if (faith === 'Christian') {
    faithClosing = `We find refuge in the holy scripture, trusting that ${firstName} has returned to the Father's mansion. Rooted in faith, we hold fast to the glorious promise of resurrection. May the Lord shine His perpetual light upon ${firstName}, and grant unshakeable comfort to all who grieve today.`;
  } else if (faith === 'Catholic') {
    faithClosing = `Through the holy sacraments and intercessions of our Holy Mother, we entrust the noble soul of ${firstName} into Christ's merciful care. We pray the Holy Rosary for their peaceful passage into eternity. Perpetual light shine upon them, O Lord, and may they rest in peace.`;
  } else if (faith === 'Muslim') {
    faithClosing = `Inna lillahi wa inna ilayhi raji'un (Indeed, to Allah we belong and to Allah we shall return). We pray that Almighty Allah forgives ${firstName}'s shortcomings, showers them with infinite Rahma, and welcomes them into the absolute bliss of Jannat-ul-Firdaus. May Allah grant Sabr to the family.`;
  } else if (faith === 'Traditional') {
    faithClosing = `The ancestors have called a mighty warrior home. We look to the hills of Nakuru and the sacred forests, knowing ${firstName} has taken their respected place in the cloud of guardians watching over our homesteads. Their name will be spoken in honor by generations to come.`;
  } else {
    faithClosing = `Though the physical chapter has drawn to a quiet close, the spark that was ${firstName} cannot be extinguished. They live on dynamically inside our shared memories, our ideals, and the daily acts of kindness we practice in their honor. May their memory remain an enduring compass for us all.`;
  }

  if (achievements) legacySection += `A monument of their time on earth, ${firstName} dedicated endless vigor to ${achievements}. `;
  if (hobbies) legacySection += `In quiet moments, ${firstName} found peaceful refuge in ${hobbies}, showcasing a profound appreciation for life's simple wonders. `;
  if (survivedBy) legacySection += `The legacy of their beautiful heart continues to shine through those they treasured most: ${survivedBy}.`;

  return `MEMORIAL EULOGY FOR ${fullName.toUpperCase()}
Aged ${age} Years • Beloved ${relationship.toUpperCase()}

${toneOpening}

${legacySection || `For ${age} years, ${firstName} lived standardly and loved selflessly, leaving behind an indelible blueprint of empathy and strength.`}

${faithClosing}

Rest in eternal peace, dear ${firstName}. You are loved beyond words, missed beyond measure, and remembered forever.`;
}

const QRCodeDisplay = ({ value, size = 180 }: { value: string; size?: number }) => {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&color=1C0F0A&bgcolor=FFFFFF&margin=10`;
  return (
    <div className="inline-block p-3 bg-white rounded-2xl border-4 border-[#1C0F0A] shadow-lg">
      <img src={src} alt="Memorial QR Code" width={size} height={size} className="block mx-auto" />
    </div>
  );
};

const EulogyGeneratorModal = ({ isOpen, onClose, addToast }: { isOpen: boolean; onClose: () => void; addToast: (msg: string, type: 'success' | 'error' | 'info') => void }) => {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [eulogy, setEulogy] = useState('');
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showMemorialPreview, setShowMemorialPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '', age: '', dob: '', dod: '', relationship: 'father', personality: '',
    achievements: '', hobbies: '', survivedBy: '', faith: 'Christian', tone: 'warm'
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 6 - photos.length);
    const next: string[] = [];
    for (const file of files) {
      try {
        next.push(await fileToBase64(file));
      } catch (err) {
        addToast('Failed to process image. Choose a compressed JPEG or PNG file.', 'error');
      }
    }
    setPhotos([...photos, ...next]);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      const result = generateEulogyText(formData);
      setEulogy(result);
      
      const newMemorial: Memorial = {
        id: generateId('MEM'),
        fullName: formData.fullName,
        age: formData.age,
        dates: formData.dob && formData.dod ? `${formData.dob} — ${formData.dod}` : `Aged ${formData.age} years`,
        photos,
        eulogy: result,
        faith: formData.faith,
        relationship: formData.relationship,
        tone: formData.tone,
        survivedBy: formData.survivedBy,
        createdAt: new Date().toISOString(),
      };

      const existing = getLocalData<Memorial[]>('memorials', []);
      const updated = [newMemorial, ...existing];
      setLocalData('memorials', updated);
      window.dispatchEvent(new Event('storage'));
      
      setMemorial(newMemorial);
      setStep('result');
      setGenerating(false);
      addToast('Memorial and Eulogy compiled successfully!', 'success');
    }, 1400);
  };

  const memorialUrl = memorial ? `${window.location.origin}${window.location.pathname}?memorial=${memorial.id}` : '';

  const handlePrintQR = () => {
    if (!memorial) return;
    const w = window.open('', '_blank');
    if (!w) return;
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(memorialUrl)}&color=1C0F0A&bgcolor=FFFFFF&margin=10`;
    w.document.write(`
      <html>
        <head>
          <title>QR Link — ${memorial.fullName}</title>
          <style>
            body { font-family: 'Georgia', serif; text-align: center; padding: 40px; color: #2A1810; background: #FDFBF7; }
            h1 { color: #854D0E; font-size: 28px; margin-bottom: 5px; font-weight: 900; }
            .dates { font-style: italic; color: #6B7280; font-size: 14px; margin-bottom: 25px; }
            .name { font-size: 24px; font-weight: bold; margin-top: 10px; color: #1C0F0A; }
            .qr-box { display: inline-block; padding: 20px; border: 4px solid #1C0F0A; border-radius: 20px; background: #FFF; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
            .footer { margin-top: 50px; font-size: 11px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 2px; }
          </style>
        </head>
        <body>
          <h1>In Loving Remembrance</h1>
          <p class="name">${memorial.fullName}</p>
          <p class="dates">${memorial.dates}</p>
          <div class="qr-box"><img src="${qr}" width="300" height="300" /></div>
          <p style="margin-top: 20px; font-weight: bold; font-size: 14px; color: #2A1810;">Scan to view photos and complete eulogy text.</p>
          <p class="footer">Triple M Funeral Services • Nakuru - Subukia</p>
        </body>
      </html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const handleReset = () => {
    setStep('input'); setEulogy(''); setPhotos([]); setMemorial(null);
    setFormData({ fullName: '', age: '', dob: '', dod: '', relationship: 'father', personality: '', achievements: '', hobbies: '', survivedBy: '', faith: 'Christian', tone: 'warm' });
  };

  if (!isOpen) return null;

  return (
    <>
      {showMemorialPreview && memorial && <MemorialPageViewer memorial={memorial} onClose={() => setShowMemorialPreview(false)} />}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden text-slate-800 my-6 border border-stone-250">
          <div className="bg-gradient-to-r from-[#1C0F0A] to-[#2A1810] text-white p-6 flex justify-between items-center border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <Feather className="text-amber-400 animate-pulse" size={20} />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-amber-100">AI Eulogy & Memorial Page Builder</h3>
                <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Burial Memorialization</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer"><X size={18} /></button>
          </div>

          {step === 'input' ? (
            <form onSubmit={handleGenerate} className="p-6 md:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
                Provide biographical details below. The engine will dynamically generate a polished, respectful eulogy page complete with guest QR code sharing.
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-2">Upload Photos ({photos.length}/6)</label>
                <div className="grid grid-cols-6 gap-2">
                  {photos.map((p, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group">
                      <img src={p} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"><X size={10} /></button>
                    </div>
                  ))}
                  {photos.length < 6 && (
                    <label className="aspect-square border-2 border-dashed border-amber-500/30 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-amber-500/5 hover:bg-amber-500/10 transition">
                      <ImagePlus size={18} className="text-amber-600" />
                      <span className="text-[9px] font-bold text-amber-700 mt-1">Add Photo</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Full Name *</label>
                  <input required placeholder="Mzee John Kamau" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition text-stone-850" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Age *</label>
                  <input required type="number" placeholder="E.g., 78" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition text-stone-850" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Date of Birth</label>
                  <input placeholder="E.g., 14th June 1946" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition text-stone-850" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Date of Passing</label>
                  <input placeholder="E.g., 2nd November 2024" value={formData.dod} onChange={e => setFormData({ ...formData, dod: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition text-stone-850" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Relationship Role</label>
                  <select value={formData.relationship} onChange={e => setFormData({ ...formData, relationship: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-white rounded-xl text-stone-850 cursor-pointer">
                    <option value="father">Beloved Father</option>
                    <option value="mother">Beloved Mother</option>
                    <option value="husband">Loving Husband</option>
                    <option value="wife">Loving Wife</option>
                    <option value="grandfather">Grandfather</option>
                    <option value="grandmother">Grandmother</option>
                    <option value="friend">Cherished Friend</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Faith / Rite Framework</label>
                  <select value={formData.faith} onChange={e => setFormData({ ...formData, faith: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-white rounded-xl text-stone-850 cursor-pointer">
                    <option value="Christian">Christian (Protestant)</option>
                    <option value="Catholic">Roman Catholic</option>
                    <option value="Muslim">Islamic Tradition</option>
                    <option value="Traditional">Kikuyu Traditional Custom</option>
                    <option value="Secular">Secular (Humanist Reflections)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Prose Tone</label>
                  <select value={formData.tone} onChange={e => setFormData({ ...formData, tone: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-white rounded-xl text-stone-850 cursor-pointer">
                    <option value="warm">Warm & Poetic</option>
                    <option value="celebratory">Celebratory & Vibrant</option>
                    <option value="formal">Traditional & Formal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Personality *</label>
                  <input required placeholder="E.g., deep quiet strength, resolute integrity, selfless hospitality" value={formData.personality} onChange={e => setFormData({ ...formData, personality: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition text-stone-850" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Achievements & Life Impact</label>
                <textarea rows={2} placeholder="E.g., managed a dedicated coffee farm in Subukia, constructed regional wells, and funded school fees for orphans..." value={formData.achievements} onChange={e => setFormData({ ...formData, achievements: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition text-stone-850" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Hobbies & Pursuits</label>
                <input placeholder="E.g., storytelling, listening to classical choral tracks, gardening red roses" value={formData.hobbies} onChange={e => setFormData({ ...formData, hobbies: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition text-stone-850" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Direct Survivors</label>
                <input placeholder="E.g., his loving wife Sarah, five sons, and nine grandchildren" value={formData.survivedBy} onChange={e => setFormData({ ...formData, survivedBy: e.target.value })} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition text-stone-850" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-stone-500 rounded-xl hover:bg-stone-50 transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={generating} className="px-6 py-3 text-xs font-black bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer">
                  {generating ? 'Composing...' : <><Sparkles size={14} /> Generate & Publish</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 md:p-8 space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex gap-3 items-center text-emerald-900 text-xs">
                <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
                <div>
                  <p className="font-bold">Remembrance Site Successfully Generated</p>
                  <p className="text-[11px] opacity-90 mt-0.5">Guests can scan the QR code at the burial venue to access photo reels and the complete eulogy.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1C0F0A] to-[#2A1810] rounded-3xl p-6 text-center text-white border border-amber-500/20 shadow-inner">
                <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-1">Memorial QR Code</p>
                <h3 className="text-xl font-serif font-bold text-amber-100">{memorial?.fullName}</h3>
                <p className="text-[11px] text-stone-400 italic mb-4">{memorial?.dates}</p>
                <div className="flex justify-center mb-2"><QRCodeDisplay value={memorialUrl} size={150} /></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => setShowMemorialPreview(true)} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white font-bold text-xs flex flex-col items-center gap-2 transition text-stone-700 shadow-sm cursor-pointer"><Eye size={18} className="text-amber-600" /> Preview Page</button>
                <button onClick={handlePrintQR} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white font-bold text-xs flex flex-col items-center gap-2 transition text-stone-700 shadow-sm cursor-pointer"><Printer size={18} className="text-amber-600" /> Print QR Sheet</button>
                <button onClick={() => { navigator.clipboard.writeText(memorialUrl); addToast('URL Copied!', 'success'); }} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white font-bold text-xs flex flex-col items-center gap-2 transition text-stone-700 shadow-sm cursor-pointer"><Share2 size={18} className="text-amber-600" /> Copy Link</button>
                <button onClick={() => { navigator.clipboard.writeText(eulogy); setCopied(true); addToast('Eulogy text copied', 'info'); setTimeout(() => setCopied(false), 2000); }} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white font-bold text-xs flex flex-col items-center gap-2 transition text-stone-700 shadow-sm cursor-pointer"><Copy size={18} className="text-amber-600" /> {copied ? 'Copied' : 'Copy Eulogy'}</button>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 max-h-48 overflow-y-auto text-[11px] text-stone-600 leading-relaxed whitespace-pre-wrap font-serif">
                {eulogy}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                <button onClick={handleReset} className="text-xs font-bold text-amber-700 hover:text-amber-500 flex items-center gap-1 transition cursor-pointer"><PenTool size={14} /> Compose Another</button>
                <button onClick={onClose} className="px-6 py-3 text-xs font-bold bg-[#1C0F0A] hover:bg-stone-850 text-amber-100 rounded-xl transition cursor-pointer">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ============================================================================
// PUBLIC WEBSITE VIEW
// ============================================================================
const ClientWebsite = ({ onEnterAdmin, onEnterFamily, theme, onToggleTheme, addToast }: any) => {
  const [publicCatalog, setPublicCatalog] = useState<InventoryItem[]>([]);
  const [publicHearses, setPublicHearses] = useState<Hearse[]>([]);
  const [isEulogyOpen, setIsEulogyOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const [viewingMemorial, setViewingMemorial] = useState<Memorial | null>(null);
  const isDark = theme === 'dark';

  const loadData = () => {
    setPublicCatalog(getLocalData('coffins', INITIAL_COFFINS));
    setPublicHearses(getLocalData('hearses', INITIAL_HEARSES));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    const id = new URLSearchParams(window.location.search).get('memorial');
    if (id) {
      const found = getLocalData<Memorial[]>('memorials', []).find(m => m.id === id);
      if (found) setViewingMemorial(found);
    }
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const services = [
    { icon: Package, title: 'Bespoke Caskets', desc: 'Crafted with premium woods, robust metals, and polished finishes.' },
    { icon: Car, title: 'Professional Hearses', desc: 'Sleek limousine coaches and heavy-duty 4WD vehicles.' },
    { icon: Route, title: 'Logistics Quotes', desc: 'Real-time routing fees compiled directly from the mortuary to the cemetery.', isNew: true },
    { icon: ArrowDownCircle, title: 'Lowering Gear', desc: 'Precision mechanical devices for safe and smooth graveside committals.' },
    { icon: Flower2, title: 'Floral Presets', desc: 'Custom casket covers, podium wreaths, and fresh bouquets.' },
    { icon: Feather, title: 'AI Eulogy Builder', desc: 'Generate a stunning memorial page and share via a guest QR code.', isNew: true, action: () => setIsEulogyOpen(true) },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? 'bg-[#150B07] text-stone-200' : 'bg-[#FDFBF7] text-stone-800'}`}>
      <ImageLightbox media={activeMedia} onClose={() => setActiveMedia(null)} />
      <EulogyGeneratorModal isOpen={isEulogyOpen} onClose={() => setIsEulogyOpen(false)} addToast={addToast} />
      {viewingMemorial && <MemorialPageViewer memorial={viewingMemorial} onClose={() => setViewingMemorial(null)} />}

      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${isDark ? 'bg-[#211109]/95 border-amber-950/40 text-amber-100' : 'bg-white/90 border-amber-900/10'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <TripleMLogo className="w-12 h-12" />
            <div>
              <h1 className={`text-xl font-serif font-extrabold tracking-wide ${isDark ? 'text-amber-100' : 'text-[#2A1810]'}`}>Triple M Services</h1>
              <p className="text-[9px] uppercase tracking-widest text-amber-500 font-black">Professional Funeral Directors • Subukia</p>
            </div>
          </div>
          <nav className="hidden lg:flex gap-5 text-xs font-bold items-center">
            <a href="#services" className="hover:text-amber-500 transition">Services</a>
            <a href="#fleet" className="hover:text-amber-500 transition">Fleet</a>
            <a href="#catalog" className="hover:text-amber-500 transition">Caskets</a>
            <button onClick={() => setIsEulogyOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black px-4 py-2.5 rounded-full flex items-center gap-1.5 transition shadow-sm cursor-pointer"><Feather size={14} /> AI Memorial</button>
            <button onClick={onEnterFamily} className="text-amber-600 border border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-xs font-black px-4 py-2.5 rounded-full flex items-center gap-1.5 transition cursor-pointer"><UserIcon size={14} /> Family Portal</button>
            <button onClick={onEnterAdmin} className="text-stone-500 border border-stone-300 bg-stone-100 hover:bg-stone-200 text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition cursor-pointer"><Lock size={14} /> Admin Access</button>
            <button onClick={onToggleTheme} className={`p-2.5 rounded-full border transition cursor-pointer ${isDark ? 'border-amber-900 text-amber-300 bg-amber-950/20' : 'border-stone-200 text-stone-600 bg-stone-50'}`}>{isDark ? <Sun size={14} /> : <Moon size={14} />}</button>
          </nav>
        </div>
      </header>

      <section className="relative py-24 md:py-32 px-6 text-center text-white bg-gradient-to-br from-[#2A1810] via-[#1C0F0A] to-[#110905] overflow-hidden">
        <TripleMLogo className="w-20 h-20 mx-auto mb-6 drop-shadow-xl" />
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-6 uppercase tracking-widest"><Sparkles size={12} /> Serving Nakuru & Subukia Regions</span>
        <h2 className="text-4xl md:text-6xl font-serif font-extrabold tracking-tight mb-6">Honoring Precious Lives with<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">Dignity, Serenity & Absolute Respect</span></h2>
        <p className="text-stone-300 max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">Let us handle the details. Create customized service arrangements, draft itemized transport routes, select robust caskets, and generate instant remembrance sites with guests QR codes.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={onEnterFamily} className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider transition duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center gap-2 cursor-pointer">Plan Service & Get Quote <RightArrow size={14} /></button>
          <button onClick={() => setIsEulogyOpen(true)} className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider transition cursor-pointer">Create AI Memorial Page</button>
        </div>
      </section>

      <section id="services" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-500 font-extrabold uppercase text-xs tracking-widest">Our Professional Standard</span>
          <h3 className={`text-3xl font-serif font-bold mt-2 ${isDark ? 'text-amber-100' : 'text-[#2A1810]'}`}>Comprehensive Bereavement Support</h3>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {services.map((s, i) => (
            <div key={i} onClick={s.action} className={`p-6 rounded-3xl border text-center transition duration-300 ${s.action ? 'cursor-pointer transform hover:-translate-y-1' : ''} ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'} ${s.isNew ? 'ring-2 ring-amber-500/50' : ''}`}>
              {s.isNew && <span className="inline-block mb-3 bg-amber-500 text-stone-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">New</span>}
              <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center ${s.isNew ? 'bg-amber-500 text-white' : 'bg-amber-500/10 text-amber-500'}`}><s.icon size={22} /></div>
              <h4 className={`font-bold text-sm mb-2 ${isDark ? 'text-amber-100' : 'text-[#2A1810]'}`}>{s.title}</h4>
              <p className="text-xs text-stone-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fleet" className={`py-20 px-6 border-t ${isDark ? 'bg-[#110905] border-amber-950/40' : 'bg-[#F9F7F3] border-stone-200'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-extrabold uppercase text-xs tracking-widest">Our Logistical Fleet</span>
            <h3 className={`text-3xl font-serif font-bold mt-2 ${isDark ? 'text-amber-100' : 'text-[#2A1810]'}`}>Hearse Transport Coaches</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {publicHearses.map(h => (
              <div key={h.id} className={`rounded-3xl border p-5 transition hover:shadow-lg ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200'}`}>
                {h.imageUrl ? (
                  <div className="relative group h-48 rounded-2xl overflow-hidden mb-4 cursor-pointer" onClick={() => setActiveMedia({ url: mediaSrc(h.imageUrl), title: h.vehicleName, subtitle: h.licensePlate })}>
                    <img src={mediaSrc(h.imageUrl)} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt={h.vehicleName} />
                  </div>
                ) : (
                  <div className="h-48 rounded-2xl border border-dashed border-amber-500/20 bg-amber-500/5 flex flex-col items-center justify-center mb-4 text-amber-500/80"><Car size={36} /><span className="text-[10px] mt-2 uppercase font-bold tracking-wider">Awaiting Portrait</span></div>
                )}
                <h4 className="font-bold text-sm">{h.vehicleName}</h4>
                <p className="text-xs text-stone-500">{h.make} {h.model} • {h.year}</p>
                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                  <span className="font-mono bg-stone-100 px-2 py-1 rounded text-stone-600 font-bold text-[11px]">{h.licensePlate}</span>
                  <span className={`px-2.5 py-1 rounded-full font-black text-[9px] uppercase ${h.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700' : h.status === 'DISPATCHED' ? 'bg-amber-50 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-extrabold uppercase text-xs tracking-widest">Handmade Precision</span>
          <h3 className={`text-3xl font-serif font-bold mt-2 ${isDark ? 'text-amber-100' : 'text-[#2A1810]'}`}>The Caskets Catalog</h3>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {publicCatalog.map(item => (
            <div key={item.id} className={`rounded-3xl border p-4 transition hover:shadow-lg ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
              {item.imageUrl ? (
                <div className="h-44 rounded-2xl overflow-hidden mb-4 cursor-pointer" onClick={() => setActiveMedia({ url: mediaSrc(item.imageUrl), title: item.name })}>
                  <img src={mediaSrc(item.imageUrl)} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt={item.name} />
                </div>
              ) : (
                <div className="h-44 rounded-2xl border border-dashed border-amber-500/20 bg-amber-500/5 flex items-center justify-center mb-4 text-amber-500/80"><Package size={32} /></div>
              )}
              <h4 className="font-bold text-xs leading-tight">{item.name}</h4>
              <p className="text-[10px] text-stone-400 uppercase mt-1 font-bold">{item.material.replace('_', ' ')} • {item.size}</p>
              <div className="mt-3 flex justify-between items-center pt-2 border-t border-stone-50">
                <span className="text-xs text-stone-400">Retail Price</span>
                <span className="text-xs font-black text-amber-600">KES {Number(item.retailPrice).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 px-6 bg-[#1C0F0A] text-stone-400 text-xs border-t border-stone-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <TripleMLogo className="w-8 h-8" />
            <p>© {new Date().getFullYear()} Triple M Funeral Services Nakuru-Subukia. All Rights Reserved.</p>
          </div>
          <div className="flex gap-6">
            <button onClick={onEnterFamily} className="text-amber-400 hover:text-white flex items-center gap-1 transition cursor-pointer"><UserIcon size={14}/> Family Portal</button>
            <button onClick={onEnterAdmin} className="text-stone-500 hover:text-white flex items-center gap-1 transition cursor-pointer"><Lock size={14}/> Staff Portal</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ============================================================================
// FAMILY / CLIENT INTERACTIVE PLANNING PORTAL
// ============================================================================
const FamilyPortal = ({ onBack, theme, addToast }: any) => {
  const isDark = theme === 'dark';
  
  // Check if profile exists locally
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('triplem_family_profile');
  });
  
  const [activeProfile, setActiveProfile] = useState<{ firstName: string; lastName: string; email: string; phone: string } | null>(() => {
    try {
      const p = localStorage.getItem('triplem_family_profile');
      return p ? JSON.parse(p) : null;
    } catch {
      return null;
    }
  });

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [portalTab, setPortalTab] = useState<'overview' | 'planner' | 'payments'>('overview');
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [hearses, setHearses] = useState<Hearse[]>([]);
  const [isEulogyOpen, setIsEulogyOpen] = useState(false);
  const [showTransportInvoice, setShowTransportInvoice] = useState(false);

  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [newReceipt, setNewReceipt] = useState({ ref: '', amt: '', note: '' });

  // Account Authentication Form States
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [familyAuth, setFamilyAuth] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  // Planner Form States
  const [plannerForm, setPlannerForm] = useState({
    casketId: '',
    hearseId: '',
    loweringGearPreset: 'none',
    floralPreset: 'none',
    hasPallbearers: false,
    burialDate: '',
    
    morgueName: '',
    morgueTown: '',
    morgueDistance: 0,
    
    ceremonyName: '',
    ceremonyTown: '',
    ceremonyDistance: 0,
    
    restingName: '',
    restingTown: '',
    restingDistance: 0,
  });

  const [plannedQuote, setPlannedQuote] = useState<number | null>(null);
  const [savedTransport, setSavedTransport] = useState<TransportPlan | null>(null);

  const loadOperationalData = () => {
    setInventory(getLocalData('coffins', INITIAL_COFFINS));
    setHearses(getLocalData('hearses', INITIAL_HEARSES));
    setReceipts(getLocalData('receipts', INITIAL_RECEIPTS));
    
    const savedQuote = localStorage.getItem('triplem_saved_quote');
    if (savedQuote) setPlannedQuote(Number(savedQuote));
    
    const savedTrans = localStorage.getItem('triplem_saved_transport');
    if (savedTrans) setSavedTransport(JSON.parse(savedTrans));
  };

  useEffect(() => {
    loadOperationalData();
    window.addEventListener('storage', loadOperationalData);
    return () => window.removeEventListener('storage', loadOperationalData);
  }, []);

  const baseCost = 65000; 
  const totalCost = plannedQuote !== null ? plannedQuote : baseCost + 80000;
  const verifiedPaid = receipts.filter(r => r.status === 'VERIFIED').reduce((sum, r) => sum + r.amount, 0);
  const balanceDue = Math.max(0, totalCost - verifiedPaid);

  const availableHearses = hearses.filter(h => h.status === 'AVAILABLE');
  const selectedCasket = inventory.find(c => c.id === plannerForm.casketId);
  const selectedHearse = hearses.find(h => h.id === plannerForm.hearseId);
  
  const liveCasketPrice = selectedCasket ? Number(selectedCasket.retailPrice) : 0;
  
  const hasTransportLocations = plannerForm.morgueName && plannerForm.ceremonyName && plannerForm.restingName;
  const liveTransport: TransportPlan | null = hasTransportLocations ? calculateDetailedLogistics(
    plannerForm.morgueDistance,
    plannerForm.ceremonyDistance,
    plannerForm.restingDistance
  ) : null;
  const liveTransportCost = liveTransport ? liveTransport.totalTransportCost : 0;
  
  let liveGearPrice = 0;
  if (plannerForm.loweringGearPreset === 'standard') liveGearPrice = 10000;
  if (plannerForm.loweringGearPreset === 'premium') liveGearPrice = 25000;

  let liveFloralPrice = 0;
  if (plannerForm.floralPreset === 'simple') liveFloralPrice = 5000;
  if (plannerForm.floralPreset === 'majestic') liveFloralPrice = 15000;

  const livePallbearerPrice = plannerForm.hasPallbearers ? 12000 : 0;
  const liveTotal = baseCost + liveCasketPrice + liveTransportCost + liveGearPrice + liveFloralPrice + livePallbearerPrice;

  // Form Registration & Login Handler
  const handleFamilyAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyAuth.email || !familyAuth.phone) {
      addToast('Email address and M-Pesa phone number are required', 'error');
      return;
    }
    if (authMode === 'register' && (!familyAuth.firstName || !familyAuth.lastName)) {
      addToast('Please enter your full name', 'error');
      return;
    }

    setLoadingAction('form');
    setTimeout(() => {
      const profile = {
        firstName: familyAuth.firstName || familyAuth.email.split('@')[0],
        lastName: familyAuth.lastName || 'Client',
        email: familyAuth.email,
        phone: familyAuth.phone,
      };
      localStorage.setItem('triplem_family_profile', JSON.stringify(profile));
      setActiveProfile(profile);
      setIsLoggedIn(true);
      setLoadingAction(null);
      addToast(authMode === 'register' ? 'Family account registered successfully!' : 'Signed in successfully!', 'success');
    }, 800);
  };

  // Mock Social Media Auth Handlers
  const handleSocialLogin = (provider: string) => {
    setLoadingAction(provider);
    setTimeout(() => {
      const profile = {
        firstName: provider === 'Google' ? 'Google' : 'Facebook',
        lastName: 'Client',
        email: provider === 'Google' ? 'family.google@example.com' : 'family.facebook@example.com',
        phone: '0722000111',
      };
      localStorage.setItem('triplem_family_profile', JSON.stringify(profile));
      setActiveProfile(profile);
      setIsLoggedIn(true);
      setLoadingAction(null);
      addToast(`Authenticated via ${provider}`, 'success');
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('triplem_family_profile');
    setActiveProfile(null);
    setIsLoggedIn(false);
    addToast('Logged out of portal', 'info');
  };

  const handleReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReceipt.ref || !newReceipt.amt) return;
    
    const item: PaymentReceipt = {
      id: generateId('REC'), 
      amount: Number(newReceipt.amt), 
      referenceNumber: newReceipt.ref.toUpperCase().trim(),
      date: new Date().toISOString().split('T')[0], 
      status: 'PENDING_APPROVAL', 
      note: newReceipt.note
    };

    const updated = [item, ...receipts];
    setReceipts(updated);
    setLocalData('receipts', updated);
    window.dispatchEvent(new Event('storage'));
    
    setNewReceipt({ ref: '', amt: '', note: '' });
    addToast('Receipt registered. Operations will validate code shortly.', 'info');
  };

  const applyLocationPreset = (type: 'morgue' | 'ceremony' | 'resting', preset: any) => {
    if (type === 'morgue') {
      setPlannerForm({ ...plannerForm, morgueName: preset.name, morgueTown: preset.town, morgueDistance: preset.distanceKm });
    } else if (type === 'ceremony') {
      setPlannerForm({ ...plannerForm, ceremonyName: preset.name, ceremonyTown: preset.town, ceremonyDistance: preset.distanceKm });
    } else {
      setPlannerForm({ ...plannerForm, restingName: preset.name, restingTown: preset.town, restingDistance: preset.distanceKm });
    }
  };

  const saveArrangementPlan = () => {
    setPlannedQuote(liveTotal);
    localStorage.setItem('triplem_saved_quote', liveTotal.toString());
    
    if (liveTransport) {
      const fullTransport: TransportPlan = {
        ...liveTransport,
        morgue: { name: plannerForm.morgueName, town: plannerForm.morgueTown, distanceKm: plannerForm.morgueDistance },
        ceremony: { name: plannerForm.ceremonyName, town: plannerForm.ceremonyTown, distanceKm: plannerForm.ceremonyDistance },
        restingPlace: { name: plannerForm.restingName, town: plannerForm.restingTown, distanceKm: plannerForm.restingDistance }
      };
      setSavedTransport(fullTransport);
      localStorage.setItem('triplem_saved_transport', JSON.stringify(fullTransport));
    }
    
    const clientFullName = activeProfile ? `${activeProfile.firstName} ${activeProfile.lastName}` : 'John Kamau';
    const clientPhone = activeProfile ? activeProfile.phone : '0722123456';

    const activeBookings = getLocalData<Booking[]>('bookings', INITIAL_BOOKINGS);
    let familyBooking = activeBookings.find(b => b.bookingNumber === 'BK-24-9982');
    
    if (familyBooking) {
      familyBooking.clientName = clientFullName;
      familyBooking.contactPhone = clientPhone;
      familyBooking.totalQuote = liveTotal;
      familyBooking.casketName = selectedCasket ? selectedCasket.name : 'Custom Selection';
      familyBooking.hearseName = selectedHearse ? selectedHearse.vehicleName : 'Custom Logistics';
      if (liveTransport) {
        familyBooking.transport = {
          ...liveTransport,
          morgue: { name: plannerForm.morgueName, town: plannerForm.morgueTown, distanceKm: plannerForm.morgueDistance },
          ceremony: { name: plannerForm.ceremonyName, town: plannerForm.ceremonyTown, distanceKm: plannerForm.ceremonyDistance },
          restingPlace: { name: plannerForm.restingName, town: plannerForm.restingTown, distanceKm: plannerForm.restingDistance }
        };
      }
      familyBooking.selectedServices = [
        `Transport: ${plannerForm.morgueName} → ${plannerForm.ceremonyName} → ${plannerForm.restingName}`,
        plannerForm.loweringGearPreset !== 'none' ? `Lowering Gear (${plannerForm.loweringGearPreset})` : '',
        plannerForm.floralPreset !== 'none' ? `Florals (${plannerForm.floralPreset})` : '',
        plannerForm.hasPallbearers ? 'Pallbearers squad' : ''
      ].filter(Boolean);
    } else {
      familyBooking = {
        id: generateId('BKG'),
        bookingNumber: 'BK-24-9982',
        clientName: clientFullName,
        contactPhone: clientPhone,
        burialDate: plannerForm.burialDate || 'TBD',
        casketName: selectedCasket ? selectedCasket.name : 'Custom Selection',
        hearseName: selectedHearse ? selectedHearse.vehicleName : 'Custom Logistics',
        selectedServices: ['Hearse Transport', 'Directorship'],
        totalQuote: liveTotal,
        amountPaid: verifiedPaid,
        status: 'CONFIRMED',
        transport: liveTransport ? {
          ...liveTransport,
          morgue: { name: plannerForm.morgueName, town: plannerForm.morgueTown, distanceKm: plannerForm.morgueDistance },
          ceremony: { name: plannerForm.ceremonyName, town: plannerForm.ceremonyTown, distanceKm: plannerForm.ceremonyDistance },
          restingPlace: { name: plannerForm.restingName, town: plannerForm.restingTown, distanceKm: plannerForm.restingDistance }
        } : undefined
      };
      activeBookings.push(familyBooking);
    }
    
    setLocalData('bookings', activeBookings);
    window.dispatchEvent(new Event('storage'));
    
    setPortalTab('overview');
    addToast('Service arrangement confirmed and saved!', 'success');
  };

  // --- STRICT UNCONDITIONAL AUTH SCREEN GUARD ---
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative font-sans ${isDark ? 'bg-[#150B07]' : 'bg-[#FDFBF7]'}`}>
        <button onClick={onBack} className="absolute top-8 left-8 text-amber-500 hover:text-amber-400 flex items-center gap-2 font-bold text-xs transition cursor-pointer">
          <ChevronLeft size={16} /> Home Website
        </button>

        <div className={`rounded-3xl shadow-2xl border w-full max-w-md overflow-hidden ${isDark ? 'bg-[#1C0F0A] border-amber-950/40 text-stone-200' : 'bg-white border-stone-200'}`}>
          <div className="p-8 text-center border-b border-stone-100/10">
            <TripleMLogo className="w-16 h-16 mx-auto mb-4" />
            <h2 className={`text-xl font-bold font-serif ${isDark ? 'text-amber-100' : 'text-[#2A1810]'}`}>Secure Family Console</h2>
            <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest font-semibold">
              Register or sign in to manage burial arrangements
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex bg-stone-100 rounded-xl p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${authMode === 'register' ? 'bg-amber-500 text-stone-950 shadow-sm font-black' : 'text-stone-500'}`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${authMode === 'login' ? 'bg-amber-500 text-stone-950 shadow-sm font-black' : 'text-stone-500'}`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleFamilyAuthSubmit} className="space-y-3">
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    required
                    placeholder="First Name *"
                    value={familyAuth.firstName}
                    onChange={e => setFamilyAuth({ ...familyAuth, firstName: e.target.value })}
                    className="text-xs p-3 border border-stone-200 rounded-xl bg-white text-stone-800 outline-none focus:border-amber-500"
                  />
                  <input
                    required
                    placeholder="Last Name *"
                    value={familyAuth.lastName}
                    onChange={e => setFamilyAuth({ ...familyAuth, lastName: e.target.value })}
                    className="text-xs p-3 border border-stone-200 rounded-xl bg-white text-stone-800 outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <input
                required
                type="email"
                placeholder="Email Address *"
                value={familyAuth.email}
                onChange={e => setFamilyAuth({ ...familyAuth, email: e.target.value })}
                className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-white text-stone-800 outline-none focus:border-amber-500"
              />
              <input
                required
                placeholder="M-Pesa Phone Number *"
                value={familyAuth.phone}
                onChange={e => setFamilyAuth({ ...familyAuth, phone: e.target.value })}
                className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-white text-stone-800 outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                disabled={loadingAction !== null}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                {loadingAction === 'form'
                  ? 'Processing...'
                  : authMode === 'register'
                    ? 'Create Family Account'
                    : 'Sign In to Portal'}
              </button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-stone-400">Or continue with demo</span></div>
            </div>

            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={loadingAction !== null}
              className="w-full flex items-center justify-center gap-3 border border-stone-300 hover:bg-stone-50 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
            >
              {loadingAction === 'Google' ? <div className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full" /> : <GoogleIcon />}
              Continue with Google (Demo)
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={loadingAction !== null}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
            >
              {loadingAction === 'Facebook' ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <FacebookIcon />}
              Continue with Facebook (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN DASHBOARD VIEW ---
  const activeClientName = activeProfile ? `${activeProfile.firstName} ${activeProfile.lastName}` : 'John Kamau';
  const activeClientPhone = activeProfile ? activeProfile.phone : '0722123456';

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-[#110905] text-stone-200' : 'bg-[#F9F7F3] text-stone-800'}`}>
      <EulogyGeneratorModal isOpen={isEulogyOpen} onClose={() => setIsEulogyOpen(false)} addToast={addToast} />
      {showTransportInvoice && savedTransport && (
        <TransportInvoiceModal 
          transport={savedTransport} 
          clientName={activeClientName} 
          bookingNumber="BK-24-9982" 
          onClose={() => setShowTransportInvoice(false)} 
        />
      )}

      <header className={`px-6 py-4 flex justify-between items-center border-b ${isDark ? 'bg-[#1C0F0A] border-amber-950/40 text-amber-100' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center gap-3">
          <TripleMLogo className="w-9 h-9" />
          <div>
            <h1 className="font-serif font-bold text-base">Triple M Family Console</h1>
            <p className="text-[9px] uppercase font-bold text-amber-500 flex items-center gap-1.5 mt-0.5">
              <UserCheck size={11} /> Billed To: {activeClientName} ({activeClientPhone})
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-extrabold text-stone-400 hover:text-rose-500 transition cursor-pointer"><LogOut size={15} /> Exit Portal</button>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        <div className="flex border-b border-stone-200/40 gap-6 overflow-x-auto">
          <button onClick={() => setPortalTab('overview')} className={`pb-3 text-xs font-black uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${portalTab === 'overview' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-stone-400 border-b-2 border-transparent'}`}>Overview & Tracker</button>
          <button onClick={() => setPortalTab('planner')} className={`pb-3 text-xs font-black uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${portalTab === 'planner' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-stone-400 border-b-2 border-transparent'}`}>Arrangement Planner</button>
          <button onClick={() => setPortalTab('payments')} className={`pb-3 text-xs font-black uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${portalTab === 'payments' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-stone-400 border-b-2 border-transparent'}`}>M-Pesa Receipts ({receipts.length})</button>
        </div>

        {portalTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Total Setup Quote</div>
                  <div className="text-xl font-black mt-1">KES {totalCost.toLocaleString()}</div>
                </div>
                <DollarSign className="text-amber-500/80" size={28} />
              </div>
              <div className={`p-6 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Total Validated Payments</div>
                  <div className="text-xl font-black mt-1 text-emerald-600">KES {verifiedPaid.toLocaleString()}</div>
                </div>
                <CheckCircle2 className="text-emerald-500/80" size={28} />
              </div>
              <div className={`p-6 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Pending Balance</div>
                  <div className="text-xl font-black text-rose-600 mt-1">KES {balanceDue.toLocaleString()}</div>
                </div>
                <AlertTriangle className="text-rose-500/80" size={28} />
              </div>
            </div>

            {/* TRANSPORT LOGISTICS PREVIEW CARD */}
            {savedTransport && (
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gradient-to-br from-[#2A1810] to-[#1C0F0A] border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-white border-amber-300 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-amber-500 text-white shadow-sm'}`}>
                      <Route size={22} className={isDark ? 'text-amber-400' : ''} />
                    </div>
                    <div>
                      <h3 className={`font-serif text-base font-bold ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>Transport Logistics Confirmed</h3>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-amber-400/70' : 'text-amber-700'}`}>Detailed loop structure saved.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowTransportInvoice(true)} className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 whitespace-nowrap self-start md:self-center cursor-pointer"><FileText size={14}/> Open Logistical Invoice</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-stone-900/60 border border-amber-950/40' : 'bg-white border border-amber-100 shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-[9px]">1</div>
                      <span className={`text-[9px] uppercase font-black tracking-wider ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>Morgue Base Point</span>
                    </div>
                    <p className={`text-xs font-bold ${isDark ? 'text-amber-100' : 'text-stone-800'}`}>{savedTransport.morgue.name}</p>
                    <p className="text-[10px] text-stone-400">{savedTransport.morgue.town} • {savedTransport.morgue.distanceKm} KM</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-stone-900/60 border border-amber-950/40' : 'bg-white border border-amber-100 shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-[9px]">2</div>
                      <span className={`text-[9px] uppercase font-black tracking-wider ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>Ceremony Point</span>
                    </div>
                    <p className={`text-xs font-bold ${isDark ? 'text-amber-100' : 'text-stone-800'}`}>{savedTransport.ceremony.name}</p>
                    <p className="text-[10px] text-stone-400">{savedTransport.ceremony.town} • {savedTransport.ceremony.distanceKm} KM</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-stone-900/60 border border-amber-950/40' : 'bg-white border border-amber-100 shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-[#1C0F0A] text-amber-300 flex items-center justify-center font-black text-[9px]">3</div>
                      <span className={`text-[9px] uppercase font-black tracking-wider ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>Resting Place</span>
                    </div>
                    <p className={`text-xs font-bold ${isDark ? 'text-amber-100' : 'text-stone-800'}`}>{savedTransport.restingPlace.name}</p>
                    <p className="text-[10px] text-stone-400">{savedTransport.restingPlace.town} • {savedTransport.restingPlace.distanceKm} KM</p>
                  </div>
                </div>

                <div className={`flex justify-between items-center p-3 rounded-xl ${isDark ? 'bg-stone-900/60' : 'bg-white/80'}`}>
                  <div className="flex items-center gap-2 text-xs">
                    <Navigation size={14} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
                    <span className={`font-bold ${isDark ? 'text-amber-100' : 'text-stone-700'}`}>Total Mileage Loop: {savedTransport.totalKm} KM</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] uppercase font-bold ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Transport Charge</p>
                    <p className={`font-black text-base ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>KES {savedTransport.totalTransportCost.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            <div className={`p-6 md:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold">Arrangement Milestone Progress</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Real-time status trackers as scheduled dates approach.</p>
                </div>
                <button onClick={() => setPortalTab('planner')} className="text-xs font-bold text-amber-500 flex items-center gap-1 border border-amber-500/30 px-3 py-1.5 rounded-lg hover:bg-amber-500/5 transition cursor-pointer">
                  Modify Selections
                </button>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { title: '1. Deposit Settle', desc: 'Secure base services contract.', complete: verifiedPaid > 0 },
                  { title: '2. Route Verified', desc: 'Specify Morgue, Ceremony & Resting Place.', complete: !!savedTransport },
                  { title: '3. Driver Dispatch', desc: 'Allocation and technical review of hearse.', complete: false },
                  { title: '4. Graveside Setup', desc: 'Lowering gear delivery and installation.', complete: false }
                ].map((st, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${st.complete ? (isDark ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-emerald-500/30 bg-emerald-50') : (isDark ? 'border-stone-800 bg-stone-900/30' : 'border-stone-200 bg-stone-50')}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400">Step {i+1}</span>
                      {st.complete ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Clock size={16} className="text-stone-400" />}
                    </div>
                    <h4 className="font-bold text-xs">{st.title}</h4>
                    <p className="text-[10px] text-stone-500 mt-1 leading-normal">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {portalTab === 'planner' && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6">
              {/* 1. Date */}
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200'}`}>
                <h3 className="font-serif text-base font-bold mb-3">1. Select Scheduled Date</h3>
                <input type="date" value={plannerForm.burialDate} onChange={e => setPlannerForm({...plannerForm, burialDate: e.target.value})} className={`w-full max-w-sm p-3 border border-stone-200 rounded-xl text-xs bg-white ${isDark ? 'text-stone-800' : ''}`} />
              </div>

              {/* 2. Transport Route planning */}
              <div className={`p-6 rounded-3xl border-2 ${isDark ? 'bg-gradient-to-br from-[#2A1810] to-[#1C0F0A] border-amber-500/40' : 'bg-gradient-to-br from-amber-50/80 to-white border-amber-300'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-amber-500 text-white shadow-sm'}`}>
                    <Route size={18} className={isDark ? 'text-amber-400' : ''} />
                  </div>
                  <div>
                    <h3 className={`font-serif text-base font-bold ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>2. Transport Route Planning</h3>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-amber-400/70' : 'text-amber-700'}`}>Input route milestones to compile custom hearse mileage metrics.</p>
                  </div>
                </div>

                {/* Morgue Input */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-[10px] shadow-sm">1</div>
                    <label className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>Deceased Collection Point (Morgue)</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input placeholder="Morgue Name *" value={plannerForm.morgueName} onChange={e => setPlannerForm({...plannerForm, morgueName: e.target.value})} className={`text-xs p-3 border rounded-xl ${isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-amber-200 text-stone-800'}`} />
                    <input placeholder="Town / Area" value={plannerForm.morgueTown} onChange={e => setPlannerForm({...plannerForm, morgueTown: e.target.value})} className={`text-xs p-3 border rounded-xl ${isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-amber-200 text-stone-800'}`} />
                    <input type="number" placeholder="Distance from Hub (KM)" value={plannerForm.morgueDistance || ''} onChange={e => setPlannerForm({...plannerForm, morgueDistance: Number(e.target.value)})} className={`text-xs p-3 border rounded-xl ${isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-amber-200 text-stone-800'}`} />
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase font-bold mb-1.5 mt-2 ${isDark ? 'text-amber-400/60' : 'text-amber-800'}`}>Regional Presets:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {REGIONAL_MORGUE_PRESETS.map((m, i) => (
                        <button type="button" key={i} onClick={() => applyLocationPreset('morgue', m)} className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${plannerForm.morgueName === m.name ? 'bg-amber-500 text-stone-950 shadow-sm font-black' : (isDark ? 'bg-stone-900 text-amber-300 border border-stone-700 hover:border-amber-500' : 'bg-white text-amber-800 border border-amber-200 hover:border-amber-500')}`}>{m.name} <span className="opacity-60">({m.distanceKm} KM)</span></button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ceremony Input */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-[10px] shadow-sm">2</div>
                    <label className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>Ceremony Service Venue</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input placeholder="Ceremony Venue Name *" value={plannerForm.ceremonyName} onChange={e => setPlannerForm({...plannerForm, ceremonyName: e.target.value})} className={`text-xs p-3 border rounded-xl ${isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-amber-200 text-stone-800'}`} />
                    <input placeholder="Town / Area" value={plannerForm.ceremonyTown} onChange={e => setPlannerForm({...plannerForm, ceremonyTown: e.target.value})} className={`text-xs p-3 border rounded-xl ${isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-amber-200 text-stone-800'}`} />
                    <input type="number" placeholder="Distance from Morgue (KM)" value={plannerForm.ceremonyDistance || ''} onChange={e => setPlannerForm({...plannerForm, ceremonyDistance: Number(e.target.value)})} className={`text-xs p-3 border rounded-xl ${isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-amber-200 text-stone-800'}`} />
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase font-bold mb-1.5 mt-2 ${isDark ? 'text-amber-400/60' : 'text-amber-800'}`}>Regional Presets:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {REGIONAL_CEREMONY_PRESETS.map((v, i) => (
                        <button type="button" key={i} onClick={() => applyLocationPreset('ceremony', v)} className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${plannerForm.ceremonyName === v.name ? 'bg-amber-500 text-stone-950 shadow-sm font-black' : (isDark ? 'bg-stone-900 text-amber-300 border border-stone-700 hover:border-amber-500' : 'bg-white text-amber-800 border border-amber-200 hover:border-amber-500')}`}>{v.name} <span className="opacity-60">({v.distanceKm} KM)</span></button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resting Place Input */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[#1C0F0A] text-amber-300 flex items-center justify-center font-black text-[10px] shadow-sm">3</div>
                    <label className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>Final Resting Place (Committal Site)</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input placeholder="Cemetery / Home Site Name *" value={plannerForm.restingName} onChange={e => setPlannerForm({...plannerForm, restingName: e.target.value})} className={`text-xs p-3 border rounded-xl ${isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-amber-200 text-stone-800'}`} />
                    <input placeholder="Town / Village" value={plannerForm.restingTown} onChange={e => setPlannerForm({...plannerForm, restingTown: e.target.value})} className={`text-xs p-3 border rounded-xl ${isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-amber-200 text-stone-800'}`} />
                    <input type="number" placeholder="Distance from Ceremony (KM)" value={plannerForm.restingDistance || ''} onChange={e => setPlannerForm({...plannerForm, restingDistance: Number(e.target.value)})} className={`text-xs p-3 border rounded-xl ${isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-amber-200 text-stone-800'}`} />
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase font-bold mb-1.5 mt-2 ${isDark ? 'text-amber-400/60' : 'text-amber-800'}`}>Regional Presets:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {REGIONAL_RESTING_PRESETS.map((bp, i) => (
                        <button type="button" key={i} onClick={() => applyLocationPreset('resting', bp)} className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${plannerForm.restingName === bp.name ? 'bg-amber-500 text-stone-950 shadow-sm font-black' : (isDark ? 'bg-stone-900 text-amber-300 border border-stone-700 hover:border-amber-500' : 'bg-white text-amber-800 border border-amber-200 hover:border-amber-500')}`}>{bp.name} <span className="opacity-60">({bp.distanceKm} KM)</span></button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live calculations */}
                {liveTransport && (
                  <div className={`p-4 rounded-2xl border mt-5 transition ${isDark ? 'bg-stone-950/50 border-amber-500/30' : 'bg-white border-amber-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calculator size={14} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
                        <span className={`text-[10px] uppercase font-black tracking-wider ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>Transport Cost Calculation</span>
                      </div>
                      <span className={`text-[10px] font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>● Real-time Settle Metrics</span>
                    </div>
                    <div className={`space-y-1.5 text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      <div className="flex justify-between"><span className="opacity-70">Estimated Route Distance (including hub return)</span><span className="font-bold">{liveTransport.totalKm} KM</span></div>
                      <div className="flex justify-between"><span className="opacity-70">Base Coach Mobilization Dispatch Fee</span><span className="font-bold">KES {liveTransport.baseDispatchFee.toLocaleString()}.00</span></div>
                      <div className="flex justify-between"><span className="opacity-70">Mileage Fee Surcharge (KES 120 / KM)</span><span className="font-bold">KES {liveTransport.distanceFee.toLocaleString()}.00</span></div>
                      <div className={`flex justify-between pt-2 border-t mt-2 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                        <span className="font-black uppercase text-xs">LOGISTICS SUB-TOTAL</span>
                        <span className={`font-black text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>KES {liveTransport.totalTransportCost.toLocaleString()}.00</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Choose Casket */}
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-serif text-base font-bold">3. Choose Casket Preference</h3>
                    <p className="text-xs text-stone-400">Directly bound to active workshop inventories.</p>
                  </div>
                  {selectedCasket && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full"><Check size={14}/> Assigned</span>}
                </div>
                <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-2">
                  {inventory.map(c => (
                    <div key={c.id} onClick={() => setPlannerForm({...plannerForm, casketId: c.id})} className={`p-3 rounded-2xl border cursor-pointer transition ${plannerForm.casketId === c.id ? 'border-amber-500 bg-amber-500/15' : 'border-stone-200 hover:bg-stone-50'}`}>
                      {c.imageUrl ? <img src={mediaSrc(c.imageUrl)} className="h-24 w-full object-cover rounded-xl mb-2" alt={c.name} /> : <div className="h-24 bg-amber-500/10 rounded-xl mb-2 flex justify-center items-center text-amber-500"><Package size={22}/></div>}
                      <h4 className="font-bold text-xs">{c.name}</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">{c.material.replace('_', ' ')} • {c.size}</p>
                      <p className="text-xs font-black text-amber-600 mt-1.5">KES {Number(c.retailPrice).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Hearse transport coach */}
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-serif text-base font-bold">4. Select Hearse Carriage</h3>
                    <p className="text-xs text-stone-400">Showing vehicles currently free for dispatch.</p>
                  </div>
                  {selectedHearse && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full"><Check size={14}/> Assigned</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {availableHearses.map(h => (
                    <div key={h.id} onClick={() => setPlannerForm({...plannerForm, hearseId: h.id})} className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${plannerForm.hearseId === h.id ? 'border-amber-500 bg-amber-500/15' : 'border-stone-200 hover:bg-stone-50'}`}>
                      {h.imageUrl ? <img src={mediaSrc(h.imageUrl)} className="h-14 w-14 object-cover rounded-xl shrink-0" alt="" /> : <div className="h-14 w-14 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0"><Car size={16}/></div>}
                      <div>
                        <h4 className="font-bold text-xs leading-tight">{h.vehicleName}</h4>
                        <p className="text-[10px] text-stone-400 font-mono mt-1">{h.licensePlate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Lowering Gear */}
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
                <h3 className="font-serif text-base font-bold mb-3">5. Lowering Gear Selection</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'none', label: 'Manual Lowering', desc: 'Direct webbing handles run by family/friends.', price: 'Free' },
                    { id: 'standard', label: 'Standard Mechanical', desc: 'Secure geared mechanical platform.', price: 'KES 10,000' },
                    { id: 'premium', label: 'Chrome Auto-Lowering', desc: 'Premium auto mechanical chrome frame.', price: 'KES 25,000' }
                  ].map(p => (
                    <div key={p.id} onClick={() => setPlannerForm({...plannerForm, loweringGearPreset: p.id})} className={`p-3 border rounded-2xl cursor-pointer transition flex flex-col justify-between ${plannerForm.loweringGearPreset === p.id ? 'border-amber-500 bg-amber-500/15' : 'border-stone-200 hover:bg-stone-50'}`}>
                      <div>
                        <h4 className="font-bold text-xs">{p.label}</h4>
                        <p className="text-[9px] text-stone-400 mt-1 leading-normal mb-2">{p.desc}</p>
                      </div>
                      <span className="text-xs font-black text-amber-600 block">{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Floral package selection */}
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
                <h3 className="font-serif text-base font-bold mb-3">6. Select Floral Preset</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'none', label: 'No Floral Plan', desc: 'Family handles arrangements separately.', price: 'Free' },
                    { id: 'simple', label: 'Simple Wreath', desc: 'Casket top fresh wreath layout.', price: 'KES 5,000' },
                    { id: 'majestic', label: 'Majestic blanket', desc: 'Premium fresh blanket cover & 4 podium sprays.', price: 'KES 15,000' }
                  ].map(f => (
                    <div key={f.id} onClick={() => setPlannerForm({...plannerForm, floralPreset: f.id})} className={`p-3 border rounded-2xl cursor-pointer transition flex flex-col justify-between ${plannerForm.floralPreset === f.id ? 'border-amber-500 bg-amber-500/15' : 'border-stone-200 hover:bg-stone-50'}`}>
                      <div>
                        <h4 className="font-bold text-xs">{f.label}</h4>
                        <p className="text-[9px] text-stone-400 mt-1 leading-normal mb-2">{f.desc}</p>
                      </div>
                      <span className="text-xs font-black text-amber-600 block">{f.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Pallbearers */}
              <div className={`p-6 rounded-3xl border flex items-center justify-between ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
                <div>
                  <h3 className="font-serif text-base font-bold">7. Uniformed Pallbearer Squad</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Six professionally trained pallbearers in uniform.</p>
                </div>
                <input type="checkbox" checked={plannerForm.hasPallbearers} onChange={e => setPlannerForm({...plannerForm, hasPallbearers: e.target.checked})} className="h-5 w-5 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer" />
              </div>
            </div>

            {/* LIVE QUOTE SUMMARY PANEL */}
            <div className={`w-full lg:w-80 shrink-0 sticky top-24 rounded-3xl border p-6 shadow-xl ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200'}`}>
              <h3 className="font-serif text-base font-bold mb-4 border-b border-stone-200/20 pb-2">Arrangement Cost Summary</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <span className="text-stone-400 font-bold w-28">Director Fees</span>
                  <div className="text-right">
                    <div className="font-bold text-stone-600">Base Services</div>
                    <div className="font-bold text-stone-500 mt-0.5">KES {baseCost.toLocaleString()}.00</div>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-stone-400 font-bold w-28">Selected Casket</span>
                  <div className="text-right">
                    <div className="font-bold text-stone-600">{selectedCasket ? selectedCasket.name : 'Unassigned'}</div>
                    <div className="font-bold text-stone-500 mt-0.5">KES {liveCasketPrice.toLocaleString()}.00</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-stone-400 font-bold w-28">Hearse Logistics</span>
                  <div className="text-right">
                    <div className="font-bold text-stone-600">{liveTransport ? `${liveTransport.totalKm} KM Total Route` : 'Awaiting Locations'}</div>
                    <div className="font-bold text-amber-600 mt-0.5">KES {liveTransportCost.toLocaleString()}.00</div>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-stone-400 font-bold w-28">Lowering Set</span>
                  <div className="text-right">
                    <div className="font-bold text-stone-600 uppercase text-[10px]">{plannerForm.loweringGearPreset}</div>
                    <div className="font-bold text-stone-500 mt-0.5">KES {liveGearPrice.toLocaleString()}.00</div>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-stone-400 font-bold w-28">Floral Display</span>
                  <div className="text-right">
                    <div className="font-bold text-stone-600 uppercase text-[10px]">{plannerForm.floralPreset}</div>
                    <div className="font-bold text-stone-500 mt-0.5">KES {liveFloralPrice.toLocaleString()}.00</div>
                  </div>
                </div>

                {plannerForm.hasPallbearers && (
                  <div className="flex justify-between items-start">
                    <span className="text-stone-400 font-bold w-28">Pallbearers Squad</span>
                    <div className="text-right">
                      <div className="font-bold text-stone-500">KES {livePallbearerPrice.toLocaleString()}.00</div>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-stone-200/20 flex justify-between items-center text-sm font-bold">
                  <span>Arranged Total</span>
                  <span className="text-base text-amber-600">KES {liveTotal.toLocaleString()}.00</span>
                </div>
              </div>

              <button 
                onClick={saveArrangementPlan}
                disabled={!hasTransportLocations}
                className="w-full mt-6 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-300 disabled:cursor-not-allowed text-stone-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
              >
                {hasTransportLocations ? 'Confirm Service Selections' : 'Complete Route Mapping First'}
              </button>
              {!hasTransportLocations && (
                <p className="text-[10px] text-rose-500 text-center mt-2.5 font-bold">Please specify your Morgue, Ceremony, and Resting Place locations to activate transport pricing.</p>
              )}
            </div>
          </div>
        )}

        {portalTab === 'payments' && (
          <div className="grid md:grid-cols-2 gap-8 text-slate-800">
            <div className={`rounded-3xl border p-6 md:p-8 space-y-6 ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
              <div>
                <h3 className="font-serif text-base font-bold text-stone-800">Submit M-Pesa Code</h3>
                <p className="text-xs text-stone-400">Validate transaction with reference codes.</p>
              </div>
              <form onSubmit={handleReceiptSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Amount Paid (KES) *</label>
                  <input required type="number" value={newReceipt.amt} onChange={e => setNewReceipt({...newReceipt, amt: e.target.value})} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">M-Pesa Reference Code *</label>
                  <input required type="text" placeholder="E.g., SDR97G8H2K" value={newReceipt.ref} onChange={e => setNewReceipt({...newReceipt, ref: e.target.value})} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl uppercase font-mono focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">Payment Note</label>
                  <input type="text" placeholder="E.g., Commitment Deposit Part Payment" value={newReceipt.note} onChange={e => setNewReceipt({...newReceipt, note: e.target.value})} className="w-full text-xs p-3 border border-stone-200 bg-stone-50 rounded-xl focus:bg-white transition" />
                </div>
                <button type="submit" className="w-full bg-[#1C0F0A] hover:bg-[#2A1810] text-amber-200 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm cursor-pointer">Submit Receipt</button>
              </form>
            </div>
            
            <div className={`rounded-3xl border p-6 md:p-8 space-y-6 ${isDark ? 'bg-[#1C0F0A] border-amber-950/40' : 'bg-white border-stone-200 shadow-sm'}`}>
              <h3 className="font-serif text-base font-bold text-stone-800">Payment Registry Logs</h3>
              <div className="space-y-3">
                {receipts.length === 0 && <p className="text-xs text-stone-400 py-6 text-center italic">No transaction tickets filed.</p>}
                {receipts.map(rec => (
                  <div key={rec.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex justify-between items-center text-xs shadow-inner">
                    <div>
                      <div className="font-mono font-black text-amber-700">{rec.referenceNumber}</div>
                      <p className="text-[10px] text-stone-400 mt-1">{rec.date} • {rec.note || 'No description note attached'}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black block text-stone-700">KES {rec.amount.toLocaleString()}</span>
                      <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-1.5 ${rec.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : rec.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{rec.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ============================================================================
// STAFF PORTAL VIEW
// ============================================================================
const StaffPortal = ({ onBack, theme, addToast }: any) => {
  const isDark = theme === 'dark';
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try { const s = localStorage.getItem('triplem_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  
  const [loginEmail, setLoginEmail] = useState('director@triplem.com');
  const [loginPassword, setLoginPassword] = useState('DirectorSubukia2024');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<'dashboard' | 'inventory' | 'hearses' | 'bookings' | 'memorials' | 'receipts'>('dashboard');

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [hearses, setHearses] = useState<Hearse[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  
  const [activeMedia, setActiveMedia] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const [viewingMemorial, setViewingMemorial] = useState<Memorial | null>(null);
  const [viewingTransportInvoice, setViewingTransportInvoice] = useState<Booking | null>(null);

  const [isAddCatalogOpen, setIsAddCatalogOpen] = useState(false);
  const [catalogForm, setCatalogForm] = useState({ sku: 'CK-NEW-001', name: '', material: 'SOLID_WOOD', retailPrice: '85000', currentStock: 3 });
  const [catalogImageFile, setCatalogImageFile] = useState<File | null>(null);

  const [isAddHearseOpen, setIsAddHearseOpen] = useState(false);
  const [hearseForm, setHearseForm] = useState({ vehicleName: '', make: '', model: '', year: 2021, licensePlate: '', status: 'AVAILABLE' as const, currentMileage: 10000 });
  const [hearseImageFile, setHearseImageFile] = useState<File | null>(null);

  const [casketSearch, setCasketSearch] = useState('');
  const [hearseFilter, setHearseFilter] = useState<'ALL' | 'AVAILABLE' | 'DISPATCHED' | 'MAINTENANCE'>('ALL');

  const syncAllDatabaseData = () => {
    setInventory(getLocalData('coffins', INITIAL_COFFINS));
    setHearses(getLocalData('hearses', INITIAL_HEARSES));
    setBookings(getLocalData('bookings', INITIAL_BOOKINGS));
    setMemorials(getLocalData('memorials', []));
    setReceipts(getLocalData('receipts', INITIAL_RECEIPTS));
  };

  useEffect(() => { if (currentUser) syncAllDatabaseData(); }, [currentUser]);

  useEffect(() => {
    const handleStorageChange = () => { if (currentUser) syncAllDatabaseData(); };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'director@triplem.com' && loginPassword === 'DirectorSubukia2024') {
      const u = { id: 'u1', email: loginEmail, firstName: 'Mzee', lastName: 'Director', role: 'ADMIN' };
      setCurrentUser(u);
      localStorage.setItem('triplem_user', JSON.stringify(u));
      addToast('Authenticated into operational admin console', 'success');
    } else {
      setLoginError('Invalid directorship administrative credentials');
      addToast('Verification failed', 'error');
    }
  };

  const handleCasketPhotoUpload = async (id: string, file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const updated = inventory.map(c => c.id === id ? { ...c, imageUrl: base64 } : c);
      setInventory(updated); setLocalData('coffins', updated); window.dispatchEvent(new Event('storage'));
      addToast('Casket custom snapshot updated', 'success');
    } catch { addToast('Error processing picture file', 'error'); }
  };

  const handleAddCasket = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl: string | null = null;
    if (catalogImageFile) imageUrl = await fileToBase64(catalogImageFile);
    const item: InventoryItem = { id: generateId('CSK'), sku: catalogForm.sku, name: catalogForm.name, material: catalogForm.material, size: 'STANDARD', retailPrice: catalogForm.retailPrice, currentStock: Number(catalogForm.currentStock), isLowStock: Number(catalogForm.currentStock) <= 2, imageUrl };
    const updated = [item, ...inventory];
    setInventory(updated); setLocalData('coffins', updated); window.dispatchEvent(new Event('storage'));
    
    setIsAddCatalogOpen(false); setCatalogImageFile(null);
    setCatalogForm({ sku: 'CSK-' + Math.floor(100 + Math.random() * 900), name: '', material: 'SOLID_WOOD', retailPrice: '85000', currentStock: 3 });
    addToast('New casket design added to catalog', 'success');
  };

  const handleDeleteCasket = (id: string) => {
    if (!confirm('Permanently remove this casket model from catalogs?')) return;
    const updated = inventory.filter(c => c.id !== id);
    setInventory(updated); setLocalData('coffins', updated); window.dispatchEvent(new Event('storage'));
    addToast('Model removed', 'info');
  };

  const handleStockLevelAdjustment = (id: string, delta: number) => {
    const updated = inventory.map(c => {
      if (c.id !== id) return c;
      const stock = Math.max(0, c.currentStock + delta);
      return { ...c, currentStock: stock, isLowStock: stock <= 2 };
    });
    setInventory(updated); setLocalData('coffins', updated); window.dispatchEvent(new Event('storage'));
  };

  const handleHearsePhotoUpload = async (id: string, file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const updated = hearses.map(h => h.id === id ? { ...h, imageUrl: base64 } : h);
      setHearses(updated); setLocalData('hearses', updated); window.dispatchEvent(new Event('storage'));
      addToast('Vehicle photo uploaded to fleet logs', 'success');
    } catch { addToast('Error converting image', 'error'); }
  };

  const handleAddHearse = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl: string | null = null;
    if (hearseImageFile) imageUrl = await fileToBase64(hearseImageFile);
    const item: Hearse = { id: generateId('HRS'), ...hearseForm, year: Number(hearseForm.year), currentMileage: Number(hearseForm.currentMileage), imageUrl };
    const updated = [item, ...hearses];
    setHearses(updated); setLocalData('hearses', updated); window.dispatchEvent(new Event('storage'));
    
    setIsAddHearseOpen(false); setHearseImageFile(null);
    setHearseForm({ vehicleName: '', make: '', model: '', year: 2021, licensePlate: '', status: 'AVAILABLE', currentMileage: 10000 });
    addToast('Hearse registered in operations database', 'success');
  };

  const handleDeleteHearse = (id: string) => {
    if (!confirm('Retire this hearse from operational fleet records?')) return;
    const updated = hearses.filter(h => h.id !== id);
    setHearses(updated); setLocalData('hearses', updated); window.dispatchEvent(new Event('storage'));
    addToast('Vehicle removed from registry', 'info');
  };

  const handleHearseStatusUpdate = (id: string, status: 'AVAILABLE' | 'DISPATCHED' | 'MAINTENANCE') => {
    const updated = hearses.map(h => h.id === id ? { ...h, status } : h);
    setHearses(updated); setLocalData('hearses', updated); window.dispatchEvent(new Event('storage'));
    addToast(`Status set to ${status}`, 'info');
  };

  const handleVerifyReceipt = (id: string, approve: boolean) => {
    const updatedReceipts = receipts.map(r => r.id !== id ? r : { ...r, status: approve ? ('VERIFIED' as const) : ('REJECTED' as const) });
    setReceipts(updatedReceipts);
    setLocalData('receipts', updatedReceipts);
    
    const verifiedTotal = updatedReceipts.filter(r => r.status === 'VERIFIED').reduce((sum, r) => sum + r.amount, 0);
    const activeBookings = getLocalData<Booking[]>('bookings', INITIAL_BOOKINGS);
    const familyBooking = activeBookings.find(b => b.bookingNumber === 'BK-24-9982');
    if (familyBooking) {
      familyBooking.amountPaid = verifiedTotal;
      familyBooking.status = verifiedTotal >= familyBooking.totalQuote ? 'COMPLETED' : 'CONFIRMED';
      setLocalData('bookings', activeBookings);
    }
    
    window.dispatchEvent(new Event('storage'));
    addToast(approve ? 'M-Pesa transaction validated and posted!' : 'Receipt transaction rejected', approve ? 'success' : 'error');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#150B07]">
        <button onClick={onBack} className="absolute top-8 left-8 text-amber-500 hover:text-amber-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition"><ChevronLeft size={16} /> Home</button>
        <form onSubmit={handleLogin} className="bg-[#1C0F0A] border border-amber-950/40 rounded-3xl p-8 w-full max-w-sm text-stone-200 space-y-5 shadow-2xl">
          <TripleMLogo className="w-16 h-16 mx-auto" />
          <h2 className="text-center font-serif text-lg text-amber-100 font-bold">Admin Access</h2>
          {loginError && <div className="text-xs text-rose-300 bg-rose-900/30 p-3 rounded-xl">{loginError}</div>}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Admin ID</label>
            <input className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Password</label>
            <input type="password" className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
          </div>
          <button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition">Unlock</button>
        </form>
      </div>
    );
  }

  const dispatchFleetRate = hearses.length ? Math.round((hearses.filter(h => h.status === 'DISPATCHED').length / hearses.length) * 100) : 0;
  const lowStockAlerts = inventory.filter(c => c.currentStock <= 2).length;
  const pendingValidationDeposits = receipts.filter(r => r.status === 'PENDING_APPROVAL').length;

  const filteredCaskets = inventory.filter(c => c.name.toLowerCase().includes(casketSearch.toLowerCase()) || c.sku.toLowerCase().includes(casketSearch.toLowerCase()));
  const filteredHearses = hearses.filter(h => hearseFilter === 'ALL' || h.status === hearseFilter);

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${isDark ? 'bg-[#110905] text-stone-200' : 'bg-[#F9F7F3] text-stone-800'}`}>
      <ImageLightbox media={activeMedia} onClose={() => setActiveMedia(null)} />
      {viewingMemorial && <MemorialPageViewer memorial={viewingMemorial} onClose={() => setViewingMemorial(null)} />}
      {viewingTransportInvoice && viewingTransportInvoice.transport && (
        <TransportInvoiceModal 
          transport={viewingTransportInvoice.transport} 
          clientName={viewingTransportInvoice.clientName} 
          bookingNumber={viewingTransportInvoice.bookingNumber} 
          onClose={() => setViewingTransportInvoice(null)} 
        />
      )}

      <aside className="w-72 bg-[#1C0F0A] text-stone-100 flex flex-col justify-between border-r border-amber-950/40">
        <div>
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <TripleMLogo className="w-10 h-10" />
            <div>
              <h1 className="font-serif font-bold text-amber-100 text-sm">Triple M Operations</h1>
              <p className="text-[9px] text-amber-500 cursor-pointer font-bold uppercase tracking-wider" onClick={onBack}>← Back to Web</p>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {nav.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition ${tab === n.id ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-300 hover:bg-white/5'}`}>
                <div className="flex items-center gap-3"><n.icon size={16} /> {n.label}</div>
                {n.id === 'receipts' && pendingValidationDeposits > 0 && <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingValidationDeposits}</span>}
                {n.id === 'inventory' && lowStockAlerts > 0 && <span className="bg-amber-500 text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded-full">{lowStockAlerts}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs bg-stone-950/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-stone-400">{currentUser.firstName} {currentUser.lastName}</span>
          </div>
          <button onClick={() => { setCurrentUser(null); localStorage.removeItem('triplem_user'); addToast('Safe logout executed', 'info'); }} className="text-stone-400 hover:text-rose-400 cursor-pointer transition"><LogOut size={16} /></button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto text-slate-800">
        {tab === 'dashboard' && (
          <div className="space-y-6 text-stone-850">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-amber-500 text-[10px] uppercase tracking-wider font-extrabold">Operations Hub</span>
                <h2 className="text-2xl font-serif font-bold text-stone-900">Executive Board</h2>
              </div>
              <button onClick={syncAllDatabaseData} className="p-2 border rounded-xl hover:bg-stone-50 text-stone-500 transition cursor-pointer"><RefreshCw size={14} /></button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border text-slate-800 shadow-sm"><p className="text-[9px] uppercase text-stone-400 font-bold tracking-wider">Casket Blueprints</p><p className="text-2xl font-black mt-1">{inventory.length}</p></div>
              <div className="bg-white p-5 rounded-2xl border text-slate-800 shadow-sm"><p className="text-[9px] uppercase text-stone-400 font-bold tracking-wider">Fleet Registry</p><p className="text-2xl font-black mt-1">{hearses.length}</p></div>
              <div className="bg-white p-5 rounded-2xl border text-slate-800 shadow-sm"><p className="text-[9px] uppercase text-stone-400 font-bold tracking-wider">Digital Memorials</p><p className="text-2xl font-black mt-1 text-amber-600">{memorials.length}</p></div>
              <div className="bg-white p-5 rounded-2xl border text-slate-800 shadow-sm"><p className="text-[9px] uppercase text-stone-400 font-bold tracking-wider">Pending M-Pesa</p><p className="text-2xl font-black mt-1 text-rose-600">{pendingValidationDeposits}</p></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white p-6 rounded-3xl border text-slate-800 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-sm">Alerts & Actions</h3>
                <div className="space-y-3 text-xs">
                  {lowStockAlerts > 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-600" /><span><strong className="text-amber-800">{lowStockAlerts} casket models</strong> low on stock.</span></div>
                      <button onClick={() => setTab('inventory')} className="text-amber-700 font-bold underline cursor-pointer">Restock</button>
                    </div>
                  ) : <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2"><CheckCircle2 size={16} /><span>Casket stock levels healthy.</span></div>}

                  {pendingValidationDeposits > 0 ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2"><DollarSign size={16} className="text-rose-600" /><span><strong className="text-rose-800">{pendingValidationDeposits} pending M-Pesa</strong> validations.</span></div>
                      <button onClick={() => setTab('receipts')} className="text-rose-700 font-bold underline cursor-pointer">Review Queue</button>
                    </div>
                  ) : <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2"><CheckCircle2 size={16} /><span>All submitted transactions validated.</span></div>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border text-slate-800 shadow-sm flex flex-col justify-between">
                <h3 className="font-serif font-bold text-sm mb-4">Active Fleet Dispatch</h3>
                <div className="text-center space-y-2 py-4">
                  <div className="inline-block relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                      <circle cx="48" cy="48" r="40" stroke="#f59e0b" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - dispatchFleetRate/100)}`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-black text-lg">{dispatchFleetRate}%</span>
                  </div>
                  <p className="text-xs font-bold text-stone-600 mt-2">Fleet Operational Activity</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'inventory' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#2A1810] to-[#1C0F0A] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-amber-500/20">
              <div>
                <p className="text-[10px] uppercase text-amber-400 font-bold tracking-widest">Stock Control Panel</p>
                <h2 className="text-2xl font-serif font-bold text-amber-100">Workshop Caskets Inventory</h2>
              </div>
              <button onClick={() => setIsAddCatalogOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold px-5 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-md"><Plus size={16} /> Register Casket Model</button>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border shadow-sm text-slate-800">
              <Search size={16} className="text-stone-400" />
              <input placeholder="Search models by name or SKU..." value={casketSearch} onChange={e => setCasketSearch(e.target.value)} className="w-full text-xs bg-transparent border-none outline-none focus:ring-0" />
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {filteredCaskets.map(c => (
                <div key={c.id} className="bg-white rounded-3xl border border-stone-200/80 p-5 text-slate-800 relative shadow-sm hover:shadow-md transition">
                  <button onClick={() => handleDeleteCasket(c.id)} className="absolute top-4 right-4 p-2 rounded-full border bg-white/90 text-stone-400 hover:text-rose-600 cursor-pointer z-10 transition"><Trash2 size={14} /></button>
                  {c.imageUrl ? (
                    <div className="relative group h-44 rounded-2xl overflow-hidden mb-3 cursor-pointer" onClick={() => setActiveMedia({ url: mediaSrc(c.imageUrl), title: c.name })}>
                      <img src={mediaSrc(c.imageUrl)} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <label className="h-44 border-2 border-dashed border-amber-500/20 bg-amber-500/5 rounded-2xl flex flex-col items-center justify-center mb-3 text-amber-800 cursor-pointer hover:bg-amber-500/10 transition">
                      <Camera size={26} className="text-amber-600 mb-1" />
                      <span className="text-xs font-extrabold">Upload Portrait Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleCasketPhotoUpload(c.id, e.target.files[0])} />
                    </label>
                  )}
                  <h4 className="font-bold text-sm leading-tight pr-8">{c.name}</h4>
                  <p className="text-[10px] text-stone-400 uppercase mt-1 font-extrabold">{c.material.replace('_', ' ')} • SKU: {c.sku}</p>
                  
                  <div className="mt-3 p-3 bg-stone-50 rounded-xl border flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[9px] uppercase text-stone-400 font-bold">Qty Available</p>
                      <p className={`font-black mt-0.5 ${c.isLowStock ? 'text-rose-600' : 'text-stone-800'}`}>{c.currentStock} units</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleStockLevelAdjustment(c.id, -1)} className="w-8 h-8 border bg-white rounded-lg font-bold text-stone-600 hover:bg-stone-50 transition cursor-pointer">-</button>
                      <button onClick={() => handleStockLevelAdjustment(c.id, 1)} className="w-8 h-8 border bg-white rounded-lg font-bold text-stone-600 hover:bg-stone-50 transition cursor-pointer">+</button>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[10px] uppercase text-stone-400 font-bold">Base Retail Price</span>
                    <span className="font-extrabold text-amber-600">KES {Number(c.retailPrice).toLocaleString()}</span>
                  </div>
                  
                  <label className="mt-3 w-full flex items-center justify-center gap-2 bg-[#1C0F0A] hover:bg-stone-900 text-amber-100 text-xs font-bold py-2.5 rounded-xl cursor-pointer transition shadow-sm">
                    <Camera size={14} /> Upload Custom Snapshot
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleCasketPhotoUpload(c.id, e.target.files[0])} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'hearses' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#2A1810] to-[#1C0F0A] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-amber-500/20">
              <div>
                <p className="text-[10px] uppercase text-amber-400 font-bold tracking-widest">Dispatch Control Hub</p>
                <h2 className="text-2xl font-serif font-bold text-amber-100">Fleet Operations Registry</h2>
              </div>
              <button onClick={() => setIsAddHearseOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold px-5 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-md"><Plus size={16} /> Register Fleet Coach</button>
            </div>

            <div className="flex gap-2 bg-white p-1 rounded-xl border max-w-md shadow-sm text-slate-800">
              {(['ALL', 'AVAILABLE', 'DISPATCHED', 'MAINTENANCE'] as const).map(f => (
                <button key={f} onClick={() => setHearseFilter(f)} className={`flex-1 py-1.5 px-3 text-[10px] font-black uppercase rounded-lg transition cursor-pointer ${hearseFilter === f ? 'bg-[#1C0F0A] text-amber-300' : 'text-stone-500 hover:bg-stone-50'}`}>{f}</button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredHearses.map(h => (
                <div key={h.id} className="bg-white rounded-3xl border p-5 text-slate-800 relative shadow-sm hover:shadow-md transition">
                  <button onClick={() => handleDeleteHearse(h.id)} className="absolute top-4 right-4 p-2 rounded-full border bg-white/90 text-stone-400 hover:text-rose-600 cursor-pointer z-10 transition"><Trash2 size={14} /></button>
                  {h.imageUrl ? (
                    <div className="relative group h-52 rounded-2xl overflow-hidden mb-4 cursor-pointer" onClick={() => setActiveMedia({ url: mediaSrc(h.imageUrl), title: h.vehicleName, subtitle: h.licensePlate })}>
                      <img src={mediaSrc(h.imageUrl)} alt={h.vehicleName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <label className="h-52 border-2 border-dashed border-amber-500/20 bg-amber-500/5 rounded-2xl flex flex-col items-center justify-center mb-4 text-amber-800 cursor-pointer hover:bg-amber-500/10 transition">
                      <Camera size={32} className="text-amber-600 mb-1" />
                      <span className="text-xs font-extrabold">Upload Fleet Portrait</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleHearsePhotoUpload(h.id, e.target.files[0])} />
                    </label>
                  )}
                  <h4 className="font-bold text-lg leading-tight pr-10">{h.vehicleName}</h4>
                  <p className="text-xs text-stone-400 mt-1">{h.make} {h.model} ({h.year})</p>
                  <p className="text-[11px] font-mono font-bold bg-stone-100 inline-block px-2 py-0.5 rounded mt-2 text-stone-600">Plate: {h.licensePlate}</p>
                  
                  <div className="mt-4 flex gap-2">
                    {(['AVAILABLE', 'DISPATCHED', 'MAINTENANCE'] as const).map(st => (
                      <button key={st} onClick={() => handleHearseStatusUpdate(h.id, st)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase border transition cursor-pointer ${h.status === st ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-sm' : 'bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100'}`}>{st.toLowerCase()}</button>
                    ))}
                  </div>
                  
                  <label className="mt-4 w-full flex items-center justify-center gap-2 bg-[#1C0F0A] hover:bg-stone-900 text-amber-100 text-xs font-bold py-3 rounded-xl cursor-pointer transition shadow-sm">
                    <Camera size={16} /> Change Vehicle Portrait
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleHearsePhotoUpload(h.id, e.target.files[0])} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div className="space-y-6 text-slate-800">
            <h3 className="font-serif text-xl font-bold">Active Service Arrangements</h3>
            
            <div className="grid md:grid-cols-2 gap-5">
              {bookings.map(b => (
                <div key={b.id} className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="bg-gradient-to-r from-[#1C0F0A] to-[#2A1810] text-amber-100 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase font-black text-amber-400 tracking-widest">Active Account</p>
                          <h4 className="font-mono font-black text-base mt-1">{b.bookingNumber}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase ${b.status === 'COMPLETED' ? 'bg-emerald-500 text-stone-950' : 'bg-amber-500 text-stone-950'}`}>{b.status}</span>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3 border-b border-stone-100 pb-3">
                        <div>
                          <p className="text-[10px] uppercase font-black text-stone-400 tracking-wider">Client Representative</p>
                          <p className="font-bold mt-1 text-stone-800">{b.clientName}</p>
                          <p className="text-stone-500 text-[11px] font-mono mt-0.5">{b.contactPhone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-stone-400 tracking-wider">Burial Date</p>
                          <p className="font-bold mt-1 text-stone-800">{b.burialDate || 'TBD'}</p>
                        </div>
                      </div>

                      {b.transport ? (
                        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-3.5 space-y-3">
                          <div className="flex justify-between items-center border-b border-amber-200/50 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <Route size={12} className="text-amber-700" />
                              <p className="text-[10px] uppercase font-black text-amber-800 tracking-wider">Logistical Routing</p>
                            </div>
                            <button onClick={() => setViewingTransportInvoice(b)} className="text-[10px] font-black text-amber-700 hover:text-amber-950 flex items-center gap-1 transition cursor-pointer">Open Invoice <RightArrow size={10} /></button>
                          </div>
                          <div className="space-y-1.5 text-[11px] text-stone-700">
                            <div className="flex items-center gap-2"><MapPin size={11} className="text-amber-600 shrink-0" /><span><strong>Morgue Point:</strong> {b.transport.morgue.name} ({b.transport.morgue.town})</span></div>
                            <div className="flex items-center gap-2"><MapPin size={11} className="text-amber-600 shrink-0" /><span><strong>Ceremony:</strong> {b.transport.ceremony.name}</span></div>
                            <div className="flex items-center gap-2"><MapPin size={11} className="text-amber-600 shrink-0" /><span><strong>Burial Ground:</strong> {b.transport.restingPlace.name}</span></div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-amber-200 flex justify-between text-[11px]">
                            <span className="font-extrabold text-stone-600">Calculated Loop: {b.transport.totalKm} KM</span>
                            <span className="font-black text-amber-700">KES {b.transport.totalTransportCost.toLocaleString()}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-stone-50 border p-3 rounded-xl text-[10px] text-stone-400 italic text-center">No transport routing specified by family.</div>
                      )}

                      <div className="space-y-1 text-stone-600">
                        <p><strong className="text-stone-700">Assigned Casket:</strong> {b.casketName}</p>
                        <p><strong className="text-stone-700">Allocated Carriage:</strong> {b.hearseName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-stone-50 border-t border-stone-200/50 flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[9px] uppercase font-black text-stone-400 tracking-wider">Consolidated Quote</p>
                      <p className="font-black text-stone-800 mt-0.5">KES {b.totalQuote.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-black text-stone-400 tracking-wider">Payments Received</p>
                      <p className="font-black text-emerald-600 mt-0.5">KES {b.amountPaid.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'receipts' && (
          <div className="space-y-6 text-slate-800">
            <div>
              <span className="text-amber-500 text-[10px] uppercase tracking-wider font-extrabold">Finance Desk</span>
              <h3 className="font-serif text-xl font-bold">M-Pesa Verification Queue</h3>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-400 uppercase text-[9px] font-black border-b border-stone-100">
                  <tr>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">Reference Code</th>
                    <th className="p-4">Note description</th>
                    <th className="p-4">Allocated Amount</th>
                    <th className="p-4">Validation Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {receipts.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-stone-400 italic">No registered transactions inside queue logs.</td></tr>}
                  {receipts.map(r => (
                    <tr key={r.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4 text-stone-400">{r.date}</td>
                      <td className="p-4 font-mono font-black text-amber-700">{r.referenceNumber}</td>
                      <td className="p-4 text-stone-500 font-bold">{r.note || 'None'}</td>
                      <td className="p-4 font-black text-stone-800">KES {r.amount.toLocaleString()}</td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase ${r.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : r.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{r.status.replace('_', ' ')}</span></td>
                      <td className="p-4 text-right">
                        {r.status === 'PENDING_APPROVAL' && (
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => handleVerifyReceipt(r.id, false)} className="p-1 px-2 border rounded-lg hover:bg-rose-50 text-rose-600 transition font-bold text-[10px] cursor-pointer">Reject</button>
                            <button onClick={() => handleVerifyReceipt(r.id, true)} className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition font-bold text-[10px] flex items-center gap-1 cursor-pointer"><Check size={10}/> Validate</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'memorials' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">Published Remembrances Archive</h2>
            {memorials.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center text-slate-400 text-xs">No guest remembrance pages built yet.</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {memorials.map(m => (
                  <div key={m.id} className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-sm text-slate-800">
                    {m.photos[0] ? <img src={m.photos[0]} className="h-40 w-full object-cover" alt="" /> : <div className="h-40 bg-amber-500/5 border-b flex items-center justify-center text-amber-500/80"><Feather size={28} /></div>}
                    <div className="p-4">
                      <h4 className="font-serif font-bold text-sm text-stone-850">{m.fullName}</h4>
                      <p className="text-xs text-stone-400 italic mt-0.5">{m.dates}</p>
                      <button onClick={() => setViewingMemorial(m)} className="mt-3.5 w-full bg-[#1C0F0A] hover:bg-stone-900 text-amber-100 text-xs font-bold py-2 rounded-xl transition cursor-pointer text-center">Open Page</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ADMIN CONSOLE MODALS */}
      {isAddCatalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden text-slate-800 shadow-2xl border border-stone-200">
            <div className="bg-[#1C0F0A] text-amber-100 p-5 flex justify-between items-center"><h3 className="font-serif font-bold">Register Casket Model</h3><button onClick={() => setIsAddCatalogOpen(false)} className="cursor-pointer text-stone-400 hover:text-white"><X size={18} /></button></div>
            <form onSubmit={handleAddCasket} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[9px] font-bold uppercase text-stone-500 tracking-wider mb-1">Casket Design Name *</label>
                <input required value={catalogForm.name} onChange={e => setCatalogForm({ ...catalogForm, name: e.target.value })} className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-stone-500 tracking-wider mb-1">SKU *</label>
                  <input required value={catalogForm.sku} onChange={e => setCatalogForm({ ...catalogForm, sku: e.target.value })} className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl font-mono uppercase" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-stone-500 tracking-wider mb-1">Construct Material</label>
                  <select value={catalogForm.material} onChange={e => setCatalogForm({ ...catalogForm, material: e.target.value })} className="w-full p-3 border border-stone-200 bg-white rounded-xl"><option value="SOLID_WOOD">Solid Wood</option><option value="METAL_STEEL">Steel</option><option value="VENEER">Veneer</option></select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-stone-500 tracking-wider mb-1">Price *</label>
                  <input required type="number" value={catalogForm.retailPrice} onChange={e => setCatalogForm({ ...catalogForm, retailPrice: e.target.value })} className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-stone-500 tracking-wider mb-1">Workshop Qty *</label>
                  <input required type="number" value={catalogForm.currentStock} onChange={e => setCatalogForm({ ...catalogForm, currentStock: Number(e.target.value) })} className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl" />
                </div>
              </div>
              <label className="border-2 border-dashed border-stone-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 transition"><UploadCloud size={20} className="text-stone-400 mb-1" /><span className="text-[10px] font-bold text-stone-500">{catalogImageFile ? catalogImageFile.name : 'Select image file'}</span><input type="file" accept="image/*" className="hidden" onChange={e => setCatalogImageFile(e.target.files?.[0] || null)} /></label>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100"><button type="button" onClick={() => setIsAddCatalogOpen(false)} className="px-4 py-2 font-bold text-stone-400 cursor-pointer">Cancel</button><button type="submit" className="px-5 py-2.5 font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl cursor-pointer">Save</button></div>
            </form>
          </div>
        </div>
      )}

      {isAddHearseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden text-slate-800 shadow-2xl border border-stone-200">
            <div className="bg-[#1C0F0A] text-amber-100 p-5 flex justify-between items-center"><h3 className="font-serif font-bold">Register Fleet Coach</h3><button onClick={() => setIsAddHearseOpen(false)} className="cursor-pointer text-stone-400 hover:text-white"><X size={18} /></button></div>
            <form onSubmit={handleAddHearse} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-[9px] font-bold uppercase text-stone-500 tracking-wider mb-1">Coach Display Title *</label>
                <input required value={hearseForm.vehicleName} onChange={e => setHearseForm({ ...hearseForm, vehicleName: e.target.value })} className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[9px] font-bold uppercase text-stone-500 mb-1">Manufacturer *</label><input required value={hearseForm.make} onChange={e => setHearseForm({ ...hearseForm, make: e.target.value })} className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl" /></div>
                <div><label className="block text-[9px] font-bold uppercase text-stone-500 mb-1">Model Name *</label><input required value={hearseForm.model} onChange={e => setHearseForm({ ...hearseForm, model: e.target.value })} className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl" /></div>
                <div><label className="block text-[9px] font-bold uppercase text-stone-500 mb-1">License plate *</label><input required value={hearseForm.licensePlate} onChange={e => setHearseForm({ ...hearseForm, licensePlate: e.target.value })} className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl uppercase font-mono" /></div>
                <div><label className="block text-[9px] font-bold uppercase text-stone-500 mb-1">Construct Year *</label><input required type="number" value={hearseForm.year} onChange={e => setHearseForm({ ...hearseForm, year: Number(e.target.value) })} className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl" /></div>
              </div>
              <label className="border-2 border-dashed border-stone-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 transition"><Camera size={20} className="text-stone-400 mb-1" /><span className="text-[10px] font-bold text-stone-500">{hearseImageFile ? hearseImageFile.name : 'Select portrait file'}</span><input type="file" accept="image/*" className="hidden" onChange={e => setHearseImageFile(e.target.files?.[0] || null)} /></label>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100"><button type="button" onClick={() => setIsAddHearseOpen(false)} className="px-4 py-2 font-bold text-stone-400 cursor-pointer">Cancel</button><button type="submit" className="px-5 py-2.5 font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl cursor-pointer">Register</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT & DEFAULT EXPORT (WITH SECURE AUTH)
// ============================================================================
export default function App() {
  const [appMode, setAppMode] = useState<'client' | 'admin' | 'family'>('client');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('triplem_theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // --- USER AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login Form States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => setToast({ message, type });

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('triplem_theme', next);
  };

  // Check login token on page load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiGetMe(token).then((user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setCurrentUser(null);
        }
      });
    }
  }, []);

  // Handle Admin Button Click
  const handleEnterAdmin = () => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff')) {
      setAppMode('admin');
    } else {
      setLoginError('');
      setShowLoginModal(true);
    }
  };

  // Handle Login Submit (Hits PHP & MySQL)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const result = await apiLogin(loginEmail, loginPassword);

    if (result.success && result.user) {
      setCurrentUser(result.user);
      setShowLoginModal(false);
      setLoginPassword('');
      setAppMode('admin');
      addToast(`Welcome back, ${result.user.firstName}!`, 'success');
    } else {
      setLoginError(result.error || 'Invalid credentials');
    }
    setIsLoggingIn(false);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setCurrentUser(null);
    setAppMode('client');
    addToast('Logged out successfully', 'info');
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- SECURE LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-500 mb-3">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Staff & Admin Login</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Access the Funeral Management Portal</p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- APP VIEWS --- */}
      {appMode === 'client' && (
        <ClientWebsite
          onEnterAdmin={handleEnterAdmin}
          onEnterFamily={() => setAppMode('family')}
          theme={theme}
          onToggleTheme={toggleTheme}
          addToast={addToast}
        />
      )}

      {appMode === 'family' && (
        <FamilyPortal
          onBack={() => setAppMode('client')}
          theme={theme}
          addToast={addToast}
        />
      )}

      {appMode === 'admin' && (
        <StaffPortal
          onBack={() => setAppMode('client')}
          onLogout={handleLogout}
          currentUser={currentUser}
          theme={theme}
          addToast={addToast}
        />
      )}
    </>
  );
}