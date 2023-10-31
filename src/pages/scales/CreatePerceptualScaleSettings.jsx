import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Fallback from '../../components/Fallback';
import axios from 'axios';

const CreatePerceptualScaleSettings = () => {
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    scale_name: '',
    orientation: '',
    fontcolor: '',
    fontstyle: '',
    scalecolor: '',
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
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(true);
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

    // Check if the value is a positive integer
    if (!isNaN(value) && value > 0) {
      setItemCount(value);
      // setFormData({
      //   item_count: value,
      // });
      setInputValues(Array(value).fill(''));
    } else {
      // Handle invalid input, e.g., show an error message or prevent setting state
      // For simplicity, I'm setting numItems to 0 here
      setItemCount();
      setInputValues([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // eslint-disable-next-line no-unused-vars
  const sessionId = cookies.get('session_id');
  useEffect(() => {
    fetchuser();
  }, []);
  const fetchuser = async () => {
    try {
      // var myHeaders = new Headers();
      // myHeaders.append('Content-Type', 'application/json');
      var requestOptions = {
        session_id: sessionId,
      };
      const headers = {
        'Content-Type': 'application/json',
      };
      const response = await axios.post(
        `https://100014.pythonanywhere.com/api/userinfo/`,
        requestOptions,
        { headers }
      );
      const data = await response.data;
      setFormData({
        user_name: data.userinfo.username,
        scale_id: formData.scale_id,
        brand_name: formData.brand_name,
        product_name: formData.product_name,
        process_id: formData.process_id,
        products_ranking: formData.products_ranking,
      });
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching user:', error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // var myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');

    // var raw = JSON.stringify({
    //   username: formData.username,
    //   scale_name: formData.scale_name,
    //   orientation: formData.orientation,
    //   fontcolor: formData.fontcolor,
    //   fontstyle: formData.fontstyle,
    //   time: formData.time,
    //   scalecolor: formData.scalecolor,
    //   roundcolor: formData.roundcolor,
    //   item_count: itemCount,
    //   item_list: formData.item_list,
    //   no_of_scale: formData.no_of_scale,
    //   allow_resp: formData.allow_resp,
    //   X_upper_limit: formData.X_upper_limit,
    //   Y_upper_limit: formData.Y_upper_limit,
    //   X_left: formData.X_left,
    //   X_right: formData.X_right,
    //   Y_top: formData.Y_top,
    //   Y_bottom: formData.Y_bottom,
    //   marker_type: formData.marker_type,
    //   marker_color: formData.marker_color,
    //   X_spacing: formData.X_spacing,
    //   Y_spacing: formData.Y_spacing,
    // });
    // console.log(raw);

    const headers = {
      'Content-Type': 'application/json',
    };

    var requestOptions = {
      username: formData.username,
      scale_name: formData.scale_name,
      orientation: formData.orientation,
      fontcolor: formData.fontcolor,
      fontstyle: formData.fontstyle,
      time: formData.time,
      scalecolor: formData.scalecolor,
      roundcolor: formData.roundcolor,
      item_count: itemCount,
      item_list: formData.item_list,
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
      const data = await fetch(
        'https://100035.pythonanywhere.com/perceptual-mapping/perceptual-mapping-settings/',
        // '',
        requestOptions,
        { headers }
      );
      const result = await data.data;
      console.log(result);

      if (result.error) {
        console.log(result);
        toast.error(result.error);
        setFormData({
          user_name: '',
          scale_name: '',
          orientation: '',
          fontcolor: '',
          fontstyle: '',
          scalecolor: '',
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
        console.log(`${JSON.parse(result.success).inserted_id}`);
        toast.success('Successfully Created');
        const timeout = setTimeout(
          () =>
            navigate(
              `/single-perceptual-scale-settings/${
                JSON.parse(result.success).inserted_id
              }`
            ),
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
              className="w-full px-4 py-2 mt-4 border rounded-lg focus:outline-none"
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
                value={formData.scalecolor || '#000000'}
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
          <div className="mb-4">
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
                  className="px-4 py-2 mt-2 border rounded-lg focus:outline-none"
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
                      className="inline w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
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
                      id="x_upper_limit"
                      name="x_upper_limit"
                      value={formData.X_upper_limit || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
                      // required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      id="x_upper_limit"
                      name="x_upper_limit"
                      value={formData.X_upper_limit || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
                      // required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="y_upper_limit"
                  className="block font-semibold text-center text-gray-600"
                >
                  Y asix limits
                </label>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <input
                      type="number"
                      id="y_upper_limit"
                      name="y_upper_limit"
                      value={formData.Y_upper_limit || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
                      // required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      id="y_upper_limit"
                      name="y_upper_limit"
                      value={formData.Y_upper_limit || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
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
                  htmlFor="x_spacing"
                  className="block font-semibold text-gray-600 "
                >
                  X spacing
                </label>
                <input
                  type="number"
                  id="x_spacing"
                  name="x_spacing"
                  value={formData.X_spacing || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
                  // required
                />
              </div>
              <div>
                <label
                  htmlFor="y_spacing"
                  className="block font-semibold text-gray-600"
                >
                  Y spacing
                </label>
                <input
                  type="number"
                  id="y_spacing"
                  name="y_spacing"
                  value={formData.Y_spacing || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
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
              className="bg-gray-50 border focus:outline-none text-gray-900 text-sm rounded-lg  block w-full p-2.5 mt-4"
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
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none"
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
              className="bg-gray-50 border focus:outline-none text-gray-900 text-sm rounded-lg  block w-full p-2.5 mt-4"
            >
              <option value="">Choose...</option>
              <option value="red">Red</option>
            </select>
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
