import { HttpService, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { shuffle } from 'lodash';
import { MessageService } from '../message/message.service';

@Injectable()
export class PubmedService {
  constructor(
    private readonly httpService: HttpService,
    private readonly messageService: MessageService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  async publishArticles() {
    try {
      const articles = await (await this.fetchArticles()).data;
      const articlesIds: string[] = articles.esearchresult.idlist;
      const shuffledArticlesId = shuffle(articlesIds);
      const articlesToPublish = shuffledArticlesId.splice(0, 5);
      articlesToPublish.forEach(async (id: string) => {
        await this.messageService.sendMessage(id);
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async fetchArticles() {
    const response = this.httpService.get(
      'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=%22last%201%20days%22[dp]%20jsubsetAIM&retmode=json',
    );
    return response.toPromise();
  }
}
