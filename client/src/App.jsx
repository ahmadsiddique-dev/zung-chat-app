import { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Comment } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import socketService from "./utils/socketService";
import {
  accessThunk,
  fetchConversationsThunk,
  fetchMessagesThunk,
  createConversationThunk,
  fetchUsersThunk,
  logoutThunk
} from "./features/api.thunk";
import { setActiveConversation, addMessage } from "./features/conversationSlice";

function App() {
  const messageRef = useRef("");
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const loading = useSelector((state) => state.user.status.loading);
  const auth = useSelector((state) => state.user.status.auth);
  const profile = useSelector((state) => state.user.data);
  const conversations = useSelector((state) => state.conversation.list);
  const activeConversation = useSelector((state) => state.conversation.activeConversation);
  const messagesObj = useSelector((state) => state.conversation.messages);
  const users = useSelector((state) => state.conversation.users);

  // Memoize messages to prevent unnecessary re-renders
  const messages = useMemo(() => {
    if (!activeConversation) return [];
    return messagesObj[activeConversation._id] || [];
  }, [activeConversation, messagesObj]);

  const checking = async () => {
    // Skip if already authenticated
    if (auth && profile?._id) {
      // Already logged in, just connect socket and fetch data
      if (profile.accessToken) {
        socketService.connect(profile.accessToken);

        // Fetch conversations and users
        const conversationsResult = await dispatch(fetchConversationsThunk()).unwrap();
        dispatch(fetchUsersThunk());

        // Join all conversation rooms after fetching (conversationsResult is the array directly)
        if (conversationsResult && Array.isArray(conversationsResult)) {
          conversationsResult.forEach(conv => {
            socketService.joinConversation(conv._id);
          });
        }

        // Listen for incoming messages
        socketService.onReceiveMessage((message) => {
          dispatch(addMessage({
            conversationId: message.conversationId,
            message: message
          }));
        });

        // Listen for typing indicators
        socketService.onUserTyping((data) => {
          setIsTyping(true);
          setTypingUser(data.userName);
        });

        socketService.onUserStopTyping(() => {
          setIsTyping(false);
          setTypingUser(null);
        });
      }
      return;
    }

    // Not authenticated, try to refresh token
    dispatch(accessThunk())
      .unwrap()
      .then(async (data) => {
        // Connect to Socket.IO after successful authentication
        if (data.accessToken) {
          socketService.connect(data.accessToken);

          // Fetch conversations and users
          const conversationsResult = await dispatch(fetchConversationsThunk()).unwrap();
          dispatch(fetchUsersThunk());

          // Join all conversation rooms (conversationsResult is the array directly)
          if (conversationsResult && Array.isArray(conversationsResult)) {
            conversationsResult.forEach(conv => {
              socketService.joinConversation(conv._id);
            });
          }

          // Listen for incoming messages
          socketService.onReceiveMessage((message) => {
            dispatch(addMessage({
              conversationId: message.conversationId,
              message: message
            }));
          });

          // Listen for typing indicators
          socketService.onUserTyping((data) => {
            setIsTyping(true);
            setTypingUser(data.userName);
          });

          socketService.onUserStopTyping(() => {
            setIsTyping(false);
            setTypingUser(null);
          });
        }
      })
      .catch(() => {
        navigate("/login");
      });
  };
  useEffect(() => {
    checking();

    // Cleanup on unmount
    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      dispatch(fetchMessagesThunk(activeConversation._id));
      socketService.joinConversation(activeConversation._id);
    }
  }, [activeConversation, dispatch]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSidebar = () => {
    setIsSidebarHidden((prev) => !prev);
  };

  const handleSelectConversation = (conversation) => {
    dispatch(setActiveConversation(conversation));
    setShowUserList(false);
    if (window.innerWidth < 768) {
      setIsSidebarHidden(true);
    }
  };

  const handleSelectUser = (user) => {
    dispatch(createConversationThunk(user._id))
      .unwrap()
      .then((conversation) => {
        dispatch(setActiveConversation(conversation));
        setShowUserList(false);
        dispatch(fetchMessagesThunk(conversation._id));
        socketService.joinConversation(conversation._id);
        if (window.innerWidth < 768) {
          setIsSidebarHidden(true);
        }
      });
  };

  const handleSend = () => {
    const text = messageRef.current.value;

    if (!text.trim() || !activeConversation || !profile?._id) return;

    socketService.sendMessage(activeConversation._id, text);

    // Optimistically add to UI
    const newMessage = {
      content: text,
      senderId: { _id: profile._id, userName: profile.userName },
      createdAt: new Date().toISOString() // Convert to ISO string for Redux serialization
    };
    dispatch(addMessage({
      conversationId: activeConversation._id,
      message: newMessage
    }));

    messageRef.current.value = "";
    socketService.stopTyping(activeConversation._id);
  };

  const handleTyping = () => {
    if (!activeConversation) return;
    socketService.startTyping(activeConversation._id);

    setTimeout(() => {
      socketService.stopTyping(activeConversation._id);
    }, 2000);
  };

  const handleLogout = () => {
    dispatch(logoutThunk())
      .unwrap()
      .then(() => {
        socketService.disconnect();
        navigate("/login");
      });
  };

  const getOtherMember = (conversation) => {
    if (!conversation?.members || !profile?._id) return null;
    return conversation.members.find(m => m._id !== profile._id);
  };

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--pixel-black)'
      }}>
        <Comment
          visible={true}
          height="160"
          width="160"
          ariaLabel="comment-loading"
          color="#fff"
          backgroundColor="#ff6b9d"
        />
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--pixel-black)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div className="pixel-border-primary" style={{
        background: 'var(--pixel-darker)',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleSidebar}
            className="pixel-button"
            style={{ padding: '8px 12px', fontSize: '10px' }}
          >
            {isSidebarHidden ? '▶' : '◀'}
          </button>
          <h1 className="pixel-h2" style={{ margin: 0, color: 'var(--pixel-primary)' }}>
            🎮 ZUNG CHAT
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="pixel-h3" style={{ color: 'var(--pixel-accent)' }}>
            {profile?.userName || 'Guest'}
          </span>
          <button
            onClick={handleLogout}
            className="pixel-button pixel-button-danger"
            style={{ padding: '8px 16px', fontSize: '10px' }}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        {!isSidebarHidden && (
          <div className="pixel-border" style={{
            width: '300px',
            background: 'var(--pixel-darker)',
            display: 'flex',
            flexDirection: 'column',
            borderTop: 'none',
            borderBottom: 'none',
            borderLeft: 'none'
          }}>
            {/* Sidebar Header */}
            <div style={{ padding: '16px', borderBottom: '3px solid var(--pixel-dark)' }}>
              <button
                className="pixel-button"
                style={{ width: '100%', fontSize: '10px' }}
                onClick={() => setShowUserList(!showUserList)}
              >
                {showUserList ? 'SHOW CHATS' : 'NEW CHAT'}
              </button>
            </div>

            {/* User/Conversation List */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {showUserList ? (
                // Users List
                <div>
                  <h3 className="pixel-h3" style={{ color: 'var(--pixel-accent)', marginBottom: '12px' }}>
                    PLAYERS
                  </h3>
                  {users.length === 0 ? (
                    <p style={{ color: 'var(--pixel-gray)', fontFamily: 'VT323' }}>
                      No users found
                    </p>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleSelectUser(user)}
                        className="pixel-hover"
                        style={{
                          padding: '12px',
                          marginBottom: '8px',
                          background: 'var(--pixel-darker)',
                          border: '3px solid var(--pixel-dark)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <div className="pixel-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                          {user.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'Press Start 2P', fontSize: '12px', color: 'var(--pixel-white)' }}>
                            {user.userName}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // Conversations List
                <div>
                  <h3 className="pixel-h3" style={{ color: 'var(--pixel-accent)', marginBottom: '12px' }}>
                    CHATS
                  </h3>
                  {conversations.length === 0 ? (
                    <p style={{ color: 'var(--pixel-gray)', fontFamily: 'VT323', fontSize: '16px' }}>
                      No conversations yet. Click "NEW CHAT" to start!
                    </p>
                  ) : (
                    conversations.map((conv) => {
                      const other = getOtherMember(conv);
                      if (!other) return null;

                      return (
                        <div
                          key={conv._id}
                          onClick={() => handleSelectConversation(conv)}
                          className="pixel-hover"
                          style={{
                            padding: '12px',
                            marginBottom: '8px',
                            background: activeConversation?._id === conv._id ? 'var(--pixel-primary)' : 'var(--pixel-darker)',
                            border: '3px solid var(--pixel-dark)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <div className="pixel-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                            {other.userName.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'Press Start 2P', fontSize: '12px', color: 'var(--pixel-white)' }}>
                              {other.userName}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          {activeConversation && (
            <div className="pixel-border" style={{
              padding: '16px',
              background: 'var(--pixel-darker)',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="pixel-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                  {getOtherMember(activeConversation)?.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="pixel-h3" style={{ margin: 0, color: 'var(--pixel-white)' }}>
                    {getOtherMember(activeConversation)?.userName}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="custom-scrollbar" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            background: 'var(--pixel-black)'
          }}>
            {!activeConversation ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px'
              }}>
                <h2 className="pixel-h2" style={{ color: 'var(--pixel-gray)' }}>
                  SELECT A CHAT
                </h2>
                <p style={{ fontFamily: 'VT323', fontSize: '20px', color: 'var(--pixel-gray)' }}>
                  Choose a conversation or start a new one!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((msg, i) => {
                  if (!msg || !msg.senderId || !profile?._id) return null;
                  const isSent = msg.senderId._id === profile._id || msg.senderId === profile._id;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: isSent ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        className={isSent ? 'pixel-message-sent' : 'pixel-message-received'}
                        style={{
                          maxWidth: '70%',
                          padding: '12px 16px',
                          fontFamily: 'VT323',
                          fontSize: '18px'
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && typingUser && (
                  <div style={{ display: 'flex' }}>
                    <div style={{
                      color: 'var(--pixel-gray)',
                      fontFamily: 'VT323',
                      fontSize: '16px',
                      fontStyle: 'italic',
                      padding: '8px'
                    }}>
                      {typingUser} is typing<span className="pixel-loading">...</span>
                    </div>
                  </div>
                )}

                <div ref={bottomRef}></div>
              </div>
            )}
          </div>

          {/* Input */}
          {activeConversation && (
            <div className="pixel-border" style={{
              padding: '16px',
              background: 'var(--pixel-darker)',
              display: 'flex',
              gap: '12px',
              borderBottom: 'none',
              borderLeft: 'none',
              borderRight: 'none'
            }}>
              <input
                ref={messageRef}
                type="text"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                onInput={handleTyping}
                placeholder="Type message..."
                className="pixel-input"
                style={{ flex: 1 }}
              />
              <button
                onClick={handleSend}
                className="pixel-button"
                style={{ fontSize: '10px', padding: '12px 24px' }}
              >
                SEND
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
