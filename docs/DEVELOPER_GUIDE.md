# Developer Guide

## Architecture

- `backend/` contains the Laravel API.
- `frontend/` contains the Next.js UI.
- API routes are versioned under `/api/v1`.
- Authentication currently uses the existing custom bearer-token middleware.
- JNF and INF share detail storage for salary, eligibility, special criteria, and selection process sections.
- Notifications and email logs are coordinated through `App\Services\NotificationService`.

## Key Backend Areas

- Auth: `app/Http/Controllers/Api/AuthController.php`
- Company APIs: `app/Http/Controllers/Api/CompanyController.php`
- JNF APIs: `app/Http/Controllers/Api/JnfController.php`
- INF APIs: `app/Http/Controllers/Api/InfController.php`
- Submission details: `app/Http/Controllers/Api/SubmissionDetailsController.php`
- Admin review: `app/Http/Controllers/Api/AdminJnfController.php`
- Dashboard metrics: `app/Http/Controllers/Api/DashboardController.php`
- Notifications: `app/Http/Controllers/Api/NotificationController.php`
- Uploads: `app/Http/Controllers/Api/FileUploadController.php`

## Local Setup

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

```bash
cd frontend
npm install
npm run dev
```

## Testing

```bash
cd backend
php artisan test
```

```bash
cd frontend
npm run build
```

## Operational Notes

- Configure `MAIL_MAILER`, `MAIL_FROM_ADDRESS`, and SMTP provider variables before production email delivery.
- Run `php artisan storage:link` before serving uploaded public files.
- Keep `NEXT_PUBLIC_BACKEND_API_URL` pointed at the deployed Laravel API.
- The current token auth is simple and works locally; migrating to Sanctum is a separate hardening step.
