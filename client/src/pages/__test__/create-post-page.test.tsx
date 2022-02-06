/* eslint-disable jest/no-conditional-expect */
import { render, screen, userEvent } from '../../test-utils/test-utils';
import { CreatePostPage } from '../create-post-page/create-post-page.component';

import { User } from '../../redux/user/user.types';
import { Post } from '../../redux/post/post.types';

describe('create-post page component tests', () => {
  const setup = () => {
    const postConfirm = {} as Post;

    const createPostStart = jest.fn();
    const clearPostStatuses = jest.fn();
    const getUsersFollowingStart = jest.fn();
    global.URL.createObjectURL = jest.fn();

    render(
      <CreatePostPage
        createPostStart={createPostStart}
        postConfirm={postConfirm}
        postError={null}
        clearPostStatuses={clearPostStatuses}
        getUsersFollowingStart={getUsersFollowingStart}
      />
    );

    return { createPostStart, clearPostStatuses, getUsersFollowingStart };
  };

  const isFile = (
    testObj: FormDataEntryValue | File | null
  ): testObj is File => {
    return (testObj as File).name !== undefined;
  };

  it('renders a create-post page component', () => {
    setup();

    const createPostPage = screen.getByText('Create a New Image Post');

    expect(createPostPage).toBeInTheDocument();
  });

  it("uploading a post image file and clicking 'Upload photo' calls create post start action creator", () => {
    const { createPostStart } = setup();

    const testPostFile = new File(['test-post-file'], 'test-post', {
      type: 'img/jpeg',
    });
    const testCaption = 'This is my test post boiii';
    const testLocation = 'That one chill place';

    const postFileInput: HTMLInputElement =
      screen.getByLabelText('Select photo');
    const captionInput = screen.getByLabelText('Add a caption');
    const locationInput = screen.getByLabelText('Where was this taken?');
    const uploadButton = screen.getByText('Upload photo');

    userEvent.upload(postFileInput, testPostFile);
    userEvent.type(captionInput, testCaption);
    userEvent.type(locationInput, testLocation);
    userEvent.click(uploadButton);

    const testFormData = new FormData();
    testFormData.append('photo', testPostFile, testPostFile.name);
    testFormData.append('caption', testCaption);
    testFormData.append('location', testLocation);

    const mockArgs = createPostStart.mock.calls[0][0];

    if (postFileInput.files && isFile(postFileInput.files[0])) {
      expect(postFileInput.files[0]).toStrictEqual(testPostFile);
    }
    expect(createPostStart).toBeCalled();
    if (isFile(testFormData.get('photo'))) {
      expect(mockArgs.get('photo').name).toEqual(
        (testFormData.get('photo') as File).name
      );
    }
    expect(global.URL.createObjectURL).toBeCalled();
  });
});
