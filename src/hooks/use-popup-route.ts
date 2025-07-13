import { useStorage } from "./use-storage";

export function usePopupRoute() {
  const [route, setRoute] = useStorage<string>("route", "/")

  function navigate(path: string) {
    setRoute(path)
  }

  return { route, navigate }
}