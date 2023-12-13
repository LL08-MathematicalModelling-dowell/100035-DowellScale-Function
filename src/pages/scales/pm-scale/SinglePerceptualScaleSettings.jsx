import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import axios from 'axios';
import CustomCanvas from '../../../components/CustomCanvas';
import { Box } from '../../../components/Box';

const SinglePerceptualScaleSettings = () => {
  const { id } = useParams();
  // State variables
  const [data, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded\
  // const x_range = data.settings.x_range[0];
  // const Y_range = data.settings.y_range[0];

  const fetchScalesSettings = async (id) => {
    try {
      let headersList = {
        Accept: '*/*',
        'Content-Type': 'application/json',
      };
      let reqOptions = {
        url: `https://100035.pythonanywhere.com/perceptual-mapping/perceptual-mapping-settings/?scale_id=${id}`,
        method: 'GET',
        headers: headersList,
      };
      let response = await axios.request(reqOptions);

      const results = response.data;
      console.log(results.success.data);
      setData(results.success.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching scales:', error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScalesSettings(id);
  }, [id]);

  const customCanva = useMemo(() => {
    // Perform some expensive computation based on data
    return <CustomCanvas xAxisRange={8} yAxisRange={5} />;
  }, []);
  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold text-center uppercase">
        Your Perceptual Mapping Scale
      </h1>
      <div className="flex flex-col items-center justify-center px-20 m-10 border-2 border-black lg:px-0">
        <h1 className="p-4 text-2xl font-bold text-center uppercase">
          {data.settings.name}
        </h1>
        <div className="flex flex-col lg:flex-row border-2 border-black rounded-lg w-full xl:w-[60%] lg:w-[80%] h-3/5 ">
          <div className="flex flex-wrap items-center justify-center p-4 mx-auto lg:w-3/4">
            {customCanva}
          </div>
          <div className="flex flex-col flex-wrap items-center w-full p-4 mx-auto border border-black lg:w-1/4">
            <h1 className="mt-4 text-2xl font-medium text-center underline">
              AVAILABLE ITEMS
            </h1>
            <div className="flex flex-col ">
              {Object.values(data.settings.item_list).map((e, index) => (
                <div key={index} className="my-4 ">
                  {/* {e} */}
                  <Box name={e} />
                </div>
              ))}
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="w-full lg:w-[60%] lg:pl-4">
          <div className="flex items-center justify-center h-40 space-x-4 lg:justify-end">
            <Link
              to=""
              className="px-8 py-2 text-white bg-[#1A8753] rounded-lg focus:outline-none uppercase"
            >
              Update Scale
            </Link>
            <Link
              to="/100035-DowellScale-Function/create-perceptual-scale-settings"
              className="px-8 py-2 text-white bg-[#1A8753] rounded-lg focus:outline-none "
            >
              SAVE RESPONSE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePerceptualScaleSettings;
