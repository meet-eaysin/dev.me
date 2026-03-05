import mongoose from "mongoose";

export async function connectMongoDB(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log("[DB] Connected to MongoDB");
  } catch (error) {
    console.error("[DB] MongoDB connection error:", error);
    process.exit(1);
  }
}

export async function disconnectMongoDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("[DB] Disconnected from MongoDB");
  } catch (error) {
    console.error("[DB] MongoDB disconnection error:", error);
  }
}

mongoose.connection.on("connected", () => {
  console.log("[DB] Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("[DB] Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("[DB] Mongoose disconnected");
});
