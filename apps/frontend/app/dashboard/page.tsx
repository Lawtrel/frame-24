import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardPageComponent from '../../components/DashboardPageComponent';

export default function Dashboard() {
  return (
    <ProtectedRoute>
    <DashboardPageComponent />
    </ProtectedRoute>
  );
}
