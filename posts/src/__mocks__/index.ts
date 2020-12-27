interface UploadParams {
  Bucket: string;
  Key: string;
  Body: string;
}

interface DeleteParams {
  Bucket: string;
  Key: string;
}

const AWS = {
  S3: class {
    constructor() {}

    upload(params: UploadParams, cb: () => void) {
      cb();
    }

    deleteObject(params: DeleteParams, cb: () => void) {
      cb();
    }
  },
};

export default AWS;
