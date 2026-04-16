# Production Checklist

## Environment

- Set `APP_ENV=production`.
- Set `APP_DEBUG=false`.
- Set a strong `APP_KEY`.
- Set `APP_URL` and `FRONTEND_URL`.
- Configure production database credentials.
- Configure `NEXT_PUBLIC_BACKEND_API_URL`.

## Security

- Serve both apps over HTTPS.
- Restrict CORS to the frontend domain.
- Configure secure mail credentials.
- Review rate limits before launch.
- Rotate any test credentials seeded locally.
- Back up the production database before migrations.

## Laravel

- Run `composer install --no-dev --optimize-autoloader`.
- Run `php artisan migrate --force`.
- Run `php artisan config:cache`.
- Run `php artisan route:cache`.
- Run `php artisan storage:link`.
- Ensure `storage/` and `bootstrap/cache/` are writable.

## Next.js

- Run `npm ci`.
- Run `npm run build`.
- Start with the chosen production runner or deploy target.

## Launch Verification

- Register a company.
- Log in as company and admin.
- Create, autosave, upload to, and submit a JNF.
- Create, autosave, upload to, and submit an INF.
- Approve, reject, and request edit from admin.
- Confirm notifications and email logs are created.
- Confirm forgot-password reset works end to end.
