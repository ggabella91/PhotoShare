/* eslint-disable jest/no-conditional-expect */
import { render, screen, userEvent } from '../../test-utils/test-utils';
import { CreatePostPage } from '../create-post-page/create-post-page.component';

describe('create-post page component tests', () => {
  const setup = () => {
    console.error = jest.fn();
    global.URL.createObjectURL = jest.fn();

    render(<CreatePostPage />);
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

  it("uploading a post image file and clicking 'Upload photo' calls create post start action creator without throwing an error", () => {
    setup();

    const testPostFile = new File(['test-post-file'], 'test-post', {
      type: 'img/jpeg',
    });
    const testCaption = 'This is my test post';
    const testLocation = 'That one chill place';

    const postFileInput: HTMLInputElement = screen.getByTestId('file-input');
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

    if (postFileInput.files && isFile(postFileInput.files[0])) {
      expect(postFileInput.files[0]).toStrictEqual(testPostFile);
    }
    expect(global.URL.createObjectURL).toBeCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});
