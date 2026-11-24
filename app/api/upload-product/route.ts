import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada berkas gambar yang dikirim.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload gambar ke Cloudinary (Gratis 25GB/bulan, tanpa kartu kredit)
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'kejagan-mart/products',
            format: 'webp',
            transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error || !result) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Gagal mengunggah foto ke Cloudinary:', error);
    return NextResponse.json(
      { error: 'Gagal mengunggah gambar produk ke Cloudinary.' },
      { status: 500 }
    );
  }
}
