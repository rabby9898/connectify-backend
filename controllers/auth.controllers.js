const signup = async (req, res) => {
  res.json({
    data: "Sign up endpoint",
  });
};
const login = async (req, res) => {
  res.json({
    data: "Login up endpoint",
  });
};
const logout = async (req, res) => {
  res.json({
    data: "Logout up endpoint",
  });
};

module.exports = {
  signup,
  login,
  logout,
};
