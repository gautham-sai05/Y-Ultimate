// ========================================
// REGISTRATION PAGE JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Registration page loaded successfully!');
    
    const registrationForm = document.getElementById('registrationForm');
    
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted! Starting registration...');
        
        // Get form values
        const fullName = document.getElementById('fullName').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const userRole = document.getElementById('userRole').value;
        
        console.log('User entered:');
        console.log('Name:', fullName);
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Role:', userRole);
        
        // VALIDATION
        
        // Check all fields filled
        if (!fullName || !username || !email || !password || !confirmPassword || !userRole) {
            alert('⚠️ Please fill in all fields!');
            return;
        }
        
        // Check email format
        if (!email.includes('@')) {
            alert('⚠️ Please enter a valid email address!');
            return;
        }
        
        // Check passwords match
        if (password !== confirmPassword) {
            alert('⚠️ Passwords do not match!');
            return;
        }
        
        // Check password length
        if (password.length < 6) {
            alert('⚠️ Password must be at least 6 characters!');
            return;
        }
        
        // Check username length
        if (username.length < 3) {
            alert('⚠️ Username must be at least 3 characters!');
            return;
        }
        
        console.log('✅ All validation passed!');
        
        // Show loading state
        const submitBtn = document.querySelector('.btn-signin');
        const originalButtonText = submitBtn.textContent;
        
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        
        // Prepare data for backend
        const registrationData = {
            fullName: fullName,
            username: username,
            email: email,
            password: password,
            role: userRole
        };
        
        console.log('📦 Data prepared for backend:', registrationData);
        
        // SIMULATE BACKEND RESPONSE (TEST MODE)
        console.log('🧪 TEST MODE: Simulating backend response...');
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fake success response
        const data = {
            success: true,
            message: 'Account created successfully!',
            userId: 'user-' + Date.now()
        };
        
        console.log('📄 Simulated backend response:', data);
        
        // Handle success
        if (data.success) {
            console.log('✅ Registration successful!');
            
            alert('✅ Account created successfully! Please login.');
            
            // Redirect to login page
            window.location.href = 'login.html';
        } else {
            alert('❌ Registration failed: ' + data.message);
            
            // Reset button
            submitBtn.textContent = originalButtonText;
            submitBtn.disabled = false;
            submitBtn.style.cursor = 'pointer';
        }
        
    });
    
});
