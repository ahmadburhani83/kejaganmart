import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const deleteRequestSchema = z.object({
  phoneNumber: z.string().min(8).max(20),
  nik: z.string().min(16).max(16),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = deleteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Format data tidak valid. NIK wajib 16 digit angka.' },
        { status: 400 }
      );
    }

    const { phoneNumber, nik, reason } = parsed.data;

    // Catat log permohonan ke tabel audit_logs
    await supabase.from('audit_logs').insert({
      action: 'USER_DATA_DELETION_REQUEST',
      entity_name: 'profiles',
      entity_id: nik,
      details: {
        phone_number: phoneNumber,
        nik_mask: `${nik.slice(0, 4)}********${nik.slice(-4)}`,
        reason: reason || 'Permohonan warga mandiri',
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Permohonan penghapusan data telah tercatat resmi. Seluruh data kependudukan, KTP, dan biometrik Anda akan dimusnahkan secara permanen.',
    });
  } catch (error) {
    console.error('Error handling data deletion:', error);
    return NextResponse.json(
      { error: 'Terjadi kegagalan server saat memproses permohonan.' },
      { status: 500 }
    );
  }
}
