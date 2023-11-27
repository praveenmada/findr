import { readFileSync } from 'fs';
import { DynamoDBClient, PutItemCommand, PutItemOutput, AttributeValue } from '@aws-sdk/client-dynamodb';

/**
 * DynamoDBUploader is a class for uploading data to an Amazon DynamoDB table.
 */
export class DynamoDBUploader {
  /**
   * Amazon DynamoDB client instance.
   * @type {DynamoDBClient}
   * @private
   */
  private dynamoDBClient: DynamoDBClient;

  /**
   * Name of the DynamoDB table.
   * @type {string}
   * @private
   */
  private tableName: string;

  /**
   * File path containing data to be uploaded.
   * @type {string}
   * @private
   */
  private filePath: string;

  /**
   * Constructs a DynamoDBUploader instance.
   *
   * @param {string} tableName - The name of the DynamoDB table.
   * @param {string} filePath - The file path containing data to be uploaded.
   * @param {string} region - The AWS region where the DynamoDB table is located.
   */
  constructor(tableName: string, filePath: string, region: string) {
    this.tableName = tableName;
    this.filePath = filePath;
    this.dynamoDBClient = new DynamoDBClient({ region });
  }

  /**
   * Uploads data from the specified file to the DynamoDB table.
   *
   * @returns {Promise<void>} A Promise that resolves when the upload is successful, or rejects on error.
   */
  public async uploadToDynamoDB(): Promise<void> {
    console.log('Uploading to DynamoDB in DynamoDBUploader.ts');
    
    const fileContent = readFileSync(this.filePath, 'utf-8');
    const lines = fileContent.split('\n');

    for (const line of lines) {
      // Add a check to skip empty lines
      if (!line.trim()) {
        continue;
      }

      try {
        const data = JSON.parse(line);

        // Define the parameters for the PutItem command
        const params = {
          TableName: this.tableName,
          Item: {
            companyName: { S: data.companyName },
            departmentName: { S: data.departmentName },
            timePublished: { S: data.timePublished },
            deviceId: { N: data.deviceId.toString() }, // Use N for numeric attributes
            // Add other attributes as needed for your composite key
            // attributeName: { S: data.attributeName },
          } as { [key: string]: AttributeValue },
        };

        // Create the PutItem command
        const command = new PutItemCommand(params);

        // Execute the PutItem command
        try {
          const result: PutItemOutput = await this.dynamoDBClient.send(command);
          console.log('Item uploaded:', result);
        } catch (error) {
          console.error('Error uploading item:', error);
        }
      } catch (error) {
        console.error('Error parsing line:', error);
      }
    }
  }
}
