import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import axios from 'axios';
const SinglePCScaleSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // State variables
  const [data, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  const [roundColor, setRoundColor] = useState('');
  const [scaleColor, setScaleColor] = useState('');
  const [fontColor, setFontColor] = useState('');
  const [fontStyle, setFontStyle] = useState('');
  const [imagePaths, setImagePaths] = useState([]);

  const [userPicks, setUserPicks] = useState([]);

  useEffect(() => {
    const optionsSent =
      JSON.parse(localStorage.getItem(`optionsSent+${id}`)) || [];
    // console.log(optionsSent);
    if (optionsSent.length > 0) {
      setUserPicks(optionsSent);
    } else {
      // Initialize userPicks with -1 for each pair
      setUserPicks(new Array(data.paired_items?.length).fill(-1));
    }
  }, [location.state, data.paired_items, id]);
  // console.log(userPicks);

  function handleButtonClick(pairIndex, buttonIndex) {
    // Create a copy of the userPicks array
    const updatedUserPicks = [...userPicks];
    // Update the selected button for the clicked pair
    updatedUserPicks[pairIndex] = buttonIndex;
    // Update the userPicks state with the new array
    setUserPicks(updatedUserPicks);
  }

  useEffect(() => {
    fetchScalesSettings(id);
  }, [id]);

  const fetchScalesSettings = async (id) => {
    try {
      let headersList = {
        Accept: '*/*',
        'Content-Type': 'application/json',
      };
      let reqOptions = {
        url: `https://100035.pythonanywhere.com/paired-comparison/paired-comparison-settings/?scale_id=${id}`,
        method: 'GET',
        headers: headersList,
      };
      let response = await axios.request(reqOptions);
      // );

      const results = response.data;
      console.log(response.data);
      console.log(response.data.success?.image_paths);
      setRoundColor(results.success.roundcolor);
      setScaleColor(results.success.scalecolor);
      setFontColor(results.success.fontcolor);
      setFontStyle(results.success.fontstyle);
      setData(results.success);
      setImagePaths(results.success.image_paths || '');
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching scales:', error.message);
      setIsLoading(false);
    }
  };

  const handleCreatePCResponse = () => {
    // Check if any pair is not selected
    const isAnyPairNotSelected = userPicks.some((pick) => pick === -1);

    if (isAnyPairNotSelected) {
      // Display an error message or handle the case where not all pairs are selected
      toast.error('Please select one option from each pair before proceeding.');
      // alert('Please select one option from each pair before proceeding.');
    } else {
      // Map the selected indices to their corresponding option names
      const selectedOptions = data.paired_items.map((paired, pairIndex) => {
        const selectedIndex = userPicks[pairIndex];
        localStorage.clear();
        localStorage.setItem(
          `selectedOptions+${id}`,
          JSON.stringify(userPicks)
        );
        return selectedIndex === 0
          ? paired[0]
          : selectedIndex === 1
          ? paired[1]
          : 'No selection';
      });

      // Navigate to the CreatePCResponse component and pass the selectedOptions as part of route state
      navigate(`/100035-DowellScale-Function/create-scale-response/${id}`, {
        state: { userSelections: selectedOptions },
      });
    }
  };

  const flexDirectionClass =
    data.orientation === 'vertical' ? 'flex-col' : 'flex-row';
  const paddingClass =
    data.orientation === 'vertical' ? 'space-y-2' : 'space-x-2';

  const Pair = styled.div`
    background-color: ${roundColor};
    font-family: ${fontStyle};
    color: ${fontColor};
    transition: background-color 0.3s;

    &:hover {
      background-color: black;
      color: white;
    }
    &.selected-button {
      background-color: black;
      color: white;
    }
  `;

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center">{data.name}</h1>
      </div>
      <div className="flex flex-col lg:flex-row border-2 border-black w-full lg:w-[90%]">
        <div className="flex flex-wrap items-center justify-center p-4 mx-auto lg:w-full">
          <div className="flex flex-row flex-wrap justify-center h-auto ">
            {
              data &&
                data.paired_items.map((paired, pairIndex) => (
                  <div
                    key={pairIndex}
                    style={{ backgroundColor: scaleColor }}
                    className="w-full p-4 mx-2 my-2 border border-black rounded-lg h-50 lg:h-96 lg:w-96 "
                  >
                    <div
                      className={`flex ${flexDirectionClass} items-center text-center justify-center py-8 ${paddingClass}  rounded-lg h-full `}
                      // style={{ height: '100%' }}
                    >
                      <Pair
                        className={`w-1/2 p-4 lg:h-48 mx-2 text-center border border-black rounded-lg cursor-pointer focus:outline-none flex flex-col justify-center items-center ${
                          userPicks[pairIndex] === 0 ? 'selected-button' : ''
                        }`}
                        onClick={() => handleButtonClick(pairIndex, 0)}
                      >
                        {imagePaths ? (
                          <img
                            src={`https://100035.pythonanywhere.com/static/images/${
                              Object.values(imagePaths)[0]
                            }`}
                            alt={`https://100035.pythonanywhere.com/static/images/${
                              Object.values(imagePaths)[0]
                            }`}
                            className="object-contain w-10 h-10 p-0 mb-2 bg-white rounded-full"
                          />
                        ) : (
                          <img
                            src={'/src/assets/avatar_img.jpg'}
                            alt={'/src/assets/avatar_img.jpg'}
                            className="object-contain w-10 h-10 p-0 mb-2 bg-white rounded-full"
                          />
                        )}

                        <p className="text-center">{paired[0]}</p>
                      </Pair>
                      <Pair
                        className={`w-1/2 p-4 lg:h-48 mx-2 text-center border border-black rounded-lg cursor-pointer focus:outline-none flex flex-col justify-center items-center  ${
                          userPicks[pairIndex] === 1 ? 'selected-button' : ''
                        }`}
                        onClick={() => handleButtonClick(pairIndex, 1)}
                      >
                        {imagePaths ? (
                          <img
                            src={`https://100035.pythonanywhere.com/static/images/${Object.values(imagePaths)[1]}`}
                            alt={`https://100035.pythonanywhere.com/static/images/${Object.values(imagePaths)[1]}`}
                            className="object-contain w-10 h-10 p-0 mb-2 bg-white rounded-full"
                          />
                        ) : (
                          <img
                            src={'/src/assets/avatar_img.jpg'}
                            alt={'/src/assets/avatar_img.jpg'}
                            className="object-contain w-10 h-10 p-0 mb-2 bg-white rounded-full"
                          />
                        )}

                        <p className="text-center"> {paired[1]}</p>
                      </Pair>
                    </div>
                  </div>
                ))

              // )
            }
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full lg:justify-end lg:w-[90%]">
        <div className="flex flex-col items-end justify-between space-x-2 lg:flex-row">
          <Link
            to={`/100035-DowellScale-Function/update-paired-scale-settings/${id}`}
            className="px-8 py-2 mt-6 text-white capitalize bg-blue-500 rounded-lg hover:bg-blue-800 focus:outline-none "
          >
            Update Scale
          </Link>
          <button
            onClick={handleCreatePCResponse}
            className="px-8 py-2 mt-6 text-white capitalize bg-blue-500 rounded-lg hover:bg-blue-800 focus:outline-none "
          >
            Create Scale Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default SinglePCScaleSettings;
