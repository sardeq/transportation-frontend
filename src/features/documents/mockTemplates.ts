import type { AnalysisResult } from './types'

/**
 * Hand-written stand-ins for what the extraction service will return.
 * Shapes match `AnalysisResult` exactly so the real API can replace these
 * without touching the UI.
 */

export type TemplateId = 'license' | 'vehicle' | 'lading'

const freightLicense = (): AnalysisResult => ({
  title: { en: 'Freight Transport License — Heavy Vehicles', ar: 'ترخيص نقل البضائع — المركبات الثقيلة' },
  language: 'ar',
  category: 'transport_license',
  categoryConfidence: 0.97,
  overallConfidence: 0,
  pageCount: 2,
  fields: [
    { id: 'license_no', label: { en: 'License number', ar: 'رقم الترخيص' }, value: 'MOT-LIC-2023-4891', confidence: 0.98, dir: 'ltr' },
    { id: 'issue_date', label: { en: 'Issue date', ar: 'تاريخ الإصدار' }, value: '2023-06-15', confidence: 0.95, dir: 'ltr' },
    { id: 'expiry_date', label: { en: 'Expiry date', ar: 'تاريخ الانتهاء' }, value: '2026-06-14', confidence: 0.91, dir: 'ltr' },
    { id: 'holder', label: { en: 'License holder', ar: 'صاحب الترخيص' }, value: 'شركة الأردن للشحن البري', confidence: 0.88, dir: 'rtl' },
    { id: 'issuer', label: { en: 'Issuing authority', ar: 'الجهة المانحة' }, value: 'مديرية الترخيص', confidence: 0.93, dir: 'rtl' },
    { id: 'vehicle_class', label: { en: 'Vehicle class', ar: 'فئة المركبة' }, value: 'مركبات ثقيلة — شحن', confidence: 0.84, dir: 'rtl' },
    { id: 'plate', label: { en: 'Plate number', ar: 'رقم اللوحة' }, value: '50-48213', confidence: 0.64, dir: 'ltr' },
    { id: 'governorate', label: { en: 'Governorate', ar: 'المحافظة' }, value: 'عمّان', confidence: 0.76, dir: 'rtl' },
    { id: 'legal_basis', label: { en: 'Legal basis', ar: 'السند القانوني' }, value: 'قانون النقل رقم 47 لسنة 2008', confidence: 0.9, dir: 'rtl' },
  ],
  entities: [
    { type: 'organization', value: 'وزارة النقل' },
    { type: 'organization', value: 'شركة الأردن للشحن البري' },
    { type: 'date', value: '2023-06-15' },
    { type: 'law', value: 'Transport Law No. 47 of 2008' },
    { type: 'location', value: 'Amman, Jordan' },
    { type: 'reference', value: 'MOT-LIC-2023-4891' },
  ],
  transcription: [
    {
      lang: 'ar',
      confidence: 0.96,
      text:
        'المملكة الأردنية الهاشمية\nوزارة النقل\n\nترخيص نقل البضائع\n\nتمنح وزارة النقل بموجب هذا الترخيص حق نقل البضائع بالمركبات الثقيلة في كافة أنحاء المملكة الأردنية الهاشمية، وذلك وفقاً للشروط والأحكام المنصوص عليها في قانون النقل رقم 47 لسنة 2008 وتعديلاته.\n\nيُعتبر هذا الترخيص سارياً لمدة ثلاث سنوات من تاريخ إصداره، ويجب تجديده قبل انتهاء مدته.',
    },
    {
      lang: 'en',
      confidence: 0.94,
      text:
        'Hashemite Kingdom of Jordan — Ministry of Transport\n\nFreight Transport License\n\nThe Ministry of Transport hereby grants the right to transport freight using heavy vehicles throughout the Hashemite Kingdom of Jordan, pursuant to the terms and conditions stipulated in Transport Law No. 47 of 2008 and its amendments.',
    },
  ],
  keywords: ['freight', 'heavy vehicles', 'license', 'نقل البضائع'],
  preprocessing: { deskewDeg: 1.8, noiseReductionPct: 23, contrastGainPct: 12, dpi: 300 },
  layout: { textRegions: 14, tables: 1, stamps: 1, signatures: 1 },
})

const vehicleRegistration = (): AnalysisResult => ({
  title: { en: 'Vehicle Registration Record', ar: 'سجل تسجيل مركبة' },
  language: 'en',
  category: 'vehicle_record',
  categoryConfidence: 0.95,
  overallConfidence: 0,
  pageCount: 1,
  fields: [
    { id: 'registration_no', label: { en: 'Registration no.', ar: 'رقم التسجيل' }, value: 'VR-2024-4521', confidence: 0.97, dir: 'ltr' },
    { id: 'owner', label: { en: 'Registered owner', ar: 'المالك المسجل' }, value: 'Khaled M. Haddad', confidence: 0.9, dir: 'ltr' },
    { id: 'vin', label: { en: 'Chassis / VIN', ar: 'رقم الشاصي' }, value: 'JTMHV05J804O12345', confidence: 0.71, dir: 'ltr' },
    { id: 'make_model', label: { en: 'Make & model', ar: 'الصنع والطراز' }, value: 'Toyota Hilux 2019', confidence: 0.93, dir: 'ltr' },
    { id: 'plate', label: { en: 'Plate number', ar: 'رقم اللوحة' }, value: '21-77340', confidence: 0.88, dir: 'ltr' },
    { id: 'registration_date', label: { en: 'Registration date', ar: 'تاريخ التسجيل' }, value: '2024-03-02', confidence: 0.95, dir: 'ltr' },
    { id: 'expiry_date', label: { en: 'Valid until', ar: 'صالح حتى' }, value: '2025-03-01', confidence: 0.94, dir: 'ltr' },
    { id: 'gross_weight', label: { en: 'Gross weight', ar: 'الوزن الإجمالي' }, value: '2,850 kg', confidence: 0.77, dir: 'ltr' },
  ],
  entities: [
    { type: 'person', value: 'Khaled M. Haddad' },
    { type: 'vehicle', value: 'Toyota Hilux 2019' },
    { type: 'reference', value: 'VR-2024-4521' },
    { type: 'date', value: '2024-03-02' },
    { type: 'location', value: 'Irbid' },
  ],
  transcription: [
    {
      lang: 'en',
      confidence: 0.95,
      text:
        'MINISTRY OF TRANSPORT — VEHICLE REGISTRATION\n\nRegistration No: VR-2024-4521\nOwner: Khaled M. Haddad\nMake/Model: Toyota Hilux 2019\nChassis No: JTMHV05J804O12345\nPlate: 21-77340\nGross weight: 2,850 kg\nRegistered at: Irbid Licensing Office on 2024-03-02.',
    },
  ],
  keywords: ['vehicle', 'registration', 'Irbid'],
  preprocessing: { deskewDeg: 0.6, noiseReductionPct: 11, contrastGainPct: 6, dpi: 300 },
  layout: { textRegions: 9, tables: 1, stamps: 1, signatures: 0 },
})

const billOfLading = (): AnalysisResult => ({
  title: { en: 'Bill of Lading — Aqaba to Amman', ar: 'بوليصة شحن — العقبة إلى عمّان' },
  language: 'mixed',
  category: 'bill_of_lading',
  categoryConfidence: 0.92,
  overallConfidence: 0,
  pageCount: 3,
  fields: [
    { id: 'bl_no', label: { en: 'B/L number', ar: 'رقم البوليصة' }, value: 'AQB-BL-0098812', confidence: 0.96, dir: 'ltr' },
    { id: 'shipper', label: { en: 'Shipper', ar: 'الشاحن' }, value: 'شركة العقبة للخدمات اللوجستية', confidence: 0.85, dir: 'rtl' },
    { id: 'consignee', label: { en: 'Consignee', ar: 'المرسل إليه' }, value: 'Al-Noor Construction Co.', confidence: 0.82, dir: 'ltr' },
    { id: 'origin', label: { en: 'Port of loading', ar: 'ميناء التحميل' }, value: 'Aqaba', confidence: 0.94, dir: 'ltr' },
    { id: 'destination', label: { en: 'Destination', ar: 'الوجهة' }, value: 'Amman Customs Dry Port', confidence: 0.79, dir: 'ltr' },
    { id: 'carrier', label: { en: 'Truck / carrier', ar: 'الشاحنة / الناقل' }, value: 'JO-11-4402', confidence: 0.69, dir: 'ltr' },
    { id: 'cargo', label: { en: 'Cargo description', ar: 'وصف البضاعة' }, value: 'حديد تسليح — 24 طن', confidence: 0.83, dir: 'rtl' },
    { id: 'ship_date', label: { en: 'Shipping date', ar: 'تاريخ الشحن' }, value: '2022-11-08', confidence: 0.92, dir: 'ltr' },
  ],
  entities: [
    { type: 'organization', value: 'شركة العقبة للخدمات اللوجستية' },
    { type: 'organization', value: 'Al-Noor Construction Co.' },
    { type: 'location', value: 'Aqaba' },
    { type: 'location', value: 'Amman Customs Dry Port' },
    { type: 'vehicle', value: 'JO-11-4402' },
    { type: 'date', value: '2022-11-08' },
  ],
  transcription: [
    {
      lang: 'ar',
      confidence: 0.88,
      text: 'بوليصة شحن بري\nالشاحن: شركة العقبة للخدمات اللوجستية\nالبضاعة: حديد تسليح — 24 طن\nمن: ميناء العقبة   إلى: ميناء عمّان الجمركي البري',
    },
    {
      lang: 'en',
      confidence: 0.9,
      text: 'LAND BILL OF LADING  No. AQB-BL-0098812\nConsignee: Al-Noor Construction Co.\nCarrier: Truck JO-11-4402\nDate of shipment: 08 Nov 2022',
    },
  ],
  keywords: ['bill of lading', 'Aqaba', 'steel', 'شحن'],
  preprocessing: { deskewDeg: 3.1, noiseReductionPct: 31, contrastGainPct: 18, dpi: 200 },
  layout: { textRegions: 18, tables: 2, stamps: 2, signatures: 2 },
})

export const TEMPLATES: Record<TemplateId, () => AnalysisResult> = {
  license: freightLicense,
  vehicle: vehicleRegistration,
  lading: billOfLading,
}

/** Guess which template best fits a file name (mock only). */
export function pickTemplate(fileName: string): TemplateId {
  const n = fileName.toLowerCase()
  if (/vehicle|registration|مركب/.test(n)) return 'vehicle'
  if (/lading|bill|waybill|manifest|cargo|بوليص|شحن/.test(n)) return 'lading'
  if (/licen|permit|ترخيص|[؀-ۿ]/.test(n)) return 'license'
  const ids: TemplateId[] = ['license', 'vehicle', 'lading']
  let h = 0
  for (const ch of n) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return ids[h % ids.length]
}
