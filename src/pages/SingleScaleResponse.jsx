// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Fallback from '../components/Fallback';

// const SingleScaleResponse = () => {
//   const { id } = useParams();
//   // State variables
//   const [data, setData] = useState([]); // Holds the list of tasks
//   const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded

//   useEffect(() => {
//     fetchScales(id);
//   }, [id]);

//   const fetchScales = async (id) => {
//     var myHeaders = new Headers();
//     myHeaders.append('Content-Type', 'application/json');
//     var requestOptions = {
//       method: 'GET',
//       headers: myHeaders,
//       // body: raw,
//       redirect: 'follow',
//     };
//     try {
//       const response = await fetch(
//         `https://100035.pythonanywhere.com/paired-comparison/paired-comparison-response/${id}`,
//         requestOptions
//       );
//       const results = await response.json();
//       console.log(results.payload);
//       setData(results.payload);
//       setIsLoading(false);
//     } catch (error) {
//       console.log('Error fetching scales:', error.message);
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <Fallback />;
//   }
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <h1 className="my-4 text-4xl text-green-900">Single Scale Response</h1>
//       <div className="relative mt-6 overflow-x-auto">
//         {data && (
//           <table className="w-full text-sm text-left text-gray-500">
//             <tbody>
//               <tr className="bg-white border ">
//                 <th
//                   scope="row"
//                   className="px-6 py-4 text-xl font-bold text-gray-900 whitespace-nowrap"
//                 >
//                   Username
//                 </th>
//                 <td className="px-6 py-4 text-lg">{data.username}</td>
//               </tr>

//               <tr className="bg-white border ">
//                 <th
//                   scope="row"
//                   className="px-6 py-4 text-xl font-bold text-gray-900 whitespace-nowrap"
//                 >
//                   Scale Type
//                 </th>
//                 <td className="px-6 py-4 text-lg">
//                   {data.scale_data?.scale_type}
//                 </td>
//               </tr>
//               <tr className="bg-white border ">
//                 <th
//                   scope="row"
//                   className="px-6 py-4 text-xl font-bold text-gray-900 whitespace-nowrap"
//                 >
//                   Brand Name
//                 </th>
//                 <td className="px-6 py-4 text-lg">
//                   {data.brand_data.brand_name}
//                 </td>
//               </tr>
//               <tr className="bg-white border ">
//                 <th
//                   scope="row"
//                   className="px-6 py-4 text-xl font-bold text-gray-900 whitespace-nowrap"
//                 >
//                   Product Name
//                 </th>
//                 <td className="px-6 py-4 text-lg">
//                   {data.brand_data.product_name}
//                 </td>
//               </tr>
//               <tr className="bg-white border ">
//                 <th
//                   scope="row"
//                   className="px-6 py-4 text-xl font-bold text-center text-gray-900 whitespace-nowrap"
//                   colSpan="2"
//                 >
//                   Ranking
//                 </th>
//                 {data.ranking &&
//                   data.ranking.map((rank, index) => (
//                     <td className="px-6 py-4 text-lg" key={index}>
//                       {rank}
//                     </td>
//                   ))}
//               </tr>
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SingleScaleResponse;




import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

const CreateResponse = () => {
  const { id } = useParams(); // Get the 'id' parameter from the route
  // const history = useHistory();
  const location = useLocation();

  // Access route state and initialize userSelections
  const userSelections = location.state?.userSelections || [];
  

  // Function to handle form submission (you can adapt this based on your needs)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the userSelections and other form data to the backend
    try {
      // Make an API request to save the user's selections and other data
      // You can use Axios or any other library you prefer

      // After successful submission, you can navigate to a success page or perform any other actions
      // history.push(`/response-success/${id}`);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  return (
    <div>
      <h1>Create Scale Response</h1>
      <p>Scale ID: {id}</p>

      <form onSubmit={handleSubmit}>
        {/* Render your form elements here */}
        {/* Example: */}
        {userSelections.map((selectedOption, index) => (
          <div key={index}>
            <label>Pair {index + 1} Selection:</label>
            <p>{selectedOption}</p>
          </div>
        ))}

        <button type="submit">Submit Response</button>
      </form>
    </div>
  );
};

export default CreateResponse;

