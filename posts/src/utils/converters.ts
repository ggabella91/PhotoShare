export const encode = (data: Buffer) => {
  const base64 = data.toString('base64');
  return base64;
};

export const decodeChunk = (base64StringData: string) => {
  const rawData = base64StringData.replace(/data.*;base64,/, '');

  const buffer = Buffer.from(rawData, 'base64');

  return buffer;
};
