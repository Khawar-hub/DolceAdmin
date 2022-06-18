
import {firebase} from './config'
const storage =firebase.storage()
export const multiImageUpload = async (imageFileList) => {
  let imagesUrlArray = [];
  let imageUrl = "";
  // array of files
  let arr = imageFileList.map((item) => {
    return item.originFileObj;
  });

  for (let i = 0; i < arr.length; i++) {
    const upload = await storage.ref("/Products/" + arr[i].name).put(arr[i]);
    imageUrl = await upload.ref.getDownloadURL();
    imagesUrlArray.push(imageUrl);
  }

  return imagesUrlArray; // array of URLS of uploaded files
};

export const singleImageUpload = async (path, imageFile) => {

  const upload = await storage.ref(`/${path}/${imageFile.name}`).put(imageFile);
  const imageUrl = await upload.ref.getDownloadURL();
  return imageUrl;
};
