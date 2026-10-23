// Remove espaços externos e padroniza a identificação local em minúsculas.
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Confere o formato básico; não comprova a identidade nem a existência do e-mail.
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(normalizeEmail(email));
}
