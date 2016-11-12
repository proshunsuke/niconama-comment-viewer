// @flow
import userClient from './user';
import liveClient from './live';

export default class NicoClient {
  constructor() {}

  login(email: string, password: string) {
    const client = new userClient();
    return client.login(email, password);
  }

  liveComments(lv_number: number, session: string, callback: any) {
    const client = new liveClient();
    return client.comments(lv_number, session, callback);
  }
}
