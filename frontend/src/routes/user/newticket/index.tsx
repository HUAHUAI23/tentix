import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@comp/site-header";
import {
  SidebarInset,
  SidebarProvider,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "tentix-ui";
import { TicketForm } from "@comp/tickets/ticket-form";
import { useTranslation } from "i18n";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@lib/api-client";
import useLocalUser from "@hook/use-local-user";
import type { ticketInsertType } from "tentix-server/types";
import { useToast } from "tentix-ui";
import { ticketPriorityEnumArray } from "tentix-server/constants";

export const Route = createFileRoute("/user/newticket/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { area } = useLocalUser();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ticketInsertType>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { area },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: ticketInsertType) => {
      const res = await apiClient.ticket.create.$post({ json: data });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.status || t("ticket_create_failed"));
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: t("ticket_created"), variant: "default" });
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

  const onSubmit = (data: ticketInsertType) => {
    data.occurrenceTime = new Date().toISOString();
    data.priority = ticketPriorityEnumArray[0];
    createTicketMutation.mutate(data);
    setShowDialog(false);
  };
  const onError = (errs: typeof errors) => {
    toast({
      title: t("plz_fill_all_fields"),
      description: t("missing_fields", {
        fields: Object.keys(errs).join(", "),
      }),
      variant: "destructive",
    });
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        <SiteHeader
          title={t("create_new_ticket")}
          onBack={() => navigate({ to: "/user/tickets/list" })}
          onSubmit={() => setShowDialog(true)}
        />

        <TicketForm
          onSubmit={handleSubmit(onSubmit, onError)}
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
        />
      </SidebarInset>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="w-96 p-6">
          <DialogHeader>
            <DialogTitle>⚠️ {t("prompt")}</DialogTitle>
            <DialogDescription>
              {t("are_you_sure_submit_ticket")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                handleSubmit(onSubmit, onError)();
              }}
              className="w-20 h-10 px-4 py-2 bg-black"
            >
              {t("submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
