import prismaclient from "../prisma/prisma";

export async function getPDFs(userId: string) {
  try {
    return await prismaclient.pDF.findMany({
      where: { userId },
    });
  } catch {
    throw new Error("Error fetching PDFs");
  }
}

export async function uploadPDF(
  _: any,
  args: {
    name: string;
    mimeType: string;
    data: string;
    userId: string;
  }
) {
  try {
    return await prismaclient.pDF.create({
      data: {
        name: args.name,
        mimeType: args.mimeType,
        data: args.data,
        userId: args.userId,
      },
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return null;
  }
}
