import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"

export function MainNav() {
  return (
    <NavigationMenu className="max-w-screen px-4 py-2 border-b">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md">
            Racks
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/logs" className="px-4 py-2 hover:bg-accent rounded-md">
            Transaction Logs
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}