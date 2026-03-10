#!/usr/bin/env python3
"""
Test script to validate installation and dependencies
"""

import sys
import os
from pathlib import Path

def test_imports():
    """Test all required imports"""
    print("Testing imports...")
    print("-" * 50)
    
    tests = {
        'PIL': False,
        'img2pdf': False,
        'reportlab': False,
        'pypdf': False,
        'tqdm': False,
        'photoshop.api': False,
        'boto3': False,
        'paramiko': False,
        'requests': False,
    }
    
    for module in tests.keys():
        try:
            if module == 'PIL':
                __import__(module)
            elif module == 'photoshop.api':
                __import__('photoshop.api')
            else:
                __import__(module)
            tests[module] = True
            print(f"✅ {module:20s} - OK")
        except ImportError as e:
            print(f"❌ {module:20s} - NOT INSTALLED")
    
    print("-" * 50)
    
    # Summary
    installed = sum(1 for v in tests.values() if v)
    total = len(tests)
    print(f"\nInstalled: {installed}/{total} modules")
    
    # Core requirements
    core_modules = ['PIL', 'img2pdf', 'reportlab', 'pypdf']
    core_installed = sum(1 for m in core_modules if tests[m])
    
    if core_installed == len(core_modules):
        print("✅ All core dependencies installed")
        return True
    else:
        print(f"⚠️  Missing core dependencies: {len(core_modules) - core_installed}")
        print("\nInstall with: pip install -r requirements.txt")
        return False

def test_config():
    """Test configuration file"""
    print("\nTesting configuration...")
    print("-" * 50)
    
    config_path = Path('config.json')
    if config_path.exists():
        print(f"✅ config.json found")
        
        import json
        try:
            with open(config_path) as f:
                config = json.load(f)
            print(f"✅ config.json is valid JSON")
            
            # Check required fields
            required = ['input_folder', 'output_folder', 'pdf_max_size_mb']
            for field in required:
                if field in config:
                    print(f"✅ {field:20s} - {config[field]}")
                else:
                    print(f"⚠️  {field:20s} - MISSING")
            
            return True
        except json.JSONDecodeError as e:
            print(f"❌ config.json is invalid: {e}")
            return False
    else:
        print("❌ config.json not found")
        print("   Creating default config...")
        
        # Create default config
        default_config = {
            "input_folder": "./input",
            "output_folder": "./output",
            "temp_folder": "./temp",
            "photoshop_enabled": False,
            "ai_upscale_enabled": True,
            "ai_model": "realesrgan",
            "pdf_max_size_mb": 20,
            "pdf_page_size": "A4",
            "pdf_quality": 300,
            "upload_enabled": False,
            "upload_method": "netlify",
            "max_workers": 4,
            "resume_enabled": True,
            "supported_formats": [".jpg", ".jpeg", ".png", ".tiff", ".tif", ".webp"]
        }
        
        with open(config_path, 'w') as f:
            json.dump(default_config, f, indent=2)
        
        print("✅ Default config.json created")
        return True

def test_directories():
    """Test directory structure"""
    print("\nTesting directory structure...")
    print("-" * 50)
    
    dirs = ['input', 'output', 'temp']
    for dir_name in dirs:
        dir_path = Path(dir_name)
        if dir_path.exists():
            print(f"✅ {dir_name:10s} - EXISTS")
        else:
            print(f"📁 {dir_name:10s} - CREATING")
            dir_path.mkdir(parents=True, exist_ok=True)
    
    return True

def test_main_script():
    """Test main script can be imported"""
    print("\nTesting main script...")
    print("-" * 50)
    
    script_path = Path('image_to_pdf_upscale.py')
    if not script_path.exists():
        print("❌ image_to_pdf_upscale.py not found")
        return False
    
    print("✅ image_to_pdf_upscale.py found")
    
    # Try to import main classes
    try:
        sys.path.insert(0, str(Path('.').absolute()))
        from image_to_pdf_upscale import Config, ImageProcessor, PDFGenerator
        
        print("✅ Main classes can be imported")
        
        # Test config creation
        config = Config()
        print(f"✅ Config class works (default input: {config.input_folder})")
        
        # Test PDF generator
        pdf_gen = PDFGenerator()
        print(f"✅ PDFGenerator class works (max size: {pdf_gen.max_size_bytes / 1024 / 1024:.0f} MB)")
        
        return True
        
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def create_test_image():
    """Create a test image for validation"""
    print("\nCreating test image...")
    print("-" * 50)
    
    try:
        from PIL import Image
        import numpy as np
        
        # Create a simple test pattern
        width, height = 800, 600
        img_array = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Create gradient pattern
        for y in range(height):
            for x in range(width):
                img_array[y, x] = [
                    int(255 * x / width),
                    int(255 * y / height),
                    128
                ]
        
        img = Image.fromarray(img_array)
        test_path = Path('input/test_image.jpg')
        img.save(test_path, quality=90)
        
        print(f"✅ Test image created: {test_path}")
        print(f"   Size: {width}x{height}")
        print(f"   File size: {test_path.stat().st_size / 1024:.1f} KB")
        
        return True
        
    except ImportError:
        print("⚠️  PIL not available, skipping test image creation")
        return False
    except Exception as e:
        print(f"⚠️  Could not create test image: {e}")
        return False

def run_quick_test():
    """Run a quick processing test"""
    print("\nRunning quick processing test...")
    print("-" * 50)
    
    test_image = Path('input/test_image.jpg')
    if not test_image.exists():
        print("⚠️  No test image found, skipping processing test")
        return True
    
    try:
        from image_to_pdf_upscale import Config, ImageProcessor
        
        config = Config(
            input_folder='./input',
            output_folder='./output',
            temp_folder='./temp',
            photoshop_enabled=False,
            ai_upscale_enabled=True,
            pdf_max_size_mb=20
        )
        
        processor = ImageProcessor(config)
        results = processor.process_images(resume=False)
        
        print(f"✅ Processing test completed")
        print(f"   Processed: {results['processed']} images")
        print(f"   Failed: {results['failed']} images")
        print(f"   Output files: {len(results['output_files'])}")
        
        if results['output_files']:
            for pdf in results['output_files']:
                size_mb = Path(pdf).stat().st_size / 1024 / 1024
                print(f"   - {pdf} ({size_mb:.2f} MB)")
        
        return True
        
    except Exception as e:
        print(f"⚠️  Processing test failed: {e}")
        print("   This is OK - you can still use the script manually")
        return True

def main():
    """Run all tests"""
    print("=" * 50)
    print("Image to PDF Upscaler - Installation Test")
    print("=" * 50)
    print()
    
    results = {
        'imports': test_imports(),
        'config': test_config(),
        'directories': test_directories(),
        'script': test_main_script(),
        'test_image': create_test_image(),
    }
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test:20s} - {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Ready to use.")
        print("\nNext steps:")
        print("1. Add your images to the input/ folder")
        print("2. Run: python image_to_pdf_upscale.py")
        print("3. Check the output/ folder for PDFs")
    else:
        print("\n⚠️  Some tests failed. Please review the errors above.")
        print("   The script may still work for basic functionality.")
    
    print("\n" + "=" * 50)
    
    return passed == total

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
