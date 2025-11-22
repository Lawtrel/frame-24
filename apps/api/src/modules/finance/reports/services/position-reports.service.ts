import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerPositionQueryDto, SupplierPositionQueryDto } from '../dto/position-report-query.dto';

@Injectable()
export class PositionReportsService {
    constructor(private readonly prisma: PrismaService) { }

    async getCustomerPosition(company_id: string, query: CustomerPositionQueryDto) {
        const whereClause: any = {
            company_id,
            status: { in: ['pending', 'partially_paid', 'overdue'] },
        };

        if (query.customer_id) {
            whereClause.customer_id = query.customer_id;
        }

        if (query.cinema_complex_id) {
            whereClause.cinema_complex_id = query.cinema_complex_id;
        }

        // Buscar todos os títulos em aberto
        const openTitles = await this.prisma.accounts_receivable.findMany({
            where: whereClause,
            include: {
                transactions: {
                    orderBy: { transaction_date: 'desc' },
                },
            },
        });

        // Agrupar por cliente
        const customerMap = new Map<string, any>();

        for (const title of openTitles) {
            const customerId = title.customer_id || 'unknown';

            if (!customerMap.has(customerId)) {
                customerMap.set(customerId, {
                    customer_id: customerId,
                    titles: [],
                    total_open_amount: 0,
                    total_overdue_amount: 0,
                    overdue_days_max: 0,
                    open_titles_count: 0,
                    payment_history: [],
                });
            }

            const customer = customerMap.get(customerId);
            const remaining = Number(title.remaining_amount);
            customer.total_open_amount += remaining;
            customer.open_titles_count++;

            // Verificar se está vencido
            const today = new Date();
            const dueDate = new Date(title.due_date);
            const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

            if (daysOverdue > 0) {
                customer.total_overdue_amount += remaining;
                customer.overdue_days_max = Math.max(customer.overdue_days_max, daysOverdue);
            }

            customer.titles.push({
                id: title.id,
                document_number: title.document_number,
                due_date: title.due_date,
                days_overdue: daysOverdue,
                original_amount: Number(title.original_amount),
                remaining_amount: remaining,
                status: title.status,
            });

            // Adicionar histórico de transações
            if (title.transactions && title.transactions.length > 0) {
                customer.payment_history.push(
                    ...title.transactions.map((t: any) => ({
                        date: t.transaction_date,
                        amount: Number(t.amount),
                        document_number: title.document_number,
                    }))
                );
            }
        }

        // Buscar títulos pagos para calcular taxa de inadimplência e ticket médio
        for (const [customerId, customer] of customerMap.entries()) {
            if (customerId === 'unknown') continue;

            const paidTitles = await this.prisma.accounts_receivable.findMany({
                where: {
                    company_id,
                    customer_id: customerId,
                    status: 'paid',
                },
                select: {
                    original_amount: true,
                },
            });

            const totalTitles = customer.open_titles_count + paidTitles.length;
            const totalAmount = customer.total_open_amount + paidTitles.reduce((sum, t) => sum + Number(t.original_amount), 0);

            customer.paid_titles_count = paidTitles.length;
            customer.avg_ticket = totalTitles > 0 ? totalAmount / totalTitles : 0;
            customer.default_rate = totalTitles > 0 ? (customer.open_titles_count / totalTitles) * 100 : 0;

            // Ordenar transações por data
            customer.payment_history.sort((a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            customer.payment_history = customer.payment_history.slice(0, 10); // Últimas 10
        }

        // Converter map para array e aplicar filtros
        let results = Array.from(customerMap.values());

        if (query.min_overdue_days) {
            results = results.filter(c => c.overdue_days_max >= query.min_overdue_days!);
        }

        if (query.min_open_amount) {
            results = results.filter(c => c.total_open_amount >= query.min_open_amount!);
        }

        // Ordenar por maior valor em aberto
        results.sort((a, b) => b.total_open_amount - a.total_open_amount);

        return results;
    }

    async getCustomerPositionById(company_id: string, customer_id: string) {
        const result = await this.getCustomerPosition(company_id, { customer_id });
        return result[0] || null;
    }

    async getSupplierPosition(company_id: string, query: SupplierPositionQueryDto) {
        const whereClause: any = {
            company_id,
            status: { in: ['pending', 'partially_paid', 'overdue'] },
        };

        if (query.supplier_id) {
            whereClause.supplier_id = query.supplier_id;
        }

        if (query.cinema_complex_id) {
            whereClause.cinema_complex_id = query.cinema_complex_id;
        }

        const openTitles = await this.prisma.accounts_payable.findMany({
            where: whereClause,
            include: {
                transactions: {
                    orderBy: { transaction_date: 'desc' },
                },
            },
        });

        const supplierMap = new Map<string, any>();
        const today = new Date();
        const upcomingDate = new Date(today);
        upcomingDate.setDate(upcomingDate.getDate() + (query.upcoming_days || 30));

        for (const title of openTitles) {
            const supplierId = title.supplier_id || 'unknown';

            if (!supplierMap.has(supplierId)) {
                supplierMap.set(supplierId, {
                    supplier_id: supplierId,
                    titles: [],
                    total_open_amount: 0,
                    total_overdue_amount: 0,
                    upcoming_7days_amount: 0,
                    upcoming_15days_amount: 0,
                    upcoming_30days_amount: 0,
                    open_titles_count: 0,
                    payment_history: [],
                    upcoming_payments: [],
                });
            }

            const supplier = supplierMap.get(supplierId);
            const remaining = Number(title.remaining_amount);
            supplier.total_open_amount += remaining;
            supplier.open_titles_count++;

            const dueDate = new Date(title.due_date);
            const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            // Verificar se está vencido
            if (daysUntilDue < 0) {
                supplier.total_overdue_amount += remaining;
            }

            // Calcular vencimentos próximos
            if (daysUntilDue >= 0 && daysUntilDue <= 7) {
                supplier.upcoming_7days_amount += remaining;
                supplier.upcoming_payments.push({
                    id: title.id,
                    document_number: title.document_number,
                    due_date: title.due_date,
                    amount: remaining,
                    days_until_due: daysUntilDue,
                });
            }
            if (daysUntilDue >= 0 && daysUntilDue <= 15) {
                supplier.upcoming_15days_amount += remaining;
            }
            if (daysUntilDue >= 0 && daysUntilDue <= 30) {
                supplier.upcoming_30days_amount += remaining;
            }

            supplier.titles.push({
                id: title.id,
                document_number: title.document_number,
                due_date: title.due_date,
                days_until_due: daysUntilDue,
                original_amount: Number(title.original_amount),
                remaining_amount: remaining,
                status: title.status,
            });

            if (title.transactions && title.transactions.length > 0) {
                supplier.payment_history.push(
                    ...title.transactions.map((t: any) => ({
                        date: t.transaction_date,
                        amount: Number(t.amount),
                        document_number: title.document_number,
                    }))
                );
            }
        }

        // Calcular valores médios
        for (const supplier of supplierMap.values()) {
            supplier.avg_title_amount =
                supplier.open_titles_count > 0
                    ? supplier.total_open_amount / supplier.open_titles_count
                    : 0;

            supplier.payment_history.sort((a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            supplier.payment_history = supplier.payment_history.slice(0, 10);

            supplier.upcoming_payments.sort((a: any, b: any) => a.days_until_due - b.days_until_due);
        }

        const results = Array.from(supplierMap.values());
        results.sort((a, b) => b.total_open_amount - a.total_open_amount);

        return results;
    }

    async getSupplierPositionById(company_id: string, supplier_id: string) {
        const result = await this.getSupplierPosition(company_id, { supplier_id, upcoming_days: 30 });
        return result[0] || null;
    }
}
