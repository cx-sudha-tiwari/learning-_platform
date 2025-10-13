(function(){
  const API_URL = 'http://localhost:3000';
  const dashboardContent = document.getElementById('dashboardContent');
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const logoutBtn = document.getElementById('logoutBtn');
  const yearEl = document.getElementById('year');
  
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  // Check if user is logged in
  const token = localStorage.getItem('authToken');
  if (!token) {
    showError();
    return;
  }

  // Fetch user profile
  async function loadProfile() {
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        displayProfile(data.data);
      } else {
        console.error('Failed to load profile:', data.message);
        showError();
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      showError();
    }
  }

  function displayProfile(user) {
    loadingState.style.display = 'none';
    dashboardContent.style.display = 'block';

    document.getElementById('userName').textContent = user.full_name || 'User';
    document.getElementById('userEmail').textContent = user.email || '-';
    document.getElementById('userRole').textContent = user.role || '-';
    
    if (user.created_at) {
      const date = new Date(user.created_at);
      document.getElementById('userCreated').textContent = date.toLocaleDateString();
    }

    const interests = user.interests && user.interests.length > 0 
      ? user.interests.join(', ') 
      : 'None selected';
    document.getElementById('userInterests').textContent = interests;

    // Show verification banner if email not verified
    if (!user.email_verified) {
      document.getElementById('verificationBanner').style.display = 'block';
    }
  }

  function showError() {
    loadingState.style.display = 'none';
    dashboardContent.style.display = 'none';
    errorState.style.display = 'block';
  }

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
  });

  // Resend verification email
  const resendBtn = document.getElementById('resendVerificationBtn');
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      resendBtn.disabled = true;
      resendBtn.textContent = 'Sending...';

      try {
        const userEmail = document.getElementById('userEmail').textContent;
        const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();
        alert(data.message);
      } catch (error) {
        alert('Failed to resend verification email');
      } finally {
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend verification email';
      }
    });
  }

  // Load profile on page load
  loadProfile();
})();
