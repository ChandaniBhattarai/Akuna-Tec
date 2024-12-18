function validateEmail() {
    const emailInput = document.getElementById('email');
    const invalidFeedback = document.querySelector('.invalid-feedback');
    
    // Regular expression for basic email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!emailPattern.test(emailInput.value)) {
      // Show invalid feedback and turn the border red
      invalidFeedback.style.display = 'block';
      emailInput.style.borderColor = 'red';
    } else {
      // Hide invalid feedback and reset the border color
      invalidFeedback.style.display = 'none';
      emailInput.style.borderColor = '';
    }
  }
  