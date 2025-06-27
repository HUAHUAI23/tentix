import { Controller } from "react-hook-form";
import {
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
} from "tentix-ui";
import type { JSONContentZod, ticketInsertType } from "tentix-server/types";
import { moduleEnumArray } from "tentix-server/constants";
import { joinTrans, useTranslation } from "i18n";

export type TicketFormProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: ReturnType<typeof import("react-hook-form").useForm<ticketInsertType>>["register"];
  control: ReturnType<typeof import("react-hook-form").useForm<ticketInsertType>>["control"];
  setValue: ReturnType<typeof import("react-hook-form").useForm<ticketInsertType>>["setValue"];
  errors: ReturnType<typeof import("react-hook-form").useForm<ticketInsertType>>["formState"]["errors"];
};

export function TicketForm({
  onSubmit,
  register,
  control,
  errors,
}: TicketFormProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-[900px] mx-auto w-full p-8 gap-5 bg-white">
      <form
        id="ticket-form"
        name="ticket-form"
        onSubmit={onSubmit}
        className="grid gap-6 p-1"
      >
        <Card className="md:col-span-2 lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="normal-case">
              {joinTrans([t("tkt"), t("info")])}
            </CardTitle>
            <CardDescription>{t("plz_pvd_info")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title-input" className="normal-case">
                <span className="text-red-600">*</span>
                {t("title")}
              </Label>
              <Input
                id="title-input"
                {...register("title", { required: true })}
                placeholder={t("title_ph")}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{t("field_required")}</p>
              )}
            </div>

            {/* Module */}
            <div className="space-y-2">
              <Label htmlFor="module" className="normal-case">
                <span className="text-red-600">*</span>
                {t("module")}
              </Label>
              <Controller
                control={control}
                name="module"
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange} required>
                    <SelectTrigger id="module">
                      <SelectValue placeholder={joinTrans([t("select"), t("module")])} />
                    </SelectTrigger>
                    <SelectContent>
                      {moduleEnumArray.map((m) => (
                        <SelectItem key={m} value={m}>
                          {t(m)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.module && (
                <p className="text-red-600 text-sm">{t("field_required")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="normal-case">
                <span className="text-red-600">*</span>
                {t("desc")}
              </Label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <DescriptionEditor
                    {...field}
                    value={field.value}
                    onChange={(v) => field.onChange(v as JSONContentZod)}
                    className="w-full h-56"
                    editorContentClassName="p-5"
                    output="json"
                    placeholder={t("desc_ph")}
                    autofocus
                    editable
                    editorClassName="focus:outline-hidden"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{t("field_required")}</p>
              )}
            </div>
          </CardContent>
        </Card>
        <input type="hidden" {...register("occurrenceTime")}/>
        <input type="hidden" {...register("priority")} />
      </form>
    </div>
  );
}
