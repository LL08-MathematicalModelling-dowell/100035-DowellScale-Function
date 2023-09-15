import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Fallback from '../components/Fallback';
import dowellLogo from '../assets/dowell-logo.png';
const Home = () => {
  // State variables
  const [data, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded

  useEffect(() => {
    fetchScales();
  }, []);

  const fetchScales = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      // body: raw,
      redirect: 'follow',
    };
    try {
      const response = await fetch(
        'https://100035.pythonanywhere.com/paired-comparison/paired-comparison-settings/',
        requestOptions
      );
      const results = await response.json();
      console.log(results.data.data);
      setData(results.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching scales:', error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <img src={dowellLogo} alt="Dowell Logo" className="cursor-pointer w-52" />
      <p className="my-4 text-4xl text-[#1A8753]">
        Dowell Paired Comparison Scales Settings
      </p>
      <div className="flex flex-col lg:flex-row border-2 border-black w-full lg:w-[60%] lg:h-72">
        <div className="p-4 overflow-scroll overflow-x-hidden lg:w-1/4">
          <h1 className="text-xl font-medium text-center underline">
            Scale History
          </h1>
          <div className="flex flex-col">
            {
              Object.values(data).map((e) => (
                <Link
                  key={e._id}
                  to={`/single-scale-settings/${e._id}`}
                  className="text-center lg:text-start"
                >
                  {e.settings.name}
                </Link>
              ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center p-4 mx-auto border border-black lg:w-3/4">
          <div className="flex flex-row flex-wrap justify-center h-auto ">
            <div className="w-full h-40 p-4 mx-2 my-2 bg-green-500 lg:w-60">
              <div className="flex items-center justify-center py-8">
                <div className="w-1/2 p-4 mx-2 text-center bg-green-500 border border-black">
                  A
                </div>
                <div className="w-1/2 p-4 mx-2 text-center bg-green-500 border border-black">
                  B
                </div>
              </div>
            </div>
            <div className="w-full h-40 p-4 mx-2 my-2 bg-green-500 lg:w-60">
              <div className="flex items-center justify-center py-8">
                <div className="w-1/2 p-4 mx-2 text-center bg-green-500 border border-black">
                  A
                </div>
                <div className="w-1/2 p-4 mx-2 text-center bg-green-500 border border-black">
                  B
                </div>
              </div>
            </div>
            <div className="w-full h-40 p-4 mx-2 my-2 bg-green-500 lg:w-60">
              <div className="flex items-center justify-center py-8 ">
                <div className="w-1/2 p-4 mx-2 text-center bg-green-500 border border-black">
                  A
                </div>
                <div className="w-1/2 p-4 mx-2 text-center bg-green-500 border border-black">
                  B
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-3/4 lg:pl-4">
            <div className="flex items-end justify-end h-40">
              <Link
                to="/create-scale-settings"
                className="px-8 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:outline-none "
              >
                Create Scale Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
