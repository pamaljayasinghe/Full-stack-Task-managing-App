import api from "./api";

const AuthService = {
  register: (userData) => {
    return api.post("/register", userData);
  },

  login: (username, password) => {
    return api
      .post("/login", { username, password })
      .then((response) => {
        if (response.data) {
          // Store user data
          if (response.data.token) {
            // If the response has a token structure
            const token = response.data.token.startsWith("Bearer ")
              ? response.data.token
              : `Bearer ${response.data.token}`;
            localStorage.setItem("token", token);

            // Store user object as JSON string
            const userData = response.data.user || response.data;
            localStorage.setItem("user", JSON.stringify(userData));
          } else if (typeof response.data === "string") {
            // Legacy format or just the token directly
            const token = response.data.startsWith("Bearer ")
              ? response.data
              : `Bearer ${response.data}`;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ username }));
          } else {
            // Store the whole response data
            localStorage.setItem("token", `Bearer ${response.data.id || ""}`);
            localStorage.setItem("user", JSON.stringify(response.data));
          }
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Login error:", error.response || error);
        throw error;
      });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  forgotPassword: (email) => {
    return api.post("/forgot-password", { email });
  },

  resetPassword: (token, newPassword) => {
    return api.post("/reset-password", { token, newPassword });
  },

  changePassword: (oldPassword, newPassword) => {
    const user = localStorage.getItem("user");
    let username;

    try {
      const userData = JSON.parse(user);
      username = userData.username || userData.email;
    } catch (e) {
      username = user;
    }

    return api.put("/change-password", {
      username,
      oldPassword,
      newPassword,
    });
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    try {
      return JSON.parse(user);
    } catch (e) {
      return user;
    }
  },

  isAuthenticated: () => {
    return localStorage.getItem("token") !== null;
  },
};

export default AuthService;
