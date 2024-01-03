import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Fallback from '../../../components/Fallback';

const UpdatePCScaleSettings = () => {
  const { id } = useParams();
  const [datas, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  // eslint-disable-next-line no-unused-vars
  const [itemCount, setItemCount] = useState(0);
  const [isInputVisible, setInputVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [inputValues, setInputValues] = useState([]);
  const toggleInput = () => {
    setInputVisible(!isInputVisible);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    formData.item_count = value;

    // Check if the value is a positive integer
    if (!isNaN(value) && value > 0) {
      formData.item_list = Array(value).fill('');
      setItemCount(value);
      setInputValues(Array(value).fill(''));
    } else {
      // Handle invalid input, e.g., show an error message or prevent setting state
      // For simplicity, I'm setting numItems to 0 here
      setItemCount();
      formData.item_list = [];
      setInputValues([]);
    }
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    scale_name: '',
    orientation: '',
    fontcolor: '',
    fontstyle: '',
    scalecolor: '',
    roundcolor: '',
    time: 0,
    item_count: 0,
    item_list: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'time' ? parseFloat(value) : value,
    });
  };

  const handleInputValueChange = (index, value) => {
    const newItemList = [...formData.item_list];
    console.log(newItemList);

    newItemList[index] = value;
    setFormData({
      ...formData,
      item_list: newItemList,
    });
  };

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

      const results = response.data.success;
      setData(results);
      console.log(results);
      setIsLoading(false);
      setInputValues([...results.item_list]);
      setFormData({
        scale_name: results.name,
        username: results.username,
        orientation: results.orientation,
        fontcolor: results.fontcolor,
        fontstyle: results.fontstyle,
        time: results.time,
        scalecolor: results.scalecolor,
        roundcolor: results.roundcolor,
        item_count: results.item_list.length,
        item_list: results.item_list,
      });
    } catch (error) {
      console.log(`Error fetching scale of id ${id}:`, error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(formData.username);
    const formDataObject = new FormData();
    formDataObject.append('scale_id', id);
    formDataObject.append('username', formData.username);
    formDataObject.append('scale_name', formData.scale_name);
    formDataObject.append('orientation', formData.orientation);
    formDataObject.append('fontcolor', formData.fontcolor);
    formDataObject.append('fontstyle', formData.fontstyle);
    formDataObject.append('scalecolor', formData.scalecolor);
    formDataObject.append('roundcolor', formData.roundcolor);
    formDataObject.append('time', formData.time);
    formDataObject.append('item_count', formData.item_count);
    // formDataObject.append('item_list', formData.item_list);

    formData.item_list.forEach((value) => {
      formDataObject.append(`item_list`, value);
    });

    try {
      const data = await axios.put(
        'https://100035.pythonanywhere.com/paired-comparison/paired-comparison-settings/',
        // '',
        formDataObject,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const result = await data.data;

      if (!result.success) {
        toast.error(result.error);
        setFormData({
          username: datas.username,
          scale_name: datas.name,
          orientation: datas.orientation,
          fontcolor: datas.fontcolor,
          fontstyle: datas.fontstyle,
          time: datas.time,
          scalecolor: datas.scalecolor,
          roundcolor: datas.roundcolor,
          item_count: datas.item_list.length,
          item_list: datas.item_list,
        });
        setIsLoading(false);
        return;
      } else {
        console.log(result.success);
        console.log(result.data);
        setIsLoading(false);
        toast.success(result.success);
        const timeout = setTimeout(
          () => navigate(`/100035-DowellScale-Function/single-scale-settings/${id}`),
          3000
        );
        return () => clearTimeout(timeout);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(formData.item_list);
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
          <h1 className="text-2xl font-bold font-arial">
            Update Scale Settings
          </h1>
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
              className="w-full px-4 py-2.5 mt-4 border rounded-lg focus:outline-none"
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
              id="fontstyle"
              name="fontstyle" // Add the name attribute
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
                className="w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                // required
              />
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="numItems" className="font-semibold text-gray-600 ">
              Number of Items:
            </label>
            <input
              type="number"
              id="numItems"
              value={formData.item_count}
              onChange={handleInputChange}
              className="px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
            />
            <div>
              {formData.item_list.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`paired ${index + 1}`}
                  value={value}
                  className="w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                  onChange={(e) =>
                    handleInputValueChange(index, e.target.value)
                  }
                />
              ))}
            </div>
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

export default UpdatePCScaleSettings;
