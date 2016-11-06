import axios from 'axios';
import request from 'request';
import cheerio from 'cheerio';
import net from 'net';

request({
  url: 'http://watch.live.nicovideo.jp/api/getplayerstatus?v=lv281214339',
  headers: {
    Cookie: 'user_session=user_session_13294831_9dbe17cfb94699eddff2c925c9837ee54e50ab15e0ea4c23564f87aae7d9bb2a;',
  },
},function(error,response){
  if(error!=null) throw error;

  console.log(response.body);

  let $= cheerio.load(response.body);
  let port = $('getplayerstatus ms port').eq(0).text();
  let addr = $('getplayerstatus ms addr').eq(0).text();
  let thread = $('getplayerstatus ms thread').eq(0).text();
  let startTime = $('getplayerstatus stream start_time').eq(0).text();
  let userId = $('getplayerstatus user user_id').eq(0).text();
  let ticket = $('getplayerstatus rtmp ticket').eq(0).text();

  console.log(port);
  console.log(addr);
  console.log(thread);
  console.log(startTime);
  console.log(userId);
  console.log(ticket);

  var viewer= net.connect(port,addr);
  viewer.on('connect', function(){
    viewer.setEncoding('utf-8');
    viewer.write('<thread thread="'+thread+'" res_from="-5" version="20061206" />\0');
    viewer.on('data',function(data){
      let $= cheerio.load(data);
      let thread = $('thread').attr('thread');
      let last_res = $('thread').attr('last_res');
      let ticket = $('thread').attr('ticket');
      let block_no = Math.floor(last_res / 100);
      request({
        url: 'http://live.nicovideo.jp/api/getpostkey?thread='+thread+'&block_no='+block_no+'',
        headers: {
          Cookie: 'user_session=user_session_13294831_9dbe17cfb94699eddff2c925c9837ee54e50ab15e0ea4c23564f87aae7d9bb2a;',
        },
      },function(error,response){
        let postKey = response.body;
        postKey = postKey.slice(8, postKey.length);
        console.log(postKey);
        let date = new Date();
        var unixTimestamp = date.getTime();
        let vpos = unixTimestamp - startTime;
        let comment = 'comment"'+last_res+'"';
        viewer.write('<chat thread="'+thread +'" ticket="" vpos="'+vpos+'" postkey="'+postKey+'" mail="184" user_id="'+userId+'" premium="1">'+comment+'</chat>\0');
        viewer.on('data',function(data){
          console.log(data);
        })
      });
    });
  });
});

