import { Module, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { connectMongoDB, disconnectMongoDB } from '@repo/db';
import { createRedisConnection, initQueues } from '@repo/queue';
import { env } from './shared/utils/env';

// Modules
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { GraphModule } from './modules/graph/graph.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { LLMConfigModule } from './modules/llm-config/llm-config.module';
import { NotionModule } from './modules/notion/notion.module';
import { ReviewModule } from './modules/review/review.module';
import { SearchModule } from './modules/search/search.module';
import { SummaryModule } from './modules/summary/summary.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    AnalyticsModule,
    AuthModule,
    DocumentsModule,
    GraphModule,
    IngestionModule,
    KnowledgeModule,
    LLMConfigModule,
    NotionModule,
    ReviewModule,
    SearchModule,
    SummaryModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit() {
    await connectMongoDB(env.MONGODB_URI);
    initQueues(createRedisConnection(env.REDIS_URL));
  }

  async onApplicationShutdown() {
    await disconnectMongoDB();
  }
}
