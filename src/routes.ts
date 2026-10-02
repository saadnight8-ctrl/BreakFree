import { createBrowserRouter } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import FAQ from './pages/FAQ'
import HelpSupport from './pages/HelpSupport'
import Directions from './pages/Directions'
import StreakRewards from './pages/StreakRewards'
import CrisisManagement from './pages/CrisisManagement'
import NotFound from './pages/NotFound'
import Bibliography from './pages/Bibliography'
import PersonalPlan from './pages/PersonalPlan'
import AboutUs from './pages/AboutUs'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'personal-plan', Component: PersonalPlan },
      { path: 'faq', Component: FAQ },
      { path: 'help', Component: HelpSupport },
      { path: 'directions', Component: Directions },
      { path: 'streak', Component: StreakRewards },
      { path: 'crisis', Component: CrisisManagement },
      { path: 'bibliography', Component: Bibliography },
      { path: 'about', Component: AboutUs },
      { path: '*', Component: NotFound },
    ],
  },
])
