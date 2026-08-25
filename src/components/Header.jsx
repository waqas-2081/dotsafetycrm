import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const avatar = user?.avatar || '/assets/images/user/avatar-2.jpg';

  return (
    <header className="pc-header">
      <div className="header-wrapper">
        <div className="me-auto pc-mob-drp">
          <ul className="list-unstyled">
            <li className="pc-h-item pc-sidebar-collapse">
              <a
                href="#"
                className="pc-head-link ms-0"
                id="sidebar-hide"
                onClick={(e) => {
                  e.preventDefault();
                  document.body.classList.toggle('pc-sidebar-hide');
                  document.querySelector('.pc-sidebar')?.classList.toggle('pc-sidebar-hide');
                }}
              >
                <i className="ti ti-menu-2"></i>
              </a>
            </li>
            <li className="pc-h-item pc-sidebar-popup">
              <a
                href="#"
                className="pc-head-link ms-0"
                id="mobile-collapse"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('.pc-sidebar')?.classList.toggle('mob-sidebar-active');
                }}
              >
                <i className="ti ti-menu-2"></i>
              </a>
            </li>
          </ul>
        </div>
        <div className="ms-auto">
          <ul className="list-unstyled">
            <li className="dropdown pc-h-item header-user-profile">
              <a
                className="pc-head-link dropdown-toggle arrow-none me-0"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                <img src={avatar} alt="user-image" className="user-avtar" />
              </a>
              <div className="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
                <div className="dropdown-header d-flex align-items-center justify-content-between">
                  <h5 className="m-0">Profile</h5>
                </div>
                <div className="dropdown-body">
                  <div
                    className="profile-notification-scroll position-relative"
                    style={{ maxHeight: 'calc(100vh - 225px)' }}
                  >
                    <ul className="list-group list-group-flush w-100">
                      <li className="list-group-item">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <img src={avatar} alt="user-image" className="wid-50 rounded-circle" />
                          </div>
                          <div className="flex-grow-1 mx-3">
                            <h5 className="mb-0">{user?.name || 'Carson Darrin'}</h5>
                            <a className="link-primary" href={`mailto:${user?.email || ''}`}>
                              {user?.email || 'carson.darrin@company.io'}
                            </a>
                          </div>
                          <span className="badge bg-primary">PRO</span>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={(e) => {
                            e.preventDefault();
                            logout();
                          }}
                        >
                          <span className="d-flex align-items-center">
                            <i className="ph-duotone ph-power"></i>
                            <span>Logout</span>
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
