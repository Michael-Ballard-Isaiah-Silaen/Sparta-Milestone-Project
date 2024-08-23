import { NavLink, useParams } from "react-router-dom";
import useFetch from "../../lib/CustomHooks/useFetch";
import { IUser } from "../../lib/types/User";
import { FaShareAlt } from "react-icons/fa";
import Breadcrumb from "../../components/universal/BreadCrumb";
import Swal from "sweetalert2";
import { useContext } from "react";
import { CurrentUserContext } from "../../lib/contexts/CurrentUserContext";
import { ITask } from "../../lib/types/Task";
import { twMerge } from "tailwind-merge";

const ProfilePage = () => {
  const currentUserContext = useContext(CurrentUserContext);
  const { username } = useParams();
  const { response: userProfile } = useFetch<IUser>({
    url: `/profile/${username}`,
  });
  const { response: userReports } = useFetch<ITask[]>({
    url: `/tasks/mine`,
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
    <main className="relative w-full grow pb-20 pt-24 bg-gradient-to-b from-[#F5F5F5] to-[#7FA1C3]">
      <div className="flex h-fit min-h-full w-full flex-col items-center justify-center gap-8">
        <Breadcrumb className="max-w-[1000px] px-4" />
        <div className="aspect-square h-auto w-64 overflow-hidden rounded-full border-2 bg-gray-50">
          <img
            src={userProfile?.profilePicUrl}
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
        <section className="flex w-full max-w-[1000px] flex-col items-start px-4">
          <div className="flex w-full justify-between">
            <h2>Tasks</h2>
            <NavLink to="/reports" className="hover:text-blue-600">
              See More &gt;
            </NavLink>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
            {userReports?.map((el) => (
              <div id={el._id}>
                <div className="group flex h-[20rem] w-full flex-col bg-white object-cover p-4 shadow-slate-800 duration-150 ease-in hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center gap-2 py-1">
                    <div
                      className={twMerge(
                        `aspect-square h-auto w-4 rounded-full ${(el.category === "To-Do" || !el.category) && "bg-red-700"}`,
                        `${el.category === "In Progress" && "bg-[#FFBF00]"}`,
                        `${el.category === "Completed" && "bg-green-700"}`,
                      )}
                    />
                    <h3>{el.title}</h3>
                  </div>
                  <div className="flex h-0 grow items-end">
                    <p className="line-clamp-2 group-hover:underline">
                      {el.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
