import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MainHeader } from "./helpers/main-header";

/** Signup form schema made through Zod to perform front-end field validations  */
const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username can't be empty!",
    }),
    password: z.string().min(2, {
      message: "Password can't be empty!",
    }),
    confirm_password: z.string().min(2, {
      message: "Confirm Password can't be empty!",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function Signup() {
  let { error, setError } = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  /** When a user sends username and password info, sends a POST request to the backend server to create a user.
   * If a username is already taken, the POST request would send back an error, and this will
   * properly reflect on the frontend.
   */

  function onSubmit(values) {
    console.log(values);

    const requestBody = {
      user: { username: values.username, password: values.password },
    };

    fetch("/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          setError(true);
          return;
        }
        setError(false);
        console.log("Success!");
      })
      .then(navigate("/login"));
  }

  return (
    <div className="h-screen">
      <MainHeader />
      <div className="flex flex-1 h-5/6 items-center">
        <div className="mx-auto flex w-120 flex-col justify-center space-y-6">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-3xl font-semibold tracking-right">Signup</h1>
            <p className="text-sm text-muted-foreground">
              Sign up now to access the rest of PokePortal!
            </p>
            {error && (
              <p className="text-sm text-red-400">
                {" "}
                Error during signup. Username taken{" "}
              </p>
            )}
            <Form {...form} className="flex flex-1 items-start">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display username.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Choose your password well!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Signup</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
