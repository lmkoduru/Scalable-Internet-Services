import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/app/javascript/components/ui/button";
import { MainHeader } from "./helpers/main-header";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import moment from "moment";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { AuthContext } from "./AuthProvider";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "./ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";

export function PostCard({ title, updatedAt, username, id }) {
  return (
    <Link to={`${id}`}>
      <Card className="flex flex-row justify-between">
        <div className="w-8/10">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Last updated:{" "}
              {moment(updatedAt).format("MMMM do YYYY, h:mm:ss a")}
            </p>
          </CardContent>
        </div>
        <div className="w-3/10 flex justify-center items-center p-10">
          <p className="text-muted-foreground">Created by: {username}</p>
        </div>
      </Card>
    </Link>
  );
}

export function PostCards({ forum }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts(forum);
  }, []);

  function getPosts(forum) {
    fetch(`/posts/${forum}`)
      .then((response) => {
        if (!response.ok) {
          console.log("ERROR");
          return;
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
      });
  }

  return (
    <React.Fragment>
      {posts?.map((post) => (
        <div key={post.id} className="col-span-1">
          <PostCard
            id={post.id}
            title={post.title}
            updatedAt={post.updated_at}
            username={post.user.username}
            forum={forum}
          />
        </div>
      ))}
    </React.Fragment>
  );
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  body: z.string().min(10, {
    message: "Must create a body",
  }),
});

export function PostForm({ forum }) {
  const { token } = useContext(AuthContext);
  const { toast } = useToast();
  const defaultValues = {
    title: "",
    body: "",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(values) {
    const requestBody = {
      post: {
        title: values.title,
        body: values.body,
      },
      forum: forum,
    };

    fetch("/posts", {
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
        toast({
          title:
            "You've successfully created a post with the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder={defaultValues.title} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea placeholder={defaultValues.body} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Create Post</Button>
      </form>
    </Form>
  );
}

const ForumPagesAttributes = {
  news: {
    title: "News",
    description:
      "Stay updated and discuss about the newest announcements from Pokemon.",
  },
  competitive: {
    title: "Competitive",
    description:
      "Discuss recent VGC / Smogon updates, tournaments, and all things Competitive Pokemon.",
  },
  games: {
    title: "Games",
    description:
      "Watch out for the newest Pokemon games and discuss new releases teams, etc...",
  },
  trading: {
    title: "Trading",
    description:
      "Set up times and trading agreements with other trainers a part of the PokePortal community.",
  },
};

export function PostPopover({ forum }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Create</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PostForm forum={forum} />
      </PopoverContent>
    </Popover>
  );
}

export default function ForumPage() {
  const { tag } = useParams();
  const { token } = useContext(AuthContext);
  description = ForumPagesAttributes[tag].description;
  title = ForumPagesAttributes[tag].title;
  console.log(description);
  return (
    <div>
      <MainHeader />
      <div className="space-y-6 p-10 pb-16 md:block">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {!token && (
            <p className="text-muted-foreground pt-3">
              {" "}
              Login to create your own posting!{" "}
            </p>
          )}
        </div>
        {token && (
          <div className="mr-12">
            <PostPopover forum={tag} />
          </div>
        )}
        <Separator className="my-6" />
        <PostCards forum={tag} />
      </div>
    </div>
  );
}
