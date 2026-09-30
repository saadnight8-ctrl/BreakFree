import { createBrowserRouter } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import FAQ from './pages/FAQ'
import HelpSupport from './pages/HelpSupport'
import Contact from './pages/Contact'
import Directions from './pages/Directions'
import StreakRewards from './pages/StreakRewards'
import CrisisManagement from './pages/CrisisManagement'
import NotFound from './pages/NotFound'
import Bibliography from './pages/Bibliography'
import NextStep from './pages/NextStep'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'next-step', Component: NextStep },
      { path: 'faq', Component: FAQ },
      { path: 'help', Component: HelpSupport },
      { path: 'contact', Component: Contact },
      { path: 'directions', Component: Directions },
      { path: 'streak', Component: StreakRewards },
      { path: 'crisis', Component: CrisisManagement },
      { path: 'bibliography', Component: Bibliography },
      { path: '*', Component: NotFound },
    ],
  },
])
