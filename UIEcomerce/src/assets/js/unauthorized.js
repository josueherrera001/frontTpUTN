  document.addEventListener('DOMContentLoaded', function() {
            const lockIcon = document.querySelector('.shake');
            setTimeout(() => {
                lockIcon.classList.remove('shake');
            }, 1000);
        });
