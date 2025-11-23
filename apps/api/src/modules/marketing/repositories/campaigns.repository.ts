import { Injectable } from '@nestjs/common';
import {
  promotional_campaigns as Campaign,
  promotional_coupons as Coupon,
  Prisma,
} from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CampaignsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCampaign(
    data: Prisma.promotional_campaignsUncheckedCreateInput,
  ): Promise<Campaign> {
    return this.prisma.promotional_campaigns.create({ data });
  }

  async updateCampaign(
    id: string,
    data: Prisma.promotional_campaignsUpdateInput,
  ): Promise<Campaign> {
    return this.prisma.promotional_campaigns.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<Campaign | null> {
    return this.prisma.promotional_campaigns.findUnique({
      where: { id },
      include: {
        promotion_types: true,
      },
    });
  }

  async findByCode(
    company_id: string,
    campaign_code: string,
  ): Promise<Campaign | null> {
    return this.prisma.promotional_campaigns.findFirst({
      where: { company_id, campaign_code },
      include: {
        promotion_types: true,
      },
    });
  }

  async findAllByCompany(company_id: string): Promise<Campaign[]> {
    return this.prisma.promotional_campaigns.findMany({
      where: { company_id },
      orderBy: { start_date: 'desc' },
      include: {
        promotion_types: true,
      },
    });
  }

  async createCoupon(
    data: Prisma.promotional_couponsCreateInput,
  ): Promise<Coupon> {
    return this.prisma.promotional_coupons.create({ data });
  }

  async findActiveCouponByCode(
    company_id: string,
    coupon_code: string,
  ): Promise<(Coupon & { promotional_campaigns: Campaign }) | null> {
    const now = new Date();
    return this.prisma.promotional_coupons.findFirst({
      where: {
        coupon_code,
        active: true,
        used: false,
        start_date: { lte: now },
        end_date: { gte: now },
        promotional_campaigns: {
          company_id,
          active: true,
        },
      },
      include: {
        promotional_campaigns: true,
      },
    });
  }

  async markCouponAsUsed(coupon_id: string): Promise<void> {
    await this.prisma.promotional_coupons.update({
      where: { id: coupon_id },
      data: {
        used: true,
        used_count: { increment: 1 },
        last_use_date: new Date(),
      },
    });
  }

  async incrementCampaignUsage(campaign_id: string): Promise<void> {
    await this.prisma.promotional_campaigns.update({
      where: { id: campaign_id },
      data: { used_count: { increment: 1 } },
    });
  }

  async createPromotionUsage(
    data: Prisma.promotions_usedUncheckedCreateInput,
  ): Promise<void> {
    await this.prisma.promotions_used.create({ data });
  }

  async countCustomerUsage(
    campaign_id: string,
    customer_id: string,
  ): Promise<number> {
    return this.prisma.promotions_used.count({
      where: {
        campaign_id,
        customer_id,
      },
    });
  }
}
