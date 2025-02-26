// Function to update server time
function updateServerTime() {
    const serverTimeElement = document.getElementById('server-time');
    if (serverTimeElement) {
        const now = new Date();
        serverTimeElement.textContent = now.toLocaleString();
    }
}

// Function to check if content is being served via CDN
function checkCdnStatus() {
    const cdnStatusElement = document.getElementById('cdn-status');
    if (!cdnStatusElement) return;

    // Get server information from response headers
    fetch(window.location.href)
        .then(response => {
            // Check for Akamai-specific headers
            const serverHeader = response.headers.get('server');
            const xCacheHeader = response.headers.get('x-cache');
            const akamaiGhostHeader = response.headers.get('x-akamai-transformed');
            
            if (serverHeader && serverHeader.includes('Akamai') || 
                xCacheHeader || 
                akamaiGhostHeader) {
                cdnStatusElement.textContent = 'Content served via Akamai CDN';
                cdnStatusElement.style.color = '#2ecc71'; // Green color
            } else {
                cdnStatusElement.textContent = 'Content served directly from origin';
                cdnStatusElement.style.color = '#e74c3c'; // Red color
            }
        })
        .catch(error => {
            cdnStatusElement.textContent = 'Unable to determine CDN status';
            cdnStatusElement.style.color = '#f39c12'; // Orange color
            console.error('Error checking CDN status:', error);
        });
}

// Function to add image loading time information
function addImageLoadingInfo() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
        // Create container for loading information
        const infoDiv = document.createElement('div');
        infoDiv.className = 'image-load-info';
        infoDiv.style.fontSize = '12px';
        infoDiv.style.fontStyle = 'italic';
        infoDiv.style.color = '#7f8c8d';
        infoDiv.textContent = 'Loading...';
        
        // Insert the info div after the image
        if (img.nextSibling) {
            img.parentNode.insertBefore(infoDiv, img.nextSibling);
        } else {
            img.parentNode.appendChild(infoDiv);
        }
        
        // Record when image starts loading
        const startTime = performance.now();
        
        // When image loads, calculate and display the load time
        img.addEventListener('load', () => {
            const endTime = performance.now();
            const loadTime = (endTime - startTime).toFixed(2);
            infoDiv.textContent = `Load time: ${loadTime}ms`;
        });
        
        // Handle image loading errors
        img.addEventListener('error', () => {
            infoDiv.textContent = 'Error loading image';
            infoDiv.style.color = '#e74c3c';
        });
    });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update the server time immediately and then every second
    updateServerTime();
    setInterval(updateServerTime, 1000);
    
    // Check CDN status
    checkCdnStatus();
    
    // Add loading time information to images on the gallery page
    if (window.location.href.includes('images.html')) {
        addImageLoadingInfo();
    }
});
