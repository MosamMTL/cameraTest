import React, { useEffect, useState,useRef } from 'react';
import { createWorker } from 'tesseract.js';
import {Camera} from "react-camera-pro";
import './App.css';

import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import img from './img.jpg'
import axios from 'axios';
function App() {
  const worker = createWorker({
    logger: m => console.log(m),
  });
  const [image, setImage] = useState(null)
  const [url, setUrl] = useState("")
  const camera = useRef(null);
  const [images, setImages] = useState(null);

  const doOCR = async (data) => {

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(data);
    setOcr(text);
  };
  const [ocr, setOcr] = useState('Recognizing...');
 
  const handleImage = (e) =>{
    setImage(e.target.files[0])
      
  }
  const handleSubmitImage = async () => {
       const formData = new FormData();

      formData.append(
        "file",
        image
      )
      formData.append('upload_preset','moonimage')
      const response = await axios.post("https://api.cloudinary.com/v1_1/moon-technolabs-pvt-ltd/image/upload", formData)
      const file = await response
      const data = file.data.secure_url
      setUrl(data)
      doOCR(data);
  }

  const handleCameraImage = () =>{

      console.log("photo",camera.current)

        
      
      setImages(camera.current.takePhoto())

      setImage(images)

      handleSubmitImage();



  }






  return (
    <div className="App">
      <p>{ocr}</p>

      <img src={url ? url :"https://via.placeholder.com/150"} width="350px" height="250px" />

      <p>Uploadfile:</p>
      <input type="file" onChange={(e)=>handleImage(e)} />
    
      <button type="submit" onClick={()=>handleSubmitImage()} >submit</button>


      {/* <div>
        <Camera ref={camera} />
        <button onClick={() =>handleCameraImage() }>Take photo</button>
        <img src={images} alt='Taken photo'/>
      </div> */}
      {console.log("images",images)}
      <div style={{margin:"5rem"}} >

          Upload from Camera..
          <input type="file" accept="image/*" capture="environment" />
      </div>


      <p>{images}</p>
      <p>{image}</p>
    
    </div>
  );
}

export default App;
