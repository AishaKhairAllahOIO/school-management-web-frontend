 import { useState } from "react";

import { useForm, type Resolver } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import { Button } from "@/shared/ui/button";

import { Input } from "@/shared/ui/input";

import { Label } from "@/shared/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import {
  classSchema,
  type ClassSchema,
} from "../schemas/class.schema";

export const AddClassDialog = () => {
  const [open, setOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClassSchema>({
   // resolver:
   //   zodResolver(classSchema),

    defaultValues: {
      name: "",
      level: "",
      sectionsCount: 1,
      studentsCount: 0,
    },
  });

  const onSubmit = (
    values: ClassSchema
  ) => {
    console.log(values);

    reset();

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="
            rounded-2xl
          "
        >
          <Plus
            className="
              mr-2
              h-4
              w-4
            "
          />

          Add Class
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          sm:max-w-lg
        "
      >
        <DialogHeader>
          <DialogTitle>
            Add New Class
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="
            space-y-5
          "
        >
          {/* NAME */}

          <div
            className="
              space-y-2
            "
          >
            <Label>
              Class Name
            </Label>

            <Input
              placeholder="Grade 1"
              {...register("name")}
            />

            {errors.name && (
              <p
                className="
                  text-sm
                  text-red-500
                "
              >
                {
                  errors.name
                    .message
                }
              </p>
            )}
          </div>

          {/* LEVEL */}

          <div
            className="
              space-y-2
            "
          >
            <Label>
              Level
            </Label>

            <Select
              onValueChange={(
                value
              ) =>
                setValue(
                  "level",
                  value
                )
              }
              value={watch("level")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Primary">
                  Primary
                </SelectItem>

                <SelectItem value="Middle">
                  Middle
                </SelectItem>

                <SelectItem value="Secondary">
                  Secondary
                </SelectItem>
              </SelectContent>
            </Select>

            {errors.level && (
              <p
                className="
                  text-sm
                  text-red-500
                "
              >
                {
                  errors.level
                    .message
                }
              </p>
            )}
          </div>

          {/* SECTIONS */}

          <div
            className="
              space-y-2
            "
          >
            <Label>
              Sections Count
            </Label>

            <Input
              type="number"
              {...register(
                "sectionsCount"
              )}
            />

            {errors.sectionsCount && (
              <p
                className="
                  text-sm
                  text-red-500
                "
              >
                {
                  errors
                    .sectionsCount
                    .message
                }
              </p>
            )}
          </div>

          {/* STUDENTS */}

          <div
            className="
              space-y-2
            "
          >
            <Label>
              Students Count
            </Label>

            <Input
              type="number"
              {...register(
                "studentsCount"
              )}
            />

            {errors.studentsCount && (
              <p
                className="
                  text-sm
                  text-red-500
                "
              >
                {
                  errors
                    .studentsCount
                    .message
                }
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="
              w-full
              rounded-2xl
            "
          >
            Create Class
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};