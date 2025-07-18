import PopupContainer from "../containers/popup-container";
import CreateSessionForm from "../forms/create-session-form";
import SessionList from "../lists/session-list";

export default function HomePopup() {
  return (
    <PopupContainer>
      <section className="flex flex-col gap-6">
        <header className="flex flex-col">
          <p className="text-center">Welcome to Bug Buster!</p>
          <h2 className="text-center text-3xl font-black underline decoration-red-600 decoration-4">
            Manage Sessions
          </h2>
        </header>
        <SessionList />
        <CreateSessionForm />
      </section>
    </PopupContainer>
  );
}
