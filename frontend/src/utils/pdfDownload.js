import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadResumeAsPDF = async (elementId, filename = 'resume.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Resume element not found');
        return;
    }

    // Ensure filename ends with .pdf
    if (!filename.toLowerCase().endsWith('.pdf')) {
        filename += '.pdf';
    }

    // Capture the element as a high-quality canvas
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF('portrait', 'mm', 'a4');

    // If content fits on one page
    if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
        // Multi-page: slice the canvas into pages
        let yOffset = 0;
        let pageNum = 0;
        while (yOffset < imgHeight) {
            if (pageNum > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -yOffset, imgWidth, imgHeight);
            yOffset += pdfHeight;
            pageNum++;
        }
    }

    // Manual blob download to guarantee correct filename
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
