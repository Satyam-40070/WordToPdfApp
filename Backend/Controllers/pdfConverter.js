const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const docxToPdf = require('docx-pdf');

const convertToPdf = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }

        // Define paths
        const inputFilePath = req.file.path;
        const outputFilePath = path.join(__dirname, '../files', `${req.file.originalname}.pdf`);

        // Convert DOCX to PDF
        docxToPdf(inputFilePath, outputFilePath, async (err, result) => {
            if (err) {
                console.error('DOCX to PDF conversion error:', err);
                return res.status(500).send('Error converting DOCX to PDF');
            }

            console.log('DOCX to PDF conversion successful');

            try {
                // Ensure the output file exists
                if (!fs.existsSync(outputFilePath)) {
                    throw new Error('Converted PDF file not found');
                }

                // Read the generated PDF
                const pdfBytes = fs.readFileSync(outputFilePath);
                console.log('Original PDF size:', pdfBytes.length, 'bytes');

                // Load PDF with pdf-lib
                const pdfDoc = await PDFDocument.load(pdfBytes, {
                    ignoreEncryption: true,
                });

                console.log('PDF loaded successfully, pages:', pdfDoc.getPageCount());

                // Create a new document for encryption
                const encryptedDoc = await PDFDocument.create();
                console.log('New PDF document created for encryption');

                // Copy pages from original to encrypted document
                const pages = await encryptedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
                pages.forEach(page => encryptedDoc.addPage(page));
                console.log('Pages copied to new document');

                // Apply encryption
                const encryptedPdfBytes = await encryptedDoc.save({
                    userPassword: '123456',
                    ownerPassword: 'owner-password',
                    permissions: {
                        printing: 'lowResolution',
                        copying: false,
                        modifying: false,
                        annotating: false,
                        fillingForms: false,
                        contentAccessibility: false,
                        documentAssembly: false,
                        printingHighQuality: false,
                    },
                });

                console.log('Encryption applied, new PDF size:', encryptedPdfBytes.length, 'bytes');

                // Save the encrypted PDF
                const protectedPdfPath = path.join(__dirname, '../files', `protected_${req.file.originalname}.pdf`);
                fs.writeFileSync(protectedPdfPath, encryptedPdfBytes);
                console.log('Protected PDF saved to:', protectedPdfPath);

                // Verify the file exists and has content
                const stats = fs.statSync(protectedPdfPath);
                console.log('Protected PDF file size:', stats.size, 'bytes');

                // Send the file for download
                res.download(protectedPdfPath, `protected_${req.file.originalname}.pdf`, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        return;
                    }
                    console.log('Password-protected PDF downloaded successfully');

                    // Cleanup temporary files
                    try {
                        if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
                        if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
                        if (fs.existsSync(protectedPdfPath)) fs.unlinkSync(protectedPdfPath);
                        console.log('Temporary files cleaned up');
                    } catch (cleanupError) {
                        console.error('Error during cleanup:', cleanupError);
                    }
                });
            } catch (error) {
                console.error('Error during PDF encryption:', error);
                // Log more details about the error
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                res.status(500).send('Error encrypting PDF');
            }
        });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = { convertToPdf };