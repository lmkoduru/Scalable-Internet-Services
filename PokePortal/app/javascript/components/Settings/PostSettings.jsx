import React, { useContext, useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import moment from "moment";
import { Textarea } from "../ui/textarea";
import { toast, useToast } from "../ui/use-toast";
import { AuthContext } from "../AuthProvider";
import {
  CardContent,
  CardHeader,
  CardTitle,
  Card,
  CardFooter,
} from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  body: z.string().min(10, {
    message: "Must create a body",
  }),
});

export function UpdatePostForm({ id, token }) {
  const { toast } = useToast();
  const defaultValues = {
    title: "",
    description: "",
    battle_type: "",
    date: "",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(values) {
    const requestBody = {
      title: values.title,
      body: values.body,
    };

    fetch(`/posts/${id}}`, {
      method: "PUT",
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
          title: "Post updated successfully",
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
        <Button type="submit">Update Post</Button>
      </form>
    </Form>
  );
}
export function UpdatePostPopover({ id, token }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Update Post</Button>
      </PopoverTrigger>
      <PopoverContent>
        <ScrollArea className="flex max-h-56 flex-col" type="always">
          <UpdatePostForm id={id} token={token} />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export function PostSettingCard({ post, token }) {
  function deletePost() {
    fetch(`/post/${post.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in deleting post");
        }
        return response.json();
      })
      .then(() => {
        navigate("/settings/posts");
      });
  }

  return (
    <Card className="flex flex-row justify-between">
      <div className="w-8/10">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Last updated:{" "}
            {moment(post.updatedAt).format("MMMM do YYYY, h:mm:ss a")}
          </p>
        </CardContent>
      </div>
      <div className="w-3/10 flex justify-center items-center p-10">
        <p className="text-muted-foreground">
          Created by: {post.user?.username}
        </p>
      </div>
      <CardFooter>
        <Button onClick={deletePost} variant="destructive">
          Delete Post
        </Button>
        <UpdatePostPopover id={post.id} token={token} />
      </CardFooter>
    </Card>
  );
}

export default function PostSetting() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  function getPosts() {
    fetch("/user_posts", {
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
        console.log(data);
        setPosts(data);
      });
  }

  return (
    <div className="space-y-6 h-full">
      <div>
        <h3 className="text-lg font-medium">Posts</h3>
        <p className="text-sm text-muted-foreground">
          Here are all of your Posts:
        </p>
        {posts.map((post) => {
          return <PostSettingCard key={post.id} post={post} token={token} />;
        })}
      </div>
      <Separator />
    </div>
  );
}
