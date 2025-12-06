import { useRef, useState, useEffect } from "react";
import "./App.css";
import { accessThunk } from "./features/api.thunk";
import { useDispatch, useSelector } from "react-redux";
import { Comment } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

function App() {
  const messageRef = useRef("");
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const loading = useSelector((state) => state.user.status.loading);
  const auth = useSelector((state) => state.user.status.auth);
  const profile = useSelector((state) => state.user.data);

  console.log("Profile : ", profile);
  useEffect(() => {
    dispatch(accessThunk());
  }, []);

  useEffect(() => {
    if (!loading && auth === false) {
      navigate("/login");
    }
  }, [loading, auth]);

  const handleSidebar = () => {
    setIsSidebarHidden((prev) => !prev);
  };

  const [message, setMessages] = useState([
    {
      message: "Hey, how's your day going?",
      alignment: "justify-end",
    },
    {
      message: "Not too bad, just a bit busy. How about you?",
      alignment: "start",
    },
    {
      message: "I'm good, thanks. Anything exciting happening?",
      alignment: "justify-end",
    },
    {
      message: "Not really, just the usual. Work and errands.",
      alignment: "start",
    },
    {
      message: "Sounds like a typical day. Got any plans for the weekend?",
      alignment: "justify-end",
    },
    {
      message:
        "Not yet, I'm hoping to relax and maybe catch up on some reading. How about you?",
      alignment: "start",
    },
    {
      message:
        "I might go hiking if the weather's nice. Otherwise, just taking it easy",
      alignment: "justify-end",
    },
    {
      message: "Hiking sounds fun. Hope the weather cooperates for you!",
      alignment: "start",
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleSend = () => {
    const text = messageRef.current.value;

    setMessages([...message, { message: text, alignment: "justify-end" }]);

    messageRef.current.value = "";
  };

  return (
    <>
      <center className="bg-slate-700">
        {loading ? (
          <div className="w-screen h-screen flex justify-center items-center">
            <Comment
              visible={true}
              height="160"
              width="160"
              ariaLabel="comment-loading"
              wrapperStyle={{}}
              wrapperClass="comment-wrapper"
              color="#fff"
              backgroundColor="#020617"
            />
          </div>
        ) : (
          <div className="bg-slate-900 h-screen flex flex-col max-w-lg mx-auto">
            <div className="bg-slate-900 p-4 max-h-[10vh] text-white flex justify-between items-center">
              <button
                onClick={handleSidebar}
                data-drawer-target="sidebar-multi-level-sidebar"
                data-drawer-toggle="sidebar-multi-level-sidebar"
                aria-controls="sidebar-multi-level-sidebar"
                type="button"
                className="text-heading text-white hover:cursor-pointer bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex "
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M5 7h14M5 12h14M5 17h10"
                  />
                </svg>
              </button>

              <span>Chat App</span>
              <div className="relative inline-block text-left">
                <button
                  id="setting"
                  className="hover:bg-blue-400 rounded-md p-1"
                >
                  <svg
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.1395 12.0002C14.1395 13.1048 13.2664 14.0002 12.1895 14.0002C11.1125 14.0002 10.2395 13.1048 10.2395 12.0002C10.2395 10.8957 11.1125 10.0002 12.1895 10.0002C13.2664 10.0002 14.1395 10.8957 14.1395 12.0002Z"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.57381 18.1003L5.12169 12.8133C4.79277 12.2907 4.79277 11.6189 5.12169 11.0963L7.55821 5.89229C7.93118 5.32445 8.55898 4.98876 9.22644 5.00029H12.1895H15.1525C15.8199 4.98876 16.4477 5.32445 16.8207 5.89229L19.2524 11.0923C19.5813 11.6149 19.5813 12.2867 19.2524 12.8093L16.8051 18.1003C16.4324 18.674 15.8002 19.0133 15.1281 19.0003H9.24984C8.5781 19.013 7.94636 18.6737 7.57381 18.1003Z"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </button>
                <div
                  id="dropdown-content"
                  className="hidden absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-2"
                >
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
                  >
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M9 21H12M15 21H12M12 21V18M12 18H19C20.1046 18 21 17.1046 21 16V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V16C3 17.1046 3.89543 18 5 18H12Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                    Appearance
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
                  >
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      className="mr-2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                    Favorite
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
                  >
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      className="mr-2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g id="Warning / Info">
                          {" "}
                          <path
                            id="Vector"
                            d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                    More
                  </a>
                </div>
              </div>
            </div>

            <div className="flex-1 relative ">
              <aside
                hidden={isSidebarHidden}
                id="sidebar-multi-level-sidebar"
                className="absolute duration-300 text-white ease-in-out top-0 left-0 max-h-[79vh] bg-slate-900 z-40 w-64 h-full"
                aria-label="Sidebar"
              >
                <div className="h-full px-3 py-4 custom-scrollbar bg-neutral-primary-soft flex flex-col">
                  {/* User Profile Section */}
                  <div className="mb-6 px-2 py-3 border-b border-orange-600">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="min-w-16 min-h-16 rounded-full border-2 border-orange-600 bg-slate-800"></div>
                      <div className="flex justify-center flex-col items-start">
                        <div className="text-orange-500 overflow-clip max-w-[150px] font-semibold">
                          {profile.userName}
                        </div>
                        <div className="text-orange-500 overflow-clip max-w-[150px] text-sm opacity-75">
                          {profile.email}
                        </div>
                      </div>
                    </div>
                    <h2 className="text-orange-500 text-2xl font-semibold mb-3 px-2">
                      chats
                    </h2>
                  </div>

                  {/* Chats Section */}
                  <div className="flex-1 custom-scrollbar overflow-y-auto">
                    <ul className="space-y-2">
                      {[...Array(7)].map((_, i) => (
                        <li key={i}>
                          <a
                            href="#"
                            className="block px-4 py-3 text-orange-500 bg-slate-900 rounded-lg border border-orange-600 hover:bg-slate-800 transition-colors"
                          >
                            user1
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Original Menu Items - Hidden by default to match your design */}
                  <div className="hidden mt-4 pt-4 border-t border-slate-700">
                    <ul className="space-y-2 font-medium">
                      <li>
                        <a
                          href="#"
                          className="flex text-xl items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                        >
                          <span className="ms-3">Dashboard</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                        >
                          <svg
                            className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8"
                            />
                          </svg>
                          <span className="flex-1 ms-3 whitespace-nowrap">
                            Inbox
                          </span>
                          <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-fg-danger-strong bg-danger-soft border border-danger-subtle rounded-full">
                            2
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                        >
                          <svg
                            className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeWidth="2"
                              d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                          <span className="flex-1 ms-3 whitespace-nowrap">
                            Users
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                        >
                          <svg
                            className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
                            />
                          </svg>
                          <span className="flex-1 ms-3 whitespace-nowrap">
                            Products
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                        >
                          <svg
                            className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                            />
                          </svg>
                          <span className="flex-1 ms-3 whitespace-nowrap">
                            Sign In
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </aside>

              <div className="overflow-y-auto p-4 max-h-[78vh] custom-scrollbar">
                <div className="flex flex-col space-y-2">
                  {message.map((e, i) => {
                    return (
                      <div
                        key={i}
                        className={`flex ${
                          e.alignment === "justify-end" && "justify-end"
                        }`}
                      >
                        <div
                          className={`text-black p-2 text-start rounded-lg max-w-xs bg-gray-300 ${
                            e.alignment === "justify-end" && "bg-blue-200!"
                          }`}
                        >
                          {e.message}
                        </div>
                      </div>
                    );
                  })}

                  <div ref={bottomRef}></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 max-h-[11vh] text-white p-4 flex items-center">
              <input
                ref={messageRef}
                type="text"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white rounded-full p-2 ml-2 hover:bg-blue-600 focus:outline-none"
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </button>
            </div>
          </div>
        )}
      </center>
    </>
  );
}

export default App;
