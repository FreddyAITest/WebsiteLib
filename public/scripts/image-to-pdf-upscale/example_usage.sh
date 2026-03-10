#!/bin/bash
# Example usage script for Image to PDF Upscaler

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "======================================"
echo "Image to PDF Upscaler - Examples"
echo "======================================"
echo ""

# Create example directories
echo "1. Creating example directories..."
mkdir -p input output temp

# Check if there are any images in input
if [ ! "$(ls -A input/*.jpg input/*.png input/*.jpeg input/*.tiff input/*.webp 2>/dev/null)" ]; then
    echo "   No images found in input/ folder"
    echo "   Please add images to the input/ folder and run again"
    echo ""
    echo "   Example: cp /path/to/your/images/*.jpg input/"
else
    echo "   Found images in input/ folder"
fi

echo ""
echo "2. Basic usage (PIL upscaling)..."
echo "   python image_to_pdf_upscale.py --input ./input --output ./output"
echo ""

echo "3. With AI upscaling (if installed)..."
echo "   python image_to_pdf_upscale.py --input ./input --output ./output --no-resume"
echo ""

echo "4. With Photoshop (Windows only)..."
echo "   python image_to_pdf_upscale.py --photoshop --input ./input --output ./output"
echo ""

echo "5. Watch mode (auto-process new images)..."
echo "   python image_to_pdf_upscale.py --watch --watch-interval 10"
echo ""

echo "6. Upload to Netlify (configure config.json first)..."
echo "   python image_to_pdf_upscale.py --upload-method netlify"
echo ""

echo "======================================"
echo "Quick Start:"
echo "======================================"
echo ""
echo "Step 1: Add images to input/ folder"
echo "Step 2: Run: python image_to_pdf_upscale.py"
echo "Step 3: Check output/ folder for PDFs"
echo ""
echo "For more options, run: python image_to_pdf_upscale.py --help"
echo ""
