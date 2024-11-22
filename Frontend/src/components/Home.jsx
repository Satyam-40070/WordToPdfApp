import React,{useState} from 'react'
import { FaFileWord } from "react-icons/fa6";
import axios from "axios";

function Home() {
    const [FileName, setFileName] = useState(null);
    const [Convert, setConvert] = useState("");
    const [downloadError, setDownloadError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        //console.log(e.target.files[0]);
        setFileName(e.target.files[0]);
    };

    const handleSubmit =async (event) => {
        event.preventDefault();

        if(!FileName){
            setConvert("Please Choose a File");
            return;
        }

        const formData = new FormData();
        formData.append("file", FileName);
        setLoading(true);
        try {
            const response= await axios.post("http://localhost:3000/convert", formData, {
                responseType: "blob",
            });
            console.log(response.data);
            const url= window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", FileName.name.replace(/\.[^/.]+$/, "")+".pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setFileName(null);
            setDownloadError("");
            setConvert("File Converted Successfully");

        } catch (error) {
            if(error.response && error.response.status === 400){
                setConvert("");
                setDownloadError("Error Downloading File");
            }else{
                setConvert("");
            }
            
        }finally{
            setLoading(false);
        }
    };
  return (
    <>
      <div className='bg-[url("/back5.avif")] bg-cover  max-w-screen-2xl mx-auto container px-6 py-3 md:px:40'>
        <div className='flex h-screen items-center justify-center'>
            <div className='border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-white bg-gray-400 rounded-lg shadow-lg'>
                <h1 className='text-3xl text-center text-blue-950 font-bold mb-4'>Convert WORD To PDF Online</h1>
                <p className='text-sm text-center text-gray-100 mb-5'>Easily convert Word to Pdf online, without having to install any software.</p>
            
            <div className='flex flex-col space-y-4 items-center'>
                <input type="file" accept='.doc,.docx' onChange={handleFileChange} className='hidden' id='inputFile'/>
                <label htmlFor="inputFile" className='w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-900 hover:text-white duration-300' >
                    <FaFileWord className='text-3xl mr-2'/>
                    <span className='text-3xl mr-2'>{FileName?FileName.name: "Choose File (.doc, .docx)"}</span>
                </label>
                <button disabled={!FileName} onClick={handleSubmit} className='text-white bg-blue-700 hover:bg-blue-900 duration-300 disabled:bg-gray-600 disabled:pointer-events-none cursor-pointer rounded-lg px-4 py-2'>
                {loading ? (
                               <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        <span>Converting...</span>
                                    </div>
                                ) : (
                                    "Convert To PDF"
                                )}
                </button>
                {Convert && <div className='text-blue-900 text-center'>
                    {Convert}
                </div>}

                {downloadError && <div className='text-red-500 text-center'>
                    {downloadError}
                </div>}
            </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Home
