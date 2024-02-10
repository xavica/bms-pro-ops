import { FirebaseService } from './firebase.service';
import { HttpClient } from 'aurelia-fetch-client';
import { DataService } from './data.service';
import { BaseConfig } from '../common';

export class MessageQueueService extends DataService {
  controller: string;
  constructor(httpClient: HttpClient, baseConfig: BaseConfig, firebaseService: FirebaseService) {
    super(httpClient, baseConfig, firebaseService);
    this.controller = '';
  }

  postMessageToQueue(inputObj: any): Promise<any> {

    return this.post(`${this.config.apiCoreUrl}/Queue/PostMessage`, inputObj, undefined, true);
  }

}
