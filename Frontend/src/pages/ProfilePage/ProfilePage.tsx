import { NavLink, useParams } from "react-router-dom";
import useFetch from "../../lib/CustomHooks/useFetch";
import { IUser } from "../../lib/types/User";
import { FaShareAlt } from "react-icons/fa";
import Breadcrumb from "../../components/universal/BreadCrumb";
import Swal from "sweetalert2";
import { useContext } from "react";
import { CurrentUserContext } from "../../lib/contexts/CurrentUserContext";

const ProfilePage = () => {
  const currentUserContext = useContext(CurrentUserContext);
  const { username } = useParams();
  const { response: userProfile } = useFetch<IUser>({
    url: `/profile/${username}`,
  });

  const isUserOwner = username === currentUserContext?.currentUser?.username;

  const handleShareClick = () => {
    const profileUrl = window.location.href;
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => {
        Swal.fire({
          title: "Successfully Copied To Clipboard",
          icon: "success",
        });
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  return (
    <main className="relative w-full grow bg-gradient-to-b from-[#F5F5F5] to-[#7FA1C3] pb-20 pt-12">
      <div className="flex h-fit min-h-full w-full flex-col items-center justify-center gap-8">
        <Breadcrumb className="max-w-[1000px] px-4" />
        <div className="aspect-square h-auto w-64 overflow-hidden rounded-full border-2 bg-gray-50">
          <img
            src={"/public/silhouette-male-icon.svg"}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center px-2">
          <h1 className="text-2xl">{userProfile?.displayName}</h1>
          <div className="pt- flex items-center gap-3 py-2">
            {isUserOwner && (
              <NavLink
                to={`/profile/${username}/edit`}
                className="rounded-md bg-purple-300 p-2 text-purple-950 hover:bg-purple-400"
              >
                Edit
              </NavLink>
            )}
            <button
              className="+hover:bg-blue-300 flex items-center gap-2 rounded-md bg-blue-200 p-2 text-blue-700"
              onClick={handleShareClick}
            >
              <FaShareAlt size={25} />
              Share
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
