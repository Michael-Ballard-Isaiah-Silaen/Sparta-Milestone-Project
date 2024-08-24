import { NavLink, useNavigate, useParams } from "react-router-dom";
import { CurrentUserContext } from "../../lib/contexts/CurrentUserContext";
import useFetch from "../../lib/CustomHooks/useFetch";
import { IUser, IUserForm } from "../../lib/types/User";
import { useContext, useEffect, useState } from "react";
import InputText from "../../components/universal/InputText";
import Button from "../../components/universal/Button";
import CustomAxios from "../../lib/actions/CustomAxios";
import Modal from "../../components/universal/Modal";
import { handleFetchError } from "../../lib/actions/HandleError";
import InputPassword from "../../components/universal/InputPassword";
import axios from "axios";


const ProfilePageEdit = () => {
  const { username } = useParams();
  const currentUserContext = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const { response: userProfile } = useFetch<IUser>({
    url: `/profile/${username}`,
  });
  const [formData, setFormData] = useState<IUserForm>({
    username:"",
    lastName:"",
    newPassword:"",
    email:"",
    displayName: "",
    yearOfEntry: undefined,
    major: "",
  });
  const [file] = useState<File | null>(null);
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    localStorage.setItem("access_token", "");
    currentUserContext?.setCurrentUser(null);
    navigate("/auth/sign-in");
  };

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [step, setStep] = useState(1);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  
  const fetchCurrentPassword = async () => {
    try {
      const response = await axios.get('/auth/getCurrentPassword'); // Adjust the endpoint as necessary
      const { storedPassword } = response.data;
      return storedPassword;
    } catch (error) {
      console.error("Error fetching current password", error);
    }
  };  

  const handleChangePassword = async () => {
    if (step === 1) {
      const storedPassword = await fetchCurrentPassword();
      const isPasswordValid = await axios.post('/auth/verifyPassword', {
        inputtedPassword: currentPasswordInput,
        storedPassword,
      });

      if (isPasswordValid.data.success) {
        setStep(2);
      } else {
        alert("Current password is incorrect.");
      }
    } else {
      try {
        await CustomAxios("put", `/profile/changePassword/${userProfile?._id}`, {
          newPassword: formData.newPassword,
        });
        setShowChangePasswordModal(false);
        setStep(1);
      } catch (error) {
        console.error("Error changing password", error);
      }
    }
  };


  useEffect(() => {
    if (userProfile) {
      const {username, lastName,newPassword, email, displayName, yearOfEntry, major } = userProfile;
      setFormData({ username, lastName, newPassword, email, displayName, yearOfEntry, major });
    }
  }, [userProfile]);

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
      const updateData = { ...formData };

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await CustomAxios(
          "post",
          `/uploads/profilePic/${username}`,
          fd,
        );
        updateData.profilePicUrl = data.url;
      }

      await CustomAxios("put", `/profile/${userProfile?._id}`, updateData);

      navigate(`/profile/${username}`);
    } catch (error) {
      handleFetchError(error);
    }
  };

  return (
    <main className="relative flex h-full min-h-screen w-full items-center justify-center">
      <div className="flex h-screen min-h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#F5F5F5] to-[#7FA1C3]">
        <form
          action="post"
          onSubmit={onSubmit}
          className="mx-auto flex h-fit w-full flex-col gap-4 p-10 lg:px-40 "
        >
          <div className="flex w-full flex-col items-start py-4 space-y-2">
            <p className="text-2xl font-bold tracking-wider">
              Personal Details
            </p>

            <div className="flex flex-row w-full items-center">
              <label htmlFor="firstName" className="text-xl font-normal w-2/5">
              First Name
              </label>
              <InputText className="w-3/4"
                value={formData.displayName as string}
                onChange={onChange}
                name="displayName"
                placeholder="Insert your new public username"
              />
            </div>

            <div className="flex flex-row w-full items-center">
              <label htmlFor="lastName" className="text-xl font-normal w-2/5">
              Last Name
              </label>
              <InputText className="w-3/4"
                value={formData.lastName as string || ""}
                onChange={onChange}
                name="lastName"
                placeholder="Insert your last name"
              />
            </div>
            
            <div className="flex flex-row w-full items-center">
              <label htmlFor="Jurusan" className="text-xl font-normal w-2/5">
              Jurusan
              </label>
              <InputText className="w-3/4"
                value={formData.major as string || ""}
                onChange={onChange}
                name="major"
                placeholder="Insert your major"
              />
            </div>
            
            <div className="flex flex-row w-full items-center">
              <label htmlFor="yearOfEntry" className="text-xl font-normal w-2/5">
              Angkatan
              </label>
              <InputText
                type="number" 
                className="w-3/4"
                value={formData.yearOfEntry as number || undefined}
                onChange={onChange}
                name="yearOfEntry"
                placeholder="Insert your year of entry"
              />
            </div> 
            
            <div className="flex flex-row w-full items-center">
              <label htmlFor="email" className="text-xl font-normal w-2/5">
              Email
              </label>
              <InputText 
                className="w-3/4"
                value={formData.email as string || ""}
                onChange={onChange}
                name="email"
                placeholder="Insert your email"
              />
            </div> 

            <div className="flex flex-row w-full items-center pt-2">
              <label htmlFor="profilePic" className="text-xl font-normal w-2/5">Linkie Character</label>
              <div className="w-3/4 flex flex-col items-start">
                {/* Display Profile Picture */}
                <NavLink to="/another-page"> {/* Replace "/another-page" with the path you want to redirect to */}
                  <div className="relative w-24">
                    <img 
                      src={'/public/silhouette-male-icon.svg'} 
                      alt="Profile"
                      className="transform scale-100 w-24 h-24 rounded-full object-cover bg-white shadow-md cursor-pointer"
                    />
                  </div>
                </NavLink>
              </div>
            </div>
          </div>

          
          <div className="flex w-full flex-col items-start space-y-2">
            <p className="text-2xl font-bold tracking-wider">Security</p>
              <div className="flex flex-row w-full items-center">
                <label htmlFor="displayName" className="text-xl font-normal w-2/5">
                Password</label>
                <div className="flex flex-row w-3/4">
                  <button
                    className="flex w-full bg-[#4679A8] h-11 text-white text-wrap min-w-max text-sm rounded-lg items-center justify-center px-4 py-2"
                    type="button"
                    onClick={() =>setShowChangePasswordModal(true)}>
                    Change Password
                  </button>
                </div>
              </div> 
          </div>

          <div className="flex flex-row justify-items-end w-full gap-2">            
              
              <Button className="w-1/2">Save Edit</Button>
              <NavLink
                to={`/profile/${username}`}
                className="w-1/2 justify-center text-wrap text-center whitespace-nowrap rounded-md border-2 border-[#0C173D] bg-white py-2 text-[#0C173D] hover:bg-blue-100"
              >
                <p>Cancel</p>
              </NavLink>
          </div>

          <div className="flex flex-row">
            <button
              type="button"
              className="w-full justify-items-end items-end h-10 bg-[#0C173D] rounded-lg text-white hover:text-red-400"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          setStep(1);
        }}
        className="bg-white"
      >
        <div className="flex flex-col items-center justify-center my-auto">
          <h2 className="text-lg text-center font-semibold">Change Password</h2>
          {step === 1 ? (
            <>
              <p className="text-center">Please confirm your current password</p>
              <InputPassword
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                name="currentPassword"
                placeholder="Input your password here"
              />
            </>
          ) : (
            <>
              <p className="text-center">Please enter your new password</p>
              <InputText
                name="newPassword"
                type="password"
                className="mt-4 w-full"
                value={formData.newPassword || ""}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="New Password"
              />
            </>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="bg-gray-500 px-4 py-2 text-white rounded-md"
              onClick={() => {
                setShowChangePasswordModal(false);
                setStep(1);
              }}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 px-4 py-2 text-white rounded-md"
              onClick={handleChangePassword}
            >
              {step === 1 ? "Confirm Password" : "Change Password"}
            </button>
          </div>
        </div>
      </Modal>
      
      {/*Logout Modal*/}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        className="bg-white py-12 px-20 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold">Logout?</h2>
          <p className="text-slate-700">Your data will be saved</p>
          <div className="mt-6 flex mx-auto gap-6">
            <button
              className="bg-[#0C173D] text-lg w-full px-4 py-1 text-white rounded-xl"
              onClick={handleLogout}
            >
              Yes
            </button>
            <button
              className="bg-white border-2 text-lg border-[#0C173D] hover:bg-slate-200 w-full px-4 py-1 rounded-xl"
              onClick={() => setShowLogoutModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>

    </main>
  );
};

export default ProfilePageEdit;
