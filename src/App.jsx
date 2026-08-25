import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import CompaniesIndex from './pages/companies/CompaniesIndex';
import CompanyCreate from './pages/companies/CompanyCreate';
import CompanyEdit from './pages/companies/CompanyEdit';
import ApplicationForm from './pages/forms/ApplicationForm';
import EditForm from './pages/forms/EditForm';
import ViewForm from './pages/forms/ViewForm';
import ApplicationForms from './pages/ApplicationForms';
import MembersIndex from './pages/members/MembersIndex';
import MembersHistory from './pages/members/MembersHistory';
import RandomReportsIndex from './pages/random-reports/RandomReportsIndex';
import RandomReportsShow from './pages/random-reports/RandomReportsShow';
import ElogCompanies from './pages/ElogCompanies';
import MyProfile from './pages/MyProfile';
import Dashboard from './pages/Dashboard';
import PageSkeleton from './components/PageSkeleton';
import './styles/app-overrides.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <PageSkeleton variant="table" />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="companies"
          element={
            <AdminRoute>
              <CompaniesIndex />
            </AdminRoute>
          }
        />
        <Route
          path="companies/create"
          element={
            <AdminRoute>
              <CompanyCreate />
            </AdminRoute>
          }
        />
        <Route
          path="companies/:id/edit"
          element={
            <AdminRoute>
              <CompanyEdit />
            </AdminRoute>
          }
        />
        <Route path="application-forms" element={<ApplicationForms />} />
        <Route path="form/:id" element={<ApplicationForm />} />
        <Route path="edit-form/:id" element={<EditForm />} />
        <Route path="view-form/:id" element={<ViewForm />} />
        <Route
          path="members"
          element={
            <AdminRoute>
              <MembersIndex />
            </AdminRoute>
          }
        />
        <Route
          path="members/:id/history"
          element={
            <AdminRoute>
              <MembersHistory />
            </AdminRoute>
          }
        />
        <Route
          path="random-reports"
          element={
            <AdminRoute>
              <RandomReportsIndex />
            </AdminRoute>
          }
        />
        <Route
          path="random-reports/:id"
          element={
            <AdminRoute>
              <RandomReportsShow />
            </AdminRoute>
          }
        />
        <Route
          path="elog-companies"
          element={
            <AdminRoute>
              <ElogCompanies />
            </AdminRoute>
          }
        />
        <Route path="my-profile" element={<MyProfile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
