// Script to generate a favicon programmatically
function generateFavicon() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple icon representing IT audit
    // Background
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, 32, 32);
    
    // Draw a checkmark to represent auditing/checking
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 16);
    ctx.lineTo(14, 22);
    ctx.lineTo(24, 10);
    ctx.stroke();
    
    // Convert to data URL
    const dataURL = canvas.toDataURL('image/png');
    
    // Create a download link
    const link = document.createElement('a');
    link.download = 'favicon.ico';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Alternative approach: Generate favicon as base64 in HTML
function getFaviconDataUrl() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple icon representing IT audit
    // Background
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, 32, 32);
    
    // Draw a checkmark to represent auditing/checking
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 16);
    ctx.lineTo(14, 22);
    ctx.lineTo(24, 10);
    ctx.stroke();
    
    return canvas.toDataURL('image/png');
}