# Security Policy

Please do not publish credentials, tokens, database passwords, or private user information in issues or pull requests.

If you discover a security vulnerability, report it privately to the repository owner rather than opening a public issue containing exploit details.

## Production checklist

- Store secrets in environment variables or the hosting platform's secret store.
- Use HTTPS in production.
- Restrict administrative access.
- Use a least-privilege database account.
- Review uploaded media URLs before publishing them.
