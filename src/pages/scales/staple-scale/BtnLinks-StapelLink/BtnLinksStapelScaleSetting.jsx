/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Fallback from '../../../../components/Fallback';
import { Button } from '../../../../components/button';
import { LuEye } from "react-icons/lu";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { AiOutlineCopy } from 'react-icons/ai';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MdDone } from "react-icons/md";
import BtnLinks from '../../../../components/data/BtnLinks';

const BtnLinksStapelScaleSetting = () => {
  
  const { slug } = useParams();
  const [selectedScore, setSelectedScore] = useState();
  const [showPreview, setShowPreview] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [scaleLinks, setScaleLinks] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('React')
  const ReactData = `import { useState, useEffect } from 'react';
  import axios from 'axios';
  
  const Scale = () => {
    const buttonLinks = []; //Paste the links here
  
    const [loadingIndex, setLoadingIndex] = useState(null);
    const [responseReceived, setResponseReceived] = useState(false);
    
    const [ipAddress, setIPAddress] = useState('')

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIPAddress(data.ip))
      .catch(error => console.log(error))
  }, []);
  console.log(ipAddress)
    const handleButtonClick = async (link, index) => {
      setLoadingIndex(index);
      try {
        const response = await axios.get(link);
        console.log(response);
        if(response.data.success === true) {
          setResponseReceived(true);
        }else {
          alert("All instances for this scale have been consumed. Create a new scale to continue")
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingIndex(null);
      }
    };
  
    return (
      <div className='flex flex-col items-center justify-center w-full font-Montserrat'>
        {responseReceived === false &&<h2 className="scale-heading">
          On a scale of 0-10, how likely are you to recommend the product to a
          friend or a colleague?
        </h2>}
        {responseReceived ? (
          <div className="response-message" style={{}}>Thank you for your response!</div>
        ) : (
          <div className="button-container flex flex-row gap-3 md:px-2 py-6 md:px-1 items-center justify-center place-items-center border m-10">
            {buttonLinks.map((link, index) => (
              <button
                key={index}
                className="rounded-lg bg-primary text-[black] h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]"
                onClick={() => handleButtonClick(link, index)}
                disabled={loadingIndex === index}
              >
                {loadingIndex === index ? (
                  <div className="rounded-full border-4 border-t-white animate-spin h-[1rem] w-[1rem] border-3px m-auto"></div>
                ) : (
                  !Number.isNaN(Number(link.slice(-2))) ? link.slice(-2) : link.charAt(link.length -1)
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default Scale;`

  const htmlData = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>nps scale html</title>
      <link rel="stylesheet" href="index.css" />
  </head>
  <body>
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <h4 id="qstion" style="margin:auto; color: black; text-align: center; padding: 10px;">On a scale of 0-10, how likely are you to recommend the product to a
          friend or a colleague?</h4>
      <h4 id="resp" style="margin:auto; color: black; text-align: center; padding: 10px; display: none;">Response submitted!</h4>
      <!-- <script src="kthgreatest.js" type="text/javascript"></script> -->
      <div class="scale" id="scale" style="margin:auto; color: white; text-align: center; padding: 10px; width: 55%; height: 60px; display: flex; align-items: center; justify-content: center;">
      </div>
      <div id="spinner" style="border: 4px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: green; width: 100px; height: 100px; animation: spin 1s linear infinite; display: none;"></div>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.1/axios.min.js"></script>
      <script>
      const linkArray = [] //Paste the links here
  
      const handleButtonClick = async (link) => {
      document.getElementById('spinner').style.display = 'block'
      document.getElementById('scale').style.display = 'none'
      fetch('https://api.ipify.org/?format=json')
      .then(response => response.json())
      .then(data => console.log(data.ip))
        try {
          const response = await axios.get(link);
          console.log(response.data);
          if(response.data.success === false) {
          alert("All instances for this scale have been consumed. Create a new scale to continue")
          document.getElementById('spinner').style.display = 'none'
          document.getElementById('scale').style.display = 'flex'
         }else {
          document.getElementById('spinner').style.display = 'none'
          document.getElementById('qstion').style.display = 'none'
          document.getElementById('resp').style.display = 'block'
         }
         } catch (error) {
          console.error('Error:', error);
          document.getElementById('spinner').style.display = 'none'
          document.getElementById('scale').style.display = 'block'
         } finally {
          console.log("Hello")
         }
        };


          for(let i = 0; i <= linkArray.length -1; i++) {
              const btn = document.createElement('button')
              btn.textContent = (!Number.isNaN(Number(linkArray[i].slice(-2))) ? linkArray[i].slice(-2) : linkArray[i].charAt(linkArray[i].length -1))
              btn.style.width = '20%'
              btn.style.height = '50px'
              btn.style.marginRight = '10px'
              btn.style.cursor = 'pointer'
              btn.style.borderRadius = '4px'
              btn.style.border = 'none'
              btn.style.backgroundColor = 'green';
              btn.addEventListener('mouseover', () => {
              // Change the button's background color
              btn.style.backgroundColor = 'lightgreen';
              });
              btn.addEventListener('mouseleave', () => {
              // Change the button's background color
              btn.style.backgroundColor = 'green';
              });
              btn.addEventListener('click', () => {
                  handleButtonClick(linkArray[i])
              });
              document.getElementById('scale').append(btn)
          }
      </script>
  </body>
  </html>`

  let scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  const handleSelectScore = (score, index) => {
    if(typeof(score) === "string") {
      setSelectedScore(index);
    }else {
      setSelectedScore(score);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      //await handleFetchSingleScale(slug);
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://100035.pythonanywhere.com/addons/create-scale/?scale_id=${slug}`
        );
        const links = Object.entries(response.data.settings.urls)
        console.log(links);
        setScaleLinks(response.data.settings.urls)
        links.map((link, index)=>{
          if(BtnLinks.includes(`'${links[index][1][0]}'`) == false){
            BtnLinks.push(`'${links[index][1][0]}'`)
          }
        })
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);
  
  console.log("This is the scale response", Object.entries(scaleLinks))

  const handlePreview = () => {
    setShowPreview(true)
    setShowCode(false)
    setShowSuccess(false)
  }

  const handleSelectChange = (e) =>{
    setCodeSnippet(e.target.value)
    setShowSuccess(false)
  }

  const handleShowCode = () => {
    setShowPreview(false)
    setShowCode(true)
    setCodeSnippet('react')
  }

  const handleCopyCodeSnippet = (val) =>{
    // Create a textarea element, set its value, and append it to the document
    const textArea = document.createElement('textarea');
    textArea.value = val;
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the textarea from the document
    document.body.removeChild(textArea);

    // Optionally, you can provide user feedback (e.g., show a tooltip)
    setShowSuccess(true);
  }

  const handleCopyClick = (val) => {
    // Create a textarea element, set its value, and append it to the document
    const textArea = document.createElement('textarea');
    textArea.value = val;
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the textarea from the document
    document.body.removeChild(textArea);

    // Optionally, you can provide user feedback (e.g., show a tooltip)
    toast.success('link copied to clipboard!');
  };

  const selectAllLinks = (val) =>{
    // Create a textarea element, set its value, and append it to the document
    const textArea = document.createElement('textarea');
    textArea.value = `[${val}]`;
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the textarea from the document
    document.body.removeChild(textArea);

    // Optionally, you can provide user feedback (e.g., show a tooltip)
    toast.success('links copied to clipboard!');
  }

  const handleCsvGeneration = () =>{
    const table = document.getElementById("linkTable");
            const rows = table.querySelectorAll("tr");

            let csvContent = "data:text/csv;charset=utf-8,";

            rows.forEach(function (row) {
                const cols = row.querySelectorAll("td, th");
                const rowData = Array.from(cols).map(col => col.textContent);
                csvContent += rowData.join(",") + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "table_data.csv");
            document.body.appendChild(link);
            link.click();
        }

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <div className="flex flex-col items-center justify-center font-medium m-auto" style={{width:'80%'}} >
      <div className='' style={{display:'flex', justifyContent:'flex-end', marginTop: '25px', marginLeft: '10px', width:'96%'}}>
       <button 
          className='prev-btn' style={{display:'flex', alignItems:'center', padding: '10px', border:'1px solid lightgray', height: '30px', borderRadius: '2px', backgroundColor: showPreview ? 'whitesmoke' : ''}}onClick={handlePreview}><LuEye style={{marginRight:'6px'}} />Preview</button>
          <button onClick={handleShowCode} className='code-btn' style={{display:'flex', alignItems:'center', padding: '10px', border:'1px solid lightgray', height: '30px', borderRadius: '2px', backgroundColor: showCode ? 'whitesmoke' : ''}}><MdOutlineKeyboardArrowLeft /><MdOutlineKeyboardArrowRight style={{marginRight:'6px'}} />Code</button>
          {showCode && <select
              label="Select language"
              name="language"
              className="appearance-none block text-[#989093] text-sm font-light outline-0 border border-[#DDDADB] pl-4"
              onChange={(e) =>handleSelectChange(e)}
            >
              <option value='react'>React</option>
              <option value='html'>HTML</option>
            </select>}
          </div>
        <div className="flex flex-col items-center justify-center w-full font-Montserrat">
          <div className="w-full p-5">
            {showCode &&<div className='bg-gray-500'>
              <div className='w-full' style={{display:'flex', alignItems: 'center', justifyContent: 'flex-end',}}>
              {showSuccess === false ? <div className="inline text-[white] cursor-pointer" 
              onClick={() => handleCopyCodeSnippet(codeSnippet == 'react' ? ReactData : htmlData)}
              style={{marginRight:'10px', marginTop:'6px'}}>
              <AiOutlineCopy
                  size={25}
                  color="bg-[#1A8753]"
                  className="inline text-[white] cursor-pointer"
                  style={{marginTop:'6px'}}
              /> copy code</div>:
              <MdDone 
              size={25}
              color="bg-[#1A8753]"
              className="inline text-[white] cursor-pointer"
              style={{marginRight:'10px', marginTop:'6px'}}
              />}
              </div>
              {codeSnippet === "react" ? <SyntaxHighlighter 
              language="javascript" 
              style={darcula} 
              customStyle={{
                   height: "350px",
                   marginBottom: '40px'
                 }}>
                {ReactData}
              </SyntaxHighlighter> : ""}
              {codeSnippet === "html" ?<SyntaxHighlighter 
              language="javascript" 
              style={darcula} 
              customStyle={{
                   height: "350px",
                   marginBottom: '40px'
                 }}>
                {htmlData}
              </SyntaxHighlighter> : ""}
            </div>}
            <div className="flex flex-col items-center justify-center w-full font-Montserrat">
            
            {showPreview &&<div className='button-container grid gap-3 md:px-2 py-6 grid-cols-11 md:px-1 items-center justify-center place-items-center border m-10'>
            {scores.map((score, index) =>(
           <button
            key={index}
            id = {index}
            onClick={() => handleSelectScore(score, index)}
            className={`rounded-lg ${
              scores[index] == selectedScore
                        ? `bg-primary`
                                  : `bg-[green] text-[black}]`
                              }  h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]`}
                            >
                              {score}
                      </button>
      ))}
      </div>}
  
          <table id='linkTable' className="border" style={{width: '100%'}}>
           <tr className="w-full border" style={{border: "1px solid rgb(0, 0, 0)"}}>
            <th style={{border: "1px solid rgb(0, 0, 0)"}}>Serial number</th>
            <th style={{border: "1px solid rgb(0, 0, 0)"}}>Button links</th>
            <th style={{border: "1px solid rgb(0, 0, 0)"}}>Copy link buttons</th>
           </tr>

            {Object.getOwnPropertyNames(scaleLinks).length !== 0 && (Object.entries(scaleLinks)).map((public_link, index) => (
                <tr
                  key={index} className="w-full border" style={{border: "1px solid rgb(0, 0, 0)"}}>
                  <td style={{border: "1px solid rgb(0, 0, 0)"}}>{index}</td>
                  <td style={{display:'block', width: '150px', whiteSpace: 'nowrap', overflow:'hidden', textOverflow:'ellipsis', }} className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">{(Object.entries(scaleLinks))[index][1][0]}</td>
                  <td style={{border: "1px solid rgb(0, 0, 0)"}}><AiOutlineCopy
                  onClick={() => handleCopyClick((Object.entries(scaleLinks))[index][1][0])}
                  size={50}
                  color="bg-[#1A8753]"
                  className="inline text-[#1A8753] cursor-pointer "
                /></td>
                </tr>
            ))}
            </table>
            </div>
            <div style={{width: '100%', display:'flex', alignItems: 'center', justifyContent:'center', marginTop:'10px'}}>
              <Button onClick={() => selectAllLinks(BtnLinks)} style={{ display:'flex', alignItems:'center', justifyContent:'center', padding: '10px', border:'1px solid lightgray', height: '50px', width: '150px', borderRadius: '2px', cursor: 'pointer', marginRight: '10px'}}>Copy all links</Button>
              <Button onClick={handleCsvGeneration} style={{ display:'flex', alignItems:'center', justifyContent:'center', padding: '10px', border:'1px solid lightgray', height: '50px', width: '150px', borderRadius: '2px', cursor: 'pointer'}}>Generate a CSV file</Button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default BtnLinksStapelScaleSetting;
