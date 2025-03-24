import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase"; // Assuming your Firebase initialization is in 'firebase.js'

export async function saveImageToFirebase(imageBlob: Blob) {
  try {
    // Create a unique file reference
    const imageRef = ref(storage, `images/${Date.now()}.jpg`);

    // Upload the Blob to Firebase Storage
    const uploadTask = uploadBytes(imageRef, imageBlob); // Use uploadBytesResumable for larger files

    // Wait for the upload to complete
    await uploadTask;

    // Get the downloadable URL
    const downloadURL = await getDownloadURL(imageRef); // Use imageRef, not snapshot.ref

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function deleteImageFromFirebase(imageUrl: string) {
  try {
    // Create a reference to the file to delete
    const imageRef = ref(storage, imageUrl);

    // Delete the file
    await deleteObject(imageRef);

    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}