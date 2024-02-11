import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Separator } from "../ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Settings from "./Settings";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarImage } from "../ui/avatar";
import { toast } from "../ui/use-toast";
import { AuthContext } from "../AuthProvider";
import { Toaster } from "../ui/toaster";
import { ScrollArea } from "../ui/scroll-area";

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username can't be empty!",
  }),
  password: z.string().min(2, {
    message: "Password can't be empty!",
  }),
  bio: z.string().max(160).min(0).optional(),
  profile_pic: z.string().max(160).min(2).optional(),
});

export function ProfileForm() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formDefaults, setFormDefaults] = useState({
    username: "",
    password: "",
    bio: "",
    profile_pic:
      "https://i.pinimg.com/originals/09/da/92/09da926c2b94d95008a9e3b2f60bfdd3.png",
  });

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    formDefaults,
    mode: "onChange",
  });

  useEffect(() => {
    updateDefaultValues();
  }, [token]);

  function updateDefaultValues() {
    fetch("/user/info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log("ERROR");
          return;
        }
        return response.json();
      })
      .then((data) => {
        user = data?.user;
        setFormDefaults({
          username: user.username,
          bio: user.bio,
          profile_pic: user.profile_pic,
        });
      });
  }

  function onSubmit(values) {
    const requestBody = {
      user: {
        username: values.username,
        password: values.password,
        bio: values.bio,
        profile_pic: values.profile_pic,
      },
    };

    fetch("/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          return;
        }
        return response.json();
      })
      .then((data) => {
        user = data?.user;
        toast({
          title:
            "You've successfully updated your profile to the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <div className="text-white">
                <p>Profile Pic: {user.profile_pic}</p>
                <p>Username: {user.username}</p>
                <p>Bio: {user.bio}</p>
              </div>
            </pre>
          ),
        });
        navigate("/settings/profile");
      });
  }
  return (
    <Form {...form} className="h-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="profile_pic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture URL</FormLabel>
              <FormControl>
                <Input placeholder={formDefaults.profile_pic} {...field} />
              </FormControl>
              <Avatar>
                <AvatarImage className="bg-red-400" />
              </Avatar>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder={formDefaults.username} {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or
                chosen in game name.
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
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={formDefaults.bio}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Profile</Button>
      </form>
    </Form>
  );
}

export function DeleteProfile() {
  const { token, logout } = useContext(AuthContext);
  function onClick() {
    fetch("/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in deleting user");
        }
        return response.json();
      })
      .then(() => {
        logout();
        navigate("/");
      });
  }

  return (
    <div>
      <Button onClick={onClick} variant="destructive">
        Delete Profile
      </Button>
    </div>
  );
}

export default function Profile() {
  return (
    <ScrollArea className="space-y-6 h-full">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
      <DeleteProfile />
      <Toaster />
    </ScrollArea>
  );
}
