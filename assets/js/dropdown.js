// Get the user profile elements
const mobileProfileElement = document.querySelector('.user-profile.mobile-view');
const webProfileElement = document.querySelector('.user-profile.web-view');

// Handle dropdown menu for both views
function toggleDropdown(profileElement, arrowElement) {
  const dropdownMenu = profileElement.querySelector('.dropdown-menu');

  profileElement.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');

    // Rotate arrow for web view only
    if (arrowElement) {
      arrowElement.style.transform = dropdownMenu.classList.contains('show')
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
    }
  });
}

// Mobile view logic
if (mobileProfileElement) {
  toggleDropdown(mobileProfileElement, null); // No arrow in mobile view
}

// Web view logic
if (webProfileElement) {
  const downArrowElement = webProfileElement.querySelector('.down-arrow');
  toggleDropdown(webProfileElement, downArrowElement); // Includes arrow rotation
}

// Add click event listeners to dropdown menu links
document.querySelectorAll('.dropdown-menu a').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    const targetPage = event.target.getAttribute('href');
    window.location.href = targetPage; // Navigate to the target page
  });
});