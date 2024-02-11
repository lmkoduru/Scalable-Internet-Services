import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import * as z from "zod";

import { MainHeader } from "./helpers/main-header";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "./AuthProvider";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function CommentCard({ body, updatedAt, username }) {
  return (
    <Card className="flex flex-row justify-between m-4">
      <div className="w-8/10">
        <CardHeader>
          <CardTitle className="text-muted-foreground">{username}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{body}</p>
          <p className="text-muted-foreground">
            Last updated: {moment(updatedAt).format("MMMM do YYYY, h:mm:ss a")}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}

export function Comments({ post_id }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    getComments(post_id);
  }, []);

  function getComments(post_id) {
    fetch(`/comment/${post_id}`)
      .then((response) => {
        if (!response.ok) {
          console.log("ERROR");
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setComments(data);
      });
  }

  return (
    <React.Fragment>
      {comments?.map((comment) => (
        <div key={comment.id} className="col-span-1">
          <CommentCard
            body={comment.body}
            updatedAt={comment.updated_at}
            username={comment.user.username}
          />
        </div>
      ))}
    </React.Fragment>
  );
}

const CommentSchema = z.object({
  body: z.string().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
});

export function CommentArea({ post_id }) {
  const { token } = useContext(AuthContext);
  const defaultValues = {
    body: "",
  };

  const form = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues,
    mod: "onChange",
  });

  function onSubmit(values) {
    const requestBody = {
      post_id: post_id,
      body: values.body,
    };

    fetch("/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(requestBody),
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      return response.json();
    });
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea placeholder={defaultValues.body} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Create Comment</Button>
        </form>
      </Form>
    </div>
  );
}

export function PostArea({ post, tag }) {
  return (
    <div>
      <div className="space-y-6 p-10 pb-16 md:block">
        <Link to={`/forum/${tag}`}>
          <div className="p-2 outline outline-offset-2 outline-1 rounded w-32">
            Back to {tag}
          </div>
        </Link>
        <div className="md:mb-0">
          <h1 className="text-2xl font-bold tracking-tight">{post.title}</h1>
        </div>
        <div className="p-4 outline outline-offset-2 outline-1 rounded">
          <div className="py-2">
            <p>{post.body}</p>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">
              User: {post.user?.username}
            </p>
            <p className="text-xs text-muted-foreground">
              Last Updated At:{" "}
              {moment(post.updated_at).format("MMMM do YYYY, h:mm:ss a")}
            </p>
          </div>
        </div>
        <Separator />
        <CommentArea post_id={post.id} />
      </div>
    </div>
  );
}

export default function Post() {
  let { tag, post_id } = useParams();
  const [post, setPost] = useState([]);

  useEffect(() => {
    getPost(tag, post_id);
  }, []);

  function getPost(tag, post_id) {
    fetch(`/posts/${tag}/${post_id}`)
      .then((response) => {
        if (!response.ok) {
          console.log("ERROR");
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPost(data);
      });
  }
  return (
    <div className=" my-14 pb-32">
      <MainHeader />
      <Separator className="my-6" />
      <PostArea post={post} tag={tag} />
      <Separator className="my-6" />
      <Comments post_id={post_id} />
    </div>
  );
}
