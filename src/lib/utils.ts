export function generateReceiptCode(): string {
  const months = [
    "JA", "FE", "MR", "AP", "ME", "JN",
    "JL", "AG", "SP", "OK", "NV", "DS",
  ];
  const now = new Date();
  const month = months[now.getMonth()];
  const day = String(now.getDate()).padStart(2, "0");

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${month}-${day}${String(now.getFullYear()).slice(2)}-${random}`;
}

export function sanitizeReceiptCode(code: string): string {
  return code.replace(/[0O1I]/g, "");
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateTotalCost(weight: number, pricePerKg: number): number {
  return Math.round(weight * pricePerKg);
}
