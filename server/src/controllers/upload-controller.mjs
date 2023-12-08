import storeFileInformation from "../models/files.mjs";

export const uploadFile = (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const fileName = req.file.originalname;
    const fileData = req.file.buffer;

    storeFileInformation(userId, fileName, fileData);

    console.log(userId, fileName, fileData);
    res.json('File uploaded successfully!');
  } else {
    res.status(401).send('User not authenticated');
  }
};
