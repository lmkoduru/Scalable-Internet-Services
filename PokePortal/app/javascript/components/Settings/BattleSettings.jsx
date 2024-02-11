import React, { useContext, useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast, useToast } from "../ui/use-toast";
import { AuthContext } from "../AuthProvider";
import {
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  Card,
  CardFooter,
} from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { ScrollArea } from "../ui/scroll-area";

//Function for user to join a battle (create a connection)

export function UpdateBattlePopover({ id, token }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Update Battle</Button>
      </PopoverTrigger>
      <PopoverContent>
        <ScrollArea className="flex max-h-56 flex-col" type="always">
          <UpdateBattleForm id={id} token={token} />
        </ScrollArea>
      </PopoverContent>
    </Popover>
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

export function UpdateBattleForm({ id, token }) {
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

    fetch(`/battles/${id}}`, {
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
          title: "Battle updated successfully",
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
        <Button type="submit">Update Battle</Button>
      </form>
    </Form>
  );
}

export function ConnectedBattleSettingCard({ battle, connection_id, token }) {
  function deleteConnectedBattle() {
    fetch(`/connection/${connection_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in deleting connection");
        }
        return response.json();
      })
      .then(() => {
        navigate("/settings/battles");
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{battle.title}</CardTitle>
        <CardDescription>{battle.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {battle.username} wants to play a {battle.battle_type} match at:
        </p>
        <p>{battle.date}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={deleteConnectedBattle} variant="destructive">
          Delete Connected Battle
        </Button>
      </CardFooter>
    </Card>
  );
}

export function BattleSettingCard({ battle, token }) {
  function deleteBattle() {
    fetch(`/battles/${battle.id}`, {
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
        navigate("/settings/battles");
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{battle.title}</CardTitle>
        <CardDescription>{battle.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {battle.username} wants to play a {battle.battle_type} match at:
        </p>
        <p>{battle.date}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={deleteBattle} variant="destructive">
          Delete Battle
        </Button>
        <UpdateBattlePopover id={battle.id} token={token} />
      </CardFooter>
    </Card>
  );
}

export default function BattleSetting() {
  const { token } = useContext(AuthContext);
  const [battles, setBattles] = useState([]);
  const [connectedBattles, setConnectedBattles] = useState([]);

  useEffect(() => {
    getBattles();
    getConnectedBattles();
  }, []);

  function getConnectedBattles() {
    fetch("/connected_battles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        //check if the response was successful or not
        if (!response.ok) {
          console.log("Error fetching connected battles");
          return;
        }
        //Parse the JSON data from the response
        return response.json();
      })
      .then((data) => {
        //Set the fetched battles in the component state
        setConnectedBattles(data);
      })
      .catch((error) => {
        //Log any errors that occur when fetching
        console.error("Error:", error);
      });
  }

  function getBattles() {
    //fetch function to make a GET request to "/connected_battles"

    fetch("/user_battles", {
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
        setBattles(data);
      });
  }

  return (
    <div className="space-y-6 h-full">
      <div>
        <h3 className="text-lg font-medium">Battles</h3>
        <p className="text-sm text-muted-foreground">
          Here are all of your Battle Postings:
        </p>
        {battles.map((battle) => {
          return (
            <BattleSettingCard key={battle.id} battle={battle} token={token} />
          );
        })}
      </div>
      <div>
        <h3 className="text-lg font-medium">Connected Battles</h3>
        <p className="text-sm text-muted-foreground">
          Here are all of your Connected Battles:
        </p>
        {connectedBattles.map((connectedBattle) => {
          return (
            <ConnectedBattleSettingCard
              key={connectedBattle.id}
              battle={connectedBattle.battle}
              connection_id={connectedBattle.connection_id}
              token={token}
            />
          );
        })}
      </div>
      <Separator />
    </div>
  );
}
