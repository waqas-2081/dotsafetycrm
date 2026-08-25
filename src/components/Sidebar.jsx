import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PROFILE_IMG_URL = import.meta.env.VITE_PROFILE_IMG_URL || '';
const DEFAULT_PROFILE =
  'https://admin.dotsafetyservice.com/public/storage/profiles/defaultprofile.jpg';

const HIDDEN_MEMBER_IDS = [86, 87, 96, 157, 482];

export default function Sidebar() {
  const { user, isAdmin, isUser } = useAuth();
  const profileSrc = user?.profile
    ? `${PROFILE_IMG_URL}${user.profile}`
    : DEFAULT_PROFILE;
  const showMembersSection = isAdmin && !HIDDEN_MEMBER_IDS.includes(Number(user?.id));

  return (
    <nav className="pc-sidebar">
      <div className="navbar-wrapper">
        <div className="m-header">
          <NavLink to="/" className="b-brand text-primary">
            <img
              src="/assets/images/logo.png"
              alt="logo image"
              className="logo-lg"
              style={{ marginTop: 25 }}
            />
          </NavLink>
        </div>
        <div className="navbar-content" style={{ marginTop: 22 }}>
          <ul className="pc-navbar">
            <li className="pc-item pc-caption">
              <label data-i18n="Menu">Menu</label>
            </li>

            <li className="pc-item">
              <NavLink to="/" end className={({ isActive }) => `pc-link${isActive ? ' active' : ''}`}>
                <span className="pc-micon">
                  <i className="ph-duotone ph-gauge"></i>
                </span>
                <span className="pc-mtext">Dashboard</span>
              </NavLink>
            </li>

            {isUser && (
              <li className="pc-item">
                <NavLink
                  to={`/form/${user.id}`}
                  className={({ isActive }) => `pc-link${isActive ? ' active' : ''}`}
                >
                  <span className="pc-micon">
                    <i className="ph-duotone ph-file-text"></i>
                  </span>
                  <span className="pc-mtext" data-i18n="Application Form">
                    Application Form
                  </span>
                </NavLink>
              </li>
            )}

            {isAdmin && (
              <>
                <li className="pc-item">
                  <NavLink
                    to="/application-forms"
                    className={({ isActive }) => `pc-link${isActive ? ' active' : ''}`}
                  >
                    <span className="pc-micon">
                      <i className="ph-duotone ph-file-text"></i>
                    </span>
                    <span className="pc-mtext">Application Forms</span>
                  </NavLink>
                </li>

                <li className="pc-item">
                  <NavLink
                    to="/random-reports"
                    className={({ isActive }) => `pc-link${isActive ? ' active' : ''}`}
                  >
                    <span className="pc-micon">
                      <i className="ph-duotone ph-chart-pie"></i>
                    </span>
                    <span className="pc-mtext">Random Reports</span>
                  </NavLink>
                </li>

                <li className="pc-item d-none">
                  <NavLink
                    to="/blogs"
                    className={({ isActive }) => `pc-link${isActive ? ' active' : ''}`}
                  >
                    <span className="pc-micon">
                      <i className="ph-duotone ph-newspaper"></i>
                    </span>
                    <span className="pc-mtext">Blogs</span>
                  </NavLink>
                </li>

                <li className="pc-item">
                  <NavLink
                    to="/companies"
                    className={({ isActive }) => `pc-link${isActive ? ' active' : ''}`}
                  >
                    <span className="pc-micon">
                      <i className="ph-duotone ph-buildings"></i>
                    </span>
                    <span className="pc-mtext">Companies</span>
                  </NavLink>
                </li>

                {showMembersSection && (
                  <>
                    <li className="pc-item">
                      <NavLink
                        to="/members"
                        className={({ isActive }) => `pc-link${isActive ? ' active' : ''}`}
                      >
                        <span className="pc-micon">
                          <i className="ph-duotone ph-credit-card"></i>
                        </span>
                        <span className="pc-mtext">Paid Members</span>
                      </NavLink>
                    </li>

                    <li className="pc-item">
                      <NavLink
                        to="/elog-companies"
                        className={({ isActive }) => `pc-link${isActive ? ' active' : ''}`}
                      >
                        <span className="pc-micon">
                          <i className="ph-duotone ph-buildings"></i>
                        </span>
                        <span className="pc-mtext">E-Log Companies</span>
                      </NavLink>
                    </li>

                    <li className="pc-item d-none">
                      <NavLink
                        to="/pages"
                        className={({ isActive }) => `pc-link${isActive ? ' active' : ''}`}
                      >
                        <span className="pc-micon">
                          <i className="ph-duotone ph-diamonds-four"></i>
                        </span>
                        <span className="pc-mtext">Pages SEO</span>
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>

        <div className="card pc-user-card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <img
                  src={profileSrc}
                  alt="user-image"
                  className="user-avtar wid-45 rounded-circle"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="flex-grow-1 ms-3">
                <div className="dropdown">
                  <a
                    href="#"
                    className="arrow-none dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-bs-offset="0,20"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 me-2">
                        <h6 className="mb-0">{user?.name || 'John Smith'}</h6>
                        <small>{user?.role || 'Administrator'}</small>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
