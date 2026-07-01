const API_URL = 'https://project-financial-wallet-backend.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('button');
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const forgotPasswordLink = document.querySelector('a[href*="forgot"]');

    // 1. Create a dynamic verification popup layer for Two-Factor Code entry
    const create2FAPopup = () => {
        const overlay = document.createElement('div');
        overlay.id = 'two-factor-overlay';
        overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:10000; font-family:sans-serif;';
        
        overlay.innerHTML = `
            <div style="background:#1a1f2c; padding:30px; border-radius:12px; width:90%; max-width:400px; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,0.5); border:1px solid #2e374a; color:#ffffff;">
                <h3 style="margin-top:0; margin-bottom:10px; font-size:22px;">Two-Factor Verification</h3>
                <p style="color:#a0aec0; font-size:14px; margin-bottom:20px;">An authentication verification code has been simulated. Please enter your 6-digit access code below:</p>
                <input type="text" id="two-factor-code" placeholder="Enter 6-digit code" maxlength="6" style="width:100%; padding:12px; margin-bottom:20px; border-radius:6px; border:1px solid #2e374a; background:#0f131a; color:#ffffff; font-size:16px; text-align:center; letter-spacing:4px;">
                <button id="verify-2fa-btn" style="width:100%; padding:12px; background:#3182ce; color:#ffffff; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:16px;">VERIFY & ENTER</button>
                <button id="cancel-2fa-btn" style="width:100%; padding:10px; background:transparent; color:#e53e3e; border:none; margin-top:10px; cursor:pointer; font-size:14px;">Cancel</button>
            </div>
        `;
        document.body.appendChild(overlay);
        setup2FAVerificationListeners();
    };

    // 2. Handle Login Submission
    if (loginButton) {
        loginButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            if (!username || !password) {
                alert('Please fill in both Username and Password fields ⚠️');
                return;
            }

            try {
                loginButton.innerText = 'Verifying credentials... ⏳';
                loginButton.disabled = true;

                // Call backend authentication route
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('wallet_token', data.token);
                    create2FAPopup(); // Trigger code overlay block
                } else {
                    alert(`Login Error: ${data.message || 'Invalid username or password credentials.'} ❌`);
                }
            } catch (error) {
                console.error('Server Error:', error);
                alert('Could not establish connection to your Render server backend. 🌐');
            } finally {
                loginButton.innerText = 'LOG IN';
                loginButton.disabled = false;
            }
        });
    }

    // 3. Handle 2FA Verification
    const setup2FAVerificationListeners = () => {
        const verifyBtn = document.getElementById('verify-2fa-btn');
        const cancelBtn = document.getElementById('cancel-2fa-btn');
        const codeInput = document.getElementById('two-factor-code');

        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                const enteredCode = codeInput ? codeInput.value.trim() : '';
                if (enteredCode.length !== 6) {
                    alert('Please enter a valid 6-digit verification code 🔢');
                    return;
                }
                alert('Verification Complete! Welcome back to your dashboard. ✅');
                document.getElementById('two-factor-overlay').remove();
                window.location.href = 'dashboard.html'; // Sends you straight to your project interface layout
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.getElementById('two-factor-overlay').remove();
            });
        }
    };

    // 4. Handle Forgot Password Click
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Password recovery processing initiated. An administrative reset verification link will be forwarded shortly. 📩');
        });
    }
});
