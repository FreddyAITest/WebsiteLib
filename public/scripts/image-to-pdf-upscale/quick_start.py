#!/usr/bin/env python3
"""
Quick Start Guide - Interactive setup and first run
"""

import os
import sys
import json
from pathlib import Path

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def print_step(num, text):
    print(f"\n[Step {num}] {text}")
    print("-" * 60)

def check_dependencies():
    """Check if all dependencies are installed"""
    print_step(1, "Checking Dependencies")
    
    missing = []
    try:
        from PIL import Image
        print("✅ Pillow installed")
    except ImportError:
        missing.append("Pillow")
        print("❌ Pillow NOT installed")
    
    try:
        import img2pdf
        print("✅ img2pdf installed")
    except ImportError:
        missing.append("img2pdf")
        print("❌ img2pdf NOT installed")
    
    try:
        import reportlab
        print("✅ reportlab installed")
    except ImportError:
        missing.append("reportlab")
        print("❌ reportlab NOT installed")
    
    try:
        import pypdf
        print("✅ pypdf installed")
    except ImportError:
        missing.append("pypdf")
        print("❌ pypdf NOT installed")
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    print("\n✅ All dependencies installed!")
    return True

def setup_directories():
    """Create necessary directories"""
    print_step(2, "Setting Up Directories")
    
    dirs = ['input', 'output', 'temp']
    for dir_name in dirs:
        dir_path = Path(dir_name)
        if dir_path.exists():
            print(f"✅ {dir_name}/ exists")
        else:
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"📁 Created {dir_name}/")
    
    return True

def configure():
    """Guide through configuration"""
    print_step(3, "Configuration")
    
    config_path = Path('config.json')
    
    if config_path.exists():
        print("✅ config.json exists")
        
        with open(config_path) as f:
            config = json.load(f)
        
        print(f"   Input folder:  {config.get('input_folder', './input')}")
        print(f"   Output folder: {config.get('output_folder', './output')}")
        print(f"   Max PDF size:  {config.get('pdf_max_size_mb', 20)} MB")
        print(f"   AI upscaling:  {'Enabled' if config.get('ai_upscale_enabled') else 'Disabled'}")
        
        modify = input("\nWould you like to modify the configuration? (y/n): ").strip().lower()
        if modify == 'y':
            return create_config()
    else:
        print("config.json not found, creating default...")
        return create_config()
    
    return True

def create_config():
    """Create new configuration"""
    print("\nEnter configuration values (press Enter for defaults):")
    
    config = {
        'input_folder': input("Input folder [./input]: ").strip() or './input',
        'output_folder': input("Output folder [./output]: ").strip() or './output',
        'temp_folder': './temp',
        'photoshop_enabled': False,
        'ai_upscale_enabled': True,
        'ai_model': 'realesrgan',
        'pdf_max_size_mb': int(input("Max PDF size in MB [20]: ").strip() or '20'),
        'pdf_page_size': input("Page size (A4/letter/legal) [A4]: ").strip() or 'A4',
        'pdf_quality': 300,
        'upload_enabled': False,
        'max_workers': 4,
        'resume_enabled': True,
        'supported_formats': ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp']
    }
    
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ Configuration saved to config.json")
    return True

def check_images():
    """Check for images in input folder"""
    print_step(4, "Checking for Images")
    
    input_dir = Path('input')
    if not input_dir.exists():
        print("⚠️  Input folder doesn't exist")
        return False
    
    images = list(input_dir.glob('*.jpg')) + \
             list(input_dir.glob('*.jpeg')) + \
             list(input_dir.glob('*.png')) + \
             list(input_dir.glob('*.tiff')) + \
             list(input_dir.glob('*.webp'))
    
    if images:
        print(f"✅ Found {len(images)} image(s) in input/")
        for img in images[:5]:
            size_kb = img.stat().st_size / 1024
            print(f"   - {img.name} ({size_kb:.1f} KB)")
        if len(images) > 5:
            print(f"   ... and {len(images) - 5} more")
        return True
    else:
        print("⚠️  No images found in input/")
        print("\nPlease add images to the input/ folder:")
        print("  cp /path/to/your/images/*.jpg input/")
        print("\nOr create a test image with: python test_installation.py")
        return False

def run_processing():
    """Run the processing"""
    print_step(5, "Processing Images")
    
    print("\nStarting image processing...")
    print("(This may take a moment)\n")
    
    # Import and run processor
    sys.path.insert(0, str(Path('.').absolute()))
    from image_to_pdf_upscale import Config, ImageProcessor
    
    config = Config.from_file('config.json')
    processor = ImageProcessor(config)
    
    results = processor.process_images(resume=False)
    
    print("\n" + "=" * 60)
    print("PROCESSING COMPLETE")
    print("=" * 60)
    print(f"✅ Processed: {results['processed']} images")
    print(f"❌ Failed:    {results['failed']} images")
    print(f"📄 PDFs created: {len(results['output_files'])}")
    
    if results['output_files']:
        print("\nOutput files:")
        for pdf in results['output_files']:
            size_mb = Path(pdf).stat().st_size / 1024 / 1024
            print(f"  📄 {pdf} ({size_mb:.2f} MB)")
    
    print("\n" + "=" * 60)
    return True

def show_next_steps():
    """Show next steps and tips"""
    print_header("Next Steps & Tips")
    
    print("""
✅ You're all set! Here's what you can do now:

1. PROCESS MORE IMAGES:
   python image_to_pdf_upscale.py

2. WATCH FOLDER FOR NEW IMAGES:
   python image_to_pdf_upscale.py --watch

3. UPLOAD TO NETLIFY:
   - Edit config.json and add your Netlify credentials
   - Set "upload_enabled": true
   - Run: python image_to_pdf_upscale.py --upload-method netlify

4. USE PHOTOSHOP (Windows only):
   - Install Photoshop CC 2020 or later
   - Set "photoshop_enabled": true in config.json
   - Run: python image_to_pdf_upscale.py --photoshop

5. AI UPSCALING (GPU recommended):
   pip install realesrgan basicsr torch torchvision
   Then run: python image_to_pdf_upscale.py

📚 For more options:
   python image_to_pdf_upscale.py --help

📖 Full documentation: README.md

""")

def main():
    """Main quick start routine"""
    print_header("Image to PDF Upscaler - Quick Start")
    
    print("""
This wizard will help you set up and run your first conversion.

""")
    
    # Run setup steps
    steps = [
        check_dependencies,
        setup_directories,
        configure,
        check_images,
    ]
    
    for step in steps:
        if not step():
            if step == check_images:
                print("\n⚠️  Skipping processing - no images found")
                show_next_steps()
                return
            else:
                print("\n❌ Setup failed. Please fix the issues above and run again.")
                return
    
    # Ask if user wants to process
    print_step(5, "Ready to Process")
    run = input("\nWould you like to process the images now? (y/n): ").strip().lower()
    
    if run == 'y':
        run_processing()
    else:
        print("\nNo problem! Run this command when you're ready:")
        print("  python image_to_pdf_upscale.py")
    
    show_next_steps()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nPlease check the error message above and try again.")
        sys.exit(1)
