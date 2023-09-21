import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Fallback from '../components/Fallback';
import styled from 'styled-components';

import axios from 'axios';
const SingleScaleSettings = () => {
  const { id } = useParams();
  // State variables
  const [data, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  const [roundColor, setRoundColor] = useState('');
  const [scaleColor, setScaleColor] = useState('');
  const [fontColor, setFontColor] = useState('');
  const [fontStyle, setFontStyle] = useState('');

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
      console.log();
      setRoundColor(results.success.roundcolor);
      setScaleColor(results.success.scalecolor);
      setFontColor(results.success.fontcolor);
      setFontStyle(results.success.fontstyle);
      setData(results.success);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching scales:', error.message);
      setIsLoading(false);
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
`;

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center">{data.name}</h1>
      </div>
      <div className="flex flex-col lg:flex-row border-2 border-black w-full lg:w-[90%]">
        <div className="flex flex-wrap items-center justify-center p-4 mx-auto lg:w-full">
          <div className="flex flex-row flex-wrap justify-center h-auto ">
            {
              data &&
                data.paired_items.map((paired, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: scaleColor }}
                    className="w-full p-4 mx-2 my-2 border border-black rounded-lg h-50 lg:h-96 lg:w-96 "
                  >
                    <div
                      className={`flex ${flexDirectionClass} items-center text-center justify-center py-8 ${paddingClass}  rounded-lg h-full `}
                      // style={{ height: '100%' }}
                    >
                      <Pair
                        className={`w-1/2 p-4 lg:h-48 mx-2 text-center border border-black rounded-lg cursor-pointer  focus:outline-none flex justify-center items-center`}
                        
                      >
                       <p className='text-center'>{paired[0]}</p>
                      </Pair>
                      <Pair
                        className="flex items-center justify-center w-1/2 p-4 mx-2 text-center border border-black rounded-lg cursor-pointer lg:h-48"

                      >
                       <p className='text-center'> {paired[1]}</p>
                      </Pair>
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
                to=""
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
