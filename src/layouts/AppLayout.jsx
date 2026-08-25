import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  return (
    <div className="container-fluid">
      <div id="layout-wrapper">
        <Sidebar />
        <Header />
        <div className="main-content">
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
