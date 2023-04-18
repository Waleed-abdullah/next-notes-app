import { useRef, useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import signInwithToken from '@/lib/firebase/signIntoFirebase';
import { useSession } from 'next-auth/react';
import { getDatabase, ref, set } from 'firebase/database';
import app from '@/lib/firebase/initFirebase';

const LandingPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  let [validInput, setValidInput] = useState<boolean>(true);
  let [incorrectInfo, setIncorrectInfo] = useState<boolean>(false);
  let [emailInUse, setEmailInUse] = useState<boolean>(false);

  const logIn = async () => {
    const email: any = emailRef.current!.value;
    const password: any = passRef.current!.value;
    if (email === null || email === '' || password == null || password == '') {
      setValidInput(false);
    } else {
      try {
        const res: any = await signIn('credentials', {
          redirect: false,
          email: email,
          password: password,
        });
        console.log(res);
        if (res.error === 'CredentialsSignin') {
          console.log('Didnt work');
          setIncorrectInfo(true);
        } else {
          console.log('Worked');
          router.push('/homepage');
          setIncorrectInfo(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const signUp = async () => {
    const email: any = emailRef.current!.value;
    const password: any = passRef.current!.value;
    if (email === null || email === '' || password == null || password == '') {
      setValidInput(false);
    } else {
      const res = await axios
        .post(
          '/api/register',
          { email, password },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        )
        .then(async () => {
          await logIn();
        })
        .catch((error) => {
          console.log(error);
          setEmailInUse(true);
        });
      console.log(res);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-xl text-stone-500">Todo</span>List
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold mb-2">Sign in to Account</h2>
              <div className="border-2 w-10 border-black inline-block mb-2"></div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="bg-gray-100 outline-none text-sm flex-1 m-2"
                  ></input>{' '}
                </div>
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-4">
                  <input
                    ref={passRef}
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="bg-gray-100 outline-none text-sm flex-1 m-2"
                  ></input>{' '}
                </div>
                {!validInput ? (
                  <div className=" text-red-600">Enter valid data</div>
                ) : null}
                {incorrectInfo ? (
                  <div className=" text-red-600">Your info is incorrect</div>
                ) : null}
                {emailInUse ? (
                  <div className=" text-red-600">Email already in use</div>
                ) : null}
                <button
                  className="border-2 border-black rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-white"
                  onClick={logIn}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
          <div className="w-2/5 bg-black text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2 truncate">Welcome!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">
              Fill up the info in the fields and click the button to signup.
            </p>
            <button
              className="border-2 border-white rounded-full px-12 py-2 inline font-semibold hover:bg-white hover:text-black overflow-auto"
              onClick={signUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
