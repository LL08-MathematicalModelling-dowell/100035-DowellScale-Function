function reactCode(buttonLinks,ratings) {
  if(ratings[0]=="Bad"){
  return `
export default function App() {
  return (
    <div className="flex flex-col items-center ">
      <p className="flex justify-center items-center font-sans font-medium p-3 mt-5 text-base">
        How was your experience using our product? Please rate your experience below.
      </p>
      
      <div className="flex justify-center items-center gap-6 md:gap-12 mt-5">
        <button
          className="bg-[#ff4a4a] rounded-lg  p-1 px-3 sm:p-2 sm:px-6 md:p-4 md:px-12  text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href ="${buttonLinks[0]}"}
        >
          Bad 😞
        </button>
        <button
          className="bg-[#f3dd1f] rounded-lg  p-1 px-3 sm:p-2 sm:px-6 md:p-4 md:px-12  text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href ="${buttonLinks[1]}"}
        >
          Average 😐
        </button>
        <button
          className="bg-[#129561] rounded-lg p-1 px-3 sm:p-2 sm:px-6 md:p-4 md:px-12 text-base sm:font-medium cursor-pointer"
          onClick={() => window.location.href = "${buttonLinks[2]}"}
        >
          Excellent 😄
        </button>
      </div>
    </div>
  );
}

`;
  }else{
    return `
    import {useState} from "react"
    export default function App() {
      const[loading,setLoading]=useState(-1)
      return (
       <div className="w-full flex flex-col justify-center items-center ">
       <p className="flex justify-center items-center font-sans font-medium p-3 mt-5 text-base">
       How was your experience using our product? Please rate your experience below.
     </p>
                        <div className="w-max flex flex-col">
                            <div className="flex justify-center items-center gap-1 sm:gap-3 bg-white p-2 md:p-4 lg:px-8 border-2 border-[#bfbfbf] w-max">
                            ${ratings.map((score, index) => `
                            <button
                              key="${index}"
                              onClick={() =>{ window.location.href = "${buttonLinks[index]}"
                            setLoading(${index})}}
                              className="text-[12px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded md:px-4 cursor-pointer bg-[#00a3ff] text-white"
                           disabled={loading==${index}}
                              >
                              {loading==${index}?(
                                <>
                               
                                <div className="flex h-full w-full items-center justify-center">
                                <button type="button" className="flex items-center rounded-lg  px-4 py-2 text-white" disabled>
                                  <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                 
                                </button>
                              </div>

                                </>
                              ):(
                                ${score}
                              )}
                             
                            </button>
                          `).join('')}
                        </div>
                        <div className="w-full flex p-2 justify-between items-center text-[12px] sm:text-[14px] ">
                                <p>Bad</p>
                                <p>Average</p>
                                <p>Excellent</p>
                        </div>
                    </div>
                </div>
      );
    }
    `
  }
}
   
export default reactCode;
