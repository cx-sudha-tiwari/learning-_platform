(function(){
  const form = document.getElementById('registrationForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  const fields = {
    fullName: document.getElementById('fullName'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    role: document.getElementById('role'),
    terms: document.getElementById('terms')
  };

  const errors = {
    fullName: document.getElementById('fullNameError'),
    email: document.getElementById('emailError'),
    password: document.getElementById('passwordError'),
    confirmPassword: document.getElementById('confirmPasswordError'),
    role: document.getElementById('roleError'),
    terms: document.getElementById('termsError')
  };

  function setError(input, errorEl, message){
    if(!input || !errorEl) return;
    errorEl.textContent = message || '';
    if(message){ input.classList.add('input-error'); }
    else { input.classList.remove('input-error'); }
  }

  function emailValid(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function passwordStrong(value){
    // at least 8 chars, 1 letter, 1 number
    const lengthOK = value.length >= 8;
    const letterOK = /[A-Za-z]/.test(value);
    const numberOK = /\d/.test(value);
    return lengthOK && letterOK && numberOK;
  }

  function validateField(name){
    switch(name){
      case 'fullName':{
        const v = fields.fullName.value.trim();
        setError(fields.fullName, errors.fullName, v ? '' : 'Full name is required');
        return !!v;
      }
      case 'email':{
        const v = fields.email.value.trim();
        if(!v) { setError(fields.email, errors.email, 'Email is required'); return false; }
        if(!emailValid(v)) { setError(fields.email, errors.email, 'Enter a valid email'); return false; }
        setError(fields.email, errors.email, '');
        return true;
      }
      case 'password':{
        const v = fields.password.value;
        if(!v) { setError(fields.password, errors.password, 'Password is required'); return false; }
        if(!passwordStrong(v)) { setError(fields.password, errors.password, 'Min 8 chars with letters and numbers'); return false; }
        setError(fields.password, errors.password, '');
        // also re-validate confirm if user changed password
        validateField('confirmPassword');
        return true;
      }
      case 'confirmPassword':{
        const v = fields.confirmPassword.value;
        if(!v) { setError(fields.confirmPassword, errors.confirmPassword, 'Please confirm your password'); return false; }
        if(v !== fields.password.value) { setError(fields.confirmPassword, errors.confirmPassword, 'Passwords do not match'); return false; }
        setError(fields.confirmPassword, errors.confirmPassword, '');
        return true;
      }
      case 'role':{
        const v = fields.role.value;
        setError(fields.role, errors.role, v ? '' : 'Please select a role');
        return !!v;
      }
      case 'terms':{
        const checked = fields.terms.checked;
        // For checkbox, we highlight label message only
        errors.terms.textContent = checked ? '' : 'You must agree to continue';
        return checked;
      }
      default:
        return true;
    }
  }

  // Attach listeners
  Object.keys(fields).forEach(name => {
    const el = fields[name];
    if(!el) return;
    const evt = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
    el.addEventListener(evt, () => validateField(name));
    el.addEventListener('blur', () => validateField(name));
  });

  function validateAll(){
    const names = Object.keys(fields);
    const results = names.map(validateField);
    return results.every(Boolean);
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const ok = validateAll();
    if(!ok){
      statusEl.textContent = 'Please fix the highlighted fields.';
      statusEl.classList.add('error-message');
      return;
    }

    // Disable button during API call
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account…';

    const payload = {
      fullName: fields.fullName.value.trim(),
      email: fields.email.value.trim(),
      password: fields.password.value,
      role: fields.role.value,
      interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(i => i.value)
    };

    try {
      // Call backend API
      const API_URL = 'http://localhost:3000/api/auth/register';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        statusEl.textContent = data.message || 'Registration successful! Redirecting to dashboard...';
        statusEl.classList.add('success-message');
        
        // Store token for auto-login after registration
        if (data.data && data.data.token) {
          localStorage.setItem('authToken', data.data.token);
          console.log('User registered:', data.data.user);
        }
        
        form.reset();
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
      } else {
        // Handle validation or server errors
        let errorMsg = data.message || 'Registration failed. Please try again.';
        
        if (data.errors && Array.isArray(data.errors)) {
          errorMsg = data.errors.map(err => err.message).join(', ');
        }
        
        statusEl.textContent = errorMsg;
        statusEl.classList.add('error-message');
      }
    } catch (error) {
      console.error('Registration error:', error);
      statusEl.textContent = 'Network error. Please check if the server is running and try again.';
      statusEl.classList.add('error-message');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create account';
    }
  });
})();
