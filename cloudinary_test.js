const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary inline
cloudinary.config({
  cloud_name: 'dcp3oidmi',
  api_key: '252426994239487',
  api_secret: 'fQIdgK4BVI474YJCvnlbCtLgvhw'
});

// Main function to run the onboarding sequence
async function run() {
  try {
    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    console.log('Uploading sample image...');
    
    // 2. Upload the image
    const uploadResult = await cloudinary.uploader.upload(sampleImageUrl, {
      public_id: 'onboarding_sample'
    });
    
    console.log('Upload successful!');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);
    
    // 3. Get image details
    console.log('\nImage Details:');
    console.log(`Width: ${uploadResult.width}px`);
    console.log(`Height: ${uploadResult.height}px`);
    console.log(`Format: ${uploadResult.format}`);
    console.log(`File Size: ${uploadResult.bytes} bytes`);
    
    // 4. Transform the image
    // fetch_format: 'auto' (f_auto) selects the best image format dynamically based on the requesting browser
    // quality: 'auto' (q_auto) compresses the image quality automatically while preserving visual clarity
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
      secure: true
    });
    
    console.log('\nDone! Click link below to see optimized version of the image. Check the size and the format.');
    console.log(transformedUrl);
    
  } catch (error) {
    console.error('Error during Cloudinary onboarding sequence:', error);
  }
}

run();
