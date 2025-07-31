import { useRoute } from "~/hooks/use-route";

interface Route {
  path: string;
  component: React.ComponentType;
}

interface Props {
  routes: Route[];
}

export default function Router({ routes }: Props) {
  const { route: path } = useRoute();

  const exactMatch = routes.find((r) => r.path === path);
  if (exactMatch) {
    const Component = exactMatch.component;
    return <Component />;
  }

  for (const route of routes) {
    if (path.startsWith(route.path)) {
      const Component = route.component;
      return <Component />;
    }
  }

  return <>Route not Found</>;
}
