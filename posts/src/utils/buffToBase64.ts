import { Writable } from 'stream';

const buffToBase64 = (binary: Buffer) => {
  const writeableInstanceStream = new Writable({
    write() {
      this.write(binary, 'base64');
      this.on('finish', () => {
        console.log('Finished writing file!');
      });
    },
  });

  return writeableInstanceStream;
};

export { buffToBase64 };
