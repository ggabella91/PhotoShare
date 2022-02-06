# PhotoShare App

A social networking app where users can upload and share their photos.

Coming soon - support for uploading and sharing videos!

The backend implements a microservices-oriented architecture in Node.js, with NATS Streaming Server facilitating communication between different services. Each service is containerized with Docker, and container management and orchestration is handled by Kubernetes.

The auth service uses jwt and cookies for user athentication.

The posts service uses the aws-sdk to connect to S3 for saving and fetching images, and also uses Redis to cache image files for faster loading upon refresh.

The email service sends emails using PUG HTML templates and Nodemailer.

Each service uses custom error classes, middlewares, and NATS Streaming event types found in a common shared library.

The client is built in React and uses Redux for state management.
