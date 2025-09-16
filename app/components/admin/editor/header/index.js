"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Input } from "@/app/components/ui/input";
import { useEditorStore } from "../../../../redux/UserStore";
import {
  ChevronDown,
  Download,
  Eye,
  Loader2,
  LogOut,
  Pencil,
  Save,
  SaveOff,
  Share,
  Star,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ExportModal from "../export";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import Image from "next/image";
import Link from "next/link";

function Header() {
  const {
    isEditing,
    setIsEditing,
    name,
    setName,
    canvas,
    saveStatus,
    markAsModified,
    designId,
    userDesigns,
    userSubscription,
    setShowPremiumModal,
  } = useEditorStore();
  // const { data: session } = useSession();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  useEffect(() => {
    if (!canvas) return;
    canvas.selection = isEditing;
    canvas.getObjects().forEach((obj) => {
      obj.selectable = isEditing;
      obj.evented = isEditing;
    });
  }, [isEditing]);

  useEffect(() => {
    if (!canvas || !designId) return;
    markAsModified();
  }, [name, canvas, designId]);

  const handleExport = () => {
    if (userDesigns?.length >= 5 && !userSubscription.isPremium) {
      toast.error("Please upgrade to premium!", {
        description: "You need to upgrade to premium to create more designs",
      });

      return;
    }
    setShowExportModal(true);
  };

  return (
    <header className="header-gradient header d-flex align-items-center justify-content-between px-4 h-14">
      <div className="d-flex align-items-center gap-2">
        {/* <Link href={"/"}>
          <Image
            src="https://static.canva.com/web/images/856bac30504ecac8dbd38dbee61de1f1.svg"
            alt="canva"
            width={70}
            height={30}
            priority
          />
        </Link> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild="true">
            <button className="header-button d-flex align-items-center text-white">
              <span>{isEditing ? "Editing" : "Viewing"}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Editing</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditing(false)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Viewing</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          className={ 
            "save position-relative d-flex align-items-center justify-content-center border-0 text-white"
          }
          title={saveStatus !== "Saving..." ? "Save" : saveStatus}
          disabled={saveStatus === "Saving..."}
        >
          {saveStatus === "Saving..." ? (
            <div className="relative flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
              <span className="sr-only">Saving...</span>
            </div>
          ) : (
            <Save
              className={cn("h-5 w-5", saveStatus === "Saved" && "text-white")}
            />
          )}

          {saveStatus === "Saving..." && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
        </button>
        <button
          onClick={handleExport}
          className="header-button ml-3 relative"
          title="Export"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 d-flex justify-content-center mw-100">
        <Input 
          className="search-input w-full text-white rounded-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="d-flex align-items-center gap-3">
        <button
          onClick={() => setShowPremiumModal(true)}
          className="upgrade-button d-flex align-items-center text-white rounded-3 border-0"
        >
          <Star className="mr-1 h-4 w-4 text-warning" />
          <span>
            {!userSubscription?.isPremium
              ? "Upgrade To Premium"
              : "Premium Member"}
          </span>
        </button>
        <DropdownMenu>
          {/* <DropdownMenuTrigger aschild="true" className="icon-btn border-0 bg-success">
            <div className="d-flex align-items-center gap-2 justify-content-center">
              <Avatar>
                <AvatarFallback>{"U"}</AvatarFallback>
                <AvatarImage src={"/placeholder-user.jpg"} />
              </Avatar>
            </div>
          </DropdownMenuTrigger> */}
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={handleLogout}
              className={"cursor-pointer"}
            >
              <LogOut className="mr-2 w-4 h-4" />
              <span className="font-bold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ExportModal isOpen={showExportModal} onClose={setShowExportModal} />
    </header>
  );
}

export default Header;
