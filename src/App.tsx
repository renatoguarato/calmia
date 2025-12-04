import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import Index from './pages/Index'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import RecommendationDetails from './pages/RecommendationDetails'
import History from './pages/History'
import Progress from './pages/Progress'
import Goals from './pages/Goals'
import GoalCreate from './pages/GoalCreate'
import GoalDetails from './pages/GoalDetails'
import GoalEdit from './pages/GoalEdit'
import Journal from './pages/Journal'
import JournalCreate from './pages/JournalCreate'
import JournalDetails from './pages/JournalDetails'
import JournalEdit from './pages/JournalEdit'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Privacy from './pages/Privacy'
import About from './pages/About'
import Legal from './pages/Legal'
import { ProtectedRoute } from './components/ProtectedRoute'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            <Route path="/legal" element={<Legal />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<History />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/goals/new" element={<GoalCreate />} />
              <Route path="/goals/:id" element={<GoalDetails />} />
              <Route path="/goals/:id/edit" element={<GoalEdit />} />
              <Route
                path="/recommendations/:id"
                element={<RecommendationDetails />}
              />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/new" element={<JournalCreate />} />
              <Route path="/journal/:id" element={<JournalDetails />} />
              <Route path="/journal/:id/edit" element={<JournalEdit />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
