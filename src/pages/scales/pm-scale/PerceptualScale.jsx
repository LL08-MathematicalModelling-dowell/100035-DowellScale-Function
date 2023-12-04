import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import dowellLogo from '../../../assets/dowell-logo.png';
import Button from '../../../components/button/Button';
import { Chart } from 'react-google-charts';
import axios from 'axios';
const PerceptualScale = () => {
  // State variables
  const [data, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded

  useEffect(() => {
    fetchScales();
  }, []);

  const fetchScales = async () => {
    try {
      const response = await axios.get(
        'https://100035.pythonanywhere.com/perceptual-mapping/perceptual-mapping-settings'
        // requestOptions
      );
      const results = await response.data;
      setData(results.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching scales:', error.message);
      setIsLoading(false);
    }
  };

  const graphdata = [
    ['itemA', 'itemB'],
    [0, 0],
    [-5, -5],
    [-3, -4],
    [-1, -3],
    [1, -2],
    [3, -1],
    [5, 0],
  ];
  const options = {
    title: 'itemA vs. itemB',
    hAxis: {
      title: 'expensive',
    },

    vAxis: { title: 'cheap' },
    legend: 'none',
    trendlines: { 0: {} },
    colors: ['#000000'],
    // animation: {
    //   startup: true,
    //   duration: 1000,
    //   easing: 'out',
    // },
    crosshair: { trigger: 'both' },
  };

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        <img
          src={dowellLogo}
          alt="Dowell Logo"
          className="w-32 cursor-pointer"
        />
        <p className="my-2 text-4xl text-[#1A8753]">
          Dowell Perceptual Mapping Scales Settings
        </p>
        <div className="flex flex-col  lg:flex-row border-2 border-black w-full lg:w-[60%] h-2/5">
          <div className="p-4 overflow-scroll overflow-x-hidden lg:w-1/4 ">
            <h1 className="text-sm font-medium text-center underline">
              Scale History
            </h1>
            <div className="flex flex-col">
              {Object.values(data).map((e) => (
                <Button width={'full'} key={e._id}>
                  {' '}
                  <Link to={`/100035-DowellScale-Function/single-perceptual-scale-settings/${e._id}`}>
                    {e.settings.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col flex-wrap items-center justify-center mx-auto border border-black lg:p-4 lg:w-3/4">
            <div
              className="flex flex-row flex-wrap justify-center h-[350px] "
              style={{ zoom: 1 }}
            >
              <Chart
                chartType="ScatterChart"
                width="100%"
                height="100%"
                data={graphdata}
                options={options}
              />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[60%] lg:pl-4">
          <div className="flex items-center justify-center h-20 lg:justify-end">
            <Link
              to="/create-perceptual-scale-settings"
              className="px-8 py-2 text-white bg-[#1A8753] rounded-lg focus:outline-none uppercase"
            >
              Create new Scale
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerceptualScale;
