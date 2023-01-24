export function request(options: Partial<Options> = {}) {
  if (!options.url) return;
  if (!options.method) options.method = 'get';

  return fetch(options.url, options).then(res => res.json());
}

interface Options {
  method: 'get' | 'put' | 'post' | 'head' | 'delete',
  url: string,
  headers: { [key: string]: string },
}
