export const User = {
  username: "",
  password: "",
  gender: "",
  age_group: ""
};

export const Rules = {
  name: [
    val => (val || "").length > 0 || "Name is required",
    val =>
        (val.trim().split(" ").length >= 2 && val.length > 5) ||
        "Please enter valid name"
  ],
  email: [
    v => !!v || "E-mail is required",
    v => /.+@.+\..+/.test(v) || "E-mail must be valid"
  ],
  password: [
    value => !!value || "Password is required.",
    v => v.length >= 6 || "Min 6 characters"
  ]
};
