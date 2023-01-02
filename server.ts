import Fastify from 'fastify';
import { readdirSync, readFileSync } from 'fs';

const fastify = Fastify({
  logger: true
});

async function main(): Promise<void> {
  const files = {};
  const list = readdirSync('./build/');

  list.forEach(f => {
    files[f] = readFileSync('./build/' + f, { encoding: 'utf8' });
    fastify.get('/' + f, async (request, reply) => files[f]);
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
