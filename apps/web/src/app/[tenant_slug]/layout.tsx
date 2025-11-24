import { use, ReactNode } from 'react';
import { AppHeader } from '@/components/layout/app-header';

export default function TenantLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ tenant_slug: string }>;
}) {
    const { tenant_slug } = use(params);

    return (
        <div className="min-h-screen bg-zinc-950">
            <AppHeader tenantSlug={tenant_slug} />
            {children}
        </div>
    );
}
