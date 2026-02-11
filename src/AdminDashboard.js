import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getAllUsers, verifyAdminPassword } from './services/firebaseService';

export function AdminDashboard({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(true);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      setShowPasswordForm(false);
      fetchUsers();
      setPassword('');
    } else {
      setError('Invalid admin password');
      setPassword('');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const usersList = await getAllUsers();
      setUsers(usersList);
    } catch (err) {
      setError('Failed to load users: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsCSV = () => {
    if (users.length === 0) {
      alert('No users to download');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Submitted At'];
    const rows = users.map(user => [
      user.name || '',
      user.email || '',
      user.phone || '',
      new Date(user.submittedAt).toLocaleString()
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'acts2-users.csv';
    a.click();
  };

  if (showPasswordForm) {
    return (
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#F8FAFB',
        padding: '20px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          marginTop: '40px',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ marginTop: 0, color: '#0F172A', textAlign: 'center' }}>Admin Access</h1>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '20px' }}>
            Enter admin password to view submitted user profiles
          </p>
          
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1B9AAA',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          </form>
          
          {error && (
            <p style={{ color: '#EF4444', marginTop: '12px', textAlign: 'center' }}>
              {error}
            </p>
          )}
          
          <button
            onClick={onBack}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '12px',
              backgroundColor: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#F8FAFB',
      fontFamily: 'sans-serif',
      paddingBottom: '30px'
    }}>
      <div style={{
        backgroundColor: '#1B9AAA',
        color: 'white',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ArrowLeft size={20} color="white" />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>👥 User Dashboard</h1>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Submissions</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#1B9AAA' }}>
              {users.length}
            </p>
          </div>
          <button
            onClick={downloadAsCSV}
            disabled={loading || users.length === 0}
            style={{
              padding: '12px 16px',
              backgroundColor: '#1B9AAA',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: users.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: loading ? 0.6 : 1
            }}
          >
            📥 Download CSV
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            ⏳ Loading users...
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {!loading && users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            No user submissions yet.
          </div>
        )}

        {!loading && users.length > 0 && (
          <div>
            {users.map((user, index) => (
              <div
                key={user.id}
                style={{
                  backgroundColor: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  borderLeft: '4px solid #1B9AAA'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#0F172A' }}>
                      {index + 1}. {user.name}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                      📧 {user.email}
                    </p>
                    {user.phone && (
                      <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                        📱 {user.phone}
                      </p>
                    )}
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
                      Submitted: {new Date(user.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
