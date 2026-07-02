import crypto from "crypto";

export function generateRobokassaSignature(
  merchantLogin: string,
  outSum: string,
  invId: string,
  password1: string
): string {
  const signatureString = `${merchantLogin}:${outSum}:${invId}:${password1}`;
  return crypto.createHash("md5").update(signatureString).digest("hex");
}

export function verifyRobokassaResultSignature(
  outSum: string,
  invId: string,
  password2: string
): string {
  const signatureString = `${outSum}:${invId}:${password2}`;
  return crypto.createHash("md5").update(signatureString).digest("hex");
}

export function buildRobokassaUrl(
  merchantLogin: string,
  outSum: number,
  invId: string,
  description: string,
  password1: string,
  testMode: boolean,
  successUrl?: string,
  resultUrl?: string
): string {
  const signature = generateRobokassaSignature(
    merchantLogin,
    outSum.toFixed(2),
    invId,
    password1
  );

  const params = new URLSearchParams({
    MerchantLogin: merchantLogin,
    OutSum: outSum.toFixed(2),
    InvId: invId,
    Description: description,
    SignatureValue: signature,
    IsTest: testMode ? "1" : "0",
  });

  if (successUrl) params.append("SuccessURL", successUrl);
  if (resultUrl) params.append("ResultURL", resultUrl);

  return `https://auth.robokassa.ru/Merchant/Index.aspx?${params.toString()}`;
}
