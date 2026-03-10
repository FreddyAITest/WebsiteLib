# Image to PDF Upscaler with Upload Functionality

Automated image upscaling (Photoshop or AI fallback), PDF generation with smart splitting, and upload to various hosting platforms.

## Features

✅ **Image Upscaling**
- Photoshop automation (Windows COM) for highest quality
- AI upscaling with Real-ESRGAN or waifu2x (GPU-accelerated)
- PIL/Pillow fallback for basic resizing
- Support for JPG, PNG, TIFF, WEBP formats

✅ **PDF Generation**
- High-quality PDF creation with img2pdf
- Automatic splitting when PDF exceeds 20MB
- Smart splitting (never cuts images in half)
- Configurable page sizes (A4, Letter, Legal)

✅ **Upload & Hosting**
- Netlify API with auto-generated download page
- AWS S3 with public-read ACL
- FTP/SFTP upload support
- Instant download links

✅ **Advanced Features**
- Folder watching for automatic processing
- Resume capability for interrupted jobs
- Multi-threading support
- Progress bars and detailed logging
- Command-line interface
- JSON configuration

## Installation

### 1. Clone or Download

```bash
cd /root/.openclaw/workspace/scripts/image-to-pdf-upscale
```

### 2. Install Dependencies

**Basic installation (PIL/Pillow upscaling only):**
```bash
pip install -r requirements.txt
```

**With AI upscaling (recommended, requires CUDA GPU):**
```bash
pip install -r requirements.txt
pip install realesrgan basicsr torch torchvision
```

**With S3 upload support:**
```bash
pip install -r requirements.txt[s3]
```

**With SFTP upload support:**
```bash
pip install -r requirements.txt[sftp]
```

### 3. Install Photoshop (Optional)

For best upscaling quality, install Adobe Photoshop (Windows only):
- Photoshop CC 2020 or later
- Install `photoshop-python-api`: `pip install photoshop-python-api`

## Configuration

Edit `config.json` to customize settings:

```json
{
  "input_folder": "./input",
  "output_folder": "./output",
  "photoshop_enabled": false,
  "ai_upscale_enabled": true,
  "ai_model": "realesrgan",
  "pdf_max_size_mb": 20,
  "upload_enabled": false,
  "upload_method": "netlify"
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `input_folder` | Folder to watch for images | `./input` |
| `output_folder` | Folder for output PDFs | `./output` |
| `temp_folder` | Temporary folder for upscaled images | `./temp` |
| `photoshop_enabled` | Enable Photoshop upscaling | `false` |
| `photoshop_path` | Path to Photoshop executable | Auto-detect |
| `ai_upscale_enabled` | Enable AI upscaling | `true` |
| `ai_model` | AI model: `realesrgan` or `waifu2x` | `realesrgan` |
| `pdf_max_size_mb` | Maximum PDF size before splitting | `20` |
| `pdf_page_size` | Page size: `A4`, `letter`, `legal` | `A4` |
| `pdf_quality` | DPI for PDF generation | `300` |
| `upload_enabled` | Enable automatic upload | `false` |
| `upload_method` | Upload method: `netlify`, `s3`, `ftp`, `sftp` | `netlify` |
| `max_workers` | Number of processing threads | `4` |
| `resume_enabled` | Resume interrupted jobs | `true` |

## Usage

### Basic Usage

```bash
# Process images in default input folder
python image_to_pdf_upscale.py

# Specify input and output folders
python image_to_pdf_upscale.py --input ./scans --output ./pdfs

# Use custom config file
python image_to_pdf_upscale.py --config my_config.json
```

### Advanced Usage

```bash
# Enable Photoshop upscaling
python image_to_pdf_upscale.py --photoshop --input ./images

# Watch folder for new images (auto-process)
python image_to_pdf_upscale.py --watch --watch-interval 10

# Upload to S3 after processing
python image_to_pdf_upscale.py --upload-method s3

# Disable resume and reprocess all
python image_to_pdf_upscale.py --no-resume

# Verbose output for debugging
python image_to_pdf_upscale.py --verbose
```

### Command-Line Options

```
--input, -i       Input folder path
--output, -o      Output folder path
--config, -c      Configuration file (default: config.json)
--watch, -w       Watch folder for new images
--watch-interval  Check interval in seconds (default: 5)
--no-resume       Disable resume from checkpoint
--photoshop       Enable Photoshop upscaling
--no-ai           Disable AI upscaling
--upload-method   Upload method: netlify, s3, ftp, sftp
--max-size        Max PDF size in MB
--workers         Number of worker threads
--verbose, -v     Verbose output
```

## Upload Platform Setup

### Netlify

1. Get your Netlify API token: https://app.netlify.com/account/applications
2. Get your Site ID from Netlify dashboard
3. Update config.json:
```json
{
  "upload_enabled": true,
  "upload_method": "netlify",
  "netlify_token": "YOUR_TOKEN",
  "netlify_site_id": "YOUR_SITE_ID"
}
```

### AWS S3

1. Create an S3 bucket
2. Get AWS credentials (Access Key ID and Secret Key)
3. Update config.json:
```json
{
  "upload_enabled": true,
  "upload_method": "s3",
  "s3_bucket": "your-bucket-name",
  "s3_region": "us-east-1",
  "s3_access_key": "YOUR_ACCESS_KEY",
  "s3_secret_key": "YOUR_SECRET_KEY"
}
```

### FTP

```json
{
  "upload_enabled": true,
  "upload_method": "ftp",
  "ftp_host": "ftp.example.com",
  "ftp_user": "username",
  "ftp_password": "password",
  "ftp_port": 21
}
```

### SFTP

```json
{
  "upload_enabled": true,
  "upload_method": "sftp",
  "sftp_host": "sftp.example.com",
  "sftp_user": "username",
  "sftp_password": "password",
  "sftp_port": 22,
  "sftp_key_file": "/path/to/private/key"  // Optional
}
```

## Examples

### Example 1: Basic Image to PDF

```bash
# Create input folder and add images
mkdir -p input
cp /path/to/images/*.jpg input/

# Process images
python image_to_pdf_upscale.py

# Check output folder
ls -lh output/
```

### Example 2: High-Quality Scans with Photoshop

```bash
# Enable Photoshop in config.json
# Set "photoshop_enabled": true

# Process with maximum quality
python image_to_pdf_upscale.py --photoshop --input ./scans --max-size 50
```

### Example 3: Automated Workflow with Upload

```bash
# Configure Netlify upload in config.json
# Set upload_enabled: true and add credentials

# Start folder watcher
python image_to_pdf_upscale.py --watch --watch-interval 30

# Drop images into input folder, they'll be automatically:
# 1. Upscaled
# 2. Converted to PDF
# 3. Uploaded to Netlify
# 4. Download page generated
```

### Example 4: Batch Processing Large Archive

```bash
# Process 1000+ images with resume capability
python image_to_pdf_upscale.py --input ./archive --output ./pdfs --workers 8

# If interrupted, resume with:
python image_to_pdf_upscale.py --input ./archive --output ./pdfs
```

## Output Structure

```
output/
├── output_20240310_103045.pdf
├── output_20240310_103045_part1.pdf
├── output_20240310_103045_part2.pdf
├── download.html (if Netlify upload enabled)
└── .job_state.json (checkpoint for resume)
```

## Troubleshooting

### Photoshop Not Detected

**Windows:**
- Ensure Photoshop is installed and licensed
- Run script with administrator privileges
- Check Photoshop path in config.json

**macOS/Linux:**
- Photoshop automation only supported on Windows
- Use AI upscaling instead (Real-ESRGAN)

### AI Upscaling Slow

- Install CUDA-enabled PyTorch for GPU acceleration
- Reduce `max_workers` in config
- Use PIL fallback for faster processing

### PDF Too Large

- Reduce `pdf_max_size_mb` in config
- Lower `pdf_quality` DPI
- Reduce image dimensions before processing

### Upload Fails

- Check API tokens/credentials in config.json
- Verify network connectivity
- Check firewall settings
- Review logs: `image_to_pdf_upscale.log`

### Resume Not Working

- Ensure `resume_enabled: true` in config
- Don't delete `.job_state.json` file
- Use `--no-resume` to force reprocessing

## Performance Tips

1. **Use GPU for AI upscaling**: Install CUDA-enabled PyTorch
2. **Increase workers**: Set `max_workers` to CPU core count
3. **SSD storage**: Use SSD for temp folder for faster I/O
4. **Batch processing**: Process images in batches of 10-20
5. **Photoshop for critical quality**: Use Photoshop for important documents

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Input     │────▶│   Upscaler   │────▶│   PDF       │
│   Images    │     │ (PS/AI/PIL)  │     │   Generator │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                                                 ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Download   │◀────│    Upload    │◀────│   Splitter  │
│    Page     │     │   Manager    │     │  (20MB)     │
└─────────────┘     └──────────────┘     └─────────────┘
```

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Created by AI Insights**  
**Version:** 1.0.0  
**Last Updated:** 2024-03-10
