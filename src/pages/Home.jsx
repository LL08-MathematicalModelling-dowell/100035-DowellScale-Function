import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
const Home = () => {
  // const cookies = new Cookies();
  // const sessionId = cookies.get('sessionid');
  // console.log('====================================');
  // console.log(sessionId);
  // console.log('====================================');
  // const navigate = useNavigate();
  // if (!sessionId) {
  //   navigate('/login');
  // }
  const scaleTypes = [
    {
      name: 'linkert scale',
      slug: 'linkert-scale',
    },
    {
      name: 'nps scale',
      slug: 'nps-scale',
    },
    {
      name: 'staple scale',
      slug: 'staple-scale',
    },
    {
      name: 'ranking scale',
      slug: 'ranking-scale',
    },
    {
      name: 'paired scale comparison',
      slug: 'pc-scale',
    },
    {
      name: 'perceptual mapping scale',
      slug: 'perceptual-mapping-scale',
    },
  ];

  const navigateTo = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen flex-cols">
      <div className="grid w-6/12 grid-cols-2 gap-4">
        {scaleTypes.map((scale) => (
          <button
            onClick={() => navigateTo(`/${scale.slug}`)}
            key={scale.slug}
            className="w-full px-2 py-1 py-2 my-1 text-white capitalize bg-primary hover:bg-gray-700/50"
          >
            {scale.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
