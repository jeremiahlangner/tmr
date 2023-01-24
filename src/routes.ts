import axios from 'axios';

export const routes = {
  get: {
    '/configuration': async (request, reply) => {
      const configuration = await axios.get('http://192.168.12.1/TMI/v1/network/configuration?get=all')
        .then(res => res.data);
      reply.header('content-type', 'application/json');
      reply.send(configuration);
    },
    '/stats': async (request, reply) => {
      const stats = await axios.get('http://192.168.12.1/TMI/v1/gateway?get=all')
        .then(res => res.data);
      reply.header('content-type', 'application/json');
      reply.send(stats);
    },
  },
  post: {
    '/configuration': async (request, reply) => {
      console.log('attempting to post to configuration');
    },
    '/authorize': async (request, reply) => {
      const { username, password } = JSON.parse(request.body);
      const auth = await axios.post('http://192.168.12.1/TMI/v1/auth/login', {
        username,
        password
      }).then(res => res.data);
      reply.header('content-type', 'application/json');
      reply.send(auth);
    }
  }
}

