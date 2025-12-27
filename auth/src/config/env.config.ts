import dotenv from "dotenv";

dotenv.config();


if(process.env.AWS_ACCESS_KEY_ID === undefined || process.env.AWS_SECRET_ACCESS_KEY === undefined || process.env.AWS_REGION === undefined || process.env.AWS_DYNAMODB_TABLE_NAME === undefined || process.env.JWT_SECRET === undefined){
  throw new Error("AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_DYNAMODB_TABLE_NAME, JWT_SECRET are required");
}



export const secrets = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_DYNAMODB_TABLE_NAME: process.env.AWS_DYNAMODB_TABLE_NAME,
  jwtSecret: process.env.JWT_SECRET || "secret",
};

