// ========================================
// SECTION 1: WAIT FOR PAGE TO LOAD
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded successfully!');
    
    // ========================================
    // SECTION 2: GET THE FORM ELEMENT
    // ========================================
    const loginForm = document.getElementById('loginForm');
    
    // ========================================
    // SECTION 3: LISTEN FOR FORM SUBMISSION
    // ========================================
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted! Starting login process...');
        
        // ========================================
        // SECTION 4: GET USER INPUT VALUES
        // ========================================
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userRole = document.getElementById('userRole').value;
        
        console.log('User entered:');
        console.log('Email:', email);
        console.log('Role:', userRole);
        
        // ========================================
        // SECTION 5: VALIDATE INPUT
        // ========================================
        if (!email || !password || !userRole) {
            alert('⚠️ Please fill in all fields!');
            return;
        }
        
        if (!email.includes('@')) {
            alert('⚠️ Please enter a valid email address!');
            return;
        }
        
        console.log('✅ Validation passed!');
        
        // ========================================
        // SECTION 6: SHOW LOADING STATE
        // ========================================
        const submitBtn = document.querySelector('.btn-signin');
        const originalButtonText = submitBtn.textContent;
        
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        
        console.log('🔄 Loading state activated');
        
        // ========================================
        // SECTION 7: PREPARE DATA FOR BACKEND
        // ========================================
        const loginData = {
            email: email,
            password: password,
            role: userRole
        };
        
        console.log('📦 Data prepared for backend:', loginData);
        
        // ========================================
        // SECTION 8: SIMULATE BACKEND RESPONSE (TESTING MODE)
        // ========================================
        // Remove this entire section when backend is ready!
        
        console.log('🧪 TEST MODE: Simulating backend response...');
        
        // Simulate network delay (1 second)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fake backend response
        const data = {
            success: true,
            token: 'fake-token-12345',
            role: userRole,
            name: 'Test User',
            message: 'Login successful (test mode)'
        };
        
        console.log('📄 Simulated backend response:', data);
        
        // ========================================
        // SECTION 9: HANDLE SUCCESS
        // ========================================
        if (data.success) {
            console.log('✅ Login successful!');
            
            // Save user data
            // STEP 10.1: Save User Data Locally
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userEmail', email);       
            localStorage.setItem('userName', data.name || 'User');
            localStorage.setItem('username', data.username || email); // ADD THIS LINE!

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', data.name);
            
            console.log('💾 User data saved to localStorage');
            
            alert('✅ Login successful! Redirecting...');
            
            // Redirect based on role
            console.log('🔀 Redirecting based on role:', userRole);
            
            switch(userRole) {
                case 'admin':
                    window.location.href = 'tournament-dashboard.html';
                    break;
                case 'coach':
                    window.location.href = 'coach-dashboard.html';
                    break;
                case 'player':
                    window.location.href = 'match-schedule.html';
                    break;
                case 'parent':
                    window.location.href = 'parent-dashboard.html';
                    break;
                default:
                    window.location.href = 'index.html';
            }
        } else {
            console.log('❌ Login failed:', data.message);
            alert('❌ ' + data.message);
            
            // Reset button
            submitBtn.textContent = originalButtonText;
            submitBtn.disabled = false;
            submitBtn.style.cursor = 'pointer';
        }
        
    }); // End of submit event listener
    
}); // End of DOMContentLoaded

// ========================================
// SECTION 10: HELPER FUNCTIONS
// ========================================
function checkIfLoggedIn() {
    const token = localStorage.getItem('authToken');
    if (token) {
        console.log('User already logged in with token:', token);
    }
}

function clearLoginData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    console.log('Login data cleared');
}

checkIfLoggedIn();
