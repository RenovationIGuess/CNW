import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Tooltip } from 'antd';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import useNoteStore from '~/store/useNoteStore';

// Define the A4 width in pixels (assuming 96 DPI)
const a4Width = 8.27 * 96;

const ExportToPDFButton = ({ editor }) => {
  const [note] = useNoteStore((state) => [state.note]);

  const exportToPDF = async () => {
    const editorContent = document.querySelector('.ProseMirror');

    // Convert the div to a canvas using html2canvas
    const canvas = await html2canvas(editorContent, {
      scale: 2, // Increase the scale for better quality
      useCORS: true,
    });

    // Get the canvas height
    // const canvasHeight = canvas.height;

    // Calculate the aspect ratio of the canvas
    const aspectRatio = canvas.width / canvas.height;

    // Calculate the height based on the A4 width and the aspect ratio
    const a4Height = a4Width / aspectRatio;

    // Create a new PDF document
    const pdf = new jsPDF({
      unit: 'px',
      format: [a4Width, a4Height],
    });

    // Define the margin
    const margin = 24;

    // Calculate the width and height of the image to fit the page
    const imgWidth = pdf.internal.pageSize.getWidth() - 2 * margin; // Subtract the margin
    const imgHeight = imgWidth / aspectRatio; // Subtract the margin
    // const imgHeight = (imgWidth * canvas.height) / canvas.width; // Calculate the image height based on the canvas height and the aspect ratio

    // Calculate the x and y coordinates to center the image
    const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      x,
      0,
      imgWidth,
      imgHeight,
      undefined,
      'FAST',
      0
    );

    const noteTitle = note.title.split(' ').join('_');
    // Save the PDF
    pdf.save(`${noteTitle}.pdf`);
  };

  return (
    <Tooltip
      placement="top"
      title={<InfoTooltip title={'Export to PDF'} shortcut={'No shortcut'} />}
      arrow={false}
      rootClassName="custom-tooltip"
    >
      <button className="tool-button" onClick={exportToPDF}>
        <FaFilePdf className="editor-icon" />
      </button>
    </Tooltip>
  );
};

export default ExportToPDFButton;
