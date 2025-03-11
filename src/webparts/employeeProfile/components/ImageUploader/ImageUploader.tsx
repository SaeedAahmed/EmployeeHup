import React, { ChangeEvent } from "react";
import { Label } from "@fluentui/react";

interface IImageUploaderProps {
  onFileSelect: (file: File, previewUrl: string) => void;
  error?: string;
  previewUrl?: string;
}

const ImageUploader: React.FC<IImageUploaderProps> = ({
  onFileSelect,
  error,
  previewUrl,
}) => {
  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const previewUrl = URL.createObjectURL(selectedFile);
      onFileSelect(selectedFile, previewUrl);
    }
  };

  return (
    <div>
      <Label>Profile Picture</Label>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {error && <span style={{ color: "red", fontSize: "12px" }}>{error}</span>}
      {previewUrl && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
