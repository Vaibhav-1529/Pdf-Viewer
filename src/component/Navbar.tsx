"use client";

import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignupButton } from "./modals/SIgnupButton";
import { SigninButton } from "./modals/SigninButton";
import { useAuth } from "@/context/AuthProvider";
import graphqlClient from "@/services/GraphQlClient/gqlclient";
import { LOGOUT_USER } from "@/services/gql/queries";

export function Navbar() {
  const isMobile = useIsMobile();
  const { User, setUser } = useAuth();

  const handleSignOut = async () => {
    try {
      const user = await graphqlClient.request(LOGOUT_USER);
      if (user) setUser(null);
      localStorage.removeItem("Active_user");
      window.location.href = "/";
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <header className="w-full border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">

        <NavigationMenu viewport={isMobile}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          {User ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition">
                  <AvatarImage src={User?.avatar || "https://github.com/shadcn.png"} alt={User?.name} />
                  <AvatarFallback>{User?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full block">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="w-full block">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2 sm:gap-3">
              <SigninButton />
              <SignupButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
