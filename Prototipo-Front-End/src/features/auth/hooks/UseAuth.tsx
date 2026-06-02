export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  // Checa se está expirado
  return !isTokenExpired(token);
};

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch (err) {
    return true;
  }
}