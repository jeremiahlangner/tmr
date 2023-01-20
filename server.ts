import Fastify from 'fastify';
import axios from 'axios';
import { readdirSync, readFileSync } from 'fs';

const fastify = Fastify({
  logger: false
});

async function main(): Promise<void> {
  const files = {};
  const list = readdirSync('./build/');

  // fast routes
  list.forEach(f => {
    files[f] = readFileSync('./build/' + f, { encoding: 'utf8' });
    fastify.get('/' + f, async (request, reply) => {
      if (f.includes('.html'))
        reply.header('content-type', 'text/html');
      if (f.includes('.css'))
        reply.header('content-type', 'text/css');
      reply.send(files[f]);
    });
  });
  fastify.get('/', async (request, reply) => {
    const file = readFileSync('./build/index.html', { encoding: 'utf8' })
    reply.header('content-type', 'text/html');
    reply.send(file);
  });
  fastify.get('/stats', async (request, reply) => {
    const stats = await axios.get('http://192.168.12.1/TMI/v1/gateway?get=all').then(res => res.data);
    reply.header('content-type', 'application/json');
    reply.send(stats);
  });
  fastify.post('/authorize', {}, async (request, reply) => {
    const { username, password } = JSON.parse(request.body);
    const auth = await axios.post('http://192.168.12.1/TMI/v1/auth/login', {
      username,
      password
    }).then(res => res.data);
    reply.header('content-type', 'application/json');
    reply.send(auth);
  });

  try {
    await fastify.listen({
      port: 3000
    });
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }
}

main();
