import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Inisialisasi Cloudflare R2 Client (S3 Compatible API)
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ACCOUNT_ID
    ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : 'https://placeholder.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'placeholder',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'placeholder',
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada berkas gambar yang dikirim.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = `products/${Date.now()}-${sanitizedName}`;

    if (process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET_NAME) {
      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: objectKey,
          Body: buffer,
          ContentType: file.type || 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable', // Cache 1 tahun di Edge CDN
        })
      );
    }

    const publicBaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://cdn.kejagan.desa.id';
    const finalUrl = `${publicBaseUrl}/${objectKey}`;

    return NextResponse.json({
      success: true,
      url: finalUrl,
      key: objectKey,
    });
  } catch (error) {
    console.error('Gagal mengunggah foto ke Cloudflare R2:', error);
    return NextResponse.json(
      { error: 'Gagal mengunggah gambar produk ke penyimpanan cloud.' },
      { status: 500 }
    );
  }
}
