import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AgingReportQueryDto } from '../dto/aging-report-query.dto';

@Injectable()
export class AgingReportsService {
    constructor(private readonly prisma: PrismaService) { }

    async getReceivablesAging(company_id: string, query: AgingReportQueryDto) {
        const baseDate = query.base_date ? new Date(query.base_date) : new Date();
        const where: any = {
            company_id,
            status: { in: ['pending', 'partially_paid', 'overdue'] },
        };

        if (query.cinema_complex_id) {
            where.cinema_complex_id = query.cinema_complex_id;
        }

        const receivables = await this.prisma.accounts_receivable.findMany({
            where,
            select: {
                id: true,
                document_number: true,
                customer_id: true,
                issue_date: true,
                due_date: true,
                original_amount: true,
                remaining_amount: true,
                status: true,
            },
        });

        return this.calculateAging(receivables, baseDate);
    }

    async getPayablesAging(company_id: string, query: AgingReportQueryDto) {
        const baseDate = query.base_date ? new Date(query.base_date) : new Date();
        const where: any = {
            company_id,
            status: { in: ['pending', 'partially_paid', 'overdue'] },
        };

        if (query.cinema_complex_id) {
            where.cinema_complex_id = query.cinema_complex_id;
        }

        const payables = await this.prisma.accounts_payable.findMany({
            where,
            select: {
                id: true,
                document_number: true,
                supplier_id: true,
                issue_date: true,
                due_date: true,
                original_amount: true,
                remaining_amount: true,
                status: true,
            },
        });

        return this.calculateAging(payables, baseDate);
    }

    private calculateAging(items: any[], baseDate: Date) {
        const buckets = {
            overdue_90_plus: { label: 'Overdue > 90 days', amount: 0, count: 0, items: [] as any[] },
            overdue_61_90: { label: 'Overdue 61-90 days', amount: 0, count: 0, items: [] as any[] },
            overdue_31_60: { label: 'Overdue 31-60 days', amount: 0, count: 0, items: [] as any[] },
            overdue_1_30: { label: 'Overdue 1-30 days', amount: 0, count: 0, items: [] as any[] },
            due_today: { label: 'Due Today', amount: 0, count: 0, items: [] as any[] },
            coming_1_30: { label: 'Coming 1-30 days', amount: 0, count: 0, items: [] as any[] },
            coming_31_60: { label: 'Coming 31-60 days', amount: 0, count: 0, items: [] as any[] },
            coming_61_90: { label: 'Coming 61-90 days', amount: 0, count: 0, items: [] as any[] },
            coming_90_plus: { label: 'Coming > 90 days', amount: 0, count: 0, items: [] as any[] },
        };

        let totalAmount = 0;

        items.forEach((item) => {
            const dueDate = new Date(item.due_date);
            const diffTime = dueDate.getTime() - baseDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const amount = Number(item.remaining_amount);

            totalAmount += amount;

            let bucketKey = '';

            if (diffDays < 0) {
                // Overdue
                const overdueDays = Math.abs(diffDays);
                if (overdueDays > 90) bucketKey = 'overdue_90_plus';
                else if (overdueDays > 60) bucketKey = 'overdue_61_90';
                else if (overdueDays > 30) bucketKey = 'overdue_31_60';
                else bucketKey = 'overdue_1_30';
            } else if (diffDays === 0) {
                bucketKey = 'due_today';
            } else {
                // Coming due
                if (diffDays <= 30) bucketKey = 'coming_1_30';
                else if (diffDays <= 60) bucketKey = 'coming_31_60';
                else if (diffDays <= 90) bucketKey = 'coming_61_90';
                else bucketKey = 'coming_90_plus';
            }

            const key = bucketKey as keyof typeof buckets;
            buckets[key].amount += amount;
            buckets[key].count += 1;
            buckets[key].items.push({
                ...item,
                days_diff: diffDays,
            });
        });

        return {
            base_date: baseDate.toISOString().split('T')[0],
            total_amount: totalAmount,
            buckets,
        };
    }
}
