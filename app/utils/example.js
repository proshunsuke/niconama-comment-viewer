// @flow
import nicoClient from './niconico/nico-client'

const email = process.argv[2];
const password = process.argv[3];

let client = new nicoClient();
client.login(email, password)
  .then(function(session){
    console.log(session);
  });
