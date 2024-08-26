import { useContext, useState } from "react";
import InputText from "../components/universal/InputText";
import InputPassword from "../components/universal/InputPassword";
import Button from "../components/universal/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { handleFetchError } from "../lib/actions/HandleError";
import CustomAxios from "../lib/actions/CustomAxios";
import { IUserForm } from "../lib/types/User";
import { CurrentUserContext } from "../lib/contexts/CurrentUserContext";
import logo from "./images/logo.png";
import Image1 from '/Logindecor1.png'
import Image2 from '/Logindecor2.png'
import Image3 from '/Logindecor3.png'

const LoginPage = () => {
  const navigate = useNavigate();
  const currentUserContext = useContext(CurrentUserContext);
  const [formData, setFormData] = useState<IUserForm>({
    email: "",
    password: "",
    role: "student",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((oldFd) => ({
      ...oldFd,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await CustomAxios("post", "/auth/sign-in", formData);

      const { token, user } = data;
      localStorage.setItem("access_token", token);

      currentUserContext?.setCurrentUser(user);
      navigate("/");
    } catch (error) {
      handleFetchError(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-start px-4 py-12 mt-2 bg-gradient-to-t from-[#7fa1c2] to-[#f0f1f3]">
      <form
        action="post"
        onSubmit={onSubmit}
        className="bg-[#4679a8] mt-12 mb-4 mx-auto flex h-fit w-full max-w-[500px] flex-col items-center gap-3 rounded-lg py-8 shadow-lg md:px-8"
      >
        <img
          src={logo}
          alt="TaskLink Logo"
          className="mx-auto mb-1"
          style={{ marginTop: "-15px", width: "200px", height: "auto" }}
        />
        <InputText
          value={formData.email as string}
          onChange={onChange}
          name="email"
          placeholder="Email"
        />
        <InputPassword
          value={formData.password as string}
          onChange={onChange}
          name="password"
          placeholder="Password"
          className="py-2"
        />
        <Button className="bg-white text-black px-6 mt-2 py-1 rounded-xl">Log In</Button>
      </form>
      <div className="flex flex-col items-center">
        <p className="text-black text-center">Don't have an account yet?</p>
        <p className="text-black text-center">Make yours here for free.</p>
        <NavLink to="/auth/sign-up">
        <button className="bg-[#0c173d]  my-2 mx-auto px-6 py-1 rounded-xl text-white">Sign Up</button>
        </NavLink>
      </div>
      <div>
        <div className="absolute left-0 bottom-0">
          <img src={Image2} alt="Image2"></img>
          <img src={Image1} alt="Image1"></img>
        </div>
        <div className="absolute right-0 bottom-0">
        <img src={Image3} alt="Image3"></img>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
