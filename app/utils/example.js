// @flow
// flow; babel-node app/utils/example.js email password
//
//コメ番: 430     ユーザーID: 31682722    時間: 2:14:53    コメント: ゲーミングＰＣ買えば解決だ、さっさと買え  プレミア: 1      NGスコア: undefined
//コメ番: 431     ユーザーID: 29063508    時間: 2:14:54    コメント: 人生いろいろパソコンいろいろ      プレミア: undefined      NGスコア: undefined
//コメ番: 432     ユーザーID: nMcbSh1JZNh-WsIDNnlb5VxlVqA 時間: 2:14:55    コメント: 文字が多い３行で  プレミア: 1      NGスコア: -1632
//コメ番: 433     ユーザーID: 11933424    時間: 2:15:5    コメント: 毒飲め    プレミア: 1      NGスコア: undefined

import NicoClient from './niconico/nicoClient'

const email = process.argv[2];
const password = process.argv[3];

let client = new NicoClient();
// ログイン
//client.login(email, password)
//  .then(function(session){
//    console.log(session);
//  });

const live_number = 281743951;
const session = 'user_session=user_session_13294831_62b5680bddf575eed836352e89c02b57b926254f0f28598c5393a1863430e1a2;';

// コメント取得
client.liveComments(live_number, session, comment => {
  if (comment['comment'].match(/^\/hb ifseetno \d.*$/) && comment['premium'] === '3') {
    return;
  }
  console.log(
    `コメ番: ${comment['no']}\tユーザーID: ${comment['user_id']}\t時間: ${timestampToDateformat(comment['date'])}\t
    コメント: ${comment['comment']}\tプレミア: ${comment['premium']}\t NGスコア: ${comment['score']}\t 部屋: ${comment['roomLabel']}`
  );
});

function timestampToDateformat(timestamp){
  const date = new Date(timestamp * 1000);
  const hour    = date.getHours();
  const minute  = date.getMinutes();
  const seconds = date.getSeconds();
  return `${hour}:${minute}:${seconds}`;
}
