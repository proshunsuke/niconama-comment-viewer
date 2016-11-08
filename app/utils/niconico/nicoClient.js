// @flow
import rp from 'request-promise';
import { SerializeCookieStore } from 'tough-cookie-serialize';
import cheerio from 'cheerio';
import net from 'net';
import commentInfo from './commentInfo';

export const LOGIN_URL = 'https://secure.nicovideo.jp/secure/login';
export const GET_PLAYERSTATUS_URL = 'http://watch.live.nicovideo.jp/api/getplayerstatus';

export default class NicoClient {
  constructor() {}

  login(email: string, password: string) {
    const cookieStore = rp.jar(new SerializeCookieStore);
    return rp.post(LOGIN_URL, {
        resolveWithFullResponse: true,
        followAllRedirects: true,
        jar: cookieStore,
        timeout: 5000,
        form: {
          mail_tel: email,
          password: password
        }
      })
      .then((body) => {
        const session = cookieStore._jar.store.findCookie('nicovideo.jp', '/', 'user_session', (err, cookie) => {
          if (cookie) { return `user_session=${cookie.value};`; }
          if (err) { return Promise.reject(err); }
          return Promise.reject('Cannot get user session. Please check your email or password.');
        });
        return Promise.resolve(session);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  liveComments(lv_number: number, session: string, callback: any) {
    return this.getPlayerStatus(lv_number, session)
      .then((xmlString) => {
        const viewer = this.getViewer(xmlString);
        viewer.on('connect',(data) => {
          viewer.setEncoding('utf-8');
          viewer.write('<thread thread="'+this.getThread(xmlString)+'" res_from="-5" version="20061206" />\0');
          viewer.on('data', (data) => {
            callback(this.getCommentInfo(data));
          });
        });
      });
  }

  getViewer(xmlString: string) {
    const $ = cheerio.load(xmlString);
    const status = $('getplayerstatus').attr('status');
    if (status == 'fail') {
      throw ReferenceError('status fail.');
    }
    const port = $('getplayerstatus ms port').eq(0).text();
    const addr = $('getplayerstatus ms addr').eq(0).text();
    return net.connect(port, addr);
  }

  getThread(xmlString: string) {
    const $ = cheerio.load(xmlString);
    return $('getplayerstatus ms thread').eq(0).text();
  }

  getCommentInfo(data: string){
    let $= cheerio.load(data);
    return new commentInfo(
      $('chat').attr('thread'),
      $('chat').attr('no'),
      $('chat').attr('vpos'),
      $('chat').attr('date'),
      $('chat').attr('date_usec'),
      $('chat').attr('mail'),
      $('chat').attr('user_id'),
      $('chat').attr('premium'),
      $('chat').attr('anonymity'),
      $('chat').attr('locale'),
      $('chat').attr('score'),
      $('chat').attr('yourpost'),
      $('chat').attr('deleted'),
      $('chat').text()
    );
  }

  getPlayerStatus(lv_number: number, session: string){
    return rp({
      uri: GET_PLAYERSTATUS_URL,
      qs: {
        v: `lv${lv_number}`
      },
      headers: {
        Cookie: session
      }
    })
      .then((xmlString) => {
        return Promise.resolve(xmlString);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}
