import axios from "axios";

export const preRequestFun = async (file, position) => {
  const baseUrl = import.meta.env.VITE_APP_BE_API_KEY ?? "";
  const url = ` ${baseUrl}/api/v1/s3url`;
  const requestBody = {
    files: [
      {
        position: position,
        file_type: file.type,
      },
    ],
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" },
    });
    const preReq = response.data.data[0];

    if (!preReq.url) {
      throw new Error("The URL is not defined in the response.");
    }
    await axios.put(preReq.url, file, {
      headers: { "Content-Type": file.type },
    });

    return preReq;
  } catch (error) {
    console.error("Error uploading file:", error.message || error);
    throw new Error("File upload failed");
  }
};
