import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import {
  PortfolioPage,
  CompletedProjectsPage,
  OngoingProjectsPage,
  UpcomingProjectsPage,
  ServicesPage,
  EducationPage,
  AchievementsPage,
  GalleryPage,
  ContactPage,
} from './pages/public/PublicPages';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import {
  AdminCompletedProjects,
  AdminOngoingProjects,
  AdminUpcomingProjects,
  AdminServices,
  AdminEducation,
  AdminAchievements,
  AdminGallery,
  AdminTestimonials,
  AdminMessages,
} from './pages/admin/AdminPages';
import {
  AdminHomeContent,
  AdminAboutContent,
  AdminSettings,
} from './pages/admin/AdminContentEditors';

import { PageLoader } from './components/public/UI';

// Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

// Public Auth Guard (redirect if already logged in)
function PublicAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/completed-projects" element={<CompletedProjectsPage />} />
      <Route path="/ongoing-projects" element={<OngoingProjectsPage />} />
      <Route path="/upcoming-projects" element={<UpcomingProjectsPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/education" element={<EducationPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* ===== ADMIN ROUTES ===== */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={
        <PublicAdminRoute>
          <AdminLogin />
        </PublicAdminRoute>
      } />

      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/home" element={<ProtectedRoute><AdminHomeContent /></ProtectedRoute>} />
      <Route path="/admin/about" element={<ProtectedRoute><AdminAboutContent /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/portfolio" element={<ProtectedRoute><AdminPortfolio /></ProtectedRoute>} />
      <Route path="/admin/completed-projects" element={<ProtectedRoute><AdminCompletedProjects /></ProtectedRoute>} />
      <Route path="/admin/ongoing-projects" element={<ProtectedRoute><AdminOngoingProjects /></ProtectedRoute>} />
      <Route path="/admin/upcoming-projects" element={<ProtectedRoute><AdminUpcomingProjects /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/education" element={<ProtectedRoute><AdminEducation /></ProtectedRoute>} />
      <Route path="/admin/achievements" element={<ProtectedRoute><AdminAchievements /></ProtectedRoute>} />
      <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
      <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen bg-dark-950 flex items-center justify-center text-center p-8">
          <div>
            <div className="font-heading text-9xl text-primary-600/20 mb-4">404</div>
            <div className="font-heading text-3xl text-white tracking-wider mb-4">Page Not Found</div>
            <p className="text-dark-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
            <a href="/" className="btn-primary inline-block">Go Home</a>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#181818',
                color: '#e8e8e8',
                border: '1px solid #282828',
                borderRadius: '0',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#f97316', secondary: '#0c0c0c' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#0c0c0c' },
              },
            }}
          />
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
