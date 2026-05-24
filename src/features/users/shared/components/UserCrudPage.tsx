import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { AccountStatus, RecordStatus } from "../types/user.enums";
import type { CrudConfig } from "../types/user-crud.types";
import { UserDataTable } from "./UserDataTable";
import { UserDeleteDialog } from "./UserDeleteDialog";

type BaseCrudItem = {
  recordStatus: RecordStatus;
  accountStatus: AccountStatus;
};

type UserCrudPageProps<T extends BaseCrudItem> = {
  config: CrudConfig<T>;
  items: T[];
  getId: (item: T) => string;
  getName: (item: T) => string;
  onAdd: () => void;
  onView: (item: T) => void;
  onEdit: (item: T) => void;
  onDeleteConfirm: (item: T) => void;
  onChangeRecordStatus: (item: T, status: RecordStatus) => void;
  onChangeAccountStatus: (item: T, status: AccountStatus) => void;
};

export function UserCrudPage<T extends BaseCrudItem>({
  config,
  items,
  getId,
  getName,
  onAdd,
  onView,
  onEdit,
  onDeleteConfirm,
  onChangeRecordStatus,
  onChangeAccountStatus,
}: UserCrudPageProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return items;

    return items.filter((item) => getName(item).toLowerCase().includes(query));
  }, [items, searchQuery, getName]);

  function confirmDelete() {
    if (!itemToDelete) return;

    onDeleteConfirm(itemToDelete);
    setItemToDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex h-13 w-full items-center gap-3 rounded-[20px] bg-card/95 px-5 shadow-soft ring-1 ring-border/80 transition focus-within:ring-2 focus-within:ring-primary/20 md:max-w-md">
          <Search size={18} className="text-muted-foreground" />

          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={config.searchPlaceholder}
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="interactive flex h-13 items-center justify-center gap-2 rounded-[20px] bg-primary px-6 text-sm font-semibold text-white shadow-soft-lg transition hover:bg-primary-dark"
        >
          <Plus size={18} />
          Add {config.title}
        </button>
      </div>

      <UserDataTable
        items={filteredItems}
        columns={config.columns}
        getId={getId}
        onView={onView}
        onEdit={onEdit}
        onDelete={setItemToDelete}
        onChangeRecordStatus={onChangeRecordStatus}
        onChangeAccountStatus={onChangeAccountStatus}
      />

      <UserDeleteDialog
        item={itemToDelete}
        title={config.title}
        getName={getName}
        onCancel={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}