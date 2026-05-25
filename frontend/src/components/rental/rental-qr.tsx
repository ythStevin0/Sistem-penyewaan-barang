"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface RentalQrProps {
  rentalId: string;
  size?: number;
}

export function RentalQr({ rentalId, size = 160 }: RentalQrProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const payload = JSON.stringify({
      type: "samidd_rental",
      rental_id: rentalId,
      url: `${siteUrl}/dashboard`,
    });

    QRCode.toDataURL(payload, { width: size, margin: 2 })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [rentalId, size]);

  if (!dataUrl) return <div className="bg-muted animate-pulse rounded-lg" style={{ width: size, height: size }} />;

  return (
    <div className="inline-block p-3 bg-white rounded-xl border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt={`QR transaksi ${rentalId.slice(0, 8)}`} width={size} height={size} />
      <p className="text-[10px] text-center text-muted-foreground mt-2 font-mono">
        Scan untuk cek pesanan
      </p>
    </div>
  );
}
