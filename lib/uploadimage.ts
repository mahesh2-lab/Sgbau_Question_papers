export async function uploadImage(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/uploadimage", {
      method: "POST",
      body: formData,
    });


    const data = await res.json();
    console.log("Upload successful:", data);

    return data.url || null;
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
}
