import useLocalUser from "@hook/use-local-user.tsx";
import { apiClient } from "@lib/api-client.ts";
import { cn } from "@lib/utils";
import {
  type JSONContentZod,
  type ticketInsertType,
} from "tentix-server/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { joinTrans, useTranslation } from "i18n";
import { CalendarIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  moduleEnumArray,
  ticketPriorityEnumArray,
} from "tentix-server/constants";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DescriptionEditor,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "tentix-ui";

export function TicketForm() {
  const { t } = useTranslation();
  const { area } = useLocalUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    register,
    control,
    formState: { errors },
  } = useForm<ticketInsertType>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      area,
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: ticketInsertType) => {
      const res = await apiClient.ticket.create.$post({ json: data });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.status || t("ticket_create_failed"));
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: t("ticket_created"),
        variant: "default",
      });
      navigate({ to: "/user/tickets/$id", params: { id: data.id.toString() } });
    },
    onError: (error: Error) => {
      toast({
        title: t("ticket_create_failed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="p-6">
      <form
        name="ticket-form"
        onSubmit={handleSubmit(
          (data) => {
            createTicketMutation.mutate(data);
          },
          () => {
            toast({
              title: t("plz_fill_all_fields"),
              description: t("missing_fields", {
                fields: Object.keys(errors).join(", "),
              }),
              variant: "destructive",
            });
          },
        )}
      >
        <div className="grid gap-6 p-1">
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="normal-case">{joinTrans([t("tkt"), t("details")])}</CardTitle>
              <CardDescription>{t("plz_pvd_info")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title-input" className="normal-case">
                <span className="text-red-500">*</span> {t("title")} 
                </Label>
                <Input
                  id="title-input"
                  {...register("title", { required: true })}
                  placeholder={t("title_ph")}
                />
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="module" className="normal-case">
                  <span className="text-red-500">*</span> {t("module")} 
                  </Label>
                  <Controller
                    control={control}
                    name="module"
                    render={({ field }) => (
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        required
                      >
                        <SelectTrigger id="module">
                          <SelectValue
                            placeholder={joinTrans([t("select"), t("module")])}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {moduleEnumArray.map((module) => (
                            <SelectItem key={module} value={module}>
                              {t(module)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="normal-case">
                  <span className="text-red-500">*</span> {t("desc")}
                </Label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <DescriptionEditor
                      {...field}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value as JSONContentZod);
                      }}
                      className="w-full h-72"
                      editorContentClassName="p-5"
                      output="json"
                      placeholder={t("desc_ph")}
                      autofocus={true}
                      editable={true}
                      editorClassName="focus:outline-hidden"
                    />
                  )}
                />
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex items-start space-x-2 justify-between">
          <Button
            type="submit"
            className="ml-auto"
            // disabled={createTicketMutation.isPending}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
