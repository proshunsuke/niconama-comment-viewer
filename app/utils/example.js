// @flow
import nicoClient from './niconico/nicoClient'

const email = process.argv[2];
const password = process.argv[3];

let client = new nicoClient();
// ログイン
client.login(email, password)
  .then(function(session){
    console.log(session);
  });

const live_number = 281432864;
const session = 'user_session=user_session_13294831_cc4532331cdd38e320f524400869ddfc684c590a7921167b9fa7496bf071a602;';

// コメント取得
client.liveComments(live_number, session, (comment) => {
  console.log(
    `コメ番: ${comment['no']}\tユーザーID: ${comment['user_id']}\t時間: ${timestampToDateformat(comment['date'])}\t
    コメント: ${comment['comment']}\tプレミア: ${comment['premium']}\t NGスコア: ${comment['score']}`
  );
});

function timestampToDateformat(timestamp){
  const date = new Date(timestamp * 1000);
  const hour    = date.getHours();
  const minute  = date.getMinutes();
  const seconds = date.getSeconds();
  return `${hour}:${minute}:${seconds}`;
}
