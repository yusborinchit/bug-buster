import { useRoute } from "~/hooks/use-route";

interface Route {
  path: string;
  component: React.ComponentType;
}

interface Props {
  routes: Route[];
}

export default function Router({ routes }: Props) {
  const { route: currentRoute } = useRoute();

  const exactMatch = routes.find((r) => r.path === currentRoute);
  if (exactMatch) {
    const Component = exactMatch.component;
    return <Component />;
  }

  for (const route of routes) {
    if (currentRoute.startsWith(route.path)) {
      const Component = route.component;
      return <Component />;
    }
  }

  return <>Route not Found</>;
}
