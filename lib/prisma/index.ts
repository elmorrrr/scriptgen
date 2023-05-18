import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

// Define a type for the global object
type Global = typeof globalThis;

// Declare the global variable
declare const global: Global & {
  prisma?: PrismaClient;
};

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // If the global prisma object doesn't exist, create it
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
