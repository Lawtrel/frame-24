import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from 'src/common/elasticsearch/elasticsearch.service';

interface ESRangeQuery {
  gte?: string;
  lte?: string;
}

interface ESTermQuery {
  [key: string]: string;
}

interface ESBoolQuery {
  must: Array<{ term: ESTermQuery } | { range: Record<string, ESRangeQuery> }>;
}

interface ESQuery {
  bool: ESBoolQuery;
}

@Injectable()
export class AuditLogRepository {
  constructor(private elasticsearch: ElasticsearchService) {}

  async findByCompany(
    companyId: string,
    filters?: {
      eventType?: string;
      resourceType?: string;
      resourceId?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      skip?: number;
      take?: number;
      sortBy?:
        | 'company_id'
        | 'event_type'
        | 'resource_type'
        | 'action'
        | 'created_at';
      sortOrder?: 'asc' | 'desc';
    },
  ) {
    const query: ESQuery = {
      bool: {
        must: [{ term: { company_id: companyId } }],
      },
    };

    if (filters?.eventType) {
      query.bool.must.push({ term: { event_type: filters.eventType } });
    }
    if (filters?.resourceType) {
      query.bool.must.push({ term: { resource_type: filters.resourceType } });
    }
    if (filters?.resourceId) {
      query.bool.must.push({ term: { resource_id: filters.resourceId } });
    }
    if (filters?.userId) {
      query.bool.must.push({ term: { user_id: filters.userId } });
    }

    if (filters?.startDate || filters?.endDate) {
      const rangeQuery: ESRangeQuery = {};
      if (filters?.startDate) rangeQuery.gte = filters.startDate.toISOString();
      if (filters?.endDate) rangeQuery.lte = filters.endDate.toISOString();
      query.bool.must.push({ range: { '@timestamp': rangeQuery } });
    }

    let sortField = '@timestamp';
    if (filters?.sortBy === 'created_at') {
      sortField = '@timestamp';
    } else if (filters?.sortBy) {
      sortField = filters.sortBy;
    }

    return this.elasticsearch.search({
      index: 'audit-logs-*',
      query: query as unknown as Record<string, unknown>,
      from: filters?.skip || 0,
      size: filters?.take || 20,
      sort: [
        {
          [sortField]: {
            order: filters?.sortOrder || 'desc',
          },
        },
      ],
    });
  }

  async findByResourceId(
    companyId: string,
    resourceId: string,
    filters?: {
      skip?: number;
      take?: number;
    },
  ) {
    const query: ESQuery = {
      bool: {
        must: [
          { term: { company_id: companyId } },
          { term: { resource_id: resourceId } },
        ],
      },
    };

    return this.elasticsearch.search({
      index: 'audit-logs-*',
      query: query as unknown as Record<string, unknown>,
      from: filters?.skip || 0,
      size: filters?.take || 20,
      sort: [{ '@timestamp': { order: 'desc' } }],
    });
  }

  async findByResourceType(
    companyId: string,
    resourceType: string,
    filters?: {
      skip?: number;
      take?: number;
    },
  ) {
    const query: ESQuery = {
      bool: {
        must: [
          { term: { company_id: companyId } },
          { term: { resource_type: resourceType } },
        ],
      },
    };

    return this.elasticsearch.search({
      index: 'audit-logs-*',
      query: query as unknown as Record<string, unknown>,
      from: filters?.skip || 0,
      size: filters?.take || 20,
      sort: [{ '@timestamp': { order: 'desc' } }],
    });
  }
}
