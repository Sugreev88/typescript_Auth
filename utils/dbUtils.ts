import mongoose from "mongoose";
const mongoUri = process.env.MONGO_URI as string;

export const connectDb = () => {
  mongoose
    .connect(mongoUri, { tls: false, ssl: false })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log(error);
    });
};

// import { MongoClient, ServerApiVersion } from "mongodb";

// const uri = "";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(mongoUri, {
//   ssl: false,
//   tls: false,
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// export async function connectDb() {
//   try {
//     console.log("connect");
//     // Connect the client to the server
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   } finally {
//     // Uncomment this line if you want to close the connection after the operation
//     // await client.close();
//   }
// }

// // Call connectDb() only when you need to connect
// // connectDb().catch(console.dir);
