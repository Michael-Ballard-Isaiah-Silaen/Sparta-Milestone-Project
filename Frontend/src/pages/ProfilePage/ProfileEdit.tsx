import { NavLink, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../lib/CustomHooks/useFetch";
import { IUser, IUserForm } from "../../lib/types/User";
import { useEffect, useState } from "react";
import InputText from "../../components/universal/InputText";
import Button from "../../components/universal/Button";
import CustomAxios from "../../lib/actions/CustomAxios";
import { handleFetchError } from "../../lib/actions/HandleError";
import InputImage from "../../components/universal/InputImage";


const ProfilePageEdit = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { response: userProfile } = useFetch<IUser>({
    url: `/profile/${username}`,
  });
  const [formData, setFormData] = useState<IUserForm>({
    profilePicUrl: "",
    displayName: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (userProfile) {
      const { profilePicUrl, displayName } = userProfile;
      setFormData({ profilePicUrl, displayName });
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profilePicUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center">
      <div className="flex h-fit min-h-full w-full flex-col items-center justify-center gap-8">
        <form
          action="post"
          onSubmit={onSubmit}
          className="mx-auto flex h-fit w-full flex-col gap-4 rounded-lg border-[1px] p-10 shadow px-8 lg:px-40 bg-gradient-to-b from-[#F5F5F5] to-[#7FA1C3]"
        >
          <h1 className="text-center text-2xl font-bold">
            Hello {userProfile?.displayName}
          </h1>
          <h2 className="text-center">Update your account here</h2>
          <div className="flex w-full flex-col items-start">
            <p className="text-xl font-bold tracking-wider">
              Public Picture
            </p>
            <InputImage
              file={file}
              initialImageUrl={userProfile?.profilePicUrl}
              onChange={handleFileChange}
              className="aspect-square h-64 w-auto rounded-full p-0"
            />
          </div>

          <div className="flex w-full flex-col items-start py-4 space-y-2">
            <p className="text-xl font-bold tracking-wider">
              Personal Details
            </p>

            <div className="flex flex-row w-full items-center">
              <label htmlFor="displayName" className="text-lg font-normal w-2/5">
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
              <label htmlFor="displayName" className="text-lg font-normal w-2/5">
              Last Name
              </label>
              <InputText className="w-3/4"
                value={""}
                onChange={onChange}
                name="displayName"
                placeholder="Insert your last name"
              />
            </div>
            
            <div className="flex flex-row w-full items-center">
              <label htmlFor="displayName" className="text-lg font-normal w-2/5">
              Jurusan
              </label>
              <InputText className="w-3/4"
                value={""}
                onChange={onChange}
                name="displayName"
                placeholder="Insert your major"
              />
            </div>
            
            <div className="flex flex-row w-full items-center">
              <label htmlFor="displayName" className="text-lg font-normal w-2/5">
              Angkatan
              </label>
              <InputText className="w-3/4"
                value={""}
                onChange={onChange}
                name="displayName"
                placeholder="Insert your year of entry"
              />
            </div> 
          </div>

          <div className="flex w-full flex-col items-start space-y-2">
            <p className="text-lg font-bold tracking-wider">
              Change Passwords
            </p>

            <div className="flex flex-row w-full items-center">
              <label htmlFor="displayName" className="text-lg font-normal w-2/5">
              New Password
              </label>
              <InputText className="w-3/4"
                value={""}
                onChange={onChange}
                name="displayName"
                placeholder="Insert your new password"
              />
            </div>
            <div className="flex flex-row w-full items-center">
              <label htmlFor="displayName" className="text-lg font-normal w-2/5">
              Password Confirmation
              </label>
              <InputText className="w-3/4"
                value={""}
                onChange={onChange}
                name="displayName"
                placeholder="Insert your new password again"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-start space-y-2">
            <p className="text-lg font-bold tracking-wider">Theme</p>

            <div className="flex flex-row w-full items-center">
              <label htmlFor="themeSelect" className="text-lg font-normal w-2/5">
                Current Theme
              </label>
              
              <div className="flex w-3/4">
                <select
                  id="themeSelect"
                  className="w-full bg-white rounded-md border-2 border-[#0C173D] p-2"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                  <option value="system">System Default</option>
                </select>

                <button className="ml-2 h-11 bg-white rounded-md px-4 py-2" type="button"onClick={(e) => e.preventDefault()} >
                  <img src="/public/mdi_cart-outline.svg" alt="refresh" width={30} height={30}/>
                </button>
              </div>
            </div>
          </div>


          <Button className="bg-[#0C173D]">Save Edit</Button>
          <NavLink
            to={`/profile/${username}`}
            className="flex items-center justify-center rounded-md border-2 border-[#0C173D] bg-white py-2 text-[#0C173D] hover:bg-blue-100"
          >
            <p>Cancel</p>
          </NavLink>
        </form>
      </div>
    </main>
  );
};

export default ProfilePageEdit;
