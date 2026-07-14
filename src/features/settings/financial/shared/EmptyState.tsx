type Props = {
  title: string;

  description: string;
};

export const EmptyState = ({
  title,
  description,
}: Props) => {
  return (
    <div className="rounded-xl border border-dashed p-12 text-center">

      <h3 className="font-semibold">

        {title}

      </h3>

      <p className="mt-2 text-sm text-muted-foreground">

        {description}

      </p>

    </div>
  );
};