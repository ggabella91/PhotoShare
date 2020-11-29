const encode = (data: Buffer) => {
  const base64 = data.toString('base64');
  return base64;
};

export { encode };
