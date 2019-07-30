// tslint:disable max-line-length
import { Logger } from '@nestjs/common'

export class MongooseConfig {
  private readonly logger = new Logger(MongooseConfig.name);

  public configure(): string {
    let connectionString = '';
    const mongoUser: string = process.env.MONGO_USER;
    const mongoPass: string = process.env.MONGO_PASS;
    const mongoRepSetUri = `${process.env.MONGO_HOST0}:${process.env.MONGO_PORT},${process.env.MONGO_HOST1}:${process.env.MONGO_PORT},${process.env.MONGO_HOST2}:${process.env.MONGO_PORT}`;
    const mongoDevUri = `${process.env.MONGO_HOST0}:${process.env.MONGO_PORT}`;
    const mongoDbName: string = process.env.MONGO_DB;
    const mongoReplicaSet: string = process.env.MONGO_REPLICA_SET;

    this.logger.log('Configuring Mongoose Options');
    return (connectionString = mongoReplicaSet
      ? `mongodb://${mongoUser}:${mongoPass}@${mongoRepSetUri}/${mongoDbName}?ssl=true&replicaSet=${mongoReplicaSet}&authSource=admin`
      : `mongodb://${mongoDevUri}/${mongoDbName}?authSource=admin`);
  }
}

import * as mongoose from "mongoose"; // mongoose 5.x.x use global Promise be default.

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
// mongoose.set('useNewUrlParser', true);

mongoose.connect(<string>process.env.MONGODB_URI, {useNewUrlParser: true}).then(
    (): void => { console.log("connected to Database");},
).catch((err: any): void => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

export default mongoose;
