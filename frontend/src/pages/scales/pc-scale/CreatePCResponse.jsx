import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import axios from 'axios';

const CreatePCResponse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const userinfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const userSelections = location.state?.userSelections || [];
  // console.log(userSelections);
  const selectedOptions =
    JSON.parse(localStorage.getItem(`selectedOptions+${id}`)) || [];
  // console.log(selectedOptions);
  // localStorage.clear();
  localStorage.setItem(`optionsSent+${id}`, JSON.stringify(selectedOptions));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [formData, setFormData] = useState({
    user_name: userinfo.userinfo.username || '',
    scale_id: id,
    brand_name: '',
    product_name: '',
    process_id: '1',
    products_ranking: location.state?.userSelections || [],
  });

  // console.log(formData.process_id);

  const handleInputValueChange = (index, value) => {
    const newProductRanking = [...formData.products_ranking];

    newProductRanking[index] = value;
    setFormData({
      ...formData,
      item_list: newProductRanking,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const headers = {
      'Content-Type': 'application/json',
    };

    var requestData = {
      username: formData.user_name,
      scale_id: formData.scale_id,
      brand_name: formData.brand_name,
      product_name: formData.product_name,
      process_id: formData.process_id,
      products_ranking: formData.products_ranking,
    };

    try {
      const data = await axios.post(
        'https://100035.pythonanywhere.com/paired-comparison/paired-comparison-submit-response/',
        // '',
        requestData,
        { headers }
      );
      const result = await data.data;
      console.log(result);

      // const response = JSON.parse(result);
      if (result.error) {
        toast.error(result.error);
        console.log(result.error);
        setFormData({
          username: formData.user_name,
          scale_id: formData.scale_id,
          brand_name: formData.brand_name,
          product_name: formData.product_name,
          process_id: formData.process_id,
          products_ranking: formData.products_ranking,
        });
        setIsLoading(false);
        return;
      } else {
        console.log(result.success);
        console.log(result.data);
        console.log(result.data.response_id);
        setIsLoading(false);
        toast.success('Successfully Created');
      }
    } catch (error) {
      setIsLoading(false);

      const { location_faulty_pair, segmented_ranking } = error.response.data;
      // const array = [location_faulty_pair[1], location_faulty_pair[2]];

      if (
        location_faulty_pair[1] >= 0 &&
        location_faulty_pair[1] < segmented_ranking.length &&
        location_faulty_pair[2] >= 0 &&
        location_faulty_pair[2] <
          segmented_ranking[location_faulty_pair[1]].length
      ) {
        const targetPair =
          segmented_ranking[location_faulty_pair[1]][location_faulty_pair[2]];
        // console.log(`Target Pair: ${JSON.stringify(targetPair)}`);
        toast.error(
          `${error.response.data.error} \n Pair: ${targetPair.join(',')}`
        );
      } else {
        console.log('Invalid index. Pair not found in segmented_ranking');
      }
      // console.log(array);

      console.log('Error', error.response.data);
    }
  };
  // console.log(userSelections);
  const handleGoBack = () => {
    navigate(-1, {
      state: { selections: userSelections },
    }); // This navigates back to the previous page
  };

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="mx-auto my-8 lg:container ">
      <div>
        <button
          onClick={handleGoBack}
          className="px-8 py-2 mt-4 mb-6 ml-2 text-white capitalize bg-blue-500 rounded-lg hover:bg-blue-800 focus:outline-none"
        >
          &#60;&#60; Go Back
        </button>
      </div>
      <form
        className="lg:w-[60%] w-full mx-auto border-4 border-gray-500 bg-[#d9edf7] shadow-md p-8"
        onSubmit={handleSubmit}
      >
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-medium text-center">
            Create scale Response
          </h1>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="mb-4">
            <label
              htmlFor="brand_name"
              className="block font-semibold text-gray-600"
            >
              Brand Name
            </label>
            <input
              type="text"
              id="brand_name"
              name="brand_name"
              value={formData.brand_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 mt-4 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="product_name"
              className="block font-semibold text-gray-600"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 mt-4 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="products_ranking"
              className="block font-semibold text-gray-600"
            >
              Product Ranking
            </label>
            {formData.products_ranking.map((value, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Product Ranking ${index + 1}`}
                value={value}
                disabled
                className="w-full px-4 py-2.5 mt-2 bg-white border rounded-lg focus:outline-none"
                onChange={(e) => handleInputValueChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="flex mt-4 lg:justify-end">
          <button
            type="submit"
            className="px-8 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:outline-none "
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePCResponse;
