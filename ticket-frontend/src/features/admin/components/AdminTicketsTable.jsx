import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

const AdminUsersTable = ({ users, loading, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>User Details</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8">
              Loading users...
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-10 text-slate-500">
              No users found.
            </TableCell>
          </TableRow>
        ) : (
          users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-mono text-xs">
                #{u.id}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${u.username}`}
                    />
                    <AvatarFallback>
                      {u.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="font-semibold">
                      {u.username}
                    </div>
                    <div className="text-xs text-slate-500">
                      {u.email}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    u.roles?.includes("ADMIN")
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }
                >
                  {u.roles?.join(", ")}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-600"
                  onClick={() => onDelete(u.id)}
                >
                  <UserX size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AdminUsersTable;
