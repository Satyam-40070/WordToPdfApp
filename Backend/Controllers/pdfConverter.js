const docxToPdf = require('docx-pdf');
const path = require('path');


const convertToPdf = (req, res) => {
    try {
        if(!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }
        //Defining output file path

        let outputFilePath = path.join(__dirname, '../files', `${req.file.originalname}.pdf`);

        docxToPdf(req.file.path, outputFilePath, (err)=>{
            if(err){
              console.log(err);
              return res.status(500).send('Error converting docx to pdf');
            }

            res.download(outputFilePath, () => {
                console.log('File downloaded successfully');
            });
            
          });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

module.exports = {convertToPdf};