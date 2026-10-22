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
  explorer: "https://github.com/qualletio/stellarium-explorer",
  explorerDownload: "https://github.com/qualletio/stellarium-explorer/releases/latest",
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
      { title: "What is Stellarium?", description: "Nodes, resources, and RequestScript", href: "/learn" },
      { title: "How it works", description: "One request, traced across nodes", href: "/#how-it-works" },
      { title: "Whitepaper", description: "The full protocol design", href: links.whitepaper, external: true },
      { title: "Documentation", description: "Guides and references for builders", href: links.docs, external: true },
      { title: "RequestScript", description: "The language Stellarium requests are written in", href: links.requestscriptSite, external: true },
    ],
  },
  {
    label: "Build",
    paths: ["/build", "/build/explorer"],
    items: [
      { title: "Run a node", description: "Install, configure, and start a node", href: "/build" },
      { title: "Prerequisites", description: "Node.js, Fastify, and RequestScript", href: "/build#prerequisites" },
      { title: "Register resources", description: "Host an API that the network can call", href: "/build#register" },
      { title: "Join a network", description: "Bootstrap from a peer and sync resources", href: "/build#join" },
      { title: "HTTP API", description: "The /v1 routes every node exposes", href: "/build#http-api" },
      { title: "Stellarium Explorer", description: "A desktop app for writing and running requests", href: "/build/explorer" },
    ],
  },
  {
    label: "AI",
    paths: ["/ai", "/ai/inference-functions"],
    items: [
      { title: "AI on Stellarium", description: "Call and host AI models on the network", href: "/ai" },
      { title: "Inference Functions", description: "Host AI models and charge per token", href: "/ai/inference-functions" },
    ],
  },
  {
    label: "Participate",
    paths: ["/community", "/join", "/sips", "/governance"],
    items: [
      { title: "Community", description: "Find us on Discord and GitHub", href: "/community" },
      { title: "How to Join", description: "Contribution areas and first steps", href: "/join" },
      { title: "SIPs", description: "Propose improvements to the network", href: "/sips" },
      { title: "Governance", description: "The governance team (forming)", href: "/governance" },
      { title: "Roadmap", description: "Planned and in-progress work", href: links.roadmap, external: true },
    ],
  },
];
