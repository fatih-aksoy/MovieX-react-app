import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import {
  toastErrorNotify,
  toastSuccessNotify,
  toastWarnNotify,
} from "../helpers/ToastNotify";

export const AuthContext = createContext();

//! with custom hook. eger custom hook olarak kullanmak istersem.
// export const useAuthContext = () => {
//   return useContext(AuthContext);
// };

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    userObserver();
  }, []);

  const createUser = async (email, password, displayName) => {
    //! yeni bir kullanici metodu olusturmak icin firebase metodu.
    try {
      let userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      //! kullanici profilini guncellemek icin kullanilan firebase metodu.
      await updateProfile(auth.currentUser, {
        // displayName: "Jane Q. User", name will be updated. to type "displayName" is enought or "displayName: displayName" can be typed.
        // photoURL: "https://example.com/jane-q-user/profile.jpg",  this is not needed now.
        //! key ve value degerleri ayni ise sadece key degerlerini yazabiliriz.
        displayName,
      });
      navigate("/");
      toastSuccessNotify("Registered Successfully!");
      // console.log(userCredential);
    } catch (error) {
      // console.log(error.message);
      toastErrorNotify(error.message);
    }
  };

  //! https://console.firebase.google.com/
  //! Authentication => sign-in-method => enable Email/password  enable islemini zaten bastan yapmistik.

  const signIn = async (email, password) => {
    try {
      //! mevcut kullanicinin giris yapmasi icin kullanilan firebase metodu.
      //! consolde gormek icin awatin onune let userCredential yazilir.
      let userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/");
      toastSuccessNotify("Logged in successfully!");
      console.log(userCredential);
    } catch (error) {
      // console.log(error.message);
      toastErrorNotify(error.message);
    }
  };

  const logOut = () => {
    signOut(auth);
    toastSuccessNotify("Logged out successfully!");
  };

  const userObserver = () => {
    onAuthStateChanged(auth, (user) => {
      //! kullanicinin signin olup olmadigini takip eden ve kullanici degistiginde yeni kullaniciyi response olarak dönen firebase metodu. eger user varsa setCurrentUser donucek.
      if (user) {
        const { email, displayName, photoURL } = user;
        setCurrentUser({ email, displayName, photoURL });
        // console.log(user);
      } else {
        // user is signed out
        setCurrentUser(false);
        console.log("logged out");
      }
    });
  };

  //! https://firebase.google.com/
  //! => Authentication => sign-in-method => enable Google
  //! Google ile girisi enable yap
  //! https://console.firebase.google.com/project/movie-app-a3ca0/authentication/settings
  //! => Authentication => settings => Authorized domains => add domain
  //! Projeyi deploy ettikten sonra goggle sign in calismasi icin domain listesine deploy linkine ekle

  const signUpProvider = () => {
    //! Google ile giris yailmasi icin kullanilan firebase metodu.
    const provider = new GoogleAuthProvider();
    //! Acilir pencere ile giris yapilmasi icin kullanilan firebase metodu.
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        //! sign-in olunca navigate ile home sayfasina yönlendir.
        navigate("/");
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
      });
  };

  const forgotPassword = (email) => {
    //? Email yoluyla şifre sıfırlama için kullanılan firebase metodu
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        toastWarnNotify("Please check your mail box!");
        // alert("Please check your mail box!");
      })
      .catch((err) => {
        toastErrorNotify(err.message);
        // alert(err.message);
        // ..
      });
  };

  const values = {
    createUser,
    signIn,
    logOut,
    currentUser,
    signUpProvider,
    forgotPassword,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;

// ! gelen butun children lari provider arasina ekliyoruz. AuthContext i disari export ederiz.

//! "then catch" ve "await" metodlari birbirinin muvadili gibidir.
