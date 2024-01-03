// import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
// import ShowIcon from '../assets/eye-12120.svg';
// import './styles/login.css';
// import axios from 'axios';
// import { getUserInfoFromLogin } from '../utils/UserInfo';
// import { getMetaData } from '../utils/getmetadata';
// import Cookies from 'universal-cookie';
// const Login = () => {
//   const cookies = new Cookies();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(true);
//   const [err, setErr] = useState(false);
//   const [errMsg, setErrMSG] = useState('');
//   const [loading, setIsloading] = useState(false);

//   // const handleExternalNavigation = (session_id) => {
//   //   const homeRoute = `https://100093.pythonanywhere.com/home?session_id=${session_id}`;
//   //   window.location.href = homeRoute;
//   // };

//   const setCookies = async (session_id) => {
//     cookies.set('session_id', session_id);
//     const userinfo = await getUserInfoFromLogin(session_id);
//   };

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };
//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     setIsloading(true);
//     e.preventDefault();
//     const metadata = await getMetaData();
//     const data = {
//       api_service_id: 'DOWELL10004',
//       api_key: 'ac1d7a9e-a731-4268-a665-e660fdaed9d5',
//       username: email,
//       password: password,
//       ...metadata,
//     };

//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'https://100014.pythonanywhere.com/api/loginapi/',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       data: data,
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         if (response.data.msg) {
//           setErrMSG('Server Error');
//           console.log(response.data);
//           setErr(true);
//           setIsloading(false);
//         } else if (response.data.session_id) {
//           setCookies(response.data.session_id);
//           console.log(response.data.session_id);
//           setErr(false);
//           const timeout = setTimeout(() => navigate(`/`), 3000);
//           return () => clearTimeout(timeout);
//         } else {
//           setErrMSG(response.data.data);
//           setErr(true);
//           console.log(response.data);
//           setIsloading(false);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         setErrMSG('Server Error');
//         setErr(true);
//         setIsloading(false);
//       });
//   };

//   return (
//     <div className="flex items-center justify-center my-24 container__">
//       <form className="login">
//         <div className="login-logo">
//           <img
//             src="https://www.login.dowellstore.org/wp-content/uploads/2022/10/artistic-logo-150x150.png"
//             alt="DoWell Research"
//           />
//         </div>
//         <div className="login-actions">
//           <div className="login-actions_welcome">
//             <h3>Welcome </h3>
//             <p className={err ? 'err-txt' : ''}>
//               {err ? errMsg : 'Please enter your credentials'}
//             </p>
//           </div>
//           <div onSubmit={handleSubmit} className="login-actions_input">
//             <div className="email">
//               <p>Username</p>
//               <input
//                 type="text"
//                 required
//                 onChange={handleEmailChange}
//                 value={email}
//               />
//             </div>
//             <div className="password">
//               <p>Password</p>
//               <div className="pass-input">
//                 <input
//                   type={showPassword ? 'password' : 'text'}
//                   required
//                   onChange={handlePasswordChange}
//                   value={password}
//                 />
//                 <img
//                   src={ShowIcon}
//                   alt="show password"
//                   onClick={() => {
//                     setShowPassword(!showPassword);
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="login-submit">
//           {loading ? (
//             <div role="status">
//               <svg
//                 aria-hidden="true"
//                 className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#1A8753]"
//                 viewBox="0 0 100 101"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//                   fill="currentColor"
//                 />
//                 <path
//                   d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//                   fill="currentFill"
//                 />
//               </svg>
//               <span className="sr-only">Loading...</span>
//             </div>
//           ) : (
//             <button
//               type="submit"
//               onClick={(e) => {
//                 handleSubmit(e);
//               }}
//             >
//               Login
//             </button>
//           )}
//         </div>
//       </form>
//       {/* <h1>Yoooooo</h1> */}
//     </div>
//   );
// };

// export default Login;
