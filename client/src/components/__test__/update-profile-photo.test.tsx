import { render, screen, userEvent } from '../../test-utils/test-utils';

import { UpdateProfilePhoto } from '../update-profile-photo/update-profile-photo.component';

describe('update-profile-photo component tests', () => {
  const setup = () => {
    const updateProfilePhotoStart = jest.fn();
    const changeInfoStart = jest.fn();
    const clearProfilePhotoStatuses = jest.fn();
    global.URL.createObjectURL = jest.fn();

    render(
      <UpdateProfilePhoto
        updateProfilePhotoStart={updateProfilePhotoStart}
        changeInfoStart={changeInfoStart}
        clearProfilePhotoStatuses={clearProfilePhotoStatuses}
      />
    );

    return {
      updateProfilePhotoStart,
      changeInfoStart,
      clearProfilePhotoStatuses,
    };
  };

  it('renders an update-profile-photo component', () => {
    setup();

    const updateProfilePhoto = screen.getByText(/Update your profile photo/i);

    expect(updateProfilePhoto).toBeInTheDocument();
  });

  it('uploading a photo and clicking clicking upload photo calls update profile photo action creator', () => {
    const { updateProfilePhotoStart } = setup();

    const testPhotoFile = new File(['test-photo-file'], 'test-photo', {
      type: 'img/jpeg',
    });

    const fileInput: HTMLInputElement = screen.getByTestId('file-input');

    const uploadButton = screen.getByText(/Upload photo/i);

    userEvent.upload(fileInput, testPhotoFile);

    userEvent.click(uploadButton);

    if (fileInput.files) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(fileInput.files[0]).toStrictEqual(testPhotoFile);
    }
    expect(updateProfilePhotoStart).toBeCalled();
    expect(global.URL.createObjectURL).toBeCalled();
  });
});
