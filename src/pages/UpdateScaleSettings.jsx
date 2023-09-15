import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Fallback from '../components/Fallback';
// import Cookies from 'universal-cookie';

const UpdateScaleSettings = () => {
  const { id } = useParams();
  // const cookies = new Cookies();
  const [data, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  const [isInputVisible, setInputVisible] = useState(false);
  const toggleInput = () => {
    setInputVisible(!isInputVisible);
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // user_name: '',
    scale_name: '',
    orientation: '',
    fontcolor: '',
    fontstyle: '',
    scalecolor: '',
    roundcolor: '',
    time: 0,
    item_list_1: '',
    item_list_2: '',
    item_list_3: '',
  });

  // const [rangeValue, setRangeValue] = useState(50);

  // const handleRangeChange = (event) => {
  //   setRangeValue(event.target.value);
  // };

  // const sessionId = cookies.get('sessionid');
  // useEffect(() => {
  //   fetchuser();
  // }, []);
  // const fetchuser = async () => {
  //   try {
  //     var myHeaders = new Headers();
  //     myHeaders.append('Content-Type', 'application/json');
  //     var requestOptions = {
  //       method: 'POST',
  //       headers: myHeaders,
  //       body: JSON.stringify({
  //         // session_id: sessionId,
  //         session_id: 'zeien1pcnhb1zzgo6qwu71u4epfjv93u',
  //       }),
  //       redirect: 'follow',
  //     };
  //     const response = await fetch(
  //       `https://100014.pythonanywhere.com/api/userinfo/`,
  //       requestOptions
  //     );
  //     const data = await response.json();
  //     console.log(data.userinfo);
  //     setFormData({
  //       user_name: data.userinfo.username,
  //     });
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log('Error fetching user:', error.message);
  //     setIsLoading(false);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

      let response = await axios.request(reqOptions);
      // );

      const results = response.data.success;
      console.log(results);
      setData(results);
      console.log(data);
      setIsLoading(false);
      setFormData({
        // user_name: formData.user_name,
        scale_name: results.name,
        orientation: results.orientation,
        fontcolor: results.fontcolor,
        fontstyle: results.fontstyle,
        time: results.time,
        scalecolor: results.scalecolor,
        roundcolor: results.roundcolor,
        item_list_1: results.item_list[0],
        item_list_2: results.item_list[1],
        item_list_3: results.item_list[2],
      });
      // setRangeValue(data.time);
    } catch (error) {
      console.log(`Error fetching scale of id ${id}:`, error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const item_list = [
      formData.item_list_1,
      formData.item_list_2,
      formData.item_list_3,
    ];

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      username: formData.user_name,
      scale_name: formData.scale_name,
      orientation: formData.orientation,
      fontcolor: formData.fontcolor,
      fontstyle: formData.fontstyle,
      scalecolor: formData.scalecolor,
      roundcolor: formData.roundcolor,
      time: formData.time,
      'item list': item_list.join(','),
    });
    console.log(raw);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const data = await fetch(
        'https://100035.pythonanywhere.com/paired-comparison/paired-comparison-settings/',
        // '',
        requestOptions
      );
      const result = await data.json();
      console.log(result);
      if (
        !JSON.parse(result.success).isSuccess ||
        JSON.parse(result.success).isSuccess === false
      ) {
        console.log(JSON.parse(result.success).isSuccess);
        return;
      } else {
        console.log(`${JSON.stringify(result?.data)}`);
        toast.success(
          `Inserted Id = ${
            JSON.parse(result.success).inserted_id
          } ${JSON.stringify(result?.data)}`
        );
        const timeout = setTimeout(() => navigate('/'), 3000);
        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="mx-auto mt-8 lg:container">
      <form
        className="lg:w-[60%] w-full mx-auto border-4 border-gray-500 bg-[#d9edf7] shadow-md p-8"
        onSubmit={handleSubmit}
      >
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold font-arial">Update Scale Settings</h1>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="mb-4">
            <label
              htmlFor="scale_name"
              className="block font-semibold text-gray-600"
            >
              Scale Name
            </label>
            <input
              type="text"
              id="scale_name"
              name="scale_name"
              value={formData.scale_name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-4 border rounded-lg focus:outline-none"
              // required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="orientation"
              className="block font-semibold text-gray-600"
            >
              Orientation
            </label>
            <select
              id="orientation"
              name="orientation" // Add the name attribute
              value={formData.orientation}
              onChange={handleChange}
              className="bg-gray-50 border focus:outline-none text-gray-900 text-sm rounded-lg  block w-full p-2.5 mt-4"
            >
              <option value="">Choose...</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="fontcolor"
              className="block font-semibold text-gray-600"
            >
              Font Color
            </label>
            <div className="px-2 my-4 bg-white rounded-lg">
              <input
                type="color"
                id="fontcolor"
                name="fontcolor"
                value={formData.fontcolor}
                onChange={handleChange}
                className="w-full my-2 rounded-lg focus:outline-none"
                // required
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="fontstyle"
              className="block font-semibold text-gray-600"
            >
              Font Style
            </label>
            <select
              id="orientation"
              name="orientation" // Add the name attribute
              value={formData.fontstyle}
              onChange={handleChange}
              className="bg-gray-50 border focus:outline-none text-gray-900 text-sm rounded-lg  block w-full p-2.5 mt-4"
            >
              <option value="">Choose...</option>
              <option value="Arial, sans-serif">Arial, sans-serif</option>
              <option value="Helvetica, sans-serif">
                Helvetica, sans-serif
              </option>
              <option value="Times New Roman, serif">
                Times New Roman, serif
              </option>
              <option value="Georgia, serif">Georgia, serif</option>
              <option value="Verdana, sans-serif">Verdana, sans-serif</option>
              <option value="Courier New, monospace">
                Courier New, monospace
              </option>
              <option value="Arial Black, sans-serif">
                Arial Black, sans-serif
              </option>
              <option value="Comic Sans MS, sans-serif">
                Comic Sans MS, sans-serif
              </option>
              <option value="Trebuchet MS, sans-serif">
                Trebuchet MS, sans-serif
              </option>
              <option value="Palatino, serif">Palatino, serif</option>
              <option value="Lucida Sans Unicode, sans-serif">
                Lucida Sans Unicode, sans-serif
              </option>
              <option value="Garamond, serif">Garamond, serif</option>
              <option value="Courier, monospace">Courier, monospace</option>
              <option value="Bookman Old Style, serif">
                Bookman Old Style, serif
              </option>
              <option value="Tahoma, sans-serif">Tahoma, sans-serif</option>
              <option value="Impact, sans-serif">Impact, sans-serif</option>
              <option value="Century Gothic, sans-serif">
                Century Gothic, sans-serif
              </option>
              <option value="Copperplate, sans-serif">
                Copperplate, sans-serif
              </option>
              <option value="Franklin Gothic Medium, sans-serif">
                Franklin Gothic Medium, sans-serif
              </option>
              <option value="Baskerville, serif">Baskerville, serif</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="scalecolor"
              className="block font-semibold text-gray-600"
            >
              Scale Color
            </label>
            <div className="px-2 my-4 bg-white rounded-lg">
              <input
                type="color"
                id="scalecolor"
                name="scalecolor"
                value={formData.scalecolor}
                onChange={handleChange}
                className="w-full my-2 border rounded-lg focus:outline-none "
                // required
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="roundcolor"
              className="block font-semibold text-gray-600"
            >
              Round Color
            </label>
            <div className="px-2 my-4 bg-white rounded-lg">
              <input
                type="color"
                id="roundcolor"
                name="roundcolor"
                value={formData.roundcolor}
                onChange={handleChange}
                className="w-full my-2 border rounded-lg focus:outline-none "
                // required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block font-semibold text-gray-600">
              Time(secs)
            </label>

            <label className="relative inline-flex items-center mb-4 cursor-pointer">
              <input
                type="checkbox"
                name="time"
                value=""
                className="sr-only peer"
                checked={isInputVisible}
                onChange={toggleInput}
              />
              <div className="w-11 h-6 bg-gray-400 rounded-full peer   peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-400"></div>
              <span className="ml-3 text-sm">Toggle Time</span>
            </label>
            {isInputVisible && (
              <input
                type="number"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
                // required
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-600">
              Item List
            </label>
            <input
              type="text"
              id="item_list_1"
              name="item_list_1"
              value={formData.item_list_1}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
              // required
            />
            <input
              type="text"
              id="item_list_2"
              name="item_list_2"
              value={formData.item_list_2}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
              // required
            />
            <input
              type="text"
              id="item_list_3"
              name="item_list_3"
              value={formData.item_list_3}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
              // required
            />
          </div>

        </div>
          <div className="flex mt-4 lg:justify-end">
            <button
              type="submit"
              className="px-8 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:outline-none "
            >
              Update
            </button>
          </div>
      </form>
    </div>
  );
};

export default UpdateScaleSettings;
