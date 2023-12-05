import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import { useSaveResponse } from "../../../hooks/useSaveResponse";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";
import UpdateNPSScale from "./UpdateNPSScale";
import NPSMasterlink from "./NPSMasterlink";

const NPSScaleSettings = () => {
  const { slug } = useParams();
  // const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);
  const [masterLink, setMasterLink] = useState("");
  const [scale, setScale] = useState(null);
  const [publicLinks, SetpublicLinks] = useState(null);
  const [selectedScore, setSelectedScore] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const saveResponse = useSaveResponse();
  const navigateTo = useNavigate();

  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleToggleUpdateModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };
  const handleToggleMasterlinkModal = () => {
    setShowMasterlinkModal(!showMasterlinkModal);
  };

  const handleSelectScore = (score) => {
    setSelectedScore(score);
  };

  const handleFetchSingleScale = async (scaleId) => {
    await fetchSingleScaleData(scaleId);
  };

  const submitResponse = async () => {
    const payload = {
      // document_responses: [
      //     {
      //         scale_id:slug,
      //         score:10
      //     },
      //     {
      //         scale_id:"64f6fc2c7ab91b2af12c3958",
      //         score:10
      //     }],
      // instance_id:1,
      // brand_name:"question",
      // product_name:"answer",
      // username: "tall",
      // action: "document",
      // authorized: "Ambrose",
      // cluster: "Documents",
      // collection: "CloneReports",
      // command: "update",
      // database: "Documentation",
      // document: "CloneReports",
      // document_flag: "processing",
      // document_right: "add_edit",
      // field: "document_name",
      // function_ID: "ABCDE",
      // metadata_id: "64f568426bcc87ef0c75d43c",
      // process_id: "64f5683c3270cf0e74824fe7",
      // role: "single step role",
      // team_member_ID: "1212001",
      // content: "",
      // document_name: "name",
      // page: "",
      // user_type: "public",
      // _id: slug,

      user: "natan",
      scale_id: "64afe7d3aad77b181847190a",
      event_id: "1689249744727624",
      scale_category: "npslite scale",
      response: "9",
    };

    try {
      setIsLoading(true);
      const response = await saveResponse(payload);
      console.log(response);
      // if(status===200){
      //     toast.success('successfully updated');
      //     setTimeout(()=>{
      //         navigateTo(`/nps-scale/${sigleScaleData[0]?._id}`);
      //     },2000)
      //   }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      //   await handleFetchSingleScale(slug);
      try {
        setLoading(true);
        const response = await axios.get(
          `https://100035.pythonanywhere.com/api/nps_create/?scale_id=${slug}`
        );
        console.log(response.data.success.scalecolor);
        setScale(response.data.success);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const createMasterLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(sessionStorage.getItem("session_id"));

    try {
      const pub_links = await axios.post(
        "https://100093.pythonanywhere.com/api/userinfo/",
        // '',
        { session_id: sessionStorage.getItem("session_id") }
      );
      const result = await pub_links.data;
      let all_links = [];
      let all_public_links = [];
      result["selected_product"]["userportfolio"].forEach((result, index) => {
        if (
          result["member_type"] === "public" &&
          result["product"] === "Living Lab Scales"
        ) {
          all_links.push(result["username"]);
        }
      });
      const flattenedArray = [].concat(...all_links);

      // Split the URL by "/"
      // Find the last index of "/"
      const lastSlashIndex = window.location.href.lastIndexOf("/");

      // Slice the URL to exclude the last part
      const modifiedUrl = window.location.href.slice(0, lastSlashIndex);
      const lastPart = window.location.href.slice(lastSlashIndex + 1);

      // Loop through the specified number of elements
      for (
        let i = 0;
        i < scale.no_of_scales && i < flattenedArray.length;
        i++
      ) {
        // Append the current element to the current window.location.href
        const newUrl = `${modifiedUrl}/${flattenedArray[i]}/?scale_id=${lastPart}`;

        // Display the new URL (you can modify this part based on your use case)
        all_public_links.push(newUrl);
      }

      SetpublicLinks(all_public_links);

      console.log(result["selected_product"]["product_name"]);
      console.log(result["selected_product"]["userportfolio"]);
    } catch {
      setIsLoading(false);
      console.log("Error", error.response);
    }

    console.log("tombotaller", publicLinks);

    var requestData = {
      qrcode_type: "Link",
      quantity: 1,
      company_id: "gee",
      document_name: "Vader doc",
      links: publicLinks.map((link) => ({ link })),
    };

    console.log(requestData);

    try {
      const data = await axios.post(
        "https://www.qrcodereviews.uxlivinglab.online/api/v3/qr-code/",
        requestData
      );
      const result = await data.data;
      console.log(result.qrcodes[0].masterlink);

      if (result.error) {
        setIsLoading(false);
        return;
      } else {
        setMasterLink(result.qrcodes[0].masterlink);
        handleToggleMasterlinkModal();

        setIsLoading(false);
        toast.success(result.response);
      }
    } catch (error) {
      setIsLoading(false);

      console.log("Error", error.response);
    }
    // https://www.qrcodereviews.uxlivinglab.online/api/v3/qr-code/
  };

  if (loading) {
    return <Fallback />;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen font-medium font-Montserrat">
      <div className="w-full px-5 py-4 m-auto border border-primary lg:w-9/12">
        <div
          className={`h-80 md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`}
        >
          <div className="flex-1 w-full h-full p-2 border stage lg:w-5/12">
            <h3 className="py-5 text-sm font-medium text-center">
              Scale Name: {scale?.name}
            </h3>
            <div
              className={`grid grid-cols-4 gap-3 px-2 py-6  bg-${scale?.scalecolor} md:grid-cols-11 md:px-1`}
              style={{ backgroundColor: scale?.scalecolor }}
            >
              {scale &&
                (Array.isArray(scale?.fomat) ? scale.fomat : scores).map(
                  (score, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectScore(score)}
                      className={`rounded-full ${
                        index > selectedScore
                          ? `bg-[${scale.roundcolor}]`
                          : `bg-primary text-[${scale?.fontcolor}]`
                      } text-[${scale?.fontcolor}] h-[3.8rem] w-[3.8rem]`}
                      style={
                        index > selectedScore
                          ? {
                              backgroundColor: scale?.roundcolor,
                              color: scale?.fontcolor,
                            }
                          : { color: "white" }
                      }
                    >
                      {score}
                    </button>
                  )
                )}
            </div>
            <div className="flex items-center justify-between my-3">
              <h4>Unsatisfactory</h4>
              <h4>neutral</h4>
              <h4>Satisfactory</h4>
            </div>

            <div className="flex justify-end gap-3">
              {/* {scale &&
                scale.map((scale, index) => ( */}
              <Button
                width={"3/4"}
                onClick={handleToggleUpdateModal}
                // key={index}
              >
                update scale
              </Button>
              {/* ))} */}
              <Button width={"3/4"} primary onClick={createMasterLink}>
                {isLoading ? "Creating Masterlink" : "Create Masterlink"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showUpdateModal && (
        <UpdateNPSScale handleToggleUpdateModal={handleToggleUpdateModal} />
      )}
      {showMasterlinkModal && (
        <NPSMasterlink
          handleToggleMasterlinkModal={handleToggleMasterlinkModal}
          link={masterLink}
          publicLinks={publicLinks}
        />
      )}
    </div>
  );
};

export default NPSScaleSettings;
