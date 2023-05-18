import Link from "next/link";
import Image from "next/image";
import styles from "./navbar.module.scss";
import SearchBar from "../../../../app/components/elements/Search";
import IsAuth from "./IsAuth";

interface LinkProps {
  name: string;
  href: string;
  target?: string;
}

const routes = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Docs", href: "/docs" },
  { name: "Users", href: "/users" },
  { name: "Lab", href: "/lab" },
];

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_content}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              width={100}
              height={100}
              src={"/next.svg"}
              alt="brand logo"
            />
          </Link>
        </div>
        <ul className={styles.links}>
          {routes.map(({ name, href }: LinkProps) => (
            <li key={href}>
              <Link href={href}>{name}</Link>
            </li>
          ))}
          {/* <SearchBar /> */}
          <IsAuth />
        </ul>
      </div>
    </nav>
  );
}
