#!/usr/bin/env python3
"""
Image to PDF Upscaler with Upload Functionality

Automated image upscaling (Photoshop or AI fallback), PDF generation with smart splitting,
and upload to various hosting platforms.

Author: AI Insights
License: MIT
"""

import os
import sys
import json
import logging
import argparse
import hashlib
import threading
import queue
import time
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, asdict
from concurrent.futures import ThreadPoolExecutor, as_completed

# Third-party imports (check availability)
try:
    from PIL import Image
    import img2pdf
    from reportlab.lib.pagesizes import letter, A4, legal
    from reportlab.pdfgen import canvas
    from reportlab.lib.utils import ImageReader
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    # Define placeholders to avoid NameError
    A4 = (595, 842)
    letter = (612, 792)
    legal = (612, 1008)

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False

try:
    import photoshop.api as ps
    PHOTOSHOP_AVAILABLE = True
except ImportError:
    PHOTOSHOP_AVAILABLE = False

try:
    from tqdm import tqdm
    TQDM_AVAILABLE = True
except ImportError:
    TQDM_AVAILABLE = False

try:
    import boto3
    BOTO3_AVAILABLE = True
except ImportError:
    BOTO3_AVAILABLE = False

try:
    import paramiko
    PARAMIKO_AVAILABLE = True
except ImportError:
    PARAMIKO_AVAILABLE = False

try:
    import ftplib
    FTP_AVAILABLE = True
except ImportError:
    FTP_AVAILABLE = True  # ftplib is standard library

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('image_to_pdf_upscale.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


@dataclass
class Config:
    """Configuration data class"""
    input_folder: str = "./input"
    output_folder: str = "./output"
    temp_folder: str = "./temp"
    photoshop_enabled: bool = False
    photoshop_path: str = ""
    ai_upscale_enabled: bool = True
    ai_model: str = "realesrgan"  # realesrgan, waifu2x
    pdf_max_size_mb: int = 20
    pdf_page_size: str = "A4"  # A4, letter, legal
    pdf_quality: int = 300  # DPI
    upload_enabled: bool = False
    upload_method: str = "netlify"  # netlify, s3, ftp, sftp
    netlify_token: str = ""
    netlify_site_id: str = ""
    s3_bucket: str = ""
    s3_region: str = "us-east-1"
    s3_access_key: str = ""
    s3_secret_key: str = ""
    ftp_host: str = ""
    ftp_user: str = ""
    ftp_password: str = ""
    ftp_port: int = 21
    sftp_host: str = ""
    sftp_user: str = ""
    sftp_password: str = ""
    sftp_port: int = 22
    sftp_key_file: str = ""
    max_workers: int = 4
    resume_enabled: bool = True
    supported_formats: List[str] = None

    def __post_init__(self):
        if self.supported_formats is None:
            self.supported_formats = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp']

    @classmethod
    def from_file(cls, config_path: str) -> 'Config':
        """Load configuration from JSON file"""
        try:
            with open(config_path, 'r') as f:
                data = json.load(f)
            return cls(**data)
        except FileNotFoundError:
            logger.warning(f"Config file {config_path} not found, using defaults")
            return cls()
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in config file: {e}")
            return cls()

    def save(self, config_path: str):
        """Save configuration to JSON file"""
        with open(config_path, 'w') as f:
            json.dump(asdict(self), f, indent=2)
        logger.info(f"Configuration saved to {config_path}")


@dataclass
class JobState:
    """Persistent job state for resume capability"""
    processed_files: List[str] = None
    failed_files: List[str] = None
    output_files: List[str] = None
    last_checkpoint: str = ""
    total_images: int = 0
    processed_count: int = 0

    def __post_init__(self):
        if self.processed_files is None:
            self.processed_files = []
        if self.failed_files is None:
            self.failed_files = []
        if self.output_files is None:
            self.output_files = []

    def save(self, state_path: str):
        """Save job state to file"""
        self.last_checkpoint = datetime.now().isoformat()
        with open(state_path, 'w') as f:
            json.dump(asdict(self), f, indent=2)

    @classmethod
    def load(cls, state_path: str) -> Optional['JobState']:
        """Load job state from file"""
        try:
            with open(state_path, 'r') as f:
                data = json.load(f)
            return cls(**data)
        except (FileNotFoundError, json.JSONDecodeError):
            return None


class PhotoshopUpscaler:
    """Photoshop-based image upscaler using COM automation (Windows) or AppleScript (Mac)"""

    def __init__(self, photoshop_path: str = ""):
        self.photoshop_path = photoshop_path
        self.app = None

    def connect(self) -> bool:
        """Connect to Photoshop application"""
        if not PHOTOSHOP_AVAILABLE:
            logger.error("photoshop-python-api not installed")
            return False

        try:
            if sys.platform == 'win32':
                # Windows COM automation
                self.app = ps.Application()
                logger.info("Connected to Photoshop via COM")
            elif sys.platform == 'darwin':
                # macOS - would need AppleScript integration
                logger.warning("Photoshop automation on macOS requires AppleScript bridge")
                return False
            else:
                logger.error("Photoshop automation only supported on Windows")
                return False
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Photoshop: {e}")
            return False

    def upscale(self, input_path: str, output_path: str, scale_factor: float = 2.0) -> bool:
        """
        Upscale image using Photoshop's Preserve Details 2.0
        
        Args:
            input_path: Path to input image
            output_path: Path to save upscaled image
            scale_factor: Scaling factor (2.0 = 200%)
        
        Returns:
            True if successful, False otherwise
        """
        if not self.app:
            if not self.connect():
                return False

        try:
            # Open document
            doc = self.app.Open(input_path)
            
            # Get original dimensions
            orig_width = doc.Width
            orig_height = doc.Height
            
            # Calculate new dimensions
            new_width = orig_width * scale_factor
            new_height = orig_height * scale_factor
            
            # Resize with Preserve Details 2.0 (best quality)
            doc.ResizeImage(
                Width=new_width,
                Height=new_height,
                Resolution=doc.Resolution,
                Method=ps.ResampleMethod.ResamplePreserveDetails20
            )
            
            # Save as high-quality JPEG
            save_options = ps.JPEGSaveOptions()
            save_options.Quality = 12  # Maximum quality
            save_options.FormatOptions = ps.JPEGFormatOptions.StandardBaseline
            doc.SaveAs(output_path, save_options)
            doc.Close()
            
            logger.info(f"Upscaled {input_path} to {output_path} ({scale_factor}x)")
            return True
            
        except Exception as e:
            logger.error(f"Photoshop upscaling failed: {e}")
            return False

    def disconnect(self):
        """Disconnect from Photoshop"""
        if self.app:
            try:
                # Don't quit Photoshop, just release reference
                self.app = None
            except:
                pass


class AIUpscaler:
    """AI-based image upscaler using Real-ESRGAN or waifu2x as fallback"""

    def __init__(self, model: str = "realesrgan"):
        self.model = model
        self.upsampler = None
        self._initialize()

    def _initialize(self):
        """Initialize the AI upscaler model"""
        try:
            if self.model == "realesrgan":
                try:
                    from realesrgan import RealESRGANer
                    from basicsr.archs.rrdbnet_arch import RRDBNet
                    
                    # Initialize Real-ESRGAN model
                    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, 
                                   num_block=23, num_grow_ch=32, scale=4)
                    self.upsampler = RealESRGANer(
                        scale=4,
                        model_path='https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth',
                        model=model,
                        tile=0,  # Auto tile size
                        tile_pad=10,
                        pre_pad=0,
                        half=True,  # Use half precision for speed
                        device='cuda' if self._has_gpu() else 'cpu'
                    )
                    logger.info("Real-ESRGAN initialized successfully")
                except ImportError:
                    logger.warning("Real-ESRGAN not available, falling back to PIL")
                    self.upsampler = None
            elif self.model == "waifu2x":
                try:
                    import waifu2x
                    self.upsampler = waifu2x
                    logger.info("waifu2x initialized successfully")
                except ImportError:
                    logger.warning("waifu2x not available, falling back to PIL")
                    self.upsampler = None
        except Exception as e:
            logger.warning(f"AI upscaler initialization failed: {e}, using PIL fallback")
            self.upsampler = None

    def _has_gpu(self) -> bool:
        """Check if GPU is available"""
        try:
            import torch
            return torch.cuda.is_available()
        except:
            return False

    def upscale(self, input_path: str, output_path: str, scale_factor: int = 4) -> bool:
        """
        Upscale image using AI model or PIL fallback
        
        Args:
            input_path: Path to input image
            output_path: Path to save upscaled image
            scale_factor: Scaling factor (2, 4, etc.)
        
        Returns:
            True if successful, False otherwise
        """
        try:
            # Open image
            img = Image.open(input_path)
            
            if self.upsampler and self.model == "realesrgan":
                # Use Real-ESRGAN
                img_array = img.convert('RGB')
                upscaled, _ = self.upsampler.enhance(img_array, outscale=scale_factor)
                upscaled_img = Image.fromarray(upscaled)
                upscaled_img.save(output_path, quality=95)
                
            elif self.upsampler and self.model == "waifu2x":
                # Use waifu2x
                upscaled_img = self.upscaler.process(input_path, noise=2, scale=scale_factor)
                upscaled_img.save(output_path, quality=95)
                
            else:
                # PIL fallback - simple resize with LANCZOS
                logger.info("Using PIL fallback for upscaling")
                new_width = img.width * scale_factor
                new_height = img.height * scale_factor
                upscaled_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                upscaled_img.save(output_path, quality=95)
            
            logger.info(f"AI upscaled {input_path} to {output_path} ({scale_factor}x)")
            return True
            
        except Exception as e:
            logger.error(f"AI upscaling failed: {e}")
            return False


class PDFGenerator:
    """PDF generation with smart splitting"""

    def __init__(self, page_size: str = "A4", quality: int = 300, max_size_mb: int = 20):
        self.page_size = self._get_page_size(page_size)
        self.quality = quality
        self.max_size_bytes = max_size_mb * 1024 * 1024

    def _get_page_size(self, size_str: str) -> Tuple[int, int]:
        """Convert page size string to dimensions"""
        sizes = {
            'A4': A4,
            'letter': letter,
            'legal': legal
        }
        return sizes.get(size_str.lower(), A4)

    def create_pdf(self, image_paths: List[str], output_path: str) -> str:
        """
        Create PDF from images with automatic splitting if needed
        
        Args:
            image_paths: List of paths to images
            output_path: Base output path (will add _part1, _part2 if split)
        
        Returns:
            List of output PDF paths
        """
        if not image_paths:
            raise ValueError("No images provided")

        # Try to create single PDF first
        temp_pdf = output_path.replace('.pdf', '_temp.pdf')
        
        try:
            # Use img2pdf for better quality preservation
            with open(temp_pdf, 'wb') as f:
                f.write(img2pdf.convert(image_paths))
            
            # Check file size
            file_size = os.path.getsize(temp_pdf)
            
            if file_size <= self.max_size_bytes:
                # File is within size limit, just rename
                os.rename(temp_pdf, output_path)
                logger.info(f"Created PDF: {output_path} ({file_size / 1024 / 1024:.2f} MB)")
                return output_path
            else:
                # Need to split
                os.remove(temp_pdf)
                return self._split_pdf(image_paths, output_path)
                
        except Exception as e:
            logger.error(f"PDF creation failed: {e}")
            # Fallback to reportlab
            return self._create_pdf_reportlab(image_paths, output_path)

    def _split_pdf(self, image_paths: List[str], output_path: str) -> List[str]:
        """
        Split PDF into multiple volumes when size exceeds limit
        
        Strategy: Binary search to find optimal split points
        """
        logger.info(f"PDF exceeds size limit, splitting into volumes...")
        
        output_files = []
        base_name = output_path.replace('.pdf', '')
        
        # Estimate images per PDF (rough estimate based on file sizes)
        total_size = sum(os.path.getsize(p) for p in image_paths)
        estimated_images_per_pdf = max(1, len(image_paths) * self.max_size_bytes // total_size)
        
        current_images = []
        part_num = 1
        
        for i, img_path in enumerate(image_paths):
            current_images.append(img_path)
            
            # Check if we should split (conservative estimate)
            if len(current_images) >= estimated_images_per_pdf and i < len(image_paths) - 1:
                # Create PDF for current batch
                part_path = f"{base_name}_part{part_num}.pdf"
                self._create_single_pdf(current_images, part_path)
                
                # Check actual size and adjust if needed
                if os.path.getsize(part_path) > self.max_size_bytes:
                    # Need to split this batch further
                    os.remove(part_path)
                    self._binary_split(current_images, base_name, part_num, output_files)
                else:
                    output_files.append(part_path)
                    logger.info(f"Created {part_path}")
                
                current_images = []
                part_num += 1
        
        # Handle remaining images
        if current_images:
            part_path = f"{base_name}_part{part_num}.pdf"
            self._create_single_pdf(current_images, part_path)
            output_files.append(part_path)
            logger.info(f"Created {part_path}")
        
        return output_files

    def _binary_split(self, image_paths: List[str], base_name: str, 
                      start_part: int, output_files: List[str]):
        """Binary search split for oversized batches"""
        if len(image_paths) == 1:
            # Single image is too large, create anyway with warning
            part_path = f"{base_name}_part{start_part}.pdf"
            self._create_single_pdf(image_paths, part_path)
            output_files.append(part_path)
            logger.warning(f"Single image exceeds size limit: {image_paths[0]}")
            return
        
        mid = len(image_paths) // 2
        
        # Try first half
        first_part = f"{base_name}_part{start_part}.pdf"
        self._create_single_pdf(image_paths[:mid], first_part)
        
        if os.path.getsize(first_part) <= self.max_size_bytes:
            output_files.append(first_part)
            # Recursively handle second half
            self._binary_split(image_paths[mid:], base_name, start_part + 1, output_files)
        else:
            os.remove(first_part)
            # First half is still too big, split further
            self._binary_split(image_paths[:mid], base_name, start_part, output_files)
            # Then handle second half
            self._binary_split(image_paths[mid:], base_name, start_part + 1, output_files)

    def _create_single_pdf(self, image_paths: List[str], output_path: str):
        """Create a single PDF from images"""
        with open(output_path, 'wb') as f:
            f.write(img2pdf.convert(image_paths))

    def _create_pdf_reportlab(self, image_paths: List[str], output_path: str) -> str:
        """Fallback PDF creation using reportlab"""
        logger.info("Using reportlab fallback for PDF creation")
        
        c = canvas.Canvas(output_path, pagesize=self.page_size)
        page_width, page_height = self.page_size
        
        for img_path in image_paths:
            try:
                img = Image.open(img_path)
                img_ratio = img.width / img.height
                page_ratio = page_width / page_height
                
                # Calculate dimensions to fit page while maintaining aspect ratio
                if img_ratio > page_ratio:
                    # Image is wider than page
                    new_width = page_width * 0.95
                    new_height = new_width / img_ratio
                else:
                    # Image is taller than page
                    new_height = page_height * 0.95
                    new_width = new_height * img_ratio
                
                # Center on page
                x = (page_width - new_width) / 2
                y = (page_height - new_height) / 2
                
                c.drawImage(img_path, x, y, new_width, new_height)
                c.showPage()
                
            except Exception as e:
                logger.error(f"Failed to add image {img_path}: {e}")
        
        c.save()
        logger.info(f"Created PDF with reportlab: {output_path}")
        return output_path


class UploadManager:
    """Handle uploads to various hosting platforms"""

    def __init__(self, config: Config):
        self.config = config
        self.session = None

    def upload(self, file_paths: List[str], output_folder: str) -> List[Dict[str, str]]:
        """
        Upload files to configured platform
        
        Returns:
            List of dicts with 'local_path' and 'download_url'
        """
        if not self.config.upload_enabled:
            logger.info("Upload disabled, skipping")
            return [{'local_path': p, 'download_url': None} for p in file_paths]

        method = self.config.upload_method.lower()
        
        if method == 'netlify':
            return self._upload_netlify(file_paths, output_folder)
        elif method == 's3':
            return self._upload_s3(file_paths)
        elif method == 'ftp':
            return self._upload_ftp(file_paths)
        elif method == 'sftp':
            return self._upload_sftp(file_paths)
        else:
            logger.error(f"Unknown upload method: {method}")
            return [{'local_path': p, 'download_url': None} for p in file_paths]

    def _upload_netlify(self, file_paths: List[str], output_folder: str) -> List[Dict[str, str]]:
        """Upload to Netlify via API"""
        import requests
        
        results = []
        base_url = f"https://api.netlify.com/api/v1/sites/{self.config.netlify_site_id}/deployments"
        headers = {
            'Authorization': f'Bearer {self.config.netlify_token}',
            'Content-Type': 'application/json'
        }
        
        for file_path in file_paths:
            try:
                # Upload file to Netlify
                filename = os.path.basename(file_path)
                upload_url = f"{base_url}/files/{filename}"
                
                with open(file_path, 'rb') as f:
                    response = requests.put(upload_url, data=f, headers={
                        'Authorization': f'Bearer {self.config.netlify_token}'
                    })
                    response.raise_for_status()
                
                download_url = f"https://{self.config.netlify_site_id}.netlify.app/{filename}"
                results.append({'local_path': file_path, 'download_url': download_url})
                logger.info(f"Uploaded to Netlify: {download_url}")
                
            except Exception as e:
                logger.error(f"Netlify upload failed for {file_path}: {e}")
                results.append({'local_path': file_path, 'download_url': None})
        
        # Generate download page
        self._generate_netlify_page(results, output_folder)
        
        return results

    def _generate_netlify_page(self, results: List[Dict], output_folder: str):
        """Generate HTML download page for Netlify"""
        html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download PDFs</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #333; }
        .download-list { list-style: none; padding: 0; }
        .download-item { margin: 10px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
        .download-btn { 
            display: inline-block; 
            padding: 10px 20px; 
            background: #0066cc; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin-top: 10px;
        }
        .download-btn:hover { background: #0055aa; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>📥 Download PDFs</h1>
    <p class="timestamp">Generated: """ + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """</p>
    <ul class="download-list">
"""
        
        for result in results:
            if result['download_url']:
                filename = os.path.basename(result['local_path'])
                html_content += f"""
        <li class="download-item">
            <strong>{filename}</strong><br>
            <a href="{result['download_url']}" class="download-btn">Download</a>
        </li>
"""
        
        html_content += """
    </ul>
</body>
</html>
"""
        
        html_path = os.path.join(output_folder, 'download.html')
        with open(html_path, 'w') as f:
            f.write(html_content)
        logger.info(f"Generated download page: {html_path}")

    def _upload_s3(self, file_paths: List[str]) -> List[Dict[str, str]]:
        """Upload to AWS S3"""
        if not BOTO3_AVAILABLE:
            logger.error("boto3 not installed, cannot upload to S3")
            return [{'local_path': p, 'download_url': None} for p in file_paths]
        
        results = []
        s3_client = boto3.client(
            's3',
            aws_access_key_id=self.config.s3_access_key,
            aws_secret_access_key=self.config.s3_secret_key,
            region_name=self.config.s3_region
        )
        
        for file_path in file_paths:
            try:
                filename = os.path.basename(file_path)
                s3_client.upload_file(
                    file_path,
                    self.config.s3_bucket,
                    filename,
                    ExtraArgs={'ACL': 'public-read'}
                )
                download_url = f"https://{self.config.s3_bucket}.s3.{self.config.s3_region}.amazonaws.com/{filename}"
                results.append({'local_path': file_path, 'download_url': download_url})
                logger.info(f"Uploaded to S3: {download_url}")
                
            except Exception as e:
                logger.error(f"S3 upload failed for {file_path}: {e}")
                results.append({'local_path': file_path, 'download_url': None})
        
        return results

    def _upload_ftp(self, file_paths: List[str]) -> List[Dict[str, str]]:
        """Upload via FTP"""
        results = []
        
        try:
            ftp = ftplib.FTP()
            ftp.connect(self.config.ftp_host, self.config.ftp_port)
            ftp.login(self.config.ftp_user, self.config.ftp_password)
            
            for file_path in file_paths:
                try:
                    filename = os.path.basename(file_path)
                    with open(file_path, 'rb') as f:
                        ftp.storbinary(f'STOR {filename}', f)
                    
                    download_url = f"ftp://{self.config.ftp_host}/{filename}"
                    results.append({'local_path': file_path, 'download_url': download_url})
                    logger.info(f"Uploaded via FTP: {filename}")
                    
                except Exception as e:
                    logger.error(f"FTP upload failed for {file_path}: {e}")
                    results.append({'local_path': file_path, 'download_url': None})
            
            ftp.quit()
            
        except Exception as e:
            logger.error(f"FTP connection failed: {e}")
            return [{'local_path': p, 'download_url': None} for p in file_paths]
        
        return results

    def _upload_sftp(self, file_paths: List[str]) -> List[Dict[str, str]]:
        """Upload via SFTP"""
        if not PARAMIKO_AVAILABLE:
            logger.error("paramiko not installed, cannot upload via SFTP")
            return [{'local_path': p, 'download_url': None} for p in file_paths]
        
        results = []
        
        try:
            transport = paramiko.Transport((self.config.sftp_host, self.config.sftp_port))
            
            if self.config.sftp_key_file:
                key = paramiko.RSAKey.from_private_key_file(self.config.sftp_key_file)
                transport.connect(username=self.config.sftp_user, pkey=key)
            else:
                transport.connect(username=self.config.sftp_user, password=self.config.sftp_password)
            
            sftp = paramiko.SFTPClient.from_transport(transport)
            
            for file_path in file_paths:
                try:
                    filename = os.path.basename(file_path)
                    sftp.put(file_path, filename)
                    
                    download_url = f"sftp://{self.config.sftp_host}/{filename}"
                    results.append({'local_path': file_path, 'download_url': download_url})
                    logger.info(f"Uploaded via SFTP: {filename}")
                    
                except Exception as e:
                    logger.error(f"SFTP upload failed for {file_path}: {e}")
                    results.append({'local_path': file_path, 'download_url': None})
            
            sftp.close()
            transport.close()
            
        except Exception as e:
            logger.error(f"SFTP connection failed: {e}")
            return [{'local_path': p, 'download_url': None} for p in file_paths]
        
        return results


class ImageProcessor:
    """Main image processing orchestrator"""

    def __init__(self, config: Config):
        self.config = config
        self.photoshop_upscaler = None
        self.ai_upscaler = None
        self.pdf_generator = None
        self.upload_manager = None
        self._initialize_components()

    def _initialize_components(self):
        """Initialize processing components"""
        # Photoshop upscaler
        if self.config.photoshop_enabled and PHOTOSHOP_AVAILABLE:
            self.photoshop_upscaler = PhotoshopUpscaler(self.config.photoshop_path)
        
        # AI upscaler
        if self.config.ai_upscale_enabled:
            self.ai_upscaler = AIUpscaler(self.config.ai_model)
        
        # PDF generator
        self.pdf_generator = PDFGenerator(
            page_size=self.config.pdf_page_size,
            quality=self.config.pdf_quality,
            max_size_mb=self.config.pdf_max_size_mb
        )
        
        # Upload manager
        self.upload_manager = UploadManager(self.config)

    def process_images(self, input_folder: str = None, output_folder: str = None, 
                       resume: bool = False) -> Dict:
        """
        Process all images in folder
        
        Args:
            input_folder: Folder to watch for images
            output_folder: Folder for output PDFs
            resume: Resume from last checkpoint
        
        Returns:
            Processing results dictionary
        """
        input_folder = input_folder or self.config.input_folder
        output_folder = output_folder or self.config.output_folder
        
        # Ensure directories exist
        Path(input_folder).mkdir(parents=True, exist_ok=True)
        Path(output_folder).mkdir(parents=True, exist_ok=True)
        Path(self.config.temp_folder).mkdir(parents=True, exist_ok=True)
        
        # Load or initialize job state
        state_path = os.path.join(output_folder, '.job_state.json')
        state = JobState.load(state_path) if resume else None
        
        if state:
            logger.info(f"Resuming from checkpoint: {state.last_checkpoint}")
        else:
            if resume:
                logger.info("No checkpoint found, starting fresh")
            state = JobState()
        
        # Find all images
        image_files = self._find_images(input_folder)
        image_files = [f for f in image_files if f not in state.processed_files]
        
        if not image_files:
            logger.info("No new images to process")
            return {'processed': 0, 'failed': 0, 'output_files': state.output_files}
        
        state.total_images = len(image_files)
        logger.info(f"Found {len(image_files)} images to process")
        
        # Process images with progress bar
        processed_images = []
        failed_images = []
        
        iterator = tqdm(image_files, desc="Processing images") if TQDM_AVAILABLE else image_files
        
        for img_path in iterator:
            try:
                # Upscale image
                upscaled_path = self._upscale_image(img_path)
                if upscaled_path:
                    processed_images.append(upscaled_path)
                    state.processed_files.append(img_path)
                    state.processed_count += 1
                    
                    # Save checkpoint every 5 images
                    if state.processed_count % 5 == 0:
                        state.save(state_path)
                else:
                    failed_images.append(img_path)
                    state.failed_files.append(img_path)
                    
            except Exception as e:
                logger.error(f"Failed to process {img_path}: {e}")
                failed_images.append(img_path)
                state.failed_files.append(img_path)
        
        # Create PDFs
        output_files = []
        if processed_images:
            logger.info(f"Creating PDFs from {len(processed_images)} upscaled images")
            
            # Group images into batches (adjust based on desired PDF size)
            batch_size = 10  # Adjust based on typical image sizes
            for i in range(0, len(processed_images), batch_size):
                batch = processed_images[i:i + batch_size]
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                output_path = os.path.join(output_folder, f"output_{timestamp}.pdf")
                
                try:
                    pdf_paths = self.pdf_generator.create_pdf(batch, output_path)
                    if isinstance(pdf_paths, str):
                        pdf_paths = [pdf_paths]
                    output_files.extend(pdf_paths)
                    state.output_files.extend(pdf_paths)
                except Exception as e:
                    logger.error(f"Failed to create PDF: {e}")
        
        # Upload PDFs
        if output_files and self.config.upload_enabled:
            logger.info("Uploading PDFs...")
            upload_results = self.upload_manager.upload(output_files, output_folder)
            
            # Log download URLs
            for result in upload_results:
                if result['download_url']:
                    logger.info(f"Download URL: {result['download_url']}")
        
        # Save final state
        state.save(state_path)
        
        results = {
            'processed': len(processed_images),
            'failed': len(failed_images),
            'output_files': output_files,
            'state_path': state_path
        }
        
        logger.info(f"Processing complete: {results['processed']} processed, {results['failed']} failed")
        return results

    def _find_images(self, folder: str) -> List[str]:
        """Find all supported image files in folder"""
        image_files = []
        for ext in self.config.supported_formats:
            pattern = f"*{ext}"
            image_files.extend(Path(folder).glob(pattern))
            # Also check uppercase extensions
            pattern = f"*{ext.upper()}"
            image_files.extend(Path(folder).glob(pattern))
        
        return [str(f) for f in image_files]

    def _upscale_image(self, input_path: str) -> Optional[str]:
        """Upscale a single image"""
        # Generate output path
        filename = Path(input_path).stem
        output_path = os.path.join(self.config.temp_folder, f"{filename}_upscaled.jpg")
        
        # Try Photoshop first if enabled
        if self.photoshop_upscaler:
            logger.info(f"Upscaling with Photoshop: {input_path}")
            if self.photoshop_upscaler.upscale(input_path, output_path, scale_factor=2.0):
                return output_path
        
        # Fallback to AI upscaler
        if self.ai_upscaler:
            logger.info(f"Upscaling with AI: {input_path}")
            if self.ai_upscaler.upscale(input_path, output_path, scale_factor=4):
                return output_path
        
        # Last resort: copy original
        logger.warning(f"No upscaling available, using original: {input_path}")
        import shutil
        shutil.copy2(input_path, output_path)
        return output_path

    def watch_folder(self, input_folder: str = None, interval: int = 5):
        """
        Watch folder for new images and process them automatically
        
        Args:
            input_folder: Folder to watch
            interval: Check interval in seconds
        """
        input_folder = input_folder or self.config.input_folder
        logger.info(f"Watching folder: {input_folder} (interval: {interval}s)")
        
        processed_hashes = set()
        
        try:
            while True:
                image_files = self._find_images(input_folder)
                
                for img_path in image_files:
                    # Calculate hash to avoid reprocessing
                    file_hash = self._file_hash(img_path)
                    
                    if file_hash not in processed_hashes:
                        logger.info(f"New image detected: {img_path}")
                        self.process_images(input_folder, resume=True)
                        processed_hashes.add(file_hash)
                
                time.sleep(interval)
                
        except KeyboardInterrupt:
            logger.info("Folder watcher stopped")

    def _file_hash(self, filepath: str) -> str:
        """Calculate MD5 hash of file"""
        hash_md5 = hashlib.md5()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()


def main():
    """Main entry point with CLI"""
    parser = argparse.ArgumentParser(
        description='Image to PDF Upscaler with Upload Functionality',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --input ./images --output ./pdfs
  %(prog)s --config config.json --watch
  %(prog)s --photoshop --input ./scan --upload-method s3
        """
    )
    
    parser.add_argument('--input', '-i', help='Input folder path')
    parser.add_argument('--output', '-o', help='Output folder path')
    parser.add_argument('--config', '-c', help='Configuration file path', default='config.json')
    parser.add_argument('--watch', '-w', action='store_true', help='Watch folder for new images')
    parser.add_argument('--watch-interval', type=int, default=5, help='Watch interval in seconds')
    parser.add_argument('--no-resume', action='store_true', help='Disable resume from checkpoint')
    parser.add_argument('--photoshop', action='store_true', help='Enable Photoshop upscaling')
    parser.add_argument('--no-ai', action='store_true', help='Disable AI upscaling')
    parser.add_argument('--upload-method', choices=['netlify', 's3', 'ftp', 'sftp'], 
                       help='Upload method')
    parser.add_argument('--max-size', type=int, help='Max PDF size in MB')
    parser.add_argument('--workers', type=int, help='Number of worker threads')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    
    args = parser.parse_args()
    
    # Set logging level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Load configuration
    config = Config.from_file(args.config)
    
    # Override config with command line args
    if args.input:
        config.input_folder = args.input
    if args.output:
        config.output_folder = args.output
    if args.photoshop:
        config.photoshop_enabled = True
    if args.no_ai:
        config.ai_upscale_enabled = False
    if args.upload_method:
        config.upload_method = args.upload_method
        config.upload_enabled = True
    if args.max_size:
        config.pdf_max_size_mb = args.max_size
    if args.workers:
        config.max_workers = args.workers
    
    # Create processor
    processor = ImageProcessor(config)
    
    # Run
    if args.watch:
        processor.watch_folder(interval=args.watch_interval)
    else:
        results = processor.process_images(resume=not args.no_resume)
        
        # Print summary
        print("\n" + "="*50)
        print("PROCESSING SUMMARY")
        print("="*50)
        print(f"Images processed: {results['processed']}")
        print(f"Images failed: {results['failed']}")
        print(f"PDFs created: {len(results['output_files'])}")
        if results['output_files']:
            print("\nOutput files:")
            for pdf in results['output_files']:
                size_mb = os.path.getsize(pdf) / 1024 / 1024
                print(f"  - {pdf} ({size_mb:.2f} MB)")
        print("="*50)


if __name__ == '__main__':
    main()
