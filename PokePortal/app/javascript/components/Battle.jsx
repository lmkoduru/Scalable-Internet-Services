import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/app/javascript/components/ui/button";
import { MainHeader } from "./helpers/main-header";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { CalendarIcon } from "@radix-ui/react-icons";
import moment from "moment";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AuthContext } from "./AuthProvider";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function BattleCard({
  battle_id,
  title,
  description,
  username,
  battle_type,
  date,
  token,
}) {
  function onSubmit(values) {
    const requestBody = {
      connection: {
        battle_id: battle_id,
      },
    };

    fetch("/connection/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {username} wants to play a {battle_type} match at:
        </p>
        <p>{date}</p>
      </CardContent>
      <CardFooter>
        {/* <p>Please wait for connections to be implemented</p> */}
        <Button onClick={onSubmit}>Join Battle</Button>
      </CardFooter>
    </Card>
  );
}

export function Battles({ token }) {
  const [battles, setBattles] = useState([]);

  useEffect(() => {
    getBattles();
  }, []);

  function getBattles() {
    fetch("/battles")
      .then((response) => {
        if (!response.ok) {
          console.log("ERROR");
          return;
        }
        return response.json();
      })
      .then((data) => {
        setBattles(data);
      });
  }

  return (
    <React.Fragment>
      {battles?.map((battle) => (
        <div key={battle.id} className="col-span-1">
          <BattleCard
            battle_id={battle.id}
            title={battle.title}
            description={battle.description}
            username={battle.user.username}
            battle_type={battle.battle_type}
            date={battle.date}
            token={token}
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
  description: z.string().min(2, {
    message: "Must create a description",
  }),
  battle_type: z.string().min(2, {
    message: "Must select a type",
  }),
  date: z.date(),
});

export function BattleForm({ token }) {
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
      battle: {
        title: values.title,
        description: values.description,
        battle_type: values.battle_type,
        date: values.date,
      },
    };

    fetch("/battles/create", {
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
        console.log("UPDATING!");
        return response.json();
      })
      .then((data) => {
        toast({
          title:
            "You've successfully created a battle with the following values:",
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder={defaultValues.description} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="battle_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Singles" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Singles">Singles</SelectItem>
                  <SelectItem value="Doubles">Doubles</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button type="submit">Post Battle</Button>
      </form>
    </Form>
  );
}

export function BattlePopover({ token }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Create</Button>
      </PopoverTrigger>
      <PopoverContent>
        <BattleForm token={token} />
      </PopoverContent>
    </Popover>
  );
}

export default function Battle() {
  const { token } = useContext(AuthContext);
  return (
    <div>
      <MainHeader />
      <div className="space-y-6 p-10 pb-16 md:block">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold tracking-tight">
              The Battle Zone
            </h2>
            <p className="text-muted-foreground">
              Challenge other players and schedule your matches
            </p>
            {!token && (
              <p className="text-muted-foreground pt-3">
                {" "}
                Login to create your own posting!{" "}
              </p>
            )}
          </div>
          {token && (
            <div className="mr-12">
              <BattlePopover token={token} />
            </div>
          )}
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Battles token={token} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
