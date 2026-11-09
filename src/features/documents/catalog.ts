import type { Bilingual } from '../../i18n/i18n-context'
import type { CategoryId, EntityType, StageId } from './types'

export const LOW_CONFIDENCE = 0.8

export const CATEGORIES: Record<CategoryId, Bilingual> = {
  transport_license: { en: 'Transport license', ar: 'ترخيص نقل' },
  vehicle_record: { en: 'Vehicle record', ar: 'سجل مركبة' },
  bill_of_lading: { en: 'Bill of lading', ar: 'بوليصة شحن' },
  inspection_report: { en: 'Inspection report', ar: 'تقرير فحص' },
  correspondence: { en: 'Official correspondence', ar: 'مراسلات رسمية' },
  regulation: { en: 'Regulation', ar: 'أنظمة وتعليمات' },
}

export const DEPARTMENTS: Record<string, Bilingual> = {
  licensing: { en: 'Licensing Directorate', ar: 'مديرية الترخيص' },
  freight: { en: 'Freight & Logistics', ar: 'الشحن والخدمات اللوجستية' },
  public_transport: { en: 'Public Transport', ar: 'النقل العام' },
  planning: { en: 'Planning & Studies', ar: 'التخطيط والدراسات' },
  archive: { en: 'Central Archive', ar: 'الأرشيف المركزي' },
}

export const ENTITY_TYPES: Record<EntityType, Bilingual> = {
  organization: { en: 'Organization', ar: 'جهة' },
  person: { en: 'Person', ar: 'شخص' },
  date: { en: 'Date', ar: 'تاريخ' },
  law: { en: 'Legal reference', ar: 'مرجع قانوني' },
  location: { en: 'Location', ar: 'موقع' },
  vehicle: { en: 'Vehicle', ar: 'مركبة' },
  reference: { en: 'Reference no.', ar: 'رقم مرجعي' },
}

export interface StageDef {
  id: StageId
  label: Bilingual
  description: Bilingual
  /** Simulated duration range in ms (mock engine only). */
  duration: [number, number]
}

export const STAGES: StageDef[] = [
  {
    id: 'ingest',
    label: { en: 'Ingest', ar: 'الاستلام' },
    description: { en: 'File received, pages split and fingerprinted.', ar: 'استلام الملف وتقسيم الصفحات وتوثيقها.' },
    duration: [500, 900],
  },
  {
    id: 'preprocess',
    label: { en: 'Clean up', ar: 'المعالجة' },
    description: { en: 'Deskew, denoise and contrast correction.', ar: 'تصحيح الميلان وإزالة التشويش وضبط التباين.' },
    duration: [900, 1500],
  },
  {
    id: 'layout',
    label: { en: 'Layout', ar: 'التخطيط' },
    description: { en: 'Detect text blocks, tables, stamps and signatures.', ar: 'تحديد كتل النص والجداول والأختام والتواقيع.' },
    duration: [900, 1400],
  },
  {
    id: 'ocr',
    label: { en: 'Read text', ar: 'قراءة النص' },
    description: { en: 'Bilingual OCR for Arabic and English.', ar: 'التعرف الضوئي على النصوص العربية والإنجليزية.' },
    duration: [1400, 2200],
  },
  {
    id: 'classify',
    label: { en: 'Classify', ar: 'التصنيف' },
    description: { en: 'Identify the document type.', ar: 'تحديد نوع الوثيقة.' },
    duration: [600, 1000],
  },
  {
    id: 'extract',
    label: { en: 'Extract', ar: 'الاستخراج' },
    description: { en: 'Pull out structured fields and entities.', ar: 'استخراج الحقول والكيانات المنظمة.' },
    duration: [1000, 1600],
  },
]

export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<StageId, StageDef>
