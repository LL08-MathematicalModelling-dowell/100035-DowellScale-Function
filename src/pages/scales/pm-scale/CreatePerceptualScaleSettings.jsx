import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import axios from 'axios';

const CreatePerceptualScaleSettings = () => {
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState([]);
  const userinfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const [formData, setFormData] = useState({
    username: userinfo.userinfo.username || '',
    scale_name: '',
    fontcolor: '',
    fontstyle: '',
    scale_color: '',
    roundcolor: '',
    time: 0,
    item_list: inputValues,
    no_of_scale: 0,
    allow_resp: true,
    X_upper_limit: 0,
    Y_upper_limit: 0,
    X_left: '',
    X_right: '',
    Y_top: '',
    Y_bottom: '',
    marker_type: '',
    marker_color: '',
    X_spacing: 0,
    Y_spacing: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInputVisible, setInputVisible] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const toggleInput = () => {
    setInputVisible(!isInputVisible);
  };
  const handleInputValueChange = (index, value) => {
    setInputValues((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[index] = value;
      return newInputValues;
    });
  };
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);

    if (!isNaN(value) && value > 0) {
      setItemCount(value);
      setInputValues(Array(value).fill(''));
    } else {
      setItemCount();
      setInputValues([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    var requestOptions = {
      username: formData.username,
      scale_name: formData.scale_name,
      fontcolor: formData.fontcolor,
      fontstyle: formData.fontstyle,
      time: formData.time,
      scale_color: formData.scale_color,
      item_count: itemCount,
      item_list: inputValues,
      no_of_scale: formData.no_of_scale,
      allow_resp: formData.allow_resp,
      X_upper_limit: formData.X_upper_limit,
      Y_upper_limit: formData.Y_upper_limit,
      X_left: formData.X_left,
      X_right: formData.X_right,
      Y_top: formData.Y_top,
      Y_bottom: formData.Y_bottom,
      marker_type: formData.marker_type,
      marker_color: formData.marker_color,
      X_spacing: formData.X_spacing,
      Y_spacing: formData.Y_spacing,
    };

    try {
      const data = await axios.post(
        'https://100035.pythonanywhere.com/perceptual-mapping/perceptual-mapping-settings/',
        // '',
        requestOptions,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const result = await data.data;
      console.log(result);

      if (result.error) {
        console.log(result);
        toast.error(result.error);
        setFormData({
          user_name: userinfo.userinfo.username || '',
          scale_name: '',
          orientation: '',
          fontcolor: '',
          fontstyle: '',
          scale_color: '',
          roundcolor: '',
          time: 0,
          item_list: inputValues,
          no_of_scale: 0,
          allow_resp: true,
          X_upper_limit: 0,
          Y_upper_limit: 0,
          X_left: '',
          X_right: '',
          Y_top: '',
          Y_bottom: '',
          marker_type: '',
          marker_color: '',
          X_spacing: 0,
          Y_spacing: 0,
        });
        setIsLoading(false);
        return;
      } else {
        setIsLoading(false);
        toast.success('Successfully Created');
        const timeout = setTimeout(
          () =>
            navigate(
              `/100035-DowellScale-Function/single-perceptual-scale-settings/${JSON.parse(result.success).inserted_id}`),
          3000
        );
        return () => clearTimeout(timeout);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error', error);
    }
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <div className="mx-auto mt-8 lg:container ">
      <form
        className="lg:w-[100%] w-full mx-auto border-4 border-gray-500 bg-[#d9edf7] shadow-md p-8"
        onSubmit={handleSubmit}
      >
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-medium text-center">
            Setup Your Perceptual Mapping Scale
          </h1>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <div className="mb-4">
            <label
              htmlFor="scale_name"
              className="block font-semibold text-gray-600"
            >
              Scale name
            </label>
            <input
              type="text"
              id="scale_name"
              name="scale_name"
              value={formData.scale_name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 mt-4 border rounded-lg focus:outline-none"
              // required
            />
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
                value={formData.fontcolor || '#000000'}
                onChange={handleChange}
                className="w-full my-2 rounded-lg focus:outline-none"
                // required
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="scale_color"
              className="block font-semibold text-gray-600"
            >
              Scale Color
            </label>
            <div className="px-2 my-4 bg-white rounded-lg">
              <input
                type="color"
                id="scale_color"
                name="scale_color"
                value={formData.scale_color || '#000000'}
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
                value={formData.roundcolor || '#000000'}
                onChange={handleChange}
                className="w-full my-2 border rounded-lg focus:outline-none "
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
          <div className="mb-2">
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <label
                  htmlFor="item_count"
                  className="font-semibold text-gray-600 "
                >
                  Number of Items:
                </label>
                <input
                  type="number"
                  name="item_count"
                  id="item_count"
                  value={itemCount || 0}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 mt-4 border rounded-lg focus:outline-none"
                />
              </div>

              <div>
                {inputValues.map((value, index) => (
                  <div key={index} className="inline">
                    <input
                      // key={index}
                      type="text"
                      name="item_list"
                      placeholder={`paired ${index + 1}`}
                      value={value}
                      className="inline w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                      onChange={(e) =>
                        handleInputValueChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="grid gap-0 md:grid-cols-1">
              <div>
                <label
                  htmlFor="x_upper_limit"
                  className="block font-semibold text-center text-gray-600"
                >
                  X asix limits
                </label>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <input
                      type="number"
                      id="X_upper_limit"
                      name="X_upper_limit"
                      value={formData.X_upper_limit || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                      // required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      id="X_upper_limit"
                      name="X_upper_limit"
                      value={`-${formData.X_upper_limit}` || 0}
                      disabled
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="Y_upper_limit"
                  className="block font-semibold text-center text-gray-600"
                >
                  Y asix limits
                </label>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <input
                      type="number"
                      id="Y_upper_limit"
                      name="Y_upper_limit"
                      value={formData.Y_upper_limit || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                      // required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      id="Y_upper_limit"
                      name="Y_upper_limit"
                      value={`-${formData.Y_upper_limit}` || 0}
                      disabled
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                      // required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="X_spacing"
                  className="block font-semibold text-gray-600 "
                >
                  X spacing
                </label>
                <input
                  type="number"
                  id="X_spacing"
                  name="X_spacing"
                  value={formData.X_spacing || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                  // required
                />
              </div>
              <div>
                <label
                  htmlFor="Y_spacing"
                  className="block font-semibold text-gray-600"
                >
                  Y spacing
                </label>
                <input
                  type="number"
                  id="Y_spacing"
                  name="Y_spacing"
                  value={formData.Y_spacing || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                  // required
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="marker_type"
              className="block font-semibold text-gray-600"
            >
              Marker Type
            </label>
            <select
              id="marker_type"
              name="marker_type" // Add the name attribute
              value={formData.marker_type}
              onChange={handleChange}
              className="bg-gray-50 border focus:outline-none text-gray-900 text-sm rounded-lg  block w-full p-2.5 mt-2"
            >
              <option value="">Choose...</option>
              <option value="dot">Dot</option>
            </select>
          </div>
          <div className="mb-4">
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <label
                  htmlFor="time"
                  className="block font-semibold text-gray-600"
                >
                  Toggle to set time
                </label>
                <label className="relative inline-flex items-center mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="toggle"
                    value=""
                    className="sr-only peer"
                    checked={isInputVisible}
                    onChange={toggleInput}
                  />
                  <div className="w-11 h-6 bg-gray-400 rounded-full peer   peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-400"></div>
                </label>
              </div>
              {isInputVisible && (
                <div>
                  <label
                    htmlFor="time"
                    className="block font-semibold text-gray-600"
                  >
                    Time(secs)
                  </label>
                  <input
                    type="number"
                    id="time"
                    name="time"
                    value={formData.time || 0}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 mt-2 border rounded-lg focus:outline-none"
                    // required
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="marker_type"
              className="block font-semibold text-gray-600"
            >
              Marker Color
            </label>
            <select
              id="marker_color"
              name="marker_color" // Add the name attribute
              value={formData.marker_color}
              onChange={handleChange}
              className="bg-gray-50 border focus:outline-none text-gray-900 text-sm rounded-lg  block w-full p-2.5 mt-2"
            >
              <option value="">Choose...</option>
              <option value="red">Red</option>
            </select>
          </div>
          <div>
            <label
              htmlFor=""
              className="block font-semibold text-center text-gray-600"
            >
              Axes labels
            </label>
            <div className="grid gap-6 mb-4 md:grid-cols-3">
              <div className='lg:text-right lg:items-right lg:col-span-1' >
                <label htmlFor="X_left">Left</label>
              </div>
              <div className='lg:col-span-2'>
                <input
                  type="text"
                  id="X_left"
                  name="X_left"
                  value={formData.X_left}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none"
                  // required
                />
              </div>
            </div>
            <div className="grid gap-6 mb-4 md:grid-cols-3">
              <div className='lg:text-right lg:items-right lg:col-span-1' >
                <label htmlFor="X_right">Right</label>
              </div>
              <div className='lg:col-span-2'>
                <input
                  type="text"
                  id="X_right"
                  name="X_right"
                  value={formData.X_right}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none"
                  // required
                />
              </div>
            </div>
            <div className="grid gap-6 mb-4 md:grid-cols-3">
              <div className='lg:text-right lg:items-right lg:col-span-1' >
                <label htmlFor="Y_top">Top</label>
              </div>
              <div className='lg:col-span-2'>
                <input
                  type="text"
                  id="Y_top"
                  name="Y_top"
                  value={formData.Y_top}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none"
                  // required
                />
              </div>
            </div>
            <div className="grid gap-6 mb-4 md:grid-cols-3">
              <div className='lg:text-right lg:items-right lg:col-span-1' >
                <label htmlFor="Y_bottom">Bottom</label>
              </div>
              <div className='lg:col-span-2'>
                <input
                  type="text"
                  id="Y_bottom"
                  name="Y_bottom"
                  value={formData.Y_bottom}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none"
                  // required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-4 lg:justify-end">
          <button
            type="submit"
            className="px-8 py-2 text-white bg-[#1A8753] rounded-lg  focus:outline-none uppercase"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePerceptualScaleSettings;
