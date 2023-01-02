self.onmessage = (e) => {
  console.log(e);
  self.postMessage('world');
};
