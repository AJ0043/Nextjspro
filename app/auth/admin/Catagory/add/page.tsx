"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  ArrowUpDown,
  Download,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  VisibilityState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

interface Category {
  _id: string;
  title: string;
  slug: string;
  parent?: { _id: string; title: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  const [modalType, setModalType] =
    useState<"create" | "edit" | "delete" | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState("");

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return search
      ? categories.filter(
          (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.slug.toLowerCase().includes(search.toLowerCase())
        )
      : categories;
  }, [search, categories]);

  /* ================= EXPORT ================= */
  const exportCSV = () => {
    const headers = ["Title", "Slug", "Parent", "Created At", "Updated At"];
    const rows = filtered.map((c) => [
      c.title,
      c.slug,
      c.parent?.title || "Main Category",
      c.createdAt ? new Date(c.createdAt).toLocaleString() : "-",
      c.updatedAt ? new Date(c.updatedAt).toLocaleString() : "-",
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "categories.csv";
    a.click();
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <button
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
            className="flex items-center gap-1 cursor-pointer text-amber-100"
          >
            Title <ArrowUpDown size={14} />
          </button>
        ),
      },
      {
        accessorKey: "slug",
        header: ({ column }) => (
          <button
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
            className="flex items-center gap-1 cursor-pointer text-amber-100"
          >
            Slug <ArrowUpDown size={14} />
          </button>
        ),
      },
      {
        id: "parent",
        header: () => <span className="text-white">Parent</span>,
        cell: ({ row }) => row.original.parent?.title || "Main Category",
      },
      {
        id: "createdAt",
        header: () => <span className="text-white">Created At</span>,
        cell: ({ row }) =>
          row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleString()
            : "-",
      },
      {
        id: "updatedAt",
        header: () => <span className="text-white">Updated At</span>,
        cell: ({ row }) =>
          row.original.updatedAt
            ? new Date(row.original.updatedAt).toLocaleString()
            : "-",
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white p-2 rounded cursor-pointer"
              onClick={() => {
                setSelectedCategory(row.original);
                setTitle(row.original.title);
                setSlug(row.original.slug);
                setParent(row.original.parent?._id || "");
                setModalType("edit");
              }}
            >
              <Pencil size={14} />
            </button>

            <button
              className="bg-red-600 text-white p-2 rounded cursor-pointer"
              onClick={() => {
                setSelectedCategory(row.original);
                setModalType("delete");
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ),
      },
    ],
    [categories]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { columnVisibility, sorting, pagination },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ================= CREATE / UPDATE ================= */
  const submitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      alert("Title and Slug are required!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("slug", slug.trim());
      formData.append("parent", parent || "");

      const url =
        modalType === "create"
          ? "/api/category"
          : `/api/category/${selectedCategory?._id}`;
      const method = modalType === "create" ? "POST" : "PATCH";

      const res = await fetch(url, { method, body: formData });

      if (res.ok) {
        setModalType(null);
        setSelectedCategory(null);
        setTitle("");
        setSlug("");
        setParent("");
        fetchCategories();
      } else if (res.status === 409) {
        alert("Slug already exists!");
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Submit category error:", err);
      alert("Something went wrong!");
    }
  };

  /* ================= DELETE ================= */
  const deleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      const res = await fetch(`/api/category/${selectedCategory._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setModalType(null);
        setSelectedCategory(null);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed!");
      }
    } catch (err) {
      console.error("Delete category error:", err);
      alert("Delete failed!");
    }
  };

  return (
    <div className="p-4 bg-amber-100 min-h-screen rounded-2xl">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Categories</h1>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="border px-4 py-2 rounded cursor-pointer flex gap-2 bg-red-500 text-amber-50"
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => {
              setModalType("create");
              setSelectedCategory(null);
              setTitle("");
              setSlug("");
              setParent("");
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer flex gap-2"
          >
            <Plus size={16} /> New
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="w-full mb-3 p-2 border rounded bg-white"
        placeholder="Search category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* COLUMN TOGGLE */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {table
          .getAllLeafColumns()
          .filter((c) => c.getCanHide())
          .map((column) => (
            <button
              key={column.id}
              onClick={() => column.toggleVisibility()}
              className="border px-2 py-1 rounded text-sm cursor-pointer flex items-center gap-1 bg-amber-600 text-amber-100"
            >
              {column.getIsVisible() ? <Eye size={14} /> : <EyeOff size={14} />}
              {column.id}
            </button>
          ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-purple-600">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="p-3 text-left">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id} className="border-b">
                {r.getVisibleCells().map((c) => (
                  <td key={c.id} className="p-3">
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <select
          value={pagination.pageSize}
          onChange={(e) =>
            setPagination({
              ...pagination,
              pageSize: Number(e.target.value),
              pageIndex: 0,
            })
          }
          className="border p-1 rounded bg-teal-800 text-amber-50 "
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border px-3 py-1 rounded disabled:opacity-50 cursor-pointer bg-lime-700"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border px-3 py-1 rounded disabled:opacity-50 cursor-pointer bg-amber-700"
          >
            Next
          </button>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {(modalType === "create" || modalType === "edit") && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={submitCategory}
            className="bg-white p-6 w-[400px] rounded space-y-3"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full"
              placeholder="Title"
            />
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border p-2 w-full"
              placeholder="Slug"
            />
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="border p-2 w-full cursor-pointer"
            >
              <option value="">Main Category</option>
              {categories
                .filter((c) => c._id !== selectedCategory?._id)
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="border px-4 py-1 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button className="bg-purple-600 text-white px-4 py-1 rounded">
                {modalType === "create" ? "Create" : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE MODAL */}
      {modalType === "delete" && selectedCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[380px] rounded space-y-4">
            <h2 className="text-lg font-semibold text-red-600">
              Delete Category
            </h2>
            <p>
              Are you sure you want to delete <b>{selectedCategory.title}</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalType(null)}
                className="border px-4 py-1 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteCategory}
                className="bg-red-600 text-white px-4 py-1 rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
