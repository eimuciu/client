import * as signalR from '@microsoft/signalr';

class HubConnection {
  constructor() {
    this.connection;
  }

  async connect() {
    await this.connection.start().catch((err) => console.log(err));
  }

  createConnection(nickname) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5085/connectionHub?nick=${nickname}`)
      .build();
  }
}

export const hubConn = new HubConnection();

// export const connection = new signalR.HubConnectionBuilder()
//   .withUrl('http://localhost:5085/connectionHub')
//   .build();

// export async function connect() {
//   await connection.start().catch((err) => console.log(err));
// }
