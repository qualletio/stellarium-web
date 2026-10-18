export const links = {
  discord: "https://discord.gg/yDEBkaz6cB",
  github: "https://github.com/qualletio/stellarium-ts",
  whitepaper: "https://github.com/qualletio/SIPs/blob/main/WHITEPAPER.md",
  sipsRepo: "https://github.com/qualletio/SIPs",
  requestscript: "https://github.com/qualletio/requestscript-js",
  requestscriptSite: "https://requestscript-web-production.up.railway.app/",
  website: "https://github.com/qualletio/stellarium-web",
  docs: "https://docs.stellarium.sh",
  roadmap: "https://github.com/orgs/qualletio/projects/7/views/1",
  registry: "https://stellariumregistry.xyz/",
};

export type NavItem = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  soon?: boolean;
};

export type NavSection = {
  label: string;
  // Paths that should mark this tab as active.
  paths: string[];
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    label: "Learn",
    paths: ["/learn"],
    items: [
      { title: "What is Stellarium?", description: "The basics of the programmable API network", href: "/learn" },
      { title: "How it works", description: "See a request travel across the network", href: "/#how-it-works" },
      { title: "Whitepaper", description: "The full design, written down", href: links.whitepaper, external: true },
      { title: "Documentation", description: "Guides and references for builders", href: links.docs, external: true },
      { title: "RequestScript", description: "Stellarium queries are powered by RequestScript", href: links.requestscriptSite, external: true },
    ],
  },
  {
    label: "Build",
    paths: ["/build"],
    items: [
      { title: "Run a node", description: "Set up your own Stellarium node, step by step", href: "/build" },
      { title: "Prerequisites", description: "What you need installed before you start", href: "/build#prerequisites" },
      { title: "Register resources", description: "Host an API that the network can call", href: "/build#register" },
      { title: "Join a network", description: "Connect to peers and share resources", href: "/build#join" },
      { title: "HTTP API", description: "The routes every node exposes", href: "/build#http-api" },
    ],
  },
  {
    label: "Participate",
    paths: ["/community", "/join", "/sips", "/governance"],
    items: [
      { title: "Community", description: "Find us on Discord and GitHub", href: "/community" },
      { title: "How to Join", description: "All the ways you can help out", href: "/join" },
      { title: "SIPs", description: "Propose improvements to the network", href: "/sips" },
      { title: "Governance", description: "Help shape where Stellarium goes next", href: "/governance" },
      { title: "Roadmap", description: "See what we're working on and what's next", href: links.roadmap, external: true },
    ],
  },
];
