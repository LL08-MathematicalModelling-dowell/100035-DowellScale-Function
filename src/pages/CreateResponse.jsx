import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useNavigate,
  // useParams
} from 'react-router-dom';

const CreateResponse = () => {
  // const { scale_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: '',
    scale_id: '',
    orientation: '',
    fontcolor: '',
    fontstyle: '',
    scalecolor: '',
    roundcolor: '',
    time: 0,
    item_list: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const itemListArray = JSON.parse(formData.item_list);
    // const headers = { 'Content-Type': 'application/json' };
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
      'item list': formData.item_list.split(''),
    });
    console.log(raw);

    var requestOptions = {
      method: 'POST',
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

      // const response = JSON.parse(result);
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
  return (
    <div className="container mx-auto mt-8">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-4xl font-bold">Paired Comparison Scale</h1>
        <h3 className="text-xl font-semibold">Create Scale Settings</h3>
      </div>
      <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
        {/* <div className="mb-4">
          <label
            htmlFor="user_name"
            className="block font-semibold text-gray-600"
          >
            UserName
          </label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            // required
          />
        </div> */}

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
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
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
          <input
            type="text"
            id="orientation"
            name="orientation"
            value={formData.orientation}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
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
          <input
            type="color"
            id="fontcolor"
            name="fontcolor"
            value={formData.fontcolor}
            onChange={handleChange}
            className="w-full border rounded-lg focus:outline-none focus:ring"
            // required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="fontstyle"
            className="block font-semibold text-gray-600"
          >
            Font Style
          </label>
          <input
            type="text"
            id="fontstyle"
            name="fontstyle"
            value={formData.fontstyle}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            // required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="scalecolor"
            className="block font-semibold text-gray-600"
          >
            Scale Color
          </label>
          <input
            type="color"
            id="scalecolor"
            name="scalecolor"
            value={formData.scalecolor}
            onChange={handleChange}
            className="w-full border rounded-lg focus:outline-none focus:ring"
            // required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="roundcolor"
            className="block font-semibold text-gray-600"
          >
            Round Color
          </label>
          <input
            type="color"
            id="roundcolor"
            name="roundcolor"
            value={formData.roundcolor}
            onChange={handleChange}
            className="w-full border rounded-lg focus:outline-none focus:ring"
            // required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="time" className="block font-semibold text-gray-600">
            Time
          </label>
          <input
            type="number"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            // required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="item_list"
            className="block font-semibold text-gray-600"
          >
            Item List
          </label>
          <input
            type="text"
            id="item_list"
            name="item_list"
            value={formData.item_list}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            // required
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="px-12 py-2 text-white bg-[#1A8753] rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResponse;
