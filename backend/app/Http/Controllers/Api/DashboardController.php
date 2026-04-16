<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Inf;
use App\Models\Jnf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function company(Request $request): JsonResponse
    {
        $company = $request->user()->company;
        abort_if($company === null, 422, 'Create a company profile before opening the dashboard.');

        $jnfCounts = $this->countsByStatus(Jnf::query()->where('company_id', $company->company_id));
        $infCounts = $this->countsByStatus(Inf::query()->where('company_id', $company->company_id));

        return response()->json([
            'data' => [
                'company' => $company,
                'totals' => [
                    'jnfs' => array_sum($jnfCounts),
                    'infs' => array_sum($infCounts),
                    'unread_notifications' => $request->user()->notifications()->where('is_read', false)->count(),
                ],
                'jnfs_by_status' => $jnfCounts,
                'infs_by_status' => $infCounts,
                'recent_jnfs' => Jnf::query()->where('company_id', $company->company_id)->orderByDesc('created_at')->limit(5)->get(),
                'recent_infs' => Inf::query()->where('company_id', $company->company_id)->orderByDesc('created_at')->limit(5)->get(),
            ],
        ]);
    }

    public function admin(Request $request): JsonResponse
    {
        abort_if($request->user()->role !== 'admin', 403, 'Admin access required.');

        return response()->json([
            'data' => [
                'totals' => [
                    'companies' => Company::query()->count(),
                    'jnfs' => Jnf::query()->count(),
                    'infs' => Inf::query()->count(),
                    'pending_reviews' => Jnf::query()->where('status', 'submitted')->count()
                        + Inf::query()->where('status', 'submitted')->count(),
                ],
                'jnfs_by_status' => $this->countsByStatus(Jnf::query()),
                'infs_by_status' => $this->countsByStatus(Inf::query()),
                'recent_jnfs' => Jnf::query()->with('company')->orderByDesc('created_at')->limit(5)->get(),
                'recent_infs' => Inf::query()->with('company')->orderByDesc('created_at')->limit(5)->get(),
            ],
        ]);
    }

    private function countsByStatus($query): array
    {
        return $query
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->map(fn ($count) => (int) $count)
            ->all();
    }
}
