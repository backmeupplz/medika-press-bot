import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import cheerio from 'cheerio';
import got from 'got/dist/source';
import { sampleSize } from 'lodash';
import { MessageService } from '../message/message.service';

@Injectable()
export class PubmedService {
  constructor(private readonly messageService: MessageService) {}

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  async publishArticles() {
    try {
      // Get articles
      const articles = await this.fetchArticles();
      const articlesIds: string[] = articles.esearchresult.idlist;
      // Shuffle articles
      const articlesId = sampleSize(articlesIds, 3);
      const articlesTitles: string[] = [];
      for (const id of articlesId) {
        const title = await this.getTitle(
          `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        );
        articlesTitles.push(title.replace(' - PubMed', ''));
      }
      // Publish them
      let publishText = '👋 New PubMed articles for today (COVID-19 week):\n\n';
      for (let i = 0; i < 3; i++) {
        publishText += `📖 *${articlesTitles[i]}:* https://pubmed.ncbi.nlm.nih.gov/${articlesId[i]}/\n\n`;
      }
      await this.messageService.sendMessage(publishText);
    } catch (error) {
      console.log(error);
    }
  }

  private fetchArticles() {
    const response = got(
      'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=covid%22last%201%20years%22[dp]%20jsubsetAIM&retmode=json&retmax=1900',
    );
    return response.json<{ esearchresult: any }>();
  }

  private async getTitle(link: string) {
    const response = await got(link);
    const $ = cheerio.load(response.body);
    const title = $('head > title').text();
    return title;
  }
}
