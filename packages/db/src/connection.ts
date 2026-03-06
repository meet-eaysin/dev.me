import mongoose from "mongoose";

export async function connectMongoDB(uri: string): Promise<void> {
  await mongoose.connect(uri);
}

export async function disconnectMongoDB(): Promise<void> {
  await mongoose.disconnect();
}

mongoose.connection.on("connected", () => {
  // Silent
});

mongoose.connection.on("error", () => {
  // Silent
});

mongoose.connection.on("disconnected", () => {
  // Silent
});
