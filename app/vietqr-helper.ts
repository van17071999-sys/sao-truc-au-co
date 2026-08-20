export function extractBankCode(bankString: string): string {
  if (!bankString) return "STB";
  const trimmed = bankString.trim();
  const firstWord = trimmed.split(/[\s·\-_/:]+/)[0].toUpperCase();
  const bankAliases: Record<string, string> = {
    "SACOMBANK": "STB",
    "VIETCOMBANK": "VCB",
    "TECHCOMBANK": "TCB",
    "VIETINBANK": "ICB",
    "MBBANK": "MB",
    "VPBANK": "VPB",
    "TPBANK": "TPB",
    "AGRIBANK": "VBA",
    "BIDV": "BIDV",
    "ACB": "ACB",
    "VIB": "VIB",
    "SHB": "SHB",
    "MSB": "MSB",
    "OCB": "OCB",
    "HDBANK": "HDB",
  };
  return bankAliases[firstWord] || firstWord;
}

export function parseNumericAmount(amountStr: string | number): number {
  if (typeof amountStr === "number") return amountStr;
  if (!amountStr) return 0;
  const digits = amountStr.toString().replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function buildVietQrUrl({
  bank,
  account,
  accountName,
  amount,
  memo,
  customImageUrl,
}: {
  bank: string;
  account: string;
  accountName?: string;
  amount?: string | number;
  memo?: string;
  customImageUrl?: string;
}): string {
  const cleanAccount = (account || "").replace(/\s+/g, "");
  if (!cleanAccount) {
    return customImageUrl || "/vietqr-payment.png";
  }

  const bankCode = extractBankCode(bank);
  const numAmount = parseNumericAmount(amount || 0);

  const params = new URLSearchParams();
  if (numAmount > 0) {
    params.set("amount", numAmount.toString());
  }
  if (memo) {
    const cleanMemo = memo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, " ")
      .trim()
      .slice(0, 50);
    if (cleanMemo) params.set("addInfo", cleanMemo);
  }
  if (accountName) {
    params.set("accountName", accountName.trim());
  }

  const queryString = params.toString();
  return `https://img.vietqr.io/image/${bankCode}-${cleanAccount}-compact2.png${queryString ? `?${queryString}` : ""}`;
}
