#!/usr/bin/env python3
"""
Script to create a favicon for the IT audit website
"""
from PIL import Image, ImageDraw, ImageFont

def create_favicon():
    # Create a new image with white background
    img = Image.new('RGB', (32, 32), color='white')
    d = ImageDraw.Draw(img)
    
    # Draw a simple icon representing IT audit
    # Draw a rounded rectangle to represent a document/checklist
    d.rounded_rectangle([(4, 4), (28, 28)], radius=4, fill='white', outline='black', width=2)
    
    # Draw a checkmark inside
    d.line([(10, 16), (14, 20), (22, 12)], fill='green', width=3)
    
    # Save as ICO file
    img.save('favicon.ico', format='ICO', sizes=[(32, 32)])
    
    # Also save a PNG version for broader compatibility
    img.save('favicon.png', format='PNG')
    
    print("Favicon files created: favicon.ico and favicon.png")

if __name__ == "__main__":
    try:
        create_favicon()
    except ImportError:
        print("Pillow library not found. Installing...")
        import subprocess
        subprocess.run(["pip3", "install", "Pillow"])
        
        # Re-import and run
        from PIL import Image, ImageDraw
        create_favicon()