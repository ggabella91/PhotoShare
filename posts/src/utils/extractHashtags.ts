const extractHashtags = (caption: string): string[] => {
  return caption
    .split(' ')
    .filter((word) => word.indexOf('#') === 0)
    .map((word) => word.substring(1));
};

export { extractHashtags };
