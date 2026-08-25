import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageSkeleton from '../components/PageSkeleton';

export default function MyProfile() {
  const { user, setUser, refreshUser } = useAuth();
  const [appName, setAppName] = useState('DOT Safety Services');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [passMsg, setPassMsg] = useState(null);
  const [passError, setPassError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/my-profile');
        if (cancelled) return;
        if (data.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
        }
        if (data.app_name) setAppName(data.app_name);
      } catch {
        // fall back to auth context values
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileError(null);
    setSavingProfile(true);
    try {
      const { data } = await api.post('/my-profile', {
        name,
        email,
        role: user?.role,
        userid: user?.id,
      });
      setProfileMsg(data.message || 'Profile updated successfully');
      if (data.user) {
        setUser(data.user);
      } else {
        await refreshUser();
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    setPassError(null);
    setSavingPass(true);
    try {
      const { data } = await api.post('/my-profile/password', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      if (data.success) {
        setPassMsg(data.message || 'Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassError(data.message || 'Failed to update password.');
      }
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPass(false);
    }
  };

  if (loading) {
    return <PageSkeleton variant="form" />;
  }

  return (
    <div className="pc-container">
      <div className="pc-content">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="page-title mb-0 font-size-18">PROFILE</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">Welcome to {appName} Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6 update-profile-sec">
            {profileError && (
              <div className="alert alert-danger">{profileError}</div>
            )}
            {profileMsg && <div className="alert alert-success">{profileMsg}</div>}

            <h3 className="card-heading">Update your profile information</h3>
            <form method="POST" onSubmit={handleProfileSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    className="form-control custom-input"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control custom-input"
                    name="email"
                    value={email}
                    readOnly
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <input type="hidden" name="role" value={user?.role || ''} />
              <input type="hidden" name="userid" value={user?.id || '0'} />

              <div className="row mt-4">
                <div className="col-md-12">
                  <button className="btn btn-primary btn-custom" disabled={savingProfile}>
                    {savingProfile ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="col-md-5 update-profile-sec">
            {passError && <div className="alert alert-danger">{passError}</div>}
            {passMsg && <div className="alert alert-success">{passMsg}</div>}

            <h3 className="card-heading">Change your password</h3>
            <form method="POST" onSubmit={handlePasswordSubmit}>
              <div className="row ">
                <div className="col-md-12">
                  <label htmlFor="current_password">Current Password</label>
                  <input
                    id="current_password"
                    type="password"
                    placeholder="6+ characters"
                    className="form-control custom-input"
                    name="current_password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="row ">
                <div className="col-md-12">
                  <label htmlFor="new_password">New Password</label>
                  <input
                    id="new_password"
                    type="password"
                    placeholder="6+ characters"
                    className="form-control custom-input"
                    name="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="row ">
                <div className="col-md-12">
                  <label htmlFor="confirm_password">Confirm Password</label>
                  <input
                    id="confirm_password"
                    type="password"
                    placeholder="6+ characters"
                    className="form-control custom-input"
                    name="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-12">
                  <button className="btn btn-primary btn-custom" disabled={savingPass}>
                    {savingPass ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
