import { Readable } from 'stream';

const buffToStream = (binary: Buffer): Readable => {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary);
      this.push(null);
    },
  });

  return readableInstanceStream;
};

export { buffToStream };
