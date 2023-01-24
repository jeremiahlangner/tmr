import Fastify from 'fastify';
import { readdirSync, readFileSync } from 'fs';
import { routes } from './routes';

// currently runs from execution dir?
(async () => {
  const fastify = Fastify({
    logger: false
  });
  const files = {};
  const list = readdirSync('./build/');

  // Files
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

  // Index; ignoring queries for now.
  fastify.get('/', async (request, reply) => {
    const file = readFileSync('./build/index.html', { encoding: 'utf8' });
    reply.header('content-type', 'text/html');
    reply.send(file);
  });

  // routing
  for (const method in routes) {
    for (const route in routes[method]) {
      fastify[method]('/' + route, routes[method][route]);
    }
  }

  try {
    await fastify.listen({
      port: 3000
    });
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }
})();

