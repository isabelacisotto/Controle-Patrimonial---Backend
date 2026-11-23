export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim()
  if (!secret) {
    throw new Error(
      "JWT_SECRET is required. Set it in the backend .env file before starting the server.",
    )
  }
  return secret
}
