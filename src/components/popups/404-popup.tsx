import { useRoute } from "~/hooks/use-route";
import PopupContainer from "../containers/popup-container";

export default function NotFoundPopup() {
  const { navigate } = useRoute();

  function handleGoToHome() {
    navigate("/home");
  }

  return (
    <PopupContainer>
      <button
        onClick={handleGoToHome}
        className="hover:cursor-pointer hover:underline">
        Go Back
      </button>
      <h2 className="text-center text-3xl font-black underline decoration-red-600 decoration-4">
        404 Not Found
      </h2>
    </PopupContainer>
  );
}
