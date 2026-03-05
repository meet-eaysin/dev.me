import { Client } from '@notionhq/client';
import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class NotionClient {
  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async listDatabases(token: string) {
    const notion = new Client({ auth: token });
    try {
      const response = await notion.search({});

      const results = response.results as unknown[] as DatabaseObjectResponse[];
      return results
        .filter((result) => result.object === 'database')
        .map((db) => ({
          id: db.id,
          title: db.title?.[0]?.plain_text || 'Untitled',
        }));
    } catch {
      throw new InternalServerErrorException('Failed to list Notion databases');
    }
  }

  async createPage(
    token: string,
    databaseId: string,
    doc: {
      title: string;
      content?: string | undefined;
      url?: string | undefined;
    },
  ) {
    const notion = new Client({ auth: token });
    await this.delay(350); // Rate limit
    try {
      const response = (await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          title: {
            title: [{ text: { content: doc.title } }],
          },
          ...(doc.url ? { URL: { url: doc.url } } : {}),
        },
        children: doc.content
          ? [
              {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: doc.content.substring(0, 2000) },
                    },
                  ],
                },
              },
            ]
          : [],
      })) as PageObjectResponse;
      return response.id;
    } catch {
      throw new InternalServerErrorException('Failed to create Notion page');
    }
  }

  async updatePage(
    token: string,
    pageId: string,
    doc: {
      title: string;
      content?: string | undefined;
      url?: string | undefined;
    },
  ) {
    const notion = new Client({ auth: token });
    await this.delay(350); // Rate limit
    try {
      await notion.pages.update({
        page_id: pageId,
        properties: {
          title: {
            title: [{ text: { content: doc.title } }],
          },
          ...(doc.url ? { URL: { url: doc.url } } : {}),
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to update Notion page');
    }
  }

  async deletePage(token: string, pageId: string) {
    const notion = new Client({ auth: token });
    await this.delay(350); // Rate limit
    try {
      await notion.pages.update({
        page_id: pageId,
        archived: true,
      });
    } catch {
      throw new InternalServerErrorException('Failed to delete Notion page');
    }
  }
}
