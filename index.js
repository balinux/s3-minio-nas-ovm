const Minio = require("minio");

// Instantiate the MinIO client with the object store service
// endpoint and an authorized user's credentials
// play.min.io is the MinIO public test cluster
const minioClient = new Minio.Client({
  endPoint: process.env.S3_MINIO_ENDPOINT,
  port: parseInt(process.env.S3_MINIO_PORT, 10),
  useSSL: process.env.S3_MINIO_SSL.toLowerCase() === "true",
  accessKey: process.env.S3_MINIO_ACCESS_KEY,
  secretKey: process.env.S3_MINIO_SECRET_KEY,
});

// File to upload
const sourceFile = "./test.txt";

// Destination bucket
const bucket = "demo-app";

// Destination object name
const destinationObject = "demo-app-dir";

// Check if the bucket exists
// If it doesn't, create it
async function uploadFile() {
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (exists) {
      console.log("Bucket " + bucket + " exists.");
    } else {
      await minioClient.makeBucket(bucket, "us-east-1");
      console.log("Bucket " + bucket + ' created in "us-east-1".');
    }

    // Set the object metadata
    var metaData = {
      "Content-Type": "text/plain",
      "X-Amz-Meta-Testing": 1234,
      example: 5678,
    };

    // Upload the file with fPutObject
    // If an object with the same name exists,
    // it is updated with new data
    await minioClient.fPutObject(
      bucket,
      destinationObject,
      sourceFile,
      metaData,
    );
    console.log(
      "File " +
        sourceFile +
        " uploaded as object " +
        destinationObject +
        " in bucket " +
        bucket,
    );
  } catch (error) {
    console.log("Error occurred: ", error);
  }
}

uploadFile();