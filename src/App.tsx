import { Archive, ChartColumn, Compass, Landmark, Search, Settings, Users } from 'lucide-react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { DocumentsProvider } from './features/documents/DocumentsProvider'
import { I18nProvider } from './i18n/I18nProvider'
import { AppShell } from './layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { DocumentPage } from './pages/document/DocumentPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { QueuePage } from './pages/QueuePage'
import { UploadPage } from './pages/UploadPage'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: 'queue', element: <QueuePage mode="queue" /> },
      { path: 'review', element: <QueuePage mode="review" /> },
      { path: 'documents/:id', element: <DocumentPage /> },
      {
        path: 'archive',
        element: (
          <PlaceholderPage title="page.archive" plan="plan.archive" icon={Archive} upcoming={['up.filters', 'up.originals', 'up.export']} />
        ),
      },
      {
        path: 'search',
        element: (
          <PlaceholderPage title="page.search" plan="plan.search" icon={Search} upcoming={['up.fulltext', 'up.fieldSearch', 'up.savedSearch']} />
        ),
      },
      {
        path: 'reports',
        element: (
          <PlaceholderPage title="page.reports" plan="plan.reports" icon={ChartColumn} upcoming={['up.volume', 'up.accuracy', 'up.growth', 'up.reviewTime']} />
        ),
      },
      {
        path: 'transport-bank',
        element: (
          <PlaceholderPage title="page.bank" plan="plan.bank" icon={Landmark} upcoming={['up.syncStatus', 'up.retries', 'up.mapping']} />
        ),
      },
      {
        path: 'users',
        element: <PlaceholderPage title="page.users" plan="plan.users" icon={Users} upcoming={['up.roles', 'up.permissions', 'up.audit']} />,
      },
      {
        path: 'settings',
        element: (
          <PlaceholderPage title="page.settings" plan="plan.settings" icon={Settings} upcoming={['up.thresholds', 'up.languages', 'up.retention']} />
        ),
      },
      {
        path: '*',
        element: <PlaceholderPage title="notFound.title" plan="notFound.body" icon={Compass} />,
      },
    ],
  },
])

export default function App() {
  return (
    <I18nProvider>
      <DocumentsProvider>
        <RouterProvider router={router} />
      </DocumentsProvider>
    </I18nProvider>
  )
}
