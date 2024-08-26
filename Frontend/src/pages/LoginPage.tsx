import { useContext, useState } from "react";
import InputText from "../components/universal/InputText";
import InputPassword from "../components/universal/InputPassword";
import Button from "../components/universal/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { handleFetchError } from "../lib/actions/HandleError";
import CustomAxios from "../lib/actions/CustomAxios";
import { IUserForm } from "../lib/types/User";
import { CurrentUserContext } from "../lib/contexts/CurrentUserContext";
import Image1 from "/Logindecor1.png";
import Image2 from "/Logindecor2.png";
import Image3 from "/Logindecor3.png";

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
    <div className="mt-2 flex min-h-screen w-screen flex-col items-center justify-start bg-gradient-to-t from-[#7fa1c2] to-[#f0f1f3] px-4 py-12">
      <form
        action="post"
        onSubmit={onSubmit}
        className="mx-auto mb-4 mt-12 flex h-fit w-full max-w-[500px] flex-col items-center gap-3 rounded-lg bg-[#4679a8] py-8 shadow-lg md:px-8"
      >
        <h1 className="mb-2 text-center text-3xl text-white">TaskLink</h1>
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
        <Button className="mt-2 rounded-xl bg-white px-6 py-1 text-black">
          Log In
        </Button>
      </form>
      <div className="flex flex-col items-center">
        <p className="text-center text-black">Don't have an account yet?</p>
        <p className="text-center text-black">Make yours here for free.</p>
        <NavLink to="/auth/sign-up">
          <button className="mx-auto my-2 rounded-xl bg-[#0c173d] px-6 py-1 text-white">
            Sign Up
          </button>
        </NavLink>
      </div>
      <div>
        <div className="absolute bottom-0 left-0">
          <img src={Image2} alt="Image2"></img>
          <img src={Image1} alt="Image1"></img>
        </div>
        <div className="absolute bottom-0 right-0">
          <img src={Image3} alt="Image3"></img>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
