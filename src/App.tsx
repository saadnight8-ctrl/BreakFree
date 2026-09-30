import { LanguageProvider } from './i18n'
import { RouterProvider } from 'react-router'
import { router } from './routes'

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  )
}
