import * as signalR from '@microsoft/signalr';
import { apiURL } from '../helpers/constants';

class HubConnection {
  constructor() {
    this.connection;
  }

  async connect() {
    await this.connection.start().catch((err) => console.log(err));
  }

  createConnection(nickname) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiURL}/connectionHub?nick=${nickname}`)
      .build();
  }
}

export const hubConn = new HubConnection();
