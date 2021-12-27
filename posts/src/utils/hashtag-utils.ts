import { Query } from 'mongoose';
import { Hashtag, HashtagDoc } from '../models/hashtag';

const extractHashtags = (caption: string): string[] => {
  return caption
    .split(' ')
    .filter((word) => word.indexOf('#') === 0)
    .map((word) => word.substring(1));
};

const saveOrUpdateHashtagEntries = async (hashtags: string[]) => {
  const hashtagQueries: Query<HashtagDoc[], HashtagDoc>[] = [];
  const hashtagPromises: Promise<HashtagDoc | null>[] = [];

  hashtags.forEach((hashtag) => hashtagQueries.push(Hashtag.find({ hashtag })));

  let hashtagQueryResults: HashtagDoc[][];

  try {
    hashtagQueryResults = await Promise.all(hashtagQueries);
  } catch (err) {
    console.log('Error querying for hashtags: ', err);
  }

  hashtags.forEach((hashtag, idx) => {
    if (hashtagQueryResults[idx].length) {
      console.log(
        `Previous entry found for hashtag: ${hashtag}. Updating post count...`
      );

      hashtagPromises.push(
        Hashtag.findOneAndUpdate({ hashtag }, { $inc: { postCount: 1 } }).exec()
      );
    } else {
      console.log(
        `No previous entry found for hashtag: ${hashtag}. Saving new entry...`
      );
      hashtagPromises.push(Hashtag.build({ hashtag, postCount: 1 }).save());
    }
  });

  try {
    const hashtagPromiseResults = await Promise.all(hashtagPromises);

    console.log('Hashtag entries saved / updated: ', hashtagPromiseResults);
  } catch (err) {
    console.log('Error saving / updating hashtag entries: ', err);
  }
};

export { extractHashtags, saveOrUpdateHashtagEntries };
