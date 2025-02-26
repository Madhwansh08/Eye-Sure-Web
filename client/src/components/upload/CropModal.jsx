import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";// We'll define this helper below

const CropModal = ({ image, side, onCropSave, onClose }) => {
  // "image" is a base64 string, not a File
  const [imageUrl, setImageUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (image) {
      // This is already a base64 string
      setImageUrl(image);
    }
  }, [image]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    if (!imageUrl || !croppedAreaPixels) {
      // If no cropping, just return the original
      onCropSave(imageUrl);
      onClose();
      return;
    }

    try {
      const croppedUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
      onCropSave(croppedUrl);
      onClose();
    } catch (err) {
      console.error("Crop failed:", err);
    }
  }, [imageUrl, croppedAreaPixels, onCropSave, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary p-4 rounded-md w-11/12 md:w-1/2">
        <h2 className="text-2xl text-primary font-bold mb-4">Crop {side} Image</h2>
        <div className="relative w-full h-100">
          {imageUrl ? (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1} // keep a 1:1 aspect ratio for retina
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : (
            <p>Loading image...</p>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-4 py-2 bg-primary rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-secondary text-white rounded" onClick={handleSave}>
            Save Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
