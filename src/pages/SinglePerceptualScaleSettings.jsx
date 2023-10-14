import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Fallback from '../components/Fallback';
import axios from 'axios';
// import ScatterPlot from '../components/ScatterPlot';
import { Chart } from 'react-google-charts';

const SinglePerceptualScaleSettings = () => {
  const [chartData, setChartData] = useState(null);
  const { id } = useParams();
  // State variables
  const [data, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  const [graphdata, setGraphdata] = useState([]);

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
        url: `https://100035.pythonanywhere.com/perceptual-mapping/perceptual-mapping-settings/?scale_id=${id}`,
        method: 'GET',
        headers: headersList,
      };
      let response = await axios.request(reqOptions);
      // );

      const results = response.data;
      console.log(results.success.data);
      setData(results.success.data);
      // setChartData(results.success.data);
      setIsLoading(false);
      // const combinedData = results.success.data.settings.x_range.map(
      //   (x, index) => [x, results.success.data.settings.y_range[index] || null]
      // );
      const axis = [
        results.success.data.settings.X_left,
        results.success.data.settings.Y_bottom,
      ];
      console.log(axis);
      const combinedData = [];

      // for (let i = 0; i < results.success.data.settings.x_range.length; i++) {
      //   const x = results.success.data.settings.x_range[i];
      //   const y = results.success.data.settings.y_range[i] !== undefined ? results.success.data.settings.y_range[i] : null;
      //   combinedData.push([x, y]);
      // }
      combinedData.push(axis, results.success.data.settings.center);
      for (
        let i = 0;
        i < results.success.data.settings.x_range.length ||
        i < results.success.data.settings.y_range.length;
        i++
      ) {
        const x =
          results.success.data.settings.x_range[i] !== undefined
            ? results.success.data.settings.x_range[i]
            : null;
        const y =
          results.success.data.settings.y_range[i] !== undefined
            ? results.success.data.settings.y_range[i]
            : null;
        combinedData.push([x, y]);
      }
      console.log(JSON.stringify(combinedData));
      // const itemLabels = results.success.data.settings.center;
      // const centerPoint = results.success.data.settings.item_list;
      // combinedData.unshift(results.success.data.settings.center);
      // combinedData.unshift(results.success.data.settings.item_list);
      // const newData = [centerPoint, itemLabels, ...combinedData];
      // setGraphdata((prevGraphData) => [...newData, ...prevGraphData]);
      // console.log(newData);
      // console.log(graphdata);
      setGraphdata(combinedData);
      // console.log(results.success.data.settings.x_range);
      // console.log(results.success.data.settings.y_range);
      // graphdata.push(results.success.data.settings.center);
      // graphdata.push(results.success.data.settings.item_list);
      // console.log(graphdata);
      // setChartData();
      // console.log('graph_data before numbers');
      // for (let i = 0; i < results.success.data.settings.x_range.length; i++) {
      //   graphdata.push([
      //     results.success.data.settings.x_range[i],
      //     results.success.data.settings.y_range[i],
      //   ]);
      // }

      // // If you want to replace any null values with null, you can use this:
      // graphdata.forEach((point) => {
      //   if (point[1] === undefined) {
      //     point[1] = null;
      //   }
      // });

      // console.log(graphdata);
    } catch (error) {
      console.log('Error fetching scales:', error.message);
      setIsLoading(false);
    }
  };

  // const x_range = [-5, -3, -1, 1, 3, 5];
  // const y_range = [-6, -3, 0, 3, 6];

  // const d_graph_data = [];

  // for (let i = 0; i < x_range.length; i++) {
  //   d_graph_data.push([x_range[i], y_range[i]]);
  // }

  // // If you want to replace any null values with null, you can use this:
  // d_graph_data.forEach((point) => {
  //   if (point[1] === undefined) {
  //     point[1] = null;
  //   }
  // });

  // console.log(d_graph_data);

  // useEffect(() => {
  //   // Simulated data for demonstration (replace this with your data fetching logic)
  //   const plot_data = {
  //     success: {
  //       isSuccess: true,
  //       data: {
  //         _id: '651ab8ba0985da4a4741d3d7',
  //         event_id: 'FB101000000001696250041#441501',
  //         settings: {
  //           item_list: ['itemA', 'itemB'],
  //           scale_color: '#0000',
  //           fontstyle: 'Arial, Helvetica, sans-serif',
  //           no_of_scales: 1,
  //           fontcolor: '#C5GFW8',
  //           time: 100,
  //           name: 'testscale1',
  //           'scale-category': 'perceptual mapping',
  //           username: 'adebayo',
  //           item_count: 2,
  //           X_left: 'slow',
  //           X_right: 'fast',
  //           Y_top: 'expensive',
  //           Y_bottom: 'cheap',
  //           marker_color: '#0000',
  //           center: [0, 0],
  //           position: 'center',
  //           marker_type: 'dot',
  //           x_range: [-5, -3, -1, 1, 3, 5],
  //           y_range: [-6, -3, 0, 3, 6],
  //           allow_resp: true,
  //           X_spacing: 2,
  //           Y_spacing: 3,
  //           date_created: '2023-10-02 13:34:01',
  //           date_updated: '2023-10-11 12:52:27',
  //         },
  //       },
  //     },
  //   };
  //   console.log('plot_data');
  //   console.log(plot_data);
  //   setChartData(plot_data.success.data.settings);
  // }, []);

  const options = {
    title: 'itemA vs. itemB',
    hAxis: {
      title: 'expensive',
    },

    vAxis: { title: 'cheap' },
    legend: 'none',
    trendlines: { 0: {} },
    colors: ['#000000'],
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
    crosshair: { trigger: 'both' },
  };

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className='m-4'>
      <h1 className="text-2xl font-bold text-center uppercase">Your Perceptual Mapping Scale</h1>
      <div className="flex flex-col items-center justify-center m-10 border-2 border-black">
      <h1 className="text-2xl font-bold text-center uppercase p-4">{data.settings.name} Perception</h1>
      <div className="flex flex-col lg:flex-row border-2 border-black rounded-lg w-full lg:w-[60%] h-3/5">
        <div className="flex flex-wrap items-center justify-center p-4 mx-auto lg:w-3/4">
          <div
            className="flex flex-row flex-wrap justify-center h-[300px] "
            style={{ zoom: 2 }}
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
        <div className="flex flex-col flex-wrap items-center p-4 mx-auto border border-black lg:w-1/4">
          <h1 className="text-2xl font-medium text-center underline mt-4">
            AVAILABLE ITEMS
          </h1>
          <div className="flex flex-col ">
            {Object.values(data.settings.item_list).map((e, index) => (
              <p key={index} className='my-4 text-xl'>{e}</p>
              // <Button width={'full'} key={e._id}>
              //   {' '}
              //   <Link to={`/single-perceptual-scale-settings/${e._id}`}>
              //     {e.settings.name}
              //   </Link>
              // </Button>
            ))}
          </div>
        </div>
        {/* </div> */}
      </div>
      <div className="w-full lg:w-[60%] lg:pl-4">
          <div className="flex items-center justify-center h-40 lg:justify-end space-x-4">
            <Link
              to=""
              className="px-8 py-2 text-white bg-[#1A8753] rounded-lg focus:outline-none uppercase"
            >
              Update Scale 
            </Link>
            <Link
              to="/create-perceptual-scale-settings"
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
