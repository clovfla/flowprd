const ADMIN_EMAILS = ["clovvalencied@gmail.com"];

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function canUseFeature(
  plan: string,
  feature: "clarification" | "cloud_save" | "export_docx" | "unlimited_prompts" | "share_link" | "custom_branding" | "auto_improve" | "presentation" | "share_analytics" | "comparison",
  userEmail: string
): boolean {
  // Admin bisa akses semua
  if (isAdmin(userEmail)) return true;

  const premiumFeatures = [
    "clarification", "cloud_save", "export_docx", "unlimited_prompts", "share_link",
  ];

  const premiumPlusFeatures = [
    ...premiumFeatures,
    "custom_branding", "auto_improve", "presentation", "share_analytics", "comparison",
  ];

  if (plan === "premium_plus") return premiumPlusFeatures.includes(feature);
  if (plan === "premium") return premiumFeatures.includes(feature);
  return false; // free
}
