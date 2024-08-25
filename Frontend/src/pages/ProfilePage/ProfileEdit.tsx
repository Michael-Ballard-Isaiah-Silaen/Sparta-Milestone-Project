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
    username: "",
    lastName: "",
    newPassword: "",
    email: "",
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
      const response = await axios.get("/auth/getCurrentPassword"); // Adjust the endpoint as necessary
      const { storedPassword } = response.data;
      return storedPassword;
    } catch (error) {
      console.error("Error fetching current password", error);
    }
  };

  const handleChangePassword = async () => {
    if (step === 1) {
      const storedPassword = await fetchCurrentPassword();

      try {
        const response = await axios.post("/auth/verifyPassword", {
          inputtedPassword: currentPasswordInput,
          storedPassword,
        });

        if (response.data.success) {
          setStep(2);
        } else {
          alert("Current password is incorrect.");
        }
      } catch (error) {
        console.error("Error verifying password", error);
        alert("An error occurred while verifying the password.");
      }
    } else {
      try {
        await CustomAxios(
          "put",
          `/profile/changePassword/${userProfile?._id}`,
          {
            newPassword: formData.newPassword,
          },
        );
        setShowChangePasswordModal(false);
        setStep(1);
      } catch (error) {
        console.error("Error changing password", error);
      }
    }
  };

  useEffect(() => {
    if (userProfile) {
      const {
        username,
        lastName,
        newPassword,
        email,
        displayName,
        yearOfEntry,
        major,
      } = userProfile;
      setFormData({
        username,
        lastName,
        newPassword,
        email,
        displayName,
        yearOfEntry,
        major,
      });
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
          className="mx-auto flex h-fit w-full flex-col gap-4 p-10 lg:px-40"
        >
          <div className="flex w-full flex-col items-start space-y-2 py-4">
            <p className="text-2xl font-bold tracking-wider">
              Personal Details
            </p>

            <div className="flex w-full flex-row items-center">
              <label htmlFor="firstName" className="w-2/5 text-xl font-normal">
                First Name
              </label>
              <InputText
                className="w-3/4"
                value={formData.displayName as string}
                onChange={onChange}
                name="displayName"
                placeholder="Insert your new public username"
              />
            </div>

            <div className="flex w-full flex-row items-center">
              <label htmlFor="lastName" className="w-2/5 text-xl font-normal">
                Last Name
              </label>
              <InputText
                className="w-3/4"
                value={(formData.lastName as string) || ""}
                onChange={onChange}
                name="lastName"
                placeholder="Insert your last name"
              />
            </div>

            <div className="flex w-full flex-row items-center">
              <label htmlFor="Jurusan" className="w-2/5 text-xl font-normal">
                Jurusan
              </label>
              <InputText
                className="w-3/4"
                value={(formData.major as string) || ""}
                onChange={onChange}
                name="major"
                placeholder="Insert your major"
              />
            </div>

            <div className="flex w-full flex-row items-center">
              <label
                htmlFor="yearOfEntry"
                className="w-2/5 text-xl font-normal"
              >
                Angkatan
              </label>
              <InputText
                type="number"
                className="w-3/4"
                value={(formData.yearOfEntry as number) || undefined}
                onChange={onChange}
                name="yearOfEntry"
                placeholder="Insert your year of entry"
              />
            </div>

            <div className="flex w-full flex-row items-center">
              <label htmlFor="email" className="w-2/5 text-xl font-normal">
                Email
              </label>
              <InputText
                className="w-3/4"
                value={(formData.email as string) || ""}
                onChange={onChange}
                name="email"
                placeholder="Insert your email"
              />
            </div>

            <div className="flex w-full flex-row items-center pt-2">
              <label htmlFor="profilePic" className="w-2/5 text-xl font-normal">
                Linkie Character
              </label>
              <div className="flex w-3/4 flex-col items-start">
                {/* Display Profile Picture */}
                <NavLink to="/another-page">
                  {" "}
                  {/* Replace "/another-page" with the path you want to redirect to */}
                  <div className="relative w-24">
                    <img
                      src={"/public/silhouette-male-icon.svg"}
                      alt="Profile"
                      className="h-24 w-24 scale-100 transform cursor-pointer rounded-full bg-white object-cover shadow-md"
                    />
                  </div>
                </NavLink>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start space-y-2">
            <p className="text-2xl font-bold tracking-wider">Security</p>
            <div className="flex w-full flex-row items-center">
              <label
                htmlFor="displayName"
                className="w-2/5 text-xl font-normal"
              >
                Password
              </label>
              <div className="flex w-3/4 flex-row">
                <button
                  className="flex h-11 w-full min-w-max items-center justify-center text-wrap rounded-lg bg-[#4679A8] px-4 py-2 text-sm text-white"
                  type="button"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-row justify-items-end gap-2">
            <Button className="w-1/2">Save Edit</Button>
            <NavLink
              to={`/`}
              className="w-1/2 justify-center whitespace-nowrap text-wrap rounded-md border-2 border-[#0C173D] bg-white py-2 text-center text-[#0C173D] hover:bg-blue-100"
            >
              <p>Cancel</p>
            </NavLink>
          </div>

          <div className="flex flex-row">
            <button
              type="button"
              className="h-10 w-full items-end justify-items-end rounded-lg bg-[#0C173D] text-white hover:text-red-400"
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
        <div className="my-auto flex flex-col items-center justify-center">
          <h2 className="text-center text-lg font-semibold">Change Password</h2>
          {step === 1 ? (
            <>
              <p className="text-center">
                Please confirm your current password
              </p>
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
              className="rounded-md bg-gray-500 px-4 py-2 text-white"
              onClick={() => {
                setShowChangePasswordModal(false);
                setStep(1);
              }}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
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
        className="rounded-2xl bg-white px-20 py-12 shadow-lg"
      >
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold">Logout?</h2>
          <p className="text-slate-700">Your data will be saved</p>
          <div className="mx-auto mt-6 flex gap-6">
            <button
              className="w-full rounded-xl bg-[#0C173D] px-4 py-1 text-lg text-white"
              onClick={handleLogout}
            >
              Yes
            </button>
            <button
              className="w-full rounded-xl border-2 border-[#0C173D] bg-white px-4 py-1 text-lg hover:bg-slate-200"
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
