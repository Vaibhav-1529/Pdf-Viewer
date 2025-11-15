import prismaclient from "../prisma/prisma";

export async function getPDFs(_: any, args: { userId: string }) {
  try {
    return await prismaclient.pDF.findMany({ where: { userId: args.userId } });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    throw new Error("Error fetching PDFs");
  }
}

export async function uploadPDF(
  _: any,
  args: { name: string; mimeType: string; data: string; userId: string }
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
    throw new Error("Error uploading PDF");
  }
}
export async function deletePDF(_: any, args: { id: string }) {
  try {
    await prismaclient.pDF.delete({ where: { id: args.id } });
    return true;
  } catch (error) {
    console.error("Error deleting PDF:", error);
    throw new Error("Error deleting PDF");
  } 
}