import { STAGES } from './catalog'
import { buildMockResult } from './engine'
import type { DocRecord, DocStatus } from './types'

const doneStages = () =>
  STAGES.map((s) => ({ id: s.id, status: 'done' as const, progress: 1, durationMs: Math.round((s.duration[0] + s.duration[1]) / 2) }))

function seedDoc(
  n: number,
  fileName: string,
  sizeMb: number,
  status: DocStatus,
  uploadedAt: string,
  extra: Partial<DocRecord> = {},
): DocRecord {
  const base = {
    fileName,
    mimeType: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
    meta: {},
  }
  const result = buildMockResult(base)
  if (status === 'approved') result.fields = result.fields.map((f) => ({ ...f, confirmed: true }))
  return {
    id: `DOC-2026-${String(n).padStart(4, '0')}`,
    ...base,
    fileSize: Math.round(sizeMb * 1024 * 1024),
    uploadedAt,
    status,
    isSample: true,
    stages: doneStages(),
    result,
    history: [
      { at: uploadedAt, kind: 'uploaded', actor: 'Omar Khalil' },
      { at: uploadedAt, kind: 'processing_started' },
      { at: uploadedAt, kind: 'processing_done' },
    ],
    ...extra,
  }
}

/** A handful of documents so the queue isn't empty on first load. */
export function seedDocuments(): DocRecord[] {
  return [
    seedDoc(908, 'ترخيص-نقل-البضائع-2023.pdf', 4.2, 'review', '2026-11-08T09:12:00'),
    seedDoc(907, 'Vehicle_Registration_Form_4521.pdf', 1.8, 'review', '2026-11-08T08:47:00'),
    seedDoc(905, 'Bill_of_Lading_AQB_0098812.pdf', 6.3, 'approved', '2026-11-06T14:20:00'),
    seedDoc(903, 'Passenger_Transport_License_Irbid.jpg', 2.4, 'approved', '2026-11-05T11:03:00'),
    seedDoc(901, 'Cargo_Manifest_Scan_1998.jpg', 3.1, 'rejected', '2026-11-04T16:41:00', {
      rejectionReason: 'Page 2 missing from scan',
    }),
  ]
}
