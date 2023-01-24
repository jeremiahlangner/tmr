import axios from 'axios';

const baseUrl = 'http://192.168.12.1/TMI/v1/';

export const routes = {
  get: {
    async telemetry(request, reply) {
      const { authorization } = request.headers;
      const configuration = await axios.get(baseUrl + 'network/telemetry?get=all', {
        headers: {
          Authorization: authorization
        }
      }).then(res => res.data);
      reply.header('content-type', 'application/json');
      reply.send(configuration);
    },

    async configuration(request, reply) {
      const { authorization } = request.headers;
      const configuration = await axios.get(baseUrl + 'network/configuration?get=ap', {
        headers: {
          Authorization: authorization
        }
      }).then(res => res.data);
      reply.header('content-type', 'application/json');
      reply.send(configuration);
    },

    async stats(request, reply) {
      const stats = await axios.get(baseUrl + 'gateway?get=all').then(res => res.data);
      reply.header('content-type', 'application/json');
      reply.send(stats);
    },
  },
  post: {
    async configuration(request, reply) {
      console.log('attempting to post to configuration');
    },

    async authorize(request, reply) {
      const { username, password } = JSON.parse(request.body);
      const auth = await axios.post(baseUrl + 'auth/login', {
        username,
        password
      }).then(res => res.data);
      reply.header('content-type', 'application/json');
      reply.send(auth);
    }
  }
}

