
import {useState} from "react"
export default function App() {
  const[loading,setLoading]=useState(-1)
  return (
   <div className="w-full flex flex-col justify-center items-center ">
    <p className="mt-20 text-[14px]">Stand/Shop Number</p>
    <p className="w-[190px] border-2 h-[50px] rounded-3xl flex items-center justify-center">1</p>
    <div className="flex flex-col justify-center items-center font-sans font-medium p-10 mt-5 text-[20px] text-[#E45E4C]">
    <p className="font-sans font-bold font-medium text-[20px] text-[#E45E4C] text-center">
    Would you like to use our products/services
    
    </p>
    </div>
                <p className="text-[14px] mt-[20px]">Give your feedback</p>
                <p className="text-[14px]">(Low)0-10(High)</p>
               <div className="w-max flex flex-col">
                        <div className="flex justify-center items-center gap-1 sm:gap-3 bg-white p-2 md:p-4 lg:px-8 w-max">
                        
                        <button
                          key="0"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=0"
                        setLoading(0)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==0}
                          >
                          {loading==0?(
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
                            0
                          )}
                         
                        </button>
                      
                        <button
                          key="1"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=1"
                        setLoading(1)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==1}
                          >
                          {loading==1?(
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
                            1
                          )}
                         
                        </button>
                      
                        <button
                          key="2"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=2"
                        setLoading(2)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==2}
                          >
                          {loading==2?(
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
                            2
                          )}
                         
                        </button>
                      
                        <button
                          key="3"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=3"
                        setLoading(3)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==3}
                          >
                          {loading==3?(
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
                            3
                          )}
                         
                        </button>
                      
                        <button
                          key="4"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=4"
                        setLoading(4)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==4}
                          >
                          {loading==4?(
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
                            4
                          )}
                         
                        </button>
                      
                        <button
                          key="5"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=5"
                        setLoading(5)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==5}
                          >
                          {loading==5?(
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
                            5
                          )}
                         
                        </button>
                      
                        <button
                          key="6"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=6"
                        setLoading(6)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==6}
                          >
                          {loading==6?(
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
                            6
                          )}
                         
                        </button>
                      
                        <button
                          key="7"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=7"
                        setLoading(7)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==7}
                          >
                          {loading==7?(
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
                            7
                          )}
                         
                        </button>
                      
                        <button
                          key="8"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=8"
                        setLoading(8)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==8}
                          >
                          {loading==8?(
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
                            8
                          )}
                         
                        </button>
                      
                        <button
                          key="9"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=9"
                        setLoading(9)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==9}
                          >
                          {loading==9?(
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
                            9
                          )}
                         
                        </button>
                      
                        <button
                          key="10"
                          onClick={() =>{ window.location.href = "https://100035.pythonanywhere.com/addons/create-response/v3/?user=True&scale_type=nps&channel=channel_1&instance=instances_1&workspace_id=6385c0e68eca0fb652c9449a&username=CustomerSupport&scale_id=666178864ef3c835170173f9&item=10"
                        setLoading(10)}}
                          className="md:text-[20px] sm:text-[14px] py-[2px] px-[6px] sm:p-2 sm:px-3 rounded-full md:px-4 cursor-pointer bg-[#FCEAD4] text-[#F7B75F] font-bold"
                       disabled={loading==10}
                          >
                          {loading==10?(
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
                            10
                          )}
                         
                        </button>
                      
                    </div>
                    {/* <div className="w-full flex p-2 justify-between items-center text-[12px] sm:text-[14px] ">
                            <p>Bad</p>
                            <p>Average</p>
                            <p>Excellent</p>
                    </div> */}
                </div>
            </div>
  );
}
