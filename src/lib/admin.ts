const ADMIN_EMAILS = ["clovvalencied@gmail.com"];

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function canUseFeature(
  _plan: string,
  _feature: string,
  _userEmail: string
): boolean {
  // Semua fitur terbuka untuk semua user
  return true;
}
