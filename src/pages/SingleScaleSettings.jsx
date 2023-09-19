import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Fallback from '../components/Fallback';
import axios from 'axios';
const SingleScaleSettings = () => {
  const { id } = useParams();
  // State variables
  const [data, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded

  useEffect(() => {
    fetchScalesSettings(id);
  }, [id]);

  const fetchScalesSettings = async (id) => {
    console.log(id);
    try {
      let headersList = {
        Accept: '*/*',
        'Content-Type': 'application/json',
      };
      // let bodyContent = JSON.stringify({
      //   scale_id: id,
      // });
      let reqOptions = {
        url: `https://100035.pythonanywhere.com/paired-comparison/paired-comparison-settings/?scale_id=${id}`,
        method: 'GET',
        headers: headersList,
        // data: bodyContent,
      };
      // const response = await axios.get(
      //   `https://100035.pythonanywhere.com/paired-comparison/paired-comparison-settings/`,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     params: {
      //       scale_id: id,
      //     },
      //   }
      let response = await axios.request(reqOptions);
      // );

      const results = response.data;
      console.log(results.success);
      setData(results.success);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching scales:', error.message);
      setIsLoading(false);
    }
  };
  const flexDirectionClass =
    data.orientation === 'vertical' ? 'flex-col' : 'flex-row';
  console.log(flexDirectionClass);

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="flex flex-col lg:flex-row border-2 border-black w-full lg:w-[50%]">
        <div className="flex flex-wrap items-center justify-center p-4 mx-auto lg:w-full">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center">{data.name}</h1>
          </div>
          <div className="flex flex-row flex-wrap justify-center h-auto ">
            {
              data &&
                data.paired_items.map((paired, index) => (
                  <div
                    key={index}
                    className={`w-full h-50 p-4 mx-2 my-2 bg-[${data.scalecolor}] lg:w-60 border border-black`}
                  >
                    <div
                      className={`flex ${flexDirectionClass} items-center justify-center py-8`}
                    >
                      <div
                        className={`w-1/2 p-4 mx-2 text-center bg-[${data.roundcolor}] border border-black text-[${data.fontcolor}]`}
                      >
                        {paired[0]}
                      </div>
                      <div className="w-1/2 p-4 mx-2 text-center border border-black">
                        {paired[1]}
                      </div>
                    </div>
                  </div>
                ))

              // )
            }
          </div>
          <div className="flex justify-center w-full lg:justify-end ">
            <div className="flex flex-col items-end justify-between space-x-2 lg:flex-row">
              <Link
                to={`/update-scale-settings/${id}`}
                className="px-8 py-2 mt-6 text-white capitalize bg-blue-500 rounded-lg hover:bg-blue-800 focus:outline-none "
              >
                Update Scale
              </Link>
              <Link
                to="/create-scale-response"
                className="px-8 py-2 mt-6 text-white capitalize bg-blue-500 rounded-lg hover:bg-blue-800 focus:outline-none "
              >
                Create Scale Response
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleScaleSettings;
