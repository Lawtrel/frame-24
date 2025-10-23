import { PageHeader } from '@repo/ui/page-header';
import React from 'react';
import "../globals.css";

export default function DashboardPage() {
    
    return (
        <React.Fragment>
            <PageHeader
                title="Dashboard" 
                breadcrumbItems={[]}            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <h2 className="text-xl font-semibold mb-6 ">Métricas Principais</h2>
            </div>
        </React.Fragment>
    );
}