import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { styled } from '@mui/material/styles';
import { Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DragDropFiles: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      setFiles(event.dataTransfer.files);
    }
  };

  // send files to the server // learn from my other video
  const handleUpload = () => {
    if (files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("Files", files[i]);
      }
      console.log(Array.from(formData.getAll("Files")));

      // heitä data organization pagelle
      fetch("/api/http://localhost:3001/api/events/create", {
        method: "POST",
        body: formData
      });

    }
  };

  if (files) {
    return (
      <div className="uploads">
        <ul>
          {Array.from(files).map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
        <div className="actions">
          <button onClick={() => setFiles(null)}>Cancel</button>
          <button onClick={handleUpload}>Upload</button>
        </div>
      </div>
    );
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <>

      <div
        className={`dropzone ${isDragging ? 'drag-hover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h4>Raahaa kuva</h4>
        <h1>tai</h1>
        <input
          type="file"
          multiple
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFiles(event.target.files)
          }
          hidden
          accept="image/png, image/jpeg"
          ref={inputRef}
        />

        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Valitse kuva
            <VisuallyHiddenInput type="file" />
        </Button>


    </div>
    </>
  );
};

export default DragDropFiles;
