/**
 * Kompresi Foto Otomatis Sisi Klien (Client-Side Canvas Downscaling)
 * Memperkecil resolusi foto kamera HP (5MB-10MB) menjadi WebP 800x800px (~50-70KB)
 * Menghemat kuota internet hingga 98% dan mempercepat proses upload ke Cloudflare R2.
 */
export async function compressProductImageClient(
  file: File,
  maxSize: number = 800,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onerror = (error) => reject(error);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, '');
            const compressedFile = new File(
              [blob],
              `${Date.now()}-${cleanName}.webp`,
              { type: 'image/webp' }
            );
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
    };
  });
}
