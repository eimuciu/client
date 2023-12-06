import * as signalR from '@microsoft/signalr';
import { apiURL } from '../helpers/constants';

class GroupHub {
  constructor() {
    this.connection;
  }

  async connect() {
    await this.connection.start().catch((err) => console.log(err));
  }

  createConnection(nickname, groupname) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiURL}/groupHub?nick=${nickname}&groupname=${groupname}`)
      .build();
  }
}

export const groupHub = new GroupHub();
