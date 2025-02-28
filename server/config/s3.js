// config/s3.js
const AWS = require("aws-sdk");

// Configure the AWS environment with credentials and region
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // your AWS access key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // your AWS secret key
  region: process.env.AWS_REGION, // your AWS region, e.g., "us-east-1"
});

// Optional helper function to upload a file to S3.
const uploadFile = (bucketName, key, fileBuffer, contentType) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  };

  return s3.upload(params).promise();
};

module.exports = { s3, uploadFile };
