import Fastify from 'fastify';
const fastify = Fastify({
  logger: true
});

async function main(): Promise<void> {
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
