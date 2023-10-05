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

