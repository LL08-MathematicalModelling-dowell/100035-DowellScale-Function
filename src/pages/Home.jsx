import { useNavigate } from 'react-router';
const Home = () => {
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
      slug: 'paired-scale-comparison',
    },
    {
      name: 'perceptual mapping scale',
      slug: 'perceptual-mapping-scale',
    },
  ];

  const navigateTo = useNavigate();

  return (
    <div className="h-screen flex flex-cols justify-center items-center">
      <div className="w-6/12 grid grid-cols-2 gap-4">
        {scaleTypes.map((scale) => (
          <button
            onClick={() => navigateTo(`/${scale.slug}`)}
            key={scale.slug}
            className="w-full bg-primary text-white hover:bg-gray-700/50 py-1 px-2 py-2 my-1 capitalize"
          >
            {scale.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
