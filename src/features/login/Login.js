import React, { useEffect, useState } from "react";
import axios from "axios";

import { Formik, Form, Field, ErrorMessage } from "formik";

const formValidator = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  return errors;
};

const Login = () => {
  const [token, setToken] = useState(null);

  const getToken = async () => {
    try {
      const res = await axios.get("http://localhost:3000/auth", {
        withCredentials: true,
        credentials: "include",
      });
      setToken(res.data.token);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/signin",
        values,
        {
          withCredentials: true,
          headers: {
            "CSRF-Token": token,
          },
        }
      );

      setSubmitting(false);
      alert(res.data.message);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div
      style={{
        height: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Serverless csrf</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={formValidator}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <Field
              style={{
                height: "2rem",
                marginTop: "1rem",
                padding: "0.25rem 0.5rem",
              }}
              type="email"
              name="email"
              placeholder="Enter your email address"
            />
            <ErrorMessage name="email" component="div" />
            <Field
              style={{
                height: "2rem",
                marginTop: "1rem",
                padding: "0.25rem 0.5rem",
              }}
              type="password"
              name="password"
              placeholder="Enter your password"
            />
            <ErrorMessage name="password" component="div" />
            <button
              style={{ height: "3rem", marginTop: "1rem" }}
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
