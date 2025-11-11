import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client!: Client;

  constructor(private logger: LoggerService) {}

  async onModuleInit() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200/',
      auth: {
        username: process.env.ELASTICSEARCH_USER || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
      },
      requestTimeout: 30000,
      maxRetries: 3,
    });

    await this.waitForElasticsearch();
    await this.initializeTemplate();
  }

  private async waitForElasticsearch(retries: number = 30): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.client.info();
        this.logger.log(
          'Elasticsearch connected successfully',
          'ElasticsearchService',
        );
        return;
      } catch {
        if (i === retries - 1) {
          throw new Error('Failed to connect to Elasticsearch after retries');
        }
        this.logger.warn(
          `Elasticsearch not ready, retrying... (${i + 1}/${retries})`,
          'ElasticsearchService',
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  private async initializeTemplate(): Promise<void> {
    try {
      await this.client.indices.putIndexTemplate({
        name: 'audit-logs-template',
        template: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
          mappings: {
            properties: {
              event_type: { type: 'keyword' },
              resource_type: { type: 'keyword' },
              resource_id: { type: 'keyword' },
              action: { type: 'keyword' },
              company_id: { type: 'keyword' },
              user_id: { type: 'keyword' },
              correlation_id: { type: 'keyword' },
              old_values: { type: 'object', enabled: true },
              new_values: { type: 'object', enabled: true },
              '@timestamp': { type: 'date' },
            },
          },
        },
        index_patterns: ['audit-logs-*'],
      });

      this.logger.log(
        'Elasticsearch template initialized',
        'ElasticsearchService',
      );
    } catch (error) {
      this.logger.error(
        `Failed to initialize template: ${error instanceof Error ? error.message : 'Unknown'}`,
        '',
        'ElasticsearchService',
      );
    }
  }

  async index(params: {
    index: string;
    body: Record<string, unknown>;
    id?: string;
  }): Promise<void> {
    try {
      await this.client.index({
        index: params.index,
        id: params.id,
        document: params.body,
      });
    } catch (error) {
      this.logger.error(
        `Failed to index: ${error instanceof Error ? error.message : 'Unknown'}`,
        '',
        'ElasticsearchService',
      );
      throw error;
    }
  }

  async search(params: {
    index: string;
    query: Record<string, unknown>;
    from?: number;
    size?: number;
    sort?: Array<Record<string, unknown>>;
  }): Promise<Array<Record<string, unknown>>> {
    try {
      const result = await this.client.search({
        index: params.index,
        query: params.query,
        from: params.from || 0,
        size: params.size || 20,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sort: (params.sort || [{ '@timestamp': { order: 'desc' } }]) as any,
      });

      return (
        result.hits.hits as Array<{
          _id: string;
          _source: Record<string, unknown>;
        }>
      ).map((hit) => ({
        id: hit._id,
        ...hit._source,
      }));
    } catch (error) {
      this.logger.error(
        `Search failed: ${error instanceof Error ? error.message : 'Unknown'}`,
        '',
        'ElasticsearchService',
      );
      throw error;
    }
  }

  async deleteIndex(index: string): Promise<void> {
    try {
      await this.client.indices.delete({ index });
      this.logger.log(`Index deleted: ${index}`, 'ElasticsearchService');
    } catch {
      this.logger.warn(
        `Failed to delete index ${index}`,
        'ElasticsearchService',
      );
    }
  }

  async forcemerge(index: string): Promise<void> {
    try {
      await this.client.indices.forcemerge({
        index,
        max_num_segments: 1,
      });
      this.logger.log(`Index optimized: ${index}`, 'ElasticsearchService');
    } catch {
      this.logger.warn(
        `Forcemerge failed for ${index}`,
        'ElasticsearchService',
      );
    }
  }
}
