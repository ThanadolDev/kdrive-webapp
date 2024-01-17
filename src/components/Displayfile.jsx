import React, { useState } from "react";

import { Document, Page } from "react-pdf";
const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

export const Displayfile = ({selectedFile}) => {

  const [numPages, setNumPages] = useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  switch (selectedFile.fileExtension) {
    case "image/webp":
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
    case "image/gif":
      return <img src={selectedFile.blob} alt="Selected" />;
    case "application/pdf":
      return (
        <Document
          file={selectedFile.blob}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageIndex={index}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      );
    case "video/mp4":
    case "video/mov":
    case "video/webm":
      return <video controls className="w-full" src={selectedFile.blob} />;
    default:
      return <p>Unsupported file type unable to display file</p>;
  }
};
