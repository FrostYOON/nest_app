import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { AwsConfigService } from '../../config/aws/config.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';

@Injectable()
export class S3Service {
  private s3: S3Client;
  constructor(private readonly awsConfigService: AwsConfigService) {
    this.s3 = new S3Client({
      region: this.awsConfigService.awsRegion!,
      credentials: {
        accessKeyId: this.awsConfigService.awsAccessKeyId!,
        secretAccessKey: this.awsConfigService.awsSecretAccessKey!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, dirPath: string) {
    const date = new Date();
    const fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${dirPath}/${file.originalname}`;
    const uploadParams = {
      Bucket: this.awsConfigService.awsBucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));
    return `https://${this.awsConfigService.awsBucketName}.s3.${this.awsConfigService.awsRegion}.amazonaws.com/${fileName}`;
  }
}
