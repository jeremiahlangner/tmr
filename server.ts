import Fastify from 'fastify';
import axios from 'axios';
import { readdirSync, readFileSync } from 'fs';

const fastify = Fastify({
  logger: true
});

async function main(): Promise<void> {
  const files = {};
  const list = readdirSync('./build/');

  // fast routes
  list.forEach(f => {
    files[f] = readFileSync('./build/' + f, { encoding: 'utf8' });
    fastify.get('/' + f, async () => files[f]);
  });
  fastify.get('/', async () => readFileSync('./build/index.html', { encoding: 'utf8' }));
  fastify.get('/stats', async () => {
    return await axios.get('http://192.168.12.1/TMI/v1/gateway?get=all').then(res => res.data);
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
